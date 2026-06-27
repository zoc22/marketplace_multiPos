<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Bons de Livraison (Entrées d'Entrepôt B2B)</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Réceptionnez vos commandes industrielles et alimentez vos entrepôts de stockage.</p>
      </div>
      <button @click="openReceiveModal" class="px-4 py-2.5 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-xl text-sm font-semibold transition flex items-center space-x-2 shadow-sm">
        <PlusIcon class="h-5 w-5" />
        <span>Nouvelle Réception</span>
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
            placeholder="Rechercher par référence BL, PO, Fournisseur..." 
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
              <th class="p-4">Entrepôt de Réception</th>
              <th class="p-4">Date de réception</th>
              <th class="p-4 text-center">Articles Reçus</th>
              <th class="p-4 text-center">Statut</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr v-for="dn in paginatedNotes" :key="dn.id" class="hover:bg-[var(--color-surface-hover)]/40 transition text-sm">
              <td class="p-4 font-bold text-[var(--color-primary)] font-mono">{{ dn.id }}</td>
              <td class="p-4 font-mono text-[var(--color-text-secondary)]">#{{ dn.purchaseId }}</td>
              <td class="p-4 font-medium text-[var(--color-text-primary)]">{{ getSupplierName(dn.supplierId) }}</td>
              <td class="p-4 text-[var(--color-text-secondary)] font-medium">{{ getWarehouseName(dn.warehouseId) }}</td>
              <td class="p-4 text-[var(--color-text-secondary)]">{{ formatDate(dn.date) }}</td>
              <td class="p-4 text-center font-bold text-[var(--color-text-secondary)]">
                {{ dn.items.reduce((sum, i) => sum + i.qtyReceived, 0) }}
              </td>
              <td class="p-4 text-center">
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold border inline-block bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  Stock Mis à Jour
                </span>
              </td>
              <td class="p-4 text-right">
                <button @click="openBLDetails(dn)" class="p-1.5 bg-[var(--color-surface-elevated)] hover:bg-[var(--color-primary-muted)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] rounded-lg border border-[var(--color-border)] transition" title="Voir détails">
                  <EyeIcon class="h-4.5 w-4.5" />
                </button>
              </td>
            </tr>
            <tr v-if="paginatedNotes.length === 0">
              <td colspan="8" class="p-8 text-center text-[var(--color-text-muted)]">Aucun bon de livraison enregistré.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-4" v-if="filteredNotes.length > 0">
        <Pagination 
          :total-items="filteredNotes.length" 
          :page-size="itemsPerPage" 
          :current-page="currentPage" 
          @update:currentPage="currentPage = $event" 
        />
      </div>
    </div>

    <!-- Receive Inventory Modal -->
    <div v-if="isReceiveModalOpen" @click.self="isReceiveModalOpen = false" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm cursor-pointer">
      <div class="bg-[var(--color-surface)] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-[var(--color-border)] flex flex-col max-h-[90vh] cursor-default animate-in fade-in zoom-in-95 duration-200">
        <div class="p-6 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-surface-elevated)]">
          <h3 class="text-xl font-bold text-[var(--color-text-primary)]">Enregistrer une Réception Fournisseur</h3>
          <button @click="isReceiveModalOpen = false" class="text-[var(--color-text-muted)] hover:text-red-500"><XMarkIcon class="h-6 w-6"/></button>
        </div>

        <form @submit.prevent="saveDelivery" class="flex-1 overflow-y-auto p-6 space-y-4 bg-[var(--color-background)]">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Sélectionner le Bon de Commande (En cours) <span class="text-red-500">*</span></label>
              <select v-model="selectedPOId" @change="onPOSelected" required class="w-full p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)]">
                <option value="" disabled>-- Choisir une commande --</option>
                <option v-for="po in pendingPOs" :key="po.id" :value="po.id">{{ po.id }} | Fournisseur: {{ getSupplierName(po.supplierIds[0]) }} ({{ formatMoney(po.amount) }})</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Entrepôt de stockage <span class="text-red-500">*</span></label>
              <select v-model="selectedWarehouseId" required class="w-full p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)]">
                <option value="" disabled>-- Choisir l'entrepôt récepteur --</option>
                <option v-for="wh in activeWarehouses" :key="wh.id" :value="wh.id">{{ wh.name }} ({{ wh.zone || wh.location }})</option>
              </select>
            </div>
          </div>

          <div v-if="selectedPO" class="border-t border-[var(--color-border)] pt-4 space-y-3">
            <h4 class="font-bold text-xs uppercase text-[var(--color-text-secondary)] tracking-wider">Vérification des Quantités Reçues</h4>
            <div class="space-y-3">
              <div v-for="(item, idx) in deliveryFormItems" :key="idx" class="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl flex items-center justify-between">
                <div>
                  <div class="font-bold text-sm text-[var(--color-text-primary)]">{{ item.name }}</div>
                  <div class="text-xs text-[var(--color-text-secondary)]">Fournisseur : {{ getSupplierName(item.supplierId) }} | Attendu : <span class="font-bold">{{ item.expectedQuantity }}</span></div>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-xs font-semibold text-[var(--color-text-secondary)]">Reçu :</span>
                  <input type="number" v-model.number="item.receivedQuantity" min="0" :max="item.expectedQuantity" required class="w-20 p-1 bg-[var(--color-background)] border border-[var(--color-border)] rounded text-xs font-bold text-center text-[var(--color-text-primary)] font-mono" />
                </div>
              </div>
            </div>
          </div>

          <div class="pt-4 flex justify-end space-x-3" v-if="selectedPO">
            <button type="button" @click="isReceiveModalOpen = false" class="px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] text-sm rounded-lg hover:bg-[var(--color-surface-hover)]">Annuler</button>
            <button type="submit" class="px-5 py-2.5 bg-emerald-500 text-white font-bold text-sm rounded-lg hover:bg-emerald-600">Enregistrer l'Entrée Stock</button>
          </div>
        </form>
      </div>
    </div>

    <!-- BL Details Modal -->
    <div v-if="isDetailsModalOpen && selectedBL" @click.self="isDetailsModalOpen = false" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm cursor-pointer">
      <div class="bg-[var(--color-surface)] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-[var(--color-border)] flex flex-col cursor-default animate-in fade-in zoom-in-95 duration-200">
        <div class="p-6 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-surface-elevated)]">
          <div>
            <h3 class="text-xl font-bold text-[var(--color-text-primary)]">Bon de Livraison {{ selectedBL.id }}</h3>
            <p class="text-xs text-[var(--color-text-secondary)] mt-1">Fournisseur : {{ getSupplierName(selectedBL.supplierId) }}</p>
          </div>
          <button @click="isDetailsModalOpen = false" class="text-[var(--color-text-muted)] hover:text-red-500"><XMarkIcon class="h-6 w-6"/></button>
        </div>

        <div class="p-6 bg-[var(--color-background)] space-y-4">
          <div class="text-sm space-y-1 bg-[var(--color-surface)] p-3 border border-[var(--color-border)] rounded-xl">
            <div><span class="text-[var(--color-text-secondary)]">Date de réception :</span> <span class="font-bold">{{ formatDate(selectedBL.date) }}</span></div>
            <div><span class="text-[var(--color-text-secondary)]">Commandé via :</span> <span class="font-mono font-bold">#{{ selectedBL.purchaseId }}</span></div>
            <div><span class="text-[var(--color-text-secondary)]">Entrepôt de stockage :</span> <span class="font-bold">{{ getWarehouseName(selectedBL.warehouseId) }}</span></div>
            <div><span class="text-[var(--color-text-secondary)]">Réceptionné par :</span> <span class="font-medium">{{ selectedBL.receivedBy || 'Responsable Entrepôt' }}</span></div>
          </div>

          <h4 class="font-bold text-xs uppercase text-[var(--color-text-secondary)] tracking-wider">Articles Réceptionnés</h4>
          <div class="space-y-2">
            <div v-for="(item, idx) in selectedBL.items" :key="idx" class="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl flex justify-between items-center text-sm">
              <div>
                <div class="font-bold text-[var(--color-text-primary)]">{{ item.name }}</div>
                <div class="text-xs text-[var(--color-text-secondary)]">ID Produit : {{ item.productId || 'N/A' }}</div>
              </div>
              <div class="text-right">
                <span class="font-black text-emerald-500 block">+ {{ item.qtyReceived }} units</span>
                <span class="text-xs text-slate-400">sur {{ item.qtyExpected }} attendus</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { delivery_notes, purchases, b2b_suppliers, warehouses } from '@/utils/distributor_db.js';
import { PlusIcon, MagnifyingGlassIcon, EyeIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import Pagination from '@/components/Pagination.vue';
import { useToast } from 'vue-toastification';

const toast = useToast();

const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;

const filteredNotes = computed(() => {
  if (!searchQuery.value) return delivery_notes.value;
  const q = searchQuery.value.toLowerCase();
  return delivery_notes.value.filter(dn => 
    dn.id.toLowerCase().includes(q) || 
    dn.purchaseId.toLowerCase().includes(q) ||
    getSupplierName(dn.supplierId).toLowerCase().includes(q)
  );
});

const paginatedNotes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredNotes.value.slice(start, start + itemsPerPage);
});

