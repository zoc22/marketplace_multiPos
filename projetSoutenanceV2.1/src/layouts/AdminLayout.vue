<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans relative overflow-x-hidden select-none">
    
    <!-- MOBILE HEADER PANEL -->
    <header class="md:hidden flex items-center justify-between bg-[#0b132c] border-b border-slate-900 px-4 py-3 shrink-0 z-40 sticky top-0">
      <div class="flex items-center space-x-2">
        <svg class="h-5 w-5 text-red-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span class="font-mono font-bold uppercase tracking-wider text-xs text-red-400">ADMIN CONTROL</span>
      </div>
      <button 
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        class="p-1 px-2.5 bg-slate-900 hover:bg-slate-850 text-slate-300 rounded border border-slate-800 transition"
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
      class="fixed inset-y-0 left-0 transform md:transform-none md:relative z-40 bg-[#090f23] border-r border-[#121c3b] flex flex-col transition-all duration-300 ease-in-out shrink-0"
      :class="[
        isCollapsed ? 'md:w-16' : 'md:w-64',
        isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
      ]"
    >
      <!-- BRAND TERMINAL IDENTITY -->
      <div class="h-14 border-b border-[#121c3b] px-4 flex items-center justify-between shrink-0 select-none">
        <div class="flex items-center space-x-2.5 truncate" v-show="!isCollapsed || isMobileMenuOpen">
          <svg class="h-5 w-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
          </svg>
          <span class="font-bold text-slate-200 uppercase text-xs tracking-wider font-mono">ROOT CENTRAL</span>
        </div>
        <div class="flex justify-center w-full" v-show="isCollapsed && !isMobileMenuOpen">
          <span class="text-red-500 font-bold font-mono text-base">&Xi;</span>
        </div>
        
        <!-- COLLAPSE TOGGLER (Hidden on mobile) -->
        <button 
          @click="isCollapsed = !isCollapsed"
          class="hidden md:block p-1 bg-slate-900/60 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition"
          v-show="!isCollapsed || !isCollapsed"
        >
          <span class="text-[10px] font-mono">&larr;</span>
        </button>
      </div>

      <!-- ACTIVE SECURITY HUDS -->
      <div 
        class="m-3 p-3 bg-[#05091a] rounded-xl border border-red-950/45 text-xs shrink-0 select-none"
        v-show="!isCollapsed || isMobileMenuOpen"
      >
        <div class="text-[8px] uppercase font-mono text-[#FF5F00] tracking-wider font-bold">ROOT AUTH STATUS</div>
        <p class="font-semibold text-slate-200 truncate leading-tight">{{ authStore.user?.name || 'Supervisor' }}</p>
        <p class="text-[9px] font-mono text-red-400 mt-1 uppercase flex items-center space-x-1">
          <span class="h-1 w-1 rounded-full bg-emerald-500 inline-block animate-ping"></span>
          <span>SYSTEM TERMINAL ROOT</span>
        </p>
      </div>

      <!-- COLLAPSED PROFILE AVATAR SHORTCUT -->
      <div 
        class="my-3 py-2 flex flex-col items-center border-b border-[#121c3b]/50 select-none group relative"
        v-show="isCollapsed && !isMobileMenuOpen"
      >
        <div class="h-8 w-8 rounded-full bg-red-950 text-red-400 border border-red-900 flex items-center justify-center font-bold font-sans text-xs uppercase shadow">
          {{ authStore.user?.name ? authStore.user.name[0] : 'S' }}
        </div>
        <!-- Tooltip -->
        <div class="hidden group-hover:block absolute left-14 bg-slate-950 text-slate-200 font-mono text-[10px] uppercase border border-slate-800 p-2 rounded shadow-xl z-50 whitespace-nowrap">
          Role: Platform Administrator
        </div>
      </div>

      <!-- SIDEBAR COMPILATION CONTAINER -->
      <nav class="flex-1 overflow-y-auto px-3 py-2 space-y-4 scrollbar-thin select-none">
        
        <!-- Foreach Side Menu Categories Group -->
        <div v-for="group in menuGroups" :key="group.label" class="space-y-1">
          
          <!-- Category Title -->
          <div 
            class="px-2 pb-1 text-[8px] uppercase font-mono tracking-widest text-slate-500 font-bold"
            v-show="!isCollapsed || isMobileMenuOpen"
          >
            {{ group.label }}
          </div>

          <!-- Category Division Dot when collapsed -->
          <div 
            class="h-px bg-slate-800/40 my-2 mx-1" 
            v-show="isCollapsed && !isMobileMenuOpen"
          ></div>

          <!-- Loop Items -->
          <div v-for="item in group.items" :key="item.name" class="space-y-0.5">
            
            <!-- Standard link without kids -->
            <router-link 
              v-if="!item.children"
              :to="item.to"
              class="flex items-center rounded-lg px-2.5 py-2 text-xs font-mono transition group relative"
              :class="isRouteActive(item.to) ? 'bg-indigo-650 text-white font-bold border-l-2 border-indigo-400' : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'"
              @click="isMobileMenuOpen = false"
            >
              <!-- Icon segment -->
              <span class="w-5 h-5 mr-2.5 text-slate-400 group-hover:text-white flex items-center justify-center shrink-0" v-html="item.icon"></span>
              
              <!-- Tag description values -->
              <span v-show="!isCollapsed || isMobileMenuOpen" class="truncate">{{ item.name }}</span>

              <!-- Hover Tooltip if Collapsed -->
              <div 
                v-show="isCollapsed && !isMobileMenuOpen" 
                class="hidden group-hover:block absolute left-14 bg-slate-950 text-slate-350 border border-slate-800 p-1.5 rounded shadow-xl font-mono text-[9px] uppercase z-50 whitespace-nowrap"
              >
                {{ item.name }}
              </div>
            </router-link>

            <!-- Interactive Dropdown parent block style -->
            <div v-else class="space-y-0.5">
              <button 
                @click="toggleDropdown(item.id)"
                class="w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-mono transition group relative text-left"
                :class="[
                  isDropdownContainingActive(item) ? 'text-indigo-400 font-semibold bg-slate-900/20' : 'text-slate-400 hover:bg-slate-900/40 hover:text-white',
                ]"
              >
                <div class="flex items-center truncate">
                  <span class="w-5 h-5 mr-2.5 text-slate-400 group-hover:text-white flex items-center justify-center shrink-0" v-html="item.icon"></span>
                  <span v-show="!isCollapsed || isMobileMenuOpen" class="truncate">{{ item.name }}</span>
                </div>

                <!-- Expansion indicators carets -->
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

              <!-- Dropdown Children segment -->
              <div 
                v-show="openDropdowns[item.id] && (!isCollapsed || isMobileMenuOpen)" 
                class="pl-6 space-y-0.5 border-l border-[#121c3b]/50 ml-5 pr-1 py-1"
              >
                <router-link 
                  v-for="sub in item.children" 
                  :key="sub.name"
                  :to="sub.to"
                  class="block px-3 py-1.5 rounded-md text-[11px] font-mono text-slate-400 hover:text-white hover:bg-slate-900/40 transition truncate"
                  :class="isRouteActive(sub.to) ? 'text-indigo-405 font-bold bg-[#0d1633] border-r border-indigo-500' : ''"
                  @click="isMobileMenuOpen = false"
                >
                  &rarr; {{ sub.name }}
                </router-link>
              </div>

            </div>

          </div>

        </div>

      </nav>

      <!-- COLLAPSE RECOVERY TOGGLE AT LOWER ROW (Collapsed state only) -->
      <div class="p-3 border-t border-[#121c3b] shrink-0" v-show="isCollapsed && !isMobileMenuOpen">
        <button 
          @click="isCollapsed = false"
          class="w-full py-1 bg-slate-900 hover:bg-slate-800 rounded text-slate-400 hover:text-white font-mono text-xs text-center block transition"
        >
          &rarr;
        </button>
      </div>

      <!-- DISCONNECT CORE TERMINAL BUTTON -->
      <div class="p-3 border-t border-[#121c3b] shrink-0" v-show="!isCollapsed || isMobileMenuOpen">
        <button 
          @click="logoutSession"
          class="w-full py-2 bg-red-950/20 text-red-400 hover:bg-red-900 hover:text-slate-950 rounded-xl text-[10px] font-mono uppercase font-bold tracking-wider transition border border-red-900/30 flex justify-center items-center space-x-2"
        >
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" />
          </svg>
          <span>Disengage Console</span>
        </button>
      </div>

    </aside>

    <!-- CONTENT WORKSPACE WRAPPER -->
    <div class="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
      
      <!-- TOP STATUS NAVIGATION HEADER -->
      <header class="h-14 border-b border-[#121c3b] bg-[#070b19]/80 backdrop-blur px-6 flex items-center justify-between shrink-0 sticky top-0 z-10 select-none">
        
        <!-- BREADCRUMBS BAR (DYNAMIC) -->
        <div class="flex items-center space-x-2.5 text-xs text-slate-450 font-mono tracking-tight font-medium truncate">
          <router-link to="/admin/dashboard" class="hover:text-indigo-400 transition uppercase">ROOT</router-link>
          
          <template v-for="(crumb, idx) in breadcrumbs" :key="crumb.to">
            <span class="text-slate-650 font-sans font-normal">&bull;</span>
            <span 
              v-if="crumb.current" 
              class="text-indigo-400 font-bold uppercase truncate"
            >
              {{ crumb.text }}
            </span>
            <router-link 
              v-else 
              :to="crumb.to" 
              class="hover:text-indigo-400 transition uppercase truncate max-w-[120px]"
            >
              {{ crumb.text }}
            </router-link>
          </template>
        </div>

        <!-- SEARCH BAR AND UTILITIES -->
        <div class="flex items-center space-x-4">
          <div class="hidden sm:flex items-center space-x-2 bg-slate-950 border border-slate-900 rounded-lg px-2.5 py-1 text-[10px] font-mono text-slate-400">
            <span class="text-slate-650 uppercase">AUDIT CONSOLE PORT:</span>
            <span class="text-slate-300">ACTIVE</span>
          </div>

          <!-- Quick Disconnect shortcut -->
          <button 
            @click="logoutSession"
            class="text-[10px] font-mono text-red-400 hover:text-red-300 font-bold tracking-wider uppercase border border-red-950/50 bg-red-950/10 px-2.5 py-1 rounded transition"
          >
            Terminal shutdown
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
  console: true,
  users: false,
  catalog: false,
  finance: false,
  support: false,
  system: false,
  settings: false
});

