<template>
  <div class="space-y-6">

    <!-- HEADER BLOCK -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5 shrink-0">
      <div>
        <h1 class="text-xl font-bold font-mono text-[var(--color-text-primary)] flex items-center gap-2">
          Inventaire du Catalogue Global des Matières
        </h1>
        <p class="text-xs text-[var(--color-text-secondary)]">Navigateur de catalogue en lecture seule pour les niveaux de stock du système et les catégories régionales.</p>
      </div>

      <router-link 
        to="/admin/products/moderation"
        class="px-3.5 py-2 bg-[var(--color-primary)] hover:opacity-90 text-xs font-sans font-bold uppercase rounded-lg text-white transition flex items-center space-x-2 shrink-0"
      >
        <span>Accéder à la Modération de Sécurité &rarr;</span>
      </router-link>
    </div>

    <!-- MAIN PRODUCT STATISTICS -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs">
      <div class="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-center shadow-sm">
        <span class="text-[var(--color-text-secondary)] uppercase tracking-wider block font-bold">Articles Disponibles</span>
        <span class="text-xl font-bold text-[var(--color-text-primary)] mt-1 block">{{ availableCount }}</span>
      </div>
      <div class="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-center shadow-sm">
        <span class="text-[var(--color-text-secondary)] uppercase tracking-wider block font-bold">Alertes Stock Faible</span>
        <span class="text-xl font-bold text-orange-500 mt-1 block">{{ lowStockCount }}</span>
      </div>
      <div class="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-center shadow-sm">
        <span class="text-[var(--color-text-secondary)] uppercase tracking-wider block font-bold">Épuisé / Suspendu</span>
        <span class="text-xl font-bold text-red-500 mt-1 block">{{ outOfStockCount }}</span>
      </div>
    </div>

    <!-- SEARCH & CONTROLS -->
    <div class="flex flex-col sm:flex-row items-center gap-3 bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border)] shadow-sm">
      <div class="relative flex-1 w-full">
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="Rechercher un article, code SKU..."
          class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2.5 pl-8 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-primary)] transition"
        />
        <span class="absolute left-3 top-3 text-[var(--color-text-secondary)]">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </span>
      </div>

      <select 
        v-model="selectedCategory"
        class="bg-[var(--color-background)] text-xs text-[var(--color-text-primary)] rounded-lg p-2.5 border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] w-full sm:w-48"
      >
        <option value="">Toutes Catégories</option>
        <option v-for="cat in uniqueCategories" :key="cat.id" :value="cat.id">
          {{ cat.sector }} ({{ cat.name.split(' - ')[0] }})
        </option>
      </select>
    </div>

    <!-- CATALOG TABLE -->
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs font-sans">
          <thead>
             <tr class="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)] bg-[var(--color-surface-hover)]">
              <th class="p-3 pl-5">SKU Produit</th>
              <th class="p-3">Titre & Description</th>
              <th class="p-3 text-right">Prix (FCFA)</th>
              <th class="p-3 text-right">Stock</th>
              <th class="p-3">Modération</th>
              <th class="p-3">Statut</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr 
              v-for="p in paginatedProducts" 
              :key="p.id"
              class="hover:bg-[var(--color-surface-hover)]/40 text-[var(--color-text-primary)] transition"
            >
              <td class="p-3 pl-5 font-mono text-[10px] text-[var(--color-primary)] font-semibold">{{ p.sku || 'CMR-PROP-' + p.id.toUpperCase() }}</td>
              <td class="p-3">
                <div class="font-bold text-[var(--color-text-primary)] text-sm">{{ p.name }}</div>
                <div class="text-[11px] text-[var(--color-text-secondary)] line-clamp-1 italic">{{ p.description }}</div>
              </td>
              <td class="p-3 text-right font-mono">{{ formatCurrency(p.price) }}</td>
              <td class="p-3 text-right font-mono font-bold" :class="p.stock < 100 ? 'text-orange-500' : 'text-[var(--color-text-primary)]'">
                {{ p.stock }} <span class="text-[9px] font-normal font-sans text-[var(--color-text-secondary)]">{{ p.unit || 'kg' }}</span>
              </td>
              <td class="p-3 font-mono">
                <span 
                  class="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase border"
                  :class="p.moderationStatus === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : (p.moderationStatus === 'Suspended' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20')"
                >
                  {{ p.moderationStatus === 'Approved' ? 'Approuvé' : p.moderationStatus === 'Suspended' ? 'Suspendu' : 'En attente' }}
                </span>
              </td>
              <td class="p-3 font-mono">
                <span 
                  class="h-1.5 w-1.5 rounded-full inline-block mr-1"
                  :class="p.stock > 0 && p.moderationStatus === 'Approved' ? 'bg-emerald-500' : 'bg-red-500'"
                ></span>
                {{ p.stock > 0 && p.moderationStatus === 'Approved' ? 'Disponible' : 'Indisponible' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- PAGINATION ACCORDION FOOTER -->
    <div class="flex items-center justify-between text-xs font-mono text-[var(--color-text-secondary)] py-4 border-t border-[var(--color-border)] ml-1 shrink-0">
      <div class="flex items-center space-x-2">
        <button 
          @click="page = Math.max(1, page - 1)" 
          class="px-2.5 py-1 bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded text-[10px] transition text-[var(--color-text-primary)]"
          :disabled="page === 1"
        >
          &larr; Précédent
        </button>
        <span>Page {{ page }} sur {{ totalPages }}</span>
        <button 
          @click="page = Math.min(totalPages, page + 1)" 
          class="px-2.5 py-1 bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded text-[10px] transition text-[var(--color-text-primary)]"
          :disabled="page === totalPages"
        >
          Suivant &rarr;
        </button>
      </div>
      <span>Total d'articles filtrés : {{ finalFiltered.length }}</span>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { products } from '@/utils/supplier_db.js';
import { categories } from '@/utils/seed_data.js';

const searchQuery = ref('');
const selectedCategory = ref('');
const page = ref(1);
const limit = 20;

const uniqueCategories = computed(() => categories.slice(0, 15));

const availableCount = computed(() => {
  return products.value.filter(p => p.stock > 0 && p.status === 'available').length;
});

const lowStockCount = computed(() => {
  return products.value.filter(p => p.stock > 0 && p.stock < 200).length;
});

const outOfStockCount = computed(() => {
  return products.value.filter(p => p.stock === 0 || p.status === 'out_of_stock' || p.moderationStatus === 'Suspended').length;
});

const finalFiltered = computed(() => {
  return products.value.filter(p => {
    if (selectedCategory.value && p.categoryId !== selectedCategory.value) return false;
    
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku?.toLowerCase().includes(q);
      return matchName || matchSku;
    }
    return true;
  });
});

const totalPages = computed(() => {
  return Math.ceil(finalFiltered.value.length / limit) || 1;
});

const paginatedProducts = computed(() => {
  const startIdx = (page.value - 1) * limit;
  return finalFiltered.value.slice(startIdx, startIdx + limit);
});

function formatCurrency(v) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(v);
}
</script>
