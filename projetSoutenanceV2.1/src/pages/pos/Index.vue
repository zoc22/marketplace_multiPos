<template>
  <div class="h-full select-none">
    <!-- CASE A: CAISSE FERMÉE (SESSION STATUS: LOCKED) -->
    <div v-if="!session.isOpen" class="max-w-md mx-auto my-12 bg-zinc-950 border border-emerald-950 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      <div class="absolute -right-16 -top-16 w-32 h-32 bg-emerald-900/10 rounded-full blur-2xl"></div>
      
      <div class="space-y-6">
        <div class="flex items-center space-x-3 pb-4 border-b border-emerald-950/60">
          <span class="p-2 bg-[#041a0f] text-[#10b981] rounded-lg border border-emerald-900/50">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </span>
          <div>
            <h2 class="text-sm font-bold uppercase text-emerald-100 tracking-wider">Ouverture de Caisse</h2>
            <p class="text-[9px] text-zinc-500 tracking-tight font-mono">SYS_REGISTER_LOCKSTATE_ENGAGED</p>
          </div>
        </div>

        <p class="text-xs text-zinc-400 leading-relaxed">
          Veuillez sélectionner le point de vente d'affectation et renseigner le fonds de caisse initial pour activer la console de vente.
        </p>

        <form @submit.prevent="handleOpenRegister" class="space-y-4 text-xs">
          <!-- Selection Magasin -->
          <div>
            <label class="block text-[10px] uppercase text-zinc-500 mb-1 font-bold">Magasin / Point de Vente</label>
            <select 
              v-model="openingStoreId"
              required
              class="w-full bg-black border border-emerald-950 px-3 py-2 rounded text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
            >
              <option value="" disabled>--- SÉLECTIONNER UN MAGASIN ---</option>
              <option v-for="store in stores" :key="store.id" :value="store.id">
                {{ store.name }} ({{ store.city }})
              </option>
            </select>
          </div>

          <!-- Fonds de caisse -->
          <div>
            <label class="block text-[10px] uppercase text-zinc-500 mb-1 font-bold">Fonds de caisse initial (FCFA)</label>
            <div class="relative">
              <input 
                type="number" 
                v-model="openingBalance"
                required
                min="0"
                step="500"
                placeholder="Ex. 50000"
                class="w-full bg-black border border-emerald-950 px-3 py-2 pl-8 rounded text-emerald-300 font-mono font-semibold focus:outline-none focus:border-emerald-500"
              />
              <span class="absolute left-3 top-2 text-zinc-500 font-mono">₣</span>
            </div>
            <p class="text-[9px] text-zinc-600 mt-1">Calcul des écarts basé sur cette somme d'ouverture.</p>
          </div>

          <!-- Caissier -->
          <div>
            <label class="block text-[10px] uppercase text-zinc-500 mb-1">Caissier Référent</label>
            <input 
              type="text" 
              disabled
              value="Jean Dupont (DMS_MANAGER_02)"
              class="w-full bg-[#0a0f0d] border border-emerald-950 px-3 py-2 rounded text-zinc-500 font-mono"
            />
          </div>

          <button 
            type="submit"
            class="w-full py-2.5 bg-emerald-950 text-emerald-400 hover:bg-[#0c311c] border border-emerald-900 font-mono font-bold text-xs rounded transition uppercase tracking-wider shadow-lg shadow-emerald-950/20"
          >
            Saisir &amp; Activer Console [ Enter ]
          </button>
        </form>
      </div>
    </div>

    <!-- CASE B: CAISSE OUVERTE (TERMINAL ACTIVE) -->
    <div v-else class="h-full flex flex-col lg:flex-row gap-6">
      
      <!-- LEFT AREA: SEARCH, BARCODE AND CATALOG GRID -->
      <div class="flex-1 flex flex-col space-y-4">
        
        <!-- SEARCH & BARCODE CONTROLS -->
        <div class="bg-zinc-950 border border-emerald-950/80 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
          
          <!-- Live search text input -->
          <div class="w-full md:w-72 relative shrink-0">
            <input 
              type="text" 
              v-model="searchQuery"
              placeholder="Recherche nom ou SKU..."
              class="w-full bg-black border border-emerald-950/80 px-3 py-1.5 pl-8 rounded-lg text-emerald-300 placeholder-zinc-600 font-mono text-xs focus:outline-none focus:border-emerald-500"
            />
            <span class="absolute left-2.5 top-2 text-zinc-600">🔍</span>
          </div>

          <!-- Barcode simulation input -->
          <div class="w-full flex-1 flex items-center gap-2 relative">
            <span class="text-[10px] uppercase text-zinc-500 font-bold hidden xl:block shrink-0">Lecteur Code-barres :</span>
            <div class="relative flex-1">
              <input 
                type="text" 
                v-model="barcodeQuery"
                @keyup.enter="handleBarcodeScan"
                placeholder="Scanner SKU (ex. presser badges à droite)..."
                class="w-full bg-black border border-[#1e462c] px-3 py-1.5 pl-8 rounded-lg text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-505"
                :class="{ 'animate-pulse border-emerald-500 bg-emerald-950/20': isScanningEffect }"
              />
              <span class="absolute left-2.5 top-2">🏷️</span>
            </div>
            
            <button 
              @click="handleBarcodeScan"
              class="px-3 py-1.5 bg-emerald-950 border border-emerald-900 text-emerald-400 text-xs rounded hover:bg-emerald-900 hover:text-white font-bold transition shrink-0 uppercase"
            >
              Scan
            </button>
          </div>

          <!-- Quick mock scan templates -->
          <div class="flex items-center gap-1.5 overflow-x-auto shrink-0 max-w-xs py-1">
            <span class="text-[9px] text-[#2c5b46] font-bold">MOCK :</span>
            <button 
              v-for="mockSku in ['CMR-PROD-AGR-0001', 'CMR-PROD-AGR-0011', 'CMR-PROD-EXP-0002']" 
              :key="mockSku"
              @click="mockScan(mockSku)"
              class="text-[9px] font-mono px-1.5 py-0.5 bg-zinc-900 text-zinc-400 border border-zinc-800 rounded hover:border-emerald-550 hover:text-emerald-400"
            >
              {{ mockSku.slice(-8) }}
            </button>
          </div>

        </div>

        <!-- CATEGORIES SELECT BAR -->
        <div class="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
          <button 
            @click="selectedCategory = 'all'"
            class="px-2.5 py-1 text-[10px] uppercase font-mono font-bold rounded shrink-0 border"
            :class="selectedCategory === 'all' ? 'bg-[#0f241a] text-[#10b981] border-emerald-500/40' : 'bg-black text-zinc-500 border-emerald-950/40 hover:text-zinc-300'"
          >
            TOUS LES PRODUITS
          </button>
          <button 
            v-for="cat in activeSectors"
            :key="cat"
            @click="selectedCategory = cat"
            class="px-2.5 py-1 text-[10px] uppercase font-mono font-bold rounded shrink-0 border"
            :class="selectedCategory === cat ? 'bg-[#0f241a] text-[#10b981] border-emerald-500/40' : 'bg-black text-zinc-500 border-emerald-950/40 hover:text-zinc-300'"
          >
            {{ cat }}
          </button>
        </div>

        <!-- PRODUCTS LIST GRID -->
        <div class="flex-1 overflow-y-auto max-h-[calc(100vh-250px)] pr-1">
          <div v-if="filteredProducts.length === 0" class="text-center py-16 bg-zinc-950 border border-emerald-950/50 rounded-2xl">
            <span class="text-2xl block mb-2 opacity-50">⚠️</span>
            <p class="text-xs text-zinc-500 font-mono">Aucun produit ne correspond à ces critères de recherche.</p>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div 
              v-for="product in filteredProducts" 
              :key="product.id"
              @click="triggerAddToCart(product)"
              class="relative bg-zinc-950 border p-4 rounded-xl flex flex-col justify-between transition hover:border-[#10b980]/50 hover:bg-[#03150b]/20 cursor-pointer group"
              :class="product.stock <= 0 ? 'opacity-50 border-zinc-900 pointer-events-none' : 'border-zinc-905'"
            >
              <!-- FIFO Batch HUD overlay -->
              <div class="absolute right-3 top-3 px-1.5 py-0.5 rounded text-[8.5px] uppercase font-mono bg-black/80 border text-zinc-400 group-hover:block" :class="product.stock < 50 ? 'border-amber-900 text-amber-500' : 'border-emerald-950 text-emerald-550'">
                STOCK: <strong :class="product.stock < 50 ? 'text-amber-400' : 'text-emerald-400'">{{ product.stock }} {{ product.unit || 'uds' }}</strong>
              </div>

              <div class="space-y-2">
                <span class="text-[8.5px] text-zinc-550 font-bold uppercase tracking-wider block font-mono">
                  SKU: {{ product.sku }}
                </span>
                
                <h3 class="text-xs font-bold text-zinc-200 line-clamp-2 leading-tight group-hover:text-emerald-400">
                  {{ product.name }}
                </h3>

                <!-- Batches hover or detail HUD -->
                <div class="p-1 px-1.5 bg-black/60 rounded text-[8.5px] text-zinc-550 font-mono space-y-0.5">
                  <div class="text-[8px] uppercase tracking-wider text-emerald-600 font-bold">Batches FIFO actifs :</div>
                  <div class="flex justify-between" v-for="b in (product.batches || []).slice(0, 2)" :key="b.id">
                    <span>📅 {{ b.date }}</span>
                    <strong class="text-zinc-400">{{ b.qty }} u @ {{ Math.round(b.price) }} FCFA</strong>
                  </div>
                  <div v-if="(product.batches || []).length > 2" class="text-[7.5px] text-center text-zinc-600">
                    +{{ (product.batches || []).length - 2 }} autres lots
                  </div>
                </div>
              </div>

              <div class="mt-4 pt-3 border-t border-emerald-950/30 flex justify-between items-center">
                <span class="text-[9.5px] text-zinc-500 font-mono lowercase">par {{ product.unit }}</span>
                <span class="text-xs font-bold text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-900/60 px-2 py-0.5 rounded">
                  {{ Math.round(product.price).toLocaleString() }} FCFA
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- RIGHT AREA: REAL-TIME CART PREVIEW & QUICK ACTIONS -->
      <div class="w-full lg:w-80 shrink-0 bg-zinc-950 border border-emerald-950 p-4 rounded-xl flex flex-col justify-between max-h-[calc(100vh-140px)]">
        
        <div>
          <!-- Cart Header -->
          <div class="flex justify-between items-center pb-3 border-b border-emerald-950/60 mb-4">
            <h2 class="text-[10px] font-mono font-bold uppercase tracking-widest text-[#10b980]">
              Panier en cours ({{ cart.items.length }} articles)
            </h2>
            <button 
              v-if="cart.items.length > 0"
              @click="handleClearCart"
              class="text-[9px] hover:text-red-400 text-zinc-500 uppercase font-bold"
            >
              [ VIDER ]
            </button>
          </div>

          <!-- Customer Name & Phone for logging -->
          <div class="grid grid-cols-2 gap-2 mb-4 font-mono text-[9px]">
            <div>
              <label class="block text-zinc-600 uppercase mb-0.5 font-bold">Tél Client</label>
              <input 
                type="text" 
                v-model="cart.customerPhone"
                placeholder="6XXXXXXXX"
                class="w-full bg-black border border-emerald-950/80 px-2 py-1 text-emerald-400 rounded focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-zinc-600 uppercase mb-0.5 font-bold">Nom Client</label>
              <input 
                type="text" 
                v-model="cart.customerName"
                placeholder="Client Comptant"
                class="w-full bg-black border border-emerald-[#0f241a] px-2 py-1 text-[#10b980] rounded focus:outline-none"
              />
            </div>
          </div>

          <!-- Cart Stream -->
          <div class="space-y-3.5 overflow-y-auto max-h-[280px] lg:max-h-[380px] pr-0.5 scrollbar-thin">
            <div 
              v-for="item in cart.items" 
              :key="item.productId"
              class="p-2 bg-black rounded border border-emerald-955/30 transition hover:border-[#10b980]/30"
            >
              <div class="flex justify-between items-start">
                <span class="text-[10px] font-bold text-zinc-350 block truncate max-w-[150px]">
                  {{ item.name }}
                </span>
                <button 
                  @click="removeFromCart(item.productId)"
                  class="text-[9px] text-[#2c5b46] hover:text-red-500 font-bold"
                >
                  &times;
                </button>
              </div>

              <div class="flex justify-between items-center mt-2.5 font-mono text-[9.5px]">
                <!-- Increment Decrement controls -->
                <div class="flex items-center space-x-1.5">
                  <button 
                    @click="updateCartQty(item.productId, item.qty - 1)"
                    class="h-4.5 w-4.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-400 font-bold flex items-center justify-center hover:bg-zinc-850"
                  >
                    -
                  </button>
                  <span class="font-bold text-emerald-400 w-5 text-center">{{ item.qty }}</span>
                  <button 
                    @click="updateCartQty(item.productId, item.qty + 1)"
                    class="h-4.5 w-4.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-400 font-bold flex items-center justify-center hover:bg-zinc-855"
                  >
                    +
                  </button>
                </div>

                <!-- Price label -->
                <div class="text-right">
                  <span class="text-zinc-500 line-through mr-1 block text-[8px]" v-if="item.discountType !== 'none'">
                    {{ (item.price * item.qty).toLocaleString() }} ₣
                  </span>
                  <span class="font-bold text-zinc-300">
                    {{ Math.round(calculateItemTotal(item)).toLocaleString() }} FCFA
                  </span>
                </div>
              </div>

              <!-- Quick Discount Line -->
              <div class="mt-1.5 flex items-center justify-between border-t border-zinc-950 pt-1 text-[8.5px] font-mono">
                <span class="text-zinc-650">Remise article :</span>
                <div class="flex items-center gap-1">
                  <select 
                    v-model="item.discountType"
                    @change="setItemDiscount(item.productId, item.discountType, item.discountValue)"
                    class="bg-black border border-zinc-900 text-[8px] text-zinc-400 rounded px-1"
                  >
                    <option value="none">Aucune</option>
                    <option value="percentage">% Perc</option>
                    <option value="fixed">Fixed</option>
                  </select>
                  <input 
                    v-if="item.discountType !== 'none'"
                    type="number" 
                    min="0"
                    v-model.number="item.discountValue"
                    @input="setItemDiscount(item.productId, item.discountType, item.discountValue)"
                    class="w-8 bg-black border border-zinc-900 text-[8px] text-zinc-200 text-center rounded"
                    placeholder="0"
                  />
                </div>
              </div>

            </div>

            <!-- Empty cart reminder -->
            <div v-show="cart.items.length === 0" class="text-center py-12 text-zinc-600 font-mono text-xs">
              Mettez des articles dans le panier B2B pour commencer.
            </div>
          </div>
        </div>

        <!-- Totals & Checkout Trigger Drawer -->
        <div class="border-t border-[#0f241a] pt-3 mt-4 space-y-2">
          
          <div class="flex justify-between items-center text-[9px] font-mono">
            <span class="text-zinc-500">Sous-total HT :</span>
            <span class="text-zinc-350">{{ cartSubtotalHT.toLocaleString() }} ₣</span>
          </div>

          <div class="flex justify-between items-center text-[9px] font-mono">
            <span class="text-zinc-500">Remise globale :</span>
            <div class="flex items-center gap-1">
              <select 
                v-model="cart.globalDiscountType"
                class="bg-black border border-zinc-90 w-16 text-[8px] text-zinc-400 rounded"
              >
                <option value="none">Non</option>
                <option value="percentage">% Perc</option>
                <option value="fixed">FCFA</option>
              </select>
              <input 
                v-if="cart.globalDiscountType !== 'none'"
                type="number" 
                min="0"
                v-model.number="cart.globalDiscountValue"
                class="w-10 bg-black border border-zinc-90 text-[8px] text-center rounded text-emerald-400"
                placeholder="Val"
              />
            </div>
          </div>

          <div class="flex justify-between items-center text-[9px] font-mono">
            <span class="text-zinc-500">TVA (19.25%) :</span>
            <span class="text-zinc-350">{{ Math.round(cartTaxAmount).toLocaleString() }} ₣</span>
          </div>

          <div class="flex justify-between items-center text-sm font-bold pt-2 border-t border-emerald-950/60 font-mono">
            <span class="text-zinc-200 uppercase tracking-widest text-[9.5px]">TOTAL TTC :</span>
            <span class="text-emerald-400 font-mono">
              {{ Math.round(cartTotalTTC).toLocaleString() }} FCFA
            </span>
          </div>

          <button 
            @click="goToCheckout"
            :disabled="cart.items.length === 0"
            class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition duration-150 disabled:bg-zinc-900 disabled:text-zinc-650 disabled:border shadow-md"
          >
            Passer au Paiement &raquo;
          </button>
        </div>

      </div>

    </div>

    <!-- AUDIO FOR BARCODE BEEP SIMULATION -->
    <audio ref="beepAudio" src="https://assets.mixkit.co/active_storage/sfx/911/911-500.wav" preload="auto"></audio>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

