<template>
  <div class="space-y-6">

    <!-- HEADER SUMMARY -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5 shrink-0 animate-fade-in">
      <div>
        <h1 class="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
          Platform B2B Disputes Resolution Center
        </h1>
        <p class="text-xs text-slate-400">Mediate commercial conflicts, authorize refunds, or freeze/release held funding escrows.</p>
      </div>

      <!-- METRIC BADGES -->
      <div class="flex items-center space-x-3 text-xs font-mono">
        <span class="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-350">
          Unsettled Disputes: <strong class="text-red-400">{{ activeCount }}</strong>
        </span>
        <span class="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-350">
          Total Disputed Sum: <strong class="text-indigo-400">{{ formatCurrency(totalDisputedAmount) }}</strong>
        </span>
      </div>
    </div>

    <!-- MAIN TWO-COLUMN SUBSECTION -->
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
      
      <!-- LEFT HAND COMPILATION: DISPUTE REGISTRY -->
      <div class="xl:col-span-4 space-y-4">
        
        <!-- Search bar -->
        <div class="relative w-full">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Search dispute refs, companies..."
            class="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-2.5 pl-8 text-xs text-slate-100 placeholder-slate-650 font-mono transition focus:outline-none"
          />
          <span class="absolute left-2.5 top-3 text-slate-505 font-mono text-[11px]">&xi;</span>
        </div>

        <div class="space-y-2 max-h-[600px] overflow-y-auto pr-1">
          <div 
            v-for="d in filteredDisputes" 
            :key="d.id"
            @click="selectedDispute = d"
            class="p-4 bg-slate-900/60 border rounded-2xl cursor-pointer text-left transition relative"
            :class="selectedDispute?.id === d.id ? 'border-indigo-500 bg-indigo-950/20' : 'border-slate-850 hover:border-slate-800'"
          >
            <!-- Badge indicators -->
            <div class="flex items-center justify-between font-mono text-[9px] mb-2 leading-none">
              <span class="text-indigo-400 font-bold uppercase tracking-wider">{{ d.disputeRef }}</span>
              <span 
                class="px-1.5 py-0.5 rounded font-bold uppercase"
                :class="getStatusClass(d.status)"
              >
                {{ d.status.toUpperCase().replace('_', ' ') }}
              </span>
            </div>

            <h3 class="text-xs font-bold text-slate-100 font-sans leading-snug line-clamp-1">{{ d.product }}</h3>
            <div class="text-[11px] text-slate-450 mt-1">
              Buyer: <span class="text-slate-300 font-semibold">{{ d.buyer }}</span>
            </div>
            <div class="text-[11px] text-slate-450">
              Supplier: <span class="text-slate-300">{{ d.supplier }}</span>
            </div>

            <div class="flex items-center justify-between pt-3.5 mt-2.5 border-t border-slate-850/60 font-mono text-[10px]">
              <span class="text-slate-500">{{ formatDate(d.createdAt) }}</span>
              <span class="text-slate-205 font-bold">{{ formatCurrency(d.amount) }} XAF</span>
            </div>
          </div>
        </div>

      </div>

      <!-- RIGHT HAND PANEL: RESOLUTION DESK & DIALOGUE FLUX -->
      <div class="xl:col-span-8">
        
        <div v-if="selectedDispute" class="p-6 bg-[#040817] border border-[#121c3b] rounded-2xl space-y-6">
          
          <!-- Dispute detail header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#121c3b] pb-4 gap-3">
            <div>
              <div class="flex items-center space-x-2 text-[10px] font-mono leading-none mb-1">
                <span class="text-indigo-400 font-bold uppercase">{{ selectedDispute.disputeRef }}</span>
                <span class="text-slate-650">&bull;</span>
                <span class="text-slate-400">Order: {{ selectedDispute.orderRef }}</span>
              </div>
              <h2 class="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider">Claims Case Review</h2>
            </div>

            <!-- Current action status badge -->
            <span 
              class="px-2.5 py-1 rounded text-xs font-mono font-bold uppercase border self-start"
              :class="getStatusClass(selectedDispute.status)"
            >
              {{ selectedDispute.status.toUpperCase().replace('_', ' ') }}
            </span>
          </div>

          <!-- Product / Parties row -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
            <div class="p-3 bg-slate-950 rounded-xl border border-slate-900 space-y-1">
              <span class="text-[9px] font-mono text-slate-500 uppercase block">Disputed Sum</span>
              <span class="text-[13px] font-bold font-mono text-slate-100">{{ formatCurrency(selectedDispute.amount) }} XAF</span>
            </div>
            <div class="p-3 bg-slate-950 rounded-xl border border-slate-900 space-y-1">
              <span class="text-[9px] font-mono text-slate-500 uppercase block">Affilated Buyer</span>
              <span class="text-slate-200 font-bold block truncate">{{ selectedDispute.buyer }}</span>
            </div>
            <div class="p-3 bg-slate-950 rounded-xl border border-slate-900 space-y-1">
              <span class="text-[9px] font-mono text-slate-500 uppercase block">Affilated Supplier</span>
              <span class="text-indigo-400 font-semibold block truncate">{{ selectedDispute.supplier }}</span>
            </div>
          </div>

          <!-- Dispute description message -->
          <div class="p-4 bg-slate-950 border border-slate-900 rounded-xl space-y-1">
            <span class="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Buyer Declaration Statement:</span>
            <p class="text-xs text-slate-350 leading-relaxed font-sans">{{ selectedDispute.description }}</p>
          </div>

          <!-- Chat dialogue flux -->
          <div class="space-y-3">
            <h4 class="text-[10px] font-mono uppercase text-slate-450 tracking-wider font-bold">Review Pipeline Statements & Threads</h4>
            <div class="space-y-2.5 max-h-[220px] overflow-y-auto bg-slate-950/40 p-3 rounded-xl border border-slate-900">
              
              <div 
                v-for="cmt in selectedDispute.comments" 
                :key="cmt.id"
                class="p-3 rounded-xl space-y-1 text-xs"
                :class="cmt.author === 'System Admin' ? 'bg-indigo-950/20 border border-indigo-905/30' : 'bg-slate-950/80 border border-slate-900'"
              >
                <div class="flex items-center justify-between font-mono text-[9px]">
                  <span class="text-slate-200 uppercase font-bold tracking-wider" :class="cmt.author === 'System Admin' ? 'text-indigo-400' : ''">
                    &bull; {{ cmt.author }}
                  </span>
                  <span class="text-slate-600">{{ formatDateTime(cmt.date) }}</span>
                </div>
                <p class="text-slate-300 leading-normal">{{ cmt.text }}</p>
              </div>

            </div>
          </div>

          <!-- Mediate and input box reply line -->
          <div class="space-y-2">
            <label class="block text-[10px] font-mono uppercase text-slate-450 tracking-wider font-bold">Write Administrative Arbitrate Statement</label>
            <div class="flex gap-2">
              <input 
                type="text" 
                v-model="replyText"
                placeholder="Post message to dispute thread..."
                class="flex-1 bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-xl p-2.5 text-xs text-slate-100 font-mono focus:outline-none"
              />
              <button 
                @click="postArbitrateReply"
                class="px-4 py-2 bg-indigo-600 hover:bg-indigo-750 font-mono text-xs uppercase font-bold text-white rounded-xl transition"
              >
                Post
              </button>
            </div>
          </div>

          <!-- Resolution controllers (Require popping the safety dialog on rejections of claim or freezing values) -->
          <div v-if="selectedDispute.status === 'open' || selectedDispute.status === 'under_review'" class="pt-4 border-t border-[#121c3b] flex flex-wrap items-center justify-end gap-3 font-mono">
            
            <button 
              @click="triggerDisputeFreeze"
              class="px-3.5 py-2 bg-red-950/20 text-red-400 hover:bg-red-900 hover:text-slate-950 border border-red-900/40 rounded-xl text-xs uppercase font-bold transition"
            >
              Geler Escrow Payout
            </button>
            <button 
              @click="triggerDisputeDismiss"
              class="px-3.5 py-2 bg-slate-900 hover:bg-[#1a0f0d] text-slate-450 hover:text-red-400 border border-slate-800 hover:border-red-950/40 rounded-xl text-xs uppercase font-bold transition"
            >
              Reject / Dismiss Claims
            </button>
            <button 
              @click="approveDisputeRefunding"
              class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs uppercase font-bold transition"
            >
              Approve Buyer Refund
            </button>

          </div>

          <div v-else class="p-3 bg-slate-950 border border-slate-900 rounded-xl text-xs text-slate-450 font-mono">
            Case closed or frozen. Overrides are logged. System has finalized escrow holds.
          </div>

        </div>

        <div v-else class="p-12 text-center bg-slate-90s/10 border border-slate-900 rounded-2xl">
          <p class="text-xs text-slate-500 font-mono">Select a claims dossier from the compliance workspace registry.</p>
        </div>

      </div>

    </div>

    <!-- REVERSIBLE ESCROW FREEZING / DISMISS SAFETY DIRECT REJECTIONS CONFIRM MODAL -->
    <ConfirmationModal 
      :show="showConfirm"
      :title="confirmTitle"
      :message="confirmMessage"
      :action-label="confirmActionLabel"
      @close="closeConfirm"
      @confirm="executeDisputeOverride"
    />

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { disputes, writeAuditLog } from '@/utils/admin_db.js';
import { useAuthStore } from '@/store/modules/auth.js';
import { useToast } from 'vue-toastification';
import ConfirmationModal from '@/components/ConfirmationModal.vue';

