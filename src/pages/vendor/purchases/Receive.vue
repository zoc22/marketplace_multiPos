<template>
  <div class="space-y-6" v-if="deliveryNote">
    <!-- Breadcrumb & Header -->
    <div class="flex items-center space-x-3 mb-2">
      <router-link :to="backLink" class="p-2 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition">
        <ArrowLeftIcon class="h-4 w-4" />
      </router-link>
      <div class="flex items-center space-x-2 text-sm text-[var(--color-text-secondary)] font-medium">
        <router-link :to="backLink" class="hover:text-[var(--color-primary)] transition">Approvisionnements</router-link>
        <ChevronRightIcon class="h-4 w-4 text-[var(--color-text-muted)]" />
        <span class="text-[var(--color-text-primary)] font-bold">Réception Bon de livraison #{{ deliveryNote.reference }}</span>
      </div>
    </div>

    <!-- Main Container -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm space-y-6">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-xl font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
            <span>Réception &amp; Émargement Logistique</span>
          </h1>
          <p class="text-sm text-[var(--color-text-secondary)] mt-1">
            Vérifiez et cochez les produits reçus, ajustez les quantités, signalez la casse et ajoutez d'éventuels produits imprévus.
          </p>
        </div>
      </div>

      <!-- General Info -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[var(--color-surface-hover)] rounded-xl text-sm">
        <div>
          <span class="text-xs text-[var(--color-text-secondary)] block">Fournisseur</span>
          <span class="font-bold text-[var(--color-text-primary)]">{{ deliveryNote.emitter_id }}</span>
        </div>
        <div>
          <span class="text-xs text-[var(--color-text-secondary)] block">Bon de Commande Associé</span>
          <span class="font-bold text-[var(--color-text-primary)] font-mono">#{{ deliveryNote.purchase_order_id }}</span>
        </div>
        <div>
          <span class="text-xs text-[var(--color-text-secondary)] block">Date Expédition</span>
          <span class="font-bold text-[var(--color-text-primary)]">{{ formatDate(deliveryNote.date_emission) }}</span>
        </div>
      </div>

      <!-- Quantity Verification Table -->
      <div class="border border-[var(--color-border)] rounded-xl overflow-hidden">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-[var(--color-surface-hover)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)]">
              <th class="p-4 w-12 text-center">Reçu</th>
              <th class="p-4">Désignation</th>
              <th class="p-4 text-center">Quantité Attendue</th>
              <th class="p-4 text-center">Quantité Conforme *</th>
              <th class="p-4 text-center">Quantité Abîmée</th>
              <th class="p-4 text-right">Statut</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr v-for="(item, idx) in verificationProducts" :key="idx" class="text-sm" :class="{'opacity-50': !item.checked}">
              <!-- Checkbox -->
              <td class="p-4 text-center">
                <input 
                  type="checkbox" 
                  v-model="item.checked" 
                  class="rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] h-4 w-4"
                />
              </td>
              <td class="p-4">
                <span class="font-bold text-[var(--color-text-primary)] block">{{ item.name }}</span>
                <span class="text-xs text-[var(--color-text-muted)]">Code : {{ item.productId }}</span>
                <span v-if="item.is_unexpected" class="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 inline-block mt-1">Imprévu</span>
              </td>
              <td class="p-4 text-center text-[var(--color-text-secondary)] font-medium">
                {{ item.quantity_expected }}
              </td>
              <!-- Qty Received -->
              <td class="p-4 text-center">
                <input 
                  type="number" 
                  v-model.number="item.quantity_received"
                  min="0"
                  :disabled="!item.checked"
                  @input="validateQuantities(idx)"
                  class="w-20 bg-[var(--color-background)] border border-[var(--color-border)] rounded p-1 text-center font-bold text-[var(--color-text-primary)] disabled:opacity-50"
                />
              </td>
              <!-- Qty Damaged -->
              <td class="p-4 text-center">
                <input 
                  type="number" 
                  v-model.number="item.quantity_damaged"
                  min="0"
                  :disabled="!item.checked"
                  @input="validateQuantities(idx)"
                  class="w-20 bg-[var(--color-background)] border border-[var(--color-border)] rounded p-1 text-center font-bold text-red-500 disabled:opacity-50"
                />
              </td>
              <!-- Status badge -->
              <td class="p-4 text-right">
                <span 
                  v-if="!item.checked"
                  class="text-xs font-bold text-slate-500 bg-slate-500/10 px-2 py-0.5 rounded border border-slate-500/20"
                >
                  Non coché
                </span>
                <span 
                  v-else-if="item.quantity_damaged > 0"
                  class="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20"
                >
                  Casse logistique
                </span>
                <span 
                  v-else-if="item.quantity_received === item.quantity_expected"
                  class="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20"
                >
                  Conforme
                </span>
                <span 
                  v-else
                  class="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20"
                >
                  Incomplet
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add Unexpected Product Button/Selector -->
      <div class="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl space-y-4">
        <h4 class="text-xs font-bold uppercase text-[var(--color-text-secondary)] tracking-wider">Ajouter un produit non attendu</h4>
        <div class="flex flex-col sm:flex-row gap-3">
          <select 
            v-model="selectedUnexpectedProductId"
            class="flex-1 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2.5 text-sm text-[var(--color-text-primary)]"
          >
            <option value="">Sélectionner un produit dans le catalogue global</option>
            <option v-for="p in globalProducts" :key="p.id" :value="p.id">
              {{ p.name }} ({{ p.category }})
            </option>
          </select>
          <button 
            type="button" 
            @click="addUnexpectedProduct"
            class="px-4 py-2 bg-[var(--color-primary-muted)] text-[var(--color-primary)] font-bold text-xs rounded-lg border border-[var(--color-primary-border)] hover:bg-[var(--color-primary)] hover:text-white transition"
          >
            Ajouter à la réception
          </button>
        </div>
      </div>

      <!-- Signature & Comments -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Signature réceptionnaire *</label>
          <input 
            type="text" 
            v-model="signature" 
            placeholder="Saisissez votre nom complet pour émarger"
            required
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Observations globales</label>
          <input 
            type="text" 
            v-model="notes" 
            placeholder="Ex : Quelques cartons de HP ProBook abîmés durant le transport."
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
          />
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex justify-end space-x-3 pt-4 border-t border-[var(--color-border)]">
        <button 
          @click="onCancel"
          class="px-5 py-2.5 border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] rounded-lg text-sm font-semibold transition"
        >
          Annuler
        </button>
        <button 
          @click="confirmReceipt"
          :disabled="!signature || checkedCount === 0"
          class="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-semibold shadow transition disabled:opacity-50"
        >
          CONFIRMER LA RÉCEPTION ET L'ÉMARGEMENT
        </button>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-12 text-[var(--color-text-muted)]">
    Bon de livraison introuvable...
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrdersStore } from '@/store/modules/orders.js';
import { useProductsStore } from '@/store/modules/products.js';
import { products as vendorProductsList } from '@/utils/vendor_db.js';
import { useToast } from 'vue-toastification';
import { ArrowLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const ordersStore = useOrdersStore();
const productsStore = useProductsStore();

const isVendor = computed(() => route.path.includes('/vendor'));
const backLink = computed(() => isVendor.value ? '/vendor/purchases' : '/distributor/purchases');

const deliveryNote = computed(() => {
  return ordersStore.deliveryNotes.find(n => n.id === route.params.id);
});

const verificationProducts = ref([]);
const signature = ref('');
const notes = ref('');
const selectedUnexpectedProductId = ref('');

const checkedCount = computed(() => {
  return verificationProducts.value.filter(p => p.checked).length;
});

const globalProducts = computed(() => {
  const allProds = isVendor.value ? vendorProductsList.value : productsStore.products;
  return allProds.filter(p => !verificationProducts.value.some(vp => vp.productId === p.id));
});

onMounted(() => {
  if (deliveryNote.value) {
    verificationProducts.value = deliveryNote.value.products.map(p => ({
      productId: p.productId,
      name: p.name || getProductName(p.productId),
      quantity_expected: p.quantity_delivered || p.quantity || 0,
      quantity_received: p.quantity_delivered || p.quantity || 0,
      quantity_damaged: 0,
      checked: true,
      is_unexpected: false
    }));
  }
});

const getProductName = (id) => {
  const allProds = isVendor.value ? vendorProductsList.value : productsStore.products;
  const p = allProds.find(x => x.id === id);
  return p ? p.name : `Produit #${id}`;
};

const validateQuantities = (idx) => {
  const item = verificationProducts.value[idx];
  if (item.quantity_received < 0) item.quantity_received = 0;
  if (item.quantity_damaged < 0) item.quantity_damaged = 0;
};

const addUnexpectedProduct = () => {
  if (!selectedUnexpectedProductId.value) return;
  
  const allProds = isVendor.value ? vendorProductsList.value : productsStore.products;
  const prod = allProds.find(p => p.id === selectedUnexpectedProductId.value);
  if (prod) {
    verificationProducts.value.push({
      productId: prod.id,
      name: prod.name,
      quantity_expected: 0,
      quantity_received: 10,
      quantity_damaged: 0,
      checked: true,
      is_unexpected: true
    });
    selectedUnexpectedProductId.value = '';
    toast.success(`Produit imprévu "${prod.name}" ajouté à la réception !`);
  }
};

const confirmReceipt = () => {
  if (!signature.value) {
    toast.error("Veuillez signer pour accuser réception.");
    return;
  }

  const dn = ordersStore.confirmDelivery(deliveryNote.value.id);
  if (dn) {
    dn.receiver_signature = signature.value;
    dn.notes = notes.value;

    // Apply stock updates to the recipient database
    verificationProducts.value.forEach(item => {
      if (item.checked && item.quantity_received > 0) {
        if (isVendor.value) {
          const prod = vendorProductsList.value.find(p => p.id === item.productId);
          if (prod) {
            prod.stock += item.quantity_received;
          }
        } else {
          productsStore.adjustStock(item.productId, item.quantity_received);
        }
      }
    });
    
    toast.success("Réception logistique confirmée ! Les stocks de votre catalogue ont été mis à jour.");
    router.push(backLink.value);
  }
};

const onCancel = () => {
  router.push(backLink.value);
};

const formatDate = (dateVal) => {
  if (!dateVal) return 'N/A';
  return new Date(dateVal).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
</script>
