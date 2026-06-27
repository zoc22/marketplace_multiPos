<template>
  <div class="space-y-6 max-w-7xl mx-auto" id="buyer-invoices-index">
    <!-- PANEL HEADER -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 gap-4 shadow-sm">
      <div>
        <div class="flex items-center space-x-2">
          <span class="text-xs font-mono bg-[var(--color-primary-muted)] text-[var(--color-primary)] px-2.5 py-0.5 rounded-full border border-[var(--color-primary-border)] font-bold uppercase">
            Mes Factures d'Achat
          </span>
        </div>
        <h1 class="text-lg font-bold text-[var(--color-text-primary)] mt-1">Factures d'Achat</h1>
        <p class="text-xs text-[var(--color-text-secondary)] mt-0.5">Consultez et imprimez les factures émises pour vos commandes.</p>
      </div>
    </div>

    <!-- INVOICES DATA TABLE -->
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse" id="invoices-table">
          <thead>
            <tr class="bg-[var(--color-surface-elevated)] border-b border-[var(--color-border)] text-xs font-mono text-[var(--color-text-secondary)] uppercase">
              <th class="p-4">Référence Facture</th>
              <th class="p-4">Réf. Commande</th>
              <th class="p-4">Vendeur</th>
              <th class="p-4">Date d'Émission</th>
              <th class="p-4 text-right">Montant TTC</th>
              <th class="p-4 text-center">Statut</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="invoice in filteredInvoices" 
              :key="invoice.id"
              class="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition text-sm font-medium"
            >
              <td class="p-4 font-mono font-bold text-[var(--color-text-primary)]">
                #{{ invoice.reference }}
              </td>
              <td class="p-4 font-mono text-[var(--color-text-secondary)]">
                #{{ getOrderRef(invoice.purchase_order_id) }}
              </td>
              <td class="p-4 text-[var(--color-text-primary)]">
                {{ invoice.emitter_id }}
              </td>
              <td class="p-4 text-[var(--color-text-secondary)] font-mono">
                {{ formatDate(invoice.date_emission) }}
              </td>
              <td class="p-4 text-right font-mono font-bold text-[var(--color-text-primary)]">
                {{ formatMoney(invoice.total) }}
              </td>
              <td class="p-4 text-center">
                <span 
                  class="px-3 py-1 rounded-full text-xs font-mono border uppercase font-bold"
                  :class="invoice.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'"
                >
                  {{ invoice.status === 'PAID' ? 'Payée' : 'Non payée' }}
                </span>
              </td>
              <td class="p-4 text-right space-x-2">
                <router-link
                  :to="'/buyer/invoices/' + invoice.id"
                  class="inline-flex items-center justify-center p-2 bg-[var(--color-surface-elevated)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] rounded-xl border border-[var(--color-border)] transition"
                  title="Voir détails"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </router-link>
              </td>
            </tr>
            <tr v-if="filteredInvoices.length === 0">
              <td colspan="7" class="p-8 text-center text-sm text-[var(--color-text-secondary)] font-mono italic">
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

const invoicesStore = useInvoicesStore();
const ordersStore = useOrdersStore();

const filteredInvoices = computed(() => {
  return invoicesStore.invoices.filter(i => i.receiver_type === 'buyer');
});

function getOrderRef(poId) {
  const po = ordersStore.purchaseOrders.find(o => o.id === poId);
  return po ? po.reference : poId;
}

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val || 0).replace('XAF', 'FCFA');
}

function formatDate(dateVal) {
  if (!dateVal) return 'N/A';
  return new Date(dateVal).toLocaleDateString('fr-FR');
}
</script>
