<template>
  <div class="space-y-6 font-mono select-none">
    
    <!-- HEADER -->
    <div class="bg-zinc-950 border border-emerald-950 p-5 rounded-xl flex justify-between items-center">
      <div>
        <h1 class="text-sm font-bold uppercase text-emerald-100 tracking-wider">Rapports Financiers &amp; Validation de Clôture</h1>
        <p class="text-[9.5px] text-zinc-500">Rapprochement de tiroir-caisse, bilan des règlements (X) et fermeture définitive (clôture Z).</p>
      </div>

      <span 
        class="text-[10px] font-mono font-bold px-2 py-0.5 rounded border"
        :class="session.isOpen ? 'bg-emerald-950 text-[#10b980] border-emerald-900/60' : 'bg-red-950 text-red-405 border-red-900/60'"
      >
        TIROIR : {{ session.isOpen ? 'VOUCHERS ACTIVE' : 'LOCKED/FERMÉ' }}
      </span>
    </div>

    <!-- MAIN GRID CARDS -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- SHIFT LEDGER SUMMARY TABLE -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- CURRENT SESSION AUDIT -->
        <div class="p-5 bg-[#020503] border border-emerald-955/60 rounded-xl space-y-4">
          <h3 class="text-xs font-bold text-emerald-500 uppercase tracking-widest pb-1 border-b border-emerald-955/65">
            Bilan Synthétique de Session Courante (Rapport X)
          </h3>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold font-mono">
            <div class="p-3 bg-zinc-950 rounded border border-zinc-900">
              <span class="text-[8.5px] text-zinc-550 block uppercase">Ouverture de caisse</span>
              <strong class="text-zinc-300 font-mono text-[12px] block mt-0.5">
                {{ session.openingBalance.toLocaleString() }} F
              </strong>
            </div>

            <div class="p-3 bg-zinc-950 rounded border border-zinc-900">
              <span class="text-[8.5px] text-zinc-550 block uppercase">Ventes Brutes Session</span>
              <strong class="text-[#10b980] font-mono text-[12px] block mt-0.5">
                {{ Math.round(sessionSalesTotal).toLocaleString() }} F
              </strong>
            </div>

            <div class="p-3 bg-zinc-950 rounded border border-zinc-900">
              <span class="text-[8.5px] text-zinc-550 block uppercase">Total Commis (HT net)</span>
              <strong class="text-zinc-300 font-mono text-[12px] block mt-0.5">
                {{ Math.round(sessionSalesHT).toLocaleString() }} F
              </strong>
            </div>

            <div class="p-3 bg-zinc-950 rounded border border-zinc-904">
              <span class="text-[8.5px] text-[#2c5b46] block uppercase">Magasin affilié</span>
              <strong class="text-zinc-400 font-sans text-[10px] block truncate mt-0.5 uppercase">
                {{ currentStore?.name?.split('-')[0] || 'Non Affecté' }}
              </strong>
            </div>
          </div>

          <!-- BY METHOD BREAKDOWN -->
          <div class="space-y-2.5 pt-2 font-mono">
            <span class="text-[9.5px] text-zinc-500 uppercase font-black block">Modulations d'entrée de Trésor :</span>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              
              <!-- Cash expected inside drawer -->
              <div class="p-3 bg-black border border-emerald-950/30 rounded flex justify-between items-center">
                <div>
                  <span class="text-[8px] text-zinc-600 block uppercase font-bold">💳 Trésor Espèces attendu (HT+TVA)</span>
                  <span class="text-zinc-400 text-[11px] block mt-0.5">Fonds + Flux ventes - retours</span>
                </div>
                <strong class="text-[#10b981] font-mono text-sm leading-none">
                  {{ Math.round(expectedCashInDrawer).toLocaleString() }} FCFA
                </strong>
              </div>

              <!-- Card payments -->
              <div class="p-3 bg-black border border-emerald-955/35 rounded flex justify-between items-center">
                <div>
                  <span class="text-[8px] text-zinc-650 block uppercase font-bold">💳 Transactions Carte TPE</span>
                  <span class="text-zinc-400 text-[11px] block mt-0.5">Inscrits GIMAC / Visa / MC</span>
                </div>
                <strong class="text-indigo-405 font-mono text-sm leading-none">
                  {{ Math.round(methodTotals.card).toLocaleString() }} FCFA
                </strong>
              </div>

              <!-- Mobile Money payments -->
              <div class="p-3 bg-black border border-emerald-955/35 rounded flex justify-between items-center">
                <div>
                  <span class="text-[8px] text-zinc-650 block uppercase font-bold">📱 Orange-MTN Mobile Money</span>
                  <span class="text-zinc-400 text-[11px] block mt-0.5">Enveloppes MoMo réglées</span>
                </div>
                <strong class="text-amber-450 font-mono text-sm leading-none">
                  {{ Math.round(methodTotals.momo).toLocaleString() }} FCFA
                </strong>
              </div>

              <!-- Vouchers claimed -->
              <div class="p-3 bg-black border border-emerald-955/35 rounded flex justify-between items-center">
                <div>
                  <span class="text-[8px] text-zinc-650 block uppercase font-bold">🎫 Bons d'Avoirs Consommés</span>
                  <span class="text-zinc-400 text-[11px] block mt-0.5">Déductions codes POS</span>
                </div>
                <strong class="text-zinc-350 font-mono text-sm leading-none">
                  {{ Math.round(methodTotals.voucher).toLocaleString() }} FCFA
                </strong>
              </div>

            </div>
          </div>

          <!-- SHIFT LOGS SUMMARY -->
          <div class="pt-3 border-t border-emerald-950/40 text-[9.5px] text-zinc-600 space-y-1">
            <p>Heure ouverture de session : <strong>{{ formatDate(session.openedAt) }}</strong></p>
            <p v-if="!session.isOpen">Fermeture scellée le : <strong>{{ formatDate(session.closedAt) }}</strong></p>
          </div>
        </div>

        <!-- HISTORIC Z CLOSING BLOCKS -->
        <div class="p-5 bg-zinc-950 border border-emerald-950 rounded-xl space-y-4">
          <h3 class="text-xs font-bold text-emerald-450 uppercase tracking-widest font-mono">
            Rapports Z Archivés (Audit Historique)
          </h3>

          <div v-if="historicClosedSessions.length === 0" class="text-center py-6 text-zinc-600 text-xs">
            Aucun historique de clôture définitive archivé pour le moment.
          </div>

          <div v-else class="space-y-3 font-mono text-[9px] text-zinc-400">
            <div 
              v-for="rep in historicClosedSessions" 
              :key="rep.closedAt" 
              class="p-3 bg-black border border-zinc-900 rounded-lg flex justify-between items-start"
            >
              <div class="space-y-1">
                <span class="text-emerald-400 font-bold block uppercase">RAPPORT Z #{{ rep.serial }}</span>
                <span class="text-zinc-550 block">Date Clôture: {{ formatDate(rep.closedAt) }}</span>
                <span class="text-zinc-550 block">Magasin: {{ rep.storeName }}</span>
              </div>
              <div class="text-right font-mono space-y-1">
                <span class="text-emerald-450 font-bold block">CA : {{ rep.salesTotal.toLocaleString() }} FCFA</span>
                <span class="text-zinc-601 font-semibold block">Ecart Tiroir: {{ rep.discrepancy.toLocaleString() }} FCFA</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- RIGHT SIDE: CLOSING ACTION & TIROIR DISCREPANCY -->
      <div class="space-y-6">
        
        <!-- TIROIR CASH AUDITING -->
        <div class="bg-zinc-950 border border-emerald-950 p-5 rounded-xl space-y-4">
          <h3 class="text-xs font-bold text-[#10b980] uppercase tracking-wider font-mono">Contrôle Physique de Tiroir</h3>
          <p class="text-[9.5px] text-zinc-500 font-sans leading-relaxed">
            Pour valider le rapport de caisse, compter physiquement les billets et pièces présents dans votre tiroir et renseigner la somme ci-dessous.
          </p>

          <form @submit.prevent="submitZClosing" class="space-y-4 text-xs font-mono">
            <div>
              <label class="block text-[9.5px] text-zinc-500 mb-1 uppercase font-bold">Argent Liquide Réel (FCFA)</label>
              <input 
                type="number" 
                min="0"
                v-model.number="actualCashCount"
                placeholder="Compter billets et inscrire..."
                class="w-full bg-black border border-emerald-950 rounded px-2.5 py-1.5 focus:outline-none text-emerald-400 font-bold text-center"
                step="100"
                :disabled="!session.isOpen"
              />
            </div>

            <!-- Ecart representation -->
            <div 
              class="p-3 border rounded text-[10px]" 
              :class="cashDifference === 0 ? 'bg-[#042411]/25 border-emerald-900/60 text-emerald-450' : 'bg-red-950/20 border-red-900/40 text-red-400'"
              v-show="actualCashCount > 0"
            >
              <div class="flex justify-between font-bold">
                <span>Écart de Caisse :</span>
                <span>{{ cashDifference > 0 ? '+' : '' }}{{ cashDifference.toLocaleString() }} FCFA</span>
              </div>
              <span class="text-[8px] text-zinc-550 block mt-1" v-if="cashDifference === 0">
                ✓ Solde parfait. Conforme aux calculs cyber-comptables de Douala.
              </span>
              <span class="text-[8.5px] block mt-1 leading-tight font-sans" v-else>
                Attention ! Il y a {{ cashDifference > 0 ? 'un excédent' : 'un déficit' }} de caisse de {{ Math.abs(cashDifference).toLocaleString() }} FCFA.
              </span>
            </div>

            <!-- Z CLOSING TRIGGER -->
            <div class="pt-2">
              <button 
                type="submit"
                v-if="session.isOpen"
                class="w-full py-4.5 bg-red-950/40 hover:bg-red-950 border border-red-900/70 text-red-500 text-xs font-bold uppercase tracking-widest rounded-xl transition duration-150"
              >
                Clôturer la Caisse définitivement (Rapport Z)
              </button>
              <div v-else class="p-3 bg-zinc-900/50 text-center border rounded text-[9.5px] text-zinc-600">
                ⚠️ Session Close. Tiroir Consigné.
              </div>
            </div>
          </form>
        </div>

        <div class="bg-[#05140f]/20 border border-emerald-950 p-4 rounded-xl space-y-2">
          <h4 class="text-[9.5px] uppercase text-emerald-400 font-bold">FIFO &amp; Audits Réglementaires</h4>
          <p class="text-[8.5px] text-zinc-500 leading-relaxed font-sans">
            La signature comptable est rattachée à la blockchain locale. Tous les historiques de retraits par lots FIFO et les commissions de vente sont transmis à la plateforme centrale.
          </p>
        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';

