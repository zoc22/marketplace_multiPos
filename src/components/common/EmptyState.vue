<template>
  <div class="text-center bg-white dark:bg-slate-900/40 border border-dashed border-slate-800 p-10 space-y-5 flex flex-col items-center justify-center">
    <div class="h-20 w-20 bg-white dark:bg-slate-950 border border-slate-850 flex items-center justify-center text-[#7A7A7A]">
      <component :is="iconComponent" class="h-12 w-12 text-slate-500" aria-hidden="true" />
    </div>
    
    <div class="space-y-2">
      <h3 class="text-[20px] font-semibold text-slate-300 uppercase tracking-widest">
        {{ title }}
      </h3>
      <p class="text-[16px] text-slate-500 max-w-sm mx-auto leading-relaxed">
        {{ description }}
      </p>
    </div>

    <div v-if="$slots.actions" class="pt-2">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { InboxIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  title: { type: String, default: 'NO RECORDS FOUND' },
  description: { type: String, default: 'Adjust search variables, reset active filters, or check connection clearances.' },
  icon: { type: String, default: 'inbox' } // inbox, search
});

const iconComponent = computed(() => {
  if (props.icon === 'search') return MagnifyingGlassIcon;
  return InboxIcon;
});
</script>
