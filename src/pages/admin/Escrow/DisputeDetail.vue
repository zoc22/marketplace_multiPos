<template>
  <div class="space-y-6 max-w-5xl mx-auto text-slate-300" id="admin-dispute-detail">
    <!-- PANEL HEADER -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4 select-none">
      <div class="space-y-1">
        <router-link to="/admin/escrow/disputes" class="text-sm text-indigo-405 font-mono hover:underline flex items-center space-x-2">
          <span>&larr; Retour aux litiges</span>
        </router-link>
        <h1 class="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <span>Arbitrage du Litige</span>
          <span class="text-indigo-400 font-mono text-base">#{{ dispute?.reference }}</span>
        </h1>
      </div>
    </div>

    <!-- MAIN BODY -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs font-sans">
      <div class="lg:col-span-8 space-y-6">
        <!-- SPECIFICATIONS CARD -->
        <div class="bg-[#14141E] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 class="font-bold text-sm text-slate-100 font-mono uppercase">Détails de la réclamation</h3>
          <div class="space-y-2">
            <div>
              <span class="text-slate-500 font-mono">Motif du litige :</span>
              <p class="font-semibold text-slate-200 text-sm">{{ dispute?.reason }}</p>
            </div>
            <div>
              <span class="text-slate-500 font-mono">Déclaration descriptive :</span>
              <p class="text-slate-300 leading-normal">{{ dispute?.description }}</p>
            </div>
          </div>
        </div>

        <!-- RESOLUTION CENTER -->
        <div v-if="dispute?.status === 'OPEN'" class="bg-[#14141E] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 class="font-bold text-sm text-slate-100 font-mono uppercase">Arbitrage &amp; Décision</h3>
          <p class="text-slate-400">Sélectionnez la résolution finale de ce conflit commercial.</p>

          <div class="flex flex-wrap gap-3 font-mono">
            <button 
              @click="confirmResolution('RELEASE_FUNDS')"
              class="px-4 py-2 bg-emerald-650 hover:bg-emerald-700 text-white rounded-xl text-xs uppercase font-bold transition"
            >
              Libérer les fonds au vendeur
            </button>
            <button 
              @click="confirmResolution('REFUND_FULL')"
              class="px-4 py-2 bg-red-650 hover:bg-red-700 text-white rounded-xl text-xs uppercase font-bold transition"
            >
              Rembourser totalement l'acheteur
            </button>
            <button 
              @click="confirmResolution('REFUND_PARTIAL')"
              class="px-4 py-2 bg-indigo-650 hover:bg-indigo-750 text-white rounded-xl text-xs uppercase font-bold transition"
            >
              Arbitrage partagé (50/50)
            </button>
          </div>
        </div>

        <div v-else class="p-4 bg-slate-900/50 border border-slate-800 rounded-xl text-center font-mono">
          ✓ Litige résolu par arbitrage : <strong>{{ dispute?.resolution }}</strong> le {{ formatDate(dispute?.date_resolved) }}
        </div>
      </div>

      <!-- ESCROW METADATA INFO -->
      <div class="lg:col-span-4 space-y-6">
        <div class="bg-[#14141E] border border-slate-800 rounded-2xl p-6 space-y-3">
          <h3 class="font-bold text-xs uppercase text-slate-400 font-mono tracking-wider">Informations financières</h3>
          <div class="divide-y divide-slate-800 text-[11px] font-mono">
            <div class="py-2 flex justify-between">
              <span>Référence Séquestre :</span>
              <span class="text-indigo-400 font-bold">{{ payment?.reference }}</span>
            </div>
            <div class="py-2 flex justify-between">
              <span>Montant Séquestré :</span>
              <span class="text-slate-100 font-bold">{{ formatMoney(payment?.amount) }}</span>
            </div>
            <div class="py-2 flex justify-between">
              <span>Payeur :</span>
              <span class="text-slate-200">{{ payment?.payer_id }}</span>
            </div>
            <div class="py-2 flex justify-between">
              <span>Bénéficiaire :</span>
              <span class="text-slate-200">{{ payment?.receiver_id }}</span>
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
  router.push('/admin/escrow/disputes');
}

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val || 0).replace('XAF', 'FCFA');
}

function formatDate(dateVal) {
  if (!dateVal) return 'N/A';
  return new Date(dateVal).toLocaleDateString('fr-FR');
}
</script>
