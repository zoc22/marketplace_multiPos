<template>
  <div class="space-y-6" v-if="deliveryNote">
    <!-- Breadcrumb & Header -->
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center space-x-3">
        <router-link to="/vendor/orders/delivery-notes" class="p-2 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition">
          <ArrowLeftIcon class="h-4 w-4" />
        </router-link>
        <div class="flex items-center space-x-2 text-sm text-[var(--color-text-secondary)] font-medium">
          <router-link to="/vendor/orders" class="hover:text-[var(--color-primary)] transition">Commandes</router-link>
          <ChevronRightIcon class="h-4 w-4 text-[var(--color-text-muted)]" />
          <router-link to="/vendor/orders/delivery-notes" class="hover:text-[var(--color-primary)] transition">Bons de livraison émis</router-link>
          <ChevronRightIcon class="h-4 w-4 text-[var(--color-text-muted)]" />
          <span class="text-[var(--color-text-primary)] font-bold">#{{ deliveryNote.reference }}</span>
        </div>
      </div>
      
      <div class="flex items-center gap-2">
        <PrintButton 
          :documentTitle="'Bon_de_Livraison_' + deliveryNote.reference" 
          label="Imprimer le BL" 
        />
        <!-- Start/Trigger transit simulator -->
        <button 
          v-if="deliveryNote.status === 'PREPARED'"
          @click="startTransit"
          class="px-4 py-2 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-lg text-sm font-semibold transition flex items-center space-x-1.5 cursor-pointer"
        >
          <svg class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Déclencher l'Expédition</span>
        </button>
        <span 
          v-else
          class="px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 rounded-lg text-xs font-bold font-mono"
        >
          Expédition active / Livré
        </span>
      </div>
    </div>

    <!-- Details Card -->
    <div id="printable-po-sheet" class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-8 rounded-2xl shadow-sm space-y-6">
      <div class="flex justify-between items-start border-b border-[var(--color-border)] pb-6">
        <div>
          <h1 class="text-xl font-bold text-[var(--color-text-primary)] uppercase tracking-wider">Bon de Livraison</h1>
          <div class="font-mono text-sm text-[var(--color-primary)] mt-1 font-bold">Réf : #{{ deliveryNote.reference }}</div>
          <p class="text-xs text-[var(--color-text-secondary)] mt-1">Émis le : {{ formatDate(deliveryNote.date_emission) }}</p>
        </div>
        <div class="text-right">
          <div class="text-xs text-[var(--color-text-secondary)]">Commande Associée</div>
          <div class="font-bold text-[var(--color-primary)] text-sm hover:underline">
            <router-link :to="'/vendor/orders/b2b/' + deliveryNote.purchase_order_id">#{{ purchaseOrder?.reference || deliveryNote.purchase_order_id }}</router-link>
          </div>
          <p class="text-xs text-[var(--color-text-secondary)] mt-1">Méthode d'expédition : {{ deliveryNote.shipping_mode }}</p>
        </div>
      </div>

      <!-- Parties -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div class="p-4 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl">
          <span class="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1">Expéditeur (Moi)</span>
          <span class="font-bold text-[var(--color-text-primary)]">TECHSUPPLIES Vendeur</span>
        </div>
        <div class="p-4 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl">
          <span class="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1">Destinataire</span>
          <span class="font-bold text-[var(--color-text-primary)]">{{ deliveryNote.receiver_id }}</span>
          <span class="text-xs text-[var(--color-text-secondary)] block">({{ deliveryNote.receiver_type }})</span>
        </div>
      </div>

      <!-- Products Table -->
      <div class="border border-[var(--color-border)] rounded-xl overflow-hidden">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-[var(--color-surface-hover)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)]">
              <th class="p-4">Désignation</th>
              <th class="p-4">Numéro de Lot FIFO</th>
              <th class="p-4 text-center">Quantité Livrée</th>
              <th class="p-4 text-right">Prix Unitaire</th>
              <th class="p-4 text-right">Total HT</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr v-for="(item, idx) in deliveryNote.products" :key="idx" class="text-sm hover:bg-[var(--color-surface-hover)]/40 transition">
              <td class="p-4 font-bold text-[var(--color-text-primary)]">{{ item.name || `Produit #${item.product_id}` }}</td>
              <td class="p-4 font-mono text-xs text-[var(--color-text-secondary)]">{{ item.lot_number }}</td>
              <td class="p-4 text-center text-[var(--color-text-secondary)] font-medium">{{ item.quantity_delivered }}</td>
              <td class="p-4 text-right text-[var(--color-text-secondary)]">{{ formatMoney(item.unit_price) }}</td>
              <td class="p-4 text-right font-bold text-[var(--color-text-primary)]">{{ formatMoney(item.total) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Logistics details -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[var(--color-border)] text-sm">
        <div>
          <span class="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1">Transporteur</span>
          <span class="font-medium text-[var(--color-text-primary)]">{{ deliveryNote.carrier || 'N/A' }}</span>
        </div>
        <div>
          <span class="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1">Numéro de Suivi</span>
          <span class="font-mono text-xs text-[var(--color-text-primary)]">{{ deliveryNote.tracking_number || 'N/A' }}</span>
        </div>
        <div>
          <span class="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1">Date d'expédition</span>
          <span class="font-medium text-[var(--color-text-primary)]">{{ formatDate(deliveryNote.date_emission) }}</span>
        </div>
      </div>

      <!-- Signatures -->
      <div class="grid grid-cols-2 gap-8 pt-8 border-t border-[var(--color-border)] text-xs h-32">
        <div class="border border-dashed border-[var(--color-border)] p-4 rounded-xl flex flex-col justify-between">
          <span class="font-bold text-[var(--color-text-secondary)]">Signature Expéditeur :</span>
          <span class="font-mono italic text-[var(--color-text-primary)]">{{ deliveryNote.signature || 'Signé numériquement' }}</span>
        </div>
        <div class="border border-dashed border-[var(--color-border)] p-4 rounded-xl flex flex-col justify-between">
          <span class="font-bold text-[var(--color-text-secondary)]">Signature Réceptionnaire (Client) :</span>
          <span class="font-mono italic text-[var(--color-text-primary)]">{{ deliveryNote.receiver_signature || 'En attente de réception' }}</span>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-12 text-[var(--color-text-secondary)] italic">
    Bon de livraison introuvable.
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useOrdersStore } from '@/store/modules/orders.js';
import { ArrowLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';
import PrintButton from '@/components/print/PrintButton.vue';
import { useToast } from 'vue-toastification';

const route = useRoute();
const toast = useToast();
const ordersStore = useOrdersStore();

const deliveryNote = computed(() => {
  return ordersStore.deliveryNotes.find(n => n.id === route.params.id);
});

const purchaseOrder = computed(() => {
  if (!deliveryNote.value) return null;
  return ordersStore.purchaseOrders.find(o => o.id === deliveryNote.value.purchase_order_id);
});

const startTransit = () => {
  if (deliveryNote.value) {
    deliveryNote.value.status = 'IN_TRANSIT';
    toast.success("Expédition lancée ! La livraison est en cours de route.");
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
