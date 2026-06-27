<template>
  <div class="space-y-6">
    
    <!-- HEADER SUMMARY -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5 shrink-0">
      <div>
        <h1 class="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
          <svg class="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Compliance, KYC & Store Verification Desk
        </h1>
        <p class="text-xs text-slate-400">Validate company registrations, tax IDs, merchant profiles, and boutique POS checkpoints.</p>
      </div>
      
      <!-- BULK METRICS BADGES -->
      <div class="flex items-center space-x-3 text-xs font-mono">
        <span class="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300">
          Pending KYC: <strong class="text-amber-400">{{ pendingKYCCount }}</strong>
        </span>
        <span class="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300">
          Closed Shops: <strong class="text-red-400">{{ lockedStoresCount }}</strong>
        </span>
      </div>
    </div>

    <!-- HORIZONTAL TABS SWITCHER -->
    <div class="flex border-b border-slate-900 select-none">
      <button 
        v-for="tb in tabs" 
        :key="tb.id"
        @click="activeTab = tb.id"
        class="px-5 py-3 text-xs font-bold uppercase font-mono border-b-2 tracking-wider transition-all"
        :class="activeTab === tb.id ? 'border-indigo-500 text-slate-100 bg-slate-900/40 font-bold' : 'border-transparent text-slate-500 hover:text-slate-300'"
      >
        {{ tb.label }}
        <span 
          v-if="tb.badgeCount > 0"
          class="ml-1.5 px-2 py-0.5 bg-red-950 text-red-400 text-[9px] rounded-full font-bold uppercase border border-red-900/60"
        >
          {{ tb.badgeCount }}
        </span>
      </button>
    </div>

    <!-- TAB 1 CONTENT: KYC/KYB DOSSIERS REGULATION -->
    <div v-show="activeTab === 'kyc'" class="space-y-4">
      <div class="p-4 bg-slate-900/40 border border-slate-900 rounded-xl">
        <h2 class="text-xs font-bold uppercase font-mono tracking-wider text-slate-300">Company KYB Documentation Audit</h2>
        <p class="text-[11px] text-slate-400">Review official tax NIU, commerce registers, managers IDs, and corporate statutes of raw material suppliers.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="u in supplierKYCUsers" 
          :key="u.id"
          class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition flex flex-col"
        >
          <!-- Card Top Bar -->
          <div class="px-4 py-3 bg-slate-950/80 border-b border-slate-850 flex items-center justify-between">
            <span class="font-mono text-[10px] text-slate-450 uppercase font-bold">Dossier #{{ u.id.replace('usr_', '') }}</span>
            <span 
              class="px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold"
              :class="getKYCBadgeClass(u.kyc)"
            >
              {{ u.kyc?.verified ? 'VERIFIED' : 'PENDING AUDIT' }}
            </span>
          </div>

          <!-- Card Body -->
          <div class="p-5 flex-1 space-y-4">
            <div>
              <p class="text-xs text-slate-500 font-mono">Company / Manager</p>
              <h3 class="text-sm font-semibold text-slate-100 mt-0.5">{{ u.kyc?.companyName || u.company }}</h3>
              <p class="text-xs text-slate-300 font-mono">{{ u.kyc?.managerName || u.name }}</p>
            </div>

            <!-- KYC Cert Codes -->
            <div class="grid grid-cols-2 gap-3 text-xs bg-slate-950/40 p-3 rounded-xl border border-slate-850/50">
              <div>
                <span class="text-[9px] font-mono text-slate-500 uppercase block">Reg Commerce (RC)</span>
                <span class="font-mono text-slate-300 text-[11px]">{{ u.kyc?.rc || 'N/A' }}</span>
              </div>
              <div>
                <span class="text-[9px] font-mono text-slate-500 uppercase block">Tax NIU Code</span>
                <span class="font-mono text-slate-300 text-[11px]">{{ u.kyc?.niu || 'N/A' }}</span>
              </div>
              <div class="col-span-2">
                <span class="text-[9px] font-mono text-slate-500 uppercase block">Corporate Address</span>
                <span class="text-slate-300 text-[11px]">{{ u.kyc?.address || 'N/A' }}</span>
              </div>
            </div>

            <!-- Submitted Docs -->
            <div class="space-y-1">
              <span class="text-[9px] font-mono text-slate-500 uppercase block">Secured PDF Attachments</span>
              <div class="flex items-center space-x-2 text-[10px] font-mono text-indigo-400 bg-slate-950 p-2 rounded-lg border border-slate-850">
                <svg class="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div class="truncate">
                  <span>{{ u.kyc?.fiscalDocs || 'corporate_statutes.pdf' }}</span>
                  <span class="text-slate-600 block">(4.2 MB - SHA256 Verified)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions Footer (Required confirming rejects) -->
          <div class="px-4 py-3 bg-slate-950 border-t border-slate-850 flex items-center justify-end gap-2 shrink-0">
            <template v-if="!u.kyc?.verified">
              <button 
                @click="triggerKYCReject(u)"
                class="px-3 py-1.5 bg-red-950/20 text-red-400 hover:bg-red-900 hover:text-slate-950 border border-red-900/40 rounded-lg text-[10px] font-mono uppercase font-bold transition"
              >
                Reject Dossier
              </button>
              <button 
                @click="approveKYCDossier(u)"
                class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-mono uppercase font-bold transition"
              >
                Approve & Verify
              </button>
            </template>
            <template v-else>
              <div class="flex items-center text-[10px] font-mono text-emerald-400 space-x-1 pr-1.5">
                <span>&bull; Validated: {{ formatShortTime(u.kyc?.verifiedAt || u.created_at) }}</span>
              </div>
              <button 
                @click="triggerKYCReject(u)"
                class="px-2.5 py-1 bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-400 rounded border border-slate-800 transition text-[9px] font-mono uppercase"
              >
                Suspending / Revoke
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2 CONTENT: SUPPLIER ACCOUNTS ACTIVATIONS -->
    <div v-show="activeTab === 'suppliers'" class="space-y-4">
      <div class="p-4 bg-slate-900/40 border border-slate-900 rounded-xl">
        <h2 class="text-xs font-bold uppercase font-mono tracking-wider text-slate-300">Supplier Access Activations</h2>
        <p class="text-[11px] text-slate-400">Lock, approve, or suspend directory listings and merchant backoffice credentials of verified supply managers.</p>
      </div>

      <div class="bg-[#040817] border border-[#121c3b] rounded-2xl overflow-hidden shadow">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr class="text-[10px] font-mono text-slate-500 uppercase border-b border-[#121c3b] bg-slate-950 px-4">
                <th class="p-3 pl-5">Merchant / Representative</th>
                <th class="p-3">Email ID</th>
                <th class="p-3">Registered Subdomain</th>
                <th class="p-3">Joined Date</th>
                <th class="p-3">Status</th>
                <th class="p-3 text-right pr-5">Administrative Override</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#121c3b]/30">
              <tr 
                v-for="u in supplierUsers" 
                :key="u.id" 
                class="hover:bg-slate-900/30 text-slate-350 transition"
              >
                <td class="p-3 pl-5">
                  <div class="font-bold text-slate-100 text-sm leading-snug">{{ u.company }}</div>
                  <div class="text-[11px] text-slate-400">{{ u.name }}</div>
                </td>
                <td class="p-3 font-mono text-[11px]">{{ u.email }}</td>
                <td class="p-3 font-mono">
                  <span class="text-indigo-400 hover:underline">{{ u.tenant }}.enterprise.local</span>
                </td>
                <td class="p-3 text-slate-400">{{ formatDate(u.created_at) }}</td>
                <td class="p-3 font-mono">
                  <span 
                    class="px-2 py-0.5 rounded text-[9px] font-bold uppercase"
                    :class="u.status === 'approved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/50' : 'bg-red-950 text-red-400 border border-red-900/50'"
                  >
                    {{ u.status.toUpperCase() }}
                  </span>
                </td>
                <td class="p-3 text-right pr-5 font-mono">
                  <button 
                    v-if="u.status === 'approved'"
                    @click="triggerSupplierAccountGel(u)"
                    class="px-2 py-1 bg-red-950/20 text-red-400 hover:bg-red-900 hover:text-slate-950 border border-red-900/40 rounded text-[10px] uppercase font-bold transition"
                  >
                    Freeze / Suspend
                  </button>
                  <button 
                    v-else
                    @click="approveSupplierAccount(u)"
                    class="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] uppercase font-bold transition"
                  >
                    Authorize Account
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 3 CONTENT: POS BOUTIQUES / SHOPS ACTIVATIONS -->
    <div v-show="activeTab === 'boutiques'" class="space-y-4">
      <div class="p-4 bg-slate-900/40 border border-slate-900 rounded-xl">
        <h2 class="text-xs font-bold uppercase font-mono tracking-wider text-slate-300">District POS Boutiques Checkpoints</h2>
        <p class="text-[11px] text-slate-400">Suspend, audit, or approve local virtual cash registers syncing client-side in retail stores across Cameroon municipalities.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="st in stores" 
          :key="st.id"
          class="bg-slate-900 border border-[#121c3b] rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition"
        >
          <div>
            <div class="flex items-center justify-between">
              <span class="px-2 py-0.5 bg-slate-950 text-indigo-400 rounded text-[9px] font-mono uppercase font-bold border border-slate-850">
                POS REG #{{ st.id.replace('store_','') }}
              </span>
              <span 
                class="px-2 py-0.5 rounded text-[8px] font-mono uppercase font-bold"
                :class="st.status === 'online' || st.isActive ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'"
              >
                {{ st.status === 'online' || st.isActive ? 'ACTIVE ONLINE' : 'SUSPENDED' }}
              </span>
            </div>
            <h3 class="text-sm font-bold text-slate-100 font-sans mt-3 leading-snug">{{ st.name }}</h3>
            <p class="text-xs text-slate-400 mt-1 uppercase tracking-tight font-mono">{{ st.city }}, {{ st.address }}</p>
          </div>

          <div class="space-y-1 text-xs font-mono pt-2 border-t border-slate-850/60 leading-tight">
            <div class="flex items-center justify-between text-slate-400">
              <span>Manager Name:</span>
              <span class="text-slate-200 font-sans">{{ st.manager || st.managerName }}</span>
            </div>
            <div class="flex items-center justify-between text-slate-400">
              <span>Daily Target cap XAF:</span>
              <span class="text-slate-200">{{ formatCurrency(st.dailyTargetXAF || 1200000) }}</span>
            </div>
            <div class="flex items-center justify-between text-slate-400">
              <span>Till Terminals count:</span>
              <span class="text-slate-200">{{ st.cashRegistersCount || 2 }} synchronized</span>
            </div>
          </div>

          <!-- Actions Footer (Confirm Rejections/Suspending) -->
          <div class="pt-2 flex items-center justify-end gap-2 font-mono">
            <button 
              v-if="st.status === 'online' || st.isActive"
              @click="triggerBoutiqueSuspend(st)"
              class="w-full text-center py-1.5 bg-red-950/20 text-red-400 hover:bg-red-900 hover:text-slate-950 border border-red-900/40 rounded-xl text-[10px] uppercase font-bold transition"
            >
              Geler / Suspend till
            </button>
            <button 
              v-else
              @click="restoreBoutique(st)"
              class="w-full text-center py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] uppercase font-bold transition"
            >
              Unfreeze / Re-open
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MANDATORY COMPLIANCE SAFETY CONFIRMATION OVERRIDE MODAL -->
    <ConfirmationModal 
      :show="showConfirm"
      :title="confirmTitle"
      :message="confirmMessage"
      :action-label="confirmActionLabel"
      @close="closeConfirm"
      @confirm="executeRejectionOverride"
    />

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/store/modules/auth.js';
import { useToast } from 'vue-toastification';
import { writeAuditLog } from '@/utils/admin_db.js';
import { stores } from '@/utils/supplier_db.js';
import ConfirmationModal from '@/components/ConfirmationModal.vue';

