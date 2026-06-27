<template>
  <div class="space-y-6 max-w-7xl mx-auto" id="buyer-orders-workspace">
    <!-- PANEL HEADER -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between bg-slate-900 border border-slate-800 rounded-xl p-6 gap-4">
      <div>
        <div class="flex items-center space-x-2">
          <span class="text-xs font-mono bg-indigo-950/40 text-indigo-400 px-2.5 py-0.5 rounded-full border border-indigo-900/30 font-bold uppercase">
            Acheteur B2B - Sourcing Cameroun S.A.
          </span>
        </div>
        <h1 class="text-lg font-bold text-slate-100 mt-1">Dossier Commandes & Approvisionnements</h1>
        <p class="text-xs text-slate-400 mt-0.5">Enregistrer des bons de commande, valider des bons de livraison et suivre l'état de la chaîne d'approvisionnement en temps réel.</p>
      </div>
      <div>
        <button 
          @click="openNewPOModal"
          class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition shadow-lg hover:shadow-indigo-900/30 flex items-center space-x-2"
          id="btn-create-po"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nouveau Bon de Commande</span>
        </button>
      </div>
    </div>

    <!-- METRIC STATS GRID -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between" id="stat-total-orders">
        <span class="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Total Commandes</span>
        <div class="flex items-baseline space-x-2 mt-4">
          <span class="text-2xl font-bold font-mono text-slate-100">{{ buyerOrders.length }}</span>
          <span class="text-[9px] text-slate-500">Dossiers</span>
        </div>
      </div>
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between" id="stat-pending-orders">
        <span class="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-semibold">En attente d'approbation</span>
        <div class="flex items-baseline space-x-2 mt-4">
          <span class="text-2xl font-bold font-mono text-amber-400">{{ countByStatus('Submitted') }}</span>
          <span class="text-[9px] text-slate-500">Flux initié</span>
        </div>
      </div>
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between" id="stat-transit-orders">
        <span class="text-[10px] font-mono text-sky-400 uppercase tracking-wider font-semibold">En Transit Logistique</span>
        <div class="flex items-baseline space-x-2 mt-4">
          <span class="text-2xl font-bold font-mono text-sky-400">{{ countByStatus('Shipped') + countByStatus('Preparing') + countByStatus('Packed') }}</span>
          <span class="text-[9px] text-slate-500">En route</span>
        </div>
      </div>
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between" id="stat-delivered-orders">
        <span class="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">Livrées & Validées</span>
        <div class="flex items-baseline space-x-2 mt-4">
          <span class="text-2xl font-bold font-mono text-emerald-400">{{ countByStatus('Delivered') + countByStatus('Completed') }}</span>
          <span class="text-[9px] text-slate-500 font-bold text-emerald-500">Reçu</span>
        </div>
      </div>
    </div>

    <!-- FILTER CLASSIFICATION TABS -->
    <div class="flex border-b border-slate-800 bg-[#0c1226] p-1 rounded-xl">
      <button 
        v-for="tab in tabFilters" 
        :key="tab.value"
        @click="activeStatusFilter = tab.value"
        class="flex-1 py-2 text-xs font-mono font-medium rounded-lg transition uppercase"
        :class="activeStatusFilter === tab.value ? 'bg-indigo-950 text-indigo-400 border border-indigo-900/60 font-bold' : 'text-slate-400 hover:text-slate-200'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- ORDERS DATA TABLE -->
    <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      <div class="p-4 border-b border-slate-800 flex items-center justify-between">
        <h3 class="text-xs font-mono uppercase font-bold text-slate-300">Historique des Commandes</h3>
        <span class="text-[9px] font-mono text-slate-400 uppercase">Synchronisé avec le stock physique (FIFO)</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse" id="orders-table">
          <thead>
            <tr class="bg-slate-950/60 border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase">
              <th class="p-4">Référence</th>
              <th class="p-4">Date de Création</th>
              <th class="p-4">Articles Demandés</th>
              <th class="p-4 text-right">Valeur TTC</th>
              <th class="p-4 text-center">Status Fret</th>
              <th class="p-4 text-center">Facturation</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="order in filteredOrders" 
              :key="order.id"
              class="border-b border-slate-800 hover:bg-slate-800/40 transition text-xs"
              :id="'row-' + order.id"
            >
              <td class="p-4 font-mono font-bold text-slate-200">
                <router-link :to="'/buyer/orders/' + order.id" class="hover:text-indigo-400 flex items-center space-x-1">
                  <span>📄</span>
                  <span>{{ order.reference }}</span>
                </router-link>
              </td>
              <td class="p-4 text-slate-400 font-mono">{{ formatDate(order.created_at) }}</td>
              <td class="p-4">
                <span class="text-slate-300 leading-tight">
                  {{ order.items && order.items.length > 0 ? getOrderLineText(order) : 'Aucun article' }}
                </span>
              </td>
              <td class="p-4 text-right font-mono font-bold text-slate-100">
                {{ formatMoney(order.total) }}
              </td>
              <td class="p-4 text-center">
                <span class="px-2 py-0.5 rounded-full text-[9px] font-mono tracking-wide uppercase font-bold" :class="getStatusClasses(order.status)">
                  {{ translateStatus(order.status) }}
                </span>
              </td>
              <td class="p-4 text-center">
                <span class="px-2 py-0.5 rounded-full text-[9px] font-mono border uppercase" :class="getPaymentStatusClasses(order.paymentStatus || 'Escrow_Held')">
                  {{ translatePaymentStatus(order.paymentStatus || 'Escrow_Held') }}
                </span>
              </td>
              <td class="p-4 text-right space-x-2">
                <router-link 
                  :to="'/buyer/orders/' + order.id"
                  class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px] uppercase rounded border border-slate-700 transition"
                  :id="'btn-view-' + order.id"
                >
                  Détail
                </router-link>

                <!-- Track and sign if shipped -->
                <router-link
                  v-if="order.status === 'Shipped'"
                  :to="'/buyer/track/' + order.id"
                  class="px-2.5 py-1 bg-sky-900/40 hover:bg-sky-800 text-sky-400 font-mono text-[10px] uppercase rounded border border-sky-800/60 transition blink-button animate-pulse"
                  :id="'btn-track-' + order.id"
                >
                  Suivre &amp; Émarger
                </router-link>
                <router-link
                  v-else-if="order.status === 'Delivered' || order.status === 'Completed'"
                  :to="'/buyer/track/' + order.id"
                  class="px-2.5 py-1 bg-emerald-950/20 text-emerald-400 font-mono text-[10px] uppercase rounded border border-emerald-900/40 transition"
                  :id="'btn-pod-' + order.id"
                >
                  Preuve Signée
                </router-link>
              </td>
            </tr>

            <tr v-if="filteredOrders.length === 0">
              <td colspan="7" class="p-8 text-center text-xs text-slate-500 font-mono italic">
                Aucune commande enregistrée pour ce filtre de statut.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- HIGH-FIDELITY NEW PURCHASE ORDER MODAL/DRAWER -->
    <div 
      v-if="showNewPOModal"
      class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      id="new-po-modal"
    >
      <div class="bg-[#0b1226] border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        <!-- MODAL HEADER -->
        <div class="p-6 border-b border-indigo-950 bg-gradient-to-r from-slate-900 to-[#0e1633] flex items-center justify-between shrink-0">
          <div>
            <h2 class="text-md font-bold text-slate-100 flex items-center space-x-2">
              <span class="text-indigo-400">📝</span>
              <span>Générer un Nouveau Bon de Commande (B2B PO)</span>
            </h2>
            <p class="text-[10px] text-slate-400">Créez une requisition qui sera approuvée, lotie sous FIFO et livrée par le fournisseur.</p>
          </div>
          <button 
            @click="closeNewPOModal"
            class="p-1 px-2.5 bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white rounded text-xs font-mono transition"
            id="modal-close-btn"
          >
            [ Fermer ]
          </button>
        </div>

        <!-- MODAL WORKSPACE -->
        <div class="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-indigo-950">
            <!-- Details Requisition -->
            <div class="space-y-4">
              <label class="block">
                <span class="block text-[10px] uppercase font-mono tracking-wider text-indigo-400 font-bold mb-1">Fournisseur Partenaire</span>
                <select 
                  v-model="newPO.supplierName"
                  class="w-full bg-[#070b1a] border border-indigo-900 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-550"
                  id="select-supplier"
                >
                  <option value="Zama-Agro Sahel">🌾 Zama-Agro Sahel (Engrais, Semences &amp; Outillages)</option>
                  <option value="SOPRO-CAM S.A.">☕ SOPRO-CAM S.A. (Café &amp; Cacao Export)</option>
                  <option value="Nylon Packaging Douala">📦 Nylon Packaging Douala (Emballages Secs)</option>
                </select>
              </label>

              <label class="block">
                <span class="block text-[10px] uppercase font-mono tracking-wider text-indigo-400 font-bold mb-1">Mode de Transport Recommandé</span>
                <select 
                  v-model="newPO.deliveryMode"
                  class="w-full bg-[#070b1a] border border-[#15204c] rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-550"
                  id="select-delivery-mode"
                >
                  <option value="Rail Cargo (Cameroun Rail Fret)">🚞 Rail Fret Express (Grande capacité, Douala-Yde-Ngaoundéré)</option>
                  <option value="Route Heavy Truck (Camion 10t)">🚛 Camion Heavy Duty 10T - Corridor National</option>
                  <option value="Express Isothermal Van">🚐 Fourgonnette Isotherme (Contrôle Température)</option>
                  <option value="Urban Moto Cargo">🛵 Moto Cargo Gofetch (Livraison Urbaine Express)</option>
                </select>
              </label>
            </div>

            <div class="p-4 bg-slate-900/60 border border-indigo-950/40 rounded-xl space-y-2 text-xs">
              <h3 class="font-bold text-slate-300 font-mono text-[10px] uppercase tracking-wider text-indigo-400">Règles d'Approvisionnement B2B</h3>
              <ul class="space-y-1 list-disc list-inside text-slate-400 leading-relaxed text-[11px]">
                <li>Les quantités commandées sollicitent le stock des hubs régionaux de l'entrepôt du fournisseur.</li>
                <li>La commande est traitée suivant la règle <strong>FIFO (First-In, First-Out)</strong> pour les lots de fabrication.</li>
                <li>Un code <strong>QR de validation</strong> unique sera généré automatiquement lors du transit pour la livraison sans contact.</li>
              </ul>
            </div>
          </div>

          <!-- Product Picker Grid -->
          <div class="space-y-3">
            <h3 class="text-xs uppercase font-mono tracking-wider text-[#546296] font-bold">Sélection des Produits du Catalogue</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div 
                v-for="prod in catalogProducts" 
                :key="prod.id"
                class="bg-[#080d1e] border rounded-xl p-3 flex flex-col justify-between transition cursor-pointer"
                :class="isProductSelected(prod.id) ? 'border-indigo-500 bg-indigo-950/20' : 'border-slate-800 hover:border-slate-700'"
                @click="toggleProductInPO(prod)"
                :id="'pick-prod-' + prod.id"
              >
                <div>
                  <div class="flex justify-between items-start">
                    <span class="text-[9px] font-mono text-indigo-400 uppercase font-bold">{{ prod.code }}</span>
                    <span class="text-[9px] font-mono bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-900/20 text-emerald-400">
                      Dispo: {{ prod.stock }} {{ prod.unit || 'Kg' }}
                    </span>
                  </div>
                  <h4 class="text-xs font-bold text-slate-200 mt-1 leading-tight">{{ prod.name }}</h4>
                  <p class="text-[10px] text-slate-400 mt-1 truncate">{{ prod.description }}</p>
                </div>
                <div class="flex justify-between items-center mt-3 pt-2 border-t border-slate-900">
                  <span class="text-xs font-bold font-mono text-slate-300">{{ formatMoney(prod.price) }}</span>
                  
                  <span v-if="!isProductSelected(prod.id)" class="text-[10px] font-mono text-indigo-400 font-bold hover:underline">+ Sélectionner</span>
                  <div v-else class="flex items-center space-x-1.5" @click.stop>
                    <button 
                      @click="decrementQty(prod.id)"
                      class="w-5 h-5 bg-indigo-950 hover:bg-slate-800 text-indigo-400 font-bold flex items-center justify-center rounded border border-indigo-900"
                    >-</button>
                    <span class="text-xs font-bold font-mono text-slate-200 px-1 w-6 text-center">{{ getSelectedQty(prod.id) }}</span>
                    <button 
                      @click="incrementQty(prod.id)"
                      class="w-5 h-5 bg-indigo-950 hover:bg-slate-850 text-indigo-400 font-bold flex items-center justify-center rounded border border-indigo-900"
                    >+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Selected Items Summary & Checkout -->
          <div class="bg-slate-900 border border-indigo-950/60 rounded-xl p-4 md:p-6 space-y-4">
            <h3 class="text-xs uppercase font-mono tracking-wider text-slate-300 font-bold">Récapitulatif de Commande</h3>
            
            <div class="divide-y divide-slate-800 text-xs">
              <div 
                v-for="item in newPO.selectedItems" 
                :key="item.productId"
                class="py-2.5 flex items-center justify-between"
              >
                <div>
                  <span class="font-bold text-slate-200">{{ item.name }}</span>
                  <p class="text-[10px] text-slate-500 font-mono">Quantité: {{ item.qty }} &times; {{ formatMoney(item.unitPrice) }}</p>
                </div>
                <span class="font-bold font-mono text-slate-300">{{ formatMoney(item.qty * item.unitPrice) }}</span>
              </div>

              <div v-if="newPO.selectedItems.length === 0" class="py-4 text-center text-slate-500 italic">
                Aucun produit sélectionné pour le moment.
              </div>
            </div>

            <!-- Totals block -->
            <div class="pt-4 border-t border-indigo-950/60 divide-y divide-indigo-950/30 text-xs text-slate-400 font-mono">
              <div class="py-1.5 flex justify-between">
                <span>CONTRAT SOUS-TOTAL XAF</span>
                <span class="text-slate-200 font-bold">{{ formatMoney(totalSubtotal) }}</span>
              </div>
              <div class="py-1.5 flex justify-between">
                <span>TVA CAMEROUN (19.25%)</span>
                <span class="text-slate-200 font-bold">{{ formatMoney(totalVAT) }}</span>
              </div>
              <div class="py-1.5 flex justify-between">
                <span>FRAIS DE LIVRAISON</span>
                <span class="text-slate-200 font-bold">{{ formatMoney(fixedShipping) }}</span>
              </div>
              <div class="py-3 flex justify-between text-slate-100 font-sans font-bold text-sm">
                <span class="text-indigo-400 uppercase font-mono text-xs">Valeur Totale Contractuelle TTC</span>
                <span class="text-slate-100 font-mono">{{ formatMoney(totalFinalCost) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- MODAL FOOTER -->
        <div class="p-6 border-t border-slate-800 bg-[#060917] shrink-0 flex items-center justify-between">
          <span class="text-[10px] font-mono text-slate-500">Statut initial: <strong class="text-indigo-400 font-normal">SOUCO_TRANSIT (Submitted)</strong></span>
          <div class="space-x-3">
            <button 
              @click="closeNewPOModal"
              class="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 rounded-xl text-xs font-mono transition"
            >
              Annuler
            </button>
            <button 
              @click="submitPurchaseOrder"
              :disabled="newPO.selectedItems.length === 0"
              class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-mono font-bold uppercase rounded-xl text-xs tracking-wider transition shadow"
              id="submit-po-btn"
            >
              Soumettre la Commande
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { products as catalogProducts, orders as dbOrders } from '@/utils/supplier_db.js';
import { useToast } from 'vue-toastification';

const toast = useToast();

const activeStatusFilter = ref('ALL');

const tabFilters = [
  { label: 'Toutes les Commandes', value: 'ALL' },
  { label: 'En attente d\'approbation', value: 'Submitted' },
  { label: 'Préparation & Emballage', value: 'Preparing_Packed' },
  { label: 'En Transit', value: 'Shipped' },
  { label: 'Livrées & Clôturées', value: 'Delivered' }
];

// Focus purely on Buyer's perspective orders (or load all to simulate both roles!)
const buyerOrders = computed(() => {
  return dbOrders.value || [];
});

const filteredOrders = computed(() => {
  if (activeStatusFilter.value === 'ALL') {
    return buyerOrders.value;
  }
  if (activeStatusFilter.value === 'Preparing_Packed') {
    return buyerOrders.value.filter(o => o.status === 'Approved' || o.status === 'Preparing' || o.status === 'Packed');
  }
  return buyerOrders.value.filter(o => o.status === activeStatusFilter.value);
});

function countByStatus(status) {
  return buyerOrders.value.filter(o => o.status === status).length;
}

// Order item listing helper helper
function getOrderLineText(order) {
  return order.items.map(i => `${i.name || i.productName} (x${i.qty || i.quantity})`).join(', ');
}

// Modal visibility states
const showNewPOModal = ref(false);

const defaultPO = () => ({
  supplierName: 'Zama-Agro Sahel',
  deliveryMode: 'Rail Cargo (Cameroun Rail Fret)',
  selectedItems: []
});

const newPO = ref(defaultPO());

function openNewPOModal() {
  newPO.value = defaultPO();
  showNewPOModal.value = true;
}

function closeNewPOModal() {
  showNewPOModal.value = false;
}

// Product Picker wizard logic
function isProductSelected(prodId) {
  return newPO.value.selectedItems.some(i => i.productId === prodId);
}

function getSelectedQty(prodId) {
  const item = newPO.value.selectedItems.find(i => i.productId === prodId);
  return item ? item.qty : 0;
}

function toggleProductInPO(prod) {
  const idx = newPO.value.selectedItems.findIndex(i => i.productId === prod.id);
  if (idx > -1) {
    newPO.value.selectedItems.splice(idx, 1);
  } else {
    // Check if stock is available
    if (prod.stock <= 0) {
      toast.error(`Le produit ${prod.name} est en rupture de stock.`);
      return;
    }
    newPO.value.selectedItems.push({
      productId: prod.id,
      name: prod.name,
      sku: prod.sku || 'N/A',
      qty: 1,
      unitPrice: prod.price
    });
  }
}

function incrementQty(prodId) {
  const item = newPO.value.selectedItems.find(i => i.productId === prodId);
  if (item) {
    const origProd = catalogProducts.value.find(p => p.id === prodId);
    if (item.qty >= origProd.stock) {
      toast.error(`Excède le stock physique de l'entrepôt (${origProd.stock} dispo)`);
      return;
    }
    item.qty++;
  }
}

function decrementQty(prodId) {
  const item = newPO.value.selectedItems.find(i => i.productId === prodId);
  if (item) {
    if (item.qty > 1) {
      item.qty--;
    } else {
      const idx = newPO.value.selectedItems.findIndex(i => i.productId === prodId);
      newPO.value.selectedItems.splice(idx, 1);
    }
  }
}

// Mathematical derivations for PO Costing
const totalSubtotal = computed(() => {
  return newPO.value.selectedItems.reduce((acc, item) => acc + (item.qty * item.unitPrice), 0);
});

const totalVAT = computed(() => {
  return Math.floor(totalSubtotal.value * 0.1925);
});

const fixedShipping = computed(() => {
  return newPO.value.selectedItems.length > 0 ? 5000 : 0;
});

const totalFinalCost = computed(() => {
  return totalSubtotal.value + totalVAT.value + fixedShipping.value;
});

// Submit/Emit transaction to db store
function submitPurchaseOrder() {
  if (newPO.value.selectedItems.length === 0) {
    toast.error('Veuillez rajouter des articles à votre bon de commande.');
    return;
  }

  const generatedRef = `B2B-PO-2026-${String(Date.now()).slice(-4)}-${Math.floor(10 + Math.random()*90)}`;
  const orderObj = {
    id: `ord_${Date.now()}`,
    reference: generatedRef,
    clientId: 'cli_buyer_demo',
    clientName: 'Sourcing Cameroun Operator',
    clientCompany: 'Sourcing Cameroun S.A.',
    items: newPO.value.selectedItems.map(i => ({
      productId: i.productId,
      productName: i.name,
      sku: i.sku,
      quantity: i.qty,
      unitPrice: i.unitPrice,
      totalPrice: i.qty * i.unitPrice
    })),
    subtotal: totalSubtotal.value,
    tax: totalVAT.value,
    shippingFee: fixedShipping.value,
    total: totalFinalCost.value,
    status: 'Submitted', // Submitted/Awaiting Supplier Approval
    paymentStatus: 'Escrow_Held',
    created_at: new Date().toISOString(),
    deliveryMode: newPO.value.deliveryMode,
    history: [
      { status: 'Submitted', timestamp: new Date().toISOString(), label: 'Bon de commande soumis au fournisseur', description: 'Commande envoyée au fournisseur, en attente d\'approbation contractuelle.' }
    ]
  };

  dbOrders.value.unshift(orderObj);
  closeNewPOModal();
  toast.success(`Le bon de commande ${generatedRef} a été généré et soumis au fournisseur.`);
}

// Formatter utilities
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
    'Submitted': 'Reçu / En attente d\'approbation',
    'Approved': 'Approuvé par le fournisseur',
    'Preparing': 'En préparation entrepôt',
    'Packed': 'Colis emballé / BL généré',
    'Shipped': 'En transit',
    'Delivered': 'Livré & Validé',
    'Cancelled': 'Annulé'
  };
  return m[stat] || stat;
}