watch(filteredNotes, () => {
  currentPage.value = 1;
});

function getSupplierName(supplierId) {
  const found = b2b_suppliers.value.find(s => s.id === supplierId);
  return found ? found.name : supplierId;
}

function getWarehouseName(warehouseId) {
  const found = warehouses.value.find(w => w.id === warehouseId);
  return found ? found.name : 'Dépôt Central';
}

function getWarehouseNameFromPO(po) {
  return warehouses.value[0]?.id || 'wh_1';
}

// Pending POs (status = Sent or In Transit)
const pendingPOs = computed(() => {
  return purchases.value.filter(po => po.status === 'Sent' || po.status === 'In Transit');
});

const activeWarehouses = computed(() => {
  return warehouses.value; // List of active warehouses
});

const isReceiveModalOpen = ref(false);
const selectedPOId = ref('');
const selectedPO = ref(null);
const selectedWarehouseId = ref('');
const deliveryFormItems = ref([]);

function openReceiveModal() {
  selectedPOId.value = '';
  selectedPO.value = null;
  selectedWarehouseId.value = activeWarehouses.value[0]?.id || '';
  deliveryFormItems.value = [];
  isReceiveModalOpen.value = true;
}

function onPOSelected() {
  const po = purchases.value.find(p => p.id === selectedPOId.value);
  if (po) {
    selectedPO.value = po;
    deliveryFormItems.value = po.items.map(item => ({
      name: item.name,
      productId: item.productId || 'N/A',
      expectedQuantity: item.qty,
      receivedQuantity: item.qty,
      supplierId: item.supplierId || po.supplierIds[0] || 'Unknown'
    }));
  }
}

