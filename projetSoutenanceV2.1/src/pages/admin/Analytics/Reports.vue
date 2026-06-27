<template>
  <div class="space-y-6">

    <!-- HEADER BLOCK -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5 shrink-0">
      <div>
        <h1 class="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
          Platform B2B Analytics & Reports
        </h1>
        <p class="text-xs text-slate-400">Review real-time transaction pipelines, track regional volumes, and monitor market sector indicators.</p>
      </div>

      <div class="flex items-center gap-2 font-mono text-xs">
        <select v-model="selectedQuarter" class="bg-slate-950 text-slate-400 rounded-lg p-2 border border-slate-800 outline-none">
          <option value="q1">Q1 Jan - Mar (Active)</option>
          <option value="q2">Q2 Apr - Jun</option>
        </select>
      </div>
    </div>

    <!-- MAIN BENTO METRIC SECTOR -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- Chart column 1: SVG Revenue Trends -->
      <div class="md:col-span-2 p-6 bg-[#040817] border border-[#121c3b] rounded-2xl space-y-4">
        <h2 class="text-xs font-bold font-mono uppercase text-slate-200 tracking-wider">Inflows vs. Outflows volume (Millions XAF)</h2>
        
        <!-- CUSTOM PREMIUM CSS/SVG CHART -->
        <div class="h-64 relative bg-slate-950/40 p-4 border border-slate-900 rounded-xl flex items-end justify-between font-mono text-[10px]">
          
          <!-- grid line helper markers -->
          <div class="absolute inset-0 p-4 flex flex-col justify-between opacity-5 select-none pointer-events-none">
            <div class="border-b border-slate-500 w-full"></div>
            <div class="border-b border-slate-500 w-full"></div>
            <div class="border-b border-slate-500 w-full"></div>
            <div class="border-b border-slate-500 w-full"></div>
          </div>

          <div class="w-12 text-center space-y-2">
            <div class="relative bg-indigo-600 rounded-t h-40 mx-auto" style="width: 14px">
              <span class="absolute -top-6 left-1/2 -translate-x-1/2 text-slate-350">140M</span>
            </div>
            <div class="text-slate-550 border-t border-slate-850/65 pt-1.5 leading-none">Jan</div>
          </div>

          <div class="w-12 text-center space-y-2">
            <div class="relative bg-indigo-600 rounded-t h-48 mx-auto" style="width: 14px">
              <span class="absolute -top-6 left-1/2 -translate-x-1/2 text-slate-350">188M</span>
            </div>
            <div class="text-slate-550 border-t border-slate-850/65 pt-1.5 leading-none">Feb</div>
          </div>

          <div class="w-12 text-center space-y-2">
            <div class="relative bg-indigo-600 rounded-t h-56 mx-auto" style="width: 14px">
              <span class="absolute -top-6 left-1/2 -translate-x-1/2 text-slate-350">210M</span>
            </div>
            <div class="text-slate-550 border-t border-slate-850/65 pt-1.5 leading-none">Mar</div>
          </div>

          <div class="w-12 text-center space-y-2">
            <div class="relative bg-indigo-500/20 rounded-t h-32 mx-auto border border-dashed border-indigo-900" style="width: 14px">
              <span class="absolute -top-6 left-1/2 -translate-x-1/2 text-slate-500">110M</span>
            </div>
            <div class="text-slate-600 border-t border-slate-850/65 pt-1.5 leading-none">Apr</div>
          </div>

        </div>
      </div>

      <!-- Column 2: Regional sector volumes distribution -->
      <div class="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <h2 class="text-xs font-bold font-mono uppercase text-slate-200 tracking-wider">Sector Shares Distribution</h2>
        
        <div class="space-y-4 text-xs font-mono">
          <div class="space-y-1">
            <div class="flex items-center justify-between text-slate-400">
              <span>Cacao & Crops</span>
              <span class="text-slate-200">52%</span>
            </div>
            <div class="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
              <div class="bg-indigo-600 h-full rounded-full" style="width: 52%"></div>
            </div>
          </div>

          <div class="space-y-1">
            <div class="flex items-center justify-between text-slate-400">
              <span>Metals & BTP heavy bulk</span>
              <span class="text-slate-200">28%</span>
            </div>
            <div class="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
              <div class="bg-emerald-500 h-full rounded-full" style="width: 28%"></div>
            </div>
          </div>

          <div class="space-y-1">
            <div class="flex items-center justify-between text-slate-400">
              <span>Packaging & Ingredients</span>
              <span class="text-slate-200">20%</span>
            </div>
            <div class="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
              <div class="bg-teal-500 h-full rounded-full" style="width: 20%"></div>
            </div>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
const selectedQuarter = ref('q1');
</script>
