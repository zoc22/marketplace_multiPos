<template>
  <div class="space-y-6">
    
    <!-- TOP BANNER & CONSOLE WELCOME -->
    <div class="p-6 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div class="absolute top-0 right-0 p-8 opacity-5">
        <svg class="h-40 w-40 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
      </div>
      <div>
        <div class="flex items-center space-x-3">
          <span class="px-2.5 py-0.5 bg-red-950 text-red-400 font-mono text-[9px] uppercase font-bold border border-red-900 rounded-md">
            CORE ENGINE STATUS: NOMINAL
          </span>
          <span class="font-mono text-xs text-slate-500">v3.5L-Stable</span>
        </div>
        <h1 class="text-xl font-bold font-mono text-slate-100 mt-2">B2B Core Administration Hub</h1>
        <p class="text-xs text-slate-400 max-w-xl mt-1">
          Simulated node system governing multi-tenant merchant approvals, product safety queues, disputes settlements, internal access permissions, and continuous log audits.
        </p>
      </div>

      <!-- SIMULATED ADMINISTRATOR SUB-ROLE ACTUATOR (DYNAMIC BACKOFFICE DEMO) -->
      <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 shrink-0 w-full md:w-auto">
        <div class="text-[9px] font-mono uppercase font-bold text-indigo-400 tracking-wider mb-2">
          &Xi; Security Persona Switcher
        </div>
        <div class="flex flex-col gap-1.5 min-w-[200px]">
          <label class="text-[10px] font-mono text-slate-400">Active Admin Persona:</label>
          <select 
            v-model="activeAdminSubRole"
            @change="updateActivePersona"
            class="bg-slate-900 border border-slate-800 text-xs font-mono text-slate-100 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="supervisor">Supervisor (Full Privilege)</option>
            <option value="finance_officer">Finance Officer (Ledger & Escrow)</option>
            <option value="moderator">Product Moderator (Safety & Stores)</option>
            <option value="support_rep">Support Representative (Disputes & Tickets)</option>
          </select>
          <p class="text-[9px] text-slate-500 italic mt-1 leading-tight">
            Swaps workspace menus & visible UI modules instantly.
          </p>
        </div>
      </div>
    </div>

    <!-- DYNAMIC ALERTS ACCORDING TO ROLE RESTRICIONS / CLARANCES -->
    <div v-if="activeAdminSubRole !== 'supervisor'" class="p-3 bg-indigo-950/40 border border-indigo-900/60 rounded-xl flex items-center space-x-3 text-xs">
      <div class="h-6 w-6 rounded-full bg-indigo-900 text-indigo-400 flex items-center justify-center font-bold font-mono">i</div>
      <p class="text-slate-350">
        You are navigating under <span class="font-bold text-indigo-400 font-mono">{{ (activeAdminSubRole || '').toUpperCase().replace('_', ' ') }}</span> clearance details. Certain settings are locked or filtered based on role boundaries.
      </p>
    </div>

    <!-- THE STATUS METRICS BENTO GRID -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      <!-- Suppliers compliant dossiers -->
      <router-link to="/admin/users/verification" class="p-4 bg-[#090f23] hover:bg-slate-900 border border-[#121c3b] hover:border-slate-800 rounded-2xl transition group">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-mono text-slate-450 uppercase font-bold tracking-wider">KYC Compliance</span>
          <span class="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
        </div>
        <div class="text-2xl font-bold font-mono text-slate-100 mt-2">
          {{ pendingKYCCount }} <span class="text-xs text-slate-400 font-normal">pending</span>
        </div>
        <p class="text-[10px] text-slate-450 mt-1 transition group-hover:text-slate-300">
          Verify corporate registrations &rarr;
        </p>
      </router-link>

      <!-- Shops compliant dossiers -->
      <router-link to="/admin/users/verification" class="p-4 bg-[#090f23] hover:bg-slate-900 border border-[#121c3b] hover:border-slate-800 rounded-2xl transition group">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-mono text-slate-450 uppercase font-bold tracking-wider">Boutiques Approvals</span>
          <span class="h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
        </div>
        <div class="text-2xl font-bold font-mono text-slate-100 mt-2">
          {{ pendingStoresCount }} <span class="text-xs text-slate-400 font-normal">waiting</span>
        </div>
        <p class="text-[10px] text-slate-450 mt-1 transition group-hover:text-slate-300">
          Store virtual POS checkups &rarr;
        </p>
      </router-link>

      <!-- Products moderation -->
      <router-link to="/admin/products" class="p-4 bg-[#090f23] hover:bg-slate-900 border border-[#121c3b] hover:border-slate-800 rounded-2xl transition group">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-mono text-slate-450 uppercase font-bold tracking-wider">Product Catalog</span>
          <span class="text-[9px] font-mono text-emerald-400 uppercase font-bold border border-emerald-950/60 bg-emerald-950/20 px-1 py-0.5 rounded">Active Audit</span>
        </div>
        <div class="text-2xl font-bold font-mono text-slate-100 mt-2">
          {{ pendingProductsCount }} <span class="text-xs text-slate-400 font-normal font-mono">under mod</span>
        </div>
        <p class="text-[10px] text-slate-450 mt-1 transition group-hover:text-slate-300">
          Enforce catalog safety guidelines &rarr;
        </p>
      </router-link>

      <!-- Disputes tracker -->
      <router-link to="/admin/disputes" class="p-4 bg-[#090f23] hover:bg-slate-900 border border-[#121c3b] hover:border-slate-800 rounded-2xl transition group">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-mono text-slate-450 uppercase font-bold tracking-wider">Active Disputes</span>
          <span class="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
        </div>
        <div class="text-2xl font-bold font-mono text-red-400 mt-2">
          {{ openDisputesCount }} <span class="text-xs text-slate-400 font-normal">active</span>
        </div>
        <p class="text-[10px] text-slate-450 mt-1 transition group-hover:text-slate-300">
          Resolution & escrow overrides &rarr;
        </p>
      </router-link>

    </div>

    <!-- MAIN TWO-COLUMN LAYOUT -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- LEFT WORKSPACE BLOCK (DYNAMIC PANELS BASED ON CURRENT USER ROLE) -->
      <div class="lg:col-span-8 space-y-6">
        
        <!-- MODULE: USER INTEGRATOR (Roles Management & Creating Internal Accounts) - VISIBLE ONLY FOR SUPERVISORS / MANAGERS -->
        <div 
          v-if="hasAccess('user_creation')"
          class="p-6 bg-[#040817] border border-[#121c3b] rounded-2xl space-y-4"
        >
          <div class="flex items-center justify-between border-b border-[#121c3b] pb-3 shrink-0">
            <div>
              <h2 class="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono">Colleague & Internal User Provisioning</h2>
              <p class="text-xs text-slate-400">Add team profiles with direct administrative clearances.</p>
            </div>
            <span class="px-2 py-0.5 bg-indigo-950 text-indigo-400 rounded text-[9px] font-mono font-bold uppercase">
              Management Clearances Only
            </span>
          </div>

          <!-- USER CREATION FORM FORMULATED -->
          <form @submit.prevent="createInternalColleague" class="space-y-4 pt-1">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">Full Legal Name</label>
                <input 
                  type="text" 
                  v-model="newColleague.name" 
                  required
                  placeholder="e.g. Marie-Therese Kamga"
                  class="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg p-2.5 text-xs text-slate-100 font-mono placeholder-slate-650 focus:outline-none transition"
                />
              </div>
              <div class="space-y-1">
                <label class="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">Institutional Email</label>
                <input 
                  type="email" 
                  v-model="newColleague.email" 
                  required
                  placeholder="e.g. kamga@enterprise.local"
                  class="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg p-2.5 text-xs text-slate-100 font-mono placeholder-slate-650 focus:outline-none transition"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="space-y-1">
                <label class="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">Temporary Security Code</label>
                <input 
                  type="password" 
                  v-model="newColleague.password" 
                  required
                  placeholder="Passcode password"
                  class="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg p-2.5 text-xs text-slate-100 font-mono placeholder-slate-650 focus:outline-none transition"
                />
              </div>
              <div class="space-y-1">
                <label class="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">Active Security Clearance Tag</label>
                <select 
                  v-model="newColleague.subRole"
                  class="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-xs text-slate-100 rounded-lg p-2.5 focus:outline-none font-mono transition"
                >
                  <option value="supervisor">Supervisor (Global Vault access)</option>
                  <option value="finance_officer">Finance Officer (Escrow holding & Ledger)</option>
                  <option value="moderator">Product Moderator (Safety review queue)</option>
                  <option value="support_rep">Support Agent (Disputes triage)</option>
                </select>
              </div>
              <div class="space-y-1">
                <label class="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">Assigned Department</label>
                <input 
                  type="text" 
                  v-model="newColleague.department" 
                  placeholder="e.g. Legal Compliance"
                  class="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg p-2.5 text-xs text-slate-100 font-mono placeholder-slate-650 focus:outline-none transition"
                />
              </div>
            </div>

            <div class="flex justify-end pt-2">
              <button 
                type="submit"
                class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-mono font-bold uppercase rounded-lg text-white transition flex items-center space-x-2"
              >
                <span>&plus; Provision Account</span>
              </button>
            </div>
          </form>

          <!-- INTERNAL LIST OF ACTIVE ADMINISTRATIVE SYSTEM COLLEAGUES -->
          <div class="mt-4 pt-3 border-t border-[#121c3b]/50">
            <h3 class="text-[10px] font-mono uppercase text-slate-400 font-bold mb-2">Platform Internal Cadre (System Team)</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse font-sans text-xs">
                <thead>
                  <tr class="text-[10px] font-mono text-slate-500 uppercase border-b border-[#121c3b]">
                    <th class="pb-2">Colleague</th>
                    <th class="pb-2">Electronic ID / Email</th>
                    <th class="pb-2">Clearance Duty</th>
                    <th class="pb-2">Status</th>
                    <th class="pb-2 text-right">Duty Override</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#121c3b]/30">
                  <tr v-for="cl in platformInternalCadre" :key="cl.id" class="text-slate-300">
                    <td class="py-2.5 font-semibold text-slate-100">{{ cl.name }}</td>
                    <td class="py-2.5 font-mono text-slate-400">{{ cl.email }}</td>
                    <td class="py-2.5 font-mono">
                      <span class="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-800 text-slate-200 font-semibold">
                        {{ (cl.subRole || 'supervisor').toUpperCase().replace('_', ' ') }}
                      </span>
                    </td>
                    <td class="py-2.5 font-mono h-4">
                      <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block mr-1"></span> Enabled
                    </td>
                    <td class="py-2.5 text-right font-mono">
                      <button 
                        @click="triggerRevokeColleague(cl)"
                        class="text-[10px] text-red-400 hover:text-red-300 hover:underline"
                        :disabled="cl.id === 'usr_admin'"
                      >
                        {{ cl.id === 'usr_admin' ? '[ Locked ]' : '[ Revoke ]' }}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <!-- MODULE: ROLE MATRIX DICTIONARY -->
        <div class="p-6 bg-[#040817] border border-[#121c3b] rounded-2xl space-y-4">
          <div class="border-b border-[#121c3b] pb-3 shrink-0">
            <h2 class="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono">B2B Core Clearance Matrix</h2>
            <p class="text-xs text-slate-400">Dynamic capability checks defining access tiers.</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-3 bg-slate-950 border border-slate-900 rounded-xl space-y-2">
              <span class="px-2 py-0.5 bg-red-950 text-red-400 rounded text-[9px] font-mono font-bold uppercase border border-red-900/40">Supervisor</span>
              <p class="text-xs text-slate-300 leading-normal">
                Absolute platform authority. Can create colleagues, adjust commission policies, override dispute escrows, geler vendors, and roll back backups.
              </p>
            </div>
            <div class="p-3 bg-slate-950 border border-slate-900 rounded-xl space-y-2">
              <span class="px-2 py-0.5 bg-indigo-950 text-indigo-400 rounded text-[9px] font-mono font-bold uppercase border border-indigo-900/40">Finance Officer</span>
              <p class="text-xs text-slate-300 leading-normal">
                Escrow operations specialist. Authorized to audit transactions, approve withdrawals, block suspicious pay-routes. Product editing is suspended.
              </p>
            </div>
            <div class="p-3 bg-slate-950 border border-slate-900 rounded-xl space-y-2">
              <span class="px-2 py-0.5 bg-emerald-950 text-emerald-400 rounded text-[9px] font-mono font-bold uppercase border border-emerald-900/40">Product Moderator</span>
              <p class="text-xs text-slate-300 leading-normal">
                Catalog quality specialist. Directly approves, requests amendments, or rejects raw material supplies, certified weights, and merchant storefront KYC.
              </p>
            </div>
            <div class="p-3 bg-[#111c12]/20 border border-amber-950/40 rounded-xl space-y-2">
              <span class="px-2 py-0.5 bg-amber-950 text-amber-400 rounded text-[9px] font-mono font-bold uppercase border border-amber-900/40">Support Rep</span>
              <p class="text-xs text-slate-300 leading-normal">
                Customer success team. Reads and responds to buyer disputes, modifies technical tickets, assigns cases to operators. Cannot release funding.
              </p>
            </div>
          </div>
        </div>

      </div>

      <!-- RIGHT COLUMN: AUDIT LOGS & ACTIONS -->
      <div class="lg:col-span-4 space-y-6">
        
        <!-- TELEMETRY PREVIEW / REAL-TIME METRICS STREAM -->
        <div class="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-bold uppercase font-mono tracking-wider text-slate-200">System Telemetry</h3>
            <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          
          <div class="space-y-2.5 pt-1 text-xs">
            <div class="flex items-center justify-between font-mono">
              <span class="text-slate-450 uppercase text-[10px]">CPU Stack Load:</span>
              <span class="text-slate-200">4.12%</span>
            </div>
            <div class="w-full bg-slate-950 h-1.5 roundedOverflow-hidden rounded-full border border-slate-850">
              <div class="bg-indigo-500 h-full rounded-full" style="width: 4%"></div>
            </div>

            <div class="flex items-center justify-between font-mono">
              <span class="text-slate-450 uppercase text-[10px]">Buffer Allocated:</span>
              <span class="text-slate-200">2.14 / 8 GB</span>
            </div>
            <div class="w-full bg-slate-950 h-1.5 roundedOverflow-hidden rounded-full border border-slate-850">
              <div class="bg-teal-500 h-full rounded-full" style="width: 26%"></div>
            </div>

            <div class="flex items-center justify-between font-mono">
              <span class="text-slate-450 uppercase text-[10px]">API Latency (Douala):</span>
              <span class="text-slate-200">14 ms</span>
            </div>
            <div class="flex items-center justify-between font-mono">
              <span class="text-slate-450 uppercase text-[10px]">Active Sockets Web:</span>
              <span class="text-slate-250">402 live nodes</span>
            </div>
          </div>
        </div>

        <!-- RECENT SECURITY AUDIT AUDIENCE LOGS -->
        <div class="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2 shrink-0">
            <h3 class="text-xs font-bold uppercase font-mono tracking-wider text-slate-200">Recent Audit Records</h3>
            <router-link to="/admin/system/logs" class="text-[10px] font-mono text-indigo-400 hover:underline">Full Log &rarr;</router-link>
          </div>

          <div class="space-y-3">
            <div 
              v-for="lg in systemLogs.slice(0, 5)" 
              :key="lg.id" 
              class="p-2.5 bg-slate-950 rounded-lg space-y-1 hover:border hover:border-slate-800 transition"
            >
              <div class="flex items-center justify-between">
                <span class="px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-slate-350 font-mono text-[8px] uppercase tracking-wider font-bold">
                  {{ lg.action }}
                </span>
                <span class="text-[8px] font-mono text-slate-500">
                  {{ formatTime(lg.date) }}
                </span>
              </div>
              <p class="text-[11px] text-slate-300 font-sans leading-relaxed">
                {{ lg.details }}
              </p>
              <div class="text-[9px] font-mono text-slate-500 flex items-center justify-between pt-0.5">
                <span>By: {{ lg.author }}</span>
                <span :class="getLevelColor(lg.level || 'info')" class="text-[8px] font-bold uppercase">
                  {{ lg.level || 'info' }}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- MANDATORY REJECTION / FREEZE CONFIGURATION SAFETY MODAL -->
    <ConfirmationModal 
      :show="showSafetyModal"
      :title="safetyTitle"
      :message="safetyMessage"
      :action-label="safetyActionLabel"
      @close="closeSafetyModal"
      @confirm="executeSafetyAction"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/store/modules/auth.js';
