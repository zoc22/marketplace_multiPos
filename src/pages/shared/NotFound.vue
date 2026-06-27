<template>
  <div class="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 text-center">
    <div class="h-12 w-12 bg-red-950 border border-red-900/30 text-red-500 rounded-full flex items-center justify-center mb-4">
      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <h1 class="text-xl font-mono font-bold text-white uppercase tracking-wider">Unrecognized Address Location</h1>
    <p class="text-xs text-slate-500 mt-2 font-mono">The specified resource path could not be resolved by security gates.</p>
    <router-link to="/" class="mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs uppercase tracking-wider font-semibold transition">
      Back to Home Control
    </router-link>
  </div>
</template>

<script setup>
</script>
