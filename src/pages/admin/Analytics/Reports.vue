<template>
  <div class="space-y-6">

    <!-- HEADER BLOCK -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5 shrink-0">
      <div>
        <h1 class="text-xl font-bold font-mono text-[var(--color-text-primary)] flex items-center gap-2">
          <span>Analyses & Rapports B2B de la Plateforme</span>
        </h1>
        <p class="text-xs text-[var(--color-text-secondary)]">Consultez les flux de transactions en temps réel, suivez les volumes régionaux et surveillez les indicateurs de marché.</p>
      </div>

      <div class="flex items-center gap-2 font-mono text-xs">
        <select v-model="selectedQuarter" class="bg-[var(--color-background)] text-[var(--color-text-primary)] rounded-lg p-2 border border-[var(--color-border)] outline-none focus:border-[var(--color-primary)]">
          <option value="q1">T1 Janv - Mars (Actif)</option>
          <option value="q2">T2 Avr - Juin</option>
        </select>
      </div>
    </div>

    <!-- MAIN BENTO METRIC SECTOR -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- Chart column 1: SVG Revenue Trends -->
      <div class="md:col-span-2 p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl space-y-4 shadow-sm">
        <h2 class="text-xs font-bold font-mono uppercase text-[var(--color-text-primary)] tracking-wider">Volumes d'Entrées vs. Sorties (Millions de FCFA)</h2>
        
        <!-- CUSTOM PREMIUM CSS/SVG CHART -->
        <div class="h-64 relative bg-[var(--color-background)] p-4 border border-[var(--color-border)] rounded-xl flex items-end justify-between font-mono text-[10px] text-[var(--color-text-secondary)]">
          
          <!-- grid line helper markers -->
          <div class="absolute inset-0 p-4 flex flex-col justify-between opacity-5 select-none pointer-events-none">
            <div class="border-b border-slate-500 w-full"></div>
            <div class="border-b border-slate-500 w-full"></div>
            <div class="border-b border-slate-500 w-full"></div>
            <div class="border-b border-slate-500 w-full"></div>
          </div>

          <div class="w-12 text-center space-y-2">
            <div class="relative bg-[var(--color-primary)] rounded-t h-40 mx-auto" style="width: 14px">
              <span class="absolute -top-6 left-1/2 -translate-x-1/2 text-[var(--color-text-secondary)] font-bold">140M</span>
            </div>
            <div class="text-[var(--color-text-secondary)] border-t border-[var(--color-border)] pt-1.5 leading-none">Janv</div>
          </div>

          <div class="w-12 text-center space-y-2">
            <div class="relative bg-[var(--color-primary)] rounded-t h-48 mx-auto" style="width: 14px">
              <span class="absolute -top-6 left-1/2 -translate-x-1/2 text-[var(--color-text-secondary)] font-bold">188M</span>
            </div>
            <div class="text-[var(--color-text-secondary)] border-t border-[var(--color-border)] pt-1.5 leading-none">Févr</div>
          </div>

          <div class="w-12 text-center space-y-2">
            <div class="relative bg-[var(--color-primary)] rounded-t h-56 mx-auto" style="width: 14px">
              <span class="absolute -top-6 left-1/2 -translate-x-1/2 text-[var(--color-text-secondary)] font-bold">210M</span>
            </div>
            <div class="text-[var(--color-text-secondary)] border-t border-[var(--color-border)] pt-1.5 leading-none">Mars</div>
          </div>

          <div class="w-12 text-center space-y-2">
            <div class="relative bg-[var(--color-primary-muted)] rounded-t h-32 mx-auto border border-dashed border-[var(--color-primary)]" style="width: 14px">
              <span class="absolute -top-6 left-1/2 -translate-x-1/2 text-[var(--color-text-secondary)] font-bold">110M</span>
            </div>
            <div class="text-[var(--color-text-secondary)] border-t border-[var(--color-border)] pt-1.5 leading-none">Avr</div>
          </div>

        </div>
      </div>

      <!-- Column 2: Regional sector volumes distribution -->
      <div class="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl space-y-4 shadow-sm">
        <h2 class="text-xs font-bold font-mono uppercase text-[var(--color-text-primary)] tracking-wider">Distribution des Parts de Secteur</h2>
        
        <div class="space-y-4 text-xs font-mono text-[var(--color-text-secondary)]">
          <div class="space-y-1">
            <div class="flex items-center justify-between text-[var(--color-text-secondary)]">
              <span>Cacao & Récoltes</span>
              <span class="text-[var(--color-text-primary)]">52%</span>
            </div>
            <div class="w-full bg-[var(--color-background)] h-2 rounded-full overflow-hidden border border-[var(--color-border)]">
              <div class="bg-[var(--color-primary)] h-full rounded-full" style="width: 52%"></div>
            </div>
          </div>

          <div class="space-y-1">
            <div class="flex items-center justify-between text-[var(--color-text-secondary)]">
              <span>Métaux & Matériaux (BTP)</span>
              <span class="text-[var(--color-text-primary)]">28%</span>
            </div>
            <div class="w-full bg-[var(--color-background)] h-2 rounded-full overflow-hidden border border-[var(--color-border)]">
              <div class="bg-emerald-500 h-full rounded-full" style="width: 28%"></div>
            </div>
          </div>

          <div class="space-y-1">
            <div class="flex items-center justify-between text-[var(--color-text-secondary)]">
              <span>Emballages & Ingrédients</span>
              <span class="text-[var(--color-text-primary)]">20%</span>
            </div>
            <div class="w-full bg-[var(--color-background)] h-2 rounded-full overflow-hidden border border-[var(--color-border)]">
              <div class="bg-teal-500 h-full rounded-full" style="width: 20%"></div>
            </div>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
const selectedQuarter = ref('q1');
</script>
