<template>
  <div class="min-h-screen bg-[#070b12] text-slate-100 flex flex-col justify-between">
    
    <!-- HEADER NAVBAR -->
    <PublicHeader />

    <!-- INTRO LANDING HERO -->
    <main class="flex-1 py-12 px-6 sm:px-8 lg:px-12 max-w-6xl mx-auto w-full space-y-16">
      
      <!-- MAIN WELCOME & FLOATING STATEMENT -->
      <section class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8">
        
        <!-- Left: Branding & Tagline -->
        <div class="lg:col-span-7 space-y-6">
          <div class="inline-flex items-center space-x-2 bg-emerald-950/80 text-emerald-450 border border-emerald-900 rounded-full px-3.5 py-1 text-[10.5px] font-mono font-bold uppercase tracking-widest animate-pulse">
            <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
            <span>B2B Sovereign Agriculture Corridor</span>
          </div>

          <h1 class="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight uppercase">
            Sérieux, Sécurité & <br />
            <span class="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-350 to-emerald-500">
              Traçabilité B2B
            </span>
          </h1>

          <p class="text-[13px] text-slate-300 leading-relaxed max-w-xl">
            La plateforme d'échange souveraine camerounaise facilitant le commerce de gros (Cacao, Café, Poivre de Penja) entre les coopératives agricoles vérifiées du Cameroun et les acheteurs mondiaux. Intégrée sous contrôle d'engagement fiduciaire (Escrow) avec calculs multi-vendeurs de fret.
          </p>

          <!-- Interactive CTAs -->
          <div class="pt-2 flex flex-wrap gap-4 font-mono text-xs select-none">
            <router-link 
              to="/products"
              class="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-450 hover:to-teal-555 text-slate-950 font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-950/40 hover:scale-102 transition duration-200"
            >
              Parcourir le Catalogue &rarr;
            </router-link>

            <router-link 
              to="/buyer/dashboard"
              class="px-6 py-3.5 bg-[#0a1017] border border-[#172d38] hover:border-emerald-600/50 text-emerald-400 font-bold uppercase tracking-wider rounded-xl hover:bg-slate-900/60 transition duration-200"
            >
              Mon Bureau Acheteur
            </router-link>
          </div>
        </div>

        <!-- Right: Beautiful Interactive Floating Board / Ticker with stats -->
        <div class="lg:col-span-5 relative group">
          <div class="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 blur-xl opacity-75 group-hover:opacity-100 transition duration-500"></div>
          
          <div class="relative bg-[#091117] border border-slate-900 rounded-3xl p-6 space-y-6">
            
            <div class="flex justify-between items-center border-b border-[#12242d] pb-3">
              <span class="text-[10px] font-mono uppercase tracking-wider text-slate-450 font-extrabold">🚨 Indice des Cours Mondiaux (Yaoundé)</span>
              <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            <!-- Mini scrolling table with mock live commodities data (Capter l'attention) -->
            <div class="space-y-3.5 font-mono text-[11px]">
              
              <!-- row 1 -->
              <div class="flex justify-between items-center bg-[#04080c] p-2.5 rounded-lg border border-slate-900/40 hover:border-emerald-950 transition">
                <div class="flex items-center space-x-2">
                  <span class="text-emerald-500 font-bold">🌶️</span>
                  <span class="text-slate-3 text-slate-200 uppercase">White Penja Lot</span>
                </div>
                <div class="text-right">
                  <div class="text-emerald-400 font-bold">11,500 CFA</div>
                  <div class="text-[9px] text-emerald-500">+1.24% de hausse</div>
                </div>
              </div>

              <!-- row 2 -->
              <div class="flex justify-between items-center bg-[#04080c] p-2.5 rounded-lg border border-slate-900/40 hover:border-emerald-950 transition">
                <div class="flex items-center space-x-2">
                  <span class="text-amber-500 font-bold">🍫</span>
                  <span class="text-slate-3 text-slate-200 uppercase">Cacao Sangmélima Ggrade A</span>
                </div>
                <div class="text-right">
                  <div class="text-emerald-400 font-bold">3,650 CFA</div>
                  <div class="text-[9px] text-slate-450">Stable (Prix Bord Champ)</div>
                </div>
              </div>

              <!-- row 3 -->
              <div class="flex justify-between items-center bg-[#04080c] p-2.5 rounded-lg border border-slate-900/40 hover:border-emerald-950 transition">
                <div class="flex items-center space-x-2">
                  <span class="text-cyan-450 font-bold">💡</span>
                  <span class="text-slate-3 text-slate-200 uppercase">Btp/Bat Solaire PRO</span>
                </div>
                <div class="text-right">
                  <div class="text-emerald-450 font-bold">145,000 CFA</div>
                  <div class="text-[9px] text-emerald-500">-3.15% Promo Cargo</div>
                </div>
              </div>

              <!-- row 4 -->
              <div class="flex justify-between items-center bg-[#04080c] p-2.5 rounded-lg border border-slate-900/40 hover:border-emerald-950 transition">
                <div class="flex items-center space-x-2">
                  <span class="text-rose-500 font-bold">☕</span>
                  <span class="text-slate-3 text-slate-200">Café Arabica d'Altitude</span>
                </div>
                <div class="text-right">
                  <div class="text-emerald-400 font-bold">4,550 CFA</div>
                  <div class="text-[9px] text-emerald-505">+0.75%</div>
                </div>
              </div>

            </div>

            <router-link 
              to="/products"
              class="block w-full text-center bg-emerald-950 hover:bg-emerald-400 hover:text-slate-950 text-emerald-400 font-bold py-2.5 rounded-xl border border-emerald-900 text-[10.5px] uppercase tracking-wider transition"
            >
              Rejoindre le Marché de Gros &rarr;
            </router-link>
          </div>
        </div>

      </section>

      <!-- CAROUSEL CATEGORY WHEEL (sliders/carousels obligatoires) -->
      <section class="space-y-4">
        <div>
          <span class="text-[10px] font-mono text-cyan-450 uppercase tracking-widest block font-bold">FILIÈRES NATIONALES STRATÉGIQUES</span>
          <h2 class="text-xl font-bold text-white uppercase font-sans tracking-tight">Découvrez nos filières B2B majeures</h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 select-none font-sans text-xs">
          
          <router-link 
            v-for="filiere in filieresList" 
            :key="filiere.title"
            to="/products"
            class="bg-[#091016] border border-[#13252f] rounded-2xl p-5 hover:border-emerald-900/60 hover:scale-103 transition-all duration-300 relative group overflow-hidden block"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-black/0 to-emerald-950/20 opacity-0 group-hover:opacity-100 transition duration-300"></div>
            
            <div class="h-10 w-10 text-emerald-400 bg-emerald-950/40 text-xl flex items-center justify-center rounded-xl mb-4 group-hover:scale-110 transition duration-300">
              {{ filiere.icon }}
            </div>
            
            <h3 class="font-bold text-white uppercase group-hover:text-emerald-400 transition">{{ filiere.title }}</h3>
            <p class="text-slate-450 text-[11px] mt-1.5 leading-relaxed">{{ filiere.description }}</p>
            
            <div class="mt-4 text-emerald-450 font-mono text-[10px] uppercase font-bold flex items-center space-x-1">
              <span>Inspecter lots</span>
              <span>&rarr;</span>
            </div>
          </router-link>

        </div>
      </section>

      <!-- EXPLANATORY SECURE ESCROW HUB -->
      <section class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-gradient-to-r from-slate-950 to-[#0c1a21] border border-[#14262f] p-8 rounded-3xl">
        
        <div class="md:col-span-8 space-y-4">
          <span class="text-[9px] font-mono uppercase bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-900/40 font-bold">SYSTÈME FIDUCIAIRE DIRECT</span>
          <h2 class="text-lg font-bold text-white uppercase leading-tight font-mono">Garantie Souveraine de l'Escrow & Multi-Vendeur Fret</h2>
          <p class="text-[11.5px] text-slate-400 leading-relaxed max-w-2xl">
            Sur la plateforme KONG, les capitaux de l'acheteur sont séquestrés (Escrowed) par le gestionnaire de la plateforme. Les fonds ne sont débloqués en faveur des coopératives agricoles (MTN MoMo, Orange Money ou Virement Afriland) qu'après confirmation de livraison physique ou douanière conforme. Le panier calcule séparément la part de chaque vendeur pour optimiser la logistique.
          </p>
        </div>

        <div class="md:col-span-4 flex flex-col justify-center space-y-2.5 select-none text-[10px] font-mono">
          <div class="p-3 bg-slate-950 rounded-xl border border-slate-900 flex items-center space-x-3.5 text-slate-300">
            <span class="text-emerald-500 font-bold">&check;</span>
            <span>Zero-Risk B2B Escrow Clearing</span>
          </div>
          <div class="p-3 bg-slate-950 rounded-xl border border-slate-900 flex items-center space-x-3.5 text-slate-300">
            <span class="text-emerald-500 font-bold">&check;</span>
            <span>Multi-Supplier Cart splitting</span>
          </div>
          <div class="p-3 bg-slate-950 rounded-xl border border-slate-900 flex items-center space-x-3.5 text-slate-300">
            <span class="text-emerald-500 font-bold">&check;</span>
            <span>FIFO Agricultural Expiry Tracking</span>
          </div>
        </div>

      </section>

    </main>

    <!-- FOOTER -->
    <footer class="bg-slate-950 border-t border-[#091116] py-12 px-6 text-slate-500 text-xs text-center pb-48 md:pb-40">
      <div class="max-w-4xl mx-auto space-y-4">
        <p class="text-[11px] leading-relaxed max-w-xl mx-auto">
          KONG S.A. est une marque de technologie logistique camerounaise agréée. Tous droits réservés. Conforme CEMAC et règles de l'arbitrage commercial international.
        </p>
        <div class="flex justify-center space-x-4 text-[10.5px] font-mono text-emerald-500">
          <router-link to="/products" class="hover:underline">Catalog Explorer</router-link>
          <span>&bull;</span>
          <router-link to="/about" class="hover:underline">Port de Kribi Hub</router-link>
          <span>&bull;</span>
          <router-link to="/contact" class="hover:underline">Contact Assistance</router-link>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import PublicHeader from '@/components/PublicHeader.vue';

const filieresList = [
  {
    icon: "🌾",
    title: "Poivres & Épices IGP",
    description: "Le fameux poivre blanc de Penja, poivre de singe de la Lobé et cannelle sauvage de l'Est."
  },
  {
    icon: "🍫",
    title: "Cacao & Café Exporter",
    description: "Cacao AOC certifié de Sangmélima et grains d'Arabica moulu d'altitude de Foumbot."
  },
  {
    icon: "💡",
    title: "BTP Solaire & Énergie",
    description: "Kits de batteries Gel MT/OM, onduleurs, régulateurs de tension industriels CEMAC."
  },
  {
    icon: "🪵",
    title: "Produits de Foresterie",
    description: "Grumes, bois d'œuvre de menuiserie, rotin de Maroua et latex de caoutchouc naturel."
  }
];
</script>

<style scoped>
.text-gradient {
  background-size: 200% auto;
  animation: slowGlow 5s linear infinite;
}

@keyframes slowGlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  105% { background-position: 0% 50%; }
}
</style>
