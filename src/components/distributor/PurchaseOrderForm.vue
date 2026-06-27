<template>
  <form @submit.prevent="submitForm" class="space-y-6">
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm space-y-4">
      <h3 class="text-md font-bold text-[var(--color-text-primary)]">Informations de livraison & Destinataire</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Receiver Distributor -->
        <div>
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Distributeur destinataire *</label>
          <select 
            v-model="form.receiver_id" 
            required 
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text-primary)]"
          >
            <option value="" disabled>Sélectionner un distributeur</option>
            <option v-for="d in distributorsList" :key="d.id" :value="d.id">
              {{ d.name }} - {{ d.city }}
            </option>
          </select>
        </div>

        <!-- Date de livraison souhaitée -->
        <div>
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Date de livraison souhaitée</label>
          <input 
            type="date" 
            v-model="form.date_livraison_souhaitee"
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

    <!-- Product Selection Section -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm space-y-4">
      <h3 class="text-md font-bold text-[var(--color-text-primary)]">Produits & Quantités</h3>

      <div class="space-y-3">
        <div v-for="(item, idx) in form.products" :key="idx" class="flex flex-col md:flex-row md:items-end gap-3 p-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl relative">
          <!-- Selection du produit -->
          <div class="flex-1">
            <label class="block text-[10px] font-bold text-[var(--color-text-secondary)] uppercase mb-1">Produit *</label>
            <select 
              v-model="item.product_id" 
              required
              @change="updateProductDetails(idx)"
              class="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-lg p-2 text-sm text-[var(--color-text-primary)]"
            >
              <option value="" disabled>Sélectionner un produit</option>
              <option v-for="p in catalogProducts" :key="p.id" :value="p.id">
                {{ p.name }} ({{ formatMoney(p.price) }})
              </option>
            </select>
          </div>

          <!-- Quantité -->
          <div class="w-full md:w-32">
            <label class="block text-[10px] font-bold text-[var(--color-text-secondary)] uppercase mb-1">Quantité *</label>
            <input 
              type="number" 
              v-model.number="item.quantity" 
              min="1" 
              required
              @input="calculateRowTotal(idx)"
              class="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-lg p-2 text-sm text-center text-[var(--color-text-primary)]"
            />
          </div>

          <!-- Prix unitaire -->
          <div class="w-full md:w-32">
            <label class="block text-[10px] font-bold text-[var(--color-text-secondary)] uppercase mb-1">Prix Unit. (FCFA)</label>
            <input 
              type="number" 
              v-model.number="item.unit_price" 
              readonly
              class="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-2 text-sm text-right text-[var(--color-text-secondary)]"
            />
          </div>

          <!-- Total ligne -->
          <div class="w-full md:w-36 text-right">
            <span class="block text-[10px] font-bold text-[var(--color-text-secondary)] uppercase mb-1">Total ligne</span>
            <div class="p-2 font-bold text-sm text-[var(--color-text-primary)]">
              {{ formatMoney(item.total) }}
            </div>
          </div>

          <!-- Bouton retirer -->
          <button 
            type="button" 
            @click="removeItem(idx)"
            class="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition self-end md:self-auto"
          >
            <TrashIcon class="h-5 w-5" />
          </button>
        </div>
      </div>

      <div class="flex justify-between items-center pt-2">
        <button 
          type="button" 
          @click="addItem"
          class="px-4 py-2 border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-muted)] font-bold text-xs rounded-lg transition"
        >
          + Ajouter un produit
        </button>

        <div class="text-right">
          <span class="text-xs text-[var(--color-text-secondary)]">Total estimé</span>
          <div class="text-2xl font-black text-[var(--color-text-primary)]">{{ formatMoney(grandTotal) }}</div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-end space-x-3">
      <button 
        type="button" 
        @click="$emit('cancel')"
        class="px-5 py-2.5 border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] rounded-lg text-sm font-semibold transition"
      >
        Annuler
      </button>
      <button 
        type="submit" 
        :disabled="form.products.length === 0"
        class="px-6 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-lg text-sm font-semibold shadow transition disabled:opacity-50"
      >
        Envoyer le bon de commande
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue';
import { TrashIcon } from '@heroicons/vue/24/outline';
import { distributors, products as seedProducts } from '@/utils/seed_data.js';

const emit = defineEmits(['submit', 'cancel']);

const distributorsList = computed(() => distributors);

const catalogProducts = computed(() => seedProducts.slice(0, 30));

const form = ref({
  receiver_id: '',
  date_livraison_souhaitee: '',
  shipping_mode: 'ROUTIER',
  payment_method: 'ESCROW',
  shipping_address: '',
  notes: '',
  products: []
});

const addItem = () => {
  form.value.products.push({
    product_id: '',
    name: '',
    quantity: 1,
    unit_price: 0,
    total: 0
  });
};

const removeItem = (idx) => {
  form.value.products.splice(idx, 1);
};

const updateProductDetails = (idx) => {
  const row = form.value.products[idx];
  const prod = catalogProducts.value.find(p => p.id === row.product_id);
  if (prod) {
    row.name = prod.name;
    row.unit_price = prod.price;
    calculateRowTotal(idx);
  }
};

const calculateRowTotal = (idx) => {
  const row = form.value.products[idx];
  row.total = (row.quantity || 0) * (row.unit_price || 0);
};

const grandTotal = computed(() => {
  return form.value.products.reduce((sum, item) => sum + (item.total || 0), 0);
});

const submitForm = () => {
  emit('submit', {
    ...form.value,
    total: grandTotal.value
  });
};

const formatMoney = (amount) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(amount).replace('XAF', 'FCFA');
};
</script>
