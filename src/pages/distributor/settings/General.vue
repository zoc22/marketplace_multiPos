<template>
  <div class="space-y-6 max-w-4xl mx-auto">
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm">
      <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Configuration Distributeur</h1>
      <p class="text-sm text-[var(--color-text-secondary)] mt-1">Paramètres globaux de la plateforme d'approvisionnement B2B.</p>
    </div>

    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm space-y-6">
      
      <div>
        <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Nom de la structure (Raison Sociale)</label>
        <input type="text" value="TechSupplies Wholesale S.A." class="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:outline-none" />
      </div>

      <div>
        <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Email de contact principal</label>
        <input type="email" value="contact@techsupplies.local" class="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:outline-none" />
      </div>

      <div class="grid grid-cols-2 gap-6">
        <div>
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Taux de TVA standard (%)</label>
          <input type="number" value="19.25" class="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:outline-none" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Devise par défaut</label>
          <select class="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:outline-none">
            <option value="XAF">FCFA (XAF)</option>
            <option value="EUR">Euro (€)</option>
            <option value="USD">Dollar ($)</option>
          </select>
        </div>
      </div>

      <div class="pt-4 border-t border-[var(--color-border)] flex justify-end">
        <button class="px-6 py-2.5 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-lg text-sm font-bold transition shadow-sm">
          Sauvegarder les modifications
        </button>
      </div>

    </div>
  </div>
</template>
