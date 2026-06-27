<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex justify-between items-center shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Facturation B2B (Distributeur)</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Consultez et imprimez les factures émises et reçues liées à vos commandes.</p>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[var(--color-surface-hover)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)]">
              <th class="p-4">Référence</th>
              <th class="p-4">Commande</th>
              <th class="p-4">Client / Destinataire</th>
              <th class="p-4">Date Émission</th>
              <th class="p-4 text-right">Montant TTC</th>
              <th class="p-4 text-center">Statut</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr v-for="inv in invoices" :key="inv.id" class="hover:bg-[var(--color-surface-hover)] transition text-sm">
              <td class="p-4 font-bold text-[var(--color-primary)] font-mono">
                #{{ inv.reference }}
              </td>
              <td class="p-4 font-medium text-[var(--color-text-secondary)] font-mono">
                #{{ getPOReference(inv.purchase_order_id) }}
              </td>
              <td class="p-4">
                <span class="font-bold text-[var(--color-text-primary)]">{{ inv.receiver_id }}</span>
                <span class="text-xs text-[var(--color-text-secondary)] block">({{ inv.receiver_type }})</span>
              </td>
              <td class="p-4 text-[var(--color-text-secondary)]">
                {{ formatDate(inv.date_emission) }}
              </td>
              <td class="p-4 text-right font-bold text-[var(--color-text-primary)]">
                {{ formatMoney(inv.total) }}
              </td>
              <td class="p-4 text-center">
                <span 
                  class="px-2.5 py-1 rounded-full text-xs font-bold border inline-block"
                  :class="{
                    'bg-amber-500/10 text-amber-500 border-amber-500/20': inv.status === 'UNPAID',
                    'bg-emerald-500/10 text-emerald-500 border-emerald-500/20': inv.status === 'PAID',
                    'bg-red-500/10 text-red-500 border-red-500/20': inv.status === 'CANCELLED',
                    'bg-rose-500/10 text-rose-500 border-rose-500/20': inv.status === 'OVERDUE'
                  }"
                >
                  {{ inv.status }}
                </span>
              </td>
              <td class="p-4 text-right">
                <div class="flex justify-end space-x-2">
                  <router-link :to="`/distributor/invoices/${inv.id}`" class="p-2 inline-flex items-center justify-center bg-[var(--color-surface-elevated)] hover:bg-[var(--color-primary-muted)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] rounded-lg transition border border-[var(--color-border)]" title="Détail">
                    <EyeIcon class="h-4 w-4" />
                  </router-link>
                  <button @click="printInvoice(inv.id)" class="p-2 bg-[var(--color-surface-elevated)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] rounded-lg transition border border-[var(--color-border)]" title="Imprimer">
                    <PrinterIcon class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="invoices.length === 0">
              <td colspan="7" class="p-8 text-center text-[var(--color-text-muted)]">
                Aucune facture enregistrée pour le moment.
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
import { useInvoicesStore } from '@/store/modules/invoices.js';
import { useOrdersStore } from '@/store/modules/orders.js';
import { EyeIcon, PrinterIcon } from '@heroicons/vue/24/outline';
import { useToast } from 'vue-toastification';

const invoicesStore = useInvoicesStore();
const ordersStore = useOrdersStore();
const toast = useToast();

const invoices = computed(() => invoicesStore.invoices);

const getPOReference = (poId) => {
  const po = ordersStore.purchaseOrders.find(o => o.id === poId);
  return po ? po.reference : poId;
};

const printInvoice = (id) => {
  invoicesStore.printInvoice(id);
  toast.info('Lancement de la boîte d\'impression...');
  window.print();
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
