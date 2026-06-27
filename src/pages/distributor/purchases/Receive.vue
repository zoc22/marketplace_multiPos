<template>
  <div class="space-y-6" v-if="deliveryNote">
    <!-- Breadcrumb & Header -->
    <div class="flex items-center space-x-3 mb-2">
      <router-link to="/distributor/purchases" class="p-2 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition">
        <ArrowLeftIcon class="h-4 w-4" />
      </router-link>
      <div class="flex items-center space-x-2 text-sm text-[var(--color-text-secondary)] font-medium">
        <router-link to="/distributor/purchases" class="hover:text-[var(--color-primary)] transition">Approvisionnements</router-link>
        <ChevronRightIcon class="h-4 w-4 text-[var(--color-text-muted)]" />
        <span class="text-[var(--color-text-primary)] font-bold">Réception Bon de livraison #{{ deliveryNote.reference }}</span>
      </div>
    </div>

    <!-- Main Container -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm space-y-6">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Réception & Émargement Logistique</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">
          Vérifiez les quantités livrées par rapport aux quantités commandées et confirmez la réception pour intégration en stock.
        </p>
      </div>

      <!-- General Info -->
      <div class="grid grid-cols-2 gap-4 p-4 bg-[var(--color-surface-hover)] rounded-xl text-sm">
        <div>
          <span class="text-xs text-[var(--color-text-secondary)] block">Expéditeur</span>
          <span class="font-bold text-[var(--color-text-primary)]">{{ deliveryNote.emitter_id }}</span>
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
              <th class="p-4">Désignation</th>
              <th class="p-4">Lot FIFO</th>
              <th class="p-4 text-center">Quantité Expédiée</th>
              <th class="p-4 text-center">Quantité Reçue *</th>
              <th class="p-4 text-right">Statut</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr v-for="(item, idx) in verificationProducts" :key="idx" class="text-sm">
              <td class="p-4 font-bold text-[var(--color-text-primary)]">{{ item.name || `Produit #${item.product_id}` }}</td>
              <td class="p-4 font-mono text-xs text-[var(--color-text-secondary)]">{{ item.lot_number }}</td>
              <td class="p-4 text-center text-[var(--color-text-secondary)] font-medium">{{ item.quantity_delivered }}</td>
              <td class="p-4 text-center">
                <input 
                  type="number" 
                  v-model.number="item.quantity_received"
                  min="0"
                  :max="item.quantity_delivered"
                  required
                  class="w-24 bg-[var(--color-background)] border border-[var(--color-border)] rounded p-1 text-center font-bold text-[var(--color-text-primary)]"
                />
              </td>
              <td class="p-4 text-right">
                <span 
                  v-if="item.quantity_received === item.quantity_delivered"
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
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Observations / Litige éventuel</label>
          <input 
            type="text" 
            v-model="notes" 
            placeholder="Ex : 2 cartons endommagés lors du transport"
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
          :disabled="!signature"
          class="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-semibold shadow transition disabled:opacity-50"
        >
          CONFIRMER LA RÉCEPTION
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
import { useToast } from 'vue-toastification';
import { ArrowLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const ordersStore = useOrdersStore();

const deliveryNote = computed(() => {
  return ordersStore.deliveryNotes.find(n => n.id === route.params.id);
});

const verificationProducts = ref([]);
const signature = ref('');
const notes = ref('');

onMounted(() => {
  if (deliveryNote.value) {
    verificationProducts.value = deliveryNote.value.products.map(p => ({
      ...p,
      quantity_received: p.quantity_delivered
    }));
  }
});

const confirmReceipt = () => {
  if (!signature.value) {
    toast.error("Veuillez signer pour accuser réception.");
    return;
  }

  const dn = ordersStore.confirmDelivery(deliveryNote.value.id);
  if (dn) {
    dn.receiver_signature = signature.value;
    dn.notes = notes.value;
    
    toast.success("Réception logistique confirmée ! Les stocks ont été intégrés en mode FIFO.");
    router.push('/distributor/purchases');
  }
};

const onCancel = () => {
  router.push('/distributor/purchases');
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
