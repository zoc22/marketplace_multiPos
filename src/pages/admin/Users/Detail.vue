<template>
  <div class="space-y-6">
    <div class="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl flex items-center justify-between shadow-sm">
      <span class="font-mono text-xs text-[var(--color-text-secondary)] font-bold">Profil de l'utilisateur</span>
      <router-link to="/admin/users" class="text-xs text-[var(--color-primary)] hover:underline font-mono">&larr; Retour au tableau de sécurité</router-link>
    </div>

    <div v-if="userItem" class="bg-[var(--color-surface)] p-6 border border-[var(--color-border)] rounded-2xl space-y-4 shadow-sm">
      <h2 class="text-sm font-bold font-mono text-[var(--color-text-primary)] uppercase">{{ userItem.name }}</h2>
      <p class="text-xs text-[var(--color-text-secondary)]">Adresse E-mail : {{ userItem.email }} &bull; Affiliation : {{ userItem.company }}</p>
      
      <div class="p-4 bg-[var(--color-background)] rounded-xl border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] space-y-1 font-mono">
        <div>Inscrit le : {{ userItem.created_at || 'Janvier 2026' }}</div>
        <div>Sous-domaine : {{ userItem.tenant || 'Aucun' }}</div>
        <div>Statut actuel : <span class="text-emerald-500 uppercase font-bold">{{ userItem.status === 'approved' ? 'ACTIF' : 'SUSPENDU' }}</span></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth.js';

const route = useRoute();
const authStore = useAuthStore();
const userItem = computed(() => {
  return authStore.users.find(u => u.id === route.params.id);
});
</script>
