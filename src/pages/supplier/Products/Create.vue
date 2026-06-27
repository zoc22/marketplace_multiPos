<template>
  <div class="space-y-6 max-w-md mx-auto text-center py-12">
    <div class="h-12 w-12 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 flex items-center justify-center font-bold text-xl mx-auto">
      <CubeIcon class="h-6 w-6 text-[#C8A96E]" aria-label="Catalog Package" />
    </div>
    <div class="space-y-2">
      <h2 class="text-base font-bold text-slate-100 uppercase tracking-widest font-mono">STAND-BY REDIRECTION</h2>
      <p class="text-xs text-slate-400">
        The supplier workspace implements high-fidelity popup-driven CRUD. Direct creating routes redirect safely to the centralized listings panel.
      </p>
    </div>
    <router-link 
      to="/supplier/products"
      class="inline-block px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold rounded-xl shadow-lg transition uppercase"
    >
      Open Catalog &amp; Summon creator Popup
    </router-link>
  </div>
</template>

<script setup>
import { CubeIcon } from '@heroicons/vue/24/outline';
</script>

