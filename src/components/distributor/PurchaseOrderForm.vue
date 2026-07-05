<template>
  <form @submit.prevent="submitForm" class="space-y-6">
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm space-y-4">
      <h3 class="text-md font-bold text-[var(--color-text-primary)]">Informations de livraison</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Date de livraison souhaitée -->
        <div>
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Date de livraison souhaitée</label>
          <input 
            type="date" 
            v-model="form.date_livraison_souhaitee"
            required
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text-primary)]"
          />
        </div>

        <!-- Mode de livraison -->
        <div>
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Mode de transport</label>
          <select 
            v-model="form.shipping_mode" 
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text-primary)]"
          >
            <option value="ROUTIER">Routier (Camion)</option>
            <option value="FLUVIAL">Fluvial / Maritime</option>
            <option value="AERIEN">Aérien</option>
          </select>
        </div>

        <!-- Moyen de paiement -->
        <div>
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Moyen de paiement</label>
          <select 
            v-model="form.payment_method" 
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text-primary)]"
          >
            <option value="ESCROW">Séquestre Sécurisé</option>
            <option value="DIRECT">Direct (Virement/MoMo)</option>
          </select>
        </div>
      </div>

      <!-- Adresse de livraison -->
      <div>
        <label class="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Adresse de livraison</label>
        <textarea 
          v-model="form.shipping_address"
          rows="2"
          required
          placeholder="Indiquez l'entrepôt ou l'adresse exacte..."
          class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text-primary)]"
        ></textarea>
      </div>

      <!-- Notes additionnelles -->
      <div>
        <label class="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Notes / Consignes particulières</label>
        <textarea 
          v-model="form.notes"
          rows="2"
          placeholder="Ex : emballage étanche requis..."
          class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text-primary)]"
        ></textarea>
      </div>
    </div>

    <!-- Product Selection Section grouped by Supplier -->
    <div class="space-y-6">
      <div 
        v-for="(group, gIdx) in form.suppliers" 
        :key="gIdx"
        class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm space-y-4"
      >
        <div class="flex justify-between items-center pb-2 border-b border-[var(--color-border)]">
          <!-- Sélection du fournisseur -->
          <div class="w-full sm:w-80">
            <label class="block text-xs font-bold text-[var(--color-text-secondary)] uppercase mb-1">Fournisseur *</label>
            <select 
              v-model="group.supplier_id" 
              required
              @change="onSupplierChange(gIdx)"
              class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2 text-sm text-[var(--color-text-primary)]"
            >
              <option value="" disabled>Sélectionner un fournisseur</option>
              <option v-for="s in suppliersList" :key="s.id" :value="s.id">
                {{ s.name }} ({{ s.roles?.includes('distributor') ? 'Distributeur' : 'Vendeur' }})
              </option>
            </select>
          </div>

          <button 
            type="button"
            @click="removeSupplierGroup(gIdx)"
            class="px-2.5 py-1 text-red-500 hover:bg-red-500/10 rounded-lg text-xs font-bold transition flex items-center space-x-1"
          >
            <span>Retirer Fournisseur</span>
          </button>
        </div>

        <!-- List of products for this supplier -->
        <div class="space-y-3">
          <div 
            v-for="(item, idx) in group.items" 
            :key="idx" 
            class="flex flex-col lg:flex-row lg:items-end gap-3 p-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl relative"
          >
            <!-- Sélection du produit -->
            <div class="flex-1">
              <label class="block text-[10px] font-bold text-[var(--color-text-secondary)] uppercase mb-1">Produit *</label>
              <select 
                v-model="item.product_id" 
                required
                :disabled="!group.supplier_id"
                @change="updateProductDetails(gIdx, idx)"
                class="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-lg p-2 text-sm text-[var(--color-text-primary)] disabled:opacity-50"
              >
                <option value="" disabled>Sélectionner un produit</option>
                <option v-for="p in getProductsForSupplier(group.supplier_id)" :key="p.id" :value="p.id">
                  {{ p.name }} ({{ formatMoney(p.price) }}) - Stock: {{ p.stock }}
                </option>
              </select>
            </div>

            <!-- Quantité -->
            <div class="w-full lg:w-24">
              <label class="block text-[10px] font-bold text-[var(--color-text-secondary)] uppercase mb-1">Quantité *</label>
              <input 
                type="number" 
                v-model.number="item.quantity" 
                min="1" 
                required
                @input="calculateRowTotal(gIdx, idx)"
                class="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-lg p-2 text-sm text-center text-[var(--color-text-primary)]"
              />
            </div>

            <!-- Prix unitaire -->
            <div class="w-full lg:w-28">
              <label class="block text-[10px] font-bold text-[var(--color-text-secondary)] uppercase mb-1">Prix Unit. (FCFA)</label>
              <input 
                type="number" 
                v-model.number="item.unit_price" 
                readonly
                class="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-2 text-sm text-right text-[var(--color-text-secondary)]"
              />
            </div>

            <!-- Total ligne -->
            <div class="w-full lg:w-32 text-right">
              <span class="block text-[10px] font-bold text-[var(--color-text-secondary)] uppercase mb-1">Total ligne</span>
              <div class="p-2 font-bold text-sm text-[var(--color-text-primary)] font-mono">
                {{ formatMoney(item.total) }}
              </div>
            </div>

            <!-- Bouton retirer produit -->
            <button 
              type="button" 
              @click="removeItem(gIdx, idx)"
              class="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition self-end lg:self-auto"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Add product to this supplier -->
        <button 
          type="button" 
          @click="addItem(gIdx)"
          :disabled="!group.supplier_id"
          class="px-4 py-2 border border-dashed border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-muted)] font-bold text-xs rounded-lg transition disabled:opacity-50"
        >
          + Ajouter un produit pour ce fournisseur
        </button>
      </div>
    </div>

    <!-- Main controls -->
    <div class="flex justify-between items-center p-6 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl shadow-sm">
      <button 
        type="button" 
        @click="addSupplierGroup"
        class="px-4 py-2.5 bg-[var(--color-primary-muted)] text-[var(--color-primary)] border border-[var(--color-primary-border)] hover:bg-[var(--color-primary)] hover:text-white font-bold text-xs rounded-lg transition cursor-pointer"
      >
        + Ajouter un autre fournisseur
      </button>

      <div class="text-right">
        <span class="text-xs text-[var(--color-text-secondary)]">Total estimé</span>
        <div class="text-2xl font-black text-[var(--color-text-primary)] font-mono">{{ formatMoney(grandTotal) }}</div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-end space-x-3">
      <button 
        type="button" 
        @click="$emit('cancel')"
        class="px-5 py-2.5 border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] rounded-lg text-sm font-semibold transition cursor-pointer"
      >
        Annuler
      </button>
      <button 
        type="submit" 
        :disabled="form.suppliers.length === 0 || !isFormValid"
        class="px-6 py-2.5 bg-[var(--color-primary)] hover:opacity-90 text-white rounded-lg text-sm font-semibold shadow transition disabled:opacity-50 cursor-pointer"
      >
        Envoyer le bon de commande
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useProductsStore } from '@/store/modules/products.js';
import { useAuthStore } from '@/store/modules/auth.js';

