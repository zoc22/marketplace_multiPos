<template>
  <div class="sticky top-0 z-50 select-none">
    
    <!-- DYNAMIC HIGHLIGHT TICKER (Afrique & Cameroon Wholesale Opportunities) -->
    <div class="bg-gradient-to-r from-emerald-950 via-teal-950 to-emerald-900 border-b border-emerald-800 text-emerald-300 py-1.5 px-4 overflow-hidden relative text-[10.5px] font-mono flex items-center shrink-0">
      <div class="flex items-center space-x-2 shrink-0 bg-emerald-900 px-2 py-0.5 rounded text-[9px] uppercase font-bold text-white z-10 animate-pulse tracking-wider">
        <span>PROMO FLASH</span>
      </div>
      
      <!-- Defiling Text -->
      <div class="flex-1 whitespace-nowrap overflow-hidden relative ml-3">
        <div class="inline-block animate-marquee uppercase tracking-wide">
          ⚡ [DOUALA PORT SPECIAL] Poivre Blanc de Penja -15% sur les commandes groupées &bull; 🌽 [COOP-NORD] Stock exceptionnel d'Oignons et Maïs Blanc séché à Garoua &bull; 🪵 [LUMBER YARD] Expédition de bois certifié vers l'Afrique Centrale &bull; 🔋 [SOLAR ECO] Batteries Gel MTN/Orange Connectivité Pro dispo à Yaoundé &bull; 🍫 [AGRO-EXPORT] Prix bord champ du Cacao camerounais stable à 3,200 CFA/kg.
        </div>
      </div>

      <!-- Quick Session Indicator -->
      <div class="hidden sm:flex items-center space-x-1.5 text-slate-400 text-[10px] shrink-0 ml-4 font-sans">
        <span class="inline-block h-2 w-2 rounded-full bg-accent-green"></span>
        <span class="font-mono text-[9px] text-accent-green">DEV SIMULATOR ACTIVE</span>
      </div>
    </div>

    <!-- MAIN NAVBAR CONTAINER -->
    <header class="bg-slate-950/95 backdrop-blur-md border-b border-[#0e181e] px-4 md:px-8 py-3.5 flex items-center justify-between">
      
      <!-- LOGO BRANDING -->
      <router-link to="/" class="flex items-center space-x-2.5 shrink-0 group">
        <div class="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-950/40 border border-accent-green/20 group-hover:scale-105 transition-transform duration-300">
          <svg class="h-5 w-5 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <div class="flex flex-col">
          <span class="font-mono text-xs font-bold text-accent-green tracking-widest leading-none uppercase">KONG S.A.</span>
          <span class="font-sans text-[10px] font-medium text-slate-405 uppercase tracking-wider mt-0.5">B2B Cameroon Hub</span>
        </div>
      </router-link>

      <!-- NAVIGATION CENTRAL -->
      <nav class="hidden lg:flex items-center space-x-6 text-xs font-mono">
        <router-link 
          to="/products" 
          class="transition text-slate-300 hover:text-accent-green px-2 py-1 rounded"
          :class="isRouteActive('/products') ? 'text-accent-green font-bold bg-[#0d2226]' : ''"
        >
          Browse Products
        </router-link>
        
        <router-link 
          to="/suppliers" 
          class="transition text-slate-300 hover:text-accent-green px-2 py-1 rounded"
          :class="isRouteActive('/suppliers') ? 'text-accent-green font-bold bg-[#0d2226]' : ''"
        >
          Wholesale Suppliers
        </router-link>

        <router-link 
          to="/categories" 
          class="transition text-slate-300 hover:text-accent-green px-2 py-1 rounded"
          :class="isRouteActive('/categories') ? 'text-accent-green font-bold bg-[#0d2226]' : ''"
        >
          Categories Matrix
        </router-link>

        <router-link 
          to="/about" 
          class="transition text-slate-400 hover:text-accent-green px-2 py-1 rounded"
          :class="isRouteActive('/about') ? 'text-accent-green font-bold bg-[#0d2226]' : ''"
        >
          Kribi Port Hub Info
        </router-link>
      </nav>

      <!-- UTILITIES RIGHT -->
      <div class="flex items-center space-x-3 text-xs">
        
        <!-- COMPARE LIST SHORTCUT BUTTON -->
        <button 
          @click="isCompareOpen = !isCompareOpen"
          class="p-2 rounded-xl bg-[#091114] border border-emerald-950/40 text-slate-400 hover:text-accent-green transition relative flex items-center"
          title="Product Comparison Matrix"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
          </svg>
          <span v-if="cartStore.compareList.length > 0" class="absolute -top-1 -right-1 bg-teal-500 text-slate-950 text-[9px] font-bold font-mono h-4 w-4 rounded-full flex items-center justify-center animate-bounce">
            {{ cartStore.compareList.length }}
          </span>
        </button>

        <!-- WISHLIST INTERACTIVE BUTTON -->
        <div class="relative">
          <button 
            @click="isWishlistOpen = !isWishlistOpen; isCompareOpen = false"
            class="p-2 rounded-xl bg-[#091114] border border-emerald-950/40 text-slate-400 hover:text-rose-450 transition relative flex items-center"
            title="My Saved Wishlist"
          >
            <svg class="h-4 w-4 text-slate-400 hover:text-rose-400" :class="cartStore.wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span v-if="cartStore.wishlist.length > 0" class="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold font-mono h-4 w-4 rounded-full flex items-center justify-center">
              {{ cartStore.wishlist.length }}
            </span>
          </button>
          
          <!-- Quick dropdown wishlist -->
          <div v-show="isWishlistOpen" class="origin-top-right absolute right-0 mt-3 w-80 rounded-xl shadow-2xl bg-slate-900 border border-[#162730] p-4 z-50 overflow-hidden text-slate-100">
            <div class="flex justify-between items-center mb-3">
              <span class="text-[11px] font-mono tracking-wider text-rose-400 uppercase font-bold">♥ MY WISHLIST ({{ cartStore.wishlist.length }})</span>
              <button @click="isWishlistOpen = false" class="text-slate-500 hover:text-white font-bold text-[10px] font-mono">[ CLOSE ]</button>
            </div>
            
            <div class="max-h-60 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
              <p v-if="cartStore.wishlist.length === 0" class="text-center py-6 text-slate-550 text-[11px] font-mono">
                Wishlist is empty. Click ♥ on products to bookmark.
              </p>
              
              <div 
                v-for="prod in cartStore.wishlist" 
                :key="prod.id"
                class="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-900 hover:border-emerald-950/50 transition group"
              >
                <div class="flex items-center space-x-3.5 truncate">
                  <img :src="prod.image" class="h-8 w-8 rounded object-cover" />
                  <div class="truncate">
                    <p class="text-[11px] font-semibold text-slate-200 truncate leading-tight">{{ prod.name }}</p>
                    <p class="text-[10px] font-mono text-accent-green mt-0.5">{{ formatCFA(prod.price) }} / {{ prod.unit }}</p>
                  </div>
                </div>

                <div class="flex items-center space-x-1.5 shrink-0">
                  <button 
                    @click="addPromoToCart(prod)"
                    class="p-1 px-2.5 bg-emerald-950/60 text-accent-green hover:bg-accent-green hover:text-slate-950 rounded text-[9px] font-mono font-bold uppercase transition"
                    title="Move to Cart"
                  >
                    Add
                  </button>
                  <button 
                    @click="cartStore.toggleWishlist(prod)"
                    class="text-red-500 hover:text-red-400 p-1 text-base font-normal leading-none"
                    title="Remove item"
                  >
                    &times;
                  </button>
                </div>
              </div>
            </div>
            
            <router-link 
              to="/products"
              class="block w-full text-center bg-slate-950 text-slate-300 hover:bg-slate-800 rounded-lg py-1.5 font-mono text-[10px] uppercase font-bold mt-4 border border-slate-800 transition"
              @click="isWishlistOpen = false"
            >
              Browse Category Seeds
            </router-link>
          </div>
        </div>

        <!-- MULTI SUPPLIER SHOPPING CART CONTROLLER -->
        <div class="relative">
          <router-link 
            to="/cart"
            class="p-2 px-3 rounded-xl bg-emerald-950/30 hover:bg-emerald-950/60 text-accent-green border border-emerald-900/40 hover:border-emerald-650 transition relative flex items-center space-x-2 font-mono"
            title="Multi-Seller Basket"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span class="text-[11px] font-bold hidden sm:inline">{{ formatCFA(cartStore.totalAmount) }}</span>
            <span class="bg-accent-green text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full font-mono shrink-0">
              {{ cartStore.totalItems }}
            </span>
          </router-link>
        </div>

        <!-- AUTHENTICATION LINKS (NOT LOGGED IN) -->
        <div v-if="!authStore.user" class="flex items-center space-x-2 mr-2">
          <!-- Desktop text links -->
          <div class="hidden sm:flex items-center space-x-2">
            <router-link 
              to="/auth/login"
              class="text-text-sec dark:text-slate-300 hover:text-accent-green dark:hover:text-accent-green font-bold uppercase tracking-wider transition px-2 py-1"
            >
              Connexion
            </router-link>
            <span class="text-slate-300 dark:text-slate-700">|</span>
            <router-link 
              to="/auth/register"
              class="text-text-sec dark:text-slate-300 hover:text-accent-green dark:hover:text-accent-green font-bold uppercase tracking-wider transition px-2 py-1"
            >
              Inscription
            </router-link>
          </div>
          
          <!-- Profile Icon for Guest Mobile/Quick Menu -->
          <div class="relative">
            <button 
              @click="isUserMenuOpen = !isUserMenuOpen"
              class="p-2 rounded-xl bg-light-bg-sec dark:bg-[#091114] border border-slate-200 dark:border-slate-800 hover:border-accent-green/40 text-text-sec dark:text-slate-400 hover:text-accent-green transition flex items-center justify-center"
              title="Mon Compte"
            >
              <UserIcon class="h-4 w-4" />
            </button>
            
            <div 
              v-if="isUserMenuOpen" 
              class="absolute right-0 mt-2.5 w-48 bg-light-bg-main dark:bg-[#0c161d] border border-divider dark:border-[#1a313d] rounded-2xl shadow-xl py-2 z-50 animate-fade-in-up"
            >
              <router-link to="/auth/login" class="block px-4 py-2.5 text-xs text-text-sec dark:text-slate-300 hover:bg-light-bg-sec dark:hover:bg-[#12242d] transition uppercase font-bold" @click="isUserMenuOpen = false">Se Connecter</router-link>
              <router-link to="/auth/register" class="block px-4 py-2.5 text-xs text-text-sec dark:text-slate-300 hover:bg-light-bg-sec dark:hover:bg-[#12242d] transition uppercase font-bold border-t border-divider dark:border-slate-800" @click="isUserMenuOpen = false">Créer un Compte</router-link>
            </div>
          </div>
        </div>

        <!-- AUTHENTICATION LINKS (LOGGED IN) -->
        <div v-else class="relative flex items-center space-x-2 mr-2">
          <!-- Profile Dropdown Button -->
          <button 
            @click="isUserMenuOpen = !isUserMenuOpen"
            class="flex items-center space-x-2.5 p-1.5 pr-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-accent-green dark:text-accent-green hover:border-accent-green transition relative"
            title="Mon Profil"
          >
            <div class="h-7 w-7 rounded-lg bg-accent-green text-text-main dark:text-slate-900 font-black flex items-center justify-center text-xs uppercase shadow-sm">
              {{ authStore.user.name?.slice(0, 2) || 'US' }}
            </div>
            <div class="text-left hidden md:block">
              <div class="text-[10px] font-black uppercase leading-none truncate max-w-[100px] text-text-main dark:text-white">{{ authStore.user.name }}</div>
              <div class="text-[8px] font-mono text-slate-500 dark:text-slate-400 uppercase mt-0.5 tracking-wider">{{ authStore.user.roles[0] }}</div>
            </div>
            <svg class="h-3 w-3 text-slate-400 transition-transform duration-200" :class="isUserMenuOpen ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Dropdown Card -->
          <div 
            v-if="isUserMenuOpen" 
            class="absolute right-0 top-full mt-2 w-64 bg-light-bg-main dark:bg-[#0c161d] border border-divider dark:border-[#1a313d] rounded-2xl shadow-2xl py-3 z-50 font-sans"
          >
            <div class="px-4 pb-2.5 border-b border-divider dark:border-slate-800">
              <div class="text-xs font-bold text-text-main dark:text-white uppercase truncate">{{ authStore.user.name }}</div>
              <div class="text-[10px] text-slate-500 font-mono mt-0.5 truncate">{{ authStore.user.email }}</div>
              <span class="inline-block mt-2 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-[8.5px] font-bold text-accent-green dark:text-accent-green rounded-full uppercase tracking-wider border border-emerald-250 dark:border-emerald-900/30">
                {{ authStore.user.roles.join(', ') }}
              </span>
            </div>
            
            <div class="py-1">
              <router-link 
                :to="getDashboardLink(authStore.user)" 
                class="flex items-center space-x-2.5 px-4 py-2.5 text-[11px] text-text-sec dark:text-slate-300 hover:bg-light-bg-sec dark:hover:bg-[#12242d] transition uppercase font-bold"
                @click="isUserMenuOpen = false"
              >
                <svg class="h-4 w-4 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                </svg>
                <span>Accéder au Bureau</span>
              </router-link>
            </div>
            
            <div class="border-t border-divider dark:border-slate-800 pt-1">
              <button 
                @click="handleLogout"
                class="w-full flex items-center space-x-2.5 px-4 py-2.5 text-[11px] text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition uppercase font-bold text-left"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>

        <!-- DEEP-LINK WORKSPACE ACCORDIAN PORTER -->
        <div class="relative">
          <button 
            @click="isPortalMenuOpen = !isPortalMenuOpen; isWishlistOpen = false; isCompareOpen = false"
            class="px-3 py-1.5 bg-gradient-to-r from-[#0d1c22] to-[#122b33] text-accent-green hover:text-white rounded-xl border border-emerald-900/50 hover:border-emerald-650 font-mono text-[10.5px] uppercase font-bold tracking-wider flex items-center space-x-1 transition duration-150 relative"
          >
            <span class="inline-block h-1.5 w-1.5 rounded-full bg-accent-green animate-pulse mr-1"></span>
            <span>Gateways</span>
            <span class="text-[8px] opacity-70 transition-transform duration-200" :class="isPortalMenuOpen ? 'rotate-180': ''">&darr;</span>
          </button>
          
          <div v-show="isPortalMenuOpen" class="origin-top-right absolute right-0 mt-3 w-64 rounded-xl shadow-2xl bg-slate-900 border border-[#14232c] p-3.5 z-50 text-slate-100">
            <h4 class="text-[9.5px] font-mono uppercase tracking-wider text-slate-500 mb-2 font-bold px-1.5">SECURE WHOLESALE PORTALS</h4>
            
            <div class="space-y-1.5">
              <router-link 
                to="/buyer/dashboard" 
                class="flex items-center space-x-2.5 p-2 rounded-lg bg-slate-950 hover:bg-[#0c2226] hover:text-emerald-405 border border-slate-900/60 hover:border-emerald-950 transition text-left"
                @click="isPortalMenuOpen = false"
              >
                <span class="text-accent-green font-mono text-xs font-bold shrink-0">🛒</span>
                <div>
                  <div class="text-[11px] font-mono uppercase font-bold leading-tight">Buyer Desk</div>
                  <div class="text-[9px] text-slate-500 font-mono">Quotes, Loyalty, Order History</div>
                </div>
              </router-link>

              <router-link 
                to="/supplier/dashboard" 
                class="flex items-center space-x-2.5 p-2 rounded-lg bg-slate-950 hover:bg-indigo-950/20 hover:text-indigo-400 border border-slate-900/60 hover:border-indigo-905 transition text-left"
                @click="isPortalMenuOpen = false"
              >
                <span class="text-indigo-400 font-mono text-xs font-bold shrink-0">🏭</span>
                <div>
                  <div class="text-[11px] font-mono uppercase font-bold leading-tight">Supplier Station</div>
                  <div class="text-[9px] text-slate-500 font-mono">Crop Inventory, Warehousing, RFQs</div>
                </div>
              </router-link>

              <router-link 
                to="/pos" 
                class="flex items-center space-x-2.5 p-2 rounded-lg bg-slate-950 hover:bg-emerald-950/20 hover:text-emerald-350 border border-slate-900/60 hover:border-emerald-850 transition text-left"
                @click="isPortalMenuOpen = false"
              >
                <span class="text-accent-green font-mono text-sm font-bold shrink-0">&Xi;</span>
                <div>
                  <div class="text-[11px] font-mono uppercase font-bold leading-tight">Retail POS</div>
                  <div class="text-[9px] text-slate-500 font-mono">Cashier Grid, Ticket invoices</div>
                </div>
              </router-link>

              <router-link 
                to="/admin/dashboard" 
                class="flex items-center space-x-2.5 p-2 rounded-lg bg-slate-950 hover:bg-amber-950/20 hover:text-button-orange border border-slate-900/60 hover:border-amber-900 transition text-left"
                @click="isPortalMenuOpen = false"
              >
                <span class="text-button-orange font-mono text-xs font-bold shrink-0">🔑</span>
                <div>
                  <div class="text-[11px] font-mono uppercase font-bold leading-tight">Platform Central</div>
                  <div class="text-[9px] text-slate-500 font-mono">Escrow balances, Audits & Analytics</div>
                </div>
              </router-link>
            </div>
            
            <div class="mt-3 pt-2.5 border-t border-slate-800 text-[9px] text-slate-500 font-mono flex justify-between items-center px-1">
              <span>ACTIVE USER ROLE:</span>
              <span class="text-accent-green font-bold uppercase">{{ authStore.user?.roles?.join(', ') || 'GUEST' }}</span>
            </div>
          </div>
        </div>

      </div>

    </header>

    <!-- LIVE COMPARISON MODAL EXPANSION DRAWER -->
    <div 
      v-show="isCompareOpen" 
      class="bg-[#040e11] border-b-2 border-emerald-900 shadow-2xl p-4 md:p-6 text-slate-250 transition-all duration-300 relative select-none"
    >
      <div class="max-w-6xl mx-auto">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h3 class="text-xs font-mono uppercase tracking-wider text-accent-green font-extrabold flex items-center space-x-1">
              <span>⚖️ SIDE-BY-SIDE WHOLESALE AUDIT COMPARISON</span>
              <span class="text-[9px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded font-normal uppercase tracking-tight ml-2">MAX 3 CROPS</span>
            </h3>
            <p class="text-[10px] text-slate-500 font-sans mt-0.5">Compare exact Cameroon wholesale unit prices, availability matrices, regions, and verified suppliers specs in real time.</p>
          </div>
          <div class="flex space-x-3 text-[10px] font-mono">
            <button @click="cartStore.clearCompare()" class="text-red-500 hover:text-white uppercase font-bold">[ CLEAR ALL ]</button>
            <button @click="isCompareOpen = false" class="text-slate-400 hover:text-white uppercase font-bold">[ CLOSE ]</button>
          </div>
        </div>

        <div v-if="cartStore.compareList.length === 0" class="text-center py-8 text-slate-650 font-mono text-xs">
          (No products selected for comparison. Click "⚖️ Compare" in the catalog to populate)
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
          
          <!-- Metriq Headers -->
          <div class="hidden md:flex flex-col justify-between py-2 border-r border-[#1a3840]/30 pr-4 text-slate-550 mr-2 text-[10px] uppercase">
            <div class="h-14 font-semibold text-white">SELECTED PRODUCTS:</div>
            <div class="py-2.5 border-b border-[#0d2226]">VERIFIED WHOLESALE PRICE</div>
            <div class="py-2.5 border-b border-[#0d2226]">CMR MEASURING UNIT</div>
            <div class="py-2.5 border-b border-[#0d2226]">CURRENT STOCK (FIFO)</div>
            <div class="py-2.5 border-b border-[#0d2226]">CRITICAL B2B SUPPLY SKU</div>
            <div class="py-2.5 border-b border-[#0d2226]">CAMEROON ORIGIN HUB</div>
            <div class="py-2.5">WHOLESALE SUPPLIER BRAND</div>
          </div>

          <!-- Dynamic Columns -->
          <div 
            v-for="prod in cartStore.compareList" 
            :key="prod.id"
            class="bg-slate-950/70 border border-[#162f36] p-3 rounded-lg relative group flex flex-col justify-between"
          >
            <button 
              @click="cartStore.toggleCompare(prod)" 
              class="absolute top-2 right-2 text-red-500 hover:text-white font-bold text-sm bg-slate-950 h-5 w-5 rounded-full flex items-center justify-center opacity-80"
              title="Remove from comparison"
            >
              &times;
            </button>

            <!-- Head -->
            <div class="flex items-start space-x-3.5 pb-3 border-b border-[#12282d] h-14">
              <img :src="prod.image" class="h-10 w-10 object-cover rounded-md border border-emerald-950 shrink-0" />
              <div class="truncate">
                <span class="text-[8.5px] uppercase font-bold text-slate-500 leading-none">ID: {{ prod.sku.split('-').pop() }}</span>
                <h4 class="text-[11.5px] font-bold text-slate-205 leading-tight truncate mt-0.5" :title="prod.name">{{ prod.name }}</h4>
              </div>
            </div>

            <!-- Price -->
            <div class="py-2.5 border-b border-[#0c1e21] flex justify-between md:block">
              <span class="md:hidden text-slate-500 mr-2 text-[9px]">PRICE:</span>
              <span class="text-emerald-405 font-extrabold text-[12px]">{{ formatCFA(prod.price) }}</span>
            </div>

            <!-- Unit -->
            <div class="py-2.5 border-b border-[#0c1e21] flex justify-between md:block">
              <span class="md:hidden text-slate-500 mr-2 text-[9px]">UNIT:</span>
              <span class="text-slate-300 font-bold uppercase">{{ prod.unit }}</span>
            </div>

            <!-- Stock -->
            <div class="py-2.5 border-b border-[#0c1e21] flex justify-between md:block">
              <span class="md:hidden text-slate-500 mr-2 text-[9px]">STOCK:</span>
              <span :class="prod.stock < 150 ? 'text-red-400 font-bold' : 'text-accent-green'">
                {{ prod.stock }} {{ prod.unit }}s available
              </span>
            </div>

            <!-- SKU -->
            <div class="py-2.5 border-b border-[#0c1e21] flex justify-between md:block truncate">
              <span class="md:hidden text-slate-500 mr-2 text-[9px]">SKU CODE:</span>
              <span class="text-slate-450 uppercase text-[10.5px] font-mono pr-2" :title="prod.sku">{{ prod.sku }}</span>
            </div>

            <!-- Cameroon Hub -->
            <div class="py-2.5 border-b border-[#0c1e21] flex justify-between md:block">
              <span class="md:hidden text-slate-500 mr-2 text-[9px]">ORIGIN HUB:</span>
              <span class="text-cyan-405 uppercase font-medium">Bassin d'Axe Douala-Yaoundé</span>
            </div>

            <!-- Supplier -->
            <div class="py-2.5 flex justify-between md:block truncate">
              <span class="md:hidden text-slate-500 mr-2 text-[9px]">SUPPLIER:</span>
              <span class="text-slate-350 text-[10.5px] truncate" :title="getSupplierName(prod.supplierId)">
                {{ getSupplierName(prod.supplierId) }}
              </span>
            </div>

            <!-- CTA -->
            <button 
              @click="addPromoToCart(prod)"
              class="w-full mt-3 bg-emerald-950 hover:bg-accent-green hover:text-slate-950 font-bold text-[10px] py-2 rounded-lg border border-emerald-900 uppercase transition tracking-wider flex justify-center items-center"
            >
              <span>Move to Cart</span>
            </button>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCartStore } from '@/store/modules/cart.js';
