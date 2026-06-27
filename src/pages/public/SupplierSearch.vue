<template>
  <div class="min-h-screen bg-light-bg-main dark:bg-[#070b12] text-text-main dark:text-slate-100 flex flex-col justify-between overflow-x-hidden pt-28">
    
    <!-- NAVIGATION HEADER -->
    <PublicHeader />

    <main class="flex-1 py-12 px-4 xl:px-12 w-full space-y-12 select-none max-w-[1600px] mx-auto">
      
      <!-- HEADING GRID -->
      <div class="border-b border-divider dark:border-slate-800 pb-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span class="text-[10px] font-sans bg-button-orange/20 text-button-orange border border-button-orange/30 rounded-full px-3 py-1 uppercase tracking-widest font-bold">
            Réseau Officiel
          </span>
          <h1 class="text-3xl sm:text-4xl font-black text-text-main dark:text-white uppercase font-sans mt-4 flex items-center justify-center sm:justify-start space-x-3 drop-shadow-md">
            <UserGroupIcon class="h-8 w-8 text-button-orange" />
            <span>Boutiques & Vendeurs</span>
          </h1>
          <p class="text-sm text-slate-400 mt-3 max-w-2xl leading-relaxed">
            Découvrez nos marchands certifiés. Les meilleures boutiques avec des produits de qualité, un service client irréprochable et des avis vérifiés.
          </p>
        </div>

        <!-- Quick filter / Search -->
        <div class="relative w-full sm:w-auto font-sans flex flex-col sm:flex-row gap-4">
          <select 
            v-model="filterSector"
            class="bg-light-bg-main dark:bg-[#0a1017] border border-divider dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-text-sec dark:text-slate-300 focus:outline-none focus:border-button-orange focus:ring-1 focus:ring-amber-500 transition cursor-pointer"
          >
            <option value="">Tous les Secteurs</option>
            <option value="Agriculture & Alimentation">Agriculture & Alimentation</option>
            <option value="Électronique & High-Tech">Électronique & High-Tech</option>
            <option value="Mode & Textiles">Mode & Textiles</option>
            <option value="Maison & BTP">Maison & BTP</option>
            <option value="Logistique & Transport">Logistique & Transport</option>
          </select>

          <select 
            v-model="filterRegion"
            class="bg-light-bg-main dark:bg-[#0a1017] border border-divider dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-text-sec dark:text-slate-300 focus:outline-none focus:border-button-orange focus:ring-1 focus:ring-amber-500 transition cursor-pointer"
          >
            <option value="">Toutes Régions / Pays</option>
            <option value="Littoral">Littoral (Douala)</option>
            <option value="Centre">Centre (Yaoundé)</option>
            <option value="Nord">Nord (Garoua)</option>
            <option value="Ouest">Ouest (Bafoussam)</option>
            <option value="Sud">Sud (Kribi, Ebolowa)</option>
            <option value="International">International</option>
          </select>

          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Rechercher une boutique..."
            class="w-full sm:w-80 bg-light-bg-main dark:bg-[#0a1017] border border-divider dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-text-main dark:text-white focus:outline-none focus:border-button-orange focus:ring-1 focus:ring-amber-500 transition"
          />
        </div>
      </div>

      <!-- SUPPLIERS CONTAINER GRID -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 animate-fade-in-up">
        
        <div 
          v-for="(supp, index) in paginatedSuppliers" 
          :key="supp.id"
          v-animate="{ delay: index * 100 }"
          class="bg-light-bg-main dark:bg-[#0a1017] border border-divider dark:border-slate-800 rounded-3xl overflow-hidden hover:border-button-orange/50 hover:shadow-[0_0_25px_rgba(245,158,11,0.1)] transition duration-500 relative group flex flex-col"
        >
          <!-- Vendor Banner -->
          <div class="h-32 w-full relative bg-light-bg-sec dark:bg-slate-900 overflow-hidden cursor-pointer" @click="routeToSupplierProducts(supp.id)">
            <img :src="getSupplierBanner(supp)" class="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" alt="Banner" />
            <div class="absolute inset-0 bg-gradient-to-t from-[#0a1017] via-[#0a1017]/60 to-transparent"></div>
            
            <span v-if="getVerificationLevel(supp.id) === 'Premium'" class="absolute top-4 right-4 bg-purple-600 text-text-main dark:text-white text-[10px] font-sans px-2.5 py-1 rounded-full uppercase font-black shadow-lg shadow-purple-500/50 flex items-center gap-1">
              ⭐ Vendeur Premium
            </span>
            <span v-else-if="getVerificationLevel(supp.id) === 'Top'" class="absolute top-4 right-4 bg-button-orange text-text-main text-[10px] font-sans px-2.5 py-1 rounded-full uppercase font-black shadow-lg flex items-center gap-1">
              🏅 Top Vendeur
            </span>
            <span v-else-if="getVerificationLevel(supp.id) === 'Verified'" class="absolute top-4 right-4 bg-accent-green text-text-main text-[10px] font-sans px-2.5 py-1 rounded-full uppercase font-black shadow-lg flex items-center gap-1">
              <ShieldCheckIcon class="h-3 w-3" /> Vérifié Basique
            </span>
          </div>

          <div class="p-6 pt-0 flex-1 flex flex-col relative">
            <!-- Avatar / Logo -->
            <div class="h-16 w-16 rounded-2xl bg-light-bg-main dark:bg-slate-950 border-4 border-[#0a1017] flex items-center justify-center text-button-orange shrink-0 absolute -top-8 left-6 shadow-xl cursor-pointer" @click="routeToSupplierProducts(supp.id)">
              <component :is="getSupplierIcon(supp)" class="h-8 w-8 text-button-orange" />
            </div>

            <div class="mt-10 mb-4 cursor-pointer" @click="routeToSupplierProducts(supp.id)">
              <h2 class="text-xl font-sans font-black text-text-main dark:text-white uppercase leading-tight truncate hover:text-button-orange transition" :title="supp.name">
                {{ supp.name }}
              </h2>
              <p class="text-[10px] text-button-orange font-sans font-bold tracking-wide mt-1 uppercase flex items-center gap-2 flex-wrap">
                <span class="bg-button-orange/10 border border-button-orange/20 px-2 py-0.5 rounded">{{ getSupplierAssignedSector(supp) }}</span>
                <span>Basé à {{ supp.city }}</span>
              </p>
              <p class="text-slate-400 text-sm mt-3 leading-relaxed italic line-clamp-2">
                "{{ getSupplierSlogan(supp) }}"
              </p>
            </div>

            <!-- Stats & Top Products Preview -->
            <div class="mt-auto space-y-5">
              <div class="flex items-center gap-3 text-xs font-sans font-bold text-text-sec dark:text-slate-300 flex-wrap">
                <div class="bg-light-bg-sec dark:bg-slate-900 border border-divider dark:border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <span class="text-button-orange">⭐</span> {{ supp.rating }}
                </div>
                
                <div v-if="getVerificationLevel(supp.id) === 'Premium'" class="bg-light-bg-sec dark:bg-slate-900 border border-purple-900/50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-purple-400">
                  <ShieldCheckIcon class="h-4 w-4" /> Certifié Premium
                </div>
                <div v-else-if="getVerificationLevel(supp.id) === 'Top'" class="bg-light-bg-sec dark:bg-slate-900 border border-amber-900/50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-button-orange">
                  <ShieldCheckIcon class="h-4 w-4" /> Top
                </div>
                <div v-else-if="getVerificationLevel(supp.id) === 'Verified'" class="bg-light-bg-sec dark:bg-slate-900 border border-emerald-900/50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-accent-green">
                  <ShieldCheckIcon class="h-4 w-4" /> Vérifié
                </div>
                <div v-else class="bg-light-bg-sec dark:bg-slate-900 border border-divider dark:border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-slate-500">
                  <ShieldExclamationIcon class="h-4 w-4" /> Non vérifié
                </div>
                
                <div class="bg-light-bg-sec dark:bg-slate-900 border border-divider dark:border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <ShoppingCartIcon class="h-4 w-4 text-slate-500" />
                  {{ Math.floor(Math.random() * 500) + 50 }} Ventes
                </div>
              </div>

              <div class="pt-4 border-t border-divider dark:border-slate-800 flex justify-between items-center">
                <button 
                  @click="routeToSupplierProducts(supp.id)"
                  class="w-full py-3 bg-button-orange hover:bg-button-orange\/90 text-text-main font-black uppercase rounded-xl transition shadow-lg shadow-amber-500/20 text-sm flex items-center justify-center gap-2"
                >
                  Visiter la Boutique <span class="text-lg">&rarr;</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      <!-- PAGINATION CONTROLS -->
      <div class="flex items-center justify-center space-x-2 mt-12" v-if="totalPages > 1">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1"
          class="px-4 py-2 rounded-xl border border-divider dark:border-slate-800 bg-light-bg-main dark:bg-[#0a1017] text-slate-400 hover:text-button-orange hover:border-button-orange disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          &larr; Précédent
        </button>
        <div class="flex items-center space-x-1">
          <button 
            v-for="page in totalPages" 
            :key="page"
            @click="currentPage = page"
            :class="[
              'w-10 h-10 rounded-xl border flex items-center justify-center text-sm font-bold transition',
              currentPage === page 
                ? 'bg-button-orange text-text-main border-button-orange' 
                : 'bg-light-bg-main dark:bg-[#0a1017] text-slate-400 border-divider dark:border-slate-800 hover:border-button-orange hover:text-button-orange'
            ]"
            v-show="Math.abs(page - currentPage) < 3 || page === 1 || page === totalPages"
          >
            {{ page }}
          </button>
        </div>
        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
          class="px-4 py-2 rounded-xl border border-divider dark:border-slate-800 bg-light-bg-main dark:bg-[#0a1017] text-slate-400 hover:text-button-orange hover:border-button-orange disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Suivant &rarr;
        </button>
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
import { useRouter } from 'vue-router';
import { suppliers } from '@/utils/seed_data.js';
import PublicHeader from '@/components/PublicHeader.vue';
import { 
  UserGroupIcon, 
  BuildingOfficeIcon, 
  ShieldCheckIcon, 
  ShieldExclamationIcon,
  ShoppingCartIcon,
  TruckIcon,
  BriefcaseIcon,
  CpuChipIcon,
  HomeModernIcon
} from '@heroicons/vue/24/outline';

