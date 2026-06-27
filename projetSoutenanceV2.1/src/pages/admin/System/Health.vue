<template>
  <div class="space-y-6">

    <!-- HEADER BLOCK -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5 shrink-0">
      <div>
        <h1 class="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
          Node Cluster Hardware Health & Status Monitors
        </h1>
        <p class="text-xs text-slate-400">Perform real-time cluster telemetry diagnostics, check server latency, and monitor docker container node health.</p>
      </div>
      
      <span class="px-2.5 py-0.5 bg-emerald-950 text-emerald-400 font-mono text-[9px] uppercase font-bold border border-emerald-900 rounded-md">
        GLOBAL ENGINE HEALTH Score: 98%
      </span>
    </div>

    <!-- METRICS GRID -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
      <div class="p-4 bg-slate-905 bg-[#090f23] rounded-xl border border-[#121c3b] flex flex-col justify-between">
        <span class="text-slate-500 uppercase">Database Server</span>
        <span class="text-sm font-bold text-slate-200 mt-2 block">PostgreSQL SLA: 99.9%</span>
        <span class="text-emerald-400 text-[10px] mt-1 block">● Connected (3ms)</span>
      </div>
      <div class="p-4 bg-slate-905 bg-[#090f23] rounded-xl border border-[#121c3b] flex flex-col justify-between">
        <span class="text-slate-500 uppercase">Central App Host</span>
        <span class="text-sm font-bold text-slate-200 mt-2 block">CPU workload: 12.1%</span>
        <span class="text-emerald-400 text-[10px] mt-1 block">● Balanced (2 nodes)</span>
      </div>
      <div class="p-4 bg-slate-905 bg-[#090f23] rounded-xl border border-[#121c3b] flex flex-col justify-between">
        <span class="text-slate-500 uppercase">Orange & MTN Sockets</span>
        <span class="text-sm font-bold text-slate-200 mt-2 block">Webhooks active</span>
        <span class="text-emerald-400 text-[10px] mt-1 block">● listening Live</span>
      </div>
      <div class="p-4 bg-slate-905 bg-[#090f23] rounded-xl border border-[#121c3b] flex flex-col justify-between">
        <span class="text-slate-500 uppercase">PDF Generation Engine</span>
        <span class="text-sm font-bold text-slate-200 mt-2 block">Wasm Worker Node</span>
        <span class="text-emerald-400 text-[10px] mt-1 block">● Idle (nominal)</span>
      </div>
    </div>

    <!-- SCHEMATIC GRAPH -->
    <div class="p-6 bg-[#040817] border border-[#121c3b] rounded-2xl space-y-4">
      <h2 class="text-sm font-bold font-mono text-slate-200 uppercase">Logical Node Topology and Ping Matrix</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        <div class="p-3 bg-slate-950 border border-slate-900 rounded-xl space-y-2">
          <span class="text-indigo-400 font-bold">&bull; Node A - Douala Center Host</span>
          <p class="text-slate-400 text-[11px]">Primary router handle. Routes Orange Money transactions & caches B2B price lists.</p>
          <span class="text-emerald-500 block text-[10px]">Ping: 8ms SLA</span>
        </div>
        <div class="p-3 bg-slate-950 border border-slate-900 rounded-xl space-y-2">
          <span class="text-indigo-400 font-bold">&bull; Node B - Yaounde backup Host</span>
          <p class="text-slate-400 text-[11px]">Symmetric state mirror. Activates standby mode instantly if Node A fails.</p>
          <span class="text-emerald-500 block text-[10px]">Standby standby SLA</span>
        </div>
        <div class="p-3 bg-slate-950 border border-slate-900 rounded-xl space-y-2">
          <span class="text-indigo-400 font-bold">&bull; Worker Node C - Document renderer</span>
          <p class="text-slate-400 text-[11px]">Standalone microservice processing waybill PDF reports and transactional ticket print streams.</p>
          <span class="text-emerald-500 block text-[10px]">Ping: 12ms SLA</span>
        </div>
      </div>
    </div>

  </div>
</template>
