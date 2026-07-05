<template>
  <div class="space-y-6">
    <div class="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl space-y-4 shadow-sm">
      <h1 class="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)] font-mono">Paramètres Financiers Institutionnels</h1>
      <p class="text-xs text-[var(--color-text-secondary)]">Configurez la sécurité, les délais de règlement et les seuils de risque de fraude pour les réseaux de paiement B2B.</p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-[var(--color-text-primary)]">
        <div class="space-y-1">
          <label class="block text-[var(--color-text-secondary)] text-[10px] uppercase">Valeur de retrait minimale (FCFA)</label>
          <input type="number" v-model="payoutSettings.minWithdrawal" class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2.5 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]" />
        </div>
        <div class="space-y-1">
          <label class="block text-[var(--color-text-secondary)] text-[10px] uppercase">Plafond quotidien de règlement (FCFA)</label>
          <input type="number" v-model="payoutSettings.maxWithdrawalDaily" class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2.5 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]" />
        </div>
        <div class="space-y-1">
          <label class="block text-[var(--color-text-secondary)] text-[10px] uppercase">Heures de verrouillage de sécurité</label>
          <input type="number" v-model="payoutSettings.securityLockHours" class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2.5 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]" />
        </div>
        <div class="space-y-1">
          <label class="block text-[var(--color-text-secondary)] text-[10px] uppercase">Validation automatique des micro-retraits</label>
          <select v-model="payoutSettings.autoApprovePayouts" class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2.5 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]">
            <option :value="false">Désactivé (Exiger une revue manuelle)</option>
            <option :value="true">Activé (Moins de 50 000 FCFA)</option>
          </select>
        </div>
      </div>

      <div class="flex justify-end pt-2">
        <button @click="saveParams" class="px-4 py-2 bg-[var(--color-primary)] hover:opacity-90 text-xs font-mono font-bold uppercase text-[var(--color-text-primary)] rounded-lg transition cursor-pointer">
          Enregistrer les paramètres
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { payoutSettings } from '@/utils/admin_db.js';
import { useToast } from 'vue-toastification';

const toast = useToast();

const saveParams = () => {
  toast.success('Politiques de traitement de la trésorerie enregistrées avec succès.');
};
</script>
