<template>
  <div class="space-y-6">
    <div class="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl space-y-4 shadow-sm">
      <h1 class="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)] font-mono">Enregistrements des Sous-domaines Locataires B2B</h1>
      <p class="text-xs text-[var(--color-text-secondary)]">Examinez les portails B2B multi-locataires, les sous-domaines dédiés aux fournisseurs et l'état de résolution DNS.</p>

      <div class="space-y-2 pt-2">
        <div v-for="t in authStore.tenants" :key="t.id" class="p-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl flex items-center justify-between text-xs font-mono">
          <div>
            <span class="font-bold text-[var(--color-text-primary)]">{{ t.name }}</span>
            <span class="block text-[9px] text-[var(--color-primary)]">{{ t.id }}.enterprise.local</span>
          </div>
          <span class="px-2 py-0.5 rounded text-[9px] font-bold" :class="t.active ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'">
            {{ t.active ? 'DNS RÉSOLU' : 'INACTIF' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/store/modules/auth.js';
const authStore = useAuthStore();
</script>
