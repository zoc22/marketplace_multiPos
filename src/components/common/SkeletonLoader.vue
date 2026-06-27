<template>
  <div 
    class="relative overflow-hidden bg-white dark:bg-slate-900/60 border border-slate-850 rounded-xl"
    :class="[
      shimmerClass,
      variant === 'avatar' ? 'rounded-full aspect-square w-12 h-12' : '',
      variant === 'card' ? 'p-5 space-y-3' : '',
      variant === 'table' ? 'p-4 space-y-4' : ''
    ]"
    role="status"
    aria-label="Chargement du contenu..."
  >
    <!-- Card Variant -->
    <div v-if="variant === 'card'" class="space-y-3">
      <div class="h-32 bg-[#F0EFEB] dark:bg-slate-800 rounded-lg"></div>
      <div class="h-4 bg-[#F0EFEB] dark:bg-slate-800 rounded w-2/3"></div>
      <div class="h-3 bg-[#F0EFEB] dark:bg-slate-800 rounded w-1/2"></div>
      <div class="flex justify-between items-center pt-2">
        <div class="h-4 bg-[#F0EFEB] dark:bg-slate-800 rounded w-1/4"></div>
        <div class="h-6 bg-[#F0EFEB] dark:bg-slate-800 rounded-lg w-1/3"></div>
      </div>
    </div>

    <!-- Table Variant -->
    <div v-else-if="variant === 'table'" class="space-y-3.5">
      <div class="flex gap-4 border-b border-slate-850 pb-2">
        <div v-for="i in 4" :key="i" class="h-4 bg-[#F0EFEB] dark:bg-slate-800 rounded flex-1"></div>
      </div>
      <div v-for="row in 3" :key="row" class="flex gap-4 items-center">
        <div class="h-3 bg-[#F0EFEB] dark:bg-slate-800 rounded flex-1"></div>
        <div class="h-3 bg-[#F0EFEB] dark:bg-slate-800 rounded flex-1"></div>
        <div class="h-3 bg-[#F0EFEB] dark:bg-slate-800 rounded flex-1 w-2/3"></div>
        <div class="h-6 bg-[#F0EFEB] dark:bg-slate-800 rounded-lg w-12"></div>
      </div>
    </div>

    <!-- Text Variant -->
    <div v-else-if="variant === 'text'" class="space-y-2 py-1">
      <div class="h-3 bg-[#F0EFEB] dark:bg-slate-800 rounded w-full"></div>
      <div class="h-3 bg-[#F0EFEB] dark:bg-slate-800 rounded w-5/6"></div>
      <div class="h-3 bg-[#F0EFEB] dark:bg-slate-800 rounded w-2/3"></div>
    </div>

    <!-- Simple Box / Fallback -->
    <div v-else-if="variant === 'avatar'"></div>
    <div v-else class="h-full w-full min-h-[40px] bg-[#F0EFEB] dark:bg-slate-800 rounded"></div>

    <!-- Screen Reader announcements -->
    <span class="sr-only">Chargement en cours...</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'box', // 'card' | 'table' | 'text' | 'avatar' | 'box'
  },
  animate: {
    type: Boolean,
    default: true
  }
});

const shimmerClass = computed(() => {
  return props.animate ? 'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-slate-800/10 before:to-transparent' : '';
});
</script>

<style scoped>
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