import { useToast } from 'vue-toastification';
import { systemLogs, writeAuditLog } from '@/utils/admin_db.js';
import { products, stores } from '@/utils/supplier_db.js';
import ConfirmationModal from '@/components/ConfirmationModal.vue';

const authStore = ref(useAuthStore());
const toast = useToast();

const activeAdminSubRole = ref('supervisor');

// Loaded inputs
const newColleague = ref({
  name: '',
  email: '',
  password: '',
  subRole: 'support_rep',
  department: 'Main Desk Ops'
});

// Calculate statistics dynamically
const pendingKYCCount = computed(() => {
  return authStore.value.users.filter(u => u.roles.includes('supplier') && u.status === 'pending').length;
});

const pendingStoresCount = computed(() => {
  return stores.value.filter(s => s.status !== 'online').length;
});

const pendingProductsCount = computed(() => {
  return products.value.filter(p => !p.moderationStatus || p.moderationStatus === 'Pending').length;
});

// Import disputes or counts dynamically
import { disputes } from '@/utils/admin_db.js';
const openDisputesCount = computed(() => {
  return disputes.value.filter(d => d.status === 'open' || d.status === 'under_review').length;
});

const platformInternalCadre = computed(() => {
  return authStore.value.users.filter(u => u.roles.includes('admin') || u.subRole);
});

