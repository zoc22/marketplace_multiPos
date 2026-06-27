<template>
  <div class="min-h-screen bg-light-bg-main dark:bg-[#070b12] text-text-main dark:text-[var(--color-text-primary)] flex flex-col justify-between overflow-x-hidden pt-28 transition-colors duration-300">
    
    <!-- NAVIGATION BAR -->
    <PublicHeader />

    <!-- HERO MOOD ANIME BANNERS (Auto-sliding slideshow) -->
    <section class="relative h-[25rem] sm:h-[28rem] lg:h-[32rem] overflow-hidden bg-[var(--color-surface)] border-b border-amber-900/30">
      <div 
        v-for="(slide, index) in heroSlides" 
        :key="index"
        class="absolute inset-0 transition-all duration-1000 ease-in-out transform flex items-center"
        :class="activeSlide === index ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-12 scale-105 pointer-events-none'"
        :style="{ transform: `translateY(${y * 0.12}px)` }"
      >
        <!-- Background Darkened Image Cover -->
        <div class="absolute inset-0">
          <img :src="slide.image" class="w-full h-full object-cover filter brightness-[0.35] contrast-[1.1]" />
          <div class="absolute inset-0 bg-gradient-to-t from-[#070b12] via-transparent to-[#070b12]/50"></div>
          <div class="absolute inset-0 bg-gradient-to-r from-[#070b12] via-[#070b12]/60 to-transparent"></div>
        </div>

        <!-- Hero Card Floating Content -->
        <div class="relative w-full px-4 xl:px-12 px-6 md:px-12 z-20 w-full">
          <div class="max-w-2xl space-y-4">
            
            <div class="inline-flex items-center space-x-2 bg-button-orange/20 text-amber-400 border border-button-orange/30 rounded-full px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-widest animate-pulse">
              <span class="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
              <span>{{ slide.badge }}</span>
            </div>
            
            <h1 class="text-3xl sm:text-5xl font-extrabold text-text-main dark:text-white tracking-tight leading-none drop-shadow-xl font-sans uppercase">
              <span class="block text-gradient bg-clip-text text-transparent bg-gradient-to-r from-white via-amber-100 to-amber-300">
                {{ slide.title }}
              </span>
            </h1>
            
            <p class="text-base sm:text-base text-text-sec dark:text-slate-300 font-sans leading-relaxed tracking-wide drop-shadow-md">
              {{ slide.description }}
            </p>

            <div class="pt-4 flex flex-wrap gap-3 items-center">
              <button 
                @click="scrollToCatalog"
                class="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-text-main font-sans font-bold text-base uppercase tracking-wider rounded-xl shadow-lg hover:scale-105 transition duration-200"
              >
                Découvrir la Vitrine &darr;
              </button>
              
              <div class="px-4 py-2.5 bg-light-bg-sec dark:bg-slate-900/90 backdrop-blur border border-amber-900/40 text-slate-200 rounded-xl text-base font-sans font-bold">
                <span class="text-slate-400 font-normal">À partir de :</span>
                <span class="text-button-orange font-black ml-1.5">{{ slide.accent }}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Left / Right Carousel Buttons -->
      <button 
        @click="prevSlide"
        class="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-[var(--color-surface)]/60 hover:bg-emerald-950 border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-accent-green flex items-center justify-center z-30 transition"
      >
        <ChevronLeftIcon class="h-5 w-5" />
      </button>
      <button 
        @click="nextSlide"
        class="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-[var(--color-surface)]/60 hover:bg-emerald-950 border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-accent-green flex items-center justify-center z-30 transition"
      >
        <ChevronRightIcon class="h-5 w-5" />
      </button>

      <!-- Carousel Indicators Dots -->
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
        <button 
          v-for="(slide, sIdx) in heroSlides" 
          :key="sIdx"
          @click="activeSlide = sIdx"
          class="h-1.5 rounded-full transition-all duration-300"
          :class="activeSlide === sIdx ? 'w-6 bg-accent-green' : 'w-2 bg-slate-700'"
        ></button>
      </div>
    </section>

    <!-- PROMOTIONS DÉFILANTES & BONS PLANS -->
    <section class="py-10 bg-light-bg-main dark:bg-[#070b12] px-4 md:px-8 overflow-hidden border-b border-divider dark:border-slate-800/50">
      <div class="w-full px-4 xl:px-12 space-y-4">
        
        <div class="flex justify-between items-end">
          <div class="flex items-center space-x-3">
            <div class="h-16 w-16 flex items-center justify-center rounded-full border border-button-orange/50 bg-amber-50 dark:bg-amber-950/20 text-button-orange">
              <FireIcon class="h-8 w-8" />
            </div>
            <div>
              <span class="text-[10px] font-sans text-button-orange font-black uppercase bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/30 tracking-widest">OFFRES EXCLUSIVES</span>
              <h2 class="text-xl font-black text-text-main dark:text-white font-sans uppercase mt-1">🔥 Ventes Flash du Moment</h2>
            </div>
          </div>
          <div class="flex space-x-1">
            <button @click="scrollDealsLeft" class="p-1.5 bg-[#0d161d] hover:bg-amber-950 border border-divider dark:border-slate-800 rounded text-slate-500 hover:text-button-orange transition">
              <ChevronLeftIcon class="h-4 w-4" />
            </button>
            <button @click="scrollDealsRight" class="p-1.5 bg-[#0d161d] hover:bg-amber-950 border border-divider dark:border-slate-800 rounded text-slate-500 hover:text-button-orange transition">
              <ChevronRightIcon class="h-4 w-4" />
            </button>
          </div>
        </div>

        <!-- Horizontal Scrollable Slider of Promo Cards -->
        <div class="deals-wrapper overflow-hidden relative w-full rounded-2xl py-2" ref="dealsDeck">
          <div class="deals-track flex space-x-4 w-max hover:animation-pause">
            <!-- Set 1 -->
            <div 
              v-for="deal in b2bPromos" 
              :key="deal.id + '_1'"
              class="min-w-[20rem] max-w-[22rem] snap-start bg-light-bg-main dark:bg-[#0a1017] border border-[#14232c] rounded-2xl p-4.5 space-y-3 shrink-0 flex flex-col justify-between hover:border-emerald-600/40 transition-all duration-300 group hover:-translate-y-1"
            >
              <div class="flex justify-between items-start">
                <span class="bg-red-500/20 text-red-500 text-[9px] font-sans font-bold px-2 py-0.5 rounded-full border border-red-500/30 uppercase flex items-center gap-1.5">
                  ⚡ RÉDUCTION {{ deal.discount }}
                </span>
                <span class="text-slate-500 font-sans font-bold text-[9px]">Stock Limité</span>
              </div>

              <div class="flex space-x-3">
                <img :src="deal.product.image" class="h-16 w-16 object-cover rounded-xl border border-divider dark:border-slate-800 group-hover:scale-105 transition duration-300 shadow-lg" />
                <div class="truncate">
                  <h4 class="text-[13px] font-bold text-text-main dark:text-white truncate">{{ deal.product.name }}</h4>
                  <p class="text-[11px] font-sans font-black text-button-orange mt-1">
                    {{ formatCFA(deal.promoPrice) }} / <span class="text-slate-500 font-normal text-[10px]">{{ deal.product.unit }}</span>
                  </p>
                  <p class="text-[9px] font-sans font-medium text-slate-500 mt-0.5 line-through">Ancien prix: {{ formatCFA(deal.product.price) }}</p>
                </div>
              </div>

              <div class="pt-2 border-t border-divider dark:border-slate-800 text-[10px] text-slate-400 leading-tight flex items-center justify-between">
                <div>&bull; Boutique : <span class="font-bold text-text-main dark:text-white">{{ getSupplierName(deal.product.supplierId) }}</span></div>
                <div class="text-button-orange font-bold">⭐ {{ deal.product.rating }}</div>
              </div>

              <div class="flex space-x-2 pt-1">
                <button 
                  @click="router.push('/products/' + deal.product.id)"
                  class="flex-1 py-1.5 bg-light-bg-sec dark:bg-slate-900 hover:bg-light-bg-sec dark:bg-slate-800 rounded-lg text-[10px] font-sans font-bold uppercase tracking-wider transition border border-slate-700 text-text-sec dark:text-slate-300"
                >
                  Détails
                </button>
                <button 
                  @click="addPromoWithQuantity(deal.product, 1)"
                  class="flex-1 py-1.5 bg-button-orange hover:bg-button-orange\/90 text-text-main rounded-lg text-[10px] font-sans font-bold uppercase tracking-wider transition shadow-lg shadow-amber-500/20"
                >
                  Ajouter
                </button>
              </div>
            </div>

            <!-- Set 2 for Infinite Loop -->
            <div 
              v-for="deal in b2bPromos" 
              :key="deal.id + '_2'"
              class="min-w-[20rem] max-w-[22rem] snap-start bg-light-bg-main dark:bg-[#0a1017] border border-divider dark:border-slate-800/80 rounded-2xl p-4.5 space-y-3 shrink-0 flex flex-col justify-between hover:border-amber-600/40 transition-all duration-300 group hover:-translate-y-1 shadow-xl"
            >
              <div class="flex justify-between items-start">
                <span class="bg-red-500/20 text-red-500 text-[9px] font-sans font-bold px-2 py-0.5 rounded-full border border-red-500/30 uppercase flex items-center gap-1.5">
                  ⚡ RÉDUCTION {{ deal.discount }}
                </span>
                <span class="text-slate-500 font-sans font-bold text-[9px]">Stock Limité</span>
              </div>

              <div class="flex space-x-3">
                <img :src="deal.product.image" class="h-16 w-16 object-cover rounded-xl border border-divider dark:border-slate-800 group-hover:scale-105 transition duration-300 shadow-lg" />
                <div class="truncate">
                  <h4 class="text-[13px] font-bold text-text-main dark:text-white truncate">{{ deal.product.name }}</h4>
                  <p class="text-[11px] font-sans font-black text-button-orange mt-1">
                    {{ formatCFA(deal.promoPrice) }} / <span class="text-slate-500 font-normal text-[10px]">{{ deal.product.unit }}</span>
                  </p>
                  <p class="text-[9px] font-sans font-medium text-slate-500 mt-0.5 line-through">Ancien prix: {{ formatCFA(deal.product.price) }}</p>
                </div>
              </div>

              <div class="pt-2 border-t border-divider dark:border-slate-800 text-[10px] text-slate-400 leading-tight flex items-center justify-between">
                <div>&bull; Boutique : <span class="font-bold text-text-main dark:text-white">{{ getSupplierName(deal.product.supplierId) }}</span></div>
                <div class="text-button-orange font-bold">⭐ {{ deal.product.rating }}</div>
              </div>

              <div class="flex space-x-2 pt-1">
                <button 
                  @click="router.push('/products/' + deal.product.id)"
                  class="flex-1 py-1.5 bg-light-bg-sec dark:bg-slate-900 hover:bg-light-bg-sec dark:bg-slate-800 rounded-lg text-[10px] font-sans font-bold uppercase tracking-wider transition border border-slate-700 text-text-sec dark:text-slate-300"
                >
                  Détails
                </button>
                <button 
                  @click="addPromoWithQuantity(deal.product, 1)"
                  class="flex-1 py-1.5 bg-button-orange hover:bg-button-orange\/90 text-text-main rounded-lg text-[10px] font-sans font-bold uppercase tracking-wider transition shadow-lg shadow-amber-500/20"
                >
                  Ajouter
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>

    <!-- TWO-COLUMN WORKSPACE: FILTERS & PRODUCTS DECK -->
    <section id="catalog-explorer" class="py-12 w-full px-4 md:px-8 xl:px-12 flex-1">
      
      <!-- BENTO HEADER -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b border-[#0f1d24] pb-8 mb-8">
        <div class="md:col-span-2">
          <span class="text-xl font-mono font-black text-emerald-450 tracking-widest uppercase block mb-1">CACAO, CAFÉ, ÉPICES, SOLAIRE, TEXTILES TRADITIONNELS</span>
          <h2 class="text-2xl font-extrabold text-[var(--color-text-primary)] tracking-tight uppercase">CMR B2B Wholesale Market</h2>
          <p class="text-[11.5px] text-[var(--color-text-secondary)] mt-1 leading-relaxed max-w-xl">
            Sourced strictly from certified Cameroonian local farming cooperatives, industrial suppliers, and cross-border transport unions. Secured via sovereign Escrow Guarantee funds.
          </p>
        </div>
        
        <!-- Live Counters -->
        <div class="bg-[#091117] border border-[var(--color-border)] rounded-2xl p-4 flex justify-between items-center text-base font-mono">
          <div>
            <div class="text-[var(--color-text-tertiary)] uppercase text-[9.5px]">Verified Lots</div>
            <div class="text-[15px] font-bold text-[var(--color-text-primary)] mt-0.5">{{ storeProducts.length }} Crops</div>
          </div>
          <div class="h-8 w-px bg-light-bg-sec dark:bg-slate-900"></div>
          <div>
            <div class="text-[var(--color-text-tertiary)] uppercase text-[9.5px]">Active Cooperatives</div>
            <div class="text-[15px] font-bold text-accent-green mt-0.5">24 Regions</div>
          </div>
          <div class="h-8 w-px bg-light-bg-sec dark:bg-slate-900"></div>
          <div>
            <div class="text-[var(--color-text-tertiary)] uppercase text-[9.5px]">Kribi Bond</div>
            <div class="text-[15px] font-bold text-cyan-400 mt-0.5">FIFO Escrow</div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
        
        <!-- Toggle Sidebar Button (When sidebar is hidden) -->
        <div v-if="!isSidebarOpen" class="lg:absolute lg:-top-12 lg:right-0 flex justify-end mb-4 lg:mb-0 z-10">
          <button 
            @click="isSidebarOpen = true"
            class="group relative flex items-center justify-center bg-button-orange/10 hover:bg-button-orange/20 border border-button-orange/50 h-10 w-10 rounded-xl text-button-orange transition shadow-lg"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span class="absolute right-full mr-2 opacity-0 group-hover:opacity-100 bg-light-bg-sec dark:bg-slate-900 text-button-orange text-[10px] uppercase font-bold px-2 py-1 rounded transition whitespace-nowrap border border-button-orange/30">Afficher la Barre Latérale</span>
          </button>
        </div>

        <!-- COLUMN 1: INTERACTIVE ADVANCED FILTER SIDEBAR -->
        <aside 
          v-show="isSidebarOpen"
          class="space-y-6 lg:col-span-1 lg:sticky lg:top-36 h-fit bg-light-bg-main dark:bg-[#091016] border border-divider dark:border-[#13252f]/40 p-5 rounded-2xl transition-all duration-300 relative"
        >
          
          <!-- Close Sidebar Button (Inside Top Corner) -->
          <button 
            @click="isSidebarOpen = false"
            class="absolute top-4 right-4 group flex items-center justify-center bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 h-8 w-8 rounded-lg text-rose-500 transition"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span class="absolute left-full ml-2 opacity-0 group-hover:opacity-100 bg-light-bg-sec dark:bg-slate-900 text-rose-500 text-[10px] uppercase font-bold px-2 py-1 rounded transition whitespace-nowrap border border-rose-500/30 z-50">Masquer la Barre Latérale</span>
          </button>

          <div class="flex justify-between items-center border-b border-[#12242d] pb-3 mb-2 pr-10">
            <span class="text-xl font-mono font-black text-[var(--color-text-primary)] uppercase tracking-widest">🔧 Advanced Audits</span>
            <button 
              @click="resetFilters" 
              class="text-[9.5px] font-mono text-accent-green hover:text-emerald-350 uppercase font-bold"
              v-show="hasActiveFilters"
            >
              Reset [×]
            </button>
          </div>

          <!-- KEYWORD SEARCH -->
          <div class="space-y-2">
            <label class="block text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-tertiary)] font-bold">Search Product / Sku</label>
            <div class="relative">
              <input 
                type="text" 
                v-model="filters.keyword"
                placeholder="Ex: Penja, Cacao, Solaire..." 
                class="w-full bg-[#03060a] border border-[#142630] rounded-xl px-3 py-2 text-base text-[var(--color-text-primary)] focus:outline-none focus:border-accent-green placeholder-slate-500 font-mono"
              />
              <button 
                v-if="filters.keyword" 
                @click="filters.keyword = ''"
                class="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] font-bold"
              >
                &times;
              </button>
            </div>
          </div>

          <!-- SECTOR PICKER (Accordéon categories + Checkboxes multi-sélection) -->
          <div class="space-y-2.5">
            <div 
              @click="isCategoryAccordionOpen = !isCategoryAccordionOpen"
              class="flex justify-between items-center cursor-pointer select-none py-1 border-b border-[var(--color-border)]"
            >
              <label class="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-tertiary)] font-bold">Agricultural Sectors</label>
              <ChevronDownIcon class="h-4.5 w-4.5 text-slate-450 transition-transform duration-200" :class="isCategoryAccordionOpen ? 'rotate-180': ''" />
            </div>

            <div v-show="isCategoryAccordionOpen" class="space-y-2 pt-1 transition-all duration-300">
              <div class="flex flex-col space-y-2 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
                <label 
                  v-for="sec in availableSectors" 
                  :key="sec.name"
                  class="flex items-center space-x-2 text-[11px] font-mono text-[var(--color-text-secondary)] cursor-pointer hover:text-accent-green transition select-none"
                >
                  <input 
                    type="checkbox" 
                    :value="sec.name"
                    v-model="filters.sectors"
                    class="rounded border-[#142630] bg-[#03060a] text-emerald-600 focus:ring-emerald-500/30 h-3.5 w-3.5"
                  />
                  <span class="truncate uppercase leading-none">{{ sec.name }}</span>
                  <span class="text-[9px] text-[var(--color-text-tertiary)] font-sans ml-auto">({{ sec.count }})</span>
                </label>
              </div>
            </div>
          </div>

          <!-- PRICE RANGE SLIDER (Mandatory real dynamic feedback) -->
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <label class="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-tertiary)] font-bold">Max Bid Base Price</label>
              <span class="text-base font-mono text-emerald-450 font-bold">{{ formatCFA(filters.maxPrice) }}</span>
            </div>
            
            <input 
              type="range" 
              v-model.number="filters.maxPrice"
              :min="0"
              :max="maxProductPrice"
              class="w-full accent-emerald-500 cursor-pointer h-1.5 bg-[#04080c] rounded-lg"
            />
            
            <div class="flex justify-between text-[9px] font-mono text-slate-550">
              <span>0 CFA</span>
              <span>Max: {{ formatCFA(maxProductPrice) }}</span>
            </div>
          </div>

          <!-- ORIGIN REGION SELECTOR (GLOBAL + CAMEROON) -->
          <div class="space-y-2">
            <label class="block text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-tertiary)] font-bold">Filtres de Recherche Mondiaux</label>
            <select 
              v-model="filters.country"
              class="w-full bg-[#03060a] border border-[#142630] rounded-xl px-2.5 py-2 text-base text-[var(--color-text-secondary)] focus:outline-none focus:border-accent-green font-mono mb-2"
            >
              <option value="">(Tous les pays du monde)</option>
              <option v-for="c in globalCountries" :key="c" :value="c">{{ c }}</option>
            </select>

            <label class="block text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-tertiary)] font-bold mt-3">Bassin Local (Cameroun)</label>
            <select 
              v-model="filters.city"
              class="w-full bg-[#03060a] border border-[#142630] rounded-xl px-2.5 py-2 text-base text-[var(--color-text-secondary)] focus:outline-none focus:border-accent-green font-mono"
            >
              <option value="">(Toutes régions)</option>
              <option v-for="c in cameroonCities" :key="c" :value="c">
                Bassin d'axe {{ c }}
              </option>
            </select>
          </div>

          <!-- AVAILABILITY RADIO CHIPS -->
          <div class="space-y-2">
            <label class="block text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-tertiary)] font-bold">Stock Availability</label>
            <div class="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
              <button 
                @click="filters.stockOnly = false"
                class="py-1.5 px-2.5 rounded-lg border text-center transition"
                :class="!filters.stockOnly ? 'bg-emerald-950 border-emerald-900 text-accent-green' : 'bg-transparent border-[#152730] text-slate-450 hover:text-[var(--color-text-primary)]'"
              >
                All Lots
              </button>
              <button 
                @click="filters.stockOnly = true"
                class="py-1.5 px-2.5 rounded-lg border text-center transition"
                :class="filters.stockOnly ? 'bg-emerald-950 border-emerald-900 text-accent-green' : 'bg-transparent border-[#152730] text-slate-450 hover:text-[var(--color-text-primary)]'"
              >
                In Stock
              </button>
            </div>
          </div>

          <!-- SORT ORDERS -->
          <div class="space-y-2">
            <label class="block text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-tertiary)] font-bold">Sort Priority</label>
            <select 
              v-model="filters.sortBy"
              class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-2.5 py-2 text-base text-[var(--color-text-secondary)] focus:outline-none focus:border-accent-green font-mono text-[10.5px]"
            >
              <option value="name_asc">Alphabetical (A - Z)</option>
              <option value="price_asc">Price (Low to High)</option>
              <option value="price_desc">Price (High to Low)</option>
              <option value="stock_desc">Highest Stock Volume</option>
              <option value="created_desc">Newly Harvested/Listed</option>
            </select>
          </div>

          <!-- VERTICAL PROMO MARQUEE (Haut/Bas) -->
          <div class="mt-8 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl overflow-hidden relative h-64 shadow-inner">
            <div class="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-[var(--color-background)] to-transparent z-10 pointer-events-none"></div>
            <div class="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[var(--color-background)] to-transparent z-10 pointer-events-none"></div>
            <div class="p-3 bg-emerald-950/40 border-b border-emerald-900/50 flex items-center justify-between z-20 relative">
              <span class="text-[10px] font-mono font-bold text-emerald-450 uppercase tracking-widest flex items-center gap-1">
                🔥 Live Deals
              </span>
            </div>
            
            <div class="h-full overflow-hidden relative group">
              <div class="promo-sidebar-track flex flex-col gap-4 px-3 py-4 hover:animation-pause">
                <!-- Promo 1 -->
                <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg p-3 shadow hover:border-accent-green/50 transition">
                  <span class="text-[9px] uppercase font-bold text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded">Rupture Éminente</span>
                  <p class="text-[11px] text-[var(--color-text-primary)] mt-1.5 font-sans leading-tight">Gros arrivage de Cacao Sangmélima très convoité. <strong>12 Tonnes</strong> restantes !</p>
                </div>
                <!-- Promo 2 -->
                <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg p-3 shadow hover:border-accent-green/50 transition">
                  <span class="text-[9px] uppercase font-bold text-button-orange bg-button-orange/10 px-1.5 py-0.5 rounded">Baisse des cours</span>
                  <p class="text-[11px] text-[var(--color-text-primary)] mt-1.5 font-sans leading-tight">-15% sur les graines de soja via la coopérative du Moungo pour les 48h.</p>
                </div>
                <!-- Promo 3 -->
                <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg p-3 shadow hover:border-accent-green/50 transition">
                  <span class="text-[9px] uppercase font-bold text-cyan-500 bg-cyan-500/10 px-1.5 py-0.5 rounded">Nouveau Fournisseur</span>
                  <p class="text-[11px] text-[var(--color-text-primary)] mt-1.5 font-sans leading-tight">Poivre de Penja certifié IGP vient d'être mis en ligne avec des prix B2B brisés.</p>
                </div>
                
                <!-- Cloned Promos for infinite loop -->
                <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg p-3 shadow hover:border-accent-green/50 transition mt-4">
                  <span class="text-[9px] uppercase font-bold text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded">Rupture Éminente</span>
                  <p class="text-[11px] text-[var(--color-text-primary)] mt-1.5 font-sans leading-tight">Gros arrivage de Cacao Sangmélima très convoité. <strong>12 Tonnes</strong> restantes !</p>
                </div>
                <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg p-3 shadow hover:border-accent-green/50 transition">
                  <span class="text-[9px] uppercase font-bold text-button-orange bg-button-orange/10 px-1.5 py-0.5 rounded">Baisse des cours</span>
                  <p class="text-[11px] text-[var(--color-text-primary)] mt-1.5 font-sans leading-tight">-15% sur les graines de soja via la coopérative du Moungo pour les 48h.</p>
                </div>
                <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg p-3 shadow hover:border-accent-green/50 transition">
                  <span class="text-[9px] uppercase font-bold text-cyan-500 bg-cyan-500/10 px-1.5 py-0.5 rounded">Nouveau Fournisseur</span>
                  <p class="text-[11px] text-[var(--color-text-primary)] mt-1.5 font-sans leading-tight">Poivre de Penja certifié IGP vient d'être mis en ligne avec des prix B2B brisés.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- PROMOTIONAL SPACE FILLER -->
          <div class="mt-8 border-t border-[#12242d] pt-6 space-y-4">
            <h3 class="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-tertiary)] font-bold mb-4">Top Ventes du Jour</h3>
            
            <div class="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-button-orange/20 rounded-xl p-3 flex items-center space-x-3 hover:border-button-orange/50 transition cursor-pointer">
              <div class="h-12 w-12 rounded-lg bg-light-bg-sec dark:bg-slate-900 overflow-hidden shrink-0">
                <img src="https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=200" class="w-full h-full object-cover opacity-80" />
              </div>
              <div>
                <h4 class="text-[11px] font-bold text-text-main dark:text-white uppercase leading-tight line-clamp-1">Poivre Blanc Penja</h4>
                <p class="text-[9px] text-button-orange font-mono mt-0.5">14,500 CFA / Kg</p>
              </div>
            </div>

            <div class="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-accent-green/20 rounded-xl p-3 flex items-center space-x-3 hover:border-accent-green/50 transition cursor-pointer">
              <div class="h-12 w-12 rounded-lg bg-light-bg-sec dark:bg-slate-900 overflow-hidden shrink-0">
                <img src="https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=200" class="w-full h-full object-cover opacity-80" />
              </div>
              <div>
                <h4 class="text-[11px] font-bold text-text-main dark:text-white uppercase leading-tight line-clamp-1">Kit Solaire PRO</h4>
                <p class="text-[9px] text-accent-green font-mono mt-0.5">250,000 CFA / Unité</p>
              </div>
            </div>

            <div class="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-3 flex items-center space-x-3 hover:border-purple-500/50 transition cursor-pointer">
              <div class="h-12 w-12 rounded-lg bg-light-bg-sec dark:bg-slate-900 overflow-hidden shrink-0">
                <img src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=200" class="w-full h-full object-cover opacity-80" />
              </div>
              <div>
                <h4 class="text-[11px] font-bold text-text-main dark:text-white uppercase leading-tight line-clamp-1">Tissu Ndop Original</h4>
                <p class="text-[9px] text-purple-400 font-mono mt-0.5">45,000 CFA / Pièce</p>
              </div>
            </div>

            <div class="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-3 flex items-center space-x-3 hover:border-blue-500/50 transition cursor-pointer">
              <div class="h-12 w-12 rounded-lg bg-light-bg-sec dark:bg-slate-900 overflow-hidden shrink-0">
                <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=200" class="w-full h-full object-cover opacity-80" />
              </div>
              <div>
                <h4 class="text-[11px] font-bold text-text-main dark:text-white uppercase leading-tight line-clamp-1">Smartphone 5G Pro</h4>
                <p class="text-[9px] text-blue-400 font-mono mt-0.5">185,000 CFA / Unité</p>
              </div>
            </div>

            <div class="bg-gradient-to-r from-rose-500/10 to-red-500/10 border border-rose-500/20 rounded-xl p-3 flex items-center space-x-3 hover:border-rose-500/50 transition cursor-pointer">
              <div class="h-12 w-12 rounded-lg bg-light-bg-sec dark:bg-slate-900 overflow-hidden shrink-0">
                <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200" class="w-full h-full object-cover opacity-80" />
              </div>
              <div>
                <h4 class="text-[11px] font-bold text-text-main dark:text-white uppercase leading-tight line-clamp-1">Cacao Sangmélima</h4>
                <p class="text-[9px] text-rose-400 font-mono mt-0.5">3,500 CFA / Kg</p>
              </div>
            </div>
            
            <div class="bg-gradient-to-r from-slate-500/10 to-gray-500/10 border border-slate-500/20 rounded-xl p-3 flex items-center space-x-3 hover:border-slate-500/50 transition cursor-pointer">
              <div class="h-12 w-12 rounded-lg bg-light-bg-sec dark:bg-slate-900 overflow-hidden shrink-0">
                <img src="https://images.unsplash.com/photo-1541888081636-61dc225fbd45?auto=format&fit=crop&q=80&w=200" class="w-full h-full object-cover opacity-80" />
              </div>
              <div>
                <h4 class="text-[11px] font-bold text-text-main dark:text-white uppercase leading-tight line-clamp-1">Ciment CPJ 35</h4>
                <p class="text-[9px] text-slate-400 font-mono mt-0.5">4,800 CFA / Sac</p>
              </div>
            </div>
            
            <div class="rounded-xl overflow-hidden relative h-32 mt-4 group cursor-pointer border border-divider dark:border-slate-800 hover:border-amber-400 dark:hover:border-button-orange transition">
              <img src="https://images.unsplash.com/photo-1586528116311-ad8ed7c50a11?auto=format&fit=crop&q=80&w=400" class="w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900 dark:from-[#0a1017] to-transparent"></div>
              <div class="absolute bottom-3 left-3">
                <span class="bg-rose-500 text-text-main dark:text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded">Promo -20%</span>
                <p class="text-xs font-bold text-text-main dark:text-white mt-1 uppercase">Logistique Fret</p>
              </div>
            </div>
          </div>
          
        </aside>

        <!-- COLUMN 2: PRODUCTS GRID AND PAGINATION -->
        <main :class="isSidebarOpen ? 'lg:col-span-3' : 'lg:col-span-4'" class="space-y-8 transition-all duration-500">
          
          <!-- AMAZON STYLE HORIZONTAL SECTIONS -->
          <!-- Section: Les Plus Vendus -->
          <div class="space-y-3 pt-2">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold text-text-main dark:text-white uppercase font-sans tracking-tight">🏆 Les Plus Vendus</h2>
              <button class="text-[10px] uppercase font-bold text-emerald-600 dark:text-accent-green hover:text-emerald-700 dark:hover:text-emerald-300">Voir tout &rarr;</button>
            </div>
            <div class="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
              <div 
                v-for="prod in sortedProducts.slice(0, 8)" 
                :key="'top_'+prod.id"
                class="w-48 shrink-0 snap-start bg-light-bg-main dark:bg-[#091016] border border-divider dark:border-[#13252f] rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-900/10 dark:hover:shadow-emerald-950/20 hover:border-accent-green/50 dark:hover:border-emerald-900/60 transition-all duration-300 flex flex-col cursor-pointer"
                @click="router.push('/products/' + prod.id)"
              >
                <div class="relative w-full h-36 overflow-hidden bg-light-bg-sec dark:bg-slate-900">
                  <img :src="prod.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div class="absolute top-2 left-2 bg-button-orange text-text-main dark:text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shadow">Top Vente</div>
                </div>
                <div class="p-3 flex-1 flex flex-col justify-between space-y-2">
                  <h3 class="text-xs font-bold text-text-main dark:text-white line-clamp-2 leading-tight">{{ prod.name }}</h3>
                  <div class="flex items-center space-x-1">
                    <StarIconSolid v-for="i in 5" :key="i" class="h-3 w-3 text-button-orange" />
                    <span class="text-[9px] text-slate-500">(124)</span>
                  </div>
                  <div class="font-mono text-emerald-600 dark:text-accent-green font-black text-sm">{{ formatCFA(prod.price) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Section: Tendances du Moment -->
          <div class="space-y-3 pt-2">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold text-text-main dark:text-white uppercase font-sans tracking-tight">🔥 Tendances du Moment</h2>
              <button class="text-[10px] uppercase font-bold text-emerald-600 dark:text-accent-green hover:text-emerald-700 dark:hover:text-emerald-300">Voir tout &rarr;</button>
            </div>
            <div class="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
              <div 
                v-for="prod in sortedProducts.slice(4, 12)" 
                :key="'trend_'+prod.id"
                class="w-48 shrink-0 snap-start bg-light-bg-main dark:bg-[#091016] border border-divider dark:border-[#13252f] rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-900/10 dark:hover:shadow-emerald-950/20 hover:border-accent-green/50 dark:hover:border-emerald-900/60 transition-all duration-300 flex flex-col cursor-pointer"
                @click="router.push('/products/' + prod.id)"
              >
                <div class="relative w-full h-36 overflow-hidden bg-light-bg-sec dark:bg-slate-900">
                  <img :src="prod.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div class="absolute top-2 left-2 bg-rose-500 text-text-main dark:text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shadow">Tendance</div>
                </div>
                <div class="p-3 flex-1 flex flex-col justify-between space-y-2">
                  <h3 class="text-xs font-bold text-text-main dark:text-white line-clamp-2 leading-tight">{{ prod.name }}</h3>
                  <div class="font-mono text-emerald-600 dark:text-accent-green font-black text-sm">{{ formatCFA(prod.price) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="border-t border-divider dark:border-[#14242d] my-6"></div>

          <!-- Filter info bar with tags and dynamic results description -->
          <div class="flex flex-wrap items-center justify-between gap-4 p-4 bg-light-bg-main dark:bg-[#091117] border border-divider dark:border-[var(--color-border)] rounded-2xl text-base shadow-sm dark:shadow-none">
            <div class="font-sans text-[var(--color-text-secondary)]">
              Showing <span class="text-[var(--color-text-primary)] font-bold">{{ paginatedProducts.length }}</span> items of 
              <span class="text-emerald-405 font-bold">{{ sortedProducts.length }}</span> matches &bull; 
              Page <span class="text-[var(--color-text-primary)] font-mono font-bold">{{ currentPage }}</span> of {{ totalPages }}
            </div>

            <!-- Active tags indicator -->
            <div class="flex flex-wrap gap-1.5">
              <span v-if="filters.keyword" class="bg-light-bg-sec dark:bg-slate-900 px-2 py-0.5 rounded text-[10px] font-mono text-[var(--color-text-secondary)] flex items-center space-x-1">
                <span>"{{ filters.keyword }}"</span>
                <button @click="filters.keyword = ''" class="text-rose-500 font-bold ml-1">&times;</button>
              </span>
              <span v-for="sec in filters.sectors" :key="sec" class="bg-emerald-950/70 border border-emerald-900 px-2 py-0.5 rounded text-[10px] font-mono text-emerald-450 uppercase flex items-center space-x-1">
                <span>{{ sec }}</span>
                <button @click="removeSectorFilter(sec)" class="text-rose-450 font-bold ml-1">&times;</button>
              </span>
              <span v-if="filters.city" class="bg-cyan-950/70 border border-cyan-900 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-450 uppercase flex items-center space-x-1">
                <span>{{ filters.city }}</span>
                <button @click="filters.city = ''" class="text-rose-400 font-bold ml-1">&times;</button>
              </span>
            </div>
          </div>

          <!-- Empty state when zero crops match filters -->
          <div 
            v-if="sortedProducts.length === 0" 
            class="text-center py-20 bg-[#091118]/40 border border-dashed border-[#14242d] rounded-2xl space-y-4"
          >
            <div class="text-text-sec text-3xl font-mono">🔍</div>
            <h3 class="text-xl font-mono font-black text-[var(--color-text-secondary)] uppercase">AUCUN LOT DE GROS NE CORRESPOND</h3>
            <p class="text-base text-[var(--color-text-tertiary)] max-w-sm mx-auto">
              Please adjust your search keyword, lower the price threshold filter, or expand your Cameroon Local Hub coverage area.
            </p>
            <button 
              @click="resetFilters"
              class="px-5 py-2 bg-light-bg-sec dark:bg-slate-900 hover:bg-emerald-950 text-xl font-mono font-black uppercase rounded-lg border border-divider dark:border-slate-800 hover:border-emerald-900 transition"
            >
              Clear Search Criteria
            </button>
          </div>

          <!-- PRODUCTS GRID DECK (Classic Masonry Catalog) -->
          <h2 class="text-lg font-bold text-text-main dark:text-white uppercase font-sans tracking-tight mb-4">📦 Catalogue Principal</h2>
          <div class="columns-2 sm:columns-3 xl:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6">
            <div 
              v-for="(prod, index) in paginatedProducts" 
              :key="prod.id"
              v-animate="{ delay: (index % 10) * 50 }"
              class="break-inside-avoid bg-light-bg-main dark:bg-[#091016] border border-divider dark:border-[#13252f] rounded-2xl overflow-hidden hover:-translate-y-2 shadow-sm dark:shadow-none hover:shadow-xl hover:shadow-emerald-900/10 dark:hover:shadow-emerald-950/20 hover:border-accent-green dark:hover:border-emerald-900/60 transition-all duration-300 relative group flex flex-col justify-between"
              :id="'product_card_' + prod.id"
            >
              
              <!-- Card Badge Overlay (Top indicators) - Corner SKU Badge -->
              <div class="absolute top-3 left-3 z-10 flex flex-col space-y-1">
                <span class="bg-[var(--color-surface)]/90 backdrop-blur-md text-[9px] font-mono px-2 py-0.5 rounded-full border border-divider dark:border-slate-800 text-[var(--color-text-secondary)] font-bold uppercase">
                  SKU: {{ prod.sku.split('-').pop() }}
                </span>
                
                <span 
                  v-if="prod.stock < 150 && prod.status !== 'out_of_stock'" 
                  class="bg-amber-950/90 backdrop-blur-md text-amber-400 text-[8.5px] font-mono px-2 py-0.5 rounded-full border border-amber-900/40 uppercase tracking-wider font-extrabold"
                >
                  🔋 Tension Stock ({{ prod.stock }})
                </span>
              </div>

              <!-- Top right actions (Wishlist and Compare) -->
              <div class="absolute top-3 right-3 z-10 flex space-x-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  @click.stop="cartStore.toggleCompare(prod)"
                  class="h-7 w-7 rounded-lg bg-[var(--color-surface)]/80 backdrop-blur border text-[var(--color-text-secondary)] hover:text-accent-green flex items-center justify-center transition"
                  :class="cartStore.isInCompare(prod.id) ? 'border-accent-green text-accent-green font-bold' : 'border-divider dark:border-slate-800'"
                  :title="cartStore.isInCompare(prod.id) ? 'Remove comparison' : 'Add to Comparison Matrix'"
                >
                  <ScaleIcon class="h-4 w-4" />
                </button>
                <button 
                  @click.stop="cartStore.toggleWishlist(prod)"
                  class="h-7 w-7 rounded-lg bg-[var(--color-surface)]/80 backdrop-blur border text-slate-450 hover:text-rose-400 flex items-center justify-center transition"
                  :class="cartStore.isInWishlist(prod.id) ? 'border-rose-500 text-rose-500 bg-rose-950/20' : 'border-divider dark:border-slate-800'"
                  :title="cartStore.isInWishlist(prod.id) ? 'Saved' : 'Save to Wishlist'"
                >
                  <HeartIcon class="h-4 w-4" :class="cartStore.isInWishlist(prod.id) ? 'fill-rose-500 text-rose-500' : ''" />
                </button>
              </div>

              <!-- Product Image Frame: Masonry style, auto height -->
              <div 
                class="relative w-full overflow-hidden bg-light-bg-sec dark:bg-slate-900 border-b border-divider dark:border-[#12232a]/60 cursor-pointer"
                @click="router.push('/products/' + prod.id)"
              >
                <img 
                  :src="prod.image" 
                  class="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-[0.9]" 
                />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                
                <!-- Dynamic Category Tag -->
                <span class="absolute bottom-3 left-3 bg-[#0d2126] text-accent-green text-[9px] font-mono uppercase px-2 py-0.5 rounded font-extrabold border border-emerald-900/60">
                  {{ getCategorySector(prod.categoryId) }}
                </span>
              </div>

              <!-- Details Area -->
              <div class="p-4.5 space-y-3 flex-1 flex flex-col justify-between">
                
                <div>
                  <!-- Location tracker -->
                  <div class="flex justify-between items-center text-[9px] font-mono text-cyan-400 uppercase tracking-wider">
                    <div class="flex items-center space-x-1">
                      <span class="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                      <span>Bassin {{ getCameroonRegion(prod.id) }}</span>
                    </div>

                    <!-- Stars rating -->
                    <div class="flex items-center space-x-0.5">
                      <StarIconSolid v-for="i in 4" :key="i" class="h-3 w-3 text-button-orange" />
                      <StarIconSolid class="h-3 w-3 text-text-sec" />
                    </div>
                  </div>

                  <!-- Product Name -->
                  <h3 class="text-[13px] font-sans font-bold text-[var(--color-text-primary)] leading-tight uppercase tracking-tight mt-1 group-hover:text-accent-green transition">
                    {{ prod.name }}
                  </h3>

                  <!-- Cooperative Supp/Brand -->
                  <p class="text-xs text-[var(--color-text-secondary)] font-mono mt-1.5">
                    Coop: <span class="font-bold text-[var(--color-text-secondary)]">{{ getSupplierName(prod.supplierId) }}</span>
                  </p>
                </div>

                <!-- Price and availability section: Wholesale (lot) + unit price -->
                <div class="pt-3 border-t border-[#0e2129] flex items-end justify-between">
                  <div>
                    <span class="text-xs uppercase font-bold text-[var(--color-text-secondary)] block mb-1">B2B Base Lot cost</span>
                    <span class="text-accent-green font-black text-xl font-mono">
                      {{ formatCFA(prod.price) }}
                    </span>
                    <span class="text-[var(--color-text-tertiary)] font-mono text-[10px] lowercase"> / {{ prod.unit }}</span>
                    
                    <!-- Unit Price estimation -->
                    <span class="text-xs font-mono text-[var(--color-text-tertiary)] block mt-1 font-bold">
                      (Unit. ~{{ formatCFA(Math.round(prod.price / 10)) }} / kg)
                    </span>
                  </div>

                  <div class="text-right">
                    <span class="text-xs uppercase font-bold text-[var(--color-text-secondary)] block mb-1">Escrow Stock</span>
                    <span 
                      class="text-xl font-mono font-black"
                      :class="prod.status === 'out_of_stock' || prod.stock <= 0 ? 'text-red-500' : 'text-[var(--color-text-secondary)]'"
                    >
                      {{ prod.status === 'out_of_stock' || prod.stock <= 0 ? 'RUPTURE' : `${prod.stock} ${prod.unit}s` }}
                    </span>
                    
                    <!-- Stock bar indicator -->
                    <div class="w-20 bg-[var(--color-surface)] h-1 rounded overflow-hidden mt-1.5 ml-auto border border-[var(--color-border)]">
                      <div 
                        class="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded"
                        :style="{ width: `${Math.min((prod.stock / 500) * 100, 100)}%` }"
                      ></div>
                    </div>
                  </div>
                </div>

                <!-- Quick Actions Tray -->
                <div class="grid grid-cols-2 gap-2 pt-3 border-t border-[#0e2129]">
                  <button 
                    @click="router.push('/products/' + prod.id)"
                    class="py-2 bg-light-bg-main dark:bg-[#091116] border border-[var(--color-border)] hover:bg-[#122329] hover:border-[#1e3447] text-slate-350 hover:text-emerald-350 text-[10px] font-mono uppercase tracking-wider rounded-lg transition"
                  >
                    Quick View
                  </button>
                  
                  <button 
                    @click.stop="addPromoWithQuantity(prod, 1)"
                    :disabled="prod.status === 'out_of_stock' || prod.stock <= 0"
                    class="py-2 rounded-lg text-[10px] font-mono uppercase font-bold transition flex items-center justify-center space-x-1 border"
                    :class="prod.status === 'out_of_stock' || prod.stock <= 0 
                      ? 'bg-[var(--color-surface)] border-[var(--color-border)] text-text-sec cursor-not-allowed' 
                      : 'bg-emerald-950 border-emerald-900 hover:bg-accent-green hover:text-text-main text-accent-green hover:border-transparent'"
                  >
                    <ShoppingCartIcon class="h-3.5 w-3.5" />
                    <span>Add</span>
                  </button>
                </div>

              </div>

            </div>
          </div>

          <!-- DYNAMIC PAGINATION CONTROLLER (Pagination réelle) -->
          <div 
            v-if="totalPages > 1" 
            class="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-[#091117] border border-[var(--color-border)] rounded-2xl text-base font-mono"
          >
            <!-- Rows per page helper -->
            <div class="text-[var(--color-text-tertiary)] order-2 sm:order-1">
              Page <span class="text-[var(--color-text-primary)] font-bold">{{ currentPage }}</span> of {{ totalPages }} 
              ({{ sortedProducts.length }} total matched lots)
            </div>

            <!-- Page Buttons -->
            <div class="flex items-center space-x-1.5 order-1 sm:order-2">
              <button 
                @click="goToPage(1)"
                :disabled="currentPage === 1"
                class="px-2.5 py-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-emerald-950 text-[var(--color-text-secondary)] disabled:opacity-40 transition uppercase text-[9px] font-bold"
              >
                &laquo; First
              </button>
              
              <button 
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-2.5 py-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-emerald-950 text-[var(--color-text-secondary)] disabled:opacity-40 transition uppercase text-[9px] font-bold"
              >
                &larr; Prev
              </button>

              <!-- Dynamic numbered buttons around active page -->
              <button 
                v-for="p in visiblePages" 
                :key="p"
                @click="goToPage(p)"
                class="h-8 w-8 rounded-lg font-bold transition"
                :class="currentPage === p 
                  ? 'bg-emerald-550 border border-accent-green text-[var(--color-text-primary)] font-extrabold' 
                  : 'bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[#0c1f26] text-[var(--color-text-secondary)] hover:text-accent-green'"
              >
                {{ p }}
              </button>

              <button 
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-2.5 py-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-emerald-950 text-[var(--color-text-secondary)] disabled:opacity-40 transition uppercase text-[9px] font-bold"
              >
                Next &rarr;
              </button>

              <button 
                @click="goToPage(totalPages)"
                :disabled="currentPage === totalPages"
                class="px-2.5 py-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-emerald-950 text-[var(--color-text-secondary)] disabled:opacity-40 transition uppercase text-[9px] font-bold"
              >
                Last &raquo;
              </button>
            </div>
          </div>

        </main>

      </div>
    </section>

    <!-- QUICK VIEW MODAL COMPONENT -->
    <Transition name="modal-scale">
      <div 
        v-if="modalProduct" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--color-background)]/85 backdrop-blur-sm select-none"
        @click="closeQuickView"
      >
        <!-- Modal wrapper -->
        <div 
          class="bg-[var(--color-surface)] border-2 border-[var(--color-primary)] rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 space-y-6 relative text-base flex flex-col"
          @click.stop
        >
          <!-- Absolute Close button -->
          <button 
            @click="closeQuickView"
            class="absolute top-4 right-4 h-10 w-10 rounded-full bg-[var(--color-background)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 border border-[var(--color-border)] flex items-center justify-center text-2xl font-bold select-none z-50"
          >
            &times;
          </button>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            <!-- Column 1: Image & Basic Info (Span 5) -->
            <div class="md:col-span-5 space-y-6">
              <div class="relative h-80 rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-background)] shadow-inner">
                <!-- Main Media Display -->
                <template v-if="modalProduct.media && modalProduct.media.length > 0">
                  <template v-if="modalProduct.media[activeMediaIndex].type === 'video'">
                    <video 
                      :src="modalProduct.media[activeMediaIndex].url" 
                      controls 
                      autoplay
                      muted
                      loop
                      class="w-full h-full object-cover"
                    ></video>
                  </template>
                  <template v-else>
                    <img :src="modalProduct.media[activeMediaIndex].url" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </template>
                </template>
                <template v-else>
                  <img :src="modalProduct.image" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </template>
                
                <div class="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md text-text-main dark:text-white text-xs font-mono px-3 py-1.5 rounded border border-[var(--color-primary)]/50 font-bold uppercase shadow-lg">
                  SKU: {{ modalProduct.sku }}
                </div>
              </div>

              <!-- Media Thumbnails Gallery -->
              <div v-if="modalProduct.media && modalProduct.media.length > 1" class="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                <button 
                  v-for="(med, idx) in modalProduct.media" 
                  :key="idx"
                  @click="activeMediaIndex = idx"
                  class="relative h-16 w-16 rounded-xl overflow-hidden border-2 transition-all shrink-0"
                  :class="activeMediaIndex === idx ? 'border-button-orange' : 'border-divider dark:border-slate-800 opacity-60 hover:opacity-100'"
                >
                  <img :src="med.thumbnail || med.url" class="w-full h-full object-cover" />
                  <div v-if="med.type === 'video'" class="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <svg class="h-6 w-6 text-text-main dark:text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" /></svg>
                  </div>
                </button>
              </div>

              <!-- Specs -->
              <div class="p-5 bg-light-bg-main dark:bg-[#0a1017] rounded-2xl border border-divider dark:border-slate-800 space-y-3">
                <div class="flex justify-between items-center pb-2 border-b border-divider dark:border-slate-800">
                  <span class="text-slate-500 font-sans font-bold uppercase text-xs">Vendeur / Boutique :</span>
                  <span class="text-button-orange font-bold text-sm">{{ getSupplierName(modalProduct.supplierId) }}</span>
                </div>
                <div class="flex justify-between items-center pb-2 border-b border-divider dark:border-slate-800">
                  <span class="text-slate-500 font-sans font-bold uppercase text-xs">Avis Moyens :</span>
                  <span class="text-text-main dark:text-white font-bold text-sm">⭐ {{ modalProduct.rating || '4.5' }} ({{ modalProduct.reviewsCount || 120 }} avis)</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-slate-500 font-sans font-bold uppercase text-xs">Disponibilité :</span>
                  <span class="text-accent-green font-bold text-sm">{{ modalProduct.stock }} en stock</span>
                </div>
              </div>
            </div>

            <!-- Column 2: Specs, Buy Form & Comments (Span 7) -->
            <div class="md:col-span-7 flex flex-col space-y-6">
              
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="bg-button-orange/10 text-button-orange text-xs font-sans uppercase px-3 py-1.5 rounded-md font-bold border border-button-orange/30 inline-block">
                    {{ getCategorySector(modalProduct.categoryId) }}
                  </span>
                  
                  <!-- Bouton Partager -->
                  <button 
                    @click="shareProduct"
                    class="flex items-center space-x-1.5 text-slate-400 hover:text-text-main dark:text-white bg-light-bg-sec dark:bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-5.368m0 5.368l5.662 3.397m-5.662-3.397a3 3 0 110-5.368m0 5.368l5.662-3.397m-5.662 3.397A3 3 0 1115 12a3 3 0 116 0A3 3 0 1115 12z" /></svg>
                    <span>Partager</span>
                  </button>
                </div>
                
                <h2 class="text-3xl font-black text-text-main dark:text-white uppercase tracking-tight font-sans leading-tight">
                  {{ modalProduct.name }}
                </h2>

                <p class="text-slate-400 text-sm leading-relaxed border-l-4 border-button-orange pl-4 bg-light-bg-sec dark:bg-slate-900/30 p-2 rounded-r-lg">
                  {{ modalProduct.description }}
                </p>

                <!-- Existing Comments / Reviews -->
                <div class="mt-6 space-y-3">
                  <h4 class="text-xs font-mono uppercase text-[var(--color-text-tertiary)] font-bold mb-3 border-b border-divider dark:border-slate-800 pb-2">Avis Récents ({{ modalProduct.reviewsCount }})</h4>
                  
                  <!-- Local Added Comments -->
                  <div v-for="(cmt, idx) in localComments" :key="'local-'+idx" class="bg-[#03060a] p-3 rounded-xl border border-button-orange/30">
                    <div class="flex items-center justify-between mb-1">
                      <span class="text-xs font-bold text-button-orange">Vous (Nouveau)</span>
                      <span class="text-[9px] text-slate-500 font-mono">À l'instant</span>
                    </div>
                    <p class="text-xs text-text-sec dark:text-slate-300 font-sans leading-relaxed">{{ cmt }}</p>
                  </div>

                  <!-- Mock Comments -->
                  <div class="bg-[#03060a] p-3 rounded-xl border border-divider dark:border-slate-800">
                    <div class="flex items-center justify-between mb-1">
                      <span class="text-xs font-bold text-slate-200">Jean P.</span>
                      <span class="text-[9px] text-slate-500 font-mono">Hier</span>
                    </div>
                    <p class="text-xs text-slate-400 font-sans leading-relaxed">Produit de très bonne qualité, la livraison a été rapide et bien emballée. Je recommande !</p>
                  </div>
                  <div class="bg-[#03060a] p-3 rounded-xl border border-divider dark:border-slate-800">
                    <div class="flex items-center justify-between mb-1">
                      <span class="text-xs font-bold text-slate-200">Marie C.</span>
                      <span class="text-[9px] text-slate-500 font-mono">Il y a 3 jours</span>
                    </div>
                    <p class="text-xs text-slate-400 font-sans leading-relaxed">Exactement ce dont j'avais besoin pour ma boutique. Rapport qualité/prix excellent.</p>
                  </div>
                </div>

                <!-- Comment / Review Form -->
                <div class="bg-light-bg-sec dark:bg-slate-900 border border-divider dark:border-slate-800 p-4 rounded-xl mt-4">
                  <label class="block text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-tertiary)] font-bold mb-2">Laisser un avis ou poser une question</label>
                  <textarea 
                    v-model="newComment"
                    rows="2"
                    placeholder="Votre message ici..." 
                    class="w-full bg-[#03060a] border border-[#142630] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-button-orange placeholder-slate-500 font-sans resize-none"
                  ></textarea>
                  <div class="flex justify-end mt-2">
                    <button 
                      @click="submitComment"
                      :disabled="!newComment.trim()"
                      class="px-4 py-1.5 bg-button-orange/20 text-button-orange hover:bg-button-orange hover:text-text-main disabled:opacity-50 disabled:cursor-not-allowed text-[10px] font-bold uppercase rounded transition"
                    >
                      Envoyer
                    </button>
                  </div>
                </div>
                <!-- Quantity & Actions -->
                <div class="space-y-4 pt-4 border-t border-divider dark:border-slate-800">
                  <div class="grid grid-cols-12 gap-3 pt-2">
                    <button @click="addModalToCompare" class="col-span-3 py-4 rounded-xl border border-divider dark:border-slate-800 bg-light-bg-main dark:bg-[#0a1017] hover:bg-light-bg-sec dark:bg-slate-800 hover:border-button-orange/50 font-sans text-xs uppercase font-bold text-slate-400 transition shadow-sm flex items-center justify-center gap-1.5">
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" /></svg>
                      Comparer
                    </button>
                    <button @click="cartStore.toggleWishlist(modalProduct)" class="col-span-3 py-4 rounded-xl border border-divider dark:border-slate-800 bg-light-bg-main dark:bg-[#0a1017] hover:bg-rose-500/10 hover:border-rose-500 font-sans text-xs uppercase font-bold text-slate-400 transition shadow-sm flex items-center justify-center gap-1.5" :class="cartStore.isInWishlist(modalProduct.id) ? 'border-rose-500 text-rose-500' : ''">
                      <HeartIcon class="h-4 w-4" />
                      Favoris
                    </button>
                    <button @click="addModalProductToCart" class="col-span-6 py-4 bg-button-orange hover:bg-button-orange\/90 text-text-main font-sans font-black text-sm uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all flex items-center justify-center gap-2">
                      <ShoppingCartIcon class="h-5 w-5" />
                      Ajouter au Panier
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <!-- SIMILAR PRODUCTS SECTION -->
          <div class="pt-8 border-t border-divider dark:border-slate-800">
            <h3 class="text-sm font-sans uppercase tracking-wider text-button-orange font-black flex items-center space-x-2 mb-6">
              <span>Produits Similaires & Recommandations</span>
              <span class="text-[10px] bg-button-orange/10 px-2 py-1 rounded text-button-orange border border-button-orange/20">MÊME CATÉGORIE</span>
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              <div 
                v-for="sim in similarProducts" 
                :key="sim.id"
                class="bg-light-bg-main dark:bg-[#0a1017] rounded-2xl border border-divider dark:border-slate-800 hover:border-button-orange/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] overflow-hidden group cursor-pointer transition-all flex flex-col"
                @click="switchModalProduct(sim)"
              >
                <!-- Image Container with proper aspect ratio -->
                <div class="relative aspect-square w-full overflow-hidden bg-light-bg-sec dark:bg-slate-900 border-b border-divider dark:border-slate-800">
                  <img :src="sim.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-[0.9]" />
                  <div class="absolute inset-0 bg-gradient-to-t from-[#0a1017]/80 via-transparent to-transparent"></div>
                  
                  <span class="absolute top-2 left-2 bg-[#0d2126] text-accent-green text-[9px] font-mono uppercase px-2 py-0.5 rounded font-extrabold border border-emerald-900/60">
                    {{ sim.unit }}
                  </span>
                </div>
                
                <div class="p-4 flex flex-col justify-between flex-1 relative bg-light-bg-main dark:bg-[#0a1017]">
                  <h4 class="text-sm font-sans font-bold text-text-main dark:text-white leading-tight group-hover:text-button-orange transition-colors line-clamp-2">
                    {{ sim.name }}
                  </h4>
                  
                  <div class="mt-4 pt-3 border-t border-divider dark:border-slate-800 flex justify-between items-end">
                    <div>
                      <p class="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-0.5">Prix Unitaire</p>
                      <span class="text-sm font-black text-button-orange font-sans">{{ formatCFA(sim.price) }}</span>
                    </div>
                    <div class="text-right">
                      <p class="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-0.5">Dispo</p>
                      <span class="text-xs font-bold font-mono" :class="sim.stock > 0 ? 'text-accent-green' : 'text-red-500'">{{ sim.stock }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Transition>

    <!-- MAIN PLATFORM FOOTER -->
    <!-- FOOTER -->
    <PublicFooter />

  </div>
</template>

<script setup>
import PublicFooter from '@/components/PublicFooter.vue';
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useWindowScroll } from '@vueuse/core';
import { useProductsStore } from '@/store/modules/products.js';
import { useCartStore } from '@/store/modules/cart.js';
import { useAuthStore } from '@/store/modules/auth.js';
import { useToast } from 'vue-toastification';
import { categories, suppliers } from '@/utils/seed_data.js';
import { 
  FireIcon,
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ChevronDownIcon, 
  ScaleIcon, 
  HeartIcon, 
  ShoppingCartIcon
} from '@heroicons/vue/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/vue/24/solid';

// Import components
import PublicHeader from '@/components/PublicHeader.vue';

// Setup routing & stores
const route = useRoute();
const router = useRouter();
const productsStore = useProductsStore();
const cartStore = useCartStore();
const authStore = useAuthStore();
const toast = useToast();

const { y } = useWindowScroll();

const isCategoryAccordionOpen = ref(true);
const isSidebarOpen = ref(true);

const globalCountries = [
  "Cameroun", "France", "États-Unis", "Chine", "Côte d'Ivoire", "Nigeria", 
  "Sénégal", "Maroc", "Afrique du Sud", "Brésil", "Inde", "Turquie"
];

// ----------------------------------------------------
// HERO MOOD SLIDE BANNER IMAGES & ACCENTS
// ----------------------------------------------------
const activeSlide = ref(0);
const heroSlides = [
  {
    badge: "Nouvelle Collection - Livraison 24H",
    title: "Le Célèbre Poivre de Penja",
    description: "Recherché et labellisé à l'échelle internationale. Issu des sols volcaniques fertiles du Moungo. Idéal pour vos repas, disponible en format familial et de gros.",
    image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=1200",
    accent: "11,500 CFA / Unité",
  },
  {
    badge: "Boutiques Officielles - Haute Qualité",
    title: "Chocolat & Cacao Premium",
    description: "Séchage direct sous le soleil équatorial. Sélections de fèves de calibre supérieur, haut de gamme, idéales pour les gourmands et les maîtres chocolatiers mondiaux.",
    image: "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&q=80&w=1200",
    accent: "3,250 CFA / Unité",
  },
  {
    badge: "Offre Spéciale - Quantités Limitées",
    title: "Café Arabica Pur Torréfié",
    description: "Cultivé en altitude élevée sur les collines fertiles de l'Ouest. Grains de café avec arômes denses, parfait pour bien démarrer votre journée.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=1200",
    accent: "4,600 CFA / Unité",
  }
];

function shareProduct() {
  toast.info("Lien copié dans le presse-papiers ! Vous pouvez maintenant le partager.");
}

// Carousel auto slider interval timer
let carouselInterval = null;
onMounted(() => {
  if (route.query.filterSector) {
    // Try to find matching sector name
    const querySec = route.query.filterSector;
    const foundCat = categories.find(c => c.name === querySec);
    const sectorToFilter = foundCat ? foundCat.sector : querySec;
    filters.sectors = [sectorToFilter];
    scrollToCatalog();
  }
  carouselInterval = setInterval(() => {
    nextSlide();
  }, 7500);
});

function nextSlide() {
  activeSlide.value = (activeSlide.value + 1) % heroSlides.length;
}
function prevSlide() {
  activeSlide.value = (activeSlide.value - 1 + heroSlides.length) % heroSlides.length;
}

// ----------------------------------------------------
// FLASH MEGAPROMOS DATA (From seeded products)
// ----------------------------------------------------
const b2bPromos = computed(() => {
  // Grab a few stable products and discount them
  const sampleProds = productsStore.products.slice(2, 8);
  const discounts = ["20%", "15%", "12%", "10%", "18%", "25%"];
  const tonnageLimits = [5, 10, 4, 15, 8, 3];
  
  return sampleProds.map((p, idx) => {
    const discPct = parseFloat(discounts[idx].replace('%', ''));
    const promoPrice = Math.floor(p.price * (1 - discPct / 100) / 50) * 50; // rounded cfa
    
    return {
      id: `promo_${idx}`,
      product: p,
      discount: discounts[idx],
      promoPrice,
      limit: tonnageLimits[idx]
    };
  });
});

const dealsDeck = ref(null);
function scrollDealsLeft() {
  if (dealsDeck.value) {
    dealsDeck.value.scrollLeft -= 320;
  }
}
function scrollDealsRight() {
  if (dealsDeck.value) {
    dealsDeck.value.scrollLeft += 320;
  }
}

// ----------------------------------------------------
// PRODUCT FILTER & AUDIT STATE
// ----------------------------------------------------
const storeProducts = computed(() => productsStore.products);

const maxProductPrice = computed(() => {
  if (storeProducts.value.length === 0) return 300000;
  return Math.max(...storeProducts.value.map(p => p.price));
});

const filters = reactive({
  keyword: '',
  sectors: [],
  country: '',
  city: '',
  maxPrice: 300000,
  stockOnly: false,
  sortBy: 'created_desc'
});

// Watch raw max product price to adjust default price range slider
watch(maxProductPrice, (newMax) => {
  filters.maxPrice = newMax;
}, { immediate: true });

const cameroonCities = ["Garoua", "Douala", "Yaoundé", "Foumbot", "Sangmélima", "Mbouda", "Bamenda", "Kribi", "Bafoussam"];

// Unique sectors computation with item count
const availableSectors = computed(() => {
  const counts = {};
  storeProducts.value.forEach(p => {
    const sec = getCategorySector(p.categoryId);
    counts[sec] = (counts[sec] || 0) + 1;
  });
  return Object.keys(counts).map(name => ({
    name,
    count: counts[name]
  })).sort((a,b) => b.count - a.count);
});

// Has active filters?
const hasActiveFilters = computed(() => {
  return filters.keyword !== '' || filters.sectors.length > 0 || filters.city !== '' || filters.maxPrice < maxProductPrice.value || filters.stockOnly === true;
});

function resetFilters() {
  filters.keyword = '';
  filters.sectors = [];
  filters.country = '';
  filters.city = '';
  filters.maxPrice = maxProductPrice.value;
  filters.stockOnly = false;
  filters.sortBy = 'created_desc';
  currentPage.value = 1;
  toast.info('All marketplace filters successfully cleared.');
}

function removeSectorFilter(sec) {
  filters.sectors = filters.sectors.filter(s => s !== sec);
}

// ----------------------------------------------------
// FILTER & SORT IMPLEMENTATION
// ----------------------------------------------------
const sortedProducts = computed(() => {
  // 1. Filter
  let list = storeProducts.value.filter(p => {
    
    // Keyword match
    if (filters.keyword) {
      const query = filters.keyword.toLowerCase();
      const matchName = p.name.toLowerCase().includes(query);
      const matchSku = p.sku.toLowerCase().includes(query);
      const matchDesc = p.description.toLowerCase().includes(query);
      if (!matchName && !matchSku && !matchDesc) return false;
    }

    // Sectors multi-select match
    if (filters.sectors.length > 0) {
      const pSector = getCategorySector(p.categoryId);
      if (!filters.sectors.includes(pSector)) return false;
    }

    // City match
    if (filters.city) {
      const pRegion = getCameroonRegion(p.id);
      if (pRegion.toLowerCase() !== filters.city.toLowerCase()) return false;
    }
    
    // Country match
    if (filters.country) {
      // Mock country matching logic
      const pCountry = getGlobalCountry(p.id);
      if (pCountry !== filters.country) return false;
    }

    // Max Price
    if (p.price > filters.maxPrice) return false;

    // Stock
    if (filters.stockOnly && (p.status === 'out_of_stock' || p.stock <= 0)) return false;

    return true;
  });

  // 2. Sort
  list.sort((a, b) => {
    if (filters.sortBy === 'name_asc') {
      return a.name.localeCompare(b.name);
    }
    if (filters.sortBy === 'price_asc') {
      return a.price - b.price;
    }
    if (filters.sortBy === 'price_desc') {
      return b.price - a.price;
    }
    if (filters.sortBy === 'stock_desc') {
      return b.stock - a.stock;
    }
    if (filters.sortBy === 'created_desc') {
      return b.id.localeCompare(a.id); // fallback deterministic id compare
    }
    return 0;
  });

  return list;
});

// ----------------------------------------------------
// PAGINATION RÉELLE STATICS (Pagination réelle)
// ----------------------------------------------------
const currentPage = ref(1);
const itemsPerPage = 12;

const totalPages = computed(() => {
  return Math.ceil(sortedProducts.value.length / itemsPerPage) || 1;
});

// Watch filtered list length, if current page exceeds total, reset page to 1
watch(sortedProducts, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = 1;
  }
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return sortedProducts.value.slice(start, start + itemsPerPage);
});

const visiblePages = computed(() => {
  const current = currentPage.value;
  const max = totalPages.value;
  const pages = [];
  
  if (max <= 5) {
    for (let i = 1; i <= max; i++) pages.push(i);
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, 4, 5);
    } else if (current >= max - 2) {
      pages.push(max - 4, max - 3, max - 2, max - 1, max);
    } else {
      pages.push(current - 2, current - 1, current, current + 1, current + 2);
    }
  }
  return pages;
});

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    scrollIntoCatalogExplorer();
  }
}

