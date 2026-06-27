<template>
  <div class="min-h-screen bg-[#070b12] text-slate-100 flex flex-col justify-between">
    
    <!-- NAVIGATION BAR -->
    <PublicHeader />

    <!-- INTRO DECK -->
    <main class="flex-1 py-12 px-4 md:px-8 max-w-5xl mx-auto w-full space-y-8 select-none">
      
      <!-- BREATHTAKING HEADER -->
      <div class="border-b border-[#0f2129] pb-6">
        <div class="inline-flex items-center space-x-1.5 bg-[#0e2126] text-emerald-450 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest block w-fit mb-2">
          <span>Souverain B2B Escrow System</span>
        </div>
        <h1 class="text-2xl font-extrabold text-white uppercase font-mono">
          🛒 Mon Panier Multi-Vendeurs (Coopératives)
        </h1>
        <p class="text-xs text-slate-405 leading-relaxed tracking-wide mt-1">
          Sous le protocole KONG B2B, vos lots d'achat sont scindés et gérés par lot fournisseur (Coopérative). Chaque sous-panier dispose de ses propres modes d'acheminement douanier et est réglé sous séquestre sécurisé.
        </p>
      </div>

      <!-- EMPTY STATE -->
      <div 
        v-if="cartStore.items.length === 0" 
        class="text-center py-16 bg-[#0a1117]/40 border border-dashed border-[#142630] rounded-2xl space-y-4"
      >
        <div class="text-slate-600 text-4xl block">🛍️</div>
        <h3 class="text-sm font-mono font-bold text-slate-300 uppercase">VOTRE PANIER EST ACTUELLEMENT VIDE</h3>
        <p class="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          Explorez le catalogue de fèves, épices IGP camerounaises et kits d'équipements pour commander votre premier lot sous Escrow.
        </p>
        <router-link 
          to="/products"
          class="inline-block px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-450 hover:to-teal-555 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider rounded-lg transition"
        >
          Parcourir les Lots &rarr;
        </router-link>
      </div>

      <!-- MULTI-SELLER SYSTEM GRIDS -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- COLUMN 1: INTERACTIVE SUB-BASKETS PER COOPERATIVE -->
        <div class="lg:col-span-8 space-y-8">
          
          <div 
            v-for="(sellerBasket, bIdx) in cartStore.cartGroupedBySupplier" 
            :key="sellerBasket.supplierId"
            class="bg-[#091116] border border-[#142732] rounded-2xl overflow-hidden shadow-xl"
          >
            <!-- SUB-BASKET TOP BRAND HEAD -->
            <div class="bg-gradient-to-r from-[#0c1f26] to-[#0a1117] px-4.5 py-3.5 border-b border-[#142a34] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <div class="flex items-center space-x-2.5">
                <div class="h-6.5 w-6.5 rounded bg-emerald-500 text-slate-955 flex items-center justify-center text-xs font-mono font-extrabold uppercase">
                  COOP
                </div>
                <div>
                  <span class="text-[9px] uppercase font-mono text-slate-500 block leading-none">Wholesale Supplier Block</span>
                  <h3 class="text-[12.5px] font-sans font-bold text-emerald-400 mt-1 uppercase leading-none">
                    {{ sellerBasket.supplierName }}
                  </h3>
                </div>
              </div>

              <!-- Real-time seller sub-total badge -->
              <div class="px-3 py-1 bg-slate-950/80 border border-slate-900 rounded-lg text-xs font-mono">
                <span class="text-slate-500">Lot Subtotal:</span>
                <span class="text-emerald-404 font-bold ml-1.5">{{ formatCFA(sellerBasket.subtotal) }}</span>
              </div>
            </div>

            <!-- ITEM LINES -->
            <div class="divide-y divide-slate-900 px-4.5">
              <div 
                v-for="item in sellerBasket.items" 
                :key="item.product.id"
                class="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs"
              >
                <!-- Thumbnail + Metadata -->
                <div class="flex items-center space-x-4">
                  <img :src="item.product.image" class="h-12 w-12 rounded-lg object-cover border border-[#152e3b]/40" />
                  <div class="truncate max-w-[15rem] sm:max-w-[18rem]">
                    <span class="text-[8.5px] uppercase font-bold text-slate-500 leading-none">SKU: {{ item.product.sku }}</span>
                    <h4 class="text-[12px] font-bold text-slate-201 leading-tight truncate mt-0.5" :title="item.product.name">
                      {{ item.product.name }}
                    </h4>
                    <p class="text-[10px] text-slate-450 mt-1">
                      {{ formatCFA(item.product.price) }} <span class="font-sans text-[10px] text-slate-505">sans taxe / {{ item.product.unit }}</span>
                    </p>
                  </div>
                </div>

                <!-- Live Quantity Mutator + Subtotal Column -->
                <div class="flex items-center justify-between sm:justify-end space-x-6">
                  
                  <!-- Numeric quantity editor -->
                  <div class="flex items-center space-x-1.5 bg-slate-950 p-1 border border-slate-900 rounded-lg">
                    <button 
                      @click="decreaseQty(item)"
                      class="h-6 w-6 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-xs"
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      :value="item.quantity"
                      @change="onQtyFieldChange($event, item)"
                      class="w-12 bg-transparent border-none text-center text-xs text-emerald-450 font-bold focus:ring-0 p-0"
                      min="1"
                      :max="item.product.stock || 50000"
                    />
                    <button 
                      @click="increaseQty(item)"
                      class="h-6 w-6 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-xs"
                    >
                      +
                    </button>
                  </div>

                  <!-- Row Total cost -->
                  <div class="text-right min-w-[5.5rem]">
                    <span class="text-[9px] text-slate-500 block uppercase font-mono">Row Total</span>
                    <span class="text-emerald-404 font-extrabold text-[12.5px] mt-0.5 inline-block">
                      {{ formatCFA(item.product.price * item.quantity) }}
                    </span>
                  </div>

                  <!-- Delete -->
                  <button 
                    @click="cartStore.removeFromCart(item.product.id)"
                    class="text-red-500 hover:text-red-400 font-bold text-base leading-none p-1 pointer-events-auto"
                    title="Remove item"
                  >
                    &times;
                  </button>

                </div>
              </div>
            </div>

            <!-- SUPPLIER LOGISTICS SECTION (Separate fret calculations per seller) -->
            <div class="bg-slate-950/60 p-4 border-t border-slate-900 space-y-3 font-mono">
              <div class="flex justify-between items-center">
                <span class="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold flex items-center space-x-1.5">
                  <span class="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                  <span>Logistics Route & Clearing Partner:</span>
                </span>
                <span class="text-[9.5px] text-cyan-404 font-bold uppercase select-all">
                  {{ getFretCost(sellerBasket.supplierId) === 0 ? 'FRET OFFERT' : `+ ${formatCFA(getFretCost(sellerBasket.supplierId))}` }}
                </span>
              </div>

              <!-- Selection radio buttons -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[10.5px]">
                
                <label 
                  v-for="car in freightOptions" 
                  :key="car.id"
                  class="p-2.5 rounded-lg border bg-[#05090e]/80 cursor-pointer flex flex-col justify-between hover:border-slate-800 transition"
                  :class="selectedFreight[sellerBasket.supplierId] === car.id ? 'border-cyan-500/80 bg-cyan-950/10 text-cyan-300' : 'border-slate-900 text-slate-450'"
                  @click="setFreightRoute(sellerBasket.supplierId, car.id)"
                >
                  <div class="font-bold flex justify-between uppercase">
                    <span>{{ car.name }}</span>
                    <span v-if="selectedFreight[sellerBasket.supplierId] === car.id" class="text-cyan-400 select-none">✔</span>
                  </div>
                  <div class="text-[8.5px] text-slate-500 mt-1 leading-normal uppercase">
                    {{ car.service }} &bull; {{ car.route }}
                  </div>
                </label>

              </div>
            </div>

          </div>

        </div>

        <!-- COLUMN 2: ESCROW BILLING BILLBOARD TOTAL CARD -->
        <aside class="lg:col-span-4 bg-[#091116] border border-[#142732] p-5 rounded-2xl space-y-6 font-mono text-[11px] lg:sticky lg:top-24">
          
          <div class="border-b border-[#12242d] pb-3.5">
            <span class="text-[9.5px] uppercase tracking-wider text-slate-500 font-bold">SOVEREIGN LEDGER INVOICE</span>
            <h3 class="text-sm font-bold text-white uppercase mt-0.5">Recapitulatif d'Escrow</h3>
          </div>

          <!-- Invoice Rows -->
          <div class="space-y-3.5 text-slate-300">
            
            <div class="flex justify-between">
              <span class="text-slate-500 uppercase">Subtotal Crops (Lot cost)</span>
              <span class="font-bold text-slate-200 text-xs">{{ formatCFA(cartStore.totalAmount) }}</span>
            </div>

            <div class="flex justify-between">
              <span class="text-slate-500 uppercase">Localized Freight Route Add</span>
              <span class="font-bold text-cyan-405 text-xs">{{ formatCFA(totalFreightCosts) }}</span>
            </div>

            <!-- Tax simulation (African OHADA standard 19.25% or simplified 5.5% B2B) -->
            <div class="flex justify-between">
              <span class="text-slate-500 uppercase">Simplified OHADA B2B Tax (5.5%)</span>
              <span class="font-bold text-slate-200 text-xs">{{ formatCFA(simplifiedTax) }}</span>
            </div>

            <div class="flex justify-between">
              <span class="text-slate-500 uppercase">Platform Secrow Fee (0.2%)</span>
              <span class="text-slate-450 font-bold">{{ formatCFA(platformSecrowFee) }}</span>
            </div>

            <div class="pt-4.5 border-t border-[#12242d] flex justify-between items-end">
              <div>
                <span class="text-[9px] uppercase tracking-wider text-slate-550 block">GRAND TOTAL B2B SÉQUESTRE</span>
                <span class="text-emerald-404 font-extrabold text-lg">{{ formatCFA(grandTotal) }}</span>
              </div>
              <span class="text-[8px] bg-emerald-950/40 border border-emerald-900/30 text-emerald-450 px-2 py-0.5 rounded uppercase font-bold">
                XAF CFA
              </span>
            </div>

          </div>

          <!-- ESCROW DISPATCH TRUST METAPHOR -->
          <div class="p-3 bg-slate-950 border border-slate-900 rounded-xl space-y-2 text-slate-500">
            <div class="flex items-center space-x-2 text-[9px] uppercase text-emerald-450 font-extrabold tracking-tight">
              <span class="animate-pulse h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span>Clearing Guaranty Clause</span>
            </div>
            <p class="text-[9.5px] leading-normal font-sans">
              No direct cash is sent to suppliers. Your fund stays fully secure inside KONG Escrow and is only dispatched when you sign-off the customs receipts.
            </p>
          </div>

          <!-- Checkout processing CTA -->
          <button 
            @click="processEscrowCheckout"
            class="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-450 hover:to-teal-555 text-slate-955 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition"
          >
            SÉQUESTRER ET COMMANDER &rarr;
          </button>

          <!-- Back Actions -->
          <router-link 
            to="/products"
            class="block w-full text-center py-2.5 bg-[#05090d] border border-slate-900 hover:bg-slate-900 rounded-xl text-slate-400 hover:text-white uppercase text-[10px] tracking-wider transition"
          >
            &larr; Continuer mes Achats
          </router-link>

        </aside>

      </div>

    </main>

    <!-- FOOTER -->
    <footer class="bg-slate-950 border-t border-[#091116] py-12 px-6 text-slate-500 text-xs text-center pb-48 md:pb-40">
      <div class="max-w-4xl mx-auto space-y-4">
        <p class="text-[11px] leading-relaxed max-w-xl mx-auto">
          KONG S.A. est une marque de technologie logistique camerounaise agréée. Tous droits réservés. Conforme CEMAC et règles de l'arbitrage commercial international.
        </p>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useCartStore } from '@/store/modules/cart.js';
