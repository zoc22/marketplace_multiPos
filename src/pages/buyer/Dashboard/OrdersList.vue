<template>
  <div class="space-y-6 max-w-7xl mx-auto" id="buyer-orders-workspace">
    <!-- PANEL HEADER -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 gap-4 shadow-sm">
      <div>
        <div class="flex items-center space-x-2">
          <span class="text-xs font-mono bg-[var(--color-primary-muted)] text-[var(--color-primary)] px-2.5 py-0.5 rounded-full border border-[var(--color-primary-border)] font-bold uppercase">
            Espace Client Acheteur
          </span>
        </div>
        <h1 class="text-lg font-bold text-[var(--color-text-primary)] mt-1">Historique de mes commandes</h1>
        <p class="text-xs text-[var(--color-text-secondary)] mt-0.5">Consultez l'historique archivé de vos commandes de livraison.</p>
      </div>
      <!-- Search Input -->
      <div class="relative w-full md:w-80">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Rechercher par référence..." 
          class="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-2 text-xs font-mono text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
        />
      </div>
    </div>

    <!-- FILTER CLASSIFICATION TABS -->
    <div class="flex border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-1 rounded-xl shadow-sm">
      <button 
        v-for="tab in tabFilters" 
        :key="tab.value"
        @click="activeStatusFilter = tab.value"
        class="flex-1 py-2 text-xs font-mono font-medium rounded-lg transition uppercase"
        :class="activeStatusFilter === tab.value ? 'bg-[var(--color-primary-muted)] text-[var(--color-primary)] border border-[var(--color-primary-border)] font-bold' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- ORDERS DATA TABLE -->
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm">
      <div class="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
        <h3 class="text-sm font-mono uppercase font-bold text-[var(--color-text-primary)]">Archive des Commandes</h3>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse" id="orders-table">
          <thead>
            <tr class="bg-[var(--color-surface-elevated)] border-b border-[var(--color-border)] text-xs font-mono text-[var(--color-text-secondary)] uppercase">
              <th class="p-4">Référence</th>
              <th class="p-4">Date de Création</th>
              <th class="p-4 text-right">Valeur TTC</th>
              <th class="p-4 text-center">Statut Fret</th>
              <th class="p-4 text-center">Facturation</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="order in filteredOrders" 
              :key="order.id"
              class="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition text-sm font-medium"
              :id="'row-' + order.id"
            >
              <td class="p-4 font-mono font-bold text-[var(--color-text-primary)]">
                <router-link :to="'/buyer/orders/' + order.id" class="hover:text-[var(--color-primary)] flex items-center space-x-1.5">
                  <svg class="w-4 h-4 text-[var(--color-primary)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <span>{{ order.reference }}</span>
                </router-link>
              </td>
              <td class="p-4 text-[var(--color-text-secondary)] font-mono">{{ formatDate(order.created_at) }}</td>
              <td class="p-4 text-right font-mono font-bold text-[var(--color-text-primary)]">
                {{ formatMoney(order.total) }}
              </td>
              <td class="p-4 text-center">
                <span class="px-3 py-1 rounded-full text-xs font-mono tracking-wide uppercase font-bold" :class="getStatusClasses(order.status)">
                  {{ translateStatus(order.status) }}
                </span>
              </td>
              <td class="p-4 text-center">
                <span class="px-3 py-1 rounded-full text-xs font-mono border uppercase font-bold" :class="getPaymentStatusClasses(order.paymentStatus || 'Escrow_Held')">
                  {{ translatePaymentStatus(order.paymentStatus || 'Escrow_Held') }}
                </span>
              </td>
              <td class="p-4 text-right space-x-2">
                <router-link 
                  :to="'/buyer/orders/' + order.id"
                  class="inline-flex items-center justify-center p-2 bg-[var(--color-surface-elevated)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] rounded-xl border border-[var(--color-border)] transition"
                  title="Afficher les détails de la commande"
                >
                  <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </router-link>
              </td>
            </tr>

            <tr v-if="filteredOrders.length === 0">
              <td colspan="6" class="p-8 text-center text-sm text-[var(--color-text-secondary)] font-mono italic">
                Aucune commande enregistrée.
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
import { orders as dbOrders } from '@/utils/supplier_db.js';

const activeStatusFilter = ref('ALL');
const searchQuery = ref('');

const tabFilters = [
  { label: 'Toutes les Commandes', value: 'ALL' },
  { label: 'En attente', value: 'Submitted' },
  { label: 'En Transit', value: 'Shipped' },
  { label: 'Livrées & Clôturées', value: 'Delivered' }
];

const buyerOrders = computed(() => {
  return dbOrders.value || [];
});

const filteredOrders = computed(() => {
  let list = buyerOrders.value;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(o => o.reference.toLowerCase().includes(q));
  }
  if (activeStatusFilter.value === 'ALL') {
    return list;
  }
  if (activeStatusFilter.value === 'Shipped') {
    return list.filter(o => ['Shipped', 'Preparing', 'Packed'].includes(o.status));
  }
  return list.filter(o => o.status === activeStatusFilter.value);
});

function formatMoney(val) {
  if (!val && val !== 0) return '-';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('XAF', 'FCFA');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
}

function translateStatus(stat) {
  const m = {
    'Draft': 'Brouillon',
    'Submitted': 'Reçu / En attente de validation',
    'Approved': 'Approuvé par le fournisseur',
    'Preparing': 'En préparation entrepôt',
    'Packed': 'Colis emballé / BL généré',
    'Shipped': 'En transit',
    'Delivered': 'Livré & Validé',
    'Completed': 'Terminé',
    'Cancelled': 'Annulé'
  };
  return m[stat] || stat;
}

function getStatusClasses(stat) {
  const classes = {
    'Draft': 'bg-slate-500/20 text-slate-300 border border-slate-500/30',
    'Submitted': 'bg-indigo-500/25 text-indigo-300 border border-indigo-500/40',
    'Approved': 'bg-teal-500/25 text-teal-300 border border-teal-500/40',
    'Preparing': 'bg-pink-500/25 text-pink-300 border border-pink-500/40',
    'Packed': 'bg-blue-500/25 text-blue-300 border border-blue-500/40',
    'Shipped': 'bg-sky-500/25 text-sky-300 border border-sky-500/40',
    'Delivered': 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40',
    'Completed': 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40',
    'Cancelled': 'bg-red-500/25 text-red-300 border border-red-500/40'
  };
  return classes[stat] || 'bg-slate-500/20 text-slate-300 border border-slate-500/40';
}

function translatePaymentStatus(pStat) {
  const m = {
    'Settled': 'Transféré au Vendeur',
    'Escrow_Held': 'Séquestré par Admin',
    'Refunded': 'Remboursé'
  };
  return m[pStat] || pStat;
}

function getPaymentStatusClasses(pStat) {
  const classes = {
    'Settled': 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40',
    'Escrow_Held': 'bg-amber-500/25 text-amber-300 border border-amber-500/40',
    'Refunded': 'bg-red-500/25 text-red-300 border border-red-500/40'
  };
  return classes[pStat] || 'bg-slate-500/20 text-slate-300 border border-slate-500/40';
}
</script>
