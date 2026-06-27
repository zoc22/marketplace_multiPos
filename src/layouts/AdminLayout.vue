<template>
  <div class="app-container h-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-sans relative select-none">
    
    <!-- MOBILE/TABLET HEADER PANEL -->
    <header class="lg:hidden flex items-center justify-between bg-[#0b132c] border-b border-slate-900 px-6 py-3.5 shrink-0 z-40 sticky top-0">
      <div class="flex items-center space-x-2">
        <KeyIcon class="h-6 w-6 text-red-500 animate-pulse" aria-hidden="true" />
        <span class="font-mono font-bold uppercase tracking-wider text-xs text-red-405">ADMIN CONTROL</span>
      </div>
      <button 
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        class="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-805 transition flex items-center justify-center"
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
      class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
    ></div>

    <!-- MAIN SIDEBAR PANELS (DESKTOP + MOBILE/TABLET DOCK) -->
    <aside 
      class="sidebar-container fixed inset-y-0 left-0 z-40 bg-[#090f23] border-r border-[#121c3b] flex flex-col transition-all duration-250 ease-in-out shrink-0 lg:transform-none lg:relative"
      :class="[
        isCollapsed ? 'lg:w-[72px]' : 'lg:w-[280px]',
        isMobileMenuOpen ? 'translate-x-0 w-full sm:w-[280px]' : '-translate-x-full lg:translate-x-0'
      ]"
      role="navigation"
      aria-label="Administrator main navigation"
    >
      <!-- BRAND TERMINAL IDENTITY -->
      <div class="h-16 border-b border-[#121c3b] px-4 flex items-center justify-between shrink-0 select-none bg-[#050814]">
        <div class="flex items-center space-x-2.5 truncate" v-show="!isCollapsed || isMobileMenuOpen">
          <KeyIcon class="h-6 w-6 text-red-500 shrink-0" aria-hidden="true" />
          <span class="font-bold text-slate-200 uppercase text-xs tracking-wider font-mono">ROOT CENTRAL</span>
        </div>
        <div class="flex justify-center w-full" v-show="isCollapsed && !isMobileMenuOpen">
          <KeyIcon class="h-6 w-6 text-red-500" aria-hidden="true" />
        </div>
        
        <!-- COLLAPSE TOGGLER -->
        <button 
          @click="isCollapsed = !isCollapsed"
          class="hidden lg:block p-1.5 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          :aria-label="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        >
          <span class="text-xs font-mono">{{ isCollapsed ? '&rarr;' : '&larr;' }}</span>
        </button>
      </div>

      <!-- ACTIVE SECURITY HUDS -->
      <div 
        class="m-4 p-4 bg-[#05091a] border border-red-950/45 text-sm shrink-0 select-none"
        v-show="!isCollapsed || isMobileMenuOpen"
      >
        <div class="text-[10px] uppercase font-mono text-[#FF5F00] tracking-wider font-bold mb-1">ROOT AUTH STATUS</div>
        <p class="font-semibold text-slate-200 truncate leading-tight">{{ authStore.user?.name || 'Supervisor' }}</p>
        <p class="text-xs font-mono text-red-400 mt-1.5 uppercase flex items-center space-x-1.5">
          <span class="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-ping"></span>
          <span>SYSTEM TERMINAL ROOT</span>
        </p>
      </div>

      <!-- COLLAPSED PROFILE AVATAR SHORTCUT -->
      <div 
        class="my-4 py-2 flex flex-col items-center border-b border-[#121c3b]/50 select-none group relative"
        v-show="isCollapsed && !isMobileMenuOpen"
      >
        <div class="h-10 w-10 bg-red-950 text-red-400 border border-red-900 flex items-center justify-center font-bold font-sans text-sm uppercase shadow">
          {{ authStore.user?.name ? authStore.user.name[0] : 'S' }}
        </div>
        <!-- Tooltip -->
        <div class="hidden group-hover:block absolute left-16 bg-slate-950 text-slate-205 font-mono text-xs uppercase border border-slate-800 p-2.5 shadow-xl z-50 whitespace-nowrap">
          Role: Platform Administrator
        </div>
      </div>

      <!-- SIDEBAR COMPILATION CONTAINER -->
      <nav class="flex-1 overflow-y-auto px-4 py-3 space-y-5 scrollbar-thin select-none">
        
        <!-- Foreach Side Menu Categories Group -->
        <div v-for="group in menuGroups" :key="group.label" class="space-y-2">
          
          <!-- Category Title -->
          <div 
            class="px-2 pb-1.5 text-xs uppercase font-mono tracking-widest text-slate-500 font-bold"
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
          <div v-for="item in group.items" :key="item.name" class="space-y-1">
            
            <!-- Standard link without kids -->
            <router-link 
              v-slot="{ href, navigate }"
              v-if="!item.children"
              :to="item.to"
              custom
            >
              <a 
                :href="href"
                @click="[navigate(), isMobileMenuOpen = false]"
                class="flex items-center px-3 py-2.5 text-base font-mono transition group relative cursor-pointer font-bold"
                :class="isRouteActive(item.to) ? 'bg-indigo-650 text-white font-bold border-l-2 border-indigo-400' : 'text-slate-400 hover:bg-slate-900/60 hover:text-white font-bold'"
              >
                <component :is="item.icon" class="h-6 w-6 mr-3 text-slate-400 group-hover:text-white shrink-0" aria-hidden="true" />
                <span v-show="!isCollapsed || isMobileMenuOpen" class="truncate font-bold">{{ item.name }}</span>

                <!-- Hover Tooltip if Collapsed -->
                <div 
                  v-show="isCollapsed && !isMobileMenuOpen" 
                  class="hidden group-hover:block absolute left-16 bg-slate-950 text-slate-350 border border-slate-800 p-2.5 shadow-xl font-mono text-xs uppercase z-50 whitespace-nowrap"
                >
                  {{ item.name }}
                </div>
              </a>
            </router-link>

            <!-- Interactive Dropdown parent block style -->
            <div v-else class="space-y-1">
              <button 
                @click="toggleDropdown(item.id)"
                class="w-full flex items-center justify-between px-3 py-2.5 text-base font-mono transition group relative text-left font-bold"
                :class="[
                  isDropdownContainingActive(item) ? 'text-indigo-400 font-bold bg-slate-900/20' : 'text-slate-400 hover:bg-slate-900/40 hover:text-white font-bold',
                ]"
                :aria-expanded="openDropdowns[item.id]"
              >
                <div class="flex items-center truncate">
                  <component :is="item.icon" class="h-6 w-6 mr-3 text-slate-400 group-hover:text-white shrink-0" aria-hidden="true" />
                  <span v-show="!isCollapsed || isMobileMenuOpen" class="truncate font-bold">{{ item.name }}</span>
                </div>

                <ChevronDownIcon 
                  v-show="!isCollapsed || isMobileMenuOpen" 
                  class="h-4 w-4 text-slate-500 transition-transform duration-250 shrink-0"
                  :class="openDropdowns[item.id] ? 'rotate-180' : ''"
                  aria-hidden="true"
                />

                <!-- Hover Tooltip if Collapsed -->
                <div 
                  v-show="isCollapsed && !isMobileMenuOpen" 
                  class="hidden group-hover:block absolute left-16 bg-slate-950 text-slate-350 border border-slate-800 p-2.5 shadow-xl font-mono text-xs uppercase z-50 whitespace-nowrap"
                >
                  {{ item.name }} (Submenu)
                </div>
              </button>

              <!-- Dropdown Children segment -->
              <div 
                v-show="openDropdowns[item.id] && (!isCollapsed || isMobileMenuOpen)" 
                class="pl-6 space-y-1 border-l border-[#121c3b]/50 ml-6 pr-1 py-1"
              >
                <router-link 
                  v-for="sub in item.children" 
                  :key="sub.name"
                  :to="sub.to"
                  class="block px-3 py-2 text-sm font-mono text-slate-400 hover:text-white hover:bg-slate-900/40 transition truncate font-bold"
                  :class="isRouteActive(sub.to) ? 'text-indigo-405 font-bold bg-[#0d1633] border-r border-indigo-500' : 'font-bold'"
                  @click="isMobileMenuOpen = false"
                >
                  <span class="font-bold">{{ sub.name }}</span>
                </router-link>
              </div>

            </div>

          </div>

        </div>

      </nav>

      <!-- COLLAPSE RECOVERY TOGGLE AT LOWER ROW (Collapsed state only) -->
      <div class="p-4 border-t border-[#121c3b] shrink-0" v-show="isCollapsed && !isMobileMenuOpen">
        <button 
          @click="isCollapsed = false"
          class="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-mono text-sm text-center block transition"
          aria-label="Expand menu"
        >
          &rarr;
        </button>
      </div>

      <!-- DISCONNECT CORE TERMINAL BUTTON -->
      <div class="p-4 border-t border-[#121c3b] shrink-0" v-show="!isCollapsed || isMobileMenuOpen">
        <button 
          @click="logoutSession"
          class="w-full py-2.5 bg-red-950/20 text-red-405 hover:bg-red-900 hover:text-slate-950 rounded-xl text-xs font-mono uppercase font-bold tracking-wider transition border border-red-900/30 flex justify-center items-center space-x-2"
          aria-label="Disconnect platform central portal"
        >
          <ArrowRightOnRectangleIcon class="h-5 w-5" aria-hidden="true" />
          <span>Disengage Console</span>
        </button>
      </div>

    </aside>

    <!-- CONTENT WORKSPACE WRAPPER -->
    <div class="page-container flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
      
      <!-- TOP STATUS NAVIGATION HEADER -->
      <header class="h-16 border-b border-[#121c3b] bg-[#070b19]/80 backdrop-blur px-6 flex items-center justify-between shrink-0 sticky top-0 z-10 select-none">
        
        <!-- BREADCRUMBS BAR (DYNAMIC) -->
        <div class="flex items-center space-x-2.5 text-base text-slate-455 font-mono tracking-tight font-medium truncate">
          <router-link to="/admin/dashboard" class="hover:text-indigo-400 transition uppercase">ROOT</router-link>
          
          <template v-for="(crumb, idx) in breadcrumbs" :key="crumb.to">
            <ChevronRightIcon class="h-4 w-4 text-slate-600 inline shrink-0" aria-hidden="true" />
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
          <!-- Notification Bell -->
          <NotificationBell />

          <!-- Mode Toggle & Keyboard Shortcuts -->
          <div class="flex items-center space-x-2 border-r border-[#121c3b] pr-4">
            <!-- Theme Toggle Button -->
            <button 
              @click="toggleTheme" 
              class="p-2 text-slate-400 hover:text-indigo-400 transition rounded flex items-center justify-center"
              :title="isLightTheme ? 'Passer en mode sombre (T)' : 'Passer en mode clair (T)'"
            >
              <SunIcon v-if="!isLightTheme" class="h-5 w-5 stroke-[2px]" aria-hidden="true" />
              <MoonIcon v-else class="h-5 w-5 stroke-[2px]" aria-hidden="true" />
            </button>

            <!-- Keyboard Shortcuts Button -->
            <button 
              @click="isHelpDrawerOpen = !isHelpDrawerOpen"
              class="p-2 text-slate-400 hover:text-indigo-400 transition rounded flex items-center justify-center"
              title="Raccourcis clavier & Diagnostics (H)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 stroke-[2.2px]">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 5.25h18c.414 0 .75.336.75.75v12c0 .414-.336.75-.75.75H3a.75.75 0 01-.75-.75V6c0-.414.336-.75.75-.75zm2.25 3.75h1.5v1.5h-1.5V9zm3.75 0h1.5v1.5H9V9zm3.75 0h1.5v1.5h-1.5V9zm3.75 0h1.5v1.5h-1.5V9zM5.25 12.75h1.5v1.5h-1.5v-1.5zm3.75 0h6v1.5H9v-1.5zm7.5 0h1.5v1.5h-1.5v-1.5z" />
              </svg>
            </button>
          </div>

          <div class="hidden sm:flex items-center space-x-2 bg-slate-950 border border-slate-900 rounded-none px-3 py-1.5 text-xs font-mono text-slate-400">
            <ShieldCheckIcon class="h-4.5 w-4.5 text-indigo-450" aria-hidden="true" />
            <span class="text-slate-500 uppercase">AUDIT PORT:</span>
            <span class="text-slate-300">ACTIVE</span>
          </div>

          <!-- Quick Disconnect shortcut -->
          <button 
            @click="logoutSession"
            class="text-xs font-mono text-red-400 hover:text-red-300 font-bold tracking-wider uppercase border border-red-905/50 bg-red-905/10 px-3 py-1.5 rounded transition"
            aria-label="Shutdown console session"
          >
            Terminal shutdown
          </button>
        </div>

      </header>

      <!-- DYNAMIC ROUTER PANEL SPACE -->
      <main class="flex-1 p-6 md:p-8 pb-44 md:pb-36">
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
import NotificationBell from '@/components/notifications/NotificationBell.vue';
import { 
  KeyIcon, 
  ChevronDownIcon, 
  ChevronRightIcon, 
  Bars3Icon, 
  XMarkIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  CommandLineIcon,
  UserIcon,
  DocumentTextIcon,
  CreditCardIcon,
  CpuChipIcon,
  Cog6ToothIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/vue/24/outline';
import { useTheme } from '@/composables/useTheme.js';
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts.js';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const toast = useToast();
const { isLightTheme, toggleTheme } = useTheme();
const { isHelpDrawerOpen } = useKeyboardShortcuts();

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

// Sidebar menu structure with Heroicons components
const menuGroups = [
  {
    label: 'Platform Core',
    items: [
      {
        id: 'console',
        name: 'Console Dashboard',
        icon: CommandLineIcon,
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
        icon: UserIcon,
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
        icon: DocumentTextIcon,
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
        icon: CreditCardIcon,
        children: [
          { name: 'Transactions Ledger', to: '/admin/finance/transactions' },
          { name: 'Withdrawal Clearance', to: '/admin/finance/withdrawals' },
          { name: 'Commission Metrics', to: '/admin/finance/commissions' },
          { name: 'Escrow Holdings', to: '/admin/escrow' }
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
        icon: CpuChipIcon,
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
        icon: Cog6ToothIcon,
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
  background: #111a36;
  border-radius: 2px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #1d2b59;
}
</style>
