<template>
  <div class="space-y-6 max-w-5xl mx-auto" id="admin-escrow-detail">
    <!-- PANEL HEADER / ACTIONS -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--color-border)] pb-4 gap-4 select-none">
      <div class="space-y-1">
        <router-link to="/admin/escrow" class="text-sm text-[var(--color-primary)] font-mono hover:underline flex items-center space-x-2">
          <span>&larr; Retour aux séquestres</span>
        </router-link>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
          <span>Détail du Paiement Séquestré</span>
          <span class="text-[var(--color-primary)] font-mono text-base">#{{ payment?.reference }}</span>
        </h1>
      </div>
      
      <div v-if="payment?.status === 'ESCROWED'" class="flex gap-2 shrink-0">
        <router-link
          :to="'/admin/escrow/' + paymentId + '/release'"
          class="px-4 py-2 bg-emerald-650 hover:opacity-90 text-white font-mono text-xs font-bold rounded-xl transition flex items-center space-x-1.5 cursor-pointer"
        >
          Libérer les fonds
        </router-link>
        <router-link
          :to="'/admin/escrow/' + paymentId + '/refund'"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold rounded-xl transition flex items-center space-x-1.5 cursor-pointer"
        >
          Rembourser
        </router-link>
      </div>
    </div>

    <!-- MAIN PANELS -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs font-sans text-[var(--color-text-secondary)]">
      <div class="lg:col-span-2 space-y-6">
        <!-- SPECIFICATIONS CARD -->
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 class="font-bold text-sm text-[var(--color-text-primary)] font-mono uppercase">Spécifications du Séquestre</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-[var(--color-text-secondary)] font-mono">Date d'initialisation :</span>
              <p class="font-semibold text-[var(--color-text-primary)]">{{ formatDate(payment?.date_initiated) }}</p>
            </div>
            <div>
              <span class="text-[var(--color-text-secondary)] font-mono">Date de blocage (Séquestre) :</span>
              <p class="font-semibold text-[var(--color-text-primary)]">{{ formatDate(payment?.date_escrowed) }}</p>
            </div>
            <div>
              <span class="text-[var(--color-text-secondary)] font-mono">Montant total sécurisé :</span>
              <p class="font-bold text-[var(--color-text-primary)] font-mono text-sm">{{ formatMoney(payment?.amount) }}</p>
            </div>
            <div>
              <span class="text-[var(--color-text-secondary)] font-mono">Statut du paiement :</span>
              <p class="font-bold text-[var(--color-primary)]">
                {{ payment?.status === 'INITIATED' ? 'Initié' : payment?.status === 'ESCROWED' ? 'Séquestré' : payment?.status === 'RELEASED' ? 'Libéré' : payment?.status === 'REFUNDED' ? 'Remboursé' : 'Libération en attente' }}
              </p>
            </div>
          </div>
        </div>

        <!-- ASSOCIATED ORDER DETAILS -->
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 class="font-bold text-sm text-[var(--color-text-primary)] font-mono uppercase">Commande Associée</h3>
          <div class="space-y-2">
            <div>
              <span class="text-[var(--color-text-secondary)] font-mono">Référence du Bon de commande :</span>
              <p class="font-semibold text-[var(--color-primary)]">#{{ order?.reference || 'N/A' }}</p>
            </div>
            <div>
              <span class="text-[var(--color-text-secondary)] font-mono">Payeur (Acheteur) :</span>
              <p class="font-semibold text-[var(--color-text-primary)]">{{ payment?.payer_id }}</p>
            </div>
            <div>
              <span class="text-[var(--color-text-secondary)] font-mono">Bénéficiaire (Vendeur) :</span>
              <p class="font-semibold text-[var(--color-text-primary)]">{{ payment?.receiver_id }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- SIDEBAR HISTORY -->
      <div class="space-y-6">
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 class="font-bold text-xs uppercase text-[var(--color-text-secondary)] font-mono tracking-wider">Historique du paiement</h3>
          <div class="space-y-4 pl-4 border-l border-[var(--color-border)] relative">
            <div class="relative">
              <span class="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-[var(--color-primary)] border border-[var(--color-surface)]"></span>
              <div>
                <span class="font-mono font-bold text-[var(--color-text-primary)]">Initié</span>
                <p class="text-[10px] text-[var(--color-text-secondary)]">{{ formatDate(payment?.date_initiated) }}</p>
              </div>
            </div>
            <div v-if="payment?.date_escrowed" class="relative">
              <span class="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-amber-500 border border-[var(--color-surface)]"></span>
              <div>
                <span class="font-mono font-bold text-[var(--color-text-primary)]">Séquestré</span>
                <p class="text-[10px] text-[var(--color-text-secondary)]">{{ formatDate(payment?.date_escrowed) }}</p>
              </div>
            </div>
            <div v-if="payment?.date_released" class="relative">
              <span class="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-emerald-500 border border-[var(--color-surface)]"></span>
              <div>
                <span class="font-mono font-bold text-[var(--color-text-primary)]">Libéré</span>
                <p class="text-[10px] text-[var(--color-text-secondary)]">{{ formatDate(payment?.date_released) }}</p>
              </div>
            </div>
            <div v-if="payment?.date_refunded" class="relative">
              <span class="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-red-500 border border-[var(--color-surface)]"></span>
              <div>
                <span class="font-mono font-bold text-[var(--color-text-primary)]">Remboursé</span>
                <p class="text-[10px] text-[var(--color-text-secondary)]">{{ formatDate(payment?.date_refunded) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { usePaymentsStore } from '@/store/modules/payments.js';
import { useOrdersStore } from '@/store/modules/orders.js';

const route = useRoute();
const paymentsStore = usePaymentsStore();
const ordersStore = useOrdersStore();
const paymentId = route.params.id;

const payment = computed(() => {
  return paymentsStore.escrowPayments.find(p => p.id === paymentId);
});

const order = computed(() => {
  if (!payment.value) return null;
  return ordersStore.purchaseOrders.find(o => o.id === payment.value.purchase_order_id);
});

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val || 0).replace('XAF', 'FCFA');
}

function formatDate(dateVal) {
  if (!dateVal) return 'N/A';
  return new Date(dateVal).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
</script>
