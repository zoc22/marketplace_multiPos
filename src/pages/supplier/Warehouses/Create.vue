<template>
  <div class="space-y-6 max-w-4xl mx-auto">
    <div class="flex items-center space-x-3 mb-4">
      <router-link to="/supplier/warehouses" class="p-2 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition">
        <ArrowLeftIcon class="h-5 w-5" />
      </router-link>
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Ajouter un entrepôt</h1>
        <p class="text-sm text-[var(--color-text-secondary)]">Enregistrez un nouveau hub logistique ou point de stockage.</p>
      </div>
    </div>

    <form @submit.prevent="saveWarehouse" class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 md:p-8 space-y-8 shadow-sm">
      
      <!-- Identité -->
      <div class="space-y-4">
        <h3 class="text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2 flex items-center space-x-2">
          <BuildingOfficeIcon class="h-5 w-5 text-[var(--color-primary)]" />
          <span>Informations de l'entrepôt</span>
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="md:col-span-2">
            <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Nom de l'entrepôt *</label>
            <input v-model="form.name" type="text" required class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none" placeholder="Ex: Hub Principal Bassa" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Lieu / Ville *</label>
            <input v-model="form.location" type="text" required class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none" placeholder="Ex: Zone Industrielle, Douala" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Nom du responsable</label>
            <input v-model="form.manager" type="text" class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none" placeholder="Responsable du site" />
          </div>
        </div>
      </div>

      <!-- Capacités et Stockage -->
      <div class="space-y-4">
        <h3 class="text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2 flex items-center space-x-2">
          <ArchiveBoxIcon class="h-5 w-5 text-[var(--color-primary)]" />
          <span>Spécifications de Stockage</span>
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Capacité de stockage max (kg/T) *</label>
            <input v-model="form.capacity" type="number" required class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none" placeholder="Ex: 500000" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Statut de mise en service</label>
            <select v-model="form.status" class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none">
              <option value="Active">Opérationnel (Actif)</option>
              <option value="Maintenance">En maintenance / Inactif</option>
            </select>
          </div>
          <div class="md:col-span-2 space-y-2">
            <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Catégories de produits autorisées</label>
            <div class="flex flex-wrap gap-3">
              <label v-for="cat in availableCategories" :key="cat" class="flex items-center space-x-2 bg-[var(--color-surface-hover)] border border-[var(--color-border)] px-3 py-2 rounded-lg cursor-pointer hover:border-[var(--color-primary-border)] transition">
                <input type="checkbox" :value="cat" v-model="form.categories" class="rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
                <span class="text-sm text-[var(--color-text-primary)]">{{ cat }}</span>
              </label>
            </div>
            <p class="text-xs text-[var(--color-text-muted)] italic">Sélectionnez les types de produits qui peuvent être entreposés ici (ex: l'alimentaire et les produits chimiques doivent être séparés).</p>
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Description détaillée (Optionnel)</label>
            <textarea 
              v-model="form.description" 
              rows="3"
              class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-3 rounded-lg text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none resize-none" 
              placeholder="Détails supplémentaires sur le site, équipements, température contrôlée..."
            ></textarea>
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-3 pt-4 border-t border-[var(--color-border)]">
        <router-link to="/supplier/warehouses" class="px-5 py-2.5 bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg text-sm font-semibold hover:bg-[var(--color-border)] transition">
          Annuler
        </router-link>
        <button type="submit" class="px-5 py-2.5 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-lg text-sm font-semibold transition shadow-sm">
          Enregistrer l'entrepôt
        </button>
      </div>

    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { warehouses } from '@/utils/supplier_db';
import { useToast } from 'vue-toastification';
import { ArrowLeftIcon, BuildingOfficeIcon, ArchiveBoxIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const toast = useToast();

const availableCategories = ['Agricole', 'Chimique', 'Alimentaire', 'Outillage', 'Emballages', 'Textile'];

const form = ref({
  name: '',
  location: '',
  manager: '',
  capacity: null,
  status: 'Active',
  categories: [],
  description: ''
});

function saveWarehouse() {
  if (!form.value.name || !form.value.location || !form.value.capacity) return;
  
  if (form.value.categories.length === 0) {
    toast.error('Veuillez sélectionner au moins une catégorie autorisée.');
    return;
  }
  
  const newWarehouse = {
    id: `wh_${warehouses.value.length + 1}`,
    ...form.value,
    inventory: []
  };
  
  warehouses.value.push(newWarehouse);
  toast.success('Nouvel entrepôt enregistré avec succès !');
  router.push('/supplier/warehouses');
}
</script>
