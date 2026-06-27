<template>
  <div class="space-y-6">
    <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div>
        <h1 class="text-xl font-bold text-slate-100">B2B Volume &amp; Demand Sales Analytics</h1>
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
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- SALES CHANNELS ANALYSIS -->
      <div class="lg:col-span-2 p-5 bg-[#080d22] border border-slate-900 rounded-xl space-y-4">
        <h3 class="text-xs font-mono font-bold uppercase text-slate-200 tracking-wider">Historical B2B distribution stream</h3>
        
        <!-- Simulate linear chart layout using responsive SVG shapes -->
        <div class="h-64 w-full bg-slate-950 rounded-xl border border-slate-900 p-4 flex flex-col justify-between relative overflow-hidden select-none">
          <div class="flex justify-between items-center text-[10px] text-slate-400 font-mono z-10 border-b border-slate-900 pb-1">
            <span>Chart: Cumulative Sourced Volumes (Metric Tons / Volumes)</span>
            <span class="text-emerald-400 font-bold">+18.2% versus last quarter</span>
          </div>
          
          <!-- Simple elegant vector line drawing -->
          <svg class="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 400 150" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#818cf8" stop-opacity="0.3"/>
                <stop offset="100%" stop-color="#000" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <path 
              d="M 0 120 Q 80 80, 160 100 T 320 40 T 400 20" 
              fill="none" 
              stroke="#6366f1" 
              stroke-width="3.5"
              stroke-linecap="round"
            />
            <path 
              d="M 0 120 Q 80 80, 160 100 T 320 40 T 400 20 L 400 150 L 0 150 Z" 
              fill="url(#chartGradient)"
            />
            
            <!-- Reference grids lines -->
            <line x1="0" y1="50" x2="400" y2="50" stroke="#1e293b" stroke-dasharray="4,4" />
            <line x1="0" y1="100" x2="400" y2="100" stroke="#1e293b" stroke-dasharray="4,4" />
          </svg>

          <!-- Datapoints HUD overlay -->
          <div class="flex justify-between items-end text-[10px] font-mono text-slate-450 z-10">
            <span>Douala Cargo Hub</span>
            <span>Yaoundé Rail depot</span>
            <span>Maroua Sourcing Base</span>
            <span class="text-indigo-400 font-bold">Kribi Port Terminal (Active)</span>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4 text-center">
          <div class="p-3 bg-slate-950 border border-slate-900 rounded-lg">
            <span class="text-[9px] text-slate-500 uppercase font-mono">B2B Units Delivered</span>
            <p class="text-lg font-bold font-mono text-slate-200 mt-0.5">14,850 u</p>
          </div>
          <div class="p-3 bg-slate-950 border border-slate-900 rounded-lg">
            <span class="text-[9px] text-slate-500 uppercase font-mono">Average item price</span>
            <p class="text-lg font-bold font-mono text-slate-200 mt-0.5">18,500 FCFA</p>
          </div>
          <div class="p-3 bg-slate-950 border border-slate-900 rounded-lg">
            <span class="text-[9px] text-slate-500 uppercase font-mono">Repeat Order Rate</span>
            <p class="text-lg font-bold font-mono text-slate-200 mt-0.5">92.4%</p>
          </div>
        </div>
      </div>

      <!-- PORTFOLIO PRODUCT PIE VALUES REPRESENTATION -->
      <div class="p-5 bg-[#080d22] border border-slate-900 rounded-xl space-y-4">
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
import { ref } from 'vue';
const activeTimeframe = ref('30D');
</script>