import { session, transactions, currentStore, closeRegister } from '@/composables/usePOS.js';

const toast = useToast();

const actualCashCount = ref(0);
const historicClosedSessions = ref([]);

// Pull historic closing logs from localStorage if any
onMounted(() => {
  const savedHistory = localStorage.getItem('pos_z_closing_archive_v1');
  if (savedHistory) {
    historicClosedSessions.value = JSON.parse(savedHistory);
  }
});

// Calculate current session transactions
const currentSessionTxList = computed(() => {
  if (!session.value.openedAt) return [];
  const start = new Date(session.value.openedAt).getTime();
  
  return transactions.value.filter(tx => {
    const txTime = new Date(tx.date).getTime();
    return txTime >= start && tx.storeId === session.value.storeId;
  });
});

const sessionSalesTotal = computed(() => {
  return currentSessionTxList.value.reduce((sum, tx) => sum + tx.totalTTC, 0);
});

const sessionSalesHT = computed(() => {
  return currentSessionTxList.value.reduce((sum, tx) => sum + tx.subtotalHT, 0);
});

// Segment payment methods
const methodTotals = computed(() => {
  let cashSum = 0;
  let cardSum = 0;
  let momoSum = 0;
  let voucherSum = 0;

  currentSessionTxList.value.forEach(tx => {
    tx.payments.forEach(p => {
      if (p.method === 'cash') cashSum += p.amount;
      else if (p.method === 'card') cardSum += p.amount;
      else if (p.method === 'momo') momoSum += p.amount;
      else if (p.method === 'voucher') voucherSum += p.amount;
    });
    // cash has to subtract any change returned!
    cashSum -= (tx.change || 0);
  });

  return {
    cash: cashSum,
    card: cardSum,
    momo: momoSum,
    voucher: voucherSum
  };
});

