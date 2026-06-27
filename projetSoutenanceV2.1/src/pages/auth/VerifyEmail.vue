<template>
  <div class="space-y-6">
    <div class="text-center">
      <h2 class="text-lg font-bold text-slate-100 font-mono uppercase">Verify E-Mail Address</h2>
      <p class="text-[10px] uppercase font-mono tracking-widest text-indigo-400 mt-1">
        Consolidate network registration code
      </p>
    </div>

    <!-- Active Registered info banner -->
    <div class="bg-indigo-950/20 border border-indigo-900/30 p-3 rounded-xl text-xs space-y-1 font-mono text-center">
      <span class="text-slate-500 block text-[9px] uppercase tracking-wider">AWAITING IDENTIFIER</span>
      <span class="text-slate-200 block font-bold truncate">
        {{ authStore.pendingVerificationEmail || 'No active registration found' }}
      </span>
      <p class="text-[10px] text-slate-400 font-sans mt-2">
        We have generated a simulated security confirmation token. Check the virtual inbox in the panel HUD below!
      </p>
    </div>

    <form @submit.prevent="handleVerify" class="space-y-4">
      <div>
        <label class="block text-[10px] uppercase font-mono tracking-widest text-slate-400 mb-1">
          4-Digit Code Sequence
        </label>
        <input 
          type="text" 
          v-model="code" 
          required
          maxlength="4"
          class="w-full text-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-lg font-bold font-mono text-indigo-400 tracking-widest focus:outline-none focus:border-indigo-500"
          placeholder="e.g. 1234" 
        />
      </div>

      <button 
        type="submit" 
        :disabled="loading"
        class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs uppercase tracking-wider font-semibold font-mono transition"
      >
        {{ loading ? 'Mutating vault permissions...' : 'Verify Authority E-Mail' }}
      </button>
    </form>

    <div class="border-t border-slate-900/60 pt-4 text-center">
      <p class="text-[11px] text-slate-500">
        Changed your mind?
        <router-link to="/auth/login" class="text-indigo-400 font-semibold hover:underline">
          Cancel and go to Login
        </router-link>
      </p>
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

async function handleVerify() {
  if (loading.value) return;
  loading.value = true;

  try {
    const res = await authStore.verifyEmail(code.value);
    
    // Check if user is supplier to warn them of pending regulatory approval
    if (res.user.roles.includes('supplier')) {
      toast.success('E-mail verification cleared! Your corporate profile is now pending validation by platform administrators.');
      toast.info('Compliance Warning: You will be able to log in only when an admin approves your business account.');
    } else {
      toast.success('Registration successful! Standard buyer access verified.');
    }

    router.push({ name: 'Login' });
  } catch (err) {
    toast.error(err.message || 'Verification sequence mismatch.');
  } finally {
    loading.value = false;
  }
}
</script>
