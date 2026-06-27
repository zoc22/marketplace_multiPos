<template>
  <div class="space-y-6 max-w-2xl mx-auto text-slate-300" id="admin-escrow-refund">
    <!-- PANEL HEADER -->
    <div class="border-b border-slate-800 pb-4">
      <router-link :to="'/admin/escrow/' + paymentId" class="text-sm text-indigo-405 font-mono hover:underline flex items-center space-x-2">
        <span>&larr; Retour aux détails</span>
      </router-link>
      <h1 class="text-xl font-bold text-slate-100 mt-2">Rembourser l'Acheteur</h1>
      <p class="text-xs text-slate-400">Reverser tout ou partie des fonds séquestrés au compte de l'acheteur.</p>
    </div>

    <!-- SPEC CARD -->
    <div class="bg-[#14141E] border border-slate-800 rounded-2xl p-6 space-y-4">
      <h3 class="font-bold text-sm text-slate-100 font-mono uppercase">Options de Remboursement</h3>
      
      <div class="space-y-4">
        <!-- Choices -->
        <div class="space-y-2">
          <span class="block text-xs font-mono text-slate-500 uppercase">Type de remboursement :</span>
          <div class="flex gap-4">
            <label class="flex items-center space-x-2 text-xs cursor-pointer">
              <input type="radio" value="FULL" v-model="refundType" class="text-indigo-650 bg-slate-950 border-slate-800 focus:ring-indigo-500" />
              <span>Remboursement Total ({{ formatMoney(payment?.amount) }})</span>
            </label>
            <label class="flex items-center space-x-2 text-xs cursor-pointer">
              <input type="radio" value="PARTIAL" v-model="refundType" class="text-indigo-650 bg-slate-950 border-slate-800 focus:ring-indigo-500" />
              <span>Remboursement Partiel (50%)</span>
            </label>
          </div>
        </div>

        <!-- Justification -->
        <label class="block">
          <span class="block text-xs font-mono text-slate-500 uppercase mb-1">Justification Administrative :</span>
          <textarea 
            v-model="justification"
            placeholder="Ex: Défaut qualité constaté et validé par l'expert, retour de lot autorisé."
            rows="3"
            class="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-slate-100 focus:outline-none"
          ></textarea>
        </label>
      </div>
    </div>

    <!-- ACTION BUTTON -->
    <button 
      @click="triggerRefundConfirmation"
      :disabled="!justification.trim()"
      class="w-full py-2.5 bg-red-650 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-mono font-bold uppercase rounded-xl text-xs tracking-wider transition shadow-lg text-center"
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
  router.push('/admin/finance/escrow');
}

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val || 0).replace('XAF', 'FCFA');
}
</script>
