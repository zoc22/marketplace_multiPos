<template>
  <div class="space-y-6 max-w-2xl mx-auto text-[var(--color-text-secondary)] font-sans" id="admin-escrow-release">
    <!-- PANEL HEADER -->
    <div class="border-b border-[var(--color-border)] pb-4">
      <router-link :to="'/admin/escrow/' + paymentId" class="text-sm text-[var(--color-primary)] font-mono hover:underline flex items-center space-x-2">
        <span>&larr; Retour aux détails</span>
      </router-link>
      <h1 class="text-xl font-bold text-[var(--color-text-primary)] mt-2">Libérer le Paiement Séquestré</h1>
      <p class="text-xs text-[var(--color-text-secondary)]">Transférer définitivement les fonds au bénéficiaire (Vendeur).</p>
    </div>

    <!-- DETAILS CARD -->
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4 shadow-sm">
      <h3 class="font-bold text-sm text-[var(--color-text-primary)] font-mono uppercase">Récapitulatif du Transfert</h3>
      <div class="space-y-2 text-xs font-mono text-[var(--color-text-secondary)]">
        <div><span class="text-[var(--color-text-secondary)]">Référence Séquestre :</span> <span class="text-[var(--color-text-primary)]">{{ payment?.reference }}</span></div>
        <div><span class="text-[var(--color-text-secondary)]">Payeur (Acheteur) :</span> <span class="text-[var(--color-text-primary)]">{{ payment?.payer_id }}</span></div>
        <div><span class="text-[var(--color-text-secondary)]">Bénéficiaire (Vendeur) :</span> <span class="text-[var(--color-primary)] font-bold">{{ payment?.receiver_id }}</span></div>
        <div><span class="text-[var(--color-text-secondary)]">Montant à Transférer :</span> <strong class="text-[var(--color-text-primary)] text-sm">{{ formatMoney(payment?.amount) }}</strong></div>
      </div>

      <!-- Verification conditions -->
      <div class="space-y-3 pt-4 border-t border-[var(--color-border)]">
        <h4 class="text-xs font-mono uppercase font-bold text-[var(--color-text-primary)]">Conditions de Libération</h4>
        <div class="space-y-2">
          <label class="flex items-start space-x-3 text-xs text-[var(--color-text-primary)]">
            <input type="checkbox" v-model="conditions.deliveryVerified" class="w-4 h-4 text-[var(--color-primary)] bg-[var(--color-background)] border-[var(--color-border)] rounded mt-0.5" />
            <span>Le bon de livraison a été dûment émargé et validé par l'acheteur.</span>
          </label>
          <label class="flex items-start space-x-3 text-xs text-[var(--color-text-primary)]">
            <input type="checkbox" v-model="conditions.noActiveDispute" class="w-4 h-4 text-[var(--color-primary)] bg-[var(--color-background)] border-[var(--color-border)] rounded mt-0.5" />
            <span>Il n'y a aucun litige en cours ou gel de sécurité actif sur ce paiement.</span>
          </label>
        </div>
      </div>
    </div>

    <!-- ACTION BUTTON -->
    <button 
      @click="triggerReleaseConfirmation"
      :disabled="!canRelease"
      class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-mono font-bold uppercase rounded-xl text-xs tracking-wider transition shadow-lg text-center cursor-pointer"
      id="btn-release-escrow"
    >
      Libérer le paiement au vendeur
    </button>

    <!-- MODAL CONFIRMATION -->
    <ConfirmationModal 
      :show="showModal"
      title="Confirmer la libération des fonds"
      message="Attention: Cette action créditera immédiatement le compte du vendeur. Le transfert est irréversible. Êtes-vous sûr ?"
      action-label="Confirmer le transfert"
      @close="showModal = false"
      @confirm="executeRelease"
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

const conditions = ref({
  deliveryVerified: false,
  noActiveDispute: false
});

const canRelease = computed(() => {
  return conditions.value.deliveryVerified && conditions.value.noActiveDispute;
});

const showModal = ref(false);

function triggerReleaseConfirmation() {
  showModal.value = true;
}

function executeRelease() {
  paymentsStore.releasePayment(paymentId);
  toast.success('Les fonds ont été libérés et transférés au vendeur.');
  router.push('/admin/escrow');
}

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val || 0).replace('XAF', 'FCFA');
}
</script>
