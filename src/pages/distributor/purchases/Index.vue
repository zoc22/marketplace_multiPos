<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Approvisionnement B2B (Mes Commandes Émises)</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Gérez vos bons de commande émis vers d'autres distributeurs pour votre stock.</p>
      </div>
      <router-link to="/distributor/purchases/create" class="px-4 py-2.5 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-xl text-sm font-semibold transition flex items-center space-x-2 shadow-sm">
        <PlusIcon class="h-5 w-5" />
        <span>Nouveau Bon de Commande</span>
      </router-link>
    </div>

    <!-- Table of Emitted POs -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[var(--color-surface-hover)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)]">
              <th class="p-4">Référence</th>
              <th class="p-4">Destinataire</th>
              <th class="p-4">Date Émission</th>
              <th class="p-4 text-center">Articles</th>
              <th class="p-4 text-right">Montant</th>
              <th class="p-4 text-center">Statut</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr v-for="po in emittedPurchases" :key="po.id" class="hover:bg-[var(--color-surface-hover)]/40 transition text-sm">
              <td class="p-4 font-bold text-[var(--color-primary)] font-mono">
                #{{ po.reference }}
              </td>
              <td class="p-4 font-bold text-[var(--color-text-primary)]">
                {{ po.receiver_id }} ({{ po.receiver_type }})
              </td>
              <td class="p-4 text-[var(--color-text-secondary)]">
                {{ formatDate(po.date_emission) }}
              </td>
              <td class="p-4 text-center text-[var(--color-text-secondary)] font-medium">
                {{ po.products?.length || 0 }}
              </td>
              <td class="p-4 text-right font-bold text-[var(--color-text-primary)]">
                {{ formatMoney(po.total) }}
              </td>
              <td class="p-4 text-center">
                <span 
                  class="px-2.5 py-1 rounded-full text-xs font-bold border inline-block"
                  :class="{
                    'bg-amber-500/10 text-amber-500 border-amber-500/20': po.status === 'PENDING',
                    'bg-emerald-500/10 text-emerald-500 border-emerald-500/20': po.status === 'VALIDATED' || po.status === 'DELIVERED',
                    'bg-red-500/10 text-red-500 border-red-500/20': po.status === 'REFUSED' || po.status === 'CANCELLED',
                    'bg-blue-500/10 text-blue-500 border-blue-500/20': po.status === 'PROCESSING'
                  }"
                >
                  {{ po.status }}
                </span>
              </td>
              <td class="p-4 text-right space-x-2">
                <router-link 
                  :to="`/distributor/purchases/track/${po.id}`" 
                  class="inline-flex items-center justify-center p-2 bg-[var(--color-surface-elevated)] hover:bg-[var(--color-primary-muted)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] rounded-xl border border-[var(--color-border)] transition" 
                  title="Suivre Fret & Livraison"
                >
                  <EyeIcon class="h-4.5 w-4.5" />
                </router-link>
                
                <button 
                  v-if="po.status === 'PENDING'"
                  @click="cancelPO(po.id)"
                  class="inline-flex items-center justify-center p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition"
                  title="Annuler le bon"
                >
                  <XMarkIcon class="h-4.5 w-4.5" />
                </button>
              </td>
            </tr>
            <tr v-if="emittedPurchases.length === 0">
              <td colspan="7" class="p-8 text-center text-[var(--color-text-muted)]">
                Aucun bon de commande émis pour le moment.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useOrdersStore } from '@/store/modules/orders.js';
import { useToast } from 'vue-toastification';
import { PlusIcon, EyeIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const ordersStore = useOrdersStore();
const toast = useToast();

const emittedPurchases = computed(() => {
  // Filters purchase orders where we are the emitter (e.g. buyer or distributor buying from other distributor)
  return ordersStore.purchaseOrders.filter(o => o.emitter_type === 'distributor' || o.emitter_id === 'dist_1');
});

const cancelPO = (id) => {
  const po = ordersStore.purchaseOrders.find(o => o.id === id);
  if (po) {
    po.status = 'CANCELLED';
    toast.error('Bon de commande annulé avec succès.');
  }
};

const formatDate = (dateVal) => {
  if (!dateVal) return 'N/A';
  return new Date(dateVal).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const formatMoney = (val) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('XAF', 'FCFA');
};
</script>
