<template>
  <div class="space-y-6 max-w-7xl mx-auto" id="supplier-orders-desk">
    <!-- PANEL HEADER -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 relative overflow-hidden select-none shadow-sm">
      <div class="flex items-center space-x-3 mb-2">
        <span class="text-[10px] font-bold bg-[var(--color-primary-muted)] text-[var(--color-primary)] px-3 py-1 rounded-full uppercase tracking-wider">
          Commandes Clients
        </span>
      </div>
      <h1 class="text-xl font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
        <DocumentTextIcon class="h-6 w-6 text-[var(--color-primary)]" />
        <span>Expédition et Traitement des Commandes</span>
      </h1>
      <p class="text-sm text-[var(--color-text-secondary)] mt-1">Validez les commandes, organisez la préparation en entrepôt et lancez l'expédition.</p>
    </div>

    <!-- METRICS KPI DASHBOARD -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-fade-in-up">
      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] hover:border-[var(--color-primary-border)] rounded-2xl p-5 transition duration-300 shadow-sm">
        <span class="text-xs font-semibold text-[var(--color-text-secondary)]">Commandes reçues</span>
        <div class="flex items-baseline space-x-2 mt-3">
          <span class="text-2xl font-bold text-[var(--color-text-primary)]">{{ supplierOrders.length }}</span>
          <span class="text-xs text-[var(--color-text-muted)] font-medium">dossiers</span>
        </div>
      </div>
      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] hover:border-amber-500/50 rounded-2xl p-5 transition duration-300 shadow-sm">
        <span class="text-xs font-semibold text-[var(--color-text-secondary)]">À valider</span>
        <div class="flex items-baseline space-x-2 mt-3">
          <span class="text-2xl font-bold text-amber-500">{{ countByStatus('Submitted') }}</span>
          <span class="text-xs text-[var(--color-text-muted)] font-medium">bons soumis</span>
        </div>
      </div>
      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] hover:border-[var(--color-primary-border)] rounded-2xl p-5 transition duration-300 shadow-sm">
        <span class="text-xs font-semibold text-[var(--color-text-secondary)]">En préparation (FIFO)</span>
        <div class="flex items-baseline space-x-2 mt-3">
          <span class="text-2xl font-bold text-[var(--color-primary)]">{{ countByStatus('Preparing') + countByStatus('Approved') }}</span>
          <span class="text-xs text-[var(--color-text-muted)] font-medium">à colisier</span>
        </div>
      </div>
      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] hover:border-sky-500/50 rounded-2xl p-5 transition duration-300 shadow-sm">
        <span class="text-xs font-semibold text-[var(--color-text-secondary)]">En transit</span>
        <div class="flex items-baseline space-x-2 mt-3">
          <span class="text-2xl font-bold text-sky-500">{{ countByStatus('Shipped') }}</span>
          <span class="text-xs text-[var(--color-text-muted)] font-medium">expédiés</span>
        </div>
      </div>
    </div>

    <!-- FILTER CLASSIFIER TABS -->
    <div class="flex flex-wrap border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-1.5 rounded-xl gap-1">
      <button 
        v-for="tab in tabFilters" 
        :key="tab.value"
        @click="activeFilter = tab.value"
        class="flex-1 min-w-[120px] py-2 px-3 text-sm font-medium rounded-lg transition"
        :class="activeFilter === tab.value ? 'bg-[var(--color-primary)] text-white shadow' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- INCOMING DISPATCHES TABLE -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm animate-fade-in-up">
      <div class="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
        <h3 class="text-sm font-bold text-[var(--color-text-primary)]">Journal logistique</h3>
        <span class="text-xs text-[var(--color-text-muted)]">Aiguillage multisites</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse" id="supplier-orders-table">
          <thead>
            <tr class="bg-[var(--color-surface-hover)] border-b border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
              <th class="p-4">Référence</th>
              <th class="p-4">Acheteur</th>
              <th class="p-4">Date de dépôt</th>
              <th class="p-4">Articles</th>
              <th class="p-4 text-right">Montant TTC</th>
              <th class="p-4 text-center">Statut</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr 
              v-for="order in paginatedOrders" 
              :key="order.id"
              class="hover:bg-[var(--color-surface-hover)] transition text-sm text-[var(--color-text-primary)]"
              :id="'supplier-row-' + order.id"
            >
              <td class="p-4 font-bold text-[var(--color-primary)]">
                <router-link :to="'/supplier/orders/' + order.id" class="hover:underline flex items-center space-x-1.5">
                  <DocumentIcon class="h-4 w-4" />
                  <span>{{ order.reference }}</span>
                </router-link>
              </td>
              <td class="p-4 font-semibold text-[var(--color-text-primary)]">
                <div>
                  <span class="block">{{ order.clientCompany || order.clientName }}</span>
                  <span class="text-xs text-[var(--color-text-muted)] font-normal block mt-0.5">ID: {{ order.clientId }}</span>
                </div>
              </td>
              <td class="p-4 text-[var(--color-text-secondary)]">{{ formatDate(order.created_at) }}</td>
              <td class="p-4 text-[var(--color-text-secondary)]">
                <span class="truncate max-w-xs block">
                  {{ getOrderLineText(order) }}
                </span>
              </td>
              <td class="p-4 text-right font-bold text-[var(--color-text-primary)]">
                {{ formatMoney(order.total) }}
              </td>
              <td class="p-4 text-center">
                <span class="px-3 py-1 rounded-full text-xs font-semibold border" :class="getStatusClasses(order.status)">
                  {{ translateStatus(order.status) }}
                </span>
              </td>
              <td class="p-4 text-right">
                <div class="flex items-center justify-end space-x-2">
                  <router-link 
                    :to="'/supplier/orders/' + order.id" 
                    class="px-3 py-1.5 bg-[var(--color-surface-hover)] hover:bg-[var(--color-primary-muted)] text-[var(--color-primary)] font-semibold text-xs rounded-lg border border-[var(--color-border)] transition inline-flex items-center space-x-1.5"
                    :id="'btn-sup-view-' + order.id"
                  >
                    <EyeIcon class="h-4 w-4" />
                    <span>Analyser</span>
                  </router-link>

                  <!-- Step 2: Fulfill / Assign FIFO batches -->
                  <router-link
                    v-if="order.status === 'Approved' || order.status === 'Preparing'"
                    :to="'/supplier/orders/' + order.id + '/prepare'"
                    class="px-3 py-1.5 bg-[var(--color-primary)] text-white hover:opacity-90 font-semibold text-xs rounded-lg transition animate-pulse inline-flex items-center space-x-1.5"
                    :id="'btn-sup-prep-' + order.id"
                  >
                    <QueueListIcon class="h-4 w-4" />
                    <span>Colisage</span>
                  </router-link>
                  
                  <router-link
                    v-else-if="order.status === 'Packed'"
                    to="/supplier/logistics"
                    class="px-3 py-1.5 bg-blue-500 text-white hover:bg-blue-600 font-semibold text-xs rounded-lg transition inline-flex items-center space-x-1.5"
                    :id="'btn-sup-dispatch-' + order.id"
                  >
                    <TruckIcon class="h-4 w-4" />
                    <span>Expédier</span>
                  </router-link>
                </div>
              </td>
            </tr>

            <tr v-if="filteredOrders.length === 0">
              <td colspan="7" class="p-8 text-center text-sm text-[var(--color-text-muted)] italic">
                Aucun dossier logistique pour cette catégorie.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Real pagination with count -->
      <div v-if="totalPages > 1" class="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface-hover)] flex justify-between items-center text-sm">
        <span class="text-[var(--color-text-secondary)] font-medium">Page {{ currentPage }} sur {{ totalPages }}</span>
        <div class="flex space-x-2">
          <button 
            @click="currentPage > 1 ? currentPage-- : null"
            :disabled="currentPage === 1"
            class="px-4 py-2 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg disabled:opacity-50 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition"
          >
            Précédent
          </button>
          <button 
            @click="currentPage < totalPages ? currentPage++ : null"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg disabled:opacity-50 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { orders as dbOrders } from '@/utils/supplier_db.js';
