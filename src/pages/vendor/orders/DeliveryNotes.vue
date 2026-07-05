<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex justify-between items-center shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Bons de livraison émis (Vente B2B)</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Consultez l'historique et le statut logistique de vos expéditions.</p>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[var(--color-surface-hover)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)]">
              <th class="p-4">Référence BL</th>
              <th class="p-4">Commande Associée</th>
              <th class="p-4">Destinataire</th>
              <th class="p-4">Date Émission</th>
              <th class="p-4 text-center">Statut</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr v-for="n in deliveryNotes" :key="n.id" class="hover:bg-[var(--color-surface-hover)] transition text-sm text-[var(--color-text-primary)]">
              <td class="p-4 font-bold text-[var(--color-primary)]">
                #{{ n.reference }}
              </td>
              <td class="p-4 font-medium text-[var(--color-text-secondary)] font-mono">
                #{{ getPOReference(n.purchase_order_id) }}
              </td>
              <td class="p-4">
                <span class="font-bold block">{{ n.receiver_id }}</span>
                <span class="text-xs text-[var(--color-text-secondary)] uppercase">({{ n.receiver_type }})</span>
              </td>
              <td class="p-4 text-[var(--color-text-secondary)]">
                {{ formatDate(n.date_emission) }}
              </td>
              <td class="p-4 text-center">
                <span 
                  class="px-2.5 py-1 rounded-full text-xs font-bold border inline-block"
                  :class="{
                    'bg-amber-500/10 text-amber-500 border-amber-500/20': n.status === 'PREPARED',
                    'bg-blue-500/10 text-blue-500 border-blue-500/20': n.status === 'IN_TRANSIT',
                    'bg-emerald-500/10 text-emerald-500 border-emerald-500/20': n.status === 'DELIVERED',
                    'bg-red-500/10 text-red-500 border-red-500/20': n.status === 'REFUSED'
                  }"
                >
                  {{ n.status }}
                </span>
              </td>
              <td class="p-4 text-right">
                <router-link 
                  :to="`/vendor/orders/delivery-notes/${n.id}`" 
                  class="p-2 inline-flex items-center justify-center bg-[var(--color-surface-elevated)] hover:bg-[var(--color-primary-muted)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] rounded-lg transition border border-[var(--color-border)] cursor-pointer" 
                  title="Détail &amp; Impression"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </router-link>
              </td>
            </tr>
            <tr v-if="deliveryNotes.length === 0">
              <td colspan="6" class="p-8 text-center text-[var(--color-text-secondary)] italic">
                Aucun bon de livraison émis pour le moment.
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

const deliveryNotes = computed(() => {
  return ordersStore.deliveryNotes.filter(dn => 
    dn.emitter_type === 'vendor' || dn.emitter_id === 'usr_vendor_1' || dn.emitter_id === 'vendor_1'
  );
});

const getPOReference = (poId) => {
  const po = ordersStore.purchaseOrders.find(o => o.id === poId);
  return po ? po.reference : poId;
};

const formatDate = (dateVal) => {
  if (!dateVal) return 'N/A';
  return new Date(dateVal).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
</script>
