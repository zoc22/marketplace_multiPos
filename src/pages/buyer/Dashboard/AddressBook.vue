<template>
  <div class="space-y-6 max-w-5xl mx-auto" id="buyer-addresses">
    <!-- Header -->
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Carnet d'Adresses</h1>
        <p class="text-sm text-[var(--color-text-secondary)]">Gérez vos adresses de livraison pour accélérer vos commandes.</p>
      </div>
      <button 
        @click="isModalOpen = true"
        class="px-4 py-2.5 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-xl text-xs font-semibold uppercase tracking-wider transition shadow flex items-center space-x-2"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span>Nouvelle adresse</span>
      </button>
    </div>

    <!-- Address Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div 
        v-for="addr in addressList" 
        :key="addr.id"
        class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-[var(--color-primary)] transition"
      >
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider" :class="addr.type === 'Domicile' ? 'bg-blue-150/10 text-blue-600 bg-blue-500/10' : 'bg-emerald-500/10 text-emerald-600'">
              {{ addr.type }}
            </span>
            <span v-if="addr.isDefault" class="text-[9px] uppercase font-mono bg-amber-550/10 text-amber-600 font-bold bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/25">
              Par défaut
            </span>
          </div>
          <h3 class="font-bold text-sm text-[var(--color-text-primary)]">{{ addr.fullName }}</h3>
          <p class="text-xs text-[var(--color-text-secondary)] font-medium leading-relaxed">
            {{ addr.street }}<br>
            {{ addr.quarter }}, {{ addr.city }} - Cameroun
          </p>
          <p class="text-xs text-[var(--color-text-secondary)] font-mono">Tél : {{ addr.phone }}</p>
        </div>

        <div class="pt-4 border-t border-[var(--color-border)] flex justify-end space-x-2 mt-4">
          <button @click="deleteAddress(addr.id)" class="text-xs text-red-500 hover:underline">Supprimer</button>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <div 
      v-if="isModalOpen"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
      @click.self="isModalOpen = false"
    >
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl w-full max-w-md p-6 shadow-2xl cursor-default animate-in zoom-in-95 duration-200 space-y-4">
        <h3 class="text-sm font-bold text-[var(--color-text-primary)] uppercase font-mono border-b border-[var(--color-border)] pb-2">Ajouter une nouvelle adresse</h3>
        
        <form @submit.prevent="submitAddress" class="space-y-4 text-xs">
          <label class="block">
            <span class="block text-[11px] text-[var(--color-text-secondary)] font-bold mb-1">Nom complet du récepteur *</span>
            <input type="text" v-model="form.fullName" required class="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)] p-2 rounded-lg" />
          </label>

          <div class="grid grid-cols-2 gap-4">
            <label class="block">
              <span class="block text-[11px] text-[var(--color-text-secondary)] font-bold mb-1">Ville *</span>
              <select v-model="form.city" class="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)] p-2 rounded-lg">
                <option value="Douala">Douala</option>
                <option value="Yaoundé">Yaoundé</option>
                <option value="Bafoussam">Bafoussam</option>
                <option value="Garoua">Garoua</option>
                <option value="Kribi">Kribi</option>
              </select>
            </label>
            <label class="block">
              <span class="block text-[11px] text-[var(--color-text-secondary)] font-bold mb-1">Quartier *</span>
              <input type="text" v-model="form.quarter" required class="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)] p-2 rounded-lg" />
            </label>
          </div>

          <label class="block">
            <span class="block text-[11px] text-[var(--color-text-secondary)] font-bold mb-1">Rue / Rue secondaire *</span>
            <input type="text" v-model="form.street" required class="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)] p-2 rounded-lg" />
          </label>

          <label class="block">
            <span class="block text-[11px] text-[var(--color-text-secondary)] font-bold mb-1">Numéro de téléphone *</span>
            <input type="text" v-model="form.phone" placeholder="+237 6xx xx xx xx" required class="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)] p-2 rounded-lg font-mono" />
          </label>

          <label class="block">
            <span class="block text-[11px] text-[var(--color-text-secondary)] font-bold mb-1">Type d'adresse</span>
            <select v-model="form.type" class="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)] p-2 rounded-lg">
              <option value="Domicile">Domicile (Maison)</option>
              <option value="Bureau">Bureau (Travail)</option>
            </select>
          </label>

          <div class="flex justify-end space-x-3 pt-2">
            <button type="button" @click="isModalOpen = false" class="px-4 py-2 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-secondary)]">Annuler</button>
            <button type="submit" class="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-xs font-semibold">Sauvegarder</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();
const isModalOpen = ref(false);

const addressList = ref([
  {
    id: 1,
    fullName: 'Alice Smith',
    street: 'Avenue de l\'Indépendance 1024',
    quarter: 'Bonapriso',
    city: 'Douala',
    phone: '+237 690 12 34 56',
    type: 'Domicile',
    isDefault: true
  },
  {
    id: 2,
    fullName: 'Simon Kamga',
    street: 'Boulevard du 20 Mai - Immeuble Chanas',
    quarter: 'Centre Ville',
    city: 'Yaoundé',
    phone: '+237 677 89 01 23',
    type: 'Bureau',
    isDefault: false
  }
]);

const form = ref({
  fullName: '',
  city: 'Douala',
  quarter: '',
  street: '',
  phone: '',
  type: 'Domicile'
});

function submitAddress() {
  addressList.value.push({
    id: Date.now(),
    fullName: form.value.fullName,
    city: form.value.city,
    quarter: form.value.quarter,
    street: form.value.street,
    phone: form.value.phone,
    type: form.value.type,
    isDefault: false
  });
  isModalOpen.value = false;
  toast.success('Adresse enregistrée dans votre carnet.');
  form.value = {
    fullName: '',
    city: 'Douala',
    quarter: '',
    street: '',
    phone: '',
    type: 'Domicile'
  };
}

function deleteAddress(id) {
  addressList.value = addressList.value.filter(a => a.id !== id);
  toast.info('Adresse supprimée.');
}
</script>
