<template>
  <div class="space-y-6 max-w-6xl mx-auto" id="warehouse-preparation-workspace">
    <!-- LAYOUT HEADER -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--color-border)] pb-4 gap-4">
      <div class="space-y-1">
        <router-link :to="'/supplier/orders/' + orderId" class="text-sm text-[var(--color-primary)] font-semibold hover:underline flex items-center space-x-1.5">
          <span>&larr;</span>
          <span>Retour à la commande</span>
        </router-link>
        <h1 class="text-2xl font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
          <span>Module de Colisage (Entrepôt)</span>
          <span class="text-[var(--color-primary)] font-mono text-lg">#{{ order?.reference }}</span>
        </h1>
      </div>
      <div>
        <span class="px-4 py-1.5 bg-[var(--color-primary-muted)] text-[var(--color-primary)] border border-[var(--color-primary-border)] rounded-full font-semibold text-xs animate-pulse inline-block shadow-sm">
          Règle active : FIFO (Premier Entré, Premier Sorti)
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- FIFO LINEAR PROCESSING SECTION (LEFT 2 COLS) -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- MAIN INVENTORY COMPLIANCE MATCHER -->
        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
          <div class="flex items-start justify-between border-b border-[var(--color-border)] pb-4">
            <div>
              <h3 class="text-lg font-bold text-[var(--color-text-primary)]">Prélèvement de stocks (Séquencé)</h3>
              <p class="text-sm text-[var(--color-text-secondary)] mt-1">Le système affecte en priorité les lots de fabrication les plus anciens disponibles en magasin.</p>
            </div>
          </div>

          <!-- WAREHOUSE HUB UNIT SELECTOR -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[var(--color-surface-hover)] p-5 rounded-xl border border-[var(--color-border)]">
            <label class="block">
              <span class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-2">Entrepôt source (Retrait physique)</span>
              <select 
                v-model="selectedWarehouseId"
                class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                id="select-wh-source"
              >
                <option 
                  v-for="wh in warehouses" 
                  :key="wh.id" 
                  :value="wh.id"
                >
                  🏢 {{ wh.name }} ({{ wh.location }})
                </option>
              </select>
            </label>

            <div class="flex flex-col justify-center text-xs text-[var(--color-text-secondary)] space-y-2">
              <div class="flex justify-between">
                <span>Capacité totale :</span>
                <span class="text-[var(--color-text-primary)] font-bold">500 000 Unités</span>
              </div>
              <div class="flex justify-between">
                <span>Taux de remplissage :</span>
                <span class="text-emerald-500 font-bold">42 %</span>
              </div>
              <div class="flex justify-between">
                <span>Température régulée :</span>
                <span class="text-sky-500 font-bold">18°C ~ Constante</span>
              </div>
            </div>
          </div>

          <!-- PRODUCT LIST AND CORRESPONDING FIFO BATCH TIMINGS/PRESELECTION -->
          <div class="space-y-4">
            <h4 class="text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">Articles et Lots affectés</h4>
            
            <div 
              v-for="(item, index) in orderItemsWithBatches" 
              :key="item.productId || index"
              class="border border-[var(--color-border)] rounded-xl p-5 bg-[var(--color-surface)] space-y-4 shadow-sm"
              :id="'prepare-item-' + item.productId"
            >
              <!-- Info block -->
              <div class="flex justify-between items-start">
                <div>
                  <span class="text-xs font-semibold text-[var(--color-primary)]">{{ item.sku }}</span>
                  <h5 class="text-base font-bold text-[var(--color-text-primary)] mt-1">{{ item.productName }}</h5>
                  <p class="text-sm text-[var(--color-text-secondary)] mt-1">Quantité requise au contrat : <strong class="text-[var(--color-text-primary)]">{{ item.quantity }} unité(s)</strong></p>
                </div>

                <!-- Total general stock badge -->
                <span class="px-3 py-1 bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] rounded-lg border border-[var(--color-border)] text-xs font-bold">
                  Stock total : {{ item.totalStock }}
                </span>
              </div>

              <!-- Lots / Batches FIFO Sequence Visualizer -->
              <div class="space-y-3 pt-2">
                <span class="block text-xs font-semibold text-[var(--color-text-secondary)]">Séquencement des lots de fabrication :</span>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div 
                    v-for="(b, idx) in item.batches" 
                    :key="b.id"
                    class="border rounded-xl p-3.5 flex flex-col justify-between transition"
                    :class="b.qtyPick > 0 ? 'bg-[var(--color-primary-muted)] border-[var(--color-primary-border)]' : 'bg-[var(--color-surface-hover)] border-[var(--color-border)] opacity-60'"
                  >
                    <div class="flex justify-between font-bold text-xs">
                      <span :class="b.qtyPick > 0 ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'">Lot : {{ b.id }}</span>
                      <span class="text-[var(--color-text-muted)] font-normal">Date : {{ b.date }}</span>
                    </div>
                    
                    <div class="flex justify-between items-baseline mt-3 text-sm">
                      <span class="text-[var(--color-text-secondary)]">Solde dispo : <strong class="text-[var(--color-text-primary)]">{{ b.qty }}</strong></span>
                      <span v-if="b.qtyPick > 0" class="text-sm font-bold text-[var(--color-primary)]">
                        PRÉLEVÉ : -{{ b.qtyPick }}
                      </span>
                    </div>

                    <!-- Highlight the FIFO rule indicator -->
                    <div v-if="b.qtyPick > 0 && idx === 0" class="mt-3 text-xs font-semibold text-center bg-white/50 text-[var(--color-primary)] py-1 rounded-lg border border-[var(--color-primary-border)]">
                      Prélèvement prioritaire (Lot ancien)
                    </div>
                  </div>
                </div>
              </div>

              <!-- Checking inventory solver confirmation block -->
              <div 
                v-if="item.insufficient"
                class="p-3 mt-2 bg-red-500/10 border border-red-500/20 rounded-lg text-center text-red-500 text-sm font-semibold"
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
        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 space-y-5 shadow-sm">
          <h3 class="text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">Indicateurs de colisage</h3>
          
          <div class="p-4 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl text-center space-y-3">
            <span class="text-[var(--color-text-secondary)] text-xs font-semibold block">Remplissage des colis</span>
            <div class="h-3 w-full bg-[var(--color-background)] rounded-full overflow-hidden border border-[var(--color-border)]">
              <div class="h-full bg-emerald-500 rounded-full transition-all duration-500" :style="{ width: isPrepared ? '100%' : '35%' }"></div>
            </div>
            <span class="text-[var(--color-text-primary)] font-bold text-sm block">{{ isPrepared ? '100% Emballé' : 'Veuillez valider le prélèvement' }}</span>
          </div>

          <p class="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            En validant le colisage, le système effectue les opérations comptables immédiates de soustraction de stock sur les lots physiques, génère le <strong>Bon de Livraison (Waybill)</strong>, et bascule la commande au niveau logistique supérieur.
          </p>

          <button 
            @click="validateFIFOPreparation"
            :disabled="hasInsufficientStock || isPrepared"
            class="w-full py-3 bg-[var(--color-primary)] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition shadow-sm text-center"
            id="btn-confirm-warehouse-bundle"
          >
            {{ isPrepared ? 'Colisage Enregistré ✓' : 'Valider Colisage et Créer le BL' }}
          </button>
        </div>

        <!-- MOCK WAYBILL LABELLING SLOTS -->
        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 class="text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">Étiquetage prévu</h3>
          <div class="p-4 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl space-y-2 text-sm text-[var(--color-text-secondary)]">
            <div class="flex justify-between">
              <span>Code Expédition :</span>
              <span class="text-[var(--color-primary)] font-bold font-mono">WYB-CMR-2026-X</span>
            </div>
            <div class="flex justify-between">
              <span>Nombre de conteneurs :</span>
              <span class="text-[var(--color-text-primary)] font-bold">1</span>
            </div>
            <div class="flex justify-between">
              <span>Atmosphère gérée :</span>
              <span class="text-sky-500 font-bold">Non spécifié</span>
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
      label: 'Colisage Validé (Bon de livraison émis)',
      description: `Le personnel de l'entrepôt a terminé le colisage. Les lots anciens ont été diminués.`
    });

    toast.success('Le colisage a été validé. Bon de livraison généré, en attente d\'affectation d\'un transporteur.');
    
    // Redirect to logistics portal automatically
    setTimeout(() => {
      router.push('/supplier/logistics');
    }, 1200);
  }
}
</script>
