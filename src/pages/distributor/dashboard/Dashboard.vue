<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
      <div>
        <h1 class="text-2xl font-black text-[var(--color-text-primary)]">Tableau de bord Distributeur</h1>
        <p class="text-base text-[var(--color-text-secondary)] mt-1">Aperçu de votre activité logistique et de votre trésorerie B2B séquestrée.</p>
      </div>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <div v-for="kpi in kpis" :key="kpi.title" class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-5 rounded-2xl flex items-center space-x-4 hover:border-[var(--color-primary-muted)] transition shadow-sm min-w-0">
        <div class="h-12 w-12 rounded-xl flex items-center justify-center shrink-0" :class="kpi.bgColor">
          <component :is="kpi.icon" class="h-6 w-6" :class="kpi.iconColor" />
        </div>
        <div class="min-w-0 flex-1">
          <span class="block text-sm font-medium text-[var(--color-text-secondary)] truncate" :title="kpi.title">{{ kpi.title }}</span>
          <span class="block text-base sm:text-lg xl:text-xl font-bold text-[var(--color-text-primary)] truncate" :title="kpi.value">{{ kpi.value }}</span>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm">
        <h3 class="text-base font-bold text-[var(--color-text-primary)] mb-4">Volume Expédié (Tonnes)</h3>
        <div class="h-64 flex items-end justify-between gap-2 px-2">
          <div v-for="day in 7" :key="day" class="w-full bg-[var(--color-surface-hover)] rounded-t-lg relative group h-48 flex items-end">
            <div 
              class="w-full bg-[var(--color-primary)] rounded-t-lg transition-all duration-500 hover:opacity-85" 
              :style="{ height: `${[45, 60, 20, 85, 30, 95, 50][day - 1]}%` }"
            ></div>
          </div>
        </div>
        <div class="flex justify-between mt-3 text-xs font-bold text-[var(--color-text-muted)] uppercase">
          <span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span>
        </div>
      </div>

      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm">
        <h3 class="text-base font-bold text-[var(--color-text-primary)] mb-4">Alertes Logistiques</h3>
        <div class="space-y-4">
          <div class="flex items-start space-x-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <ExclamationTriangleIcon class="h-5 w-5 text-red-500 shrink-0" />
            <div>
              <span class="block text-sm font-bold text-red-600">Stock Critique (Basse capacité)</span>
              <span class="block text-[11px] text-red-500/80 mt-0.5">Dépôt Central Douala - Pompe Solaire (Reste: 3)</span>
            </div>
          </div>
          <div class="flex items-start space-x-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
            <BellAlertIcon class="h-5 w-5 text-orange-500 shrink-0" />
            <div>
              <span class="block text-sm font-bold text-orange-600">Préparation en attente</span>
              <span class="block text-[11px] text-orange-500/80 mt-0.5">4 commandes B2B nécessitent un picking d'expédition.</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- WALLET & ESCROW PORTFOLIO WIDGET -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col col-span-1 shadow-sm">
        <h3 class="text-base font-bold text-[var(--color-text-primary)] mb-4 flex items-center space-x-2">
          <CreditCardIcon class="h-5 w-5 text-emerald-500" />
          <span>Trésorerie Distributeur</span>
        </h3>
        <div class="space-y-4 flex-1 flex flex-col justify-center">
          <div class="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
            <span class="block text-xs uppercase font-bold text-[var(--color-text-secondary)]">Trésorerie Libre (Disponible)</span>
            <span class="block text-2xl font-black text-emerald-500 mt-1">{{ formatMoney(walletFree) }}</span>
          </div>
          
          <div class="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center">
            <span class="block text-xs uppercase font-bold text-[var(--color-text-secondary)]">Montant Sous Séquestre B2B</span>
            <span class="block text-2xl font-black text-amber-500 mt-1 flex items-center justify-center space-x-1">
              <LockClosedIcon class="h-5 w-5 text-amber-500 animate-pulse" />
              <span>{{ formatMoney(totalLockedAmount) }}</span>
            </span>
          </div>
        </div>
      </div>

      <div class="lg:col-span-2 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col shadow-sm">
        <h3 class="text-base font-bold text-[var(--color-text-primary)] mb-4 flex items-center justify-between gap-4">
          <span class="flex items-center space-x-2">
            <LockClosedIcon class="h-5 w-5 text-amber-500" />
            <span>Séquestres Acheteurs (Garanti B2B)</span>
          </span>
          <button @click="simulateTimeElapsed" class="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] rounded-lg transition shadow-sm flex items-center space-x-1 shrink-0">
            <ArrowPathIcon class="h-3 w-3" />
            <span>Avancer +1 Jour</span>
          </button>
        </h3>
        <div class="space-y-4 flex-1 overflow-y-auto max-h-[220px] pr-1">
          <div v-for="item in walletLocked" :key="item.id" class="p-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl space-y-3 relative group">
            <div class="flex justify-between items-start">
              <div>
                <span class="font-bold text-sm text-[var(--color-text-primary)]">{{ item.orderName }}</span>
                <span class="text-xs text-[var(--color-text-muted)] block mt-0.5">Réf: {{ item.refId }} | Échéance auto: {{ item.daysRemaining }} / {{ item.totalDays }} j</span>
              </div>
              <div class="text-right">
                <span class="block font-bold text-amber-500">{{ formatMoney(item.amount) }}</span>
                <button @click="releaseEscrow(item)" class="mt-1.5 px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] rounded-lg transition shadow-sm flex items-center space-x-1">
                  <CheckCircleIcon class="h-3.5 w-3.5" />
                  <span>Livraison Conforme (Libérer)</span>
                </button>
              </div>
            </div>
            
            <!-- Progress bar -->
            <div class="space-y-1">
              <div class="flex justify-between text-[9px] text-[var(--color-text-muted)]">
                <span>Rétention en cours</span>
                <span>{{ progressPercent(item) }}% complété</span>
              </div>
              <div class="w-full h-2 bg-[var(--color-surface-hover)] rounded-full overflow-hidden">
                <div class="h-full bg-amber-500 transition-all duration-500" :style="{ width: `${progressPercent(item)}%` }"></div>
              </div>
            </div>
          </div>
          <div v-if="walletLocked.length === 0" class="h-full flex flex-col items-center justify-center text-xs text-[var(--color-text-muted)] py-12">
            <CheckCircleIcon class="h-10 w-10 text-emerald-500 mb-2 opacity-50" />
            <span>Aucune transaction sous séquestre active.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { 
  CurrencyDollarIcon, 
  TruckIcon, 
  UserGroupIcon, 
  ExclamationTriangleIcon,
  BellAlertIcon,
  ArchiveBoxIcon,
  LockClosedIcon,
  CheckCircleIcon,
  CreditCardIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline';
import { walletFree, walletLocked, purchases, orders } from '@/utils/distributor_db.js';
import { useToast } from 'vue-toastification';

const toast = useToast();

const totalLockedAmount = computed(() => {
  return (walletLocked.value || []).reduce((sum, item) => sum + item.amount, 0);
});

const progressPercent = (item) => {
  return Math.max(10, Math.min(100, Math.round(((item.totalDays - item.daysRemaining) / item.totalDays) * 100)));
};

function releaseEscrow(item) {
  walletFree.value += item.amount;
  walletLocked.value = walletLocked.value.filter(l => l.id !== item.id);
  
  // Update order status if B2B client order
  const foundOrder = orders.value.find(o => o.id === item.refId);
  if (foundOrder) {
    foundOrder.status = 'Delivered';
  }
  toast.success(`Fonds de ${formatMoney(item.amount)} crédités sur votre portefeuille disponible.`);
}

function simulateTimeElapsed() {
  let releasedCount = 0;
  let totalReleased = 0;
  
  walletLocked.value = walletLocked.value.map(item => {
    const updated = { ...item, daysRemaining: item.daysRemaining - 1 };
    if (updated.daysRemaining <= 0) {
      walletFree.value += updated.amount;
      totalReleased += updated.amount;
      releasedCount++;
      
      // Update order status if B2B client order
      const foundOrder = orders.value.find(o => o.id === updated.refId);
      if (foundOrder) {
        foundOrder.status = 'Delivered';
      }
      return null;
    }
    return updated;
  }).filter(Boolean);

  if (releasedCount > 0) {
    toast.success(`Simulation : ${releasedCount} commande B2B libérée(s). +${formatMoney(totalReleased)} crédités !`);
  } else {
    toast.info("Simulation : Temps avancé d'un jour.");
  }
}

// CA du jour (estimé pour la démo)
const totalPurchasesAmount = computed(() => {
  return purchases.value.reduce((sum, po) => sum + po.amount, 0);
});

const kpis = computed(() => [
  { title: "CA Portefeuille", value: formatMoney(walletFree.value), icon: CurrencyDollarIcon, bgColor: "bg-emerald-500/10", iconColor: "text-emerald-500" },
  { title: "Commandes B2B", value: String(orders.value.length), icon: TruckIcon, bgColor: "bg-blue-500/10", iconColor: "text-blue-500" },
  { title: "Achats Amont B2B", value: formatMoney(totalPurchasesAmount.value), icon: ArchiveBoxIcon, bgColor: "bg-purple-500/10", iconColor: "text-purple-500" },
  { title: "Garanties Bloquées", value: formatMoney(totalLockedAmount.value), icon: LockClosedIcon, bgColor: "bg-amber-500/10", iconColor: "text-amber-500" }
]);

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val || 0).replace('XAF', 'FCFA');
}
</script>
