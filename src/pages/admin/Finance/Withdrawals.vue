<template>
  <div class="space-y-6">

    <!-- HEADER BLOCK -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5 shrink-0">
      <div>
        <h1 class="text-xl font-bold font-mono text-[var(--color-text-primary)] flex items-center gap-2">
          <span>Tableau des Règlements & Retraits</span>
        </h1>
        <p class="text-xs text-[var(--color-text-secondary)]">Validez les demandes de retrait des fournisseurs, approuvez les virements bancaires ou gelez les retraits suspects.</p>
      </div>

      <!-- BULK TOTALS -->
      <div class="flex items-center space-x-3 text-xs font-mono">
        <span class="px-2.5 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)]">
          Règlements en attente : <strong class="text-amber-500">{{ pendingCount }}</strong>
        </span>
      </div>
    </div>

    <!-- MAIN WITHDRAWAL LIST -->
    <div v-if="withdrawals.length === 0" class="p-12 text-center bg-[var(--color-surface)]/10 border border-[var(--color-border)] rounded-2xl">
      <p class="text-xs text-[var(--color-text-secondary)] font-mono">Aucune demande de retrait active.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="wth in withdrawals" 
        :key="wth.id"
        class="bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)] rounded-2xl p-5 flex flex-col justify-between space-y-4 transition shadow-sm"
      >
        <div>
          <div class="flex items-center justify-between font-mono text-[9px] leading-none mb-3 text-[var(--color-text-secondary)]">
            <span>ID : {{ wth.id.toUpperCase() }}</span>
            <span 
              class="px-2 py-0.5 rounded font-bold uppercase tracking-wide border"
              :class="getStatusClass(wth.status)"
            >
              {{ wth.status === 'Pending' ? 'En attente' : wth.status === 'Completed' ? 'Complété' : wth.status === 'Rejected' ? 'Rejeté' : 'Suspendu' }}
            </span>
          </div>

          <p class="text-[10px] font-mono text-[var(--color-primary)] uppercase tracking-widest leading-none">Montant de la Demande</p>
          <h3 class="text-lg font-bold font-mono text-[var(--color-text-primary)] mt-1">
            {{ formatCurrency(wth.amount) }} <span class="text-xs font-sans text-[var(--color-text-secondary)] font-normal">FCFA</span>
          </h3>
          
          <div class="space-y-1.5 text-xs font-mono pt-3 mt-3 border-t border-[var(--color-border)] leading-tight text-[var(--color-text-secondary)]">
            <div class="flex items-center justify-between">
              <span>Mode de Paiement :</span>
              <span class="text-[var(--color-text-primary)] uppercase">{{ wth.method }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span>Réf. de Règlement :</span>
              <span class="text-[var(--color-text-primary)] truncate max-w-[150px]">{{ wth.reference || 'En attente de synchro' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span>Date de Demande :</span>
              <span class="text-[var(--color-text-primary)] font-sans">{{ formatDate(wth.date) }}</span>
            </div>
          </div>
        </div>

        <!-- Action controllers -->
        <div class="pt-2 flex items-center justify-end gap-2 font-mono shrink-0">
          <template v-if="wth.status === 'Pending'">
            <button 
              @click="triggerPayoutReject(wth)"
              class="w-full text-center py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-xl text-[10px] uppercase font-bold transition cursor-pointer"
            >
              Rejeter / Bloquer
            </button>
            <button 
              @click="approvePayout(wth)"
              class="w-full text-center py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] uppercase font-bold transition cursor-pointer"
            >
              Approuver
            </button>
          </template>
          <div v-else class="text-[10px] text-[var(--color-text-secondary)] italic flex items-center gap-1">
            <span class="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
            <span>Règlement Finalisé</span>
          </div>
        </div>
      </div>
    </div>

    <!-- PAGINATION ACCESSORY -->
    <div class="text-xs text-[var(--color-text-secondary)] py-2 border-t border-[var(--color-border)] shrink-0 select-none">
      * Les registres de règlement sortants sont journalisés automatiquement.
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
    Completed: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
    Pending: 'bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse',
    Rejected: 'bg-red-500/10 text-red-500 border border-red-500/20',
    Suspended: 'bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'
  };
  return map[st] || 'bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)]';
}

function approvePayout(wth) {
  wth.status = 'Completed';
  wth.reference = `CCA-EFT-${Math.floor(100000 + Math.random() * 900000)}`;

  writeAuditLog(
    'PAYOUT_APPROVED',
    `Demande de règlement fournisseur approuvée pour un montant de ${wth.amount} FCFA. Mode : ${wth.method}.`,
    'Service de Trésorerie'
  );

  toast.success('Retrait approuvé. Virement bancaire expédié.');
}

const showConfirm = ref(false);
const confirmTitle = ref('');
const confirmMessage = ref('');
const confirmActionLabel = ref('');
const targetPayout = ref(null);

function triggerPayoutReject(wth) {
  targetPayout.value = wth;
  confirmTitle.value = 'REJETER & SUSPENDRE LE PAIEMENT';
  confirmMessage.value = `Vous êtes sur le point de rejeter la demande de retrait ${wth.id} d'un montant de ${wth.amount} FCFA. Les fonds restent séquestrés et le fournisseur sera signalé.`;
  confirmActionLabel.value = 'EXÉCUTER LE BLOCAGE';
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
      `Demande de règlement fournisseur ${wth.id} REJETÉE. Raison : ${reason} (Montant : ${wth.amount} FCFA)`,
      'Service de Trésorerie',
      'warning'
    );

    toast.error('Demande de règlement rejetée. Les fonds sont bloqués pour examen.');
  }

  showConfirm.value = false;
  targetPayout.value = null;
}
</script>
