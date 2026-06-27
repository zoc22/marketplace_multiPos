<template>
  <div class="space-y-6 max-w-5xl mx-auto" id="buyer-orders-detail">
    <!-- PANEL HEADER / ACTIONS -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--color-border)] pb-4 gap-4 select-none">
      <div class="space-y-1">
        <router-link to="/buyer/orders" class="text-sm text-[var(--color-primary)] font-mono hover:underline flex items-center space-x-2">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span>Retour à l'historique</span>
        </router-link>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
          <span>Détail du Bon de Commande</span>
          <span class="text-[var(--color-primary)] font-mono text-base">#{{ order?.reference || 'N/A' }}</span>
          <StatusBadge v-if="order" :status="order.status" class="ml-2" />
        </h1>
      </div>
      
      <div class="flex gap-2 shrink-0 items-center">
        <!-- Print Button -->
        <PrintButton 
          v-if="order" 
          :documentTitle="'Bon_de_Commande_' + order.reference" 
          label="Imprimer Bon" 
        />

        <button 
          v-if="order?.status === 'DELIVERED'"
          disabled
          class="px-4 py-2 bg-emerald-500/10 text-emerald-500 font-mono text-xs font-bold rounded-xl border border-emerald-500/20 flex items-center space-x-1.5"
        >
          ✓ Réception Complétée
        </button>
        <router-link
          v-else-if="order?.status === 'PROCESSING'"
          :to="'/buyer/confirm-delivery/' + orderId"
          class="px-4 py-2 bg-[var(--color-primary)] hover:opacity-90 text-white font-mono text-xs font-bold rounded-xl transition flex items-center space-x-1.5"
          id="btn-confirm-reception"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Confirmer Réception</span>
        </router-link>
      </div>
    </div>

    <!-- MAIN GRID -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- DETAILS SHEET -->
      <div class="lg:col-span-2 space-y-6">
        <PrintTemplate 
          v-if="order"
          title="BON DE COMMANDE ACHETEUR" 
          :reference="order.reference" 
          :date="order.date_emission"
        >
          <!-- Stamp watermark -->
          <div 
            v-if="order?.status === 'DELIVERED'"
            class="absolute top-24 right-12 border-4 border-emerald-600 text-emerald-600 font-mono font-black uppercase text-xs px-3 py-1.5 rounded-lg -rotate-12 select-none opacity-80"
          >
            ÉMARGÉ ✓
          </div>

          <!-- Parties details -->
          <div class="grid grid-cols-2 gap-6 py-6 border-b border-slate-200 text-sm">
            <div class="space-y-1">
              <span class="block text-xs font-mono text-slate-400 uppercase tracking-wider font-extrabold">Fournisseur Destinataire</span>
              <p class="text-base font-extrabold text-slate-800">{{ order?.receiver_id }} ({{ order?.receiver_type }})</p>
            </div>
            <div class="space-y-1">
              <span class="block text-xs font-mono text-slate-400 uppercase tracking-wider font-extrabold">Adresse de Livraison</span>
              <p class="text-slate-650 text-xs font-medium">{{ order?.shipping_address || 'Non spécifiée' }}</p>
            </div>
          </div>

          <!-- Items list -->
          <div class="py-6">
            <table class="w-full text-left text-sm border-collapse">
              <thead>
                <tr class="border-b border-slate-350 text-xs text-slate-600 font-mono uppercase font-black bg-slate-50">
                  <th class="py-3 px-3 border border-slate-200">Produit</th>
                  <th class="py-3 px-3 border border-slate-200 text-center">Quantité</th>
                  <th class="py-3 px-3 border border-slate-200 text-right">Prix Unitaire</th>
                  <th class="py-3 px-3 border border-slate-200 text-right">Montant HT</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="(item, idx) in order?.products" 
                  :key="idx"
                  class="text-slate-800 border-b border-slate-200"
                >
                  <td class="py-3.5 px-3 border border-slate-200 font-semibold">{{ item.product_id }}</td>
                  <td class="py-3.5 px-3 border border-slate-200 text-center font-mono font-bold">{{ item.quantity }}</td>
                  <td class="py-3.5 px-3 border border-slate-200 text-right font-mono">{{ formatMoney(item.unit_price) }}</td>
                  <td class="py-3.5 px-3 border border-slate-200 text-right font-mono font-bold text-slate-950">{{ formatMoney(item.quantity * item.unit_price) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex justify-end pt-4 border-t border-slate-200">
            <div class="w-72 space-y-1.5 text-xs font-mono text-slate-605 font-extrabold">
              <div class="flex justify-between border-b border-slate-200 pb-2">
                <span>CONTRAT SOUS-TOTAL:</span>
                <span>{{ formatMoney(order?.total) }}</span>
              </div>
              <div class="flex justify-between text-slate-900 pt-3 text-sm font-sans font-black">
                <span>VALEUR TTC :</span>
                <span>{{ formatMoney(order?.total) }}</span>
              </div>
            </div>
          </div>
        </PrintTemplate>
      </div>

      <!-- TIMELINE COLUMN -->
      <div class="space-y-6">
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 space-y-4 shadow-sm">
          <div class="flex items-center justify-between">
            <h3 class="text-xs uppercase font-mono tracking-wider text-[var(--color-primary)] font-bold">Pipeline d'Approvisionnement</h3>
            <!-- Help Icon -->
            <button @click="showHelp = !showHelp" class="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] rounded-full hover:bg-[var(--color-surface-hover)] transition" title="Aide sur les processus">
              <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </button>
          </div>

          <!-- Non-invasive help alert -->
          <div v-if="showHelp" class="p-3 bg-[var(--color-primary-muted)] text-[var(--color-text-primary)] rounded-lg text-xs space-y-1.5 border border-[var(--color-primary-border)]">
            <p class="font-bold flex items-center space-x-1">
              <span>🛡️ Système de paiement Séquestre</span>
            </p>
            <ol class="list-decimal pl-4 space-y-1 text-[11px] text-[var(--color-text-secondary)]">
              <li>L'argent est déduit de votre solde et bloqué par l'admin (séquestre).</li>
              <li>Le fournisseur prépare et expédie le bon de livraison.</li>
              <li>Vous confirmez la réception conforme. Le statut passe en attente de libération.</li>
              <li>Après validation administrative ou fin de délai, les fonds sont versés au fournisseur.</li>
            </ol>
          </div>

          <OrderTimeline 
            v-if="order" 
            :status="order.status" 
            :dates="{ 
              emission: order.date_emission, 
              validation: order.date_validation, 
              processing: order.date_processing, 
              transit: order.date_transit, 
              delivery: order.date_livraison 
            }" 
          />
        </div>

        <!-- Escrow/Dispute Action Card -->
        <div v-if="order && order.status === 'DELIVERED'" class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 space-y-4 shadow-sm">
          <h3 class="text-xs uppercase font-mono tracking-wider text-red-500 font-bold">Signalement &amp; Litige</h3>
          <p class="text-xs text-[var(--color-text-secondary)]">Si les articles reçus ne sont pas conformes, vous pouvez ouvrir un litige pour suspendre le paiement.</p>
          
          <div v-if="existingDispute" class="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl space-y-1.5">
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold text-red-600 font-mono">LITIGE {{ existingDispute.reference }}</span>
              <span class="px-2 py-0.5 bg-red-500/20 text-red-600 rounded text-[9px] font-bold">{{ existingDispute.status }}</span>
            </div>
            <p class="text-xs text-[var(--color-text-secondary)]"><span class="font-bold">Raison :</span> {{ existingDispute.reason }}</p>
            <p class="text-[11px] text-[var(--color-text-muted)]">{{ existingDispute.description }}</p>
          </div>
          
          <button 
            v-else
            @click="isDisputeModalOpen = true"
            class="w-full py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold font-mono rounded-xl transition flex items-center justify-center space-x-1"
          >
            <span>⚠️ Signaler un problème / Litige</span>
          </button>
        </div>
      </div>
    </div>

    <!-- DISPUTE MODAL -->
    <div v-if="isDisputeModalOpen" @click.self="isDisputeModalOpen = false" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="bg-[var(--color-surface)] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-[var(--color-border)] p-6 space-y-4">
        <h3 class="text-lg font-bold text-[var(--color-text-primary)]">Déclarer un Litige</h3>
        <p class="text-xs text-[var(--color-text-secondary)]">Veuillez spécifier la raison pour laquelle les produits livrés ne conviennent pas.</p>
        
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Raison du litige</label>
            <select v-model="disputeForm.reason" class="w-full p-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)]">
              <option value="Articles non conformes">Articles non conformes (Erreur produit)</option>
              <option value="Qualité insuffisante / Endommagé">Qualité insuffisante ou produits cassés</option>
              <option value="Quantités réelles manquantes">Quantités livrées inférieures au bon</option>
              <option value="Autre motif">Autre motif exceptionnel</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Description détaillée</label>
            <textarea v-model="disputeForm.description" rows="3" placeholder="Expliquez en détail le problème rencontré avec la livraison..." class="w-full p-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)]"></textarea>
          </div>
        </div>

        <div class="flex justify-end space-x-2 pt-2">
          <button @click="isDisputeModalOpen = false" class="px-4 py-2 text-xs font-bold bg-[var(--color-surface-hover)] border rounded-xl">Annuler</button>
          <button @click="submitDispute" :disabled="!disputeForm.description" class="px-4 py-2 text-xs font-bold bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50">Soumettre le litige</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useOrdersStore } from '@/store/modules/orders.js';
