<template>
  <div class="space-y-6">

    <!-- HEADER BLOCK -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5 shrink-0">
      <div>
        <h1 class="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
          Platform commission Metrics & Rates Configuration
        </h1>
        <p class="text-xs text-slate-400">Configure corporate transaction fee levies, adjust commission parameters, and track platform revenue streams.</p>
      </div>

      <span class="px-2.5 py-1 bg-indigo-950 text-indigo-400 font-mono text-[9px] uppercase font-bold border border-indigo-900 rounded-md">
        Current Operational Rate: {{ commissionRate }}%
      </span>
    </div>

    <!-- MAIN GRID SECTION -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
      
      <!-- COLUMN 1: FORM TO MODIFY RATES -->
      <div class="md:col-span-4 bg-[#040817] p-6 border border-[#121c3b] rounded-2xl flex flex-col justify-between space-y-4">
        <div>
          <h2 class="text-sm font-bold font-mono text-slate-200 uppercase tracking-wide">Adjust commission Levy</h2>
          <p class="text-xs text-slate-400 mt-1">Levied automatically on all inbound sales collections from mobile wallets and card processing channels.</p>
        </div>

        <div class="space-y-4 font-mono text-xs">
          <div class="space-y-1.5">
            <label class="block text-slate-400 font-bold uppercase text-[9px]">Administrative Percentage Rate (%)</label>
            <div class="flex items-center space-x-2">
              <input 
                type="number" 
                step="0.1" 
                min="0.5" 
                max="10" 
                v-model="rateInput"
                class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none"
              />
              <span class="text-slate-400 font-bold">%</span>
            </div>
          </div>

          <button 
            @click="triggerRateUpdate"
            class="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold uppercase rounded-lg text-white transition text-center"
          >
            Apply Rate Adjustment
          </button>
        </div>

        <p class="text-[9px] text-slate-500 italic leading-snug">
          * rate changes operate dynamically across the billing engine pipelines. Changes are recorded immediately under administrative security logs.
        </p>
      </div>

      <!-- COLUMN 2: ANALYTICAL METRICS SHOWCASE -->
      <div class="md:col-span-8 space-y-4">
        <h2 class="text-sm font-bold font-mono text-slate-200 uppercase tracking-wide px-1">Comes Stream Metrics Summary</h2>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-4 bg-slate-900 border border-slate-850 rounded-xl space-y-1">
            <span class="text-[9px] text-slate-500 font-mono uppercase block font-bold">Total Platform Revenue</span>
            <span class="text-xl font-bold font-mono text-emerald-400 block">{{ formatCurrency(totalFees) }}</span>
            <p class="text-[10px] text-slate-400 font-sans leading-none pt-1">Derived from {{ transactionsCount }} finished settlements.</p>
          </div>
          <div class="p-4 bg-slate-900 border border-slate-850 rounded-xl space-y-1">
            <span class="text-[9px] text-slate-500 font-mono uppercase block font-bold">Estimated Monthly Yield</span>
            <span class="text-xl font-bold font-mono text-slate-200 block">{{ formatCurrency(totalFees * 0.18) }} / month</span>
            <p class="text-[10px] text-slate-400 font-sans leading-none pt-1">Forecasting dry and agricultural harvesting cycles.</p>
          </div>
        </div>

        <!-- RECENT INDIVIDUAL LEVY CHARGES -->
        <div class="p-5 bg-slate-900/40 border border-slate-900 rounded-2xl space-y-3">
          <h3 class="text-xs font-bold font-mono uppercase text-slate-300">Detailed Transaction Levy Log</h3>
          
          <div class="space-y-2 max-h-[220px] overflow-y-auto">
            <div 
              v-for="tx in recentInboundTx.slice(0, 8)" 
              :key="tx.id"
              class="p-2.5 bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-between text-xs font-mono text-slate-400"
            >
              <div>
                <span class="text-slate-300 uppercase leading-none block font-semibold">{{ tx.recipientInstitution || 'Alpha Retail Group' }}</span>
                <span class="text-[9px] text-slate-600 block pt-0.5">Tx Ref: {{ tx.reference }}</span>
              </div>
              <div class="text-right">
                <span class="text-amber-500 font-bold block">+{{ formatCurrency(tx.fee || 1200) }} XAF fee</span>
                <span class="text-[9px] text-slate-500 block pt-0.5">On amount: {{ formatCurrency(tx.amount) }}</span>
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
import { commissionRate, writeAuditLog } from '@/utils/admin_db.js';
import { transactions } from '@/utils/seed_data.js';
import { useToast } from 'vue-toastification';

const toast = useToast();
const rateInput = ref(commissionRate.value);

const recentInboundTx = computed(() => {
  return transactions.filter(t => t.type === 'Collection');
});

const transactionsCount = computed(() => recentInboundTx.value.length);
const totalFees = computed(() => {
  return recentInboundTx.value.reduce((acc, t) => acc + (t.fee || 0), 0);
});

function formatCurrency(v) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(v);
}

function triggerRateUpdate() {
  if (rateInput.value < 0.5 || rateInput.value > 10) {
    toast.error('levy fee rate must remain within 0.5% - 10.0% limits.');
    return;
  }

  const oldRate = commissionRate.value;
  commissionRate.value = rateInput.value;

  writeAuditLog(
    'COMMISSION_RATE_ADJUSTED',
    `Dynamic system levies adjusted from ${oldRate}% to ${commissionRate.value}%. Affecting all new transaction queues.`,
    'Treasury Policy desk'
  );

  toast.success(`Platform commission levy updated to ${commissionRate.value}%!`);
}
</script>
