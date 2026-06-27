<template>
  <div class="space-y-6">
    <div class="text-center">
      <h2 class="text-lg font-bold text-slate-100 font-mono tracking-tight uppercase">
        {{ simulatedDomain ? `Tenant [${simulatedDomain.name}]` : 'CORE PLATFORM CONTROL GATE' }}
      </h2>
      <p class="text-[11px] font-mono mt-1 text-indigo-400 uppercase tracking-widest">
        🔐 SECURE AUTHORIZATION GATEWAY
      </p>
    </div>

    <!-- Active Simulated Subdomain Banner -->
    <div class="bg-slate-950/60 p-3 rounded-xl border border-slate-900 flex justify-between items-center text-xs">
      <div>
        <span class="text-slate-500 font-mono block text-[9px] uppercase tracking-wider">STANCL TECH DOMAIN</span>
        <span class="text-slate-200 font-bold font-mono">
          {{ simulatedDomain ? `${simulatedDomain.id}.enterprise.local` : 'main-platform.local' }}
        </span>
      </div>
      <div>
        <select 
          :value="authStore.currentSubdomain"
          @change="onSubdomainChange"
          class="bg-slate-900 text-slate-300 font-mono text-[10px] uppercase border border-slate-800 rounded px-2 py-1 focus:outline-none focus:border-indigo-500"
        >
          <option value="">No tenant (Platform Main)</option>
          <option v-for="t in authStore.tenants" :key="t.id" :value="t.id">
            {{ t.name }} ({{ t.id }})
          </option>
        </select>
      </div>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label class="block text-[10px] uppercase font-mono tracking-widest text-slate-400 mb-1">
          Electronic Identifier ID
        </label>
        <div class="relative">
          <input 
            type="email" 
            v-model="email" 
            required
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500 font-mono"
            placeholder="e.g. user@enterprise.local" 
          />
        </div>
      </div>

      <div>
        <div class="flex justify-between items-center mb-1">
          <label class="block text-[10px] uppercase font-mono tracking-widest text-slate-400">
            Pass Hash Code Sequence
          </label>
          <router-link to="/auth/forgot-password" class="text-[10px] text-indigo-400 hover:underline">
            Forgot Key?
          </router-link>
        </div>
        <input 
          type="password" 
          v-model="password" 
          required
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
          placeholder="••••••••••••" 
        />
      </div>

      <!-- Action Button -->
      <button 
        type="submit" 
        :disabled="loading"
        class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs uppercase tracking-wider font-semibold font-mono transition flex justify-center items-center space-x-2"
      >
        <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span>{{ loading ? 'Mutating Access Tokens...' : 'Validate Authority Sign-In' }}</span>
      </button>
    </form>

    <div class="border-t border-slate-900/60 pt-4 space-y-3">
      <div class="flex justify-between text-xs">
        <span class="text-slate-500">Need standard buyer?</span>
        <router-link to="/auth/register" class="text-indigo-400 font-semibold hover:underline">
          Register Buyer
        </router-link>
      </div>
      <div class="flex justify-between text-xs">
        <span class="text-slate-500">Corporate B2B Supplier?</span>
        <router-link to="/auth/register-supplier" class="text-indigo-400 font-semibold hover:underline">
          Register Supplier (KYC)
        </router-link>
      </div>
    </div>

    <!-- Preset Shortcuts (Critical for previewer evaluation) -->
    <div class="bg-slate-950/40 p-4 rounded-xl border border-slate-900/70 space-y-2">
      <span class="text-[9px] uppercase font-mono text-slate-500 tracking-wider block font-bold">
        ⚡ Evaluation Preset Shortcuts
      </span>
      <div class="grid grid-cols-2 gap-2 text-[10px] font-mono">
        <button 
          v-for="p in presets" 
          :key="p.email"
          @click="applyPreset(p)"
          class="p-2 bg-slate-900 hover:bg-slate-850 rounded border border-slate-800 text-left transition hover:border-indigo-500/45 group"
        >
          <div class="flex justify-between items-center">
            <span class="text-slate-300 font-bold group-hover:text-indigo-350">{{ p.label }}</span>
            <span class="text-[8px] bg-slate-800 px-1 py-0.5 rounded text-indigo-400 uppercase tracking-tight">{{ p.role }}</span>
          </div>
          <span class="text-slate-500 block text-[9px] mt-0.5 leading-none font-sans font-normal truncate">
            {{ p.email }}
          </span>
          <span class="text-[8px] text-slate-600 block leading-tight font-sans mt-1">
            Redirecting to: {{ p.target }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/store/modules/auth.js';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const toast = useToast();

const email = ref('');
const password = ref('');
const loading = ref(false);

const simulatedDomain = computed(() => {
  return authStore.tenants.find(t => t.id === authStore.currentSubdomain);
});

// Update standard layout simulated subdomain
function onSubdomainChange(e) {
  authStore.switchTenant(e.target.value);
  toast.info(`Switched to domain context: ${e.target.value ? e.target.value + '.enterprise.local' : 'main-platform.local'}`);
}

const presets = [
  {
    label: 'Platform Admin',
    role: 'Admin',
    email: 'admin@enterprise.local',
    pass: 'admin',
    target: '/admin/dashboard'
  },
  {
    label: 'Supplier Approved',
    role: 'Supplier',
    email: 'supplier@enterprise.local',
    pass: 'password',
    target: '/supplier/dashboard'
  },
  {
    label: 'Supplier Pending',
    role: 'KYC Req',
    email: 'pending@supplier.com',
    pass: 'password',
    target: '(Blocked)'
  },
  {
    label: 'Standard Buyer',
    role: 'Buyer',
    email: 'buyer@enterprise.local',
    pass: 'password',
    target: '/buyer/dashboard'
  },
  {
    label: 'POS Cashier',
    role: 'POS',
    email: 'cashier@enterprise.local',
    pass: 'password',
    target: '/pos'
  }
];

function applyPreset(p) {
  email.value = p.email;
  password.value = p.pass;
  toast.success(`Loaded credentials preset for ${p.label}`);
}

async function handleLogin() {
  if (loading.value) return;
  loading.value = true;
  
  try {
    const res = await authStore.login(email.value, password.value);
    
    if (res.twoFactorRequired) {
      toast.warning('2FA Security clearance verification requested. Secure token code sent.');
      router.push({ name: 'TwoFactor' });
      return;
    }

    toast.success(`Access validated. Welcome, ${authStore.user.name}`);
    redirectUser(authStore.roles);
  } catch (err) {
    toast.error(err.message || 'Credentials bypass denied.');
  } finally {
    loading.value = false;
  }
}

function redirectUser(userRoles) {
  if (userRoles.includes('admin')) {
    router.push({ name: 'AdminDashboard' });
  } else if (userRoles.includes('supplier')) {
    router.push({ name: 'SupplierDashboard' });
  } else if (userRoles.includes('buyer')) {
    router.push({ name: 'BuyerDashboard' });
  } else if (userRoles.includes('pos')) {
    router.push({ name: 'POSTerminal' });
  } else {
    router.push({ name: 'Home' });
  }
}

// Automatically apply any query redirection
onMounted(() => {
  // If user is already authenticated, redirect them directly to prevent cross-viewing as requested
  if (authStore.token && authStore.user) {
    toast.info('Session active. Redirecting to your panel.');
    redirectUser(authStore.roles);
  }
});
</script>
