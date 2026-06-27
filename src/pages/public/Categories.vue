<template>
  <div class="min-h-screen bg-light-bg-main dark:bg-[#070b12] text-text-main dark:text-slate-100 flex flex-col justify-between overflow-x-hidden pt-28">
    
    <!-- HEADER NAVBAR -->
    <PublicHeader />

    <main class="flex-1 py-12 px-4 xl:px-12 w-full space-y-12 select-none max-w-[1600px] mx-auto">
      
      <!-- TITLE HEAD -->
      <div class="border-b border-divider dark:border-slate-800 pb-6 text-center sm:text-left">
        <span class="text-[10px] font-sans bg-button-orange/20 text-button-orange border border-button-orange/30 rounded-full px-3 py-1 uppercase tracking-widest font-bold">
          Exploration Mondiale
        </span>
        <h1 class="text-3xl sm:text-4xl font-black text-text-main dark:text-white uppercase font-sans mt-4 flex items-center justify-center sm:justify-start space-x-3 drop-shadow-md">
          <FolderIcon class="h-8 w-8 text-button-orange" />
          <span>Toutes les Catégories</span>
        </h1>
        <p class="text-sm text-slate-400 mt-3 max-w-2xl leading-relaxed">
          Parcourez notre vaste catalogue de produits. Des articles de mode, de l'alimentation générale aux équipements de pointe, trouvez tout ce dont vous avez besoin pour vous ou votre entreprise.
        </p>

        <!-- Quick filter / Search -->
        <div class="mt-6 relative w-full sm:w-96 font-sans text-sm mx-auto sm:mx-0">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Rechercher une catégorie ou un secteur..."
            class="w-full bg-light-bg-main dark:bg-[#0a1017] border border-divider dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-text-main dark:text-white focus:outline-none focus:border-button-orange focus:ring-1 focus:ring-amber-500 transition"
          />
        </div>
      </div>

      <!-- VISUAL CATEGORY CARDS (Jumia/Amazon style) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6 animate-fade-in-up">
        
        <div 
          v-for="(sec, index) in paginatedSectors" 
          :key="sec.name"
          v-animate="{ delay: index * 100 }"
          class="bg-light-bg-main dark:bg-[#0a1017] border border-divider dark:border-slate-800 rounded-2xl overflow-hidden hover:border-button-orange hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all duration-300 group flex flex-col"
        >
          <!-- Image Header (Visual) -->
          <div class="h-36 sm:h-44 w-full overflow-hidden relative bg-light-bg-sec dark:bg-slate-900 border-b border-divider dark:border-slate-800 cursor-pointer" @click="routeToCategory(sec.name)">
            <img :src="sec.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" :alt="sec.name" />
            <div class="absolute inset-0 bg-gradient-to-t from-[#0a1017] via-transparent to-transparent opacity-90"></div>
            <!-- Icon Badge -->
            <div class="absolute bottom-3 left-3 h-10 w-10 bg-button-orange rounded-xl flex items-center justify-center shadow-[0_4px_10px_rgba(245,158,11,0.4)] transform group-hover:-translate-y-1 transition duration-300">
              <component :is="sec.icon" class="h-5 w-5 text-text-main" stroke-width="2.5" />
            </div>
          </div>

          <!-- Content Body -->
          <div class="p-5 flex-1 flex flex-col justify-between">
            <div class="cursor-pointer" @click="routeToCategory(sec.name)">
              <h2 class="text-base sm:text-lg font-black text-text-main dark:text-white font-sans tracking-tight group-hover:text-button-orange transition-colors line-clamp-2 leading-tight">
                {{ sec.name }}
              </h2>
            </div>
            
            <!-- Sub-categories List -->
            <div class="mt-4 space-y-2">
              <div 
                v-for="cat in getSubCategories(sec.name).slice(0, 4)" 
                :key="cat.id"
                @click="routeToSubCategory(cat.id)"
                class="text-[11px] text-slate-400 hover:text-button-orange hover:bg-button-orange/10 px-2 py-1.5 rounded transition cursor-pointer border-l-2 border-transparent hover:border-button-orange"
              >
                {{ cat.name }}
              </div>
              <div v-if="getSubCategories(sec.name).length > 4" class="text-[10px] text-slate-500 italic px-2">
                + {{ getSubCategories(sec.name).length - 4 }} autres sous-catégories...
              </div>
            </div>
            
            <div class="mt-4 pt-4 border-t border-divider dark:border-slate-800 flex items-center justify-between text-[11px] font-sans font-bold text-slate-500 uppercase tracking-wider cursor-pointer" @click="routeToCategory(sec.name)">
              <span>{{ getSubCategories(sec.name).length }} Sélections</span>
              <span class="text-button-orange bg-button-orange/10 px-2 py-1 rounded group-hover:translate-x-1 transition-transform">&rarr; Explorer Tout</span>
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
import { useCategoriesStore } from '@/store/modules/categories.js';
import { useRouter } from 'vue-router';
import PublicHeader from '@/components/PublicHeader.vue';
import { 
  FolderIcon,
  InboxStackIcon,
  TagIcon,
  ShoppingBagIcon,
  WrenchScrewdriverIcon,
  LightBulbIcon,
  ScissorsIcon,
  SparklesIcon,
  PhoneArrowUpRightIcon,
  TruckIcon,
  GlobeAltIcon
} from '@heroicons/vue/24/outline';

