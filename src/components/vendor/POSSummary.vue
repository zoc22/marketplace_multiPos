<template>
  <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-5 shadow-sm hover:shadow-md transition">
    <div class="flex justify-between items-start mb-4">
      <div class="flex items-center space-x-3">
        <div class="h-10 w-10 bg-[var(--color-primary-muted)] text-[var(--color-primary)] rounded-full flex items-center justify-center">
          <ComputerDesktopIcon class="h-5 w-5" />
        </div>
        <div>
          <h3 class="font-black text-[var(--color-text-primary)] text-base">{{ pos.name }}</h3>
          <span class="text-sm text-[var(--color-text-secondary)]">{{ pos.location }}</span>
        </div>
      </div>
      <div 
        class="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border"
        :class="pos.isOpen ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'"
      >
        {{ pos.isOpen ? 'Ouverte' : 'Fermée' }}
      </div>
    </div>
    <div class="pt-4 border-t border-[var(--color-border)] flex justify-between items-end">
      <div>
        <span class="block text-sm text-[var(--color-text-secondary)] mb-1">Total Journalier</span>
        <span class="font-black text-[var(--color-text-primary)] text-xl">{{ formatCurrency(pos.dailyTotal) }} FCFA</span>
      </div>
      <button 
        @click="$emit('manage', pos)"
        class="px-4 py-2 bg-[var(--color-surface-hover)] hover:bg-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg text-sm font-bold transition"
      >
        Gérer
      </button>
    </div>
  </div>
</template>

<script setup>
import { ComputerDesktopIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  pos: {
    type: Object,
    required: true
  }
});

defineEmits(['manage']);

function formatCurrency(val) {
  if (!val) return '0';
  return new Intl.NumberFormat('fr-FR').format(val);
}
</script>
