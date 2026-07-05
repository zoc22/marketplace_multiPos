<template>
  <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between overflow-x-hidden pt-8">
    <main class="flex-1 w-full max-w-5xl mx-auto px-4 py-8 space-y-12" v-if="store">
      <!-- Store Header / Hero -->
      <header 
        class="relative h-64 w-full rounded-3xl overflow-hidden p-8 flex items-end shadow-2xl transition-all duration-700"
        :class="getAnimationClass"
        :style="{
          background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary || '#4f46e5'} 100%)`
        }"
      >
        <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div class="relative z-10 flex items-center space-x-6">
          <div 
            class="h-20 w-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center font-black text-3xl shadow-lg border border-white/20"
            :style="{ color: config.colors.text === '#ffffff' ? '#ffffff' : config.colors.primary }"
          >
            {{ store.name?.charAt(0) }}
          </div>
          <div>
            <h1 
              class="text-3xl font-black tracking-tight uppercase"
              :style="{ color: config.colors.text }"
            >
              {{ store.name }}
            </h1>
            <p class="text-sm opacity-90 mt-1" :style="{ color: config.colors.text }">
              📍 Boutique officielle en ligne • Cameroun
            </p>
          </div>
        </div>

        <div class="absolute top-6 right-6 px-4 py-1.5 rounded-full text-xs font-bold bg-white/10 backdrop-blur border border-white/20">
          Site Vitrine Hors-ERP 🌐
        </div>
      </header>

      <!-- Widgets Canvas Render -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Sidebar Widget Column -->
        <div class="space-y-6">
          <div class="bg-slate-800/80 backdrop-blur border border-slate-700/60 p-6 rounded-2xl space-y-4">
            <h4 class="font-bold text-xs uppercase text-slate-400 tracking-wider">À propos de nous</h4>
            <p class="text-sm text-slate-300 leading-relaxed">{{ store.description }}</p>
          </div>

          <!-- Custom sidebar widgets or Contact -->
          <div 
            v-if="hasWidget('contact')"
            class="bg-slate-800/80 backdrop-blur border border-slate-700/60 p-6 rounded-2xl space-y-4"
          >
            <h4 class="font-bold text-xs uppercase text-slate-400 tracking-wider">Contact & Devis</h4>
            <form class="space-y-3" @submit.prevent="submitContact">
              <input type="text" placeholder="Votre Email" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-500" required />
              <textarea placeholder="Votre message ou demande de prix..." rows="3" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-500" required></textarea>
              <button 
                type="submit" 
                class="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition"
              >
                Envoyer la demande
              </button>
            </form>
          </div>
        </div>

        <!-- Main widgets render columns -->
        <div class="md:col-span-2 space-y-8">
          <div v-for="w in activeWidgets" :key="w.id" class="space-y-4">
            <!-- Header Widget -->
            <div v-if="w.type === 'hero'" class="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700/50 p-8 rounded-3xl relative overflow-hidden">
              <div class="relative z-10 max-w-md space-y-3">
                <span class="text-xs font-bold text-indigo-400 uppercase tracking-widest">{{ w.title }}</span>
                <h3 class="text-2xl font-extrabold text-white leading-tight">{{ w.subtitle }}</h3>
                <p class="text-xs text-slate-300 leading-relaxed">{{ w.description }}</p>
              </div>
              <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl"></div>
            </div>

            <!-- Products Grid Widget -->
            <div v-if="w.type === 'products'" class="space-y-4">
              <h4 class="font-black text-sm uppercase text-slate-400 tracking-wider flex items-center justify-between">
                <span>{{ w.title || 'Nos Articles' }}</span>
                <span class="h-1 flex-1 bg-slate-700/60 mx-4"></span>
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div v-for="p in storeProducts" :key="p.id" class="bg-slate-800 border border-slate-700/40 rounded-2xl overflow-hidden p-4 flex flex-col justify-between space-y-3 hover:border-indigo-500/50 transition">
                  <div>
                    <img :src="p.images[0] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=150&q=80'" class="h-32 w-full object-cover rounded-xl border border-slate-700/60 mb-3" />
                    <h5 class="font-bold text-sm text-white">{{ p.name }}</h5>
                    <p class="text-xs text-slate-400 mt-1 line-clamp-2">{{ p.description }}</p>
                  </div>
                  <div class="flex justify-between items-center pt-2">
                    <span class="font-black text-indigo-400 text-sm">{{ formatMoney(p.price) }}</span>
                    <button class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] rounded-lg transition">
                      Acheter en direct
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Rich Info Widget -->
            <div v-if="w.type === 'info'" class="bg-slate-800/50 border border-slate-700/40 p-6 rounded-2xl space-y-2">
              <h4 class="font-bold text-sm text-white">{{ w.title }}</h4>
              <p class="text-xs text-slate-300 leading-relaxed">{{ w.content }}</p>
            </div>

            <!-- Footer / Reassurance Widget -->
            <div v-if="w.type === 'footer'" class="grid grid-cols-3 gap-4 text-center">
              <div v-for="(feat, idx) in w.features" :key="idx" class="bg-slate-800/40 border border-slate-700/40 p-3 rounded-xl">
                <p class="text-[10px] font-bold text-white uppercase">{{ feat.title }}</p>
                <p class="text-[9px] text-slate-400 mt-0.5">{{ feat.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div v-else class="text-center py-24 text-slate-400">
      Boutique vitrine introuvable...
    </div>

    <footer class="bg-slate-950 border-t border-slate-800 py-6 text-center text-xs text-slate-500">
      © 2026 Kong S.A. Marketplace • Vitrine Autonome Générée par l'ERP
    </footer>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';

const route = useRoute();
const toast = useToast();

const store = ref(null);
const config = ref({
  colors: {
    primary: '#4f46e5',
    secondary: '#312e81',
    text: '#ffffff'
  },
  animation: 'none',
  widgets: [
    { id: 'w_hero', type: 'hero', title: 'OFFRES EXCLUSIVES', subtitle: 'La technologie à portée de main', description: 'Profitez de nos remises de gros et livraisons express.' },
    { id: 'w_prod', type: 'products', title: 'Articles Recommandés' },
    { id: 'w_info', type: 'info', title: 'Qualité & Support de Proximité', content: 'Tous nos articles sont sous garantie fabricant officielle et livrés directement depuis nos entrepôts de transit locaux.' },
    { id: 'w_foot', type: 'footer', features: [{ title: 'Livraison 48h', desc: 'Sur tout le territoire' }, { title: 'Paiement Sécurisé', desc: 'Mobile Money & Cash' }, { title: 'Garantie SAV', desc: 'Retour sous 7 jours' }] }
  ]
});

const storeProducts = ref([]);

onMounted(() => {
  // Load configuration from local storage to simulate dynamic persistence
  const savedDesign = localStorage.getItem(`store_design_${route.params.id}`);
  if (savedDesign) {
    try {
      config.value = JSON.parse(savedDesign);
    } catch (e) {
      console.error(e);
    }
  }

  // Load products list from session storage or mock defaults
  const key = route.params.id.includes('dist') ? 'products_distributor' : 'products_vendor';
  const savedProds = sessionStorage.getItem(key);
  if (savedProds) {
    try {
      storeProducts.value = JSON.parse(savedProds).filter(p => p.storeId === route.params.id && p.status === 'Published');
    } catch (e) {
      console.error(e);
    }
  }

  // Set mock store headers
  store.value = {
    id: route.params.id,
    name: route.params.id.includes('dist') ? 'AgroDistrib Centre-Sud' : 'TechSupplies Cameroun Shop',
    description: route.params.id.includes('dist')
      ? 'Boutique officielle AgroDistrib Cameroun pour la livraison en gros de maïs blanc séché et cacao brut.'
      : 'Boutique officielle TechSupplies SARL pour la vente d\'ordinateurs HP ProBook, souris sans fil et accessoires.'
  };
});

const activeWidgets = computed(() => {
  return config.value.widgets || [];
});

const getAnimationClass = computed(() => {
  const anim = config.value.animation;
  if (anim === 'pulse') return 'animate-pulse';
  if (anim === 'bounce') return 'hover:translate-y-[-4px] transition-transform duration-300';
  return '';
});

const hasWidget = (type) => {
  return activeWidgets.value.some(w => w.type === type);
};

const submitContact = () => {
  toast.success("Votre demande de devis a été envoyée avec succès au vendeur !");
};

const formatMoney = (val) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('XAF', 'FCFA');
};
</script>
