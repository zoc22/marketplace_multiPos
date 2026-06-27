<template>
  <div class="space-y-6 font-mono select-none">
    
    <!-- HEADER -->
    <div class="bg-zinc-950 border border-emerald-950 p-5 rounded-xl">
      <h1 class="text-sm font-bold uppercase text-emerald-100 tracking-wider">Retours Marchandises &amp; Émissions d'Avoir</h1>
      <p class="text-[9.5px] text-zinc-500">Réintégration physique des produits en stocks, mise à jour des batches et production de bons d'avoir clients.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- TRANSACTION SEARCH AND AUDIT PANEL -->
      <div class="lg:col-span-1 bg-zinc-950 border border-emerald-950 p-5 rounded-xl space-y-4">
        <h3 class="text-xs font-bold text-emerald-450 uppercase tracking-wider pb-1 border-b border-emerald-950/60">
          Rechercher la Facture d'Origine
        </h3>

        <div class="space-y-3">
          <div>
            <label class="block text-[9.5px] text-zinc-500 mb-1 uppercase font-bold">Identifiant Facture (ID TX)</label>
            <div class="flex gap-2">
              <input 
                type="text" 
                v-model="searchTxId"
                placeholder="Ex. TX-20260618-001..."
                class="flex-1 bg-black border border-emerald-950 px-2.5 py-1.5 text-xs text-emerald-400 uppercase rounded focus:outline-none"
              />
              <button 
                @click="searchTransaction"
                class="px-3 bg-emerald-950 border border-emerald-900 text-emerald-400 hover:text-white rounded text-xs font-bold transition"
              >
                Chercher
              </button>
            </div>
          </div>

          <div class="text-[9.5px] text-zinc-650 leading-relaxed pt-2">
            Renseignez l'identifiant exact écrit sur le bas du ticket client pour charger l'historique d'achat et autoriser le remboursement.
          </div>
        </div>

        <!-- LIST RECENT ELIGIBLE TX FOR QUICK TEST -->
        <div class="space-y-2 pt-4 border-t border-emerald-950/60">
          <span class="text-[9px] text-zinc-500 font-bold block uppercase">Transactions Récentes :</span>
          <div class="space-y-1 text-[8.5px]">
            <div 
              v-for="tx in eligibleTransactions" 
              :key="tx.id"
              @click="quickSelectTx(tx)"
              class="p-2 bg-black hover:bg-zinc-900 border border-zinc-900 rounded cursor-pointer flex justify-between items-center"
            >
              <div>
                <strong class="text-zinc-400 block">{{ tx.id }}</strong>
                <span class="text-zinc-600 block">{{ tx.customerName }}</span>
              </div>
              <span class="text-emerald-500 font-mono font-bold">{{ Math.round(tx.totalTTC).toLocaleString() }} ₣</span>
            </div>
          </div>
        </div>

      </div>

      <!-- MAIN WORKSPACE: SELECTED TRANSACTION ITEMS & QUANTITIES -->
      <div class="lg:col-span-2 space-y-6">
        
        <div class="bg-[#020503] border border-emerald-950 p-5 rounded-xl space-y-4">
          <div class="flex justify-between items-center pb-2 border-b border-emerald-950/65">
            <h3 class="text-xs font-bold text-emerald-500 uppercase tracking-widest font-mono">
              Bordereau De Retour Courant
            </h3>
            <span 
              v-if="selectedTx" 
              class="text-[9.5px] font-mono text-indigo-400 bg-indigo-950/30 px-1.5 py-0.5 rounded border border-indigo-900"
            >
              FACTURE VALIDÉE : {{ selectedTx.id }}
            </span>
          </div>

          <!-- If no transaction selected -->
          <div v-if="!selectedTx" class="text-center py-16 text-zinc-600">
            <span class="text-2xl block mb-2 opacity-50">📤</span>
            <p class="text-xs">Aucune facture chargée. Saisissez un identifiant ou sélectionnez-en un à gauche.</p>
          </div>

          <!-- Transaction details loaded -->
          <div v-else class="space-y-6">
            
            <!-- TX METADATA STRIP -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-950 p-3 rounded-lg border border-zinc-909 text-[9px] text-zinc-400">
              <div>
                <span>Acheteur :</span>
                <strong class="text-zinc-200 block">{{ selectedTx.customerName }}</strong>
              </div>
              <div>
                <span>Date d'achat :</span>
                <strong class="text-zinc-200 block">{{ new Date(selectedTx.date).toLocaleDateString() }}</strong>
              </div>
              <div>
                <span>Total Facturé :</span>
                <strong class="text-emerald-450 block font-bold">{{ Math.round(selectedTx.totalTTC).toLocaleString() }} FCFA</strong>
              </div>
              <div>
                <span>Déstockage :</span>
                <strong class="text-[#10b980] block font-bold">FIFO Restock</strong>
              </div>
            </div>

            <!-- PURCHASED ARTICLES TABLE -->
            <div class="overflow-x-auto space-y-2">
              <span class="text-[9.5px] text-[#2c5b46] font-bold block uppercase tracking-wider">Sélection des Éléments à Rembourser :</span>
              <table class="w-full text-left text-xs text-zinc-300">
                <thead>
                  <tr class="border-b border-zinc-900 text-zinc-550 text-[9px] uppercase font-bold">
                    <th class="pb-1">Désignation</th>
                    <th class="pb-1 text-center font-semibold">Acheté</th>
                    <th class="pb-1 text-center text-red-400">Retourné</th>
                    <th class="pb-1 text-center font-bold">Qté à Retourner</th>
                    <th class="pb-1 text-right">Montant Remb. (TVAC)</th>
                    <th class="pb-1 text-center"></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-zinc-900 text-[10px]">
                  <tr v-for="item in selectedTx.items" :key="item.productId" class="hover:bg-zinc-950/40">
                    <td class="py-3">
                      <span class="font-bold text-zinc-200 block">{{ item.name }}</span>
                      <span class="text-[8px] text-zinc-500 uppercase">SKU: {{ item.sku }}</span>
                    </td>
                    <td class="py-3 text-center font-bold">
                      {{ item.qty }}
                    </td>
                    <td class="py-3 text-center text-red-500 font-bold">
                      {{ getAlreadyReturnedQty(item.productId) }}
                    </td>
                    <td class="py-3 text-center">
                      <div class="inline-flex items-center space-x-1">
                        <input 
                          type="number" 
                          v-model.number="returnQtys[item.productId]"
                          min="0"
                          :max="item.qty - getAlreadyReturnedQty(item.productId)"
                          class="w-12 bg-black border border-emerald-950 rounded text-center text-emerald-400 font-bold p-0.5 focus:outline-none"
                        />
                        <span class="text-[8px] text-zinc-600 block">/{{ item.qty - getAlreadyReturnedQty(item.productId) }}</span>
                      </div>
                    </td>
                    <td class="py-3 text-right font-bold text-emerald-450">
                      {{ Math.round(calculateItemRefundValue(item)).toLocaleString() }} ₣
                    </td>
                    <td class="py-3 text-center">
                      <button 
                        @click="executeItemReturn(item)"
                        :disabled="!returnQtys[item.productId] || returnQtys[item.productId] <= 0"
                        class="px-2.5 py-1 bg-emerald-950 hover:bg-[#062413] border border-emerald-990 font-mono font-bold text-[9px] text-[#10b980] rounded disabled:opacity-30 disabled:pointer-events-none transition uppercase"
                      >
                        Valider Retour
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- REFUND MODE SELECTOR -->
            <div class="p-4 bg-zinc-950 border border-zinc-900 rounded-xl space-y-3 text-xs">
              <span class="text-[9.5px] uppercase text-zinc-400 font-bold block">Sélection de la Contrepartie de Remboursement</span>
              
              <div class="flex gap-4">
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" v-model="refundMethod" value="voucher" class="text-indigo-400 border-zinc-900 bg-black focus:ring-0" />
                  <span class="text-zinc-300 font-bold text-[10.5px]">🎫 Émission Bon d'Avoir (Crédit Client)</span>
                </label>
                
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" v-model="refundMethod" value="cash" class="text-emerald-500 border-zinc-900 bg-black focus:ring-0" />
                  <span class="text-zinc-300 font-bold text-[10.5px]">💵 Restitution Espèces directes (Drawer Out)</span>
                </label>
              </div>

              <p class="text-[9px] text-zinc-600 font-sans">
                L'émission d'un bon d'avoir générera automatiquement un code alphanumérique unique. Ce code pourra être rentré en paiement lors de ses prochains passages en caisse.
              </p>
            </div>

          </div>
        </div>

        <!-- GENERATED AVOIRS LIST REPORT -->
        <div class="bg-zinc-950 border border-emerald-950 p-5 rounded-xl space-y-3">
          <h3 class="text-xs font-bold text-emerald-450 uppercase tracking-wider font-mono">Bons d'Avoirs Émis Saisie Caisse</h3>
          
          <div v-if="vouchers.length === 0" class="text-center py-6 text-[9.5px] text-zinc-650">
            Aucun avoir n'a été créé ou historisé sur ce terminal.
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[9.5px] font-mono">
            <div 
              v-for="vc in vouchers" 
              :key="vc.code"
              class="p-2.5 bg-black border rounded-lg flex justify-between items-center"
              :class="vc.status === 'unused' ? 'border-[#1e2e60] bg-indigo-950/10' : 'border-zinc-900 opacity-60 bg-zinc-950'"
            >
              <div>
                <strong class="text-indigo-300 font-bold block">{{ vc.code }}</strong>
                <span class="text-zinc-605 block">Montant : {{ vc.amount.toLocaleString() }} FCFA</span>
                <span class="text-[8px] text-zinc-500 block">Créé le : {{ vc.date }}</span>
              </div>

              <div class="text-right">
                <span 
                  v-if="vc.status === 'unused'"
                  class="bg-indigo-950 text-indigo-400 font-bold text-[8.5px] border border-indigo-900 px-1 rounded uppercase tracking-wide inline-block"
                >
                  Actif (Non réclame)
                </span>
                <span 
                  v-else
                  class="bg-zinc-900 text-zinc-500 text-[8.5px] px-1 rounded inline-block"
                >
                  Consommé Code Used
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'vue-toastification';

