<template>
  <div v-show="isOpen" class="fixed inset-0 z-50 overflow-hidden select-none" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
    <div class="absolute inset-0 overflow-hidden">
      <!-- Backdrop overlay -->
      <div 
        @click="$emit('close')" 
        class="absolute inset-0 bg-white dark:bg-slate-950/80 backdrop-blur-sm transition-opacity" 
        aria-hidden="true"
      ></div>

      <!-- Drawer Panel Container -->
      <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div class="pointer-events-auto w-screen max-w-md">
          <div class="flex h-full flex-col bg-white dark:bg-slate-900 border-l border-slate-800 shadow-2xl">
            <!-- Header -->
            <div class="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
              <h2 class="text-base font-bold uppercase font-mono tracking-widest text-slate-100 flex items-center" id="drawer-title">
                <ShoppingCartIcon class="h-6 w-6 mr-2 text-emerald-455" aria-hidden="true" />
                Shopping Basket
              </h2>
              <button 
                @click="$emit('close')" 
                class="p-1 text-slate-400 hover:text-white"
                aria-label="Close cart drawer"
              >
                <XMarkIcon class="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <!-- Cart list -->
            <div class="flex-1 overflow-y-auto px-6 py-6 space-y-4 scrollbar-thin">
              <p v-if="items.length === 0" class="text-center py-12 text-slate-500 text-base font-mono">
                Your B2B crop basket is currently empty.
              </p>
              
              <div 
                v-for="item in items" 
                :key="item.id"
                class="flex items-center justify-between p-3.5 bg-white dark:bg-slate-950 border border-slate-850 hover:border-emerald-950 transition"
              >
                <div class="flex items-center space-x-3.5 truncate">
                  <img :src="item.image" class="h-12 w-12 object-cover" alt="" />
                  <div class="truncate text-sm">
                    <p class="font-semibold text-slate-200 truncate leading-tight">{{ item.name }}</p>
                    <p class="font-mono text-emerald-400 mt-1">{{ formatCFA(item.price) }} / {{ item.unit }}</p>
                  </div>
                </div>

                <div class="flex items-center space-x-3 shrink-0">
                  <span class="text-sm font-mono text-slate-400">Qty: {{ item.quantity }}</span>
                  <button 
                    @click="$emit('remove-item', item)"
                    class="text-red-500 hover:text-red-400 p-1 text-lg font-bold"
                    aria-label="Remove product from cart"
                  >
                    &times;
                  </button>
                </div>
              </div>
            </div>

            <!-- Footer summary & checkout -->
            <div class="border-t border-slate-800 bg-white dark:bg-slate-950 px-6 py-6 space-y-4">
              <div class="flex justify-between text-base">
                <span class="text-slate-400 font-mono">Total wholesale cost:</span>
                <span class="text-emerald-400 font-extrabold font-mono text-lg">{{ formatCFA(totalAmount) }}</span>
              </div>
              <p class="text-xs text-slate-500 font-mono">Sovereign Port Escrow clearing fees are calculated at checkout.</p>
              
              <div class="pt-2">
                <button 
                  @click="$emit('checkout')"
                  :disabled="items.length === 0"
                  class="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-450 hover:to-teal-555 text-[#1A1A1A] font-mono font-bold text-xs uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed transition flex justify-center items-center space-x-2"
                  aria-label="Proceed to secure escrow checkout portal"
                >
                  <span>Proceed to Escrow Checkout</span>
                  <ChevronRightIcon class="h-4.5 w-4.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  ShoppingCartIcon, 
  XMarkIcon, 
  ChevronRightIcon 
} from '@heroicons/vue/24/outline';

defineProps({
  isOpen: { type: Boolean, default: false },
  items: { type: Array, default: () => [] },
  totalAmount: { type: Number, default: 0 }
});

defineEmits(['close', 'remove-item', 'checkout']);

function formatCFA(val) {
  if (val === undefined || val === null) return '0 CFA';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('FCFA', 'CFA').replace('XAF', 'CFA');
}
</script>
