<template>
  <div class="space-y-6 max-w-6xl mx-auto" id="warehouse-preparation-workspace">
    <!-- LAYOUT HEADER -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
      <div class="space-y-1">
        <router-link :to="'/supplier/orders/' + orderId" class="text-xs text-indigo-400 font-mono hover:underline flex items-center space-x-1">
          <span>&larr;</span>
          <span>Retourner au contrat d'expédition</span>
        </router-link>
        <h1 class="text-lg font-bold text-slate-100 flex items-center space-x-2">
          <span>Module Emballage &amp; Colisage Entrepôt</span>
          <span class="text-indigo-400 font-mono text-sm">#{{ order?.reference }}</span>
        </h1>
      </div>
      <div>
        <span class="px-3 py-1 bg-pink-950/20 text-pink-400 border border-pink-900/40 rounded-full font-mono text-xs uppercase font-bold animate-pulse">
          Règle Active: FIFO (First In, First Out) Lot picking
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- FIFO LINEAR PROCESSING SECTION (LEFT 2 COLS) -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- MAIN INVENTORY COMPLIANCE MATCHER -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div class="flex items-center justify-between border-b border-slate-850 pb-4">
            <div>
              <h3 class="text-sm font-bold text-slate-200">Prélèvement Sequencé de Stocks</h3>
              <p class="text-[10px] text-slate-400">Le système affecte en priorité les lots de fabrication les plus anciens dispo en magasin.</p>
            </div>
            <span class="text-[9.5px] font-mono text-slate-500 uppercase">Aiguillé par: Sourcing Stancl Tenant</span>
          </div>

          <!-- WAREHOUSE HUB UNIT SELECTOR -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/45 p-4 rounded-xl border border-slate-850">
            <label class="block">
              <span class="block text-[9px] uppercase font-mono tracking-wider text-indigo-400 font-bold mb-1">Entrepôt de Retrait Physique</span>
              <select 
                v-model="selectedWarehouseId"
                class="w-full bg-[#070b1a] border border-indigo-900 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                id="select-wh-source"
              >
                <option 
                  v-for="wh in warehouses" 
                  :key="wh.id" 
                  :value="wh.id"
                >
                  🏢 Depot {{ wh.name }} ({{ wh.location }})
                </option>
              </select>
            </label>

            <div class="flex flex-col justify-end text-[10px] font-mono text-slate-450 space-y-1">
              <div class="flex justify-between">
                <span>Capacité Totale:</span>
                <span class="text-slate-200 font-bold">500 000 Unités</span>
              </div>
              <div class="flex justify-between">
                <span>Taux de Remplissage:</span>
                <span class="text-emerald-400 font-bold">42 % (Atmosphère gérée)</span>
              </div>
              <div class="flex justify-between">
                <span>Température Humide:</span>
                <span class="text-sky-400 font-bold">18°C ~ Constante</span>
              </div>
            </div>
          </div>

          <!-- PRODUCT LIST AND CORRESPONDING FIFO BATCH TIMINGS/PRESELECTION -->
          <div class="space-y-4">
            <h4 class="text-xs uppercase font-mono tracking-wider text-slate-350 font-bold">Articles et Lots Affectés</h4>
            
            <div 
              v-for="(item, index) in orderItemsWithBatches" 
              :key="item.productId || index"
              class="border border-slate-850 rounded-xl p-4 bg-[#080d1e]/90 space-y-4"
              :id="'prepare-item-' + item.productId"
            >
              <!-- Info block -->
              <div class="flex justify-between items-start">
                <div>
                  <span class="text-[9px] font-mono text-indigo-400 uppercase font-bold">{{ item.sku }}</span>
                  <h5 class="text-xs font-bold text-slate-200 mt-0.5 leading-tight">{{ item.productName }}</h5>
                  <p class="text-[10px] text-slate-500 mt-0.5">Quantité requise au contrat: <strong>{{ item.quantity }} unité(s)</strong></p>
                </div>

                <!-- Total general stock badge -->
                <span class="px-2 py-0.5 bg-slate-950 text-slate-350 rounded border border-slate-805 text-[10px] font-mono">
                  Stock Général: {{ item.totalStock }}
                </span>
              </div>

              <!-- Lots / Batches FIFO Sequence Visualizer -->
              <div class="space-y-2">
                <span class="block text-[8.5px] uppercase font-mono text-slate-450 tracking-wider">Séquencement Chronologique des Lots de Fabrication:</span>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
                  <div 
                    v-for="(b, idx) in item.batches" 
                    :key="b.id"
                    class="border rounded-lg p-2.5 flex flex-col justify-between"
                    :class="b.qtyPick > 0 ? 'bg-indigo-950/20 border-indigo-500' : 'bg-slate-950/40 border-slate-850Opacity opacity-40'"
                  >
                    <div class="flex justify-between font-bold text-[9px]">
                      <span class="text-indigo-400">LOT: {{ b.id }}</span>
                      <span class="text-slate-500">Date: {{ b.date }}</span>
                    </div>
                    
                    <div class="flex justify-between items-baseline mt-2 text-xs">
                      <span class="text-[10px] text-slate-450">Solde dispo: <strong>{{ b.qty }}</strong></span>
                      <span v-if="b.qtyPick > 0" class="text-xs font-black text-emerald-400 font-mono">
                        PRÉLEVÉ: -{{ b.qtyPick }}
                      </span>
                    </div>

                    <!-- Highlight the FIFO rule indicator -->
                    <div v-if="b.qtyPick > 0 && idx === 0" class="mt-1.5 text-[7.5px] font-bold text-center bg-indigo-950 text-indigo-300 py-0.5 rounded border border-indigo-900/40 uppercase">
                      Prélèvement Prioritaire (Lot plus Ancien)
                    </div>
                  </div>
                </div>
              </div>

              <!-- Checking inventory solver confirmation block -->
              <div 
                v-if="item.insufficient"
                class="p-2.5 bg-red-950/30 border border-red-900/40 rounded-lg text-center text-red-400 text-[10.5px]"
              >
                ⚠ Stock insuffisant dans les lots actifs pour honorer cette commande !
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- PACKAGING ACTIONS & BL PREPARATION (RIGHT COLUMN) -->
      <div class="space-y-6">
        
        <!-- STATUS ACTION BOARD -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 class="text-xs uppercase font-mono tracking-wider text-indigo-405 font-bold">Indicateurs de Colisage</h3>
          
          <div class="p-4 bg-slate-950/90 border border-slate-855 rounded-xl text-center space-y-2">
            <span class="text-slate-550 uppercase text-[9.2px] font-mono block">Remplissage colis</span>
            <div class="h-2 w-full bg-slate-850 rounded-full overflow-hidden">
              <div class="h-full bg-pink-500 rounded-full" :style="{ width: isPrepared ? '100%' : '35%' }"></div>
            </div>
            <span class="font-mono text-slate-205 font-bold text-xs">{{ isPrepared ? '100% Emballé' : 'Veuillez lancer la pré-affectation' }}</span>
          </div>

          <p class="text-[10px] text-slate-400 leading-relaxed font-sans">
            En validant le colisage, le système effectue les opérations comptables immédiates de soustraction de stock sur les lots physiques, génère le document d'expédition <strong>Bon de Livraison (Waybill)</strong>, et bascule la commande au niveau logistique supérieur.
          </p>

          <button 
            @click="validateFIFOPreparation"
            :disabled="hasInsufficientStock || isPrepared"
            class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-mono font-bold uppercase rounded-xl text-xs tracking-wider transition shadow-lg hover:shadow-indigo-900/30 text-center"
            id="btn-confirm-warehouse-bundle"
          >
            {{ isPrepared ? 'Colisage Enregistré ✓' : 'Valider Colisage &amp; Créer BL' }}
          </button>
        </div>

        <!-- MOCK WAYBILL LABELLING SLOTS -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
          <h3 class="text-xs uppercase font-mono tracking-wider text-slate-350 font-bold">Étiqutage de colisage</h3>
          <div class="p-3.5 bg-slate-950 text-slate-400 border border-slate-850 rounded-xl space-y-1 text-[11px] font-mono leading-none">
            <div class="flex justify-between">
              <span>Code Expédition:</span>
              <span class="text-indigo-400">WYB-CMR-2026-X</span>
            </div>
            <div class="flex justify-between">
              <span>Nbre de conteneurs:</span>
              <span class="text-slate-200">1</span>
            </div>
            <div class="flex justify-between">
              <span>Atmosphère gérée:</span>
              <span class="text-sky-400 font-bold">NON CONF</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { orders as dbOrders, warehouses as dbWarehouses, products as dbProducts, purchaseFIFOStock } from '@/utils/supplier_db.js';
