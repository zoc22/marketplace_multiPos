<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm">
      <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Bons de Livraison (Réceptions)</h1>
      <p class="text-sm text-[var(--color-text-secondary)] mt-1">Suivez les marchandises reçues de la part de vos fournisseurs B2B.</p>
    </div>

    <!-- Table -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
      <div class="p-4 border-b border-[var(--color-border)] bg-[var(--color-surface-hover)]">
        <div class="relative w-full sm:w-96">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-secondary)]" />
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Rechercher (Numéro BL, BC...)" 
            class="w-full pl-10 pr-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text-primary)]"
          />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[var(--color-surface-hover)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)]">
              <th class="p-4">Réf. BL</th>
              <th class="p-4">Réf. Commande</th>
              <th class="p-4">Fournisseur</th>
              <th class="p-4">Date de Réception</th>
              <th class="p-4 text-center">Statut</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr v-for="dn in filteredDNs" :key="dn.id" class="hover:bg-[var(--color-surface-hover)]/40 transition text-sm text-[var(--color-text-primary)]">
              <td class="p-4 font-bold text-[var(--color-primary)]">
                #{{ dn.reference || dn.id }}
              </td>
              <td class="p-4 text-[var(--color-text-secondary)] font-medium font-mono">
                #{{ dn.purchase_order_id || dn.purchaseId }}
              </td>
              <td class="p-4 font-bold text-[var(--color-text-primary)]">
                {{ getSupplierName(dn.emitter_id || dn.supplierId) }}
              </td>
              <td class="p-4 text-[var(--color-text-secondary)]">
                {{ formatDate(dn.date_emission || dn.date) }} <br/> 
                <span class="text-xs text-[var(--color-text-secondary)]">Reçu par {{ dn.receiver_signature || dn.receivedBy || 'Responsable' }}</span>
              </td>
              <td class="p-4 text-center">
                <span 
                  class="px-2.5 py-1 rounded-full text-xs font-bold border inline-block"
                  :class="dn.status === 'DELIVERED' || dn.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'"
                >
                  {{ dn.status === 'DELIVERED' || dn.status === 'Verified' ? 'Vérifié' : 'En attente' }}
                </span>
              </td>
              <td class="p-4 text-right space-x-2">
                <router-link :to="'/distributor/purchases/delivery-notes/' + dn.id" class="p-2 inline-flex items-center justify-center bg-[var(--color-surface-elevated)] hover:bg-[var(--color-primary-muted)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] rounded-lg transition border border-[var(--color-border)] cursor-pointer" title="Voir détails">
                  <EyeIcon class="h-4 w-4" />
                </router-link>
                <router-link 
                  v-if="dn.status !== 'DELIVERED' && dn.status !== 'Verified'"
                  :to="'/distributor/purchases/receive/' + dn.id"
                  class="p-2 inline-flex items-center justify-center bg-emerald-500/10 hover:bg-emerald-550/20 text-emerald-500 rounded-lg transition border border-emerald-500/20 cursor-pointer animate-pulse"
                  title="Réceptionner la marchandise"
                >
                  <CheckIcon class="h-4 w-4" />
                </router-link>
              </td>
            </tr>
            <tr v-if="filteredDNs.length === 0">
              <td colspan="6" class="p-8 text-center text-[var(--color-text-secondary)] italic">
                Aucun bon de livraison trouvé.
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
import { useOrdersStore } from '@/store/modules/orders.js';
import { b2b_suppliers, delivery_notes } from '@/utils/distributor_db';
import { MagnifyingGlassIcon, EyeIcon, CheckIcon } from '@heroicons/vue/24/outline';

const ordersStore = useOrdersStore();
const searchQuery = ref('');

// Combine mock delivery notes from distributor_db and dynamic delivery notes from pinia store
const allDeliveryNotes = computed(() => {
  const storeNotes = ordersStore.deliveryNotes || [];
  const dbNotes = delivery_notes.value || [];
  
  // Combine lists avoiding duplicates by id
  const combined = [...storeNotes];
  dbNotes.forEach(dn => {
    if (!combined.some(x => x.id === dn.id)) {
      combined.push(dn);
    }
  });
  return combined;
});

const filteredDNs = computed(() => {
  return allDeliveryNotes.value.filter(dn => {
    const searchLow = searchQuery.value.toLowerCase();
    const refPo = (dn.purchase_order_id || dn.purchaseId || '').toLowerCase();
    const refBl = (dn.reference || dn.id || '').toLowerCase();
    const supName = getSupplierName(dn.emitter_id || dn.supplierId).toLowerCase();
    
    return refBl.includes(searchLow) || 
           refPo.includes(searchLow) ||
           supName.includes(searchLow);
  });
});

function getSupplierName(id) {
  const sup = b2b_suppliers.value.find(s => s.id === id);
  return sup ? sup.name : id;
}

const formatDate = (dateVal) => {
  if (!dateVal) return 'N/A';
  return new Date(dateVal).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
</script>
