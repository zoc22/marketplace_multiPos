<template>
  <div class="space-y-6">

    <!-- HEADER BLOCK -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5 shrink-0">
      <div>
        <h1 class="text-xl font-bold font-mono text-[var(--color-text-primary)] flex items-center gap-2">
          File d'Attente des Tâches & Broker de Messages
        </h1>
        <p class="text-xs text-[var(--color-text-secondary)]">Surveillez les files d'attente asynchrones gérant les notifications WhatsApp des acheteurs, les SMS de livraison des fournisseurs et la synchronisation du grand livre.</p>
      </div>

      <span class="px-2.5 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg font-mono text-xs text-[var(--color-text-secondary)]">
        Charge du Broker : <strong class="text-[var(--color-primary)]">0,02%</strong>
      </span>
    </div>

    <!-- MAIN INTERFACES -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- TASK QUEUE CHRONO -->
      <div class="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl space-y-4">
        <h2 class="text-xs font-bold font-mono uppercase text-[var(--color-text-primary)] tracking-wider">Files d'Attente Actives</h2>
        
        <div class="space-y-3 font-mono text-xs">
          <div class="p-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl flex items-center justify-between">
            <div>
              <span class="text-[var(--color-primary)] block font-bold">Centre de Notification WhatsApp</span>
              <span class="text-[10px] text-[var(--color-text-secondary)]">Suivi des envois de bordereaux</span>
            </div>
            <span class="text-emerald-500 font-bold">0 en attente</span>
          </div>
          <div class="p-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl flex items-center justify-between">
            <div>
              <span class="text-[var(--color-primary)] block font-bold">Passerelle SMS GSM Fournisseur</span>
              <span class="text-[10px] text-[var(--color-text-secondary)]">Confirmations d'alertes de crédit</span>
            </div>
            <span class="text-emerald-500 font-bold">0 en attente</span>
          </div>
          <div class="p-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl flex items-center justify-between">
            <div>
              <span class="text-[var(--color-primary)] block font-bold">Synchro du Grand Livre Financier</span>
              <span class="text-[10px] text-[var(--color-text-secondary)]">Points de contrôle de validation BD</span>
            </div>
            <span class="text-emerald-500 font-bold">0 en attente</span>
          </div>
        </div>
      </div>

      <!-- QUEUE DIAGNOSTIC STATS -->
      <div class="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl space-y-4">
        <h2 class="text-xs font-bold font-mono uppercase text-[var(--color-text-primary)] tracking-wider">Détails des Diagnostics de la File</h2>
        
        <div class="space-y-2.5 text-xs font-mono text-[var(--color-text-secondary)]">
          <div class="flex items-center justify-between">
            <span>Logiciel Broker :</span>
            <span class="text-[var(--color-text-primary)] font-bold">Cluster Redis SLA</span>
          </div>
          <div class="flex items-center justify-between">
            <span>État de Connexion Synchrone :</span>
            <span class="text-emerald-500 font-bold">Connecté (Sain)</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Seuil de Limite de Tentatives :</span>
            <span class="text-[var(--color-text-primary)]">3 tentatives</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Délai d'Attente Limite (Timeout) :</span>
            <span class="text-[var(--color-text-primary)]">10 000 ms</span>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>
