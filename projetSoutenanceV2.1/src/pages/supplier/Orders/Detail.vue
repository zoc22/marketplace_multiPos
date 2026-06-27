<template>
  <div class="space-y-6 max-w-5xl mx-auto" id="supplier-order-detail-view">
    <!-- LAYOUT BREADCRUMB HEADER -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4 select-none">
      <div class="space-y-1">
        <router-link to="/supplier/orders" class="text-xs text-indigo-400 font-mono hover:underline flex items-center space-x-1">
          <span>&larr;</span>
          <span>Retour à l'exécution fret</span>
        </router-link>
        <h1 class="text-lg font-bold text-slate-100 flex items-center space-x-2">
          <span>Dossier Purchase Order</span>
          <span class="text-indigo-400 font-mono text-sm">#{{ order?.reference }}</span>
        </h1>
      </div>
      
      <div class="flex gap-2 shrink-0">
        <!-- STEP 1 action: Approve PO -->
        <button 
          v-if="order?.status === 'Submitted'"
          @click="approvePurchaseOrder"
          class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold rounded-xl transition shadow flex items-center space-x-2"
          id="btn-approve-po"
        >
          <span>✓</span>
          <span>Approuver &amp; Lancer Préparation</span>
        </button>

        <!-- STEP 2 action: Dispatch to Warehouse -->
        <router-link 
          v-if="order?.status === 'Approved' || order?.status === 'Preparing'"
          :to="'/supplier/orders/' + orderId + '/prepare'"
          class="px-5 py-2.5 bg-pink-650 hover:bg-pink-500 text-white font-mono text-xs font-bold rounded-xl transition shadow flex items-center space-x-2 blink-button"
          id="btn-warehouse-prepare"
        >
          <span>📦</span>
          <span>Faire le Colisage FIFO</span>
        </router-link>

        <router-link 
          v-if="order?.status === 'Packed'"
          to="/supplier/logistics"
          class="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold rounded-xl transition shadow flex items-center space-x-2"
          id="btn-logistics-dispatch"
        >
          <span>🚚</span>
          <span>Assigner Transporteur</span>
        </router-link>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- INVOICE/PO DETAILS SHEET (LEFT 2 COLS) -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- CLIENT PURCHASE ORDER BILL PREVIEW -->
        <div class="bg-white text-slate-900 p-8 shadow-2xl rounded-2xl border border-slate-300 font-sans tracking-tight relative">
          
          <div class="flex justify-between items-start pb-6 border-b-2 border-slate-200">
            <div>
              <div class="text-md font-extrabold uppercase tracking-wide text-indigo-950 font-mono">
                🔍 DOSSIER B2B ANALYSER
              </div>
              <p class="text-[11px] text-slate-500 font-mono mt-1">
                Analyse de solvabilité séquestre et répartition.<br>
                Source: Sourcing Cameroun S.A.
              </p>
            </div>
            <div class="text-right">
              <span class="text-indigo-900 font-bold font-mono text-xs uppercase bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded">REQUISITION CLIENT</span>
              <p class="text-xs font-bold font-mono text-slate-800 mt-2">N° Ref: {{ order?.reference }}</p>
              <p class="text-[11px] text-slate-500 font-mono">Date Dépôt: {{ formatDate(order?.created_at) }}</p>
            </div>
          </div>

          <!-- Partners Details -->
          <div class="grid grid-cols-2 gap-6 py-6 border-b border-slate-200 text-xs">
            <div class="space-y-1">
              <span class="block text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">Acheteur Concessionnaire</span>
              <p class="font-extrabold text-slate-900">{{ order?.clientCompany || order?.clientName }}</p>
              <p class="text-slate-500 text-[11px] leading-relaxed">
                ID Système: {{ order?.clientId }}<br>
                Bassin géographique: Douala, Cameroun<br>
                Sourcing Contract: {{ order?.reference }}
              </p>
            </div>
            
            <div class="space-y-1">
              <span class="block text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">Logistique requis</span>
              <p class="font-bold text-slate-800">Transport multisites</p>
              <p class="text-slate-550 text-[11px] leading-relaxed">
                Mode d'expédition formulé: <strong class="text-indigo-900 font-semibold">{{ order?.deliveryMode || 'Fret Standard Sec' }}</strong><br>
                Lieu de déchargement: Entrepôt central client
              </p>
            </div>
          </div>

          <!-- Ordered Items Table -->
          <div class="py-6">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="border-b-2 border-slate-200 text-[10px] text-slate-500 font-mono uppercase font-bold bg-slate-50/60">
                  <th class="py-2.5 px-2">N° SKU</th>
                  <th class="py-2.5 px-2">Désignation article</th>
                  <th class="py-2.5 px-2 text-center">Quantité</th>
                  <th class="py-2.5 px-2 text-right">Prix catalogue HT</th>
                  <th class="py-2.5 px-2 text-right">Total HT</th>
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
              <p>✓ Bon de commande analysé conforme.</p>
              <p class="mt-1">Paiement bloqué en Escrow Séquestre temporaire.</p>
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
        </div>
      </div>

      <!-- STATUS FLOW PROGRESS OVERVIEW (RIGHT COL) -->
      <div class="space-y-6">
        
        <!-- DYNAMIC PIPELINE TIMELINE -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 space-y-4">
          <h3 class="text-xs uppercase font-mono tracking-wider text-[#546296] font-bold">État du traitement Fret</h3>
          
          <div class="p-3.5 bg-slate-950/80 border border-slate-855 rounded-xl text-center">
            <span class="text-[9.5px] uppercase font-mono text-slate-500 block leading-none">Code Status Actuel</span>
            <span class="text-xs font-mono font-bold uppercase tracking-wide inline-block mt-2 px-2.5 py-0.5 rounded-full" :style="getStatusBadgesStyle(order?.status)">
              {{ translateStatus(order?.status) }}
            </span>
          </div>

          <div class="space-y-4 relative pl-4 border-l border-slate-800">
            <div 
              v-for="(ev, idx) in normalizedTimeline" 
              :key="idx" 
              class="relative"
            >
              <!-- Timeline circle marker -->
              <span 
                class="absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center text-[7px]"
                :class="ev.done ? 'bg-indigo-650 border-indigo-500 text-white' : 'bg-slate-955 border-slate-800 text-slate-500'"
              >
                ✓
              </span>
              
              <div class="space-y-0.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold leading-none" :class="ev.done ? 'text-slate-300' : 'text-slate-550'">
                    {{ ev.label }}
                  </span>
                  <span class="text-[8px] font-mono text-slate-550">{{ ev.time }}</span>
                </div>
                <p class="text-[10px] text-slate-450 leading-normal">{{ ev.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- DETAILS COMPLÉMENTAIRES -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 space-y-3">
          <h3 class="text-xs uppercase font-mono tracking-wider text-slate-350 font-bold">Metadata &amp; Tracing</h3>
          <div class="divide-y divide-slate-850 text-[11px] font-mono text-slate-400">
            <div class="py-2 flex justify-between">
              <span>Sourcing UUID:</span>
              <span class="text-slate-200 font-bold">{{ order?.id }}</span>
            </div>
            <div class="py-2 flex justify-between">
              <span>Tenant Host:</span>
              <span class="text-indigo-455">techsupplies.stancl.host</span>
            </div>
            <div class="py-2 flex justify-between">
              <span>Sécurité Fret:</span>
              <span class="text-emerald-450 uppercase font-bold">SOLVABLE SECURE ✓</span>
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
import { orders as dbOrders } from '@/utils/supplier_db';
import { useToast } from 'vue-toastification';

const route = useRoute();
const toast = useToast();
const orderId = route.params.id;

const order = computed(() => {
  return dbOrders.value?.find(o => o.id === orderId) || dbOrders.value?.[0];
});

// Chronological timeline mapping
const normalizedTimeline = computed(() => {
  if (!order.value) return [];

  const defaultEvents = [
    { label: '1. Bon de Commande Soumis', key: 'Submitted', desc: 'Fonds bloqués en séquestre client, en attente de vérification fournisseur.' },
    { label: '2. PO Validé (Approuvé)', key: 'Approved', desc: 'Acceptation financière, transfert de responsabilité vers les entrepôts.' },
    { label: '3. Colisage & FIFO Matched', key: 'Packed', desc: 'Lots de prélèvements validés sous FIFO. Bon de livraison prêt.' },
    { label: '4. Dispatch & Fret Transit', key: 'Shipped', desc: 'Fret pris en charge par le transporteur sélectionné.' },
    { label: '5. Livré & Émargé (Enregistré)', key: 'Delivered', desc: 'Signatures et photos enregistrés dans le registre.' },
  ];

  const orderHist = order.value.history || [];
  
  return defaultEvents.map((lvl) => {
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

// STEP 1 Action: Approve Purchase Order
function approvePurchaseOrder() {
  if (!order.value) return;
  
  const ordIndex = dbOrders.value.findIndex(o => o.id === order.value.id);
  if (ordIndex > -1) {
    const origOrder = dbOrders.value[ordIndex];
    origOrder.status = 'Approved';
    
    if (!origOrder.history) origOrder.history = [];
    origOrder.history.push({
      status: 'Approved',
      timestamp: new Date().toISOString(),
      label: 'Bon de commande approuvé par le fournisseur',
      description: 'L\'accord commercial a été scellé. Transmission du dossier aux équipes d\'entreposage pour conditionnement et affectation FIFO des lots.'
    });

    toast.success(`Le bon de commande ${order.value.reference} a été approuvé.`);
  }
}

// Formatters
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

function translateStatus(stat) {
  const m = {
    'Draft': 'Brouillon',
    'Submitted': 'Soumise Await Approval',
    'Approved': 'Approuvée (Ready for pack)',
    'Preparing': 'En préparation FIFO',
    'Packed': 'Colisée (Waybill généré)',
    'Shipped': 'En Transit Fret',
    'Delivered': 'Livrée & Émargée',
    'Cancelled': 'Annulée'
  };
  return m[stat] || stat;
}

function getStatusBadgesStyle(stat) {
  const mapping = {
    'Submitted': 'background-color: rgb(30, 27, 75); color: rgb(129, 140, 248); border: 1px solid rgb(49, 46, 129);',
    'Approved': 'background-color: rgb(6, 78, 59); color: rgb(110, 231, 183); border: 1px solid rgb(4, 120, 87);',
    'Packed': 'background-color: rgb(30, 41, 59); color: rgb(148, 163, 184); border: 1px solid rgb(51, 65, 85);',
    'Shipped': 'background-color: rgb(8, 47, 73); color: rgb(125, 211, 252); border: 1px solid rgb(14, 116, 144);',
    'Delivered': 'background-color: rgba(6, 78, 59, 0.4); color: rgb(52, 211, 153); border: 1px solid rgba(16, 185, 129, 0.41);'
  };
  return mapping[stat] || 'background-color: rgb(51, 65, 85); color: rgb(203, 213, 225);';
}
</script>

<style scoped>
.blink-button {
  animation: pulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
</style>