import { transactions, vouchers, processReturn } from '@/composables/usePOS.js';

const toast = useToast();

const searchTxId = ref('');
const selectedTx = ref(null);
const returnQtys = ref({});
const refundMethod = ref('voucher');

// Lists past receipts
const eligibleTransactions = computed(() => {
  return transactions.value;
});

function searchTransaction() {
  const q = searchTxId.value.trim().toUpperCase();
  if (!q) {
     toast.error("Veuillez saisir un identifiant de transaction.");
     return;
  }

  const mat = transactions.value.find(t => t.id.toUpperCase() === q || t.id.split('-').slice(-1)[0] === q);
  
  if (mat) {
    selectedTx.value = mat;
    returnQtys.value = {};
    mat.items.forEach(item => {
      returnQtys.value[item.productId] = 0;
    });
    toast.success(`Facture ${mat.id} chargée.`);
  } else {
    toast.error("Aucune vente enregistrée sous cet identifiant.");
  }
}

function quickSelectTx(tx) {
  searchTxId.value = tx.id;
  searchTransaction();
}

function getAlreadyReturnedQty(productId) {
  if (!selectedTx.value || !selectedTx.value.returnedItems) return 0;
  const match = selectedTx.value.returnedItems.find(r => r.productId === productId);
  return match ? match.qty : 0;
}

function calculateItemRefundValue(item) {
  const qty = returnQtys.value[item.productId] || 0;
  // refund includes pro-rated net price + standard Cameroon VAT (19.25%)
  return item.netPrice * 1.1925 * qty;
}

function executeItemReturn(item) {
  const qty = returnQtys.value[item.productId] || 0;
  if (qty <= 0) {
    toast.error("Veuillez renseigner une quantité à rembourser positive.");
    return;
  }

  const success = processReturn(selectedTx.value.id, item.productId, qty, refundMethod.value);
  
  if (success) {
    // Reset return field Qty
    returnQtys.value[item.productId] = 0;
    // reload/sync
    searchTransaction();
  }
}
</script>
