<template>
  <div class="space-y-6">

    <!-- HEADER BLOCK -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5 shrink-0">
      <div>
        <h1 class="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
          Global Material Catalog Inventory
        </h1>
        <p class="text-xs text-slate-400">Read-only catalog browser for system stock levels, regional categories, and supplier registers.</p>
      </div>

      <router-link 
        to="/admin/products/moderation"
        class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-mono font-bold uppercase rounded-lg text-white transition flex items-center space-x-2 shrink-0"
      >
        <span>Go to Safety Moderation &rarr;</span>
      </router-link>
    </div>

    <!-- MAIN PRODUCT STATISTICS -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
      <div class="p-4 bg-[#090f23] border border-[#121c3b] rounded-xl text-center">
        <span class="text-slate-500 uppercase tracking-widest block">Available Shelf Items</span>
        <span class="text-xl font-bold text-slate-100 mt-1 block">{{ availableCount }}</span>
      </div>
      <div class="p-4 bg-[#090f23] border border-[#121c3b] rounded-xl text-center">
        <span class="text-slate-505 uppercase tracking-widest block">Low Stock Alerts</span>
        <span class="text-xl font-bold text-orange-400 mt-1 block">{{ lowStockCount }}</span>
      </div>
      <div class="p-4 bg-[#090f23] border border-[#121c3b] rounded-xl text-center">
        <span class="text-slate-500 uppercase tracking-widest block">Expired / Sold Out</span>
        <span class="text-xl font-bold text-red-500 mt-1 block">{{ outOfStockCount }}</span>
      </div>
    </div>

    <!-- SEARCH & CONTROLS -->
    <div class="flex flex-col sm:flex-row items-center gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-850">
      <div class="relative flex-1 w-full">
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="Lookup material item, SKU code..."
          class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 pl-8 text-xs text-slate-100 placeholder-slate-650 focus:outline-none focus:border-indigo-500 font-mono transition"
        />
        <span class="absolute left-3 top-3 text-slate-500">&telrec;</span>
      </div>

      <select 
        v-model="selectedCategory"
        class="bg-slate-950 text-xs text-slate-350 rounded-lg p-2.5 font-mono border border-slate-800 focus:outline-none focus:border-indigo-500 w-full sm:w-48"
      >
        <option value="">All Categories</option>
        <option v-for="cat in uniqueCategories" :key="cat.id" :value="cat.id">
          {{ cat.sector }} ({{ cat.name.split(' - ')[0] }})
        </option>
      </select>
    </div>

    <!-- CATALOG TABLE -->
    <div class="bg-[#040817] border border-[#121c3b] rounded-2xl overflow-hidden shadow">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs font-sans">
          <thead>
            <tr class="text-[10px] font-mono text-slate-500 uppercase border-b border-[#121c3b] bg-slate-950/80">
              <th class="p-3 pl-5">Product SKU</th>
              <th class="p-3">Title Description</th>
              <th class="p-3 text-right">Price (XAF)</th>
              <th class="p-3 text-right">Stock</th>
              <th class="p-3">Moderation</th>
              <th class="p-3">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#121c3b]/30">
            <tr 
              v-for="p in paginatedProducts" 
              :key="p.id"
              class="hover:bg-slate-900/30 text-slate-300 transition"
            >
              <td class="p-3 pl-5 font-mono text-[10px] text-indigo-400 font-semibold">{{ p.sku || 'CMR-PROP-' + p.id.toUpperCase() }}</td>
              <td class="p-3">
                <div class="font-bold text-slate-100 text-sm">{{ p.name }}</div>
                <div class="text-[11px] text-slate-450 line-clamp-1 italic">{{ p.description }}</div>
              </td>
              <td class="p-3 text-right font-mono">{{ formatCurrency(p.price) }}</td>
              <td class="p-3 text-right font-mono font-bold" :class="p.stock < 100 ? 'text-orange-400' : 'text-slate-300'">
                {{ p.stock }} <span class="text-[9px] font-normal font-sans text-slate-500">{{ p.unit || 'kg' }}</span>
              </td>
              <td class="p-3 font-mono">
                <span 
                  class="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase border"
                  :class="p.moderationStatus === 'Approved' ? 'bg-emerald-950 text-emerald-450 border-emerald-900/30' : (p.moderationStatus === 'Suspended' ? 'bg-red-950 text-red-400 border-red-900/30' : 'bg-amber-950 text-amber-400 border-amber-900/30')"
                >
                  {{ p.moderationStatus || 'Pending' }}
                </span>
              </td>
              <td class="p-3 font-mono">
                <span 
                  class="h-1.5 w-1.5 rounded-full inline-block mr-1"
                  :class="p.stock > 0 && p.moderationStatus === 'Approved' ? 'bg-emerald-500' : 'bg-red-500'"
                ></span>
                {{ p.stock > 0 && p.moderationStatus === 'Approved' ? 'Available' : 'Unavailable' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- PAGINATION ACCORDION FOOTER -->
    <div class="flex items-center justify-between text-xs font-mono text-slate-500 py-4 border-t border-slate-900 ml-1 shrink-0">
      <div class="flex items-center space-x-2">
        <button 
          @click="page = Math.max(1, page - 1)" 
          class="px-2.5 py-1 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded text-[10px] transition"
          :disabled="page === 1"
        >
          &larr; Prev
        </button>
        <span>Page {{ page }} of {{ totalPages }}</span>
        <button 
          @click="page = Math.min(totalPages, page + 1)" 
          class="px-2.5 py-1 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded text-[10px] transition"
          :disabled="page === totalPages"
        >
          Next &rarr;
        </button>
      </div>
      <span>Total listed items filtered: {{ finalFiltered.length }}</span>
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
