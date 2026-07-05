<template>
  <div class="space-y-6 max-w-5xl mx-auto" id="order-detail-workspace" v-if="order">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--color-border)] pb-4 gap-4 select-none">
      <div class="space-y-1">
        <router-link to="/vendor/orders" class="text-sm text-[var(--color-primary)] font-mono hover:underline flex items-center space-x-2">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span>Retour à l'historique</span>
        </router-link>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
          <span>Bon de Commande B2B Reçu</span>
          <span class="text-[var(--color-primary)] font-mono text-base">#{{ order.reference }}</span>
        </h1>
      </div>
      
      <div class="flex gap-2 shrink-0">
        <PrintButton 
          :documentTitle="'Bon_de_Commande_' + order.reference" 
          label="Imprimer le BC" 
        />
        <router-link
          v-if="order.status === 'PENDING' || order.status === 'VALIDATED'"
          :to="'/vendor/orders/b2b/' + order.id + '/prepare'"
          class="px-4 py-2 bg-[var(--color-primary)] hover:opacity-90 text-white font-mono text-xs font-bold rounded-xl transition flex items-center space-x-1.5 cursor-pointer"
        >
          <span>Préparer &amp; Émettre BL</span>
        </router-link>
      </div>
    </div>

    <!-- Main Sheet -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <!-- OFFICIAL ORDER SHEET -->
        <div class="bg-white text-slate-900 p-8 shadow-md rounded-2xl border border-slate-200 font-sans tracking-tight relative overflow-hidden" id="printable-po-sheet">
          <div class="absolute top-20 right-10 border-4 border-emerald-600 text-emerald-650 font-mono font-black uppercase text-xs px-3 py-1.5 rounded-lg -rotate-12 select-none opacity-80" v-if="order.status === 'DELIVERED'">
            LIVRÉ &amp; ENREGISTRÉ ✓
          </div>

          <!-- Document Header -->
          <div class="flex justify-between items-start pb-6 border-b-2 border-slate-300">
            <div>
              <div class="text-xl font-black uppercase tracking-wide text-slate-900 font-mono">
                {{ order.emitter_id }}
              </div>
              <p class="text-xs text-slate-700 font-mono mt-1.5 leading-relaxed">
                Mode de Paiement : {{ order.payment_method === 'ESCROW' ? 'Séquestre Sécurisé' : 'Direct (MoMo/Virement)' }}<br>
                Adresse de livraison : {{ order.shipping_address || 'Entrepôt central' }}
              </p>
            </div>
            <div class="text-right">
              <span class="text-slate-900 font-black font-mono text-xs uppercase bg-slate-100 border border-slate-300 px-3 py-1.5 rounded">BON DE COMMANDE B2B</span>
              <p class="text-sm font-black font-mono text-slate-900 mt-3">N° {{ order.reference }}</p>
              <p class="text-xs text-slate-650 font-mono font-bold">Date : {{ formatDate(order.date_emission) }}</p>
            </div>
          </div>

          <!-- Details -->
          <div class="grid grid-cols-2 gap-6 py-6 border-b-2 border-slate-300 text-sm">
            <div class="space-y-1">
              <span class="block text-xs font-mono text-slate-500 uppercase tracking-wider font-extrabold">Client B2B (Émetteur)</span>
              <p class="text-sm font-extrabold text-slate-900">{{ order.emitter_id }}</p>
              <p class="text-xs text-slate-600">Type de compte : {{ order.emitter_type }}</p>
            </div>
            <div class="space-y-1">
              <span class="block text-xs font-mono text-slate-500 uppercase tracking-wider font-extrabold">Fournisseur (Moi)</span>
              <p class="text-sm font-extrabold text-slate-900">TECHSUPPLIES Vendeur</p>
              <p class="text-xs text-slate-600">Livraison souhaitée : {{ formatDate(order.date_livraison_souhaitee) }}</p>
            </div>
          </div>

          <!-- Ordered Items Table -->
          <div class="py-6">
            <table class="w-full text-left text-sm border-collapse">
              <thead>
                <tr class="border-b-2 border-slate-300 text-xs text-slate-600 font-mono uppercase font-black bg-slate-50">
                  <th class="py-3 px-3 border border-slate-300 text-slate-700">Désignation</th>
                  <th class="py-3 px-3 border border-slate-300 text-center text-slate-700">Quantité</th>
                  <th class="py-3 px-3 border border-slate-300 text-right text-slate-700">Prix unitaire</th>
                  <th class="py-3 px-3 border border-slate-300 text-right text-slate-700">Montant HT</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in order.products" :key="idx" class="text-slate-800 border-b border-slate-300">
                  <td class="py-3.5 px-3 border border-slate-300 font-black text-slate-900 text-sm">{{ item.name || `Produit #${item.product_id}` }}</td>
                  <td class="py-3.5 px-3 border border-slate-300 text-center font-mono font-black text-slate-900">{{ item.quantity }}</td>
                  <td class="py-3.5 px-3 border border-slate-300 text-right font-mono font-bold text-slate-900">{{ formatMoney(item.unit_price) }}</td>
                  <td class="py-3.5 px-3 border border-slate-300 text-right font-mono font-black text-slate-900">{{ formatMoney(item.quantity * item.unit_price) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Totals -->
          <div class="grid grid-cols-2 gap-4 py-6 border-t-2 border-slate-300 text-sm">
            <div class="text-xs text-slate-650 font-mono flex flex-col justify-end font-extrabold">
              <p>Justificatif officiel généré numériquement.</p>
            </div>
            <div class="space-y-2 text-xs font-mono text-slate-700 font-extrabold">
              <div class="flex justify-between border-b border-slate-300 pb-2">
                <span>CONTRAT SOUS-TOTAL :</span>
                <span class="text-slate-900 font-black">{{ formatMoney(order.total) }}</span>
              </div>
              <div class="flex justify-between text-slate-900 pt-3 border-t-2 border-slate-400 text-sm font-sans font-black">
                <span class="uppercase font-mono text-xs">VALEUR TOTALE CONTRAT :</span>
                <span class="font-mono text-slate-950">{{ formatMoney(order.total) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Timeline / Status info -->
      <div class="space-y-6">
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 md:p-6 space-y-4 shadow-sm">
          <h3 class="text-xs uppercase font-mono tracking-wider text-[var(--color-primary)] font-bold">Cycle de la commande</h3>
          <div class="space-y-4 relative pl-4 border-l border-[var(--color-border)]">
            <div class="relative">
              <span class="absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center text-[7px] bg-[var(--color-primary)] border-[var(--color-primary)] text-slate-950 font-bold">✓</span>
              <div class="space-y-0.5">
                <span class="text-xs font-bold text-[var(--color-text-primary)]">1. Reçue</span>
                <p class="text-[10px] text-[var(--color-text-secondary)]">Demande d'achat émise par le client.</p>
              </div>
            </div>
            <div class="relative">
              <span class="absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center text-[7px]" :class="['PROCESSING', 'DELIVERED'].includes(order.status) ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-slate-950 font-bold' : 'bg-[var(--color-surface-elevated)] border-[var(--color-border)] text-[var(--color-text-secondary)]'">✓</span>
              <div class="space-y-0.5">
                <span class="text-xs font-bold" :class="['PROCESSING', 'DELIVERED'].includes(order.status) ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'">2. Préparation / BL émis</span>
                <p class="text-[10px] text-[var(--color-text-secondary)]">Emballage et chargement logistique.</p>
              </div>
            </div>
            <div class="relative">
              <span class="absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center text-[7px]" :class="order.status === 'DELIVERED' ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-slate-950 font-bold' : 'bg-[var(--color-surface-elevated)] border-[var(--color-border)] text-[var(--color-text-secondary)]'">✓</span>
              <div class="space-y-0.5">
                <span class="text-xs font-bold" :class="order.status === 'DELIVERED' ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'">3. Livraison confirmée</span>
                <p class="text-[10px] text-[var(--color-text-secondary)]">Accusé de réception émargé par le client.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Associated Delivery Note details if any -->
        <div v-if="associatedDN" class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 md:p-6 space-y-3 shadow-sm">
          <h3 class="text-xs uppercase font-mono tracking-wider text-[var(--color-text-primary)] font-bold">Bon de livraison émis</h3>
          <div class="text-xs font-mono text-[var(--color-text-secondary)] space-y-1.5">
            <div>Réf BL : <router-link :to="'/vendor/orders/delivery-notes/' + associatedDN.id" class="text-[var(--color-primary)] hover:underline font-bold">#{{ associatedDN.reference || associatedDN.id }}</router-link></div>
            <div>Statut : <span class="font-bold text-emerald-500">{{ associatedDN.status }}</span></div>
            <div>Transporteur : {{ associatedDN.carrier }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-12 text-[var(--color-text-secondary)] italic">
    Commande B2B introuvable.
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useOrdersStore } from '@/store/modules/orders.js';
import PrintButton from '@/components/print/PrintButton.vue';

const route = useRoute();
const ordersStore = useOrdersStore();

const order = computed(() => {
  return ordersStore.purchaseOrders.find(o => o.id === route.params.id);
});

const associatedDN = computed(() => {
  if (!order.value) return null;
  return ordersStore.deliveryNotes.find(dn => dn.purchase_order_id === order.value.id);
});

function formatMoney(amount) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(amount).replace('XAF', 'FCFA');
}

function formatDate(dateVal) {
  if (!dateVal) return 'N/A';
  return new Date(dateVal).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}
</script>
