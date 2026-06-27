<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Gestion de l'Équipe</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Gérez les comptes des managers et des caissiers de vos magasins.</p>
      </div>
      <button @click="isAddModalOpen = true" class="px-4 py-2.5 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-xl text-sm font-semibold transition flex items-center space-x-2 shadow-sm">
        <PlusIcon class="h-5 w-5" />
        <span>Ajouter un Employé</span>
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
              <th class="p-4">Employé</th>
              <th class="p-4">Rôle</th>
              <th class="p-4">Magasin Affecté</th>
              <th class="p-4 text-center">Statut</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr v-for="u in paginatedUsers" :key="u.id" class="hover:bg-[var(--color-surface-hover)]/40 transition text-sm">
              <td class="p-4">
                <div class="font-bold text-[var(--color-text-primary)]">{{ u.name }}</div>
                <div class="text-xs text-[var(--color-text-muted)] mt-1 font-mono">{{ u.email }}</div>
              </td>
              <td class="p-4">
                <span class="px-2 py-1 rounded text-xs font-bold" :class="u.role === 'Store Manager' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-slate-500/10 text-slate-500'">
                  {{ u.role === 'Store Manager' ? 'Manager' : 'Caissier' }}
                </span>
              </td>
              <td class="p-4 font-medium text-[var(--color-text-secondary)]">
                {{ getStoreName(u.storeId) }}
              </td>
              <td class="p-4 text-center">
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold border inline-block" :class="u.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'">
                  {{ u.status }}
                </span>
              </td>
              <td class="p-4 text-right">
                <button @click="deleteUser(u.id)" class="p-1.5 bg-[var(--color-surface-elevated)] hover:bg-red-500/10 text-[var(--color-text-secondary)] hover:text-red-500 rounded-lg border border-[var(--color-border)] transition">
                  <TrashIcon class="h-4 w-4" />
                </button>
              </td>
            </tr>
            <tr v-if="paginatedUsers.length === 0">
              <td colspan="5" class="p-8 text-center text-[var(--color-text-muted)]">Aucun employé trouvé.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-4" v-if="filteredUsers.length > 0">
        <Pagination 
          :total-items="filteredUsers.length" 
          :page-size="itemsPerPage" 
          :current-page="currentPage" 
          @update:currentPage="currentPage = $event" 
        />
      </div>
    </div>

    <!-- Add User Modal -->
    <div v-if="isAddModalOpen" @click.self="isAddModalOpen = false" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm cursor-pointer">
      <div class="bg-[var(--color-surface)] rounded-2xl shadow-2xl w-full max-w-md p-6 border border-[var(--color-border)] relative cursor-default">
        <button @click="isAddModalOpen = false" class="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-red-500"><XMarkIcon class="h-6 w-6"/></button>
        <h3 class="text-xl font-bold mb-4 text-[var(--color-text-primary)]">Ajouter un Employé</h3>
        
        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Nom Complet <span class="text-red-500">*</span></label>
            <input type="text" v-model="form.name" required class="w-full p-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] focus:ring-1 focus:ring-[var(--color-primary)]" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Adresse Email <span class="text-red-500">*</span></label>
            <input type="email" v-model="form.email" required class="w-full p-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)]" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Rôle <span class="text-red-500">*</span></label>
            <select v-model="form.role" required class="w-full p-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)]">
              <option value="Cashier">Caissier</option>
              <option value="Store Manager">Manager</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Affectation Magasin <span class="text-red-500">*</span></label>
            <select v-model="form.storeId" required class="w-full p-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)]">
              <option v-for="store in stores" :key="store.id" :value="store.id">{{ store.name }}</option>
            </select>
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
import { users, stores } from '@/utils/vendor_db.js';
import { PlusIcon, MagnifyingGlassIcon, TrashIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import Pagination from '@/components/Pagination.vue';
import { useToast } from 'vue-toastification';

const toast = useToast();

const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 8;

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  const q = searchQuery.value.toLowerCase();
  return users.value.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredUsers.value.slice(start, start + itemsPerPage);
});

watch(filteredUsers, () => {
  currentPage.value = 1;
});

function getStoreName(storeId) {
  const found = stores.value.find(s => s.id === storeId);
  return found ? found.name : storeId;
}

const isAddModalOpen = ref(false);
const form = ref({
  name: '',
  email: '',
  role: 'Cashier',
  storeId: stores.value[0]?.id || ''
});

function saveUser() {
  const newUser = {
    id: 'USR-' + Date.now().toString().slice(-4),
    name: form.value.name,
    email: form.value.email,
    role: form.value.role,
    storeId: form.value.storeId,
    status: 'Active'
  };

  users.value.push(newUser);
  toast.success('Employé ajouté avec succès.');
  isAddModalOpen.value = false;
  form.value = { name: '', email: '', role: 'Cashier', storeId: stores.value[0]?.id || '' };
}

function deleteUser(id) {
  users.value = users.value.filter(u => u.id !== id);
  toast.success('Employé supprimé.');
}
</script>