import { useToast } from 'vue-toastification';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const orderId = route.params.id;

const selectedWarehouseId = ref('wh_1');

const order = computed(() => {
  return dbOrders.value?.find(o => o.id === orderId) || dbOrders.value?.[0];
});

const warehouses = computed(() => {
  return dbWarehouses.value || [];
});

// Build items matching FIFO batches sequencings
const orderItemsWithBatches = computed(() => {
  if (!order.value) return [];

  return order.value.items.map(item => {
    const prod = dbProducts.value.find(p => p.id === item.productId);
    const prodBatches = prod ? (prod.batches || []) : [];
    
    // Sort oldest batches first
    const sorted = [...prodBatches].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Simulate FIFO picking algorithm visually!
    let needed = item.quantity || item.qty;
    const resolvedBatches = sorted.map(b => {
      let pick = 0;
      if (b.qty > 0 && needed > 0) {
        if (b.qty >= needed) {
          pick = needed;
          needed = 0;
        } else {
          pick = b.qty;
          needed -= b.qty;
        }
      }
      return {
        id: b.id,
        date: b.date,
        qty: b.qty,
        qtyPick: pick
      };
    });

    return {
      productId: item.productId,
      sku: item.sku || 'N/A',
      productName: item.productName || item.name,
      quantity: item.quantity || item.qty,
      totalStock: prod ? prod.stock : 0,
      batches: resolvedBatches,
      insufficient: needed > 0
    };
  });
});

