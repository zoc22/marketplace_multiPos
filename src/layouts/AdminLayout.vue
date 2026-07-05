<template>
  <div class="app-container h-screen overflow-hidden bg-[var(--color-background)] text-[var(--color-text-primary)] flex flex-col lg:flex-row font-sans relative select-none">
    
    <!-- PANNEAU D'EN-TÊTE MOBILE/TABLETTE -->
    <header class="lg:hidden flex items-center justify-between bg-[var(--color-surface)] border-b border-[var(--color-border)] px-6 py-3.5 shrink-0 z-40 sticky top-0 bg-opacity-95 backdrop-blur">
      <div class="flex items-center space-x-2">
        <KeyIcon class="h-6 w-6 text-red-500 animate-pulse" aria-hidden="true" />
        <span class="font-mono font-bold uppercase tracking-wider text-xs text-red-500">CONTRÔLE ADMIN</span>
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

    <!-- ASSOCIER UNE COUVERTURE FLASHE DE NAVIGATION POUR MOBILES -->
    <div 
      v-if="isMobileMenuOpen" 
      @click="isMobileMenuOpen = false"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
    ></div>

    <!-- BARRE LATÉRALE PRINCIPALE (SIDEBAR) -->
    <aside 
      class="sidebar-container fixed inset-y-0 left-0 z-40 bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col transition-all duration-250 ease-in-out shrink-0 lg:transform-none lg:relative"
      :class="[
        isCollapsed ? 'lg:w-[80px]' : 'lg:w-[320px]',
        isMobileMenuOpen ? 'translate-x-0 w-full sm:w-[320px]' : '-translate-x-full lg:translate-x-0'
      ]"
      role="navigation"
      aria-label="Navigation principale administrateur"
    >
      <!-- IDENTITÉ DU PORTAIL CENTRAL -->
      <div class="h-16 border-b border-[var(--color-border)] px-4 flex items-center justify-between shrink-0 select-none bg-[var(--color-surface-elevated)]">
        <div class="flex items-center space-x-2.5 truncate" v-show="!isCollapsed || isMobileMenuOpen">
          <KeyIcon class="h-6 w-6 text-red-500 shrink-0" aria-hidden="true" />
          <span class="font-bold text-[var(--color-text-primary)] uppercase text-xs tracking-wider font-mono">PORTAIL CENTRAL</span>
        </div>
        <div class="flex justify-center w-full" v-show="isCollapsed && !isMobileMenuOpen">
          <KeyIcon class="h-6 w-6 text-red-500" aria-hidden="true" />
        </div>
        
        <!-- COMMUTATEUR COLLAPSE -->
        <button 
          @click="isCollapsed = !isCollapsed"
          class="hidden lg:block p-1.5 bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-md border border-[var(--color-border)] transition"
          :aria-label="isCollapsed ? 'Agrandir la barre latérale' : 'Réduire la barre latérale'"
        >
          <span class="text-xs font-mono font-bold">{{ isCollapsed ? '→' : '←' }}</span>
        </button>
      </div>

      <!-- AVATAR DU PROFIL EN ÉTAT RÉDUIT -->
      <div 
        class="my-4 py-2 flex flex-col items-center border-b border-[var(--color-border)]/50 select-none group relative"
        v-show="isCollapsed && !isMobileMenuOpen"
      >
        <div class="h-10 w-10 bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center font-bold font-sans text-sm uppercase shadow-sm rounded-xl">
          {{ authStore.user?.name ? authStore.user.name[0] : 'A' }}
        </div>
        <!-- Info-bulle -->
        <div class="hidden group-hover:block absolute left-16 bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] font-mono text-xs uppercase border border-[var(--color-border)] p-2.5 shadow-xl z-50 whitespace-nowrap rounded-lg">
          Rôle : Administrateur Général
        </div>
      </div>

      <!-- COMPILATION DE LA NAVIGATION -->
      <nav class="flex-1 overflow-y-auto px-4 py-3 space-y-5 scrollbar-thin select-none">
        
        <!-- Groupes de catégories -->
        <div v-for="group in menuGroups" :key="group.label" class="space-y-2">
          
          <!-- Titre du groupe -->
          <div 
            class="px-2 pb-1.5 text-xs uppercase font-mono tracking-widest text-[var(--color-text-tertiary)] font-bold"
            v-show="!isCollapsed || isMobileMenuOpen"
          >
            {{ group.label }}
          </div>

          <!-- Ligne de séparation si réduit -->
          <div 
            class="h-px bg-[var(--color-border)] my-2 mx-1" 
            v-show="isCollapsed && !isMobileMenuOpen"
          ></div>

          <!-- Boucle des éléments du menu -->
          <div v-for="item in group.items" :key="item.name" class="space-y-1">
            
            <!-- Lien standard sans sous-menu -->
            <router-link 
              v-slot="{ href, navigate }"
              v-if="!item.children"
              :to="item.to"
              custom
            >
              <a 
                :href="href"
                @click="(e) => { navigate(e); isMobileMenuOpen = false; }"
                class="flex items-center px-3 py-2.5 text-sm font-sans transition-all duration-200 group relative cursor-pointer rounded-lg font-bold"
                :class="isRouteActive(item.to) ? 'bg-[var(--color-primary-muted)] text-[var(--color-primary)] font-bold translate-x-2 pl-2 border-l-4 border-[var(--color-primary)] shadow-sm' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] hover:translate-x-1 font-bold'"
              >
                <component :is="item.icon" class="h-5.5 w-5.5 mr-3 shrink-0 font-bold" :class="item.iconColor || 'text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]'" aria-hidden="true" />
                <span v-show="!isCollapsed || isMobileMenuOpen" class="truncate font-bold">{{ item.name }}</span>

                <!-- Info-bulle si réduit -->
                <div 
                  v-show="isCollapsed && !isMobileMenuOpen" 
                  class="hidden group-hover:block absolute left-16 bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] border border-[var(--color-border)] p-2.5 shadow-xl font-mono text-xs uppercase z-50 whitespace-nowrap rounded-lg"
                >
                  {{ item.name }}
                </div>
              </a>
            </router-link>

            <!-- Parent de sous-menu interactif -->
            <div v-else class="space-y-1">
              <button 
                @click="toggleDropdown(item.id)"
                class="w-full flex items-center justify-between px-3 py-2.5 text-sm font-sans transition-all duration-200 group relative text-left rounded-lg font-bold cursor-pointer"
                :class="[
                  isDropdownContainingActive(item) ? 'text-[var(--color-primary)] font-bold bg-[var(--color-primary-muted)] border-l-4 border-[var(--color-primary)] pl-4 translate-x-1 shadow-sm' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] font-bold',
                ]"
                :aria-expanded="openDropdowns[item.id]"
              >
                <div class="flex items-center truncate">
                  <component :is="item.icon" class="h-5.5 w-5.5 mr-3 shrink-0 font-bold" :class="item.iconColor || 'text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]'" aria-hidden="true" />
                  <span v-show="!isCollapsed || isMobileMenuOpen" class="truncate font-bold">{{ item.name }}</span>
                </div>

                <ChevronDownIcon 
                  v-show="!isCollapsed || isMobileMenuOpen" 
                  class="h-4 w-4 text-[var(--color-text-secondary)] transition-transform duration-250 shrink-0 font-bold"
                  :class="openDropdowns[item.id] ? 'rotate-180 text-[var(--color-primary)]' : ''"
                  aria-hidden="true"
                />

                <!-- Info-bulle si réduit -->
                <div 
                  v-show="isCollapsed && !isMobileMenuOpen" 
                  class="hidden group-hover:block absolute left-16 bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] border border-[var(--color-border)] p-2.5 shadow-xl font-mono text-xs uppercase z-50 whitespace-nowrap rounded-lg"
                >
                  {{ item.name }} (Sous-menu)
                </div>
              </button>

              <!-- Segments des enfants du sous-menu -->
              <div 
                v-show="openDropdowns[item.id] && (!isCollapsed || isMobileMenuOpen)" 
                class="pl-6 space-y-1 border-l border-[var(--color-border)] ml-5 py-1"
              >
                <router-link 
                  v-for="sub in item.children" 
                  :key="sub.name"
                  :to="sub.to"
                  class="flex items-center px-3 py-2 text-sm transition-all duration-200 truncate rounded-lg font-bold"
                  :class="isRouteActive(sub.to) ? 'text-[var(--color-primary)] font-bold bg-[var(--color-primary-muted)] translate-x-2 pl-2 shadow-sm border-l-4 border-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-hover)] pl-3 hover:translate-x-1 font-bold'"
                  @click="isMobileMenuOpen = false"
                >
                  <!-- Icon vectoriel de couleur pour le sous-onglet -->
                  <component :is="sub.icon || ChevronRightIcon" class="h-4 w-4 mr-2 shrink-0 font-bold" :class="sub.iconColor || 'text-[var(--color-text-tertiary)]'" aria-hidden="true" />
                  <span>{{ sub.name }}</span>
                </router-link>
              </div>

            </div>

          </div>

        </div>

      </nav>

      <!-- BOUTON DÉCONNEXION CONSOLE -->
      <div class="p-4 border-t border-[var(--color-border)] shrink-0" v-show="!isCollapsed || isMobileMenuOpen">
        <button 
          @click="logoutSession"
          class="w-full py-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-xs font-sans uppercase font-extrabold tracking-wider transition border border-red-500/20 flex justify-center items-center space-x-2 shadow-sm"
          aria-label="Fermer la session de la console"
        >
          <ArrowRightOnRectangleIcon class="h-5 w-5" aria-hidden="true" />
          <span>Déconnexion Sécurisée</span>
        </button>
      </div>

    </aside>

    <!-- ESPACE DE TRAVAIL DE CONTENU DYNAMIQUE -->
    <div class="page-container flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
      
      <!-- ENTÊTE DE NAVIGATION ET DE STATUT -->
      <header class="h-16 border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur px-6 flex items-center justify-between shrink-0 sticky top-0 z-10 select-none">
        
        <!-- BARRE DE BREADCRUMBS DYNAMIQUE -->
        <div class="flex items-center space-x-2.5 text-sm text-[var(--color-text-secondary)] font-sans tracking-tight font-semibold truncate">
          <router-link to="/admin/dashboard" class="hover:text-[var(--color-primary)] transition uppercase font-extrabold">ROOT</router-link>
          
          <template v-for="(crumb, idx) in breadcrumbs" :key="crumb.to">
            <ChevronRightIcon class="h-4 w-4 text-[var(--color-text-tertiary)] inline shrink-0" aria-hidden="true" />
            <span 
              v-if="crumb.current" 
              class="text-[var(--color-primary)] font-black uppercase truncate"
            >
              {{ crumb.text }}
            </span>
            <router-link 
              v-else 
              :to="crumb.to" 
              class="hover:text-[var(--color-primary)] transition uppercase truncate max-w-[150px] font-extrabold"
            >
              {{ crumb.text }}
            </router-link>
          </template>
        </div>

        <!-- UTILS ET BARRE D'OUTILS -->
        <div class="flex items-center space-x-4">
          <!-- Cloche de Notification -->
          <NotificationBell />

          <!-- Commutateurs thèmes & Raccourcis -->
          <div class="flex items-center space-x-2 border-r border-[var(--color-border)] pr-4">
            <!-- Commutateur de mode -->
            <button 
              @click="toggleTheme" 
              class="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition rounded-lg flex items-center justify-center hover:bg-[var(--color-surface-hover)]"
              :title="isLightTheme ? 'Passer en mode sombre (T)' : 'Passer en mode clair (T)'"
            >
              <SunIcon v-if="!isLightTheme" class="h-5 w-5 stroke-[2px]" aria-hidden="true" />
              <MoonIcon v-else class="h-5 w-5 stroke-[2px]" aria-hidden="true" />
            </button>

            <!-- Diagnostics Raccourcis clavier -->
            <button 
              @click="isHelpDrawerOpen = !isHelpDrawerOpen"
              class="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition rounded-lg flex items-center justify-center hover:bg-[var(--color-surface-hover)]"
              title="Raccourcis clavier & Diagnostics (H)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 stroke-[2.2px]">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 5.25h18c.414 0 .75.336.75.75v12c0 .414-.336.75-.75.75H3a.75.75 0 01-.75-.75V6c0-.414.336-.75.75-.75zm2.25 3.75h1.5v1.5h-1.5V9zm3.75 0h1.5v1.5H9V9zm3.75 0h1.5v1.5h-1.5V9zm3.75 0h1.5v1.5h-1.5V9zM5.25 12.75h1.5v1.5h-1.5v-1.5zm3.75 0h6v1.5H9v-1.5zm7.5 0h1.5v1.5h-1.5v-1.5z" />
              </svg>
            </button>
          </div>

          <div class="hidden sm:flex items-center space-x-2 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl px-3 py-1.5 text-xs text-[var(--color-text-secondary)] font-bold">
            <ShieldCheckIcon class="h-4.5 w-4.5 text-emerald-500 animate-pulse" aria-hidden="true" />
            <span class="text-[var(--color-text-tertiary)] uppercase">AUDIT SÉCURITÉ :</span>
            <span class="text-emerald-500">ACTIF</span>
          </div>

          <!-- Arrêter Session -->
          <button 
            @click="logoutSession"
            class="text-xs font-sans text-red-500 hover:text-white hover:bg-red-500 border border-red-500/20 bg-red-500/10 px-3 py-1.5 rounded-lg transition font-extrabold shadow-sm uppercase tracking-wider"
            aria-label="Arrêter la session de la console"
          >
            Fermer la Console
          </button>
        </div>

      </header>

      <!-- ESPACE DE TRAVAIL DES PANNEAUX -->
      <main class="flex-1 p-6 md:p-8 pb-44 md:pb-36 bg-[var(--color-background)]">
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
  MoonIcon,
  Squares2X2Icon,
  ChartBarIcon,
  ClockIcon,
  UsersIcon,
  CheckBadgeIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  ArchiveBoxIcon,
  ScaleIcon,
  BanknotesIcon,
  ArrowUpRightIcon,
  ReceiptPercentIcon,
  LockClosedIcon,
  DocumentMagnifyingGlassIcon,
  QueueListIcon,
  ArrowDownOnSquareIcon,
  HeartIcon,
  AdjustmentsHorizontalIcon,
  GlobeAltIcon,
  ShieldExclamationIcon,
  EnvelopeIcon
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

