<template>
  <div class="app-container h-screen overflow-hidden bg-[var(--color-background)] text-[var(--color-text-primary)] flex flex-col lg:flex-row font-sans relative select-none">
    
    <!-- MOBILE/TABLET HEADER PANEL -->
    <header class="lg:hidden flex items-center justify-between bg-[var(--color-surface)] border-b border-[var(--color-border)] px-6 py-3.5 shrink-0 z-40 sticky top-0 bg-opacity-95 backdrop-blur">
      <div class="flex items-center space-x-2">
        <ShoppingCartIcon class="h-6 w-6 text-[var(--color-primary)]" aria-hidden="true" />
        <span class="font-mono font-bold uppercase tracking-wider text-sm text-[var(--color-text-primary)]">PORTAIL ACHETEUR</span>
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
        isCollapsed ? 'lg:w-[72px]' : 'lg:w-[320px]',
        isMobileMenuOpen ? 'translate-x-0 w-full sm:w-[320px]' : '-translate-x-full lg:translate-x-0'
      ]"
      role="navigation"
      aria-label="Navigation principale acheteur"
    >
      <!-- BRAND TERMINAL IDENTITY -->
      <div class="h-16 border-b border-[var(--color-border)] px-4 flex items-center justify-between shrink-0 select-none bg-[var(--color-surface-elevated)]">
        <div class="flex items-center space-x-2.5 truncate" v-show="!isCollapsed || isMobileMenuOpen">
          <ShoppingCartIcon class="h-6 w-6 text-[var(--color-primary)] shrink-0" aria-hidden="true" />
          <span class="font-bold text-[var(--color-text-primary)] uppercase text-sm tracking-wider font-mono">ESPACE ACHETEUR</span>
        </div>
        <div class="flex justify-center w-full" v-show="isCollapsed && !isMobileMenuOpen">
          <ShoppingCartIcon class="h-6 w-6 text-[var(--color-primary)]" aria-hidden="true" />
        </div>
        
        <!-- COLLAPSE TOGGLER -->
        <button 
          @click="isCollapsed = !isCollapsed"
          class="hidden lg:block p-1.5 bg-[var(--color-surface-hover)] hover:bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition rounded-lg border border-[var(--color-border)]"
          :aria-label="isCollapsed ? 'Développer la barre latérale' : 'Réduire la barre latérale'"
        >
          <span class="text-xs font-mono">{{ isCollapsed ? '&rarr;' : '&larr;' }}</span>
        </button>
      </div>

      <!-- SIDEBAR COMPILATION CONTAINER -->
      <nav class="flex-1 overflow-y-auto px-4 py-3 space-y-5 scrollbar-thin select-none">
        
        <!-- For each group -->
        <div v-for="group in menuStructure" :key="group.label" class="space-y-2">
          
          <!-- Category Title -->
          <div 
            class="px-2 pb-1.5 text-xs uppercase font-mono tracking-widest text-[var(--color-text-secondary)] font-bold"
            v-show="!isCollapsed || isMobileMenuOpen"
          >
            {{ group.label }}
          </div>

          <!-- Divider when collapsed -->
          <div 
            class="h-px bg-[var(--color-border)] my-2 mx-1" 
            v-show="isCollapsed && !isMobileMenuOpen"
          ></div>

          <!-- Loop Items -->
          <div v-for="item in group.items" :key="item.name" class="space-y-1">
            
            <!-- Link with no children -->
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
                :class="isRouteActive(item.to) ? 'bg-[var(--color-primary-muted)] text-[var(--color-primary)] font-bold border-l-4 border-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] font-bold'"
              >
                <component :is="item.icon" class="h-6 w-6 mr-3 stroke-[2.5px] shrink-0" :class="getIconGroupColor(group.label, isRouteActive(item.to))" aria-hidden="true" />
                <span v-show="!isCollapsed || isMobileMenuOpen" class="truncate font-bold">{{ item.name }}</span>

                <!-- Hover Tooltip if Collapsed -->
                <div 
                  v-show="isCollapsed && !isMobileMenuOpen" 
                  class="hidden group-hover:block absolute left-16 bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] border border-[var(--color-border)] p-2.5 shadow-xl font-mono text-xs uppercase z-50 whitespace-nowrap rounded-md"
                >
                  {{ item.name }}
                </div>
              </a>
            </router-link>

            <!-- Dropdown Toggle layout item -->
            <div v-else class="space-y-1">
              <button 
                @click="toggleDropdown(item.id)"
                class="w-full flex items-center justify-between px-3 py-2.5 text-base font-mono transition group relative text-left font-bold"
                :class="[
                  isDropdownContainingActive(item) ? 'text-[var(--color-primary)] font-bold bg-[var(--color-surface-hover)] border-l-4 border-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] font-bold',
                ]"
                :aria-expanded="openDropdowns[item.id]"
              >
                <div class="flex items-center truncate">
                  <component :is="item.icon" class="h-6 w-6 mr-3 stroke-[2.5px] shrink-0" :class="getIconGroupColor(group.label, isDropdownContainingActive(item))" aria-hidden="true" />
                  <span v-show="!isCollapsed || isMobileMenuOpen" class="truncate font-bold">{{ item.name }}</span>
                </div>

                <ChevronDownIcon 
                  v-show="!isCollapsed || isMobileMenuOpen" 
                  class="h-4 w-4 text-[var(--color-text-secondary)] transition-transform duration-250 shrink-0"
                  :class="openDropdowns[item.id] ? 'rotate-180' : ''"
                  aria-hidden="true"
                />

                <!-- Hover Tooltip if Collapsed -->
                <div 
                  v-show="isCollapsed && !isMobileMenuOpen" 
                  class="hidden group-hover:block absolute left-16 bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] border border-[var(--color-border)] p-2.5 shadow-xl font-mono text-xs uppercase z-50 whitespace-nowrap rounded-md"
                >
                  {{ item.name }} (Sous-menu)
                </div>
              </button>

              <!-- Dropdown Children section -->
              <div 
                v-show="openDropdowns[item.id] && (!isCollapsed || isMobileMenuOpen)" 
                class="pl-6 space-y-1 border-l border-[var(--color-border)] ml-6 pr-1 py-1"
              >
                <router-link 
                  v-for="sub in item.children" 
                  :key="sub.name"
                  :to="sub.to"
                  class="flex items-center px-3 py-2 text-sm font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition truncate font-bold"
                  :class="isRouteActive(sub.to) ? 'text-[var(--color-primary)] font-bold bg-[var(--color-primary-muted)] border-l-2 border-[var(--color-primary)] pl-2' : ''"
                  @click="isMobileMenuOpen = false"
                >
                  <component v-if="sub.icon" :is="sub.icon" class="h-4 w-4 mr-2 shrink-0 stroke-[2px]" :class="getIconGroupColor(group.label, isRouteActive(sub.to))" aria-hidden="true" />
                  <span class="font-bold truncate">{{ sub.name }}</span>
                </router-link>
              </div>

            </div>

          </div>

        </div>

      </nav>

      <!-- PORTAL REDIRECT TO MAIN WEB CENTER -->
      <div class="p-4 border-t border-[var(--color-border)] shrink-0 space-y-2" v-show="!isCollapsed || isMobileMenuOpen">
        <router-link
          to="/"
          class="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] py-2.5 font-mono text-xs uppercase font-bold text-center flex items-center justify-center transition duration-200"
        >
          <ChevronLeftIcon class="h-4.5 w-4.5 mr-1" aria-hidden="true" />
          Boutique
        </router-link>
        
        <button 
          @click="logoutSession"
          class="w-full py-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-xs font-mono uppercase font-bold tracking-wider transition border border-red-500/30 flex justify-center items-center space-x-2"
          aria-label="Déconnecter la session"
        >
          <ArrowRightOnRectangleIcon class="h-5 w-5" aria-hidden="true" />
          <span>Déconnexion Portail</span>
        </button>
      </div>

    </aside>

    <!-- CONTENT WORKSPACE WRAPPER -->
    <div class="page-container flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen bg-[var(--color-background)]">
      
      <!-- TOP STATUS NAVIGATION HEADER -->
      <header class="h-16 border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur px-6 flex items-center justify-between shrink-0 sticky top-0 z-10 select-none shadow-sm">
        
        <!-- BREADCRUMBS BAR (DYNAMIC) -->
        <div class="flex items-center space-x-2 text-base text-[var(--color-text-secondary)] font-mono tracking-tight font-medium truncate">
          <router-link to="/buyer/dashboard" class="hover:text-[var(--color-primary)] transition uppercase">ESPACE ACHETEUR</router-link>
          
          <template v-for="(crumb, idx) in breadcrumbs" :key="crumb.to">
            <ChevronRightIcon class="h-4 w-4 text-[var(--color-text-muted)] inline shrink-0" aria-hidden="true" />
            <span 
              v-if="crumb.current" 
              class="text-[var(--color-primary)] font-bold uppercase truncate"
            >
              {{ crumb.text }}
            </span>
            <router-link 
              v-else 
              :to="crumb.to" 
              class="hover:text-[var(--color-primary)] transition uppercase truncate max-w-[120px]"
            >
              {{ crumb.text }}
            </router-link>
          </template>
        </div>

        <!-- UTILITIES -->
        <div class="flex items-center space-x-4">
          <!-- Notification Bell -->
          <NotificationBell />

          <!-- Mode Toggle & Keyboard Shortcuts -->
          <div class="flex items-center space-x-2 border-r border-[var(--color-border)] pr-4">
            <!-- Theme Toggle Button -->
            <button 
              @click="toggleTheme" 
              class="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-hover)] transition rounded flex items-center justify-center"
              :title="isLightTheme ? 'Passer en mode sombre (T)' : 'Passer en mode clair (T)'"
            >
              <SunIcon v-if="!isLightTheme" class="h-5 w-5 stroke-[2px]" aria-hidden="true" />
              <MoonIcon v-else class="h-5 w-5 stroke-[2px]" aria-hidden="true" />
            </button>

            <!-- Keyboard Shortcuts Button -->
            <button 
              @click="isHelpDrawerOpen = !isHelpDrawerOpen"
              class="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-hover)] transition rounded flex items-center justify-center"
              title="Raccourcis clavier & Diagnostics (H)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 stroke-[2.2px]">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 5.25h18c.414 0 .75.336.75.75v12c0 .414-.336.75-.75.75H3a.75.75 0 01-.75-.75V6c0-.414.336-.75.75-.75zm2.25 3.75h1.5v1.5h-1.5V9zm3.75 0h1.5v1.5H9V9zm3.75 0h1.5v1.5h-1.5V9zm3.75 0h1.5v1.5h-1.5V9zM5.25 12.75h1.5v1.5h-1.5v-1.5zm3.75 0h6v1.5H9v-1.5zm7.5 0h1.5v1.5h-1.5v-1.5z" />
              </svg>
            </button>
          </div>

          <!-- User Profile Icon / Status (Unified B2B layout pattern) -->
          <div class="flex items-center space-x-3">
            <div class="hidden sm:flex flex-col items-end">
              <span class="text-sm font-semibold text-[var(--color-text-primary)] leading-none">{{ authStore.user?.name || 'Acheteur' }}</span>
              <span class="text-xs text-emerald-500 mt-1 flex items-center">
                <span class="h-2 w-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>En ligne
              </span>
            </div>
            <div class="h-9 w-9 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold shadow cursor-pointer border-2 border-[var(--color-surface)] ring-2 ring-[var(--color-primary-muted)]">
              {{ authStore.user?.name ? authStore.user.name[0].toUpperCase() : 'B' }}
            </div>
          </div>

          <button 
            @click="logoutSession"
            class="text-xs font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] font-bold uppercase border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 transition rounded-xl"
            aria-label="Déconnecter la session"
          >
            Déconnexion
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
  BuildingOfficeIcon, 
  ChevronDownIcon, 
  ChevronRightIcon, 
  ChevronLeftIcon,
  Bars3Icon, 
  XMarkIcon, 
  ArrowRightOnRectangleIcon,
  ShoppingCartIcon,
  Squares2X2Icon,
  DocumentTextIcon,
  CreditCardIcon,
  UserIcon,
  ShieldCheckIcon,
  SunIcon,
  MoonIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  ListBulletIcon,
  HeartIcon,
  MapPinIcon,
  WalletIcon,
  GiftIcon,
  UserCircleIcon,
  KeyIcon,
  BellIcon,
  BuildingStorefrontIcon
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
  dashboard: true,
  purchases: false,
  wallet: false,
  profile: false
});