// ----------------------------------------------------
// QUICK VIEW MODAL & SPEC OVERVIEW
// ----------------------------------------------------
const modalProduct = ref(null);
const modalQty = ref(1);
const activeMediaIndex = ref(0);

function openQuickView(product) {
  modalProduct.value = product;
  modalQty.value = 1;
  activeMediaIndex.value = 0;
}

function closeQuickView() {
  modalProduct.value = null;
}

function adjustModalQty(val) {
  const newQty = modalQty.value + val;
  if (newQty >= 1 && (!modalProduct.value.stock || newQty <= modalProduct.value.stock)) {
    modalQty.value = newQty;
  }
}

function addModalProductToCart() {
  if (!modalProduct.value) return;
  cartStore.addToCart(modalProduct.value, modalQty.value);
  toast.success(`[SUCCESS] ajouté ${modalQty.value} ${modalProduct.value.unit}s de ${modalProduct.value.name} au panier.`);
  closeQuickView();
}

function addModalToCompare() {
  const res = cartStore.toggleCompare(modalProduct.value);
  if (res === 'added') {
    toast.success(`[⚖️] ${modalProduct.value.name} ajouté à la comparaison.`);
  } else if (res === 'removed') {
    toast.info(`[⚖️] ${modalProduct.value.name} retiré.`);
  } else {
    toast.error(`[LIMITE] Choisissez max 3 produits pour la comparaison.`);
  }
}

