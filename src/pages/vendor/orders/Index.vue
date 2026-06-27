<template>
  <div class="space-y-6">
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Historique des Ventes (Commandes B2C)</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Gérez toutes vos ventes, qu'elles proviennent du point de vente (POS) ou de commandes en ligne.</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-5 rounded-2xl shadow-sm flex items-center space-x-4 min-w-0">
        <div class="p-3 bg-blue-500/10 text-blue-500 rounded-xl shrink-0">
          <ShoppingCartIcon class="h-6 w-6" />
        </div>
        <div class="min-w-0 flex-1">
          <div class="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] truncate" :title="transactions.length">{{ transactions.length }}</div>
          <div class="text-sm text-[var(--color-text-secondary)] truncate" :title="'Total des ventes'">Total des ventes</div>
        </div>
      </div>
      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-5 rounded-2xl shadow-sm flex items-center space-x-4 min-w-0">
        <div class="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl shrink-0">
          <BanknotesIcon class="h-6 w-6" />
        </div>
        <div class="min-w-0 flex-1">
          <div class="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] truncate" :title="formatMoney(totalRevenue)">{{ formatMoney(totalRevenue) }}</div>
          <div class="text-sm text-[var(--color-text-secondary)] truncate" :title="'Chiffre d\'Affaires'">Chiffre d'Affaires</div>
        </div>
      </div>
    </div>

    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
      <div class="p-4 border-b border-[var(--color-border)] flex flex-col sm:flex-row justify-between items-center gap-4 bg-[var(--color-surface-hover)]">
        <div class="relative w-full sm:w-96">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)]" />
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Rechercher (N° Commande, Session)..." 
            class="w-full pl-10 pr-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)]"
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
            <tr v-for="tx in paginatedTransactions" :key="tx.id" class="hover:bg-[var(--color-surface-hover)] transition text-sm">
              <td class="p-4 font-bold text-[var(--color-primary)]">{{ tx.id }}</td>
              <td class="p-4 text-[var(--color-text-secondary)]">{{ new Date(tx.date).toLocaleString('fr-FR') }}</td>
              <td class="p-4 text-[var(--color-text-secondary)]">
                <span class="px-2.5 py-1 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-md text-xs font-medium">{{ tx.sessionId || 'Web' }}</span>
              </td>
              <td class="p-4 text-center text-[var(--color-text-secondary)]">
                {{ tx.items.reduce((sum, i) => sum + i.quantity, 0) }}
              </td>
              <td class="p-4 text-right font-bold text-[var(--color-text-primary)]">
                {{ formatMoney(tx.total) }}
              </td>
              <td class="p-4 text-center">
                <span class="px-2.5 py-1 rounded-full text-xs font-bold border inline-block" :class="{
                  'bg-emerald-500/10 text-emerald-600 border-emerald-500/20': tx.status === 'Completed',
                  'bg-amber-500/10 text-amber-600 border-amber-500/20': tx.status === 'Pending',
                  'bg-blue-500/10 text-blue-600 border-blue-500/20': tx.status === 'Shipped',
                  'bg-red-500/10 text-red-600 border-red-500/20': tx.status === 'Cancelled'
                }">
                  {{ tx.status === 'Pending' ? 'En attente' : tx.status === 'Completed' ? 'Complétée' : tx.status === 'Shipped' ? 'Expédiée' : tx.status }}
                </span>
              </td>
              <td class="p-4 text-right space-x-2 whitespace-nowrap">
                <button @click.prevent="openTxDetails(tx)" class="p-2 inline-flex items-center justify-center bg-[var(--color-surface-elevated)] hover:bg-[var(--color-primary-muted)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] rounded-lg transition border border-[var(--color-border)]" title="Voir détails">
                  <EyeIcon class="h-4 w-4" />
                </button>
                <router-link v-if="tx.type === 'Online' && tx.status === 'Pending'" :to="`/vendor/orders/${tx.id}/prepare`" class="p-2 inline-flex items-center justify-center bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-white rounded-lg transition border border-amber-500/20" title="Préparer l'expédition">
                  <WrenchIcon class="h-4 w-4" />
                </router-link>
              </td>
            </tr>
            <tr v-if="paginatedTransactions.length === 0">
              <td colspan="7" class="p-8 text-center text-[var(--color-text-muted)]">Aucune vente trouvée.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-4" v-if="filteredTransactions.length > 0">
        <Pagination 
          :total-items="filteredTransactions.length" 
          :page-size="itemsPerPage" 
          :current-page="currentPage" 
          @update:currentPage="currentPage = $event" 
        />
      </div>
    </div>

    <!-- TX DETAILS MODAL -->
    <div v-if="isDetailsModalOpen && selectedTx" @click.self="isDetailsModalOpen = false" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm cursor-pointer">
      <div class="bg-[var(--color-surface)] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-[var(--color-border)] flex flex-col cursor-default">
        <div class="p-6 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-surface-elevated)]">
          <div>
            <h3 class="text-xl font-bold text-[var(--color-text-primary)]">Transaction {{ selectedTx.id }}</h3>
            <p class="text-xs text-[var(--color-text-secondary)] mt-1">{{ new Date(selectedTx.date).toLocaleString('fr-FR') }}</p>
          </div>
          <button @click="isDetailsModalOpen = false" class="text-[var(--color-text-muted)] hover:text-red-500"><XMarkIcon class="h-6 w-6"/></button>
        </div>
        
        <div class="p-6 overflow-y-auto max-h-[60vh] bg-[var(--color-background)]">
          <h4 class="font-bold text-sm text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">Client & Livraison</h4>
          <div class="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl mb-4 text-sm space-y-1">
            <div><span class="text-[var(--color-text-secondary)]">Nom :</span> <span class="font-bold">{{ selectedTx.customerName || 'Client Comptant' }}</span></div>
            <div v-if="selectedTx.shippingAddress"><span class="text-[var(--color-text-secondary)]">Adresse :</span> <span class="font-medium">{{ selectedTx.shippingAddress }}</span></div>
            <div><span class="text-[var(--color-text-secondary)]">Canal :</span> <span class="px-2 py-0.5 bg-[var(--color-primary-muted)] text-[var(--color-primary)] text-xs rounded font-bold">{{ selectedTx.type || 'POS' }}</span></div>
          </div>

          <h4 class="font-bold text-sm text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">Articles</h4>
          <div class="space-y-3 mb-6">
            <div v-for="(item, idx) in selectedTx.items" :key="idx" class="flex justify-between items-center p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
              <div>
                <div class="font-bold text-sm text-[var(--color-text-primary)]">{{ item.product.name }}</div>
                <div class="text-xs text-[var(--color-text-secondary)]">{{ item.quantity }} x {{ formatMoney(item.product.price) }}</div>
              </div>
              <div class="font-bold text-[var(--color-text-primary)]">
                {{ formatMoney(item.quantity * item.product.price * (1 - item.discountPercent/100)) }}
              </div>
            </div>
          </div>

          <h4 class="font-bold text-sm text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">Paiements</h4>
          <div class="space-y-2 mb-6">
            <div v-for="(pm, idx) in selectedTx.payments" :key="idx" class="flex justify-between p-2 bg-[var(--color-surface-hover)] rounded-lg text-sm border border-[var(--color-border)]">
              <span class="font-bold text-[var(--color-text-secondary)]">{{ pm.method }}</span>
              <span class="font-bold text-[var(--color-text-primary)]">{{ formatMoney(pm.amount) }}</span>
            </div>
          </div>

          <div class="border-t border-[var(--color-border)] pt-4 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-[var(--color-text-secondary)]">Sous-total</span>
              <span class="font-medium text-[var(--color-text-primary)]">{{ formatMoney(selectedTx.subtotal) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-[var(--color-text-secondary)]">Remises</span>
              <span class="font-medium text-red-500">- {{ formatMoney(selectedTx.discount) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-[var(--color-text-secondary)]">TVA</span>
              <span class="font-medium text-[var(--color-text-primary)]">{{ formatMoney(selectedTx.tax) }}</span>
            </div>
            <div class="flex justify-between text-lg font-black pt-2 border-t border-[var(--color-border)]">
              <span>TOTAL TTC</span>
              <span class="text-[var(--color-primary)]">{{ formatMoney(selectedTx.total) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { transactions } from '@/utils/vendor_db.js';
import { ShoppingCartIcon, BanknotesIcon, MagnifyingGlassIcon, EyeIcon, XMarkIcon, WrenchIcon } from '@heroicons/vue/24/outline';
import Pagination from '@/components/Pagination.vue';

const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;

const filteredTransactions = computed(() => {
  if (!searchQuery.value) return transactions.value.slice().reverse(); // Show latest first
  const q = searchQuery.value.toLowerCase();
  return transactions.value.filter(t => t.id.toLowerCase().includes(q) || (t.sessionId && t.sessionId.toLowerCase().includes(q))).reverse();
});

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredTransactions.value.slice(start, start + itemsPerPage);
});

watch(filteredTransactions, () => {
  currentPage.value = 1;
});

const totalRevenue = computed(() => transactions.value.reduce((sum, tx) => sum + tx.total, 0));

const isDetailsModalOpen = ref(false);
const selectedTx = ref(null);

function openTxDetails(tx) {
  selectedTx.value = tx;
  isDetailsModalOpen.value = true;
}

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('XAF', 'FCFA');
}
</script>