// On loaded, pick active subRole from session
onMounted(() => {
  const currentSessionUser = authStore.value.user;
  if (currentSessionUser) {
    if (!currentSessionUser.subRole) {
      currentSessionUser.subRole = 'supervisor'; // supervisor gets everything
      authStore.value.saveState();
    }
    activeAdminSubRole.value = currentSessionUser.subRole;
  }
});

function updateActivePersona() {
  const currentSessionUser = authStore.value.user;
  if (currentSessionUser) {
    currentSessionUser.subRole = activeAdminSubRole.value;
    authStore.value.saveState();
    writeAuditLog(
      'ROLE_SWITCH',
      `Administrator simulated security session swapped to ${(activeAdminSubRole.value || '').toUpperCase()}`,
      currentSessionUser.name,
      'security'
    );
    toast.info(`Swapped clearance to ${(activeAdminSubRole.value || '').toUpperCase().replace('_', ' ')}.`);
  }
}

// Access Control Matrix checks
function hasAccess(capability) {
  if (activeAdminSubRole.value === 'supervisor') return true;
  
  if (capability === 'user_creation') {
    return false; // Supervisor exclusive
  }
  return true;
}

// Formatting helpers
function formatTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toISOString().replace('T', ' ').slice(11, 19);
}

function getLevelColor(lvl) {
  const map = {
    info: 'text-indigo-400',
    debug: 'text-slate-500',
    security: 'text-red-400',
    warning: 'text-orange-400',
    danger: 'text-red-500'
  };
  return map[lvl] || 'text-slate-400';
}

