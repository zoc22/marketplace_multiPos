<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans relative overflow-x-hidden select-none">
    
    <!-- MOBILE HEADER PANEL -->
    <header class="md:hidden flex items-center justify-between bg-[#0b132c] border-b border-indigo-950 px-4 py-3 shrink-0 z-40 sticky top-0 bg-opacity-95 backdrop-blur">
      <div class="flex items-center space-x-2">
        <span class="text-lg">{{ activeTenant?.logo || '🏢' }}</span>
        <span class="font-mono font-bold uppercase tracking-wider text-xs text-indigo-400">
          {{ activeTenant?.name || 'MERCHANT PORTAL' }}
        </span>
      </div>
      <button 
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        class="p-1 px-2.5 bg-[#0e1633] hover:bg-[#15204c] text-indigo-300 rounded border border-indigo-900 transition"
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
      class="fixed inset-y-0 left-0 transform md:transform-none md:relative z-40 bg-[#070b1a] border-r border-[#15204c]/80 flex flex-col transition-all duration-300 ease-in-out shrink-0"
      :class="[
        isCollapsed ? 'md:w-16' : 'md:w-64',
        isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
      ]"
    >
      <!-- BRAND TERMINAL IDENTITY & ACTIVE TENANT HUD -->
      <div class="h-14 border-b border-[#15204c]/80 px-4 flex items-center justify-between shrink-0 select-none bg-[#050814]">
        <div class="flex items-center space-x-2 truncate" v-show="!isCollapsed || isMobileMenuOpen">
          <span class="text-base shrink-0">{{ activeTenant?.logo || '⚡' }}</span>
          <div class="truncate">
            <span class="font-bold text-slate-200 uppercase text-xs tracking-wider font-mono block truncate">{{ activeTenant?.name || 'COOP CONSOLE' }}</span>
            <span class="text-[8px] text-indigo-400 font-mono block truncate">{{ activeTenant?.domain || 'enterprise.local' }}</span>
          </div>
        </div>
        
        <div class="flex justify-center w-full" v-show="isCollapsed && !isMobileMenuOpen">
          <span class="text-indigo-400 font-bold font-mono text-base">{{ activeTenant?.logo || '⚡' }}</span>
        </div>
        
        <!-- COLLAPSE TOGGLER -->
        <button 
          @click="isCollapsed = !isCollapsed"
          class="hidden md:block p-1 bg-slate-900/60 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition"
        >
          <span class="text-[10px] font-mono">&larr;</span>
        </button>
      </div>

      <!-- SIMULATED MULTI-TENANCY SWITCHER -->
      <div 
        class="mx-3 my-2.5 p-2 bg-[#0d1533]/85 rounded-xl border border-indigo-950 text-xs shrink-0 select-none"
        v-show="!isCollapsed || isMobileMenuOpen"
      >
        <label class="block text-[8px] uppercase font-mono text-indigo-400 tracking-wider font-medium mb-1">
          Switch Tenant (Stancl)
        </label>
        <select 
          :value="authStore.currentSubdomain"
          @change="onTenantChanged($event.target.value)"
          class="w-full bg-[#070b19] border border-indigo-900/60 rounded px-1.5 py-1 text-[11px] font-mono text-slate-200 accent-indigo-500 focus:outline-none focus:border-indigo-500"
        >
          <option 
            v-for="tenant in availableTenants" 
            :key="tenant.id" 
            :value="tenant.id"
          >
            {{ tenant.logo }} {{ tenant.name }}
          </option>
        </select>
      </div>

      <!-- ACTIVE SECURITY HUDS / CLEARANCES -->
      <div 
        class="mx-3 mb-3 p-3 bg-slate-950/80 rounded-xl border border-indigo-900/30 text-xs shrink-0 select-none"
        v-show="!isCollapsed || isMobileMenuOpen"
      >
        <div class="text-[8px] uppercase font-mono text-indigo-400 tracking-wider font-bold">USER ID / CREDENTIALS</div>
        <p class="font-bold text-slate-300 truncate leading-tight mt-0.5">
          {{ authStore.user?.name || 'Operator' }}
        </p>
        <div class="mt-1.5 pt-1.5 border-t border-slate-900 space-y-0.5">
          <div class="text-[7.5px] uppercase font-mono text-slate-500 font-bold">ACTIVE ASSIGNED PERMISSIONS</div>
          <div class="flex flex-wrap gap-1 mt-1">
            <span 
              v-for="perm in activePermissions" 
              :key="perm"
              class="text-[7.5px] font-mono bg-indigo-955 text-indigo-400 px-1 py-0.2 rounded border border-indigo-900/40 uppercase"
            >
              {{ perm.replace('_', ' ') }}
            </span>
            <span v-if="activePermissions.length === 0" class="text-[8px] font-mono text-amber-500">
              NO PERMISSIONS ASSIGNED
            </span>
          </div>
        </div>
      </div>

      <!-- COLLAPSED PROFILE AVATAR SHORTCUT -->
      <div 
        class="my-3 py-2 flex flex-col items-center border-b border-[#15204c]/40 select-none group relative"
        v-show="isCollapsed && !isMobileMenuOpen"
      >
        <div class="h-8 w-8 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-900 flex items-center justify-center font-bold font-sans text-xs uppercase shadow">
          {{ authStore.user?.name ? authStore.user.name[0] : 'S' }}
        </div>
        <!-- Tooltip -->
        <div class="hidden group-hover:block absolute left-14 bg-slate-950 text-slate-200 font-mono text-[10px] uppercase border border-slate-800 p-2 rounded shadow-xl z-50 whitespace-nowrap">
          Supplier Business Controller
        </div>
      </div>

      <!-- SIDEBAR COMPILATION CONTAINER -->
      <nav class="flex-1 overflow-y-auto px-3 py-2 space-y-4 scrollbar-thin select-none">
        
        <!-- Iterate menu groups, filter out groups/items with no permission -->
        <div v-for="group in filteredMenu" :key="group.label" class="space-y-1">
          
          <!-- Category Title -->
          <div 
            class="px-2 pb-1 text-[8px] uppercase font-mono tracking-widest text-[#5d6a94] font-bold"
            v-show="!isCollapsed || isMobileMenuOpen"
          >
            {{ group.label }}
          </div>

          <!-- Category Division Dot when collapsed -->
          <div 
            class="h-px bg-slate-900 my-2 mx-1" 
            v-show="isCollapsed && !isMobileMenuOpen"
          ></div>

          <!-- Loop Items -->
          <div v-for="item in group.items" :key="item.name" class="space-y-0.5">
            
            <!-- Standard link without kids -->
            <router-link 
              v-if="!item.children"
              :to="item.to"
              class="flex items-center rounded-lg px-2.5 py-2 text-xs font-mono transition group relative"
              :class="isRouteActive(item.to) ? 'bg-[#1e1b4b] text-[#c084fc] font-bold border-l-2 border-[#a855f7]' : 'text-slate-400 hover:bg-[#0f172a] hover:text-white'"
              @click="isMobileMenuOpen = false"
            >
              <!-- Icon segment -->
              <span class="w-5 h-5 mr-2.5 text-[#546296] group-hover:text-white flex items-center justify-center shrink-0" v-html="item.icon"></span>
              
              <!-- Tag description -->
              <span v-show="!isCollapsed || isMobileMenuOpen" class="truncate">{{ item.name }}</span>

              <!-- Hover Tooltip if Collapsed -->
              <div 
                v-show="isCollapsed && !isMobileMenuOpen" 
                class="hidden group-hover:block absolute left-14 bg-slate-950 text-slate-350 border border-slate-800 p-1.5 rounded shadow-xl font-mono text-[9px] uppercase z-50 whitespace-nowrap"
              >
                {{ item.name }}
              </div>
            </router-link>

            <!-- Interactive Dropdown parent block-->
            <div v-else class="space-y-0.5">
              <button 
                @click="toggleDropdown(item.id)"
                class="w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-mono transition group relative text-left"
                :class="[
                  isDropdownContainingActive(item) ? 'text-indigo-400 font-semibold bg-[#0a0f24]' : 'text-slate-400 hover:bg-[#0b1029] hover:text-white',
                ]"
              >
                <div class="flex items-center truncate">
                  <span class="w-5 h-5 mr-2.5 text-[#546296] group-hover:text-white flex items-center justify-center shrink-0" v-html="item.icon"></span>
                  <span v-show="!isCollapsed || isMobileMenuOpen" class="truncate">{{ item.name }}</span>
                </div>

                <!-- Expansion carets -->
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

              <!-- Dropdown Children Segment -->
              <div 
                v-show="openDropdowns[item.id] && (!isCollapsed || isMobileMenuOpen)" 
                class="pl-6 space-y-0.5 border-l border-[#1b254a] ml-5 pr-1 py-1"
              >
                <router-link 
                  v-for="sub in item.children" 
                  :key="sub.name"
                  :to="sub.to"
                  class="block px-3 py-1.5 rounded-md text-[11px] font-mono text-slate-450 hover:text-white hover:bg-slate-900/50 transition truncate"
                  :class="isRouteActive(sub.to) ? 'text-indigo-400 font-bold bg-[#0d1633] border-r border-indigo-500' : ''"
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
      <div class="p-3 border-t border-[#121c3b]" v-show="isCollapsed && !isMobileMenuOpen">
        <button 
          @click="isCollapsed = false"
          class="w-full py-1 bg-slate-900 hover:bg-slate-800 rounded text-slate-400 hover:text-white font-mono text-xs text-center block transition"
        >
          &rarr;
        </button>
      </div>

      <!-- DISCONNECT CORE TERMINAL BUTTON -->
      <div class="p-3 border-t border-indigo-950 shrink-0" v-show="!isCollapsed || isMobileMenuOpen">
        <button 
          @click="logoutSession"
          class="w-full py-2 bg-indigo-950/20 text-indigo-400 hover:bg-indigo-900 hover:text-slate-950 rounded-xl text-[10px] font-mono uppercase font-bold tracking-wider transition border border-indigo-900/30 flex justify-center items-center space-x-2"
        >
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" />
          </svg>
          <span>Sign Out Desk</span>
        </button>
      </div>

    </aside>

    <!-- CONTENT WORKSPACE WRAPPER -->
    <div class="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
      
      <!-- TOP STATUS NAVIGATION HEADER -->
      <header class="h-14 border-b border-[#15204c]/60 bg-[#070b1a]/90 backdrop-blur px-6 flex items-center justify-between shrink-0 sticky top-0 z-10 select-none">
        
        <!-- BREADCRUMBS BAR (DYNAMIC) -->
        <div class="flex items-center space-x-2.5 text-xs text-slate-450 font-mono tracking-tight font-medium truncate">
          <router-link to="/supplier/dashboard" class="hover:text-indigo-400 transition uppercase">MERCHANT</router-link>
          
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
            <span class="text-slate-650 uppercase">TENANT CLEARANCE LEVEL:</span>
            <span class="text-emerald-400 uppercase font-bold">{{ activeTenant?.active ? 'ACTIVE WORKSPACE' : 'APPROVAL DEMANDED' }}</span>
          </div>

          <!-- Quick Disconnect shortcut -->
          <button 
            @click="logoutSession"
            class="text-[10px] font-mono text-slate-400 hover:text-white font-bold tracking-wider uppercase border border-slate-900 bg-slate-900 px-2.5 py-1 rounded transition"
          >
            Switch Operators
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
  products: false,
  warehouses: false,
  orders: false,
  purchases: false,
  rfq: false,
  finance: false,
  team: false
});

