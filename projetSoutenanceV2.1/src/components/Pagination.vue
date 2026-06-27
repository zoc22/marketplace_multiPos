<template>
  <div v-if="totalPages > 1" class="flex items-center justify-between border-t border-slate-900/60 pt-4 font-mono text-xs text-slate-400 select-none">
    <div>
      Showing <span class="text-slate-200 font-bold">{{ startOffset + 1 }}</span> to
      <span class="text-slate-200 font-bold">{{ Math.min(startOffset + pageSize, totalItems) }}</span> of
      <span class="text-slate-200 font-bold">{{ totalItems }}</span> items
    </div>
    <div class="flex items-center space-x-1">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900 border border-slate-800 font-bold uppercase transition"
      >
        Prev
      </button>

      <button
        v-for="page in totalPages"
        :key="page"
        @click="changePage(page)"
        class="px-3 py-1 border transition"
        :class="page === currentPage
                 ? 'bg-indigo-650 text-white font-bold border-indigo-500'
                 : 'bg-slate-950 text-slate-400 hover:bg-slate-900 hover:text-white border-slate-850'"
      >
        {{ page }}
      </button>

      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900 border border-slate-800 font-bold uppercase transition"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  totalItems: { type: Number, required: true },
  pageSize: { type: Number, default: 5 },
  currentPage: { type: Number, required: true }
});

const emit = defineEmits(['update:currentPage']);

const totalPages = computed(() => Math.ceil(props.totalItems / props.pageSize));
const startOffset = computed(() => (props.currentPage - 1) * props.pageSize);

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    emit('update:currentPage', page);
  }
}
</script>
