<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans relative overflow-x-hidden select-none">
    
    <!-- MOBILE HEADER PANEL -->
    <header class="md:hidden flex items-center justify-between bg-emerald-950/40 border-b border-emerald-900 px-4 py-3 shrink-0 z-40 sticky top-0 bg-opacity-95 backdrop-blur">
      <div class="flex items-center space-x-2">
        <span class="text-emerald-450 font-mono text-xs font-bold uppercase tracking-wider">🛒 BUYER PORTAL</span>
      </div>
      <button 
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        class="p-1 px-2.5 bg-emerald-950/50 hover:bg-emerald-900 text-emerald-350 rounded border border-emerald-800 transition"
      >
        <span class="font-mono text-[10px] uppercase font-bold">{{ isMobileMenuOpen ? '[ CLOSE ]' : '[ MENU ]' }}</span>
      </button>
    </header>

    <!-- MOBILE NAVIGATION SIDEBAR DRAWER OVERLAY -->
    <div 
      v-if="isMobileMenuOpen" 
      @click="isMobileMenuOpen = false"
      class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
    ></div>

    <!-- MAIN SIDEBAR PANELS (DESKTOP + MOBILE DOCK) -->
    <aside 
      class="fixed inset-y-0 left-0 transform md:transform-none md:relative z-40 bg-[#061115] border-r border-emerald-950/60 flex flex-col transition-all duration-300 ease-in-out shrink-0"
      :class="[
        isCollapsed ? 'md:w-16' : 'md:w-64',
        isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
      ]"
    >
      <!-- BRAND TERMINAL IDENTITY -->
      <div class="h-14 border-b border-emerald-950/60 px-4 flex items-center justify-between shrink-0 select-none bg-[#040c0f]">
        <div class="flex items-center space-x-2.5 truncate" v-show="!isCollapsed || isMobileMenuOpen">
          <svg class="h-5 w-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span class="font-bold text-slate-200 uppercase text-xs tracking-wider font-mono">B2B MARKETPLACE</span>
        </div>
        <div class="flex justify-center w-full" v-show="isCollapsed && !isMobileMenuOpen">
          <span class="text-emerald-500 font-bold font-mono text-base">&Xi;</span>
        </div>
        
        <!-- COLLAPSE TOGGLER -->
        <button 
          @click="isCollapsed = !isCollapsed"
          class="hidden md:block p-1 bg-slate-900/60 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition"
        >
          <span class="text-[10px] font-mono">&larr;</span>
        </button>
      </div>

      <!-- PRIVATE BUYER ACCORDION CARD -->
      <div 
        class="m-3 p-3 bg-[#030a0d] rounded-xl border border-emerald-950/50 text-xs shrink-0 select-none"
        v-show="!isCollapsed || isMobileMenuOpen"
      >
        <div class="text-[8px] uppercase font-mono text-emerald-500 tracking-wider font-bold">CLIENT IDENTIFIER</div>
        <p class="font-semibold text-slate-150 truncate leading-tight">{{ authStore.user?.name || 'Authorized Buyer' }}</p>
        <p class="text-[9px] font-mono text-slate-500 mt-1 uppercase">
          🏢 {{ authStore.user?.company || 'Corporate Buyer' }}
        </p>
      </div>

      <!-- COLLAPSED PROFILE AVATAR SHORTCUT -->
      <div 
        class="my-3 py-2 flex flex-col items-center border-b border-emerald-950/40 select-none group relative"
        v-show="isCollapsed && !isMobileMenuOpen"
      >
        <div class="h-8 w-8 rounded-full bg-emerald-950 text-emerald-405 border border-emerald-900 flex items-center justify-center font-bold font-sans text-xs uppercase shadow">
          {{ authStore.user?.name ? authStore.user.name[0] : 'B' }}
        </div>
        <!-- Tooltip -->
        <div class="hidden group-hover:block absolute left-14 bg-slate-950 text-slate-200 font-mono text-[10px] uppercase border border-slate-800 p-2 rounded shadow-xl z-50 whitespace-nowrap">
          Role: B2B Procurement Officer
        </div>
      </div>

      <!-- SIDEBAR COMPILATION CONTAINER -->
      <nav class="flex-1 overflow-y-auto px-3 py-2 space-y-4 scrollbar-thin select-none">
        
        <!-- For each group -->
        <div v-for="group in menuStructure" :key="group.label" class="space-y-1">
          
          <!-- Category Title -->
          <div 
            class="px-2 pb-1 text-[8px] uppercase font-mono tracking-widest text-[#3a5861] font-bold"
            v-show="!isCollapsed || isMobileMenuOpen"
          >
            {{ group.label }}
          </div>

          <!-- Divider when collapsed -->
          <div 
            class="h-px bg-slate-900 my-2 mx-1" 
            v-show="isCollapsed && !isMobileMenuOpen"
          ></div>

          <!-- Loop Items -->
          <div v-for="item in group.items" :key="item.name" class="space-y-0.5">
            
            <!-- Link with no children -->
            <router-link 
              v-if="!item.children"
              :to="item.to"
              class="flex items-center rounded-lg px-2.5 py-2 text-xs font-mono transition group relative"
              :class="isRouteActive(item.to) ? 'bg-[#0f1d1f] text-emerald-400 font-bold border-l-2 border-emerald-505' : 'text-slate-400 hover:bg-[#0c161a] hover:text-white'"
              @click="isMobileMenuOpen = false"
            >
              <span class="w-5 h-5 mr-2.5 text-[#3b5b63] group-hover:text-white flex items-center justify-center shrink-0" v-html="item.icon"></span>
              <span v-show="!isCollapsed || isMobileMenuOpen" class="truncate">{{ item.name }}</span>

              <!-- Hover Tooltip if Collapsed -->
              <div 
                v-show="isCollapsed && !isMobileMenuOpen" 
                class="hidden group-hover:block absolute left-14 bg-slate-950 text-slate-350 border border-slate-800 p-1.5 rounded shadow-xl font-mono text-[9px] uppercase z-50 whitespace-nowrap"
              >
                {{ item.name }}
              </div>
            </router-link>

            <!-- Dropdown Toggle layout item -->
            <div v-else class="space-y-0.5">
              <button 
                @click="toggleDropdown(item.id)"
                class="w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-mono transition group relative text-left"
                :class="[
                  isDropdownContainingActive(item) ? 'text-emerald-400 font-semibold bg-[#071317]' : 'text-slate-400 hover:bg-[#091518] hover:text-white',
                ]"
              >
                <div class="flex items-center truncate">
                  <span class="w-5 h-5 mr-2.5 text-[#3b5b63] group-hover:text-white flex items-center justify-center shrink-0" v-html="item.icon"></span>
                  <span v-show="!isCollapsed || isMobileMenuOpen" class="truncate">{{ item.name }}</span>
                </div>

                <span 
                  v-show="!isCollapsed || isMobileMenuOpen" 
                  class="font-mono text-[9px] text-slate-500 transition-transform duration-200 shrink-0"
                  :class="openDropdowns[item.id] ? 'rotate-90' : ''"
                >
                  &plus;
                </span>

                <!-- Hover Tooltip if Collapsed -->
                <div 
                  v-show="isCollapsed && !isMobileMenuOpen" 
                  class="hidden group-hover:block absolute left-14 bg-slate-950 text-slate-350 border border-slate-800 p-1.5 rounded shadow-xl font-mono text-[9px] uppercase z-50 whitespace-nowrap"
                >
                  {{ item.name }} (Submenu)
                </div>
              </button>

              <!-- Dropdown Children section -->
              <div 
                v-show="openDropdowns[item.id] && (!isCollapsed || isMobileMenuOpen)" 
                class="pl-6 space-y-0.5 border-l border-[#122b30] ml-5 pr-1 py-1"
              >
                <router-link 
                  v-for="sub in item.children" 
                  :key="sub.name"
                  :to="sub.to"
                  class="block px-3 py-1.5 rounded-md text-[11px] font-mono text-slate-400 hover:text-white hover:bg-slate-900/50 transition truncate"
                  :class="isRouteActive(sub.to) ? 'text-emerald-405 font-bold bg-[#0d2226]' : ''"
                  @click="isMobileMenuOpen = false"
                >
                  &rarr; {{ sub.name }}
                </router-link>
              </div>

            </div>

          </div>

        </div>

      </nav>

      <!-- PORTAL REDIRECT TO MAIN WEB CENTER -->
      <div class="p-3 border-t border-emerald-950/60 shrink-0 space-y-1.5" v-show="!isCollapsed || isMobileMenuOpen">
        <router-link
          to="/"
          class="w-full bg-[#051a1e] border border-emerald-900/30 hover:bg-emerald-950/30 text-emerald-400 rounded-lg py-2 font-mono text-[10px] uppercase font-bold text-center block transition duration-200"
        >
          &larr; Marketplace Catalog
        </router-link>
        
        <button 
          @click="logoutSession"
          class="w-full py-2 bg-red-950/20 text-red-400 hover:bg-red-900 hover:text-slate-950 rounded-xl text-[10px] font-mono uppercase font-bold tracking-wider transition border border-red-905/30 flex justify-center items-center space-x-2"
        >
          <span>Disconnect Portal</span>
        </button>
      </div>

    </aside>

    <!-- CONTENT WORKSPACE WRAPPER -->
    <div class="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
      
      <!-- TOP STATUS NAVIGATION HEADER -->
      <header class="h-14 border-b border-rose-955/2 bg-[#020a0d]/90 backdrop-blur px-6 flex items-center justify-between shrink-0 sticky top-0 z-10 select-none border-b border-emerald-950/60">
        
        <!-- BREADCRUMBS BAR (DYNAMIC) -->
        <div class="flex items-center space-x-2.5 text-xs text-slate-450 font-mono tracking-tight font-medium truncate">
          <router-link to="/buyer/dashboard" class="hover:text-emerald-400 transition uppercase">BUYER HUB</router-link>
          
          <template v-for="(crumb, idx) in breadcrumbs" :key="crumb.to">
            <span class="text-slate-650 font-sans font-normal">&bull;</span>
            <span 
              v-if="crumb.current" 
              class="text-emerald-400 font-bold uppercase truncate"
            >
              {{ crumb.text }}
            </span>
            <router-link 
              v-else 
              :to="crumb.to" 
              class="hover:text-emerald-400 transition uppercase truncate max-w-[120px]"
            >
              {{ crumb.text }}
            </router-link>
          </template>
        </div>

        <!-- UTILITIES -->
        <div class="flex items-center space-x-4">
          <div class="hidden sm:flex items-center space-x-2 bg-slate-950 border border-slate-900 rounded-lg px-2.5 py-1 text-[10px] font-mono text-slate-400">
            <span class="text-slate-650 uppercase">ENROLLED STATUS:</span>
            <span class="text-emerald-405 font-bold font-mono">B2B PREFERRED ACCOUNT</span>
          </div>

          <button 
            @click="logoutSession"
            class="text-[10px] font-mono text-slate-400 hover:text-white font-bold uppercase border border-slate-900 bg-slate-900 px-2.5 py-1 rounded transition"
          >
            Log Out
          </button>
        </div>

      </header>

      <!-- DYNAMIC ROUTER PANEL SPACE -->
      <main class="flex-1 p-4 md:p-8">
        <router-view />
      </main>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useAuthStore } from '@/store/modules/auth.js';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const toast = useToast();

