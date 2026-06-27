<template>
  <div class="space-y-6 text-[var(--color-text-primary)]">
    <div class="text-center mb-6">
      <h2 class="text-2xl font-bold font-mono uppercase">Verify E-Mail Address</h2>
      <p class="text-sm uppercase font-mono tracking-widest text-[#C8A96E] mt-2 flex items-center justify-center gap-1.5">
        <ShieldCheckIcon class="h-5 w-5" />
        Consolidate network registration code
      </p>
    </div>

    <!-- Active Registered info banner -->
    <div class="bg-[var(--color-background)] border border-[var(--color-border)] p-4 rounded-none text-base space-y-2 font-mono text-center">
      <span class="text-[10px] text-[var(--color-text-tertiary)] block uppercase tracking-wider">AWAITING IDENTIFIER</span>
      <span class="text-[var(--color-text-primary)] block font-bold truncate text-base">
        {{ authStore.pendingVerificationEmail || 'No active registration found' }}
      </span>
      <p class="text-sm text-[var(--color-text-secondary)] font-sans mt-2 leading-relaxed">
        We have generated a simulated security confirmation token. Check the virtual inbox in the panel HUD below!
      </p>
    </div>

    <form @submit.prevent="handleVerify" class="space-y-5">
      <div>
        <label class="block text-base uppercase font-mono tracking-widest text-[var(--color-text-secondary)] mb-2">
          4-Digit Code Sequence
        </label>
        <div class="relative flex items-center">
          <span class="absolute left-4 text-[var(--color-text-tertiary)]">
            <LockClosedIcon class="h-5 w-5" />
          </span>
          <input 
            type="text" 
            v-model="code" 
            required
            maxlength="4"
            aria-label="Verification Code"
            class="w-full text-center bg-[var(--color-background)] border border-[var(--color-border)] text-lg font-bold font-mono text-[#C8A96E] tracking-widest focus:outline-none focus:border-[#C8A96E] input-custom"
            placeholder="e.g. 1234" 
          />
        </div>
      </div>

      <button 
        type="submit" 
        :disabled="loading"
        class="btn-primary w-full transition flex justify-center items-center gap-2"
      >
        <svg v-if="loading" class="animate-spin h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span>{{ loading ? 'Mutating vault permissions...' : 'Verify Authority E-Mail' }}</span>
      </button>
    </form>

    <div class="border-t border-[var(--color-border)] pt-4 text-center">
      <p class="text-base text-[var(--color-text-secondary)]">
        Changed your mind?
        <router-link to="/auth/login" class="text-[#C8A96E] font-semibold hover:underline flex items-center justify-center gap-2 mt-2">
          <ArrowLeftIcon class="h-4 w-4" />
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
import { ShieldCheckIcon, LockClosedIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline';

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

<style scoped>
.input-custom {
  padding: 14px 16px 14px 46px;
  border-radius: 0px !important;
  transition: all 0.2s ease;
}
.btn-primary {
  background-color: #C8A96E;
  color: #000000;
  font-family: monospace;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 14px 32px;
  border-radius: 0px !important;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.btn-primary:hover:not(:disabled) {
  transform: scale(1.02);
  box-shadow: 0 10px 25px -5px rgba(200, 169, 110, 0.3);
}
.btn-primary:active:not(:disabled) {
  transform: scale(0.98);
}
</style>

