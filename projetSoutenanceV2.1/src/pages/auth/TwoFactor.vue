<template>
  <div class="space-y-6">
    <div class="text-center">
      <h2 class="text-lg font-bold text-slate-100 font-mono uppercase tracking-tight">Two-Factor Authentication</h2>
      <p class="text-[10px] uppercase font-mono tracking-widest text-[#FF8C00] mt-1 font-bold">
        🛡️ IDENTITY CLEARANCE PROTOCOL
      </p>
    </div>

    <!-- Info banner -->
    <div class="bg-amber-950/20 border border-amber-900/30 p-3 rounded-xl text-xs space-y-1 font-mono text-center">
      <span class="text-slate-500 block text-[9px] uppercase tracking-wider">SECURE AUDIT CHANNEL</span>
      <span class="text-slate-200 block font-bold truncate">
        {{ authStore.twoFactorRequiredEmail || 'Awaiting Authorization credentials...' }}
      </span>
      <p class="text-[10px] text-slate-400 font-sans mt-2">
        A security clearance token is required. Retrieve the verification code from the virtual mail HUD below!
      </p>
    </div>

    <form @submit.prevent="handleVerify2FA" class="space-y-4">
      <div>
        <label class="block text-[10px] uppercase font-mono tracking-widest text-slate-400 mb-1 text-center">
          Enter 4-Digit Secure Secret Token
        </label>
        <input 
          type="text" 
          v-model="code" 
          required
          maxlength="4"
          class="w-full text-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-2xl font-mono font-bold text-amber-500 tracking-widest focus:outline-none focus:border-[#FF5F00]"
          placeholder="e.g. 9921" 
        />
        <p class="text-[9px] text-slate-500 font-mono mt-1 text-center">
          (Hint: Developer bypass code is '0000')
        </p>
      </div>

      <button 
        type="submit" 
        :disabled="loading"
        class="w-full py-3 bg-[#FF8C00] hover:bg-[#E07B00] text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider font-mono transition"
      >
        {{ loading ? 'Sifting credentials keys...' : 'Authorize Login Code' }}
      </button>
    </form>

    <div class="border-t border-slate-900/60 pt-4 text-center">
      <router-link to="/auth/login" class="text-xs text-indigo-405 font-semibold hover:underline">
        &larr; Back to standard login
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth.js';
import { useToast } from 'vue-toastification';

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const code = ref('');
const loading = ref(false);

onMounted(() => {
  if (authStore.verificationCode) {
    // autofill to support standard flow convenience
    code.value = authStore.verificationCode;
  }
});

async function handleVerify2FA() {
  if (loading.value) return;
  loading.value = true;

  try {
    const res = await authStore.verifyTwoFactor(authStore.twoFactorRequiredEmail, code.value);
    toast.success(`Identity cleared! Session tokens initialized. Welcome, ${authStore.user.name}`);
    redirectUser(authStore.roles);
  } catch (err) {
    toast.error(err.message || 'Verification token code rejected.');
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
</script>
