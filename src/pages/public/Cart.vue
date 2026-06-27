<template>
  <div class="min-h-screen bg-light-bg-main dark:bg-[#070b12] text-text-main dark:text-slate-100 flex flex-col justify-between pt-28">
    
    <!-- NAVIGATION BAR -->
    <PublicHeader />

    <!-- INTRO DECK -->
    <main class="flex-1 py-12 px-4 xl:px-12 w-full space-y-8 select-none max-w-[1600px] mx-auto">
      
      <!-- BREATHTAKING HEADER -->
      <div class="border-b border-divider dark:border-slate-800 pb-6">
        <div class="inline-flex items-center space-x-1.5 bg-button-orange/20 border border-button-orange/30 text-button-orange px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-widest w-fit mb-3">
          <span>Achat Sécurisé</span>
        </div>
        <h1 class="text-3xl font-black text-text-main dark:text-white uppercase font-sans flex items-center gap-3">
          <ShoppingCartIcon class="h-8 w-8 text-button-orange" aria-label="Cart" />
          <span>Mon Panier</span>
        </h1>
        <p class="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
          Vos articles sont regroupés par boutique pour optimiser la logistique. Chaque commande bénéficie de notre garantie "Satisfait ou Remboursé" et d'un paiement 100% sécurisé.
        </p>
      </div>

      <!-- EMPTY STATE -->
      <div 
        v-if="cartStore.items.length === 0" 
        class="text-center py-16 bg-light-bg-main dark:bg-[#0a1017] border border-dashed border-divider dark:border-slate-800 rounded-3xl space-y-5"
      >
        <div class="flex justify-center">
          <ShoppingBagIcon class="h-16 w-16 text-text-sec" aria-label="Empty Bag" />
        </div>
        <h3 class="text-lg font-sans font-black text-text-main dark:text-white uppercase">VOTRE PANIER EST ACTUELLEMENT VIDE</h3>
        <p class="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
          Découvrez nos meilleures offres et promotions sur des milliers de produits de qualité supérieure.
        </p>
        <router-link 
          to="/products"
          class="inline-block mt-4 px-6 py-3 bg-button-orange hover:bg-button-orange\/90 text-text-main font-sans font-black text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition-all"
        >
          Commencer mes achats &rarr;
        </router-link>
      </div>

      <!-- MULTI-SELLER SYSTEM GRIDS -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- COLUMN 1: INTERACTIVE SUB-BASKETS PER SELLER -->
        <div class="lg:col-span-8 space-y-8">
          
          <div 
            v-for="(sellerBasket, bIdx) in cartStore.cartGroupedBySupplier" 
            :key="sellerBasket.supplierId"
            class="bg-light-bg-main dark:bg-[#0a1017] border border-divider dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
          >
            <!-- SUB-BASKET TOP BRAND HEAD -->
            <div class="bg-gradient-to-r from-slate-900 to-[#0a1017] px-6 py-4 border-b border-divider dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div class="flex items-center space-x-3">
                <div class="h-8 w-8 rounded-lg bg-button-orange text-text-main flex items-center justify-center text-sm font-sans font-black uppercase">
                  <BuildingOfficeIcon class="h-5 w-5" />
                </div>
                <div>
                  <span class="text-[10px] uppercase font-sans text-slate-400 block leading-none font-bold">Vendu et expédié par</span>
                  <h3 class="text-base font-sans font-black text-text-main dark:text-white mt-1 uppercase leading-none truncate max-w-xs">
                    {{ sellerBasket.supplierName }}
                  </h3>
                </div>
              </div>

              <!-- Real-time seller sub-total badge -->
              <div class="px-4 py-2 bg-light-bg-main dark:bg-slate-950 border border-divider dark:border-slate-800 rounded-xl text-sm font-sans font-bold flex items-center gap-2">
                <span class="text-slate-400">Sous-total Boutique:</span>
                <span class="text-button-orange">{{ formatCFA(sellerBasket.subtotal) }}</span>
              </div>
            </div>

            <!-- ITEM LINES -->
            <div class="divide-y divide-slate-800/50 px-6">
              <div 
                v-for="item in sellerBasket.items" 
                :key="item.product.id"
                class="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-6 font-sans text-sm"
              >
                <!-- Thumbnail + Metadata -->
                <div class="flex items-center space-x-4 flex-1">
                  <img :src="item.product.image" class="h-16 w-16 rounded-xl object-cover border border-divider dark:border-slate-800" />
                  <div class="truncate max-w-[15rem] sm:max-w-xs">
                    <span class="text-[9px] uppercase font-bold text-slate-500 leading-none">RÉF: {{ item.product.sku }}</span>
                    <h4 class="text-sm font-bold text-text-main dark:text-white leading-tight truncate mt-1 group-hover:text-button-orange transition-colors" :title="item.product.name">
                      {{ item.product.name }}
                    </h4>
                    <p class="text-xs text-slate-400 mt-1 font-bold">
                      {{ formatCFA(item.product.price) }} <span class="font-normal text-[10px] text-slate-500">/ {{ item.product.unit }}</span>
                    </p>
                  </div>
                </div>

                <!-- Live Quantity Mutator + Subtotal Column -->
                <div class="flex items-center justify-between sm:justify-end space-x-6 sm:w-auto w-full">
                  
                  <!-- Numeric quantity editor -->
                  <div class="flex items-center space-x-1.5 bg-light-bg-sec dark:bg-slate-900 p-1.5 border border-divider dark:border-slate-800 rounded-xl">
                    <button 
                      @click="decreaseQty(item)"
                      class="h-7 w-7 rounded-lg bg-light-bg-sec dark:bg-slate-800 hover:bg-slate-700 hover:text-button-orange text-text-main dark:text-white font-bold flex items-center justify-center text-lg transition"
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      :value="item.quantity"
                      @change="onQtyFieldChange($event, item)"
                      class="w-12 bg-transparent border-none text-center text-sm text-text-main dark:text-white font-black focus:ring-0 p-0"
                      min="1"
                      :max="item.product.stock || 50000"
                    />
                    <button 
                      @click="increaseQty(item)"
                      class="h-7 w-7 rounded-lg bg-light-bg-sec dark:bg-slate-800 hover:bg-slate-700 hover:text-button-orange text-text-main dark:text-white font-bold flex items-center justify-center text-lg transition"
                    >
                      +
                    </button>
                  </div>

                  <!-- Row Total cost -->
                  <div class="text-right min-w-[5.5rem]">
                    <span class="text-[10px] text-slate-500 block uppercase font-bold">Total Ligne</span>
                    <span class="text-button-orange font-black text-sm mt-0.5 inline-block">
                      {{ formatCFA(item.product.price * item.quantity) }}
                    </span>
                  </div>

                  <!-- Delete -->
                  <button 
                    @click="cartStore.removeFromCart(item.product.id)"
                    class="h-8 w-8 rounded-lg flex items-center justify-center bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-text-main dark:text-white font-bold text-xl transition pointer-events-auto"
                    title="Retirer l'article"
                  >
                    <TrashIcon class="h-4 w-4" />
                  </button>

                </div>
              </div>
            </div>

            <!-- SUPPLIER LOGISTICS SECTION -->
            <div class="bg-light-bg-sec dark:bg-slate-900/50 p-5 border-t border-divider dark:border-slate-800 space-y-4 font-sans">
              <div class="flex justify-between items-center">
                <span class="text-[11px] uppercase tracking-widest text-slate-400 font-bold flex items-center space-x-2">
                  <TruckIcon class="h-4 w-4 text-button-orange" />
                  <span>Mode de Livraison:</span>
                </span>
                <span class="text-[11px] text-button-orange font-black uppercase bg-button-orange/10 px-2 py-1 rounded">
                  {{ getFretCost(sellerBasket.supplierId) === 0 ? 'Livraison Gratuite' : `+ ${formatCFA(getFretCost(sellerBasket.supplierId))}` }}
                </span>
              </div>

              <!-- Selection radio buttons -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                
                <label 
                  v-for="car in freightOptions" 
                  :key="car.id"
                  class="p-3 rounded-xl border bg-light-bg-main dark:bg-[#0a1017] cursor-pointer flex flex-col justify-between hover:border-button-orange/50 transition-all relative overflow-hidden"
                  :class="selectedFreight[sellerBasket.supplierId] === car.id ? 'border-button-orange shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'border-divider dark:border-slate-800 text-slate-400'"
                  @click="setFreightRoute(sellerBasket.supplierId, car.id)"
                >
                  <div v-if="selectedFreight[sellerBasket.supplierId] === car.id" class="absolute inset-0 bg-button-orange/5 pointer-events-none"></div>
                  <div class="font-black flex justify-between uppercase z-10" :class="selectedFreight[sellerBasket.supplierId] === car.id ? 'text-button-orange' : 'text-text-sec dark:text-slate-300'">
                    <span>{{ car.name }}</span>
                    <span v-if="selectedFreight[sellerBasket.supplierId] === car.id">✔</span>
                  </div>
                  <div class="text-[10px] text-slate-500 mt-2 font-bold z-10">
                    {{ car.service }} <br> <span class="text-text-sec font-normal">{{ car.route }}</span>
                  </div>
                </label>

              </div>
            </div>

          </div>

        </div>

        <!-- COLUMN 2: TOTAL CARD -->
        <aside class="lg:col-span-4 bg-light-bg-main dark:bg-[#0a1017] border border-divider dark:border-slate-800 p-6 rounded-3xl space-y-6 font-sans text-sm lg:sticky lg:top-24 shadow-2xl">
          
          <div class="border-b border-divider dark:border-slate-800 pb-4">
            <span class="text-[10px] uppercase tracking-widest text-button-orange font-bold bg-button-orange/10 px-2 py-1 rounded">RÉSUMÉ DE LA COMMANDE</span>
            <h3 class="text-xl font-black text-text-main dark:text-white uppercase mt-3">Total à Régler</h3>
          </div>

          <!-- Invoice Rows -->
          <div class="space-y-4 text-text-sec dark:text-slate-300">
            
            <div class="flex justify-between items-center">
              <span class="text-slate-400 font-bold">Total des articles</span>
              <span class="font-black text-text-main dark:text-white">{{ formatCFA(cartStore.totalAmount) }}</span>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-slate-400 font-bold">Frais de livraison</span>
              <span class="font-black text-button-orange">{{ formatCFA(totalFreightCosts) }}</span>
            </div>

            <!-- Tax simulation -->
            <div class="flex justify-between items-center">
              <span class="text-slate-400 font-bold">TVA Estimée (5.5%)</span>
              <span class="font-black text-text-main dark:text-white">{{ formatCFA(simplifiedTax) }}</span>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-slate-400 font-bold">Frais de service (0.2%)</span>
              <span class="font-bold text-slate-500">{{ formatCFA(platformSecrowFee) }}</span>
            </div>

            <div class="pt-5 mt-2 border-t border-divider dark:border-slate-800 flex justify-between items-end">
              <div>
                <span class="text-[11px] uppercase tracking-wider text-slate-500 font-bold block mb-1">MONTANT FINAL</span>
                <span class="text-button-orange font-black text-2xl drop-shadow-md">{{ formatCFA(grandTotal) }}</span>
              </div>
              <span class="text-[9px] bg-button-orange/10 border border-button-orange/20 text-button-orange px-2 py-1 rounded uppercase font-black">
                XAF CFA
              </span>
            </div>

          </div>

          <!-- GUARANTEE BADGE -->
          <div class="p-4 bg-accent-green/5 border border-accent-green/20 rounded-xl space-y-2 text-accent-green/80 mt-6">
            <div class="flex items-center space-x-2 text-[10px] uppercase font-black tracking-widest text-accent-green">
              <ShieldCheckIcon class="h-4 w-4" />
              <span>Paiement Sécurisé</span>
            </div>
            <p class="text-[11px] leading-relaxed">
              Vos paiements sont cryptés et conservés en toute sécurité. Les vendeurs ne sont payés qu'après confirmation de bonne réception de votre commande.
            </p>
          </div>

          <!-- Checkout processing CTA -->
          <button 
            @click="processEscrowCheckout"
            class="w-full py-4 mt-4 bg-button-orange hover:bg-button-orange\/90 text-text-main font-black text-sm uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all flex justify-center items-center gap-2"
          >
            VALIDER LA COMMANDE <span class="text-lg">&rarr;</span>
          </button>

          <!-- Back Actions -->
          <router-link 
            to="/products"
            class="block w-full text-center py-3 bg-light-bg-sec dark:bg-slate-900 border border-divider dark:border-slate-800 hover:bg-light-bg-sec dark:bg-slate-800 hover:border-slate-700 rounded-xl text-slate-400 hover:text-text-main dark:text-white uppercase font-bold text-xs tracking-wider transition"
          >
            &larr; Continuer mes Achats
          </router-link>

        </aside>

      </div>

    </main>

    <!-- MAIN PLATFORM FOOTER -->
    <!-- FOOTER -->
    <PublicFooter />

  </div>
