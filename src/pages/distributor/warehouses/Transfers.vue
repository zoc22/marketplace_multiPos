<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Transferts de Stock</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Déplacez des marchandises d'un entrepôt à un autre.</p>
      </div>
      <button class="px-4 py-2 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-lg text-sm font-semibold transition flex items-center space-x-2 shadow-sm">
        <ArrowsRightLeftIcon class="h-5 w-5" />
        <span>Nouveau Transfert</span>
      </button>
    </div>

    <!-- Table -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
      <div class="p-4 border-b border-[var(--color-border)] flex flex-col sm:flex-row justify-between items-center gap-4 bg-[var(--color-surface-hover)]">
        <div class="relative w-full sm:w-96">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)]" />
          <input 
            type="text" 
            placeholder="Rechercher (Référence, Produit...)" 
            class="w-full pl-10 pr-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)]"
          />
        </div>
        <select class="bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm focus:outline-none w-full sm:w-auto">
          <option value="ALL">Tous les statuts</option>
          <option value="Pending">En transit</option>
          <option value="Completed">Complété</option>
        </select>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[var(--color-surface-hover)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)]">
              <th class="p-4">Réf. Transfert</th>
              <th class="p-4">Date</th>
              <th class="p-4">Produit & Quantité</th>
              <th class="p-4">De / Vers</th>
              <th class="p-4 text-center">Statut</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr class="hover:bg-[var(--color-surface-hover)] transition text-sm">
              <td class="p-4 font-bold text-[var(--color-primary)]">#TRF-2026-001</td>
              <td class="p-4 text-[var(--color-text-secondary)]">24 Juin 2026</td>
              <td class="p-4 font-bold text-[var(--color-text-primary)]">
                Engrais Bio NPK Bag <br/> <span class="text-xs text-[var(--color-text-secondary)] font-normal">50 Unités</span>
              </td>
              <td class="p-4">
                <div class="flex items-center space-x-2 text-xs">
                  <span class="px-2 py-1 bg-red-500/10 text-red-500 rounded border border-red-500/20">Dépôt Central Douala</span>
                  <ArrowRightIcon class="h-3 w-3 text-[var(--color-text-muted)]" />
                  <span class="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded border border-emerald-500/20">Magasin Relais Bafoussam</span>
                </div>
              </td>
              <td class="p-4 text-center">
                <span class="px-2.5 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-xs font-bold inline-block">
                  En transit
                </span>
              </td>
              <td class="p-4 text-right">
                <button class="p-2 inline-flex items-center justify-center bg-[var(--color-surface-elevated)] hover:bg-[var(--color-primary-muted)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] rounded-lg transition border border-[var(--color-border)]">
                  <EyeIcon class="h-4 w-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  ArrowsRightLeftIcon, ArrowRightIcon, MagnifyingGlassIcon, EyeIcon 
} from '@heroicons/vue/24/outline';
</script>