const router = useRouter();
const searchQuery = ref('');
const filterSector = ref('');
const filterRegion = ref('');

const filteredSuppliers = computed(() => {
  let list = [...suppliers];
  
  if (filterSector.value) {
    list = list.filter(s => getSupplierAssignedSector(s.id) === filterSector.value);
  }

  if (filterRegion.value) {
    list = list.filter(s => {
      if (filterRegion.value === 'International') {
        return getCameroonRegion(s.city) === 'National';
      }
      return getCameroonRegion(s.city) === filterRegion.value;
    });
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    list = list.filter(s => s.name.toLowerCase().includes(query) || s.city.toLowerCase().includes(query));
  }
  
  return list;
});

// Pagination logic
const currentPage = ref(1);
const itemsPerPage = 9;

const totalPages = computed(() => Math.ceil(filteredSuppliers.value.length / itemsPerPage));

const paginatedSuppliers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredSuppliers.value.slice(start, end);
});

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

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
  return regions[city] || "National";
}

function getSupplierAssignedSector(supp) {
  const num = parseInt(supp.id.split('_')[1]) || 1;
  const sectorsList = ["Agriculture & Alimentation", "Électronique & High-Tech", "Mode & Textiles", "Énergies & Solaire", "Maison & BTP", "Santé & Beauté", "Automobile & Pièces", "Logistique & Transport"];
  return sectorsList[num % sectorsList.length];
}

