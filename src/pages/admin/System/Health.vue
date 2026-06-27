<template>
  <div class="space-y-6">

    <!-- HEADER BLOCK -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-905 pb-5 shrink-0">
      <div>
        <h1 class="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
          <HeartIcon class="w-5 h-5 text-indigo-400" />
          <span>Node Cluster Hardware Health & Status Monitors</span>
        </h1>
        <p class="text-xs text-slate-400">Perform real-time cluster telemetry diagnostics, check server latency, and monitor docker container node health.</p>
      </div>
      
      <span class="px-2.5 py-0.5 bg-emerald-950 text-emerald-400 font-mono text-[9px] uppercase font-bold border border-emerald-900 rounded-md">
        GLOBAL ENGINE HEALTH Score: 98%
      </span>
    </div>

    <!-- SYSTEM ALERTS / STATUS METRICS -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <!-- Status Card 1 -->
      <div class="p-5 bg-[#14141E] border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4">
        <div class="flex justify-between items-start">
          <span class="text-[10px] font-mono text-slate-400 uppercase font-bold">Uptime Registry</span>
          <span class="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
        <div>
          <span class="text-2xl font-bold font-mono text-slate-100 block">99.98%</span>
          <p class="text-[10px] text-slate-500 mt-1 font-mono">Last 30 operational days</p>
        </div>
      </div>

      <!-- Status Card 2 -->
      <div class="p-5 bg-[#14141E] border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4">
        <div class="flex justify-between items-start">
          <span class="text-[10px] font-mono text-slate-400 uppercase font-bold">Queue Depth</span>
          <span class="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse"></span>
        </div>
        <div>
          <span class="text-2xl font-bold font-mono text-slate-100 block">12 pending</span>
          <p class="text-[10px] text-slate-500 mt-1 font-mono">Outbound email/webhook queue</p>
        </div>
      </div>

      <!-- Status Card 3 -->
      <div class="p-5 bg-[#14141E] border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4">
        <div class="flex justify-between items-start">
          <span class="text-[10px] font-mono text-slate-400 uppercase font-bold">Backup Status</span>
          <span class="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
        <div>
          <span class="text-2xl font-bold font-mono text-slate-100 block">Nominal</span>
          <p class="text-[10px] text-slate-500 mt-1 font-mono">Last snapshot 2h ago</p>
        </div>
      </div>

      <!-- Status Card 4 -->
      <div class="p-5 bg-[#14141E] border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4">
        <div class="flex justify-between items-start">
          <span class="text-[10px] font-mono text-slate-400 uppercase font-bold">Active Sockets</span>
          <span class="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
        </div>
        <div>
          <span class="text-2xl font-bold font-mono text-slate-100 block">402 live</span>
          <p class="text-[10px] text-slate-500 mt-1 font-mono">WebSocket connections open</p>
        </div>
      </div>

    </div>

    <!-- METRICS GRID -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
      <div class="p-4 bg-[#14141E] rounded-xl border border-slate-800 flex flex-col justify-between">
        <span class="text-slate-500 uppercase">Database Server</span>
        <span class="text-sm font-bold text-slate-200 mt-2 block">PostgreSQL SLA: 99.9%</span>
        <span class="text-emerald-450 text-[10px] mt-1 block flex items-center space-x-1">
          <span class="h-1.5 w-1.5 bg-emerald-500 rounded-full"></span>
          <span>Connected (3ms)</span>
        </span>
      </div>
      <div class="p-4 bg-[#14141E] rounded-xl border border-slate-800 flex flex-col justify-between">
        <span class="text-slate-505 uppercase">Central App Host</span>
        <span class="text-sm font-bold text-slate-200 mt-2 block">CPU workload: 12.1%</span>
        <span class="text-emerald-450 text-[10px] mt-1 block flex items-center space-x-1">
          <span class="h-1.5 w-1.5 bg-emerald-500 rounded-full"></span>
          <span>Balanced (2 nodes)</span>
        </span>
      </div>
      <div class="p-4 bg-[#14141E] rounded-xl border border-slate-800 flex flex-col justify-between">
        <span class="text-slate-505 uppercase">Orange & MTN Sockets</span>
        <span class="text-sm font-bold text-slate-200 mt-2 block">Webhooks active</span>
        <span class="text-emerald-450 text-[10px] mt-1 block flex items-center space-x-1">
          <span class="h-1.5 w-1.5 bg-emerald-500 rounded-full"></span>
          <span>listening Live</span>
        </span>
      </div>
      <div class="p-4 bg-[#14141E] rounded-xl border border-slate-800 flex flex-col justify-between">
        <span class="text-slate-505 uppercase">PDF Generation Engine</span>
        <span class="text-sm font-bold text-slate-200 mt-2 block">Wasm Worker Node</span>
        <span class="text-emerald-450 text-[10px] mt-1 block flex items-center space-x-1">
          <span class="h-1.5 w-1.5 bg-emerald-500 rounded-full"></span>
          <span>Idle (nominal)</span>
        </span>
      </div>
    </div>

    <!-- SCHEMATIC GRAPH -->
    <div class="p-6 bg-[#14141E] border border-slate-800 rounded-2xl space-y-4">
      <h2 class="text-sm font-bold font-mono text-slate-200 uppercase">Logical Node Topology and Ping Matrix</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        <div class="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
          <span class="text-indigo-400 font-bold flex items-center space-x-1">
            <span class="h-1.5 w-1.5 bg-indigo-405 rounded-full"></span>
            <span>Node A - Douala Center Host</span>
          </span>
          <p class="text-slate-400 text-[11px]">Primary router handle. Routes Orange Money transactions & caches B2B price lists.</p>
          <span class="text-emerald-500 block text-[10px]">Ping: 8ms SLA</span>
        </div>
        <div class="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
          <span class="text-indigo-400 font-bold flex items-center space-x-1">
            <span class="h-1.5 w-1.5 bg-indigo-405 rounded-full"></span>
            <span>Node B - Yaounde backup Host</span>
          </span>
          <p class="text-slate-400 text-[11px]">Symmetric state mirror. Activates standby mode instantly if Node A fails.</p>
          <span class="text-emerald-500 block text-[10px]">Standby standby SLA</span>
        </div>
        <div class="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
          <span class="text-indigo-400 font-bold flex items-center space-x-1">
            <span class="h-1.5 w-1.5 bg-indigo-405 rounded-full"></span>
            <span>Worker Node C - Document renderer</span>
          </span>
          <p class="text-slate-400 text-[11px]">Standalone microservice processing waybill PDF reports and transactional ticket print streams.</p>
          <span class="text-emerald-500 block text-[10px]">Ping: 12ms SLA</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { HeartIcon } from '@heroicons/vue/24/outline';
</script>
