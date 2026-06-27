<template>
  <div class="space-y-6">
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Points de Vente (POS)</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Gérez la liste de vos points de vente physiques et caisses.</p>
      </div>
      <div class="flex space-x-3">
        <router-link to="/vendor/pos" class="px-4 py-2 bg-emerald-500 text-white hover:opacity-90 rounded-lg text-sm font-semibold transition flex items-center space-x-2 shadow-sm">
          <BuildingStorefrontIcon class="h-5 w-5" />
          <span>Ouvrir une Caisse</span>
        </router-link>
        <router-link to="/vendor/stores/create" class="px-4 py-2 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-lg text-sm font-semibold transition flex items-center space-x-2 shadow-sm">
          <PlusIcon class="h-5 w-5" />
          <span>Nouveau Point de Vente</span>
        </router-link>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="store in stores" :key="store.id" class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm flex flex-col">
        <div class="p-5 flex-1 flex items-start justify-between border-b border-[var(--color-border)] bg-[var(--color-surface-hover)]">
          <div>
            <h3 class="font-bold text-lg text-[var(--color-text-primary)] mb-1">{{ store.name }}</h3>
            <span class="text-sm text-[var(--color-text-secondary)] flex items-center">
              <MapPinIcon class="h-4 w-4 mr-1" />
              {{ store.location }}
            </span>
          </div>
          <span class="px-2.5 py-1 rounded-full text-xs font-bold border inline-block" :class="store.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'">
            {{ store.status }}
          </span>
        </div>
        <div class="p-5 flex-1 bg-[var(--color-background)]">
          <div class="flex justify-between items-center text-sm mb-2">
            <span class="text-[var(--color-text-secondary)]">Caisses enregistrées</span>
            <span class="font-bold">{{ store.posCount }}</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-[var(--color-text-secondary)]">Session active</span>
            <span v-if="activeSessions(store.id)" class="text-emerald-500 font-bold flex items-center"><span class="h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>Oui</span>
            <span v-else class="text-[var(--color-text-muted)] font-medium">Non</span>
          </div>
        </div>
        <!-- Card Actions Footer -->
        <div class="p-4 bg-[var(--color-surface-hover)] border-t border-[var(--color-border)] flex justify-between gap-3 shrink-0">
          <router-link :to="`/vendor/stores/${store.id}/edit`" class="flex-1 py-2 text-center bg-[var(--color-surface-elevated)] border border-[var(--color-border)] hover:bg-[var(--color-border)] text-xs font-semibold rounded-lg text-[var(--color-text-primary)] transition">
            Modifier
          </router-link>
          <router-link :to="`/vendor/stores/${store.id}/pos-config`" class="flex-1 py-2 text-center bg-[var(--color-primary-muted)] text-[var(--color-primary)] border border-[var(--color-primary-border)] hover:bg-[var(--color-primary)] hover:text-white text-xs font-semibold rounded-lg transition">
            Config Caisse
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { stores, pos_sessions } from '@/utils/vendor_db.js';
import { BuildingStorefrontIcon, PlusIcon, MapPinIcon } from '@heroicons/vue/24/outline';

function activeSessions(storeId) {
  return pos_sessions.value.some(s => s.storeId === storeId && s.status === 'Open');
}
</script>
