<template>
  <div class="space-y-6 font-mono select-none text-slate-100 animate-slide-up">
    
    <!-- HEADER -->
    <div class="bg-[#14141E] border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
      <div class="absolute -right-16 -top-16 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
      <h1 class="text-sm font-bold uppercase text-slate-200 tracking-wider">Retours Marchandises &amp; Émissions d'Avoir</h1>
      <p class="text-[9.5px] text-slate-500 font-mono">Réintégration physique des produits en stocks, mise à jour des batches et production de bons d'avoir clients.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- TRANSACTION SEARCH AND AUDIT PANEL -->
      <div class="lg:col-span-1 bg-[#14141E] border border-slate-800 p-5 rounded-2xl space-y-4">
        <h3 class="text-xs font-bold text-slate-300 uppercase tracking-wider pb-2 border-b border-slate-800 flex items-center gap-1.5">
          <MagnifyingGlassIcon class="w-4 h-4 text-[#C8A96E]" />
          <span>Rechercher la Facture d'Origine</span>
        </h3>

        <div class="space-y-3">
          <div>
            <label class="block text-[9.5px] text-slate-500 mb-1.5 uppercase font-bold">Identifiant Facture (ID TX)</label>
            <div class="flex gap-2">
              <input 
                type="text" 
                v-model="searchTxId"
                placeholder="Ex. TX-20260618-001..."
                class="flex-1 bg-slate-950 border border-slate-850 px-3 py-2 text-xs text-emerald-400 uppercase rounded-xl focus:outline-none focus:border-slate-700"
              />
              <button 
                @click="searchTransaction"
                class="px-4 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Chercher
              </button>
            </div>
          </div>

          <div class="text-[9.5px] text-slate-500 leading-relaxed pt-2">
            Renseignez l'identifiant exact écrit sur le bas du ticket client pour charger l'historique d'achat et autoriser le remboursement.
          </div>
        </div>

        <!-- LIST RECENT ELIGIBLE TX FOR QUICK TEST -->
        <div class="space-y-2.5 pt-4 border-t border-slate-800">
          <span class="text-[9px] text-slate-400 font-bold block uppercase tracking-wide">Transactions Récentes :</span>
          <div class="space-y-1.5 text-[8.5px]">
            <div 
              v-for="tx in eligibleTransactions" 
              :key="tx.id"
              @click="quickSelectTx(tx)"
              class="p-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded-xl cursor-pointer flex justify-between items-center transition-colors"
            >
              <div>
                <strong class="text-slate-350 block">{{ tx.id }}</strong>
                <span class="text-slate-500 block mt-0.5">{{ tx.customerName }}</span>
              </div>
              <span class="text-emerald-450 font-mono font-bold">{{ Math.round(tx.totalTTC).toLocaleString() }} ₣</span>
            </div>
          </div>
        </div>

      </div>

      <!-- MAIN WORKSPACE: SELECTED TRANSACTION ITEMS & QUANTITIES -->
      <div class="lg:col-span-2 space-y-6">
        
        <div class="bg-[#14141E] border border-slate-800 p-5 rounded-2xl space-y-4">
          <div class="flex justify-between items-center pb-2 border-b border-slate-800">
            <h3 class="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <ReceiptRefundIcon class="w-4 h-4 text-emerald-500" />
              <span>Bordereau De Retour Courant</span>
            </h3>
            <span 
              v-if="selectedTx" 
              class="text-[9.5px] font-mono text-indigo-400 bg-indigo-950/30 px-2 py-0.5 rounded-lg border border-indigo-900/60"
            >
              FACTURE VALIDÉE : {{ selectedTx.id }}
            </span>
          </div>

          <!-- If no transaction selected -->
          <div v-if="!selectedTx" class="text-center py-20 text-slate-500 space-y-3">
            <div class="flex justify-center">
              <span class="p-4 bg-slate-950 text-slate-700 rounded-full border border-slate-850">
                <ReceiptRefundIcon class="w-8 h-8" />
              </span>
            </div>
            <p class="text-xs">Aucune facture chargée. Saisissez un identifiant ou sélectionnez-en un à gauche.</p>
          </div>

          <!-- Transaction details loaded -->
          <div v-else class="space-y-6">
            
            <!-- TX METADATA STRIP -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-850 text-[9px] text-slate-400">
              <div>
                <span>Acheteur :</span>
                <strong class="text-slate-200 block mt-0.5">{{ selectedTx.customerName }}</strong>
              </div>
              <div>
                <span>Date d'achat :</span>
                <strong class="text-slate-200 block mt-0.5">{{ new Date(selectedTx.date).toLocaleDateString() }}</strong>
              </div>
              <div>
                <span>Total Facturé :</span>
                <strong class="text-[#C8A96E] block font-bold mt-0.5">{{ Math.round(selectedTx.totalTTC).toLocaleString() }} FCFA</strong>
              </div>
              <div>
                <span>Déstockage :</span>
                <strong class="text-emerald-450 block font-bold mt-0.5">FIFO Restock</strong>
              </div>
            </div>

            <!-- PURCHASED ARTICLES TABLE -->
            <div class="overflow-x-auto space-y-2">
              <span class="text-[9.5px] text-emerald-400 font-bold block uppercase tracking-wider">Sélection des Éléments à Rembourser :</span>
              <table class="w-full text-left text-xs text-slate-350">
                <thead>
                  <tr class="border-b border-slate-800 text-slate-500 text-[9px] uppercase font-bold">
                    <th class="pb-2">Désignation</th>
                    <th class="pb-2 text-center font-semibold">Acheté</th>
                    <th class="pb-2 text-center text-red-400">Retourné</th>
                    <th class="pb-2 text-center font-bold">Qté à Retourner</th>
                    <th class="pb-2 text-right">Montant Remb. (TVAC)</th>
                    <th class="pb-2 text-center"></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-900 text-[10px]">
                  <tr v-for="item in selectedTx.items" :key="item.productId" class="hover:bg-slate-950/40 transition-colors">
                    <td class="py-3.5 pr-2">
                      <span class="font-bold text-slate-200 block">{{ item.name }}</span>
                      <span class="text-[8px] text-slate-500 uppercase font-mono">SKU: {{ item.sku }}</span>
                    </td>
                    <td class="py-3.5 text-center font-bold text-slate-350">
                      {{ item.qty }}
                    </td>
                    <td class="py-3.5 text-center text-red-500 font-bold">
                      {{ getAlreadyReturnedQty(item.productId) }}
                    </td>
                    <td class="py-3.5 text-center">
                      <div class="inline-flex items-center space-x-1.5 bg-slate-950 p-1 rounded-lg border border-slate-850">
                        <input 
                          type="number" 
                          v-model.number="returnQtys[item.productId]"
                          min="0"
                          :max="item.qty - getAlreadyReturnedQty(item.productId)"
                          class="w-12 bg-transparent text-center text-emerald-400 font-bold focus:outline-none"
                        />
                        <span class="text-[8px] text-slate-600 pr-1">/{{ item.qty - getAlreadyReturnedQty(item.productId) }}</span>
                      </div>
                    </td>
                    <td class="py-3.5 text-right font-bold text-[#C8A96E]">
                      {{ Math.round(calculateItemRefundValue(item)).toLocaleString() }} ₣
                    </td>
                    <td class="py-3.5 text-center">
                      <button 
                        @click="executeItemReturn(item)"
                        :disabled="!returnQtys[item.productId] || returnQtys[item.productId] <= 0"
                        class="px-3 py-1.5 bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 font-mono font-bold text-[9px] rounded-lg disabled:opacity-30 disabled:pointer-events-none transition-colors uppercase"
                      >
                        Valider Retour
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- REFUND MODE SELECTOR -->
            <div class="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-3 text-xs">
              <span class="text-[9.5px] uppercase text-slate-400 font-bold block">Sélection de la Contrepartie de Remboursement</span>
              
              <div class="flex flex-col sm:flex-row gap-4">
                <label class="flex items-center space-x-2.5 cursor-pointer">
                  <input type="radio" v-model="refundMethod" value="voucher" class="text-indigo-500 border-slate-800 bg-slate-900 focus:ring-0" />
                  <span class="text-slate-300 font-bold text-[10.5px] flex items-center gap-1">
                    <TicketIcon class="w-4 h-4 text-indigo-400" />
                    <span>Émission Bon d'Avoir (Crédit Client)</span>
                  </span>
                </label>
                
                <label class="flex items-center space-x-2.5 cursor-pointer">
                  <input type="radio" v-model="refundMethod" value="cash" class="text-emerald-500 border-slate-800 bg-slate-900 focus:ring-0" />
                  <span class="text-slate-300 font-bold text-[10.5px] flex items-center gap-1">
                    <BanknotesIcon class="w-4 h-4 text-emerald-400" />
                    <span>Restitution Espèces directes (Drawer Out)</span>
                  </span>
                </label>
              </div>

              <p class="text-[9px] text-slate-500 font-sans leading-normal">
                L'émission d'un bon d'avoir générera automatiquement un code alphanumérique unique. Ce code pourra être rentré en paiement lors de ses prochains passages en caisse.
              </p>
            </div>

          </div>
        </div>

        <!-- GENERATED AVOIRS LIST REPORT -->
        <div class="bg-[#14141E] border border-slate-800 p-5 rounded-2xl space-y-3">
          <h3 class="text-xs font-bold text-[#C8A96E] uppercase tracking-wider font-mono">Bons d'Avoirs Émis Saisie Caisse</h3>
          
          <div v-if="vouchers.length === 0" class="text-center py-6 text-[9.5px] text-slate-600">
            Aucun avoir n'a été créé ou historisé sur ce terminal.
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[9.5px] font-mono">
            <div 
              v-for="vc in vouchers" 
              :key="vc.code"
              class="p-3 bg-slate-950 border rounded-xl flex justify-between items-center transition-opacity"
              :class="vc.status === 'unused' ? 'border-indigo-900/60 bg-indigo-950/5' : 'border-slate-850 opacity-50 bg-slate-900/40'"
            >
              <div>
                <strong class="text-indigo-400 font-bold block">{{ vc.code }}</strong>
                <span class="text-slate-350 block mt-0.5">Montant : {{ vc.amount.toLocaleString() }} FCFA</span>
                <span class="text-[8px] text-slate-500 block mt-0.5">Créé le : {{ vc.date }}</span>
              </div>

              <div class="text-right">
                <span 
                  v-if="vc.status === 'unused'"
                  class="bg-indigo-950 text-indigo-400 font-bold text-[8.5px] border border-indigo-900/60 px-1.5 py-0.5 rounded-lg uppercase tracking-wide inline-block"
                >
                  Actif
                </span>
                <span 
                  v-else
                  class="bg-slate-900 text-slate-500 text-[8.5px] px-1.5 py-0.5 rounded-lg inline-block"
                >
                  Consommé
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
import { 
  MagnifyingGlassIcon, 
  ReceiptRefundIcon, 
  TicketIcon, 
  BanknotesIcon 
} from '@heroicons/vue/24/outline';

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

<style scoped>
@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
  animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
