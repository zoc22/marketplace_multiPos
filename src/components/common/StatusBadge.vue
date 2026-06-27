<template>
  <span 
    class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-bold tracking-wider border transition-all duration-200"
    :class="statusClass"
  >
    <span class="h-1.5 w-1.5 rounded-full mr-1.5 animate-pulse" :class="dotClass"></span>
    {{ statusLabel }}
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: {
    type: String,
    required: true
  }
});

const statusLabel = computed(() => {
  const norm = props.status.toUpperCase();
  switch (norm) {
    case 'DRAFT':
    case 'BROUILLON':
      return 'BROUILLON';
    case 'PENDING':
    case 'EN_ATTENTE':
      return 'EN ATTENTE';
    case 'VALIDATED':
    case 'VALIDÉ':
      return 'VALIDÉ';
    case 'REFUSED':
    case 'REFUSÉ':
      return 'REFUSÉ';
    case 'PROCESSING':
    case 'EN_TRAITEMENT':
      return 'EN TRAITEMENT';
    case 'PREPARED':
    case 'PRÉPARÉ':
      return 'PRÉPARÉ';
    case 'IN_TRANSIT':
    case 'EN_TRANSIT':
      return 'EN TRANSIT';
    case 'DELIVERED':
    case 'LIVRÉ':
      return 'LIVRÉ';
    case 'CANCELLED':
    case 'ANNULÉ':
    case 'ANNULE':
      return 'ANNULÉ';
    default:
      return norm;
  }
});

const statusClass = computed(() => {
  const norm = props.status.toUpperCase();
  switch (norm) {
    case 'DRAFT':
    case 'BROUILLON':
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    case 'PENDING':
    case 'EN_ATTENTE':
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    case 'VALIDATED':
    case 'VALIDÉ':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'REFUSED':
    case 'REFUSÉ':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    case 'PROCESSING':
    case 'EN_TRAITEMENT':
      return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    case 'PREPARED':
    case 'PRÉPARÉ':
      return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
    case 'IN_TRANSIT':
    case 'EN_TRANSIT':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'DELIVERED':
    case 'LIVRÉ':
      return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
    case 'CANCELLED':
    case 'ANNULÉ':
    case 'ANNULE':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
});

const dotClass = computed(() => {
  const norm = props.status.toUpperCase();
  switch (norm) {
    case 'DRAFT':
    case 'BROUILLON':
      return 'bg-slate-400';
    case 'PENDING':
    case 'EN_ATTENTE':
      return 'bg-amber-500';
    case 'VALIDATED':
    case 'VALIDÉ':
      return 'bg-emerald-400';
    case 'REFUSED':
    case 'REFUSÉ':
      return 'bg-rose-400';
    case 'PROCESSING':
    case 'EN_TRAITEMENT':
      return 'bg-indigo-400';
    case 'PREPARED':
    case 'PRÉPARÉ':
      return 'bg-sky-400';
    case 'IN_TRANSIT':
    case 'EN_TRANSIT':
      return 'bg-blue-400';
    case 'DELIVERED':
    case 'LIVRÉ':
      return 'bg-teal-400';
    case 'CANCELLED':
    case 'ANNULÉ':
    case 'ANNULE':
      return 'bg-red-400';
    default:
      return 'bg-slate-400';
  }
});
</script>
