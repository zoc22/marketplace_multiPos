<template>
  <div class="min-h-screen bg-light-bg-main dark:bg-[#070b12] text-text-main dark:text-slate-100 flex flex-col justify-between overflow-x-hidden">
    
    <!-- NAVIGATION BAR -->
    <PublicHeader />

    <main class="flex-1 py-12 px-6 sm:px-8 lg:px-12 max-w-6xl mx-auto w-full space-y-10">
      
      <!-- BENTO TITLE HEAD -->
      <div class="border-b border-[#0e2129] pb-6">
        <span class="text-[9.5px] font-mono bg-emerald-950 text-accent-green border border-emerald-900 rounded-full px-3 py-0.5 uppercase tracking-widest font-bold">
          Search Intelligence
        </span>
        <h1 class="text-2xl font-extrabold text-text-main dark:text-white uppercase font-mono mt-2 flex items-center space-x-2">
          <MagnifyingGlassIcon class="h-6 w-6 text-accent-green" />
          <span>Enterprise Engine Search</span>
        </h1>
        <p class="text-xs text-slate-400 mt-1 max-w-xl">
          Saisissez des mots-clés pour auditer les lots de cacao, café, poivre volcanique ou régulateurs solaires.
        </p>
      </div>

      <!-- SEARCH INPUT BLOCK -->
      <div class="bg-[#091117] border border-divider dark:border-slate-900 rounded-2xl p-6 flex flex-col sm:flex-row gap-4 items-center">
        <div class="relative w-full flex-1">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Rechercher par nom, SKU ou description (ex: Penja, Cacao...)" 
            class="w-full bg-[#03060a] border border-[#142630] rounded-xl px-4 py-3 pl-11 text-sm text-slate-200 focus:outline-none focus:border-accent-green placeholder-slate-500 font-mono"
            @keyup.enter="performSearch"
          />
          <MagnifyingGlassIcon class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
          <button 
            v-if="searchQuery" 
            @click="searchQuery = ''; performSearch()"
            class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-text-main dark:text-white font-bold text-lg"
          >
            &times;
          </button>
        </div>
        <button 
          @click="performSearch"
          class="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-450 hover:to-teal-500 text-text-main font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition"
        >
          Rechercher
        </button>
      </div>

      <!-- RESULTS DECK -->
      <div class="space-y-6">
        <div class="flex justify-between items-center text-xs font-mono text-slate-400">
          <span>RÉSULTATS DE RECHERCHE ({{ filteredProducts.length }} LOTS TROUVÉS)</span>
          <span v-if="hasSearched && filteredProducts.length > 0" class="text-accent-green font-bold">Audit conforme</span>
        </div>

        <!-- Empty state -->
        <div 
          v-if="filteredProducts.length === 0" 
          class="text-center py-20 bg-[#091118]/40 border border-dashed border-[#14242d] rounded-2xl space-y-4"
        >
          <div class="text-text-sec text-3xl font-mono">🔍</div>
          <h3 class="text-sm font-mono font-bold text-slate-350 uppercase">Aucun lot de gros trouvé</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">
            Essayez avec des mots clés comme "Cacao", "Penja", "Solaire", "Café" ou réinitialisez votre requête.
          </p>
        </div>

        <!-- GRID DECK -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          <div 
            v-for="prod in filteredProducts" 
            :key="prod.id"
            class="bg-light-bg-main dark:bg-[#091016] border border-divider dark:border-[#13252f] rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/20 hover:border-emerald-900/60 transition-all duration-300 relative group flex flex-col justify-between"
          >
            <!-- SKU Corner Badge -->
            <div class="absolute top-3 left-3 z-10">
              <span class="bg-light-bg-main dark:bg-slate-950/90 backdrop-blur-md text-[9px] font-mono px-2 py-0.5 rounded-full border border-divider dark:border-slate-800 text-text-sec dark:text-slate-300 font-bold uppercase">
                SKU: {{ prod.sku.split('-').pop() }}
              </span>
            </div>

            <!-- Product Image -->
            <div class="relative aspect-square w-full overflow-hidden bg-light-bg-sec dark:bg-slate-900 border-b border-divider dark:border-[#12232a]/60">
              <img :src="prod.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-550 filter brightness-[0.9]" />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
            </div>

            <!-- Details -->
            <div class="p-4.5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-center text-[9px] font-mono text-cyan-400 uppercase tracking-wider">
                  <span>Bassin {{ getCameroonRegion(prod.id) }}</span>
                  <div class="flex items-center space-x-0.5">
                    <StarIconSolid v-for="i in 5" :key="i" class="h-3 w-3 text-button-orange" />
                  </div>
                </div>

                <h3 class="text-[13px] font-sans font-bold text-text-main dark:text-slate-100 leading-tight uppercase tracking-tight mt-1 group-hover:text-accent-green transition">
                  {{ prod.name }}
                </h3>
              </div>

              <!-- Price & Stock -->
              <div class="pt-3 border-t border-[#0e2129] flex items-end justify-between">
                <div>
                  <span class="text-[9px] uppercase font-mono text-slate-500 block">Base Lot cost</span>
                  <span class="text-accent-green font-extrabold text-[15px] font-mono">{{ formatCFA(prod.price) }}</span>
                  <span class="text-slate-500 font-mono text-[10px] lowercase"> / {{ prod.unit }}</span>
                </div>

                <div class="text-right">
                  <span class="text-[9px] uppercase font-mono text-slate-500 block">Stock</span>
                  <span class="text-xs font-mono font-bold text-text-sec dark:text-slate-300">{{ prod.stock }} {{ prod.unit }}s</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="grid grid-cols-2 gap-2 pt-3 border-t border-[#0e2129]">
                <router-link 
                  :to="`/products/${prod.id}`"
                  class="py-2 text-center bg-light-bg-main dark:bg-[#091116] border border-divider dark:border-slate-900 hover:bg-[#122329] text-text-sec dark:text-slate-300 hover:text-emerald-350 text-[10px] font-mono uppercase tracking-wider rounded-lg transition"
                >
                  Détails Spec
                </router-link>
                <button 
                  @click="addToCart(prod)"
                  class="py-2 bg-emerald-950 border border-emerald-900 hover:bg-emerald-450 hover:text-text-main text-accent-green hover:border-transparent text-[10px] font-mono uppercase font-bold rounded-lg transition flex items-center justify-center space-x-1"
                >
                  <ShoppingCartIcon class="h-3.5 w-3.5" />
                  <span>Ajouter</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>

    <!-- FOOTER -->
    <PublicFooter />

  </div>
