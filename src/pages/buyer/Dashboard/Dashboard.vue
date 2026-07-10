<template>
  <div class="space-y-6 max-w-7xl mx-auto" id="buyer-dashboard">
    <!-- WELCOME HERO BANNER -->
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
      <div class="space-y-1">
        <div class="flex items-center space-x-2">
          <span class="text-xs font-mono bg-emerald-500/10 text-emerald-600 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-bold uppercase tracking-wider">
            Compte Client B2C Actif
          </span>
        </div>
        <h1 class="text-xl md:text-2xl font-bold text-[var(--color-text-primary)]">Bonjour, {{ authStore.user?.name || 'Alice Smith' }}</h1>
        <p class="text-sm text-[var(--color-text-secondary)]">Bienvenue dans votre espace client. Suivez vos commandes en cours et gérez vos informations de livraison.</p>
      </div>
      <div class="flex gap-3">
        <router-link 
          to="/buyer/orders" 
          class="px-4 py-2.5 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-xl text-xs font-semibold uppercase tracking-wider transition shadow-lg flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <span>Mes commandes</span>
        </router-link>
      </div>
    </div>

    <!-- METRICS GRID -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-[var(--color-primary)] transition duration-200">
        <div class="flex justify-between items-center">
          <span class="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase tracking-wider font-semibold">Total Achats</span>
          <span class="p-1.5 bg-blue-500/10 text-blue-600 rounded-lg">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </span>
        </div>
        <div class="mt-4">
          <div class="text-2xl font-bold font-mono text-[var(--color-text-primary)]">{{ customerOrders.length }}</div>
          <p class="text-[10px] text-[var(--color-text-secondary)] mt-0.5">Commandes enregistrées</p>
        </div>
      </div>

      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-[var(--color-primary)] transition duration-200">
        <div class="flex justify-between items-center">
          <span class="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase tracking-wider font-semibold">Solde Portefeuille</span>
          <span class="p-1.5 bg-emerald-500/10 text-emerald-600 rounded-lg">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0c0 .478-.052.94-.153 1.387l-.962 4.212a2.25 2.25 0 01-2.197 1.75H6.112a2.25 2.25 0 01-2.197-1.75l-.962-4.212A9.006 9.006 0 013 12m18 0a9.003 9.003 0 01-9 9m0 0a9.003 9.003 0 01-9-9m9 9c1.656 0 3-1.344 3-3V15M9 15h6" />
            </svg>
          </span>
        </div>
        <div class="mt-4">
          <div class="text-2xl font-bold font-mono text-[var(--color-text-primary)]">450 000 FCFA</div>
          <p class="text-[10px] text-[var(--color-text-secondary)] mt-0.5">Fonds disponibles</p>
        </div>
      </div>

      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-[var(--color-primary)] transition duration-200">
        <div class="flex justify-between items-center">
          <span class="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase tracking-wider font-semibold">Points Fidélité</span>
          <span class="p-1.5 bg-amber-500/10 text-amber-600 rounded-lg">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        </div>
        <div class="mt-4">
          <div class="text-2xl font-bold font-mono text-[var(--color-text-primary)]">1 250</div>
          <p class="text-[10px] text-[var(--color-text-secondary)] mt-0.5">Points cumulés (Statut Or)</p>
        </div>
      </div>

      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-[var(--color-primary)] transition duration-200">
        <div class="flex justify-between items-center">
          <span class="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase tracking-wider font-semibold">Favoris</span>
          <span class="p-1.5 bg-rose-500/10 text-rose-600 rounded-lg">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </span>
        </div>
        <div class="mt-4">
          <div class="text-2xl font-bold font-mono text-[var(--color-text-primary)]">8 articles</div>
          <p class="text-[10px] text-[var(--color-text-secondary)] mt-0.5">Dans ma liste d'envies</p>
        </div>
      </div>
    </div>

    <!-- MAIN TWO-COLUMN DASHBOARD GRID -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- GRAPHICAL CHARTS (2 COLS) -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h3 class="text-sm font-bold text-[var(--color-text-primary)]">Évolution de mes Achats</h3>
              <p class="text-xs text-[var(--color-text-secondary)]">Suivi graphique mensuel des dépenses sur l'année 2026.</p>
            </div>
          </div>
          <div class="h-64 relative">
            <canvas ref="chartCanvas" id="buyer-spending-chart"></canvas>
          </div>
        </div>

        <!-- RECENT ORDERS -->
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm">
          <h3 class="text-sm font-bold text-[var(--color-text-primary)] mb-4">Commandes Récentes</h3>
          <div class="space-y-3">
            <div 
              v-for="order in customerOrders.slice(0, 3)" 
              :key="order.id"
              class="p-4 bg-[var(--color-surface-elevated)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl flex items-center justify-between transition"
            >
              <div class="flex items-center space-x-3">
                <span class="p-2 bg-[var(--color-primary-muted)] text-[var(--color-primary)] rounded-lg">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </span>
                <div>
                  <h4 class="font-bold text-sm text-[var(--color-text-primary)]">{{ order.reference }}</h4>
                  <p class="text-xs text-[var(--color-text-secondary)] font-mono">{{ formatDate(order.created_at) }} &bull; {{ order.supplierName }}</p>
                </div>
              </div>
              <div class="text-right flex items-center space-x-3">
                <div>
                  <div class="font-bold text-sm text-[var(--color-text-primary)] font-mono">{{ formatMoney(order.total) }}</div>
                  <span class="px-2 py-0.5 rounded-full text-[9px] font-mono tracking-wide uppercase font-bold" :class="getStatusClasses(order.status)">
                    {{ translateStatus(order.status) }}
                  </span>
                </div>
                <router-link 
                  :to="'/buyer/orders/' + order.id"
                  class="p-1.5 hover:bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg transition"
                >
                  <svg class="w-4 h-4 text-[var(--color-text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- QUICK SHORTCUTS & NEWS (1 COL) -->
      <div class="space-y-6">
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm">
          <h3 class="text-sm font-bold text-[var(--color-text-primary)] mb-4">Raccourcis Utiles</h3>
          <div class="grid grid-cols-1 gap-3">
            <router-link to="/buyer/orders" class="p-3 bg-[var(--color-surface-elevated)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl flex items-center space-x-3 transition text-sm font-bold text-[var(--color-text-primary)]">
              <span>📦</span>
              <span>Voir mes commandes</span>
            </router-link>
            <router-link to="/buyer/wishlist" class="p-3 bg-[var(--color-surface-elevated)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl flex items-center space-x-3 transition text-sm font-bold text-[var(--color-text-primary)]">
              <span>❤️</span>
              <span>Ma liste d'envies</span>
            </router-link>
            <router-link to="/buyer/payment-methods" class="p-3 bg-[var(--color-surface-elevated)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl flex items-center space-x-3 transition text-sm font-bold text-[var(--color-text-primary)]">
              <span>💳</span>
              <span>Modes de paiement</span>
            </router-link>
            <router-link to="/buyer/profile" class="p-3 bg-[var(--color-surface-elevated)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl flex items-center space-x-3 transition text-sm font-bold text-[var(--color-text-primary)]">
              <span>👤</span>
              <span>Modifier mon profil</span>
            </router-link>
          </div>
        </div>

        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm">
          <h3 class="text-sm font-bold text-[var(--color-text-primary)] mb-4">Informations &amp; Alertes</h3>
          <div class="space-y-4 text-xs text-[var(--color-text-secondary)] leading-relaxed">
            <div class="p-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-800 rounded-xl">
              <strong>Solde séquestre :</strong> Les montants de vos commandes en ligne sont retenus en toute sécurité par notre tiers de confiance jusqu'à livraison finale.
            </div>
            <div class="p-3.5 bg-blue-500/10 border border-blue-500/20 text-blue-800 rounded-xl">
              <strong>Service client :</strong> Des questions sur votre livraison ? Contactez notre support local gratuit au 8080.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/store/modules/auth.js';
