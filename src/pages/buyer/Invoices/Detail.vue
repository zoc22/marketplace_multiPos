<template>
  <div class="space-y-6 max-w-5xl mx-auto" id="buyer-invoices-detail">
    <!-- PANEL HEADER / ACTIONS -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--color-border)] pb-4 gap-4 select-none hide-on-print">
      <div class="space-y-1">
        <router-link to="/buyer/invoices" class="text-sm text-[var(--color-primary)] font-mono hover:underline flex items-center space-x-2">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span>Retour aux factures</span>
        </router-link>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
          <span>Détail de la Facture</span>
          <span class="text-[var(--color-primary)] font-mono text-base">#{{ invoice?.reference || 'N/A' }}</span>
          <StatusBadge v-if="invoice" :status="invoice.status" class="ml-2" />
        </h1>
      </div>
      
      <div class="flex gap-2 shrink-0">
        <!-- Print Button -->
        <PrintButton 
          v-if="invoice" 
          :documentTitle="'Facture_' + invoice.reference" 
          label="Imprimer Facture" 
        />
      </div>
    </div>

    <!-- PRINTABLE INVOICE SHEET -->
    <PrintTemplate 
      v-if="invoice"
      title="FACTURE D'ACHAT" 
      :reference="invoice.reference" 
      :date="invoice.date_emission"
    >
      <!-- Watermark stamp -->
      <div 
        v-if="invoice?.status === 'PAID'"
        class="absolute top-24 right-12 border-4 border-emerald-600 text-emerald-600 font-mono font-black uppercase text-xs px-3 py-1.5 rounded-lg -rotate-12 select-none opacity-80"
      >
        PAYÉE ✓
      </div>

      <!-- Parties Details -->
      <div class="grid grid-cols-2 gap-6 py-6 border-b border-slate-200 text-sm">
        <div class="space-y-1">
          <span class="block text-xs font-mono text-slate-400 uppercase tracking-wider font-extrabold">Destinataire (Buyer)</span>
          <p class="text-base font-extrabold text-slate-800">{{ invoice?.receiver_id }}</p>
        </div>
        <div class="space-y-1">
          <span class="block text-xs font-mono text-slate-400 uppercase tracking-wider font-extrabold">Commande Associée</span>
          <p class="text-base font-mono font-bold text-slate-800">#{{ orderRef }}</p>
        </div>
      </div>

      <!-- Items Table -->
      <div class="py-6">
        <table class="w-full text-left text-sm border-collapse">
          <thead>
            <tr class="border-b border-slate-350 text-xs text-slate-600 font-mono uppercase font-black bg-slate-50">
              <th class="py-3 px-3 border border-slate-200">Désignation</th>
              <th class="py-3 px-3 border border-slate-200 text-center">Quantité</th>
              <th class="py-3 px-3 border border-slate-200 text-right">Prix Unitaire</th>
              <th class="py-3 px-3 border border-slate-200 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(item, idx) in invoice?.products" 
              :key="idx"
              class="text-slate-800 border-b border-slate-200"
            >
              <td class="py-3.5 px-3 border border-slate-200 font-semibold">{{ item.product_id }}</td>
              <td class="py-3.5 px-3 border border-slate-200 text-center font-mono font-bold">{{ item.quantity }}</td>
              <td class="py-3.5 px-3 border border-slate-200 text-right font-mono">{{ formatMoney(item.unit_price) }}</td>
              <td class="py-3.5 px-3 border border-slate-200 text-right font-mono font-bold text-slate-950">{{ formatMoney(item.quantity * item.unit_price) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Totals -->
      <div class="grid grid-cols-2 gap-4 py-6 border-t border-slate-200 text-sm">
        <div class="text-xs text-slate-605 font-mono flex flex-col justify-end font-extrabold">
          <p class="text-slate-700 font-black">✓ Document officiel certifié.</p>
        </div>
        <div class="space-y-2 text-xs font-mono text-slate-605 font-extrabold">
          <div class="flex justify-between border-b border-slate-200 pb-2">
            <span>SOUS-TOTAL:</span>
            <span>{{ formatMoney(invoice?.subtotal) }}</span>
          </div>
          <div class="flex justify-between border-b border-slate-200 pb-2">
            <span>TVA (19,25%) :</span>
            <span>{{ formatMoney(invoice?.tax) }}</span>
          </div>
          <div class="flex justify-between text-slate-900 pt-3 text-sm font-sans font-black">
            <span>TOTAL FACTURE :</span>
            <span>{{ formatMoney(invoice?.total) }}</span>
          </div>
        </div>
      </div>
    </PrintTemplate>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useInvoicesStore } from '@/store/modules/invoices.js';
import { useOrdersStore } from '@/store/modules/orders.js';
import StatusBadge from '@/components/common/StatusBadge.vue';
import PrintButton from '@/components/print/PrintButton.vue';
import PrintTemplate from '@/components/print/PrintTemplate.vue';

const route = useRoute();
const invoicesStore = useInvoicesStore();
const ordersStore = useOrdersStore();
const invoiceId = route.params.id;

const invoice = computed(() => {
  return invoicesStore.invoices.find(i => i.id === invoiceId);
});

const orderRef = computed(() => {
  if (!invoice.value) return '';
  const po = ordersStore.purchaseOrders.find(o => o.id === invoice.value.purchase_order_id);
  return po ? po.reference : invoice.value.purchase_order_id;
});

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val || 0).replace('XAF', 'FCFA');
}
</script>
