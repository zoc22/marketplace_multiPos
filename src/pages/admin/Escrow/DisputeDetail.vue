<template>
  <div class="space-y-6 max-w-5xl mx-auto text-[var(--color-text-secondary)] font-sans" id="admin-dispute-detail">
    <!-- PANEL HEADER -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--color-border)] pb-4 gap-4 select-none">
      <div class="space-y-1">
        <router-link to="/admin/disputes" class="text-sm text-[var(--color-primary)] font-mono hover:underline flex items-center space-x-2">
          <span>&larr; Retour aux litiges</span>
        </router-link>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
          <span>Arbitrage du Litige</span>
          <span class="text-[var(--color-primary)] font-mono text-base">#{{ dispute?.reference }}</span>
        </h1>
      </div>
    </div>

    <!-- MAIN BODY -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs font-sans">
      <div class="lg:col-span-8 space-y-6">
        <!-- SPECIFICATIONS CARD -->
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 class="font-bold text-sm text-[var(--color-text-primary)] font-mono uppercase">Détails de la réclamation</h3>
          <div class="space-y-2">
            <div>
              <span class="text-[var(--color-text-secondary)] font-mono">Motif du litige :</span>
              <p class="font-semibold text-[var(--color-text-primary)] text-sm">{{ dispute?.reason }}</p>
            </div>
            <div>
              <span class="text-[var(--color-text-secondary)] font-mono">Déclaration descriptive :</span>
              <p class="text-[var(--color-text-primary)] leading-normal">{{ dispute?.description }}</p>
            </div>
          </div>
        </div>

        <!-- RESOLUTION CENTER -->
        <div v-if="dispute?.status === 'OPEN'" class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 class="font-bold text-sm text-[var(--color-text-primary)] font-mono uppercase">Arbitrage &amp; Décision</h3>
          <p class="text-[var(--color-text-secondary)]">Sélectionnez la résolution finale de ce conflit commercial.</p>

          <div class="flex flex-wrap gap-3 font-mono">
            <button 
              @click="confirmResolution('RELEASE_FUNDS')"
              class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs uppercase font-bold transition cursor-pointer"
            >
              Libérer les fonds au vendeur
            </button>
            <button 
              @click="confirmResolution('REFUND_FULL')"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs uppercase font-bold transition cursor-pointer"
            >
              Rembourser totalement l'acheteur
            </button>
            <button 
              @click="confirmResolution('REFUND_PARTIAL')"
              class="px-4 py-2 bg-[var(--color-primary)] hover:opacity-90 text-[var(--color-text-primary)] rounded-xl text-xs uppercase font-bold transition cursor-pointer"
            >
              Arbitrage partagé (50/50)
            </button>
          </div>
        </div>

        <div v-else class="p-4 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl text-center font-mono text-[var(--color-text-primary)]">
          ✓ Litige résolu par arbitrage : <strong>{{ dispute?.resolution === 'RELEASE_FUNDS' ? 'Libération des fonds au vendeur' : dispute?.resolution === 'REFUND_FULL' ? 'Remboursement total de l\'acheteur' : 'Arbitrage partagé (50/50)' }}</strong> le {{ formatDate(dispute?.date_resolved) }}
        </div>
      </div>

      <!-- ESCROW METADATA INFO -->
      <div class="lg:col-span-4 space-y-6">
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 space-y-3 shadow-sm">
          <h3 class="font-bold text-xs uppercase text-[var(--color-text-secondary)] font-mono tracking-wider">Informations financières</h3>
          <div class="divide-y divide-[var(--color-border)] text-[11px] font-mono">
            <div class="py-2 flex justify-between">
              <span>Référence Séquestre :</span>
              <span class="text-[var(--color-primary)] font-bold">{{ payment?.reference }}</span>
            </div>
            <div class="py-2 flex justify-between">
              <span>Montant Séquestré :</span>
              <span class="text-[var(--color-text-primary)] font-bold">{{ formatMoney(payment?.amount) }}</span>
            </div>
            <div class="py-2 flex justify-between">
              <span>Payeur :</span>
              <span class="text-[var(--color-text-primary)]">{{ payment?.payer_id }}</span>
            </div>
            <div class="py-2 flex justify-between">
              <span>Bénéficiaire :</span>
              <span class="text-[var(--color-text-primary)]">{{ payment?.receiver_id }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL CONFIRMATION -->
    <ConfirmationModal 
      :show="showModal"
      title="Confirmer la résolution du litige"
      message="Attention: Cette action est finale et irréversible. Les fonds seront distribués immédiatement selon le mode d'arbitrage sélectionné."
      action-label="Appliquer l'arbitrage"
      @close="showModal = false"
      @confirm="executeArbitration"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDisputesStore } from '@/store/modules/disputes.js';
import { usePaymentsStore } from '@/store/modules/payments.js';
import { useToast } from 'vue-toastification';
import ConfirmationModal from '@/components/ConfirmationModal.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const disputesStore = useDisputesStore();
const paymentsStore = usePaymentsStore();
const disputeId = route.params.id;

const dispute = computed(() => {
  return disputesStore.disputes.find(d => d.id === disputeId);
});

const payment = computed(() => {
  if (!dispute.value) return null;
  return paymentsStore.escrowPayments.find(p => p.id === dispute.value.escrow_payment_id);
});

const showModal = ref(false);
const pendingResolution = ref('');

function confirmResolution(resolutionType) {
  pendingResolution.value = resolutionType;
  showModal.value = true;
}

function executeArbitration() {
  disputesStore.resolveDispute(disputeId, pendingResolution.value);
  toast.success('Le litige a été résolu. Les fonds ont été répartis.');
  router.push('/admin/disputes');
}

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val || 0).replace('XAF', 'FCFA');
}

function formatDate(dateVal) {
  if (!dateVal) return 'N/A';
  return new Date(dateVal).toLocaleDateString('fr-FR');
}
</script>
