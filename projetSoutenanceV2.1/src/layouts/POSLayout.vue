<template>
  <div class="min-h-screen bg-black text-emerald-400 flex flex-col md:flex-row font-mono relative overflow-x-hidden select-none">
    
    <!-- MOBILE HEADER PANEL FOR CASHIERS -->
    <header class="md:hidden flex items-center justify-between bg-[#040f0c] border-b border-emerald-950 px-4 py-3 shrink-0 z-40 sticky top-0">
      <div class="flex items-center space-x-2">
        <span class="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></span>
        <span class="font-bold text-xs uppercase text-emerald-300">POS TERM #002</span>
      </div>
      <button 
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        class="p-1 px-2 pb-1 bg-emerald-950/40 text-emerald-400 rounded border border-emerald-900 text-[10px] uppercase font-bold"
      >
        {{ isMobileMenuOpen ? '[ CLOSE ]' : '[ OPTIONS ]' }}
      </button>
    </header>

    <!-- MOBILE NAVIGATION SIDEBAR DRAWER OVERLAY -->
    <div 
      v-if="isMobileMenuOpen" 
      @click="isMobileMenuOpen = false"
      class="fixed inset-0 bg-black/90 backdrop-blur-sm z-40 md:hidden"
    ></div>

    <!-- MAIN SIDEBAR PANELS (DESKTOP + MOBILE DOCK) -->
    <aside 
      class="fixed inset-y-0 left-0 transform md:transform-none md:relative z-40 bg-zinc-950 border-r border-emerald-950/60 flex flex-col transition-all duration-300 ease-in-out shrink-0"
      :class="[
        isCollapsed ? 'md:w-16' : 'md:w-64',
        isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
      ]"
    >
      <!-- SYSTEM BRAND TITLE -->
      <div class="h-14 border-b border-emerald-950/60 px-4 flex items-center justify-between shrink-0 select-none bg-black">
        <div class="flex items-center space-x-2.5 truncate" v-show="!isCollapsed || isMobileMenuOpen">
          <svg class="h-5 w-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span class="font-bold text-emerald-350 uppercase text-xs tracking-wider">SECURE POS RETAIL</span>
        </div>
        <div class="flex justify-center w-full" v-show="isCollapsed && !isMobileMenuOpen">
          <span class="text-emerald-500 font-bold text-base">&equiv;</span>
        </div>
        
        <!-- SIDE COLLAPSE TOGGLER -->
        <button 
          @click="isCollapsed = !isCollapsed"
          class="hidden md:block p-1 bg-zinc-900 border border-emerald-950/30 rounded text-emerald-500 hover:text-white transition"
        >
          <span class="text-[10px]">&larr;</span>
        </button>
      </div>

      <!-- ACTIVE REGISTER STATUS HUD -->
      <div 
        class="m-3 p-3 bg-black rounded-lg border border-emerald-950/80 text-[10px] shrink-0 select-none"
        v-show="!isCollapsed || isMobileMenuOpen"
      >
        <div class="text-[8px] text-emerald-500/60 tracking-wider font-bold">CASHIER CONSOLE STATE</div>
        <p class="font-bold text-emerald-200 truncate leading-tight mt-0.5">
          {{ authStore.user?.name || 'Retail Agent' }}
        </p>
        <div class="mt-2 text-[9px] text-zinc-500 space-y-1">
          <div class="flex justify-between">
            <span>TERMINAL ID:</span>
            <strong class="text-emerald-450">TX-TERM-2A</strong>
          </div>
          <div class="flex justify-between">
            <span>DRW LOCK:</span>
            <strong class="text-emerald-500 uppercase animate-pulse">ENGAGED</strong>
          </div>
        </div>
      </div>

      <!-- COLLAPSED PROFILE AVATAR SHORTCUT -->
      <div 
        class="my-3 py-2 flex flex-col items-center border-b border-emerald-950 select-none group relative"
        v-show="isCollapsed && !isMobileMenuOpen"
      >
        <div class="h-8 w-8 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-900 flex items-center justify-center font-bold text-xs uppercase shadow">
          {{ authStore.user?.name ? authStore.user.name[0] : 'P' }}
        </div>
        <!-- Tooltip -->
        <div class="hidden group-hover:block absolute left-14 bg-black text-emerald-405 border border-emerald-900 p-2 rounded shadow-xl z-50 text-[9px] uppercase whitespace-nowrap">
          Cashier Code: #002
        </div>
      </div>

      <!-- SIDEBAR MENU LIST CONFIG -->
      <nav class="flex-1 overflow-y-auto px-3 py-2 space-y-4 scrollbar-thin select-none text-xs">
        
        <div v-for="group in menuStructure" :key="group.label" class="space-y-1">
          
          <div 
            class="px-2 pb-1 text-[8px] uppercase tracking-widest text-[#2f614f] font-bold"
            v-show="!isCollapsed || isMobileMenuOpen"
          >
            {{ group.label }}
          </div>

          <div 
            class="h-px bg-zinc-900 my-2 mx-1" 
            v-show="isCollapsed && !isMobileMenuOpen"
          ></div>

          <div v-for="item in group.items" :key="item.name" class="space-y-0.5">
            
            <router-link 
              v-slot="{ isActive, navigate }"
              v-if="!item.children"
              :to="item.to"
              custom
            >
              <a 
                @click="[navigate(), isMobileMenuOpen = false]"
                class="flex items-center rounded px-2.5 py-1.5 transition group relative cursor-pointer"
                :class="isRouteActive(item.to) ? 'bg-[#0a2317] border border-emerald-500/40 text-[#10b981] font-bold' : 'text-zinc-500 hover:text-emerald-300 hover:bg-zinc-900/60'"
              >
                <span class="w-5 h-5 mr-2 text-[#2d6f51] group-hover:text-emerald-400 flex items-center justify-center shrink-0" v-html="item.icon"></span>
                <span v-show="!isCollapsed || isMobileMenuOpen" class="truncate">{{ item.name }}</span>

                <div 
                  v-show="isCollapsed && !isMobileMenuOpen" 
                  class="hidden group-hover:block absolute left-14 bg-black text-emerald-400 border border-emerald-900 p-1.5 rounded shadow-xl text-[9px] uppercase z-50 whitespace-nowrap font-mono"
                >
                  {{ item.name }}
                </div>
              </a>
            </router-link>

            <!-- Dropdown Toggle block -->
            <div v-else class="space-y-0.5">
              <button 
                @click="toggleDropdown(item.id)"
                class="w-full flex items-center justify-between rounded px-2.5 py-1.5 transition group relative text-left"
                :class="[
                  isDropdownContainingActive(item) ? 'bg-zinc-900/40 text-emerald-400 font-semibold' : 'text-zinc-500 hover:bg-zinc-900 hover:text-emerald-300',
                ]"
              >
                <div class="flex items-center truncate">
                  <span class="w-5 h-5 mr-2 text-[#2d6f51] group-hover:text-emerald-400 flex items-center justify-center shrink-0" v-html="item.icon"></span>
                  <span v-show="!isCollapsed || isMobileMenuOpen" class="truncate">{{ item.name }}</span>
                </div>

                <span 
                  v-show="!isCollapsed || isMobileMenuOpen" 
                  class="text-[9px] text-emerald-700 transition-transform duration-200 shrink-0"
                  :class="openDropdowns[item.id] ? 'rotate-95' : ''"
                >
                  &plus;
                </span>

                <div 
                  v-show="isCollapsed && !isMobileMenuOpen" 
                  class="hidden group-hover:block absolute left-14 bg-black text-emerald-400 border border-emerald-900 p-1.5 rounded shadow-xl text-[9px] uppercase z-50 whitespace-nowrap font-mono"
                >
                  {{ item.name }} (Submenu)
                </div>
              </button>

              <div 
                v-show="openDropdowns[item.id] && (!isCollapsed || isMobileMenuOpen)" 
                class="pl-4 space-y-0.5 border-l border-[#19402f] ml-4 pr-1 py-1"
              >
                <router-link 
                  v-for="sub in item.children" 
                  :key="sub.name"
                  :to="sub.to"
                  class="block px-3 py-1.5 rounded text-[10.5px] text-zinc-500 hover:text-emerald-300 hover:bg-zinc-900 transition truncate"
                  :class="isRouteActive(sub.to) ? 'text-emerald-40a font-bold border-r border-[#10b981]' : ''"
                  @click="isMobileMenuOpen = false"
                >
                  &gt; {{ sub.name }}
                </router-link>
              </div>

            </div>

          </div>

        </div>

      </nav>

      <!-- SYSTEM DISCONNECT KEY SHORTCUTS -->
      <div class="p-3 border-t border-emerald-950 shrink-0 select-none" v-show="!isCollapsed || isMobileMenuOpen">
        <button 
          @click="logoutSession"
          class="w-full py-1.5 bg-[#1a0505] text-red-500 hover:bg-red-950 hover:text-white rounded border border-red-950 text-[10px] uppercase font-bold tracking-wider transition duration-150 flex justify-center items-center space-x-1.5"
        >
          <span>[ DISENGAGE TERM. ]</span>
        </button>
      </div>

    </aside>

    <!-- CONTENT WORKSPACE WRAPPER -->
    <div class="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
      
      <!-- TOP STATUS NAVIGATION HEADER -->
      <header class="h-14 border-b border-emerald-950 bg-black/90 px-6 flex items-center justify-between shrink-0 sticky top-0 z-10 select-none">
        
        <!-- BREADCRUMBS BAR (DYNAMIC) -->
        <div class="flex items-center space-x-2 text-[10px] text-zinc-500 tracking-tight font-medium truncate">
          <router-link to="/pos" class="hover:text-emerald-400 transition">POS_REGISTRY</router-link>
          
          <template v-for="(crumb, idx) in breadcrumbs" :key="crumb.to">
            <span>&raquo;</span>
            <span 
              v-if="crumb.current" 
              class="text-emerald-400 font-bold truncate uppercase"
            >
              {{ crumb.text }}
            </span>
            <router-link 
              v-else 
              :to="crumb.to" 
              class="hover:text-emerald-400 transition truncate max-w-[120px] uppercase"
            >
              {{ crumb.text }}
            </router-link>
          </template>
        </div>

        <!-- SEARCH BAR AND UTILITIES -->
        <div class="flex items-center space-x-4 shrink-0 text-[10px]">
          <div class="hidden sm:flex items-center space-x-2 bg-black border border-emerald-950 rounded px-2.5 py-1 text-zinc-500">
            <span>SYSTEM_SECURITY:</span>
            <span class="text-emerald-500 font-bold">READY</span>
          </div>

          <button 
            @click="logoutSession"
            class="text-zinc-550 hover:text-white font-bold border border-emerald-950 bg-black px-2.5 py-1 rounded transition"
          >
            DISCONNECT
          </button>
        </div>

      </header>

      <!-- DYNAMIC ROUTER PANEL SPACE -->
      <main class="flex-1 p-4 md:p-6 bg-[#020503]">
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
  workspace: true,
  cashier: false
});

