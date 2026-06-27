<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Bons de Commande</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Gérez vos commandes passées auprès de vos fournisseurs.</p>
      </div>
      <router-link to="/supplier/purchases/create" class="px-4 py-2 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-lg text-sm font-semibold transition flex items-center space-x-2">
        <PlusIcon class="h-5 w-5" />
        <span>Nouveau Bon de Commande</span>
      </router-link>
    </div>

    <!-- Analytics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-5 rounded-2xl shadow-sm flex items-center space-x-4">
        <div class="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
          <DocumentTextIcon class="h-6 w-6" />
        </div>
        <div>
          <div class="text-2xl font-bold text-[var(--color-text-primary)]">{{ purchases.length }}</div>
          <div class="text-sm text-[var(--color-text-secondary)]">Total des commandes</div>
        </div>
      </div>
      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-5 rounded-2xl shadow-sm flex items-center space-x-4">
        <div class="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
          <ClockIcon class="h-6 w-6" />
        </div>
        <div>
          <div class="text-2xl font-bold text-[var(--color-text-primary)]">{{ pendingCount }}</div>
          <div class="text-sm text-[var(--color-text-secondary)]">En attente / Envoyées</div>
        </div>
      </div>
      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-5 rounded-2xl shadow-sm flex items-center space-x-4">
        <div class="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
          <CheckBadgeIcon class="h-6 w-6" />
        </div>
        <div>
          <div class="text-2xl font-bold text-[var(--color-text-primary)]">{{ receivedCount }}</div>
          <div class="text-sm text-[var(--color-text-secondary)]">Réceptionnées</div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
      <div class="p-4 border-b border-[var(--color-border)] flex flex-col sm:flex-row justify-between items-center gap-4 bg-[var(--color-surface-hover)]">
        <div class="relative w-full sm:w-96">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)]" />
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Rechercher (Numéro, Fournisseur...)" 
            class="w-full pl-10 pr-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)]"
          />
        </div>
        <select v-model="statusFilter" class="bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm focus:outline-none w-full sm:w-auto">
          <option value="ALL">Tous les statuts</option>
          <option value="Draft">Brouillon</option>
          <option value="Sent">Envoyée</option>
          <option value="Received">Réceptionnée</option>
        </select>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[var(--color-surface-hover)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)]">
              <th class="p-4">Réf. Commande</th>
              <th class="p-4">Date</th>
              <th class="p-4">Fournisseurs Impliqués</th>
              <th class="p-4 text-right">Montant (FCFA)</th>
              <th class="p-4 text-center">Statut</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr v-for="po in filteredPurchases" :key="po.id" class="hover:bg-[var(--color-surface-hover)] transition text-sm">
              <td class="p-4 font-bold text-[var(--color-primary)]">
                #{{ po.id }}
              </td>
              <td class="p-4 text-[var(--color-text-secondary)]">
                {{ po.date }}
              </td>
              <td class="p-4">
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="supId in po.supplierIds" 
                    :key="supId"
                    class="px-2 py-0.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded text-xs font-medium text-[var(--color-text-primary)]"
                  >
                    {{ getSupplierName(supId) }}
                  </span>
                </div>
                <div class="text-xs text-[var(--color-text-muted)] mt-1">
                  {{ po.items.length }} article(s)
                </div>
              </td>
              <td class="p-4 text-right font-bold text-[var(--color-text-primary)]">
                {{ formatMoney(po.amount) }}
              </td>
              <td class="p-4 text-center">
                <span 
                  class="px-2.5 py-1 rounded-full text-xs font-bold border inline-block"
                  :class="{
                    'bg-amber-500/10 text-amber-500 border-amber-500/20': po.status === 'Sent',
                    'bg-emerald-500/10 text-emerald-500 border-emerald-500/20': po.status === 'Received',
                    'bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] border-[var(--color-border)]': po.status === 'Draft'
                  }"
                >
                  {{ po.status === 'Sent' ? 'Envoyée' : (po.status === 'Received' ? 'Réceptionnée' : 'Brouillon') }}
                </span>
              </td>
              <td class="p-4 text-right">
                <button class="p-2 inline-flex items-center justify-center bg-[var(--color-surface-elevated)] hover:bg-[var(--color-primary-muted)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] rounded-lg transition border border-[var(--color-border)]">
                  <EyeIcon class="h-4 w-4" />
                </button>
              </td>
            </tr>
            <tr v-if="filteredPurchases.length === 0">
              <td colspan="6" class="p-8 text-center text-[var(--color-text-muted)]">
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
import { purchases, b2b_suppliers } from '@/utils/supplier_db';
import { 
  PlusIcon, DocumentTextIcon, ClockIcon, CheckBadgeIcon, 
  MagnifyingGlassIcon, EyeIcon 
} from '@heroicons/vue/24/outline';

const searchQuery = ref('');
const statusFilter = ref('ALL');

const pendingCount = computed(() => purchases.value.filter(p => p.status === 'Sent').length);
const receivedCount = computed(() => purchases.value.filter(p => p.status === 'Received').length);

const filteredPurchases = computed(() => {
  return purchases.value.filter(p => {
    const matchStatus = statusFilter.value === 'ALL' || p.status === statusFilter.value;
    const searchLow = searchQuery.value.toLowerCase();
    
    // Check if ID matches
    let matchSearch = p.id.toLowerCase().includes(searchLow);
    
    // Check if any supplier name matches
    if (!matchSearch) {
      const supNames = p.supplierIds.map(id => getSupplierName(id).toLowerCase());
      matchSearch = supNames.some(name => name.includes(searchLow));
    }

    return matchStatus && matchSearch;
  });
});

function getSupplierName(id) {
  const sup = b2b_suppliers.value.find(s => s.id === id);
  return sup ? sup.name : id;
}

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR').format(val);
}
</script>
