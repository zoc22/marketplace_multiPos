<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Fournisseurs B2B</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Gérez vos sous-traitants et partenaires d'approvisionnement.</p>
      </div>
      <router-link to="/supplier/suppliers/create" class="px-4 py-2 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-lg text-sm font-semibold transition flex items-center space-x-2">
        <PlusIcon class="h-5 w-5" />
        <span>Nouveau Fournisseur</span>
      </router-link>
    </div>

    <!-- Filters & Search -->
    <div class="flex flex-col sm:flex-row gap-4 bg-[var(--color-surface-elevated)] p-4 rounded-xl border border-[var(--color-border)]">
      <div class="relative flex-1">
        <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)]" />
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="Rechercher par nom, email, ID..." 
          class="w-full pl-10 pr-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      </div>
      <select v-model="statusFilter" class="bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] w-full sm:w-auto">
        <option value="ALL">Tous les statuts</option>
        <option value="Active">Actifs</option>
        <option value="Suspended">Suspendus</option>
      </select>
    </div>

    <!-- Suppliers Table -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[var(--color-surface-hover)] border-b border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
              <th class="p-4">Identifiant</th>
              <th class="p-4">Fournisseur</th>
              <th class="p-4">Catégorie</th>
              <th class="p-4">Conditions</th>
              <th class="p-4 text-center">Statut</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr v-for="sup in filteredSuppliers" :key="sup.id" class="hover:bg-[var(--color-surface-hover)] transition text-sm">
              <td class="p-4 font-bold text-[var(--color-primary)]">
                <router-link :to="'/supplier/suppliers/' + sup.id" class="hover:underline">{{ sup.id }}</router-link>
              </td>
              <td class="p-4">
                <span class="block font-bold text-[var(--color-text-primary)]">{{ sup.name }}</span>
                <span class="block text-xs text-[var(--color-text-muted)] mt-0.5">{{ sup.email }} • {{ sup.phone }}</span>
              </td>
              <td class="p-4 text-[var(--color-text-secondary)]">
                <span class="px-2.5 py-1 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-md text-xs font-medium">{{ sup.category }}</span>
              </td>
              <td class="p-4 text-[var(--color-text-secondary)] font-medium">
                {{ sup.paymentTerms }}
              </td>
              <td class="p-4 text-center">
                <span 
                  class="px-2.5 py-1 rounded-full text-xs font-bold border"
                  :class="sup.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'"
                >
                  {{ sup.status === 'Active' ? 'Actif' : 'Suspendu' }}
                </span>
              </td>
              <td class="p-4 text-right">
                <router-link 
                  :to="'/supplier/suppliers/' + sup.id"
                  class="p-2 inline-flex items-center justify-center bg-[var(--color-surface-elevated)] hover:bg-[var(--color-primary-muted)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] rounded-lg transition border border-[var(--color-border)]"
                >
                  <EyeIcon class="h-4 w-4" />
                </router-link>
              </td>
            </tr>
            <tr v-if="filteredSuppliers.length === 0">
              <td colspan="6" class="p-8 text-center text-sm text-[var(--color-text-muted)]">
                Aucun fournisseur trouvé.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { b2b_suppliers } from '@/utils/supplier_db';
import { EyeIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline';

const searchQuery = ref('');
const statusFilter = ref('ALL');

const filteredSuppliers = computed(() => {
  return b2b_suppliers.value.filter(s => {
    const matchStatus = statusFilter.value === 'ALL' || s.status === statusFilter.value;
    const matchSearch = s.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                        s.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                        s.email.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchStatus && matchSearch;
  });
});
</script>
