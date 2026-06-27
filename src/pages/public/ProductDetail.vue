<template>
  <div class="min-h-screen bg-[#070b12] text-slate-100 flex flex-col justify-between">
    
    <!-- NAVIGATION BAR -->
    <PublicHeader />

    <main class="flex-1 py-12 px-4 md:px-8 max-w-5xl mx-auto w-full space-y-8 select-none">
      
      <!-- BACK BREADCRUMBS -->
      <nav class="flex items-center space-x-2 text-[10.5px] font-mono text-slate-500 uppercase">
        <router-link to="/" class="hover:text-emerald-450">KONG HUB</router-link>
        <span>/</span>
        <router-link to="/products" class="hover:text-emerald-450">GROS CATALOGUE</router-link>
        <span>/</span>
        <span class="text-slate-300 truncate max-w-[12rem]">{{ product?.name || 'LOT DETAIL' }}</span>
      </nav>

      <!-- EXOTIC SPEC SHEET -->
      <div v-if="!product" class="text-center py-20 bg-[#0a1117] rounded-3xl border border-slate-900">
        <p class="text-slate-500 font-mono text-xs">RECHERCHE DU LOT DANS LA CHAÎNE DE BLOCS EN COURS...</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        
        <!-- COLUMN 1: ZOOMABLE COVER ART -->
        <div class="md:col-span-5 space-y-6">
          <div class="relative rounded-3xl overflow-hidden bg-[#091116] border border-[#142a34] group">
            <img 
              :src="product.image" 
              class="w-full h-80 object-cover group-hover:scale-105 transition-all duration-500" 
            />
            
            <div class="absolute top-4 left-4 bg-emerald-950 text-accent-green text-[9px] font-mono px-2.5 py-1 rounded border border-emerald-900/60 font-bold uppercase">
              IGP Cameroun Certified
            </div>
          </div>

          <!-- Cameroonian Phytosanitary Badge -->
          <div class="p-4 bg-[#091116] rounded-2xl border border-slate-900 space-y-2 text-[10px] font-mono">
            <div class="flex items-center space-x-2 text-cyan-405 font-bold uppercase">
              <span class="inline-block h-2 w-2 rounded-full bg-cyan-402 animate-pulse"></span>
              <span>Passeport Phytosanitary CEMAC Ok</span>
            </div>
            <p class="text-[9.5px] text-slate-450 leading-relaxed font-sans">
              Ce lot d'exportation a subi l'audit d'arbitrage de transit au Port Autonome de Douala. Autorisé d'embarquement prioritaire.
            </p>
          </div>
        </div>

        <!-- COLUMN 2: SPECS FORM & ACTIONS -->
        <div class="md:col-span-7 space-y-6">
          
          <div class="space-y-3">
            <span class="bg-[#0e2126] text-accent-green text-[9.5px] font-mono uppercase px-2.5 py-1 rounded font-bold border border-emerald-900/60 inline-block">
              Secteur {{ categorySector }}
            </span>
            
            <h1 class="text-2xl font-extrabold text-white uppercase tracking-tight font-sans leading-tight">
              {{ product.name }}
            </h1>

            <p class="text-slate-400 text-[12px] leading-relaxed font-sans">
              {{ product.description }}
            </p>
          </div>

          <!-- B2B Pricing Billboard -->
          <div class="py-4 px-5 bg-gradient-to-r from-slate-950 to-[#0a151b] border border-[#12242d] rounded-2xl flex justify-between items-center font-mono">
            <div>
              <span class="text-[9px] text-slate-500 block uppercase">Wholseale Unit Tariff</span>
              <p class="text-[20px] font-extrabold text-accent-green">
                {{ formatCFA(product.price) }}
                <span class="text-slate-500 font-sans text-xs font-normal"> / {{ product.unit }}</span>
              </p>
            </div>

            <div class="text-right">
              <span class="text-[9px] text-slate-500 block uppercase">Minimum Wholesale Lot</span>
              <span class="text-xs text-white font-bold">1 {{ product.unit }}</span>
            </div>
          </div>

          <!-- Supplier Cooperative Bio -->
          <div class="p-4 bg-slate-950 rounded-2xl border border-slate-900 flex items-center justify-between gap-4">
            <div class="font-mono text-xs">
              <span class="text-[9px] uppercase text-slate-500 block">Verified Logistics Supplier:</span>
              <span class="text-[11px] font-sans font-bold text-slate-200 mt-1 block">{{ supplierName }}</span>
              <p class="text-[9.5px] text-emerald-450 mt-1">Clearing Port Priority Level 2 &bull; Escrow Guaranteed</p>
            </div>
            
            <span class="h-10 w-10 text-xl bg-emerald-950/40 text-emerald-450 border border-emerald-900 rounded-xl flex items-center justify-center font-mono">
              🌾
            </span>
          </div>

          <!-- Specs Table -->
          <div class="bg-[#091116] border border-[#13252f] rounded-2xl p-4.5 space-y-3 text-xs font-mono">
            <h3 class="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold pb-2 border-b border-slate-900">
              ⚡ Fiche Technique Détaillée
            </h3>
            
            <div class="space-y-2 text-[10.5px]">
              <div class="flex justify-between pb-1.5 border-b border-slate-900/40">
                <span class="text-slate-500">Lot SKU</span>
                <span class="text-slate-200 font-bold uppercase">{{ product.sku }}</span>
              </div>
              <div class="flex justify-between pb-1.5 border-b border-slate-900/40">
                <span class="text-slate-500">Axe Logistique</span>
                <span class="text-cyan-405 font-bold">Bassin de transit {{ getCameroonRegion(product.id) }}</span>
              </div>
              <div class="flex justify-between pb-1.5 border-b border-slate-900/40">
                <span class="text-slate-500">Conditionnement</span>
                <span class="text-slate-200 uppercase">Sacs hermétiques étanches</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Volume en Stock</span>
                <span class="text-emerald-404 font-bold">{{ product.stock }} {{ product.unit }} disponibles</span>
              </div>
            </div>
          </div>

          <!-- CART FORM WRAPPER -->
          <div class="bg-[#0c1b21]/70 border border-[#152e3b]/80 p-5 rounded-3xl space-y-4">
            
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
              <div class="flex items-center space-x-3">
                <span class="text-slate-500 uppercase">Quantité:</span>
                
                <div class="flex items-center space-x-1 bg-slate-950 p-1 border border-slate-900 rounded-lg">
                  <button 
                    @click="qty > 1 ? qty-- : null"
                    class="h-7 w-7 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-xs"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    v-model="qty"
                    class="w-12 bg-transparent border-none text-center text-xs text-emerald-450 font-bold focus:ring-0 p-0"
                    min="1"
                  />
                  <button 
                    @click="qty++"
                    class="h-7 w-7 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              <!-- Price helper -->
              <div class="text-right">
                <span class="text-[9px] text-slate-500 block uppercase">Estimated crop cost</span>
                <span class="text-emerald-404 font-bold text-sm">{{ formatCFA(product.price * qty) }}</span>
              </div>
            </div>

            <!-- Buttons -->
            <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 font-mono">
              
              <button 
                @click="addToCart"
                class="sm:col-span-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-450 hover:to-teal-555 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition"
              >
                🛒 AJOUTER {{ qty }} {{ product.unit }}S AU PANIER
              </button>

              <button 
                @click="cartStore.toggleWishlist(product)"
                class="sm:col-span-4 py-3.5 bg-slate-950 border border-slate-900 hover:bg-slate-900 text-slate-300 text-xs uppercase font-bold rounded-xl transition"
                :class="cartStore.isInWishlist(product.id) ? 'border-rose-900/60 bg-rose-950/15 text-rose-450' : ''"
              >
                ♥ {{ cartStore.isInWishlist(product.id) ? 'Favoris ok' : 'Sauver' }}
              </button>

            </div>

          </div>

        </div>

      </div>

      <!-- SIMILAR RECOMMENDATIONS CAROUSEL (Capter attention / similaire obligatoires) -->
      <div v-if="product" class="pt-8 border-t border-[#0f2129] space-y-4">
        <div>
          <span class="text-[10px] font-mono text-cyan-455 uppercase tracking-widest block font-bold">ACCORD DE TRANSIT</span>
          <h2 class="text-base font-bold text-white uppercase font-mono tracking-tight">🌾 Lots Similaires Recommandés</h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
          
          <div 
            v-for="sim in similarProducts" 
            :key="sim.id"
            @click="routeToSim(sim.id)"
            class="bg-[#091116] border border-slate-900/80 rounded-2xl p-4 hover:border-emerald-900/50 cursor-pointer group flex flex-col justify-between"
          >
            <div class="space-y-3">
              <img :src="sim.image" class="w-full h-32 object-cover rounded-xl border border-[#13252f]" />
              
              <div>
                <span class="text-[9.5px] font-mono text-emerald-450 uppercase font-bold">{{ sim.sku }}</span>
                <h3 class="text-xs font-bold text-white uppercase leading-normal mt-1 truncate group-hover:text-accent-green transition" :title="sim.name">
                  {{ sim.name }}
                </h3>
              </div>
            </div>

            <div class="pt-2 border-t border-slate-900/60 mt-3 flex justify-between items-center font-mono text-[10px]">
              <span class="text-emerald-404 font-bold">{{ formatCFA(sim.price) }}</span>
              <span class="text-slate-500 font-sans text-[9px]">{{ sim.stock }} {{ sim.unit }}s</span>
            </div>
          </div>

        </div>
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
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductsStore } from '@/store/modules/products.js';
import { useCartStore } from '@/store/modules/cart.js';
import { useToast } from 'vue-toastification';
import { categories, suppliers } from '@/utils/seed_data.js';

