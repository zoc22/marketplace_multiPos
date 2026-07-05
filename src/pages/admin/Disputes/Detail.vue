<template>
  <div class="space-y-6">
    <div class="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl flex items-center justify-between shadow-sm">
      <span class="font-mono text-xs text-[var(--color-text-secondary)]">Détails du dossier de litige</span>
      <router-link to="/admin/disputes" class="text-xs text-[var(--color-primary)] hover:underline font-mono">&larr; Retour au tableau des litiges</router-link>
    </div>

    <div v-if="disputedItem" class="bg-[var(--color-surface)] p-6 border border-[var(--color-border)] rounded-2xl space-y-4 shadow-sm">
      <h2 class="text-sm font-bold font-mono text-[var(--color-text-primary)] uppercase">Dossier : {{ disputedItem.disputeRef }}</h2>
      <p class="text-xs text-[var(--color-text-secondary)]">Conflit entre : {{ disputedItem.buyer }} et {{ disputedItem.supplier }}</p>
      
      <div class="p-4 bg-[var(--color-background)] rounded-xl border border-[var(--color-border)] text-xs text-[var(--color-text-primary)]">
        {{ disputedItem.description }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { disputes } from '@/utils/admin_db.js';

const route = useRoute();
const disputedItem = computed(() => {
  return disputes.value.find(d => d.id === route.params.id);
});
</script>
