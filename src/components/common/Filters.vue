<template>
  <div class="space-y-6" role="search" aria-label="Catalog Filtering System">
    <div class="flex justify-between items-center border-b border-slate-800 pb-3 mb-2">
      <span class="text-base font-mono font-bold text-slate-200 uppercase tracking-widest flex items-center">
        <FunnelIcon class="h-5 w-5 mr-2 text-emerald-450" aria-hidden="true" />
        Advanced Audits
      </span>
      <button 
        @click="$emit('reset')" 
        class="text-sm font-mono text-emerald-400 hover:text-emerald-300 uppercase font-bold"
        v-show="hasActiveFilters"
        aria-label="Reset all search filters"
      >
        Reset [×]
      </button>
    </div>

    <!-- SECTOR SELECTOR -->
    <div class="space-y-3">
      <label class="block text-sm font-mono uppercase tracking-wider text-slate-500">Agricultural Sector</label>
      <slot name="categories"></slot>
    </div>

    <!-- PRICE RANGE SLIDER -->
    <div class="space-y-3">
      <div class="flex justify-between items-center">
        <label class="text-sm font-mono uppercase tracking-wider text-slate-500">Max Bid Base Price</label>
        <span class="text-base font-mono text-emerald-400 font-bold">{{ formatCFA(maxPrice) }}</span>
      </div>
      
      <input 
        type="range" 
        :value="maxPrice"
        @input="$emit('update:maxPrice', Number($event.target.value))"
        :min="0"
        :max="maxLimit"
        class="w-full accent-emerald-500 cursor-pointer h-2 bg-white dark:bg-slate-950 rounded-none border border-slate-800"
        aria-label="Maximum price threshold slider"
      />
      
      <div class="flex justify-between text-xs font-mono text-slate-500">
        <span>0 CFA</span>
        <span>Max: {{ formatCFA(maxLimit) }}</span>
      </div>
    </div>

    <!-- ORIGIN REGION SELECTOR -->
    <div class="space-y-2">
      <label class="block text-sm font-mono uppercase tracking-wider text-slate-500">Local Area Hub</label>
      <div class="relative">
        <select 
          :value="selectedCity"
          @change="$emit('update:selectedCity', $event.target.value)"
          class="w-full bg-white dark:bg-slate-950 border border-slate-800 rounded-none px-4 py-3 text-base text-slate-300 focus:outline-none focus:border-emerald-500 font-mono"
          aria-label="Select origin region hub"
        >
          <option value="">(All Cameroon Origin Hubs)</option>
          <option v-for="c in cities" :key="c" :value="c">
            Bassin d'axe {{ c }}
          </option>
        </select>
      </div>
    </div>

    <!-- AVAILABILITY RADIO CHIPS -->
    <div class="space-y-2">
      <label class="block text-sm font-mono uppercase tracking-wider text-slate-500">Stock Availability</label>
      <div class="grid grid-cols-2 gap-2 font-mono text-sm">
        <button 
          @click="$emit('update:stockOnly', false)"
          class="py-2.5 px-4 border text-center transition"
          :class="!stockOnly ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400' : 'bg-transparent border-slate-800 text-slate-500 hover:text-slate-200'"
          aria-label="Show all wholesale lots"
        >
          All Lots
        </button>
        <button 
          @click="$emit('update:stockOnly', true)"
          class="py-2.5 px-4 border text-center transition"
          :class="stockOnly ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400' : 'bg-transparent border-slate-800 text-slate-500 hover:text-slate-200'"
          aria-label="Show in-stock lots only"
        >
          In Stock Only
        </button>
      </div>
    </div>

    <!-- SORT ORDERS -->
    <div class="space-y-2">
      <label class="block text-sm font-mono uppercase tracking-wider text-slate-500">Sort Priority</label>
      <div class="relative">
        <select 
          :value="sortBy"
          @change="$emit('update:sortBy', $event.target.value)"
          class="w-full bg-white dark:bg-slate-950 border border-slate-800 rounded-none px-4 py-3 text-base text-slate-300 focus:outline-none focus:border-emerald-500 font-mono"
          aria-label="Choose catalog sort order"
        >
          <option value="name_asc">Alphabetical (A - Z)</option>
          <option value="price_asc">Wholesale Price (Low to High)</option>
          <option value="price_desc">Wholesale Price (High to Low)</option>
          <option value="stock_desc">Highest Stock Volume</option>
          <option value="created_desc">Newly Harvested/Listed</option>
        </select>
      </div>
    </div>
  </div>
</template>


<script setup>
import { FunnelIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  maxPrice: { type: Number, required: true },
  maxLimit: { type: Number, default: 500000 },
  selectedCity: { type: String, default: '' },
  cities: { type: Array, default: () => [] },
  stockOnly: { type: Boolean, default: false },
  sortBy: { type: String, default: 'name_asc' },
  hasActiveFilters: { type: Boolean, default: false }
});

defineEmits([
  'reset', 
  'update:maxPrice', 
  'update:selectedCity', 
  'update:stockOnly', 
  'update:sortBy'
]);

function formatCFA(val) {
  if (val === undefined || val === null) return '0 CFA';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('FCFA', 'CFA').replace('XAF', 'CFA');
}
</script>
