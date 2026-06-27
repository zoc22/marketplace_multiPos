<template>
  <div class="min-h-screen flex items-center justify-center relative overflow-hidden bg-[var(--color-background)] py-12">
    <!-- Background image and overlay -->
    <div class="absolute inset-0 z-0">
      <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1920" alt="Marketplace Background" class="w-full h-full object-cover opacity-60 mix-blend-overlay dark:opacity-40" />
      <div class="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-[#0a1017]/80 to-emerald-950/90"></div>
    </div>

    <!-- Return to marketplace button -->
    <router-link to="/" class="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/70 hover:text-[#C8A96E] transition-colors font-medium">
      <ArrowLeftIcon class="h-5 w-5" />
      Retour à la marketplace
    </router-link>

    <div class="relative z-10 w-full max-w-2xl p-8 sm:p-14 bg-[var(--color-surface)]/95 border border-[var(--color-border)] shadow-2xl rounded-[2.5rem] backdrop-blur-md mx-4 transition-all duration-500">
      <div class="text-center mb-10">
        <h2 class="text-3xl sm:text-4xl font-black tracking-tight text-[var(--color-text-primary)] uppercase">
          SE CONNECTER
        </h2>
        <p v-if="step === 1" class="text-sm mt-3 text-[var(--color-text-secondary)] leading-relaxed px-4 font-medium italic">
          "Rejoignez l'élite des négociants agricoles. Accédez à des milliers de tonnes de produits certifiés au meilleur prix."
        </p>
        <p v-else class="text-sm mt-3 text-[var(--color-text-secondary)] font-medium">
          Veuillez recopier le code de sécurité affiché ci-dessous pour vérifier que vous n'êtes pas un robot.
        </p>
      </div>

      <!-- Toggle Acheteur / Fournisseur (Only visible on step 1) -->
      <div v-show="step === 1" class="flex p-1.5 bg-[var(--color-background)] rounded-2xl mb-8 border border-[var(--color-border)] relative shadow-inner overflow-hidden">
        <!-- Sliding Background Indicator -->
        <div 
          class="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-[var(--color-surface-elevated)] shadow-md rounded-xl transition-transform duration-500 ease-in-out border border-[var(--color-border)]"
          :style="{ transform: isSupplier ? 'translateX(calc(100% + 4px))' : 'translateX(0)' }"
        ></div>
        
        <button 
          @click="isSupplier = false"
          class="flex-1 py-3 px-4 text-sm font-bold uppercase tracking-wider rounded-xl transition-colors relative z-10 duration-300"
          :class="!isSupplier ? 'text-[#C8A96E]' : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]'"
        >
          Acheteur
        </button>
        <button 
          @click="isSupplier = true"
          class="flex-1 py-3 px-4 text-sm font-bold uppercase tracking-wider rounded-xl transition-colors relative z-10 duration-300"
          :class="isSupplier ? 'text-[#C8A96E]' : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]'"
        >
          Fournisseur
        </button>
      </div>

      <!-- FORM -->
      <form @submit.prevent="handleFormSubmit" class="space-y-6 relative overflow-hidden">
        
        <!-- STEP 1: CREDENTIALS -->
        <div 
          class="transition-all duration-700 ease-in-out"
          :class="step === 1 ? 'opacity-100 translate-x-0 relative' : 'opacity-0 -translate-x-full absolute w-full top-0 pointer-events-none'"
        >
          <div class="space-y-6">
            <!-- Email -->
            <div>
              <label class="block text-sm font-bold text-[var(--color-text-secondary)] mb-2 uppercase tracking-wide">
                Adresse E-mail
              </label>
              <div class="relative flex items-center">
                <span class="absolute left-4 text-[var(--color-text-tertiary)] pointer-events-none">
                  <EnvelopeIcon class="h-6 w-6" />
                </span>
                <input 
                  type="email" 
                  v-model="email" 
                  :required="step === 1"
                  class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl py-4 pl-14 pr-4 text-[var(--color-text-primary)] text-base focus:ring-2 focus:ring-[#C8A96E] focus:border-transparent transition-all placeholder-[var(--color-text-tertiary)]"
                  placeholder="votre.email@entreprise.com" 
                />
              </div>
            </div>

            <!-- Password -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="block text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wide">
                  Mot de passe
                </label>
                <router-link to="/auth/forgot-password" class="text-sm font-bold text-[#C8A96E] hover:underline">
                  Oublié ?
                </router-link>
              </div>
              <div class="relative flex items-center">
                <span class="absolute left-4 text-[var(--color-text-tertiary)] pointer-events-none">
                  <KeyIcon class="h-6 w-6" />
                </span>
                <input 
                  type="password" 
                  v-model="password" 
                  :required="step === 1"
                  class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl py-4 pl-14 pr-4 text-[var(--color-text-primary)] text-base focus:ring-2 focus:ring-[#C8A96E] focus:border-transparent transition-all placeholder-[var(--color-text-tertiary)]"
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <!-- Supplier Unique Code -->
            <div v-if="isSupplier" class="animate-fade-in">
              <label class="block text-sm font-bold text-[var(--color-text-secondary)] mb-2 uppercase tracking-wide">
                Code Unique d'Administration
              </label>
              <div class="relative flex items-center">
                <span class="absolute left-4 text-[#C8A96E] pointer-events-none">
                  <ShieldCheckIcon class="h-6 w-6" />
                </span>
                <input 
                  type="text" 
                  v-model="uniqueCode" 
                  :required="step === 1 && isSupplier"
                  class="w-full bg-[var(--color-background)] border border-[#C8A96E]/50 rounded-2xl py-4 pl-14 pr-4 text-[var(--color-text-primary)] text-base focus:ring-2 focus:ring-[#C8A96E] focus:border-transparent transition-all placeholder-[var(--color-text-tertiary)]"
                  placeholder="Ex: ADMIN-789X" 
                />
              </div>
            </div>

            <!-- Remember Me -->
            <div class="flex items-center pt-2">
              <input 
                id="remember-me" 
                type="checkbox" 
                v-model="rememberMe"
                class="h-5 w-5 text-[#C8A96E] focus:ring-[#C8A96E] border-[var(--color-border)] rounded bg-[var(--color-background)]"
              />
              <label for="remember-me" class="ml-3 block text-sm text-[var(--color-text-secondary)] font-medium">
                Se souvenir de moi
              </label>
            </div>
          </div>
        </div>

        <!-- STEP 2: 2FA CODE -->
        <div 
          class="transition-all duration-700 ease-in-out"
          :class="step === 2 ? 'opacity-100 translate-x-0 relative' : 'opacity-0 translate-x-full absolute w-full top-0 pointer-events-none'"
        >
          <div class="space-y-6">
            <!-- CAPTCHA BOX DISPLAY -->
            <div class="bg-[var(--color-surface-elevated)] p-5 rounded-2xl border border-[var(--color-border)] flex flex-col items-center justify-center">
              <span class="text-xs text-[var(--color-text-secondary)] uppercase font-bold tracking-widest mb-3 flex items-center gap-2">
                <ShieldCheckIcon class="h-4 w-4 text-[#C8A96E]" />
                Code de sécurité anti-robot
              </span>
              <div class="text-4xl font-mono font-black text-[#C8A96E] tracking-[0.5em] pl-4 select-none bg-[var(--color-background)]/50 px-6 py-4 rounded-xl border border-[var(--color-border)] shadow-inner">
                {{ generatedCode }}
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-[var(--color-text-secondary)] mb-2 uppercase tracking-wide text-center">
                Recopiez le code ici
              </label>
              <div class="relative flex items-center">
                <span class="absolute left-4 text-[var(--color-text-tertiary)] pointer-events-none">
                  <DevicePhoneMobileIcon class="h-6 w-6" />
                </span>
                <input 
                  type="text" 
                  v-model="twoFactorCode" 
                  :required="step === 2"
                  class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl py-5 pl-14 pr-4 text-[var(--color-text-primary)] tracking-[1em] text-center text-2xl font-mono font-black focus:ring-2 focus:ring-[#C8A96E] focus:border-transparent transition-all placeholder-[var(--color-text-tertiary)]"
                  placeholder="----" 
                  maxlength="4"
                  ref="twoFactorInput"
                />
              </div>
              <p class="text-sm text-[var(--color-text-tertiary)] mt-4 text-center">
                Cette étape remplace le Captcha pour sécuriser l'accès.
              </p>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
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
            {{ loading ? 'Veuillez patienter...' : (step === 1 ? 'Continuer' : 'Valider & Connexion') }}
          </button>
          
          <!-- Back button for Step 2 -->
          <button 
            v-if="step === 2"
            type="button"
            @click="step = 1"
            class="w-full mt-4 flex justify-center items-center py-3 px-4 text-sm font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            &larr; Retour aux identifiants
          </button>
        </div>
      </form>

      <!-- Social Logins (Only Step 1) -->
      <div class="mt-10 transition-opacity duration-500" :class="step === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none hidden'">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-[var(--color-border)]"></div>
          </div>
          <div class="relative flex justify-center text-sm font-bold">
            <span class="px-4 bg-[var(--color-surface)] text-[var(--color-text-tertiary)] uppercase tracking-widest">Ou continuer avec</span>
          </div>
        </div>

        <div class="mt-8 grid grid-cols-4 gap-4">
          <button @click="handleSocial('Google')" class="flex justify-center items-center py-3.5 px-4 border border-[var(--color-border)] rounded-2xl hover:bg-[var(--color-surface-elevated)] transition-colors shadow-sm hover:-translate-y-1 duration-300">
            <svg class="h-6 w-6 text-[var(--color-text-primary)]" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          </button>
          <button @click="handleSocial('Facebook')" class="flex justify-center items-center py-3.5 px-4 border border-[var(--color-border)] rounded-2xl hover:bg-[var(--color-surface-elevated)] transition-colors shadow-sm hover:-translate-y-1 duration-300">
            <svg class="h-6 w-6 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </button>
          <button @click="handleSocial('LinkedIn')" class="flex justify-center items-center py-3.5 px-4 border border-[var(--color-border)] rounded-2xl hover:bg-[var(--color-surface-elevated)] transition-colors shadow-sm hover:-translate-y-1 duration-300">
            <svg class="h-6 w-6 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </button>
          <button @click="handleSocial('TikTok')" class="flex justify-center items-center py-3.5 px-4 border border-[var(--color-border)] rounded-2xl hover:bg-[var(--color-surface-elevated)] transition-colors shadow-sm hover:-translate-y-1 duration-300">
            <svg class="h-6 w-6 text-[var(--color-text-primary)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
          </button>
        </div>
      </div>

      <div class="mt-8 text-center" v-show="step === 1">
        <p class="text-sm text-[var(--color-text-secondary)] font-medium">
          Vous n'avez pas de compte ?
          <router-link to="/auth/register" class="font-bold text-[#C8A96E] hover:underline uppercase tracking-wide ml-1">
            S'inscrire
          </router-link>
        </p>
      </div>
      
      <!-- SECRET PRESETS BUTTON (Discret, Coin inférieur droit) -->
      <button 
        type="button"
        @click="showPresets = !showPresets"
        class="absolute bottom-6 right-6 p-2 rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[#C8A96E] hover:text-emerald-400 opacity-20 hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
        title="Charger utilisateurs de test"
      >
        <KeyIcon class="w-5 h-5" />
      </button>

      <!-- PRESETS MENU -->
      <div v-if="showPresets" class="absolute bottom-16 right-6 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl shadow-2xl p-4 text-sm w-56 z-50 animate-fade-in">
        <h4 class="font-black text-[var(--color-text-primary)] mb-3 uppercase tracking-wider text-[11px] text-center border-b border-[var(--color-border)] pb-2">Comptes de Test</h4>
        <div class="space-y-2">
          <button @click="fillPreset('admin')" class="w-full text-left px-3 py-2 hover:bg-[var(--color-background)] rounded-lg text-[#C8A96E] font-bold transition-colors">Super Admin</button>
          <button @click="fillPreset('buyer')" class="w-full text-left px-3 py-2 hover:bg-[var(--color-background)] rounded-lg text-emerald-500 font-bold transition-colors">Acheteur (Buyer)</button>
          <button @click="fillPreset('vendor')" class="w-full text-left px-3 py-2 hover:bg-[var(--color-background)] rounded-lg text-blue-500 font-bold transition-colors">Vendeur (B2C)</button>
          <button @click="fillPreset('distributor')" class="w-full text-left px-3 py-2 hover:bg-[var(--color-background)] rounded-lg text-orange-500 font-bold transition-colors">Distributeur (B2B)</button>
          <button @click="fillPreset('supplier')" class="w-full text-left px-3 py-2 hover:bg-[var(--color-background)] rounded-lg text-cyan-500 font-bold transition-colors">Fournisseur</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth.js';
import { useToast } from 'vue-toastification';
import { 
  EnvelopeIcon, 
  KeyIcon, 
  ArrowLeftIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon
} from '@heroicons/vue/24/outline';

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const step = ref(1);
const isSupplier = ref(false);
const email = ref('');
const password = ref('');
const twoFactorCode = ref('');
const uniqueCode = ref('');
const rememberMe = ref(false);
const loading = ref(false);
const showPresets = ref(false);

const twoFactorInput = ref(null);

// Vrai code généré simulé en backend
const generatedCode = ref('');

function generateRandomCode() {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 4 digits pour la rapidité
}

async function handleFormSubmit() {
  if (loading.value) return;
  loading.value = true;
  
  try {
    if (step.value === 1) {
      // Étape 1 : Validation des identifiants simulée (on attend 500ms)
      await new Promise(r => setTimeout(r, 500));
      
      // Validation du code unique si fournisseur
      if (isSupplier.value && !uniqueCode.value) {
        throw new Error("Code unique requis pour un fournisseur.");
      }

      // Générer le code 2FA et l'afficher (Captcha mode)
      generatedCode.value = generateRandomCode();
      toast.info(`[SÉCURITÉ] Veuillez recopier le code affiché à l'écran.`, { timeout: 5000 });
      
      // Passer à l'étape 2
      step.value = 2;
      loading.value = false;
      
      // Focus the input
      await nextTick();
      if(twoFactorInput.value) twoFactorInput.value.focus();

    } else if (step.value === 2) {
      // Étape 2 : Validation du 2FA avec le code généré
      if (twoFactorCode.value !== generatedCode.value) {
        throw new Error("Code de sécurité invalide. Veuillez vérifier vos emails.");
      }

      const res = await authStore.loginUnified(
        email.value, 
        password.value, 
        twoFactorCode.value, 
        isSupplier.value, 
        uniqueCode.value
      );
      
      toast.success(`Connexion réussie. Bienvenue, ${res.user.name}`);
      redirectUser(res.roles);
    }
  } catch (err) {
    toast.error(err.message || 'Échec de la connexion.');
    loading.value = false;
  }
}

async function handleSocial(provider) {
  if (loading.value) return;
  loading.value = true;
  try {
    const res = await authStore.socialLogin(provider);
    toast.success(`Connexion via ${provider} réussie.`);
    redirectUser(res.roles);
  } catch(err) {
    toast.error(err.message);
  } finally {
    loading.value = false;
  }
}

function redirectUser(userRoles) {
  if (userRoles.includes('admin')) {
    router.push({ name: 'AdminDashboard' });
  } else if (userRoles.includes('supplier')) {
    router.push({ name: 'SupplierDashboard' });
  } else if (userRoles.includes('vendor')) {
    router.push('/vendor/dashboard');
  } else if (userRoles.includes('distributor')) {
    router.push('/distributor/dashboard');
  } else if (userRoles.includes('buyer')) {
    router.push({ name: 'BuyerDashboard' });
  } else if (userRoles.includes('pos')) {
    router.push({ name: 'POSTerminal' });
  } else {
    router.push({ name: 'Home' });
  }
}

function fillPreset(role) {
  if (role === 'admin') {
    email.value = 'admin@test.com';
    password.value = 'password';
    isSupplier.value = true;
    uniqueCode.value = 'ADMIN123';
  } else if (role === 'buyer') {
    email.value = 'buyer@test.com';
    password.value = 'password';
    isSupplier.value = false;
  } else if (role === 'vendor') {
    email.value = 'vendor@test.com';
    password.value = 'password';
    isSupplier.value = true;
    uniqueCode.value = 'VEND123';
  } else if (role === 'distributor') {
    email.value = 'distributor@test.com';
    password.value = 'password';
    isSupplier.value = true;
    uniqueCode.value = 'DIST123';
  } else if (role === 'supplier') {
    email.value = 'vendor2@test.com';
    password.value = 'password';
    isSupplier.value = true;
    uniqueCode.value = 'VEND123';
  }
  showPresets.value = false;
  toast.success(`Identifiants ${role} préremplis avec succès.`);
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