const activeTenant = computed(() => {
  return authStore.tenants.find(t => t.id === authStore.currentSubdomain);
});

const availableTenants = computed(() => {
  // Return tenants matching standard credentials list to allow multi-tenant switching demo
  return authStore.tenants;
});

const activePermissions = computed(() => {
  if (!authStore.user || !authStore.currentSubdomain) return [];
  return authStore.user.tenantPermissions?.[authStore.currentSubdomain] || [];
});

function hasPermission(permission) {
  if (!permission) return true;
  return activePermissions.value.includes(permission);
}

// Side Menu Category details
const rawMenuStructure = [
  {
    label: 'Overview & Corporate',
    items: [
      {
        id: 'dashboard',
        name: 'Executive Dashboard',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
        children: [
          { name: 'Workspace Panel', to: '/supplier/dashboard' },
          { name: 'Corporate KPIs', to: '/supplier/kpis' },
          { name: 'Sales Analytics', to: '/supplier/analytics' },
          { name: 'Balance Earnings', to: '/supplier/earnings' }
        ]
      }
    ]
  },
  {
    label: 'Inventory Control',
    permission: 'manage_stock',
    items: [
      {
        id: 'products',
        name: 'Catalog Products',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>',
        children: [
          { name: 'All Products', to: '/supplier/products' },
          { name: 'Replenishement Stock', to: '/supplier/products/stock' },
          { name: 'Register Product', to: '/supplier/products/create' },
          { name: 'Catalog Import', to: '/supplier/products/import' },
          { name: 'Category Map', to: '/supplier/products/categories' }
        ]
      },
      {
        id: 'warehouses',
        name: 'Storage Warehouses',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>',
        children: [
          { name: 'Active Warehouses', to: '/supplier/warehouses' },
          { name: 'Add Warehouse Unit', to: '/supplier/warehouses/create' },
          { name: 'Stock Transfers', to: '/supplier/warehouses/transfers' },
          { name: 'Adjustments Logs', to: '/supplier/warehouses/adjustments' }
        ]
      }
    ]
  },
  {
    label: 'Demands & Shipments',
    permission: 'approve_orders',
    items: [
      {
        id: 'orders',
        name: 'Client Orders Dispatch',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>',
        children: [
          { name: 'Incoming Orders List', to: '/supplier/orders' },
          { name: 'Package Shipping Tickets', to: '/supplier/orders/shipping-labels' }
        ]
      },
      {
        id: 'logistics',
        name: 'Outbound Logistics',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>',
        to: '/supplier/logistics'
      }
    ]
  },
  {
    label: 'Retail POS Channels',
    permission: 'manage_stock',
    items: [
      {
        id: 'stores',
        name: 'Physical Stores & POS',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12H3m18-6H3m14 12H7V8h10v10z" /></svg>',
        to: '/supplier/stores'
      }
    ]
  },
  {
    label: 'Supply Procurement',
    permission: 'issue_rfq',
    items: [
      {
        id: 'purchases',
        name: 'Restock Purchases PO',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>',
        children: [
          { name: 'Supplier Purchases', to: '/supplier/purchases' },
          { name: 'Draft Purchase Order', to: '/supplier/purchases/create' },
          { name: 'Receipt Delivery Checks', to: '/supplier/purchases/receive' },
          { name: 'Return PO Logistics', to: '/supplier/purchases/returns' }
        ]
      },
      {
        id: 'rfq',
        name: 'Global RFQs System',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>',
        children: [
          { name: 'Inbound Requests Received', to: '/supplier/rfq/received' },
          { name: 'Sent RFQs Invitations', to: '/supplier/rfq/sent' },
          { name: 'Financial Offers Evaluated', to: '/supplier/rfq/offers' },
          { name: 'Draft Outbound RFQ', to: '/supplier/rfq/create' }
        ]
      }
    ]
  },
  {
    label: 'Corporate Ledgers',
    permission: 'view_ledger',
    items: [
      {
        id: 'finance',
        name: 'Finance Books & Auditing',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
        children: [
          { name: 'Corporate Transactions stream', to: '/supplier/finance/transactions' },
          { name: 'Withdrawing Reserves Request', to: '/supplier/finance/withdrawals' },
          { name: 'Platform Commissions History', to: '/supplier/finance/commissions' },
          { name: 'Tax invoices Ledger', to: '/supplier/finance/invoices' },
          { name: 'Balance sheets and Ledgers', to: '/supplier/finance/balance' }
        ]
      },
      {
        id: 'expenses',
        name: 'Operational Expenses',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>',
        children: [
          { name: 'Business Expenses', to: '/supplier/expenses' },
          { name: 'Expense Category metrics', to: '/supplier/expenses/categories' }
        ]
      }
    ]
  },
  {
    label: 'Corporate Staff',
    permission: 'edit_team',
    items: [
      {
        id: 'team',
        name: 'Staff & Authority Roles',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>',
        children: [
          { name: 'Staff List', to: '/supplier/team' },
          { name: 'Predefined Roles mapping', to: '/supplier/team/roles' },
          { name: 'Simulate Permissions logs', to: '/supplier/team/permissions' }
        ]
      }
    ]
  },
  {
    label: 'Tenant Settings',
    items: [
      {
        id: 'settings',
        name: 'Merchant Settings',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>',
        children: [
          { name: 'Company Identity Profile', to: '/supplier/settings/general' },
          { name: 'Shipping matrix fees', to: '/supplier/settings/shipping' },
          { name: 'Secure Payments Options', to: '/supplier/settings/payments' },
          { name: 'Tax Rates Parameters', to: '/supplier/settings/taxes' },
          { name: 'Legal terms documents', to: '/supplier/settings/legal' }
        ]
      }
    ]
  }
];

// Computed list filtering menu items based on actual reactive permissions in authStore!
const filteredMenu = computed(() => {
  return rawMenuStructure
    .filter(group => {
      // If group has a constraint, check if user has permission
      if (group.permission && !hasPermission(group.permission)) return false;
      return true;
    })
    .map(group => {
      // Also filter individual items is they require special permissions (which is matching nicely)
      return {
        ...group,
        items: group.items.filter(item => {
          if (item.permission && !hasPermission(item.permission)) return false;
          return true;
        })
      };
    })
    .filter(group => group.items.length > 0);
});

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
  rawMenuStructure.forEach(group => {
    group.items.forEach(item => {
      if (item.children && isDropdownContainingActive(item)) {
        openDropdowns.value[item.id] = true;
      }
    });
  });
}

function onTenantChanged(tenantId) {
  authStore.switchTenant(tenantId);
  toast.info(`Switched Active Tenant Context to ${tenantId.toUpperCase()}`);
  router.push({ name: 'SupplierDashboard' });
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
  toast.success('Supplier session terminated securely.');
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
  background: #15204c;
  border-radius: 2px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #23347c;
}
</style>
