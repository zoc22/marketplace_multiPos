<template>
  <div class="space-y-6 max-w-5xl mx-auto" id="admin-escrow-detail">
    <!-- PANEL HEADER / ACTIONS -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4 select-none">
      <div class="space-y-1">
        <router-link to="/admin/finance/escrow" class="text-sm text-indigo-400 font-mono hover:underline flex items-center space-x-2">
          <span>&larr; Retour aux séquestres</span>
        </router-link>
        <h1 class="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <span>Détail du Paiement Séquestré</span>
          <span class="text-indigo-400 font-mono text-base">#{{ payment?.reference }}</span>
        </h1>
      </div>
      
      <div v-if="payment?.status === 'ESCROWED'" class="flex gap-2 shrink-0">
        <router-link
          :to="'/admin/escrow/' + paymentId + '/release'"
          class="px-4 py-2 bg-emerald-650 hover:bg-emerald-700 text-white font-mono text-xs font-bold rounded-xl transition flex items-center space-x-1.5"
        >
          Libérer les fonds
        </router-link>
        <router-link
          :to="'/admin/escrow/' + paymentId + '/refund'"
          class="px-4 py-2 bg-red-650 hover:bg-red-700 text-white font-mono text-xs font-bold rounded-xl transition flex items-center space-x-1.5"
        >
          Rembourser
        </router-link>
      </div>
    </div>

    <!-- MAIN PANELS -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs font-sans text-slate-300">
      <div class="lg:col-span-2 space-y-6">
        <!-- SPECIFICATIONS CARD -->
        <div class="bg-[#14141E] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 class="font-bold text-sm text-slate-100 font-mono uppercase">Spécifications du Séquestre</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-slate-500 font-mono">Date d'initialisation :</span>
              <p class="font-semibold">{{ formatDate(payment?.date_initiated) }}</p>
            </div>
            <div>
              <span class="text-slate-500 font-mono">Date de blocage (Escrowed) :</span>
              <p class="font-semibold">{{ formatDate(payment?.date_escrowed) }}</p>
            </div>
            <div>
              <span class="text-slate-500 font-mono">Montant total sécurisé :</span>
              <p class="font-bold text-slate-100 font-mono text-sm">{{ formatMoney(payment?.amount) }}</p>
            </div>
            <div>
              <span class="text-slate-500 font-mono">Statut du paiement :</span>
              <p class="font-bold text-indigo-400">{{ payment?.status }}</p>
            </div>
          </div>
        </div>

        <!-- ASSOCIATED ORDER DETAILS -->
        <div class="bg-[#14141E] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 class="font-bold text-sm text-slate-100 font-mono uppercase">Commande Associée</h3>
          <div class="space-y-2">
            <div>
              <span class="text-slate-500 font-mono">Référence du Bon de commande :</span>
              <p class="font-semibold text-indigo-400">#{{ order?.reference || 'N/A' }}</p>
            </div>
            <div>
              <span class="text-slate-500 font-mono">Payeur (Buyer) :</span>
              <p class="font-semibold text-slate-200">{{ payment?.payer_id }}</p>
            </div>
            <div>
              <span class="text-slate-500 font-mono">Bénéficiaire (Vendor) :</span>
              <p class="font-semibold text-slate-200">{{ payment?.receiver_id }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- SIDEBAR HISTORY -->
      <div class="space-y-6">
        <div class="bg-[#14141E] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 class="font-bold text-xs uppercase text-slate-400 font-mono tracking-wider">Historique du paiement</h3>
          <div class="space-y-4 pl-4 border-l border-slate-800 relative">
            <div class="relative">
              <span class="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-indigo-500 border border-[#14141E]"></span>
              <div>
                <span class="font-mono font-bold text-slate-200">Initié</span>
                <p class="text-[10px] text-slate-500">{{ formatDate(payment?.date_initiated) }}</p>
              </div>
            </div>
            <div v-if="payment?.date_escrowed" class="relative">
              <span class="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-amber-500 border border-[#14141E]"></span>
              <div>
                <span class="font-mono font-bold text-slate-200">Séquestré</span>
                <p class="text-[10px] text-slate-500">{{ formatDate(payment?.date_escrowed) }}</p>
              </div>
            </div>
            <div v-if="payment?.date_released" class="relative">
              <span class="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-emerald-500 border border-[#14141E]"></span>
              <div>
                <span class="font-mono font-bold text-slate-200">Libéré</span>
                <p class="text-[10px] text-slate-500">{{ formatDate(payment?.date_released) }}</p>
              </div>
            </div>
            <div v-if="payment?.date_refunded" class="relative">
              <span class="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-red-500 border border-[#14141E]"></span>
              <div>
                <span class="font-mono font-bold text-slate-200">Remboursé</span>
                <p class="text-[10px] text-slate-500">{{ formatDate(payment?.date_refunded) }}</p>
              </div>
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
import { usePaymentsStore } from '@/store/modules/payments.js';
import { useOrdersStore } from '@/store/modules/orders.js';

const route = useRoute();
const paymentsStore = usePaymentsStore();
const ordersStore = useOrdersStore();
const paymentId = route.params.id;

const payment = computed(() => {
  return paymentsStore.escrowPayments.find(p => p.id === paymentId);
});

const order = computed(() => {
  if (!payment.value) return null;
  return ordersStore.purchaseOrders.find(o => o.id === payment.value.purchase_order_id);
});

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val || 0).replace('XAF', 'FCFA');
}

function formatDate(dateVal) {
  if (!dateVal) return 'N/A';
  return new Date(dateVal).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
</script>