import { useDisputesStore } from '@/store/modules/disputes.js';
import { usePaymentsStore } from '@/store/modules/payments.js';
import { useToast } from 'vue-toastification';
import StatusBadge from '@/components/common/StatusBadge.vue';
import OrderTimeline from '@/components/common/OrderTimeline.vue';
import PrintButton from '@/components/print/PrintButton.vue';
import PrintTemplate from '@/components/print/PrintTemplate.vue';

const route = useRoute();
const toast = useToast();
const ordersStore = useOrdersStore();
const disputesStore = useDisputesStore();
const paymentsStore = usePaymentsStore();
const orderId = route.params.id;

const showHelp = ref(false);
const isDisputeModalOpen = ref(false);
const disputeForm = ref({
  reason: 'Articles non conformes',
  description: ''
});

const order = computed(() => {
  return ordersStore.purchaseOrders.find(o => o.id === orderId);
});

const existingDispute = computed(() => {
  return disputesStore.disputes.find(d => d.purchase_order_id === orderId || d.order_id === orderId);
});

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val || 0).replace('XAF', 'FCFA');
}

function submitDispute() {
  const payment = paymentsStore.escrowPayments.find(p => p.purchase_order_id === orderId || p.order_id === orderId);
  if (!payment) {
    toast.error('Paiement séquestre introuvable pour cette commande.');
    return;
  }

  disputesStore.createDispute({
    escrow_payment_id: payment.id,
    initiator_id: 'usr_buyer_1',
    initiator_type: 'buyer',
    purchase_order_id: orderId,
    reason: disputeForm.value.reason,
    description: disputeForm.value.description
  });

  isDisputeModalOpen.value = false;
  toast.warning('Votre litige a été ouvert. Le Super Admin va examiner la situation.');
}
</script>
