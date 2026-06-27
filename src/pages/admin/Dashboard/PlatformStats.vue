<template>
  <div class="space-y-6">
    
    <!-- Top HUD Banner -->
    <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-100 flex items-center space-x-2">
          <ChartBarIcon class="w-5 h-5 text-indigo-400" />
          <span>Consolidated Platform Turnovers</span>
        </h1>
        <p class="text-sm text-slate-400 mt-2">Multi-tenant merchant statistics, agricultural volume trades, and financial transaction commissions.</p>
      </div>

      <div class="text-sm font-mono text-indigo-400 p-2.5 bg-indigo-950/40 border border-indigo-900/40 rounded-xl">
        Monthly Active Tenants: <strong>24 Active Nodes</strong>
      </div>
    </div>

    <!-- METRICS OVERVIEW -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="bg-[#14141E] border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
        <div>
          <span class="text-sm font-medium text-slate-400 font-mono uppercase tracking-wider block">Aggregate GMV</span>
          <div class="text-3xl font-extrabold font-mono text-slate-100 mt-2">
            184,950,000 FCFA
          </div>
          <span class="text-xs text-emerald-450 font-mono mt-1 block">&uarr; +14.2% from last month</span>
        </div>
        <div class="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
          <ArrowTrendingUpIcon class="w-6 h-6" />
        </div>
      </div>

      <div class="bg-[#14141E] border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
        <div>
          <span class="text-sm font-medium text-slate-400 font-mono uppercase tracking-wider block">Cleared B2B Orders</span>
          <div class="text-3xl font-extrabold font-mono text-slate-100 mt-2">
            4,892 Completed
          </div>
          <span class="text-xs text-indigo-400 font-mono mt-1 block">&uarr; 99.8% Waybill verification</span>
        </div>
        <div class="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
          <ClipboardDocumentCheckIcon class="w-6 h-6" />
        </div>
      </div>

      <div class="bg-[#14141E] border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
        <div>
          <span class="text-sm font-medium text-slate-400 font-mono uppercase tracking-wider block">Average Deal Value</span>
          <div class="text-3xl font-extrabold font-mono text-slate-100 mt-2">
            37,800 FCFA
          </div>
          <span class="text-xs text-slate-500 font-mono mt-1 block">Bulk wholesale volumes</span>
        </div>
        <div class="p-3 bg-amber-500/10 rounded-xl text-amber-400">
          <BanknotesIcon class="w-6 h-6" />
        </div>
      </div>
    </div>

    <!-- MAIN GRAPHIC CARDS -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- LINE CHART AREA (2 COLS) -->
      <div class="lg:col-span-2 bg-[#14141E] border border-slate-800 p-6 rounded-2xl space-y-4">
        <h3 class="text-base uppercase font-mono tracking-wider text-slate-205 font-bold flex items-center space-x-1.5">
          <PresentationChartLineIcon class="w-4 h-4 text-indigo-400" />
          <span>Multi-Tenant Volume Progression (XAF)</span>
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

      <!-- SECTOR BREAKDOWN (1 COL) -->
      <div class="bg-[#14141E] border border-slate-800 p-6 rounded-2xl space-y-4">
        <h3 class="text-base uppercase font-mono tracking-wider text-slate-205 font-bold flex items-center space-x-1.5">
          <FunnelIcon class="w-4 h-4 text-indigo-400" />
          <span>Sector Market Share</span>
        </h3>

        <div class="space-y-4 pt-2">
          
          <div class="space-y-1 text-sm">
            <div class="flex justify-between text-slate-400 font-mono">
              <span class="font-semibold text-slate-200">Sovereign Agriculture</span>
              <span>62.4%</span>
            </div>
            <div class="w-full bg-slate-950 h-2 rounded overflow-hidden">
              <div class="bg-indigo-500 h-full rounded" style="width: 62.4%"></div>
            </div>
          </div>

          <div class="space-y-1 text-sm">
            <div class="flex justify-between text-slate-400 font-mono">
              <span class="font-semibold text-slate-202">BTP & Materials</span>
              <span>24.8%</span>
            </div>
            <div class="w-full bg-slate-950 h-2 rounded overflow-hidden">
              <div class="bg-teal-500 h-full rounded" style="width: 24.8%"></div>
            </div>
          </div>

          <div class="space-y-1 text-sm">
            <div class="flex justify-between text-slate-400 font-mono">
              <span class="font-semibold text-slate-202">Dry Ingredients & Cocoa</span>
              <span>12.8%</span>
            </div>
            <div class="w-full bg-slate-950 h-2 rounded overflow-hidden">
              <div class="bg-amber-500 h-full rounded" style="width: 12.8%"></div>
            </div>
          </div>

        </div>

        <div class="pt-4 border-t border-slate-850 text-sm leading-relaxed text-slate-500 font-mono">
          * Figures reflect completed smart contracts locked under platform escrow parameters.
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ClipboardDocumentCheckIcon,
  BanknotesIcon,
  PresentationChartLineIcon,
  FunnelIcon
} from '@heroicons/vue/24/outline';

const chartSeries = ref([
  {
    name: 'Total GMV Inflow',
    data: [12000000, 19000000, 15000000, 24000000, 31000000, 37000000, 48000000]
  },
  {
    name: 'Escrow Settlements',
    data: [8000000, 12000000, 14000000, 19000000, 22000000, 29000000, 38000000]
  }
]);

const chartOptions = ref({
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
    borderColor: 'rgba(255, 255, 255, 0.06)',
    strokeDashArray: 4
  },
  xaxis: {
    categories: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    labels: {
      style: { colors: '#8a8780', fontSize: '12px', fontFamily: 'monospace' }
    },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: {
      formatter: function (value) {
        return (value / 1000000) + 'M XAF';
      },
      style: { colors: '#8a8780', fontSize: '12px', fontFamily: 'monospace' }
    }
  },
  theme: { mode: 'dark' },
  tooltip: {
    theme: 'dark',
    x: { show: true },
    marker: { show: true }
  }
});
</script>

