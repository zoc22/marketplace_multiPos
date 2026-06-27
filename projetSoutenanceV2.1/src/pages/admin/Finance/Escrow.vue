<template>
  <div class="space-y-6">

    <!-- HEADER BLOCK -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5 shrink-0">
      <div>
        <h1 class="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
          B2B Escrow Holding Accounts
        </h1>
        <p class="text-xs text-slate-400">Escrow allocations held securely as clearing intermediate blocks during transit of dry or raw foods.</p>
      </div>

      <div class="text-xs font-mono text-slate-405 p-3 bg-red-950/15 border border-red-950/45 rounded-xl flex items-center gap-2 animate-pulse">
        <span class="h-2 w-2 rounded-full bg-red-500"></span>
        <span>Secure Lock: Active</span>
      </div>
    </div>

    <!-- ESCROW GENERAL STATS -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
      <div class="p-4 bg-[#090f23] border border-[#121c3b] rounded-xl text-center">
        <span class="text-slate-500 uppercase tracking-widest block">Held in Escrow</span>
        <span class="text-lg font-bold text-slate-100 mt-1 block">{{ formatCurrency(totalEscrow) }}</span>
      </div>
      <div class="p-4 bg-[#090f23] border border-[#121c3b] rounded-xl text-center">
        <span class="text-slate-505 uppercase tracking-widest block">Transit Lock Cases</span>
        <span class="text-lg font-bold text-amber-400 mt-1 block">{{ activeConflictCount }} blocks</span>
      </div>
      <div class="p-4 bg-[#090f23] border border-[#121c3b] rounded-xl text-center font-bold">
        <span class="text-slate-500 uppercase tracking-widest block">Average Settl Delay</span>
        <span class="text-lg font-bold text-slate-350 mt-1 block">4.2 business days</span>
      </div>
    </div>

    <!-- HELD ESCROW TABLE -->
    <div class="bg-[#040817] border border-[#121c3b] rounded-2xl overflow-hidden shadow">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs font-sans">
          <thead>
            <tr class="text-[10px] font-mono text-slate-450 uppercase border-b border-[#121c3b] bg-slate-950">
              <th class="p-3 pl-5">Associated Job ID</th>
              <th class="p-3">Buyer Corporation</th>
              <th class="p-3">Cleance Route</th>
              <th class="p-3 text-right">Escrowed Funds (XAF)</th>
              <th class="p-1 text-center font-mono">Duty Lock</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#121c3b]/30">
            <tr 
              v-for="e in escrows" 
              :key="e.id"
              class="hover:bg-slate-900/30 text-slate-300 transition"
            >
              <td class="p-3 pl-5">
                <div class="font-mono text-[10.5px] text-indigo-400 font-semibold">{{ e.reference }}</div>
                <div class="text-[9px] text-slate-450 font-mono">Ref: {{ e.orderReference || 'B2B-ORD-AUTOGEN' }}</div>
              </td>
              <td class="p-3 font-semibold text-slate-100">{{ e.recipientInstitution || 'Alpha Retail Group' }}</td>
              <td class="p-3 text-slate-400 font-mono">{{ e.paymentMethod }}</td>
              <td class="p-3 text-right font-mono font-bold">{{ formatCurrency(e.amount) }}</td>
              <td class="p-3 text-center">
                <span class="px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase bg-amber-950 text-amber-405 border border-amber-900/40">
                  Escrow_Held
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- NOTES PANEL -->
    <div class="p-4 bg-slate-900/40 border border-slate-900 rounded-xl text-xs text-slate-400 leading-normal">
      <span class="font-bold text-slate-309 font-mono uppercase text-[9px] block mb-1">Standard ESCROW terms:</span>
      All buyer collections through Orange Money, MTN MoMo, or cards are systematically held inside Central Holding vaults until delivery waybill captures have been confirmed and signatures verified.
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import { transactions } from '@/utils/seed_data.js';

const escrows = computed(() => {
  return transactions.filter(t => t.status === "Escrow_Held" || t.status === "Held");
});

const totalEscrow = computed(() => {
  return escrows.value.reduce((acc, e) => acc + Math.abs(e.amount), 0);
});

const activeConflictCount = computed(() => escrows.value.length);

function formatCurrency(v) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(v);
}
</script>
