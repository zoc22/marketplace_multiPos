<template>
  <div class="app-container min-h-screen bg-light-bg-main dark:bg-slate-950 text-text-main dark:text-slate-100 flex flex-col overflow-hidden">
    <!-- Marketplace Header -->
    <header class="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <ShoppingCartIcon class="h-6 w-6 text-emerald-450" aria-hidden="true" />
        <span class="font-bold text-slate-100 tracking-wider text-base sm:text-lg">Enterprise B2B Marketplace</span>
      </div>
      
      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center space-x-6 text-base">
        <router-link to="/" class="font-mono uppercase tracking-wider text-slate-400 hover:text-white transition px-3 py-2">Home</router-link>
        <router-link to="/products" class="font-mono uppercase tracking-wider text-slate-400 hover:text-white transition px-3 py-2">Catalog</router-link>
        <router-link to="/suppliers" class="font-mono uppercase tracking-wider text-slate-400 hover:text-white transition px-3 py-2">Suppliers</router-link>
        <router-link to="/auth/login" class="font-mono uppercase tracking-wider text-slate-400 hover:text-white transition px-3 py-2">Login</router-link>
      </nav>

      <!-- Mobile/Tablet Toggle Button -->
      <button 
        @click="isMenuOpen = !isMenuOpen" 
        class="md:hidden p-2 text-slate-400 hover:text-white focus:outline-none"
        aria-label="Toggle navigation menu"
      >
        <Bars3Icon v-if="!isMenuOpen" class="h-6 w-6" aria-hidden="true" />
        <XMarkIcon v-else class="h-6 w-6" aria-hidden="true" />
      </button>
    </header>

    <!-- Mobile/Tablet Dropdown Menu -->
    <div 
      v-show="isMenuOpen" 
      class="md:hidden border-b border-slate-800 bg-slate-900/95 backdrop-blur-md px-6 py-4 space-y-3 z-30 transition-all duration-250 ease-in-out text-base font-mono"
    >
      <router-link to="/" class="block text-slate-400 hover:text-white transition py-2" @click="isMenuOpen = false">Home</router-link>
      <router-link to="/products" class="block text-slate-400 hover:text-white transition py-2" @click="isMenuOpen = false">Catalog</router-link>
      <router-link to="/suppliers" class="block text-slate-400 hover:text-white transition py-2" @click="isMenuOpen = false">Suppliers</router-link>
      <router-link to="/auth/login" class="block text-slate-400 hover:text-white transition py-2" @click="isMenuOpen = false">Login</router-link>
    </div>

    <!-- Main Dynamic Content -->
    <main class="page-container flex-1 overflow-y-auto">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-800 bg-slate-950 py-8 px-6 text-center text-sm text-slate-500">
      <p>&copy; 2026 Enterprise Core Platform. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ShoppingCartIcon, Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline';

const isMenuOpen = ref(false);
</script>

<style scoped>
@media (min-width: 1024px) {
  .app-container {
    height: 100vh;
    overflow: hidden;
  }
  .page-container {
    height: 100vh;
    overflow-y: auto;
    flex: 1;
  }
}

/* Page content scrollbar styling */
.page-container::-webkit-scrollbar {
  width: 6px;
}
.page-container::-webkit-scrollbar-track {
  background: transparent;
}
.page-container::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.15);
  border-radius: 0;
}
</style>
