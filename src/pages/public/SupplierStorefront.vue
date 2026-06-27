<template>
  <div class="min-h-screen bg-light-bg-main dark:bg-[#070b12] text-text-main dark:text-slate-100 flex flex-col justify-between overflow-x-hidden pt-28">
    
    <!-- NAVIGATION HEADER -->
    <PublicHeader />

    <main class="flex-1 w-full space-y-12 select-none" v-if="supplier">
      
      <!-- STOREFRONT HERO BANNER -->
      <section class="relative h-64 md:h-80 xl:h-96 w-full">
        <img :src="getSupplierBanner(supplier.id)" class="w-full h-full object-cover brightness-[0.6]" alt="Boutique Banner" />
        <div class="absolute inset-0 bg-gradient-to-t from-light-bg-main dark:from-[#070b12] via-light-bg-main/60 dark:via-[#070b12]/60 to-transparent"></div>
        
        <div class="absolute bottom-0 left-0 w-full px-4 xl:px-12 pb-8 flex flex-col md:flex-row items-end justify-between gap-6">
          <div class="flex items-end gap-6">
            <div class="h-24 w-24 md:h-32 md:w-32 rounded-3xl bg-slate-950 border-4 border-[#070b12] flex items-center justify-center text-amber-500 shadow-2xl shrink-0">
              <BuildingOfficeIcon class="h-12 w-12 md:h-16 md:w-16 text-amber-500" />
            </div>
            <div class="mb-2">
              <div class="flex items-center gap-3">
                <h1 class="text-3xl md:text-5xl font-black text-white uppercase tracking-tight drop-shadow-md">
                  {{ supplier.name }}
                </h1>
                <div class="bg-emerald-500/20 border border-emerald-500 text-emerald-500 px-2 py-0.5 rounded text-[10px] uppercase font-bold flex items-center gap-1">
                  <ShieldCheckIcon class="h-4 w-4" /> Vérifié
                </div>
              </div>
              <p class="text-amber-500 font-sans font-bold tracking-wider mt-2 uppercase flex items-center gap-2">
                <MapPinIcon class="h-4 w-4" /> Basé à {{ supplier.city || 'Littoral' }} (Cameroun)
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- DESCRIPTION & SPECS -->
      <section class="max-w-[1600px] mx-auto px-4 xl:px-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white dark:bg-[#091117] border border-divider dark:border-slate-800 p-6 rounded-3xl space-y-4">
            <h2 class="text-lg font-bold text-text-main dark:text-white uppercase font-sans border-b border-divider dark:border-slate-800 pb-2">
              À propos de la coopérative
            </h2>
            <p class="text-sm leading-relaxed text-text-sec dark:text-slate-400">
              {{ supplier.description || 'Fournisseur agricole agréé engagé dans la distribution de produits de haute qualité en circuit court sur le hub national.' }}
            </p>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-white dark:bg-[#091117] border border-divider dark:border-slate-800 p-6 rounded-3xl space-y-4">
            <h2 class="text-lg font-bold text-text-main dark:text-white uppercase font-sans border-b border-divider dark:border-slate-800 pb-2">
              Spécifications B2B
            </h2>
            <div class="space-y-3 text-xs font-mono">
              <div class="flex justify-between">
                <span class="text-slate-455">Taux de service :</span>
                <span class="text-emerald-500 font-bold">98.4%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-455">Origine des lots :</span>
                <span class="text-text-main dark:text-white font-bold">100% Cameroun</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-455">Norme phytosanitaire :</span>
                <span class="text-cyan-400 font-bold">MINADER Certified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- PRODUCTS CATALOG -->
      <section class="max-w-[1600px] mx-auto px-4 xl:px-12 space-y-6">
        <div class="border-b border-divider dark:border-slate-800 pb-3">
          <h2 class="text-xl font-bold text-text-main dark:text-white uppercase font-sans">
            Lots agricoles disponibles
          </h2>
          <p class="text-xs text-text-sec dark:text-slate-455 mt-1">
            Découvrez les lots d'inventaire mis en marché directement par cette coopérative.
          </p>
        </div>

        <div v-if="supplierProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div 
            v-for="prod in supplierProducts" 
            :key="prod.id"
            class="bg-white dark:bg-[#091117] border border-divider dark:border-slate-800/80 rounded-2xl overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all duration-350 flex flex-col justify-between h-full relative group"
          >
            <!-- Image -->
            <div class="relative overflow-hidden aspect-video bg-slate-950">
              <img :src="prod.image" :alt="prod.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>

            <!-- Content -->
            <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <span class="text-[9px] font-mono text-slate-400 dark:text-slate-550 uppercase tracking-widest font-black">{{ prod.sku }}</span>
                <h3 class="text-sm font-bold text-text-main dark:text-white uppercase leading-snug line-clamp-2 mt-1">{{ prod.name }}</h3>
              </div>

              <div class="flex justify-between items-end pt-2 border-t border-divider dark:border-slate-800/40">
                <div>
                  <span class="text-[9px] uppercase font-mono text-slate-455 block">Prix HT</span>
                  <span class="text-emerald-600 dark:text-accent-green font-black text-base">{{ formatCFA(prod.price) }}<span class="text-[10px] text-slate-455 font-normal"> /{{ prod.unit }}</span></span>
                </div>
                <div>
                  <span class="text-[9px] uppercase font-mono text-slate-455 block text-right">Stock</span>
                  <span class="text-xs font-bold font-mono text-cyan-600 dark:text-cyan-400">{{ prod.stock }} {{ prod.unit }}s</span>
                </div>
              </div>

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

        <div v-else class="text-center py-16 border border-dashed border-divider dark:border-slate-800 rounded-3xl max-w-sm mx-auto">
          <p class="text-xs text-text-sec dark:text-slate-455">Aucun produit actif n'est actuellement répertorié pour cette coopérative.</p>
        </div>
      </section>

    </main>

    <!-- MAIN PLATFORM FOOTER -->
    <PublicFooter />

  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '@/store/modules/cart.js';
import { useToast } from 'vue-toastification';
import { suppliers, products as seedProducts } from '@/utils/seed_data.js';
import { BuildingOfficeIcon, ShieldCheckIcon, MapPinIcon, ShoppingCartIcon } from '@heroicons/vue/24/outline';
import PublicHeader from '@/components/PublicHeader.vue';
import PublicFooter from '@/components/PublicFooter.vue';

const route = useRoute();
const cartStore = useCartStore();
const toast = useToast();

const supplierId = parseInt(route.params.id);
const supplier = computed(() => suppliers.find(s => s.id === supplierId));

const supplierProducts = computed(() => seedProducts.filter(p => p.supplierId === supplierId));

function getSupplierBanner(id) {
  return `/assets/banners/banner_${id % 3 + 1}.jpg` || 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=800';
}

function formatCFA(val) {
  if (val === undefined || val === null) return '0 CFA';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('FCFA', 'CFA').replace('XAF', 'CFA');
}
</script>