const toast = useToast();
const authStore = useAuthStore();

const searchQuery = ref('');
const replyText = ref('');
const selectedDispute = ref(disputes.value[0] || null);

const activeCount = computed(() => {
  return disputes.value.filter(d => d.status === 'open' || d.status === 'under_review').length;
});

const totalDisputedAmount = computed(() => {
  return disputes.value.reduce((acc, d) => d.status !== 'dismissed' ? acc + d.amount : acc, 0);
});

const filteredDisputes = computed(() => {
  return disputes.value.filter(d => {
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      const matchRef = d.disputeRef.toLowerCase().includes(q);
      const matchBuyer = d.buyer.toLowerCase().includes(q);
      const matchSupp = d.supplier.toLowerCase().includes(q);
      return matchRef || matchBuyer || matchSupp;
    }
    return true;
  });
});

// Formatting
function formatCurrency(v) {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(v);
}

function formatDate(isoStr) {
  if (!isoStr) return '';
  return new Date(isoStr).toLocaleDateString();
}

function formatDateTime(isoStr) {
  if (!isoStr) return '';
  return new Date(isoStr).toISOString().replace('T', ' ').slice(0, 19);
}

function getStatusClass(st) {
  const map = {
    open: 'bg-red-950 text-red-400 border border-red-900/50',
    under_review: 'bg-amber-950 text-amber-500 border border-amber-900/50 animate-pulse',
    resolved: 'bg-emerald-950 text-emerald-450 border border-emerald-900/50',
    frozen: 'bg-slate-900 text-slate-200 border border-slate-850',
    dismissed: 'bg-slate-950 text-slate-500 border border-slate-900'
  };
  return map[st] || 'bg-slate-900 text-slate-400';
}

