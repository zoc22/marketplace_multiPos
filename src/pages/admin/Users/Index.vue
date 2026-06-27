<template>
  <div class="space-y-6 animate-fade-in">
    
    <!-- HEADER SUMMARY CARD -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 border border-slate-800 p-5 rounded-2xl gap-4">
      <div>
        <h1 class="text-sm font-bold uppercase tracking-wider text-slate-100 font-mono flex items-center space-x-2">
          <ShieldCheckIcon class="w-4 h-4 text-indigo-400" />
          <span>Platform Accounts Security & KYC</span>
        </h1>
        <p class="text-[11px] text-slate-450 font-mono">Control buyer profiles, supplier business directories, and active tenant workspaces.</p>
      </div>
      <div class="bg-slate-950 border border-slate-850 px-3.5 py-2 text-right font-mono text-[10px] rounded-xl shrink-0">
        <span class="text-slate-500 uppercase block text-[8px] tracking-wider">TOTAL REGISTERS</span>
        <span class="text-indigo-400 font-bold text-xs">{{ authStore.users.length }} Active Security Profiles</span>
      </div>
    </div>

    <!-- Active Filters Row -->
    <div class="flex flex-wrap gap-2 select-none">
      <button 
        @click="changeFilter('all')"
        class="px-3.5 py-1.5 font-mono text-[10px] uppercase font-bold tracking-wider transition border rounded-xl"
        :class="activeFilter === 'all' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200'"
      >
        All Accounts ({{ authStore.users.length }})
      </button>
      <button 
        @click="changeFilter('supplier_pending')"
        class="px-3.5 py-1.5 font-mono text-[10px] uppercase font-bold tracking-wider transition border rounded-xl"
        :class="activeFilter === 'supplier_pending' ? 'bg-amber-600 border-amber-500 text-slate-950' : 'bg-slate-950 border-slate-850 text-amber-500 hover:text-amber-400'"
      >
        Pending KYC ({{ pendingKYCCount }})
      </button>
      <button 
        @click="changeFilter('supplier')"
        class="px-3.5 py-1.5 font-mono text-[10px] uppercase font-bold tracking-wider transition border rounded-xl"
        :class="activeFilter === 'supplier' ? 'bg-indigo-600 border-indigo-500 text-white font-bold' : 'bg-slate-950 border-slate-855 text-slate-400 hover:text-slate-200'"
      >
        Approved Suppliers
      </button>
      <button 
        @click="changeFilter('buyer')"
        class="px-3.5 py-1.5 font-mono text-[10px] uppercase font-bold tracking-wider transition border rounded-xl"
        :class="activeFilter === 'buyer' ? 'bg-indigo-600 border-indigo-500 text-white font-bold' : 'bg-slate-950 border-slate-855 text-slate-400 hover:text-slate-202'"
      >
        Buyers Only
      </button>
    </div>

    <!-- Skeleton Loader wrapper while simulating server retrieval time -->
    <div v-if="isLoading" class="p-6 border border-slate-800 bg-[#14141E] rounded-2xl">
      <SkeletonLoader type="table" :rows="5" />
    </div>

    <div v-else class="space-y-4">
      <!-- Listings Table / Grid -->
      <div v-if="paginatedUsers.length > 0" class="bg-[#14141E] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <table class="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr class="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase text-[9px] tracking-wider select-none">
              <th class="p-4">Validated Representative & Company</th>
              <th class="p-4">Contact Phone</th>
              <th class="p-4">Cleared Scope</th>
              <th class="p-4">Verification Check</th>
              <th class="p-4 text-center">KYC compliance action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60">
            <tr 
              v-for="(user, idx) in paginatedUsers" 
              :key="user.id"
              class="hover:bg-slate-900/30 transition-all font-sans text-xs text-slate-300"
              :class="idx % 2 === 0 ? 'bg-[#14141E]' : 'bg-[#181824]'"
            >
              <td class="p-4 space-y-0.5">
                <div class="font-bold text-slate-100">{{ user.name }}</div>
                <div class="font-mono text-[10px] text-slate-400">{{ user.email }}</div>
                <div v-if="user.company" class="text-[10px] bg-slate-950 border border-slate-850 px-1.5 py-0.5 rounded text-indigo-400 inline-block font-medium mt-1">
                  🏢 {{ user.company }}
                </div>
              </td>
              <td class="p-4 font-mono text-[11px] text-slate-400">
                {{ user.phone || 'No Phone Key' }}
              </td>
              <td class="p-4 font-mono text-[10px]">
                <span class="px-2 py-0.5 bg-indigo-950 text-indigo-300 uppercase font-bold tracking-wide text-[9px] border border-indigo-900/50 rounded">
                  {{ user.roles.join(', ') }}
                </span>
              </td>
              <td class="p-4">
                <span 
                  v-if="user.status === 'approved'"
                  class="inline-flex items-center space-x-1 font-semibold text-[10px] text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 px-2 py-0.5 rounded"
                >
                  <span>●</span> <span>ACTIVE</span>
                </span>
                <span 
                  v-else
                  class="inline-flex items-center space-x-1 font-semibold text-[10px] text-amber-450 bg-amber-950/20 border border-amber-900/30 px-2 py-0.5 rounded"
                >
                  <span>●</span> <span>PENDING KYC</span>
                </span>
              </td>
              <td class="p-4 text-center">
                <button 
                  v-if="user.status === 'pending'"
                  @click="inspectUserKYC(user)"
                  class="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-slate-950 text-[10px] font-mono font-bold uppercase tracking-wider transition rounded-lg"
                >
                  Inspect Compliance
                </button>
                <div v-else-if="user.kyc && user.kyc.verified" class="text-[10px] text-emerald-450 font-mono font-bold flex items-center justify-center space-x-1">
                  <CheckIcon class="w-3.5 h-3.5" />
                  <span>KYC AUDITED & APPROVED</span>
                </div>
                <span v-else class="text-slate-500 font-mono text-[11px]">No Audit Required</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PREMIUM EMPTY STATE FOR NO USERS MATCHING FILTER criteria -->
      <div v-else class="p-12 text-center border-2 border-dashed border-slate-800 bg-[#14141E]/40 rounded-2xl flex flex-col items-center justify-center space-y-4">
        <ExclamationTriangleIcon class="h-10 w-10 text-slate-600" />
        <div>
          <h3 class="text-sm font-mono font-bold text-slate-350 uppercase">No accounts found</h3>
          <p class="text-xs text-slate-500 mt-1">There are no records in the active registry that align with this security criteria.</p>
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
      class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all"
      id="kyc-audit-modal"
    >
      <div 
        class="bg-[#14141E] border border-slate-800 w-full max-w-lg overflow-hidden shadow-2xl p-6 space-y-4 rounded-2xl animate-slide-up"
      >
        <div class="flex justify-between items-start border-b border-slate-800 pb-3">
          <div>
            <h2 class="text-sm font-bold uppercase tracking-wider font-mono text-slate-100">Merchant Audit Validation</h2>
            <p class="text-[10px] font-mono text-indigo-400">Verify company business registers and tax compliance articles</p>
          </div>
          <button @click="inspectionTarget = null" class="text-slate-400 hover:text-white">
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>

        <!-- Compliance Form Details -->
        <div class="space-y-4 text-xs leading-relaxed max-h-[50vh] overflow-y-auto pr-1">
          <div class="grid grid-cols-2 gap-3 text-[11px]">
            <div>
              <span class="text-slate-500 uppercase block text-[9px] font-mono">Official Company Entity</span>
              <strong class="text-slate-200">{{ inspectionTarget.kyc?.companyName }}</strong>
            </div>
            <div>
              <span class="text-slate-500 uppercase block text-[9px] font-mono">Official Dir Representative</span>
              <strong class="text-slate-200">{{ inspectionTarget.kyc?.managerName }}</strong>
            </div>
          </div>

          <div class="p-3.5 bg-slate-950 border border-slate-850 rounded-xl space-y-2.5 font-mono text-[10px]">
            <div class="flex justify-between">
              <span class="text-slate-500">Registre du Commerce (RC):</span>
              <strong class="text-slate-300">{{ inspectionTarget.kyc?.rc }}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Numéro Unique d'Identifiant (NIU):</span>
              <strong class="text-slate-300">{{ inspectionTarget.kyc?.niu }}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Registre RCCM:</span>
              <strong class="text-slate-300">{{ inspectionTarget.kyc?.rccm }}</strong>
            </div>
            <div class="flex justify-between pt-1.5 border-t border-slate-900">
              <span class="text-slate-500">Attached Tax Dossier files:</span>
              <span class="text-indigo-400 underline cursor-pointer">{{ inspectionTarget.kyc?.fiscalDocs }}</span>
            </div>
          </div>

          <div>
            <span class="text-slate-500 uppercase block text-[9px] font-mono mb-1">Company Legal headquarters</span>
            <p class="p-3 bg-slate-950 border border-slate-850 text-slate-300 text-[11px] font-mono rounded-lg">
              {{ inspectionTarget.kyc?.address }}
            </p>
          </div>

          <!-- Simulated Permission maps -->
          <div>
            <span class="text-indigo-400 uppercase block text-[9px] font-mono mb-1 font-bold">Simulate Tenant Permission Mapping</span>
            <div class="grid grid-cols-2 gap-2 text-[10px] font-mono bg-slate-950 p-3 border border-slate-850 rounded-lg">
              <label class="flex items-center space-x-2">
                <input type="checkbox" checked disabled class="accent-indigo-500 rounded bg-slate-900 border-slate-800">
                <span>manage_stock</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="checkbox" checked disabled class="accent-indigo-500 rounded bg-slate-900 border-slate-800">
                <span>view_ledger</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="checkbox" checked disabled class="accent-indigo-500 rounded bg-slate-900 border-slate-800">
                <span>issue_rfq</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="checkbox" checked disabled class="accent-indigo-500 rounded bg-slate-900 border-slate-800">
                <span>approve_orders</span>
              </label>
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-800 flex justify-end space-x-2.5">
          <button 
            @click="inspectionTarget = null"
            class="px-4 py-2 border border-slate-850 hover:bg-slate-900 text-slate-400 text-xs font-mono uppercase tracking-wider rounded-xl"
          >
            Cancel Audit
          </button>
          
          <button 
            @click="approveKYC"
            class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono uppercase tracking-wider font-bold transition duration-200 rounded-xl"
          >
            Validate KYC Business Access
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
  
  toast.success(`Merchant KYC of ${selectedUser.kyc?.companyName || selectedUser.company} approved successfully!`);
  toast.info(`The supplier is now granted authorization to log into ${selectedUser.tenant}.enterprise.local.`);
  
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
