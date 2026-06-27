<template>
  <div class="space-y-6">
    <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div>
        <h1 class="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <PresentationChartLineIcon class="h-6 w-6 text-indigo-400" />
          <span>B2B Volume &amp; Demand Sales Analytics</span>
        </h1>
        <p class="text-xs text-slate-400 mt-1">Granular inspection of B2B fulfillments dispatch values and regional distributions.</p>
      </div>

      <!-- Time frame simulator -->
      <div class="flex items-center space-x-1 border border-slate-800 bg-slate-950 p-1 rounded-lg">
        <button 
          v-for="timeframe in ['30D', '90D', 'YTD']" 
          :key="timeframe"
          @click="activeTimeframe = timeframe"
          class="px-2.5 py-1 text-[10px] font-mono font-bold rounded uppercase transition"
          :class="activeTimeframe === timeframe ? 'bg-indigo-950 text-indigo-300 border border-indigo-900' : 'text-slate-500 hover:text-white'"
        >
          {{ timeframe }}
        </button>
      </div>
    </div>

    <!-- MAIN GRID METRICS -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
      
      <!-- SALES CHANNELS ANALYSIS -->
      <div class="lg:col-span-2 p-5 bg-[#080d22] border border-slate-900 rounded-2xl space-y-4">
        <h3 class="text-xs font-mono font-bold uppercase text-slate-200 tracking-wider">Historical B2B distribution stream</h3>
        
        <!-- Live Interactive ApexChart Component -->
        <div class="bg-slate-950 rounded-xl border border-slate-900 p-4">
          <apexchart 
            type="area" 
            height="260" 
            :options="chartOptions" 
            :series="chartSeries"
          ></apexchart>
        </div>

        <div class="grid grid-cols-3 gap-4 text-center">
          <div class="p-3 bg-slate-950 border border-slate-900 rounded-xl hover:border-indigo-900 transition duration-300">
            <span class="text-[9px] text-slate-500 uppercase font-mono">B2B Units Delivered</span>
            <p class="text-lg font-bold font-mono text-slate-200 mt-0.5">14,850 u</p>
          </div>
          <div class="p-3 bg-slate-950 border border-slate-900 rounded-xl hover:border-indigo-900 transition duration-300">
            <span class="text-[9px] text-slate-500 uppercase font-mono">Average item price</span>
            <p class="text-lg font-bold font-mono text-slate-200 mt-0.5">18,500 FCFA</p>
          </div>
          <div class="p-3 bg-slate-950 border border-slate-900 rounded-xl hover:border-indigo-900 transition duration-300">
            <span class="text-[9px] text-slate-500 uppercase font-mono">Repeat Order Rate</span>
            <p class="text-lg font-bold font-mono text-slate-200 mt-0.5">92.4%</p>
          </div>
        </div>
      </div>

      <!-- PORTFOLIO PRODUCT PIE VALUES REPRESENTATION -->
      <div class="p-5 bg-[#080d22] border border-slate-900 rounded-2xl space-y-4">
        <h3 class="text-xs font-mono font-bold uppercase text-slate-200 tracking-wider">Volume allocation by segment</h3>
        
        <div class="space-y-4 font-mono">
          <!-- Item 1 -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs">
              <span class="text-slate-300">Fertilizers &amp; Inbound Agri (Engrais)</span>
              <span class="text-slate-100 font-bold">45.0%</span>
            </div>
            <div class="w-full bg-slate-950 h-2 rounded overflow-hidden">
              <div class="bg-[#c084fc] h-full rounded" style="width: 45.0%"></div>
            </div>
          </div>

          <!-- Item 2 -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs">
              <span class="text-slate-300">Solar pumps &amp; MPPT Systems</span>
              <span class="text-slate-100 font-bold">32.2%</span>
            </div>
            <div class="w-full bg-slate-950 h-2 rounded overflow-hidden">
              <div class="bg-[#22d3ee] h-full rounded" style="width: 32.2%"></div>
            </div>
          </div>

          <!-- Item 3 -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs">
              <span class="text-slate-300">Raw raw cacao bulk packaging</span>
              <span class="text-slate-100 font-bold">14.8%</span>
            </div>
            <div class="w-full bg-slate-950 h-2 rounded overflow-hidden">
              <div class="bg-[#34d399] h-full rounded" style="width: 14.8%"></div>
            </div>
          </div>

          <!-- Item 4 -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs">
              <span class="text-slate-300">Traditional Textiles fibers</span>
              <span class="text-slate-100 font-bold">8.0%</span>
            </div>
            <div class="w-full bg-slate-950 h-2 rounded overflow-hidden">
              <div class="bg-[#fb7185] h-full rounded" style="width: 8%"></div>
            </div>
          </div>
        </div>

        <p class="text-[10.5px] text-slate-500 font-sans leading-relaxed">
          Product segments are dynamically synced with active catalog tags in the Stancl multi-tenant taxonomy database.
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { PresentationChartLineIcon } from '@heroicons/vue/24/outline';
import VueApexCharts from 'vue3-apexcharts';

// Register local component name mapping
const apexchart = VueApexCharts;

const activeTimeframe = ref('30D');

const chartSeries = computed(() => {
  if (activeTimeframe.value === '30D') {
    return [{
      name: 'Deliveries Volume (Tons)',
      data: [12, 19, 15, 25, 22, 30, 28, 35, 42, 38, 45, 52]
    }];
  } else if (activeTimeframe.value === '90D') {
    return [{
      name: 'Deliveries Volume (Tons)',
      data: [35, 42, 50, 48, 60, 58, 65, 72, 80, 78, 85, 98]
    }];
  } else {
    return [{
      name: 'Deliveries Volume (Tons)',
      data: [110, 125, 140, 135, 160, 155, 172, 190, 205, 198, 220, 245]
    }];
  }
});

const chartOptions = computed(() => ({
  chart: {
    type: 'area',
    background: 'transparent',
    foreColor: '#94a3b8',
    toolbar: { show: false },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
      animateGradually: { enabled: true, delay: 150 },
      dynamicAnimation: { enabled: true, speed: 350 }
    }
  },
  colors: ['#6366f1'],
  stroke: { curve: 'smooth', width: 3 },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.45,
      opacityTo: 0.05,
      stops: [0, 95, 100]
    }
  },
  dataLabels: { enabled: false },
  grid: { borderColor: '#1e293b', strokeDashArray: 4 },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: {
      formatter: (val) => `${val} T`
    }
  },
  tooltip: {
    theme: 'dark',
    x: { show: true },
    y: {
      formatter: (val) => `${val} Metric Tons Sourced`
    }
  }
}));
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}
</style>