// POST ARBITRATE CHAT COMMENTS
function postArbitrateReply() {
  if (!replyText.value.trim()) return;
  
  const currentAuthor = authStore.user?.name || 'ROOT CENTRAL';
  const newCmt = {
    id: `cmt_${Date.now()}`,
    author: `${currentAuthor} (Platform Rep)`,
    text: replyText.value.trim(),
    date: new Date().toISOString()
  };

  selectedDispute.value.comments.push(newCmt);
  replyText.value = '';

  // automatically update status to under review if it was open
  if (selectedDispute.value.status === 'open') {
    selectedDispute.value.status = 'under_review';
  }

  writeAuditLog(
    'DISPUTE_MEDIATED',
    `New dialogue comment posted on case ${selectedDispute.value.disputeRef} by ${currentAuthor}.`,
    currentAuthor
  );

  toast.success('Arbitration reply submitted.');
}

// APPROVE REFUND DIRECT
function approveDisputeRefunding() {
  const currentAuthor = authStore.user?.name || 'ROOT CENTRAL';
  selectedDispute.value.status = 'resolved';

  // release comments
  selectedDispute.value.comments.push({
    id: `sys_${Date.now()}`,
    author: 'System Admin',
    text: `Arbitration final report executed. Escrow transaction released for full amount ${selectedDispute.value.amount} XAF to buyer account refund.`,
    date: new Date().toISOString()
  });

  writeAuditLog(
    'DISPUTE_REFUND_APPROVED',
    `Dispute refund approved for ${selectedDispute.value.buyer}. Resolved sum: ${selectedDispute.value.amount} XAF.`,
    currentAuthor
  );

  toast.success(`Claim resolved in buyer's favor. Funds refunded.`);
}

