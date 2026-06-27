<template>
  <div class="space-y-6" v-if="invoice">
    <!-- Breadcrumb & Header -->
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center space-x-3">
        <router-link to="/distributor/invoices" class="p-2 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition">
          <ArrowLeftIcon class="h-4 w-4" />
        </router-link>
        <div class="flex items-center space-x-2 text-sm text-[var(--color-text-secondary)] font-medium">
          <router-link to="/distributor/invoices" class="hover:text-[var(--color-primary)] transition">Factures</router-link>
          <ChevronRightIcon class="h-4 w-4 text-[var(--color-text-muted)]" />
          <span class="text-[var(--color-text-primary)] font-bold">#{{ invoice.reference }}</span>
        </div>
      </div>
      
      <button @click="printInvoice" class="px-4 py-2 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg text-sm font-semibold hover:bg-[var(--color-surface-hover)] transition flex items-center shadow-sm">
        <PrinterIcon class="h-4 w-4 mr-2" />
        Imprimer
      </button>
    </div>

    <!-- Invoice Sheet -->
    <div id="invoice-sheet" class="bg-white text-slate-900 border border-slate-350 p-12 rounded-2xl shadow-xl max-w-4xl mx-auto space-y-8 font-sans">
      <div class="flex justify-between items-start border-b-2 border-slate-900 pb-6">
        <div>
          <div class="font-black text-2xl uppercase tracking-wider text-slate-800">GROUPE DISTRIBUTION CAMEROUN</div>
          <p class="text-xs text-slate-500 mt-1">RCCM : RC/YDE/2022/B/987 | Bastos, Yaoundé</p>
        </div>
        <div class="text-right">
          <h1 class="text-xl font-bold text-slate-800">FACTURE COMPAGNIE</h1>
          <div class="text-xs font-mono bg-slate-100 p-2.5 rounded border border-slate-200 mt-2 text-left">
            <div><strong>N° Facture :</strong> {{ invoice.reference }}</div>
            <div><strong>Date Émission :</strong> {{ formatDate(invoice.date_emission) }}</div>
            <div><strong>Date D'échéance :</strong> {{ formatDate(invoice.due_date) }}</div>
          </div>
        </div>
      </div>

      <!-- Parties -->
      <div class="grid grid-cols-2 gap-8 text-xs">
        <div class="p-4 bg-slate-50 border rounded-xl">
          <span class="font-bold uppercase tracking-wider text-slate-500 block mb-1">Émetteur / Vendeur</span>
          <span class="font-bold text-slate-800 text-sm">{{ invoice.emitter_id }}</span>
          <span class="text-slate-500 block">({{ invoice.emitter_type }})</span>
        </div>
        <div class="p-4 bg-slate-50 border rounded-xl">
          <span class="font-bold uppercase tracking-wider text-slate-500 block mb-1">Destinataire / Client</span>
          <span class="font-bold text-slate-800 text-sm">{{ invoice.receiver_id }}</span>
          <span class="text-slate-500 block">({{ invoice.receiver_type }})</span>
        </div>
      </div>

      <!-- Products Table -->
      <table class="w-full text-left border-collapse text-xs">
        <thead>
          <tr class="bg-slate-100 text-slate-700 font-bold border-t border-b border-slate-300 uppercase">
            <th class="p-3">Désignation</th>
            <th class="p-3 text-center">Quantité</th>
            <th class="p-3 text-right">Prix Unitaire</th>
            <th class="p-3 text-right">Total HT</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-250">
          <tr v-for="(item, idx) in invoice.products" :key="idx" class="text-slate-700">
            <td class="p-3 font-semibold">{{ item.name || `Produit #${item.product_id}` }}</td>
            <td class="p-3 text-center">{{ item.quantity || item.quantity_delivered }}</td>
            <td class="p-3 text-right">{{ formatMoneyRaw(item.unit_price) }} FCFA</td>
            <td class="p-3 text-right font-bold">{{ formatMoneyRaw(item.total || ((item.quantity || item.quantity_delivered) * item.unit_price)) }} FCFA</td>
          </tr>
        </tbody>
      </table>

      <!-- Totals -->
      <div class="flex justify-between items-start pt-6 border-t border-slate-300 text-xs">
        <div class="w-1/2 p-4 border rounded-xl bg-slate-50 text-slate-650">
          <strong>Notes de facturation :</strong>
          <p class="mt-1 text-slate-500">TVA Camerounaise applicable au taux standard de 19.25%. Le paiement est sécurisé via séquestre.</p>
        </div>
        <div class="w-1/3 space-y-2 text-right text-slate-700 font-medium">
          <div class="flex justify-between">
            <span>Sous-total HT :</span>
            <span>{{ formatMoneyRaw(invoice.subtotal) }} FCFA</span>
          </div>
          <div class="flex justify-between">
            <span>TVA (19.25%) :</span>
            <span>{{ formatMoneyRaw(invoice.tax) }} FCFA</span>
          </div>
          <div class="flex justify-between font-black text-sm text-slate-950 pt-2 border-t">
            <span>TOTAL TTC :</span>
            <span>{{ formatMoneyRaw(invoice.total) }} FCFA</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-12 text-[var(--color-text-muted)]">
    Facture introuvable...
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useInvoicesStore } from '@/store/modules/invoices.js';
import { ArrowLeftIcon, ChevronRightIcon, PrinterIcon } from '@heroicons/vue/24/outline';

const route = useRoute();
const invoicesStore = useInvoicesStore();

const invoice = computed(() => {
  return invoicesStore.invoices.find(i => i.id === route.params.id);
});

const printInvoice = () => {
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

const formatMoneyRaw = (val) => {
  return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0 }).format(val);
};
</script>

<style scoped>
@media print {
  body * {
    visibility: hidden;
  }
  #invoice-sheet, #invoice-sheet * {
    visibility: visible;
  }
  #invoice-sheet {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 0;
    border: none;
    background: white;
    color: black;
  }
}
</style>
