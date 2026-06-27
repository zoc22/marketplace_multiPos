<template>
  <div class="space-y-6">
    <div class="text-center">
      <h2 class="text-lg font-bold text-slate-100 font-mono uppercase">Re-Hash Credentials Password</h2>
      <p class="text-[10px] uppercase font-mono tracking-widest text-indigo-400 mt-1">
        Input security token to load new keys
      </p>
    </div>

    <form @submit.prevent="handleReset" class="space-y-4">
      <div>
        <label class="block text-[10px] uppercase font-mono tracking-widest text-slate-400 mb-1">
          Registered Email
        </label>
        <input 
          type="email" 
          v-model="email" 
          required
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
          placeholder="e.g. user@enterprise.local" 
        />
      </div>

      <div>
        <label class="block text-[10px] uppercase font-mono tracking-widest text-slate-400 mb-1">
          Verification Code Sequence
        </label>
        <input 
          type="text" 
          v-model="code" 
          required
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
          placeholder="e.g. 6-digit code or '123456'" 
        />
      </div>

      <div>
        <label class="block text-[10px] uppercase font-mono tracking-widest text-slate-400 mb-1">
          Define New Password Choice
        </label>
        <input 
          type="password" 
          v-model="password" 
          required
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
          placeholder="••••••••••••" 
        />
      </div>

      <button 
        type="submit" 
        :disabled="loading"
        class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs uppercase tracking-wider font-semibold font-mono transition"
      >
        {{ loading ? 'Updating security vaults...' : 'Save and Re-Hash Key' }}
      </button>
    </form>

    <div class="border-t border-slate-900/60 pt-4 text-center">
      <router-link to="/auth/login" class="text-xs text-indigo-400 font-semibold hover:underline">
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
