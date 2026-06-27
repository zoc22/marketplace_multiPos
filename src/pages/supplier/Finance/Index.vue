<template>
  <div class="space-y-6 max-w-md mx-auto text-center py-12">
    <div class="h-14 w-14 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 flex items-center justify-center mx-auto shadow-sm">
      <BanknotesIcon class="w-7 h-7" />
    </div>
    <div class="space-y-3">
      <h2 class="text-lg font-bold text-[var(--color-text-primary)] uppercase tracking-widest font-mono">Portail de Transit Financier</h2>
      <p class="text-sm text-[var(--color-text-secondary)]">
        Vous êtes redirigé vers le terminal de contrôle des retraits.
      </p>
    </div>
    <router-link 
      to="/supplier/finance/withdrawals"
      class="inline-block px-6 py-3 bg-[var(--color-primary)] hover:opacity-90 text-white font-bold rounded-xl shadow-sm transition uppercase mt-4"
    >
      Demander un retrait
    </router-link>
  </div>
</template>

<script setup>
import { BanknotesIcon } from '@heroicons/vue/24/outline';
</script>