import { useAuthStore } from '@/store/modules/auth.js';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

// Import components
import PublicHeader from '@/components/PublicHeader.vue';

const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

// ----------------------------------------------------
// FREIGHT MULTI-SUPPLIER TRACKING RULES
// ----------------------------------------------------
const freightOptions = [
  { id: 'camrail', name: 'CAMRAIL FRET Express', service: 'Rail-Cargo', route: 'Axe Douala - Ngaoundéré', price: 18000 },
  { id: 'soletrans', name: 'SOLETRANS Douala Port', service: 'Road Heavy Duty', route: 'National Corridor', price: 25000 },
  { id: 'guaranty', name: 'GUARANTY Cargo Van', service: 'Urban Inter-City', price: 9500 }
];

// Reactive mapping for chosen freight carrier code per supplier ID
const selectedFreight = reactive({});

onMounted(() => {
  // Set default freight selector for each unique supplier group in cart
  cartStore.cartGroupedBySupplier.forEach(group => {
    if (!selectedFreight[group.supplierId]) {
      selectedFreight[group.supplierId] = 'camrail';
    }
  });
});

function setFreightRoute(supplierId, freightId) {
  selectedFreight[supplierId] = freightId;
  toast.success(`[LOGISTICS] Options de transport modifiées pour ce vendeur.`);
}

