<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Ajustements de Stock</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Gérez les pertes, vols, casses ou surplus inattendus.</p>
      </div>
      <button class="px-4 py-2 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-lg text-sm font-semibold transition flex items-center space-x-2 shadow-sm">
        <ScaleIcon class="h-5 w-5" />
        <span>Nouvel Ajustement</span>
      </button>
    </div>

    <!-- Table -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[var(--color-surface-hover)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)]">
              <th class="p-4">Date</th>
              <th class="p-4">Entrepôt</th>
              <th class="p-4">Produit</th>
              <th class="p-4 text-center">Raison</th>
              <th class="p-4 text-center">Écart</th>
              <th class="p-4">Responsable</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr class="hover:bg-[var(--color-surface-hover)] transition text-sm">
              <td class="p-4 text-[var(--color-text-secondary)]">20 Juin 2026</td>
              <td class="p-4 font-bold text-[var(--color-text-primary)]">Dépôt Central Douala</td>
              <td class="p-4 text-[var(--color-text-primary)]">Sacs Jute de Cacao</td>
              <td class="p-4 text-center">
                <span class="px-2.5 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full text-xs font-bold inline-block">
                  Casse / Dommage
                </span>
              </td>
              <td class="p-4 text-center font-bold text-red-500">-5</td>
              <td class="p-4 text-[var(--color-text-secondary)]">Alice Ndoumbe</td>
            </tr>
            <tr class="hover:bg-[var(--color-surface-hover)] transition text-sm">
              <td class="p-4 text-[var(--color-text-secondary)]">18 Juin 2026</td>
              <td class="p-4 font-bold text-[var(--color-text-primary)]">Magasin Relais Bafoussam</td>
              <td class="p-4 text-[var(--color-text-primary)]">Engrais Bio NPK Bag</td>
              <td class="p-4 text-center">
                <span class="px-2.5 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full text-xs font-bold inline-block">
                  Inventaire Annuel
                </span>
              </td>
              <td class="p-4 text-center font-bold text-emerald-500">+2</td>
              <td class="p-4 text-[var(--color-text-secondary)]">Paul Biya</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ScaleIcon } from '@heroicons/vue/24/outline';
</script>