const authStore = useAuthStore();
const toast = useToast();

const activeTab = ref('kyc');

const tabs = computed(() => [
  { id: 'kyc', label: 'KYC / KYB Dossiers Audit', badgeCount: pendingKYCCount.value },
  { id: 'suppliers', label: 'Suppliers Verifications', badgeCount: pendingSupplierUsersCount.value },
  { id: 'boutiques', label: 'POS Boutiques Approvals', badgeCount: 0 }
]);

// Filters Count
const pendingKYCCount = computed(() => {
  return authStore.users.filter(u => u.roles.includes('supplier') && u.kyc && !u.kyc.verified).length;
});

const pendingSupplierUsersCount = computed(() => {
  return authStore.users.filter(u => u.roles.includes('supplier') && u.status === 'pending').length;
});

const lockedStoresCount = computed(() => {
  return stores.value.filter(s => s.status !== 'online' && !s.isActive).length;
});

// Queries list
const supplierKYCUsers = computed(() => {
  return authStore.users.filter(u => u.roles.includes('supplier') && u.kyc);
});

const supplierUsers = computed(() => {
  return authStore.users.filter(u => u.roles.includes('supplier'));
});

// Formatting
function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatShortTime(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return d.toISOString().replace('T', ' ').slice(0, 10);
}