import { 
  session, 
  cart, 
  openRegister, 
  addToCart, 
  removeFromCart, 
  updateCartQty, 
  setItemDiscount,
  cartSubtotalHT,
  cartDiscountAmount,
  cartTaxAmount,
  cartTotalTTC
} from '@/composables/usePOS.js';

import { stores, products } from '@/utils/supplier_db.js';

const router = useRouter();
const toast = useToast();

const openingStoreId = ref('');
const openingBalance = ref(50000);

const searchQuery = ref('');
const barcodeQuery = ref('');
const selectedCategory = ref('all');

const isScanningEffect = ref(false);
const beepAudio = ref(null);

// Pull unique active sectors/categories from products
const activeSectors = computed(() => {
  const categoriesList = ['Agriculture', 'BTP', 'Export Cacao', 'Énergies Solaire', 'Collectivités'];
  return categoriesList;
});

// Calculate filter list
const filteredProducts = computed(() => {
  let list = products.value;

  // Category filter mapping
  if (selectedCategory.value !== 'all') {
    const term = selectedCategory.value.toLowerCase().slice(0, 5);
    list = list.filter(p => p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term));
  }

  // Search filter
  if (searchQuery.value.trim() !== '') {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.sku.toLowerCase().includes(q)
    );
  }

  return list.slice(0, 36); // Limit for clean ui rendering
});

