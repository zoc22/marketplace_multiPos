<template>
  <div class="space-y-6">
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex justify-between items-center shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Appels d'Offres Émis (Fournisseurs Amont)</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Gérez vos appels d'offres et demandes de devis vers vos fournisseurs industriels.</p>
      </div>
      <button class="px-4 py-2 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-lg text-sm font-semibold transition flex items-center space-x-2">
        <span>Créer un appel d'offres</span>
      </button>
    </div>

    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
      <div class="p-8 text-center">
        <PaperAirplaneIcon class="h-16 w-16 text-[var(--color-text-muted)] mx-auto mb-4" />
        <h3 class="text-lg font-bold text-[var(--color-text-primary)]">Aucun appel d'offres émis</h3>
        <p class="text-sm text-[var(--color-text-secondary)] mt-2">Vous n'avez pas d'appel d'offres en cours vers vos fournisseurs.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PaperAirplaneIcon } from '@heroicons/vue/24/outline';
</script>
