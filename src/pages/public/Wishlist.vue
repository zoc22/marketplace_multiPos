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
          <span>Mes Favoris</span>
        </h1>
        <p class="text-xs text-text-sec dark:text-slate-455 mt-2 font-mono">
          Conservez et gérez vos lots d'intérêts pour un réapprovisionnement rapide.
        </p>
      </div>

      <!-- WISHLIST GRID -->
      <div class="space-y-6">
        <div v-if="cartStore.wishlist.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div 
            v-for="prod in cartStore.wishlist" 
            :key="prod.id"
            class="bg-white dark:bg-[#091117] border border-divider dark:border-slate-800/80 rounded-2xl overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all duration-350 flex flex-col justify-between h-full relative group"
          >
            <!-- Image section -->
            <div class="relative overflow-hidden aspect-video bg-slate-950">
              <img :src="prod.image" :alt="prod.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <!-- Remove from wishlist button -->
              <button 
                @click="cartStore.toggleWishlist(prod)"
                class="absolute top-3 right-3 p-2 bg-white/80 dark:bg-slate-950/80 hover:bg-rose-500 hover:text-white text-rose-500 rounded-xl transition duration-200 shadow-md"
                title="Retirer des favoris"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>

            <!-- Content -->
            <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <span class="text-[9px] font-mono text-slate-400 dark:text-slate-550 uppercase tracking-widest font-black">{{ prod.sku }}</span>
                <h3 class="text-sm font-bold text-text-main dark:text-white uppercase leading-snug line-clamp-2 mt-1">{{ prod.name }}</h3>
              </div>

              <div class="flex justify-between items-end pt-2 border-t border-divider dark:border-slate-800/40">
                <div>
                  <span class="text-[9px] uppercase font-mono text-slate-450 block">Prix HT</span>
                  <span class="text-emerald-600 dark:text-accent-green font-black text-base">{{ formatCFA(prod.price) }}<span class="text-[10px] text-slate-450 font-normal"> /{{ prod.unit }}</span></span>
                </div>
                <div>
                  <span class="text-[9px] uppercase font-mono text-slate-450 block text-right">Disponibilité</span>
                  <span class="text-xs font-bold font-mono text-cyan-600 dark:text-cyan-400">{{ prod.stock }} {{ prod.unit }}s</span>
                </div>
              </div>

              <!-- Action buttons -->
              <button 
                @click="cartStore.addToCart(prod, 1); toast.success(`[AJOUTÉ] ${prod.name} rattaché au panier.`)"
                class="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-450 hover:to-teal-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center justify-center space-x-2"
              >
                <ShoppingCartIcon class="h-4 w-4" />
                <span>Ajouter au Panier</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-20 bg-white dark:bg-[#091117] border border-dashed border-divider dark:border-slate-800 rounded-3xl max-w-md mx-auto space-y-5">
          <div class="h-16 w-16 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <HeartIcon class="h-8 w-8" />
          </div>
          <div class="space-y-1">
            <h3 class="text-base font-bold text-text-main dark:text-white uppercase">Aucun favori pour le moment</h3>
            <p class="text-xs text-slate-500 max-w-xs mx-auto">Parcourez notre catalogue B2B et cliquez sur le cœur pour ajouter des articles à vos favoris.</p>
          </div>
          <router-link 
            to="/products"
            class="inline-block px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-450 hover:to-teal-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition"
          >
            Découvrir le catalogue
          </router-link>
        </div>
      </div>

    </main>

    <!-- MAIN PLATFORM FOOTER -->
    <PublicFooter />

  </div>
</template>

<script setup>
import PublicFooter from '@/components/PublicFooter.vue';
import { useCartStore } from '@/store/modules/cart.js';
import { useToast } from 'vue-toastification';
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