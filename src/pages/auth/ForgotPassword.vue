<template>
  <div class="space-y-6 relative overflow-hidden">
    <div class="text-center mb-10">
      <h2 class="text-3xl sm:text-4xl font-black tracking-tight text-[var(--color-text-primary)] uppercase">
        Mot de passe oublié
      </h2>
      <p class="text-sm mt-3 text-[var(--color-text-secondary)] font-medium">
        Réinitialisation de l'accès sécurisé
      </p>
    </div>

    <form @submit.prevent="handleForgotPassword" class="space-y-6 relative overflow-hidden">
      <div>
        <label class="block text-sm font-bold text-[var(--color-text-secondary)] mb-2 uppercase tracking-wide">
          Adresse E-mail
        </label>
        <div class="relative flex items-center">
          <span class="absolute left-4 text-[var(--color-text-tertiary)]">
            <EnvelopeIcon class="h-6 w-6" />
          </span>
          <input 
            type="email" 
            v-model="email" 
            required
            aria-label="Email"
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl py-4 pl-16 pr-4 text-[var(--color-text-primary)] text-base focus:ring-2 focus:ring-[#C8A96E] focus:border-transparent transition-all placeholder-[var(--color-text-tertiary)]"
            placeholder="votre.email@entreprise.com" 
          />
        </div>
      </div>

      <div class="pt-4">
        <button 
          type="submit" 
          :disabled="loading"
          class="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-[#C8A96E]/20 text-lg font-black uppercase text-black bg-[#C8A96E] hover:bg-[#d4b983] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C8A96E] transition-all disabled:opacity-50 hover:scale-[1.02] duration-300"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-6 w-6 text-black" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {{ loading ? 'Veuillez patienter...' : 'Recevoir le code' }}
        </button>
      </div>
    </form>

    <div class="mt-8 text-center">
      <p class="text-sm text-[var(--color-text-secondary)] font-medium">
        Vous vous souvenez de votre mot de passe ?
        <router-link to="/auth/login" class="font-bold text-[#C8A96E] hover:underline uppercase tracking-wide ml-1">
          Se connecter
        </router-link>
      </p>
      
      <div v-if="success" class="mt-6 p-5 bg-[var(--color-background)] border border-[#C8A96E]/30 rounded-2xl text-sm text-[var(--color-text-secondary)] font-medium leading-relaxed text-left flex flex-col gap-3 shadow-inner">
        <div class="flex items-center gap-2 text-[#C8A96E] font-bold uppercase tracking-wider text-xs">
          <BellIcon class="h-5 w-5" />
          <span>Notification système</span>
        </div>
        <div>
          Le code de réinitialisation a été envoyé à <strong>{{ email }}</strong>. Vérifiez votre boîte de réception (ou le HUD de simulation en bas de l'écran).
        </div>
        <div class="mt-2 text-center">
          <router-link to="/auth/reset-password" class="text-[#C8A96E] hover:text-[#d4b983] font-bold text-base flex items-center justify-center gap-2 uppercase tracking-wide transition-colors">
            Procéder à la réinitialisation
            <ArrowRightIcon class="h-5 w-5" />
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
import { KeyIcon, EnvelopeIcon, BellIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';

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

<style scoped>
</style>
