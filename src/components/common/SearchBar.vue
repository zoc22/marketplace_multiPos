<template>
  <div class="relative w-full">
    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <MagnifyingGlassIcon class="h-5 w-5 text-slate-500" aria-hidden="true" />
    </div>
    <input 
      type="text" 
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      class="w-full bg-white dark:bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-none pl-12 pr-12 py-3 text-base text-slate-200 focus:outline-none placeholder-slate-600 transition"
      aria-label="Search catalog database"
    />
    <button 
      v-if="modelValue" 
      @click="$emit('update:modelValue', '')"
      class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-1"
      aria-label="Clear search input"
    >
      <XMarkIcon class="h-5 w-5" aria-hidden="true" />
    </button>
  </div>
</template>

<script setup>
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline';

defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Search products, SKU codes, categories...' }
});

defineEmits(['update:modelValue']);
</script>
