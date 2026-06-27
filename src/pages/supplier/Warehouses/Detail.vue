<template>
  <div class="space-y-6" v-if="warehouse">
    <!-- Breadcrumb & Header -->
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center space-x-3">
        <router-link to="/supplier/warehouses" class="p-2 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition">
          <ArrowLeftIcon class="h-4 w-4" />
        </router-link>
        <div class="flex items-center space-x-2 text-sm text-[var(--color-text-secondary)] font-medium">
          <router-link to="/supplier/warehouses" class="hover:text-[var(--color-primary)] transition">Entrepôts</router-link>
          <ChevronRightIcon class="h-4 w-4 text-[var(--color-text-muted)]" />
          <span class="text-[var(--color-text-primary)] font-bold">{{ warehouse.name }}</span>
        </div>
      </div>
      <div class="flex space-x-3">
        <button class="px-4 py-2 bg-[var(--color-surface-hover)] border border-[var(--color-border)] hover:bg-[var(--color-primary-muted)] text-[var(--color-text-primary)] rounded-lg text-sm font-semibold transition flex items-center space-x-2">
          <PencilIcon class="h-4 w-4" />
          <span class="hidden sm:inline">Modifier</span>
        </button>
        <button 
          @click="toggleStatus"
          class="px-4 py-2 border rounded-lg text-sm font-semibold transition flex items-center space-x-2"
          :class="warehouse.status === 'Active' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30 hover:bg-amber-500 hover:text-white' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500 hover:text-white'"
        >
          <CogIcon class="h-4 w-4" />
          <span class="hidden sm:inline">{{ warehouse.status === 'Active' ? 'Passer en maintenance' : 'Rendre opérationnel' }}</span>
        </button>
      </div>
    </div>

    <!-- Analytics Dashboard -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm md:col-span-2 flex flex-col justify-center">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h1 class="text-2xl font-bold text-[var(--color-text-primary)]">{{ warehouse.name }}</h1>
            <p class="text-sm text-[var(--color-text-secondary)] mt-1 flex items-center">
              <MapPinIcon class="h-4 w-4 mr-1" />
              {{ warehouse.location }}
            </p>
          </div>
          <span 
            class="px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide"
            :class="warehouse.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'"
          >
            {{ warehouse.status === 'Active' ? 'Actif' : 'Maintenance' }}
          </span>
        </div>
        <div class="text-sm text-[var(--color-text-secondary)] border-t border-[var(--color-border)] pt-4 mt-2">
          Responsable: <span class="font-bold text-[var(--color-text-primary)]">{{ warehouse.manager || 'N/A' }}</span>
        </div>
        <div class="mt-3 flex flex-wrap gap-2">
          <span v-for="cat in warehouse.categories" :key="cat" class="px-2 py-1 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-md text-[10px] font-semibold text-[var(--color-text-primary)] uppercase">
            {{ cat }}
          </span>
        </div>
      </div>
      
      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm flex flex-col justify-between">
        <div class="flex justify-between items-center text-[var(--color-text-secondary)]">
          <span class="text-sm font-semibold">Volume Utilisé</span>
          <CubeIcon class="h-5 w-5 text-indigo-500" />
        </div>
        <div>
          <div class="text-3xl font-bold text-[var(--color-text-primary)] my-2">
            {{ calculateFillRate(warehouse) }}<span class="text-xl text-[var(--color-text-muted)]">%</span>
          </div>
          <div class="w-full bg-[var(--color-surface-hover)] rounded-full h-1.5 border border-[var(--color-border)] overflow-hidden">
            <div class="bg-indigo-500 h-1.5 rounded-full" :style="{ width: calculateFillRate(warehouse) + '%' }"></div>
          </div>
          <div class="text-[10px] text-[var(--color-text-secondary)] mt-2 text-right">
            Capacité: {{ formatNumber(warehouse.capacity) }} kg
          </div>
        </div>
      </div>

      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm flex flex-col justify-between">
        <div class="flex justify-between items-center text-[var(--color-text-secondary)]">
          <span class="text-sm font-semibold">Valeur du Stock</span>
          <BanknotesIcon class="h-5 w-5 text-emerald-500" />
        </div>
        <div>
          <div class="text-2xl font-bold text-[var(--color-text-primary)] my-2">
            {{ formatMoney(totalStockValue) }}
          </div>
          <div class="text-[10px] text-[var(--color-text-secondary)] mt-2">
            Basé sur le prix de vente moyen
          </div>
        </div>
      </div>
    </div>

    <!-- Inventory Table -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
      <div class="p-6 border-b border-[var(--color-border)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 class="font-bold text-lg text-[var(--color-text-primary)] flex items-center space-x-2">
          <ArchiveBoxIcon class="h-5 w-5 text-[var(--color-primary)]" />
          <span>Inventaire Actuel</span>
        </h3>
        <div class="flex space-x-3">
          <router-link to="/supplier/warehouses/transfers" class="px-3 py-1.5 bg-[var(--color-surface-hover)] hover:bg-[var(--color-primary-muted)] text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-lg text-xs font-semibold transition">
            Transfert de stock
          </router-link>
          <router-link to="/supplier/warehouses/adjustments" class="px-3 py-1.5 bg-[var(--color-surface-hover)] hover:bg-[var(--color-primary-muted)] text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-lg text-xs font-semibold transition">
            Ajustement
          </router-link>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[var(--color-surface-hover)] border-b border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
              <th class="p-4">Réf. Produit</th>
              <th class="p-4">Désignation</th>
              <th class="p-4 text-right">Quantité Stockée</th>
              <th class="p-4 text-right">Valeur Estimée</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr v-for="item in inventoryList" :key="item.id" class="hover:bg-[var(--color-surface-hover)] transition text-sm">
              <td class="p-4 font-bold text-[var(--color-text-primary)]">
                {{ item.id }}
              </td>
              <td class="p-4 text-[var(--color-text-secondary)] font-medium">
                {{ item.name }}
              </td>
              <td class="p-4 text-right">
                <span class="px-2 py-1 bg-[var(--color-primary-muted)] text-[var(--color-primary)] rounded-md font-bold text-xs">{{ formatNumber(item.stock) }}</span>
              </td>
              <td class="p-4 text-right font-semibold text-[var(--color-text-primary)]">
                {{ formatMoney(item.value) }}
              </td>
            </tr>
            <tr v-if="inventoryList.length === 0">
              <td colspan="4" class="p-8 text-center text-sm text-[var(--color-text-muted)]">
                L'entrepôt est actuellement vide.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-12 text-[var(--color-text-muted)]">
    Entrepôt introuvable.
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { warehouses } from '@/utils/supplier_db';
import { useToast } from 'vue-toastification';
import { 
  ArrowLeftIcon, ChevronRightIcon, PencilIcon, CogIcon,
  MapPinIcon, CubeIcon, BanknotesIcon, ArchiveBoxIcon
} from '@heroicons/vue/24/outline';

const route = useRoute();
const toast = useToast();

const warehouse = computed(() => {
  return warehouses.value.find(w => w.id === route.params.id);
});

const inventoryList = computed(() => {
  return warehouse.value?.inventory || [];
});

const totalStockValue = computed(() => {
  return inventoryList.value.reduce((acc, item) => acc + (item.value || 0), 0);
});

function toggleStatus() {
  if (!warehouse.value) return;
  warehouse.value.status = warehouse.value.status === 'Active' ? 'Maintenance' : 'Active';
  toast.success(`Statut de l'entrepôt mis à jour.`);
}

function calculateFillRate(wh) {
  const hash = wh.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return (hash % 60) + 30; // Random rate between 30 and 90
}

function formatNumber(val) {
  if (!val) return '0';
  return new Intl.NumberFormat('fr-FR').format(val);
}

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('XAF', 'FCFA');
}
</script>
