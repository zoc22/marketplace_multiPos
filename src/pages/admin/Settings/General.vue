<template>
  <div class="space-y-6">
    <div class="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl space-y-4 shadow-sm">
      <h1 class="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)] font-mono">Préférences Générales de la Plateforme</h1>
      <p class="text-xs text-[var(--color-text-secondary)]">Configurez les métadonnées globales, la devise locale, la langue par défaut et les fuseaux horaires.</p>
      
      <div class="space-y-3 pt-2 text-xs font-mono text-[var(--color-text-primary)]">
        <div class="p-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl flex items-center justify-between">
          <span>Devise principale du système :</span>
          <span class="font-bold text-[var(--color-primary)]">Franc CFA (FCFA)</span>
        </div>
        <div class="p-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl flex items-center justify-between">
          <span>Langue opérationnelle par défaut :</span>
          <span class="font-bold text-[var(--color-primary)]">Français (fr-FR)</span>
        </div>
        <div class="p-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl flex items-center justify-between">
          <span>Fuseau horaire :</span>
          <span class="font-bold text-[var(--color-primary)]">Douala (UTC+1)</span>
        </div>
      </div>
    </div>
  </div>
</template>