const isCollapsed = ref(false);
const isMobileMenuOpen = ref(false);

const openDropdowns = ref({
  dashboard: true,
  purchases: false,
  wallet: false,
  profile: false
});

const menuStructure = [
  {
    label: 'Buyer Operations',
    items: [
      {
        id: 'dashboard',
        name: 'Procurement Dashboard',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>',
        children: [
          { name: 'Summary Feed', to: '/buyer/dashboard' },
          { name: 'My Reviews Tracker', to: '/buyer/reviews' }
        ]
      }
    ]
  },
  {
    label: 'Orders & Deliveries',
    items: [
      {
        id: 'purchases',
        name: 'My Acquisitions',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>',
        children: [
          { name: 'Order History', to: '/buyer/orders' },
          { name: 'Saved Wishlist', to: '/buyer/wishlist' }
        ]
      }
    ]
  },
  {
    label: 'Address & Billing',
    items: [
      {
        id: 'wallet',
        name: 'Procurement Tools',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>',
        children: [
          { name: 'Address Directories', to: '/buyer/addresses' },
          { name: 'Corporate Wallets', to: '/buyer/payment-methods' },
          { name: 'Loyalty Tokens', to: '/buyer/loyalty' }
        ]
      }
    ]
  },
  {
    label: 'User Settings',
    items: [
      {
        id: 'profile',
        name: 'Clearing Credentials',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>',
        children: [
          { name: 'Profile Information', to: '/buyer/profile' },
          { name: 'Vault Security Logs', to: '/buyer/security' },
          { name: 'Corporate Notifications', to: '/buyer/notifications' }
        ]
      }
    ]
  }
];

