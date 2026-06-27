<template>
  <div class="space-y-6 max-w-4xl mx-auto">
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Transport & Logistique</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Configurez les méthodes et frais d'expédition B2B.</p>
      </div>
      <button class="px-4 py-2 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-lg text-sm font-semibold transition flex items-center space-x-2">
        <span>Ajouter un transporteur</span>
      </button>
    </div>

    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm space-y-4">
      
      <div class="border border-[var(--color-border)] rounded-lg p-4 flex items-center justify-between">
        <div>
          <h3 class="font-bold text-[var(--color-text-primary)]">Flotte Interne (Camions)</h3>
          <p class="text-sm text-[var(--color-text-secondary)]">Livraison par vos propres moyens logistiques.</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="text-sm font-bold text-[var(--color-primary)]">Frais: 25 000 FCFA / 100km</div>
          <div class="w-12 h-6 bg-emerald-500 rounded-full flex items-center p-1 cursor-pointer justify-end">
            <div class="bg-white w-4 h-4 rounded-full shadow-md"></div>
          </div>
        </div>
      </div>

      <div class="border border-[var(--color-border)] rounded-lg p-4 flex items-center justify-between">
        <div>
          <h3 class="font-bold text-[var(--color-text-primary)]">Bolloré Logistics / DHL</h3>
          <p class="text-sm text-[var(--color-text-secondary)]">Partenaire d'expédition international et gros volume.</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="text-sm font-bold text-[var(--color-text-secondary)]">Frais dynamiques (API)</div>
          <div class="w-12 h-6 bg-[var(--color-border)] rounded-full flex items-center p-1 cursor-pointer">
            <div class="bg-white w-4 h-4 rounded-full shadow-md"></div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