const menuStructure = [
  {
    label: 'Checkout Operations',
    items: [
      {
        id: 'workspace',
        name: 'Register Control',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="h-3.5 w-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h.01M16 20h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h2" /></svg>',
        children: [
          { name: 'Grid Terminal', to: '/pos' },
          { name: 'Selected Cart', to: '/pos/cart' },
          { name: 'Payment Clearance', to: '/pos/payment' },
          { name: 'Receipt Invoices', to: '/pos/ticket' }
        ]
      }
    ]
  },
  {
    label: 'Cashier Audits',
    items: [
      {
        id: 'cashier',
        name: 'Daily Ledger',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="h-3.5 w-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>',
        children: [
          { name: 'Returns Management', to: '/pos/returns' },
          { name: 'Drawer Balance Report', to: '/pos/report' },
          { name: 'Device Config', to: '/pos/settings' }
        ]
      }
    ]
  }
];

function toggleDropdown(id) {
  openDropdowns.value[id] = !openDropdowns.value[id];
}

function isRouteActive(targetPath) {
  return route.path === targetPath || route.path === targetPath;
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
    
    let label = seg.toUpperCase().replace(/-/g, '_');
    if (label === 'KPI') label = 'KPIS_METRICS';
    if (label === 'RFQ') label = 'RFQS';
    if (label === 'POS') label = 'POS_TERMINAL';
    if (label === 'ADMIN') label = 'PLATFORM_CENTRAL';
    if (label === 'SUPPLIER') label = 'MERCHANT_DESK';
    if (label === 'BUYER') label = 'BUYER_WORKSPACE';
    
    if (seg.startsWith('usr_') || seg.startsWith('tenant_') || /^\d+$/.test(seg)) {
      label = `ID_${seg.toUpperCase()}`;
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
  toast.success('Cashier disengaged safely. Lock drawer commanded.');
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
  background: #112d1f;
  border-radius: 2px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #1a4d34;
}
</style>
