<template>
  <div class="space-y-6">
    <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
      <h1 class="text-xl font-bold text-slate-100">B2B Corporate Key Performance Indicators (KPIs)</h1>
      <p class="text-xs text-slate-400 mt-1">Real-time service levels, pipeline compliance, and multi-tenant fulfillment metrics.</p>
    </div>

    <!-- PRIMARY METRIC STATS -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- FULFILLMENT RATE -->
      <div class="p-5 bg-[#090e24] border border-slate-800 rounded-xl space-y-3">
        <div class="flex justify-between items-center">
          <span class="text-xs font-mono uppercase tracking-wider text-slate-400">Order Service Level Agreement</span>
          <span class="text-xs text-emerald-400 font-bold">✓ EXCELLENT</span>
        </div>
        <div class="flex items-baseline space-x-2">
          <span class="text-4xl font-extrabold text-slate-100 font-mono">98.4%</span>
          <span class="text-[10px] text-emerald-400 font-mono">(SLA threshold: 95.0%)</span>
        </div>
        <!-- Simulated progress meter -->
        <div class="w-full bg-slate-950 h-2 rounded overflow-hidden">
          <div class="bg-emerald-500 h-full rounded" style="width: 98.4%"></div>
        </div>
        <p class="text-[10.5px] text-slate-460 leading-normal">
          Reflects client orders successfully prepared and scheduled within the 48-hour SLA deadline.
        </p>
      </div>

      <!-- AVG PROCESSING TIME -->
      <div class="p-5 bg-[#090e24] border border-slate-800 rounded-xl space-y-3">
        <div class="flex justify-between items-center">
          <span class="text-xs font-mono uppercase tracking-wider text-slate-400">Avg เตรียม Fulfill / Prep Time</span>
          <span class="text-xs text-indigo-400 font-bold">OPTIMIZED</span>
        </div>
        <div class="flex items-baseline space-x-2">
          <span class="text-4xl font-extrabold text-slate-100 font-mono">14.2h</span>
          <span class="text-[10px] text-indigo-400 font-mono">(-3h from target)</span>
        </div>
        <div class="w-full bg-slate-950 h-2 rounded overflow-hidden">
          <div class="bg-indigo-500 h-full rounded" style="width: 78%"></div>
        </div>
        <p class="text-[10.5px] text-slate-460 leading-normal">
          The elapsed time from inbound "bon de commande" notification to courier cargo manifest dispatch.
        </p>
      </div>

      <!-- LOSS AND DEFECT RATIO -->
      <div class="p-5 bg-[#090e24] border border-slate-800 rounded-xl space-y-3">
        <div class="flex justify-between items-center">
          <span class="text-xs font-mono uppercase tracking-wider text-slate-400">Friction & Defect Rate</span>
          <span class="text-xs text-sky-400 font-bold">✓ SECURE</span>
        </div>
        <div class="flex items-baseline space-x-2">
          <span class="text-4xl font-extrabold text-slate-100 font-mono">0.18%</span>
          <span class="text-[10px] text-sky-400 font-mono">(System limit: 1.5%)</span>
        </div>
        <div class="w-full bg-slate-950 h-2 rounded overflow-hidden">
          <div class="bg-sky-500 h-full rounded" style="width: 12%"></div>
        </div>
        <p class="text-[10.5px] text-slate-460 leading-normal">
          Return logistics frequency based on damaged packaging, expired batches, or wrong cargo allocation.
        </p>
      </div>

    </div>

    <!-- DETAIL CHARTS AND KPI COMPARISONS -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- INBOUND CHANNELS SATISFACTION (DEMANDS VS CAPACITIES) -->
      <div class="p-5 bg-[#080d22] border border-slate-900 rounded-xl space-y-4">
        <h3 class="text-xs font-mono font-bold uppercase text-slate-200 tracking-wider">Fulfillment satisfaction by channel type</h3>
        
        <div class="space-y-4 font-mono text-xs">
          <!-- Item 1 -->
          <div>
            <div class="flex justify-between text-[11px] mb-1">
              <span>Bons de commande (Orders)</span>
              <span class="text-emerald-400 font-bold">148/150 Resolved</span>
            </div>
            <div class="w-full h-3 bg-slate-950 rounded relative overflow-hidden">
              <div class="h-full bg-emerald-500 rounded" style="width: 98.6%"></div>
            </div>
          </div>

          <!-- Item 2 -->
          <div>
            <div class="flex justify-between text-[11px] mb-1">
              <span>RFQs Concluded (Proposals mapped)</span>
              <span class="text-indigo-400 font-bold">42/45 Evaluated</span>
            </div>
            <div class="w-full h-3 bg-slate-950 rounded relative overflow-hidden">
              <div class="h-full bg-indigo-500 rounded" style="width: 93.3%"></div>
            </div>
          </div>

          <!-- Item 3 -->
          <div>
            <div class="flex justify-between text-[11px] mb-1">
              <span>Demandes de stock (Internal FIFO restock)</span>
              <span class="text-amber-400 font-bold">19/20 Transferred</span>
            </div>
            <div class="w-full h-3 bg-slate-950 rounded relative overflow-hidden">
              <div class="h-full bg-amber-500 rounded" style="width: 95%"></div>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-900 text-[11px] text-slate-500 font-sans">
          KPI scores are calculated automatically in 30-day moving windows based on micro-batch extractions.
        </div>
      </div>

      <!-- COMPLIANCE AUDITING -->
      <div class="p-5 bg-[#080d22] border border-slate-900 rounded-xl space-y-4">
        <h3 class="text-xs font-mono font-bold uppercase text-slate-200 tracking-wider">Compliance clearances</h3>
        
        <div class="space-y-3.5">
          <div class="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-900 rounded-lg">
            <span class="text-xs font-mono">Stancl Tenancy Database Sandboxing:</span>
            <span class="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded uppercase border border-emerald-900/40">✓ ABSOLUTE</span>
          </div>

          <div class="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-900 rounded-lg">
            <span class="text-xs font-mono">KYC Fiscal Dossier Audit State:</span>
            <span class="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded uppercase border border-emerald-900/40">✓ REGULATOR SIGNED</span>
          </div>

          <div class="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-900 rounded-lg">
            <span class="text-xs font-mono">Two-Factor Authentication (2FA) enforcement:</span>
            <span class="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded uppercase border border-amber-900/40">⚡ ACTIVE</span>
          </div>
        </div>

        <p class="text-[11px] text-slate-450 leading-relaxed">
          Your credentials conform to the secure Central Holding Group network standard. Any deviation in SLA is automatically logged to the platform supervisor logs.
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
</script>
