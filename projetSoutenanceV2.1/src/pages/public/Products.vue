<template>
  <div class="min-h-screen bg-[#070b12] text-slate-100 flex flex-col justify-between">
    
    <!-- NAVIGATION BAR -->
    <PublicHeader />

    <!-- HERO MOOD ANIME BANNERS (Auto-sliding or manually toggled slideshow) -->
    <section class="relative h-[25rem] sm:h-[28rem] lg:h-[32rem] overflow-hidden bg-slate-950 border-b border-[#14232c]/50">
      <div 
        v-for="(slide, index) in heroSlides" 
        :key="index"
        class="absolute inset-0 transition-all duration-1000 ease-in-out transform flex items-center"
        :class="activeSlide === index ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-12 scale-105 pointer-events-none'"
      >
        <!-- Background Darkened Image Cover -->
        <div class="absolute inset-0">
          <img :src="slide.image" class="w-full h-full object-cover filter brightness-[0.25] contrast-[1.1]" />
          <div class="absolute inset-0 bg-gradient-to-t from-[#070b12] via-transparent to-[#070b12]/50"></div>
          <div class="absolute inset-0 bg-gradient-to-r from-[#070b12] via-[#070b12]/70 to-transparent"></div>
        </div>

        <!-- Hero Card Floating Content (capter l’attention, animations fluides) -->
        <div class="relative max-w-6xl mx-auto px-6 md:px-12 z-20 w-full">
          <div class="max-w-2xl space-y-4">
            
            <div class="inline-flex items-center space-x-2 bg-emerald-950 text-emerald-450 border border-emerald-900 rounded-full px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest animate-pulse">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span>{{ slide.badge }}</span>
            </div>
            
            <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-none drop-shadow-xl font-sans uppercase">
              <span class="block text-gradient bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-350">
                {{ slide.title }}
              </span>
            </h1>
            
            <p class="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed tracking-wide drop-shadow-md">
              {{ slide.description }}
            </p>

            <div class="pt-4 flex flex-wrap gap-3 items-center">
              <button 
                @click="scrollToCatalog"
                class="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-450 hover:to-teal-550 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:scale-103 transition duration-200"
              >
                Explore Wholesale Lots &darr;
              </button>
              
              <div class="px-4 py-2.5 bg-slate-900/90 backdrop-blur border border-[#162a33] text-slate-205 rounded-xl text-xs font-mono">
                <span class="text-slate-500">Current Base:</span>
                <span class="text-emerald-400 font-bold ml-1.5">{{ slide.accent }}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Left / Right Carousel Buttons -->
      <button 
        @click="prevSlide"
        class="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-slate-950/60 hover:bg-emerald-950 border border-slate-900 text-slate-300 hover:text-emerald-400 flex items-center justify-center z-30 transition"
      >
        &larr;
      </button>
      <button 
        @click="nextSlide"
        class="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-slate-950/60 hover:bg-emerald-950 border border-slate-900 text-slate-300 hover:text-emerald-400 flex items-center justify-center z-30 transition"
      >
        &rarr;
      </button>

      <!-- Carousel Indicators Dots -->
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
        <button 
          v-for="(slide, sIdx) in heroSlides" 
          :key="sIdx"
          @click="activeSlide = sIdx"
          class="h-1.5 rounded-full transition-all duration-300"
          :class="activeSlide === sIdx ? 'w-6 bg-emerald-400' : 'w-2 bg-slate-750'"
        ></button>
      </div>
    </section>

    <!-- PROMOTIONS DÉFILANTES (Interactive Wholesale Deal Slider Card Deck) -->
    <section class="py-10 bg-slate-950 px-4 md:px-8 overflow-hidden">
      <div class="max-w-6xl mx-auto space-y-4">
        <div class="flex justify-between items-end">
          <div>
            <span class="text-[9.5px] font-mono text-emerald-400 font-extrabold uppercase bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/30">LIVRAISON PORT DE KRIBI & DOUALA</span>
            <h2 class="text-lg font-bold text-slate-105 font-mono uppercase mt-1">⚡ OFFRES DE GROS FLASH (COOP-TO-B2B)</h2>
          </div>
          <div class="flex space-x-1">
            <button @click="scrollDealsLeft" class="px-2 py-1 bg-[#0d161d] hover:bg-emerald-950 border border-slate-900 rounded text-xs text-slate-400 hover:text-emerald-400">&larr;</button>
            <button @click="scrollDealsRight" class="px-2 py-1 bg-[#0d161d] hover:bg-emerald-950 border border-slate-900 rounded text-xs text-slate-400 hover:text-emerald-400">&rarr;</button>
          </div>
        </div>

        <!-- Horizontal Scrollable Slider of Promo Cards -->
        <div 
          ref="dealsDeck"
          class="flex space-x-4 overflow-x-auto pb-4 scroll-smooth scrollbar-thin select-none snap-x"
        >
          <div 
            v-for="deal in b2bPromos" 
            :key="deal.id"
            class="min-w-[20rem] max-w-[22rem] snap-start bg-[#0a1017] border border-[#14232c] rounded-2xl p-4.5 space-y-3 shrink-0 flex flex-col justify-between hover:border-emerald-600/30 transition duration-300 group"
          >
            <div class="flex justify-between items-start">
              <span class="bg-red-950 text-red-400 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border border-red-900/50 uppercase">
                SAVE {{ deal.discount }}
              </span>
              <span class="text-slate-500 font-mono text-[9px]">Limit: {{ deal.limit }} Tons</span>
            </div>

            <div class="flex space-x-3">
              <img :src="deal.product.image" class="h-14 w-14 object-cover rounded-xl border border-emerald-900/20 group-hover:scale-105 transition duration-300" />
              <div class="truncate">
                <h4 class="text-[12.5px] font-bold text-slate-205 truncate">{{ deal.product.name }}</h4>
                <p class="text-[10.5px] font-mono text-emerald-400 mt-1">
                  {{ formatCFA(deal.promoPrice) }} / <span class="text-slate-500 font-sans text-[10px]">{{ deal.product.unit }}</span>
                </p>
                <p class="text-[9px] font-mono text-slate-500 mt-0.5 line-through">Reg: {{ formatCFA(deal.product.price) }}</p>
              </div>
            </div>

            <div class="pt-2 border-t border-slate-900 text-[10px] text-slate-400 leading-tight">
              &bull; Géré par : <span class="font-bold text-slate-300">{{ getSupplierName(deal.product.supplierId) }}</span>
            </div>

            <div class="flex space-x-2 pt-1">
              <button 
                @click="openQuickView(deal.product)"
                class="flex-1 py-1.5 bg-[#0e1721] hover:bg-[#152433] rounded-lg text-[9.5px] font-mono uppercase tracking-wider transition border border-slate-900 text-slate-300"
              >
                Inspect Specs
              </button>
              <button 
                @click="addPromoWithQuantity(deal.product, 1)"
                class="flex-1 py-1.5 bg-emerald-950 group-hover:bg-emerald-400 text-emerald-400 group-hover:text-slate-950 rounded-lg text-[9.5px] font-mono uppercase font-extrabold tracking-wider transition border border-emerald-900 group-hover:border-transparent flex justify-center items-center"
              >
                Grab Deal
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TWO-COLUMN WORKSPACE: FILTERS & PRODUCTS DECK -->
    <section id="catalog-explorer" class="py-12 px-4 md:px-8 max-w-6xl mx-auto w-full flex-1">
      
      <!-- BENTO HEADER -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b border-[#0f1d24] pb-8 mb-8">
        <div class="md:col-span-2">
          <span class="text-xs font-mono font-bold text-emerald-450 tracking-widest uppercase block mb-1">CACAO, CAFÉ, ÉPICES, SOLAIRE, TEXTILES TRADITIONNELS</span>
          <h2 class="text-2xl font-extrabold text-white tracking-tight uppercase">CMR B2B Wholesale Market</h2>
          <p class="text-[11.5px] text-slate-450 mt-1 leading-relaxed max-w-xl">
            Sourced strictly from certified Cameroonian local farming cooperatives, industrial suppliers, and cross-border transport unions. Secured via sovereign Escrow Guarantee funds.
          </p>
        </div>
        
        <!-- Live Counters -->
        <div class="bg-[#091117] border border-slate-900 rounded-2xl p-4 flex justify-between items-center text-xs font-mono">
          <div>
            <div class="text-slate-550 uppercase text-[9.5px]">Verified Lots</div>
            <div class="text-[15px] font-bold text-slate-205 mt-0.5">{{ storeProducts.length }} Crops</div>
          </div>
          <div class="h-8 w-px bg-slate-900"></div>
          <div>
            <div class="text-slate-550 uppercase text-[9.5px]">Active Cooperatives</div>
            <div class="text-[15px] font-bold text-emerald-400 mt-0.5">24 Regions</div>
          </div>
          <div class="h-8 w-px bg-slate-900"></div>
          <div>
            <div class="text-slate-550 uppercase text-[9.5px]">Kribi Bond</div>
            <div class="text-[15px] font-bold text-cyan-405 mt-0.5">FIFO Escrow</div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <!-- COLUMN 1: INTERACTIVE ADVANCED FILTER SIDEBAR -->
        <aside class="space-y-6 lg:col-span-1 lg:sticky lg:top-24 h-fit bg-[#091016] border border-[#13252f]/40 p-5 rounded-2xl">
          
          <div class="flex justify-between items-center border-b border-[#12242d] pb-3 mb-2">
            <span class="text-xs font-mono font-bold text-slate-200 uppercase tracking-wildest">🔧 Advanced Audits</span>
            <button 
              @click="resetFilters" 
              class="text-[9.5px] font-mono text-emerald-400 hover:text-emerald-350 uppercase font-bold"
              v-show="hasActiveFilters"
            >
              Reset [×]
            </button>
          </div>

          <!-- KEYWORD SEARCH -->
          <div class="space-y-2">
            <label class="block text-[10px] font-mono uppercase tracking-wider text-slate-500">Search Product / Sku</label>
            <div class="relative">
              <input 
                type="text" 
                v-model="filters.keyword"
                placeholder="Ex: Penja, Cacao, Solaire..." 
                class="w-full bg-[#03060a] border border-[#142630] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 placeholder-slate-650"
              />
              <button 
                v-if="filters.keyword" 
                @click="filters.keyword = ''"
                class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-450 hover:text-white font-bold"
              >
                &times;
              </button>
            </div>
          </div>

          <!-- SECTOR PICKER (Dynamic tag sliders) -->
          <div class="space-y-2.5">
            <label class="block text-[10px] font-mono uppercase tracking-wider text-slate-500">Agricultural Sector</label>
            <div class="flex flex-col space-y-1.5 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
              <button 
                @click="selectSector('')"
                class="w-full text-left p-1.5 rounded text-[11px] font-mono transition flex justify-between items-center"
                :class="!filters.sector ? 'bg-[#0e2226] text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'"
              >
                <span>🌍 TOUT REGROUPER</span>
                <span class="text-[9px] text-slate-600">({{ storeProducts.length }})</span>
              </button>
              
              <button 
                v-for="sec in availableSectors" 
                :key="sec.name"
                @click="selectSector(sec.name)"
                class="w-full text-left p-1.5 rounded text-[11px] font-mono transition flex justify-between items-center truncate"
                :class="filters.sector === sec.name ? 'bg-[#0e2226] text-emerald-400 font-bold' : 'text-slate-450 hover:text-slate-205'"
              >
                <span class="truncate leading-none uppercase">{{ sec.name }}</span>
                <span class="text-[9px] text-slate-500 ml-1">({{ sec.count }})</span>
              </button>
            </div>
          </div>

          <!-- PRICE RANGE SLIDER (Mandatory real dynamic feedback) -->
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <label class="text-[10px] font-mono uppercase tracking-wider text-slate-500">Max Bid Base Price</label>
              <span class="text-xs font-mono text-emerald-450 font-bold">{{ formatCFA(filters.maxPrice) }}</span>
            </div>
            
            <input 
              type="range" 
              v-model.number="filters.maxPrice"
              :min="0"
              :max="maxProductPrice"
              class="w-full accent-emerald-500 cursor-pointer h-1.5 bg-[#04080c] rounded-lg"
            />
            
            <div class="flex justify-between text-[9px] font-mono text-slate-500">
              <span>0 CFA</span>
              <span>Max: {{ formatCFA(maxProductPrice) }}</span>
            </div>
          </div>

          <!-- ORIGIN REGION CAMEROON SELECTOR -->
          <div class="space-y-2">
            <label class="block text-[10px] font-mono uppercase tracking-wider text-slate-500">Local Area Hub</label>
            <select 
              v-model="filters.city"
              class="w-full bg-[#03060a] border border-[#142630] rounded-xl px-2.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="">(All Cameroon Origin Hubs)</option>
              <option v-for="c in cameroonCities" :key="c" :value="c">
                Bassin d'axe {{ c }}
              </option>
            </select>
          </div>

          <!-- AVAILABILITY RADIO CHIPS -->
          <div class="space-y-2">
            <label class="block text-[10px] font-mono uppercase tracking-wider text-slate-500">Stock Availability</label>
            <div class="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
              <button 
                @click="filters.stockOnly = false"
                class="py-1.5 px-2.5 rounded-lg border text-center transition"
                :class="!filters.stockOnly ? 'bg-emerald-950 border-emerald-800 text-emerald-400' : 'bg-transparent border-[#152730] text-slate-450 hover:text-slate-205'"
              >
                All Lots
              </button>
              <button 
                @click="filters.stockOnly = true"
                class="py-1.5 px-2.5 rounded-lg border text-center transition"
                :class="filters.stockOnly ? 'bg-emerald-950 border-emerald-800 text-emerald-400' : 'bg-transparent border-[#152730] text-slate-450 hover:text-slate-205'"
              >
                In Stock Only
              </button>
            </div>
          </div>

          <!-- SORT ORDERS -->
          <div class="space-y-2">
            <label class="block text-[10px] font-mono uppercase tracking-wider text-slate-500">Sort Priority</label>
            <select 
              v-model="filters.sortBy"
              class="w-full bg-[#03060a] border border-[#142630] rounded-xl px-2.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 font-mono text-[10.5px]"
            >
              <option value="name_asc">Alphabetical (A - Z)</option>
              <option value="price_asc">Wholesale Price (Low to High)</option>
              <option value="price_desc">Wholesale Price (High to Low)</option>
              <option value="stock_desc">Highest Stock Volume</option>
              <option value="created_desc">Newly Harvested/Listed</option>
            </select>
          </div>

        </aside>

        <!-- COLUMN 2: PRODUCTS GRID AND PAGINATION -->
        <main class="lg:col-span-3 space-y-8">
          
          <!-- Filter info bar with tags and dynamic results description -->
          <div class="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#091117] border border-slate-900 rounded-2xl text-xs">
            <div class="font-sans text-slate-400">
              Showing <span class="text-white font-bold">{{ paginatedProducts.length }}</span> items of 
              <span class="text-emerald-400 font-bold">{{ sortedProducts.length }}</span> matches &bull; 
              Page <span class="text-white font-mono font-bold">{{ currentPage }}</span> of {{ totalPages }}
            </div>

            <!-- Active tags indicator -->
            <div class="flex flex-wrap gap-1.5">
              <span v-if="filters.keyword" class="bg-slate-900 px-2 py-0.5 rounded text-[10px] font-mono text-slate-305 flex items-center space-x-1">
                <span>"{{ filters.keyword }}"</span>
                <button @click="filters.keyword = ''" class="text-rose-500 font-bold ml-1">&times;</button>
              </span>
              <span v-if="filters.sector" class="bg-emerald-950/70 border border-emerald-900 px-2 py-0.5 rounded text-[10px] font-mono text-emerald-450 uppercase flex items-center space-x-1">
                <span>{{ filters.sector }}</span>
                <button @click="filters.sector = ''" class="text-rose-400 font-bold ml-1">&times;</button>
              </span>
              <span v-if="filters.city" class="bg-cyan-950/70 border border-cyan-900 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-450 uppercase flex items-center space-x-1">
                <span>{{ filters.city }}</span>
                <button @click="filters.city = ''" class="text-rose-400 font-bold ml-1">&times;</button>
              </span>
              <span v-if="filters.stockOnly" class="bg-purple-955 px-2 py-0.5 rounded text-[10px] font-mono text-slate-300">
                In Stock Only
              </span>
            </div>
          </div>

          <!-- Empty state when zero crops match filters -->
          <div 
            v-if="sortedProducts.length === 0" 
            class="text-center py-20 bg-[#091118]/40 border border-dashed border-[#14242d] rounded-2xl space-y-4"
          >
            <div class="text-slate-600 text-3xl font-mono">🔍</div>
            <h3 class="text-sm font-mono font-bold text-slate-300 uppercase">AUCUN LOT DE GROS NE CORRESPOND</h3>
            <p class="text-xs text-slate-500 max-w-sm mx-auto">
              Please adjust your search keyword, lower the price threshold filter, or expand your Cameroon Local Hub coverage area.
            </p>
            <button 
              @click="resetFilters"
              class="px-5 py-2 bg-slate-900 hover:bg-emerald-950 text-xs font-mono font-bold uppercase rounded-lg border border-slate-800 hover:border-emerald-900 transition"
            >
              Clear Search Criteria
            </button>
          </div>

          <!-- PRODUCTS GRID DECK -->
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <div 
              v-for="prod in paginatedProducts" 
              :key="prod.id"
              class="bg-[#091016] border border-[#13252f] rounded-2xl overflow-hidden hover:scale-101 hover:border-emerald-900/60 transition-all duration-300 relative group flex flex-col justify-between"
              :id="'product_card_' + prod.id"
            >
              
              <!-- Card Badge Overlay (Top indicators) -->
              <div class="absolute top-3 left-3 z-10 flex flex-col space-y-1">
                <span class="bg-slate-950/90 backdrop-blur-md text-[9px] font-mono px-2 py-0.5 rounded-full border border-slate-800 text-slate-302 font-bold uppercase">
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
                  @click="cartStore.toggleCompare(prod)"
                  class="h-7 w-7 rounded-lg bg-slate-950/80 backdrop-blur border text-slate-400 hover:text-emerald-400 flex items-center justify-center transition"
                  :class="cartStore.isInCompare(prod.id) ? 'border-emerald-500 text-emerald-400 font-bold' : 'border-slate-800'"
                  :title="cartStore.isInCompare(prod.id) ? 'Remove comparison' : 'Add to Comparison Matrix'"
                >
                  ⚖️
                </button>
                <button 
                  @click="cartStore.toggleWishlist(prod)"
                  class="h-7 w-7 rounded-lg bg-slate-950/80 backdrop-blur border text-slate-450 hover:text-rose-400 flex items-center justify-center transition"
                  :class="cartStore.isInWishlist(prod.id) ? 'border-rose-500 text-rose-500 bg-rose-950/20' : 'border-slate-800'"
                  :title="cartStore.isInWishlist(prod.id) ? 'Saved' : 'Save to Wishlist'"
                >
                  {{ cartStore.isInWishlist(prod.id) ? '♥' : '♡' }}
                </button>
              </div>

              <!-- Product Image Frame -->
              <div class="relative h-44 overflow-hidden bg-slate-900 border-b border-[#12232a]/60">
                <img 
                  :src="prod.image" 
                  class="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 filter brightness-[0.9]" 
                />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                
                <!-- Dynamic Category Tag -->
                <span class="absolute bottom-3 left-3 bg-[#0d2126] text-emerald-400 text-[9px] font-mono uppercase px-2 py-0.5 rounded font-extrabold border border-emerald-900/60">
                  {{ getCategorySector(prod.categoryId) }}
                </span>
              </div>

              <!-- Details Area -->
              <div class="p-4.5 space-y-3 flex-1 flex flex-col justify-between">
                
                <div>
                  <!-- Location tracker -->
                  <div class="text-[9px] font-mono text-cyan-455 uppercase tracking-wider flex items-center space-x-1">
                    <span class="h-1.5 w-1.5 rounded-full bg-cyan-405"></span>
                    <span>Bassin {{ getCameroonRegion(prod.id) }}</span>
                  </div>

                  <!-- Product Name -->
                  <h3 class="text-[13px] font-sans font-bold text-slate-102 leading-tight uppercase tracking-tight mt-1 group-hover:text-emerald-400 transition">
                    {{ prod.name }}
                  </h3>

                  <!-- Cooperative Supp/Brand -->
                  <p class="text-[10px] text-slate-500 font-mono mt-1.5">
                    Coop: <span class="font-bold text-slate-350">{{ getSupplierName(prod.supplierId) }}</span>
                  </p>
                </div>

                <!-- Price and availability section -->
                <div class="pt-3 border-t border-[#0e2129] flex items-end justify-between">
                  <div>
                    <span class="text-[9px] uppercase font-mono text-slate-500 block">B2B Base Lot cost</span>
                    <span class="text-emerald-404 font-extrabold text-[15px] font-mono">
                      {{ formatCFA(prod.price) }}
                    </span>
                    <span class="text-slate-500 font-mono text-[10px] lowercase"> / {{ prod.unit }}</span>
                  </div>

                  <div class="text-right">
                    <span class="text-[9px] uppercase font-mono text-slate-500 block">Escrow Stock</span>
                    <span 
                      class="text-xs font-mono font-bold"
                      :class="prod.status === 'out_of_stock' || prod.stock <= 0 ? 'text-red-500' : 'text-slate-300'"
                    >
                      {{ prod.status === 'out_of_stock' || prod.stock <= 0 ? 'RUPTURE' : `${prod.stock} ${prod.unit}s` }}
                    </span>
                  </div>
                </div>

                <!-- Quick Actions Tray -->
                <div class="grid grid-cols-2 gap-2 pt-3 border-t border-[#0e2129]">
                  <button 
                    @click="openQuickView(prod)"
                    class="py-2 bg-[#091116] border border-slate-900 hover:bg-[#122329] hover:border-[#1e3447] text-slate-300 hover:text-emerald-300 text-[10px] font-mono uppercase tracking-wider rounded-lg transition"
                  >
                    Quick View
                  </button>
                  
                  <button 
                    @click="addPromoWithQuantity(prod, 1)"
                    :disabled="prod.status === 'out_of_stock' || prod.stock <= 0"
                    class="py-2 rounded-lg text-[10px] font-mono uppercase font-bold transition flex items-center justify-center space-x-1 border"
                    :class="prod.status === 'out_of_stock' || prod.stock <= 0 
                      ? 'bg-slate-950 border-slate-900 text-slate-650 cursor-not-allowed' 
                      : 'bg-emerald-950 border-emerald-900 hover:bg-emerald-400 hover:text-slate-950 text-emerald-400 hover:border-transparent'"
                  >
                    🛒 <span>Add To Cart</span>
                  </button>
                </div>

              </div>

            </div>
          </div>

          <!-- DYNAMIC PAGINATION CONTROLLER (Pagination réelle) -->
          <div 
            v-if="totalPages > 1" 
            class="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-[#091117] border border-slate-900 rounded-2xl text-xs font-mono"
          >
            <!-- Rows per page helper -->
            <div class="text-slate-500 order-2 sm:order-1">
              Page <span class="text-slate-200 font-bold">{{ currentPage }}</span> of {{ totalPages }} 
              ({{ sortedProducts.length }} total matched lots)
            </div>

            <!-- Page Buttons -->
            <div class="flex items-center space-x-1.5 order-1 sm:order-2">
              <button 
                @click="goToPage(1)"
                :disabled="currentPage === 1"
                class="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-900 hover:border-emerald-950 text-slate-400 disabled:opacity-40 transition uppercase text-[9px] font-bold"
              >
                &laquo; First
              </button>
              
              <button 
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-900 hover:border-emerald-950 text-slate-400 disabled:opacity-40 transition uppercase text-[9px] font-bold"
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
                  ? 'bg-emerald-550 border border-emerald-500 text-white font-extrabold' 
                  : 'bg-slate-950 border border-slate-900 hover:bg-[#0c1f26] text-slate-400 hover:text-emerald-400'"
              >
                {{ p }}
              </button>

              <button 
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-900 hover:border-emerald-950 text-slate-400 disabled:opacity-40 transition uppercase text-[9px] font-bold"
              >
                Next &rarr;
              </button>

              <button 
                @click="goToPage(totalPages)"
                :disabled="currentPage === totalPages"
                class="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-900 hover:border-emerald-950 text-slate-400 disabled:opacity-40 transition uppercase text-[9px] font-bold"
              >
                Last &raquo;
              </button>
            </div>
          </div>

        </main>

      </div>
    </section>

    <!-- QUICK VIEW MODAL COMPONENT (Quick view modal, produits similaires, specs, etc) -->
    <div 
      v-if="modalProduct" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm select-none"
    >
      <!-- Modal wrapper (animations fluides) -->
      <div 
        class="bg-[#080f14] border-2 border-emerald-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 space-y-6 relative text-xs"
        @click.stop
      >
        <!-- Absolute Close button -->
        <button 
          @click="closeQuickView"
          class="absolute top-4 right-4 h-8 w-8 rounded-full bg-slate-950 text-slate-400 hover:text-emerald-450 hover:bg-emerald-950/40 border border-slate-800 flex items-center justify-center text-lg font-bold select-none"
        >
          &times;
        </button>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          
          <!-- Column 1: Image Frame + Badges -->
          <div class="space-y-4">
            <div class="relative h-64 rounded-xl overflow-hidden border border-[#162a33] bg-slate-950/40">
              <img :src="modalProduct.image" class="w-full h-full object-cover" />
              <div class="absolute bottom-3 left-3 bg-[#0d2126] text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-900/60 font-bold uppercase">
                IGP Cameroun Certified
              </div>
            </div>

            <!-- Basic details -->
            <div class="p-3.5 bg-slate-950 rounded-xl border border-slate-900 space-y-1.5">
              <div class="flex justify-between">
                <span class="text-slate-500 uppercase font-mono text-[9px]">Sovereign SKU:</span>
                <span class="font-mono text-slate-300 font-bold uppercase">{{ modalProduct.sku }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500 uppercase font-mono text-[9px]">Local Hub Region:</span>
                <span class="text-cyan-405 font-medium">Bassin d'Axe {{ getCameroonRegion(modalProduct.id) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500 uppercase font-mono text-[9px]">Warehousing Control:</span>
                <span class="text-emerald-450 font-bold">FIFO Scrow Active</span>
              </div>
            </div>
          </div>

          <!-- Column 2: Specs & Buy Form -->
          <div class="flex flex-col justify-between space-y-4">
            
            <div class="space-y-3">
              <span class="bg-[#0e2126] text-emerald-400 text-[9px] font-mono uppercase px-2.5 py-1 rounded font-bold border border-emerald-900/60 inline-block">
                {{ getCategorySector(modalProduct.categoryId) }}
              </span>
              
              <h2 class="text-lg font-bold text-white uppercase tracking-tight font-sans leading-tight">
                {{ modalProduct.name }}
              </h2>

              <p class="text-slate-400 text-[11px] leading-relaxed">
                {{ modalProduct.description }}
              </p>

              <div class="py-2.5 border-t border-b border-slate-900 flex justify-between items-center bg-[#05070a] px-3 rounded-lg">
                <div>
                  <span class="text-[9px] text-slate-500 block uppercase font-mono">B2B Wholesales tariff</span>
                  <p class="text-[17px] font-extrabold text-emerald-400 font-mono">
                    {{ formatCFA(modalProduct.price) }}
                    <span class="text-slate-500 font-sans text-xs font-normal"> / {{ modalProduct.unit }}</span>
                  </p>
                </div>

                <div class="text-right">
                  <span class="text-[9px] text-slate-500 block uppercase font-mono">Volume available</span>
                  <span class="text-xs text-white font-mono font-bold">
                    {{ modalProduct.stock }} {{ modalProduct.unit }}s
                  </span>
                </div>
              </div>

              <!-- Supplier Cooperative -->
              <div class="p-3 bg-slate-950 rounded-xl border border-slate-900">
                <span class="text-[8.5px] uppercase font-mono tracking-wider text-slate-500 block">Verified Logistics Supplier:</span>
                <span class="text-[11px] font-sans font-bold text-slate-200 mt-1 block">{{ getSupplierName(modalProduct.supplierId) }}</span>
                <p class="text-[10px] text-slate-500 mt-0.5 font-mono">Douala Port Clearing Priority Level 2 &bull; Instant Wire Guarantee</p>
              </div>
            </div>

            <!-- Interaction triggers and Quantity Selector -->
            <div class="space-y-2.5 pt-2">
              <div class="flex items-center space-x-3.5">
                <span class="text-slate-500 uppercase font-mono text-[9px]">Select Lot Qty:</span>
                
                <!-- Quantity modifier -->
                <div class="flex items-center space-x-1 font-mono bg-slate-950 p-1 border border-slate-900 rounded-lg">
                  <button 
                    @click="adjustModalQty(-1)"
                    class="h-6 w-6 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-xs"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    v-model.number="modalQty" 
                    class="w-14 bg-transparent border-none text-center text-xs text-emerald-400 font-bold focus:ring-0"
                    min="1"
                    :max="modalProduct.stock"
                  />
                  <button 
                    @click="adjustModalQty(1)"
                    class="h-6 w-6 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-xs"
                  >
                    +
                  </button>
                </div>

                <span class="text-[10px] text-slate-500 font-sans">
                  Total cost: <span class="text-emerald-450 font-bold">{{ formatCFA(modalProduct.price * modalQty) }}</span>
                </span>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <button 
                  @click="addModalToCompare"
                  class="py-2.5 rounded-xl border border-[#162730] hover:bg-slate-900 font-mono text-[9.5px] uppercase font-bold text-slate-300 transition"
                >
                  ⚖️ {{ cartStore.isInCompare(modalProduct.id) ? 'Compare Active' : 'Add to Compare' }}
                </button>
                
                <button 
                  @click="cartStore.toggleWishlist(modalProduct)"
                  class="py-2.5 rounded-xl border border-[#162730] hover:bg-slate-900 font-mono text-[9.5px] uppercase font-bold text-slate-350 transition"
                  :class="cartStore.isInWishlist(modalProduct.id) ? 'border-rose-900 bg-rose-950/20 text-rose-400' : ''"
                >
                  ♥ {{ cartStore.isInWishlist(modalProduct.id) ? 'Wishlist Saved' : 'Save to Board' }}
                </button>
              </div>

              <button 
                @click="addModalProductToCart"
                class="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-450 hover:to-teal-555 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition"
              >
                🛒 Add {{ modalQty }} {{ modalProduct.unit }}s to Cart
              </button>
            </div>

          </div>
        </div>

        <!-- SIMILAR PRODUCTS SECTION (Produits similaires obligatoires) -->
        <div class="pt-6 border-t border-slate-900 space-y-3.5">
          <h3 class="text-[11px] font-mono uppercase tracking-wider text-emerald-450 font-extrabold flex items-center space-x-1.5">
            <span>🌾 PRODUITS SIMILAIRES & RECOMMANDATIONS COOP</span>
            <span class="text-[8px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-400 font-normal">SAME REGION OR SECTOR</span>
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div 
              v-for="sim in similarProducts" 
              :key="sim.id"
              class="bg-slate-950 p-3 rounded-xl border border-slate-900 hover:border-emerald-950 flex flex-col justify-between group cursor-pointer"
              @click="switchModalProduct(sim)"
            >
              <div class="flex items-start space-x-3">
                <img :src="sim.image" class="h-10 w-10 object-cover rounded border border-slate-805 shrink-0" />
                <div class="truncate">
                  <h4 class="text-[11px] font-bold text-slate-205 leading-normal truncate group-hover:text-emerald-400 transition">{{ sim.name }}</h4>
                  <p class="text-[10px] font-mono text-emerald-450 mt-0.5">{{ formatCFA(sim.price) }} / {{ sim.unit }}</p>
                </div>
              </div>
              <div class="mt-2 text-right">
                <span class="text-[8.5px] font-mono text-slate-600">Stock: {{ sim.stock }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- MAIN PLATFORM FOOTER -->
    <footer class="bg-slate-950 border-t border-[#0d161d] py-12 px-6 md:px-12 text-slate-400 text-xs mt-12 pb-48 md:pb-40">
      <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div class="space-y-3">
          <div class="flex items-center space-x-2">
            <div class="h-6 w-6 bg-emerald-500 rounded flex items-center justify-center text-slate-950 text-xs font-bold font-mono">K</div>
            <span class="font-mono text-sm font-bold text-white uppercase tracking-wider">KONG S.A.</span>
          </div>
          <p class="text-[11px] text-slate-500 leading-relaxed">
            Sovereign wholesale platform enabling unified logistics clearances, decentralized cooperative listings, and real-time bank wire guarantees for sub-Saharan agricultural trade networks.
          </p>
        </div>

        <div class="space-y-2">
          <h4 class="text-white font-mono text-xs uppercase tracking-wider font-bold">Terroirs du Cameroun</h4>
          <ul class="space-y-1.5 text-[11px] text-slate-500 font-mono">
            <li>&bull; Moungo (Penja White Pepper)</li>
            <li>&bull; Sangmélima (Premium Raw Cocoa Fèves)</li>
            <li>&bull; Garoua & Yagoua (Maize, Onions, Paddy Rice)</li>
            <li>&bull; Mbouda & Foumbot (Tropic Fruits)</li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-white font-mono text-xs uppercase tracking-wider font-bold">Secure Gateways</h4>
          <ul class="space-y-1.5 text-[11px] text-slate-500 font-mono">
            <li>&bull; Afriland Sawa B2B API</li>
            <li>&bull; Mobile Money (Orange Money, MTN MoMo)</li>
            <li>&bull; Express Union Flash Vouchers</li>
            <li>&bull; Kribi sovereign port escrow clearance</li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-white font-mono text-xs uppercase tracking-wider font-bold">Certification Compliance</h4>
          <p class="text-[11px] text-slate-505 leading-relaxed font-mono">
            All registered cooperatives obey CEMAC regional health checks and standard phytosanitary passport rules. Verified by Kribi Custom Authorities.
          </p>
        </div>

      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useProductsStore } from '@/store/modules/products.js';
import { useCartStore } from '@/store/modules/cart.js';
import { useAuthStore } from '@/store/modules/auth.js';
import { useToast } from 'vue-toastification';
import { categories, suppliers } from '@/utils/seed_data.js';

// Import components
import PublicHeader from '@/components/PublicHeader.vue';

// Setup routing & stores
const route = useRoute();
const productsStore = useProductsStore();
const cartStore = useCartStore();
const authStore = useAuthStore();
const toast = useToast();

// ----------------------------------------------------
// HERO MOOD SLIDE BANNER IMAGES & ACCENTS
// ----------------------------------------------------
const activeSlide = ref(0);
const heroSlides = [
  {
    badge: "IGP Moungo Terroir - Cameroun",
    title: "Le Célèbre Poivre de Penja",
    description: "Recherché et labellisé à l'échelle internationale. Issu des sols volcaniques fertiles du Moungo. Idéal pour distributeurs, charcutiers et chaînes gastronomiques d'Afrique Centrale.",
    image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=1200",
    accent: "11,500 CFA / kg",
  },
  {
    badge: "Coopérative Exportation Sangmélima",
    title: "Or Noir Brut - Fèves de Cacao AOC",
    description: "Séchage direct sous le soleil équatorial du Sud-Cameroun. Sélections de fèves de calibre supérieur, haut de gamme, idéales pour les maîtres chocolatiers mondiaux.",
    image: "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&q=80&w=1200",
    accent: "3,250 CFA / kg",
  },
  {
    badge: "Hauts Plateaux de l'Ouest",
    title: "Café Arabica Pur de Foumbot",
    description: "Cultivé en altitude élevée sur les collines fertiles de l'Ouest. Grains de café avec arômes denses, idéal pour la torréfaction artisanale haut de gamme.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=1200",
    accent: "4,600 CFA / kg",
  }
];

// Carousel auto slider interval timer
let carouselInterval = null;
onMounted(() => {
  if (route.query.filterSector) {
    // Try to find matching sector name
    const querySec = route.query.filterSector;
    const foundCat = categories.find(c => c.name === querySec);
    const sectorToFilter = foundCat ? foundCat.sector : querySec;
    filters.sector = sectorToFilter;
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

// Filters model
const filters = reactive({
  keyword: '',
  sector: '',
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
  return filters.keyword !== '' || filters.sector !== '' || filters.city !== '' || filters.maxPrice < maxProductPrice.value || filters.stockOnly === true;
});

function resetFilters() {
  filters.keyword = '';
  filters.sector = '';
  filters.city = '';
  filters.maxPrice = maxProductPrice.value;
  filters.stockOnly = false;
  filters.sortBy = 'created_desc';
  currentPage.value = 1;
  toast.info('All marketplace filters successfully cleared.');
}

function selectSector(secName) {
  filters.sector = secName;
  currentPage.value = 1;
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

    // Sector match
    if (filters.sector) {
      const pSector = getCategorySector(p.categoryId);
      if (pSector.toLowerCase() !== filters.sector.toLowerCase()) return false;
    }

    // City match
    if (filters.city) {
      const pRegion = getCameroonRegion(p.id);
      if (pRegion.toLowerCase() !== filters.city.toLowerCase()) return false;
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

function openQuickView(product) {
  modalProduct.value = product;
  modalQty.value = 1;
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
    .slice(0, 3);
});

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
</style>
