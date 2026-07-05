<template>
  <div class="space-y-6">
    <div class="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl space-y-4 shadow-sm">
      <h1 class="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)] font-mono">Catalogue des Fournisseurs B2B Vérifiés</h1>
      <p class="text-xs text-[var(--color-text-secondary)]">Consultez et auditez les coordonnées des coopératives de matériel enregistrées.</p>

      <div class="space-y-2">
        <div v-for="u in suppliersList" :key="u.id" class="p-3 bg-[var(--color-background)] rounded-xl flex items-center justify-between text-xs font-mono text-[var(--color-text-secondary)] border border-[var(--color-border)]">
          <div>
            <strong class="text-[var(--color-text-primary)]">{{ u.company }}</strong>
            <span class="block text-[10px] text-[var(--color-text-secondary)]">{{ u.name }} &bull; {{ u.email }}</span>
          </div>
          <span class="px-2 py-0.5 bg-[var(--color-primary-muted)] text-[var(--color-primary)] text-[9px] rounded font-bold border border-[var(--color-primary-border)]">FOURNISSEUR</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/store/modules/auth.js';

const authStore = useAuthStore();
const suppliersList = computed(() => {
  return authStore.users.filter(u => u.roles.includes('supplier'));
});
</script>
