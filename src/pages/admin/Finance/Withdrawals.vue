<template>
  <div class="space-y-6">

    <!-- HEADER BLOCK -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5 shrink-0">
      <div>
        <h1 class="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
          Withdrawals Clearance & Payout Board
        </h1>
        <p class="text-xs text-slate-400">Validate outbound supplier revenue claims, approve bank wires, or freeze suspicious withdrawal actions.</p>
      </div>

      <!-- BULK TOTALS -->
      <div class="flex items-center space-x-3 text-xs font-mono">
        <span class="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-350">
          Pending payout files: <strong class="text-amber-400">{{ pendingCount }}</strong>
        </span>
      </div>
    </div>

    <!-- MAIN WITHDRAWAL LIST -->
    <div v-if="withdrawals.length === 0" class="p-12 text-center bg-slate-90s/15 border border-slate-900 rounded-2xl">
      <p class="text-xs text-slate-500 font-mono">No withdrawal clearance files active in directory.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="wth in withdrawals" 
        :key="wth.id"
        class="bg-[#05091a] border border-[#121c3b] hover:border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition"
      >
        <div>
          <div class="flex items-center justify-between font-mono text-[9px] leading-none mb-3">
            <span class="text-slate-500">ID: {{ wth.id.toUpperCase() }}</span>
            <span 
              class="px-2 py-0.5 rounded font-bold uppercase tracking-wide border"
              :class="getStatusClass(wth.status)"
            >
              {{ wth.status }}
            </span>
          </div>

          <p class="text-[10px] font-mono text-indigo-400 uppercase tracking-widest leading-none">Claim Amount</p>
          <h3 class="text-lg font-bold font-mono text-slate-100 mt-1">
            {{ formatCurrency(wth.amount) }} <span class="text-xs font-sans text-slate-400 font-normal">XAF</span>
          </h3>
          
          <div class="space-y-1.5 text-xs font-mono pt-3 mt-3 border-t border-slate-850/60 leading-tight text-slate-400">
            <div class="flex items-center justify-between">
              <span>Pay-Route:</span>
              <span class="text-slate-200 uppercase">{{ wth.method }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span>Clearence Ref:</span>
              <span class="text-slate-200 truncate max-w-[150px]">{{ wth.reference || 'Awaiting Sync' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span>Claim Date:</span>
              <span class="text-slate-300 font-sans">{{ formatDate(wth.date) }}</span>
            </div>
          </div>
        </div>

        <!-- Action controllers (Denying/Rejecting triggers safety modal) -->
        <div class="pt-2 flex items-center justify-end gap-2 font-mono shrink-0">
          <template v-if="wth.status === 'Pending'">
            <button 
              @click="triggerPayoutReject(wth)"
              class="w-full text-center py-1.5 bg-red-950/25 text-red-400 hover:bg-red-900 hover:text-slate-950 border border-red-900/45 rounded-xl text-[10px] uppercase font-bold transition"
            >
              Rejeter / Hold
            </button>
            <button 
              @click="approvePayout(wth)"
              class="w-full text-center py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] uppercase font-bold transition"
            >
              Approve Wire
            </button>
          </template>
          <div v-else class="text-[10px] text-slate-500 italic flex items-center gap-1">
            <span class="h-1.5 w-1.5 rounded-full bg-slate-800"></span>
            <span>Clearence Finalized</span>
          </div>
        </div>
      </div>
    </div>

    <!-- PAGINATION ACCESSORY -->
    <div class="text-xs text-slate-500 font-mono py-2 border-t border-slate-900 shrink-0 select-none">
      * Outbound clearance registers log automatically via Central Settlement Authority blocks.
    </div>

    <!-- MANDATORY REJECTION CONFIRMED SYSTEM CONTROL ROOM POPUP -->
    <ConfirmationModal 
      :show="showConfirm"
      :title="confirmTitle"
      :message="confirmMessage"
      :action-label="confirmActionLabel"
      @close="closeConfirm"
      @confirm="executeRejectionOverride"
    />

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { withdrawals } from '@/utils/supplier_db.js';
import { useToast } from 'vue-toastification';
import { writeAuditLog } from '@/utils/admin_db.js';
import ConfirmationModal from '@/components/ConfirmationModal.vue';

const toast = useToast();

const pendingCount = computed(() => {
  return withdrawals.value.filter(w => w.status === 'Pending').length;
});

function formatCurrency(v) {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(v);
}

function formatDate(isoStr) {
  if (!isoStr) return '';
  return new Date(isoStr).toLocaleDateString();
}

function getStatusClass(st) {
  const map = {
    Completed: 'bg-emerald-950 text-emerald-400 border border-emerald-900/50',
    Pending: 'bg-amber-950 text-amber-505 border border-amber-900/50 animate-pulse',
    Rejected: 'bg-red-950 text-red-400 border border-red-900/50',
    Suspended: 'bg-slate-900 text-slate-350 border border-slate-800'
  };
  return map[st] || 'bg-slate-900 text-slate-400';
}

// APPROVE
function approvePayout(wth) {
  wth.status = 'Completed';
  wth.reference = `CCA-EFT-${Math.floor(100000 + Math.random() * 900000)}`;

  writeAuditLog(
    'PAYOUT_APPROVED',
    `Supplier withdrawal payout approved & wired for amount ${wth.amount} XAF. Route: ${wth.method}.`,
    'Treasury Settlement Desk'
  );

  toast.success('Withdrawal approved. CCA Bank electronic fund wire dispatched.');
}

// FORCE COMPLIANCE REJECTION MODAL
const showConfirm = ref(false);
const confirmTitle = ref('');
const confirmMessage = ref('');
const confirmActionLabel = ref('');
const targetPayout = ref(null);

function triggerPayoutReject(wth) {
  targetPayout.value = wth;
  confirmTitle.value = 'REJECT & SUSPEND SECURITIES DISPATCH';
  confirmMessage.value = `You are about to execute a rejection hold override on payout request ${wth.id} for ${wth.amount} XAF. The capital stays held inside escrow, and the vendor is flagged for regulatory review.`;
  confirmActionLabel.value = 'EXECUTE REJECTION HOLD';
  showConfirm.value = true;
}

function closeConfirm() {
  showConfirm.value = false;
  targetPayout.value = null;
}

function executeRejectionOverride(reason) {
  if (targetPayout.value) {
    const wth = targetPayout.value;
    wth.status = 'Rejected';
    wth.reference = `REJ-HOLD-${Date.now().toString().slice(-6)}`;

    writeAuditLog(
      'PAYOUT_REJECTED',
      `Supplier payout request ${wth.id} has been REJECTED. Reason: ${reason} (Amount: ${wth.amount} XAF)`,
      'Treasury Settlement Desk',
      'warning'
    );

    toast.error(`Payout request rejected. Funds are held in escrow for review. Event logger loaded.`);
  }

  showConfirm.value = false;
  targetPayout.value = null;
}
</script>
