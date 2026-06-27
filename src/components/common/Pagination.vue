<template>
  <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-800 text-base font-mono select-none" role="navigation" aria-label="Catalog pagination navigation">
    <div class="text-slate-500 order-2 sm:order-1">
      Page <span class="text-slate-200 font-bold">{{ currentPage }}</span> of {{ totalPages }} 
      ({{ totalItems }} total items)
    </div>

    <div class="flex items-center space-x-1.5 order-1 sm:order-2">
      <!-- First page -->
      <button 
        @click="goToPage(1)"
        :disabled="currentPage === 1"
        class="p-2.5 bg-white dark:bg-slate-950 border border-slate-800 hover:border-emerald-950 text-slate-400 disabled:opacity-40 transition flex items-center justify-center"
        title="Go to first page"
        aria-label="First Page"
      >
        <ChevronDoubleLeftIcon class="h-5 w-5" aria-hidden="true" />
      </button>
      
      <!-- Prev page -->
      <button 
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="p-2.5 bg-white dark:bg-slate-950 border border-slate-800 hover:border-emerald-950 text-slate-400 disabled:opacity-40 transition flex items-center justify-center"
        title="Go to previous page"
        aria-label="Previous Page"
      >
        <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
      </button>

      <!-- Dynamic numbered buttons -->
      <button 
        v-for="p in visiblePages" 
        :key="p"
        @click="goToPage(p)"
        class="h-10 w-10 font-bold transition flex items-center justify-center border text-sm"
        :class="currentPage === p 
          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-405 font-extrabold' 
          : 'bg-white dark:bg-slate-950 border-slate-800 hover:bg-[#0c1f26] text-slate-400 hover:text-emerald-400'"
        :aria-label="'Go to page ' + p"
        :aria-current="currentPage === p ? 'page' : undefined"
      >
        {{ p }}
      </button>

      <!-- Next page -->
      <button 
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="p-2.5 bg-white dark:bg-slate-950 border border-slate-800 hover:border-emerald-950 text-slate-400 disabled:opacity-40 transition flex items-center justify-center"
        title="Go to next page"
        aria-label="Next Page"
      >
        <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
      </button>

      <!-- Last page -->
      <button 
        @click="goToPage(totalPages)"
        :disabled="currentPage === totalPages"
        class="p-2.5 bg-white dark:bg-slate-950 border border-slate-800 hover:border-emerald-950 text-slate-400 disabled:opacity-40 transition flex items-center justify-center"
        title="Go to last page"
        aria-label="Last Page"
      >
        <ChevronDoubleRightIcon class="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ChevronDoubleLeftIcon, 
  ChevronDoubleRightIcon 
} from '@heroicons/vue/24/outline';

const props = defineProps({
  totalItems: { type: Number, required: true },
  pageSize: { type: Number, default: 5 },
  currentPage: { type: Number, required: true }
});

const emit = defineEmits(['update:currentPage']);

const totalPages = computed(() => Math.max(1, Math.ceil(props.totalItems / props.pageSize)));

const visiblePages = computed(() => {
  const pages = [];
  const range = 2; // how many pages to show around active
  for (let i = Math.max(1, props.currentPage - range); i <= Math.min(totalPages.value, props.currentPage + range); i++) {
    pages.push(i);
  }
  return pages;
});

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    emit('update:currentPage', page);
  }
}
</script>
