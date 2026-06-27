<template>
  <div class="space-y-6">
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm">
      <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Modifier le Point de Vente</h1>
      <p class="text-sm text-[var(--color-text-secondary)] mt-1">Modifiez les informations de ce point de vente B2C.</p>
    </div>

    <div v-if="!store" class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-8 rounded-2xl text-center text-[var(--color-text-muted)] shadow-sm">
      Point de vente introuvable.
      <div class="mt-4">
        <router-link to="/vendor/stores" class="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm">Retour à la liste</router-link>
      </div>
    </div>

    <form v-else @submit.prevent="updateStore" class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl space-y-5 max-w-3xl shadow-sm">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Nom de la boutique <span class="text-red-500">*</span></label>
          <input 
            type="text" 
            v-model="form.name" 
            required 
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" 
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Adresse / Emplacement <span class="text-red-500">*</span></label>
          <input 
            type="text" 
            v-model="form.location" 
            required 
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" 
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Nombre de caisses <span class="text-red-500">*</span></label>
          <input 
            type="number" 
            v-model.number="form.posCount" 
            required 
            min="1" 
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" 
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Statut de la boutique <span class="text-red-500">*</span></label>
          <select 
            v-model="form.status" 
            required 
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="Active">Actif (Ouvert)</option>
            <option value="Inactive">Inactif (Fermé)</option>
          </select>
        </div>
      </div>
      <div class="pt-5 border-t border-[var(--color-border)] flex justify-end space-x-3 mt-6">
        <router-link to="/vendor/stores" class="px-5 py-2.5 bg-[var(--color-surface-hover)] hover:bg-[var(--color-border)] rounded-lg text-sm font-semibold transition text-[var(--color-text-primary)]">Annuler</router-link>
        <button type="submit" class="px-5 py-2.5 bg-[var(--color-primary)] hover:opacity-90 text-white rounded-lg text-sm font-semibold transition shadow-sm">Enregistrer les modifications</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { stores } from '@/utils/vendor_db.js';
import { useToast } from 'vue-toastification';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const store = ref(null);
const form = ref({
  name: '',
  location: '',
  posCount: 1,
  status: 'Active'
});

onMounted(() => {
  const storeId = route.params.id;
  const found = stores.value.find(s => s.id === storeId);
  if (found) {
    store.value = found;
    form.value = {
      name: found.name,
      location: found.location,
      posCount: found.posCount,
      status: found.status
    };
  }
});

function updateStore() {
  if (!store.value) return;

  store.value.name = form.value.name;
  store.value.location = form.value.location;
  store.value.posCount = form.value.posCount;
  store.value.status = form.value.status;

  toast.success('Point de vente mis à jour avec succès.');
  router.push('/vendor/stores');
}
</script>
