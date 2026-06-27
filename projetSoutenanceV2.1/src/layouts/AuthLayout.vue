<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-6">
    <!-- Brand badge -->
    <div class="flex items-center space-x-3 mb-8">
      <svg class="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      <span class="font-bold text-slate-100 uppercase tracking-widest text-xs">Enterprise Secure Auth</span>
    </div>

    <!-- Live Auth Container Card -->
    <div class="w-full max-w-md bg-slate-900 border border-slate-900 rounded-2xl p-8 shadow-2xl">
      <router-view />
    </div>

    <p class="mt-8 text-xs text-slate-600 font-mono">
      Protected by standard multi-tenant secure layers
    </p>
  </div>
</template>

<script setup>
</script>