// CREATING INTERNAL COLLEAGUE (INTERNAL USERS WITH SELECTED PERMISSIONS/ROLES)
function createInternalColleague() {
  const exists = authStore.value.users.find(u => u.email.toLowerCase() === newColleague.value.email.toLowerCase());
  if (exists) {
    toast.error('A user with that credential email already exists.');
    return;
  }

  // Create internal administrator with subRole
  const structuredAdminUser = {
    id: `usr_colleague_${Date.now()}`,
    email: newColleague.value.email,
    password: newColleague.value.password,
    name: newColleague.value.name,
    company: 'Enterprise Admin Corp',
    phone: '+237 000 000 000',
    roles: ['admin'],
    subRole: newColleague.value.subRole,
    department: newColleague.value.department,
    status: 'approved',
    twoFactorEnabled: false,
    created_at: new Date().toISOString()
  };

  authStore.value.users.push(structuredAdminUser);
  authStore.value.saveState();

  writeAuditLog(
    'colleague_created',
    `New internal profile created for ${newColleague.value.name} with administrative duty ${(newColleague.value.subRole || '').toUpperCase()}`,
    authStore.value.user?.name || 'Supervisor',
    'security'
  );

  toast.success(`Account created for ${newColleague.value.name}! Duty: ${(newColleague.value.subRole || '').toUpperCase().replace('_', ' ')}`);
  
  // Clear layout inputs
  newColleague.value.name = '';
  newColleague.value.email = '';
  newColleague.value.password = '';
  newColleague.value.department = 'Main Desk Ops';
}