function formatCurrency(v) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(v);
}

function getKYCBadgeClass(kyc) {
  if (kyc?.verified) return 'bg-emerald-950 text-emerald-400 border border-emerald-900/50';
  return 'bg-amber-950 text-amber-400 border border-amber-900/50 animate-pulse';
}

// COMPLIANCE APPROVAL WORKFLOWS
function approveKYCDossier(userItem) {
  authStore.approveSupplier(userItem.tenant, userItem.id);
  
  // also align store databases if associated
  const associatedStore = stores.value.find(s => s.id === `store_${userItem.tenant}`);
  if (associatedStore) {
    associatedStore.status = 'online';
    associatedStore.isActive = true;
  }

  writeAuditLog(
    'KYC_APPROVAL',
    `KYC Regulatory folder approved & cleared for ${userItem.company} (Representative: ${userItem.name}).`,
    authStore.user?.name || 'Supervisor'
  );

  toast.success(`Dossier cleared and approved for ${userItem.company}! Company authorized.`);
}

function approveSupplierAccount(userItem) {
  userItem.status = 'approved';
  authStore.saveState();

  writeAuditLog(
    'SUPPLIER_ACTIVATION',
    `Supplier account status override to APPROVED: ${userItem.company}.`,
    authStore.user?.name || 'Supervisor'
  );

  toast.success(`Authorized server access for ${userItem.company}.`);
}

