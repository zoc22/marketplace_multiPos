<template>
  <div class="space-y-6">
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm">
      <h1 class="text-2xl font-black text-[var(--color-text-primary)]">Configuration Générale</h1>
      <p class="text-base text-[var(--color-text-secondary)] mt-1">Gérez les paramètres de facturation, de taxes et de reçus de caisse de votre commerce B2C.</p>
    </div>

    <form @submit.prevent="saveSettings" class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl space-y-6 max-w-3xl shadow-sm">
      <h3 class="text-base font-bold text-[var(--color-text-primary)] border-b pb-2">Informations Générales</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Devise de facturation</label>
          <select v-model="form.currency" class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
            <option value="XAF font-bold">XAF (FCFA)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Taux de TVA (%)</label>
          <input type="number" step="0.01" v-model.number="form.taxRate" class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] font-bold" />
        </div>
      </div>

      <h3 class="text-base font-bold text-[var(--color-text-primary)] border-b pb-2 pt-2">Configuration du Ticket de Caisse (POS 80mm)</h3>
      <div class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Entête du ticket</label>
          <textarea v-model="form.receiptHeader" rows="3" class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-xs font-mono p-3 rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" placeholder="Nom de l'entreprise, adresse, N° contribuable..."></textarea>
        </div>
        <div>
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Pied de page du ticket</label>
          <textarea v-model="form.receiptFooter" rows="3" class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-xs font-mono p-3 rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" placeholder="Message de remerciement, politique de retour..."></textarea>
        </div>
      </div>

      <div class="pt-5 border-t border-[var(--color-border)] flex justify-end">
        <button type="submit" class="px-5 py-2.5 bg-[var(--color-primary)] hover:opacity-90 text-white rounded-lg text-sm font-bold transition shadow-sm">
          Enregistrer les modifications
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { settings } from '@/utils/vendor_db.js';
import { useToast } from 'vue-toastification';

const toast = useToast();

const form = ref({
  currency: 'XAF',
  taxRate: 19.25,
  receiptHeader: '',
  receiptFooter: ''
});

onMounted(() => {
  form.value = {
    currency: settings.value.currency || 'XAF',
    taxRate: settings.value.taxRate || 19.25,
    receiptHeader: settings.value.receiptHeader || '',
    receiptFooter: settings.value.receiptFooter || ''
  };
});

function saveSettings() {
  settings.value.currency = form.value.currency;
  settings.value.taxRate = form.value.taxRate;
  settings.value.receiptHeader = form.value.receiptHeader;
  settings.value.receiptFooter = form.value.receiptFooter;
  
  toast.success('Paramètres enregistrés avec succès.');
}
</script>
