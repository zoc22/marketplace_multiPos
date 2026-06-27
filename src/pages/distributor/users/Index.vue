<template>
  <div class="space-y-6">
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex justify-between items-center shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Équipe et Manutention</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Gérez le personnel de votre plateforme logistique.</p>
      </div>
      <button class="px-4 py-2 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-lg text-sm font-semibold transition flex items-center space-x-2">
        <span>Ajouter un collaborateur</span>
      </button>
    </div>

    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[var(--color-surface-hover)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)]">
              <th class="p-4">Nom Complet</th>
              <th class="p-4">Rôle</th>
              <th class="p-4">Contact</th>
              <th class="p-4 text-center">Statut</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in paginatedUsers" :key="user.id" class="hover:bg-[var(--color-surface-hover)] transition text-sm">
              <td class="p-4 font-bold text-[var(--color-text-primary)]">
                {{ user.name }}
              </td>
              <td class="p-4 text-[var(--color-text-secondary)] font-medium">
                {{ user.role }}
              </td>
              <td class="p-4 text-[var(--color-text-primary)]">
                {{ user.email }}
              </td>
              <td class="p-4 text-center">
                <span 
                  class="px-2.5 py-1 rounded-full text-xs font-bold border inline-block"
                  :class="user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'"
                >
                  {{ user.status }}
                </span>
              </td>
              <td class="p-4 text-right">
                <button class="p-2 inline-flex items-center justify-center bg-[var(--color-surface-elevated)] hover:bg-[var(--color-primary-muted)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] rounded-lg transition border border-[var(--color-border)]">
                  <PencilIcon class="h-4 w-4" />
                </button>
                <button @click.prevent="itemToDelete = user; showDeleteModal = true;" class="p-2 ml-2 inline-flex items-center justify-center bg-[var(--color-surface-elevated)] hover:bg-red-500/10 text-[var(--color-text-secondary)] hover:text-red-500 rounded-lg transition border border-[var(--color-border)]">
                  <TrashIcon class="h-4 w-4" />
                </button>
              </td>
            </tr>
            <tr v-if="paginatedUsers.length === 0">
              <td colspan="5" class="p-8 text-center text-[var(--color-text-muted)]">
                Aucun collaborateur trouvé.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-4">
        <Pagination 
          :total-items="team.length" 
          :page-size="itemsPerPage" 
          :current-page="currentPage" 
          @update:currentPage="currentPage = $event" 
        />
      </div>
    </div>

    <ConfirmationModal
      :show="showDeleteModal"
      title="Supprimer le collaborateur"
      message="Êtes-vous sûr de vouloir supprimer ce collaborateur ? Cette action est irréversible."
      action-label="Supprimer"
      :require-reason="false"
      @close="showDeleteModal = false; itemToDelete = null;"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { team } from '@/utils/distributor_db';
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';
import Pagination from '@/components/Pagination.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';

const currentPage = ref(1);
const itemsPerPage = 10;

const showDeleteModal = ref(false);
const itemToDelete = ref(null);

function confirmDelete() {
  if (itemToDelete.value) {
    team.value = team.value.filter(u => u.id !== itemToDelete.value.id);
    itemToDelete.value = null;
    showDeleteModal.value = false;
  }
}

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return team.value.slice(start, start + itemsPerPage);
});

watch(team, () => {
  currentPage.value = 1;
});
</script>
