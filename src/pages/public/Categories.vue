<template>
  <div class="min-h-screen bg-[#070b12] text-slate-100 flex flex-col justify-between">
    
    <!-- HEADER NAVBAR -->
    <PublicHeader />

    <main class="flex-1 py-12 px-4 md:px-8 max-w-5xl mx-auto w-full space-y-8 select-none">
      
      <!-- TITLE HEAD -->
      <div class="border-b border-[#0e2129] pb-6 mb-8 text-center sm:text-left">
        <span class="text-[9.5px] font-mono bg-emerald-950 text-emerald-450 border border-emerald-900 rounded-full px-3 py-0.5 uppercase tracking-widest font-bold">
          Marketplace Structures
        </span>
        <h1 class="text-2xl font-extrabold text-white uppercase font-mono mt-2">
          🗂️ Matrice Globale des Catégories Certifiées
        </h1>
        <p class="text-xs text-slate-400 mt-1 max-w-xl">
          Parcourez la taxonomie de nos lots de gros divisée par secteurs d'activité stratégiques de la CEMAC.
        </p>
      </div>

      <!-- SECTORS MAP WRAPPER -->
      <div class="space-y-8">
        
        <div 
          v-for="sec in sectors" 
          :key="sec.name"
          class="bg-[#091116] border border-[#142732] rounded-2xl p-5.5 space-y-4"
        >
          <!-- Sector Title Block -->
          <div class="flex items-center space-x-3 border-b border-slate-900 pb-3">
            <span class="text-2xl shrink-0">{{ sec.icon }}</span>
            <div>
              <h2 class="text-sm font-bold text-white uppercase font-mono tracking-wide">
                {{ sec.name }}
              </h2>
              <p class="text-[9.5px] text-slate-500 font-sans tracking-wide mt-0.5 uppercase">
                Cameroon Trade Sector &bull; Verified Warehousing Lot Category
              </p>
            </div>
          </div>

          <!-- Child categories list -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            <div 
              v-for="cat in getCategoriesInSector(sec.name)" 
              :key="cat.id"
              @click="routeToCategory(cat.name)"
              class="bg-[#05090e] border border-slate-900/60 p-3 rounded-xl hover:border-emerald-900/50 hover:bg-slate-900/30 transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div class="flex justify-between items-start">
                  <span class="text-[8.5px] font-mono text-slate-550">CODE: {{ cat.code }}</span>
                  <span class="text-[9px] bg-[#0d2126] text-accent-green font-mono px-1.5 rounded uppercase font-bold text-[8px]">
                    IGP
                  </span>
                </div>
                <h3 class="text-[11.5px] font-bold text-slate-201 mt-1.5 leading-snug group-hover:text-accent-green transition uppercase">
                  {{ cat.name }}
                </h3>
              </div>

              <div class="pt-2 border-t border-slate-900/40 mt-3 flex justify-between items-center text-[10px] text-slate-500">
                <span class="font-sans italic text-[9px] truncate max-w-[12rem]">{{ cat.description }}</span>
                <span class="text-emerald-404 font-mono group-hover:translate-x-1 transition duration-150">&rarr;</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </main>

    <!-- FOOTER -->
    <footer class="bg-slate-950 border-t border-[#091116] py-12 px-6 text-slate-502 text-xs text-center pb-48 md:pb-40">
      <div class="max-w-4xl mx-auto space-y-4">
        <p class="text-[11px] leading-relaxed max-w-xl mx-auto">
          KONG S.A. est une marque de technologie logistique camerounaise agréée. Tous droits réservés. Conforme CEMAC et règles de l'arbitrage commercial international.
        </p>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useCategoriesStore } from '@/store/modules/categories.js';
import { useRouter } from 'vue-router';
import PublicHeader from '@/components/PublicHeader.vue';

const categoriesStore = useCategoriesStore();
const router = useRouter();

const sectors = [
  { name: "Agriculture", icon: "🌾" },
  { name: "Alimentation Générale", icon: "🍏" },
  { name: "Cacao & Café Export", icon: "🍫" },
  { name: "Matériaux de Construction (BTP)", icon: "🧱" },
  { name: "Énergies & Solaire Africain", icon: "💡" },
  { name: "Textiles Traditional Cameroun", icon: "👑" },
  { name: "Phytothérapie & Pharmacopée", icon: "🌱" },
  { name: "Télécoms, Connectivité MTN/Orange", icon: "📲" },
  { name: "Flottes & Pièces Logistiques", icon: "🚛" },
  { name: "Artisanat d'Afrique Centrale", icon: "🪵" }
];

function getCategoriesInSector(sectorName) {
  return categoriesStore.categories.filter(c => c.sector === sectorName);
}

function routeToCategory(catName) {
  // Push to products with sector search trigger
  router.push({
    path: '/products',
    query: { filterSector: catName }
  });
}
</script>
