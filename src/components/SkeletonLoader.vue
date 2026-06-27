<template>
  <div class="space-y-4 w-full animate-shimmer select-none">
    
    <!-- Table Skeleton style -->
    <div v-if="type === 'table'" class="border border-slate-900/60 divide-y divide-slate-900/40">
      <div class="h-10 bg-light-bg-main dark:bg-slate-900/70 p-3 flex items-center justify-between">
        <div class="h-3.5 bg-light-bg-sec dark:bg-slate-800 w-1/4"></div>
        <div class="h-3.5 bg-light-bg-sec dark:bg-slate-800 w-1/6"></div>
        <div class="h-3.5 bg-light-bg-sec dark:bg-slate-800 w-1/6"></div>
        <div class="h-3.5 bg-light-bg-sec dark:bg-slate-800 w-12"></div>
      </div>
      <div v-for="i in rows" :key="i" class="h-12 bg-light-bg-main dark:bg-slate-950/40 p-4 flex items-center justify-between">
        <div class="h-3 bg-light-bg-main dark:bg-slate-900 w-1/3"></div>
        <div class="h-3 bg-light-bg-main dark:bg-slate-900 w-1/5"></div>
        <div class="h-3 bg-light-bg-main dark:bg-slate-900 w-1/6"></div>
        <div class="h-3 bg-light-bg-sec dark:bg-slate-800 w-10"></div>
      </div>
    </div>

    <!-- Cards Layout Skeleton style -->
    <div v-else-if="type === 'card' || type === 'grid'" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="p-5 border border-slate-900/60 bg-light-bg-main dark:bg-slate-950/40 space-y-4">
        <div class="h-4 bg-light-bg-main dark:bg-slate-900 w-1/2"></div>
        <div class="space-y-2">
          <div class="h-3 bg-slate-905 w-full"></div>
          <div class="h-3 bg-slate-905 w-5/6"></div>
        </div>
        <div class="h-8 bg-light-bg-main dark:bg-slate-900 w-24"></div>
      </div>
    </div>

    <!-- Avatar Skeleton style -->
    <div v-else-if="type === 'avatar'" class="flex items-center space-x-4">
      <div class="h-12 w-12 rounded-full bg-light-bg-main dark:bg-slate-900"></div>
      <div class="space-y-2">
        <div class="h-4 bg-light-bg-main dark:bg-slate-900 w-24"></div>
        <div class="h-3 bg-light-bg-main dark:bg-slate-900 w-32"></div>
      </div>
    </div>

    <!-- Text / Overview Skeleton style -->
    <div v-else class="p-6 border border-slate-900 bg-light-bg-main dark:bg-slate-950/30 space-y-4">
      <div class="h-5 bg-light-bg-main dark:bg-slate-900 w-1/3"></div>
      <div class="space-y-2">
        <div class="h-3 bg-slate-905 w-full"></div>
        <div class="h-3 bg-slate-905 w-3/4"></div>
      </div>
    </div>

  </div>
</template>

<script setup>
defineProps({
  type: { type: String, default: 'text' }, // 'text', 'card', 'table', 'avatar'
  rows: { type: Number, default: 4 }
});
</script>

<style scoped>
.animate-shimmer {
  animation: shimmer 2s infinite linear;
  background: linear-gradient(to right, var(--color-surface, #0d1322) 4%, rgba(200, 169, 110, 0.05) 25%, var(--color-surface, #0d1322) 36%);
  background-size: 1000px 100%;
}
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
</style>