function switchModalProduct(product) {
  modalProduct.value = product;
  modalQty.value = 1;
}

// ----------------------------------------------------
// SIMILAR PRODUCTS ALGORITHM
// ----------------------------------------------------
const similarProducts = computed(() => {
  if (!modalProduct.value) return [];
  // Find products in same category or supplier
  return productsStore.products
    .filter(p => p.categoryId === modalProduct.value.categoryId && p.id !== modalProduct.value.id)
    .slice(0, 4);
});

// ----------------------------------------------------
// COMMENTS
// ----------------------------------------------------
const newComment = ref('');
const localComments = ref([]);

function submitComment() {
  if (!newComment.value.trim()) return;
  localComments.value.unshift(newComment.value);
  toast.success('Votre avis a été enregistré avec succès.');
  newComment.value = '';
}

// ----------------------------------------------------
// HELPER LOOKUPS
// ----------------------------------------------------
function formatCFA(val) {
  if (val === undefined || val === null) return '0 CFA';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('FCFA', 'CFA').replace('XAF', 'CFA');
}

function getCategorySector(catId) {
  const found = categories.find(c => c.id === catId);
  return found ? found.sector : 'Agro-Business';
}

function getSupplierName(supplierId) {
  const found = suppliers.find(s => s.id === supplierId);
  return found ? found.name : 'Coopérative Locale B2B';
}

