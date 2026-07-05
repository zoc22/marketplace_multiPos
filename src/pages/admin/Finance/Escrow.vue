<template>
  <div class="space-y-6">

    <!-- HEADER BLOCK -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5 shrink-0">
      <div>
        <h1 class="text-xl font-bold font-mono text-[var(--color-text-primary)] flex items-center gap-2">
          <LockClosedIcon class="w-5 h-5 text-[var(--color-primary)]" />
          <span>Comptes de Séquestre B2B</span>
        </h1>
        <p class="text-xs text-[var(--color-text-secondary)]">Fonds séquestrés conservés de manière sécurisée comme intermédiaire de règlement pendant le transit des marchandises.</p>
      </div>

      <div class="text-xs font-mono text-[var(--color-text-secondary)] p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
        <span>Verrou de sécurité : Actif</span>
      </div>
    </div>

    <!-- ESCROW GENERAL STATS -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs text-[var(--color-text-secondary)]">
      <div class="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-center flex flex-col justify-between shadow-sm">
        <span class="text-[var(--color-text-secondary)] uppercase block font-bold">Conservé sous Séquestre</span>
        <span class="text-xl font-bold text-[var(--color-text-primary)] mt-2 block">{{ formatCurrency(totalEscrow) }}</span>
      </div>
      <div class="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-center flex flex-col justify-between shadow-sm">
        <span class="text-[var(--color-text-secondary)] uppercase block font-bold">Blocages de Transit</span>
        <span class="text-xl font-bold text-amber-500 mt-2 block">{{ activeConflictCount }} blocs</span>
      </div>
      <div class="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-center flex flex-col justify-between shadow-sm">
        <span class="text-[var(--color-text-secondary)] uppercase block font-bold">Délai Moyen de Règlement</span>
        <span class="text-xl font-bold text-[var(--color-text-primary)] mt-2 block">4.2 jours ouvrés</span>
      </div>
    </div>

    <!-- HELD ESCROW TABLE -->
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs font-sans">
          <thead>
            <tr class="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
              <th class="p-3 pl-5">Identifiant de Commande</th>
              <th class="p-3">Acheteur / Corporation</th>
              <th class="p-3">Mode de Règlement</th>
              <th class="p-3 text-right">Fonds Séquestrés (FCFA)</th>
              <th class="p-3 text-center font-mono">Verrou de Sécurité</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr 
              v-for="e in escrows" 
              :key="e.id"
              class="hover:bg-[var(--color-surface-hover)]/40 text-[var(--color-text-primary)] transition"
            >
              <td class="p-3 pl-5">
                <div class="font-mono text-[10.5px] text-[var(--color-primary)] font-semibold">{{ e.reference }}</div>
                <div class="text-[9px] text-[var(--color-text-secondary)] font-mono">Réf : {{ e.orderReference || 'B2B-ORD-AUTO' }}</div>
              </td>
              <td class="p-3 font-semibold text-[var(--color-text-primary)]">{{ e.recipientInstitution || 'Alpha Retail Group' }}</td>
              <td class="p-3 text-[var(--color-text-secondary)] font-mono">{{ e.paymentMethod }}</td>
              <td class="p-3 text-right font-mono font-bold text-[var(--color-text-primary)]">{{ formatCurrency(e.amount) }}</td>
              <td class="p-3 text-center">
                <span class="px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  Séquestré
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- NOTES PANEL -->
    <div class="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-text-secondary)] leading-normal flex items-start space-x-2 shadow-sm">
      <InformationCircleIcon class="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5" />
      <div>
        <span class="font-bold text-[var(--color-text-primary)] font-mono uppercase text-[9.5px] block mb-1">Conditions Standard de Séquestre :</span>
        <p>Tous les paiements acheteurs via Orange Money, MTN MoMo ou cartes bancaires sont systématiquement séquestrés dans les coffres de la plateforme jusqu'à ce que la livraison soit confirmée et signée.</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import { transactions } from '@/utils/seed_data.js';
import { LockClosedIcon, InformationCircleIcon } from '@heroicons/vue/24/outline';

const escrows = computed(() => {
  return transactions.filter(t => t.status === "Held" || t.status === "Escrow_Held");
});

const totalEscrow = computed(() => {
  return escrows.value.reduce((acc, e) => acc + Math.abs(e.amount), 0);
});

const activeConflictCount = computed(() => escrows.value.length);

function formatCurrency(v) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(v).replace('XAF', 'FCFA');
}
</script>