const emit = defineEmits(['submit', 'cancel']);

const productsStore = useProductsStore();
const authStore = useAuthStore();

// List of all prospective suppliers/distributors in system except current user
const suppliersList = computed(() => {
  return authStore.users.filter(u => 
    (u.roles?.includes('distributor') || u.roles?.includes('vendor') || u.roles?.includes('supplier')) && 
    u.id !== authStore.user?.id
  );
});

const getProductsForSupplier = (supplierId) => {
  if (!supplierId) return [];
  return productsStore.products.filter(p => p.supplierId === supplierId);
};

const form = ref({
  date_livraison_souhaitee: '',
  shipping_mode: 'ROUTIER',
  payment_method: 'ESCROW',
  shipping_address: '',
  notes: '',
  suppliers: [
    {
      supplier_id: '',
      items: [
        {
          product_id: '',
          name: '',
          quantity: 1,
          unit_price: 0,
          total: 0
        }
      ]
    }
  ]
});

const isFormValid = computed(() => {
  return form.value.suppliers.every(s => 
    s.supplier_id && 
    s.items.length > 0 && 
    s.items.every(item => item.product_id && item.quantity > 0)
  );
});

const addSupplierGroup = () => {
  form.value.suppliers.push({
    supplier_id: '',
    items: [
      {
        product_id: '',
        name: '',
        quantity: 1,
        unit_price: 0,
        total: 0
      }
    ]
  });
};

const removeSupplierGroup = (gIdx) => {
  form.value.suppliers.splice(gIdx, 1);
};

const addItem = (gIdx) => {
  form.value.suppliers[gIdx].items.push({
    product_id: '',
    name: '',
    quantity: 1,
    unit_price: 0,
    total: 0
  });
};

const removeItem = (gIdx, idx) => {
  form.value.suppliers[gIdx].items.splice(idx, 1);
  if (form.value.suppliers[gIdx].items.length === 0) {
    removeSupplierGroup(gIdx);
  }
};

const onSupplierChange = (gIdx) => {
  const group = form.value.suppliers[gIdx];
  group.items.forEach(item => {
    item.product_id = '';
    item.name = '';
    item.unit_price = 0;
    item.total = 0;
  });
};

const updateProductDetails = (gIdx, idx) => {
  const group = form.value.suppliers[gIdx];
  const item = group.items[idx];
  const prod = productsStore.products.find(p => p.id === item.product_id);
  if (prod) {
    item.name = prod.name;
    item.unit_price = prod.price;
    calculateRowTotal(gIdx, idx);
  }
};

const calculateRowTotal = (gIdx, idx) => {
  const group = form.value.suppliers[gIdx];
  const item = group.items[idx];
  item.total = (item.quantity || 0) * (item.unit_price || 0);
};

const grandTotal = computed(() => {
  return form.value.suppliers.reduce((sum, group) => {
    return sum + group.items.reduce((gSum, item) => gSum + (item.total || 0), 0);
  }, 0);
});

const submitForm = () => {
  const flatProducts = [];
  form.value.suppliers.forEach(s => {
    s.items.forEach(item => {
      if (s.supplier_id && item.product_id && item.quantity > 0) {
        flatProducts.push({
          supplier_id: s.supplier_id,
          product_id: item.product_id,
          name: item.name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total: item.total
        });
      }
    });
  });

  emit('submit', {
    date_livraison_souhaitee: form.value.date_livraison_souhaitee,
    shipping_mode: form.value.shipping_mode,
    payment_method: form.value.payment_method,
    shipping_address: form.value.shipping_address,
    notes: form.value.notes,
    products: flatProducts
  });
};

const formatMoney = (amount) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(amount).replace('XAF', 'FCFA');
};
</script>
