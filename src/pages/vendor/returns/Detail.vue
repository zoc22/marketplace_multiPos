<template>
  <div class="space-y-6">
    <div v-if="!ret" class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-8 rounded-2xl text-center text-[var(--color-text-muted)] shadow-sm">
      Retour introuvable.
      <div class="mt-4">
        <router-link to="/vendor/returns" class="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm">Retour aux retours</router-link>
      </div>
    </div>

    <div v-else class="space-y-6">
      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div>
          <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Retour {{ ret.id }}</h1>
          <p class="text-sm text-[var(--color-text-secondary)] mt-1">Lié à la transaction d'origine : <span class="font-mono font-bold text-[var(--color-primary)]">{{ ret.originalTxId }}</span></p>
        </div>
        <router-link to="/vendor/returns" class="px-4 py-2 bg-[var(--color-surface-hover)] border border-[var(--color-border)] hover:bg-[var(--color-border)] rounded-xl text-sm font-semibold transition text-[var(--color-text-primary)]">
          Retour à la liste
        </router-link>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm">
          <h3 class="font-bold text-[var(--color-text-primary)] mb-4 pb-2 border-b">Articles Retournés</h3>
          <div class="divide-y divide-[var(--color-border)]">
            <div v-for="(item, idx) in (ret.itemsReturned || ret.items || [])" :key="idx" class="py-3 flex justify-between items-center first:pt-0 last:pb-0">
              <div>
                <h4 class="font-bold text-sm text-[var(--color-text-primary)]">{{ item.name }}</h4>
                <p class="text-xs text-[var(--color-text-muted)]">Code produit : {{ item.productId }}</p>
              </div>
              <div class="text-right">
                <span class="font-bold text-sm text-[var(--color-text-primary)]">Qté : {{ item.quantity }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm space-y-4">
          <h3 class="font-bold text-[var(--color-text-primary)] pb-2 border-b">Renseignements</h3>
          <div class="space-y-3 text-sm">
            <div>
              <span class="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase">Date de retour</span>
              <span class="font-bold text-[var(--color-text-primary)]">{{ formatDate(ret.date) }}</span>
            </div>
            <div>
              <span class="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase">Montant Remboursé</span>
              <span class="font-black text-red-500">{{ formatMoney(ret.refundAmount) }}</span>
            </div>
            <div>
              <span class="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase">Mode de remboursement</span>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold border inline-block bg-purple-500/10 text-purple-600 border-purple-500/20 mt-1">
                {{ ret.refundType }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { returns } from '@/utils/vendor_db.js';

const route = useRoute();
const ret = ref(null);

onMounted(() => {
  const returnId = route.params.id;
  const found = returns.value.find(r => r.id === returnId);
  if (found) {
    ret.value = found;
  }
});

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val || 0).replace('XAF', 'FCFA');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('fr-FR');
}
</script>
