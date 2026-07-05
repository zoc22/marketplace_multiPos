<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Bons de Livraison (Réceptions)</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Réceptionnez vos commandes fournisseurs pour mettre à jour vos stocks.</p>
      </div>
      <button @click="openReceiveModal" class="px-4 py-2.5 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-xl text-sm font-semibold transition flex items-center space-x-2 shadow-sm">
        <PlusIcon class="h-5 w-5" />
        <span>Réceptionner marchandise</span>
      </button>
    </div>

    <!-- Table Card -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
      <div class="p-4 border-b border-[var(--color-border)] flex flex-col sm:flex-row justify-between items-center gap-4 bg-[var(--color-surface-hover)]">
        <div class="relative w-full sm:w-96">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)]" />
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Rechercher par référence, PO..." 
            class="w-full pl-10 pr-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)]"
          />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="bg-[var(--color-surface-hover)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)]">
              <th class="p-4">Réf BL</th>
              <th class="p-4">Lié au PO</th>
              <th class="p-4">Fournisseur</th>
              <th class="p-4">Date de réception</th>
              <th class="p-4 text-center">Articles reçus</th>
              <th class="p-4 text-center">Statut</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr v-for="del in paginatedDeliveries" :key="del.id" class="hover:bg-[var(--color-surface-hover)]/40 transition text-sm">
              <td class="p-4 font-bold text-[var(--color-primary)] font-mono">{{ del.id }}</td>
              <td class="p-4 font-mono text-[var(--color-text-secondary)]">{{ del.purchaseId }}</td>
              <td class="p-4 font-medium text-[var(--color-text-primary)]">{{ getSupplierName(del.supplierId) }}</td>
              <td class="p-4 text-[var(--color-text-secondary)]">{{ formatDate(del.date) }}</td>
              <td class="p-4 text-center font-bold text-[var(--color-text-secondary)]">
                {{ del.items.reduce((sum, i) => sum + i.receivedQuantity, 0) }}
              </td>
              <td class="p-4 text-center">
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold border inline-block bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  Stock Intégré
                </span>
              </td>
              <td class="p-4 text-right">
                <button @click="openDelDetails(del)" class="p-1.5 bg-[var(--color-surface-elevated)] hover:bg-[var(--color-primary-muted)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] rounded-lg border border-[var(--color-border)] transition" title="Voir détails">
                  <EyeIcon class="h-4 w-4" />
                </button>
              </td>
            </tr>
            <tr v-if="paginatedDeliveries.length === 0">
              <td colspan="7" class="p-8 text-center text-[var(--color-text-muted)]">Aucun bon de livraison trouvé.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-4" v-if="filteredDeliveries.length > 0">
        <Pagination 
          :total-items="filteredDeliveries.length" 
          :page-size="itemsPerPage" 
          :current-page="currentPage" 
          @update:currentPage="currentPage = $event" 
        />
      </div>
    </div>

    <!-- Receive Inventory Modal -->
    <div v-if="isReceiveModalOpen" @click.self="isReceiveModalOpen = false" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm cursor-pointer">
      <div class="bg-[var(--color-surface)] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-[var(--color-border)] flex flex-col max-h-[90vh] cursor-default">
        <div class="p-6 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-surface-elevated)]">
          <h3 class="text-xl font-bold text-[var(--color-text-primary)]">Réceptionner Marchandise</h3>
          <button @click="isReceiveModalOpen = false" class="text-[var(--color-text-muted)] hover:text-red-500"><XMarkIcon class="h-6 w-6"/></button>
        </div>

        <form @submit.prevent="saveDelivery" class="flex-1 overflow-y-auto p-6 space-y-4 bg-[var(--color-background)]">
          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Sélectionner le Bon de Commande (Sent) <span class="text-red-500">*</span></label>
            <select v-model="selectedPOId" @change="onPOSelected" required class="w-full p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)]">
              <option value="" disabled>-- Choisir une commande en cours --</option>
              <option v-for="po in pendingPOs" :key="po.id" :value="po.id">{{ po.id }} | {{ getSupplierName(po.supplierId) }} (Total: {{ formatMoney(po.total) }})</option>
            </select>
          </div>

          <div v-if="selectedPO" class="border-t border-[var(--color-border)] pt-4 space-y-3">
            <h4 class="font-bold text-xs uppercase text-[var(--color-text-secondary)] tracking-wider">Quantités reçues</h4>
            <div class="space-y-3">
              <div v-for="(item, idx) in deliveryFormItems" :key="idx" class="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl flex items-center justify-between">
                <div>
                  <div class="font-bold text-sm text-[var(--color-text-primary)]">{{ getProductName(item.productId) }}</div>
                  <div class="text-xs text-[var(--color-text-secondary)]">Attendu : {{ item.expectedQuantity }}</div>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-xs font-semibold text-[var(--color-text-secondary)]">Reçu :</span>
                  <input type="number" v-model.number="item.receivedQuantity" min="0" :max="item.expectedQuantity" required class="w-20 p-1 bg-[var(--color-background)] border border-[var(--color-border)] rounded text-xs font-bold text-center" />
                </div>
              </div>
            </div>
          </div>

          <div class="pt-4 flex justify-end space-x-3" v-if="selectedPO">
            <button type="button" @click="isReceiveModalOpen = false" class="px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] text-sm rounded-lg hover:bg-[var(--color-surface-hover)]">Annuler</button>
            <button type="submit" class="px-5 py-2.5 bg-emerald-500 text-white font-bold text-sm rounded-lg hover:bg-emerald-600">Confirmer la réception (Intégrer Stock)</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delivery Details Modal -->
    <div v-if="isDetailsModalOpen && selectedDelivery" @click.self="isDetailsModalOpen = false" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm cursor-pointer">
      <div class="bg-[var(--color-surface)] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-[var(--color-border)] flex flex-col cursor-default">
        <div class="p-6 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-surface-elevated)]">
          <div>
            <h3 class="text-xl font-bold text-[var(--color-text-primary)]">Bon de Livraison {{ selectedDelivery.id }}</h3>
            <p class="text-xs text-[var(--color-text-secondary)] mt-1">Fournisseur : {{ getSupplierName(selectedDelivery.supplierId) }}</p>
          </div>
          <div class="flex items-center space-x-2">
            <button @click="printDelivery" class="p-2 bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-lg transition cursor-pointer" title="Imprimer le bon">
              <PrinterIcon class="h-5 w-5" />
            </button>
            <button @click="isDetailsModalOpen = false" class="text-[var(--color-text-muted)] hover:text-red-500 cursor-pointer">
              <XMarkIcon class="h-6 w-6"/>
            </button>
          </div>
        </div>

        <div class="p-6 bg-[var(--color-background)] space-y-4 overflow-y-auto max-h-[70vh]" id="printable-delivery-sheet">
          <div class="grid grid-cols-2 gap-4 text-sm bg-[var(--color-surface)] p-4 border border-[var(--color-border)] rounded-xl">
            <div>
              <span class="text-xs text-[var(--color-text-secondary)] block">Date de réception :</span> 
              <span class="font-bold text-[var(--color-text-primary)]">{{ formatDate(selectedDelivery.date) }}</span>
            </div>
            <div>
              <span class="text-xs text-[var(--color-text-secondary)] block">Bon de Commande lié :</span> 
              <router-link :to="'/vendor/purchases/' + selectedDelivery.purchaseId" class="text-[var(--color-primary)] hover:underline font-mono font-bold">
                #{{ selectedDelivery.purchaseId }}
              </router-link>
            </div>
          </div>

          <h4 class="font-bold text-xs uppercase text-[var(--color-text-secondary)] tracking-wider">Articles Réceptionnés</h4>
          <div class="border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-surface)]">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="bg-[var(--color-surface-hover)] font-bold text-[var(--color-text-secondary)] border-b border-[var(--color-border)]">
                  <th class="p-3">Désignation</th>
                  <th class="p-3 text-center">Attendu</th>
                  <th class="p-3 text-center">Reçu</th>
                  <th class="p-3 text-center">Écart</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[var(--color-border)]">
                <tr v-for="(item, idx) in selectedDelivery.items" :key="idx" class="text-[var(--color-text-primary)]">
                  <td class="p-3 font-semibold">
                    <div>{{ getProductName(item.productId) }}</div>
                    <div class="text-[10px] text-[var(--color-text-muted)] font-mono">{{ item.productId }}</div>
                  </td>
                  <td class="p-3 text-center font-bold">{{ item.expectedQuantity }}</td>
                  <td class="p-3 text-center font-bold text-emerald-500">{{ item.receivedQuantity }}</td>
                  <td class="p-3 text-center font-bold" :class="item.receivedQuantity - item.expectedQuantity < 0 ? 'text-red-500' : 'text-slate-400'">
                    {{ item.receivedQuantity - item.expectedQuantity }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { b2b_deliveries, b2b_purchases, b2b_suppliers, products } from '@/utils/vendor_db.js';
import { PlusIcon, MagnifyingGlassIcon, EyeIcon, XMarkIcon, PrinterIcon } from '@heroicons/vue/24/outline';
import Pagination from '@/components/Pagination.vue';
import { useToast } from 'vue-toastification';

const toast = useToast();

function printDelivery() {
  window.print();
}

const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 8;

const filteredDeliveries = computed(() => {
  if (!searchQuery.value) return b2b_deliveries.value;
  const q = searchQuery.value.toLowerCase();
  return b2b_deliveries.value.filter(d => 
    d.id.toLowerCase().includes(q) || 
    d.purchaseId.toLowerCase().includes(q) ||
    getSupplierName(d.supplierId).toLowerCase().includes(q)
  );
});

const paginatedDeliveries = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredDeliveries.value.slice(start, start + itemsPerPage);
});

