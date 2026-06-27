<template>
  <div class="space-y-6 animate-fade-in">
    
    <!-- HEADER SUMMARY CARD -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900/20 p-5 border border-slate-900">
      <div>
        <h1 class="text-sm font-bold uppercase tracking-wider text-slate-150 font-mono">Platform Accounts Security & KYC</h1>
        <p class="text-[11px] text-slate-500 font-mono">Control buyer profiles, supplier business directories, and active tenant workspaces.</p>
      </div>
      <div class="bg-indigo-950/40 border border-indigo-900/30 px-3.5 py-2 mt-3 md:mt-0 text-right font-mono text-[10px]">
        <span class="text-slate-500 uppercase block text-[8px] tracking-wider">TOTAL REGISTERS</span>
        <span class="text-indigo-400 font-bold text-xs">{{ authStore.users.length }} Active Security Profiles</span>
      </div>
    </div>

    <!-- Active Filters Row -->
    <div class="flex flex-wrap gap-2 select-none">
      <button 
        @click="changeFilter('all')"
        class="px-3.5 py-1.5 font-mono text-[10px] uppercase font-bold tracking-wider transition border custom-tooltip-trigger"
        data-tooltip="View standard registry database"
        :class="activeFilter === 'all' ? 'bg-indigo-650 border-indigo-500 text-white' : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-200'"
      >
        All Accounts ({{ authStore.users.length }})
      </button>
      <button 
        @click="changeFilter('supplier_pending')"
        class="px-3.5 py-1.5 font-mono text-[10px] uppercase font-bold tracking-wider transition border custom-tooltip-trigger"
        data-tooltip="Requires manual regulatory action"
        :class="activeFilter === 'supplier_pending' ? 'bg-amber-600 border-amber-500 text-slate-950' : 'bg-slate-950 border-slate-900 text-amber-500 hover:text-amber-400'"
      >
        Pending KYC ({{ pendingKYCCount }})
      </button>
      <button 
        @click="changeFilter('supplier')"
        class="px-3.5 py-1.5 font-mono text-[10px] uppercase font-bold tracking-wider transition border custom-tooltip-trigger"
        data-tooltip="Verified registered merchant units"
        :class="activeFilter === 'supplier' ? 'bg-indigo-650 border-indigo-500 text-white' : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-205'"
      >
        Approved Suppliers
      </button>
      <button 
        @click="changeFilter('buyer')"
        class="px-3.5 py-1.5 font-mono text-[10px] uppercase font-bold tracking-wider transition border custom-tooltip-trigger"
        data-tooltip="Acquirers and wholesale buyers"
        :class="activeFilter === 'buyer' ? 'bg-indigo-650 border-indigo-500 text-white' : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-205'"
      >
        Buyers Only
      </button>
    </div>

    <!-- Skeleton Loader wrapper while simulating server retrieval time -->
    <div v-if="isLoading" class="p-6 border border-slate-900 bg-slate-950">
      <SkeletonLoader type="table" :rows="5" />
    </div>

    <div v-else class="space-y-4">
      <!-- Listings Table / Grid -->
      <div v-if="paginatedUsers.length > 0" class="bg-slate-950 border border-slate-900 overflow-hidden shadow-xl">
        <table class="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr class="bg-slate-900/40 border-b border-slate-900 text-slate-400 font-bold uppercase text-[9px] tracking-wider select-none">
              <th class="p-4">Validated Representative & Company</th>
              <th class="p-4">Contact Phone</th>
              <th class="p-4">Cleared Scope</th>
              <th class="p-4">Verification Check</th>
              <th class="p-4 text-center">KYC compliance action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-900/60">
            <tr 
              v-for="user in paginatedUsers" 
              :key="user.id"
              class="hover:bg-slate-900/20 transition-all font-sans text-xs text-slate-300"
            >
              <td class="p-4 space-y-0.5">
                <div class="font-bold text-slate-200">{{ user.name }}</div>
                <div class="font-mono text-[10px] text-slate-500">{{ user.email }}</div>
                <div v-if="user.company" class="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-indigo-400 inline-block font-medium">
                  🏢 {{ user.company }}
                </div>
              </td>
              <td class="p-4 font-mono text-[11px] text-slate-400">
                {{ user.phone || 'No Phone Key' }}
              </td>
              <td class="p-4 font-mono text-[10px]">
                <span class="px-2 py-0.5 bg-indigo-950 text-indigo-300 uppercase font-bold tracking-wide text-[9px]">
                  {{ user.roles.join(', ') }}
                </span>
              </td>
              <td class="p-4">
                <span 
                  v-if="user.status === 'approved'"
                  class="inline-flex items-center space-x-1 font-semibold text-[10px] text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 px-2 py-0.5"
                >
                  <span>●</span> <span>ACTIVE</span>
                </span>
                <span 
                  v-else
                  class="inline-flex items-center space-x-1 font-semibold text-[10px] text-amber-450 bg-amber-950/20 border border-amber-900/30 px-2 py-0.5"
                >
                  <span>●</span> <span>PENDING KYC</span>
                </span>
              </td>
              <td class="p-4 text-center">
                <button 
                  v-if="user.status === 'pending'"
                  @click="inspectUserKYC(user)"
                  class="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-slate-950 text-[10px] font-mono font-bold uppercase tracking-wider transition custom-tooltip-trigger"
                  data-tooltip="Inspect and override limits"
                >
                  Inspect Compliance
                </button>
                <div v-else-if="user.kyc && user.kyc.verified" class="text-[10px] text-emerald-500 font-mono">
                  &check; KYC AUDITED & APPROVED
                </div>
                <span v-else class="text-slate-500 font-mono text-[11px]">No Audit Required</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PREMIUM EMPTY STATE FOR NO USERS MATCHING FILTER criteria -->
      <div v-else class="p-12 text-center border-2 border-dashed border-slate-900 bg-slate-900/10 flex flex-col items-center justify-center space-y-4">
        <svg class="h-10 w-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
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
      @click="inspectionTarget = null" 
      class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all"
      id="kyc-audit-modal"
    >
      <div 
        @click.stop 
        class="bg-slate-900 border border-slate-800 w-full max-w-lg overflow-hidden shadow-2xl p-6 space-y-4 animate-fade-in"
      >
        <div class="flex justify-between items-start border-b border-slate-900 pb-3">
          <div>
            <h2 class="text-sm font-bold uppercase tracking-wider font-mono text-slate-100">Merchant Audit Validation</h2>
            <p class="text-[10px] font-mono text-indigo-400">Verify company business registers and tax compliance articles</p>
          </div>
          <button @click="inspectionTarget = null" class="text-slate-500 hover:text-slate-300 font-mono text-xs">
            [CLOSE X]
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

          <div class="p-3.5 bg-slate-950 border border-slate-900 space-y-2.5 font-mono text-[10px]">
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
            <p class="p-3 bg-slate-950 border border-slate-900 text-slate-300 text-[11px] font-mono">
              {{ inspectionTarget.kyc?.address }}
            </p>
          </div>

          <!-- Simulated Permission maps -->
          <div>
            <span class="text-[#FF8C00] uppercase block text-[9px] font-mono mb-1">Simulate Tenant Permission Mapping</span>
            <div class="grid grid-cols-2 gap-2 text-[10px] font-mono bg-slate-950 p-3 border border-slate-900/60">
              <label class="flex items-center space-x-2">
                <input type="checkbox" checked disabled class="accent-[#FF8C00]">
                <span>manage_stock</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="checkbox" checked disabled class="accent-[#FF8C00]">
                <span>view_ledger</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="checkbox" checked disabled class="accent-[#FF8C00]">
                <span>issue_rfq</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="checkbox" checked disabled class="accent-[#FF8C00]">
                <span>approve_orders</span>
              </label>
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-900 flex justify-end space-x-2.5">
          <button 
            @click="inspectionTarget = null"
            class="px-4 py-2 border border-slate-800 hover:border-slate-700 text-slate-400 text-xs font-mono uppercase tracking-wider"
          >
            Cancel Audit
          </button>
          
          <button 
            @click="approveKYC"
            class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono uppercase tracking-wider font-bold transition duration-200"
          >
            Validate KYC Business Access
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/store/modules/auth.js';
import { useToast } from 'vue-toastification';
import Pagination from '@/components/Pagination.vue';
import SkeletonLoader from '@/components/SkeletonLoader.vue';

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
</script>
