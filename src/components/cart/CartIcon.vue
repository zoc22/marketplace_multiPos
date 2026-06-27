<template>
  <router-link 
    to="/cart"
    class="p-3 px-4 rounded-none bg-emerald-950/30 hover:bg-emerald-950/60 text-emerald-400 border border-emerald-900/40 hover:border-emerald-600 transition relative flex items-center space-x-2 font-mono"
    title="Multi-Seller Basket"
    aria-label="View shopping basket"
  >
    <ShoppingCartIcon class="h-6 w-6" aria-hidden="true" />
    <span class="text-sm font-bold hidden sm:inline">{{ formatCFA(totalAmount) }}</span>
    <span class="bg-emerald-500 text-[#1A1A1A] text-xs font-extrabold px-2 py-0.5 rounded-full font-mono shrink-0">
      {{ count }}
    </span>
  </router-link>
</template>

<script setup>
import { ShoppingCartIcon } from '@heroicons/vue/24/outline';

defineProps({
  count: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 }
});

function formatCFA(val) {
  if (val === undefined || val === null) return '0 CFA';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('FCFA', 'CFA').replace('XAF', 'CFA');
}
</script>
