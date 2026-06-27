<template>
  <div class="min-h-screen bg-[#070b12] text-slate-100 flex flex-col justify-between">
    
    <!-- NAVIGATION HEADER -->
    <PublicHeader />

    <main class="flex-1 py-12 px-4 md:px-8 max-w-5xl mx-auto w-full space-y-8 select-none">
      
      <!-- HEADING GRID -->
      <div class="border-b border-[#0e2129] pb-6 mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span class="text-[9.5px] font-mono bg-emerald-950 text-emerald-450 border border-emerald-900 rounded-full px-3 py-0.5 uppercase tracking-widest font-bold">
            Certified Partners
          </span>
          <h1 class="text-2xl font-extrabold text-white uppercase font-mono mt-2">
            🤝 Coopératives & Fournisseurs Agrées
          </h1>
          <p class="text-xs text-slate-400 mt-1 max-w-xl">
            Vérifiés via passeport phytosanitaire CEMAC, solvabilité bancaire Afriland et audit de stockage FIFO.
          </p>
        </div>

        <!-- Quick filter / Search -->
        <div class="relative w-full sm:w-64 font-mono text-xs">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Rechercher coopérative..."
            class="w-full bg-[#03060a] border border-[#142630] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-accent-green placeholder-slate-650"
          />
        </div>
      </div>

      <!-- SUPPLIERS CONTAINER GRID -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div 
          v-for="supp in filteredSuppliers" 
          :key="supp.id"
          class="bg-[#091116] border border-[#13252f] rounded-2xl p-5.5 space-y-4 hover:border-emerald-900/60 transition duration-300 relative group"
        >
          <!-- Status active badge -->
          <span class="absolute top-4 right-4 bg-[#0d2126] text-accent-green text-[8.5px] font-mono px-2 py-0.5 rounded uppercase font-bold border border-emerald-900/45">
            CONFORME Escrow
          </span>

          <!-- Identity and region -->
          <div class="flex items-start space-x-3.5">
            <div class="h-11 w-11 rounded-xl bg-[#0c2020] border border-emerald-950/55 flex items-center justify-center text-xl text-accent-green shrink-0">
              🏢
            </div>
            <div class="truncate">
              <span class="text-[8.5px] font-mono text-slate-500 block uppercase">ID: {{ supp.id }}</span>
              <h2 class="text-[13px] font-sans font-bold text-white uppercase leading-tight truncate mt-0.5" :title="supp.name">
                {{ supp.name }}
              </h2>
              <p class="text-[10px] text-cyan-455 font-mono uppercase tracking-wide mt-1">
                Bassin d'Axe {{ supp.city }} &bull; Région {{ getCameroonRegion(supp.city) }}
              </p>
            </div>
          </div>

          <!-- Technical description and specs -->
          <p class="text-slate-400 text-[11px] leading-relaxed italic">
            "Coopérative partenaire intégrée au segment {{ supp.sector || 'Multimodal B2B' }}. Gère le stockage décentralisé certifié FIFO sous garantie fiduciaire."
          </p>

          <!-- Metrics and actions -->
          <div class="pt-3 border-t border-slate-900 flex justify-between items-center text-[10px] font-mono">
            <div class="text-slate-500">
              Capacité Fret: <span class="text-white font-bold uppercase">CEMAC Standard</span>
            </div>

            <button 
              @click="routeToSupplierProducts(supp.name)"
              class="px-3.5 py-1.5 bg-emerald-955 text-accent-green hover:bg-accent-green hover:text-slate-950 font-bold uppercase rounded-lg border border-emerald-900 hover:border-transparent transition"
            >
              Voir ses lots &rarr;
            </button>
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { suppliers } from '@/utils/seed_data.js';
import PublicHeader from '@/components/PublicHeader.vue';

const router = useRouter();
const searchQuery = ref('');

const filteredSuppliers = computed(() => {
  let list = [...suppliers];
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    list = list.filter(s => s.name.toLowerCase().includes(query) || s.city.toLowerCase().includes(query));
  }
  
  return list;
});

function getCameroonRegion(city) {
  const regions = {
    "Douala": "Littoral",
    "Yaoundé": "Centre",
    "Garoua": "Nord",
    "Bafoussam": "Ouest",
    "Sangmélima": "Sud",
    "Foumbot": "Ouest",
    "Mbouda": "Ouest",
    "Kribi": "Sud",
    "Bamenda": "Nord-Ouest"
  };
  return regions[city] || "Grand Bassin";
}

function routeToSupplierProducts(suppName) {
  router.push({
    path: '/products',
    query: { filterSector: suppName }
  });
}
</script>
