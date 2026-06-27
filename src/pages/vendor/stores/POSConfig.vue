<template>
  <div class="space-y-6">
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex justify-between items-center shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Configuration & Session - {{ store?.name || 'Magasin' }}</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Gérez l'état de la caisse et la session de vente de ce point de vente.</p>
      </div>
      <router-link to="/vendor/stores" class="px-4 py-2 bg-[var(--color-surface-hover)] hover:bg-[var(--color-border)] text-[var(--color-text-primary)] rounded-xl text-sm font-semibold transition border border-[var(--color-border)] shadow-sm">Retour</router-link>
    </div>

    <div v-if="!store" class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-8 rounded-2xl text-center text-[var(--color-text-muted)] shadow-sm">
      Point de vente introuvable.
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Session Status Card -->
      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
        <div class="h-16 w-16 rounded-full flex items-center justify-center border" :class="activeSession ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'">
          <BuildingStorefrontIcon class="h-8 w-8" />
        </div>
        <h2 class="font-bold text-[var(--color-text-primary)] text-lg">Statut du Point de Vente</h2>
        
        <div v-if="activeSession" class="space-y-2">
          <span class="text-sm text-[var(--color-text-secondary)]">La caisse est actuellement <strong class="text-emerald-500">Ouverte</strong></span>
          <div class="text-[11px] text-[var(--color-text-muted)] font-mono">
            <div>Par : {{ activeSession.cashierName }}</div>
            <div>Depuis : {{ new Date(activeSession.openingTime).toLocaleString('fr-FR') }}</div>
          </div>
          <div class="text-2xl font-black text-[var(--color-primary)] pt-2">
            Espèces attendues : {{ formatMoney(activeSession.floatAmount + sessionCashSales) }}
          </div>
          <button 
            @click="closePOSSession" 
            class="mt-4 px-6 py-2.5 bg-red-500 text-white hover:bg-red-650 rounded-xl font-semibold transition shadow-md"
          >
            Forcer la clôture de caisse
          </button>
        </div>

        <div v-else class="space-y-3">
          <span class="text-sm text-[var(--color-text-secondary)]">La caisse est actuellement <strong class="text-red-500">Fermée</strong></span>
          <p class="text-xs text-[var(--color-text-muted)]">Aucune session de vente n'est active pour ce magasin.</p>
          <router-link 
            to="/vendor/pos" 
            class="mt-4 inline-block px-6 py-2.5 bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl font-semibold transition shadow-md"
          >
            Ouvrir la Caisse (POS)
          </router-link>
        </div>
      </div>

      <!-- Quick stats for this store -->
      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm space-y-4">
        <h3 class="font-bold text-[var(--color-text-primary)] text-base border-b pb-2">Informations Générales</h3>
        <div class="text-sm space-y-3">
          <div class="flex justify-between">
            <span class="text-[var(--color-text-secondary)]">Adresse :</span>
            <span class="font-bold text-[var(--color-text-primary)]">{{ store.location }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-[var(--color-text-secondary)]">Nombre de caisses enregistrées :</span>
            <span class="font-bold text-[var(--color-text-primary)]">{{ store.posCount }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-[var(--color-text-secondary)]">Statut du magasin :</span>
            <span class="px-2 py-0.5 rounded text-xs font-bold" :class="store.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'">
              {{ store.status === 'Active' ? 'Actif' : 'Inactif' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { stores, pos_sessions, transactions } from '@/utils/vendor_db.js';
import { BuildingStorefrontIcon } from '@heroicons/vue/24/outline';
import { useToast } from 'vue-toastification';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const store = ref(null);

onMounted(() => {
  const storeId = route.params.id;
  const found = stores.value.find(s => s.id === storeId);
  if (found) {
    store.value = found;
  }
});

// Find active session for this specific store
const activeSession = computed(() => {
  if (!store.value) return null;
  return pos_sessions.value.find(s => s.storeId === store.value.id && s.status === 'Open');
});

// Calculate sales during this active session
const sessionCashSales = computed(() => {
  if (!activeSession.value) return 0;
  const sessionTxs = transactions.value.filter(tx => tx.sessionId === activeSession.value.id);
  return sessionTxs.reduce((sum, tx) => {
    const cashPm = tx.payments.filter(p => p.method === 'Cash');
    return sum + cashPm.reduce((s, p) => s + p.amount, 0);
  }, 0);
});

function closePOSSession() {
  if (!activeSession.value) return;
  
  const sess = pos_sessions.value.find(s => s.id === activeSession.value.id);
  if (sess) {
    sess.status = 'Closed';
    sess.closingTime = new Date().toISOString();
    sess.endCash = sess.floatAmount + sessionCashSales.value;
    sess.discrepancy = 0;
    
    toast.success('Session de caisse clôturée avec succès.');
  }
}

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val || 0).replace('XAF', 'FCFA');
}
</script>
