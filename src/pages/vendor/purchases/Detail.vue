<template>
  <div class="space-y-6 max-w-5xl mx-auto" id="order-detail-workspace">
    <!-- PANEL HEADER / ACTIONS -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--color-border)] pb-4 gap-4 select-none">
      <div class="space-y-1">
        <router-link to="/vendor/purchases" class="text-sm text-[var(--color-primary)] font-mono hover:underline flex items-center space-x-2">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span>Retour à l'approvisionnement</span>
        </router-link>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
          <span>Détail de la Commande B2B</span>
          <span class="text-[var(--color-primary)] font-mono text-base">#{{ purchase?.id || 'N/A' }}</span>
        </h1>
      </div>
      
      <div class="flex gap-2 shrink-0">
        <button 
          @click="printDocument"
          class="px-4 py-2 font-mono text-xs border rounded-xl transition flex items-center space-x-2"
          :class="['In Transit', 'Received'].includes(purchase?.status) ? 'bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] border-[var(--color-border)]' : 'bg-slate-550/15 text-slate-400 border-slate-500/20 cursor-not-allowed'"
          id="btn-print-po"
          :title="['In Transit', 'Received'].includes(purchase?.status) ? 'Imprimer Facture / Bon B2B' : 'Impression bloquée : En attente d\'émission du Bon de Livraison (BL)'"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.821V7.5a3.75 3.75 0 017.5 0v6.321m-7.5 0a3.75 3.75 0 013.75-3.75h3.75a3.75 3.75 0 013.75 3.75m-11.25 0H18M9.75 16.5h4.5m-4.5 3h4.5M3 18.75a2.25 2.25 0 002.25 2.25h13.5a2.25 2.25 0 002.25-2.25V16.5a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 16.5v2.25z" />
          </svg>
          <span>Imprimer Facture</span>
        </button>

        <router-link
          v-slot="{ href, navigate }"
          v-if="purchase?.status === 'In Transit' || purchase?.status === 'Received'"
          :to="'/vendor/purchases/track/' + purchaseId"
          custom
        >
          <a
            :href="href"
            @click="navigate"
            class="px-4 py-2 bg-[var(--color-primary)] hover:opacity-90 text-white font-mono text-xs font-bold rounded-xl transition flex items-center space-x-1.5 cursor-pointer"
            id="btn-track-delivery"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.75A1.125 1.125 0 012.625 17.625V12m18 5.625c0 .621-.504 1.125-1.125 1.125H18m-9-6.375V9m-3 3h12m-.75 3H6.75m12 0h2.25A1.125 1.125 0 0022.125 14.25V12m0 0l-3.375-4.5M21 12H18m0-3V6.75A1.125 1.125 0 0016.875 5.625H12m-3 0H5.625A1.125 1.125 0 004.5 6.75V9" />
            </svg>
            <span>Suivre Livraison</span>
          </a>
        </router-link>
        <span 
          v-else
          class="px-4 py-2 bg-slate-500/10 text-slate-400 border border-slate-500/20 rounded-xl font-mono text-xs cursor-not-allowed flex items-center space-x-1.5"
          title="Le suivi n'est disponible qu'une fois le Bon de Livraison (BL) émis par le fournisseur."
        >
          🔒 Suivi Bloqué
        </span>
      </div>
    </div>

    <!-- PENDING ACTION BANNER -->
    <div 
      v-if="purchase?.status === 'Sent'"
      class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl p-4 flex items-start space-x-3 text-sm"
    >
      <svg class="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div class="space-y-0.5 text-[var(--color-text-primary)]">
        <p class="font-bold">Bon de commande envoyé au fournisseur B2B.</p>
        <p class="text-[var(--color-text-secondary)] text-xs">Le fournisseur prépare vos lots de réapprovisionnement. Les fonds de séquestre sont bloqués jusqu'à la livraison conforme.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- DETAILED PRINTABLE ORDER SHEET -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- OFFICIAL ORDER SHEET -->
        <div class="bg-white text-slate-900 p-8 shadow-md rounded-2xl border border-slate-200 font-sans tracking-tight relative overflow-hidden" id="printable-po-sheet">
          
          <!-- STAMP WATERMARK FOR DELIVERED LOGISTICS -->
          <div 
            v-if="purchase?.status === 'Received'"
            class="absolute top-20 right-10 border-4 border-emerald-600 text-emerald-650 font-mono font-black uppercase text-xs px-3 py-1.5 rounded-lg -rotate-12 select-none opacity-80"
          >
            LIVRÉ &amp; ÉMARGÉ ✓
          </div>

          <!-- Document Header -->
          <div class="flex justify-between items-start pb-6 border-b-2 border-slate-300">
            <div>
              <div class="text-xl font-black uppercase tracking-wide text-slate-900 font-mono flex items-center space-x-1.5">
                <span>TECHSUPPLIES SARL</span>
              </div>
              <p class="text-sm text-slate-700 font-mono mt-2 leading-relaxed">
                Douala, Akwa - Cameroun<br>
                Service Approvisionnement B2B<br>
                finance@techsupplies.com
              </p>
            </div>
            <div class="text-right">
              <span class="text-slate-900 font-black font-mono text-sm uppercase bg-slate-100 border border-slate-300 px-3.5 py-1.5 rounded">BON DE COMMANDE B2B</span>
              <p class="text-sm font-black font-mono text-slate-900 mt-3">N° {{ purchase?.id }}</p>
              <p class="text-xs text-slate-650 font-mono font-bold">Date: {{ formatDate(purchase?.date) }}</p>
            </div>
          </div>

          <!-- Partners Details -->
          <div class="grid grid-cols-2 gap-6 py-6 border-b-2 border-slate-300 text-sm">
            <div class="space-y-2">
              <span class="block text-xs font-mono text-slate-500 uppercase tracking-wider font-extrabold">Client / Destinataire (Moi)</span>
              <p class="text-base font-extrabold text-slate-900">TECHSUPPLIES SARL</p>
              <p class="text-slate-700 text-xs leading-relaxed font-medium">
                Akwa, Rue de l'Entrepôt<br>
                Mode de Paiement: {{ purchase?.paymentMethod === 'Escrow' ? 'Séquestre Sécurisé B2B' : 'À la livraison' }}
              </p>
            </div>
            
            <div class="space-y-2">
              <span class="block text-xs font-mono text-slate-500 uppercase tracking-wider font-extrabold">Fournisseur B2B</span>
              <p class="text-base font-extrabold text-slate-900">{{ getSupplierName(purchase?.supplierId) }}</p>
              <p class="text-slate-700 text-xs leading-relaxed font-medium">
                Régime Réel Simplifié<br>
                Livraison attendue : {{ formatDate(purchase?.expectedDate) }}
              </p>
            </div>
          </div>

          <!-- Ordered Items Table -->
          <div class="py-6">
            <table class="w-full text-left text-sm border-collapse">
              <thead>
                <tr class="border-b-2 border-slate-300 text-xs text-slate-600 font-mono uppercase font-black bg-slate-50">
                  <th class="py-3 px-3 border border-slate-300 text-slate-700">Code Article</th>
                  <th class="py-3 px-3 border border-slate-300 text-slate-700">Désignation de la marchandise</th>
                  <th class="py-3 px-3 border border-slate-300 text-center text-slate-700">Quantité</th>
                  <th class="py-3 px-3 border border-slate-300 text-right text-slate-700">Prix de Gros Unitaire</th>
                  <th class="py-3 px-3 border border-slate-300 text-right text-slate-700">Montant HT</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="(item, idx) in purchase?.items" 
                  :key="item.productId || idx"
                  class="text-slate-800 hover:bg-slate-50/60 transition border-b border-slate-300"
                >
                  <td class="py-3.5 px-3 border border-slate-300 font-mono text-xs font-bold text-slate-900">{{ item.productId }}</td>
                  <td class="py-3.5 px-3 border border-slate-300">
                    <span class="font-black text-slate-900 text-sm">{{ getProductName(item.productId) }}</span>
                  </td>
                  <td class="py-3.5 px-3 border border-slate-300 text-center font-mono font-black text-slate-900">{{ item.quantity }}</td>
                  <td class="py-3.5 px-3 border border-slate-300 text-right font-mono font-bold text-slate-900">{{ formatMoney(item.unitCost) }}</td>
                  <td class="py-3.5 px-3 border border-slate-300 text-right font-mono font-black text-slate-900">{{ formatMoney(item.quantity * item.unitCost) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Document Totals calculation sheet -->
          <div class="grid grid-cols-2 gap-4 py-6 pt-6 border-t-2 border-slate-300 text-sm">
            <div class="text-xs text-slate-700 font-mono flex flex-col justify-end font-extrabold">
              <p class="text-slate-900 font-black">✓ Bon de commande certifié conforme.</p>
              <p class="mt-1 text-slate-600">Généré via l'ERP intégré B2B.</p>
            </div>
            
            <div class="space-y-2 text-xs font-mono text-slate-700 font-extrabold">
              <div class="flex justify-between border-b border-slate-300 pb-2">
                <span>CONTRAT SOUS-TOTAL:</span>
                <span class="text-slate-900 font-black font-mono">{{ formatMoney(purchase?.total) }}</span>
              </div>
              <div class="flex justify-between border-b border-slate-300 pb-2">
                <span>TVA (Régime Partenaire 0%):</span>
                <span class="text-slate-900 font-black font-mono">0 FCFA</span>
              </div>
              <div class="flex justify-between text-slate-900 pt-3 border-t-2 border-slate-400 text-sm font-sans font-black">
                <span class="uppercase font-mono text-xs font-black">VALEUR TOTALE CONTRACTUELLE:</span>
                <span class="font-mono text-sm text-slate-950 font-black">{{ formatMoney(purchase?.total) }}</span>
              </div>
            </div>
          </div>

          <!-- Signing Desk -->
          <div class="mt-10 pt-10 border-t-2 border-slate-300 flex justify-between h-20 text-xs font-mono text-slate-700 font-extrabold">
            <div>
              <p class="text-slate-800 font-black">TECHSUPPLIES SARL (Client)</p>
              <p class="mt-4 italic text-slate-950 font-black">[ Signature Approuvée ]</p>
            </div>
            <div>
              <p class="text-slate-800 font-black">Le Fournisseur B2B</p>
              <p v-if="purchase?.status === 'Sent'" class="mt-4 text-amber-600 italic font-black">[ En attente de signature ]</p>
              <p v-else class="mt-4 text-emerald-700 font-black italic">[ Validé &amp; Livré ]</p>
            </div>
          </div>
        </div>
      </div>

      <!-- PIPELINE / METADATA COLUMN -->
      <div class="space-y-6">
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 md:p-6 space-y-4 shadow-sm">
          <h3 class="text-xs uppercase font-mono tracking-wider text-[var(--color-primary)] font-bold">Pipeline d'Approvisionnement</h3>
          
          <div class="space-y-4 relative pl-4 border-l border-[var(--color-border)]">
            <div 
              v-for="(ev, idx) in timelineEvents" 
              :key="idx" 
              class="relative"
            >
              <span 
                class="absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center text-[7px]"
                :class="ev.done ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-slate-950 font-bold' : 'bg-[var(--color-surface-elevated)] border-[var(--color-border)] text-[var(--color-text-secondary)]'"
              >
                ✓
              </span>
              
              <div class="space-y-0.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold leading-none" :class="ev.done ? 'text-[var(--color-text-primary)] font-extrabold' : 'text-[var(--color-text-secondary)]'">
                    {{ ev.label }}
                  </span>
                </div>
                <p class="text-[10px] text-[var(--color-text-secondary)] leading-relaxed">{{ ev.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 md:p-6 space-y-3 shadow-sm">
          <h3 class="text-xs uppercase font-mono tracking-wider text-[var(--color-text-primary)] font-bold">Informations Clés</h3>
          <div class="divide-y divide-[var(--color-border)] text-[11px] font-mono text-[var(--color-text-secondary)]">
            <div class="py-2 flex justify-between">
              <span>Référence PO :</span>
              <span class="text-[var(--color-text-primary)] font-bold">{{ purchase?.id }}</span>
            </div>
            <div class="py-2 flex justify-between">
              <span>Date de Commande :</span>
              <span class="text-[var(--color-text-primary)]">{{ formatDate(purchase?.date) }}</span>
            </div>
            <div class="py-2 flex justify-between">
              <span>Livraison Prévue :</span>
              <span class="text-[var(--color-primary)]">{{ formatDate(purchase?.expectedDate) }}</span>
            </div>
            <div class="py-2 flex justify-between">
              <span>Mode de Paiement :</span>
              <span class="text-[var(--color-text-primary)]">{{ purchase?.paymentMethod === 'Escrow' ? 'Séquestre' : 'Espèces' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { b2b_purchases, b2b_suppliers, products } from '@/utils/vendor_db.js';
import { useToast } from 'vue-toastification';

const route = useRoute();
const toast = useToast();
const purchaseId = route.params.id;

const purchase = computed(() => {
  return b2b_purchases.value?.find(p => p.id === purchaseId) || b2b_purchases.value?.[0];
});

const timelineEvents = computed(() => {
  if (!purchase.value) return [];
  return [
    { label: '1. Bon de Commande Soumis', done: true, desc: 'Requis d\'approvisionnement émis et envoyé au fournisseur B2B.' },
    { label: '2. En Transit Logistique', done: ['In Transit', 'Received'].includes(purchase.value.status), desc: 'Les marchandises ont quitté les hubs du fournisseur.' },
    { label: '3. Livré & Clôturé', done: purchase.value.status === 'Received', desc: 'Réception signée électroniquement, stocks rechargés.' }
  ];
});

function getSupplierName(id) {
  const found = b2b_suppliers.value.find(s => s.id === id);
  return found ? found.name : id;
}

function getProductName(id) {
  const found = products.value.find(p => p.id === id);
  return found ? found.name : id;
}

function printDocument() {
  if (!['In Transit', 'Received'].includes(purchase.value?.status)) {
    toast.error("Impression impossible : En attente d'émission du Bon de Livraison (BL)");
    return;
  }
  window.print();
  toast.info('Impression du document lancée.');
}

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val || 0).replace('XAF', 'FCFA');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR');
}
</script>
