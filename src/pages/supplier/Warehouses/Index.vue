<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
          <BuildingOfficeIcon class="h-6 w-6 text-[var(--color-primary)]" />
          <span>Réseau d'Entrepôts</span>
        </h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Gérez vos hubs logistiques, leur capacité et leur inventaire en temps réel.</p>
      </div>
      <router-link to="/supplier/warehouses/create" class="px-4 py-2 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-lg text-sm font-semibold transition flex items-center space-x-2">
        <PlusIcon class="h-5 w-5" />
        <span>Nouvel Entrepôt</span>
      </router-link>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-4 bg-[var(--color-surface-elevated)] p-4 rounded-xl border border-[var(--color-border)] shadow-sm">
      <div class="relative flex-1">
        <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)]" />
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="Rechercher par nom, localisation..." 
          class="w-full pl-10 pr-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      </div>
    </div>

    <!-- Warehouses Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div 
        v-for="warehouse in filteredWarehouses" 
        :key="warehouse.id"
        class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:border-[var(--color-primary-border)] transition duration-300 shadow-sm flex flex-col"
      >
        <div class="p-5 border-b border-[var(--color-border)] bg-[var(--color-surface-hover)] flex justify-between items-start relative">
          <div>
            <h3 class="font-bold text-[var(--color-text-primary)] text-lg mb-1">{{ warehouse.name }}</h3>
            <span class="text-xs text-[var(--color-text-secondary)] flex items-center">
              <MapPinIcon class="h-3.5 w-3.5 mr-1" />
              {{ warehouse.location }}
            </span>
          </div>
          <span 
            class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border"
            :class="warehouse.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'"
          >
            {{ warehouse.status === 'Active' ? 'Opérationnel' : 'En Maintenance' }}
          </span>
        </div>

        <div class="p-5 flex-1 space-y-4">
          <div class="space-y-1">
            <div class="flex justify-between text-xs mb-1">
              <span class="text-[var(--color-text-secondary)] font-medium">Taux de remplissage</span>
              <span class="text-[var(--color-text-primary)] font-bold">{{ calculateFillRate(warehouse) }}%</span>
            </div>
            <div class="w-full bg-[var(--color-surface-hover)] rounded-full h-2 border border-[var(--color-border)] overflow-hidden">
              <div 
                class="bg-[var(--color-primary)] h-2 transition-all duration-500 rounded-full" 
                :style="{ width: calculateFillRate(warehouse) + '%' }"
                :class="{ 'bg-red-500': calculateFillRate(warehouse) > 90, 'bg-amber-500': calculateFillRate(warehouse) > 75 && calculateFillRate(warehouse) <= 90 }"
              ></div>
            </div>
            <div class="text-[10px] text-[var(--color-text-muted)] text-right mt-1">
              Capacité Max : {{ formatNumber(warehouse.capacity) }} kg
            </div>
          </div>

          <div class="pt-2 border-t border-[var(--color-border)]">
            <span class="text-xs text-[var(--color-text-secondary)] font-semibold block mb-2">Catégories autorisées :</span>
            <div class="flex flex-wrap gap-1.5">
              <span 
                v-for="cat in warehouse.categories" 
                :key="cat"
                class="px-2 py-1 bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-[10px] rounded-md font-medium"
              >
                {{ cat }}
              </span>
            </div>
          </div>
        </div>

        <div class="p-4 bg-[var(--color-surface-hover)] border-t border-[var(--color-border)] flex justify-between items-center shrink-0">
          <div class="text-xs text-[var(--color-text-secondary)]">
            Resp. : <span class="font-semibold text-[var(--color-text-primary)]">{{ warehouse.manager || 'Non assigné' }}</span>
          </div>
          <router-link 
            :to="'/supplier/warehouses/' + warehouse.id"
            class="px-4 py-1.5 bg-[var(--color-surface-elevated)] hover:bg-[var(--color-primary-muted)] text-[var(--color-primary)] font-semibold text-xs rounded-lg border border-[var(--color-border)] transition"
          >
            Gérer l'entrepôt
          </router-link>
        </div>
      </div>
    </div>

    <div v-if="filteredWarehouses.length === 0" class="text-center py-12 text-[var(--color-text-muted)]">
      Aucun entrepôt trouvé.
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { warehouses } from '@/utils/supplier_db';
import { BuildingOfficeIcon, PlusIcon, MagnifyingGlassIcon, MapPinIcon } from '@heroicons/vue/24/outline';

const searchQuery = ref('');

const filteredWarehouses = computed(() => {
  return warehouses.value.filter(w => {
    return w.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
           w.location.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

function calculateFillRate(wh) {
  // Mock logic: assume each inventory item takes a specific weight. 
  // Let's just create a mock value based on the ID to look realistic.
  const hash = wh.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return (hash % 60) + 30; // Random rate between 30 and 90
}

function formatNumber(val) {
  if (!val) return '0';
  return new Intl.NumberFormat('fr-FR').format(val);
}
</script>
