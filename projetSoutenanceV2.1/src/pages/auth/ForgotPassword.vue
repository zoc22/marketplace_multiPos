<template>
  <div class="space-y-6">
    <div class="text-center">
      <h2 class="text-lg font-bold text-slate-100 font-mono uppercase">Forgot Credentials Key</h2>
      <p class="text-[10px] uppercase font-mono tracking-widest text-indigo-400 mt-1">
        Unlock security bypass protocol
      </p>
    </div>

    <form @submit.prevent="handleForgotPassword" class="space-y-4">
      <div>
        <label class="block text-[10px] uppercase font-mono tracking-widest text-slate-400 mb-1">
          Electronic Identifier ID (Email)
        </label>
        <input 
          type="email" 
          v-model="email" 
          required
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
          placeholder="user@enterprise.local" 
        />
      </div>

      <button 
        type="submit" 
        :disabled="loading"
        class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs uppercase tracking-wider font-semibold font-mono transition"
      >
        {{ loading ? 'Sieving registers...' : 'Generate Reset Token' }}
      </button>
    </form>

    <div class="border-t border-slate-900/60 pt-4 text-center space-y-2">
      <p class="text-xs text-slate-500">
        Know your key?
        <router-link to="/auth/login" class="text-indigo-400 font-semibold hover:underline">
          Security Login
        </router-link>
      </p>
      <div v-if="success" class="p-3 bg-indigo-950/40 rounded-lg text-[10px] text-slate-300 font-mono border border-indigo-900/40 leading-relaxed">
        🔔 <strong>Simulation Dispatch:</strong> Password reset verification token sent to <strong>{{ email }}</strong>. Check the virtual inbox in the HUD below, copy the token code, and proceed.
        <div class="mt-2">
          <router-link to="/auth/reset-password" class="text-indigo-400 underline font-bold">
            Proceed with Reset Code &rarr;
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/store/modules/auth.js';
import { useToast } from 'vue-toastification';

const authStore = useAuthStore();
const toast = useToast();

const email = ref('');
const loading = ref(false);
const success = ref(false);

async function handleForgotPassword() {
  if (loading.value) return;
  loading.value = true;
  success.value = false;

  try {
    const res = await authStore.forgotPassword(email.value);
    success.value = true;
    toast.success('Clearance token dispatched. Check simulated system box.');
  } catch (err) {
    toast.error(err.message || 'E-Mail address could not be identified.');
  } finally {
    loading.value = false;
  }
}
</script>