// Structure du menu latéral traduit en français avec des icônes vectorielles colorées
const menuGroups = [
  {
    label: 'Cœur de Plateforme',
    items: [
      {
        id: 'console',
        name: 'Tableau de Bord',
        icon: CommandLineIcon,
        iconColor: 'text-sky-500 group-hover:text-sky-400',
        children: [
          { name: 'Centre de Contrôle', to: '/admin/dashboard', icon: Squares2X2Icon, iconColor: 'text-sky-500' },
          { name: 'Statistiques & Métriques', to: '/admin/stats', icon: ChartBarIcon, iconColor: 'text-sky-400' },
          { name: 'Moniteur Temps Réel', to: '/admin/live', icon: ClockIcon, iconColor: 'text-sky-300' }
        ]
      }
    ]
  },
  {
    label: 'Registres & Audits',
    items: [
      {
        id: 'users',
        name: 'Identités & KYC',
        icon: UserIcon,
        iconColor: 'text-amber-500 group-hover:text-amber-400',
        children: [
          { name: 'Tous les Profils', to: '/admin/users', icon: UsersIcon, iconColor: 'text-amber-500' },
          { name: 'Fournisseurs Vérifiés', to: '/admin/users/suppliers', icon: CheckBadgeIcon, iconColor: 'text-amber-400' },
          { name: 'Acheteurs Standards', to: '/admin/users/buyers', icon: UserGroupIcon, iconColor: 'text-amber-300' },
          { name: 'Dossiers & Conformité', to: '/admin/users/verification', icon: ClipboardDocumentCheckIcon, iconColor: 'text-amber-200' }
        ]
      },
      {
        id: 'catalog',
        name: 'Catalogue & Litiges',
        icon: DocumentTextIcon,
        iconColor: 'text-amber-500 group-hover:text-amber-400',
        children: [
          { name: 'Catalogue Global', to: '/admin/products', icon: ArchiveBoxIcon, iconColor: 'text-amber-500' },
          { name: 'Litiges & Réclamations', to: '/admin/disputes', icon: ScaleIcon, iconColor: 'text-amber-400' }
        ]
      }
    ]
  },
  {
    label: 'Finances & Séquestres',
    items: [
      {
        id: 'finance',
        name: 'Grand Livre & Caisse',
        icon: CreditCardIcon,
        iconColor: 'text-emerald-500 group-hover:text-emerald-400',
        children: [
          { name: 'Grand Livre de Caisse', to: '/admin/finance/transactions', icon: BanknotesIcon, iconColor: 'text-emerald-500' },
          { name: 'Demandes de Retraits', to: '/admin/finance/withdrawals', icon: ArrowUpRightIcon, iconColor: 'text-emerald-400' },
          { name: 'Suivi des Commissions', to: '/admin/finance/commissions', icon: ReceiptPercentIcon, iconColor: 'text-emerald-300' },
          { name: 'Fonds sous Séquestre', to: '/admin/escrow', icon: LockClosedIcon, iconColor: 'text-emerald-200' }
        ]
      }
    ]
  },
  {
    label: 'Diagnostics Serveur',
    items: [
      {
        id: 'system',
        name: 'Administration Serveur',
        icon: CpuChipIcon,
        iconColor: 'text-pink-500 group-hover:text-pink-400',
        children: [
          { name: 'Journaux Système (Logs)', to: '/admin/system/logs', icon: DocumentMagnifyingGlassIcon, iconColor: 'text-pink-500' },
          { name: 'Files d\'Attente', to: '/admin/system/queue', icon: QueueListIcon, iconColor: 'text-pink-400' },
          { name: 'Sauvegardes de Base', to: '/admin/system/backups', icon: ArrowDownOnSquareIcon, iconColor: 'text-pink-300' },
          { name: 'Santé du Matériel', to: '/admin/system/health', icon: HeartIcon, iconColor: 'text-pink-200' }
        ]
      },
      {
        id: 'settings',
        name: 'Variables Système',
        icon: Cog6ToothIcon,
        iconColor: 'text-pink-500 group-hover:text-pink-400',
        children: [
          { name: 'Paramètres Généraux', to: '/admin/settings/general', icon: AdjustmentsHorizontalIcon, iconColor: 'text-pink-500' },
          { name: 'Multi-Locataires', to: '/admin/settings/tenants', icon: GlobeAltIcon, iconColor: 'text-pink-400' },
          { name: 'Règles anti-Fraude', to: '/admin/settings/rules', icon: ShieldExclamationIcon, iconColor: 'text-pink-300' },
          { name: 'Configurations SMTP', to: '/admin/settings/email', icon: EnvelopeIcon, iconColor: 'text-pink-200' }
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

// dynamic French breadcrumbs
const breadcrumbs = computed(() => {
  const path = route.path;
  const segments = path.split('/').filter(Boolean);
  let accumulatedPath = '';
  return segments.map((seg, index) => {
    accumulatedPath += `/${seg}`;
    
    let label = seg.toUpperCase().replace(/-/g, ' ');
    if (label === 'KPI') label = 'KPIs';
    if (label === 'RFQ') label = 'RFQs';
    if (label === 'POS') label = 'TERMINAL POS';
    if (label === 'ADMIN') label = 'ADMINISTRATION';
    if (label === 'SUPPLIER') label = 'VENDEUR';
    if (label === 'BUYER') label = 'ACHETEUR';
    if (label === 'DASHBOARD') label = 'CONTRÔLE';
    if (label === 'STATS') label = 'STATISTIQUES';
    if (label === 'LIVE') label = 'TEMPS RÉEL';
    if (label === 'USERS') label = 'UTILISATEURS';
    if (label === 'SUPPLIERS') label = 'FOURNISSEURS';
    if (label === 'BUYERS') label = 'ACHETEURS';
    if (label === 'VERIFICATION') label = 'CONFORMITÉ KYC';
    if (label === 'PRODUCTS') label = 'CATALOGUE';
    if (label === 'ORDERS') label = 'COMMANDES';
    if (label === 'ESCROW') label = 'SÉQUESTRES';
    if (label === 'FINANCE') label = 'COMPTABILITÉ';
    if (label === 'SUPPORT') label = 'SUPPORT';
    if (label === 'SYSTEM') label = 'SANS FIL';
    if (label === 'SETTINGS') label = 'PARAMÈTRES';
    
    if (seg.startsWith('usr_') || seg.startsWith('tenant_') || /^\d+$/.test(seg)) {
      label = `DOSSIER #${seg.toUpperCase()}`;
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
  toast.success('Session Admin fermée avec succès. Accès révoqué.');
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
  background: rgba(0,0,0,0.15);
  border-radius: 0;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.1);
  border-radius: 2px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: rgba(0,0,0,0.2);
}
</style>

<style>
/* CLAIRE MODE OVERRIDES POUR LES PAGES D'ADMINISTRATION */
[data-theme="light"] .app-container {
  background-color: var(--color-background) !important;
  color: var(--color-text-primary) !important;
}

[data-theme="light"] .sidebar-container {
  background-color: var(--color-surface) !important;
  border-color: var(--color-border) !important;
}

[data-theme="light"] .sidebar-container * {
  border-color: var(--color-border) !important;
}

[data-theme="light"] .page-container header {
  background-color: var(--color-surface) !important;
  border-color: var(--color-border) !important;
}

[data-theme="light"] .page-container {
  background-color: var(--color-background) !important;
}

/* Surcharge de tous les fonds hardcodés foncés des sous-pages pour s'adapter proprement au mode clair */
[data-theme="light"] .app-container .bg-slate-900,
[data-theme="light"] .app-container .bg-slate-950,
[data-theme="light"] .app-container .bg-slate-950\/80,
[data-theme="light"] .app-container .bg-slate-950\/40,
[data-theme="light"] .app-container .bg-slate-900\/60,
[data-theme="light"] .app-container .bg-slate-900\/20,
[data-theme="light"] .app-container .bg-slate-900\/30,
[data-theme="light"] .app-container .bg-slate-900\/40,
[data-theme="light"] .app-container .bg-\[\#050814\],
[data-theme="light"] .app-container .bg-\[\#05091a\],
[data-theme="light"] .app-container .bg-\[\#0b132c\],
[data-theme="light"] .app-container .bg-\[\#090f23\],
[data-theme="light"] .app-container .bg-\[\#070b19\]\/80,
[data-theme="light"] .app-container .bg-\[\#0d1633\],
[data-theme="light"] .app-container .hover\:bg-slate-900\/40:hover,
[data-theme="light"] .app-container .hover\:bg-slate-900\/30:hover {
  background-color: var(--color-surface-elevated) !important;
}

[data-theme="light"] .app-container .border-slate-800,
[data-theme="light"] .app-container .border-slate-850,
[data-theme="light"] .app-container .border-slate-900,
[data-theme="light"] .app-container .border-\[\#121c3b\] {
  border-color: var(--color-border) !important;
}

[data-theme="light"] .app-container .text-slate-100,
[data-theme="light"] .app-container .text-slate-200,
[data-theme="light"] .app-container .text-slate-300 {
  color: var(--color-text-primary) !important;
}

[data-theme="light"] .app-container .text-slate-400,
[data-theme="light"] .app-container .text-slate-500 {
  color: var(--color-text-secondary) !important;
}

[data-theme="light"] .app-container input,
[data-theme="light"] .app-container select,
[data-theme="light"] .app-container textarea {
  background-color: var(--color-surface) !important;
  color: var(--color-text-primary) !important;
  border-color: var(--color-border) !important;
}

/* Augmentation professionnelle de la taille des écritures dans le module admin */
.app-container {
  font-size: 1.05rem !important;
}
.app-container h1, 
.app-container .text-xl {
  font-size: 1.6rem !important;
}
.app-container h2, 
.app-container .text-lg {
  font-size: 1.35rem !important;
}
.app-container h3, 
.app-container .text-md {
  font-size: 1.15rem !important;
}
.app-container p, 
.app-container .text-sm {
  font-size: 1.0rem !important;
}
.app-container td, 
.app-container th, 
.app-container .text-xs {
  font-size: 0.9rem !important;
}
.app-container .text-\[10px\] {
  font-size: 0.85rem !important;
}
.app-container .text-\[11px\] {
  font-size: 0.88rem !important;
}
.app-container .text-\[9px\] {
  font-size: 0.78rem !important;
}
.app-container .text-\[8px\] {
  font-size: 0.75rem !important;
}
</style>
