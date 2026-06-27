<template>
  <div class="space-y-6 text-[var(--color-text-primary)]">
    <div class="text-center mb-6">
      <h2 class="text-2xl font-bold font-mono uppercase tracking-tight">Two-Factor Authentication</h2>
      <p class="text-sm uppercase font-mono tracking-widest text-[#C8A96E] mt-2 flex items-center justify-center gap-1.5 font-bold">
        <ShieldCheckIcon class="h-5 w-5 text-[#C8A96E]" />
        IDENTITY CLEARANCE PROTOCOL
      </p>
    </div>

    <!-- Info banner -->
    <div class="bg-[var(--color-background)] border border-[var(--color-border)] p-4 rounded-none text-base space-y-2 font-mono text-center">
      <span class="text-[10px] text-[var(--color-text-tertiary)] block uppercase tracking-wider">SECURE AUDIT CHANNEL</span>
      <span class="text-[var(--color-text-primary)] block font-bold truncate text-base">
        {{ authStore.twoFactorRequiredEmail || 'Awaiting Authorization credentials...' }}
      </span>
      <p class="text-sm text-[var(--color-text-secondary)] font-sans mt-2 leading-relaxed">
        A security clearance token is required. Retrieve the verification code from the virtual mail HUD below!
      </p>
    </div>

    <form @submit.prevent="handleVerify2FA" class="space-y-5">
      <div>
        <label class="block text-base uppercase font-mono tracking-widest text-[var(--color-text-secondary)] mb-4 text-center">
          Enter 4-Digit Secure Secret Token
        </label>
        
        <!-- 4 Separate Inputs for 2FA -->
        <div class="flex justify-center gap-4 mb-4">
          <input 
            v-for="(digit, index) in 4"
            :key="index"
            ref="digitInputs"
            type="text"
            pattern="[0-9]*"
            inputmode="numeric"
            maxlength="1"
            v-model="digits[index]"
            @input="handleInput($event, index)"
            @keydown="handleKeyDown($event, index)"
            @paste="handlePaste"
            aria-label="2FA Digit"
            class="w-14 h-16 text-center bg-[var(--color-background)] border border-[var(--color-border)] text-2xl font-bold font-mono text-[#C8A96E] focus:outline-none focus:border-[#C8A96E] rounded-none transition-colors"
          />
        </div>

        <p class="text-sm text-[var(--color-text-tertiary)] font-mono text-center">
          (Hint: Developer bypass code is '0000')
        </p>
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
        <span>{{ loading ? 'Sifting credentials keys...' : 'Authorize Login Code' }}</span>
      </button>
    </form>

    <div class="border-t border-[var(--color-border)] pt-4 text-center">
      <router-link to="/auth/login" class="text-base text-[#C8A96E] font-semibold hover:underline flex items-center justify-center gap-2">
        <ArrowLeftIcon class="h-4 w-4" />
        Back to standard login
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth.js';
import { useToast } from 'vue-toastification';
import { ShieldCheckIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline';

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const code = ref('');
const digits = ref(['', '', '', '']);
const digitInputs = ref([]);
const loading = ref(false);

onMounted(() => {
  if (authStore.verificationCode) {
    code.value = authStore.verificationCode;
    const parts = authStore.verificationCode.split('');
    for (let i = 0; i < 4; i++) {
      digits.value[i] = parts[i] || '';
    }
  }
});

function handleInput(e, index) {
  const val = e.target.value;
  digits.value[index] = val.slice(-1);
  if (val && index < 3) {
    digitInputs.value[index + 1]?.focus();
  }
  code.value = digits.value.join('');
}

function handleKeyDown(e, index) {
  if (e.key === 'Backspace' && !digits.value[index] && index > 0) {
    digits.value[index - 1] = '';
    digitInputs.value[index - 1]?.focus();
    code.value = digits.value.join('');
  }
}

function handlePaste(e) {
  e.preventDefault();
  const pastedText = e.clipboardData.getData('text');
  if (/^\d{4}$/.test(pastedText)) {
    const parts = pastedText.split('');
    for (let i = 0; i < 4; i++) {
      digits.value[i] = parts[i];
    }
    code.value = pastedText;
    digitInputs.value[3]?.focus();
  }
}

async function handleVerify2FA() {
  if (loading.value) return;
  loading.value = true;

  try {
    const res = await authStore.verifyTwoFactor(authStore.twoFactorRequiredEmail, code.value);
    toast.success(`Identity cleared! Welcome, ${authStore.user.name}`);
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

<style scoped>
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

