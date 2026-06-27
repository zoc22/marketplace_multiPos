<template>
  <nav class="flex flex-col space-y-1.5" role="navigation" aria-label="Product Categories Selector">
    <button 
      @click="$emit('select-category', '')"
      class="w-full text-left px-4 py-3 rounded-none text-base font-mono transition flex justify-between items-center"
      :class="!selectedId ? 'bg-emerald-950/40 text-emerald-405 font-bold border-l-2 border-emerald-400' : 'text-slate-400 hover:bg-white dark:bg-slate-900 hover:text-slate-200'"
      aria-label="Show all product sectors"
    >
      <div class="flex items-center">
        <GlobeAltIcon class="h-5 w-5 mr-3 shrink-0" aria-hidden="true" />
        <span>ALL DEPARTMENTS</span>
      </div>
      <span class="text-xs text-slate-500 font-mono">({{ totalCount }})</span>
    </button>
    
    <button 
      v-for="cat in categories" 
      :key="cat.id"
      @click="$emit('select-category', cat.name)"
      class="w-full text-left px-4 py-3 rounded-none text-base font-mono transition flex justify-between items-center truncate"
      :class="selectedId === cat.name ? 'bg-emerald-950/40 text-emerald-405 font-bold border-l-2 border-emerald-400' : 'text-slate-405 hover:bg-white dark:bg-slate-900 hover:text-slate-205'"
      :aria-label="'Filter by category: ' + cat.name"
    >
      <div class="flex items-center truncate">
        <component :is="getIcon(cat.name)" class="h-5 w-5 mr-3 text-slate-400 shrink-0" aria-hidden="true" />
        <span class="truncate leading-none uppercase">{{ cat.name }}</span>
      </div>
      <span class="text-xs text-slate-500 ml-2 font-mono">({{ cat.count || 0 }})</span>
    </button>
  </nav>
</template>

<script setup>
import { 
  GlobeAltIcon, 
  TagIcon, 
  SparklesIcon, 
  ShoppingBagIcon, 
  LightBulbIcon, 
  WrenchIcon, 
  DocumentTextIcon 
} from '@heroicons/vue/24/outline';

const props = defineProps({
  categories: { type: Array, required: true },
  selectedId: { type: String, default: '' },
  totalCount: { type: Number, default: 0 }
});

defineEmits(['select-category']);

function getIcon(name) {
  const n = name.toLowerCase();
  if (n.includes('cocoa') || n.includes('cacao') || n.includes('agro') || n.includes('grain')) return ShoppingBagIcon;
  if (n.includes('solar') || n.includes('solaire') || n.includes('energy')) return LightBulbIcon;
  if (n.includes('textile') || n.includes('cotton')) return SparklesIcon;
  if (n.includes('wood') || n.includes('lumber')) return WrenchIcon;
  if (n.includes('spice') || n.includes('poivre')) return TagIcon;
  return DocumentTextIcon;
}
</script>