function getSupplierBanner(supp) {
  const sector = getSupplierAssignedSector(supp);
  const banners = {
    "Agriculture & Alimentation": "https://images.unsplash.com/photo-1592982537447-6f296c0989bf?auto=format&fit=crop&q=80&w=800",
    "Électronique & High-Tech": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800",
    "Mode & Textiles": "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800",
    "Énergies & Solaire": "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800",
    "Maison & BTP": "https://images.unsplash.com/photo-1541888081636-61dc225fbd45?auto=format&fit=crop&q=80&w=800",
    "Santé & Beauté": "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=800",
    "Automobile & Pièces": "https://images.unsplash.com/photo-1586528116311-ad8ed7c50a11?auto=format&fit=crop&q=80&w=800",
    "Logistique & Transport": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800"
  };
  return banners[sector] || "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&q=80&w=800";
}

function getSupplierSlogan(supp) {
  const sector = getSupplierAssignedSector(supp);
  const slogans = {
    "Agriculture & Alimentation": "Produits agricoles de première qualité.",
    "Électronique & High-Tech": "L'innovation technologique à votre portée.",
    "Mode & Textiles": "Créateur de tendances et tissus d'exception.",
    "Énergies & Solaire": "Solutions énergétiques durables.",
    "Maison & BTP": "Matériaux robustes pour tous vos chantiers.",
    "Santé & Beauté": "Bien-être et cosmétiques naturels.",
    "Automobile & Pièces": "Pièces et accessoires auto certifiés.",
    "Logistique & Transport": "Expéditions rapides et sécurisées."
  };
  return slogans[sector] || "Qualité et service exceptionnel.";
}

function getSupplierIcon(supp) {
  const sector = getSupplierAssignedSector(supp);
  const icons = {
    "Agriculture & Alimentation": ShoppingCartIcon,
    "Électronique & High-Tech": CpuChipIcon,
    "Mode & Textiles": UserGroupIcon,
    "Énergies & Solaire": BriefcaseIcon,
    "Maison & BTP": BuildingOfficeIcon,
    "Santé & Beauté": HomeModernIcon,
    "Automobile & Pièces": TruckIcon,
    "Logistique & Transport": TruckIcon
  };
  return icons[sector] || BuildingOfficeIcon;
}

function getVerificationLevel(id) {
  const num = parseInt(id.split('_')[1]) || 1;
  if (num % 5 === 0) return 'Premium';
  if (num % 3 === 0) return 'Top';
  if (num % 2 !== 0) return 'Verified';
  return 'Standard';
}

function getSupplierVerified(id) {
  const verifiedList = ["SUP-DLA-01", "SUP-SGL-05", "SUP-YDE-02"];
  return verifiedList.includes(id);
}

function routeToSupplierProducts(suppId) {
  router.push({
    path: `/store/${suppId}`
  });
}
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}
</style>