// Deterministically map a Cameroon region based on product id to give realistic locations
function getCameroonRegion(prodId) {
  // Strip numeric id
  const num = parseInt(prodId.replace(/[^0-9]/g, "")) || 1;
  const list = ["Moungo", "Sangmélima", "Garoua", "Foumbot", "Mbouda", "Bamenda", "Kribi", "Yaoundé", "Douala"];
  return list[num % list.length];
}

function getGlobalCountry(prodId) {
  const num = parseInt(prodId.replace(/[^0-9]/g, "")) || 1;
  const list = ["Cameroun", "France", "États-Unis", "Chine", "Côte d'Ivoire", "Nigeria"];
  // mostly cameroun
  return num % 3 === 0 ? list[num % list.length] : "Cameroun";
}

// Quick action tools
function addPromoWithQuantity(product, qty) {
  cartStore.addToCart(product, qty);
  toast.success(`[🛒 panier] Saisie de ${product.name} (Lot) réussie.`);
}

// Smooth scroll actions
function scrollToCatalog() {
  const el = document.getElementById('catalog-explorer');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

function scrollIntoCatalogExplorer() {
  const el = document.getElementById('catalog-explorer');
  if (el) {
    el.scrollIntoView({ behavior: 'auto' });
  }
}
</script>

<style scoped>
/* Scoped marquee modifiers */
.text-gradient {
  background-size: 200% auto;
  animation: glowText 4s linear infinite;
}

@keyframes glowText {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.scrollbar-thin::-webkit-scrollbar {
  height: 5px;
  width: 5px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #152c38;
  border-radius: 4px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #254452;
}

/* MARQUEE ANIMATIONS */
.deals-wrapper {
  mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
}
.deals-track {
  animation: slideDeals 35s linear infinite;
}
.hover\:animation-pause:hover {
  animation-play-state: paused;
}
@keyframes slideDeals {
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(-50% - 0.5rem)); }
}

.promo-sidebar-track {
  animation: slidePromoUp 25s linear infinite;
}
@keyframes slidePromoUp {
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
}
</style>
