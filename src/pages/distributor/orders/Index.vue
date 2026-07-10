<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Commandes Clients B2B</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Gerez les commandes passees par votre reseau de distributeurs secondaires ou de vendeurs.</p>
      </div>
      <div class="flex items-center space-x-3">
        <router-link to="/distributor/orders/delivery-notes" class="px-4 py-2 border border-[var(--color-border)] bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] rounded-lg text-sm font-semibold transition flex items-center space-x-2">
          <TruckIcon class="h-5 w-5" />
          <span>Bons de livraison emis</span>
        </router-link>
      </div>
    </div>

    <!-- Filters & Table -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
      <div class="p-4 border-b border-[var(--color-border)] flex flex-col sm:flex-row justify-between items-center gap-4 bg-[var(--color-surface-hover)]">
        <div class="relative w-full sm:w-96">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)]" />
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Rechercher par reference ou emetteur..." 
            class="w-full pl-10 pr-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text-primary)]"
          />
        </div>
        
        <div class="flex items-center space-x-3 w-full sm:w-auto">
          <select v-model="statusFilter" class="bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm focus:outline-none w-full sm:w-auto text-[var(--color-text-primary)]">
            <option value="ALL">Tous les statuts</option>
            <option value="PENDING">En attente (Pending)</option>
            <option value="VALIDATED">Valide (Validated)</option>
            <option value="REFUSED">Refuse (Refused)</option>
            <option value="PROCESSING">En preparation (Processing)</option>
            <option value="DELIVERED">Livre (Delivered)</option>
            <option value="CANCELLED">Annule (Cancelled)</option>
          </select>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[var(--color-surface-hover)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)]">
              <th class="p-4">Reference</th>
              <th class="p-4">Emetteur</th>
              <th class="p-4">Date Emission</th>
              <th class="p-4 text-center">Produits</th>
              <th class="p-4 text-right">Montant</th>
              <th class="p-4 text-center">Statut</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr v-for="o in paginatedOrders" :key="o.id" class="hover:bg-[var(--color-surface-hover)] transition text-sm">
              <td class="p-4 font-bold text-[var(--color-primary)]">
                #{{ o.reference }}
              </td>
              <td class="p-4">
                <span class="font-bold text-[var(--color-text-primary)]">{{ o.emitter_id }}</span>
                <span class="text-xs text-[var(--color-text-secondary)] block">({{ o.emitter_type }})</span>
              </td>
              <td class="p-4 text-[var(--color-text-secondary)]">
                {{ formatDate(o.date_emission) }}
              </td>
              <td class="p-4 text-center text-[var(--color-text-secondary)] font-medium">
                {{ o.products?.length || 0 }}
              </td>
              <td class="p-4 text-right font-bold text-[var(--color-text-primary)]">
                {{ formatMoney(o.total) }}
              </td>
              <td class="p-4 text-center">
                <span 
                  class="px-2.5 py-1 rounded-full text-xs font-bold border inline-block"
                  :class="{
                    'bg-amber-500/10 text-amber-500 border-amber-500/20': o.status === 'PENDING',
                    'bg-emerald-500/10 text-emerald-500 border-emerald-500/20': o.status === 'VALIDATED' || o.status === 'DELIVERED',
                    'bg-red-500/10 text-red-500 border-red-500/20': o.status === 'REFUSED' || o.status === 'CANCELLED',
                    'bg-blue-500/10 text-blue-500 border-blue-500/20': o.status === 'PROCESSING'
                  }"
                >
                  {{ o.status }}
                </span>
              </td>
              <td class="p-4 text-right">
                <div class="flex justify-end space-x-2">
                  <router-link :to="`/distributor/orders/${o.id}`" class="p-2 inline-flex items-center justify-center bg-[var(--color-surface-elevated)] hover:bg-[var(--color-primary-muted)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] rounded-lg transition border border-[var(--color-border)]">
                    <EyeIcon class="h-4 w-4" />
                  </router-link>
                  <button 
                    v-if="o.status === 'PENDING'"
                    @click="validateOrder(o.id)" 
                    class="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-lg transition border border-emerald-500/20"
                    title="Valider la commande"
                  >
                    <CheckIcon class="h-4 w-4" />
                  </button>
                  <button 
                    v-if="o.status === 'PENDING'"
                    @click="refuseOrder(o.id)" 
                    class="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition border border-red-500/20"
                    title="Refuser la commande"
                  >
                    <XMarkIcon class="h-4 w-4" />
                  </button>
                  <router-link 
                    v-if="o.status === 'VALIDATED'"
                    :to="`/distributor/orders/${o.id}/prepare`" 
                    class="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-lg transition border border-blue-500/20"
                    title="Preparer la livraison"
                  >
                    <ArchiveBoxArrowDownIcon class="h-4 w-4" />
                  </router-link>
                </div>
              </td>
            </tr>
            <tr v-if="paginatedOrders.length === 0">
              <td colspan="7" class="p-8 text-center text-[var(--color-text-muted)]">
                Aucun bon de commande recu.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="p-4" v-if="filteredOrders.length > itemsPerPage">
        <Pagination 
          :total-items="filteredOrders.length" 
          :page-size="itemsPerPage" 
          :current-page="currentPage" 
          @update:currentPage="currentPage = $event" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useOrdersStore } from '@/store/modules/orders.js';