const categoriesStore = useCategoriesStore();
const router = useRouter();

// Adding representative images for each sector
const sectors = [
  { name: "Agriculture", icon: InboxStackIcon, image: "https://images.unsplash.com/photo-1592982537447-6f296c0989bf?auto=format&fit=crop&q=80&w=800" },
  { name: "Alimentation Générale", icon: TagIcon, image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800" },
  { name: "Cacao & Café Export", icon: ShoppingBagIcon, image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800" },
  { name: "Matériaux de Construction (BTP)", icon: WrenchScrewdriverIcon, image: "https://images.unsplash.com/photo-1541888081636-61dc225fbd45?auto=format&fit=crop&q=80&w=800" },
  { name: "Énergies & Solaire Africain", icon: LightBulbIcon, image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800" },
  { name: "Textiles Traditional Cameroun", icon: ScissorsIcon, image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800" },
  { name: "Phytothérapie & Pharmacopée", icon: SparklesIcon, image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=800" },
  { name: "Télécoms, Connectivité MTN/Orange", icon: PhoneArrowUpRightIcon, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800" },
  { name: "Flottes & Pièces Logistiques", icon: TruckIcon, image: "https://images.unsplash.com/photo-1586528116311-ad8ed7c50a11?auto=format&fit=crop&q=80&w=800" },
  { name: "Artisanat d'Afrique Centrale", icon: GlobeAltIcon, image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=800" }
];

const searchQuery = ref('');

const filteredSectors = computed(() => {
  // Use actual unique sectors from the store if possible, or fallback to the manual list if we want specific images
  let uniqueSectors = [...new Set(categoriesStore.categories.map(c => c.sector))];
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    uniqueSectors = uniqueSectors.filter(sectorName => {
      if (sectorName.toLowerCase().includes(q)) return true;
      // also match subcategories
      const subcats = categoriesStore.categories.filter(c => c.sector === sectorName);
      return subcats.some(c => c.name.toLowerCase().includes(q));
    });
  }
  
  return uniqueSectors.map(sectorName => {
    // Find matching hardcoded sector for image and icon
    const fallback = sectors.find(s => s.name.includes(sectorName.split(' ')[0])) || sectors[0];
    return {
      name: sectorName,
      icon: fallback.icon,
      image: fallback.image
    };
  });
});

// Pagination logic
const currentPage = ref(1);
const itemsPerPage = 8; // Since there are around 10 sectors, 8 will show pagination

const totalPages = computed(() => Math.ceil(filteredSectors.value.length / itemsPerPage));

const paginatedSectors = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredSectors.value.slice(start, end);
});

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

function getSubCategories(sectorName) {
  let subcats = categoriesStore.categories.filter(c => c.sector === sectorName);
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    subcats = subcats.filter(c => c.name.toLowerCase().includes(q) || c.sector.toLowerCase().includes(q));
  }
  return subcats;
}

function routeToCategory(sectorName) {
  router.push({
    path: '/products',
    query: { filterSector: sectorName }
  });
}

function routeToSubCategory(categoryId) {
  router.push({
    path: '/products',
    query: { category: categoryId }
  });
}
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
}
</style>

