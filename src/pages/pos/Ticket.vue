<template>
  <div class="space-y-6 font-mono select-none text-slate-100 animate-slide-up">
    
    <!-- HEADER -->
    <div class="bg-[#14141E] border border-slate-800 p-5 rounded-2xl flex justify-between items-center print:hidden relative overflow-hidden">
      <div class="absolute -right-16 -top-16 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
      <div>
        <h1 class="text-sm font-bold uppercase text-slate-200 tracking-wider">Facturation &amp; Impression de Tickets</h1>
        <p class="text-[9.5px] text-slate-500 font-mono">Génération de documents PDF normalisés par lot de déstockage FIFO.</p>
      </div>

      <button 
        @click="goToMainCatalog"
        class="px-3.5 py-1.5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs hover:border-slate-700 transition flex items-center gap-1.5"
      >
        <ArrowPathIcon class="w-3.5 h-3.5" />
        <span>Nouvelle Vente [ Esc ]</span>
      </button>
    </div>

    <!-- MAIN GRID CONTAINER (Receipt visualizer + past transactions) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 print:block">
      
      <!-- RECEIPT SLATE (80mm Thermal paper simulation) -->
      <div class="lg:col-span-2 flex justify-center print:block print:w-full">
        <div 
          ref="thermalReceipt"
          class="w-full max-w-[340px] bg-white text-zinc-900 p-6 shadow-2xl rounded-sm border border-zinc-205 font-mono text-[10.5px] leading-relaxed relative print:shadow-none print:border-none print:p-0 print:max-w-full"
        >
          <!-- Outer zig zag top border decor -->
          <div class="absolute -top-1 left-0 right-0 h-1.5 bg-zinc-100 border-b border-dashed border-zinc-300 print:hidden"></div>

          <!-- Merchant / Store header -->
          <div class="text-center space-y-1 pb-4 border-b border-dashed border-zinc-300">
            <h2 class="text-xs font-black uppercase text-zinc-950 tracking-wider">GROUPE B2B TECHSUPPLIES</h2>
            <p class="text-[9px] text-zinc-700 uppercase font-sans font-bold">
              {{ selectedStore?.name || 'Magasin Terminal Alpha' }}
            </p>
            <p class="text-[8px] text-zinc-650 font-sans leading-normal">
              {{ selectedStore?.address || 'Zone Industrielle de Bassa, Douala, CM' }}<br />
              Tél: {{ selectedStore?.phone || '+237 233 44 55 66' }}
            </p>
          </div>

          <!-- Transaction Registry specs -->
          <div class="py-3 border-b border-dashed border-zinc-300 space-y-1 font-mono text-[9px] text-zinc-700">
            <div class="flex justify-between">
              <span>N° FAC :</span>
              <strong class="text-zinc-900 font-bold">{{ receipt?.id || 'TX-PENDING' }}</strong>
            </div>
            <div class="flex justify-between">
              <span>Date :</span>
              <strong class="text-zinc-900">{{ formatDate(receipt?.date) }}</strong>
            </div>
            <div class="flex justify-between">
              <span>Caissier :</span>
              <strong class="uppercase text-zinc-900">{{ receipt?.cashierName || 'Jean Dupont' }}</strong>
            </div>
            <div class="flex justify-between">
              <span>Client :</span>
              <strong class="uppercase text-zinc-900">{{ receipt?.customerName || 'Client Comptant' }}</strong>
            </div>
            <div class="flex justify-between" v-if="receipt?.customerPhone">
              <span>Téléphone :</span>
              <strong class="text-zinc-900">{{ receipt?.customerPhone }}</strong>
            </div>
          </div>

          <!-- Line items table -->
          <div class="py-3 border-b border-dashed border-zinc-300 font-mono">
            <div class="grid grid-cols-6 text-[8.5px] uppercase font-bold text-zinc-500 pb-1.5 border-b border-zinc-200">
              <span class="col-span-3">Désignation</span>
              <span class="text-center">Qté</span>
              <span class="text-right">Unit</span>
              <span class="text-right">Total</span>
            </div>

            <div class="divide-y divide-zinc-100">
              <div 
                v-for="item in receipt?.items || []" 
                :key="item.productId"
                class="grid grid-cols-6 py-2 text-[9px] text-zinc-800 font-mono align-middle"
              >
                <!-- Name and SKU -->
                <div class="col-span-3 pr-1.5">
                  <span class="font-bold block text-zinc-900 leading-tight">{{ item.name }}</span>
                  <span class="text-[7.5px] text-zinc-500 block uppercase">SKU: {{ item.sku }}</span>
                  <span class="text-[7.5px] text-red-650 font-bold block mt-0.5" v-if="item.discountType !== 'none'">
                    Remise: {{ item.discountType === 'percentage' ? '-' + item.discountValue + '%' : '-' + item.discountValue + ' FCFA' }}
                  </span>
                </div>
                
                <!-- Qty -->
                <span class="text-center font-bold self-center text-zinc-900">{{ item.qty }}</span>
                
                <!-- Unit Price -->
                <span class="text-right self-center font-semibold text-zinc-650">{{ Math.round(item.price).toLocaleString() }}</span>
                
                <!-- Subtotal Net -->
                <span class="text-right self-center font-bold text-zinc-900">{{ Math.round(item.total).toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <!-- Total sums breakdown -->
          <div class="py-3 border-b border-dashed border-zinc-200 space-y-1 text-zinc-700 font-mono text-[9px]">
            
            <div class="flex justify-between">
              <span>Sous-total Brut HT :</span>
              <span class="font-semibold text-zinc-900">{{ Math.round(receipt?.subtotalHT || 0).toLocaleString() }} FCFA</span>
            </div>

            <div v-if="receipt?.discount > 0" class="flex justify-between text-red-600">
              <span>Remise globale :</span>
              <span>- {{ Math.round(receipt?.discount || 0).toLocaleString() }} FCFA</span>
            </div>

            <div class="flex justify-between">
              <span>TVA Collectée (19.25%) :</span>
              <span class="font-semibold text-zinc-900">{{ Math.round(receipt?.tax || 0).toLocaleString() }} FCFA</span>
            </div>

            <div class="flex justify-between text-[11px] font-black border-t border-zinc-200 pt-2 text-zinc-950">
              <span>NET À PAYER (TTC) :</span>
              <span>{{ Math.round(receipt?.totalTTC || 0).toLocaleString() }} FCFA</span>
            </div>

          </div>

          <!-- Payments and change given detail -->
          <div class="py-3 border-b border-dashed border-zinc-300 space-y-1 text-[9px] text-zinc-700 font-mono">
            <span class="font-bold text-zinc-900 block pb-0.5">Modes de Règlement :</span>
            
            <div v-for="pay in receipt?.payments || []" :key="pay.method" class="flex justify-between pl-2">
              <span class="uppercase">
                <span v-if="pay.method === 'cash'">💵 Espèces</span>
                <span v-else-if="pay.method === 'momo'">📱 Portefeuille Mobile</span>
                <span v-else-if="pay.method === 'card'">💳 Carte bancaire</span>
                <span v-else-if="pay.method === 'voucher'">🎟️ Bon d'Avoir</span>
                <span class="text-[7.5px] text-zinc-500 block lowercase pl-3" v-if="pay.memo">({{ pay.memo }})</span>
              </span>
              <strong class="text-zinc-900 font-bold">{{ Math.round(pay.amount).toLocaleString() }} FCFA</strong>
            </div>

            <div class="flex justify-between pt-1 text-emerald-700 font-bold border-t border-zinc-100">
              <span class="uppercase">Rendu de monnaie :</span>
              <span class="text-emerald-700 font-bold">{{ Math.round(receipt?.change || 0).toLocaleString() }} FCFA</span>
            </div>
          </div>

          <!-- Bottom barcode simulation and validation QR code -->
          <div class="text-center pt-4 space-y-3">
            <div class="flex items-center justify-center gap-4">
              <!-- Barcode -->
              <div class="inline-block p-1 bg-zinc-50 border border-zinc-200 rounded">
                <div class="h-6 w-36 bg-black block mx-auto text-white text-[6px] tracking-widest leading-none font-sans overflow-hidden flex items-center justify-center">
                  |||| | |||||| || | | |||||| |||||
                </div>
                <span class="text-[6.5px] tracking-wider text-zinc-500 font-mono block mt-1">CERTIFIED_B2B_FIFO</span>
              </div>
              
              <!-- QR Code Validation Simulation -->
              <div class="inline-block p-1.5 bg-zinc-50 border border-zinc-200 rounded relative">
                <!-- Simple 10x10 simulated grid for QR code -->
                <div class="w-10 h-10 grid grid-cols-5 gap-0.5 bg-white p-0.5">
                  <div class="bg-black"></div><div class="bg-black"></div><div class="bg-white"></div><div class="bg-black"></div><div class="bg-black"></div>
                  <div class="bg-black"></div><div class="bg-white"></div><div class="bg-black"></div><div class="bg-white"></div><div class="bg-black"></div>
                  <div class="bg-white"></div><div class="bg-black"></div><div class="bg-black"></div><div class="bg-black"></div><div class="bg-white"></div>
                  <div class="bg-black"></div><div class="bg-white"></div><div class="bg-white"></div><div class="bg-black"></div><div class="bg-black"></div>
                  <div class="bg-black"></div><div class="bg-black"></div><div class="bg-white"></div><div class="bg-white"></div><div class="bg-black"></div>
                </div>
                <span class="text-[6.5px] tracking-wider text-zinc-500 font-mono block mt-1">SCAN VALIDATION</span>
              </div>
            </div>

            <p class="text-[8px] text-zinc-500 font-sans italic leading-normal">
              Merci pour votre confiance.<br />
              Dédouané Douala Port &bull; Traçabilité FIFO Sécurisée.
            </p>
          </div>
        </div>
      </div>

      <!-- PRINT ACTIONS AND PAST TRANS SIDEBAR -->
      <div class="space-y-6 print:hidden">
        
        <!-- BUTTON OPERATIONS -->
        <div class="bg-[#14141E] border border-slate-800 p-5 rounded-2xl space-y-4">
          <h3 class="text-xs font-bold text-[#C8A96E] uppercase tracking-wider font-mono">Options de Sortie</h3>
          
          <button 
            @click="triggerThermalPrint"
            class="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs uppercase tracking-wide transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/20"
          >
            <PrinterIcon class="w-4 h-4" />
            <span>Imprimer le Ticket (80mm)</span>
          </button>

          <button 
            @click="exportReceiptAsPDF"
            class="w-full py-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 rounded-xl font-bold text-xs uppercase tracking-wide transition flex items-center justify-center space-x-2"
          >
            <DocumentTextIcon class="w-4 h-4" />
            <span>Télécharger le PDF</span>
          </button>

          <button 
            @click="goToMainCatalog"
            class="w-full py-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-400 font-bold text-xs uppercase tracking-wide transition"
          >
            Faire un autre encaissement
          </button>
        </div>

        <!-- FIFO TRACEABILITY HUD -->
        <div class="bg-[#14141E] border border-slate-800 p-5 rounded-2xl space-y-4">
          <h3 class="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Détails Traçabilité FIFO</h3>
          <p class="text-[9.5px] text-slate-500 leading-relaxed font-sans">
            Ce ticket est lié à une dépréciation mécanique FIFO. Voici les détails exacts d'origine des lots agricoles débités :
          </p>

          <div class="space-y-3 font-mono text-[9px]">
            <div 
              v-for="b in (receipt?.fifoBreakdown || [])" 
              :key="b.productId"
              class="p-3 bg-slate-950 rounded-xl border border-slate-850"
            >
              <span class="font-bold text-slate-300 block">🛍️ ID : {{ b.productId }}</span>
              <div class="mt-1.5 space-y-1 text-slate-500 pl-1">
                <div v-for="det in b.details" :key="det.batchId" class="flex justify-between">
                  <span>Batch {{ det.batchId }} (Lot: {{ det.date }})</span>
                  <strong class="text-emerald-400 font-bold">- {{ det.qty }} uds</strong>
                </div>
              </div>
            </div>
            <div v-show="!receipt?.fifoBreakdown" class="text-center text-slate-600">
              Aucun journal FIFO à afficher.
            </div>
          </div>
        </div>

        <!-- RECENT TRANSACTIONS REPRINT LIST -->
        <div class="bg-[#14141E] border border-slate-800 p-5 rounded-2xl space-y-3">
          <h3 class="text-[10px] font-mono font-bold uppercase text-[#C8A96E] pb-2 border-b border-slate-800 font-mono">
            Tickets Récents (Réimpression)
          </h3>

          <div class="space-y-2 max-h-[180px] overflow-y-auto scrollbar-thin font-mono text-[9px]">
            <div 
              v-for="tx in pastInvoices.slice(0, 5)" 
              :key="tx.id"
              class="p-2.5 bg-slate-950 border border-slate-850 rounded-xl flex justify-between items-center hover:border-slate-700 cursor-pointer transition-colors"
              @click="reprintInvoice(tx)"
            >
              <div>
                <span class="text-slate-300 block font-bold">{{ tx.id }}</span>
                <span class="text-[8px] text-slate-500 block mt-0.5">{{ formatDate(tx.date) }}</span>
              </div>
              <strong class="text-emerald-450 text-right block">{{ Math.round(tx.totalTTC).toLocaleString() }} ₣</strong>
            </div>
          </div>
        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { jsPDF } from 'jspdf';
import { 
  PrinterIcon, 
  DocumentTextIcon, 
  ArrowPathIcon 
} from '@heroicons/vue/24/outline';

import { lastReceipt, transactions, currentStore } from '@/composables/usePOS.js';
import { stores } from '@/utils/supplier_db.js';

const router = useRouter();
const toast = useToast();

const receipt = computed(() => {
  return lastReceipt.value || transactions.value[0] || null;
});

const selectedStore = computed(() => {
  if (!receipt.value) return null;
  return stores.value.find(s => s.id === receipt.value.storeId) || null;
});

const pastInvoices = computed(() => {
  return transactions.value;
});

function formatDate(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return d.toLocaleString('fr-FR');
}

function goToMainCatalog() {
  router.push('/pos');
}

function reprintInvoice(tx) {
  lastReceipt.value = tx;
  toast.success(`Ticket ${tx.id} chargé pour la réimpression.`);
}

function triggerThermalPrint() {
  // Direct printing trigger using standard browser print
  window.print();
  toast.success('Lancement du dialogue d’impression thermique.');
}

function exportReceiptAsPDF() {
  const tx = receipt.value;
  if (!tx) {
    toast.error("Aucune facture chargée pour l'export.");
    return;
  }

  try {
    // 80mm thermal paper standard width is approx 80mm
    // Length is dynamic, let's create a 80mm x 180mm custom page size
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 180]
    });

    doc.setFont('courier', 'normal');
    doc.setFontSize(8);

    let y = 10;
    
    // Header
    doc.setFont('courier', 'bold');
    doc.setFontSize(10);
    doc.text('B2B TECHSUPPLIES CAMEROUN', 40, y, { align: 'center' });
    y += 5;
    
    doc.setFontSize(8);
    const storeObj = selectedStore.value;
    doc.text(storeObj?.name || 'Terminal Alpha', 40, y, { align: 'center' });
    y += 4;
    
    doc.setFont('courier', 'normal');
    doc.setFontSize(7);
    doc.text('Zone Industrielle de Bassa, Douala, CM', 40, y, { align: 'center' });
    y += 4;
    doc.text(`Tel: ${storeObj?.phone || '+237 233 44 55 66'}`, 40, y, { align: 'center' });
    y += 6;

    // Line separator
    doc.text('--------------------------------------------', 5, y);
    y += 4;

    // Transaction Details
    doc.text(`N° FAC: ${tx.id}`, 5, y);
    y += 4;
    doc.text(`Date : ${formatDate(tx.date)}`, 5, y);
    y += 4;
    doc.text(`Caissier : ${tx.cashierName || 'Jean Dupont'}`.toUpperCase(), 5, y);
    y += 4;
    doc.text(`Client : ${tx.customerName || 'Client Comptant'}`.toUpperCase(), 5, y);
    y += 4;

    doc.text('--------------------------------------------', 5, y);
    y += 4;

    // Table Header
    doc.setFont('courier', 'bold');
    doc.text('Article', 5, y);
    doc.text('Qté', 45, y);
    doc.text('P.U.', 55, y);
    doc.text('Total', 68, y);
    y += 4;
    
    doc.text('--------------------------------------------', 5, y);
    y += 4;

    // Items list
    doc.setFont('courier', 'normal');
    tx.items.forEach(item => {
      // Print description
      const truncatedName = item.name.length > 20 ? item.name.slice(0, 20) + '.' : item.name;
      doc.text(truncatedName, 5, y);
      
      doc.text(String(item.qty), 45, y);
      doc.text(String(Math.round(item.price)), 55, y);
      doc.text(String(Math.round(item.total)), 68, y);
      y += 4;

      if (item.discountType !== 'none') {
        doc.setFont('courier', 'oblique');
        doc.setFontSize(6);
        const discStr = item.discountType === 'percentage' ? `-${item.discountValue}%` : `-${item.discountValue} F`;
        doc.text(`[Remise: ${discStr}]`, 5, y);
        y += 3;
        doc.setFont('courier', 'normal');
        doc.setFontSize(7);
      }
    });

    doc.text('--------------------------------------------', 5, y);
    y += 4;

    // Summary calculations
    doc.setFont('courier', 'bold');
    doc.text('SOUS-TOTAL HT:', 5, y);
    doc.text(`${Math.round(tx.subtotalHT || 0)} F`, 68, y, { align: 'right' });
    y += 4;

    if (tx.discount > 0) {
      doc.text('REMISE:', 5, y);
      doc.text(`-${Math.round(tx.discount || 0)} F`, 68, y, { align: 'right' });
      y += 4;
    }

    doc.text('TVA (19.25%):', 5, y);
    doc.text(`${Math.round(tx.tax || 0)} F`, 68, y, { align: 'right' });
    y += 4;

    // Total line
    doc.setFontSize(9);
    doc.text('NET A PAYER TTC:', 5, y);
    doc.text(`${Math.round(tx.totalTTC || 0)} F`, 68, y, { align: 'right' });
    y += 5;

    doc.text('--------------------------------------------', 5, y);
    y += 4;

    // Payments detail
    doc.setFontSize(7);
    doc.setFont('courier', 'bold');
    doc.text('RÈGLEMENTS :', 5, y);
    y += 4;

    doc.setFont('courier', 'normal');
    tx.payments.forEach(pay => {
      let mLabel = 'Paiement';
      if (pay.method === 'cash') mLabel = 'Especes';
      else if (pay.method === 'card') mLabel = 'Carte GIMAC';
      else if (pay.method === 'momo') mLabel = 'Momo Mobile';
      else if (pay.method === 'voucher') mLabel = 'Avoir';

      doc.text(`- ${mLabel}:`, 10, y);
      doc.text(`${Math.round(pay.amount)} F`, 68, y, { align: 'right' });
      y += 4;
    });

    doc.text('- Rendu Monnaie:', 10, y);
    doc.text(`${Math.round(tx.change || 0)} F`, 68, y, { align: 'right' });
    y += 6;

    // Footer notice
    doc.text('=== MERCI DE VOTRE VISITE ===', 40, y, { align: 'center' });
    y += 4;
    doc.setFontSize(6);
    doc.text('Déstockage réglementé FIFO sécurisé', 40, y, { align: 'center' });

    // Save PDF
    doc.save(`TICKET-${tx.id}.pdf`);
    toast.success('Document PDF thermique généré et téléchargé.');
  } catch (err) {
    console.error(err);
    toast.error('Erreur lors de la génération du PDF.');
  }
}
</script>

<style scoped>
/* Browser printing styles override */
@media print {
  /* Hide sidebars and button frames */
  aside, header, footer, button, .print\:hidden {
    display: none !important;
  }
  
  /* Reset layout constraints to ensure narrow thermal visual is solo on page */
  body, main, .print\:block {
    background: white !important;
    color: black !important;
    padding: 0 !important;
    margin: 0 !important;
    width: 100% !important;
  }

  .print\:w-full {
    width: 100% !important;
    max-width: 100% !important;
  }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
  animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
