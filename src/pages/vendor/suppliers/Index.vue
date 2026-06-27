<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Annuaire Fournisseurs B2B</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Gérez votre annuaire de grossistes et de distributeurs partenaires.</p>
      </div>
      <button @click="isAddModalOpen = true" class="px-4 py-2.5 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-xl text-sm font-semibold transition flex items-center space-x-2 shadow-sm">
        <PlusIcon class="h-5 w-5" />
        <span>Nouveau Fournisseur</span>
      </button>
    </div>

    <!-- Table Card -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
      <div class="p-4 border-b border-[var(--color-border)] flex flex-col sm:flex-row justify-between items-center gap-4 bg-[var(--color-surface-hover)]">
        <div class="relative w-full sm:w-96">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)]" />
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Rechercher par nom, email..." 
            class="w-full pl-10 pr-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)]"
          />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="bg-[var(--color-surface-hover)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)]">
              <th class="p-4">Fournisseur</th>
              <th class="p-4">Contact</th>
              <th class="p-4">Catégorie</th>
              <th class="p-4 text-center">Statut</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr v-for="sup in paginatedSuppliers" :key="sup.id" class="hover:bg-[var(--color-surface-hover)]/40 transition text-sm">
              <td class="p-4">
                <div class="font-bold text-[var(--color-text-primary)]">{{ sup.name }}</div>
                <div class="text-xs text-[var(--color-text-muted)] mt-1 font-mono">{{ sup.id }}</div>
              </td>
              <td class="p-4">
                <div class="text-[var(--color-text-primary)] font-medium">{{ sup.phone }}</div>
                <div class="text-xs text-[var(--color-text-secondary)]">{{ sup.email }}</div>
              </td>
              <td class="p-4">
                <span class="px-2 py-1 bg-[var(--color-background)] border border-[var(--color-border)] rounded text-xs">{{ sup.category }}</span>
              </td>
              <td class="p-4 text-center">
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold border inline-block" :class="sup.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'">
                  {{ sup.status }}
                </span>
              </td>
              <td class="p-4 text-right">
                <button @click="deleteSupplier(sup.id)" class="p-1.5 bg-[var(--color-surface-elevated)] hover:bg-red-500/10 text-[var(--color-text-secondary)] hover:text-red-500 rounded-lg border border-[var(--color-border)] transition">
                  <TrashIcon class="h-4 w-4" />
                </button>
              </td>
            </tr>
            <tr v-if="paginatedSuppliers.length === 0">
              <td colspan="5" class="p-8 text-center text-[var(--color-text-muted)]">Aucun fournisseur trouvé.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-4" v-if="filteredSuppliers.length > 0">
        <Pagination 
          :total-items="filteredSuppliers.length" 
          :page-size="itemsPerPage" 
          :current-page="currentPage" 
          @update:currentPage="currentPage = $event" 
        />
      </div>
    </div>

    <!-- Add Supplier Modal -->
    <div v-if="isAddModalOpen" @click.self="isAddModalOpen = false" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm cursor-pointer">
      <div class="bg-[var(--color-surface)] rounded-2xl shadow-2xl w-full max-w-md p-6 border border-[var(--color-border)] relative cursor-default">
        <button @click="isAddModalOpen = false" class="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-red-500"><XMarkIcon class="h-6 w-6"/></button>
        <h3 class="text-xl font-bold mb-4 text-[var(--color-text-primary)]">Ajouter un Fournisseur</h3>
        
        <form @submit.prevent="saveSupplier" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Nom / Raison Sociale <span class="text-red-500">*</span></label>
            <input type="text" v-model="form.name" required class="w-full p-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] focus:ring-1 focus:ring-[var(--color-primary)]" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Email</label>
            <input type="email" v-model="form.email" class="w-full p-2 bg-[var(--color-background)] border border(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)]" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Téléphone <span class="text-red-500">*</span></label>
            <input type="text" v-model="form.phone" required class="w-full p-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)]" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Catégorie <span class="text-red-500">*</span></label>
            <input type="text" v-model="form.category" required placeholder="Ex: Boissons, Alimentaire..." class="w-full p-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)]" />
          </div>
          
          <button type="submit" class="w-full mt-4 py-3 bg-[var(--color-primary)] text-white font-bold rounded-lg hover:opacity-90 transition">
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { b2b_suppliers } from '@/utils/vendor_db.js';
import { PlusIcon, MagnifyingGlassIcon, TrashIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import Pagination from '@/components/Pagination.vue';
import { useToast } from 'vue-toastification';

const toast = useToast();

const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 8;

const filteredSuppliers = computed(() => {
  if (!searchQuery.value) return b2b_suppliers.value;
  const q = searchQuery.value.toLowerCase();
  return b2b_suppliers.value.filter(s => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q));
});

const paginatedSuppliers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredSuppliers.value.slice(start, start + itemsPerPage);
});

watch(filteredSuppliers, () => {
  currentPage.value = 1;
});

const isAddModalOpen = ref(false);
const form = ref({
  name: '',
  email: '',
  phone: '',
  category: ''
});

function saveSupplier() {
  const newSupplier = {
    id: 'SUP-' + Date.now().toString().slice(-4),
    name: form.value.name,
    email: form.value.email || 'N/A',
    phone: form.value.phone,
    category: form.value.category,
    status: 'Active'
  };

  b2b_suppliers.value.unshift(newSupplier);
  toast.success('Fournisseur ajouté avec succès.');
  isAddModalOpen.value = false;
  form.value = { name: '', email: '', phone: '', category: '' };
}

function deleteSupplier(id) {
  b2b_suppliers.value = b2b_suppliers.value.filter(s => s.id !== id);
  toast.success('Fournisseur supprimé.');
}
</script>
