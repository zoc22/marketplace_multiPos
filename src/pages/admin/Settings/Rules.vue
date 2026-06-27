<template>
  <div class="space-y-6">
    <div class="p-6 bg-[#040817] border border-[#121c3b] rounded-2xl space-y-4">
      <h1 class="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono">B2B Platform Business Rules</h1>
      <p class="text-xs text-slate-400">Manage order thresholds, dispute periods, and escrow safety rules governing transaction pipelines.</p>

      <div class="space-y-2 text-xs font-mono">
        <div class="p-3 bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-between">
          <span>Standard Disputes Claim Window:</span>
          <span>15 calendar days</span>
        </div>
        <div class="p-3 bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-between">
          <span>Minimum Bulk Order Total XAF:</span>
          <span>500,000 XAF</span>
        </div>
        <div class="p-3 bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-between">
          <span>Automatic Dispute Escrow Lock:</span>
          <span>True (Enabled)</span>
        </div>
      </div>
    </div>
  </div>
</template>
