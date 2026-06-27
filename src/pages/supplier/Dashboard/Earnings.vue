<template>
  <div class="space-y-6">
    <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <BanknotesIcon class="h-6 w-6 text-indigo-400" />
          <span>B2B Financial Balance &amp; Earnings ledger</span>
        </h1>
        <p class="text-xs text-slate-400 mt-1">Audit active accounts, held Escrows from clients, and bank clearance states.</p>
      </div>

      <router-link 
        to="/supplier/finance/withdrawals"
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold rounded-xl shadow-lg hover:shadow-indigo-500/20 transition uppercase"
      >
        Request Cashout Withdrawal (Retraits) &rarr;
      </router-link>
    </div>

    <!-- BALANCE OVERVIEW HUDS -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
      
      <!-- PRIMARY BALANCE -->
      <div class="p-5 bg-[#090e24] border border-slate-800 rounded-2xl relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300 hover:shadow-lg">
        <div class="flex justify-between items-start">
          <span class="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Cleared liquid balance</span>
          <span class="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/40 border border-emerald-900/30 px-1.5 py-0.5 rounded flex items-center">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1"></span>
            +12.4%
          </span>
        </div>
        <div class="text-2xl font-bold font-mono text-emerald-400 mt-3">
          {{ formatCurrency(availableBalance) }} FCFA
        </div>
        <p class="text-[10px] text-slate-500 mt-1 font-mono">Available for immediate withdrawal (No hold)</p>
        <div class="mt-4 pt-3 border-t border-slate-905 flex justify-between text-[11px] font-mono text-slate-400">
          <span>Escrow status:</span>
          <span class="text-slate-200">0 locked</span>
        </div>
        <div class="absolute right-3 bottom-3 text-indigo-500/10 group-hover:scale-110 transition duration-300">
          <BanknotesIcon class="h-10 w-10 text-emerald-500" />
        </div>
      </div>

      <!-- INCOMING ESCROWS (HELD FROM CLIENTS) -->
      <div class="p-5 bg-[#090e24] border border-slate-800 rounded-2xl relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300 hover:shadow-lg">
        <div class="flex justify-between items-start">
          <span class="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Unverified Held Escrow</span>
          <span class="text-[10px] text-indigo-400 font-mono font-bold bg-indigo-950/40 border border-indigo-900/30 px-1.5 py-0.5 rounded flex items-center">
            <span class="h-1.5 w-1.5 rounded-full bg-indigo-400 mr-1"></span>
            Pending Release
          </span>
        </div>
        <div class="text-2xl font-bold font-mono text-indigo-400 mt-3">
          {{ formatCurrency(heldEscrows) }} FCFA
        </div>
        <p class="text-[10px] text-slate-500 mt-1 font-mono">Locked in global platform smart escrow agreements</p>
        <div class="mt-4 pt-3 border-t border-slate-905 flex justify-between text-[11px] font-mono text-slate-400">
          <span>Release cycle:</span>
          <span class="text-indigo-400">Upon buyer delivery validation</span>
        </div>
        <div class="absolute right-3 bottom-3 text-indigo-500/10 group-hover:scale-110 transition duration-300">
          <LockClosedIcon class="h-10 w-10 text-indigo-500" />
        </div>
      </div>

      <!-- WITHDRAWN TO DATE -->
      <div class="p-5 bg-[#090e24] border border-slate-800 rounded-2xl relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300 hover:shadow-lg">
        <div class="flex justify-between items-start">
          <span class="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Cumulative Withdrawn Funds</span>
          <span class="text-[10px] text-slate-550 font-mono font-bold bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded flex items-center">
            Last Month
          </span>
        </div>
        <div class="text-2xl font-bold font-mono text-slate-100 mt-3">
          16,500,000 FCFA
        </div>
        <p class="text-[10px] text-slate-500 mt-1 font-mono">Successfully Cashed-Out to local Mobile Money/Accounts</p>
        <div class="mt-4 pt-3 border-t border-slate-905 flex justify-between text-[11px] font-mono text-slate-400">
          <span>Last withdrawal:</span>
          <span class="text-slate-300">LT-OM-283401 (12 days ago)</span>
        </div>
        <div class="absolute right-3 bottom-3 text-indigo-500/10 group-hover:scale-110 transition duration-300">
          <ArrowPathIcon class="h-10 w-10 text-slate-500" />
        </div>
      </div>

    </div>

    <!-- DETAILED AUDIT GRAPH -->
    <div class="p-5 bg-[#080d22] border border-slate-900 rounded-2xl space-y-4">
      <div class="flex justify-between items-center border-b border-indigo-950 pb-2">
        <h3 class="text-xs font-mono font-bold uppercase text-slate-200 tracking-wider">Simulated payout schedule structure</h3>
        <span class="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-indigo-400 font-mono">B2B SETTLEMENT RULE: T+2 clearance</span>
      </div>

      <div class="text-xs text-slate-300 leading-relaxed font-sans space-y-2">
        <p>
          Funds from buyer dispatches undergo standard verification hold parameters. Automatic platform commission (commissions de courtage) is deducted transparently at a rate of <strong>3.5% per completed order contract</strong>.
        </p>
        <ul class="list-disc pl-4 space-y-1 font-mono text-[11px] text-slate-450">
          <li>Gross invoice amounts: 100% deposited to local multi-tenant ledger immediately.</li>
          <li>Commission holding pool: Deducted only matching success dispatch triggers.</li>
          <li>KYC tax requirements check: Zero VAT options matching international export rules.</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { withdrawals } from '@/utils/supplier_db';
import { BanknotesIcon, LockClosedIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';

const availableBalance = computed(() => {
  return 89254000;
});

const heldEscrows = computed(() => {
  return 15450000;
});

function formatCurrency(val) {
  return new Intl.NumberFormat('fr-FR').format(val);
}
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}
</style>
