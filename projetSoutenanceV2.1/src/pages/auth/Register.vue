<template>
  <div class="space-y-6">
    <div class="text-center">
      <h2 class="text-lg font-bold text-slate-100 font-mono uppercase">Standard Buyer Registration</h2>
      <p class="text-[10px] uppercase font-mono tracking-widest text-indigo-400 mt-1">
        Setup your retail/buying corporate account
      </p>
    </div>

    <form @submit.prevent="handleRegister" class="space-y-4">
      <div>
        <label class="block text-[10px] uppercase font-mono tracking-widest text-slate-400 mb-1">
          Full Name / Rep Identity
        </label>
        <input 
          type="text" 
          v-model="name" 
          required
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
          placeholder="e.g. Alice Smith" 
        />
      </div>

      <div>
        <label class="block text-[10px] uppercase font-mono tracking-widest text-slate-400 mb-1">
          Company Name
        </label>
        <input 
          type="text" 
          v-model="company" 
          required
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
          placeholder="e.g. Alpha Retail Holding" 
        />
      </div>

      <div>
        <label class="block text-[10px] uppercase font-mono tracking-widest text-slate-400 mb-1">
          E-Mail Address (Electronic ID)
        </label>
        <input 
          type="email" 
          v-model="email" 
          required
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
          placeholder="e.g. smith@alpharetail.com" 
        />
      </div>

      <div>
        <label class="block text-[10px] uppercase font-mono tracking-widest text-slate-400 mb-1">
          Telephone Code Sequence
        </label>
        <input 
          type="tel" 
          v-model="phone" 
          required
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
          placeholder="e.g. +33 6 00 11 22 33" 
        />
      </div>

      <div>
        <label class="block text-[10px] uppercase font-mono tracking-widest text-slate-400 mb-1">
          Passcode Security Key
        </label>
        <input 
          type="password" 
          v-model="password" 
          required
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
          placeholder="••••••••" 
        />
      </div>

      <button 
        type="submit" 
        :disabled="loading"
        class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs uppercase tracking-wider font-semibold font-mono transition"
      >
        {{ loading ? 'Sieving Information...' : 'Initialize Verification Code' }}
      </button>
    </form>

    <div class="border-t border-slate-900/60 pt-4 text-center">
      <p class="text-xs text-slate-500">
        Already registered? 
        <router-link to="/auth/login" class="text-indigo-400 font-semibold hover:underline">
          Authorize Login
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth.js';
import { useToast } from 'vue-toastification';

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const name = ref('');
const company = ref('');
const email = ref('');
const phone = ref('');
const password = ref('');
const loading = ref(false);

async function handleRegister() {
  if (loading.value) return;
  loading.value = true;
  
  try {
    const res = await authStore.registerBuyer({
      name: name.value,
      company: company.value,
      email: email.value,
      phone: phone.value,
      password: password.value
    });
    
    toast.success('Registration setup initialized! A verification code has been generated.');
    router.push({ name: 'VerifyEmail' });
  } catch (err) {
    toast.error(err.message || 'Registration pipeline blocked.');
  } finally {
    loading.value = false;
  }
}
</script>
