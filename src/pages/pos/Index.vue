<template>
  <div class="h-full select-none text-slate-100">
    <!-- CASE A: CAISSE FERMÉE (SESSION STATUS: LOCKED) -->
    <div v-if="!session.isOpen" class="max-w-md mx-auto my-12 bg-[#14141E] border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden animate-slide-up">
      <div class="absolute -right-16 -top-16 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
      
      <div class="space-y-6">
        <div class="flex items-center space-x-3 pb-4 border-b border-slate-800">
          <span class="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-900/30">
            <LockClosedIcon class="w-6 h-6" />
          </span>
          <div>
            <h2 class="text-sm font-bold uppercase text-slate-200 tracking-wider">Ouverture de Caisse</h2>
            <p class="text-[9px] text-slate-500 tracking-tight font-mono">SYS_REGISTER_LOCKSTATE_ENGAGED</p>
          </div>
        </div>

        <p class="text-xs text-slate-400 leading-relaxed">
          Veuillez sélectionner le point de vente d'affectation et renseigner le fonds de caisse initial pour activer la console de vente.
        </p>

        <form @submit.prevent="handleOpenRegister" class="space-y-4 text-xs font-mono">
          <!-- Selection Magasin -->
          <div class="space-y-1">
            <label class="block text-[10px] uppercase text-slate-400 mb-1 font-bold">Magasin / Point de Vente</label>
            <select 
              v-model="openingStoreId"
              required
              class="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-emerald-400 font-bold focus:outline-none focus:border-indigo-500"
            >
              <option value="" disabled>--- SÉLECTIONNER UN MAGASIN ---</option>
              <option v-for="store in stores" :key="store.id" :value="store.id">
                {{ store.name }} ({{ store.city }})
              </option>
            </select>
          </div>

          <!-- Fonds de caisse -->
          <div class="space-y-1">
            <label class="block text-[10px] uppercase text-slate-400 mb-1 font-bold">Fonds de caisse initial (FCFA)</label>
            <div class="relative">
              <input 
                type="number" 
                v-model="openingBalance"
                required
                min="0"
                step="500"
                placeholder="Ex. 50000"
                class="w-full bg-slate-950 border border-slate-800 px-3 py-2 pl-8 rounded-xl text-emerald-300 font-mono font-semibold focus:outline-none focus:border-indigo-500"
              />
              <span class="absolute left-3 top-2 text-slate-500 font-mono">₣</span>
            </div>
            <p class="text-[9px] text-slate-500 mt-1">Calcul des écarts basé sur cette somme d'ouverture.</p>
          </div>

          <!-- Caissier -->
          <div class="space-y-1">
            <label class="block text-[10px] uppercase text-slate-400 mb-1">Caissier Référent</label>
            <input 
              type="text" 
              disabled
              value="Jean Dupont (DMS_MANAGER_02)"
              class="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-slate-400 font-mono"
            />
          </div>

          <button 
            type="submit"
            class="w-full py-3 bg-indigo-650 text-white hover:bg-indigo-600 border border-indigo-500/30 font-mono font-bold text-xs rounded-xl transition uppercase tracking-wider shadow-lg shadow-indigo-950/20"
          >
            Saisir &amp; Activer Console [ Enter ]
          </button>
        </form>
      </div>
    </div>

    <!-- CASE B: CAISSE OUVERTE (TERMINAL ACTIVE) -->
    <div v-else class="h-full flex flex-col space-y-4">
      
      <!-- POS Top Bar -->
      <div class="flex justify-between items-center bg-[#14141E] border border-slate-800 p-3 rounded-xl shrink-0">
        <div class="flex items-center space-x-3">
          <span class="text-xs text-slate-400 font-mono">Session :</span>
          <span class="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded font-bold text-[10px] uppercase font-mono">Active</span>
          <span class="text-xs text-slate-600">|</span>
          <span class="text-xs text-slate-400 font-mono">Fonds initial: <strong class="text-slate-200">{{ session.openingBalance.toLocaleString() }} FCFA</strong></span>
        </div>
        <button @click="showCloseModal = true" class="px-3 py-1.5 bg-red-950/40 text-red-400 border border-red-900/50 hover:bg-red-900 text-xs font-bold uppercase rounded transition flex items-center space-x-2">
          <LockClosedIcon class="w-4 h-4" />
          <span>Fermer la Caisse (Z)</span>
        </button>
      </div>

      <!-- MAIN POS GRID -->
      <div class="grid grid-cols-1 lg:grid-cols-10 gap-6 flex-1 min-h-0">
        
        <!-- LEFT AREA: SEARCH, BARCODE AND CATALOG GRID (60% equivalent: col-span-6) -->
        <div class="lg:col-span-6 flex flex-col space-y-4 min-h-0">
        
        <!-- SEARCH & BARCODE CONTROLS -->
        <div class="bg-[#14141E] border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
          
          <!-- Live search text input -->
          <div class="w-full md:w-72 relative shrink-0">
            <input 
              type="text" 
              v-model="searchQuery"
              placeholder="Recherche nom ou SKU..."
              class="w-full bg-slate-950 border border-slate-850 px-3 py-1.5 pl-8 rounded-lg text-emerald-300 placeholder-slate-700 font-mono text-xs focus:outline-none focus:border-indigo-500"
            />
            <span class="absolute left-2.5 top-2 text-slate-500">
              <MagnifyingGlassIcon class="w-4 h-4" />
            </span>
          </div>

          <!-- Barcode simulation input -->
          <div class="w-full flex-1 flex items-center gap-2 relative">
            <span class="text-[10px] uppercase text-slate-400 font-bold hidden xl:block shrink-0">Lecteur Code-barres :</span>
            <div class="relative flex-1">
              <input 
                type="text" 
                ref="barcodeInput"
                v-model="barcodeQuery"
                @keyup.enter="handleBarcodeScan"
                placeholder="Scanner SKU..."
                class="w-full bg-slate-950 border border-slate-850 px-3 py-1.5 pl-8 rounded-lg text-emerald-450 font-mono text-xs focus:outline-none focus:border-indigo-500"
                :class="{ 'animate-pulse border-emerald-500 bg-emerald-950/20': isScanningEffect }"
              />
              <span class="absolute left-2.5 top-2 text-slate-500">
                <QrCodeIcon class="w-4 h-4 text-slate-500" />
              </span>
            </div>
            
            <button 
              @click="handleBarcodeScan"
              class="px-3.5 py-1.5 bg-indigo-650 border border-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-600 font-bold transition shrink-0 uppercase"
            >
              Scan
            </button>
          </div>

          <!-- Quick mock scan templates -->
          <div class="flex items-center gap-1.5 overflow-x-auto shrink-0 max-w-xs py-1">
            <span class="text-[9px] text-slate-400 font-bold">MOCK :</span>
            <button 
              v-for="mockSku in ['CMR-PROD-AGR-0001', 'CMR-PROD-AGR-0011', 'CMR-PROD-EXP-0002']" 
              :key="mockSku"
              @click="mockScan(mockSku)"
              class="text-[9px] font-mono px-1.5 py-0.5 bg-slate-950 text-slate-400 border border-slate-850 rounded-lg hover:border-indigo-550 hover:text-indigo-400"
            >
              {{ mockSku.slice(-8) }}
            </button>
          </div>

        </div>

        <!-- CATEGORIES SELECT BAR -->
        <div class="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
          <button 
            @click="selectedCategory = 'all'"
            class="px-3 py-1.5 text-[10px] uppercase font-mono font-bold rounded-lg shrink-0 border transition-all duration-150"
            :class="selectedCategory === 'all' ? 'bg-indigo-950 text-indigo-400 border-indigo-805/50' : 'bg-slate-950 text-slate-450 border-slate-850 hover:text-slate-200'"
          >
            TOUS LES PRODUITS
          </button>
          <button 
            v-for="cat in activeSectors"
            :key="cat"
            @click="selectedCategory = cat"
            class="px-3 py-1.5 text-[10px] uppercase font-mono font-bold rounded-lg shrink-0 border transition-all duration-150"
            :class="selectedCategory === cat ? 'bg-indigo-950 text-indigo-400 border-indigo-805/50' : 'bg-slate-950 text-slate-450 border-slate-855 hover:text-slate-200'"
          >
            {{ cat }}
          </button>
        </div>

        <!-- PRODUCTS LIST GRID -->
        <div class="flex-1 overflow-y-auto max-h-[calc(100vh-250px)] pr-1">
          <div v-if="filteredProducts.length === 0" class="text-center py-16 bg-[#14141E] border border-slate-800 rounded-2xl">
            <ExclamationTriangleIcon class="w-8 h-8 text-slate-500 mx-auto" />
            <p class="text-xs text-slate-500 font-mono mt-2">Aucun produit ne correspond à ces critères de recherche.</p>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div 
              v-for="product in filteredProducts" 
              :key="product.id"
              @click="triggerAddToCart(product)"
              class="relative bg-[#14141E] border p-4 rounded-xl flex flex-col justify-between transition hover:border-indigo-500/50 hover:bg-slate-900/20 cursor-pointer group"
              :class="product.stock <= 0 ? 'opacity-50 border-slate-900 pointer-events-none' : 'border-slate-800'"
            >
              <!-- FIFO Batch HUD overlay -->
              <div class="absolute right-3 top-3 px-1.5 py-0.5 rounded text-[8.5px] uppercase font-mono bg-slate-950/80 border text-slate-400" :class="product.stock < 50 ? 'border-amber-900 text-amber-500' : 'border-slate-850 text-emerald-455'">
                STOCK: <strong :class="product.stock < 50 ? 'text-amber-400' : 'text-emerald-400'">{{ product.stock }} {{ product.unit || 'uds' }}</strong>
              </div>

              <div class="space-y-3">
                <span class="text-[8.5px] text-slate-500 font-bold uppercase tracking-wider block font-mono">
                  SKU: {{ product.sku }}
                </span>
                
                <h3 class="text-xs font-bold text-slate-200 line-clamp-2 leading-tight group-hover:text-indigo-400">
                  {{ product.name }}
                </h3>

                <!-- Batches hover or detail HUD -->
                <div class="p-2 bg-slate-950 rounded-lg text-[8.5px] text-slate-400 font-mono space-y-1">
                  <div class="text-[8px] uppercase tracking-wider text-indigo-400 font-bold">Batches FIFO actifs :</div>
                  <div class="flex justify-between" v-for="b in (product.batches || []).slice(0, 2)" :key="b.id">
                    <span>📅 {{ b.date }}</span>
                    <strong class="text-slate-300">{{ b.qty }} u @ {{ Math.round(b.price) }} ₣</strong>
                  </div>
                  <div v-if="(product.batches || []).length > 2" class="text-[7.5px] text-center text-slate-500">
                    +{{ (product.batches || []).length - 2 }} autres lots
                  </div>
                </div>
              </div>

              <div class="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center">
                <span class="text-[9.5px] text-slate-500 font-mono lowercase">par {{ product.unit }}</span>
                <span class="text-xs font-bold text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-900/60 px-2 py-0.5 rounded">
                  {{ Math.round(product.price).toLocaleString() }} FCFA
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- RIGHT AREA: REAL-TIME CART PREVIEW & QUICK ACTIONS (40% equivalent: col-span-4) -->
      <div class="lg:col-span-4 bg-[#14141E] border border-slate-800 p-4 rounded-xl flex flex-col justify-between max-h-[calc(100vh-140px)] overflow-y-auto">
        
        <div>
          <!-- Cart Header -->
          <div class="flex justify-between items-center pb-3 border-b border-slate-800 mb-4">
            <h2 class="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-400 flex items-center space-x-1.5">
              <ShoppingCartIcon class="w-4 h-4" />
              <span>Panier en cours ({{ cart.items.length }})</span>
            </h2>
            <button 
              v-if="cart.items.length > 0"
              @click="handleClearCart"
              class="text-[9px] hover:text-red-400 text-slate-500 uppercase font-bold"
            >
              [ VIDER ]
            </button>
          </div>

          <!-- Customer Name & Phone for logging -->
          <div class="grid grid-cols-2 gap-2 mb-4 font-mono text-[9px]">
            <div class="space-y-1">
              <label class="block text-slate-500 uppercase font-bold">Tél Client</label>
              <input 
                type="text" 
                v-model="cart.customerPhone"
                placeholder="6XXXXXXXX"
                class="w-full bg-slate-950 border border-slate-850 px-2 py-1.5 text-emerald-400 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div class="space-y-1">
              <label class="block text-slate-500 uppercase font-bold">Nom Client</label>
              <input 
                type="text" 
                v-model="cart.customerName"
                placeholder="Client Comptant"
                class="w-full bg-slate-950 border border-slate-850 px-2 py-1.5 text-emerald-400 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <!-- Cart Stream -->
          <div class="space-y-3.5 overflow-y-auto max-h-[280px] lg:max-h-[380px] pr-0.5 scrollbar-thin">
            <div 
              v-for="item in cart.items" 
              :key="item.productId"
              class="p-2.5 bg-slate-950 rounded-lg border border-slate-850 transition hover:border-indigo-500/30"
            >
              <div class="flex justify-between items-start">
                <span class="text-[10px] font-bold text-slate-205 block truncate max-w-[150px]">
                  {{ item.name }}
                </span>
                <button 
                  @click="removeFromCart(item.productId)"
                  class="text-slate-500 hover:text-red-500 transition"
                >
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </div>

              <div class="flex justify-between items-center mt-2.5 font-mono text-[9.5px]">
                <!-- Increment Decrement controls -->
                <div class="flex items-center space-x-1.5">
                  <button 
                    @click="updateCartQty(item.productId, item.qty - 1)"
                    class="h-5 w-5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 font-bold flex items-center justify-center hover:bg-slate-800"
                  >
                    -
                  </button>
                  <span class="font-bold text-emerald-400 w-5 text-center">{{ item.qty }}</span>
                  <button 
                    @click="updateCartQty(item.productId, item.qty + 1)"
                    class="h-5 w-5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 font-bold flex items-center justify-center hover:bg-slate-800"
                  >
                    +
                  </button>
                </div>

                <!-- Price label -->
                <div class="text-right">
                  <span class="text-slate-500 line-through mr-1 block text-[8px]" v-if="item.discountType !== 'none'">
                    {{ (item.price * item.qty).toLocaleString() }} ₣
                  </span>
                  <span class="font-bold text-slate-300">
                    {{ Math.round(calculateItemTotal(item)).toLocaleString() }} FCFA
                  </span>
                </div>
              </div>

              <!-- Quick Discount Line -->
              <div class="mt-1.5 flex items-center justify-between border-t border-slate-900 pt-1 text-[8.5px] font-mono">
                <span class="text-slate-500">Remise article :</span>
                <div class="flex items-center gap-1">
                  <select 
                    v-model="item.discountType"
                    @change="setItemDiscount(item.productId, item.discountType, item.discountValue)"
                    class="bg-black border border-slate-850 text-[8px] text-slate-400 rounded px-1"
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
                    class="w-8 bg-black border border-slate-850 text-[8px] text-slate-200 text-center rounded"
                    placeholder="0"
                  />
                </div>
              </div>

            </div>

            <!-- Empty cart reminder -->
            <div v-show="cart.items.length === 0" class="text-center py-12 text-slate-500 font-mono text-xs">
              Mettez des articles dans le panier B2B pour commencer.
            </div>
          </div>
        </div>

        <!-- Totals & Checkout Trigger Drawer -->
        <div class="border-t border-slate-800 pt-3 mt-4 space-y-2">
          
          <div class="flex justify-between items-center text-[9px] font-mono">
            <span class="text-slate-500">Sous-total HT :</span>
            <span class="text-slate-300">{{ cartSubtotalHT.toLocaleString() }} ₣</span>
          </div>

          <div class="flex justify-between items-center text-[9px] font-mono">
            <span class="text-slate-500">Remise globale :</span>
            <div class="flex items-center gap-1">
              <select 
                v-model="cart.globalDiscountType"
                class="bg-black border border-slate-850 text-[8px] text-slate-400 rounded"
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
                class="w-10 bg-black border border-slate-850 text-[8px] text-center rounded text-emerald-450"
                placeholder="Val"
              />
            </div>
          </div>

          <div class="flex justify-between items-center text-[9px] font-mono">
            <span class="text-slate-500">TVA (19.25%) :</span>
            <span class="text-slate-300">{{ Math.round(cartTaxAmount).toLocaleString() }} ₣</span>
          </div>

          <div class="flex justify-between items-center text-sm font-bold pt-2 border-t border-slate-800 font-mono">
            <span class="text-slate-200 uppercase tracking-widest text-[9.5px]">TOTAL TTC :</span>
            <span class="text-emerald-400 font-bold text-lg font-mono">
              {{ Math.round(cartTotalTTC).toLocaleString() }} FCFA
            </span>
          </div>

          <button 
            @click="goToCheckout"
            :disabled="cart.items.length === 0"
            class="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition duration-150 disabled:bg-slate-900 disabled:text-slate-600 disabled:border shadow-md"
          >
            Passer au Paiement &raquo;
          </button>
        </div>

      </div>
    </div>

  </div>

    <!-- Z-REPORT CLOSING MODAL -->
    <div v-if="showCloseModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="bg-[#14141E] border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        <div class="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
          <h2 class="text-lg font-bold text-slate-100 font-mono uppercase tracking-wider flex items-center gap-2">
            <LockClosedIcon class="w-5 h-5 text-red-400" />
            Clôture de Caisse (Rapport Z)
          </h2>
          <button @click="showCloseModal = false" class="text-slate-500 hover:text-slate-300 transition">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        
        <div class="p-6 space-y-6 overflow-y-auto font-mono text-sm">
          <!-- Summary Expected -->
          <div class="space-y-2">
            <div class="flex justify-between text-slate-400">
              <span>Fonds initial :</span>
              <span class="text-slate-300">{{ session.openingBalance.toLocaleString() }} ₣</span>
            </div>
            <div class="flex justify-between text-slate-400 border-b border-slate-800 pb-2">
              <span>Ventes de la session (Théorique) :</span>
              <span class="text-emerald-400 font-bold">+ {{ session.sessionSales.toLocaleString() }} ₣</span>
            </div>
            <div class="flex justify-between text-slate-200 font-bold pt-2 text-base">
              <span>Espèces attendues en caisse :</span>
              <span class="text-indigo-400">{{ expectedCashInDrawer.toLocaleString() }} FCFA</span>
            </div>
          </div>

          <!-- Actual counted -->
          <div class="space-y-2 pt-4 border-t border-slate-800">
            <label class="block text-xs uppercase text-slate-400 font-bold">Total espèces compté physiquement :</label>
            <div class="relative">
              <input 
                type="number" 
                v-model="actualCashCounted"
                min="0"
                step="100"
                class="w-full bg-slate-950 border border-slate-800 px-4 py-3 pl-10 rounded-xl text-emerald-300 font-bold text-lg focus:outline-none focus:border-indigo-500"
              />
              <span class="absolute left-4 top-3.5 text-slate-500 text-lg">₣</span>
            </div>
          </div>

          <!-- Variance -->
          <div class="p-4 rounded-xl border flex justify-between items-center" :class="varianceClass">
            <span class="text-xs uppercase font-bold">Écart de caisse :</span>
            <span class="font-bold text-lg">{{ cashVariance > 0 ? '+' : '' }}{{ cashVariance.toLocaleString() }} FCFA</span>
          </div>

          <p v-if="cashVariance !== 0" class="text-xs text-amber-500 bg-amber-950/20 p-3 rounded-lg border border-amber-900/30">
            <strong>Attention :</strong> Une justification sera requise par le manager pour cet écart.
          </p>
        </div>

        <div class="p-4 border-t border-slate-800 bg-slate-900/30 flex justify-end gap-3">
          <button @click="showCloseModal = false" class="px-4 py-2 border border-slate-700 text-slate-300 hover:bg-slate-800 rounded-lg text-xs font-bold uppercase transition">
            Annuler
          </button>
          <button @click="confirmCloseRegister" class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-red-900/20">
            Valider la Fermeture
          </button>
        </div>
      </div>
    </div>

    <!-- AUDIO FOR BARCODE BEEP SIMULATION -->
    <audio ref="beepAudio" src="https://assets.mixkit.co/active_storage/sfx/911/911-500.wav" preload="auto"></audio>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useDebounceFn } from '@vueuse/core';

