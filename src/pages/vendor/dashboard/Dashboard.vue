<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
      <div>
        <h1 class="text-2xl font-black text-[var(--color-text-primary)]">Tableau de bord Vendeur</h1>
        <p class="text-base text-[var(--color-text-secondary)] mt-1">Aperçu en temps réel de vos ventes (Physique et En ligne).</p>
      </div>
      <div class="flex space-x-3">
        <router-link to="/vendor/pos" class="px-4 py-2.5 bg-emerald-500 text-white hover:opacity-90 rounded-xl text-sm font-semibold transition flex items-center space-x-2 shadow-sm">
          <BuildingStorefrontIcon class="h-5 w-5" />
          <span>Ouvrir la Caisse</span>
        </router-link>
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

    <!-- Charts area -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col">
        <h3 class="text-base font-bold text-[var(--color-text-primary)] mb-4">Évolution des ventes (7 derniers jours)</h3>
        <div class="flex-1 min-h-[240px] flex items-end justify-between gap-4 px-2">
          <div v-for="day in last7DaysSales" :key="day.name" class="w-full flex flex-col items-center group">
            <div class="w-full bg-[var(--color-surface-hover)] rounded-t-lg relative h-48 flex items-end">
              <div 
                class="w-full bg-[var(--color-primary)] rounded-t-lg transition-all duration-500 hover:opacity-85" 
                :style="{ height: `${day.percent}%` }"
              >
                <!-- Tooltip -->
                <div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] px-2 py-1 rounded shadow-md hidden group-hover:block whitespace-nowrap z-20">
                  {{ formatMoney(day.amount) }}
                </div>
              </div>
            </div>
            <span class="mt-3 text-xs text-[var(--color-text-muted)] font-bold capitalize">{{ day.name }}</span>
          </div>
        </div>
      </div>

      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col">
        <h3 class="text-base font-bold text-[var(--color-text-primary)] mb-4">Dernières Ventes POS</h3>
        <div class="space-y-4 flex-1 overflow-y-auto max-h-[280px] pr-1">
          <div v-for="tx in recentTransactions" :key="tx.id" class="flex justify-between items-center pb-3 border-b border-[var(--color-border)] last:border-0 last:pb-0">
            <div>
              <span class="block text-base font-bold text-[var(--color-text-primary)]">{{ tx.id }}</span>
              <span class="block text-[11px] text-[var(--color-text-secondary)] font-medium">{{ formatDate(tx.date) }}</span>
            </div>
            <div class="text-right">
              <span class="block text-base font-bold text-[var(--color-primary)]">{{ formatMoney(tx.total) }}</span>
              <span class="inline-block px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-500 font-bold uppercase">{{ tx.status }}</span>
            </div>
          </div>
          <div v-if="recentTransactions.length === 0" class="h-full flex items-center justify-center text-xs text-[var(--color-text-muted)] py-12">
            Aucune vente enregistrée aujourd'hui.
          </div>
        </div>
      </div>
    </div>

    <!-- WALLET & ESCROW PORTFOLIO WIDGET -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col col-span-1 shadow-sm">
        <h3 class="text-base font-bold text-[var(--color-text-primary)] mb-4 flex items-center space-x-2">
          <CreditCardIcon class="h-5 w-5 text-emerald-500" />
          <span>Portefeuille Marchand</span>
        </h3>
        <div class="space-y-4 flex-1 flex flex-col justify-center">
          <div class="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
            <span class="block text-xs uppercase font-bold text-[var(--color-text-secondary)]">Solde Disponible (Libre)</span>
            <span class="block text-3xl font-black text-emerald-500 mt-1">{{ formatMoney(walletFree) }}</span>
          </div>
          
          <div class="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center">
            <span class="block text-xs uppercase font-bold text-[var(--color-text-secondary)]">Solde Séquestre (Bloqué)</span>
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
            <span>Paiements en Ligne - Rétention Escrow</span>
          </span>
          <button @click="simulateTimeElapsed" class="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] rounded-lg transition shadow-sm flex items-center space-x-1 shrink-0">
            <ArrowPathIcon class="h-3 w-3 animate-spin-slow" />
            <span>Avancer +1 Jour</span>
          </button>
        </h3>
        <div class="space-y-4 flex-1 overflow-y-auto max-h-[220px] pr-1">
          <div v-for="item in walletLocked" :key="item.id" class="p-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl space-y-3 relative group">
            <div class="flex justify-between items-start">
              <div>
                <span class="font-bold text-sm text-[var(--color-text-primary)]">{{ item.orderName }}</span>
                <span class="text-xs text-[var(--color-text-muted)] block mt-0.5">Réf: {{ item.refId }} | Rétention: {{ item.daysRemaining }} / {{ item.totalDays }} j</span>
              </div>
              <div class="text-right">
                <span class="block font-bold text-amber-500">{{ formatMoney(item.amount) }}</span>
                <button @click="releaseEscrow(item)" class="mt-1.5 px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] rounded-lg transition shadow-sm flex items-center space-x-1">
                  <CheckCircleIcon class="h-3.5 w-3.5" />
                  <span>Livraison OK (Débloquer)</span>
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

    <!-- Alert / Summary table -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl">
      <h3 class="text-base font-bold text-[var(--color-text-primary)] mb-4 flex items-center space-x-2">
        <ExclamationTriangleIcon class="h-5 w-5 text-red-500" />
        <span>Alerte Ruptures de Stocks</span>
      </h3>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="border-b border-[var(--color-border)] text-[var(--color-text-secondary)] font-bold">
              <th class="pb-3">Code</th>
              <th class="pb-3">Désignation</th>
              <th class="pb-3">Catégorie</th>
              <th class="pb-3 text-right">Stock Actuel</th>
              <th class="pb-3 text-right">Seuil Alerte</th>
              <th class="pb-3 text-right">Statut</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr v-for="p in lowStockProducts" :key="p.id" class="text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]/40 transition">
              <td class="py-3 font-bold text-xs">{{ p.id }}</td>
              <td class="py-3 font-medium">{{ p.name }}</td>
              <td class="py-3 text-[var(--color-text-secondary)]">{{ p.category }}</td>
              <td class="py-3 text-right font-black text-red-500">{{ p.stock }}</td>
              <td class="py-3 text-right text-[var(--color-text-muted)]">{{ p.minStock || 10 }}</td>
              <td class="py-3 text-right">
                <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-500/10 text-red-500">Stock Critique</span>
              </td>
            </tr>
            <tr v-if="lowStockProducts.length === 0">
              <td colspan="6" class="py-8 text-center text-[var(--color-text-muted)]">Aucune rupture de stock signalée. Tout est sous contrôle !</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { 
  CurrencyDollarIcon, 
  ShoppingCartIcon, 
  ChartBarIcon, 
  ExclamationTriangleIcon,
  BuildingStorefrontIcon,
  BellIcon,
  LockClosedIcon,
  CheckCircleIcon,
  CreditCardIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline';
import { products, b2c_orders, walletFree, walletLocked, transactions } from '@/utils/vendor_db.js';
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
  
  // Update order status if applicable
  const foundTx = transactions.value.find(t => t.id === item.refId);
  if (foundTx) {
    foundTx.status = 'Completed';
  }
  toast.success(`Fonds de ${formatMoney(item.amount)} débloqués avec succès dans le portefeuille libre !`);
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
      
      // Update order status if B2C/Online order
      const foundTx = transactions.value.find(t => t.id === updated.refId);
      if (foundTx) {
        foundTx.status = 'Completed';
      }
      return null;
    }
    return updated;
  }).filter(Boolean);

  if (releasedCount > 0) {
    toast.success(`Simulation : ${releasedCount} transaction(s) libérée(s) automatiquement après expiration du délai. +${formatMoney(totalReleased)} crédités !`);
  } else {
    toast.info("Simulation : Temps avancé d'un jour. Rétention en cours...");
  }
}

