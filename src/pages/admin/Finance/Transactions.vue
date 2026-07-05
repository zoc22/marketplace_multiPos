<template>
  <div class="space-y-6">

    <!-- HEADER BLOCK -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5 shrink-0">
      <div>
        <h1 class="text-xl font-bold font-mono text-[var(--color-text-primary)] flex items-center gap-2">
          <BanknotesIcon class="w-5 h-5 text-[var(--color-primary)]" />
          <span>Registre des Transactions Financières de la Plateforme</span>
        </h1>
        <p class="text-xs text-[var(--color-text-secondary)]">Registre complet des encaissements sous séquestre, règlements fournisseurs et frais de transaction.</p>
      </div>

      <button 
        @click="simulateCSVExport"
        class="px-3.5 py-2.5 bg-[var(--color-primary)] hover:opacity-90 text-xs font-mono font-bold uppercase rounded-lg text-[var(--color-text-primary)] transition flex items-center space-x-2 shrink-0 cursor-pointer"
      >
        <ArrowDownTrayIcon class="w-4 h-4" />
        <span>Exporter le registre (CSV)</span>
      </button>
    </div>

    <!-- LEDGER STATS -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs text-[var(--color-text-secondary)]">
      <div class="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-center shadow-sm">
        <span class="text-[var(--color-text-secondary)] uppercase block font-bold">Volume Brut Total</span>
        <span class="text-lg font-bold text-[var(--color-text-primary)] mt-1 block">{{ formatCurrency(grossVolume) }}</span>
      </div>
      <div class="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-center shadow-sm">
        <span class="text-[var(--color-text-secondary)] uppercase block font-bold">Flux d'Entrée</span>
        <span class="text-lg font-bold text-emerald-500 mt-1 block">{{ formatCurrency(inflows) }}</span>
      </div>
      <div class="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-center shadow-sm">
        <span class="text-[var(--color-text-secondary)] uppercase block font-bold">Flux de Sortie</span>
        <span class="text-lg font-bold text-red-500 mt-1 block">{{ formatCurrency(outflows) }}</span>
      </div>
      <div class="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-center shadow-sm">
        <span class="text-[var(--color-text-secondary)] uppercase block font-bold">Commissions Collectées</span>
        <span class="text-lg font-bold text-[var(--color-primary)] mt-1 block">{{ formatCurrency(commissionsCount) }}</span>
      </div>
    </div>

    <!-- FILTERS AND QUERY CONTROLS -->
    <div class="flex flex-col sm:flex-row items-center gap-3 bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border)] shadow-sm">
      <div class="relative flex-1 w-full">
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="Rechercher par référence, bénéficiaire..."
          class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2.5 pl-8 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-primary)] font-mono transition"
        />
        <span class="absolute left-3 top-3.5 text-[var(--color-text-secondary)]">
          <MagnifyingGlassIcon class="w-4 h-4" />
        </span>
      </div>

      <select 
        v-model="selectedType"
        class="bg-[var(--color-background)] text-xs text-[var(--color-text-primary)] rounded-lg p-2.5 font-mono border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] w-full sm:w-48"
      >
        <option value="">Toutes les transactions</option>
        <option value="Collection">Encaissement entrant</option>
        <option value="Payout_Transfer">Règlement sortant</option>
      </select>
    </div>

    <!-- TRANSACTIONS LIST -->
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs font-sans">
          <thead>
            <tr class="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
              <th class="p-3 pl-5">Référence TX</th>
              <th class="p-3">Date de l'Événement</th>
              <th class="p-3">Partenaire / Institution</th>
              <th class="p-3">Moyen de Paiement</th>
              <th class="p-3 text-right">Frais (FCFA)</th>
              <th class="p-3 text-right pr-5">Montant (FCFA)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr 
              v-for="tx in paginatedTx" 
              :key="tx.id"
              class="hover:bg-[var(--color-surface-hover)]/40 text-[var(--color-text-primary)] transition"
            >
              <td class="p-3 pl-5">
                <div class="font-mono text-[10.5px] text-[var(--color-primary)] font-semibold truncate max-w-[120px]">{{ tx.reference }}</div>
                <div class="text-[9px] text-[var(--color-text-secondary)] font-mono">{{ tx.orderReference || 'TRAITEMENT_AUTO' }}</div>
              </td>
              <td class="p-3 text-[var(--color-text-secondary)] font-mono">{{ formatDateTime(tx.processedAt) }}</td>
              <td class="p-3 font-semibold text-[var(--color-text-primary)]">
                {{ tx.recipientInstitution || 'Compte Central de Règlement' }}
              </td>
              <td class="p-3 font-mono text-[var(--color-text-secondary)]">
                {{ tx.paymentMethod }}
              </td>
              <td class="p-3 text-right font-mono text-[var(--color-text-secondary)]">
                {{ formatCurrency(tx.fee || 0) }}
              </td>
              <td class="p-3 text-right pr-5 font-mono font-bold" :class="tx.amount > 0 ? 'text-emerald-500' : 'text-red-500'">
                {{ tx.amount > 0 ? '+' : '' }}{{ formatCurrency(tx.amount) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- PAGINATION FOOTER -->
    <div class="flex items-center justify-between text-xs font-mono text-[var(--color-text-secondary)] py-4 border-t border-[var(--color-border)] ml-1 shrink-0">
      <div class="flex items-center space-x-2">
        <button 
          @click="page = Math.max(1, page - 1)" 
          class="px-2.5 py-1 bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded text-[10px] transition text-[var(--color-text-primary)] cursor-pointer"
          :disabled="page === 1"
        >
          &larr; Précédent
        </button>
        <span>Page {{ page }} sur {{ totalPages }}</span>
        <button 
          @click="page = Math.min(totalPages, page + 1)" 
          class="px-2.5 py-1 bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded text-[10px] transition text-[var(--color-text-primary)] cursor-pointer"
          :disabled="page === totalPages"
        >
          Suivant &rarr;
        </button>
      </div>
      <span>Transactions filtrées : {{ filteredTx.length }}</span>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { transactions } from '@/utils/seed_data.js';
import { useToast } from 'vue-toastification';
import { 
  BanknotesIcon, 
  ArrowDownTrayIcon, 
  MagnifyingGlassIcon 
} from '@heroicons/vue/24/outline';

const toast = useToast();

const searchQuery = ref('');
const selectedType = ref('');
const page = ref(1);
const limit = 20;

const inflows = computed(() => {
  return transactions.reduce((acc, t) => t.amount > 0 && t.type === 'Collection' ? acc + t.amount : acc, 0);
});

const outflows = computed(() => {
  return Math.abs(transactions.reduce((acc, t) => t.amount < 0 ? acc + t.amount : acc, 0));
});

const grossVolume = computed(() => inflows.value + outflows.value);

const commissionsCount = computed(() => {
  return transactions.reduce((acc, t) => t.type === 'Collection' ? acc + (t.fee || 0) : acc, 0);
});

const filteredTx = computed(() => {
  return transactions.filter(t => {
    if (selectedType.value && t.type !== selectedType.value) return false;
    
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      const matchRef = t.reference.toLowerCase().includes(q);
      const matchInst = t.recipientInstitution?.toLowerCase().includes(q);
      const matchMethod = t.paymentMethod?.toLowerCase().includes(q);
      return matchRef || matchInst || matchMethod;
    }
    return true;
  });
});

const totalPages = computed(() => {
  return Math.ceil(filteredTx.value.length / limit) || 1;
});

const paginatedTx = computed(() => {
  const startIdx = (page.value - 1) * limit;
  return filteredTx.value.slice(startIdx, startIdx + limit);
});

function formatCurrency(v) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(v).replace('XAF', 'FCFA');
}

function formatDateTime(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return d.toISOString().replace('T', ' ').slice(0, 19);
}

function simulateCSVExport() {
  toast.success('Compilation des transactions en cours... Fichier CSV téléchargé ! (Simulé)');
}
</script>
