<template>
  <div class="min-h-screen bg-light-bg-main dark:bg-[#070b12] text-text-main dark:text-slate-100 flex flex-col justify-between overflow-x-hidden pt-28">
    
    <!-- NAVIGATION HEADER -->
    <PublicHeader />

    <main class="flex-1 w-full space-y-12 select-none" v-if="supplier">
      
      <!-- STOREFRONT HERO BANNER -->
      <section class="relative h-64 md:h-80 xl:h-96 w-full">
        <img :src="getSupplierBanner(supplier.id)" class="w-full h-full object-cover brightness-[0.6]" alt="Boutique Banner" />
        <div class="absolute inset-0 bg-gradient-to-t from-[#070b12] via-[#070b12]/60 to-transparent"></div>
        
        <div class="absolute bottom-0 left-0 w-full px-4 xl:px-12 pb-8 flex flex-col md:flex-row items-end justify-between gap-6">
          <div class="flex items-end gap-6">
            <div class="h-24 w-24 md:h-32 md:w-32 rounded-3xl bg-light-bg-main dark:bg-slate-950 border-4 border-[#070b12] flex items-center justify-center text-button-orange shadow-2xl shrink-0">
              <component :is="getSupplierIcon(supplier)" class="h-12 w-12 md:h-16 md:w-16 text-button-orange" />
            </div>
            <div class="mb-2">
              <div class="flex items-center gap-3">
                <h1 class="text-3xl md:text-5xl font-black text-text-main dark:text-white uppercase tracking-tight drop-shadow-md">
                  {{ supplier.name }}
                </h1>
                <div v-if="getVerificationLevel(supplier.id) === 'Premium'" class="bg-purple-600/20 border border-purple-500 text-purple-400 px-2 py-0.5 rounded text-[10px] uppercase font-bold flex items-center gap-1">
                  ⭐ Premium
                </div>
                <div v-else-if="getVerificationLevel(supplier.id) === 'Top'" class="bg-button-orange/20 border border-button-orange text-button-orange px-2 py-0.5 rounded text-[10px] uppercase font-bold flex items-center gap-1">
                  🏅 Top Vendeur
                </div>
                <div v-else-if="getVerificationLevel(supplier.id) === 'Verified'" class="bg-accent-green/20 border border-accent-green text-accent-green px-2 py-0.5 rounded text-[10px] uppercase font-bold flex items-center gap-1">
                  <ShieldCheckIcon class="h-4 w-4" /> Vérifié
                </div>
              </div>
              <p class="text-button-orange font-sans font-bold tracking-wider mt-2 uppercase flex items-center gap-2">
                <MapPinIcon class="h-4 w-4" /> Basé à {{ supplier.city }} (Cameroun)
              </p>
              <p class="text-text-sec dark:text-slate-300 mt-2 max-w-2xl text-sm italic">
                "{{ getSupplierSlogan(supplier) }}"
              </p>
            </div>
          </div>

          <div class="flex flex-col items-end gap-3 shrink-0 w-full md:w-auto">
            <!-- Boutique favorite action for logged-in buyers -->
            <button 
              v-if="isBuyer"
              @click="toggleSaveStore"
              class="px-4 py-2.5 rounded-xl text-xs font-sans font-bold uppercase transition flex items-center justify-center gap-2 border shadow-md w-full md:w-auto"
              :class="isStoreSaved ? 'bg-rose-600 border-rose-500 text-white hover:bg-rose-700' : 'bg-slate-900/80 backdrop-blur-md text-white border-slate-700 hover:bg-slate-800'"
            >
              <HeartIcon class="h-4.5 w-4.5" :class="isStoreSaved ? 'fill-current text-white' : 'text-slate-300'" />
              <span>{{ isStoreSaved ? 'Boutique Enregistrée' : 'Enregistrer Boutique' }}</span>
            </button>

            <!-- STATS CARD -->
            <div class="bg-light-bg-sec dark:bg-slate-900/80 backdrop-blur-md border border-divider dark:border-slate-800 rounded-xl p-4 flex gap-6 shadow-xl w-full md:w-auto justify-around">
              <div class="text-center">
                <p class="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Produits</p>
                <p class="text-xl text-text-main dark:text-white font-black">{{ supplierProducts.length }}</p>
              </div>
              <div class="text-center">
                <p class="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Évaluation</p>
                <p class="text-xl text-button-orange font-black">{{ supplier.rating }} <span class="text-xs">/5</span></p>
              </div>
              <div class="text-center">
                <p class="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Ventes</p>
                <p class="text-xl text-accent-green font-black">+{{ Math.floor(Math.random() * 500) + 50 }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- NAVIGATION TABS -->
      <section class="px-4 xl:px-12 max-w-[1600px] mx-auto border-b border-divider dark:border-slate-800 flex gap-8">
        <button 
          @click="activeTab = 'products'"
          :class="['pb-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2', activeTab === 'products' ? 'text-button-orange border-button-orange' : 'text-slate-500 border-transparent hover:text-text-sec dark:text-slate-300']"
        >
          Produits de la Boutique
        </button>
        <button 
          @click="activeTab = 'about'"
          :class="['pb-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2', activeTab === 'about' ? 'text-button-orange border-button-orange' : 'text-slate-500 border-transparent hover:text-text-sec dark:text-slate-300']"
        >
          À Propos
        </button>
        <button 
          @click="activeTab = 'contact'"
          :class="['pb-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2', activeTab === 'contact' ? 'text-button-orange border-button-orange' : 'text-slate-500 border-transparent hover:text-text-sec dark:text-slate-300']"
        >
          Contactez-nous
        </button>
      </section>

      <!-- SUPPLIER PRODUCTS LISTING -->
      <section v-if="activeTab === 'products'" class="px-4 xl:px-12 max-w-[1600px] mx-auto">
        <div class="flex items-center justify-between border-b border-divider dark:border-slate-800 pb-4 mb-8">
          <h2 class="text-xl font-sans font-black text-text-main dark:text-white uppercase">Tous les produits de la boutique</h2>
          
          <div class="relative w-64">
            <input 
              type="text" 
              v-model="searchQuery"
              placeholder="Rechercher dans cette boutique..."
              class="w-full bg-light-bg-main dark:bg-[#0a1017] border border-divider dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-text-main dark:text-white focus:outline-none focus:border-button-orange transition"
            />
          </div>
        </div>

        <div v-if="filteredProducts.length === 0" class="text-center py-20 bg-light-bg-main dark:bg-[#0a1017] rounded-3xl border border-divider dark:border-slate-800">
          <p class="text-slate-400 text-lg">Aucun produit trouvé dans cette boutique.</p>
        </div>

        <div v-else class="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 md:gap-6 space-y-4 md:space-y-6">
          <div 
            v-for="prod in filteredProducts" 
            :key="prod.id"
            class="break-inside-avoid bg-light-bg-main dark:bg-[#0a1017] border border-divider dark:border-slate-800 rounded-2xl overflow-hidden hover:border-button-orange/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] transition-all duration-300 group flex flex-col"
          >
            <!-- Image -->
            <div 
              class="relative w-full overflow-hidden bg-light-bg-sec dark:bg-slate-900 border-b border-divider dark:border-slate-800 cursor-pointer"
            >
              <img 
                :src="prod.image" 
                class="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-[0.9]" 
              />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              
              <button 
                @click.stop="cartStore.toggleWishlist(prod)"
                class="absolute top-3 right-3 h-8 w-8 rounded-full bg-light-bg-sec dark:bg-slate-900/80 backdrop-blur border flex items-center justify-center transition-colors shadow-lg z-10"
                :class="cartStore.isInWishlist(prod.id) ? 'border-rose-500 text-rose-500' : 'border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-400'"
              >
                <HeartIcon class="h-4 w-4" :class="cartStore.isInWishlist(prod.id) ? 'fill-current' : ''" />
              </button>
            </div>

            <!-- Details -->
            <div class="p-4 flex flex-col justify-between flex-1 relative">
              <div>
                <span class="text-[9px] uppercase font-mono text-accent-green bg-accent-green/10 px-1.5 py-0.5 rounded border border-accent-green/20">
                  {{ prod.unit }}
                </span>
                <h3 class="mt-2 text-[13px] font-sans font-bold text-text-main dark:text-white leading-tight group-hover:text-button-orange transition-colors line-clamp-2">
                  {{ prod.name }}
                </h3>
              </div>
              
              <div class="mt-4 pt-3 border-t border-divider dark:border-slate-800">
                <div class="flex items-end justify-between">
                  <div>
                    <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-0.5">Prix Unitaire</p>
                    <p class="text-base font-black text-button-orange font-sans leading-none">{{ formatCFA(prod.price) }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-0.5">Dispo</p>
                    <p class="text-xs font-bold font-mono" :class="prod.stock > 0 ? 'text-accent-green' : 'text-red-500'">
                      {{ prod.stock }}
                    </p>
                  </div>
                </div>
                
                <button 
                  @click="addPromoToCart(prod)"
                  class="w-full mt-4 bg-light-bg-sec dark:bg-slate-800 hover:bg-button-orange text-text-sec dark:text-slate-300 hover:text-text-main border border-slate-700 hover:border-button-orange font-sans font-black text-[11px] uppercase tracking-wider py-2.5 rounded-lg transition-all flex justify-center items-center gap-2"
                >
                  <ShoppingCartIcon class="h-4 w-4" /> Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ABOUT US SECTION -->
      <section v-if="activeTab === 'about'" class="px-4 xl:px-12 max-w-[1600px] mx-auto text-text-sec dark:text-slate-300 space-y-6">
        <div class="bg-light-bg-main dark:bg-[#0a1017] border border-divider dark:border-slate-800 rounded-3xl p-8 md:p-12">
          <h2 class="text-2xl font-black text-text-main dark:text-white uppercase mb-6">À Propos de {{ supplier.name }}</h2>
          <p class="leading-relaxed mb-6">
            Fondée et établie à {{ supplier.city }}, notre boutique officielle s'engage à vous fournir des produits et services de la plus haute qualité. Forts d'une grande expertise dans le secteur <strong>{{ getSupplierAssignedSector(supplier) }}</strong>, nous desservons aussi bien les détaillants que les acheteurs grossistes à la recherche de volumes importants.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div class="bg-light-bg-sec dark:bg-slate-900/50 p-6 rounded-2xl border border-divider dark:border-slate-800">
              <h3 class="text-button-orange font-bold uppercase text-sm mb-3">Notre Mission</h3>
              <p class="text-sm">Garantir une traçabilité parfaite, des prix compétitifs et une livraison fiable pour l'ensemble de notre catalogue. Nous visons l'excellence opérationnelle pour chaque commande passée sur la marketplace Kong S.A.</p>
            </div>
            <div class="bg-light-bg-sec dark:bg-slate-900/50 p-6 rounded-2xl border border-divider dark:border-slate-800">
              <h3 class="text-button-orange font-bold uppercase text-sm mb-3">Garanties</h3>
              <ul class="text-sm space-y-2">
                <li class="flex items-center gap-2"><ShieldCheckIcon class="h-4 w-4 text-accent-green" /> Qualité Certifiée</li>
                <li class="flex items-center gap-2"><TruckIcon class="h-4 w-4 text-accent-green" /> Expédition en moins de 48h</li>
                <li class="flex items-center gap-2"><UserGroupIcon class="h-4 w-4 text-accent-green" /> Service Client dédié</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- CONTACT SECTION -->
      <section v-if="activeTab === 'contact'" class="px-4 xl:px-12 max-w-[1600px] mx-auto text-text-sec dark:text-slate-300">
        <div class="bg-light-bg-main dark:bg-[#0a1017] border border-divider dark:border-slate-800 rounded-3xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 class="text-2xl font-black text-text-main dark:text-white uppercase mb-6">Contactez-nous</h2>
            <p class="leading-relaxed mb-8">
              Pour toute demande spécifique, négociation de prix de gros ou question sur une commande, n'hésitez pas à remplir le formulaire ou à utiliser nos coordonnées directes.
            </p>
            <div class="space-y-4 text-sm">
              <p class="flex items-center gap-3"><MapPinIcon class="h-5 w-5 text-button-orange" /> <strong>Adresse :</strong> Quartier Commercial, {{ supplier.city }}, Cameroun</p>
              <p class="flex items-center gap-3"><BriefcaseIcon class="h-5 w-5 text-button-orange" /> <strong>Disponibilité :</strong> Lun - Sam : 08h00 - 18h00</p>
              <p class="flex items-center gap-3"><span class="h-5 w-5 flex items-center justify-center text-button-orange font-bold text-lg">@</span> <strong>Email :</strong> contact@{{ supplier.id.toLowerCase().replace('_', '') }}.kong.cm</p>
            </div>
          </div>
          <div>
            <form class="space-y-4" @submit.prevent>
              <div>
                <label class="block text-xs font-bold uppercase text-slate-500 mb-2">Sujet</label>
                <input type="text" class="w-full bg-light-bg-sec dark:bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-button-orange focus:outline-none" placeholder="Ex: Demande de devis" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase text-slate-500 mb-2">Message</label>
                <textarea rows="4" class="w-full bg-light-bg-sec dark:bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-button-orange focus:outline-none" placeholder="Votre message..."></textarea>
              </div>
              <button class="w-full bg-button-orange hover:bg-button-orange\/90 text-text-main font-black uppercase text-sm py-3 rounded-xl transition">
                Envoyer le Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>

    <div v-else class="flex-1 flex items-center justify-center py-40">
      <div class="text-center space-y-4">
        <div class="h-16 w-16 border-4 border-button-orange border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p class="text-slate-400 font-mono text-sm uppercase tracking-wider">Chargement de la boutique...</p>
      </div>
    </div>

    <!-- MAIN PLATFORM FOOTER -->
    <!-- FOOTER -->
    <PublicFooter />

  </div>
</template>

<script setup>
import PublicFooter from '@/components/PublicFooter.vue';
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { suppliers } from '@/utils/seed_data.js';
import { useProductsStore } from '@/store/modules/products.js';
import { useCartStore } from '@/store/modules/cart.js';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/store/modules/auth.js';
import PublicHeader from '@/components/PublicHeader.vue';
import { 
  UserGroupIcon, 
  BuildingOfficeIcon, 
  ShieldCheckIcon, 
  ShoppingCartIcon,
  TruckIcon,
  BriefcaseIcon,
  CpuChipIcon,
  HomeModernIcon,
  MapPinIcon,
  HeartIcon
} from '@heroicons/vue/24/outline';

const route = useRoute();
const router = useRouter();
const productsStore = useProductsStore();
const cartStore = useCartStore();
const toast = useToast();
const authStore = useAuthStore();

const supplierId = ref(route.params.id);
const supplier = ref(null);
const supplierProducts = ref([]);
const searchQuery = ref('');
const activeTab = ref('products');

const isBuyer = computed(() => authStore.user?.role === 'buyer');
const savedShops = ref([]);

const defaultSavedShops = [
  {
    id: 'store_dist_1_main',
    name: 'AgroDistrib Centre-Sud',
    description: 'Boutique officielle AgroDistrib Cameroun pour la livraison en gros de maïs blanc séché et cacao brut.'
  },
  {
    id: 'store_vendor_1_main',
    name: 'TechSupplies Cameroun Shop',
    description: 'Boutique officielle TechSupplies SARL pour la vente d\'ordinateurs HP ProBook, souris sans fil et accessoires informatiques.'
  }
];

const isStoreSaved = computed(() => {
  return savedShops.value.some(s => s.id === supplierId.value);
});

function toggleSaveStore() {
  if (!supplier.value) return;
  if (isStoreSaved.value) {
    savedShops.value = savedShops.value.filter(s => s.id !== supplierId.value);
    toast.success("Boutique retirée de vos favoris.");
  } else {
    savedShops.value.push({
      id: supplier.value.id,
      name: supplier.value.name,
      description: getSupplierSlogan(supplier.value)
    });
    toast.success("Boutique enregistrée dans vos favoris !");
  }
  localStorage.setItem('saved_shops_buyer', JSON.stringify(savedShops.value));
}

onMounted(() => {
  const found = suppliers.find(s => s.id === supplierId.value);
  if (!found) {
    toast.error("Boutique introuvable.");
    router.push('/suppliers');
    return;
  }
  supplier.value = found;
  
  // Filter products by this supplier
  supplierProducts.value = productsStore.products.filter(p => p.supplierId === supplierId.value);

  // Load saved shops from localStorage
  const saved = localStorage.getItem('saved_shops_buyer');
  if (saved) {
    savedShops.value = JSON.parse(saved);
  } else {
    savedShops.value = defaultSavedShops;
    localStorage.setItem('saved_shops_buyer', JSON.stringify(defaultSavedShops));
  }
});

const filteredProducts = computed(() => {
  if (!searchQuery.value) return supplierProducts.value;
  const q = searchQuery.value.toLowerCase();
  return supplierProducts.value.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
});

function addPromoToCart(product) {
  cartStore.addToCart(product, 1);
  toast.success(`[AJOUTÉ] 1x ${product.name} au panier.`);
}

function formatCFA(val) {
  if (val === undefined || val === null) return '0 CFA';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('FCFA', 'CFA').replace('XAF', 'CFA');
}

function getSupplierAssignedSector(supp) {
  const num = parseInt(supp.id.split('_')[1]) || 1;
  const sectorsList = ["Agriculture & Alimentation", "Électronique & High-Tech", "Mode & Textiles", "Énergies & Solaire", "Maison & BTP", "Santé & Beauté", "Automobile & Pièces", "Logistique & Transport"];
  return sectorsList[num % sectorsList.length];
}

function getSupplierBanner(id) {
  const suppObj = { id };
  const sector = getSupplierAssignedSector(suppObj);
  const banners = {
    "Agriculture & Alimentation": "https://images.unsplash.com/photo-1592982537447-6f296c0989bf?auto=format&fit=crop&q=80&w=1200",
    "Électronique & High-Tech": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1200",
    "Mode & Textiles": "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=1200",
    "Énergies & Solaire": "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=1200",
    "Maison & BTP": "https://images.unsplash.com/photo-1541888081636-61dc225fbd45?auto=format&fit=crop&q=80&w=1200",
    "Santé & Beauté": "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=1200",
    "Automobile & Pièces": "https://images.unsplash.com/photo-1586528116311-ad8ed7c50a11?auto=format&fit=crop&q=80&w=1200",
    "Logistique & Transport": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200"
  };
  return banners[sector] || "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&q=80&w=1200";
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
  return slogans[sector] || "Qualité et service client exceptionnel.";
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
</script>