// Format Helpers
function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val || 0).replace('XAF', 'FCFA');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

// CA du jour (filtre transactions d'aujourd'hui)
const CA_du_jour = computed(() => {
  const today = new Date().toDateString();
  return b2c_orders.value
    .filter(tx => new Date(tx.date).toDateString() === today)
    .reduce((sum, tx) => sum + tx.total, 0);
});

// Commandes du jour
const commandes_du_jour = computed(() => {
  const today = new Date().toDateString();
  return b2c_orders.value.filter(tx => new Date(tx.date).toDateString() === today).length;
});

// Panier moyen du jour
const panier_moyen = computed(() => {
  if (commandes_du_jour.value === 0) return 0;
  return Math.round(CA_du_jour.value / commandes_du_jour.value);
});

// Alertes stocks bas
const alertes_stock = computed(() => {
  return products.value.filter(p => p.stock <= (p.minStock || 10)).length;
});

const kpis = computed(() => [
  { title: "CA du jour", value: formatMoney(CA_du_jour.value), icon: CurrencyDollarIcon, bgColor: "bg-emerald-500/10", iconColor: "text-emerald-500" },
  { title: "Ventes du jour", value: String(commandes_du_jour.value), icon: ShoppingCartIcon, bgColor: "bg-blue-500/10", iconColor: "text-blue-500" },
  { title: "Panier Moyen", value: formatMoney(panier_moyen.value), icon: ChartBarIcon, bgColor: "bg-purple-500/10", iconColor: "text-purple-500" },
  { title: "Alertes Stocks", value: String(alertes_stock.value), icon: BellIcon, bgColor: "bg-red-500/10", iconColor: "text-red-500" }
]);

// Last 5 sales
const recentTransactions = computed(() => {
  const today = new Date().toDateString();
  return [...b2c_orders.value]
    .filter(tx => new Date(tx.date).toDateString() === today)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
});

// Low stock products list
const lowStockProducts = computed(() => {
  return products.value.filter(p => p.stock <= (p.minStock || 10));
});

// Sales evolution (last 7 days)
const last7DaysSales = computed(() => {
  const days = [];
  const weekdayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayStr = d.toDateString();
    
    const dayTotal = b2c_orders.value
      .filter(tx => new Date(tx.date).toDateString() === dayStr)
      .reduce((sum, tx) => sum + tx.total, 0);
      
    days.push({
      name: weekdayNames[d.getDay()],
      amount: dayTotal,
      percent: 0 // Will adjust relative to max below
    });
  }
  
  const maxAmount = Math.max(...days.map(d => d.amount), 1);
  days.forEach(d => {
    d.percent = Math.max(10, Math.round((d.amount / maxAmount) * 100)); // Min 10% height for visibility
  });
  
  return days;
});
</script>

