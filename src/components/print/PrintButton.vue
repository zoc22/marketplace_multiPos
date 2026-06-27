<template>
  <button 
    @click="triggerPrint"
    class="inline-flex items-center px-4 py-2 bg-emerald-650 hover:bg-emerald-700 text-white rounded-xl text-xs font-mono font-bold uppercase transition shadow-md hover:shadow-lg focus:outline-none"
  >
    <PrinterIcon class="h-4 w-4 mr-2" aria-hidden="true" />
    <span>{{ label || 'Imprimer' }}</span>
  </button>
</template>

<script setup>
import { PrinterIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  label: { type: String, default: 'Imprimer Document' },
  documentTitle: { type: String, default: '' }
});

function triggerPrint() {
  if (props.documentTitle) {
    const oldTitle = document.title;
    document.title = props.documentTitle;
    window.print();
    // Restore title after print dialog closes
    setTimeout(() => {
      document.title = oldTitle;
    }, 500);
  } else {
    window.print();
  }
}
</script>