const hasInsufficientStock = computed(() => {
  return orderItemsWithBatches.value.some(item => item.insufficient);
});

const isPrepared = computed(() => {
  return order.value?.status === 'Packed' || ['Shipped', 'Delivered', 'Completed'].includes(order.value?.status);
});

// Action solver: Subtract inventories chronologically via FIFO & generate Delivery Note Waybill
function validateFIFOPreparation() {
  if (hasInsufficientStock.value) {
    toast.error('Impossible de valider : Article(s) en rupture de stock dans les lots actifs.');
    return;
  }

  // Deduct actual stock amounts using the real FIFO algorithm!
  orderItemsWithBatches.value.forEach(item => {
    const qtyToDeduct = item.quantity;
    const res = purchaseFIFOStock(item.productId, qtyToDeduct);
    if (!res.success) {
      console.warn(`Internal FIFO solver failed or underflowed for product id: ${item.productId}`);
    }
  });

  // Mutate order state to local DB
  const ordIndex = dbOrders.value.findIndex(o => o.id === orderId);
  if (ordIndex > -1) {
    const origOrder = dbOrders.value[ordIndex];
    origOrder.status = 'Packed';
    
    // Auto initiate deliveryNote waybill payload (Draft)
    origOrder.deliveryNote = {
      id: `deliv_${Date.now()}`,
      waybillNumber: `BL-YDE-2026-${String(Date.now()).slice(-4)}`,
      orderId: origOrder.id,
      orderReference: origOrder.reference,
      originWarehouseId: selectedWarehouseId.value,
      originWarehouseName: warehouses.value.find(w => w.id === selectedWarehouseId.value)?.name || 'Entrepôt Central',
      destinationAddress: 'Magzi Bassa Sourcing Co., Douala, Cameroun',
      status: 'Ready_For_Pickup',
      dispatchedAt: null,
      deliveredAt: null,
      trackingUrl: ''
    };

    if (!origOrder.history) origOrder.history = [];
    origOrder.history.push({
      status: 'Packed',
      timestamp: new Date().toISOString(),
      label: 'Colisage FIFO Validé (Bon de livraison émis)',
      description: `Le personnel de l'entrepôt ${origOrder.deliveryNote.originWarehouseName} a complété le colisage de l'expédition. Les lots de stock anciens réglementaires sous FIFO ont été diminués.`
    });

    toast.success('Le colisage FIFO a été validé. Bon de livraison généré, en attente d\'affectation d\'un transporteur.');
    
    // Redirect to logistics portal automatically
    setTimeout(() => {
      router.push('/supplier/logistics');
    }, 1200);
  }
}
</script>

<style scoped>
.blink-button {
  animation: pulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
</style>