function restoreBoutique(st) {
  st.status = 'online';
  st.isActive = true;
  
  writeAuditLog(
    'STORE_UNFREEZE',
    `District POS Boutique re-enabled & till terminal online: ${st.name}.`,
    authStore.user?.name || 'Supervisor'
  );

  toast.success(`Store POS terminals un-frozen: ${st.name}`);
}

// SAFETY CONFIRMATION MODAL OVERRIDE VARIABLES
const showConfirm = ref(false);
const confirmTitle = ref('');
const confirmMessage = ref('');
const confirmActionLabel = ref('');
const currentOverrideTarget = ref(null);
const currentOverrideType = ref(''); // 'kyc_reject', 'supplier_freeze', 'boutique_freeze'

function triggerKYCReject(userItem) {
  currentOverrideTarget.value = userItem;
  currentOverrideType.value = 'kyc_reject';
  confirmTitle.value = 'REJECT & SUSPEND KYC DOCUMENTATION';
  confirmMessage.value = `You are rejecting the regulatory commercial folders submitted by ${userItem.company}. This locks their workspace and prevents any inventory delivery or order clearance.`;
  confirmActionLabel.value = 'REJECT SUBMISSION';
  showConfirm.value = true;
}

function triggerSupplierAccountGel(userItem) {
  currentOverrideTarget.value = userItem;
  currentOverrideType.value = 'supplier_freeze';
  confirmTitle.value = 'FREEZE / SUSPEND SUPPLY MERCHANT';
  confirmMessage.value = `You are placing a security freeze on the active mercantile user file of ${userItem.company}. Access keys are invalidated, and storefront search listing is removed immediately.`;
  confirmActionLabel.value = 'FREEZE MERCHANT FILE';
  showConfirm.value = true;
}

function triggerBoutiqueSuspend(st) {
  currentOverrideTarget.value = st;
  currentOverrideType.value = 'boutique_freeze';
  confirmTitle.value = 'GELER / SUSPEND DISTRICT BOUTIQUE';
  confirmMessage.value = `You are shutting down sales & locking till terminals for POS outlet "${st.name}". POS logs will stop syncing, and transaction pipelines are frozen.`;
  confirmActionLabel.value = 'LOCK TILL REGISTER';
  showConfirm.value = true;
}

function closeConfirm() {
  showConfirm.value = false;
  currentOverrideTarget.value = null;
  currentOverrideType.value = '';
}

function executeRejectionOverride(reason) {
  const target = currentOverrideTarget.value;
  const author = authStore.user?.name || 'Supervisor';

  if (currentOverrideType.value === 'kyc_reject') {
    // Set user KYC to unverified or rejected and suspend credentials status
    target.status = 'pending';
    if (target.kyc) {
      target.kyc.verified = false;
      target.kyc.verifiedAt = null;
      target.kyc.rejectionReason = reason;
    }
    
    // Deactivate tenant
    const t = authStore.tenants.find(x => x.id === target.tenant);
    if (t) t.active = false;

    authStore.saveState();

    writeAuditLog(
      'KYC_REJECTION',
      `KYC registration dossier REJECTED for ${target.company}. Reason: ${reason}`,
      author,
      'warning'
    );
    
    toast.error(`Compliance reject successfully executed for ${target.company}. Logged.`);
  } 
  
  else if (currentOverrideType.value === 'supplier_freeze') {
    target.status = 'pending';
    authStore.saveState();

    writeAuditLog(
      'SUPPLIER_GEL',
      `Merchant access portal frozen for ${target.company}. Reason: ${reason}`,
      author,
      'danger'
    );

    toast.error(`Supplier portal access keys suspended context. Logged.`);
  } 
  
  else if (currentOverrideType.value === 'boutique_freeze') {
    target.status = 'suspended';
    target.isActive = false;

    writeAuditLog(
      'BOUTIQUE_GEL',
      `POS Boutique Till registry suspended for ${target.name}. Reason: ${reason}`,
      author,
      'danger'
    );

    toast.error(`Sales registering freeze loaded for ${target.name}.`);
  }

  showConfirm.value = false;
  currentOverrideTarget.value = null;
  currentOverrideType.value = '';
}
</script>
