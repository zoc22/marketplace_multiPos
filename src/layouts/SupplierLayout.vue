<template>
  <div class="app-container min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] flex flex-col lg:flex-row font-sans relative overflow-x-hidden select-none">
    
    <!-- MOBILE/TABLET HEADER PANEL -->
    <header class="lg:hidden flex items-center justify-between bg-[var(--color-surface)] border-b border-[var(--color-border)] px-6 py-3.5 shrink-0 z-40 sticky top-0 bg-opacity-95 backdrop-blur">
      <div class="flex items-center space-x-2">
        <BuildingOfficeIcon class="h-6 w-6 text-[var(--color-primary)]" aria-hidden="true" />
        <span class="font-bold capitalize tracking-wider text-sm text-[var(--color-primary)]">
          TechSupplies
        </span>
      </div>
      <button 
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        class="p-2 bg-[var(--color-surface-elevated)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] border border-[var(--color-border)] transition flex items-center justify-center rounded-md"
        :aria-label="isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
      >
        <Bars3Icon v-if="!isMobileMenuOpen" class="h-6 w-6" aria-hidden="true" />
        <XMarkIcon v-else class="h-6 w-6" aria-hidden="true" />
      </button>
    </header>

    <!-- MOBILE & TABLET NAVIGATION SIDEBAR DRAWER OVERLAY -->
    <div 
      v-if="isMobileMenuOpen" 
      @click="isMobileMenuOpen = false"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
    ></div>

    <!-- MAIN SIDEBAR PANELS (DESKTOP + MOBILE/TABLET DOCK) -->
    <aside 
      class="sidebar-container fixed inset-y-0 left-0 z-40 bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col transition-all duration-250 ease-in-out shrink-0 lg:transform-none lg:relative"
      :class="[
        isCollapsed ? 'lg:w-[80px]' : 'lg:w-[320px]',
        isMobileMenuOpen ? 'translate-x-0 w-full sm:w-[320px]' : '-translate-x-full lg:translate-x-0'
      ]"
      role="navigation"
      aria-label="Navigation principale fournisseur"
    >
      <!-- BRAND IDENTITY -->
      <div class="h-16 border-b border-[var(--color-border)] px-4 flex items-center justify-between shrink-0 select-none bg-[var(--color-surface-elevated)]">
        <div class="flex items-center space-x-2.5 truncate" v-show="!isCollapsed || isMobileMenuOpen">
          <BuildingOfficeIcon class="h-6 w-6 text-[var(--color-primary)] shrink-0" aria-hidden="true" />
          <div class="truncate">
            <span class="font-bold text-[var(--color-text-primary)] capitalize text-base tracking-wider block truncate">TechSupplies</span>
            <span class="text-xs text-[var(--color-text-secondary)] block truncate">Espace Fournisseur</span>
          </div>
        </div>
        
        <div class="flex justify-center w-full" v-show="isCollapsed && !isMobileMenuOpen">
          <BuildingOfficeIcon class="h-6 w-6 text-[var(--color-primary)]" aria-hidden="true" />
        </div>
        
        <!-- COLLAPSE TOGGLER -->
        <button 
          @click="isCollapsed = !isCollapsed"
          class="hidden lg:flex p-2 bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-muted)] transition rounded-lg shadow-sm items-center justify-center"
          :aria-label="isCollapsed ? 'Développer la barre latérale' : 'Réduire la barre latérale'"
        >
          <svg v-if="!isCollapsed" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      <!-- COLLAPSED PROFILE AVATAR SHORTCUT -->
      <div 
        class="my-4 py-2 flex flex-col items-center border-b border-[var(--color-border)] select-none group relative"
        v-show="isCollapsed && !isMobileMenuOpen"
      >
        <div class="h-10 w-10 bg-[var(--color-primary-muted)] text-[var(--color-primary)] border border-[var(--color-primary-border)] flex items-center justify-center font-bold text-sm rounded-full shadow">
          {{ authStore.user?.name ? authStore.user.name[0].toUpperCase() : 'F' }}
        </div>
        <!-- Tooltip -->
        <div class="hidden group-hover:block absolute left-16 bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] text-xs border border-[var(--color-border)] p-2.5 shadow-xl z-50 whitespace-nowrap rounded-md">
          Fournisseur
        </div>
      </div>

      <!-- SIDEBAR COMPILATION CONTAINER -->
      <nav class="flex-1 overflow-y-auto px-4 py-3 space-y-5 scrollbar-thin select-none">
        
        <!-- Iterate menu groups -->
        <div v-for="group in filteredMenu" :key="group.label" class="space-y-2">
          
          <!-- Category Title -->
          <div 
            class="px-2 pb-1.5 text-xs font-semibold tracking-wider text-[var(--color-text-muted)]"
            v-show="!isCollapsed || isMobileMenuOpen"
          >
            {{ group.label }}
          </div>

          <!-- Category Division Dot when collapsed -->
          <div 
            class="h-px bg-[var(--color-border)] my-2 mx-1" 
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
                class="flex items-center px-3 py-2.5 text-sm transition group relative cursor-pointer rounded-lg"
                :class="isRouteActive(item.to) ? 'bg-[var(--color-primary-muted)] text-[var(--color-primary)] font-semibold' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]'"
              >
                <component :is="item.icon" class="h-5 w-5 mr-3 shrink-0" :class="isRouteActive(item.to) ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)]'" aria-hidden="true" />
                <span v-show="!isCollapsed || isMobileMenuOpen" class="truncate">{{ item.name }}</span>
                
                <!-- Hover Tooltip if Collapsed -->
                <div 
                  v-show="isCollapsed && !isMobileMenuOpen" 
                  class="hidden group-hover:block absolute left-16 bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] border border-[var(--color-border)] p-2.5 shadow-xl text-xs z-50 whitespace-nowrap rounded-md"
                >
                  {{ item.name }}
                </div>
              </a>
            </router-link>

            <!-- Interactive Dropdown parent block-->
            <div v-else class="space-y-1">
              <button 
                @click="toggleDropdown(item.id)"
                class="w-full flex items-center justify-between px-3 py-2.5 text-sm transition group relative text-left rounded-lg"
                :class="[
                  isDropdownContainingActive(item) ? 'text-[var(--color-primary)] font-semibold bg-[var(--color-surface-hover)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]',
                ]"
                :aria-expanded="openDropdowns[item.id]"
              >
                <div class="flex items-center truncate">
                  <component :is="item.icon" class="h-5 w-5 mr-3 shrink-0" :class="isDropdownContainingActive(item) ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)]'" aria-hidden="true" />
                  <span v-show="!isCollapsed || isMobileMenuOpen" class="truncate">{{ item.name }}</span>
                </div>

                <ChevronDownIcon 
                  v-show="!isCollapsed || isMobileMenuOpen" 
                  class="h-4 w-4 transition-transform duration-250 shrink-0"
                  :class="openDropdowns[item.id] ? 'rotate-180 text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'"
                  aria-hidden="true"
                />

                <!-- Hover Tooltip if Collapsed -->
                <div 
                  v-show="isCollapsed && !isMobileMenuOpen" 
                  class="hidden group-hover:block absolute left-16 bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] border border-[var(--color-border)] p-2.5 shadow-xl text-xs z-50 whitespace-nowrap rounded-md"
                >
                  {{ item.name }} (Sous-menu)
                </div>
              </button>

              <!-- Dropdown Children Segment -->
              <div 
                v-show="openDropdowns[item.id] && (!isCollapsed || isMobileMenuOpen)" 
                class="pl-6 space-y-1 border-l border-[var(--color-border)] ml-5 py-1"
              >
                <router-link 
                  v-for="sub in item.children" 
                  :key="sub.name"
                  :to="sub.to"
                  class="block px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-hover)] transition truncate rounded-lg"
                  :class="isRouteActive(sub.to) ? 'text-[var(--color-primary)] font-semibold bg-[var(--color-primary-muted)]' : ''"
                  @click="isMobileMenuOpen = false"
                >
                  {{ sub.name }}
                </router-link>
              </div>

            </div>

          </div>

        </div>

      </nav>

      <!-- COLLAPSE RECOVERY TOGGLE AT LOWER ROW (Collapsed state only) -->
      <div class="p-4 border-t border-[var(--color-border)]" v-show="isCollapsed && !isMobileMenuOpen">
        <button 
          @click="isCollapsed = false"
          class="w-full py-2.5 hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] text-sm text-center block transition rounded-md"
          aria-label="Développer le menu"
        >
          &rarr;
        </button>
      </div>

      <!-- DISCONNECT CORE TERMINAL BUTTON -->
      <div class="p-4 border-t border-[var(--color-border)] shrink-0" v-show="!isCollapsed || isMobileMenuOpen">
        <button 
          @click="logoutSession"
          class="w-full py-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-sm font-semibold transition border border-red-500/30 flex justify-center items-center space-x-2"
          aria-label="Se déconnecter"
        >
          <ArrowRightOnRectangleIcon class="h-5 w-5" aria-hidden="true" />
          <span>Se déconnecter</span>
        </button>
      </div>

    </aside>

    <!-- CONTENT WORKSPACE WRAPPER -->
    <div class="page-container flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen bg-[var(--color-background)]">
      
      <!-- TOP STATUS NAVIGATION HEADER -->
      <header class="h-16 border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur px-6 flex items-center justify-between shrink-0 sticky top-0 z-10 select-none shadow-sm">
        
        <!-- BREADCRUMBS BAR (DYNAMIC) -->
        <div class="flex items-center space-x-2 text-sm text-[var(--color-text-secondary)] font-medium truncate">
          <router-link to="/supplier/dashboard" class="hover:text-[var(--color-primary)] transition">Fournisseur</router-link>
          
          <template v-for="(crumb, idx) in breadcrumbs" :key="crumb.to">
            <ChevronRightIcon class="h-4 w-4 text-[var(--color-text-muted)] inline shrink-0" aria-hidden="true" />
            <span 
              v-if="crumb.current" 
              class="text-[var(--color-text-primary)] font-semibold truncate capitalize"
            >
              {{ crumb.text }}
            </span>
            <router-link 
              v-else 
              :to="crumb.to" 
              class="hover:text-[var(--color-primary)] transition truncate max-w-[150px] capitalize"
            >
              {{ crumb.text }}
            </router-link>
          </template>
        </div>

        <!-- SEARCH BAR AND UTILITIES -->
        <div class="flex items-center space-x-4">
          <!-- User Profile Icon / Status -->
          <div class="flex items-center space-x-3">
            <div class="hidden sm:flex flex-col items-end">
              <span class="text-sm font-semibold text-[var(--color-text-primary)] leading-none">{{ authStore.user?.name || 'Fournisseur' }}</span>
              <span class="text-xs text-emerald-500 mt-1 flex items-center"><span class="h-2 w-2 rounded-full bg-emerald-500 mr-1.5"></span>En ligne</span>
            </div>
            <div class="h-9 w-9 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold shadow cursor-pointer border-2 border-[var(--color-surface)] ring-2 ring-[var(--color-primary-muted)]">
              {{ authStore.user?.name ? authStore.user.name[0].toUpperCase() : 'F' }}
            </div>
          </div>
        </div>

      </header>

      <!-- DYNAMIC ROUTER PANEL SPACE -->
      <main class="flex-1 p-6 md:p-8">
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
  BuildingOfficeIcon, 
  ChevronDownIcon, 
  ChevronRightIcon, 
  Bars3Icon, 
  XMarkIcon, 
  ArrowRightOnRectangleIcon,
  ShoppingCartIcon,
  Squares2X2Icon,
  DocumentTextIcon,
  CreditCardIcon,
  TagIcon,
  InboxIcon,
  GlobeAltIcon,
  UserGroupIcon,
  Cog6ToothIcon
} from '@heroicons/vue/24/outline';

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

