<template>
  <div class="space-y-6 max-w-5xl mx-auto" id="buyer-orders-detail">
    <!-- PANEL HEADER / ACTIONS -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--color-border)] pb-4 gap-4 select-none">
      <div class="space-y-1">
        <router-link to="/buyer/orders" class="text-sm text-[var(--color-primary)] font-mono hover:underline flex items-center space-x-2">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span>Retour à l'historique</span>
        </router-link>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
          <span>Détail du Bon de Commande</span>
          <span class="text-[var(--color-primary)] font-mono text-base">#{{ order?.reference || 'N/A' }}</span>
          <StatusBadge v-if="order" :status="order.status" class="ml-2" />
        </h1>
      </div>
      
      <div class="flex gap-2 shrink-0 items-center">
        <!-- Print Button -->
        <PrintButton 
          v-if="order" 
          :documentTitle="'Bon_de_Commande_' + order.reference" 
          label="Imprimer Bon" 
        />

        <button 
          v-if="order?.status === 'DELIVERED'"
          disabled
          class="px-4 py-2 bg-emerald-500/10 text-emerald-500 font-mono text-xs font-bold rounded-xl border border-emerald-500/20 flex items-center space-x-1.5"
        >
          ✓ Réception Complétée
        </button>
        <router-link
          v-else-if="order?.status === 'PROCESSING'"
          :to="'/buyer/confirm-delivery/' + orderId"
          class="px-4 py-2 bg-[var(--color-primary)] hover:opacity-90 text-white font-mono text-xs font-bold rounded-xl transition flex items-center space-x-1.5"
          id="btn-confirm-reception"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Confirmer Réception</span>
        </router-link>
      </div>
    </div>

    <!-- MAIN GRID -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- DETAILS SHEET -->
      <div class="lg:col-span-2 space-y-6">
        <PrintTemplate 
          v-if="order"
          title="BON DE COMMANDE ACHETEUR" 
          :reference="order.reference" 
          :date="order.date_emission"
        >
          <!-- Stamp watermark -->
          <div 
            v-if="order?.status === 'DELIVERED'"
            class="absolute top-24 right-12 border-4 border-emerald-600 text-emerald-600 font-mono font-black uppercase text-xs px-3 py-1.5 rounded-lg -rotate-12 select-none opacity-80"
          >
            ÉMARGÉ ✓
          </div>

          <!-- Parties details -->
          <div class="grid grid-cols-2 gap-6 py-6 border-b border-slate-200 text-sm">
            <div class="space-y-1">
              <span class="block text-xs font-mono text-slate-400 uppercase tracking-wider font-extrabold">Fournisseur Destinataire</span>
              <p class="text-base font-extrabold text-slate-800">{{ order?.receiver_id }} ({{ order?.receiver_type }})</p>
            </div>
            <div class="space-y-1">
              <span class="block text-xs font-mono text-slate-400 uppercase tracking-wider font-extrabold">Adresse de Livraison</span>
              <p class="text-slate-650 text-xs font-medium">{{ order?.shipping_address || 'Non spécifiée' }}</p>
            </div>
          </div>

          <!-- Items list -->
          <div class="py-6">
            <table class="w-full text-left text-sm border-collapse">
              <thead>
                <tr class="border-b border-slate-350 text-xs text-slate-600 font-mono uppercase font-black bg-slate-50">
                  <th class="py-3 px-3 border border-slate-200">Produit</th>
                  <th class="py-3 px-3 border border-slate-200 text-center">Quantité</th>
                  <th class="py-3 px-3 border border-slate-200 text-right">Prix Unitaire</th>
                  <th class="py-3 px-3 border border-slate-200 text-right">Montant HT</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="(item, idx) in order?.products" 
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

          <div class="flex justify-end pt-4 border-t border-slate-200">
            <div class="w-72 space-y-1.5 text-xs font-mono text-slate-605 font-extrabold">
              <div class="flex justify-between border-b border-slate-200 pb-2">
                <span>CONTRAT SOUS-TOTAL:</span>
                <span>{{ formatMoney(order?.total) }}</span>
              </div>
              <div class="flex justify-between text-slate-900 pt-3 text-sm font-sans font-black">
                <span>VALEUR TTC :</span>
                <span>{{ formatMoney(order?.total) }}</span>
              </div>
            </div>
          </div>
        </PrintTemplate>
      </div>

      <!-- TIMELINE COLUMN -->
      <div class="space-y-6">
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 space-y-4 shadow-sm">
          <h3 class="text-xs uppercase font-mono tracking-wider text-[var(--color-primary)] font-bold">Pipeline d'Approvisionnement</h3>
          <OrderTimeline 
            v-if="order" 
            :status="order.status" 
            :dates="{ 
              emission: order.date_emission, 
              validation: order.date_validation, 
              processing: order.date_processing, 
              transit: order.date_transit, 
              delivery: order.date_livraison 
            }" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useOrdersStore } from '@/store/modules/orders.js';
import StatusBadge from '@/components/common/StatusBadge.vue';
import OrderTimeline from '@/components/common/OrderTimeline.vue';
import PrintButton from '@/components/print/PrintButton.vue';
import PrintTemplate from '@/components/print/PrintTemplate.vue';

const route = useRoute();
const ordersStore = useOrdersStore();
const orderId = route.params.id;

const order = computed(() => {
  return ordersStore.purchaseOrders.find(o => o.id === orderId);
});

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val || 0).replace('XAF', 'FCFA');
}
</script>