import { 
  DocumentTextIcon, 
  DocumentIcon, 
  EyeIcon, 
  QueueListIcon, 
  TruckIcon 
} from '@heroicons/vue/24/outline';

const activeFilter = ref('ALL');
const currentPage = ref(1);
const itemsPerPage = 8;

const tabFilters = [
  { label: 'Tous les flux', value: 'ALL' },
  { label: 'Reçus (À valider)', value: 'Submitted' },
  { label: 'Approuvés (À préparer)', value: 'Approved' },
  { label: 'Emballés (Prêts)', value: 'Packed' },
  { label: 'En Transit', value: 'Shipped' },
  { label: 'Livrés', value: 'Delivered' }
];

const supplierOrders = computed(() => {
  return dbOrders.value || [];
});

const filteredOrders = computed(() => {
  if (activeFilter.value === 'ALL') {
    return supplierOrders.value;
  }
  return supplierOrders.value.filter(o => o.status === activeFilter.value);
});

const totalPages = computed(() => {
  return Math.ceil(filteredOrders.value.length / itemsPerPage) || 1;
});

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredOrders.value.slice(start, start + itemsPerPage);
});

function countByStatus(status) {
  return supplierOrders.value.filter(o => o.status === status).length;
}

function getOrderLineText(order) {
  return order.items.map(i => `${i.productName || i.name} (x${i.quantity || i.qty})`).join(', ');
}

// Formatters
function formatMoney(val) {
  if (!val && val !== 0) return '-';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('XAF', 'FCFA');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function translateStatus(stat) {
  const m = {
    'Draft': 'Brouillon',
    'Submitted': 'Reçu',
    'Approved': 'Validé',
    'Preparing': 'En préparation',
    'Packed': 'Prêt',
    'Shipped': 'En transit',
    'Delivered': 'Livré',
    'Cancelled': 'Annulé'
  };
  return m[stat] || stat;
}

function getStatusClasses(stat) {
  const classes = {
    'Draft': 'bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] border-[var(--color-border)]',
    'Submitted': 'bg-[var(--color-primary-muted)] text-[var(--color-primary)] border-[var(--color-primary-border)]',
    'Approved': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    'Preparing': 'bg-pink-500/10 text-pink-500 border-pink-500/20',
    'Packed': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'Shipped': 'bg-sky-500/10 text-sky-500 border-sky-500/20',
    'Delivered': 'bg-teal-500/10 text-teal-500 border-teal-500/20',
    'Cancelled': 'bg-red-500/10 text-red-500 border-red-500/20'
  };
  return classes[stat] || 'bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] border-[var(--color-border)]';
}
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.4s ease-out forwards;
}
</style>