const menuStructure = [
  {
    label: 'Opérations Acheteur',
    items: [
      {
        id: 'dashboard',
        name: 'Tableau de bord',
        icon: Squares2X2Icon,
        children: [
          { name: 'Flux de Synthèse', to: '/buyer/dashboard', icon: ChartBarIcon },
          { name: 'Suivi de mes Évaluations', to: '/buyer/reviews', icon: ChatBubbleLeftRightIcon }
        ]
      }
    ]
  },
  {
    label: 'Commandes & Livraisons',
    items: [
      {
        id: 'purchases',
        name: 'Mes Achats',
        icon: DocumentTextIcon,
        children: [
          { name: 'Historique des Commandes', to: '/buyer/orders', icon: ListBulletIcon },
          { name: 'Achat & Réappro', to: '/buyer/purchases', icon: ShoppingCartIcon },
          { name: 'Bons de livraison', to: '/buyer/delivery-notes', icon: DocumentTextIcon },
          { name: 'Factures d\'achat', to: '/buyer/invoices', icon: CreditCardIcon },
          { name: 'Liste d\'Envies', to: '/buyer/wishlist', icon: HeartIcon },
          { name: 'Boutiques Enregistrées', to: '/buyer/saved-stores', icon: BuildingStorefrontIcon }
        ]
      }
    ]
  },
  {
    label: 'Adresses & Facturation',
    items: [
      {
        id: 'wallet',
        name: 'Outils d\'Approvisionnement',
        icon: CreditCardIcon,
        children: [
          { name: 'Carnet d\'Adresses', to: '/buyer/addresses', icon: MapPinIcon },
          { name: 'Portefeuilles Entreprise', to: '/buyer/payment-methods', icon: WalletIcon },
          { name: 'Points de Fidélité', to: '/buyer/loyalty', icon: GiftIcon }
        ]
      }
    ]
  },
  {
    label: 'Paramètres Utilisateur',
    items: [
      {
        id: 'profile',
        name: 'Identifiants de Connexion',
        icon: UserIcon,
        children: [
          { name: 'Informations de Profil', to: '/buyer/profile', icon: UserCircleIcon },
          { name: 'Sécurité & Accès', to: '/buyer/security', icon: KeyIcon },
          { name: 'Notifications d\'Entreprise', to: '/buyer/notifications', icon: BellIcon }
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

function getIconGroupColor(groupLabel, active) {
  if (active) return 'text-[var(--color-primary)] scale-110 transition-all duration-200';
  if (groupLabel.includes('Opérations')) return 'text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-all duration-200';
  if (groupLabel.includes('Commandes')) return 'text-sky-600 dark:text-sky-400 group-hover:scale-105 transition-all duration-200';
  if (groupLabel.includes('Adresses')) return 'text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-all duration-200';
  if (groupLabel.includes('Paramètres')) return 'text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-all duration-200';
  return 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)] transition-all duration-200';
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
    if (label === 'RFQ') label = 'Appels d\'offres (RFQ)';
    if (label === 'POS') label = 'Terminal Caisse';
    if (label === 'ADMIN') label = 'Administration Centrale';
    if (label === 'SUPPLIER') label = 'Espace Fournisseur';
    if (label === 'BUYER') label = 'Espace Acheteur';
    
    if (label === 'DASHBOARD') label = 'Tableau de bord';
    if (label === 'ORDERS') label = 'Commandes';
    if (label === 'TRACK') label = 'Suivi de livraison';
    if (label === 'WISHLIST') label = 'Liste d\'envies';
    if (label === 'ADDRESSES') label = 'Carnet d\'adresses';
    if (label === 'PAYMENT METHODS') label = 'Modes de paiement';
    if (label === 'LOYALTY') label = 'Fidélité';
    if (label === 'PROFILE') label = 'Profil';
    if (label === 'SECURITY') label = 'Sécurité';
    if (label === 'NOTIFICATIONS') label = 'Notifications';
    if (label === 'REVIEWS') label = 'Évaluations';

    if (seg.startsWith('usr_') || seg.startsWith('tenant_') || /^\d+$/.test(seg)) {
      label = `ENREGISTREMENT #${seg.toUpperCase()}`;
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
  toast.success('Déconnexion de votre espace client réussie.');
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
