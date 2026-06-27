<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Réseau de Clients (Détaillants)</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Gérez la base de données de vos clients revendeurs, boutiques et coopératives.</p>
      </div>
      <button class="px-4 py-2 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-lg text-sm font-semibold transition flex items-center space-x-2">
        <UserPlusIcon class="h-5 w-5" />
        <span>Nouveau Client</span>
      </button>
    </div>

    <!-- Analytics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-5 rounded-2xl shadow-sm flex items-center space-x-4">
        <div class="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
          <UsersIcon class="h-6 w-6" />
        </div>
        <div>
          <div class="text-2xl font-bold text-[var(--color-text-primary)]">{{ clients.length }}</div>
          <div class="text-sm text-[var(--color-text-secondary)]">Total Clients</div>
        </div>
      </div>
      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-5 rounded-2xl shadow-sm flex items-center space-x-4">
        <div class="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
          <CheckBadgeIcon class="h-6 w-6" />
        </div>
        <div>
          <div class="text-2xl font-bold text-[var(--color-text-primary)]">{{ activeClientsCount }}</div>
          <div class="text-sm text-[var(--color-text-secondary)]">Clients Actifs</div>
        </div>
      </div>
      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-5 rounded-2xl shadow-sm flex items-center space-x-4">
        <div class="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
          <ShoppingCartIcon class="h-6 w-6" />
        </div>
        <div>
          <div class="text-2xl font-bold text-[var(--color-text-primary)]">{{ totalOrdersByClients }}</div>
          <div class="text-sm text-[var(--color-text-secondary)]">Commandes générées</div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
      <div class="p-4 border-b border-[var(--color-border)] flex flex-col sm:flex-row justify-between items-center gap-4 bg-[var(--color-surface-hover)]">
        <div class="relative w-full sm:w-96">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)]" />
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Rechercher (Nom, Email, Tél...)" 
            class="w-full pl-10 pr-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)]"
          />
        </div>
        <select v-model="statusFilter" class="bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm focus:outline-none w-full sm:w-auto text-[var(--color-text-primary)]">
          <option value="ALL">Tous les statuts</option>
          <option value="Actif">Actif</option>
          <option value="Inactif">Inactif</option>
        </select>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[var(--color-surface-hover)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)]">
              <th class="p-4">Nom de la structure</th>
              <th class="p-4">Type</th>
              <th class="p-4">Contact</th>
              <th class="p-4 text-center">Historique Commandes</th>
              <th class="p-4 text-center">Statut</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr v-for="c in paginatedClients" :key="c.id" class="hover:bg-[var(--color-surface-hover)] transition text-sm">
              <td class="p-4 font-bold text-[var(--color-text-primary)]">
                {{ c.name }}
                <div class="text-xs font-normal text-[var(--color-text-secondary)] mt-0.5">{{ c.location }}</div>
              </td>
              <td class="p-4 text-[var(--color-text-secondary)]">
                {{ c.type }}
              </td>
              <td class="p-4">
                <div class="text-[var(--color-text-primary)]">{{ c.email }}</div>
                <div class="text-[var(--color-text-secondary)] text-xs">{{ c.phone }}</div>
              </td>
              <td class="p-4 text-center font-bold text-[var(--color-primary)]">
                {{ c.totalOrders }}
              </td>
              <td class="p-4 text-center">
                <span 
                  class="px-2.5 py-1 rounded-full text-xs font-bold border inline-block"
                  :class="c.status === 'Actif' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'"
                >
                  {{ c.status }}
                </span>
              </td>
              <td class="p-4 text-right">
                <router-link :to="`/distributor/clients/${c.id}`" class="p-2 inline-flex items-center justify-center bg-[var(--color-surface-elevated)] hover:bg-[var(--color-primary-muted)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] rounded-lg transition border border-[var(--color-border)]">
                  <EyeIcon class="h-4 w-4" />
                </router-link>
                <button @click.prevent="itemToDelete = c; showDeleteModal = true;" class="p-2 ml-2 inline-flex items-center justify-center bg-[var(--color-surface-elevated)] hover:bg-red-500/10 text-[var(--color-text-secondary)] hover:text-red-500 rounded-lg transition border border-[var(--color-border)]">
                  <TrashIcon class="h-4 w-4" />
                </button>
              </td>
            </tr>
            <tr v-if="paginatedClients.length === 0">
              <td colspan="6" class="p-8 text-center text-[var(--color-text-muted)]">
                Aucun client trouvé.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-4">
        <Pagination 
          :total-items="filteredClients.length" 
          :page-size="itemsPerPage" 
          :current-page="currentPage" 
          @update:currentPage="currentPage = $event" 
        />
      </div>
    </div>

    <ConfirmationModal
      :show="showDeleteModal"
      title="Supprimer le client"
      message="Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible."
      action-label="Supprimer"
      :require-reason="false"
      @close="showDeleteModal = false; itemToDelete = null;"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { clients } from '@/utils/distributor_db';
import { 
  UsersIcon, CheckBadgeIcon, ShoppingCartIcon,
  MagnifyingGlassIcon, UserPlusIcon, EyeIcon, TrashIcon
} from '@heroicons/vue/24/outline';
import Pagination from '@/components/Pagination.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';

const searchQuery = ref('');
const statusFilter = ref('ALL');

const currentPage = ref(1);
const itemsPerPage = 10;

const showDeleteModal = ref(false);
const itemToDelete = ref(null);

function confirmDelete() {
  if (itemToDelete.value) {
    clients.value = clients.value.filter(c => c.id !== itemToDelete.value.id);
    itemToDelete.value = null;
    showDeleteModal.value = false;
  }
}

const activeClientsCount = computed(() => clients.value.filter(c => c.status === 'Actif').length);
const totalOrdersByClients = computed(() => clients.value.reduce((acc, c) => acc + c.totalOrders, 0));

const filteredClients = computed(() => {
  return clients.value.filter(c => {
    const matchStatus = statusFilter.value === 'ALL' || c.status === statusFilter.value;
    const searchLow = searchQuery.value.toLowerCase();
    
    const matchSearch = c.name.toLowerCase().includes(searchLow) || 
                        c.email.toLowerCase().includes(searchLow) ||
                        c.phone.includes(searchLow);

    return matchStatus && matchSearch;
  });
});

const paginatedClients = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredClients.value.slice(start, start + itemsPerPage);
});

watch(filteredClients, () => {
  currentPage.value = 1;
});
</script>
