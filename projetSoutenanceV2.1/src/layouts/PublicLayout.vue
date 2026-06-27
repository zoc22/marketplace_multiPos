<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
    <!-- Marketplace Header -->
    <header class="border-b border-slate-900 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <svg class="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <span class="font-bold text-slate-100 tracking-wider">Enterprise B2B Marketplace</span>
      </div>
      <nav class="hidden md:flex items-center space-x-6">
        <router-link to="/" class="text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-white transition">Home</router-link>
        <router-link to="/products" class="text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-white transition">Catalog</router-link>
        <router-link to="/suppliers" class="text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-white transition">Suppliers</router-link>
        <router-link to="/auth/login" class="text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-white transition">Login</router-link>
      </nav>
    </header>

    <!-- Main Dynamic Content -->
    <main class="flex-1">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-900 bg-slate-950 py-6 px-6 text-center text-xs text-slate-600">
      <p>&copy; 2026 Enterprise Core Platform. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
// No business component imports as requested
</script>
