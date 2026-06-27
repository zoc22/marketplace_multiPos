<template>
  <div class="space-y-6">

    <!-- HEADER BLOCK -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5 shrink-0">
      <div>
        <h1 class="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
          <BanknotesIcon class="w-5 h-5 text-indigo-400" />
          <span>Platform Financial Transactions Ledger</span>
        </h1>
        <p class="text-xs text-slate-405">Complete immutable record of escrow collections, supplier bank payouts, and payment fees.</p>
      </div>

      <button 
        @click="simulateCSVExport"
        class="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-xs font-mono font-bold uppercase rounded-lg text-white transition flex items-center space-x-2 shrink-0"
      >
        <ArrowDownTrayIcon class="w-4 h-4" />
        <span>Export Ledger (CSV)</span>
      </button>
    </div>

    <!-- LEDGER STATS -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs">
      <div class="p-4 bg-[#14141E] border border-slate-800 rounded-xl text-center">
        <span class="text-slate-500 uppercase tracking-widest block">Gross Total Volume</span>
        <span class="text-lg font-bold text-slate-100 mt-1 block">{{ formatCurrency(grossVolume) }}</span>
      </div>
      <div class="p-4 bg-[#14141E] border border-slate-800 rounded-xl text-center">
        <span class="text-slate-500 uppercase tracking-widest block">Collection Inflows</span>
        <span class="text-lg font-bold text-emerald-450 mt-1 block">{{ formatCurrency(inflows) }}</span>
      </div>
      <div class="p-4 bg-[#14141E] border border-slate-800 rounded-xl text-center">
        <span class="text-slate-500 uppercase tracking-widest block">Payout Outflows</span>
        <span class="text-lg font-bold text-slate-300 mt-1 block">{{ formatCurrency(outflows) }}</span>
      </div>
      <div class="p-4 bg-[#14141E] border border-slate-800 rounded-xl text-center">
        <span class="text-slate-500 uppercase tracking-widest block">Commission Collected</span>
        <span class="text-lg font-bold text-indigo-400 mt-1 block">{{ formatCurrency(commissionsCount) }}</span>
      </div>
    </div>

    <!-- FILTERS AND QUERY CONTROLS -->
    <div class="flex flex-col sm:flex-row items-center gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-850">
      <div class="relative flex-1 w-full">
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="Lookup transactional references, recipient organizations..."
          class="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 pl-8 text-xs text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 font-mono transition"
        />
        <span class="absolute left-3 top-3.5 text-slate-500">
          <MagnifyingGlassIcon class="w-4 h-4 text-slate-500" />
        </span>
      </div>

      <select 
        v-model="selectedType"
        class="bg-slate-955 text-xs text-slate-400 rounded-lg p-2.5 font-mono border border-slate-800 focus:outline-none focus:border-indigo-500 w-full sm:w-48"
      >
        <option value="">All Transactions</option>
        <option value="Collection">Inbound Collection</option>
        <option value="Payout_Transfer">Outbound Payout</option>
      </select>
    </div>

    <!-- TRANSACTIONS LIST -->
    <div class="bg-[#14141E] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs font-sans">
          <thead>
            <tr class="text-[10px] font-mono text-slate-400 uppercase border-b border-slate-800 bg-slate-900/60">
              <th class="p-3 pl-5">TX Reference</th>
              <th class="p-3">Event Date</th>
              <th class="p-3">Party Institution</th>
              <th class="p-3">Payment Method</th>
              <th class="p-3 text-right">Fee (XAF)</th>
              <th class="p-3 text-right pr-5">Amount (XAF)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-850">
            <tr 
              v-for="(tx, idx) in paginatedTx" 
              :key="tx.id"
              class="hover:bg-slate-900/30 text-slate-300 transition"
              :class="idx % 2 === 0 ? 'bg-[#14141E]' : 'bg-[#181824]'"
            >
              <td class="p-3 pl-5">
                <div class="font-mono text-[10.5px] text-indigo-450 font-semibold truncate max-w-[120px]">{{ tx.reference }}</div>
                <div class="text-[9px] text-slate-500 font-mono">{{ tx.orderReference || 'BANK_AUTOCLEAR' }}</div>
              </td>
              <td class="p-3 text-slate-400 font-mono">{{ formatDateTime(tx.processedAt) }}</td>
              <td class="p-3 font-semibold text-slate-200">
                {{ tx.recipientInstitution || 'Central Holding' }}
              </td>
              <td class="p-3 font-mono text-slate-400">
                {{ tx.paymentMethod }}
              </td>
              <td class="p-3 text-right font-mono text-slate-400">
                {{ formatCurrency(tx.fee || 0) }}
              </td>
              <td class="p-3 text-right pr-5 font-mono font-bold" :class="tx.amount > 0 ? 'text-emerald-450' : 'text-slate-350'">
                {{ tx.amount > 0 ? '+' : '' }}{{ formatCurrency(tx.amount) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- PAGINATION FOOTER -->
    <div class="flex items-center justify-between text-xs font-mono text-slate-500 py-4 border-t border-slate-900 ml-1 shrink-0">
      <div class="flex items-center space-x-2">
        <button 
          @click="page = Math.max(1, page - 1)" 
          class="px-2.5 py-1 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded text-[10px] transition"
          :disabled="page === 1"
        >
          &larr; Prev
        </button>
        <span>Page {{ page }} of {{ totalPages }}</span>
        <button 
          @click="page = Math.min(totalPages, page + 1)" 
          class="px-2.5 py-1 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded text-[10px] transition"
          :disabled="page === totalPages"
        >
          Next &rarr;
        </button>
      </div>
      <span>Listed transactions filtered: {{ filteredTx.length }}</span>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { transactions } from '@/utils/seed_data.js';
import { useToast } from 'vue-toastification';
import { 
  BanknotesIcon, 
  ArrowDownTrayIcon, 
  MagnifyingGlassIcon 
} from '@heroicons/vue/24/outline';

const toast = useToast();

const searchQuery = ref('');
const selectedType = ref('');
const page = ref(1);
const limit = 20;

const inflows = computed(() => {
  return transactions.reduce((acc, t) => t.amount > 0 && t.type === 'Collection' ? acc + t.amount : acc, 0);
});

const outflows = computed(() => {
  return Math.abs(transactions.reduce((acc, t) => t.amount < 0 ? acc + t.amount : acc, 0));
});

const grossVolume = computed(() => inflows.value + outflows.value);

const commissionsCount = computed(() => {
  return transactions.reduce((acc, t) => t.type === 'Collection' ? acc + (t.fee || 0) : acc, 0);
});

const filteredTx = computed(() => {
  return transactions.filter(t => {
    if (selectedType.value && t.type !== selectedType.value) return false;
    
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      const matchRef = t.reference.toLowerCase().includes(q);
      const matchInst = t.recipientInstitution?.toLowerCase().includes(q);
      const matchMethod = t.paymentMethod?.toLowerCase().includes(q);
      return matchRef || matchInst || matchMethod;
    }
    return true;
  });
});

const totalPages = computed(() => {
  return Math.ceil(filteredTx.value.length / limit) || 1;
});

const paginatedTx = computed(() => {
  const startIdx = (page.value - 1) * limit;
  return filteredTx.value.slice(startIdx, startIdx + limit);
});

function formatCurrency(v) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(v);
}

function formatDateTime(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return d.toISOString().replace('T', ' ').slice(0, 19);
}

function simulateCSVExport() {
  toast.success('Compiling transaction ledger blocks... CSV downloaded! (Simulated)');
}
</script>