const activePermissions = computed(() => {
  if (!authStore.user || !authStore.currentSubdomain) return [];
  return authStore.user.tenantPermissions?.[authStore.currentSubdomain] || [];
});

function hasPermission(permission) {
  if (!permission) return true;
  return activePermissions.value.includes(permission);
}

// Menu structure translated to French
const rawMenuStructure = [
  {
    label: 'Aperçu & Tableau de Bord',
    items: [
      {
        id: 'dashboard',
        name: 'Tableau de Bord',
        icon: Squares2X2Icon,
        children: [
          { name: 'Vue d\'ensemble', to: '/supplier/dashboard' },
          { name: 'Indicateurs clés (KPI)', to: '/supplier/kpis' },
          { name: 'Analytique des Ventes', to: '/supplier/analytics' },
          { name: 'Gains & Revenus', to: '/supplier/earnings' }
        ]
      }
    ]
  },
  {
    label: 'Gestion des Stocks',
    permission: 'manage_stock',
    items: [
      {
        id: 'products',
        name: 'Catalogue Produits',
        icon: DocumentTextIcon,
        children: [
          { name: 'Tous les produits', to: '/supplier/products' },
          { name: 'Réapprovisionnement', to: '/supplier/products/stock' },
          { name: 'Nouveau produit', to: '/supplier/products/create' },
          { name: 'Import catalogue', to: '/supplier/products/import' },
          { name: 'Catégories', to: '/supplier/products/categories' }
        ]
      },
      {
        id: 'warehouses',
        name: 'Entrepôts',
        icon: BuildingOfficeIcon,
        children: [
          { name: 'Entrepôts actifs', to: '/supplier/warehouses' },
          { name: 'Ajouter un entrepôt', to: '/supplier/warehouses/create' },
          { name: 'Transferts de stock', to: '/supplier/warehouses/transfers' },
          { name: 'Ajustements de stock', to: '/supplier/warehouses/adjustments' }
        ]
      }
    ]
  },
  {
    label: 'Commandes & Expéditions',
    permission: 'approve_orders',
    items: [
      {
        id: 'orders',
        name: 'Commandes Clients',
        icon: ShoppingCartIcon,
        children: [
          { name: 'Liste des commandes', to: '/supplier/orders' },
          { name: 'Bordereaux d\'expédition', to: '/supplier/orders/shipping-labels' }
        ]
      }
    ]
  },
  {
    label: 'Réseau Physique',
    permission: 'manage_stock',
    items: [
      {
        id: 'stores',
        name: 'Boutiques & Points de Vente',
        icon: GlobeAltIcon,
        to: '/supplier/stores'
      }
    ]
  },
  {
    label: 'Achats & Fournisseurs',
    permission: 'issue_rfq',
    items: [
      {
        id: 'suppliers',
        name: 'Fournisseurs B2B',
        icon: UserGroupIcon,
        children: [
          { name: 'Liste des fournisseurs', to: '/supplier/suppliers' },
          { name: 'Ajouter un fournisseur', to: '/supplier/suppliers/create' }
        ]
      },
      {
        id: 'purchases',
        name: 'Bons de Commande',
        icon: TagIcon,
        children: [
          { name: 'Toutes les commandes', to: '/supplier/purchases' },
          { name: 'Nouveau bon', to: '/supplier/purchases/create' },
          { name: 'Bons de livraison', to: '/supplier/purchases/delivery-notes' },
          { name: 'Retours fournisseurs', to: '/supplier/purchases/returns' }
        ]
      },
      {
        id: 'rfq',
        name: 'Demandes de Devis (RFQ)',
        icon: InboxIcon,
        children: [
          { name: 'Devis reçus', to: '/supplier/rfq/received' },
          { name: 'Devis envoyés', to: '/supplier/rfq/sent' },
          { name: 'Offres évaluées', to: '/supplier/rfq/offers' },
          { name: 'Nouvelle demande', to: '/supplier/rfq/create' }
        ]
      }
    ]
  },
  {
    label: 'Finances',
    permission: 'view_ledger',
    items: [
      {
        id: 'finance',
        name: 'Trésorerie & Factures',
        icon: CreditCardIcon,
        children: [
          { name: 'Transactions', to: '/supplier/finance/transactions' },
          { name: 'Retraits', to: '/supplier/finance/withdrawals' },
          { name: 'Commissions', to: '/supplier/finance/commissions' },
          { name: 'Factures', to: '/supplier/finance/invoices' },
          { name: 'Bilan', to: '/supplier/finance/balance' }
        ]
      },
      {
        id: 'expenses',
        name: 'Dépenses',
        icon: DocumentTextIcon,
        children: [
          { name: 'Dépenses opérationnelles', to: '/supplier/expenses' },
          { name: 'Indicateurs par catégorie', to: '/supplier/expenses/categories' }
        ]
      }
    ]
  },
  {
    label: 'Équipe',
    permission: 'edit_team',
    items: [
      {
        id: 'team',
        name: 'Membres & Rôles',
        icon: UserGroupIcon,
        children: [
          { name: 'Liste du personnel', to: '/supplier/team' },
          { name: 'Gestion des rôles', to: '/supplier/team/roles' },
          { name: 'Historique des permissions', to: '/supplier/team/permissions' }
        ]
      }
    ]
  },
  {
    label: 'Paramètres',
    items: [
      {
        id: 'settings',
        name: 'Configuration',
        icon: Cog6ToothIcon,
        children: [
          { name: 'Profil de l\'entreprise', to: '/supplier/settings/general' },
          { name: 'Frais de livraison', to: '/supplier/settings/shipping' },
          { name: 'Options de paiement', to: '/supplier/settings/payments' },
          { name: 'Taxes', to: '/supplier/settings/taxes' },
          { name: 'Documents légaux', to: '/supplier/settings/legal' }
        ]
      }
    ]
  }
];

