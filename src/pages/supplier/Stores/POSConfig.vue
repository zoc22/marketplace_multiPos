<template>
  <div class="space-y-6 max-w-md mx-auto text-center py-12">
    <div class="h-14 w-14 bg-[var(--color-primary-muted)] text-[var(--color-primary)] rounded-full border border-[var(--color-primary-border)] flex items-center justify-center font-bold text-2xl mx-auto shadow-sm">
      ⚙️
    </div>
    <div class="space-y-3">
      <h2 class="text-lg font-bold text-[var(--color-text-primary)] uppercase tracking-widest font-mono">Redirection en attente</h2>
      <p class="text-sm text-[var(--color-text-secondary)] font-sans">
        Toutes les configurations des terminaux POS et les paramètres des boutiques sont gérés via les fenêtres contextuelles du tableau de bord principal.
      </p>
    </div>
    <router-link 
      to="/supplier/stores"
      class="inline-block px-5 py-2.5 bg-[var(--color-primary)] hover:opacity-90 text-white font-bold rounded-xl shadow-sm transition mt-4"
    >
      Retour à la gestion des boutiques
    </router-link>
  </div>
</template>

<script setup>
</script>
