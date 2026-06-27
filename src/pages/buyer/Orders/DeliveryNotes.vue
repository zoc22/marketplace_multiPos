<template>
  <div class="space-y-6 max-w-7xl mx-auto" id="buyer-delivery-notes">
    <!-- PANEL HEADER -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 gap-4 shadow-sm">
      <div>
        <div class="flex items-center space-x-2">
          <span class="text-xs font-mono bg-[var(--color-primary-muted)] text-[var(--color-primary)] px-2.5 py-0.5 rounded-full border border-[var(--color-primary-border)] font-bold uppercase">
            Bons de Livraison
          </span>
        </div>
        <h1 class="text-lg font-bold text-[var(--color-text-primary)] mt-1">Bons de Livraison Reçus</h1>
        <p class="text-xs text-[var(--color-text-secondary)] mt-0.5">Consultez et validez les réceptions des lots d'approvisionnement.</p>
      </div>
    </div>

    <!-- DELIVERIES DATA TABLE -->
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse" id="deliveries-table">
          <thead>
            <tr class="bg-[var(--color-surface-elevated)] border-b border-[var(--color-border)] text-xs font-mono text-[var(--color-text-secondary)] uppercase">
              <th class="p-4">Référence BL</th>
              <th class="p-4">Réf. Commande</th>
              <th class="p-4">Vendeur</th>
              <th class="p-4">Date d'Émission</th>
              <th class="p-4 text-center">Statut</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="dn in filteredDeliveryNotes" 
              :key="dn.id"
              class="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition text-sm font-medium"
            >
              <td class="p-4 font-mono font-bold text-[var(--color-text-primary)]">
                #{{ dn.reference }}
              </td>
              <td class="p-4 font-mono text-[var(--color-text-secondary)]">
                #{{ getOrderRef(dn.purchase_order_id) }}
              </td>
              <td class="p-4 text-[var(--color-text-primary)]">
                {{ dn.emitter_id }}
              </td>
              <td class="p-4 text-[var(--color-text-secondary)] font-mono">
                {{ formatDate(dn.date_emission) }}
              </td>
              <td class="p-4 text-center">
                <span 
                  class="px-3 py-1 rounded-full text-xs font-mono border uppercase font-bold"
                  :class="dn.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'"
                >
                  {{ dn.status === 'DELIVERED' ? 'Livré / Émargé' : 'Préparé / En Transit' }}
                </span>
              </td>
              <td class="p-4 text-right space-x-2">
                <router-link
                  :to="'/buyer/confirm-delivery/' + dn.purchase_order_id"
                  class="px-3.5 py-1.5 bg-[var(--color-primary)] hover:opacity-90 text-white font-mono text-xs font-bold rounded-xl transition"
                >
                  {{ dn.status === 'DELIVERED' ? 'Afficher Preuve' : 'Émarger Réception' }}
                </router-link>
              </td>
            </tr>
            <tr v-if="filteredDeliveryNotes.length === 0">
              <td colspan="6" class="p-8 text-center text-sm text-[var(--color-text-secondary)] font-mono italic">
                Aucun bon de livraison reçu pour le moment.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useOrdersStore } from '@/store/modules/orders.js';

const ordersStore = useOrdersStore();

const filteredDeliveryNotes = computed(() => {
  return ordersStore.deliveryNotes.filter(n => n.receiver_type === 'buyer');
});

function getOrderRef(poId) {
  const po = ordersStore.purchaseOrders.find(o => o.id === poId);
  return po ? po.reference : poId;
}

function formatDate(dateVal) {
  if (!dateVal) return 'N/A';
  return new Date(dateVal).toLocaleDateString('fr-FR');
}
</script>
