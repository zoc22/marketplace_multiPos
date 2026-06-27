<template>
  <div class="space-y-6 max-w-5xl mx-auto" id="order-detail-workspace">
    <!-- PANEL HEADER / ACTIONS -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4 select-none">
      <div class="space-y-1">
        <router-link to="/buyer/orders" class="text-xs text-indigo-400 font-mono hover:underline flex items-center space-x-1">
          <span>&larr;</span>
          <span>Retour à l'historique</span>
        </router-link>
        <h1 class="text-lg font-bold text-slate-100 flex items-center space-x-2">
          <span>Bon de Commande</span>
          <span class="text-indigo-400 font-mono text-sm">#{{ order?.reference || 'N/A' }}</span>
        </h1>
      </div>
      
      <div class="flex gap-2 shrink-0">
        <button 
          @click="printDocument"
          class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs border border-slate-850 rounded-xl transition flex items-center space-x-2"
          id="btn-print-po"
        >
          <span>🖨️</span>
          <span>Imprimer PO</span>
        </button>

        <router-link
          v-if="order?.status === 'Shipped' || order?.status === 'Delivered' || order?.status === 'Completed'"
          :to="'/buyer/track/' + orderId"
          class="px-4 py-2 bg-sky-900/60 hover:bg-sky-800 text-sky-400 font-mono text-xs font-bold rounded-xl border border-sky-850 transition"
          id="btn-track-delivery"
        >
          <span>🚚 Suivre Livraison</span>
        </router-link>
      </div>
    </div>

    <!-- NOTIFICATION OR PENDING ACTION BANNER -->
    <div 
      v-if="order?.status === 'Submitted'"
      class="bg-[#121c32] border border-indigo-950 rounded-xl p-4 flex items-start space-x-3 text-xs"
    >
      <span class="text-indigo-400 text-base">⏳</span>
      <div class="space-y-0.5 text-slate-300">
        <p class="font-bold">Commande soumise au fournisseur, en attente de validation.</p>
        <p class="text-slate-400 text-[11px]">Le fournisseur analyse les stocks physiques des entrepôts régionaux et procède au picking FIFO des batches de production.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- DETAILED PRINTABLE PURCHASE ORDER SHEETS (LEFT & MAIN) -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- OFFICIAL BON DE COMMANDE SHEET -->
        <div class="bg-white text-slate-900 p-8 shadow-2xl rounded-2xl border border-slate-300 font-sans tracking-tight relative overflow-hidden" id="printable-po-sheet">
          
          <!-- STAMP WATERMARK FOR DELIVERED LOGISTICS -->
          <div 
            v-if="order?.status === 'Delivered' || order?.status === 'Completed'"
            class="absolute top-20 right-10 border-4 border-emerald-600 text-emerald-650 font-mono font-black uppercase text-xs px-3 py-1.5 rounded-lg -rotate-12 select-none opacity-80"
          >
            LIVRÉ &amp; ÉMARGÉ ✓
          </div>

          <!-- Document Header -->
          <div class="flex justify-between items-start pb-6 border-b-2 border-slate-200">
            <div>
              <div class="text-md font-extrabold uppercase tracking-wide text-indigo-900 font-mono flex items-center space-x-1.5">
                <span>🏢</span>
                <span>Sourcing Cameroun S.A.</span>
              </div>
              <p class="text-[11px] text-slate-500 font-mono mt-1 leading-tight">
                Zone Industrielle Magzi Bassa, Douala, Cameroun<br>
                Matricule Fiscal: M0426002130W8<br>
                compta@sourcingcameroun.cm | +237 233 40 12 15
              </p>
            </div>
            <div class="text-right">
              <span class="text-indigo-900 font-bold font-mono text-xs uppercase bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded">BON DE COMMANDE</span>
              <p class="text-xs font-bold font-mono text-slate-800 mt-2">N° {{ order?.reference }}</p>
              <p class="text-[11px] text-slate-500 font-mono">Date: {{ formatDate(order?.created_at) }}</p>
            </div>
          </div>

          <!-- Partners Details -->
          <div class="grid grid-cols-2 gap-6 py-6 border-b border-slate-200 text-xs">
            <div class="space-y-1">
              <span class="block text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">Émetteur (Acheteur Contractant)</span>
              <p class="font-extrabold text-slate-800">Sourcing Cameroun S.A.</p>
              <p class="text-slate-500 text-[11px] leading-relaxed">
                Représenté par: Sourcing Operator Desk<br>
                Adresse: Douala Quartier Sawa<br>
                Paiement: Compte Séquestre Escrow Holding
              </p>
            </div>
            
            <div class="space-y-1">
              <span class="block text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">Destinataire (Fournisseur Agréé)</span>
              <p class="font-extrabold text-slate-900">{{ order?.supplierName || 'Zama-Agro Sahel' }}</p>
              <p class="text-slate-500 text-[11px] leading-relaxed">
                Régime d'Imposition: Réel Simplifié<br>
                Validation: B2B Sourcing Hub<br>
                Mode d'expédition requis: {{ order?.deliveryMode || 'Fret Funiculaire Standard' }}
              </p>
            </div>
          </div>

          <!-- Ordered Items Table -->
          <div class="py-6">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="border-b-2 border-slate-200 text-[10px] text-slate-500 font-mono uppercase font-bold bg-slate-50/60">
                  <th class="py-2.5 px-2">N° SKU</th>
                  <th class="py-2.5 px-2">Désignation du produit</th>
                  <th class="py-2.5 px-2 text-center">Quantité</th>
                  <th class="py-2.5 px-2 text-right">Prix Unitaire</th>
                  <th class="py-2.5 px-2 text-right">Montant HT</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr 
                  v-for="(item, idx) in order?.items" 
                  :key="item.productId || idx"
                  class="text-slate-700 hover:bg-slate-50/40 transition"
                >
                  <td class="py-3 px-2 font-mono text-[11px] font-semibold">{{ item.sku || 'N/A' }}</td>
                  <td class="py-3 px-2">
                    <span class="font-bold text-slate-800">{{ item.productName || item.name }}</span>
                  </td>
                  <td class="py-3 px-2 text-center font-mono font-bold">{{ item.quantity || item.qty }}</td>
                  <td class="py-3 px-2 text-right font-mono">{{ formatMoney(item.unitPrice) }}</td>
                  <td class="py-3 px-2 text-right font-mono font-bold">{{ formatMoney((item.quantity || item.qty) * item.unitPrice) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Document Totals calculation sheet -->
          <div class="grid grid-cols-2 gap-4 py-4 pt-6 border-t-2 border-slate-100">
            <div class="text-[10px] text-slate-500 font-mono flex flex-col justify-end">
              <p>✓ Bon de commande certifié conforme par la commission d'achat.</p>
              <p class="mt-1">Paiement séquestre garanti par le hub bancaire.</p>
            </div>
            
            <div class="space-y-1.5 text-xs font-mono text-slate-500">
              <div class="flex justify-between">
                <span>CONTRAT SOUS-TOTAL:</span>
                <span class="text-slate-800 font-bold font-mono">{{ formatMoney(order?.subtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span>TVA CAMEROUN (19.25%):</span>
                <span class="text-slate-800 font-bold font-mono">{{ formatMoney(order?.tax) }}</span>
              </div>
              <div class="flex justify-between">
                <span>LIVRAISON ROUTE/RAIL:</span>
                <span class="text-slate-800 font-bold font-mono">{{ formatMoney(order?.shippingFee) }}</span>
              </div>
              <div class="flex justify-between text-indigo-900 pt-2 border-t border-slate-200 text-sm font-sans font-extrabold">
                <span class="uppercase font-mono text-xs">VALEUR FINALE TTC (FCFA):</span>
                <span class="font-mono text-xs">{{ formatMoney(order?.total) }}</span>
              </div>
            </div>
          </div>

          <!-- Signing Desk (simulation placeholder) -->
          <div class="mt-10 pt-10 border-t border-slate-100 flex justify-between h-20 text-[10px] font-mono text-slate-400">
            <div>
              <p class="text-slate-500 font-bold">L'Émetteur Acheteur</p>
              <p class="mt-4 italic text-indigo-900 font-semibold">[ Sceau Numérique Sourcing ]</p>
            </div>
            <div>
              <p class="text-slate-500 font-bold">Le Fournisseur Agréé</p>
              <p v-if="order?.status === 'Submitted'" class="mt-4 text-amber-500 italic">[ En attente de signature ]</p>
              <p v-else class="mt-4 text-emerald-600 font-semibold italic">[ Signature de l'entrepôt enregistrée ]</p>
            </div>
          </div>
        </div>
      </div>

      <!-- INTERACTIVE STATUS TRAILING & METRICS (RIGHT COLUMN) -->
      <div class="space-y-6">
        
        <!-- FLUX WORKFLOW STATUS TRACKER -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 space-y-4">
          <h3 class="text-xs uppercase font-mono tracking-wider text-indigo-400 font-bold">Pipeline d'Approvisionnement</h3>
          
          <div class="space-y-4 relative pl-4 border-l border-slate-800">
            <div 
              v-for="(ev, idx) in normalizedTimeline" 
              :key="idx" 
              class="relative"
            >
              <!-- Timeline circle marker -->
              <span 
                class="absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center text-[7px]"
                :class="ev.done ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'"
              >
                ✓
              </span>
              
              <div class="space-y-0.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold leading-none" :class="ev.done ? 'text-slate-250' : 'text-slate-500'">
                    {{ ev.label }}
                  </span>
                  <span class="text-[8px] font-mono text-slate-550">{{ ev.time }}</span>
                </div>
                <p class="text-[10px] text-slate-450 leading-relaxed">{{ ev.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- DETAILS COMPLÉMENTAIRES -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 space-y-3">
          <h3 class="text-xs uppercase font-mono tracking-wider text-slate-350 font-bold">Metadata &amp; Tracing</h3>
          <div class="divide-y divide-slate-850 text-[11px] font-mono text-slate-400">
            <div class="py-2 flex justify-between">
              <span>Réf Commande:</span>
              <span class="text-slate-200 font-bold">{{ order?.id }}</span>
            </div>
            <div class="py-2 flex justify-between">
              <span>Subdomain Tenant:</span>
              <span class="text-emerald-400">techsupplies.stancl.host</span>
            </div>
            <div class="py-2 flex justify-between">
              <span>Clef Cryp:</span>
              <span class="text-slate-300 truncate max-w-[120px]">B2B-SEC-SHA256-{{ order?.id }}</span>
            </div>
            <div class="py-2 flex justify-between">
              <span>Compte Séquestre BTC:</span>
              <span class="text-indigo-400 select-all">CCA-CAM-3904-{{ orderId.toUpperCase() }}</span>
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

// Normalized view for chronological timeline events
const normalizedTimeline = computed(() => {
  if (!order.value) return [];

  const defaultEvents = [
    { label: '1. Bon de Commande Soumis', key: 'Submitted', desc: 'Généré par l\'acheteur, transmis électroniquement au fournisseur.' },
    { label: '2. PO Validé & Approuvé', key: 'Approved', desc: 'Le fournisseur accepte l\'exécution financière et lance le picking.' },
    { label: '3. Colisage & FIFO Matched', key: 'Packed', desc: 'Articles prélevés sur les lots anciens (FIFO). Bon de livraison créé.' },
    { label: '4. Dispatch & Fret Transit', key: 'Shipped', desc: 'Colis chargé chez le transporteur, waybill généré.' },
    { label: '5. Livré & Émargé', key: 'Delivered', desc: 'Scan QR de validation effectué, signature émargée par le destinataire.' },
  ];

  const orderHist = order.value.history || [];
  
  // Map our states
  return defaultEvents.map((lvl, index) => {
    let done = false;
    let time = '';
    let desc = lvl.desc;

    // Determine state progression
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
  window.print();
  toast.info('Impression du document lancée.');
}

// Formatter helper utilities
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
@media print {
  body * {
    visibility: hidden;
  }
  #printable-po-sheet, #printable-po-sheet * {
    visibility: visible;
  }
  #printable-po-sheet {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    border: none;
    box-shadow: none;
    padding: 0;
  }
}
</style>