const filteredMenu = computed(() => {
  return rawMenuStructure
    .filter(group => {
      if (group.permission && !hasPermission(group.permission)) return false;
      return true;
    })
    .map(group => {
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

watch(() => route.path, () => {
  autoOpenDropdowns();
});

onMounted(() => {
  autoOpenDropdowns();
});

const breadcrumbs = computed(() => {
  const path = route.path;
  const segments = path.split('/').filter(Boolean);
  let accumulatedPath = '';
  return segments.map((seg, index) => {
    accumulatedPath += `/${seg}`;
    
    let label = seg.replace(/-/g, ' ');
    if (label.toLowerCase() === 'kpi') label = 'Indicateurs (KPI)';
    if (label.toLowerCase() === 'rfq') label = 'Devis (RFQ)';
    if (label.toLowerCase() === 'dashboard') label = 'Tableau de bord';
    if (label.toLowerCase() === 'products') label = 'Produits';
    if (label.toLowerCase() === 'orders') label = 'Commandes';

    return {
      text: label,
      to: accumulatedPath,
      current: index === segments.length - 1
    };
  });
});

function logoutSession() {
  authStore.logout();
  toast.success('Déconnexion réussie.');
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
  background: var(--color-border);
  border-radius: 4px;
}
.sidebar-container::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary-muted);
}

/* Page content scrollbar styling */
.page-container::-webkit-scrollbar {
  width: 8px;
}
.page-container::-webkit-scrollbar-track {
  background: transparent;
}
.page-container::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 4px;
}
.page-container::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-muted);
}
</style>
