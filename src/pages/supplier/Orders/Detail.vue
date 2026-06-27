<template>
  <div class="space-y-6 max-w-5xl mx-auto" id="supplier-order-detail-view">
    <!-- LAYOUT BREADCRUMB HEADER -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--color-border)] pb-4 gap-4 select-none">
      <div class="space-y-1">
        <router-link to="/supplier/orders" class="text-sm text-[var(--color-primary)] font-semibold hover:underline flex items-center space-x-1.5">
          <ArrowLeftIcon class="w-4 h-4" />
          <span>Retour aux commandes</span>
        </router-link>
        <h1 class="text-2xl font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
          <span>Dossier de commande</span>
          <span class="text-[var(--color-primary)] font-mono text-lg">#{{ order?.reference }}</span>
        </h1>
      </div>
      
      <div class="flex gap-3 shrink-0">
        <!-- STEP 1 action: Approve PO -->
        <button 
          v-if="order?.status === 'Submitted'"
          @click="approvePurchaseOrder"
          class="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl transition shadow flex items-center space-x-2"
          id="btn-approve-po"
        >
          <CheckIcon class="w-5 h-5" />
          <span>Valider la commande</span>
        </button>

        <!-- STEP 2 action: Dispatch to Warehouse -->
        <router-link 
          v-if="order?.status === 'Approved' || order?.status === 'Preparing'"
          :to="'/supplier/orders/' + orderId + '/prepare'"
          class="px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white text-sm font-bold rounded-xl transition shadow flex items-center space-x-2 blink-button"
          id="btn-warehouse-prepare"
        >
          <InboxIcon class="w-5 h-5" />
          <span>Préparer le colisage</span>
        </router-link>

        <router-link 
          v-if="order?.status === 'Packed'"
          to="/supplier/logistics"
          class="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition shadow flex items-center space-x-2"
          id="btn-logistics-dispatch"
        >
          <TruckIcon class="w-5 h-5" />
          <span>Assigner un transporteur</span>
        </router-link>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- INVOICE/PO DETAILS SHEET (LEFT 2 COLS) -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- CLIENT PURCHASE ORDER BILL PREVIEW -->
        <div class="bg-white text-slate-900 p-8 shadow-xl rounded-2xl border border-slate-200 font-sans tracking-tight relative">
          
          <div class="flex justify-between items-start pb-6 border-b-2 border-slate-100">
            <div>
              <div class="text-lg font-bold text-[var(--color-primary)] flex items-center space-x-2">
                <DocumentTextIcon class="w-6 h-6" />
                <span>Bon de commande client</span>
              </div>
              <p class="text-sm text-slate-500 mt-1">
                Analyse de solvabilité et répartition.<br>
                Source : Sourcing Cameroun S.A.
              </p>
            </div>
            <div class="text-right">
              <span class="text-[var(--color-primary)] font-bold text-xs uppercase bg-[var(--color-primary-muted)] border border-[var(--color-primary-border)] px-3 py-1 rounded">
                Réquisition confirmée
              </span>
              <p class="text-sm font-bold text-slate-800 mt-3">N° Réf : {{ order?.reference }}</p>
              <p class="text-xs text-slate-500 mt-0.5">Date : {{ formatDate(order?.created_at) }}</p>
            </div>
          </div>

          <!-- Partners Details -->
          <div class="grid grid-cols-2 gap-8 py-6 border-b border-slate-100 text-sm">
            <div class="space-y-1.5">
              <span class="block text-xs text-slate-500 font-semibold uppercase tracking-wider">Acheteur</span>
              <p class="font-bold text-lg text-slate-900">{{ order?.clientCompany || order?.clientName }}</p>
              <p class="text-slate-600 leading-relaxed mt-2">
                ID Système : {{ order?.clientId }}<br>
                Localisation : Douala, Cameroun<br>
                Contrat de Sourcing : {{ order?.reference }}
              </p>
            </div>
            
            <div class="space-y-1.5">
              <span class="block text-xs text-slate-500 font-semibold uppercase tracking-wider">Logistique requise</span>
              <p class="font-bold text-lg text-slate-900">Transport multisites</p>
              <p class="text-slate-600 leading-relaxed mt-2">
                Mode d'expédition : <strong class="text-[var(--color-primary)] font-semibold">{{ order?.deliveryMode || 'Fret standard sec' }}</strong><br>
                Lieu de déchargement : Entrepôt central client
              </p>
            </div>
          </div>

          <!-- Ordered Items Table -->
          <div class="py-6">
            <table class="w-full text-left text-sm border-collapse">
              <thead>
                <tr class="border-b border-slate-200 text-xs text-slate-500 font-semibold uppercase bg-slate-50">
                  <th class="py-3 px-3">Référence</th>
                  <th class="py-3 px-3">Désignation</th>
                  <th class="py-3 px-3 text-center">Quantité</th>
                  <th class="py-3 px-3 text-right">Prix HT</th>
                  <th class="py-3 px-3 text-right">Total HT</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr 
                  v-for="(item, idx) in order?.items" 
                  :key="item.productId || idx"
                  class="text-slate-700 hover:bg-slate-50 transition"
                >
                  <td class="py-3 px-3 font-mono text-xs font-semibold text-[var(--color-primary)]">{{ item.sku || 'N/A' }}</td>
                  <td class="py-3 px-3">
                    <span class="font-bold text-slate-900">{{ item.productName || item.name }}</span>
                  </td>
                  <td class="py-3 px-3 text-center font-bold text-slate-900">{{ item.quantity || item.qty }}</td>
                  <td class="py-3 px-3 text-right text-slate-600">{{ formatMoney(item.unitPrice) }}</td>
                  <td class="py-3 px-3 text-right font-bold text-slate-900">{{ formatMoney((item.quantity || item.qty) * item.unitPrice) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Document Totals calculation sheet -->
          <div class="grid grid-cols-2 gap-6 py-6 pt-8 border-t-2 border-slate-100">
            <div class="text-xs text-slate-500 flex flex-col justify-end space-y-2">
              <div class="flex items-center space-x-2 text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg w-fit">
                <CheckIcon class="w-4 h-4" />
                <span class="font-semibold">Bon de commande conforme.</span>
              </div>
              <p>Paiement bloqué en séquestre temporaire sécurisé.</p>
            </div>
            
            <div class="space-y-3 text-sm text-slate-600">
              <div class="flex justify-between">
                <span>Sous-total HT :</span>
                <span class="text-slate-900 font-bold">{{ formatMoney(order?.subtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span>TVA (19.25%) :</span>
                <span class="text-slate-900 font-bold">{{ formatMoney(order?.tax) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Frais de livraison :</span>
                <span class="text-slate-900 font-bold">{{ formatMoney(order?.shippingFee) }}</span>
              </div>
              <div class="flex justify-between text-[var(--color-primary)] pt-3 border-t border-slate-200 text-lg font-bold">
                <span>Total TTC :</span>
                <span>{{ formatMoney(order?.total) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- STATUS FLOW PROGRESS OVERVIEW (RIGHT COL) -->
      <div class="space-y-6">
        
        <!-- DYNAMIC PIPELINE TIMELINE -->
        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 space-y-6 shadow-sm">
          <h3 class="text-sm font-bold text-[var(--color-text-primary)] flex items-center space-x-2 border-b border-[var(--color-border)] pb-3">
            <ClockIcon class="w-5 h-5 text-[var(--color-primary)]" />
            <span>Progression de la commande</span>
          </h3>
          
          <div class="p-4 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl text-center">
            <span class="text-xs font-semibold text-[var(--color-text-secondary)] block">Statut actuel</span>
            <span class="text-sm font-bold inline-block mt-2 px-3 py-1 rounded-full border" :style="getStatusBadgesStyle(order?.status)">
              {{ translateStatus(order?.status) }}
            </span>
          </div>

          <div class="space-y-6 relative pl-5 border-l-2 border-[var(--color-border)] ml-2">
            <div 
              v-for="(ev, idx) in normalizedTimeline" 
              :key="idx" 
              class="relative"
            >
              <!-- Timeline circle marker -->
              <span 
                class="absolute -left-[27px] top-0 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                :class="ev.done ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white' : 'bg-[var(--color-background)] border-[var(--color-border)] text-transparent'"
              >
                <CheckIcon v-if="ev.done" class="w-3 h-3" />
                <span v-else class="w-2 h-2 rounded-full bg-[var(--color-border)]"></span>
              </span>
              
              <div class="space-y-1">
                <div class="flex items-start justify-between">
                  <span class="text-sm font-bold" :class="ev.done ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'">
                    {{ ev.label }}
                  </span>
                  <span class="text-xs text-[var(--color-text-muted)] whitespace-nowrap ml-2 mt-0.5">{{ ev.time }}</span>
                </div>
                <p class="text-xs text-[var(--color-text-secondary)] leading-relaxed">{{ ev.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- DETAILS COMPLÉMENTAIRES -->
        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 class="text-sm font-bold text-[var(--color-text-primary)] flex items-center space-x-2 border-b border-[var(--color-border)] pb-3">
            <ShieldCheckIcon class="w-5 h-5 text-emerald-500" />
            <span>Métadonnées et traçabilité</span>
          </h3>
          <div class="divide-y divide-[var(--color-border)] text-sm text-[var(--color-text-secondary)]">
            <div class="py-3 flex justify-between">
              <span>Identifiant unique :</span>
              <span class="text-[var(--color-text-primary)] font-bold font-mono">{{ order?.id }}</span>
            </div>
            <div class="py-3 flex justify-between">
              <span>Serveur d'hébergement :</span>
              <span class="text-[var(--color-primary)] font-mono">tech.supplies.host</span>
            </div>
            <div class="py-3 flex justify-between">
              <span>Sécurité des fonds :</span>
              <span class="text-emerald-500 font-bold flex items-center space-x-1">
                <span>Séquestre actif</span>
                <CheckIcon class="w-4 h-4 inline" />
              </span>
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
import { 
  ArrowLeftIcon, 
  CheckIcon, 
  InboxIcon, 
  TruckIcon, 
  ClockIcon, 
  DocumentTextIcon, 
  ShieldCheckIcon 
} from '@heroicons/vue/24/outline';

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
    { label: 'Bon de commande soumis', key: 'Submitted', desc: 'Fonds bloqués en séquestre, en attente de validation.' },
    { label: 'Commande validée', key: 'Approved', desc: 'Acceptation de la commande, transmission pour préparation.' },
    { label: 'Colisage terminé', key: 'Packed', desc: 'Lots préparés. Bon de livraison généré.' },
    { label: 'Expédition en cours', key: 'Shipped', desc: 'Marchandise prise en charge par le transporteur.' },
    { label: 'Livraison effectuée', key: 'Delivered', desc: 'Réception confirmée par le client.' },
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
      label: 'Commande validée',
      description: 'La commande a été acceptée et envoyée en préparation.'
    });

    toast.success(`La commande ${order.value.reference} a été validée avec succès.`);
  }
}

// Formatters
function formatMoney(val) {
  if (!val && val !== 0) return '-';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('XAF', 'FCFA');
}

// Format standard date
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
    'Submitted': 'En attente de validation',
    'Approved': 'Validée (À préparer)',
    'Preparing': 'En préparation',
    'Packed': 'Prête pour expédition',
    'Shipped': 'En transit',
    'Delivered': 'Livrée',
    'Cancelled': 'Annulée'
  };
  return m[stat] || stat;
}

function getStatusBadgesStyle(stat) {
  const mapping = {
    'Submitted': 'background-color: var(--color-primary-muted); color: var(--color-primary); border-color: var(--color-primary-border);',
    'Approved': 'background-color: rgba(16, 185, 129, 0.1); color: rgb(16, 185, 129); border-color: rgba(16, 185, 129, 0.2);',
    'Packed': 'background-color: rgba(59, 130, 246, 0.1); color: rgb(59, 130, 246); border-color: rgba(59, 130, 246, 0.2);',
    'Shipped': 'background-color: rgba(14, 165, 233, 0.1); color: rgb(14, 165, 233); border-color: rgba(14, 165, 233, 0.2);',
    'Delivered': 'background-color: rgba(20, 184, 166, 0.1); color: rgb(20, 184, 166); border-color: rgba(20, 184, 166, 0.2);'
  };
  return mapping[stat] || 'background-color: var(--color-surface-hover); color: var(--color-text-secondary); border-color: var(--color-border);';
}
</script>

<style scoped>
.blink-button {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
</style>
