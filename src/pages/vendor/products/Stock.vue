<template>
  <div class="space-y-6">
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Gestion Rapide des Stocks</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Ajustez manuellement les niveaux de stock (Entrées/Sorties) de votre catalogue B2C.</p>
      </div>
    </div>

    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
      <div class="p-4 border-b border-[var(--color-border)] flex flex-col sm:flex-row justify-between items-center gap-4 bg-[var(--color-surface-hover)]">
        <div class="relative w-full sm:w-96">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)]" />
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Rechercher un produit..." 
            class="w-full pl-10 pr-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)]"
          />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm border-collapse">
          <thead>
            <tr class="bg-[var(--color-surface-hover)] border-b border-[var(--color-border)] text-[var(--color-text-secondary)] font-semibold uppercase tracking-wider text-xs">
              <th class="p-4">Produit</th>
              <th class="p-4">Catégorie</th>
              <th class="p-4 text-center">Stock Actuel</th>
              <th class="p-4 text-right">Ajuster la quantité</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr v-for="p in filteredProducts" :key="p.id" class="hover:bg-[var(--color-surface-hover)]/40 transition text-[var(--color-text-primary)]">
              <td class="p-4 font-bold">
                <div>{{ p.name }}</div>
                <div class="text-xs text-[var(--color-text-muted)] font-mono font-medium mt-0.5">{{ p.barcode }}</div>
              </td>
              <td class="p-4">
                <span class="px-2 py-0.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded text-xs">{{ p.category }}</span>
              </td>
              <td class="p-4 text-center">
                <span class="px-2.5 py-1 rounded-full text-xs font-black border inline-block" :class="p.stock > (p.minStock || 10) ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'">
                  {{ p.stock }} unités
                </span>
              </td>
              <td class="p-4 text-right">
                <div class="inline-flex items-center space-x-2">
                  <input type="number" v-model.number="adjustmentValues[p.id]" min="1" class="w-16 p-1 text-center text-xs bg-[var(--color-background)] border border-[var(--color-border)] rounded font-bold" placeholder="Qté" />
                  <button @click="adjustStock(p, -1)" class="px-3 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-xs font-semibold hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition">- Retirer</button>
                  <button @click="adjustStock(p, 1)" class="px-3 py-1 bg-[var(--color-primary-muted)] text-[var(--color-primary)] border border-[var(--color-primary-border)] rounded text-xs font-semibold hover:bg-[var(--color-primary)] hover:text-white transition">+ Ajouter</button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredProducts.length === 0">
              <td colspan="4" class="p-8 text-center text-[var(--color-text-muted)]">Aucun produit trouvé.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { products } from '@/utils/vendor_db.js';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import { useToast } from 'vue-toastification';

const toast = useToast();
const searchQuery = ref('');
const adjustmentValues = ref({});

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value;
  const q = searchQuery.value.toLowerCase();
  return products.value.filter(p => p.name.toLowerCase().includes(q) || p.barcode.includes(q));
});

// Initialize adjustment inputs
products.value.forEach(p => {
  if (adjustmentValues.value[p.id] === undefined) {
    adjustmentValues.value[p.id] = 10; // Default adjust size
  }
});

function adjustStock(product, direction) {
  const qty = adjustmentValues.value[product.id] || 0;
  if (qty <= 0) {
    toast.warning("Veuillez saisir une quantité d'ajustement supérieure à 0.");
    return;
  }

  if (direction === -1 && product.stock < qty) {
    toast.error("Impossible de retirer plus de stock que la quantité disponible.");
    return;
  }

  product.stock += (direction * qty);
  
  if (direction === 1) {
    toast.success(`Ajouté ${qty} unités à ${product.name}.`);
  } else {
    toast.success(`Retiré ${qty} unités de ${product.name}.`);
  }
}
</script>
