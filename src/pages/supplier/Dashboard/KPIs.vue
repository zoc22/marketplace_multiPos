<template>
  <div class="space-y-6">
    <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
      <h1 class="text-2xl font-bold text-slate-100 flex items-center space-x-2">
        <ChartBarIcon class="h-6 w-6 text-indigo-400" />
        <span>B2B Corporate Key Performance Indicators (KPIs)</span>
      </h1>
      <p class="text-sm text-slate-400 mt-2">Real-time service levels, pipeline compliance, and multi-tenant fulfillment metrics.</p>
    </div>

    <!-- PRIMARY METRIC STATS -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- FULFILLMENT RATE -->
      <div class="p-5 bg-[#090e24] border border-slate-800 rounded-2xl relative overflow-hidden group hover:border-indigo-500/40 transition duration-305">
        <div class="flex justify-between items-start">
          <span class="text-sm font-mono uppercase tracking-wider text-slate-400 font-bold">Order Service Level Agreement</span>
          <span class="text-xs text-emerald-400 font-mono font-bold bg-emerald-950/40 border border-emerald-900/30 px-1.5 py-0.5 rounded">
            +1.4%
          </span>
        </div>
        <div class="mt-3 flex items-baseline space-x-2">
          <span class="text-3xl font-extrabold text-slate-100 font-mono">98.4%</span>
          <span class="text-xs text-emerald-400 font-mono">(SLA threshold: 95.0%)</span>
        </div>
        
        <!-- Simulated progress meter -->
        <div class="w-full bg-slate-950 h-2 rounded overflow-hidden mt-3">
          <div class="bg-emerald-500 h-full rounded" style="width: 98.4%"></div>
        </div>
        <p class="text-sm text-slate-400 leading-normal mt-3 font-sans">
          Reflects client orders successfully prepared and scheduled within the 48-hour SLA deadline.
        </p>
        <div class="absolute right-3 bottom-3 text-indigo-500/10 group-hover:scale-110 transition duration-300">
          <CheckCircleIcon class="h-10 w-10 text-emerald-500" />
        </div>
      </div>

      <!-- AVG PROCESSING TIME -->
      <div class="p-5 bg-[#090e24] border border-slate-800 rounded-2xl relative overflow-hidden group hover:border-indigo-500/40 transition duration-305">
        <div class="flex justify-between items-start">
          <span class="text-sm font-mono uppercase tracking-wider text-slate-400 font-bold">Avg Prep Time</span>
          <span class="text-xs text-emerald-450 font-mono font-bold bg-emerald-950/40 border border-emerald-900/30 px-1.5 py-0.5 rounded">
            -18% (Better)
          </span>
        </div>
        <div class="mt-3 flex items-baseline space-x-2">
          <span class="text-3xl font-extrabold text-slate-100 font-mono">14.2h</span>
          <span class="text-xs text-indigo-400 font-mono">(-3h from target)</span>
        </div>
        <div class="w-full bg-slate-950 h-2 rounded overflow-hidden mt-3">
          <div class="bg-indigo-500 h-full rounded" style="width: 78%"></div>
        </div>
        <p class="text-sm text-slate-400 leading-normal mt-3 font-sans">
          The elapsed time from inbound "bon de commande" notification to courier cargo manifest dispatch.
        </p>
        <div class="absolute right-3 bottom-3 text-indigo-500/10 group-hover:scale-110 transition duration-300">
          <ClockIcon class="h-10 w-10 text-indigo-455" />
        </div>
      </div>

      <!-- LOSS AND DEFECT RATIO -->
      <div class="p-5 bg-[#090e24] border border-slate-800 rounded-2xl relative overflow-hidden group hover:border-indigo-500/40 transition duration-305">
        <div class="flex justify-between items-start">
          <span class="text-sm font-mono uppercase tracking-wider text-slate-400 font-bold">Friction & Defect Rate</span>
          <span class="text-xs text-emerald-450 font-mono font-bold bg-emerald-950/40 border border-emerald-900/30 px-1.5 py-0.5 rounded">
            -0.05%
          </span>
        </div>
        <div class="mt-3 flex items-baseline space-x-2">
          <span class="text-3xl font-extrabold text-slate-100 font-mono">0.18%</span>
          <span class="text-xs text-sky-400 font-mono">(System limit: 1.5%)</span>
        </div>
        <div class="w-full bg-slate-950 h-2 rounded overflow-hidden mt-3">
          <div class="bg-sky-500 h-full rounded" style="width: 12%"></div>
        </div>
        <p class="text-sm text-slate-400 leading-normal mt-3 font-sans">
          Return logistics frequency based on damaged packaging, expired batches, or wrong cargo allocation.
        </p>
        <div class="absolute right-3 bottom-3 text-indigo-500/10 group-hover:scale-110 transition duration-300">
          <ShieldCheckIcon class="h-10 w-10 text-sky-500" />
        </div>
      </div>

    </div>

    <!-- DETAIL CHARTS AND KPI COMPARISONS -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- INBOUND CHANNELS SATISFACTION (DEMANDS VS CAPACITIES) -->
      <div class="p-5 bg-[#080d22] border border-slate-900 rounded-2xl space-y-4">
        <h3 class="text-sm font-mono font-bold uppercase text-slate-200 tracking-wider">Fulfillment satisfaction by channel type</h3>
        
        <div class="space-y-4 font-mono text-sm">
          <!-- Item 1 -->
          <div>
            <div class="flex justify-between text-xs mb-1">
              <span>Bons de commande (Orders)</span>
              <span class="text-emerald-400 font-bold">148/150 Resolved</span>
            </div>
            <div class="w-full h-3 bg-slate-950 rounded relative overflow-hidden">
              <div class="h-full bg-emerald-500 rounded" style="width: 98.6%"></div>
            </div>
          </div>

          <!-- Item 2 -->
          <div>
            <div class="flex justify-between text-xs mb-1">
              <span>RFQs Concluded (Proposals mapped)</span>
              <span class="text-indigo-400 font-bold">42/45 Evaluated</span>
            </div>
            <div class="w-full h-3 bg-slate-950 rounded relative overflow-hidden">
              <div class="h-full bg-indigo-500 rounded" style="width: 93.3%"></div>
            </div>
          </div>

          <!-- Item 3 -->
          <div>
            <div class="flex justify-between text-xs mb-1">
              <span>Demandes de stock (Internal FIFO restock)</span>
              <span class="text-amber-400 font-bold">19/20 Transferred</span>
            </div>
            <div class="w-full h-3 bg-slate-950 rounded relative overflow-hidden">
              <div class="h-full bg-amber-500 rounded" style="width: 95%"></div>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-900 text-sm text-slate-500 font-sans">
          KPI scores are calculated automatically in 30-day moving windows based on micro-batch extractions.
        </div>
      </div>

      <!-- COMPLIANCE AUDITING -->
      <div class="p-5 bg-[#080d22] border border-slate-900 rounded-2xl space-y-4">
        <h3 class="text-sm font-mono font-bold uppercase text-slate-200 tracking-wider">Compliance clearances</h3>
        
        <div class="space-y-3.5">
          <div class="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-900 rounded-lg hover:border-emerald-800 transition duration-305">
            <span class="text-sm font-mono">Stancl Tenancy Database Sandboxing:</span>
            <span class="text-xs font-mono font-bold text-emerald-404 bg-emerald-950/40 px-2 py-0.5 rounded uppercase border border-emerald-900/40">✓ ABSOLUTE</span>
          </div>

          <div class="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-900 rounded-lg hover:border-emerald-800 transition duration-305">
            <span class="text-sm font-mono">KYC Fiscal Dossier Audit State:</span>
            <span class="text-xs font-mono font-bold text-emerald-404 bg-emerald-950/40 px-2 py-0.5 rounded uppercase border border-emerald-900/40">✓ REGULATOR SIGNED</span>
          </div>

          <div class="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-900 rounded-lg hover:border-amber-800 transition duration-305">
            <span class="text-sm font-mono">Two-Factor Authentication (2FA) enforcement:</span>
            <span class="text-xs font-mono font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded uppercase border border-amber-900/40">⚡ ACTIVE</span>
          </div>
        </div>

        <p class="text-sm text-slate-400 leading-relaxed font-sans">
          Your credentials conform to the secure Central Holding Group network standard. Any deviation in SLA is automatically logged to the platform supervisor logs.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  ChartBarIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  ShieldCheckIcon 
} from '@heroicons/vue/24/outline';
</script>