// Returns / direct refund cash deduction
const refundedCashSales = computed(() => {
  let refundSum = 0;
  currentSessionTxList.value.forEach(tx => {
    // If returnedItems exists and we had direct cash return, we pro-rate
    if (tx.returnedItems && tx.returnedItems.length > 0) {
      // For this simple simulation, we look at actual returned log
      tx.returnedItems.forEach(r => {
        const item = tx.items.find(i => i.productId === r.productId);
        if (item) {
          // If return was cash direct, deduct from drawer cash
          refundSum += (item.netPrice * 1.1925 * r.qty);
        }
      });
    }
  });
  return refundSum;
});

// Expected drawer money
const expectedCashInDrawer = computed(() => {
  const opening = session.value.openingBalance || 0;
  const cashGain = methodTotals.value.cash;
  const refunds = refundedCashSales.value;
  return Math.max(0, opening + cashGain - refunds);
});

const cashDifference = computed(() => {
  if (actualCashCount.value === 0) return 0;
  return actualCashCount.value - expectedCashInDrawer.value;
});

function formatDate(isoStr) {
  if (!isoStr) return '---';
  const d = new Date(isoStr);
  return d.toLocaleString('fr-FR');
}

function submitZClosing() {
  if (!session.value.isOpen) {
    toast.error("La caisse est déjà fermée.");
    return;
  }

  if (confirm("Valider l'arrêté de compte et générer le Rapport Z de clôture définitive ? Cette opération verrouille le tiroir-caisse.")) {
    // Audit log
    const reportSerial = 'Z-' + new Date().toISOString().slice(2, 10).replace(/-/g, '') + '-' + Math.floor(10 + Math.random() * 90);
    const newReport = {
      serial: reportSerial,
      closedAt: new Date().toISOString(),
      storeId: session.value.storeId,
      storeName: currentStore.value ? currentStore.value.name : 'Terminal Alpha',
      salesTotal: sessionSalesTotal.value,
      expectedCash: expectedCashInDrawer.value,
      actualCash: actualCashCount.value,
      discrepancy: cashDifference.value,
      cashier: session.value.cashierName
    };

    historicClosedSessions.value.unshift(newReport);
    localStorage.setItem('pos_z_closing_archive_v1', JSON.stringify(historicClosedSessions.value));

    closeRegister();
    actualCashCount.value = 0;
  }
}
</script>
