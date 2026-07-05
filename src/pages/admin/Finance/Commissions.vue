<template>
  <div class="space-y-6">

    <!-- HEADER BLOCK -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5 shrink-0">
      <div>
        <h1 class="text-xl font-bold font-mono text-[var(--color-text-primary)] flex items-center gap-2">
          <span>Configuration des Commissions & Tarifs de la Plateforme</span>
        </h1>
        <p class="text-xs text-[var(--color-text-secondary)]">Configurez les frais de transaction, ajustez les taux de commission et suivez les flux de revenus de la plateforme.</p>
      </div>

      <span class="px-2.5 py-1 bg-[var(--color-primary-muted)]/20 text-[var(--color-primary)] font-mono text-[9px] uppercase font-bold border border-[var(--color-border)] rounded-md">
        Taux opérationnel actuel : {{ commissionRate }}%
      </span>
    </div>

    <!-- MAIN GRID SECTION -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
      
      <!-- COLUMN 1: FORM TO MODIFY RATES -->
      <div class="md:col-span-4 bg-[var(--color-surface)] p-6 border border-[var(--color-border)] rounded-2xl flex flex-col justify-between space-y-4 shadow-sm">
        <div>
          <h2 class="text-sm font-bold font-mono text-[var(--color-text-primary)] uppercase tracking-wide">Ajuster la Commission</h2>
          <p class="text-xs text-[var(--color-text-secondary)] mt-1">Prélevée automatiquement sur tous les encaissements issus des portefeuilles mobiles et des cartes de paiement.</p>
        </div>

        <div class="space-y-4 font-mono text-xs">
          <div class="space-y-1.5">
            <label class="block text-[var(--color-text-secondary)] font-bold uppercase text-[9px]">Taux de pourcentage administratif (%)</label>
            <div class="flex items-center space-x-2">
              <input 
                type="number" 
                step="0.1" 
                min="0.5" 
                max="10" 
                v-model="rateInput"
                class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2.5 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
              />
              <span class="text-[var(--color-text-secondary)] font-bold">%</span>
            </div>
          </div>

          <button 
            @click="triggerRateUpdate"
            class="w-full py-2 bg-[var(--color-primary)] hover:opacity-90 text-xs font-bold uppercase rounded-lg text-[var(--color-text-primary)] transition text-center cursor-pointer"
          >
            Appliquer l'ajustement
          </button>
        </div>

        <p class="text-[9px] text-[var(--color-text-secondary)] italic leading-snug">
          * Les modifications de taux s'appliquent de manière dynamique. Les changements sont immédiatement enregistrés dans les journaux de sécurité.
        </p>
      </div>

      <!-- COLUMN 2: ANALYTICAL METRICS SHOWCASE -->
      <div class="md:col-span-8 space-y-4">
        <h2 class="text-sm font-bold font-mono text-[var(--color-text-primary)] uppercase tracking-wide px-1">Résumé des Flux Financiers</h2>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl space-y-1 shadow-sm">
            <span class="text-[9px] text-[var(--color-text-secondary)] font-mono uppercase block font-bold">Revenu Total de la Plateforme</span>
            <span class="text-xl font-bold font-mono text-emerald-500 block">{{ formatCurrency(totalFees) }}</span>
            <p class="text-[10px] text-[var(--color-text-secondary)] font-sans leading-none pt-1">Issu de {{ transactionsCount }} transactions finalisées.</p>
          </div>
          <div class="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl space-y-1 shadow-sm">
            <span class="text-[9px] text-[var(--color-text-secondary)] font-mono uppercase block font-bold">Rendement Mensuel Estimé</span>
            <span class="text-xl font-bold font-mono text-[var(--color-text-primary)] block">{{ formatCurrency(totalFees * 0.18) }} / mois</span>
            <p class="text-[10px] text-[var(--color-text-secondary)] font-sans leading-none pt-1">Prévisions basées sur les cycles de récoltes.</p>
          </div>
        </div>

        <!-- RECENT INDIVIDUAL LEVY CHARGES -->
        <div class="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl space-y-3 shadow-sm">
          <h3 class="text-xs font-bold font-mono uppercase text-[var(--color-text-primary)]">Journal Détaillé des Frais de Transaction</h3>
          
          <div class="space-y-2 max-h-[220px] overflow-y-auto">
            <div 
              v-for="tx in recentInboundTx.slice(0, 8)" 
              :key="tx.id"
              class="p-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl flex items-center justify-between text-xs font-mono text-[var(--color-text-secondary)]"
            >
              <div>
                <span class="text-[var(--color-text-primary)] uppercase leading-none block font-semibold">{{ tx.recipientInstitution || 'Alpha Retail Group' }}</span>
                <span class="text-[9px] text-[var(--color-text-secondary)] block pt-0.5">Réf. Tx : {{ tx.reference }}</span>
              </div>
              <div class="text-right">
                <span class="text-amber-500 font-bold block">+{{ formatCurrency(tx.fee || 1200) }} de frais</span>
                <span class="text-[9px] text-[var(--color-text-secondary)] block pt-0.5">Sur le montant : {{ formatCurrency(tx.amount) }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { commissionRate, writeAuditLog } from '@/utils/admin_db.js';
import { transactions } from '@/utils/seed_data.js';
import { useToast } from 'vue-toastification';

const toast = useToast();
const rateInput = ref(commissionRate.value);

const recentInboundTx = computed(() => {
  return transactions.filter(t => t.type === 'Collection');
});

const transactionsCount = computed(() => recentInboundTx.value.length);
const totalFees = computed(() => {
  return recentInboundTx.value.reduce((acc, t) => acc + (t.fee || 0), 0);
});

function formatCurrency(v) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(v).replace('XAF', 'FCFA');
}

function triggerRateUpdate() {
  if (rateInput.value < 0.5 || rateInput.value > 10) {
    toast.error('Le taux de commission doit être compris entre 0.5% et 10.0%.');
    return;
  }

  const oldRate = commissionRate.value;
  commissionRate.value = rateInput.value;

  writeAuditLog(
    'COMMISSION_RATE_ADJUSTED',
    `Commission dynamique ajustée de ${oldRate}% à ${commissionRate.value}%.`,
    'Gestion de la Trésorerie'
  );

  toast.success(`Commission de la plateforme mise à jour à ${commissionRate.value}% !`);
}
</script>
