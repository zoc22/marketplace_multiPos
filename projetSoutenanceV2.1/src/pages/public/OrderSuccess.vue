<template>
  <div class="max-w-md mx-auto px-6 py-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
    <div class="inline-flex items-center justify-center h-12 w-12 rounded-full bg-emerald-950 text-emerald-400 mb-4">
      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h1 class="text-lg font-bold text-white">Transaction Verified</h1>
    <p class="text-xs text-slate-400 mt-2">Order registered successfully in FIFO logs.</p>
    <router-link to="/products" class="mt-6 inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold">Done</router-link>
  </div>
</template>

<script setup>
</script>
