<template>
  <div class="space-y-6 max-w-7xl mx-auto" id="buyer-orders-index">
    <!-- PANEL HEADER -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 gap-4 shadow-sm">
      <div>
        <div class="flex items-center space-x-2">
          <span class="text-xs font-mono bg-[var(--color-primary-muted)] text-[var(--color-primary)] px-2.5 py-0.5 rounded-full border border-[var(--color-primary-border)] font-bold uppercase">
            Mes Commandes Émises
          </span>
        </div>
        <h1 class="text-lg font-bold text-[var(--color-text-primary)] mt-1">Historique des Commandes</h1>
        <p class="text-xs text-[var(--color-text-secondary)] mt-0.5">Suivez vos bons de commande émis vers les vendeurs de la plateforme.</p>
      </div>

      <!-- Filters & Search -->
      <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Rechercher par référence..." 
          class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-2 text-xs font-mono text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] w-full sm:w-60"
        />
        <select 
          v-model="statusFilter"
          class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-3 py-2 text-xs font-mono text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] w-full sm:w-44"
        >
          <option value="ALL">Tous les statuts</option>
          <option value="PENDING">En attente</option>
          <option value="VALIDATED">Validée</option>
          <option value="PROCESSING">En cours</option>
          <option value="DELIVERED">Livrée</option>
          <option value="CANCELLED">Annulée</option>
        </select>
      </div>
    </div>

    <!-- ORDERS DATA TABLE -->
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse" id="orders-table">
          <thead>
            <tr class="bg-[var(--color-surface-elevated)] border-b border-[var(--color-border)] text-xs font-mono text-[var(--color-text-secondary)] uppercase">
              <th class="p-4">Référence</th>
              <th class="p-4">Vendeur (Vendor)</th>
              <th class="p-4">Date d'Émission</th>
              <th class="p-4 text-center">Statut</th>
              <th class="p-4 text-right">Montant TTC</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="order in filteredOrders" 
              :key="order.id"
              class="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition text-sm font-medium"
            >
              <td class="p-4 font-mono font-bold text-[var(--color-text-primary)]">
                #{{ order.reference }}
              </td>
              <td class="p-4 text-[var(--color-text-primary)]">
                {{ order.receiver_id }}
              </td>
              <td class="p-4 text-[var(--color-text-secondary)] font-mono">
                {{ formatDate(order.date_emission) }}
              </td>
              <td class="p-4 text-center">
                <span class="px-3 py-1 rounded-full text-xs font-mono tracking-wide uppercase font-bold" :class="getStatusClasses(order.status)">
                  {{ order.status }}
                </span>
              </td>
              <td class="p-4 text-right font-mono font-bold text-[var(--color-text-primary)]">
                {{ formatMoney(order.total) }}
              </td>
              <td class="p-4 text-right space-x-2">
                <router-link 
                  :to="'/buyer/orders/' + order.id"
                  class="inline-flex items-center justify-center p-2 bg-[var(--color-surface-elevated)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] rounded-xl border border-[var(--color-border)] transition"
                  title="Voir détails de la commande"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </router-link>

                <router-link
                  v-if="['PROCESSING', 'DELIVERED'].includes(order.status)"
                  :to="'/buyer/confirm-delivery/' + order.id"
                  class="inline-flex items-center justify-center p-2 bg-[var(--color-primary-muted)] text-[var(--color-primary)] rounded-xl border border-[var(--color-primary-border)] transition"
                  title="Suivre et émarger"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </router-link>
              </td>
            </tr>
            <tr v-if="filteredOrders.length === 0">
              <td colspan="6" class="p-8 text-center text-sm text-[var(--color-text-secondary)] font-mono italic">
                Aucun bon de commande trouvé.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useOrdersStore } from '@/store/modules/orders.js';

const ordersStore = useOrdersStore();
const searchQuery = ref('');
const statusFilter = ref('ALL');

const filteredOrders = computed(() => {
  return ordersStore.purchaseOrders.filter(o => {
    // Only buyer purchases
    const isBuyerOrder = o.emitter_type === 'buyer';
    const matchStatus = statusFilter.value === 'ALL' || o.status === statusFilter.value;
    const matchQuery = !searchQuery.value || o.reference.toLowerCase().includes(searchQuery.value.toLowerCase());
    return isBuyerOrder && matchStatus && matchQuery;
  });
});

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val || 0).replace('XAF', 'FCFA');
}

function formatDate(dateVal) {
  if (!dateVal) return 'N/A';
  return new Date(dateVal).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function getStatusClasses(stat) {
  const classes = {
    'PENDING': 'bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-500/20',
    'VALIDATED': 'bg-indigo-100 text-indigo-800 border border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-500/20',
    'PROCESSING': 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-500/20',
    'DELIVERED': 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-500/20',
    'CANCELLED': 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-500/20',
    'REFUSED': 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-500/20'
  };
  return classes[stat] || 'bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-950/20 dark:text-slate-400 dark:border-slate-500/20';
}
</script>
