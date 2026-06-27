<template>
  <div class="space-y-6 text-[var(--color-text-primary)]">
    <div class="text-center mb-6">
      <h2 class="text-2xl font-bold font-mono uppercase">Re-Hash Credentials Password</h2>
      <p class="text-sm uppercase font-mono tracking-widest text-[#C8A96E] mt-2 flex items-center justify-center gap-1.5">
        <KeyIcon class="h-4 w-4" />
        Input security token to load new keys
      </p>
    </div>

    <form @submit.prevent="handleReset" class="space-y-5">
      <!-- Email -->
      <div>
        <label class="block text-base uppercase font-mono tracking-widest text-[var(--color-text-secondary)] mb-2">
          Registered Email
        </label>
        <div class="relative flex items-center">
          <span class="absolute left-4 text-[var(--color-text-tertiary)]">
            <EnvelopeIcon class="h-5 w-5" />
          </span>
          <input 
            type="email" 
            v-model="email" 
            required
            aria-label="Registered Email"
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[#C8A96E] font-mono input-custom"
            placeholder="e.g. user@enterprise.local" 
          />
        </div>
      </div>

      <!-- Code -->
      <div>
        <label class="block text-base uppercase font-mono tracking-widest text-[var(--color-text-secondary)] mb-2">
          Verification Code Sequence
        </label>
        <div class="relative flex items-center">
          <span class="absolute left-4 text-[var(--color-text-tertiary)]">
            <ShieldCheckIcon class="h-5 w-5" />
          </span>
          <input 
            type="text" 
            v-model="code" 
            required
            aria-label="Verification Code"
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[#C8A96E] font-mono input-custom"
            placeholder="e.g. 6-digit code or '123456'" 
          />
        </div>
      </div>

      <!-- Password -->
      <div>
        <label class="block text-base uppercase font-mono tracking-widest text-[var(--color-text-secondary)] mb-2">
          Define New Password Choice
        </label>
        <div class="relative flex items-center">
          <span class="absolute left-4 text-[var(--color-text-tertiary)]">
            <KeyIcon class="h-5 w-5" />
          </span>
          <input 
            type="password" 
            v-model="password" 
            required
            aria-label="Define New Password"
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[#C8A96E] font-mono input-custom"
            placeholder="••••••••••••" 
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
        <span>{{ loading ? 'Updating security vaults...' : 'Save and Re-Hash Key' }}</span>
      </button>
    </form>

    <div class="border-t border-[var(--color-border)] pt-4 text-center">
      <router-link to="/auth/login" class="text-base text-[#C8A96E] font-semibold hover:underline flex items-center justify-center gap-2">
        <ArrowLeftIcon class="h-4 w-4" />
        Back to Login Control
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth.js';
import { useToast } from 'vue-toastification';
import { KeyIcon, EnvelopeIcon, ShieldCheckIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline';

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const email = ref('');
const code = ref('');
const password = ref('');
const loading = ref(false);

onMounted(() => {
  if (authStore.forgotPasswordEmail) {
    email.value = authStore.forgotPasswordEmail;
  }
  if (authStore.verificationCode) {
    // optional fill code to speed up demo
    code.value = authStore.verificationCode;
  }
});

async function handleReset() {
  if (loading.value) return;
  loading.value = true;

  try {
    await authStore.resetPassword(email.value, code.value, password.value);
    toast.success('Your passcode has been updated! Authorize with your new password.');
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