import { orders as dbOrders } from '@/utils/supplier_db.js';
import { Chart } from 'chart.js/auto';

const authStore = useAuthStore();
const chartCanvas = ref(null);
let chartInstance = null;

onMounted(() => {
  if (chartCanvas.value) {
    chartInstance = new Chart(chartCanvas.value, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
        datasets: [{
          label: 'Achats Mensuels (FCFA)',
          data: [525000, 1350000, 392000, 1800000, 1875000, 2544062],
          backgroundColor: '#4f46e5',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              font: {
                family: 'monospace',
                size: 9
              }
            }
          },
          x: {
            ticks: {
              font: {
                family: 'monospace',
                size: 10
              }
            }
          }
        }
      }
    });
  }
});

const customerOrders = computed(() => {
  return dbOrders.value || [];
});

function formatMoney(val) {
  if (!val && val !== 0) return '-';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('XAF', 'FCFA');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
}

function translateStatus(stat) {
  const m = {
    'Draft': 'Brouillon',
    'Submitted': 'En attente',
    'Approved': 'Approuvé',
    'Preparing': 'En colisage',
    'Packed': 'Prêt',
    'Shipped': 'En transit',
    'Delivered': 'Livré',
    'Cancelled': 'Annulé'
  };
  return m[stat] || stat;
}

function getStatusClasses(stat) {
  const classes = {
    'Draft': 'bg-slate-200 text-slate-700 border border-slate-300',
    'Submitted': 'bg-indigo-100 text-indigo-700 border border-indigo-200',
    'Approved': 'bg-teal-100 text-teal-700 border border-teal-200',
    'Preparing': 'bg-pink-100 text-pink-700 border border-pink-200',
    'Packed': 'bg-blue-100 text-blue-700 border border-blue-200',
    'Shipped': 'bg-sky-100 text-sky-700 border border-sky-200',
    'Delivered': 'bg-emerald-100 text-emerald-700 border border-emerald-250',
    'Cancelled': 'bg-red-100 text-red-700 border border-red-200'
  };
  return classes[stat] || 'bg-slate-100 text-slate-750 border border-slate-200';
}
</script>
