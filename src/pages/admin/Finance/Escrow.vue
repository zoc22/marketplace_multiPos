<template>
  <div class="space-y-6">

    <!-- HEADER BLOCK -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5 shrink-0">
      <div>
        <h1 class="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
          <LockClosedIcon class="w-5 h-5 text-indigo-400" />
          <span>B2B Escrow Holding Accounts</span>
        </h1>
        <p class="text-xs text-slate-400">Escrow allocations held securely as clearing intermediate blocks during transit of dry or raw foods.</p>
      </div>

      <div class="text-xs font-mono text-slate-300 p-2.5 bg-red-955/20 border border-red-900/40 rounded-xl flex items-center gap-2">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
        <span>Secure Lock: Active</span>
      </div>
    </div>

    <!-- ESCROW GENERAL STATS -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs">
      <div class="p-5 bg-[#14141E] border border-slate-800 rounded-xl text-center flex flex-col justify-between">
        <span class="text-slate-500 uppercase tracking-widest block font-bold">Held in Escrow</span>
        <span class="text-xl font-bold text-slate-100 mt-2 block">{{ formatCurrency(totalEscrow) }}</span>
      </div>
      <div class="p-5 bg-[#14141E] border border-slate-800 rounded-xl text-center flex flex-col justify-between">
        <span class="text-slate-500 uppercase tracking-widest block font-bold">Transit Lock Cases</span>
        <span class="text-xl font-bold text-amber-450 mt-2 block">{{ activeConflictCount }} blocks</span>
      </div>
      <div class="p-5 bg-[#14141E] border border-slate-800 rounded-xl text-center font-bold flex flex-col justify-between">
        <span class="text-slate-500 uppercase tracking-widest block">Average Settl Delay</span>
        <span class="text-xl font-bold text-slate-300 mt-2 block">4.2 business days</span>
      </div>
    </div>

    <!-- HELD ESCROW TABLE -->
    <div class="bg-[#14141E] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs font-sans">
          <thead>
            <tr class="text-[10px] font-mono text-slate-400 uppercase border-b border-slate-800 bg-slate-900/60">
              <th class="p-3 pl-5">Associated Job ID</th>
              <th class="p-3">Buyer Corporation</th>
              <th class="p-3">Clearance Route</th>
              <th class="p-3 text-right">Escrowed Funds (XAF)</th>
              <th class="p-3 text-center font-mono">Duty Lock</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-850">
            <tr 
              v-for="(e, idx) in escrows" 
              :key="e.id"
              class="hover:bg-slate-900/30 text-slate-350 transition"
              :class="idx % 2 === 0 ? 'bg-[#14141E]' : 'bg-[#181824]'"
            >
              <td class="p-3 pl-5">
                <div class="font-mono text-[10.5px] text-indigo-400 font-semibold">{{ e.reference }}</div>
                <div class="text-[9px] text-slate-500 font-mono">Ref: {{ e.orderReference || 'B2B-ORD-AUTOGEN' }}</div>
              </td>
              <td class="p-3 font-semibold text-slate-100">{{ e.recipientInstitution || 'Alpha Retail Group' }}</td>
              <td class="p-3 text-slate-400 font-mono">{{ e.paymentMethod }}</td>
              <td class="p-3 text-right font-mono font-bold text-slate-200">{{ formatCurrency(e.amount) }}</td>
              <td class="p-3 text-center">
                <span class="px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase bg-amber-955 text-amber-400 border border-amber-900/40">
                  Escrow_Held
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- NOTES PANEL -->
    <div class="p-4 bg-slate-900/40 border border-slate-800 rounded-xl text-xs text-slate-400 leading-normal flex items-start space-x-2">
      <InformationCircleIcon class="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
      <div>
        <span class="font-bold text-slate-300 font-mono uppercase text-[9.5px] block mb-1">Standard ESCROW terms:</span>
        <p>All buyer collections through Orange Money, MTN MoMo, or cards are systematically held inside Central Holding vaults until delivery waybill captures have been confirmed and signatures verified.</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import { transactions } from '@/utils/seed_data.js';
import { LockClosedIcon, InformationCircleIcon } from '@heroicons/vue/24/outline';

const escrows = computed(() => {
  return transactions.filter(t => t.status === "Held" || t.status === "Escrow_Held");
});

const totalEscrow = computed(() => {
  return escrows.value.reduce((acc, e) => acc + Math.abs(e.amount), 0);
});

const activeConflictCount = computed(() => escrows.value.length);

function formatCurrency(v) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(v);
}
</script>
