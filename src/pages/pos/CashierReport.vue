<template>
  <div class="space-y-6 font-mono select-none text-slate-100 animate-slide-up">
    
    <!-- HEADER -->
    <div class="bg-[#14141E] border border-slate-800 p-5 rounded-2xl flex justify-between items-center relative overflow-hidden">
      <div class="absolute -right-16 -top-16 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
      <div>
        <h1 class="text-sm font-bold uppercase text-slate-200 tracking-wider">Rapports Financiers &amp; Validation de Clôture</h1>
        <p class="text-[9.5px] text-slate-500 font-mono">Rapprochement de tiroir-caisse, bilan des règlements (X) et fermeture définitive (clôture Z).</p>
      </div>

      <span 
        class="text-[10px] font-mono font-bold px-3 py-1 rounded-xl border flex items-center gap-1.5"
        :class="session.isOpen ? 'bg-emerald-950/60 text-emerald-450 border-emerald-900/60' : 'bg-red-950/60 text-red-400 border-red-900/60'"
      >
        <span class="w-2 h-2 rounded-full" :class="session.isOpen ? 'bg-emerald-450 animate-pulse' : 'bg-red-400'"></span>
        <span>TIROIR : {{ session.isOpen ? 'ACTIF / OUVERT' : 'LOCKED / FERMÉ' }}</span>
      </span>
    </div>

    <!-- MAIN GRID CARDS -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- SHIFT LEDGER SUMMARY TABLE -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- CURRENT SESSION AUDIT -->
        <div class="p-5 bg-[#14141E] border border-slate-800 rounded-2xl space-y-4">
          <h3 class="text-xs font-bold text-slate-350 uppercase tracking-widest pb-2 border-b border-slate-800 flex items-center gap-1.5">
            <DocumentChartBarIcon class="w-4 h-4 text-[#C8A96E]" />
            <span>Bilan Synthétique de Session Courante (Rapport X)</span>
          </h3>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold font-mono">
            <div class="p-3.5 bg-slate-950 rounded-xl border border-slate-850">
              <span class="text-[8.5px] text-slate-500 block uppercase">Ouverture de caisse</span>
              <strong class="text-slate-300 font-mono text-[13px] block mt-1">
                {{ session.openingBalance.toLocaleString() }} ₣
              </strong>
            </div>

            <div class="p-3.5 bg-slate-950 rounded-xl border border-slate-850">
              <span class="text-[8.5px] text-slate-500 block uppercase">Ventes Brutes Session</span>
              <strong class="text-emerald-455 font-mono text-[13px] block mt-1">
                {{ Math.round(sessionSalesTotal).toLocaleString() }} ₣
              </strong>
            </div>

            <div class="p-3.5 bg-slate-950 rounded-xl border border-slate-850">
              <span class="text-[8.5px] text-slate-500 block uppercase">Total Commis (HT net)</span>
              <strong class="text-slate-300 font-mono text-[13px] block mt-1">
                {{ Math.round(sessionSalesHT).toLocaleString() }} ₣
              </strong>
            </div>

            <div class="p-3.5 bg-slate-950 rounded-xl border border-slate-850">
              <span class="text-[8.5px] text-slate-500 block uppercase">Magasin affilié</span>
              <strong class="text-[#C8A96E] font-sans text-[10px] block truncate mt-1.5 uppercase">
                {{ currentStore?.name?.split('-')[0] || 'Non Affecté' }}
              </strong>
            </div>
          </div>

          <!-- BY METHOD BREAKDOWN -->
          <div class="space-y-2.5 pt-2 font-mono">
            <span class="text-[9.5px] text-slate-400 uppercase font-black block tracking-wide">Modulations d'entrée de Trésor :</span>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              
              <!-- Cash expected inside drawer -->
              <div class="p-3.5 bg-slate-950 border border-slate-850 rounded-xl flex justify-between items-center hover:border-slate-800 transition-colors">
                <div>
                  <span class="text-[8px] text-slate-500 block uppercase font-bold flex items-center gap-1">
                    <BanknotesIcon class="w-3.5 h-3.5 text-emerald-450" />
                    <span>Trésor Espèces attendu (HT+TVA)</span>
                  </span>
                  <span class="text-slate-500 text-[10px] block mt-1">Fonds + Flux ventes - retours</span>
                </div>
                <strong class="text-emerald-455 font-mono text-sm leading-none">
                  {{ Math.round(expectedCashInDrawer).toLocaleString() }} FCFA
                </strong>
              </div>

              <!-- Card payments -->
              <div class="p-3.5 bg-slate-950 border border-slate-850 rounded-xl flex justify-between items-center hover:border-slate-800 transition-colors">
                <div>
                  <span class="text-[8px] text-slate-500 block uppercase font-bold flex items-center gap-1">
                    <CreditCardIcon class="w-3.5 h-3.5 text-indigo-400" />
                    <span>Transactions Carte TPE</span>
                  </span>
                  <span class="text-slate-500 text-[10px] block mt-1">Inscrits GIMAC / Visa / MC</span>
                </div>
                <strong class="text-indigo-400 font-mono text-sm leading-none">
                  {{ Math.round(methodTotals.card).toLocaleString() }} FCFA
                </strong>
              </div>

              <!-- Mobile Money payments -->
              <div class="p-3.5 bg-slate-950 border border-slate-850 rounded-xl flex justify-between items-center hover:border-slate-800 transition-colors">
                <div>
                  <span class="text-[8px] text-slate-500 block uppercase font-bold flex items-center gap-1">
                    <DevicePhoneMobileIcon class="w-3.5 h-3.5 text-amber-500" />
                    <span>Orange-MTN Mobile Money</span>
                  </span>
                  <span class="text-slate-500 text-[10px] block mt-1">Enveloppes MoMo réglées</span>
                </div>
                <strong class="text-amber-500 font-mono text-sm leading-none">
                  {{ Math.round(methodTotals.momo).toLocaleString() }} FCFA
                </strong>
              </div>

              <!-- Vouchers claimed -->
              <div class="p-3.5 bg-slate-950 border border-slate-850 rounded-xl flex justify-between items-center hover:border-slate-800 transition-colors">
                <div>
                  <span class="text-[8px] text-slate-500 block uppercase font-bold flex items-center gap-1">
                    <TicketIcon class="w-3.5 h-3.5 text-slate-400" />
                    <span>Bons d'Avoirs Consommés</span>
                  </span>
                  <span class="text-slate-500 text-[10px] block mt-1">Déductions codes POS</span>
                </div>
                <strong class="text-slate-350 font-mono text-sm leading-none">
                  {{ Math.round(methodTotals.voucher).toLocaleString() }} FCFA
                </strong>
              </div>

            </div>
          </div>

          <!-- SHIFT LOGS SUMMARY -->
          <div class="pt-3 border-t border-slate-800 text-[9.5px] text-slate-500 space-y-1">
            <p>Heure ouverture de session : <strong>{{ formatDate(session.openedAt) }}</strong></p>
            <p v-if="!session.isOpen">Fermeture scellée le : <strong>{{ formatDate(session.closedAt) }}</strong></p>
          </div>
        </div>

        <!-- HISTORIC Z CLOSING BLOCKS -->
        <div class="p-5 bg-[#14141E] border border-slate-800 rounded-2xl space-y-4">
          <h3 class="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">
            Rapports Z Archivés (Audit Historique)
          </h3>

          <div v-if="historicClosedSessions.length === 0" class="text-center py-8 text-slate-600 text-xs">
            Aucun historique de clôture définitive archivé pour le moment.
          </div>

          <div class="space-y-3 font-mono text-[9px] text-slate-400">
            <div 
              v-for="rep in historicClosedSessions" 
              :key="rep.closedAt" 
              class="p-3.5 bg-slate-950 border border-slate-855 rounded-xl flex justify-between items-start"
            >
              <div class="space-y-1">
                <span class="text-emerald-400 font-bold block uppercase">RAPPORT Z #{{ rep.serial }}</span>
                <span class="text-slate-500 block">Date Clôture: {{ formatDate(rep.closedAt) }}</span>
                <span class="text-slate-500 block">Magasin: {{ rep.storeName }}</span>
              </div>
              <div class="text-right font-mono space-y-1">
                <span class="text-emerald-450 font-bold block">CA : {{ rep.salesTotal.toLocaleString() }} FCFA</span>
                <span class="text-slate-400 font-semibold block">Ecart Tiroir: {{ rep.discrepancy.toLocaleString() }} FCFA</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- RIGHT SIDE: CLOSING ACTION & TIROIR DISCREPANCY -->
      <div class="space-y-6">
        
        <!-- TIROIR CASH AUDITING -->
        <div class="bg-[#14141E] border border-slate-800 p-5 rounded-2xl space-y-4">
          <h3 class="text-xs font-bold text-[#C8A96E] uppercase tracking-wider font-mono">Contrôle Physique de Tiroir</h3>
          <p class="text-[9.5px] text-slate-500 font-sans leading-relaxed">
            Pour valider le rapport de caisse, compter physiquement les billets et pièces présents dans votre tiroir et renseigner la somme ci-dessous.
          </p>

          <form @submit.prevent="submitZClosing" class="space-y-4 text-xs font-mono">
            <div>
              <label class="block text-[9.5px] text-slate-550 mb-1.5 uppercase font-bold">Argent Liquide Réel (FCFA)</label>
              <input 
                type="number" 
                min="0"
                v-model.number="actualCashCount"
                placeholder="Compter billets et inscrire..."
                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-bold text-center focus:outline-none focus:border-slate-700"
                step="100"
                :disabled="!session.isOpen"
              />
            </div>

            <!-- Ecart representation -->
            <div 
              class="p-3 border rounded-xl text-[10px]" 
              :class="cashDifference === 0 ? 'bg-[#2D7D6E]/10 border-[#2D7D6E]/40 text-[#2D7D6E]' : 'bg-red-950/20 border-red-900/40 text-red-400'"
              v-show="actualCashCount > 0"
            >
              <div class="flex justify-between font-bold items-center">
                <span>Écart de Caisse :</span>
                <span class="flex items-center gap-1">
                  <ExclamationTriangleIcon class="w-3.5 h-3.5" v-if="cashDifference !== 0" />
                  <ShieldCheckIcon class="w-3.5 h-3.5" v-else />
                  <span>{{ cashDifference > 0 ? '+' : '' }}{{ cashDifference.toLocaleString() }} FCFA</span>
                </span>
              </div>
              <span class="text-[8.5px] text-slate-500 block mt-1 leading-normal font-sans" v-if="cashDifference === 0">
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
                class="w-full py-4 bg-red-950/20 hover:bg-red-900 text-red-500 hover:text-white border border-red-900/40 text-xs font-bold uppercase tracking-widest rounded-xl transition duration-150"
              >
                Clôturer la Caisse définitivement (Rapport Z)
              </button>
              <div v-else class="p-4 bg-slate-900/40 text-center border border-slate-800 rounded-xl text-[9.5px] text-slate-550 font-bold">
                ⚠️ Session Close. Tiroir Consigné.
              </div>
            </div>
          </form>
        </div>

        <div class="bg-[#2D7D6E]/5 border border-slate-800 p-5 rounded-2xl space-y-2.5">
          <h4 class="text-[9.5px] uppercase text-emerald-450 font-bold">FIFO &amp; Audits Réglementaires</h4>
          <p class="text-[8.5px] text-slate-500 leading-relaxed font-sans">
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
import { 
  DocumentChartBarIcon, 
  BanknotesIcon, 
  CreditCardIcon, 
  DevicePhoneMobileIcon, 
  TicketIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline';

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

<style scoped>
@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
  animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
