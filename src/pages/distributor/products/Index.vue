<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Catalogue Grossiste</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Gérez vos produits, fixez vos prix de gros et analysez vos marges.</p>
      </div>
      <router-link to="/distributor/products/create" class="px-4 py-2 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-lg text-sm font-semibold transition flex items-center space-x-2">
        <PlusIcon class="h-5 w-5" />
        <span>Nouveau Produit</span>
      </router-link>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-5 rounded-2xl shadow-sm flex items-center space-x-4">
        <div class="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
          <ArchiveBoxIcon class="h-6 w-6" />
        </div>
        <div>
          <div class="text-2xl font-bold text-[var(--color-text-primary)]">{{ products.length }}</div>
          <div class="text-sm text-[var(--color-text-secondary)]">Produits Référencés</div>
        </div>
      </div>
      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-5 rounded-2xl shadow-sm flex items-center space-x-4">
        <div class="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
          <BanknotesIcon class="h-6 w-6" />
        </div>
        <div>
          <div class="text-2xl font-bold text-[var(--color-text-primary)]">15%</div>
          <div class="text-sm text-[var(--color-text-secondary)]">Marge Moyenne</div>
        </div>
      </div>
      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-5 rounded-2xl shadow-sm flex items-center space-x-4">
        <div class="p-3 bg-red-500/10 text-red-500 rounded-xl">
          <ExclamationTriangleIcon class="h-6 w-6" />
        </div>
        <div>
          <div class="text-2xl font-bold text-[var(--color-text-primary)]">2</div>
          <div class="text-sm text-[var(--color-text-secondary)]">Stock d'alerte</div>
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
            placeholder="Rechercher par nom, SKU..." 
            class="w-full pl-10 pr-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)]"
          />
        </div>
        <select v-model="categoryFilter" class="bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm focus:outline-none w-full sm:w-auto text-[var(--color-text-primary)]">
          <option value="ALL">Toutes les catégories</option>
          <option value="Intrants Agricoles">Intrants Agricoles</option>
          <option value="Équipement">Équipement</option>
          <option value="Emballages">Emballages</option>
        </select>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[var(--color-surface-hover)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)]">
              <th class="p-4">Produit</th>
              <th class="p-4">SKU / Catégorie</th>
              <th class="p-4 text-center">Stock Global</th>
              <th class="p-4 text-right">Prix Achat</th>
              <th class="p-4 text-right">Prix Gros</th>
              <th class="p-4 text-center">Marge</th>
              <th class="p-4 text-center">Statut</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr v-for="p in paginatedProducts" :key="p.id" class="hover:bg-[var(--color-surface-hover)] transition text-sm">
              <td class="p-4">
                <div class="flex items-center space-x-3">
                  <div class="h-10 w-10 bg-[var(--color-surface-hover)] rounded border border-[var(--color-border)] overflow-hidden">
                    <img :src="p.image || 'https://placehold.co/100'" alt="Produit" class="h-full w-full object-cover" />
                  </div>
                  <span class="font-bold text-[var(--color-text-primary)] truncate max-w-[200px]" :title="p.name">
                    {{ p.name }}
                  </span>
                </div>
              </td>
              <td class="p-4">
                <div class="text-[var(--color-text-primary)] font-mono text-xs">{{ p.id }}</div>
                <div class="text-[var(--color-text-secondary)] text-xs mt-1">{{ p.category }}</div>
              </td>
              <td class="p-4 text-center">
                <span class="font-bold text-[var(--color-text-primary)]" :class="p.stock < 100 ? 'text-red-500' : ''">{{ p.stock }}</span>
                <span class="text-xs text-[var(--color-text-muted)] ml-1">unités</span>
              </td>
              <td class="p-4 text-right font-medium text-[var(--color-text-secondary)]">
                {{ formatMoney(p.price * 0.7) }} <!-- Exemple de prix d'achat simulé -->
              </td>
              <td class="p-4 text-right font-bold text-[var(--color-primary)]">
                {{ formatMoney(p.wholesalePrice || p.price * 0.85) }}
              </td>
              <td class="p-4 text-center">
                <span class="px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded text-xs font-bold border border-blue-500/20">
                  {{ p.distributorMargin || 15 }}%
                </span>
              </td>
              <td class="p-4 text-center">
                <span class="px-2.5 py-1 rounded-full text-xs font-bold border inline-block bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                  Actif
                </span>
              </td>
              <td class="p-4 text-right">
                <button class="p-2 inline-flex items-center justify-center bg-[var(--color-surface-elevated)] hover:bg-[var(--color-primary-muted)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] rounded-lg transition border border-[var(--color-border)]">
                  <PencilIcon class="h-4 w-4" />
                </button>
                <button @click.prevent="itemToDelete = p; showDeleteModal = true;" class="p-2 ml-2 inline-flex items-center justify-center bg-[var(--color-surface-elevated)] hover:bg-red-500/10 text-[var(--color-text-secondary)] hover:text-red-500 rounded-lg transition border border-[var(--color-border)]">
                  <TrashIcon class="h-4 w-4" />
                </button>
              </td>
            </tr>
            <tr v-if="paginatedProducts.length === 0">
              <td colspan="8" class="p-8 text-center text-[var(--color-text-muted)]">
                Aucun produit ne correspond à vos critères.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-4">
        <Pagination 
          :total-items="filteredProducts.length" 
          :page-size="itemsPerPage" 
          :current-page="currentPage" 
          @update:currentPage="currentPage = $event" 
        />
      </div>
    </div>

    <ConfirmationModal
      :show="showDeleteModal"
      title="Supprimer le produit"
      message="Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible."
      action-label="Supprimer"
      :require-reason="false"
      @close="showDeleteModal = false; itemToDelete = null;"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { products } from '@/utils/distributor_db';
import { 
  PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon,
  ArchiveBoxIcon, BanknotesIcon, ExclamationTriangleIcon 
} from '@heroicons/vue/24/outline';
import Pagination from '@/components/Pagination.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';

const searchQuery = ref('');
const categoryFilter = ref('ALL');

const currentPage = ref(1);
const itemsPerPage = 10;

const showDeleteModal = ref(false);
const itemToDelete = ref(null);

function confirmDelete() {
  if (itemToDelete.value) {
    products.value = products.value.filter(p => p.id !== itemToDelete.value.id);
    itemToDelete.value = null;
    showDeleteModal.value = false;
  }
}

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchCat = categoryFilter.value === 'ALL' || p.category === categoryFilter.value;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchCat && matchSearch;
  });
});

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('XAF', 'FCFA');
}

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredProducts.value.slice(start, start + itemsPerPage);
});

watch(filteredProducts, () => {
  currentPage.value = 1;
});
</script>