function getFretCost(supplierId) {
  const code = selectedFreight[supplierId] || 'camrail';
  const found = freightOptions.find(o => o.id === code);
  return found ? found.price : 18000;
}

// Sum of all custom supplier fret paths
const totalFreightCosts = computed(() => {
  let cost = 0;
  cartStore.cartGroupedBySupplier.forEach(group => {
    cost += getFretCost(group.supplierId);
  });
  return cost;
});

// Simplified billing
const simplifiedTax = computed(() => {
  return Math.floor(cartStore.totalAmount * 0.055);
});

const platformSecrowFee = computed(() => {
  return Math.floor(cartStore.totalAmount * 0.002);
});

const grandTotal = computed(() => {
  return cartStore.totalAmount + totalFreightCosts.value + simplifiedTax.value + platformSecrowFee.value;
});

// ----------------------------------------------------
// DYNAMIC QUANTITY CONTROLS
// ----------------------------------------------------
function increaseQty(item) {
  cartStore.updateQuantity(item.product.id, item.quantity + 1);
}

function decreaseQty(item) {
  cartStore.updateQuantity(item.product.id, item.quantity - 1);
}

function onQtyFieldChange(e, item) {
  const val = parseInt(e.target.value) || 1;
  cartStore.updateQuantity(item.product.id, val);
}

// ----------------------------------------------------
// ACTION PROCESS CHECKOUT
// ----------------------------------------------------
function processEscrowCheckout() {
  if (cartStore.items.length === 0) {
    toast.error('Your cart database is currently empty.');
    return;
  }
  
  toast.success('🏗️ Generation of Escrow Ledger codes successful. Redirecting to order checkoff.');
  
  // Navigate instantly to /checkout
  router.push('/checkout');
}

// Currency translation
function formatCFA(val) {
  if (val === undefined || val === null) return '0 CFA';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('FCFA', 'CFA').replace('XAF', 'CFA');
}
</script>

<style scoped>
/* Standard number input hider spinner */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