import { 
  session, 
  cart, 
  openRegister,
  closeRegister, 
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
import { 
  LockClosedIcon, 
  MagnifyingGlassIcon, 
  QrCodeIcon, 
  ShoppingCartIcon, 
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline';

const router = useRouter();
const toast = useToast();

const barcodeInput = ref(null);
const openingStoreId = ref('');
const openingBalance = ref(50000);

const searchQuery = ref('');
const debouncedSearchQuery = ref('');
const barcodeQuery = ref('');
const selectedCategory = ref('all');

const isScanningEffect = ref(false);
const beepAudio = ref(null);

const showCloseModal = ref(false);
const actualCashCounted = ref(0);

const expectedCashInDrawer = computed(() => {
  return (session.value?.openingBalance || 0) + (session.value?.sessionSales || 0);
});

const cashVariance = computed(() => {
  return actualCashCounted.value - expectedCashInDrawer.value;
});

const varianceClass = computed(() => {
  if (cashVariance.value === 0) return 'bg-emerald-950/20 border-emerald-900/50 text-emerald-400';
  if (cashVariance.value > 0) return 'bg-indigo-950/20 border-indigo-900/50 text-indigo-400'; // Excédent
  return 'bg-red-950/20 border-red-900/50 text-red-400'; // Manquant
});

// Debounce search query
const updateSearch = useDebounceFn((val) => {
  debouncedSearchQuery.value = val;
}, 300);

watch(searchQuery, (val) => updateSearch(val));

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

  // Search filter using debounced search query
  if (debouncedSearchQuery.value.trim() !== '') {
    const q = debouncedSearchQuery.value.toLowerCase().trim();
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
  // Auto-focus scanner on register open
  setTimeout(() => {
    barcodeInput.value?.focus();
  }, 100);
}

function confirmCloseRegister() {
  if (cashVariance.value !== 0 && !confirm(`Vous avez un écart de ${cashVariance.value} FCFA. Êtes-vous sûr de vouloir clôturer ?`)) {
    return;
  }
  closeRegister();
  showCloseModal.value = false;
  actualCashCounted.value = 0;
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
    barcodeInput.value?.focus();
  }, 300);
}

function goToCheckout() {
  if (cart.value.items.length === 0) {
    toast.error('Le panier est vide !');
    return;
  }
  router.push('/pos/payment');
}

onMounted(() => {
  if (session.value.isOpen) {
    setTimeout(() => {
      barcodeInput.value?.focus();
    }, 100);
  }
});
</script>

<style scoped>
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
  animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
