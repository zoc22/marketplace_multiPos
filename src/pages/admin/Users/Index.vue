<template>
  <div class="space-y-6 animate-fade-in">
    
    <!-- HEADER SUMMARY CARD -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center bg-[var(--color-surface)] border border-[var(--color-border)] p-5 rounded-2xl gap-4">
      <div>
        <h1 class="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)] font-sans flex items-center space-x-2">
          <ShieldCheckIcon class="w-4 h-4 text-[var(--color-primary)]" />
          <span>Sécurité des Comptes & KYC de la Plateforme</span>
        </h1>
        <p class="text-[11px] text-[var(--color-text-secondary)]">Contrôlez les profils acheteurs, les dossiers d'enregistrement des fournisseurs et les comptes.</p>
      </div>
      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] px-3.5 py-2 text-right font-mono text-[10px] rounded-xl shrink-0">
        <span class="text-[var(--color-text-tertiary)] uppercase block text-[8px] tracking-wider">TOTAL ENREGISTRÉS</span>
        <span class="text-[var(--color-primary)] font-bold text-xs">{{ authStore.users.length }} Profils Actifs</span>
      </div>
    </div>

    <!-- Active Filters Row -->
    <div class="flex flex-wrap gap-2 select-none">
      <button 
        @click="changeFilter('all')"
        class="px-3.5 py-1.5 font-sans text-[10px] uppercase font-bold tracking-wider transition border rounded-xl"
        :class="activeFilter === 'all' ? 'bg-[var(--color-primary)] border-transparent text-white' : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'"
      >
        Tous les Comptes ({{ authStore.users.length }})
      </button>
      <button 
        @click="changeFilter('supplier_pending')"
        class="px-3.5 py-1.5 font-sans text-[10px] uppercase font-bold tracking-wider transition border rounded-xl"
        :class="activeFilter === 'supplier_pending' ? 'bg-amber-500 border-transparent text-white' : 'bg-[var(--color-surface)] border-[var(--color-border)] text-amber-600 hover:text-amber-500'"
      >
        KYC en attente ({{ pendingKYCCount }})
      </button>
      <button 
        @click="changeFilter('supplier')"
        class="px-3.5 py-1.5 font-sans text-[10px] uppercase font-bold tracking-wider transition border rounded-xl"
        :class="activeFilter === 'supplier' ? 'bg-[var(--color-primary)] border-transparent text-white font-bold' : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'"
      >
        Fournisseurs Validés
      </button>
      <button 
        @click="changeFilter('buyer')"
        class="px-3.5 py-1.5 font-sans text-[10px] uppercase font-bold tracking-wider transition border rounded-xl"
        :class="activeFilter === 'buyer' ? 'bg-[var(--color-primary)] border-transparent text-white font-bold' : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'"
      >
        Acheteurs Seuls
      </button>
    </div>

    <!-- Skeleton Loader wrapper while simulating server retrieval time -->
    <div v-if="isLoading" class="p-6 border border-[var(--color-border)] bg-[var(--color-surface)] rounded-2xl">
      <SkeletonLoader type="table" :rows="5" />
    </div>

    <div v-else class="space-y-4">
      <!-- Listings Table / Grid -->
      <div v-if="paginatedUsers.length > 0" class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm">
        <table class="w-full text-left font-sans text-xs border-collapse">
          <thead>
            <tr class="bg-[var(--color-surface-hover)] border-b border-[var(--color-border)] text-[var(--color-text-secondary)] font-bold uppercase text-[9px] tracking-wider select-none">
              <th class="p-4">Représentant & Entreprise</th>
              <th class="p-4">Téléphone de Contact</th>
              <th class="p-4">Rôles Attribués</th>
              <th class="p-4">Statut Compte</th>
              <th class="p-4 text-center">Action KYC</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr 
              v-for="(user, idx) in paginatedUsers" 
              :key="user.id"
              class="hover:bg-[var(--color-surface-hover)]/40 transition-all font-sans text-xs text-[var(--color-text-primary)]"
            >
              <td class="p-4 space-y-0.5">
                <div class="font-bold text-[var(--color-text-primary)]">{{ user.name }}</div>
                <div class="font-mono text-[10px] text-[var(--color-text-secondary)]">{{ user.email }}</div>
                <div v-if="user.company" class="text-[10px] bg-[var(--color-background)] border border-[var(--color-border)] px-1.5 py-0.5 rounded text-[var(--color-primary)] inline-block font-medium mt-1">
                  Soc. : {{ user.company }}
                </div>
              </td>
              <td class="p-4 font-mono text-[11px] text-[var(--color-text-secondary)]">
                {{ user.phone || 'Aucun numéro' }}
              </td>
              <td class="p-4 font-mono text-[10px]">
                <span class="px-2 py-0.5 bg-[var(--color-primary-muted)] text-[var(--color-primary)] uppercase font-bold tracking-wide text-[9px] border border-[var(--color-primary-border)] rounded">
                  {{ user.roles.join(', ') }}
                </span>
              </td>
              <td class="p-4">
                <span 
                  v-if="user.status === 'approved'"
                  class="inline-flex items-center space-x-1 font-semibold text-[10px] text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded"
                >
                  <span>●</span> <span>ACTIF</span>
                </span>
                <span 
                  v-else
                  class="inline-flex items-center space-x-1 font-semibold text-[10px] text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded"
                >
                  <span>●</span> <span>KYC EN ATTENTE</span>
                </span>
              </td>
              <td class="p-4 text-center">
                <button 
                  v-if="user.status === 'pending'"
                  @click="inspectUserKYC(user)"
                  class="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-sans font-bold uppercase tracking-wider transition rounded-lg"
                >
                  Inspecter KYC
                </button>
                <div v-else-if="user.kyc && user.kyc.verified" class="text-[10px] text-emerald-500 font-mono font-bold flex items-center justify-center space-x-1">
                  <CheckIcon class="w-3.5 h-3.5" />
                  <span>KYC AUDITÉ & VALIDÉ</span>
                </div>
                <span v-else class="text-[var(--color-text-tertiary)] font-mono text-[11px]">Aucun audit requis</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PREMIUM EMPTY STATE FOR NO USERS MATCHING FILTER criteria -->
      <div v-else class="p-12 text-center border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)] rounded-2xl flex flex-col items-center justify-center space-y-4 shadow-sm">
        <ExclamationTriangleIcon class="h-10 w-10 text-[var(--color-text-tertiary)]" />
        <div>
          <h3 class="text-sm font-sans font-bold text-[var(--color-text-primary)] uppercase">Aucun compte trouvé</h3>
          <p class="text-xs text-[var(--color-text-secondary)] mt-1">Aucun enregistrement ne correspond aux critères de filtrage de sécurité sélectionnés.</p>
        </div>
      </div>

      <!-- PAGINATION CONTROLLER -->
      <Pagination 
        :totalItems="filteredUsers.length" 
        :pageSize="pageSize" 
        v-model:currentPage="currentPage" 
      />
    </div>

    <!-- Active KYC inspecting Modal Popup (Supports Closure outside click) -->
    <div 
      v-if="inspectionTarget" 
      @click.self="inspectionTarget = null" 
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all"
      id="kyc-audit-modal"
    >
      <div 
        class="bg-[var(--color-surface)] border border-[var(--color-border)] w-full max-w-lg overflow-hidden shadow-2xl p-6 space-y-4 rounded-2xl animate-slide-up"
      >
        <div class="flex justify-between items-start border-b border-[var(--color-border)] pb-3">
          <div>
            <h2 class="text-sm font-bold uppercase tracking-wider font-sans text-[var(--color-text-primary)]">Validation d'Audit Marchand</h2>
            <p class="text-[10px] text-[var(--color-primary)]">Vérifier l'enregistrement de l'entreprise et la conformité fiscale</p>
          </div>
          <button @click="inspectionTarget = null" class="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>

        <!-- Compliance Form Details -->
        <div class="space-y-4 text-xs leading-relaxed max-h-[50vh] overflow-y-auto pr-1">
          <div class="grid grid-cols-2 gap-3 text-[11px]">
            <div>
              <span class="text-[var(--color-text-tertiary)] uppercase block text-[9px]">Nom Officiel de l'Entreprise</span>
              <strong class="text-[var(--color-text-primary)]">{{ inspectionTarget.kyc?.companyName }}</strong>
            </div>
            <div>
              <span class="text-[var(--color-text-tertiary)] uppercase block text-[9px]">Nom du Représentant Légal</span>
              <strong class="text-[var(--color-text-primary)]">{{ inspectionTarget.kyc?.managerName }}</strong>
            </div>
          </div>

          <div class="p-3.5 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl space-y-2.5 font-mono text-[10px]">
            <div class="flex justify-between">
              <span class="text-[var(--color-text-secondary)]">Registre du Commerce (RC) :</span>
              <strong class="text-[var(--color-text-primary)]">{{ inspectionTarget.kyc?.rc }}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-[var(--color-text-secondary)]">Numéro Unique d'Identifiant (NIU) :</span>
              <strong class="text-[var(--color-text-primary)]">{{ inspectionTarget.kyc?.niu }}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-[var(--color-text-secondary)]">Registre RCCM :</span>
              <strong class="text-[var(--color-text-primary)]">{{ inspectionTarget.kyc?.rccm }}</strong>
            </div>
            <div class="flex justify-between pt-1.5 border-t border-[var(--color-border)]">
              <span class="text-[var(--color-text-secondary)]">Documents fiscaux joints :</span>
              <span class="text-[var(--color-primary)] underline cursor-pointer">{{ inspectionTarget.kyc?.fiscalDocs }}</span>
            </div>
          </div>

          <div>
            <span class="text-[var(--color-text-tertiary)] uppercase block text-[9px] mb-1">Siège social de l'entreprise</span>
            <p class="p-3 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-[11px] font-mono rounded-lg">
              {{ inspectionTarget.kyc?.address }}
            </p>
          </div>

          <!-- Simulated Permission maps -->
          <div>
            <span class="text-[var(--color-primary)] uppercase block text-[9px] mb-1 font-bold">Mappage des Permissions Locataires</span>
            <div class="grid grid-cols-2 gap-2 text-[10px] font-mono bg-[var(--color-surface-elevated)] p-3 border border-[var(--color-border)] rounded-lg">
              <label class="flex items-center space-x-2">
                <input type="checkbox" checked disabled class="accent-[var(--color-primary)] rounded bg-[var(--color-background)] border-[var(--color-border)]">
                <span>gérer_stock</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="checkbox" checked disabled class="accent-[var(--color-primary)] rounded bg-[var(--color-background)] border-[var(--color-border)]">
                <span>voir_grand_livre</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="checkbox" checked disabled class="accent-[var(--color-primary)] rounded bg-[var(--color-background)] border-[var(--color-border)]">
                <span>émettre_demandes_prix</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="checkbox" checked disabled class="accent-[var(--color-primary)] rounded bg-[var(--color-background)] border-[var(--color-border)]">
                <span>approuver_commandes</span>
              </label>
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-[var(--color-border)] flex justify-end space-x-2.5">
          <button 
            @click="inspectionTarget = null"
            class="px-4 py-2 border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] text-xs font-mono uppercase tracking-wider rounded-xl"
          >
            Annuler l'Audit
          </button>
          
          <button 
            @click="approveKYC"
            class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-sans uppercase tracking-wider font-bold transition duration-200 rounded-xl"
          >
            Valider le KYC & l'Accès Marchand
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/store/modules/auth.js';
import { useToast } from 'vue-toastification';
import Pagination from '@/components/Pagination.vue';
import SkeletonLoader from '@/components/SkeletonLoader.vue';
import { 
  ShieldCheckIcon, 
  CheckIcon, 
  XMarkIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/vue/24/outline';

const authStore = useAuthStore();
const toast = useToast();

const activeFilter = ref('all');
const inspectionTarget = ref(null);
const isLoading = ref(true);

// Pagination controls
const currentPage = ref(1);
const pageSize = ref(5);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 600);
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

