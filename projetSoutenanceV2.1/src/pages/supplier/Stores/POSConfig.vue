<template>
  <div class="space-y-6 max-w-md mx-auto text-center py-12">
    <div class="h-12 w-12 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-505 flex items-center justify-center font-bold text-xl mx-auto">
      ⚙️
    </div>
    <div class="space-y-2">
      <h2 class="text-base font-bold text-slate-100 uppercase tracking-widest font-mono">STAND-BY REDIRECTION</h2>
      <p class="text-xs text-slate-400 font-sans">
        All POS terminal configurations and stores settings are managed via popups inside the core listings deck.
      </p>
    </div>
    <router-link 
      to="/supplier/stores"
      class="inline-block px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold rounded-xl shadow-lg transition uppercase animate-pulse"
    >
      Return to Boutiques Management
    </router-link>
  </div>
</template>

<script setup>
</script>
