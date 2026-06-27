<template>
  <div class="space-y-6 max-w-2xl mx-auto" id="buyer-profile-edit">
    <!-- Header -->
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
      <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Informations de Profil</h1>
      <p class="text-sm text-[var(--color-text-secondary)] mt-1">Mettez à jour vos coordonnées personnelles et gérez votre compte client.</p>
    </div>

    <!-- Form card -->
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
      <form @submit.prevent="saveProfile" class="space-y-4 text-xs font-semibold">
        <div class="grid grid-cols-2 gap-4">
          <label class="block">
            <span class="block text-[11px] text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Prénom</span>
            <input type="text" v-model="profile.firstName" required class="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] p-2.5 rounded-lg" />
          </label>
          <label class="block">
            <span class="block text-[11px] text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Nom</span>
            <input type="text" v-model="profile.lastName" required class="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] p-2.5 rounded-lg" />
          </label>
        </div>

        <label class="block">
          <span class="block text-[11px] text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Adresse e-mail *</span>
          <input type="email" v-model="profile.email" required class="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] p-2.5 rounded-lg font-mono" />
        </label>

        <label class="block">
          <span class="block text-[11px] text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Téléphone *</span>
          <input type="text" v-model="profile.phone" required class="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] p-2.5 rounded-lg font-mono" />
        </label>

        <label class="block">
          <span class="block text-[11px] text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Ville de résidence</span>
          <select v-model="profile.city" class="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] p-2.5 rounded-lg font-mono">
            <option value="Douala">Douala</option>
            <option value="Yaoundé">Yaoundé</option>
            <option value="Bafoussam">Bafoussam</option>
            <option value="Garoua">Garoua</option>
            <option value="Kribi">Kribi</option>
          </select>
        </label>

        <div class="pt-4 border-t border-[var(--color-border)] flex justify-end">
          <button 
            type="submit"
            class="px-5 py-2.5 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-xl text-xs font-semibold uppercase tracking-wider transition shadow"
          >
            Sauvegarder les modifications
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();

const profile = ref({
  firstName: 'Alice',
  lastName: 'Smith',
  email: 'alice.smith@gmail.com',
  phone: '+237 690 12 34 56',
  city: 'Douala'
});

function saveProfile() {
  toast.success('Vos informations personnelles ont été enregistrées.');
}
</script>