// Sidebar menu lists structure
const menuGroups = [
  {
    label: 'Platform Core',
    items: [
      {
        id: 'console',
        name: 'Console Dashboard',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
        children: [
          { name: 'Control Center', to: '/admin/dashboard' },
          { name: 'Metrics Stats', to: '/admin/stats' },
          { name: 'Real Time Monitor', to: '/admin/live' }
        ]
      }
    ]
  },
  {
    label: 'Registries & Audits',
    items: [
      {
        id: 'users',
        name: 'Identity & KYC',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>',
        children: [
          { name: 'All Profiles', to: '/admin/users' },
          { name: 'Verified Suppliers', to: '/admin/users/suppliers' },
          { name: 'Standard Buyers', to: '/admin/users/buyers' },
          { name: 'Dossiers Compliance', to: '/admin/users/verification' }
        ]
      },
      {
        id: 'catalog',
        name: 'Inventory Moderation',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>',
        children: [
          { name: 'Global Catalog', to: '/admin/products' },
          { name: 'Disputes Audit', to: '/admin/disputes' }
        ]
      }
    ]
  },
  {
    label: 'Finance Escrows',
    items: [
      {
        id: 'finance',
        name: 'Ledgers & Escrows',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
        children: [
          { name: 'Transactions Ledger', to: '/admin/finance/transactions' },
          { name: 'Withdrawal Clearance', to: '/admin/finance/withdrawals' },
          { name: 'Commission Metrics', to: '/admin/finance/commissions' },
          { name: 'Escrow Holdings', to: '/admin/finance/escrow' }
        ]
      }
    ]
  },
  {
    label: 'Platform Diagnostics',
    items: [
      {
        id: 'system',
        name: 'Server Administration',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>',
        children: [
          { name: 'Telemetry Loggers', to: '/admin/system/logs' },
          { name: 'System Queues', to: '/admin/system/queue' },
          { name: 'Database Backups', to: '/admin/system/backups' },
          { name: 'Hardware Diagnostics', to: '/admin/system/health' }
        ]
      },
      {
        id: 'settings',
        name: 'Metadata Variables',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>',
        children: [
          { name: 'General Parameters', to: '/admin/settings/general' },
          { name: 'Multi-Tenant Domains', to: '/admin/settings/tenants' },
          { name: 'Risk Rules Map', to: '/admin/settings/rules' },
          { name: 'SMTP Configurations', to: '/admin/settings/email' }
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

// Auto open containing dropdowns on load/path modification
function autoOpenDropdowns() {
  menuGroups.forEach(group => {
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
  toast.success('Admin session terminated. Root access keys disengaged.');
  router.push({ name: 'Login' });
}
</script>

<style scoped>
/* Scrollbar aesthetics */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #111a36;
  border-radius: 2px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #1d2b59;
}
</style>