</template>

<script setup>
import PublicFooter from '@/components/PublicFooter.vue';
import { ref, reactive, computed, onMounted } from 'vue';
import { useCartStore } from '@/store/modules/cart.js';
import { useAuthStore } from '@/store/modules/auth.js';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { ShoppingCartIcon, ShoppingBagIcon, BuildingOfficeIcon, TruckIcon, ShieldCheckIcon, TrashIcon } from '@heroicons/vue/24/outline';

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
  { id: 'express', name: 'Livraison Express', service: 'Colis Rapide', route: '2 à 3 jours ouvrés', price: 15000 },
  { id: 'standard', name: 'Livraison Standard', service: 'Routier Classique', route: '5 à 7 jours ouvrés', price: 8500 },
  { id: 'relais', name: 'Point Relais', service: 'Retrait en Agence', route: 'Disponible partout', price: 3000 }
];

// Reactive mapping for chosen freight carrier code per supplier ID
const selectedFreight = reactive({});

onMounted(() => {
  // Set default freight selector for each unique supplier group in cart
  cartStore.cartGroupedBySupplier.forEach(group => {
    if (!selectedFreight[group.supplierId]) {
      selectedFreight[group.supplierId] = 'standard';
    }
  });
});

function setFreightRoute(supplierId, freightId) {
  selectedFreight[supplierId] = freightId;
  toast.success(`Option de livraison mise à jour.`);
}

function getFretCost(supplierId) {
  const code = selectedFreight[supplierId] || 'standard';
  const found = freightOptions.find(o => o.id === code);
  return found ? found.price : 8500;
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
    toast.error('Votre panier est actuellement vide.');
    return;
  }
  
  toast.success('Préparation de la commande en cours...');
  
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
