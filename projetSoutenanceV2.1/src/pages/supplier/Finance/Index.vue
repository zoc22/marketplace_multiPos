<template>
  <div class="space-y-6 max-w-md mx-auto text-center py-12">
    <div class="h-12 w-12 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 flex items-center justify-center font-bold text-xl mx-auto">
      🪙
    </div>
    <div class="space-y-2">
      <h2 class="text-base font-bold text-slate-100 uppercase tracking-widest font-mono">FINANCIAL TRANSIT PORTAL</h2>
      <p class="text-xs text-slate-400">
        You are being redirected to the withdrawals control terminal.
      </p>
    </div>
    <router-link 
      to="/supplier/finance/withdrawals"
      class="inline-block px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold rounded-xl shadow-lg transition uppercase animate-pulse"
    >
      Request Payout (Retraits)
    </router-link>
  </div>
</template>

<script setup>
</script>
