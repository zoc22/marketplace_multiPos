<template>
  <div class="space-y-6 max-w-7xl mx-auto" id="buyer-purchases-workspace">
    <!-- PANEL HEADER -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 gap-4 shadow-sm">
      <div>
        <div class="flex items-center space-x-2">
          <span class="text-xs font-mono bg-[var(--color-primary-muted)] text-[var(--color-primary)] px-2.5 py-0.5 rounded-full border border-[var(--color-primary-border)] font-bold uppercase">
            Achats &amp; Réapprovisionnement
          </span>
          <span class="text-xs font-mono bg-emerald-500/10 text-emerald-500 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-bold uppercase">
            Mon Solde : {{ formatMoney(walletFree) }}
          </span>
        </div>
        <h1 class="text-lg font-bold text-[var(--color-text-primary)] mt-1">Espace Achats &amp; Commandes</h1>
        <p class="text-xs text-[var(--color-text-secondary)] mt-0.5">Émettez des bons de commande, suivez le transit logistique et libérez le paiement sécurisé après réception.</p>
      </div>
      <div>
        <button 
          @click="openNewPOModal"
          class="px-5 py-2.5 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition shadow-lg flex items-center space-x-2"
          id="btn-create-po"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Créer une Commande</span>
        </button>
      </div>
    </div>

    <!-- ORDERS DATA TABLE -->
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm">
      <div class="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
        <h3 class="text-sm font-mono uppercase font-bold text-[var(--color-text-primary)]">Suivi de mes Achats</h3>
        <span class="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase">Paiements sécurisés sous séquestre administrative</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse" id="orders-table">
          <thead>
            <tr class="bg-[var(--color-surface-elevated)] border-b border-[var(--color-border)] text-xs font-mono text-[var(--color-text-secondary)] uppercase">
              <th class="p-4">Référence</th>
              <th class="p-4">Date de Création</th>
              <th class="p-4 text-right">Valeur TTC</th>
              <th class="p-4 text-center">Statut Commande</th>
              <th class="p-4 text-center">Statut Paiement</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="order in buyerOrders" 
              :key="order.id"
              class="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition text-sm font-medium"
              :id="'row-' + order.id"
            >
              <td class="p-4 font-mono font-bold text-[var(--color-text-primary)]">
                <router-link :to="'/buyer/orders/' + order.id" class="hover:text-[var(--color-primary)] flex items-center space-x-1.5">
                  <span>{{ order.reference }}</span>
                </router-link>
              </td>
              <td class="p-4 text-[var(--color-text-secondary)] font-mono">{{ formatDate(order.created_at) }}</td>
              <td class="p-4 text-right font-mono font-bold text-[var(--color-text-primary)]">
                {{ formatMoney(order.total) }}
              </td>
              <td class="p-4 text-center">
                <span class="px-3 py-1 rounded-full text-xs font-mono tracking-wide uppercase font-bold" :class="getStatusClasses(order.status)">
                  {{ translateStatus(order.status) }}
                </span>
              </td>
              <td class="p-4 text-center">
                <span class="px-3 py-1 rounded-full text-xs font-mono border uppercase font-bold" :class="getPaymentStatusClasses(order.paymentStatus || 'Escrow_Held')">
                  {{ translatePaymentStatus(order.paymentStatus || 'Escrow_Held') }}
                </span>
              </td>
              <td class="p-4 text-right space-x-2">
                <router-link 
                  :to="'/buyer/orders/' + order.id"
                  class="inline-flex items-center justify-center p-2 bg-[var(--color-surface-elevated)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] rounded-xl border border-[var(--color-border)] transition"
                  title="Afficher les détails de la commande"
                >
                  <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </router-link>

                <!-- Track & Sign delivery (disabled if PO is not yet validated by vendor/supplier - status Draft or Submitted) -->
                <router-link
                  v-if="['Shipped', 'Preparing', 'Packed'].includes(order.status)"
                  :to="'/buyer/track/' + order.id"
                  class="inline-flex items-center justify-center p-2 bg-[var(--color-primary-muted)] text-[var(--color-primary)] rounded-xl border border-[var(--color-primary-border)] transition animate-pulse font-bold"
                  title="Suivre et émarger la livraison"
                >
                  <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.75A1.125 1.125 0 012.625 17.625V12m18 5.625c0 .621-.504 1.125-1.125 1.125H18m-9-6.375V9m-3 3h12m-.75 3H6.75m12 0h2.25A1.125 1.125 0 0022.125 14.25V12m0 0l-3.375-4.5M21 12H18m0-3V6.75A1.125 1.125 0 0016.875 5.625H12m-3 0H5.625A1.125 1.125 0 004.5 6.75V9" />
                  </svg>
                </router-link>
                <router-link
                  v-else-if="order.status === 'Delivered' || order.status === 'Completed'"
                  :to="'/buyer/track/' + order.id"
                  class="inline-flex items-center justify-center p-2 bg-emerald-500/10 text-emerald-600 rounded-xl border border-emerald-500/30 transition cursor-pointer font-bold"
                  title="Voir la preuve d'émargement"
                >
                  <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                </router-link>
                <!-- Lock tracking and print if not yet approved/packed -->
                <span 
                  v-else 
                  class="inline-flex items-center justify-center p-2 bg-slate-500/10 text-slate-400 rounded-xl border border-slate-500/20 cursor-not-allowed"
                  title="En attente de validation fournisseur (BL requis)"
                >
                  🔒
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- NEW PURCHASE ORDER MODAL/DRAWER -->
    <div 
      v-if="showNewPOModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      id="new-po-modal"
      @click.self="closeNewPOModal"
    >
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        <div class="p-6 border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)] flex items-center justify-between shrink-0">
          <div>
            <h2 class="text-md font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
              <svg class="w-5 h-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              <span>Créer un bon de commande</span>
            </h2>
            <p class="text-[10px] text-[var(--color-text-secondary)]">Le montant sera séquestré par l'administrateur jusqu'à la livraison conforme.</p>
          </div>
          <button @click="closeNewPOModal" class="p-1 px-2.5 bg-[var(--color-surface-elevated)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)] rounded text-xs font-mono transition">
            [ Fermer ]
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-[var(--color-border)]">
            <div class="space-y-4">
              <label class="block">
                <span class="block text-[10px] uppercase font-mono tracking-wider text-[var(--color-primary)] font-bold mb-1">Vendeur Partenaire</span>
                <select 
                  v-model="newPO.supplierName"
                  class="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-3 py-2 text-xs font-mono text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
                >
                  <option value="Zama-Agro Sahel">Zama-Agro Sahel</option>
                  <option value="SOPRO-CAM S.A.">SOPRO-CAM S.A.</option>
                  <option value="Nylon Packaging Douala">Nylon Packaging Douala</option>
                </select>
              </label>

              <label class="block">
                <span class="block text-[10px] uppercase font-mono tracking-wider text-[var(--color-primary)] font-bold mb-1">Mode de Transport</span>
                <select 
                  v-model="newPO.deliveryMode"
                  class="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-3 py-2 text-xs font-mono text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
                >
                  <option value="Rail Cargo (Cameroun Rail Fret)">Fret Ferroviaire Cameroun</option>
                  <option value="Route Heavy Truck (Camion 10t)">Transport Routier Poids Lourd</option>
                  <option value="Express Isothermal Van">Fourgon Isotherme Express</option>
                </select>
              </label>
            </div>

            <div class="p-4 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl space-y-2 text-xs">
              <h3 class="font-bold font-mono text-[10px] uppercase tracking-wider text-[var(--color-primary)]">Règlementation Financière</h3>
              <p class="text-[var(--color-text-secondary)] leading-relaxed text-[11px]">
                Le paiement en ligne implique la <strong>séquestration administrative</strong> immédiate du montant total TTC. 
                Les fonds ne sont crédités au destinataire qu'après signature électronique du bon de livraison émargé.
              </p>
            </div>
          </div>

          <!-- Product Picker Grid -->
          <div class="space-y-3">
            <h3 class="text-xs uppercase font-mono tracking-wider text-[var(--color-text-secondary)] font-bold">Catalogue</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div 
                v-for="prod in catalogProducts" 
                :key="prod.id"
                class="bg-[var(--color-surface)] border rounded-xl p-3 flex flex-col justify-between transition cursor-pointer"
                :class="isProductSelected(prod.id) ? 'border-[var(--color-primary)] bg-[var(--color-primary-muted)]' : 'border-[var(--color-border)] hover:border-[var(--color-text-secondary)]'"
                @click="toggleProductInPO(prod)"
              >
                <div>
                  <h4 class="text-xs font-bold text-[var(--color-text-primary)] mt-1">{{ prod.name }}</h4>
                  <p class="text-[10px] text-[var(--color-text-secondary)] mt-1">Stock dispo : {{ prod.stock }}</p>
                </div>
                <div class="flex justify-between items-center mt-3 pt-2 border-t border-[var(--color-border)]" @click.stop>
                  <span class="text-xs font-bold font-mono text-[var(--color-text-primary)]">{{ formatMoney(prod.price) }}</span>
                  <div v-if="isProductSelected(prod.id)" class="flex items-center space-x-1.5">
                    <button @click="decrementQty(prod.id)" class="w-5 h-5 bg-[var(--color-surface-elevated)] hover:bg-[var(--color-surface-hover)] text-slate-200 flex items-center justify-center rounded border border-[var(--color-border)]">-</button>
                    <span class="text-xs font-bold font-mono px-1 w-6 text-center text-slate-200">{{ getSelectedQty(prod.id) }}</span>
                    <button @click="incrementQty(prod.id)" class="w-5 h-5 bg-[var(--color-surface-elevated)] hover:bg-[var(--color-surface-hover)] text-slate-200 flex items-center justify-center rounded border border-[var(--color-border)]">+</button>
                  </div>
                  <span v-else @click="toggleProductInPO(prod)" class="text-[10px] font-mono text-[var(--color-primary)] font-bold hover:underline cursor-pointer">+ Sélectionner</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Totals -->
          <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl p-6 space-y-4">
            <h3 class="text-xs uppercase font-mono tracking-wider text-[var(--color-text-primary)] font-bold">Récapitulatif financier</h3>
            <div class="pt-4 border-t border-[var(--color-border)] divide-y divide-[var(--color-border)]/40 text-xs text-[var(--color-text-secondary)] font-mono">
              <div class="py-1.5 flex justify-between">
                <span>SOUS-TOTAL HT</span>
                <span class="text-[var(--color-text-primary)] font-bold">{{ formatMoney(totalSubtotal) }}</span>
              </div>
              <div class="py-1.5 flex justify-between">
                <span>TVA (19,25 %)</span>
                <span class="text-[var(--color-text-primary)] font-bold">{{ formatMoney(totalVAT) }}</span>
              </div>
              <div class="py-1.5 flex justify-between">
                <span>FRAIS DE LIVRAISON</span>
                <span class="text-[var(--color-text-primary)] font-bold">{{ formatMoney(fixedShipping) }}</span>
              </div>
              <div class="py-3 flex justify-between text-[var(--color-text-primary)] font-sans font-bold text-sm">
                <span class="text-[var(--color-primary)] uppercase font-mono text-xs">Montant total à séquestrer TTC</span>
                <span class="text-[var(--color-text-primary)] font-mono">{{ formatMoney(totalFinalCost) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6 border-t border-[var(--color-border)] bg-[var(--color-surface-elevated)] shrink-0 flex items-center justify-between">
          <span class="text-xs font-mono text-[var(--color-text-secondary)]">Votre solde disponible : <strong class="text-emerald-500">{{ formatMoney(walletFree) }}</strong></span>
          <div class="space-x-3">
            <button @click="closeNewPOModal" class="px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-mono rounded-xl transition">Annuler</button>
            <button 
              @click="submitPurchaseOrder"
              :disabled="newPO.selectedItems.length === 0 || totalFinalCost > walletFree"
              class="px-5 py-2 bg-[var(--color-primary)] disabled:opacity-40 disabled:cursor-not-allowed text-white font-mono font-bold uppercase rounded-xl text-xs tracking-wider transition shadow"
            >
              Payer &amp; Soumettre au Séquestre
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { products as catalogProducts, orders as dbOrders, walletFree, walletLocked } from '@/utils/supplier_db.js';
import { useToast } from 'vue-toastification';

const toast = useToast();
const showNewPOModal = ref(false);

const buyerOrders = computed(() => {
  return dbOrders.value || [];
});

const newPO = ref({
  supplierName: 'Zama-Agro Sahel',
  deliveryMode: 'Rail Cargo (Cameroun Rail Fret)',
  selectedItems: []
});

function openNewPOModal() {
  newPO.value = {
    supplierName: 'Zama-Agro Sahel',
    deliveryMode: 'Rail Cargo (Cameroun Rail Fret)',
    selectedItems: []
  };
  showNewPOModal.value = true;
}

function closeNewPOModal() {
  showNewPOModal.value = false;
}

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
    if (prod.stock <= 0) {
      toast.error(`Le produit ${prod.name} est en rupture.`);
      return;
    }
    newPO.value.selectedItems.push({
      productId: prod.id,
      name: prod.name,
      sku: prod.sku || 'SKU-01',
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
      toast.error(`Excède le stock disponible.`);
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
      newPO.value.selectedItems = newPO.value.selectedItems.filter(i => i.productId !== prodId);
    }
  }
}

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

function submitPurchaseOrder() {
  if (totalFinalCost.value > walletFree.value) {
    toast.error("Solde insuffisant pour couvrir le montant à séquestrer.");
    return;
  }

  const generatedId = `ord_${Date.now()}`;
  const generatedRef = `B2C-PO-2026-${String(Date.now()).slice(-4)}`;

  // Deduct from walletFree and add to walletLocked escrow
  walletFree.value -= totalFinalCost.value;
  walletLocked.value.push({
    id: `escrow_${Date.now()}`,
    refId: generatedId,
    amount: totalFinalCost.value,
    type: 'B2C',
    orderName: `Séquestre Commande ${newPO.value.supplierName}`,
    dateLocked: new Date().toISOString()
  });

  const orderObj = {
    id: generatedId,
    reference: generatedRef,
    clientId: 'cli_buyer_demo',
    clientName: 'Acheteur Consommateur',
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
    status: 'Submitted', // Submitted means created PO, awaiting BL from supplier
    paymentStatus: 'Escrow_Held',
    created_at: new Date().toISOString(),
    deliveryMode: newPO.value.deliveryMode,
    history: [
      { status: 'Submitted', timestamp: new Date().toISOString(), label: 'Bon de commande soumis', description: 'Le montant TTC est bloqué sur le compte séquestre de l\'administration.' }
    ]
  };

  dbOrders.value.unshift(orderObj);
  closeNewPOModal();
  toast.success(`Le bon de commande ${generatedRef} a été créé. Paiement séquestré.`);
}

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val || 0).replace('XAF', 'FCFA');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR');
}