// EXPLICIT LOCKOUT REJECTIONS REQUIRED CONFIRMED BY SAFETY POPUP
const showConfirm = ref(false);
const confirmTitle = ref('');
const confirmMessage = ref('');
const confirmActionLabel = ref('');
const pendingType = ref(''); // 'dispute_freeze', 'dispute_dismiss'

function triggerDisputeFreeze() {
  pendingType.value = 'dispute_freeze';
  confirmTitle.value = 'DESTRUCTIVE OVERRIDE: FREEZE ESCROW PAYOUTS';
  confirmMessage.value = `You are about to place a full security freeze on the active escrow holdings of ${selectedDispute.value.amount} XAF. Neither party can retrieve the capital until compliance officers lift this lock.`;
  confirmActionLabel.value = 'FREEZE FUNDING BLOCKS';
  showConfirm.value = true;
}

function triggerDisputeDismiss() {
  pendingType.value = 'dispute_dismiss';
  confirmTitle.value = 'REJECT CLAIMS / DISMISS DISPUTE';
  confirmMessage.value = `You are rejecting the buyer's claims case ${selectedDispute.value.disputeRef} and closing the dispute docket. All escrowed sums of ${selectedDispute.value.amount} XAF will be swept and paid out directly to supplier ${selectedDispute.value.supplier}.`;
  confirmActionLabel.value = 'REJECT & DISMISS CLAIMS';
  showConfirm.value = true;
}

function closeConfirm() {
  showConfirm.value = false;
  pendingType.value = '';
}

function executeDisputeOverride(reason) {
  const currentAuthor = authStore.user?.name || 'ROOT CENTRAL';

  if (pendingType.value === 'dispute_freeze') {
    selectedDispute.value.status = 'frozen';
    selectedDispute.value.comments.push({
      id: `sys_${Date.now()}`,
      author: 'System Admin',
      text: `Escrow holdings frozen by arbitration supervisor. Clearance review pending. Reason: ${reason}`,
      date: new Date().toISOString()
    });

    writeAuditLog(
      'DISPUTE_FREEZE_OVERRIDE',
      `Arbitration block placed on escrow case ${selectedDispute.value.disputeRef}. Reason: ${reason}`,
      currentAuthor,
      'danger'
    );

    toast.error(`Escrow locked and frozen. Event logged to audit.`);
  } 
  
  else if (pendingType.value === 'dispute_dismiss') {
    selectedDispute.value.status = 'dismissed';
    selectedDispute.value.comments.push({
      id: `sys_${Date.now()}`,
      author: 'System Admin',
      text: `Claims dismissed. Dispute closed. Escrow holding released to supplier. Reason: ${reason}`,
      date: new Date().toISOString()
    });

    writeAuditLog(
      'DISPUTE_DISMISSED',
      `Dispute claims dismissed for case ${selectedDispute.value.disputeRef}. Escrow released to supplier. Reason: ${reason}`,
      currentAuthor,
      'warning'
    );

    toast.warning(`Buyer claims dismissed. Capital cleared for payout.`);
  }

  showConfirm.value = false;
  pendingType.value = '';
}
</script>