function handleOpenRegister() {
  if (!openingStoreId.value) {
    toast.error('Veuillez spécifier le magasin de vente.');
    return;
  }
  openRegister(openingStoreId.value, openingBalance.value, 'Jean Dupont');
}

function handleClearCart() {
  cart.value.items = [];
  toast.warning('Panier vidé.');
}

function triggerAddToCart(product) {
  addToCart(product, 1);
}

function calculateItemTotal(item) {
  let sub = item.price * item.qty;
  if (item.discountType === 'percentage') {
    sub -= (sub * (item.discountValue / 100));
  } else if (item.discountType === 'fixed') {
    sub -= (item.discountValue * item.qty);
  }
  return Math.max(0, sub);
}

// play simulation auditory trigger and scan
function mockScan(sku) {
  barcodeQuery.value = sku;
  handleBarcodeScan();
}

function handleBarcodeScan() {
  if (!session.value.isOpen) {
    toast.error('Caisse fermée ! Ouvrez la caisse d’abord.');
    return;
  }

  const query = barcodeQuery.value.trim().toUpperCase();
  if (!query) return;

  isScanningEffect.value = true;
  
  // Auditory beep effect helper
  try {
    if (beepAudio.value) {
      beepAudio.value.currentTime = 0;
      beepAudio.value.play().catch(() => {});
    }
  } catch(e) {}

  setTimeout(() => {
    isScanningEffect.value = false;
    
    // Find product matching barcode/sku
    const matched = products.value.find(p => p.sku === query || p.id === query);
    
    if (matched) {
      addToCart(matched, 1);
      barcodeQuery.value = '';
    } else {
      toast.error(`Aucun produit trouvé pour le code: "${query}"`);
    }
  }, 300);
}

function goToCheckout() {
  if (cart.value.items.length === 0) {
    toast.error('Le panier est vide !');
    return;
  }
  router.push('/pos/payment');
}
</script>
