<template>
  <div class="sticky top-0 z-50 select-none">
    <!-- DYNAMIC HIGHLIGHT TICKER -->
    <div class="bg-gradient-to-r from-emerald-950 via-teal-950 to-emerald-900 border-b border-emerald-800 text-emerald-300 py-2.5 px-4 overflow-hidden relative text-base font-mono flex items-center shrink-0">
      <div class="flex items-center space-x-2 shrink-0 bg-emerald-900 px-3 py-1 rounded text-xs uppercase font-bold text-white z-10 animate-pulse tracking-wider">
        <FireIcon class="h-5 w-5 mr-1" aria-hidden="true" />
        <span>PROMO FLASH</span>
      </div>
      
      <!-- Defiling Text -->
      <div class="flex-1 whitespace-nowrap overflow-hidden relative ml-3 text-base">
        <div class="inline-block animate-marquee uppercase tracking-wide">
          [DOUALA PORT SPECIAL] Poivre Blanc de Penja -15% sur les commandes groupées &bull; [COOP-NORD] Stock exceptionnel d'Oignons et Maïs Blanc séché à Garoua &bull; [LUMBER YARD] Expédition de bois certifié vers l'Afrique Centrale &bull; [SOLAR ECO] Batteries Gel MTN/Orange Connectivité Pro dispo à Yaoundé &bull; [AGRO-EXPORT] Prix bord champ du Cacao camerounais stable à 3,200 CFA/kg.
        </div>
      </div>

      <!-- Quick Session Indicator -->
      <div class="hidden sm:flex items-center space-x-2 text-slate-400 text-sm shrink-0 ml-4 font-sans">
        <span class="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
        <span class="font-mono text-xs text-emerald-400">DEV SIMULATOR ACTIVE</span>
      </div>
    </div>

    <!-- MAIN NAVBAR CONTAINER -->
    <header class="bg-white dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      
      <!-- LOGO BRANDING -->
      <router-link to="/" class="flex items-center space-x-3 shrink-0 group" aria-label="Kong S.A. Homepage">
        <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-950/40 border border-emerald-400/20 group-hover:scale-105 transition-transform duration-300">
          <ShoppingCartIcon class="h-6 w-6 text-[#1A1A1A]" aria-hidden="true" />
        </div>
        <div class="flex flex-col">
          <span class="font-mono text-sm font-bold text-emerald-400 tracking-widest leading-none uppercase">KONG S.A.</span>
          <span class="font-sans text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">B2B Cameroon Hub</span>
        </div>
      </router-link>

      <!-- NAVIGATION CENTRAL -->
      <nav class="hidden lg:flex items-center space-x-8 text-base font-mono">
        <router-link 
          to="/products" 
          class="transition text-slate-300 hover:text-emerald-400 px-3 py-2"
          :class="isRouteActive('/products') ? 'text-emerald-400 font-bold bg-white dark:bg-slate-900 border-b-2 border-emerald-400' : ''"
        >
          Browse Products
        </router-link>
        
        <router-link 
          to="/suppliers" 
          class="transition text-slate-300 hover:text-emerald-400 px-3 py-2"
          :class="isRouteActive('/suppliers') ? 'text-emerald-400 font-bold bg-white dark:bg-slate-900 border-b-2 border-emerald-400' : ''"
        >
          Wholesale Suppliers
        </router-link>

        <router-link 
          to="/categories" 
          class="transition text-slate-300 hover:text-emerald-400 px-3 py-2"
          :class="isRouteActive('/categories') ? 'text-emerald-400 font-bold bg-white dark:bg-slate-900 border-b-2 border-emerald-400' : ''"
        >
          Categories Matrix
        </router-link>

        <router-link 
          to="/about" 
          class="transition text-slate-405 hover:text-emerald-400 px-3 py-2"
          :class="isRouteActive('/about') ? 'text-emerald-400 font-bold bg-white dark:bg-slate-900 border-b-2 border-emerald-400' : ''"
        >
          Kribi Port Hub Info
        </router-link>
      </nav>

      <!-- UTILITIES RIGHT -->
      <div class="flex items-center space-x-4 text-base">
        
        <!-- NOTIFICATION BELL -->
        <NotificationBell class="mr-1" />

        <!-- COMPARE LIST SHORTCUT BUTTON -->
        <button 
          @click="$emit('toggle-compare')"
          class="p-2.5 rounded-none bg-white dark:bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 transition relative flex items-center"
          title="Product Comparison Matrix"
          aria-label="Product Comparison Matrix"
        >
          <ScaleIcon class="h-6 w-6" aria-hidden="true" />
          <span v-if="compareCount > 0" class="absolute -top-1 -right-1 bg-teal-500 text-[#1A1A1A] text-xs font-bold font-mono h-5 w-5 rounded-full flex items-center justify-center animate-bounce">
            {{ compareCount }}
          </span>
        </button>

        <!-- WISHLIST INTERACTIVE BUTTON -->
        <div class="relative">
          <button 
            @click="isWishlistOpen = !isWishlistOpen; $emit('close-compare')"
            class="p-2.5 rounded-none bg-white dark:bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-500 transition relative flex items-center"
            title="My Saved Wishlist"
            aria-label="My Saved Wishlist"
          >
            <HeartIcon class="h-6 w-6" :class="wishlistCount > 0 ? 'text-rose-500 fill-rose-500' : ''" aria-hidden="true" />
            <span v-if="wishlistCount > 0" class="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold font-mono h-5 w-5 rounded-full flex items-center justify-center">
              {{ wishlistCount }}
            </span>
          </button>
          
          <!-- Quick dropdown wishlist -->
          <div v-show="isWishlistOpen" class="origin-top-right absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-800 p-4 z-50 overflow-hidden text-slate-100 shadow-xl">
            <div class="flex justify-between items-center mb-3">
              <span class="text-xs font-mono tracking-wider text-rose-400 uppercase font-bold flex items-center">
                <HeartIcon class="h-5 w-5 mr-1" aria-hidden="true" />
                MY WISHLIST ({{ wishlistCount }})
              </span>
              <button @click="isWishlistOpen = false" class="text-slate-500 hover:text-white font-bold text-xs font-mono" aria-label="Close Wishlist">[ CLOSE ]</button>
            </div>
            
            <div class="max-h-60 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
              <p v-if="wishlist.length === 0" class="text-center py-6 text-slate-500 text-sm font-mono">
                Wishlist is empty.
              </p>
              
              <div 
                v-for="prod in wishlist" 
                :key="prod.id"
                class="flex items-center justify-between p-2 bg-white dark:bg-slate-950 border border-slate-900 hover:border-emerald-950 transition group"
              >
                <div class="flex items-center space-x-3 truncate">
                  <img :src="prod.image" class="h-8 w-8 object-cover" alt="" />
                  <div class="truncate text-sm">
                    <p class="font-semibold text-slate-200 truncate leading-tight">{{ prod.name }}</p>
                    <p class="font-mono text-emerald-400 mt-0.5">{{ formatCFA(prod.price) }}</p>
                  </div>
                </div>

                <div class="flex items-center space-x-1.5 shrink-0">
                  <button 
                    @click="$emit('add-to-cart', prod); isWishlistOpen = false"
                    class="p-1.5 px-3 bg-emerald-950 text-emerald-400 hover:bg-emerald-400 hover:text-[#1A1A1A] text-xs font-mono font-bold uppercase transition"
                    aria-label="Add to cart"
                  >
                    Add
                  </button>
                  <button 
                    @click="$emit('toggle-wishlist', prod)"
                    class="text-red-500 hover:text-red-400 p-1 text-lg font-normal leading-none"
                    aria-label="Remove item"
                  >
                    &times;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- MULTI SUPPLIER SHOPPING CART CONTROLLER -->
        <div class="relative">
          <router-link 
            to="/cart"
            class="p-2.5 px-4 rounded-none bg-emerald-950/30 hover:bg-emerald-950/60 text-emerald-400 border border-emerald-900/40 hover:border-emerald-600 transition relative flex items-center space-x-2 font-mono"
            title="Multi-Seller Basket"
            aria-label="View Shopping Cart"
          >
            <ShoppingCartIcon class="h-6 w-6" aria-hidden="true" />
            <span class="text-sm font-bold hidden sm:inline">{{ formatCFA(cartTotal) }}</span>
            <span class="bg-emerald-500 text-[#1A1A1A] text-xs font-extrabold px-2 py-0.5 rounded-full font-mono shrink-0">
              {{ cartCount }}
            </span>
          </router-link>
        </div>

        <!-- DEEP-LINK WORKSPACE ACCORDIAN PORTER -->
        <div class="relative">
          <button 
            @click="isPortalMenuOpen = !isPortalMenuOpen; isWishlistOpen = false"
            class="px-4 py-2.5 bg-gradient-to-r from-[#0d1c22] to-[#122b33] text-emerald-400 hover:text-white border border-emerald-900/50 hover:border-emerald-650 font-mono text-sm uppercase font-bold tracking-wider flex items-center space-x-2 transition duration-150 relative"
            aria-label="Open portal gateways navigation"
          >
            <span class="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Gateways</span>
            <span class="text-xs transition-transform duration-200" :class="isPortalMenuOpen ? 'rotate-180': ''">&#9662;</span>
          </button>
          
          <div v-show="isPortalMenuOpen" class="origin-top-right absolute right-0 mt-3 w-72 bg-white dark:bg-slate-900 border border-slate-800 p-4 z-50 text-slate-100 shadow-xl">
            <h4 class="text-xs font-mono uppercase tracking-wider text-slate-500 mb-3 font-bold px-1.5">SECURE PORTALS</h4>
            
            <div class="space-y-2">
              <router-link 
                to="/buyer/dashboard" 
                class="flex items-center space-x-3 p-3 bg-white dark:bg-slate-950 hover:bg-[#0c2226] hover:text-emerald-400 border border-slate-900 hover:border-emerald-950 transition text-left"
                @click="isPortalMenuOpen = false"
              >
                <ShoppingCartIcon class="h-6 w-6 text-emerald-500 shrink-0" aria-hidden="true" />
                <div>
                  <div class="text-sm font-mono uppercase font-bold leading-tight">Buyer Desk</div>
                  <div class="text-xs text-slate-500 font-mono">Quotes, Loyalty, Order History</div>
                </div>
              </router-link>

              <router-link 
                to="/supplier/dashboard" 
                class="flex items-center space-x-3 p-3 bg-white dark:bg-slate-950 hover:bg-indigo-950/20 hover:text-indigo-400 border border-slate-900 hover:border-indigo-905 transition text-left"
                @click="isPortalMenuOpen = false"
              >
                <BuildingOfficeIcon class="h-6 w-6 text-indigo-400 shrink-0" aria-hidden="true" />
                <div>
                  <div class="text-sm font-mono uppercase font-bold leading-tight">Supplier Station</div>
                  <div class="text-xs text-slate-500 font-mono">Crop Inventory, Warehousing, RFQs</div>
                </div>
              </router-link>

              <router-link 
                to="/pos" 
                class="flex items-center space-x-3 p-3 bg-white dark:bg-slate-950 hover:bg-emerald-950/20 hover:text-emerald-350 border border-slate-900 hover:border-emerald-850 transition text-left"
                @click="isPortalMenuOpen = false"
              >
                <GlobeAltIcon class="h-6 w-6 text-emerald-400 shrink-0" aria-hidden="true" />
                <div>
                  <div class="text-sm font-mono uppercase font-bold leading-tight">Retail POS</div>
                  <div class="text-xs text-slate-500 font-mono">Cashier Grid, Ticket invoices</div>
                </div>
              </router-link>

              <router-link 
                to="/admin/dashboard" 
                class="flex items-center space-x-3 p-3 bg-white dark:bg-slate-950 hover:bg-amber-950/20 hover:text-amber-500 border border-slate-900 hover:border-amber-900 transition text-left"
                @click="isPortalMenuOpen = false"
              >
                <KeyIcon class="h-6 w-6 text-amber-500 shrink-0" aria-hidden="true" />
                <div>
                  <div class="text-sm font-mono uppercase font-bold leading-tight">Platform Central</div>
                  <div class="text-xs text-slate-500 font-mono">Escrow balances, Audits & Analytics</div>
                </div>
              </router-link>
            </div>
            
            <div class="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 font-mono flex justify-between items-center px-1">
              <span>ACTIVE ROLE:</span>
              <span class="text-emerald-500 font-bold uppercase">{{ userRole }}</span>
            </div>
          </div>
        </div>

      </div>
    </header>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import NotificationBell from '@/components/notifications/NotificationBell.vue';
import { 
  ShoppingCartIcon, 
  HeartIcon, 
  ScaleIcon, 
  FireIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  KeyIcon 
} from '@heroicons/vue/24/outline';

const props = defineProps({
  wishlist: { type: Array, default: () => [] },
  wishlistCount: { type: Number, default: 0 },
  compareCount: { type: Number, default: 0 },
  cartCount: { type: Number, default: 0 },
  cartTotal: { type: Number, default: 0 },
  userRole: { type: String, default: 'GUEST' }
});

const emit = defineEmits([
  'toggle-compare', 
  'close-compare', 
  'add-to-cart', 
  'toggle-wishlist'
]);

const isWishlistOpen = ref(false);
const isPortalMenuOpen = ref(false);
const route = useRoute();

function isRouteActive(pathname) {
  return route.path === pathname || route.path.startsWith(pathname + '/');
}

function formatCFA(val) {
  if (val === undefined || val === null) return '0 CFA';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('FCFA', 'CFA').replace('XAF', 'CFA');
}
</script>
