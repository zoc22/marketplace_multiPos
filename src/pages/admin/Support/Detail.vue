<template>
  <div class="space-y-6">
    <div class="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl flex items-center justify-between shadow-sm">
      <span class="font-mono text-xs text-[var(--color-text-secondary)] font-bold">Dossier individuel du support client</span>
      <router-link to="/admin/support" class="text-xs text-[var(--color-primary)] hover:underline font-mono">&larr; Retour au tableau des tickets</router-link>
    </div>

    <div v-if="ticketItem" class="bg-[var(--color-surface)] p-6 border border-[var(--color-border)] rounded-2xl space-y-4 shadow-sm">
      <h2 class="text-sm font-bold font-mono text-[var(--color-text-primary)] uppercase">Dossier : {{ ticketItem.ticketRef }}</h2>
      <p class="text-xs text-[var(--color-text-secondary)]">Objet : <span class="text-[var(--color-text-primary)] font-bold font-sans">{{ ticketItem.subject }}</span></p>
      
      <div class="p-4 bg-[var(--color-background)] rounded-xl border border-[var(--color-border)] text-xs text-[var(--color-text-primary)]">
        {{ ticketItem.message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { supportTickets } from '@/utils/admin_db.js';

const route = useRoute();
const ticketItem = computed(() => {
  return supportTickets.value.find(t => t.id === route.params.id);
});
</script>