const pendingKYCCount = computed(() => {
  return authStore.users.filter(u => u.status === 'pending').length;
});

const filteredUsers = computed(() => {
  let result = [];
  if (activeFilter.value === 'all') {
    result = authStore.users;
  } else if (activeFilter.value === 'supplier_pending') {
    result = authStore.users.filter(u => u.status === 'pending');
  } else if (activeFilter.value === 'supplier') {
    result = authStore.users.filter(u => u.roles.includes('supplier') && u.status === 'approved');
  } else if (activeFilter.value === 'buyer') {
    result = authStore.users.filter(u => u.roles.includes('buyer'));
  } else {
    result = authStore.users;
  }
  return result;
});

// Paginated Users subset
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredUsers.value.slice(start, start + pageSize.value);
});

function changeFilter(filter) {
  activeFilter.value = filter;
  currentPage.value = 1; // Reset to page 1 on filter trigger
}

function inspectUserKYC(user) {
  inspectionTarget.value = user;
}

function approveKYC() {
  if (!inspectionTarget.value) return;
  
  const selectedUser = inspectionTarget.value;
  
  // Grant authority
  authStore.approveSupplier(selectedUser.tenant, selectedUser.id);
  
  toast.success(`Le KYC marchand de ${selectedUser.kyc?.companyName || selectedUser.company} a été validé avec succès !`);
  toast.info(`Le fournisseur est désormais autorisé à se connecter sur ${selectedUser.tenant}.enterprise.local.`);
  
  inspectionTarget.value = null;
}

function handleKeyDown(e) {
  if (e.key === 'Escape') {
    inspectionTarget.value = null;
  }
}
</script>

<style scoped>
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
  animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