function translateStatus(stat) {
  const m = {
    'Draft': 'Brouillon',
    'Submitted': 'En attente de validation vendeur (BL requis)',
    'Approved': 'Validé (En attente BL)',
    'Preparing': 'En préparation entrepôt',
    'Packed': 'BL généré / En transit',
    'Shipped': 'En Transit logistique',
    'Delivered': 'Livré / Émargé',
    'Completed': 'Terminé'
  };
  return m[stat] || stat;
}

function getStatusClasses(stat) {
  const classes = {
    'Draft': 'bg-slate-500/20 text-slate-300 border border-slate-500/30',
    'Submitted': 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
    'Approved': 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40',
    'Preparing': 'bg-pink-500/20 text-pink-300 border border-pink-500/40',
    'Packed': 'bg-blue-500/20 text-blue-300 border border-blue-500/40',
    'Shipped': 'bg-sky-500/20 text-sky-300 border border-sky-500/40',
    'Delivered': 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
    'Completed': 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
  };
  return classes[stat] || 'bg-slate-500/20 text-slate-300 border border-slate-500/40';
}

function translatePaymentStatus(pStat) {
  const m = {
    'Settled': 'Transféré au Vendeur',
    'Escrow_Held': 'Séquestré par Admin',
    'Refunded': 'Remboursé'
  };
  return m[pStat] || pStat;
}

function getPaymentStatusClasses(pStat) {
  const classes = {
    'Settled': 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
    'Escrow_Held': 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
    'Refunded': 'bg-red-500/20 text-red-300 border border-red-500/40'
  };
  return classes[pStat] || 'bg-slate-500/20 text-slate-300 border border-slate-500/40';
}
</script>