watch(filteredDeliveries, () => {
  currentPage.value = 1;
});

function getSupplierName(supplierId) {
  const found = b2b_suppliers.value.find(s => s.id === supplierId);
  return found ? found.name : supplierId;
}

function getProductName(productId) {
  const found = products.value.find(p => p.id === productId);
  return found ? found.name : productId;
}

// Pending POs (status = Sent)
const pendingPOs = computed(() => {
  return b2b_purchases.value.filter(po => po.status === 'Sent');
});

const isReceiveModalOpen = ref(false);
const selectedPOId = ref('');
const selectedPO = ref(null);
const deliveryFormItems = ref([]);

function openReceiveModal() {
  selectedPOId.value = '';
  selectedPO.value = null;
  deliveryFormItems.value = [];
  isReceiveModalOpen.value = true;
}

function onPOSelected() {
  const po = b2b_purchases.value.find(p => p.id === selectedPOId.value);
  if (po) {
    selectedPO.value = po;
    deliveryFormItems.value = po.items.map(item => ({
      productId: item.productId,
      expectedQuantity: item.quantity,
      receivedQuantity: item.quantity
    }));
  }
}

function saveDelivery() {
  if (!selectedPO.value) return;

  const newDelivery = {
    id: 'DEL-00' + (b2b_deliveries.value.length + 1),
    purchaseId: selectedPO.value.id,
    supplierId: selectedPO.value.supplierId,
    date: new Date().toISOString().split('T')[0],
    status: 'Completed',
    items: JSON.parse(JSON.stringify(deliveryFormItems.value))
  };

  b2b_deliveries.value.unshift(newDelivery);

  // Update PO status to Received
  const po = b2b_purchases.value.find(p => p.id === selectedPO.value.id);
  if (po) po.status = 'Received';

  // Increment product stock
  deliveryFormItems.value.forEach(item => {
    const prod = products.value.find(p => p.id === item.productId);
    if (prod) {
      prod.stock += item.receivedQuantity;
    }
  });

  toast.success(`Livraison réceptionnée. Stock incrémenté.`);
  isReceiveModalOpen.value = false;
}

const isDetailsModalOpen = ref(false);
const selectedDelivery = ref(null);

function openDelDetails(del) {
  selectedDelivery.value = del;
  isDetailsModalOpen.value = true;
}

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val || 0).replace('XAF', 'FCFA');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR');
}
</script>
