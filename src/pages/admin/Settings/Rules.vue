<template>
  <div class="space-y-6">
    <div class="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl space-y-4 shadow-sm">
      <h1 class="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)] font-mono">Règles Métier de la Plateforme B2B</h1>
      <p class="text-xs text-[var(--color-text-secondary)]">Gérez les seuils de commande, les périodes de litige et les règles de sécurité des séquestres.</p>

      <div class="space-y-2 text-xs font-mono text-[var(--color-text-primary)]">
        <div class="p-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl flex items-center justify-between">
          <span>Délai standard de réclamation de litige :</span>
          <span class="font-bold text-[var(--color-primary)]">15 jours calendaires</span>
        </div>
        <div class="p-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl flex items-center justify-between">
          <span>Montant minimum de commande en gros :</span>
          <span class="font-bold text-[var(--color-primary)]">500 000 FCFA</span>
        </div>
        <div class="p-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl flex items-center justify-between">
          <span>Verrouillage automatique du séquestre en cas de litige :</span>
          <span class="font-bold text-[var(--color-primary)]">Oui (Activé)</span>
        </div>
      </div>
    </div>
  </div>
</template>
