<template>
  <div class="space-y-6">
    <div class="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl space-y-4 shadow-sm">
      <h1 class="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)] font-mono">Passerelles de Notification & E-mails SMTP</h1>
      <p class="text-xs text-[var(--color-text-secondary)]">Configurez le serveur SMTP de l'entreprise et les API de passerelle SMS pour les notifications de livraison automatiques.</p>

      <div class="space-y-3 pt-2 text-xs font-mono text-[var(--color-text-primary)]">
        <div class="p-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl flex items-center justify-between">
          <span>Canal d'Hôte SMTP :</span>
          <span class="font-bold text-[var(--color-primary)]">smtp.enterprise.local (TLS)</span>
        </div>
        <div class="p-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl flex items-center justify-between">
          <span>Nœud WhatsApp Sortant :</span>
          <span class="font-bold text-[var(--color-primary)]">Actif (Passerelle SMS)</span>
        </div>
      </div>
    </div>
  </div>
</template>
