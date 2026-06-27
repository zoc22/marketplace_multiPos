<template>
  <footer class="bg-white dark:bg-slate-950 border-t border-slate-800 py-16 px-8 text-slate-400 text-base mt-12 pb-48 md:pb-40">
    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
      
      <!-- Brand column -->
      <div class="space-y-4">
        <div class="flex items-center space-x-3">
          <div class="h-8 w-8 bg-emerald-500 rounded-none flex items-center justify-center text-[#1A1A1A] text-sm font-bold font-mono">K</div>
          <span class="font-mono text-lg font-bold text-white uppercase tracking-wider">KONG S.A.</span>
        </div>
        <p class="text-sm text-slate-500 leading-relaxed">
          Sovereign wholesale platform enabling unified logistics clearances, decentralized cooperative listings, and real-time bank wire guarantees for sub-Saharan agricultural trade networks.
        </p>
      </div>

      <!-- Terroirs/Regions -->
      <div class="space-y-3">
        <h4 class="text-white font-mono text-sm uppercase tracking-wider font-bold">Terroirs du Cameroun</h4>
        <ul class="space-y-2 text-sm text-slate-500 font-mono">
          <li class="flex items-center">
            <ChevronRightIcon class="h-4 w-4 text-emerald-450 mr-1.5 shrink-0" aria-hidden="true" />
            <span>Moungo (Penja White Pepper)</span>
          </li>
          <li class="flex items-center">
            <ChevronRightIcon class="h-4 w-4 text-emerald-450 mr-1.5 shrink-0" aria-hidden="true" />
            <span>Sangmélima (Premium Raw Cocoa)</span>
          </li>
          <li class="flex items-center">
            <ChevronRightIcon class="h-4 w-4 text-emerald-450 mr-1.5 shrink-0" aria-hidden="true" />
            <span>Garoua & Yagoua (Maize, Onions)</span>
          </li>
          <li class="flex items-center">
            <ChevronRightIcon class="h-4 w-4 text-emerald-450 mr-1.5 shrink-0" aria-hidden="true" />
            <span>Mbouda & Foumbot (Tropic Fruits)</span>
          </li>
        </ul>
      </div>

      <!-- Secure Gateways -->
      <div class="space-y-3">
        <h4 class="text-white font-mono text-sm uppercase tracking-wider font-bold">Secure Gateways</h4>
        <ul class="space-y-2 text-sm text-slate-500 font-mono">
          <li class="flex items-center">
            <ShieldCheckIcon class="h-4 w-4 text-emerald-450 mr-1.5 shrink-0" aria-hidden="true" />
            <span>Afriland Sawa B2B API</span>
          </li>
          <li class="flex items-center">
            <ShieldCheckIcon class="h-4 w-4 text-emerald-450 mr-1.5 shrink-0" aria-hidden="true" />
            <span>Mobile Money (Orange / MTN)</span>
          </li>
          <li class="flex items-center">
            <ShieldCheckIcon class="h-4 w-4 text-emerald-450 mr-1.5 shrink-0" aria-hidden="true" />
            <span>Express Union Flash Vouchers</span>
          </li>
          <li class="flex items-center">
            <ShieldCheckIcon class="h-4 w-4 text-emerald-450 mr-1.5 shrink-0" aria-hidden="true" />
            <span>Kribi sovereign port escrow clearance</span>
          </li>
        </ul>
      </div>

      <!-- Compliance Info -->
      <div class="space-y-3">
        <h4 class="text-white font-mono text-sm uppercase tracking-wider font-bold">Certification Compliance</h4>
        <p class="text-sm text-slate-500 leading-relaxed font-mono">
          All registered cooperatives obey CEMAC regional health checks and standard phytosanitary passport rules. Verified by Kribi Custom Authorities.
        </p>
      </div>

    </div>
  </footer>
</template>

<script setup>
import { ChevronRightIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline';
</script>