function saveDelivery() {
  if (!selectedPO.value) return;

  const newDN = {
    id: 'dn_00' + (delivery_notes.value.length + 1),
    purchaseId: selectedPO.value.id,
    supplierId: selectedPO.value.supplierIds[0] || 'Unknown',
    date: new Date().toISOString().split('T')[0],
    receivedBy: 'Chef Magasinier Paul',
    status: 'Verified',
    warehouseId: selectedWarehouseId.value,
    items: deliveryFormItems.value.map(item => ({
      name: item.name,
      qtyExpected: item.expectedQuantity,
      qtyReceived: item.receivedQuantity
    }))
  };

  delivery_notes.value.unshift(newDN);

  // Update PO status to Received
  const po = purchases.value.find(p => p.id === selectedPO.value.id);
  if (po) po.status = 'Received';

  // Increment product stocks in the chosen warehouse inventory
  const wh = warehouses.value.find(w => w.id === selectedWarehouseId.value);
  if (wh) {
    deliveryFormItems.value.forEach(item => {
      const existing = wh.inventory.find(i => i.name === item.name);
      if (existing) {
        existing.stock += item.receivedQuantity;
        existing.value += (item.receivedQuantity * (item.unitPrice || 1000));
      } else {
        wh.inventory.push({
          id: 'prod_' + Math.floor(Math.random() * 1000 + 500),
          name: item.name,
          stock: item.receivedQuantity,
          value: item.receivedQuantity * 1000
        });
      }
    });
  }

  toast.success(`Livraison B2B réceptionnée. Stock de l'entrepôt mis à jour.`);
  isReceiveModalOpen.value = false;
}

const isDetailsModalOpen = ref(false);
const selectedBL = ref(null);

function openBLDetails(bl) {
  selectedBL.value = bl;
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
