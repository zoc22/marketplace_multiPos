<template>
  <div class="space-y-6">
    <div class="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl space-y-4 shadow-sm">
      <h1 class="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)] font-mono">Acheteurs B2B Vérifiés</h1>
      <p class="text-xs text-[var(--color-text-secondary)]">Consultez les profils de contact et de volume des chaînes d'achat au détail.</p>

      <div class="space-y-2">
        <div v-for="u in buyersList" :key="u.id" class="p-3 bg-[var(--color-background)] rounded-xl flex items-center justify-between text-xs font-mono text-[var(--color-text-secondary)] border border-[var(--color-border)]">
          <div>
            <strong class="text-[var(--color-text-primary)]">{{ u.company || u.name }}</strong>
            <span class="block text-[10px] text-[var(--color-text-secondary)]">{{ u.email }} &bull; {{ u.phone || 'Pas de téléphone' }}</span>
          </div>
          <span class="px-2 py-0.5 bg-sky-500/10 text-sky-500 text-[9px] rounded font-bold border border-sky-500/20">ACHETEUR</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/store/modules/auth.js';

const authStore = useAuthStore();
const buyersList = computed(() => {
  return authStore.users.filter(u => u.roles.includes('buyer'));
});
</script>
