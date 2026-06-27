<template>
  <div class="space-y-6">
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl">
      <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Modes de paiement</h1>
      <p class="text-sm text-[var(--color-text-secondary)] mt-1">Configurez les moyens de paiement acceptés en ligne et en boutique.</p>
    </div>

    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl max-w-3xl space-y-4">
      <div class="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-xl">
        <div>
          <h3 class="font-bold text-[var(--color-text-primary)]">Mobile Money (Wave, Orange, MTN)</h3>
          <p class="text-xs text-[var(--color-text-secondary)]">Paiement mobile instantané.</p>
        </div>
        <div class="w-12 h-6 bg-[var(--color-primary)] rounded-full relative cursor-pointer">
          <div class="absolute right-1 top-1 h-4 w-4 bg-white rounded-full"></div>
        </div>
      </div>
      
      <div class="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-xl">
        <div>
          <h3 class="font-bold text-[var(--color-text-primary)]">Carte Bancaire (Visa/Mastercard)</h3>
          <p class="text-xs text-[var(--color-text-secondary)]">Paiement par carte.</p>
        </div>
        <div class="w-12 h-6 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-full relative cursor-pointer">
          <div class="absolute left-1 top-1 h-4 w-4 bg-[var(--color-text-muted)] rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
</template>
