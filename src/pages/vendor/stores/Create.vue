<template>
  <div class="space-y-6">
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm">
      <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Ajouter un Point de Vente</h1>
      <p class="text-sm text-[var(--color-text-secondary)] mt-1">Créez un nouveau magasin physique pour y déployer des caisses POS.</p>
    </div>

    <form @submit.prevent="saveStore" class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl space-y-5 max-w-3xl shadow-sm">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Nom de la boutique <span class="text-red-500">*</span></label>
          <input 
            type="text" 
            v-model="form.name" 
            required 
            placeholder="Ex: Boutique Douala Akwa" 
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" 
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Adresse / Emplacement <span class="text-red-500">*</span></label>
          <input 
            type="text" 
            v-model="form.location" 
            required 
            placeholder="Ex: Douala, Akwa" 
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" 
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Nombre de caisses initial <span class="text-red-500">*</span></label>
          <input 
            type="number" 
            v-model.number="form.posCount" 
            required 
            min="1" 
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" 
          />
        </div>
      </div>
      <div class="pt-5 border-t border-[var(--color-border)] flex justify-end space-x-3 mt-6">
        <router-link to="/vendor/stores" class="px-5 py-2.5 bg-[var(--color-surface-hover)] hover:bg-[var(--color-border)] rounded-lg text-sm font-semibold transition text-[var(--color-text-primary)]">Annuler</router-link>
        <button type="submit" class="px-5 py-2.5 bg-[var(--color-primary)] hover:opacity-90 text-white rounded-lg text-sm font-semibold transition shadow-sm">Créer la boutique</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { stores } from '@/utils/vendor_db.js';
import { useToast } from 'vue-toastification';

const router = useRouter();
const toast = useToast();

const form = ref({
  name: '',
  location: '',
  posCount: 1
});

function saveStore() {
  const newStore = {
    id: 'ST-00' + (stores.value.length + 1),
    name: form.value.name,
    location: form.value.location,
    posCount: form.value.posCount,
    status: 'Active'
  };

  stores.value.push(newStore);
  toast.success('Point de vente créé avec succès.');
  router.push('/vendor/stores');
}
</script>