import { useAuthStore } from '@/store/modules/auth.js';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { suppliers } from '@/utils/seed_data.js';
import { UserIcon } from '@heroicons/vue/24/outline';

const cartStore = useCartStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const toast = useToast();

const isPortalMenuOpen = ref(false);
const isWishlistOpen = ref(false);
const isCompareOpen = ref(false);
const isUserMenuOpen = ref(false);

function handleLogout() {
  authStore.logout();
  toast.success('Déconnexion réussie.');
  isUserMenuOpen.value = false;
  router.push('/');
}

function getDashboardLink(user) {
  if (!user) return '/';
  if (user.roles.includes('admin')) return '/admin/dashboard';
  if (user.roles.includes('vendor')) return '/vendor/dashboard';
  if (user.roles.includes('distributor')) return '/distributor/dashboard';
  if (user.roles.includes('buyer')) return '/buyer/dashboard';
  return '/';
}

function isRouteActive(pathname) {
  return route.path === pathname || route.path.startsWith(pathname + '/');
}

// Global Currency Formatter
function formatCFA(val) {
  if (val === undefined || val === null) return '0 CFA';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('FCFA', 'CFA').replace('XAF', 'CFA');
}

function getSupplierName(supplierId) {
  const found = suppliers.find(s => s.id === supplierId);
  return found ? found.name : 'Coopérative Locale B2B';
}

function addPromoToCart(product) {
  cartStore.addToCart(product, 1);
  toast.success(`[ADDED] ${product.name} rattaché au panier.`);
}
</script>

<style>
/* CSS Marquee notice ticker */
@keyframes marquee {
  0% { transform: translate3d(0, 0, 0); }
  105% { transform: translate3d(-100%, 0, 0); }
}

.animate-marquee {
  display: inline-block;
  padding-left: 100%;
  animation: marquee 35s linear infinite;
}

.animate-marquee:hover {
  animation-play-state: paused;
}
</style>