function getStatusClasses(stat) {
  const classes = {
    'Draft': 'bg-slate-800 text-slate-400 border border-slate-700',
    'Submitted': 'bg-indigo-950 text-indigo-400 border border-indigo-900',
    'Approved': 'bg-teal-950 text-teal-400 border border-teal-900',
    'Preparing': 'bg-pink-955 text-pink-400 border border-pink-900/40',
    'Packed': 'bg-blue-900 text-blue-300 border border-blue-800',
    'Shipped': 'bg-sky-950/60 text-sky-400 border border-sky-900/60',
    'Delivered': 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/45',
    'Cancelled': 'bg-red-950 text-red-400 border border-red-900/40'
  };
  return classes[stat] || 'bg-slate-700 text-slate-355 border border-slate-650';
}

function translatePaymentStatus(pStat) {
  const m = {
    'Settled': 'Soldé / Payé',
    'Escrow_Held': 'Fonds bloqués (Escrow)',
    'Refunded': 'Remboursé'
  };
  return m[pStat] || pStat;
}

function getPaymentStatusClasses(pStat) {
  const classes = {
    'Settled': 'bg-emerald-950/20 text-emerald-400 border-emerald-900/30',
    'Escrow_Held': 'bg-amber-950/20 text-amber-400 border-amber-900/30',
    'Refunded': 'bg-red-950/20 text-red-400 border-red-900/30'
  };
  return classes[pStat] || 'bg-slate-900 text-slate-450 border-slate-800';
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
    opacity: .7;
  }
}
</style>
