<template>
  <div class="space-y-6">
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Catalogue Produits</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Gérez vos articles en vente (B2C), fixez vos prix et surveillez vos stocks.</p>
      </div>
      <router-link to="/vendor/products/create" class="px-4 py-2 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-lg text-sm font-semibold transition flex items-center space-x-2 shadow-sm">
        <PlusIcon class="h-5 w-5" />
        <span>Nouveau Produit</span>
      </router-link>
    </div>

    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
      <div class="p-4 border-b border-[var(--color-border)] flex flex-col sm:flex-row justify-between items-center gap-4 bg-[var(--color-surface-hover)]">
        <div class="relative w-full sm:w-96">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)]" />
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Rechercher (Nom, Code-barres)..." 
            class="w-full pl-10 pr-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)]"
          />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[var(--color-surface-hover)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)]">
              <th class="p-4">Image</th>
              <th class="p-4">Produit & Code-barres</th>
              <th class="p-4">Catégorie</th>
              <th class="p-4 text-right">Prix de vente</th>
              <th class="p-4 text-center">Stock</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr v-for="prod in paginatedProducts" :key="prod.id" class="hover:bg-[var(--color-surface-hover)]/60 transition text-sm">
              <td class="p-4">
                <div class="w-12 h-12 rounded-lg border border-[var(--color-border)] overflow-hidden bg-white flex items-center justify-center">
                  <img :src="prod.image" :alt="prod.name" class="w-full h-full object-contain" />
                </div>
              </td>
              <td class="p-4">
                <div class="font-bold text-[var(--color-text-primary)]">{{ prod.name }}</div>
                <div class="text-xs text-[var(--color-text-muted)] mt-1 font-mono">{{ prod.barcode }}</div>
              </td>
              <td class="p-4 text-[var(--color-text-secondary)]">
                <span class="px-2 py-1 bg-[var(--color-background)] border border-[var(--color-border)] rounded-md text-xs">{{ prod.category }}</span>
              </td>
              <td class="p-4 text-right font-bold text-[var(--color-text-primary)]">
                {{ formatMoney(prod.price) }}
              </td>
              <td class="p-4 text-center">
                <span class="px-2.5 py-1 rounded-full text-xs font-bold border inline-block" :class="prod.stock > (prod.minStock || 10) ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'">
                  {{ prod.stock }}
                </span>
              </td>
              <td class="p-4 text-right space-x-2 whitespace-nowrap">
                <router-link :to="`/vendor/products/${prod.id}/edit`" class="p-2 inline-flex items-center justify-center bg-[var(--color-surface-elevated)] hover:bg-[var(--color-primary-muted)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] rounded-lg transition border border-[var(--color-border)]" title="Modifier">
                  <PencilIcon class="h-4 w-4" />
                </router-link>
                <button @click.prevent="itemToDelete = prod; showDeleteModal = true;" class="p-2 inline-flex items-center justify-center bg-[var(--color-surface-elevated)] hover:bg-red-500/10 text-[var(--color-text-secondary)] hover:text-red-500 rounded-lg transition border border-[var(--color-border)]" title="Supprimer">
                  <TrashIcon class="h-4 w-4" />
                </button>
              </td>
            </tr>
            <tr v-if="paginatedProducts.length === 0">
              <td colspan="6" class="p-8 text-center text-[var(--color-text-muted)]">Aucun produit trouvé.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-4" v-if="filteredProducts.length > 0">
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
      message="Êtes-vous sûr de vouloir supprimer ce produit de votre catalogue B2C ?"
      action-label="Supprimer"
      :require-reason="false"
      @close="showDeleteModal = false; itemToDelete = null;"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { vendor_products } from '@/utils/vendor_db.js';
import { PlusIcon, MagnifyingGlassIcon, TrashIcon, PencilIcon } from '@heroicons/vue/24/outline';
import Pagination from '@/components/Pagination.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';
import { useToast } from 'vue-toastification';

const toast = useToast();

const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 8;

const filteredProducts = computed(() => {
  if (!searchQuery.value) return vendor_products.value;
  const q = searchQuery.value.toLowerCase();
  return vendor_products.value.filter(p => p.name.toLowerCase().includes(q) || p.barcode.includes(q));
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredProducts.value.slice(start, start + itemsPerPage);
});

watch(filteredProducts, () => {
  currentPage.value = 1;
});

const showDeleteModal = ref(false);
const itemToDelete = ref(null);

function confirmDelete() {
  if (itemToDelete.value) {
    vendor_products.value = vendor_products.value.filter(p => p.id !== itemToDelete.value.id);
    itemToDelete.value = null;
    showDeleteModal.value = false;
    toast.success('Produit supprimé.');
  }
}

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('XAF', 'FCFA');
}
</script>

