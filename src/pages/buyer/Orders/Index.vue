<template>
  <div class="space-y-6 max-w-7xl mx-auto print:hidden" id="buyer-orders-index">
    <!-- PANEL HEADER -->
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 shadow-sm">
      <div class="flex items-center space-x-2">
        <span class="text-xs font-mono bg-[var(--color-primary-muted)] text-[var(--color-primary)] px-2.5 py-0.5 rounded-full border border-[var(--color-primary-border)] font-bold uppercase">
          Mes Commandes Émises
        </span>
      </div>
      <h1 class="text-lg font-bold text-[var(--color-text-primary)] mt-1">Historique des Commandes</h1>
      <p class="text-xs text-[var(--color-text-secondary)] mt-0.5">Consultez l'historique global de vos bons de commande et effectuez vos actions par fournisseur.</p>
    </div>

    <!-- FILTER TOOLBAR -->
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 rounded-xl shadow-sm space-y-4">
      <div class="text-xs font-mono font-bold text-[var(--color-primary)] uppercase tracking-wider">
        Filtrer mon historique
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <!-- Search query -->
        <label class="block">
          <span class="block text-[10px] uppercase font-mono text-[var(--color-text-secondary)] mb-1">Recherche</span>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Référence, produit..." 
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-xs font-mono text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
          />
        </label>

        <!-- Status Filter -->
        <label class="block">
          <span class="block text-[10px] uppercase font-mono text-[var(--color-text-secondary)] mb-1">Statut</span>
          <select 
            v-model="statusFilter"
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] font-mono"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="Draft">Brouillon</option>
            <option value="Submitted">En attente validation</option>
            <option value="Approved">Approuvé (En attente BL)</option>
            <option value="Preparing">Préparation Logistique</option>
            <option value="Packed">BL généré / En transit</option>
            <option value="Shipped">En Transit Logistique</option>
            <option value="Delivered">Livré / Émargé</option>
          </select>
        </label>

        <!-- Supplier Filter -->
        <label class="block">
          <span class="block text-[10px] uppercase font-mono text-[var(--color-text-secondary)] mb-1">Fournisseur</span>
          <select 
            v-model="supplierFilter"
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] font-mono"
          >
            <option value="ALL">Tous les fournisseurs</option>
            <option v-for="sup in b2b_suppliers" :key="sup.id" :value="sup.id">{{ sup.name }}</option>
          </select>
        </label>

        <!-- Date Filter -->
        <label class="block">
          <span class="block text-[10px] uppercase font-mono text-[var(--color-text-secondary)] mb-1">Date exacte (JJ/MM/AAAA)</span>
          <input 
            type="text" 
            v-model="dateFilter" 
            placeholder="Ex: 15/06/2026" 
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-xs font-mono text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
          />
        </label>
      </div>
    </div>

    <!-- ORDERS DATA TABLE -->
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse" id="orders-table">
          <thead>
            <tr class="bg-[var(--color-surface-elevated)] border-b border-[var(--color-border)] text-xs font-mono text-[var(--color-text-secondary)] uppercase">
              <th class="p-4 w-10"></th>
              <th class="p-4">Référence</th>
              <th class="p-4">Date d'Émission</th>
              <th class="p-4 text-right">Montant TTC</th>
              <th class="p-4 text-center">Statut Global</th>
              <th class="p-4 text-right">Fournisseurs</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="order in paginatedOrders" :key="order.id">
              <!-- Parent Row -->
              <tr 
                class="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition text-sm font-medium cursor-pointer"
                :class="expandedOrders.includes(order.id) ? 'bg-[var(--color-surface-hover)]' : ''"
                @click="toggleOrderExpand(order.id)"
              >
                <td class="p-4 text-center">
                  <span class="text-xs transition-transform inline-block" :class="expandedOrders.includes(order.id) ? 'rotate-90' : ''">▶</span>
                </td>
                <td class="p-4 font-mono font-bold text-[var(--color-text-primary)]">
                  #{{ order.reference }}
                </td>
                <td class="p-4 text-[var(--color-text-secondary)] font-mono">
                  {{ formatDate(order.created_at || order.date_emission) }}
                </td>
                <td class="p-4 text-right font-mono font-bold text-[var(--color-text-primary)]">
                  {{ formatMoney(order.total) }}
                </td>
                <td class="p-4 text-center">
                  <span class="px-3 py-1 rounded-full text-xs font-mono tracking-wide uppercase font-bold" :class="getStatusClasses(order.status)">
                    {{ translateStatus(order.status) }}
                  </span>
                </td>
                <td class="p-4 text-right font-mono font-bold text-[var(--color-text-primary)]">
                  {{ getSupplierCount(order) }} Fns
                </td>
              </tr>

              <!-- Sub-Table Row listing Suppliers & their actions -->
              <tr v-if="expandedOrders.includes(order.id)" class="bg-[var(--color-surface-elevated)] border-b border-[var(--color-border)]">
                <td colspan="6" class="p-4">
                  <div class="pl-8 py-2 space-y-3">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-mono font-black text-[var(--color-primary)] uppercase tracking-wider">Lignes de Commandes par Fournisseur</span>
                    </div>

                    <div class="grid grid-cols-1 gap-2.5">
                      <div 
                        v-for="sup in getSuppliersInOrder(order)" 
                        :key="sup.id"
                        class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm"
                      >
                        <div>
                          <h4 class="text-xs font-bold text-[var(--color-text-primary)] font-mono">{{ sup.name }}</h4>
                          <!-- Associated BL -->
                          <p class="text-[10px] text-[var(--color-primary)] font-mono uppercase mt-0.5 font-black">
                            Bon de livraison : BL-{{ order.reference }}-{{ sup.id.toUpperCase() }}
                          </p>
                          <p class="text-[10px] text-[var(--color-text-secondary)] mt-0.5 font-mono">
                            {{ getSupplierItemsSummary(order, sup.id) }}
                          </p>
                        </div>

                        <div class="flex items-center space-x-3 self-end sm:self-auto">
                          <span class="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-bold uppercase" :class="getStatusClasses(order.status)">
                            {{ translateStatus(order.status) }}
                          </span>

                                        <div class="flex space-x-1.5">
                                          <!-- Detail Action Button (Modal) -->
                                          <button 
                                            @click="openSupplierDetailModal(order, sup.id)"
                                            class="inline-flex items-center justify-center p-2 bg-[var(--color-surface-elevated)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] rounded-lg border border-[var(--color-border)] transition cursor-pointer"
                                            title="Afficher les détails pour ce fournisseur"
                                          >
                                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                          </button>

                                          <!-- Return Action Button -->
                                          <router-link
                                            :to="{ name: 'BuyerTrackReturn', params: { id: order.id }, query: { supplier: sup.id } }"
                                            class="inline-flex items-center justify-center p-2 bg-[var(--color-surface-elevated)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] rounded-lg border border-[var(--color-border)] transition cursor-pointer"
                                            title="Déclarer un bon de retour pour ce fournisseur"
                                          >
                                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                              <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h4l3 8 4-16 3 8h4" />
                                            </svg>
                                          </router-link>
                                        </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-if="filteredOrders.length === 0">
              <td colspan="6" class="p-8 text-center text-sm text-[var(--color-text-secondary)] font-mono italic">
                Aucun bon de commande trouvé.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination controls -->
      <div v-if="totalPages > 1" class="p-4 border-t border-[var(--color-border)] flex items-center justify-between bg-[var(--color-surface-elevated)]">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1"
          class="px-3 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-xs font-mono uppercase cursor-pointer"
        >
          Précédent
        </button>
        <span class="text-xs font-mono text-[var(--color-text-secondary)]">
          Page {{ currentPage }} sur {{ totalPages }}
        </span>
        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
          class="px-3 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-xs font-mono uppercase cursor-pointer"
        >
          Suivant
        </button>
      </div>
    </div>

    <!-- DETAIL POPUP MODAL -->
    <div v-if="isDetailModalOpen && selectedOrderForModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="bg-[var(--color-surface)] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-[var(--color-border)] p-6 space-y-4">
        <div class="flex justify-between items-center border-b border-[var(--color-border)] pb-3">
          <div>
            <h3 class="text-sm font-bold text-[var(--color-text-primary)] font-mono">Détails de la commande - {{ modalSupplierName }}</h3>
            <p class="text-[10px] text-[var(--color-text-secondary)] font-mono mt-0.5">BC : #{{ selectedOrderForModal.reference }}</p>
          </div>
          <button @click="isDetailModalOpen = false" class="text-sm text-[var(--color-text-secondary)] hover:text-red-500 font-mono cursor-pointer font-bold">[ Fermer ]</button>
        </div>

        <div class="space-y-4">
          <!-- Products Table inside modal -->
          <div class="overflow-x-auto border border-[var(--color-border)] rounded-xl">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="bg-[var(--color-surface-elevated)] border-b border-[var(--color-border)] text-[10px] font-mono text-[var(--color-text-secondary)] uppercase">
                  <th class="p-3">Produit</th>
                  <th class="p-3 text-center">Quantité</th>
                  <th class="p-3 text-right">Prix Unitaire</th>
                  <th class="p-3 text-right">Montant HT</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in modalProducts" :key="idx" class="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition">
                  <td class="p-3 font-bold text-[var(--color-text-primary)]">{{ item.productName || item.product_id }}</td>
                  <td class="p-3 text-center font-mono font-black text-[var(--color-text-primary)]">{{ item.quantity || item.qty }}</td>
                  <td class="p-3 text-right font-mono text-[var(--color-text-primary)]">{{ formatMoney(item.unitPrice || item.unit_price) }}</td>
                  <td class="p-3 text-right font-mono font-bold text-[var(--color-text-primary)]">{{ formatMoney((item.quantity || item.qty) * (item.unitPrice || item.unit_price)) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex justify-between items-center text-xs font-mono font-bold">
            <div class="flex space-x-2">
              <button 
                @click="printSupplierDetails" 
                class="px-3 py-1.5 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition font-bold uppercase tracking-wider text-[10px] cursor-pointer flex items-center space-x-1"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.617 0-1.11-.5-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.867 48.867 0 00-14.326 0C3.767 7.44 3 8.375 3 9.456V15.75a2.25 2.25 0 002.25 2.25h1.091M9 9h6m-6 3h6" />
                </svg>
                <span>Imprimer</span>
              </button>
              <button 
                @click="downloadSupplierDetails" 
                class="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition font-bold uppercase tracking-wider text-[10px] cursor-pointer flex items-center space-x-1"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                <span>Télécharger</span>
              </button>
              <router-link
                v-if="selectedOrderForModal.status === 'Draft'"
                :to="`/buyer/orders/${selectedOrderForModal.id}?supplier=${selectedSupplierIdForModal}`"
                class="px-3 py-1.5 bg-[var(--color-primary)] text-white rounded hover:opacity-90 transition font-bold uppercase tracking-wider text-[10px] flex items-center space-x-1"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
                <span>Modifier</span>
              </router-link>
            </div>
            <div class="text-right">
              <span class="text-[var(--color-text-secondary)]">Total Fournisseur : </span>
              <span class="text-sm font-extrabold text-[var(--color-text-primary)]">{{ formatMoney(modalTotal) }}</span>
            </div>
            </div>
        </div>
      </div>
    </div>
  </div>

  <!-- RETURN FORM -->
  <ReturnForm 
    v-if="isReturnFormOpen && selectedOrderForModal && selectedSupplierIdForModal"
    :items="modalProducts"
    :orderId="selectedOrderForModal.id"
    :supplierId="selectedSupplierIdForModal"
    :buyerId="selectedOrderForModal.clientId"
    :buyerName="selectedOrderForModal.clientName"
    @close="isReturnFormOpen = false"
    @created="handleReturnCreated"
  />

  <!-- PRINT LAYOUT (Visible only on window.print()) -->
  <div v-if="selectedOrderForModal && selectedSupplierIdForModal" class="hidden print:block printable-area bg-white text-slate-900 p-8 font-sans">
    <div class="flex justify-between items-start border-b-2 border-slate-350 pb-6 mb-6">
      <div>
        <h1 class="text-xl font-bold uppercase tracking-wider text-slate-900 font-mono">Détails Ligne de Commande</h1>
        <p class="text-xs text-slate-500 font-mono mt-1">Fournisseur : {{ modalSupplierName }}</p>
      </div>
      <div class="text-right text-xs font-mono">
        <p class="font-bold text-slate-900">BC N° {{ selectedOrderForModal.reference }}</p>
        <p>Date émission : {{ formatDate(selectedOrderForModal.created_at || selectedOrderForModal.date_emission) }}</p>
      </div>
    </div>

    <table class="w-full text-left text-sm border-collapse mb-6">
      <thead>
        <tr class="border-b-2 border-slate-300 text-xs text-slate-650 font-mono uppercase bg-slate-50">
          <th class="py-3 px-3 border border-slate-300">Désignation</th>
          <th class="py-3 px-3 border border-slate-300 text-center">Quantité</th>
          <th class="py-3 px-3 border border-slate-300 text-right">Prix Unitaire</th>
          <th class="py-3 px-3 border border-slate-300 text-right">Montant HT</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, idx) in modalProducts" :key="idx" class="border-b border-slate-300">
          <td class="py-3 px-3 border border-slate-300 font-bold text-slate-900">{{ item.productName || item.product_id }}</td>
          <td class="py-3 px-3 border border-slate-300 text-center font-mono font-bold">{{ item.quantity || item.qty }}</td>
          <td class="py-3 px-3 border border-slate-300 text-right font-mono">{{ formatMoney(item.unitPrice || item.unit_price) }}</td>
          <td class="py-3 px-3 border border-slate-300 text-right font-mono font-bold text-slate-950">{{ formatMoney((item.quantity || item.qty) * (item.unitPrice || item.unit_price)) }}</td>
        </tr>
      </tbody>
    </table>

    <div class="flex justify-end font-mono text-sm font-bold pt-4 border-t border-slate-300">
      <span class="mr-4">TOTAL LIGNE :</span>
      <span class="text-slate-950 font-extrabold text-base">{{ formatMoney(modalTotal) }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { orders as dbOrders, b2b_suppliers, products as catalogProducts } from '@/utils/supplier_db.js';
import ReturnForm from '@/components/buyer/ReturnForm.vue';

const searchQuery = ref('');
const statusFilter = ref('ALL');
const supplierFilter = ref('ALL');
const dateFilter = ref('');

// Expandable accordion rows
const expandedOrders = ref([]);

// Modal State
const isDetailModalOpen = ref(false);
const selectedOrderForModal = ref(null);
const selectedSupplierIdForModal = ref('');
const isReturnFormOpen = ref(false);

function openReturnForm(order, supplierId) {
  selectedOrderForModal.value = order;
  selectedSupplierIdForModal.value = supplierId;
  isReturnFormOpen.value = true;
}

function handleReturnCreated(newReturn) {
  // add a history entry to the parent order to mark that a return was declared
  const ord = dbOrders.value.find(o => o.id === newReturn.parent_order_id || o.reference === newReturn.parent_order_id);
  if (ord) {
    ord.history = ord.history || [];
    ord.history.push({ status: 'ReturnRequested', timestamp: new Date().toISOString(), label: 'Bon de retour déclaré', description: `Retour ${newReturn.reference} créé par ${newReturn.buyer_name || 'acheteur'}` });
  }
}

function openSupplierDetailModal(order, supplierId) {
  selectedOrderForModal.value = order;
  selectedSupplierIdForModal.value = supplierId;
  isDetailModalOpen.value = true;
}

const modalProducts = computed(() => {
  if (!selectedOrderForModal.value || !selectedSupplierIdForModal.value) return [];
  return (selectedOrderForModal.value.items || []).filter(item => getItemSupplierId(item, selectedOrderForModal.value) === selectedSupplierIdForModal.value);
});

const modalSupplierName = computed(() => {
  if (!selectedSupplierIdForModal.value) return '';
  const found = b2b_suppliers.value.find(s => s.id === selectedSupplierIdForModal.value);
  return found ? found.name : 'Fournisseur';
});

const modalTotal = computed(() => {
  return modalProducts.value.reduce((acc, p) => acc + ((p.quantity || p.qty || 0) * (p.unitPrice || p.unit_price || p.unit_price || 0)), 0);
});

function printSupplierDetails() {
  window.print();
}

function downloadSupplierDetails() {
  const headers = 'Produit,Quantité,Prix Unitaire,Total HT\n';
  const rows = modalProducts.value.map(p => 
    `"${p.productName || 'Produit'}","${p.quantity || p.qty}","${p.unitPrice || p.unit_price}","${(p.quantity || p.qty) * (p.unitPrice || p.unit_price)}"`
  ).join('\n');
  const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `Details_BC_${selectedOrderForModal.value.reference}_${modalSupplierName.value.replace(/\s+/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Pagination
const currentPage = ref(1);
const itemsPerPage = 5;

function toggleOrderExpand(orderId) {
  const idx = expandedOrders.value.indexOf(orderId);
  if (idx > -1) {
    expandedOrders.value.splice(idx, 1);
  } else {
    expandedOrders.value.push(orderId);
  }
}

// Robust item supplier resolver
function getItemSupplierId(item, order) {
  if (item.supplierId) return item.supplierId;
  const prod = catalogProducts.value.find(p => p.id === item.productId || p.name === item.productName || p.name === item.product_id);
  if (prod && prod.supplierId) return prod.supplierId;
  if (order.supplierName === "SOPRO-CAM S.A.") return "sup_002";
  if (order.supplierName === "Nylon Packaging Douala") return "sup_003";
  return "sup_001"; // Default
}

function getSupplierCount(order) {
  const items = order.items || [];
  return new Set(items.map(i => getItemSupplierId(i, order))).size;
}

function getSuppliersInOrder(order) {
  const items = order.items || [];
  const sIds = [...new Set(items.map(i => getItemSupplierId(i, order)))];
  return sIds.map(sid => {
    const found = b2b_suppliers.value.find(s => s.id === sid);
    return { id: sid, name: found ? found.name : 'Fournisseur Spécifique' };
  });
}

function getSupplierListString(order) {
  return getSuppliersInOrder(order).map(s => s.name).join(', ');
}

function getProductsSummary(order) {
  const items = order.items || [];
  return items.map(i => `${i.productName || 'Produit'} (x${i.quantity || i.qty})`).join(', ');
}

function getSupplierItemsSummary(order, supplierId) {
  const sItems = (order.items || []).filter(i => getItemSupplierId(i, order) === supplierId);
  if (sItems.length === 0) return 'Aucun produit';
  return sItems.map(i => `${i.productName || 'Produit'} (x${i.quantity})`).join(', ');
}

const filteredOrders = computed(() => {
  let list = dbOrders.value || [];

  // Filter by Status
  if (statusFilter.value !== 'ALL') {
    list = list.filter(o => o.status === statusFilter.value);
  }

  // Filter by Supplier Name/ID
  if (supplierFilter.value !== 'ALL') {
    list = list.filter(o => {
      return (o.items || []).some(i => getItemSupplierId(i, o) === supplierFilter.value);
    });
  }

  // Filter by Date
  if (dateFilter.value) {
    list = list.filter(o => {
      const formattedDate = formatDate(o.created_at || o.date_emission);
      return formattedDate.includes(dateFilter.value);
    });
  }

  // Filter by Search Query (Reference or Product Name or Supplier Name)
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(o => {
      const matchRef = o.reference.toLowerCase().includes(q);
      const matchProd = (o.items || []).some(i => (i.productName || '').toLowerCase().includes(q));
      const matchSup = getSupplierListString(o).toLowerCase().includes(q);
      return matchRef || matchProd || matchSup;
    });
  }

  return list;
});

const totalPages = computed(() => {
  return Math.ceil(filteredOrders.value.length / itemsPerPage);
});

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredOrders.value.slice(start, start + itemsPerPage);
});

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val || 0).replace('XAF', 'FCFA');
}

function formatDate(dateVal) {
  if (!dateVal) return 'N/A';
  return new Date(dateVal).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function translateStatus(stat) {
  const m = {
    'Draft': 'Brouillon',
    'Submitted': 'En attente',
    'Approved': 'Approuvé',
    'Preparing': 'En colisage',
    'Packed': 'BL Généré (Attente)',
    'Shipped': 'En transit',
    'Delivered': 'Livré',
    'Cancelled': 'Annulé',
    'Returned': 'Retour Déclaré'
  };
  return m[stat] || stat;
}

function getStatusClasses(stat) {
  const classes = {
    'Draft': 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-700/40',
    'Submitted': 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30',
    'Approved': 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30',
    'Preparing': 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200 dark:bg-fuchsia-950/20 dark:text-fuchsia-400 dark:border-fuchsia-900/30',
    'Packed': 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30',
    'Shipped': 'bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900/30',
    'Delivered': 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
    'Cancelled': 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30',
    'Returned': 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30'
  };
  return classes[stat] || 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-700/40';
}
</script>
