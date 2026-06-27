<template>
  <div class="space-y-6 max-w-7xl mx-auto" id="supplier-orders-desk">
    <!-- PANEL HEADER -->
    <div class="bg-gradient-to-r from-slate-900 to-[#0e1633] border border-indigo-950 rounded-xl p-6 relative overflow-hidden select-none">
      <div class="flex items-center space-x-2">
        <span class="text-xs font-mono bg-indigo-950/40 text-indigo-400 px-2.5 py-0.5 rounded-full border border-indigo-900/30 font-bold uppercase">
          Flux Commandes Clients
        </span>
      </div>
      <h1 class="text-lg font-bold text-slate-100 mt-1">Expédition &amp; Traitement des Commandes B2B</h1>
      <p class="text-xs text-slate-400 mt-0.5">Valider les requisitions acheteurs, orchestrer la préparation FIFO en entrepôt et initier le fret transport.</p>
    </div>

    <!-- METRICS KPI DASHBOARD -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-[#0b1226] border border-slate-800 rounded-xl p-4 flex flex-col justify-between" id="kpi-total-claims">
        <span class="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Commandes Reçues</span>
        <div class="flex items-baseline space-x-2 mt-4">
          <span class="text-2xl font-bold font-mono text-slate-100">{{ supplierOrders.length }}</span>
          <span class="text-[9px] text-slate-500 font-mono">Dossiers</span>
        </div>
      </div>
      <div class="bg-[#0b1226] border border-slate-800 rounded-xl p-4 flex flex-col justify-between" id="kpi-pending-po">
        <span class="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-semibold">POs à Valider</span>
        <div class="flex items-baseline space-x-2 mt-4">
          <span class="text-2xl font-bold font-mono text-amber-500">{{ countByStatus('Submitted') }}</span>
          <span class="text-[9px] text-slate-500 font-mono">Bons soumis</span>
        </div>
      </div>
      <div class="bg-[#0b1226] border border-slate-800 rounded-xl p-4 flex flex-col justify-between" id="kpi-packaging">
        <span class="text-[10px] font-mono text-pink-400 uppercase tracking-wider font-semibold">En Préparation FIFO</span>
        <div class="flex items-baseline space-x-2 mt-4">
          <span class="text-2xl font-bold font-mono text-pink-400">{{ countByStatus('Preparing') + countByStatus('Approved') }}</span>
          <span class="text-[9px] text-slate-500 font-mono">À lotir/coliser</span>
        </div>
      </div>
      <div class="bg-[#0b1226] border border-slate-800 rounded-xl p-4 flex flex-col justify-between" id="kpi-fret-transit">
        <span class="text-[10px] font-mono text-sky-400 uppercase tracking-wider font-semibold">Waybills En Route</span>
        <div class="flex items-baseline space-x-2 mt-4">
          <span class="text-2xl font-bold font-mono text-sky-400">{{ countByStatus('Shipped') }}</span>
          <span class="text-[9px] text-slate-400 font-bold font-mono text-sky-500">Transit</span>
        </div>
      </div>
    </div>

    <!-- FILTER CLASSIFIER TABS -->
    <div class="flex border-b border-slate-800 bg-[#070b1a] p-1 rounded-xl">
      <button 
        v-for="tab in tabFilters" 
        :key="tab.value"
        @click="activeFilter = tab.value"
        class="flex-1 py-1.5 text-xs font-mono font-medium rounded-lg transition uppercase"
        :class="activeFilter === tab.value ? 'bg-[#15204c] text-indigo-400 border border-indigo-900/60 font-bold' : 'text-slate-400 hover:text-slate-200'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- INCOMING DISPATCHES TABLE -->
    <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      <div class="p-4 border-b border-slate-800 flex items-center justify-between">
        <h3 class="text-xs font-mono uppercase font-bold text-slate-300">Journal d'Exécution Fret</h3>
        <span class="text-[9.2px] font-mono text-slate-500 uppercase">Aiguillage logistique multisites</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse" id="supplier-orders-table">
          <thead>
            <tr class="bg-slate-950/60 border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase">
              <th class="p-4">Référence</th>
              <th class="p-4">Acheteur Réclamant</th>
              <th class="p-4">Date de dépôt</th>
              <th class="p-4">Items commandés</th>
              <th class="p-4 text-right">Montant TTC</th>
              <th class="p-4 text-center">Status Fret</th>
              <th class="p-4 text-right">Actions de Traitement</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="order in filteredOrders" 
              :key="order.id"
              class="border-b border-slate-850 hover:bg-slate-800/30 transition text-xs"
              :id="'supplier-row-' + order.id"
            >
              <td class="p-4 font-mono font-bold text-slate-250">
                <router-link :to="'/supplier/orders/' + order.id" class="hover:text-indigo-450 flex items-center space-x-1">
                  <span>📥</span>
                  <span>{{ order.reference }}</span>
                </router-link>
              </td>
              <td class="p-4 font-bold text-slate-300">
                <div>
                  <span class="block text-slate-200">{{ order.clientCompany || order.clientName }}</span>
                  <span class="text-[9.5px] font-mono text-slate-500 block">ID: {{ order.clientId }}</span>
                </div>
              </td>
              <td class="p-4 text-slate-450 font-mono">{{ formatDate(order.created_at) }}</td>
              <td class="p-4 text-slate-400">
                <span class="truncate max-w-xs block leading-tight">
                  {{ getOrderLineText(order) }}
                </span>
              </td>
              <td class="p-4 text-right font-mono font-bold text-slate-200">
                {{ formatMoney(order.total) }}
              </td>
              <td class="p-4 text-center">
                <span class="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase border" :class="getStatusClasses(order.status)">
                  {{ translateStatus(order.status) }}
                </span>
              </td>
              <td class="p-4 text-right space-x-2">
                <router-link 
                  :to="'/supplier/orders/' + order.id" 
                  class="px-2.5 py-1 bg-[#101730] hover:bg-slate-800 text-indigo-400 font-mono text-[10px] uppercase rounded border border-indigo-900/60 transition"
                  :id="'btn-sup-view-' + order.id"
                >
                  Analyser
                </router-link>

                <!-- Step 2: Fulfill / Assign FIFO batches -->
                <router-link
                  v-if="order.status === 'Approved' || order.status === 'Preparing'"
                  :to="'/supplier/orders/' + order.id + '/prepare'"
                  class="px-2.5 py-1 bg-pink-905/30 hover:bg-pink-900 text-pink-400 font-mono text-[10px] uppercase rounded border border-pink-900/40 transition animate-pulse"
                  :id="'btn-sup-prep-' + order.id"
                >
                  Faire le Colisage (FIFO)
                </router-link>
                
                <router-link
                  v-else-if="order.status === 'Packed'"
                  to="/supplier/logistics"
                  class="px-2.5 py-1 bg-blue-900/40 hover:bg-blue-800 text-blue-400 font-mono text-[10px] uppercase rounded border border-blue-800/60 transition"
                  :id="'btn-sup-dispatch-' + order.id"
                >
                  Expédier (Carrier)
                </router-link>
              </td>
            </tr>

            <tr v-if="filteredOrders.length === 0">
              <td colspan="7" class="p-8 text-center text-xs text-slate-550 font-mono italic">
                Aucun dossier logistique pour ce niveau d'aiguillage.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { orders as dbOrders } from '@/utils/supplier_db.js';

const activeFilter = ref('ALL');

const tabFilters = [
  { label: 'Tous les flux d\'arrivée', value: 'ALL' },
  { label: 'Reçus (Attente approbation)', value: 'Submitted' },
  { label: 'Approuvés (Prêts pour picking)', value: 'Approved' },
  { label: 'Emballés (BL Générés)', value: 'Packed' },
  { label: 'En Transit Routier', value: 'Shipped' },
  { label: 'Livrés & Validés', value: 'Delivered' }
];

const supplierOrders = computed(() => {
  return dbOrders.value || [];
});

const filteredOrders = computed(() => {
  if (activeFilter.value === 'ALL') {
    return supplierOrders.value;
  }
  return supplierOrders.value.filter(o => o.status === activeFilter.value);
});

function countByStatus(status) {
  return supplierOrders.value.filter(o => o.status === status).length;
}

function getOrderLineText(order) {
  return order.items.map(i => `${i.productName || i.name} (x${i.quantity || i.qty})`).join(', ');
}

// Formatters
function formatMoney(val) {
  if (!val && val !== 0) return '-';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('XAF', 'FCFA');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function translateStatus(stat) {
  const m = {
    'Draft': 'Brouillon',
    'Submitted': 'Reçu (Validation requise)',
    'Approved': 'Bon validé (Picking FIFO)',
    'Preparing': 'Colisage en cours',
    'Packed': 'Prêt à quai (BL Généré)',
    'Shipped': 'En transit',
    'Delivered': 'Livré',
    'Cancelled': 'Annulé'
  };
  return m[stat] || stat;
}

function getStatusClasses(stat) {
  const classes = {
    'Draft': 'bg-slate-800 text-slate-400 border-slate-700',
    'Submitted': 'bg-indigo-950/60 text-indigo-400 border-indigo-900/60',
    'Approved': 'bg-emerald-950/40 text-emerald-400 border-emerald-900/40',
    'Preparing': 'bg-pink-950/30 text-pink-400 border-pink-905/30',
    'Packed': 'bg-blue-950/40 text-blue-400 border-blue-900/35',
    'Shipped': 'bg-sky-950/50 text-sky-400 border-sky-900/50',
    'Delivered': 'bg-teal-950 text-teal-400 border-teal-900/40',
    'Cancelled': 'bg-red-950 text-red-400 border-red-900/40'
  };
  return classes[stat] || 'bg-slate-700 text-slate-300 border-slate-600';
}
</script>
