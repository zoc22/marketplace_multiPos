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
      <!-- DETAILS SHEET (DASHBOARD TABLE STYLE) -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <!-- Stamp watermark -->
          <div 
            v-if="order?.status === 'DELIVERED'"
            class="absolute top-6 right-6 border-4 border-emerald-600 text-emerald-600 font-mono font-black uppercase text-xs px-3 py-1.5 rounded-lg -rotate-12 select-none opacity-80"
          >
            ÉMARGÉ ✓
          </div>

          <div class="border-b border-[var(--color-border)] pb-4 mb-4">
            <h3 class="text-sm font-mono font-black text-[var(--color-primary)] uppercase tracking-wider">Récapitulatif du Bon de Commande</h3>
          </div>

          <!-- Metadata Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-[var(--color-text-secondary)] border-b border-[var(--color-border)] pb-4 mb-6">
            <div>
              <span class="block text-[10px] text-[var(--color-text-muted)] uppercase">Destinataire :</span>
              <span class="font-bold text-[var(--color-text-primary)] text-xs">{{ order?.receiver_id }}</span>
            </div>
            <div>
              <span class="block text-[10px] text-[var(--color-text-muted)] uppercase">Livraison :</span>
              <span class="font-bold text-[var(--color-text-primary)]">{{ order?.shipping_address }}</span>
            </div>
            <div>
              <span class="block text-[10px] text-[var(--color-text-muted)] uppercase">Date émis :</span>
              <span class="font-bold text-[var(--color-text-primary)]">{{ formatDate(order?.date_emission) }}</span>
            </div>
          </div>

          <!-- Products Table -->
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="bg-[var(--color-surface-elevated)] border-b border-[var(--color-border)] text-[10px] font-mono text-[var(--color-text-secondary)] uppercase">
                  <th class="p-3">Produit</th>
                  <th class="p-3 text-center">Quantité</th>
                  <th class="p-3 text-right">Prix Unitaire</th>
                  <th class="p-3 text-right">Montant HT</th>
                  <th class="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in paginatedProducts" :key="idx" class="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition">
                  <td class="p-3 font-bold text-[var(--color-text-primary)]">{{ item.product_id }}</td>
                  <td class="p-3 text-center font-mono font-black text-[var(--color-text-primary)]">
                    <div v-if="order?.isOriginalDraft" class="flex items-center justify-center space-x-1.5">
                      <button 
                        @click="updateProductQty(item.product_id, Math.max(1, item.quantity - 1))" 
                        class="px-1.5 py-0.5 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded text-xs hover:bg-[var(--color-surface-hover)] font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span class="w-8 text-center">{{ item.quantity }}</span>
                      <button 
                        @click="updateProductQty(item.product_id, item.quantity + 1)" 
                        class="px-1.5 py-0.5 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded text-xs hover:bg-[var(--color-surface-hover)] font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                    <span v-else>{{ item.quantity }}</span>
                  </td>
                  <td class="p-3 text-right font-mono text-[var(--color-text-primary)]">{{ formatMoney(item.unit_price) }}</td>
                  <td class="p-3 text-right font-mono font-bold text-[var(--color-text-primary)]">{{ formatMoney(item.quantity * item.unit_price) }}</td>
                  <td class="p-3 text-center space-x-1.5">
                    <template v-if="order?.isOriginalDraft">
                      <button 
                        @click="removeProduct(item.product_id)" 
                        class="px-2.5 py-1 bg-red-500/10 text-red-650 font-mono text-[10px] font-bold uppercase rounded hover:bg-red-500 hover:text-white transition cursor-pointer"
                      >
                        Retirer
                      </button>
                    </template>
                    <template v-else>
                      <button @click="showProductSheet(item)" class="px-2.5 py-1 bg-[var(--color-primary-muted)] text-[var(--color-primary)] font-mono text-[10px] font-bold uppercase rounded hover:bg-[var(--color-primary)] hover:text-white transition cursor-pointer">
                        Fiche
                      </button>
                      <button @click="raiseProductAlert(item)" class="px-2.5 py-1 bg-amber-500/10 text-amber-600 font-mono text-[10px] font-bold uppercase rounded hover:bg-amber-500 hover:text-white transition cursor-pointer">
                        Signaler
                      </button>
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Add Product form if Draft -->
          <div v-if="order?.isOriginalDraft" class="mt-6 p-4 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl space-y-3">
            <h4 class="text-xs uppercase font-mono font-bold text-[var(--color-primary)]">Ajouter un produit (Fournisseur ciblé)</h4>
            <div class="flex flex-col sm:flex-row gap-3">
              <select 
                v-model="productToAdd" 
                class="flex-1 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-xs text-[var(--color-text-primary)] focus:outline-none"
              >
                <option value="">Sélectionnez un produit...</option>
                <option v-for="p in availableSupplierProducts" :key="p.id" :value="p.id">
                  {{ p.name }} - {{ formatMoney(p.price) }}
                </option>
              </select>
              <div class="flex items-center space-x-2">
                <label class="text-[10px] uppercase font-mono text-[var(--color-text-secondary)]">Quantité</label>
                <input 
                  type="number" 
                  v-model.number="qtyToAdd" 
                  min="1" 
                  class="w-16 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-2 py-1 text-xs text-center font-bold text-[var(--color-text-primary)]"
                />
              </div>
              <button 
                @click="addProductToOrder" 
                :disabled="!productToAdd"
                class="px-4 py-1.5 bg-[var(--color-primary)] text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-xs font-bold uppercase transition cursor-pointer"
              >
                Ajouter
              </button>
            </div>
          </div>

          <!-- Product Pagination -->
          <div v-if="totalProductPages > 1" class="flex justify-between items-center pt-4 font-mono text-xs">
            <button @click="prevProductPage" :disabled="currentProductPage === 1" class="px-2.5 py-1 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded text-[10px] disabled:opacity-40 uppercase cursor-pointer flex items-center space-x-1">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              <span>Précédent</span>
            </button>
            <span class="text-[10px] text-[var(--color-text-secondary)]">Page {{ currentProductPage }} / {{ totalProductPages }}</span>
            <button @click="nextProductPage" :disabled="currentProductPage === totalProductPages" class="px-2.5 py-1 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded text-[10px] disabled:opacity-40 uppercase cursor-pointer flex items-center space-x-1">
              <span>Suivant</span>
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>

          <!-- Total summary -->
          <div class="flex justify-end pt-6 border-t border-[var(--color-border)] mt-6">
            <div class="w-80 space-y-2 text-xs font-mono text-[var(--color-text-secondary)] font-bold">
              <div class="flex justify-between">
                <span>SOUS-TOTAL COMMANDE :</span>
                <span class="text-[var(--color-text-primary)] font-extrabold">{{ formatMoney(orderSubtotal) }}</span>
              </div>
              <div class="flex justify-between text-sm font-sans font-black text-[var(--color-text-primary)] pt-2 border-t border-[var(--color-border)]">
                <span class="text-[var(--color-primary)]">VALEUR TOTAL TTC :</span>
                <span class="text-base font-mono font-bold">{{ formatMoney(order?.total) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TIMELINE COLUMN -->
      <div class="space-y-6">
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 space-y-4 shadow-sm">
          <div class="flex items-center justify-between">
            <h3 class="text-xs uppercase font-mono tracking-wider text-[var(--color-primary)] font-bold">Pipeline d'Approvisionnement</h3>
            <!-- Help Icon -->
            <button @click="showHelp = !showHelp" class="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] rounded-full hover:bg-[var(--color-surface-hover)] transition" title="Aide sur les processus">
              <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </button>
          </div>

          <!-- Non-invasive help alert -->
          <div v-if="showHelp" class="p-3 bg-[var(--color-primary-muted)] text-[var(--color-text-primary)] rounded-lg text-xs space-y-1.5 border border-[var(--color-primary-border)]">
            <p class="font-bold flex items-center space-x-1">
              <svg class="w-4 h-4 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 30v-3.75m0 0L12 12" />
              </svg>
              <span>Système de paiement Séquestre</span>
            </p>
            <ol class="list-decimal pl-4 space-y-1 text-[11px] text-[var(--color-text-secondary)]">
              <li>L'argent est déduit de votre solde et bloqué par l'admin (séquestre).</li>
              <li>Le fournisseur prépare et expédie le bon de livraison.</li>
              <li>Vous confirmez la réception conforme. Le statut passe en attente de libération.</li>
              <li>Après validation administrative ou fin de délai, les fonds sont versés au fournisseur.</li>
            </ol>
          </div>

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

        <!-- Escrow/Dispute Action Card -->
        <div v-if="order && order.status === 'DELIVERED'" class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 space-y-4 shadow-sm">
          <h3 class="text-xs uppercase font-mono tracking-wider text-red-500 font-bold">Signalement &amp; Litige</h3>
          <p class="text-xs text-[var(--color-text-secondary)]">Si les articles reçus ne sont pas conformes, vous pouvez ouvrir un litige pour suspendre le paiement.</p>
          
          <div v-if="existingDispute" class="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl space-y-1.5">
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold text-red-600 font-mono">LITIGE {{ existingDispute.reference }}</span>
              <span class="px-2 py-0.5 bg-red-500/20 text-red-600 rounded text-[9px] font-bold">{{ existingDispute.status }}</span>
            </div>
            <p class="text-xs text-[var(--color-text-secondary)]"><span class="font-bold">Raison :</span> {{ existingDispute.reason }}</p>
            <p class="text-[11px] text-[var(--color-text-muted)]">{{ existingDispute.description }}</p>
          </div>
          
          <button 
            v-else
            @click="isDisputeModalOpen = true"
            class="w-full py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold font-mono rounded-xl transition flex items-center justify-center space-x-1"
          >
            <span>⚠️ Signaler un problème / Litige</span>
          </button>
        </div>
      </div>
    </div>

    <!-- DISPUTE MODAL -->
    <div v-if="isDisputeModalOpen" @click.self="isDisputeModalOpen = false" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="bg-[var(--color-surface)] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-[var(--color-border)] p-6 space-y-4">
        <h3 class="text-lg font-bold text-[var(--color-text-primary)]">Déclarer un Litige</h3>
        <p class="text-xs text-[var(--color-text-secondary)]">Veuillez spécifier la raison pour laquelle les produits livrés ne conviennent pas.</p>
        
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Raison du litige</label>
            <select v-model="disputeForm.reason" class="w-full p-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)]">
              <option value="Articles non conformes">Articles non conformes (Erreur produit)</option>
              <option value="Qualité insuffisante / Endommagé">Qualité insuffisante ou produits cassés</option>
              <option value="Quantités réelles manquantes">Quantités livrées inférieures au bon</option>
              <option value="Autre motif">Autre motif exceptionnel</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Description détaillée</label>
            <textarea v-model="disputeForm.description" rows="3" placeholder="Expliquez en détail le problème rencontré avec la livraison..." class="w-full p-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)]"></textarea>
          </div>
        </div>

        <div class="flex justify-end space-x-2 pt-2">
          <button @click="isDisputeModalOpen = false" class="px-4 py-2 text-xs font-bold bg-[var(--color-surface-hover)] border rounded-xl">Annuler</button>
          <button @click="submitDispute" :disabled="!disputeForm.description" class="px-4 py-2 text-xs font-bold bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50">Soumettre le litige</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useOrdersStore } from '@/store/modules/orders.js';
import { useDisputesStore } from '@/store/modules/disputes.js';
import { usePaymentsStore } from '@/store/modules/payments.js';
import { useToast } from 'vue-toastification';
import { orders as dbOrders, products as catalogProducts } from '@/utils/supplier_db.js';
import StatusBadge from '@/components/common/StatusBadge.vue';
import OrderTimeline from '@/components/common/OrderTimeline.vue';
import PrintButton from '@/components/print/PrintButton.vue';
import PrintTemplate from '@/components/print/PrintTemplate.vue';

const route = useRoute();
const toast = useToast();
const ordersStore = useOrdersStore();
const disputesStore = useDisputesStore();
const paymentsStore = usePaymentsStore();
const orderId = route.params.id;

const selectedSupplierId = route.query.supplier;

const availableSupplierProducts = computed(() => {
  if (!selectedSupplierId) return [];
  return catalogProducts.value.filter(p => {
    return p.supplierId === selectedSupplierId && !order.value?.products?.some(op => op.product_id === p.name);
  });
});

const productToAdd = ref('');
const qtyToAdd = ref(1);

function updateProductQty(productName, newQty) {
  if (!order.value) return;
  const rawOrder = ordersStore.purchaseOrders.find(o => o.id === orderId) || 
                   dbOrders.value.find(o => o.id === orderId);
  if (rawOrder) {
    const rawProducts = rawOrder.products || rawOrder.items || [];
    const prod = rawProducts.find(p => (p.productName || p.product_id) === productName);
    if (prod) {
      prod.quantity = newQty;
      prod.qty = newQty;
      prod.total = newQty * (prod.unit_price || prod.unitPrice || 0);
      rawOrder.total = rawProducts.reduce((sum, p) => sum + ((p.quantity || p.qty || 0) * (p.unit_price || p.unitPrice || 0)), 0);
      toast.success("Quantité mise à jour");
    }
  }
}

function removeProduct(productName) {
  if (!order.value) return;
  const rawOrder = ordersStore.purchaseOrders.find(o => o.id === orderId) || 
                   dbOrders.value.find(o => o.id === orderId);
  if (rawOrder) {
    const rawProducts = rawOrder.products || rawOrder.items || [];
    const index = rawProducts.findIndex(p => (p.productName || p.product_id) === productName);
    if (index > -1) {
      rawProducts.splice(index, 1);
      rawOrder.total = rawProducts.reduce((sum, p) => sum + ((p.quantity || p.qty || 0) * (p.unit_price || p.unitPrice || 0)), 0);
      toast.success("Produit retiré du bon de commande");
    }
  }
}

function addProductToOrder() {
  if (!productToAdd.value || !order.value) return;
  const selectedProd = catalogProducts.value.find(p => p.id === productToAdd.value);
  if (!selectedProd) return;

  const rawOrder = ordersStore.purchaseOrders.find(o => o.id === orderId) || 
                   dbOrders.value.find(o => o.id === orderId);
  if (rawOrder) {
    const rawProducts = rawOrder.products || rawOrder.items || [];
    rawProducts.push({
      product_id: selectedProd.id,
      productName: selectedProd.name,
      quantity: qtyToAdd.value,
      qty: qtyToAdd.value,
      unit_price: selectedProd.price,
      unitPrice: selectedProd.price,
      supplierId: selectedSupplierId,
      status: 'Pending'
    });
    rawOrder.total = rawProducts.reduce((sum, p) => sum + ((p.quantity || p.qty || 0) * (p.unit_price || p.unitPrice || 0)), 0);
    toast.success("Produit ajouté avec succès");
    productToAdd.value = '';
    qtyToAdd.value = 1;
  }
}

const showHelp = ref(false);
const isDisputeModalOpen = ref(false);
const disputeForm = ref({
  reason: 'Articles non conformes',
  description: ''
});

// Products list pagination
const currentProductPage = ref(1);
const productsPerPage = 5;

const orderSubtotal = computed(() => {
  if (!order.value || !order.value.products) return 0;
  return order.value.products.reduce((acc, p) => acc + (p.quantity * p.unit_price), 0);
});

const totalProductPages = computed(() => {
  if (!order.value || !order.value.products) return 0;
  return Math.ceil(order.value.products.length / productsPerPage);
});

const paginatedProducts = computed(() => {
  if (!order.value || !order.value.products) return [];
  const start = (currentProductPage.value - 1) * productsPerPage;
  return order.value.products.slice(start, start + productsPerPage);
});

function prevProductPage() {
  if (currentProductPage.value > 1) currentProductPage.value--;
}

function nextProductPage() {
  if (currentProductPage.value < totalProductPages.value) currentProductPage.value++;
}

function showProductSheet(item) {
  toast.info(`Chargement de la fiche technique pour : ${item.product_id}`);
}

function raiseProductAlert(item) {
  toast.warning(`Alerte de conformité signalée pour : ${item.product_id}`);
}

const order = computed(() => {
  const rawOrder = ordersStore.purchaseOrders.find(o => o.id === orderId) || 
                   ordersStore.orders.find(o => o.id === orderId) ||
                   dbOrders.value.find(o => o.id === orderId);
  
  if (!rawOrder) return null;

  // Normalize items / products array
  const rawProducts = rawOrder.products || rawOrder.items || [];
  const selectedSupplierId = route.query.supplier;
  
  const filteredRawProducts = selectedSupplierId
    ? rawProducts.filter(item => item.supplierId === selectedSupplierId)
    : rawProducts;

  const normalizedProducts = filteredRawProducts.map(item => ({
    product_id: item.productName || item.product_id || 'Produit',
    quantity: item.quantity || item.qty || 0,
    unit_price: item.unitPrice || item.unit_price || 0,
  }));

  // Resolve status translation / mapping if necessary
  let normalizedStatus = rawOrder.status;
  const statusMap = {
    'Submitted': 'PENDING',
    'Draft': 'PENDING',
    'Approved': 'PROCESSING',
    'Preparing': 'PROCESSING',
    'Packed': 'PROCESSING',
    'Shipped': 'PROCESSING',
    'Delivered': 'DELIVERED',
    'Completed': 'DELIVERED'
  };
  if (statusMap[rawOrder.status]) {
    normalizedStatus = statusMap[rawOrder.status];
  }

  const computedTotal = selectedSupplierId
    ? Math.floor(normalizedProducts.reduce((acc, p) => acc + (p.quantity * p.unit_price), 0) * 1.1925) + 5000
    : rawOrder.total || 0;

  return {
    ...rawOrder,
    reference: rawOrder.reference || rawOrder.id || 'N/A',
    date_emission: rawOrder.date_emission || rawOrder.created_at || new Date().toISOString(),
    receiver_id: rawOrder.supplierName || rawOrder.receiver_id || 'N/A',
    receiver_type: rawOrder.receiver_type || 'Fournisseur',
    shipping_address: rawOrder.shipping_address || rawOrder.deliveryMode || 'Non spécifiée',
    status: normalizedStatus,
    products: normalizedProducts,
    total: computedTotal,
    isOriginalDraft: rawOrder.status === 'Draft'
  };
});

const existingDispute = computed(() => {
  return disputesStore.disputes.find(d => d.purchase_order_id === orderId || d.order_id === orderId);
});

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val || 0).replace('XAF', 'FCFA');
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function submitDispute() {
  const payment = paymentsStore.escrowPayments.find(p => p.purchase_order_id === orderId || p.order_id === orderId);
  if (!payment) {
    toast.error('Paiement séquestre introuvable pour cette commande.');
    return;
  }

  disputesStore.createDispute({
    escrow_payment_id: payment.id,
    initiator_id: 'usr_buyer_1',
    initiator_type: 'buyer',
    purchase_order_id: orderId,
    reason: disputeForm.value.reason,
    description: disputeForm.value.description
  });

  isDisputeModalOpen.value = false;
  toast.warning('Votre litige a été ouvert. Le Super Admin va examiner la situation.');
}
</script>
