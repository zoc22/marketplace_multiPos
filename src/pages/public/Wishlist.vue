<template>
  <div class="min-h-screen bg-light-bg-main dark:bg-[#070b12] text-text-main dark:text-slate-100 flex flex-col justify-between w-full pt-28">
    
    <!-- NAVIGATION BAR -->
    <PublicHeader />

    <!-- INTRO DECK -->
    <main class="flex-1 py-12 px-4 xl:px-12 w-full space-y-8 select-none max-w-[1600px] mx-auto">
      
      <!-- HEADER -->
      <div class="border-b border-divider dark:border-slate-800 pb-6 relative overflow-hidden group">
        <!-- Floating Animated Background Accents -->
        <div class="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          <div class="absolute -top-10 -left-10 w-40 h-40 bg-button-orange opacity-5 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
          <div class="absolute -bottom-10 -right-10 w-60 h-60 bg-orange-500 opacity-5 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
        </div>

        <div class="inline-flex items-center space-x-1.5 bg-button-orange/20 border border-button-orange/30 text-button-orange px-3 py-1 rounded-full text-xs font-sans font-bold uppercase tracking-widest block w-fit mb-3 animate-pulse-slow">
          <span>Espace Client - Liste d'envies</span>
        </div>
        <h1 class="text-3xl font-black text-text-main dark:text-white uppercase font-sans flex items-center gap-3">
          <HeartIcon class="h-10 w-10 text-rose-500 animate-bounce-subtle" aria-label="Favorites" />
          <span>Mes Favoris ({{ cartStore.wishlist.length }})</span>
        </h1>
        <p class="text-sm text-slate-400 leading-relaxed tracking-wide mt-2">
          Sauvegardez vos articles préférés. Vous pouvez les ajouter directement à votre panier à tout moment.
        </p>

        <!-- Marquee Announcement Text -->
        <div class="mt-4 relative overflow-hidden rounded-lg bg-button-orange/10 border border-button-orange/20 text-button-orange py-1.5 w-full flex">
          <div class="animate-marquee whitespace-nowrap text-sm font-bold uppercase tracking-wider">
            🚨 OFFRE SPÉCIALE : LIVRAISON GRATUITE SUR VOS 3 PREMIÈRES COMMANDES ! &bull; DÉCOUVREZ NOS NOUVELLES COLLECTIONS ET PRODUITS LOCAUX &bull;
          </div>
        </div>
      </div>

      <!-- EMPTY STATE -->
      <div 
        v-if="cartStore.wishlist.length === 0" 
        class="text-center py-20 bg-light-bg-main dark:bg-[#0a1017] border border-dashed border-divider dark:border-slate-800 rounded-3xl space-y-5 shadow-lg"
      >
        <div class="flex justify-center relative">
          <HeartIcon class="h-16 w-16 text-text-sec opacity-50 absolute animate-ping" />
          <HeartIcon class="h-16 w-16 text-text-sec relative z-10" />
        </div>
        <h3 class="text-lg font-sans font-black text-text-main dark:text-white uppercase">AUCUN ARTICLE EN FAVORIS</h3>
        <p class="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          Votre liste d'envies est vide. Parcourez la marketplace pour trouver des articles qui vous plaisent et sauvegardez-les ici.
        </p>
        <router-link 
          to="/products"
          class="inline-block px-8 py-4 bg-button-orange hover:bg-button-orange\/90 text-text-main font-sans font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)]"
        >
          Parcourir la Boutique &rarr;
        </router-link>
      </div>

      <!-- WISHLIST GRID (FULL WIDTH) -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
        
        <div 
          v-for="prod in cartStore.wishlist" 
          :key="prod.id"
          class="group relative bg-light-bg-main dark:bg-[#0a1017] border border-divider dark:border-slate-800 rounded-3xl overflow-hidden hover:border-button-orange transition-all duration-300 shadow-xl hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] flex flex-col"
        >
          <!-- Thumbnail -->
          <div class="relative w-full h-56 overflow-hidden bg-light-bg-sec dark:bg-slate-900 border-b border-divider dark:border-slate-800">
            <img 
              :src="prod.image" 
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              @error="(e) => e.target.src='https://placehold.co/400x400/12242d/fff?text=Image+Refused'"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-[#0a1017] via-transparent to-transparent opacity-80"></div>
            
            <!-- Remove from wishlist button -->
            <button 
              @click.stop="cartStore.toggleWishlist(prod)"
              class="absolute top-3 right-3 p-2 bg-light-bg-sec dark:bg-slate-900/80 hover:bg-rose-500 border border-slate-700 hover:border-rose-500 text-rose-500 hover:text-text-main dark:text-white rounded-full backdrop-blur-md transition z-20 shadow-lg"
              title="Retirer des favoris"
            >
              <TrashIcon class="h-5 w-5" />
            </button>

            <!-- Global / Local Badge -->
            <div class="absolute top-3 left-3 px-3 py-1 bg-light-bg-sec dark:bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-md text-[10px] font-sans font-bold uppercase text-text-main dark:text-white shadow-lg z-20">
              RÉF: {{ prod.sku.split('-')[2] || prod.sku }}
            </div>
          </div>

          <!-- Product Details -->
          <div class="p-5 flex-1 flex flex-col justify-between relative">
            <div>
              <div class="flex items-start justify-between gap-2 mb-2">
                <span class="text-[10px] uppercase font-sans font-black text-button-orange bg-button-orange/10 px-2 py-0.5 rounded border border-button-orange/20 line-clamp-1">
                  {{ getCategorySector(prod.categoryId) }}
                </span>
                <span v-if="prod.stock <= 0" class="text-[10px] uppercase font-bold text-rose-500 px-2 py-0.5 border border-rose-500/30 rounded bg-rose-500/10">
                  Rupture
                </span>
              </div>

              <h3 class="text-base font-black text-text-main dark:text-white leading-tight mb-2 group-hover:text-button-orange transition-colors">
                {{ prod.name }}
              </h3>
              
              <div class="flex items-center text-xs text-slate-400 mb-4 font-sans font-bold">
                <BuildingOfficeIcon class="h-4 w-4 mr-1 text-slate-500" />
                <span class="truncate">{{ getSupplierName(prod.supplierId) }}</span>
              </div>
            </div>

            <!-- Price & Action -->
            <div class="pt-4 border-t border-divider dark:border-slate-800 mt-auto flex items-end justify-between">
              <div>
                <span class="block text-[10px] text-slate-500 uppercase font-bold mb-1">Prix unitaire</span>
                <div class="text-xl font-black text-button-orange tracking-tight">
                  {{ formatCFA(prod.price) }}
                </div>
                <div class="text-[10px] text-slate-500 mt-0.5 font-bold">
                  / {{ prod.unit }}
                </div>
              </div>
              
              <button 
                @click.stop="cartStore.addToCart(prod, 1); toast.success('Article ajouté au panier !')"
                :disabled="prod.stock <= 0"
                class="px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2"
                :class="prod.stock <= 0 ? 'bg-light-bg-sec dark:bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed' : 'bg-button-orange hover:bg-button-orange\/90 text-text-main shadow-[0_0_15px_rgba(245,158,11,0.2)]'"
              >
                <ShoppingCartIcon class="h-5 w-5" v-if="prod.stock > 0" />
                <span v-else>Indisponible</span>
              </button>
            </div>
          </div>
        </div>

      </div>

    </main>

    <!-- MAIN PLATFORM FOOTER -->
    <!-- FOOTER -->
    <PublicFooter />

  </div>
</template>

<script setup>
import PublicFooter from '@/components/PublicFooter.vue';
import { ref, computed } from 'vue';
import { useCartStore } from '@/store/modules/cart.js';
import { useToast } from 'vue-toastification';
import { categories, suppliers, getCategorySector, getSupplierName } from '@/utils/seed_data.js';
import { 
  HeartIcon, 
  ShoppingCartIcon, 
  TrashIcon, 
  BuildingOfficeIcon 
} from '@heroicons/vue/24/outline';

import PublicHeader from '@/components/PublicHeader.vue';

const cartStore = useCartStore();
const toast = useToast();

function formatCFA(val) {
  if (val === undefined || val === null) return '0 CFA';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('FCFA', 'CFA').replace('XAF', 'CFA');
}
</script>

<style scoped>
/* Custom animations for the dynamic aspect */
.animate-marquee {
  animation: marquee 20s linear infinite;
  display: inline-block;
  min-width: 100%;
}
@keyframes marquee {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}
.animate-pulse-slow {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
.animate-bounce-subtle {
  animation: bounceSubtle 3s infinite;
}
@keyframes bounceSubtle {
  0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
  50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
}
</style>
