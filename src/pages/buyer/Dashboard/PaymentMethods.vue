<template>
  <div class="space-y-6 max-w-6xl mx-auto" id="buyer-payments">
    <!-- Header -->
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Portefeuilles &amp; Séquestres</h1>
        <p class="text-sm text-[var(--color-text-secondary)]">Suivez le solde de vos comptes et surveillez les fonds en attente de livraison.</p>
      </div>
      <button 
        @click="isRechargeModalOpen = true"
        class="px-4 py-2.5 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-xl text-xs font-semibold uppercase tracking-wider transition shadow flex items-center space-x-2"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Recharger Compte</span>
      </button>
    </div>

    <!-- Wallets Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- Wallet Libre (Free balance) -->
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm space-y-4">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="font-bold text-base text-[var(--color-text-primary)]">Portefeuille Libre</h3>
            <p class="text-xs text-[var(--color-text-secondary)]">Fonds disponibles immédiatement pour passer commande.</p>
          </div>
          <span class="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0c0 .478-.052.94-.153 1.387l-.962 4.212a2.25 2.25 0 01-2.197 1.75H6.112a2.25 2.25 0 01-2.197-1.75l-.962-4.212A9.006 9.006 0 013 12m18 0a9.003 9.003 0 01-9 9m0 0a9.003 9.003 0 01-9-9m9 9c1.656 0 3-1.344 3-3V15M9 15h6" />
            </svg>
          </span>
        </div>
        <div class="text-3xl font-black text-[var(--color-primary)] font-mono">450 000 FCFA</div>
        
        <div class="pt-4 border-t border-[var(--color-border)] text-xs text-[var(--color-text-secondary)]">
          Rechargeable via MTN Mobile Money, Orange Money ou Carte Bancaire nationale.
        </div>
      </div>

      <!-- Wallet Bloqué (Escrow balance) -->
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm space-y-4">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="font-bold text-base text-[var(--color-text-primary)]">Séquestres Bloqués</h3>
            <p class="text-xs text-[var(--color-text-secondary)]">Montants réservés sous garantie pour les commandes en transit.</p>
          </div>
          <span class="p-2.5 bg-amber-500/10 text-amber-600 rounded-xl">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </span>
        </div>
        <div class="text-3xl font-black text-amber-500 font-mono">3 814 057 FCFA</div>
        
        <div class="pt-4 border-t border-[var(--color-border)] text-xs text-[var(--color-text-secondary)]">
          Les fonds sont automatiquement libérés au profit du vendeur à la validation de la livraison.
        </div>
      </div>
    </div>

    <!-- Active Locked Funds Escrows Progress list -->
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm space-y-4">
      <h3 class="text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2 uppercase font-mono">
        Suivi des Portefeuilles Bloqués (Commandes en route)
      </h3>

      <div class="space-y-4">
        <div 
          v-for="esc in activeEscrows" 
          :key="esc.id"
          class="p-4 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl space-y-3"
        >
          <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div>
              <span class="text-xs font-bold text-[var(--color-text-primary)]">{{ esc.title }}</span>
              <p class="text-[10px] text-[var(--color-text-secondary)] font-mono">Commande : {{ esc.orderRef }} &bull; Boutique : {{ esc.storeName }}</p>
            </div>
            <div class="text-right">
              <span class="text-sm font-bold font-mono text-[var(--color-text-primary)] block">{{ formatMoney(esc.amount) }}</span>
              <span class="text-[10px] text-[var(--color-text-secondary)] font-mono">Débit prévu dans : {{ esc.daysRemaining }} jours</span>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="space-y-1">
            <div class="w-full bg-[var(--color-background)] h-2.5 rounded-full overflow-hidden border border-[var(--color-border)]">
              <div 
                class="bg-amber-500 h-full rounded-full transition-all duration-500" 
                :style="{ width: getProgressPercentage(esc) + '%' }"
              ></div>
            </div>
            <div class="flex justify-between text-[9px] font-mono text-[var(--color-text-secondary)]">
              <span>Date de commande</span>
              <span>Validation Fret</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Linked Accounts -->
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm space-y-4">
      <h3 class="text-sm font-bold text-[var(--color-text-primary)]">Modes de Paiement Liés</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
        <div class="p-3 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl flex justify-between items-center">
          <span class="font-bold text-[var(--color-text-primary)]">MTN Mobile Money (+237 67x xx xx 88)</span>
          <span class="text-emerald-500 font-bold">Actif</span>
        </div>
        <div class="p-3 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl flex justify-between items-center">
          <span class="font-bold text-[var(--color-text-primary)]">Orange Money (+237 69x xx xx 15)</span>
          <span class="text-emerald-500 font-bold">Actif</span>
        </div>
      </div>
    </div>

    <!-- Recharge Modal -->
    <div 
      v-if="isRechargeModalOpen"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
      @click.self="isRechargeModalOpen = false"
    >
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl w-full max-w-md p-6 shadow-2xl cursor-default animate-in zoom-in-95 duration-200 space-y-4">
        <h3 class="text-sm font-bold text-[var(--color-text-primary)] uppercase font-mono border-b border-[var(--color-border)] pb-2">Recharger mon portefeuille</h3>
        
        <form @submit.prevent="submitRecharge" class="space-y-4 text-xs">
          <label class="block">
            <span class="block text-[11px] text-[var(--color-text-secondary)] font-bold mb-1">Montant à recharger (FCFA) *</span>
            <input type="number" v-model.number="rechargeAmount" min="500" required class="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)] p-2.5 rounded-lg text-right font-mono text-sm font-bold" />
          </label>

          <label class="block">
            <span class="block text-[11px] text-[var(--color-text-secondary)] font-bold mb-1">Mode de rechargement</span>
            <select v-model="rechargeMode" class="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] p-2 rounded-lg">
              <option value="MTN MoMo">MTN Mobile Money</option>
              <option value="Orange Money">Orange Money</option>
              <option value="Carte Bancaire">Carte Bancaire Visa/Mastercard</option>
            </select>
          </label>

          <div class="flex justify-end space-x-3 pt-2">
            <button type="button" @click="isRechargeModalOpen = false" class="px-4 py-2 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-secondary)]">Annuler</button>
            <button type="submit" class="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-xs font-semibold">Procéder au paiement</button>
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
const isRechargeModalOpen = ref(false);
const rechargeAmount = ref(50000);
const rechargeMode = ref('MTN MoMo');

const activeEscrows = ref([
  {
    id: 1,
    title: 'Approvisionnement Intrants Cacao',
    orderRef: 'B2B-PO-2026-0941-88',
    storeName: 'SOPRO-CAM S.A.',
    amount: 1573137,
    daysRemaining: 2,
    totalDays: 5
  },
  {
    id: 2,
    title: 'Commande Outillages Agricoles',
    orderRef: 'B2C-00242',
    storeName: 'Zama-Agro Sahel',
    amount: 2240920,
    daysRemaining: 4,
    totalDays: 5
  }
]);

function getProgressPercentage(esc) {
  const completedDays = esc.totalDays - esc.daysRemaining;
  return Math.min(100, Math.max(0, Math.round((completedDays / esc.totalDays) * 100)));
}

function submitRecharge() {
  isRechargeModalOpen.value = false;
  toast.success(`Paiement de ${formatMoney(rechargeAmount.value)} initié avec succès via ${rechargeMode.value}.`);
}

function formatMoney(val) {
  if (!val && val !== 0) return '-';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('XAF', 'FCFA');
}
</script>
