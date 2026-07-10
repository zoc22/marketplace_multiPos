<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Réceptionner Marchandise</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Sélectionnez le bon de livraison expédié par votre fournisseur pour valider la réception physique et recharger vos stocks.</p>
      </div>
    </div>

    <!-- Table of Pending Incoming Deliveries -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
      <div class="p-4 border-b border-[var(--color-border)] bg-[var(--color-surface-hover)]">
        <h3 class="font-bold text-sm text-[var(--color-text-primary)]">Bons de livraison en cours d'acheminement (Fournisseurs B2B)</h3>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[var(--color-surface-hover)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)]">
              <th class="p-4">Référence BL</th>
              <th class="p-4">Bon de commande lié</th>
              <th class="p-4">Fournisseur</th>
              <th class="p-4">Date Expédition</th>
              <th class="p-4 text-center">Articles</th>
              <th class="p-4 text-center">Statut</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr v-for="dn in pendingIncomingDNs" :key="dn.id" class="hover:bg-[var(--color-surface-hover)] transition text-sm text-[var(--color-text-primary)]">
              <td class="p-4 font-bold text-[var(--color-primary)] font-mono">#{{ dn.reference || dn.id }}</td>
              <td class="p-4 font-mono text-xs text-[var(--color-text-secondary)]">#{{ getPOReference(dn.purchase_order_id) }}</td>
              <td class="p-4 font-bold">{{ dn.emitter_id }}</td>
              <td class="p-4 text-[var(--color-text-secondary)]">{{ formatDate(dn.date_emission) }}</td>
              <td class="p-4 text-center text-[var(--color-text-secondary)] font-medium">{{ dn.products?.length || 0 }}</td>
              <td class="p-4 text-center">
                <span class="px-2.5 py-1 rounded-full text-xs font-bold border inline-block bg-blue-500/10 text-blue-500 border-blue-500/20">
                  {{ dn.status }}
                </span>
              </td>
              <td class="p-4 text-right">
                <router-link 
                  :to="`/distributor/purchases/receive/${dn.id}`"
                  class="px-4 py-1.5 bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg text-xs font-bold transition inline-flex items-center space-x-1 cursor-pointer"
                >
                  <span>Réceptionner</span>
                </router-link>
              </td>
            </tr>
            <tr v-if="pendingIncomingDNs.length === 0">
              <td colspan="7" class="p-8 text-center text-[var(--color-text-secondary)] italic">
                Aucun bon de livraison en transit à réceptionner. Les fournisseurs doivent d'abord émettre les BLs.
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
import { useAuthStore } from '@/store/modules/auth.js';

const authStore = useAuthStore();
const ordersStore = useOrdersStore();

const pendingIncomingDNs = computed(() => {
  // Filters delivery notes destined to the distributor and not yet fully delivered
  return ordersStore.deliveryNotes.filter(dn => 
    (dn.receiver_id === authStore.user?.id || dn.receiver_id === authStore.user?.tenant) &&
    dn.status !== 'DELIVERED'
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