function toggleDropdown(id) {
  openDropdowns.value[id] = !openDropdowns.value[id];
}

function isRouteActive(targetPath) {
  return route.path === targetPath || route.path.startsWith(targetPath + '/');
}

function isDropdownContainingActive(item) {
  if (!item.children) return false;
  return item.children.some(child => isRouteActive(child.to));
}

function autoOpenDropdowns() {
  menuStructure.forEach(group => {
    group.items.forEach(item => {
      if (item.children && isDropdownContainingActive(item)) {
        openDropdowns.value[item.id] = true;
      }
    });
  });
}

watch(() => route.path, () => {
  autoOpenDropdowns();
});

onMounted(() => {
  autoOpenDropdowns();
});

// Dynamic Breadcrumbs parsing
const breadcrumbs = computed(() => {
  const path = route.path;
  const segments = path.split('/').filter(Boolean);
  let accumulatedPath = '';
  return segments.map((seg, index) => {
    accumulatedPath += `/${seg}`;
    
    let label = seg.toUpperCase().replace(/-/g, ' ');
    if (label === 'KPI') label = 'KPIs';
    if (label === 'RFQ') label = 'RFQs';
    if (label === 'POS') label = 'POS TERMINAL';
    if (label === 'ADMIN') label = 'PLATFORM CENTRAL';
    if (label === 'SUPPLIER') label = 'MERCHANT DESK';
    if (label === 'BUYER') label = 'BUYER WORKSPACE';
    
    if (seg.startsWith('usr_') || seg.startsWith('tenant_') || /^\d+$/.test(seg)) {
      label = `RECORD #${seg.toUpperCase()}`;
    }

    return {
      text: label,
      to: accumulatedPath,
      current: index === segments.length - 1
    };
  });
});

function logoutSession() {
  authStore.logout();
  toast.success('B2B Procurement Officer logged out.');
  router.push({ name: 'Login' });
}
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #0d2226;
  border-radius: 2px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #173b42;
}
</style>