import PublicHeader from '@/components/PublicHeader.vue';

const route = useRoute();
const router = useRouter();
const productsStore = useProductsStore();
const cartStore = useCartStore();
const toast = useToast();

const qty = ref(1);

const product = computed(() => {
  const pId = route.params.id;
  return productsStore.products.find(p => String(p.id) === String(pId));
});

// Watch route param alterations to auto scroll top and reset qty
watch(() => route.params.id, () => {
  qty.value = 1;
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Specs computed variables
const categorySector = computed(() => {
  if (!product.value) return 'Secteur';
  const cat = categories.find(c => c.id === product.value.categoryId);
  return cat ? cat.sector : 'Direct Trade';
});

const supplierName = computed(() => {
  if (!product.value) return 'Coopérative Vérifiée';
  const sup = suppliers.find(s => s.id === product.value.supplierId);
  return sup ? sup.name : 'Coopérative Agricole';
});

const similarProducts = computed(() => {
  if (!product.value) return [];
  // Grab other items in the same CategoryId
  return productsStore.products
    .filter(p => p.categoryId === product.value.categoryId && p.id !== product.value.id)
    .slice(0, 4);
});

function addToCart() {
  if (!product.value) return;
  cartStore.addToCart(product.value, qty.value);
  toast.success(`🛒 Ajouté avec succès au panier.`);
}

function routeToSim(pId) {
  router.push(`/products/${pId}`);
}

function getCameroonRegion(productId) {
  // Safe deterministic helper
  const hash = String(productId).charCodeAt(0) || 0;
  const regions = ["Moundo", "Sud Sangmélima", "Garoua Nord", "Foumbot Ouest", "Littoral Douala", "Centre Yaoundé"];
  return regions[hash % regions.length];
}

function formatCFA(val) {
  if (val === undefined || val === null) return '0 CFA';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('FCFA', 'CFA').replace('XAF', 'CFA');
}
</script>
