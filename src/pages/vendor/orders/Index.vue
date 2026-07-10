<template>
  <div class="space-y-6">
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Historique des Commandes &amp; Ventes</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Gérez vos ventes au comptoir (POS), vos commandes web B2C et vos commandes de gros B2B reçues.</p>
      </div>
    </div>

    <!-- Toggle Tabs -->
    <div class="flex border-b border-[var(--color-border)] space-x-6 text-sm font-semibold">
      <button 
        @click="activeTab = 'b2c'"
        class="pb-3 transition border-b-2"
        :class="activeTab === 'b2c' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'"
      >
        Ventes B2C (POS &amp; En Ligne)
      </button>
      <button 
        @click="activeTab = 'b2b'"
        class="pb-3 transition border-b-2 flex items-center space-x-2"
        :class="activeTab === 'b2b' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'"
      >
        <span>Commandes de gros reçues</span>
        <span v-if="pendingB2BCount > 0" class="px-1.5 py-0.5 bg-amber-500 text-white rounded-full text-[10px] font-black leading-none">
          {{ pendingB2BCount }}
        </span>
      </button>
    </div>

    <!-- TAB 1: B2C Transactions -->
    <div v-if="activeTab === 'b2c'" class="space-y-6">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-5 rounded-2xl shadow-sm flex items-center space-x-4 min-w-0">
          <div class="p-3 bg-blue-500/10 text-blue-500 rounded-xl shrink-0">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <div class="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] truncate">{{ transactions.length }}</div>
            <div class="text-sm text-[var(--color-text-secondary)] truncate">Total des ventes</div>
          </div>
        </div>
        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-5 rounded-2xl shadow-sm flex items-center space-x-4 min-w-0">
          <div class="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl shrink-0">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <div class="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] truncate">{{ formatMoney(totalRevenue) }}</div>
            <div class="text-sm text-[var(--color-text-secondary)] truncate">Chiffre d'Affaires</div>
          </div>
        </div>
      </div>

      <!-- B2C Table -->
      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
        <div class="p-4 border-b border-[var(--color-border)] flex flex-col sm:flex-row justify-between items-center gap-4 bg-[var(--color-surface-hover)]">
          <div class="relative w-full sm:w-96">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              v-model="searchQuery"
              placeholder="Rechercher (N° Commande, Session)..." 
              class="w-full pl-10 pr-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text-primary)]"
            />
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[var(--color-surface-hover)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)]">
                <th class="p-4">N° Transaction</th>
                <th class="p-4">Date</th>
                <th class="p-4">Session POS / Canal</th>
                <th class="p-4 text-center">Articles</th>
                <th class="p-4 text-right">Montant TTC</th>
                <th class="p-4 text-center">Statut</th>
                <th class="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[var(--color-border)]">
              <tr v-for="tx in paginatedTransactions" :key="tx.id" class="hover:bg-[var(--color-surface-hover)]/40 transition text-sm text-[var(--color-text-primary)]">
                <td class="p-4 font-bold text-[var(--color-primary)]">#{{ tx.id }}</td>
                <td class="p-4 text-[var(--color-text-secondary)]">{{ new Date(tx.date).toLocaleString('fr-FR') }}</td>
                <td class="p-4 text-[var(--color-text-secondary)]">
                  <span class="px-2.5 py-1 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-md text-xs font-medium">{{ tx.sessionId || 'Web' }}</span>
                </td>
                <td class="p-4 text-center text-[var(--color-text-secondary)]">
                  {{ tx.items.reduce((sum, i) => sum + i.quantity, 0) }}
                </td>
                <td class="p-4 text-right font-bold text-[var(--color-text-primary)] font-mono">
                  {{ formatMoney(tx.total) }}
                </td>
                <td class="p-4 text-center">
                  <span 
                    class="px-2.5 py-1 rounded-full text-xs font-bold border inline-block"
                    :class="{
                      'bg-emerald-500/10 text-emerald-500 border-emerald-500/20': tx.status === 'Completed',
                      'bg-amber-500/10 text-amber-500 border-amber-500/20': tx.status === 'Pending',
                      'bg-blue-500/10 text-blue-500 border-blue-500/20': tx.status === 'Shipped',
                      'bg-red-500/10 text-red-500 border-red-500/20': tx.status === 'Cancelled'
                    }"
                  >
                    {{ tx.status === 'Pending' ? 'En attente' : tx.status === 'Completed' ? 'Complétée' : tx.status === 'Shipped' ? 'Expédiée' : tx.status }}
                  </span>
                </td>
                <td class="p-4 text-right space-x-2 whitespace-nowrap">
                  <button @click.prevent="openTxDetails(tx)" class="p-2 inline-flex items-center justify-center bg-[var(--color-surface-elevated)] hover:bg-[var(--color-primary-muted)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] rounded-lg transition border border-[var(--color-border)] cursor-pointer" title="Voir détails">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <router-link v-if="tx.type === 'Online' && tx.status === 'Pending'" :to="`/vendor/orders/${tx.id}/prepare`" class="p-2 inline-flex items-center justify-center bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-white rounded-lg transition border border-amber-500/20 cursor-pointer" title="Préparer l'expédition">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </router-link>
                </td>
              </tr>
              <tr v-if="paginatedTransactions.length === 0">
                <td colspan="7" class="p-8 text-center text-[var(--color-text-secondary)] italic">Aucune vente B2C trouvée.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 2: B2B Received Orders -->
    <div v-if="activeTab === 'b2b'" class="space-y-6">
      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
        <div class="p-4 border-b border-[var(--color-border)] bg-[var(--color-surface-hover)]">
          <h3 class="font-bold text-sm text-[var(--color-text-primary)]">Suivi des commandes en gros reçues</h3>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[var(--color-surface-hover)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)]">
                <th class="p-4">Référence BC</th>
                <th class="p-4">Date de commande</th>
                <th class="p-4">Client</th>
                <th class="p-4 text-center">Produits</th>
                <th class="p-4 text-right">Valeur</th>
                <th class="p-4 text-center">Statut</th>
                <th class="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[var(--color-border)]">
              <tr v-for="po in b2bOrders" :key="po.id" class="hover:bg-[var(--color-surface-hover)]/40 transition text-sm text-[var(--color-text-primary)]">
                <td class="p-4 font-bold text-[var(--color-primary)] font-mono">#{{ po.reference }}</td>
                <td class="p-4 text-[var(--color-text-secondary)]">{{ formatDate(po.date_emission) }}</td>
                <td class="p-4">
                  <span class="font-bold block">{{ po.emitter_id }}</span>
                  <span class="text-xs text-[var(--color-text-secondary)] uppercase font-mono">Type : {{ po.emitter_type }}</span>
                </td>
                <td class="p-4 text-center text-[var(--color-text-secondary)]">{{ po.products?.length || 0 }}</td>
                <td class="p-4 text-right font-mono font-bold">{{ formatMoney(po.total) }}</td>
                <td class="p-4 text-center">
                  <span 
                    class="px-2.5 py-1 rounded-full text-xs font-bold border inline-block"
                    :class="{
                      'bg-amber-500/10 text-amber-500 border-amber-500/20': po.status === 'PENDING',
                      'bg-blue-500/10 text-blue-500 border-blue-500/20': po.status === 'PROCESSING',
                      'bg-emerald-500/10 text-emerald-500 border-emerald-500/20': po.status === 'VALIDATED' || po.status === 'DELIVERED',
                      'bg-red-500/10 text-red-500 border-red-500/20': po.status === 'REFUSED' || po.status === 'CANCELLED'
                    }"
                  >
                    {{ po.status }}
                  </span>
                </td>
                <td class="p-4 text-right space-x-2 whitespace-nowrap">
                  <router-link 
                    :to="'/vendor/orders/b2b/' + po.id" 
                    class="p-2 inline-flex items-center justify-center bg-[var(--color-surface-elevated)] hover:bg-[var(--color-primary-muted)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] rounded-lg transition border border-[var(--color-border)] cursor-pointer"
                    title="Voir détails & Imprimer"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </router-link>
                  <router-link 
                    v-if="po.status === 'PENDING' || po.status === 'VALIDATED'"
                    :to="`/vendor/orders/b2b/${po.id}/prepare`" 
                    class="p-2 inline-flex items-center justify-center bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-lg transition border border-emerald-500/20 cursor-pointer"
                    title="Préparer & Générer BL"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </router-link>
                </td>
              </tr>
              <tr v-if="b2bOrders.length === 0">
                <td colspan="7" class="p-8 text-center text-[var(--color-text-secondary)] italic">Aucune commande B2B reçue.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- B2C Transaction Details Modal -->
    <div v-if="isDetailsModalOpen && selectedTx" @click.self="isDetailsModalOpen = false" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm cursor-pointer">
      <div class="bg-[var(--color-surface)] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-[var(--color-border)] flex flex-col max-h-[90vh] cursor-default">
        <div class="p-6 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-surface-elevated)]">
          <h3 class="text-lg font-bold text-[var(--color-text-primary)]">Détail de la vente B2C #{{ selectedTx.id }}</h3>
          <button @click="isDetailsModalOpen = false" class="text-[var(--color-text-muted)] hover:text-red-500 cursor-pointer">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-6 bg-[var(--color-background)]">
          <div class="grid grid-cols-2 gap-4 text-xs font-mono bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border)] text-[var(--color-text-primary)]">
            <div><strong>Date :</strong> {{ new Date(selectedTx.date).toLocaleString('fr-FR') }}</div>
            <div><strong>Mode :</strong> {{ selectedTx.type }}</div>
            <div><strong>Session :</strong> {{ selectedTx.sessionId || 'Boutique en ligne' }}</div>
            <div><strong>Client :</strong> {{ selectedTx.customerName || 'Anonyme' }}</div>
            <div class="col-span-2" v-if="selectedTx.shippingAddress"><strong>Adresse :</strong> {{ selectedTx.shippingAddress }}</div>
          </div>

          <table class="w-full text-left text-sm border-collapse">
            <thead>
              <tr class="bg-[var(--color-surface-hover)] text-xs text-[var(--color-text-secondary)] font-bold border-b border-[var(--color-border)]">
                <th class="p-3">Désignation</th>
                <th class="p-3 text-center">Quantité</th>
                <th class="p-3 text-right">Prix Unitaire</th>
                <th class="p-3 text-right">Montant TTC</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in selectedTx.items" :key="idx" class="border-b border-[var(--color-border)] text-[var(--color-text-primary)]">
                <td class="p-3 font-semibold">{{ item.product?.name }}</td>
                <td class="p-3 text-center">{{ item.quantity }}</td>
                <td class="p-3 text-right">{{ formatMoney(item.product?.price) }}</td>
                <td class="p-3 text-right font-mono font-bold">{{ formatMoney(item.quantity * item.product?.price) }}</td>
              </tr>
            </tbody>
          </table>

          <div class="flex justify-end pt-4 border-t border-[var(--color-border)] text-sm font-mono text-[var(--color-text-primary)]">
            <div class="w-64 space-y-1 text-right">
              <div>Sous-total : {{ formatMoney(selectedTx.subtotal) }}</div>
              <div>Taxes (19.25%) : {{ formatMoney(selectedTx.tax) }}</div>
              <div class="text-base font-bold text-[var(--color-primary)] pt-2 border-t border-[var(--color-border)]">
                Total TTC : {{ formatMoney(selectedTx.total) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { transactions } from '@/utils/vendor_db.js';
import { useOrdersStore } from '@/store/modules/orders.js';
import { useAuthStore } from '@/store/modules/auth.js';

const authStore = useAuthStore();
const ordersStore = useOrdersStore();
const activeTab = ref('b2c');
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;

const selectedTx = ref(null);
const isDetailsModalOpen = ref(false);

const pendingB2BCount = computed(() => {
  return b2bOrders.value.filter(o => o.status === 'PENDING').length;
});

const b2bOrders = computed(() => {
  return ordersStore.purchaseOrders.filter(po => {
    const isPrimaryReceiver = po.receiver_id === authStore.user?.id || po.receiver_id === authStore.user?.tenant;
    const hasSupplierItem = (po.products || []).some(p => p.supplierId === authStore.user?.id || p.supplierId === authStore.user?.tenant);
    return isPrimaryReceiver || hasSupplierItem;
  });
});

const filteredTransactions = computed(() => {
  if (!searchQuery.value) return transactions.value;
  const q = searchQuery.value.toLowerCase();
  return transactions.value.filter(tx => 
    tx.id.toLowerCase().includes(q) || 
    (tx.sessionId && tx.sessionId.toLowerCase().includes(q)) ||
    (tx.customerName && tx.customerName.toLowerCase().includes(q))
  );
});

const totalRevenue = computed(() => {
  return transactions.value.reduce((sum, tx) => sum + tx.total, 0);
});

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredTransactions.value.slice(start, start + itemsPerPage);
});

function openTxDetails(tx) {
  selectedTx.value = tx;
  isDetailsModalOpen.value = true;
}

function formatMoney(amount) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(amount).replace('XAF', 'FCFA');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}
</script>
