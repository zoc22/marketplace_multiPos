<template>
  <div class="print-document bg-white text-slate-900 font-sans p-8 max-w-4xl mx-auto shadow-sm rounded-none border border-slate-100 print:border-none print:p-0 print:shadow-none">
    
    <!-- Printable Header (Visible only when printing or in print preview) -->
    <div class="flex justify-between items-start border-b-2 border-emerald-600 pb-6 mb-6">
      <div class="flex items-center space-x-3">
        <div class="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
          <svg class="h-7 w-7 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div>
          <h1 class="text-xl font-bold tracking-widest text-emerald-600 font-mono">KONG S.A.</h1>
          <p class="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">B2B Cameroon Wholesale Hub</p>
        </div>
      </div>

      <div class="text-right text-xs font-mono space-y-1 text-slate-655">
        <p class="font-bold text-slate-900 uppercase">{{ title }}</p>
        <p>Réf: {{ reference }}</p>
        <p>Date: {{ formatDate(date) }}</p>
      </div>
    </div>

    <!-- Document Body Slot -->
    <div class="document-content my-6">
      <slot></slot>
    </div>

    <!-- Printable Footer -->
    <div class="border-t border-slate-200 pt-6 mt-8 text-center text-[10px] font-mono text-slate-400 space-y-2 print:absolute print:bottom-8 print:left-0 print:right-0">
      <p>KONG S.A. &bull; Zone Industrielle Portuaire, Kribi, Cameroun &bull; NUI: M02150004523B</p>
      <p class="text-slate-500">Ce document est un justificatif officiel généré électroniquement sur la plateforme Kong S.A.</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'Document Officiel' },
  reference: { type: String, default: 'N/A' },
  date: { type: [Date, String], default: () => new Date() }
});

function formatDate(val) {
  if (!val) return '';
  const date = new Date(val);
  if (isNaN(date.getTime())) return val;
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
</script>

<style>
/* CSS rules targeting browser print view layout styling */
@media print {
  body {
    background-color: white !important;
    color: black !important;
    font-size: 12pt;
  }
  /* Hide all UI elements, layout headers, sidebars, print buttons */
  header, 
  aside, 
  nav, 
  button, 
  .print-hide,
  .sticky,
  .toast,
  footer,
  .page-container > header {
    display: none !important;
  }
  /* Reset margins for printing */
  .page-container,
  main,
  .print-document {
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
    max-width: 100% !important;
    box-shadow: none !important;
    background: transparent !important;
  }
}
</style>