</template>

<script setup>
import PublicFooter from '@/components/PublicFooter.vue';
import { ref, computed } from 'vue';
import { useProductsStore } from '@/store/modules/products.js';
import { useCartStore } from '@/store/modules/cart.js';
import { useToast } from 'vue-toastification';
import { MagnifyingGlassIcon, ShoppingCartIcon } from '@heroicons/vue/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/vue/24/solid';
import PublicHeader from '@/components/PublicHeader.vue';

const productsStore = useProductsStore();
const cartStore = useCartStore();
const toast = useToast();

const searchQuery = ref('');
const activeQuery = ref('');
const hasSearched = ref(false);

const filteredProducts = computed(() => {
  if (!activeQuery.value) return productsStore.products;
  const q = activeQuery.value.toLowerCase();
  return productsStore.products.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.sku.toLowerCase().includes(q) || 
    p.description.toLowerCase().includes(q)
  );
});

function performSearch() {
  activeQuery.value = searchQuery.value;
  hasSearched.value = true;
}

function addToCart(product) {
  cartStore.addToCart(product, 1);
  toast.success(`🛒 Lot de ${product.name} ajouté au panier.`);
}

function getCameroonRegion(productId) {
  const hash = String(productId).charCodeAt(0) || 0;
  const regions = ["Moungo", "Sud Sangmélima", "Garoua Nord", "Foumbot Ouest", "Littoral Douala", "Centre Yaoundé"];
  return regions[hash % regions.length];
}

function formatCFA(val) {
  if (val === undefined || val === null) return '0 CFA';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('FCFA', 'CFA').replace('XAF', 'CFA');
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}
</style>
