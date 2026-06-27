<template>
  <div class="space-y-6">
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl">
      <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Modifier l'Entrepôt</h1>
    </div>

    <form class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl space-y-5 max-w-3xl">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="md:col-span-2">
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Nom de l'entrepôt <span class="text-red-500">*</span></label>
          <input type="text" value="Plateforme Nord - Abidjan" class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
        </div>
      </div>
      <div class="pt-5 border-t border-[var(--color-border)] flex justify-end space-x-3 mt-6">
        <router-link to="/distributor/warehouses" class="px-5 py-2.5 bg-[var(--color-surface-hover)] hover:bg-[var(--color-border)] rounded-lg text-sm font-semibold transition text-[var(--color-text-primary)]">Annuler</router-link>
        <button type="button" class="px-5 py-2.5 bg-[var(--color-primary)] hover:opacity-90 text-white rounded-lg text-sm font-semibold transition shadow-sm">Mettre à jour</button>
      </div>
    </form>
  </div>
</template>
