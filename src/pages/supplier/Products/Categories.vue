<template>
  <div class="space-y-6">
    <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
      <h1 class="text-xl font-bold text-slate-100">B2B Category Mapping</h1>
      <p class="text-xs text-slate-400 mt-1">Simulated taxonomy mapping that maps local products to the shared buyer marketplace.</p>
    </div>

    <!-- MAIN CATEGORY MAP -->
    <div class="p-5 bg-[#080d22] border border-slate-900 rounded-xl space-y-4">
      <h3 class="text-xs font-mono font-bold uppercase text-slate-200 tracking-wider">Marketplace taxonomies mappings</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 select-none">
        <div class="p-4 bg-slate-950 border border-slate-900 rounded-xl space-y-2">
          <span class="text-xs font-bold text-indigo-400 font-mono">AGRI-TXS: INTRANTS &amp; ENGRAIS</span>
          <p class="text-[11px] text-slate-450 leading-normal">
            Linked to the shared Agriculture category. Feeds organic fertilizers, solar equipment, and high-runner seeds directly to B2B agricultural cooperatives.
          </p>
          <div class="text-[10px] font-mono text-slate-500">
            Active mapping: <strong class="text-emerald-400 font-normal">SLA Clear ✅</strong>
          </div>
        </div>

        <div class="p-4 bg-slate-950 border border-slate-900 rounded-xl space-y-2">
          <span class="text-xs font-bold text-purple-400 font-mono">SOL-TECH: ENERGY &amp; PUMPS</span>
          <p class="text-[11px] text-slate-450 leading-normal">
            Linked to Solar Electrification domain. Reroutes deep-well submersible water pumps and high-clearance controller modules directly to registered buyers.
          </p>
          <div class="text-[10px] font-mono text-slate-500">
            Active mapping: <strong class="text-emerald-400 font-normal">SLA Clear ✅</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
