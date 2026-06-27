<template>
  <div class="space-y-6">
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex justify-between items-center shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Appels d'Offres Reçus (Clients)</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Gérez les demandes de devis formulées par vos clients revendeurs.</p>
      </div>
    </div>

    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
      <div class="p-8 text-center">
        <InboxIcon class="h-16 w-16 text-[var(--color-text-muted)] mx-auto mb-4" />
        <h3 class="text-lg font-bold text-[var(--color-text-primary)]">Aucun appel d'offres reçu</h3>
        <p class="text-sm text-[var(--color-text-secondary)] mt-2">Vos clients n'ont pas encore soumis de nouvelles demandes de devis spécifiques.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { InboxIcon } from '@heroicons/vue/24/outline';
</script>
