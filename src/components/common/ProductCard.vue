<template>
  <div 
    class="bg-white dark:bg-slate-900 border border-slate-800 rounded-none overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:border-emerald-600/30 transition-all duration-300 relative group flex flex-col justify-between"
    :id="'product_card_' + product.id"
  >
    <!-- Card Badge Overlay (Top indicators) -->
    <div class="absolute top-4 left-4 z-10 flex flex-col space-y-1">
      <span class="bg-white dark:bg-slate-950/90 backdrop-blur-md text-xs font-mono px-3 py-1 border border-slate-800 text-slate-300 font-bold uppercase">
        SKU: {{ product.sku.split('-').pop() }}
      </span>
      
      <span 
        v-if="product.stock < 150 && product.status !== 'out_of_stock'" 
        class="bg-amber-955/90 backdrop-blur-md text-amber-400 text-xs font-mono px-3 py-1 border border-amber-900/40 uppercase tracking-wider font-extrabold flex items-center"
      >
        <ExclamationTriangleIcon class="h-4.5 w-4.5 mr-1" aria-hidden="true" />
        Tension Stock ({{ product.stock }})
      </span>
    </div>

    <!-- Top right actions (Wishlist and Compare) -->
    <div class="absolute top-4 right-4 z-10 flex space-x-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <button 
        @click="$emit('toggle-compare', product)"
        class="h-8 w-8 bg-white dark:bg-slate-950/80 backdrop-blur border text-slate-400 hover:text-emerald-400 flex items-center justify-center transition"
        :class="isInCompare ? 'border-emerald-500 text-emerald-400 font-bold' : 'border-slate-800'"
        :title="isInCompare ? 'Remove comparison' : 'Add to Comparison Matrix'"
        :aria-label="isInCompare ? 'Remove from comparison' : 'Add to comparison'"
      >
        <ScaleIcon class="h-5 w-5" aria-hidden="true" />
      </button>
      <button 
        @click="$emit('toggle-wishlist', product)"
        class="h-8 w-8 bg-white dark:bg-slate-950/80 backdrop-blur border text-slate-400 hover:text-rose-500 flex items-center justify-center transition"
        :class="isInWishlist ? 'border-rose-500 text-rose-500 bg-rose-950/20' : 'border-slate-800'"
        :title="isInWishlist ? 'Saved' : 'Save to Wishlist'"
        :aria-label="isInWishlist ? 'Remove from wishlist' : 'Save to wishlist'"
      >
        <HeartIcon class="h-5 w-5" :class="isInWishlist ? 'fill-rose-500 text-rose-500' : ''" aria-hidden="true" />
      </button>
    </div>

    <!-- Product Image Frame -->
    <div class="relative h-48 overflow-hidden bg-white dark:bg-slate-950 border-b border-slate-800">
      <img 
        :src="product.image" 
        class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 filter brightness-95" 
        alt=""
      />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
      
      <!-- Dynamic Category Tag -->
      <span class="absolute bottom-3 left-3 bg-[#0d2126] text-emerald-400 text-sm font-mono uppercase px-3 py-1 font-extrabold border border-emerald-900/60">
        {{ categoryName }}
      </span>
    </div>

    <!-- Details Area -->
    <div class="p-5 flex-1 flex flex-col justify-between" style="gap: 16px;">
      <div style="gap: 16px;" class="flex flex-col">
        <!-- Location tracker -->
        <div class="text-sm font-mono text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
          <span class="h-2 w-2 rounded-full bg-cyan-400"></span>
          <span>Bassin {{ regionName }}</span>
        </div>

        <!-- Product Name -->
        <h3 class="text-[16px] font-sans font-semibold text-slate-100 leading-tight uppercase tracking-tight group-hover:text-emerald-400 transition">
          {{ product.name }}
        </h3>

        <!-- Cooperative Supp/Brand -->
        <p class="text-[14px] text-slate-500 font-mono">
          Coop: <span class="font-bold text-slate-350">{{ supplierName }}</span>
        </p>
      </div>

      <div class="pt-4 border-t border-slate-800 flex items-end justify-between">
        <div>
          <span class="text-[14px] uppercase font-mono text-slate-500 block">B2B Base Lot cost</span>
          <span class="text-emerald-400 font-bold text-[20px] font-mono">
            {{ formatCFA(product.price) }}
          </span>
          <span class="text-slate-500 font-mono text-[14px] lowercase"> / {{ product.unit }}</span>
        </div>

        <div class="text-right">
          <span class="text-[14px] uppercase font-mono text-slate-500 block">Escrow Stock</span>
          <span 
            class="text-[14px] font-mono font-bold"
            :class="product.status === 'out_of_stock' || product.stock <= 0 ? 'text-red-500' : 'text-slate-300'"
          >
            {{ product.status === 'out_of_stock' || product.stock <= 0 ? 'RUPTURE' : `${product.stock} ${product.unit}s` }}
          </span>
        </div>
      </div>

      <!-- Quick Actions Tray -->
      <div class="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
        <button 
          @click="$emit('quick-view', product)"
          class="py-2.5 bg-white dark:bg-slate-950 border border-slate-850 hover:bg-[#F0EFEB] dark:bg-slate-800 text-slate-300 hover:text-emerald-300 text-sm font-mono uppercase tracking-wider transition"
          aria-label="Quick inspect product specifications"
        >
          Quick View
        </button>
        
        <button 
          @click="$emit('add-to-cart', product)"
          :disabled="product.status === 'out_of_stock' || product.stock <= 0"
          class="py-2.5 text-sm font-mono uppercase font-bold transition flex items-center justify-center space-x-1.5 border"
          :class="product.status === 'out_of_stock' || product.stock <= 0 
            ? 'bg-white dark:bg-slate-950 border-slate-800 text-[#7A7A7A] cursor-not-allowed' 
            : 'bg-emerald-950 border-emerald-900 hover:bg-emerald-400 hover:text-[#1A1A1A] text-emerald-400 hover:border-transparent'"
          :aria-label="'Add ' + product.name + ' to shopping basket'"
        >
          <ShoppingCartIcon class="h-4.5 w-4.5" aria-hidden="true" />
          <span>Add To Cart</span>
        </button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { 
  ShoppingCartIcon, 
  HeartIcon, 
  ScaleIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/vue/24/outline';

const props = defineProps({
  product: { type: Object, required: true },
  categoryName: { type: String, default: 'General' },
  regionName: { type: String, default: 'Centre' },
  supplierName: { type: String, default: 'Coopérative Locale' },
  isInWishlist: { type: Boolean, default: false },
  isInCompare: { type: Boolean, default: false }
});

defineEmits(['toggle-wishlist', 'toggle-compare', 'quick-view', 'add-to-cart']);

function formatCFA(val) {
  if (val === undefined || val === null) return '0 CFA';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('FCFA', 'CFA').replace('XAF', 'CFA');
}
</script>
