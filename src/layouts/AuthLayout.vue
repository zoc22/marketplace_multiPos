<template>
  <div class="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] flex flex-col justify-center items-center p-5 transition-colors duration-300">
    <!-- Brand badge -->
    <div class="flex items-center space-x-3 mb-8 animate-fade-in">
      <LockClosedIcon class="h-7 w-7 text-[#C8A96E]" aria-hidden="true" />
      <span class="font-bold uppercase tracking-widest text-base font-mono">Enterprise Secure Auth</span>
    </div>

    <!-- Live Auth Container Card -->
    <div class="w-full max-w-[480px] bg-[var(--color-surface)] border border-[var(--color-border)] p-5 md:p-8 shadow-[var(--shadow-elevated)] rounded-none transition-all duration-300">
      <router-view />
    </div>

    <p class="mt-8 text-sm text-[var(--color-text-tertiary)] font-mono tracking-wide">
      Protected by standard multi-tenant secure layers
    </p>
  </div>
</template>

<script setup>
import { LockClosedIcon } from '@heroicons/vue/24/outline';
</script>
