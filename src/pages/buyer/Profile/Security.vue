<template>
  <div class="space-y-6 max-w-3xl mx-auto" id="buyer-security">
    <!-- Header -->
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
      <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Sécurité &amp; Accès</h1>
      <p class="text-sm text-[var(--color-text-secondary)] mt-1">Gérez votre mot de passe, activez la double authentification et surveillez les sessions actives.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- Password & 2FA column (2 cols) -->
      <div class="md:col-span-2 space-y-6">
        <!-- Password Form -->
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm space-y-4">
          <h3 class="font-bold text-sm text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2 uppercase font-mono">Modifier le mot de passe</h3>
          
          <form @submit.prevent="updatePassword" class="space-y-4 text-xs font-semibold">
            <label class="block">
              <span class="block text-[11px] text-[var(--color-text-secondary)] mb-1">Mot de passe actuel *</span>
              <input type="password" v-model="pass.current" required class="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] p-2.5 rounded-lg font-mono" />
            </label>
            <label class="block">
              <span class="block text-[11px] text-[var(--color-text-secondary)] mb-1">Nouveau mot de passe *</span>
              <input type="password" v-model="pass.new" required class="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] p-2.5 rounded-lg font-mono" />
            </label>
            <label class="block">
              <span class="block text-[11px] text-[var(--color-text-secondary)] mb-1">Confirmer le nouveau mot de passe *</span>
              <input type="password" v-model="pass.confirm" required class="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] p-2.5 rounded-lg font-mono" />
            </label>
            
            <div class="pt-2 flex justify-end">
              <button type="submit" class="px-5 py-2.5 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-xl text-xs font-semibold uppercase tracking-wider transition shadow">
                Enregistrer le mot de passe
              </button>
            </div>
          </form>
        </div>

        <!-- Two-Factor Authentication -->
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div class="space-y-1">
            <h3 class="font-bold text-sm text-[var(--color-text-primary)]">Double Authentification (2FA)</h3>
            <p class="text-xs text-[var(--color-text-secondary)]">Ajoutez une couche de sécurité supplémentaire en demandant un code par SMS ou e-mail lors de la connexion.</p>
          </div>
          <button 
            @click="toggle2FA"
            class="px-4 py-2 border rounded-xl text-xs font-semibold uppercase transition"
            :class="is2FAEnabled ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 font-bold' : 'bg-[var(--color-surface-elevated)] border-[var(--color-border)] text-[var(--color-text-secondary)]'"
          >
            {{ is2FAEnabled ? 'Activée' : 'Désactivée' }}
          </button>
        </div>
      </div>

      <!-- Active Sessions (1 col) -->
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm space-y-4">
        <h3 class="font-bold text-sm text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2 uppercase font-mono">Sessions Actives</h3>
        
        <div class="space-y-3 text-xs font-mono text-[var(--color-text-secondary)]">
          <div v-for="ses in sessions" :key="ses.id" class="p-3 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl space-y-1.5">
            <div class="flex justify-between items-center">
              <span class="font-bold text-[var(--color-text-primary)]">{{ ses.device }}</span>
              <span class="px-1.5 py-0.2 text-[9px] rounded font-bold uppercase" :class="ses.isCurrent ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-500/10 text-slate-500'">
                {{ ses.isCurrent ? 'Actuelle' : 'Active' }}
              </span>
            </div>
            <div class="text-[10px] text-[var(--color-text-secondary)] leading-tight">
              <div>IP : {{ ses.ip }}</div>
              <div>Ville : {{ ses.city }} - Cameroun</div>
              <div>Dernière activité : {{ ses.lastActive }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();
const is2FAEnabled = ref(false);

const pass = ref({
  current: '',
  new: '',
  confirm: ''
});

const sessions = ref([
  {
    id: 1,
    device: 'Navigateur Chrome (Windows)',
    ip: '129.0.52.241',
    city: 'Douala',
    lastActive: 'A l\'instant',
    isCurrent: true
  },
  {
    id: 2,
    device: 'iPhone 15 Pro (Safari)',
    ip: '102.164.20.12',
    city: 'Yaoundé',
    lastActive: 'Il y a 3 jours',
    isCurrent: false
  }
]);

function updatePassword() {
  if (pass.value.new !== pass.value.confirm) {
    toast.error('Les nouveaux mots de passe ne correspondent pas.');
    return;
  }
  toast.success('Votre mot de passe a été réinitialisé.');
  pass.value = { current: '', new: '', confirm: '' };
}

function toggle2FA() {
  is2FAEnabled.value = !is2FAEnabled.value;
  toast.info(is2FAEnabled.value ? 'Double authentification activée.' : 'Double authentification désactivée.');
}
</script>
