<template>
  <div class="space-y-6">

    <!-- HEADER BLOCK -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5 shrink-0">
      <div>
        <h1 class="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
          System Task Queue & Message Broker
        </h1>
        <p class="text-xs text-slate-400">Monitor asynchronous broker queues managing buyer WhatsApp notifications, supplier SMS waybill delivery updates, and ledger audit saves.</p>
      </div>

      <span class="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg font-mono text-xs text-slate-350">
        Broker Load: <strong class="text-indigo-400">0.02%</strong>
      </span>
    </div>

    <!-- MAIN INTERFACES -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- TASK QUEUE CHRONO -->
      <div class="p-6 bg-[#040817] border border-[#121c3b] rounded-2xl space-y-4">
        <h2 class="text-xs font-bold font-mono uppercase text-slate-200 tracking-wider">Active Task Queues</h2>
        
        <div class="space-y-3 font-mono text-xs">
          <div class="p-3 bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-between">
            <div>
              <span class="text-indigo-450 block font-bold text-indigo-400">WhatsApp Notification Hub</span>
              <span class="text-[10px] text-slate-500">Waybill tracking dispatches</span>
            </div>
            <span class="text-emerald-400 font-bold">0 pending</span>
          </div>
          <div class="p-3 bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-between">
            <div>
              <span class="text-indigo-455 block font-bold text-indigo-400">Supplier GSM SMS Gateway</span>
              <span class="text-[10px] text-slate-500">Credit alert confirmations</span>
            </div>
            <span class="text-emerald-400 font-bold">0 pending</span>
          </div>
          <div class="p-3 bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-between">
            <div>
              <span class="text-indigo-450 block font-bold text-indigo-400">Financial Ledger Sync Block</span>
              <span class="text-[10px] text-slate-500">Database commit checkpoints</span>
            </div>
            <span class="text-emerald-400 font-bold">0 pending</span>
          </div>
        </div>
      </div>

      <!-- QUEUE DIAGNOSTIC STATS -->
      <div class="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <h2 class="text-xs font-bold font-mono uppercase text-slate-200 tracking-wider">Queue Diagnostic details</h2>
        
        <div class="space-y-2.5 text-xs font-mono text-slate-400">
          <div class="flex items-center justify-between">
            <span>Broker Software:</span>
            <span class="text-slate-200 font-bold">Redis Cluster SLA</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Synchronous Connection status:</span>
            <span class="text-emerald-400 font-bold">Healthy Connected</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Retries Limit Threshold:</span>
            <span class="text-slate-200">3 attempts</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Timeout Delay Limit:</span>
            <span class="text-slate-200">10,000 ms</span>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>
