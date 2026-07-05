<template>
  <div class="space-y-6">
    
    <!-- En-tête HUD -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
          <ChartBarIcon class="w-5 h-5 text-[var(--color-primary)]" />
          <span>Chiffres d'Affaires Consolidés de la Plateforme</span>
        </h1>
        <p class="text-xs text-[var(--color-text-secondary)] mt-1">Statistiques des commerçants multi-locataires, volumes des échanges agricoles et commissions sur transactions financières.</p>
      </div>

      <div class="text-xs font-mono text-[var(--color-primary)] p-2.5 bg-[var(--color-primary-muted)] border border-[var(--color-primary-border)] rounded-xl">
        Locataires Actifs Mensuels : <strong>24 Nœuds Actifs</strong>
      </div>
    </div>

    <!-- SYNTHÈSE DES MÉTRIQUES -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 rounded-2xl flex items-center justify-between shadow-sm">
        <div>
          <span class="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider block font-bold">Volume d'Affaires Global (GMV)</span>
          <div class="text-2xl font-extrabold font-mono text-[var(--color-text-primary)] mt-2">
            184 950 000 FCFA
          </div>
          <span class="text-[11px] text-emerald-500 font-sans mt-1 block">&uarr; +14.2% par rapport au mois dernier</span>
        </div>
        <div class="p-3 bg-[var(--color-primary-muted)] rounded-xl text-[var(--color-primary)]">
          <ArrowTrendingUpIcon class="w-6 h-6" />
        </div>
      </div>

      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 rounded-2xl flex items-center justify-between shadow-sm">
        <div>
          <span class="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider block font-bold">Commandes B2B Finalisées</span>
          <div class="text-2xl font-extrabold font-mono text-[var(--color-text-primary)] mt-2">
            4 892 Terminées
          </div>
          <span class="text-[11px] text-[var(--color-primary)] font-sans mt-1 block">&uarr; 99.8% de bons de livraison validés</span>
        </div>
        <div class="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
          <ClipboardDocumentCheckIcon class="w-6 h-6" />
        </div>
      </div>

      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 rounded-2xl flex items-center justify-between shadow-sm">
        <div>
          <span class="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider block font-bold">Valeur Moyenne des Transactions</span>
          <div class="text-2xl font-extrabold font-mono text-[var(--color-text-primary)] mt-2">
            37 800 FCFA
          </div>
          <span class="text-[11px] text-[var(--color-text-tertiary)] font-sans mt-1 block">Volumes d'achat en gros industriels</span>
        </div>
        <div class="p-3 bg-amber-500/10 rounded-xl text-amber-400">
          <BanknotesIcon class="w-6 h-6" />
        </div>
      </div>
    </div>

    <!-- GRAPHIQUES PRINCIPAUX -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- ÉVOLUTION DU VOLUME D'AFFAIRES -->
      <div class="lg:col-span-2 bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-2xl space-y-4 shadow-sm">
        <h3 class="text-sm uppercase font-mono tracking-wider text-[var(--color-text-primary)] font-bold flex items-center space-x-1.5">
          <PresentationChartLineIcon class="w-4 h-4 text-[var(--color-primary)]" />
          <span>Progression du Volume Multi-Locataire (XAF)</span>
        </h3>
        
        <div class="h-72">
          <VueApexCharts 
            type="area" 
            height="100%" 
            :options="chartOptions" 
            :series="chartSeries" 
          />
        </div>
      </div>

      <!-- RÉPARTITION PAR SECTEUR -->
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-2xl space-y-4 shadow-sm">
        <h3 class="text-sm uppercase font-mono tracking-wider text-[var(--color-text-primary)] font-bold flex items-center space-x-1.5">
          <FunnelIcon class="w-4 h-4 text-[var(--color-primary)]" />
          <span>Part de Marché par Secteur</span>
        </h3>

        <div class="space-y-4 pt-2">
          
          <div class="space-y-1 text-sm">
            <div class="flex justify-between text-[var(--color-text-secondary)] font-sans">
              <span class="font-semibold text-[var(--color-text-primary)]">Agriculture Souveraine</span>
              <span>62.4%</span>
            </div>
            <div class="w-full bg-[var(--color-background)] h-2 rounded overflow-hidden border border-[var(--color-border)]">
              <div class="bg-[var(--color-primary)] h-full rounded" style="width: 62.4%"></div>
            </div>
          </div>

          <div class="space-y-1 text-sm">
            <div class="flex justify-between text-[var(--color-text-secondary)] font-sans">
              <span class="font-semibold text-[var(--color-text-primary)]">BTP & Matériaux de Construction</span>
              <span>24.8%</span>
            </div>
            <div class="w-full bg-[var(--color-background)] h-2 rounded overflow-hidden border border-[var(--color-border)]">
              <div class="bg-teal-500 h-full rounded" style="width: 24.8%"></div>
            </div>
          </div>

          <div class="space-y-1 text-sm">
            <div class="flex justify-between text-[var(--color-text-secondary)] font-sans">
              <span class="font-semibold text-[var(--color-text-primary)]">Produits Secs & Cacao</span>
              <span>12.8%</span>
            </div>
            <div class="w-full bg-[var(--color-background)] h-2 rounded overflow-hidden border border-[var(--color-border)]">
              <div class="bg-amber-500 h-full rounded" style="width: 12.8%"></div>
            </div>
          </div>

        </div>

        <div class="pt-4 border-t border-[var(--color-border)] text-[11px] leading-relaxed text-[var(--color-text-secondary)] font-sans">
          * Les chiffres reflètent les contrats intelligents finalisés et sécurisés par séquestre sur la plateforme.
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { useTheme } from '@/composables/useTheme.js';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ClipboardDocumentCheckIcon,
  BanknotesIcon,
  PresentationChartLineIcon,
  FunnelIcon
} from '@heroicons/vue/24/outline';

const { isLightTheme } = useTheme();

const chartSeries = ref([
  {
    name: 'Flux GMV Total',
    data: [12000000, 19000000, 15000000, 24000000, 31000000, 37000000, 48000000]
  },
  {
    name: 'Règlements Séquestres',
    data: [8000000, 12000000, 14000000, 19000000, 22000000, 29000000, 38000000]
  }
]);

const chartOptions = computed(() => {
  const isLight = isLightTheme.value;
  return {
    chart: {
      type: 'area',
      toolbar: { show: false },
      sparkline: { enabled: false },
      background: 'transparent'
    },
    colors: ['#6366f1', '#14b8a6'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.05,
        stops: [0, 90, 100]
      }
    },
    grid: {
      borderColor: isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.06)',
      strokeDashArray: 4
    },
    xaxis: {
      categories: ['Déc', 'Janv', 'Févr', 'Mars', 'Avril', 'Mai', 'Juin'],
      labels: {
        style: { colors: isLight ? '#475569' : '#8a8780', fontSize: '12px', fontFamily: 'monospace' }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return (value / 1000000) + 'M XAF';
        },
        style: { colors: isLight ? '#475569' : '#8a8780', fontSize: '12px', fontFamily: 'monospace' }
      }
    },
    theme: { mode: isLight ? 'light' : 'dark' },
    tooltip: {
      theme: isLight ? 'light' : 'dark',
      x: { show: true },
      marker: { show: true }
    }
  };
});
</script>
