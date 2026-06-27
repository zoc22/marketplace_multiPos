<template>
  <div class="space-y-6 max-w-5xl mx-auto" id="order-detail-workspace">
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
          <span>Détail de la Commande</span>
          <span class="text-[var(--color-primary)] font-mono text-base">#{{ order?.reference || 'N/A' }}</span>
        </h1>
      </div>
      
      <div class="flex gap-2 shrink-0">
        <button 
          @click="printDocument"
          class="px-4 py-2 font-mono text-xs border rounded-xl transition flex items-center space-x-2"
          :class="['Packed', 'Shipped', 'Delivered', 'Completed'].includes(order?.status) ? 'bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] border-[var(--color-border)]' : 'bg-slate-550/15 text-slate-400 border-slate-500/20 cursor-not-allowed'"
          id="btn-print-po"
          :title="['Packed', 'Shipped', 'Delivered', 'Completed'].includes(order?.status) ? 'Imprimer Facture / Bon' : 'Impression bloquée : En attente d\'émission du Bon de Livraison (BL)'"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.821V7.5a3.75 3.75 0 017.5 0v6.321m-7.5 0a3.75 3.75 0 013.75-3.75h3.75a3.75 3.75 0 013.75 3.75m-11.25 0H18M9.75 16.5h4.5m-4.5 3h4.5M3 18.75a2.25 2.25 0 002.25 2.25h13.5a2.25 2.25 0 002.25-2.25V16.5a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 16.5v2.25z" />
          </svg>
          <span>Imprimer Facture</span>
        </button>

        <router-link
          v-if="order?.status === 'Shipped' || order?.status === 'Delivered' || order?.status === 'Completed'"
          :to="'/buyer/track/' + orderId"
          class="px-4 py-2 bg-[var(--color-primary)] hover:opacity-90 text-white font-mono text-xs font-bold rounded-xl transition flex items-center space-x-1.5"
          id="btn-track-delivery"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.75A1.125 1.125 0 012.625 17.625V12m18 5.625c0 .621-.504 1.125-1.125 1.125H18m-9-6.375V9m-3 3h12m-.75 3H6.75m12 0h2.25A1.125 1.125 0 0022.125 14.25V12m0 0l-3.375-4.5M21 12H18m0-3V6.75A1.125 1.125 0 0016.875 5.625H12m-3 0H5.625A1.125 1.125 0 004.5 6.75V9" />
          </svg>
          <span>Suivre Livraison</span>
        </router-link>
      </div>
    </div>

    <!-- NOTIFICATION OR PENDING ACTION BANNER -->
    <div 
      v-if="order?.status === 'Submitted'"
      class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl p-4 flex items-start space-x-3 text-sm"
    >
      <svg class="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div class="space-y-0.5 text-[var(--color-text-primary)]">
        <p class="font-bold">Commande soumise, en attente de traitement par le vendeur.</p>
        <p class="text-[var(--color-text-secondary)] text-xs">Le vendeur prépare vos articles pour l'expédition. Le montant restera bloqué sous séquestre jusqu'à la livraison.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- DETAILED PRINTABLE ORDER SHEET -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- OFFICIAL ORDER SHEET -->
        <div class="bg-white text-slate-900 p-8 shadow-md rounded-2xl border border-slate-200 font-sans tracking-tight relative overflow-hidden" id="printable-po-sheet">
          
          <!-- STAMP WATERMARK FOR DELIVERED LOGISTICS -->
          <div 
            v-if="order?.status === 'Delivered' || order?.status === 'Completed'"
            class="absolute top-20 right-10 border-4 border-emerald-600 text-emerald-650 font-mono font-black uppercase text-xs px-3 py-1.5 rounded-lg -rotate-12 select-none opacity-80"
          >
            LIVRÉ &amp; ÉMARGÉ ✓
          </div>

          <!-- Document Header -->
          <div class="flex justify-between items-start pb-6 border-b-2 border-slate-300">
            <div>
              <div class="text-xl font-black uppercase tracking-wide text-slate-900 font-mono flex items-center space-x-1.5">
                <span>Espace Client</span>
              </div>
              <p class="text-sm text-slate-700 font-mono mt-2 leading-relaxed">
                Douala, Cameroun<br>
                Portail Client B2C Sécurisé<br>
                contact@plateforme.cm
              </p>
            </div>
            <div class="text-right">
              <span class="text-slate-900 font-black font-mono text-sm uppercase bg-slate-100 border border-slate-300 px-3.5 py-1.5 rounded">FACTURE COMMANDE</span>
              <p class="text-sm font-black font-mono text-slate-900 mt-3">N° {{ order?.reference }}</p>
              <p class="text-xs text-slate-650 font-mono font-bold">Date: {{ formatDate(order?.created_at) }}</p>
            </div>
          </div>

          <!-- Partners Details -->
          <div class="grid grid-cols-2 gap-6 py-6 border-b-2 border-slate-300 text-sm">
            <div class="space-y-2">
              <span class="block text-xs font-mono text-slate-500 uppercase tracking-wider font-extrabold">Client (Acheteur)</span>
              <p class="text-base font-extrabold text-slate-900">{{ order?.clientName || 'Client Consommateur' }}</p>
              <p class="text-slate-700 text-xs leading-relaxed font-medium">
                Adresse de livraison renseignée<br>
                Paiement: Portefeuille Séquestre
              </p>
            </div>
            
            <div class="space-y-2">
              <span class="block text-xs font-mono text-slate-500 uppercase tracking-wider font-extrabold">Vendeur (Boutique)</span>
              <p class="text-base font-extrabold text-slate-900">{{ order?.supplierName || 'Boutique Partenaire' }}</p>
              <p class="text-slate-700 text-xs leading-relaxed font-medium">
                Validation en ligne<br>
                Mode d'expédition requis: {{ order?.deliveryMode || 'Fret Standard' }}
              </p>
            </div>
          </div>

          <!-- Ordered Items Table -->
          <div class="py-6">
            <table class="w-full text-left text-sm border-collapse">
              <thead>
                <tr class="border-b-2 border-slate-300 text-xs text-slate-600 font-mono uppercase font-black bg-slate-50">
                  <th class="py-3 px-3 border border-slate-300 text-slate-700">N° SKU</th>
                  <th class="py-3 px-3 border border-slate-300 text-slate-700">Désignation du produit</th>
                  <th class="py-3 px-3 border border-slate-300 text-center text-slate-700">Quantité</th>
                  <th class="py-3 px-3 border border-slate-300 text-right text-slate-700">Prix Unitaire</th>
                  <th class="py-3 px-3 border border-slate-300 text-right text-slate-700">Montant HT</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="(item, idx) in order?.items" 
                  :key="item.productId || idx"
                  class="text-slate-800 hover:bg-slate-50/60 transition border-b border-slate-300"
                >
                  <td class="py-3.5 px-3 border border-slate-300 font-mono text-xs font-bold text-slate-900">{{ item.sku || 'N/A' }}</td>
                  <td class="py-3.5 px-3 border border-slate-300">
                    <span class="font-black text-slate-900 text-sm">{{ item.productName || item.name }}</span>
                  </td>
                  <td class="py-3.5 px-3 border border-slate-300 text-center font-mono font-black text-slate-900">{{ item.quantity || item.qty }}</td>
                  <td class="py-3.5 px-3 border border-slate-300 text-right font-mono font-bold text-slate-900">{{ formatMoney(item.unitPrice) }}</td>
                  <td class="py-3.5 px-3 border border-slate-300 text-right font-mono font-black text-slate-900">{{ formatMoney((item.quantity || item.qty) * item.unitPrice) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Document Totals calculation sheet -->
          <div class="grid grid-cols-2 gap-4 py-6 pt-6 border-t-2 border-slate-300 text-sm">
            <div class="text-xs text-slate-700 font-mono flex flex-col justify-end font-extrabold">
              <p class="text-slate-900 font-black">✓ Commande certifiée et payée en ligne.</p>
              <p class="mt-1 text-slate-600">Paiement sous séquestre sécurisé.</p>
            </div>
            
            <div class="space-y-2 text-xs font-mono text-slate-700 font-extrabold">
              <div class="flex justify-between border-b border-slate-300 pb-2">
                <span>CONTRAT SOUS-TOTAL:</span>
                <span class="text-slate-900 font-black font-mono">{{ formatMoney(order?.subtotal) }}</span>
              </div>
              <div class="flex justify-between border-b border-slate-300 pb-2">
                <span>TVA CAMEROUN (19.25%):</span>
                <span class="text-slate-900 font-black font-mono">{{ formatMoney(order?.tax) }}</span>
              </div>
              <div class="flex justify-between border-b border-slate-300 pb-2">
                <span>LIVRAISON ROUTE/RAIL:</span>
                <span class="text-slate-900 font-black font-mono">{{ formatMoney(order?.shippingFee) }}</span>
              </div>
              <div class="flex justify-between text-slate-900 pt-3 border-t-2 border-slate-400 text-sm font-sans font-black">
                <span class="uppercase font-mono text-xs font-black">VALEUR FINALE TTC (FCFA):</span>
                <span class="font-mono text-sm text-slate-950 font-black">{{ formatMoney(order?.total) }}</span>
              </div>
            </div>
          </div>

          <!-- Signing Desk (simulation placeholder) -->
          <div class="mt-10 pt-10 border-t-2 border-slate-300 flex justify-between h-20 text-xs font-mono text-slate-700 font-extrabold">
            <div>
              <p class="text-slate-800 font-black">L'Émetteur Acheteur</p>
              <p class="mt-4 italic text-slate-950 font-black">[ Sceau Numérique Sourcing ]</p>
            </div>
            <div>
              <p class="text-slate-800 font-black">Le Fournisseur Agréé</p>
              <p v-if="order?.status === 'Submitted'" class="mt-4 text-amber-600 italic font-black">[ En attente de signature ]</p>
              <p v-else class="mt-4 text-emerald-700 font-black italic">[ Signature de l'entrepôt enregistrée ]</p>
            </div>
          </div>
        </div>
      </div>

      <!-- INTERACTIVE STATUS TRAILING & METRICS (RIGHT COLUMN) -->
      <div class="space-y-6">
        
        <!-- FLUX WORKFLOW STATUS TRACKER -->
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 md:p-6 space-y-4 shadow-sm">
          <h3 class="text-xs uppercase font-mono tracking-wider text-[var(--color-primary)] font-bold">Pipeline d'Approvisionnement</h3>
          
          <div class="space-y-4 relative pl-4 border-l border-[var(--color-border)]">
            <div 
              v-for="(ev, idx) in normalizedTimeline" 
              :key="idx" 
              class="relative"
            >
              <!-- Timeline circle marker -->
              <span 
                class="absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center text-[7px]"
                :class="ev.done ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-slate-950 font-bold' : 'bg-[var(--color-surface-elevated)] border-[var(--color-border)] text-[var(--color-text-secondary)]'"
              >
                ✓
              </span>
              
              <div class="space-y-0.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold leading-none" :class="ev.done ? 'text-[var(--color-text-primary)] font-extrabold' : 'text-[var(--color-text-secondary)]'">
                    {{ ev.label }}
                  </span>
                  <span class="text-[8px] font-mono text-[var(--color-text-secondary)]">{{ ev.time }}</span>
                </div>
                <p class="text-[10px] text-[var(--color-text-secondary)] leading-relaxed">{{ ev.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- DETAILS COMPLÉMENTAIRES -->
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 md:p-6 space-y-3 shadow-sm">
          <h3 class="text-xs uppercase font-mono tracking-wider text-[var(--color-text-primary)] font-bold">Métadonnées &amp; Suivi</h3>
          <div class="divide-y divide-[var(--color-border)] text-[11px] font-mono text-[var(--color-text-secondary)]">
            <div class="py-2 flex justify-between">
              <span>Réf. Commande :</span>
              <span class="text-[var(--color-text-primary)] font-bold">{{ order?.id }}</span>
            </div>
            <div class="py-2 flex justify-between">
              <span>Sous-domaine Locataire :</span>
              <span class="text-[var(--color-secondary)]">techsupplies.stancl.host</span>
            </div>
            <div class="py-2 flex justify-between">
              <span>Clé de Chiffrement :</span>
              <span class="text-[var(--color-text-primary)] truncate max-w-[120px]">B2B-SEC-SHA256-{{ order?.id }}</span>
            </div>
            <div class="py-2 flex justify-between">
              <span>Compte Séquestre :</span>
              <span class="text-[var(--color-primary)] select-all">CCA-CAM-3904-{{ orderId.toUpperCase() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { orders as dbOrders } from '@/utils/supplier_db.js';
import { useToast } from 'vue-toastification';

const route = useRoute();
const toast = useToast();
const orderId = route.params.id;

const order = computed(() => {
  return dbOrders.value?.find(o => o.id === orderId) || dbOrders.value?.[0];
});

const normalizedTimeline = computed(() => {
  if (!order.value) return [];

  const defaultEvents = [
    { label: '1. Bon de Commande Soumis', key: 'Submitted', desc: 'Généré par l\'acheteur, transmis électroniquement au fournisseur.' },
    { label: '2. PO Validé & Approuvé', key: 'Approved', desc: 'Le fournisseur accepte l\'exécution financière et lance le picking.' },
    { label: '3. Colisage & PEPS (FIFO) Matched', key: 'Packed', desc: 'Articles prélevés sur les lots anciens. Bon de livraison créé.' },
    { label: '4. Dispatch & Fret Transit', key: 'Shipped', desc: 'Colis chargé chez le transporteur, waybill généré.' },
    { label: '5. Livré & Émargé', key: 'Delivered', desc: 'Scan QR de validation effectué, signature émargée par le destinataire.' },
  ];

  const orderHist = order.value.history || [];
  
  return defaultEvents.map((lvl, index) => {
    let done = false;
    let time = '';
    let desc = lvl.desc;

    if (lvl.key === 'Submitted') {
      done = true;
      const h = orderHist.find(x => x.status === 'Submitted');
      time = h ? formatDateShort(h.timestamp) : formatDateShort(order.value.created_at);
    } else if (lvl.key === 'Approved') {
      done = ['Approved', 'Preparing', 'Packed', 'Shipped', 'Delivered', 'Completed'].includes(order.value.status);
      const h = orderHist.find(x => x.status === 'Approved');
      time = h ? formatDateShort(h.timestamp) : '';
    } else if (lvl.key === 'Packed') {
      done = ['Packed', 'Shipped', 'Delivered', 'Completed'].includes(order.value.status);
      const h = orderHist.find(x => x.status === 'Packed');
      time = h ? formatDateShort(h.timestamp) : '';
    } else if (lvl.key === 'Shipped') {
      done = ['Shipped', 'Delivered', 'Completed'].includes(order.value.status);
      const h = orderHist.find(x => x.status === 'Shipped');
      time = h ? formatDateShort(h.timestamp) : '';
    } else if (lvl.key === 'Delivered') {
      done = ['Delivered', 'Completed'].includes(order.value.status);
      const h = orderHist.find(x => x.status === 'Delivered');
      time = h ? formatDateShort(h.timestamp) : '';
    }

    return {
      label: lvl.label,
      done,
      time,
      desc
    };
  });
});

function printDocument() {
  if (!['Packed', 'Shipped', 'Delivered', 'Completed'].includes(order.value?.status)) {
    toast.error("Impression bloquée : En attente d'émission du Bon de Livraison (BL) par le fournisseur.");
    return;
  }
  window.print();
  toast.info('Impression du document lancée.');
}

function formatMoney(val) {
  if (!val && val !== 0) return '-';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('XAF', 'FCFA');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatDateShort(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
</script>

<style scoped>
/* Scoped print override cleared - global main.css print handler handles all details */
</style>

