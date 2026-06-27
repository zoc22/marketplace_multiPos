<template>
  <div class="fixed top-0 left-0 w-full z-50 select-none shadow-sm dark:shadow-2xl transition-colors duration-300">
    
    <!-- MAIN NAVBAR CONTAINER -->
    <header class="bg-light-bg-main/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-amber-900/10 dark:border-[#0e181e] px-4 md:px-8 py-3.5 flex items-center justify-between transition-colors duration-300">
      
      <!-- LOGO BRANDING -->
      <router-link to="/" class="flex items-center space-x-2.5 shrink-0 group">
        <div class="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-900/20 dark:shadow-emerald-950/40 border border-accent-green/20 group-hover:scale-105 transition-transform duration-300">
          <svg class="h-5 w-5 text-text-main dark:text-text-main" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <div class="flex flex-col">
          <span class="font-sans text-sm font-black text-text-main dark:text-white tracking-widest leading-none uppercase transition-colors">KONG <span class="text-accent-green dark:text-accent-green">MARKET</span></span>
          <span class="font-sans text-[10px] font-medium text-button-orange dark:text-button-orange uppercase tracking-wider mt-0.5 transition-colors">La Marketplace Mondiale</span>
        </div>
      </router-link>

      <!-- NAVIGATION CENTRAL -->
      <nav class="hidden lg:flex items-center space-x-10 ml-20 text-[11px] font-sans font-bold uppercase tracking-wide">
        <router-link 
          to="/products" 
          class="transition px-4 py-2 rounded-lg"
          :class="isRouteActive('/products') ? 'text-button-orange dark:text-button-orange bg-button-orange/10' : 'text-text-sec dark:text-slate-300 hover:text-button-orange dark:hover:text-button-orange'"
        >
          Tous les Produits
        </router-link>
        
        <router-link 
          to="/suppliers" 
          class="transition px-3 py-1.5 rounded-lg"
          :class="isRouteActive('/suppliers') ? 'text-button-orange dark:text-button-orange bg-button-orange/10' : 'text-text-sec dark:text-slate-300 hover:text-button-orange dark:hover:text-button-orange'"
        >
          Boutiques Officielles
        </router-link>

        <router-link 
          to="/categories" 
          class="transition px-3 py-1.5 rounded-lg"
          :class="isRouteActive('/categories') ? 'text-button-orange dark:text-button-orange bg-button-orange/10' : 'text-text-sec dark:text-slate-300 hover:text-button-orange dark:hover:text-button-orange'"
        >
          Toutes les Catégories
        </router-link>

        <router-link 
          to="/about" 
          class="transition px-3 py-1.5 rounded-lg"
          :class="isRouteActive('/about') ? 'text-button-orange dark:text-button-orange bg-button-orange/10' : 'text-slate-500 dark:text-slate-400 hover:text-button-orange dark:hover:text-button-orange'"
        >
          Services & Livraison Globale
        </router-link>
      </nav>

      <!-- UTILITIES RIGHT -->
      <div class="flex items-center space-x-3 text-xs">
        
        <!-- AUTHENTICATION LINKS -->
        <div class="hidden sm:flex items-center space-x-2 mr-2">
          <router-link 
            to="/auth/login"
            class="text-text-sec dark:text-slate-300 hover:text-accent-green dark:hover:text-accent-green font-bold uppercase tracking-wider transition px-2 py-1"
          >
            Connexion
          </router-link>
          <span class="text-slate-300 dark:text-slate-700">|</span>
          <router-link 
            to="/auth/register"
            class="text-text-sec dark:text-slate-300 hover:text-accent-green dark:hover:text-accent-green font-bold uppercase tracking-wider transition px-2 py-1"
          >
            Inscription
          </router-link>
        </div>

        <!-- THEME TOGGLE -->
        <button 
          @click="toggleTheme"
          class="p-2 rounded-xl bg-light-bg-sec dark:bg-[#091114] border border-slate-200 dark:border-slate-800 hover:border-button-orange/40 text-text-sec dark:text-slate-400 hover:text-button-orange dark:hover:text-button-orange transition relative flex items-center"
          title="Basculer le Thème"
        >
          <svg v-if="!isLightTheme" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>

        <!-- COMPARE LIST SHORTCUT BUTTON -->
        <button 
          @click="isCompareOpen = !isCompareOpen"
          class="p-2 rounded-xl bg-light-bg-sec dark:bg-[#091114] border border-slate-200 dark:border-slate-800 hover:border-button-orange/40 text-text-sec dark:text-slate-400 hover:text-button-orange dark:hover:text-button-orange transition relative flex items-center"
          title="Outil de Comparaison"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
          </svg>
          <span v-if="cartStore.compareList.length > 0" class="absolute -top-1 -right-1 bg-button-orange text-text-main dark:text-text-main text-[9px] font-bold font-mono h-4 w-4 rounded-full flex items-center justify-center animate-bounce">
            {{ cartStore.compareList.length }}
          </span>
        </button>

        <!-- WISHLIST DIRECT LINK -->
        <div class="relative">
          <router-link 
            to="/wishlist"
            class="p-2 rounded-xl bg-light-bg-sec dark:bg-[#091114] border border-slate-200 dark:border-slate-800 hover:border-rose-500/40 text-text-sec dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-450 transition relative flex items-center"
            title="Mes Favoris"
          >
            <svg class="h-4 w-4 transition-colors" :class="cartStore.wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : 'text-text-sec dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span v-if="cartStore.wishlist.length > 0" class="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold font-mono h-4 w-4 rounded-full flex items-center justify-center">
              {{ cartStore.wishlist.length }}
            </span>
          </router-link>
        </div>

        <!-- MULTI SUPPLIER SHOPPING CART CONTROLLER -->
        <div class="relative">
          <router-link 
            to="/cart"
            class="p-2 px-3 rounded-xl bg-amber-100 dark:bg-button-orange/20 hover:bg-amber-200 dark:hover:bg-button-orange/40 text-button-orange dark:text-button-orange border border-amber-200 dark:border-button-orange/30 hover:border-amber-400 dark:hover:border-button-orange transition relative flex items-center space-x-2 font-mono"
            title="Mon Panier"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span class="text-[11px] font-bold hidden sm:inline">{{ formatCFA(cartStore.totalAmount) }}</span>
            <span class="absolute -top-1.5 -right-1.5 bg-accent-green text-text-main dark:text-text-main text-[9px] font-bold h-4.5 w-4.5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm shadow-emerald-950/50">
              {{ cartStore.totalItems }}
            </span>
          </router-link>
        </div>

      </div>

      <!-- MOBILE MENU BUTTON -->
      <button class="lg:hidden p-2 text-text-sec dark:text-slate-400 hover:text-button-orange dark:hover:text-button-orange">
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

    </header>

    <!-- MOBILE NAVIGATION MENU (Hidden by default, you can expand this later) -->
  </div>

  <!-- FLOATING COMPARE MATRIX DRAWER -->
  <transition
    enter-active-class="transition transform duration-500 ease-out"
    enter-from-class="translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition transform duration-300 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-full opacity-0"
  >
    <div v-if="isCompareOpen && cartStore.compareList.length > 0" class="fixed bottom-0 left-0 w-full z-50 p-4 pointer-events-none">
      <div class="bg-light-bg-main/95 dark:bg-[#070b12]/95 backdrop-blur-xl border border-divider dark:border-[#14262f] shadow-2xl rounded-3xl p-6 max-w-7xl mx-auto pointer-events-auto flex flex-col md:flex-row items-end gap-6 relative">
        
        <!-- Matrix Header -->
        <div class="w-full md:w-64 shrink-0 space-y-2 relative">
          <button @click="isCompareOpen = false" class="absolute -top-4 -left-4 bg-light-bg-sec dark:bg-[#0c161d] h-8 w-8 rounded-full border border-divider dark:border-[#1a313d] flex items-center justify-center text-text-sec dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-500 transition">
            &times;
          </button>
          <span class="text-[9px] font-mono uppercase bg-amber-100 dark:bg-amber-950 text-button-orange dark:text-button-orange px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900/40 font-bold">MATRICE D'ANALYSE</span>
          <h2 class="text-xl font-bold text-text-main dark:text-white uppercase font-mono tracking-tight leading-none">
            Comparatif de Lots B2B
          </h2>
          <p class="text-[10px] text-slate-500 dark:text-slate-400 font-sans">
            Sélectionnez les lots pour une vue croisée sur les prix, certificats et volumes disponibles en entrepôt.
          </p>
          <button 
            @click="cartStore.clearCompare()"
            class="mt-4 px-4 py-2 bg-light-bg-sec dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-light-bg-sec dark:bg-slate-800 text-[10px] uppercase font-bold text-text-sec dark:text-slate-400 border border-divider dark:border-slate-800 rounded-lg transition"
          >
            Vider la matrice
          </button>
        </div>

        <!-- Matrix Items -->
        <div class="flex-1 flex gap-4 overflow-x-auto pb-2 snap-x hide-scrollbar">
          <div 
            v-for="item in cartStore.compareList" 
            :key="item.id"
            class="w-64 shrink-0 bg-light-bg-main dark:bg-[#0a141a] border border-divider dark:border-[#172b36] rounded-2xl p-4 relative group snap-start"
          >
            <button 
              @click="cartStore.toggleCompare(item)"
              class="absolute top-2 right-2 h-6 w-6 rounded bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-500 hover:bg-rose-200 dark:hover:bg-rose-500 flex items-center justify-center hover:text-rose-800 dark:hover:text-white transition opacity-0 group-hover:opacity-100"
            >
              &times;
            </button>
            <div class="flex space-x-3">
              <img :src="item.image" class="h-14 w-14 rounded-xl object-cover border border-divider dark:border-slate-800" />
              <div class="flex-1">
                <span class="text-[9px] font-mono text-accent-green dark:text-accent-green uppercase font-bold">{{ item.sku }}</span>
                <h4 class="text-[11px] font-bold text-text-main dark:text-white uppercase leading-tight line-clamp-1 mt-0.5">{{ item.name }}</h4>
                <div class="text-xs font-black text-button-orange dark:text-button-orange mt-1 font-mono">{{ formatCFA(item.price) }}<span class="text-[9px] text-slate-500 dark:text-slate-500 ml-1">/{{ item.unit }}</span></div>
              </div>
            </div>
            
            <div class="mt-3 pt-3 border-t border-divider dark:border-slate-800/50 grid grid-cols-2 gap-2 text-[9px] font-mono">
              <div>
                <span class="text-slate-500 block uppercase">Stock Dispo</span>
                <span class="text-accent-green dark:text-accent-green font-bold">{{ item.stock }} {{ item.unit }}s</span>
              </div>
              <div>
                <span class="text-slate-500 block uppercase">Emplacement</span>
                <span class="text-cyan-600 dark:text-cyan-400 font-bold">{{ getCameroonRegion(item.id) }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '@/store/modules/cart.js';
import { useTheme } from '@/composables/useTheme.js';
import { useToast } from 'vue-toastification';
import { suppliers } from '@/utils/seed_data.js';

const route = useRoute();
const toast = useToast();
const cartStore = useCartStore();
const { isLightTheme, toggleTheme } = useTheme();

const isPortalMenuOpen = ref(false);
const isCompareOpen = ref(false);

function isRouteActive(pathname) {
  return route.path === pathname || route.path.startsWith(pathname + '/');
}

// Global Currency Formatter
function formatCFA(val) {
  if (val === undefined || val === null) return '0 CFA';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('FCFA', 'CFA').replace('XAF', 'CFA');
}

function getSupplierName(supplierId) {
  const found = suppliers.find(s => s.id === supplierId);
  return found ? found.name : 'Vendeur Indépendant';
}

function addPromoToCart(product) {
  cartStore.addToCart(product, 1);
  toast.success(`[AJOUTÉ] ${product.name} a été ajouté au panier.`);
}

function getCameroonRegion(id) {
  const regions = ["Littoral", "Centre", "Nord", "Ouest", "Sud", "Est", "Adamaoua", "Extrême-Nord", "Nord-Ouest", "Sud-Ouest"];
  return regions[(id || 0).toString().length % regions.length];
}
</script>

<style>
/* CSS Marquee notice ticker */
@keyframes marquee {
  0% { transform: translate3d(0, 0, 0); }
  105% { transform: translate3d(-100%, 0, 0); }
}

.animate-marquee {
  display: inline-block;
  padding-left: 100vw;
  animation: marquee 25s linear infinite;
  white-space: nowrap;
}

.animate-marquee:hover {
  animation-play-state: paused;
}
</style>
