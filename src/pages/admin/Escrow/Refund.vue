<template>
  <div class="space-y-6 max-w-2xl mx-auto text-[var(--color-text-secondary)] font-sans" id="admin-escrow-refund">
    <!-- PANEL HEADER -->
    <div class="border-b border-[var(--color-border)] pb-4">
      <router-link :to="'/admin/escrow/' + paymentId" class="text-sm text-[var(--color-primary)] font-mono hover:underline flex items-center space-x-2">
        <span>&larr; Retour aux détails</span>
      </router-link>
      <h1 class="text-xl font-bold text-[var(--color-text-primary)] mt-2">Rembourser l'Acheteur</h1>
      <p class="text-xs text-[var(--color-text-secondary)]">Reverser tout ou partie des fonds séquestrés au compte de l'acheteur.</p>
    </div>

    <!-- SPEC CARD -->
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4 shadow-sm">
      <h3 class="font-bold text-sm text-[var(--color-text-primary)] font-mono uppercase">Options de Remboursement</h3>
      
      <div class="space-y-4">
        <!-- Choices -->
        <div class="space-y-2">
          <span class="block text-xs font-mono text-[var(--color-text-secondary)] uppercase">Type de remboursement :</span>
          <div class="flex gap-4">
            <label class="flex items-center space-x-2 text-xs cursor-pointer text-[var(--color-text-primary)]">
              <input type="radio" value="FULL" v-model="refundType" class="text-[var(--color-primary)] bg-[var(--color-background)] border-[var(--color-border)] focus:ring-[var(--color-primary)]" />
              <span>Remboursement Total ({{ formatMoney(payment?.amount) }})</span>
            </label>
            <label class="flex items-center space-x-2 text-xs cursor-pointer text-[var(--color-text-primary)]">
              <input type="radio" value="PARTIAL" v-model="refundType" class="text-[var(--color-primary)] bg-[var(--color-background)] border-[var(--color-border)] focus:ring-[var(--color-primary)]" />
              <span>Remboursement Partiel (50%)</span>
            </label>
          </div>
        </div>

        <!-- Justification -->
        <label class="block">
          <span class="block text-xs font-mono text-[var(--color-text-secondary)] uppercase mb-1">Justification Administrative :</span>
          <textarea 
            v-model="justification"
            placeholder="Ex: Défaut qualité constaté et validé par l'expert, retour de lot autorisé."
            rows="3"
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] focus:border-[var(--color-primary)] rounded-xl p-3 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none"
          ></textarea>
        </label>
      </div>
    </div>

    <!-- ACTION BUTTON -->
    <button 
      @click="triggerRefundConfirmation"
      :disabled="!justification.trim()"
      class="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-mono font-bold uppercase rounded-xl text-xs tracking-wider transition shadow-lg text-center cursor-pointer"
      id="btn-refund-escrow"
    >
      Procéder au remboursement
    </button>

    <!-- CONFIRMATION MODAL -->
    <ConfirmationModal 
      :show="showModal"
      title="Confirmer le remboursement"
      message="Attention: Cette action retournera les fonds séquestrés sur le compte de l'acheteur. Cette opération est irréversible."
      action-label="Confirmer le remboursement"
      @close="showModal = false"
      @confirm="executeRefund"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePaymentsStore } from '@/store/modules/payments.js';
import { useToast } from 'vue-toastification';
import ConfirmationModal from '@/components/ConfirmationModal.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const paymentsStore = usePaymentsStore();
const paymentId = route.params.id;

const payment = computed(() => {
  return paymentsStore.escrowPayments.find(p => p.id === paymentId);
});

const refundType = ref('FULL');
const justification = ref('');
const showModal = ref(false);

function triggerRefundConfirmation() {
  showModal.value = true;
}

function executeRefund() {
  paymentsStore.refundPayment(paymentId);
  toast.success('Le remboursement a été initié avec succès.');
  router.push('/admin/escrow');
}

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val || 0).replace('XAF', 'FCFA');
}
</script>
