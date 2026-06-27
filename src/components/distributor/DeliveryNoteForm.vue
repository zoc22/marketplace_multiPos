<template>
  <form @submit.prevent="submitForm" class="space-y-6">
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm space-y-4">
      <h3 class="text-md font-bold text-[var(--color-text-primary)]">Informations d'expédition & Transport</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Transporteur -->
        <div>
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Transporteur *</label>
          <input 
            type="text" 
            v-model="form.carrier" 
            placeholder="Ex : Bolloré, DHL, Transport Local..."
            required
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text-primary)]"
          />
        </div>

        <!-- Numéro de suivi -->
        <div>
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Numéro de suivi / Tracker</label>
          <input 
            type="text" 
            v-model="form.tracking_number" 
            placeholder="Ex : TRK-89278-X"
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

        <!-- Date de livraison prévue -->
        <div>
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Date de livraison prévue</label>
          <input 
            type="date" 
            v-model="form.date_livraison" 
            required
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text-primary)]"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Preuve photo (Simulée) -->
        <div>
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Preuve de Chargement (URL Photo)</label>
          <input 
            type="text" 
            v-model="form.photo_proof" 
            placeholder="Ex : https://images.unsplash.com/... ou laissez vide"
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text-primary)]"
          />
        </div>

        <!-- Signature -->
        <div>
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Signature du chargeur / Chauffeur</label>
          <input 
            type="text" 
            v-model="form.signature" 
            placeholder="Ex : Paul Biya - Chauffeur"
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text-primary)]"
          />
        </div>
      </div>
    </div>

    <!-- Product Table and Quantity Check -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm overflow-hidden space-y-4">
      <h3 class="text-md font-bold text-[var(--color-text-primary)]">Quantités expédiées & Lots FIFO</h3>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-[var(--color-surface-hover)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)]">
              <th class="p-3">Produit</th>
              <th class="p-3 text-center">Quantité Commandée</th>
              <th class="p-3 text-center">Quantité Réelle Expédiée *</th>
              <th class="p-3">Numéro de Lot FIFO *</th>
              <th class="p-3 text-right">Prix Unit.</th>
              <th class="p-3 text-right">Total HT</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr v-for="(item, idx) in form.products" :key="idx" class="text-sm">
              <td class="p-3 font-bold text-[var(--color-text-primary)]">{{ item.name }}</td>
              <td class="p-3 text-center font-medium text-[var(--color-text-secondary)]">{{ item.quantity_ordered }}</td>
              <td class="p-3 text-center">
                <input 
                  type="number" 
                  v-model.number="item.quantity_delivered"
                  min="0"
                  :max="item.quantity_ordered"
                  required
                  @input="calculateRowTotal(idx)"
                  class="w-20 bg-[var(--color-background)] border border-[var(--color-border)] rounded p-1 text-center font-bold text-[var(--color-text-primary)]"
                />
              </td>
              <td class="p-3">
                <input 
                  type="text" 
                  v-model="item.lot_number"
                  placeholder="Ex : LOT-FIFO-01"
                  required
                  class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded p-1 text-sm text-[var(--color-text-primary)]"
                />
              </td>
              <td class="p-3 text-right text-[var(--color-text-secondary)]">{{ formatMoney(item.unit_price) }}</td>
              <td class="p-3 text-right font-bold text-[var(--color-text-primary)]">{{ formatMoney(item.total) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="text-right pt-4 border-t border-[var(--color-border)]">
        <span class="text-xs text-[var(--color-text-secondary)]">Total Livraison</span>
        <div class="text-xl font-black text-[var(--color-text-primary)]">{{ formatMoney(grandTotal) }}</div>
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
        class="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold shadow transition"
      >
        Générer le bon de livraison
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  purchaseOrder: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['submit', 'cancel']);

const form = ref({
  carrier: '',
  tracking_number: '',
  shipping_mode: props.purchaseOrder.shipping_mode || 'ROUTIER',
  date_livraison: '',
  photo_proof: '',
  signature: '',
  products: props.purchaseOrder.products.map(p => ({
    product_id: p.product_id,
    name: p.name || `Produit #${p.product_id}`,
    quantity_ordered: p.quantity,
    quantity_delivered: p.quantity,
    lot_number: `LOT-FIFO-${Date.now().toString().slice(-4)}`,
    unit_price: p.unit_price,
    total: p.quantity * p.unit_price
  }))
});

const calculateRowTotal = (idx) => {
  const row = form.value.products[idx];
  row.total = (row.quantity_delivered || 0) * (row.unit_price || 0);
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