// MANDATORY SAFETY MODAL HOOK OVERRIDES FOR REJECTIONS/GELS
const showSafetyModal = ref(false);
const safetyTitle = ref('');
const safetyMessage = ref('');
const safetyActionLabel = ref('');
const pendingTargetItem = ref(null);

function triggerRevokeColleague(cl) {
  pendingTargetItem.value = cl;
  safetyTitle.value = 'REVOKE SYSTEM Clearances';
  safetyMessage.value = `You are about to freeze and revoke administrative directory access for colleague ${cl.name}. This is an immediate and absolute block.`;
  safetyActionLabel.value = 'CONFIRM IMMEDIATE REVOC';
  showSafetyModal.value = true;
}

function closeSafetyModal() {
  showSafetyModal.value = false;
  pendingTargetItem.value = null;
}

function executeSafetyAction(justificationStr) {
  if (pendingTargetItem.value) {
    const cl = pendingTargetItem.value;
    const idx = authStore.value.users.findIndex(u => u.id === cl.id);
    if (idx !== -1) {
      authStore.value.users.splice(idx, 1);
      authStore.value.saveState();

      writeAuditLog(
        'colleague_revoked',
        `Administrative access revoked for ${cl.name}. Reason: ${justificationStr}`,
        authStore.value.user?.name || 'Supervisor',
        'security'
      );

      toast.warning(`Clearances successfully suspended. Action logged.`);
    }
  }
  showSafetyModal.value = false;
  pendingTargetItem.value = null;
}
</script>
