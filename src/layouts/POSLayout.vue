<template>
  <div class="app-container min-h-screen bg-black text-emerald-450 flex flex-col lg:flex-row font-mono relative overflow-x-hidden select-none">
    
    <!-- MOBILE/TABLET HEADER PANEL FOR CASHIERS -->
    <header class="lg:hidden flex items-center justify-between bg-[#040f0c] border-b border-emerald-950 px-6 py-3.5 shrink-0 z-40 sticky top-0 bg-opacity-95 backdrop-blur">
      <div class="flex items-center space-x-2">
        <span class="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></span>
        <span class="font-bold text-xs uppercase text-emerald-300">POS TERM #002</span>
      </div>
      <button 
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        class="p-2 bg-emerald-955/40 text-emerald-400 border border-emerald-900 transition flex items-center justify-center"
        :aria-label="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
      >
        <Bars3Icon v-if="!isMobileMenuOpen" class="h-6 w-6" aria-hidden="true" />
        <XMarkIcon v-else class="h-6 w-6" aria-hidden="true" />
      </button>
    </header>

    <!-- MOBILE & TABLET NAVIGATION SIDEBAR DRAWER OVERLAY -->
    <div 
      v-if="isMobileMenuOpen" 
      @click="isMobileMenuOpen = false"
      class="fixed inset-0 bg-black/90 backdrop-blur-sm z-40 lg:hidden"
    ></div>

    <!-- MAIN SIDEBAR PANELS (DESKTOP + MOBILE/TABLET DOCK) -->
    <aside 
      class="sidebar-container fixed inset-y-0 left-0 z-40 bg-zinc-950 border-r border-emerald-950/60 flex flex-col transition-all duration-250 ease-in-out shrink-0 lg:transform-none lg:relative"
      :class="[
        isCollapsed ? 'lg:w-[72px]' : 'lg:w-[280px]',
        isMobileMenuOpen ? 'translate-x-0 w-full sm:w-[280px]' : '-translate-x-full lg:translate-x-0'
      ]"
      role="navigation"
      aria-label="POS main navigation"
    >
      <!-- SYSTEM BRAND TITLE -->
      <div class="h-16 border-b border-emerald-950/60 px-4 flex items-center justify-between shrink-0 select-none bg-black">
        <div class="flex items-center space-x-2.5 truncate" v-show="!isCollapsed || isMobileMenuOpen">
          <GlobeAltIcon class="h-6 w-6 text-emerald-500 shrink-0" aria-hidden="true" />
          <span class="font-bold text-emerald-350 uppercase text-xs tracking-wider">SECURE POS RETAIL</span>
        </div>
        <div class="flex justify-center w-full" v-show="isCollapsed && !isMobileMenuOpen">
          <GlobeAltIcon class="h-6 w-6 text-emerald-500" aria-hidden="true" />
        </div>
        
        <!-- SIDE COLLAPSE TOGGLER -->
        <button 
          @click="isCollapsed = !isCollapsed"
          class="hidden lg:block p-1.5 bg-zinc-900 border border-emerald-955/30 text-emerald-500 hover:text-white transition"
          :aria-label="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        >
          <span class="text-xs font-mono">{{ isCollapsed ? '&rarr;' : '&larr;' }}</span>
        </button>
      </div>

      <!-- ACTIVE REGISTER STATUS HUD -->
      <div 
        class="m-4 p-4 bg-black border border-emerald-950/80 text-[11px] shrink-0 select-none"
        v-show="!isCollapsed || isMobileMenuOpen"
      >
        <div class="text-[9px] text-emerald-500/60 tracking-wider font-bold">CASHIER CONSOLE STATE</div>
        <p class="font-bold text-emerald-200 truncate leading-tight mt-0.5">
          {{ authStore.user?.name || 'Retail Agent' }}
        </p>
        <div class="mt-2 text-[10px] text-zinc-500 space-y-1">
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
        class="my-4 py-2 flex flex-col items-center border-b border-emerald-950 select-none group relative"
        v-show="isCollapsed && !isMobileMenuOpen"
      >
        <div class="h-10 w-10 bg-emerald-955/60 text-emerald-400 border border-emerald-900 flex items-center justify-center font-bold text-xs uppercase shadow">
          {{ authStore.user?.name ? authStore.user.name[0] : 'P' }}
        </div>
        <!-- Tooltip -->
        <div class="hidden group-hover:block absolute left-16 bg-black text-emerald-405 border border-emerald-900 p-2 shadow-xl z-50 text-[10px] uppercase whitespace-nowrap">
          Cashier Code: #002
        </div>
      </div>

      <!-- SIDEBAR MENU LIST CONFIG -->
      <nav class="flex-1 overflow-y-auto px-4 py-3 space-y-5 scrollbar-thin select-none text-xs">
        
        <div v-for="group in menuStructure" :key="group.label" class="space-y-2">
          
          <div 
            class="px-2 pb-1.5 text-[10px] uppercase tracking-widest text-[#2f614f] font-bold"
            v-show="!isCollapsed || isMobileMenuOpen"
          >
            {{ group.label }}
          </div>

          <div 
            class="h-px bg-zinc-900 my-2 mx-1" 
            v-show="isCollapsed && !isOpen"
          ></div>

          <div v-for="item in group.items" :key="item.name" class="space-y-1">
            
            <router-link 
              v-slot="{ href, navigate }"
              v-if="!item.children"
              :to="item.to"
              custom
            >
              <a 
                :href="href"
                @click="[navigate(), isMobileMenuOpen = false]"
                class="flex items-center px-3 py-2.5 transition group relative cursor-pointer"
                :class="isRouteActive(item.to) ? 'bg-[#0a2317] border border-emerald-500/40 text-[#10b981] font-bold' : 'text-zinc-500 hover:text-emerald-300 hover:bg-zinc-900/60'"
              >
                <component :is="item.icon" class="h-6 w-6 mr-3 text-[#2d6f51] group-hover:text-emerald-405 shrink-0" aria-hidden="true" />
                <span v-show="!isCollapsed || isMobileMenuOpen" class="truncate">{{ item.name }}</span>

                <div 
                  v-show="isCollapsed && !isMobileMenuOpen" 
                  class="hidden group-hover:block absolute left-16 bg-black text-emerald-400 border border-emerald-900 p-2 shadow-xl text-[10px] uppercase z-50 whitespace-nowrap"
                >
                  {{ item.name }}
                </div>
              </a>
            </router-link>

            <!-- Dropdown Toggle block -->
            <div v-else class="space-y-1">
              <button 
                @click="toggleDropdown(item.id)"
                class="w-full flex items-center justify-between px-3 py-2.5 transition group relative text-left"
                :class="[
                  isDropdownContainingActive(item) ? 'bg-zinc-900/40 text-emerald-400 font-semibold' : 'text-zinc-500 hover:bg-zinc-900 hover:text-emerald-300',
                ]"
                :aria-expanded="openDropdowns[item.id]"
              >
                <div class="flex items-center truncate">
                  <component :is="item.icon" class="h-6 w-6 mr-3 text-[#2d6f51] group-hover:text-emerald-405 shrink-0" aria-hidden="true" />
                  <span v-show="!isCollapsed || isMobileMenuOpen" class="truncate">{{ item.name }}</span>
                </div>

                <ChevronDownIcon 
                  v-show="!isCollapsed || isMobileMenuOpen" 
                  class="h-4 w-4 text-emerald-700 transition-transform duration-250 shrink-0"
                  :class="openDropdowns[item.id] ? 'rotate-180' : ''"
                  aria-hidden="true"
                />

                <div 
                  v-show="isCollapsed && !isMobileMenuOpen" 
                  class="hidden group-hover:block absolute left-16 bg-black text-emerald-400 border border-emerald-900 p-2 shadow-xl text-[10px] uppercase z-50 whitespace-nowrap"
                >
                  {{ item.name }} (Submenu)
                </div>
              </button>

              <div 
                v-show="openDropdowns[item.id] && (!isCollapsed || isMobileMenuOpen)" 
                class="pl-6 space-y-1 border-l border-[#19402f] ml-6 pr-1 py-1"
              >
                <router-link 
                  v-for="sub in item.children" 
                  :key="sub.name"
                  :to="sub.to"
                  class="block px-3 py-2 text-[11px] text-zinc-500 hover:text-emerald-300 hover:bg-zinc-900 transition truncate"
                  :class="isRouteActive(sub.to) ? 'text-emerald-400 font-bold border-r border-[#10b981]' : ''"
                  @click="isMobileMenuOpen = false"
                >
                  {{ sub.name }}
                </router-link>
              </div>

            </div>

          </div>

        </div>

      </nav>

      <!-- SYSTEM DISCONNECT KEY SHORTCUTS -->
      <div class="p-4 border-t border-emerald-950 shrink-0 select-none" v-show="!isCollapsed || isMobileMenuOpen">
        <button 
          @click="logoutSession"
          class="w-full py-2.5 bg-[#1a0505] text-red-505 hover:bg-red-950 hover:text-white border border-red-950 text-xs uppercase font-bold tracking-wider transition duration-150 flex justify-center items-center space-x-2"
          aria-label="Disconnect register terminal"
        >
          <ArrowRightOnRectangleIcon class="h-5 w-5" aria-hidden="true" />
          <span>[ DISENGAGE TERM. ]</span>
        </button>
      </div>

    </aside>

    <!-- CONTENT WORKSPACE WRAPPER -->
    <div class="page-container flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
      
      <!-- TOP STATUS NAVIGATION HEADER -->
      <header class="h-16 border-b border-emerald-955 bg-black/90 px-6 flex items-center justify-between shrink-0 sticky top-0 z-10 select-none">
        
        <!-- BREADCRUMBS BAR (DYNAMIC) -->
        <div class="flex items-center space-x-2 text-[11px] text-zinc-500 tracking-tight font-medium truncate">
          <router-link to="/pos" class="hover:text-emerald-400 transition">POS_REGISTRY</router-link>
          
          <template v-for="(crumb, idx) in breadcrumbs" :key="crumb.to">
            <ChevronRightIcon class="h-4 w-4 text-[#2d6f51] inline shrink-0" aria-hidden="true" />
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
        <div class="flex items-center space-x-4 shrink-0 text-xs">
          <div class="hidden sm:flex items-center space-x-2 bg-black border border-emerald-950 rounded-none px-3 py-1.5 text-zinc-500">
            <ShieldCheckIcon class="h-4.5 w-4.5 text-emerald-500" aria-hidden="true" />
            <span>SYSTEM_SECURITY:</span>
            <span class="text-emerald-500 font-bold">READY</span>
          </div>

          <button 
            @click="logoutSession"
            class="text-zinc-500 hover:text-white font-bold border border-emerald-955 bg-black px-3 py-1.5 transition"
            aria-label="Disconnect cashier console"
          >
            DISCONNECT
          </button>
        </div>

      </header>

      <!-- DYNAMIC ROUTER PANEL SPACE -->
      <main class="flex-1 p-6 md:p-8 bg-[#020503]">
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
import { 
  Bars3Icon, 
  XMarkIcon, 
  ChevronRightIcon, 
  ChevronDownIcon,
  GlobeAltIcon, 
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  WrenchIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline';

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
        icon: WrenchIcon,
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
        icon: DocumentTextIcon,
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
  return route.path === targetPath;
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
@media (min-width: 1024px) {
  .app-container {
    height: 100vh;
    overflow: hidden;
  }
  .sidebar-container {
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
    position: sticky;
    top: 0;
    flex-shrink: 0;
  }
  .page-container {
    height: 100vh;
    overflow-y: auto;
    flex: 1;
  }
}

/* Sidebar scrollbar styling */
.sidebar-container::-webkit-scrollbar {
  width: 4px;
}
.sidebar-container::-webkit-scrollbar-track {
  background: transparent;
}
.sidebar-container::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.1);
  border-radius: 0;
}

/* Page content scrollbar styling */
.page-container::-webkit-scrollbar {
  width: 6px;
}
.page-container::-webkit-scrollbar-track {
  background: transparent;
}
.page-container::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.15);
  border-radius: 0;
}

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
