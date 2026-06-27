<template>
  <div class="space-y-6">
    <div class="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
      <h1 class="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono">Institutional Financial Parameters</h1>
      <p class="text-xs text-slate-400">Configure safety, clearance windows, and fraud-risk thresholds for B2B mobile payment networks.</p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-slate-300">
        <div class="space-y-1">
          <label class="block text-slate-400 text-[10px] uppercase">Minimum Payout Value (XAF)</label>
          <input type="number" v-model="payoutSettings.minWithdrawal" class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100" />
        </div>
        <div class="space-y-1">
          <label class="block text-slate-400 text-[10px] uppercase">Daily Clearing Cap (XAF)</label>
          <input type="number" v-model="payoutSettings.maxWithdrawalDaily" class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100" />
        </div>
        <div class="space-y-1">
          <label class="block text-slate-400 text-[10px] uppercase">Secured Verification Lock hours</label>
          <input type="number" v-model="payoutSettings.securityLockHours" class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100" />
        </div>
        <div class="space-y-1">
          <label class="block text-slate-400 text-[10px] uppercase">Auto-Approve Micro-Withdrawals</label>
          <select v-model="payoutSettings.autoApprovePayouts" class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100">
            <option :value="false">Disabled (Enforce manual review)</option>
            <option :value="true">Enabled (Under 50,000 XAF)</option>
          </select>
        </div>
      </div>

      <div class="flex justify-end pt-2">
        <button @click="saveParams" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-mono font-bold uppercase rounded-lg text-white transition">
          Save Parameters
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { payoutSettings } from '@/utils/admin_db.js';
import { useToast } from 'vue-toastification';

const toast = useToast();

function saveParams() {
  toast.success('Treasury processing policies saved persistent.');
}
</script>
