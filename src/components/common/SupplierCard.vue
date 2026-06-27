<template>
  <div class="bg-white dark:bg-slate-900 border border-slate-800 p-[20px] flex flex-col justify-between hover:-translate-y-1 hover:shadow-2xl hover:border-emerald-600/30 transition-all duration-300" style="gap: 16px;">
    <div style="gap: 16px;" class="flex flex-col">
      <!-- Header -->
      <div class="flex items-start justify-between">
        <div class="flex items-center space-x-3">
          <div class="h-12 w-12 bg-white dark:bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400">
            <BuildingOfficeIcon class="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h3 class="text-[16px] font-bold text-slate-100 uppercase tracking-tight flex items-center">
              {{ supplier.name }}
              <ShieldCheckIcon v-if="supplier.verified" class="h-5 w-5 text-emerald-500 ml-1.5" aria-hidden="true" title="Verified Wholesaler" />
            </h3>
            <p class="text-[14px] text-slate-500 font-mono flex items-center mt-1">
              <MapPinIcon class="h-4 w-4 text-cyan-405 mr-1" aria-hidden="true" />
              Bassin d'Axe : {{ supplier.region || 'Douala-Yaoundé' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Description -->
      <p class="text-[14px] text-slate-400 leading-relaxed font-sans">
        {{ supplier.description || 'Coopérative agricole wholesale fournissant des produits de haute qualité certifiés CEMAC.' }}
      </p>
    </div>

    <!-- Rating & Verification details -->
    <div class="pt-4 border-t border-slate-800 flex flex-wrap gap-4 items-center justify-between text-[14px]">
      <div class="flex items-center space-x-1.5">
        <span class="text-[14px] uppercase font-mono text-slate-500">Quality score:</span>
        <div class="flex items-center text-amber-500">
          <StarIcon v-for="n in 5" :key="n" class="h-4.5 w-4.5" :class="n <= (supplier.rating || 5) ? 'fill-amber-500' : 'text-[#4A4A4A]'" aria-hidden="true" />
        </div>
      </div>

      <div class="text-right">
        <span class="text-[14px] font-mono text-slate-405 bg-white dark:bg-slate-950 px-2.5 py-1 border border-slate-850">
          {{ supplier.capacity || 'Export Standard' }}
        </span>
      </div>
    </div>

    <!-- CTA -->
    <div class="pt-2">
      <button 
        @click="$emit('view-details', supplier)"
        class="w-full py-2.5 bg-white dark:bg-slate-950 border border-slate-850 hover:bg-[#F0EFEB] dark:bg-slate-800 text-xs font-mono uppercase tracking-wider text-slate-200 hover:text-emerald-300 transition"
        aria-label="View Cooperative profile details"
      >
        View Wholesaler Catalog
      </button>
    </div>
  </div>
</template>

<script setup>
import { 
  BuildingOfficeIcon, 
  ShieldCheckIcon, 
  MapPinIcon, 
  StarIcon 
} from '@heroicons/vue/24/outline';

defineProps({
  supplier: { type: Object, required: true }
});

defineEmits(['view-details']);
</script>