import { useToast } from 'vue-toastification';
import { 
  MagnifyingGlassIcon, EyeIcon, CheckIcon, XMarkIcon, 
  ArchiveBoxArrowDownIcon, TruckIcon
} from '@heroicons/vue/24/outline';
import Pagination from '@/components/Pagination.vue';

import { useAuthStore } from '@/store/modules/auth.js';

const authStore = useAuthStore();
const ordersStore = useOrdersStore();
const toast = useToast();

const searchQuery = ref('');
const statusFilter = ref('ALL');
const currentPage = ref(1);
const itemsPerPage = 10;

onMounted(() => {
  if (ordersStore.purchaseOrders.length === 0) {
    ordersStore.createPurchaseOrder({
      reference: 'BC-54219',
      emitter_id: 'dist_2',
      emitter_type: 'distributor',
      receiver_id: 'dist_1',
      receiver_type: 'distributor',
      status: 'PENDING',
      products: [
        { product_id: 'prod_1', name: 'Sac de Cacao Premium', quantity: 200, unit_price: 15000, total: 3000000 },
        { product_id: 'prod_5', name: 'Engrais Organique NPK', quantity: 50, unit_price: 25000, total: 1250000 }
      ],
      shipping_address: 'Bastos, Yaounde',
      shipping_mode: 'ROUTIER'
    });

    ordersStore.createPurchaseOrder({
      reference: 'BC-78902',
      emitter_id: 'vendor_1',
      emitter_type: 'vendor',
      receiver_id: 'dist_1',
      receiver_type: 'distributor',
      status: 'VALIDATED',
      products: [
        { product_id: 'prod_3', name: 'Pompe Solaire MPPT', quantity: 5, unit_price: 320000, total: 1600000 }
      ],
      shipping_address: 'Marche central, Douala',
      shipping_mode: 'ROUTIER'
    });
  }
});

const filteredOrders = computed(() => {
  return ordersStore.purchaseOrders.filter(o => {
    const isDestined = o.receiver_id === authStore.user?.id || o.receiver_id === authStore.user?.tenant;
    const matchStatus = statusFilter.value === 'ALL' || o.status === statusFilter.value;
    const searchLow = searchQuery.value.toLowerCase();
    const matchSearch = o.reference.toLowerCase().includes(searchLow) || 
                        o.emitter_id.toLowerCase().includes(searchLow) ||
                        o.emitter_type.toLowerCase().includes(searchLow);
    return isDestined && matchStatus && matchSearch;
  });
});

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredOrders.value.slice(start, start + itemsPerPage);
});

const validateOrder = (id) => {
  ordersStore.validatePurchaseOrder(id);
  toast.success('Le bon de commande a ete valide !');
};

const refuseOrder = (id) => {
  ordersStore.refusePurchaseOrder(id);
  toast.error('Le bon de commande a ete refuse.');
};

const formatDate = (dateVal) => {
  if (!dateVal) return 'N/A';
  return new Date(dateVal).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatMoney = (val) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('XAF', 'FCFA');
};
</script>
