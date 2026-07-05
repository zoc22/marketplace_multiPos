<template>
  <div class="space-y-6 max-w-7xl mx-auto" id="admin-escrow-index">
    <!-- PANEL HEADER -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 gap-4 shadow-sm">
      <div>
        <h1 class="text-xl font-bold font-mono text-[var(--color-text-primary)] flex items-center gap-2">
          <span>Gestion des Paiements Séquestrés</span>
        </h1>
        <p class="text-xs text-[var(--color-text-secondary)]">Suivi et déblocage manuel des fonds sécurisés de la plateforme B2B.</p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Rechercher par référence..." 
          class="bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2 text-xs font-mono text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] w-full sm:w-60"
        />
        <select 
          v-model="statusFilter"
          class="bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-3 py-2 text-xs font-mono text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] w-full sm:w-44"
        >
          <option value="ALL">Tous les statuts</option>
          <option value="INITIATED">Initié</option>
          <option value="ESCROWED">Séquestré</option>
          <option value="RELEASED">Libéré</option>
          <option value="REFUNDED">Remboursé</option>
        </select>
      </div>
    </div>

    <!-- ESCROW TABLE -->
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs font-sans">
          <thead>
            <tr class="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
              <th class="p-4 pl-6">Référence</th>
              <th class="p-4">Commande</th>
              <th class="p-4">Payeur</th>
              <th class="p-4">Bénéficiaire</th>
              <th class="p-4 text-right">Montant</th>
              <th class="p-4 text-center">Statut</th>
              <th class="p-4 text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr 
              v-for="payment in filteredPayments" 
              :key="payment.id"
              class="hover:bg-[var(--color-surface-hover)]/40 text-[var(--color-text-secondary)] transition"
            >
              <td class="p-4 pl-6 font-mono font-bold text-[var(--color-primary)]">
                {{ payment.reference }}
              </td>
              <td class="p-4 font-mono text-[var(--color-text-primary)]">
                #{{ getOrderRef(payment.purchase_order_id) }}
              </td>
              <td class="p-4 font-semibold text-[var(--color-text-primary)]">
                {{ payment.payer_id }} ({{ payment.payer_type === 'distributor' ? 'Distributeur' : 'Marchand' }})
              </td>
              <td class="p-4 font-semibold text-[var(--color-primary)]">
                {{ payment.receiver_id }} ({{ payment.receiver_type === 'vendor' ? 'Vendeur' : 'Fournisseur' }})
              </td>
              <td class="p-4 text-right font-mono font-bold text-[var(--color-text-primary)]">
                {{ formatMoney(payment.amount) }}
              </td>
              <td class="p-4 text-center">
                <span class="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase" :class="getStatusClasses(payment.status)">
                  {{ payment.status === 'INITIATED' ? 'Initié' : payment.status === 'ESCROWED' ? 'Séquestré' : payment.status === 'RELEASED' ? 'Libéré' : payment.status === 'REFUNDED' ? 'Remboursé' : 'Libération en attente' }}
                </span>
              </td>
              <td class="p-4 text-right pr-6 space-x-2">
                <router-link
                  :to="'/admin/escrow/' + payment.id"
                  class="px-2.5 py-1.5 bg-[var(--color-surface-elevated)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] font-mono text-[10px] font-bold rounded-lg border border-[var(--color-border)] transition"
                >
                  Détails
                </router-link>
                <router-link
                  v-if="payment.status === 'ESCROWED'"
                  :to="'/admin/escrow/' + payment.id + '/release'"
                  class="px-2.5 py-1.5 bg-emerald-650 hover:opacity-90 text-white font-mono text-[10px] font-bold rounded-lg transition"
                >
                  Libérer
                </router-link>
                <router-link
                  v-if="payment.status === 'ESCROWED'"
                  :to="'/admin/escrow/' + payment.id + '/refund'"
                  class="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-mono text-[10px] font-bold rounded-lg transition"
                >
                  Rembourser
                </router-link>
              </td>
            </tr>
            <tr v-if="filteredPayments.length === 0">
              <td colspan="7" class="p-8 text-center text-sm text-[var(--color-text-secondary)] font-mono italic">
                Aucun paiement sous séquestre trouvé.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { usePaymentsStore } from '@/store/modules/payments.js';
import { useOrdersStore } from '@/store/modules/orders.js';

const paymentsStore = usePaymentsStore();
const ordersStore = useOrdersStore();

const searchQuery = ref('');
const statusFilter = ref('ALL');

const filteredPayments = computed(() => {
  return paymentsStore.escrowPayments.filter(p => {
    const matchStatus = statusFilter.value === 'ALL' || p.status === statusFilter.value;
    const matchQuery = !searchQuery.value || p.reference.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchStatus && matchQuery;
  });
});

function getOrderRef(poId) {
  const po = ordersStore.purchaseOrders.find(o => o.id === poId);
  return po ? po.reference : poId;
}

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val || 0).replace('XAF', 'FCFA');
}

function getStatusClasses(status) {
  const classes = {
    'INITIATED': 'bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] border border-[var(--color-border)]',
    'ESCROWED': 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
    'RELEASED': 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
    'REFUNDED': 'bg-red-500/10 text-red-500 border border-red-500/20',
    'PENDING_RELEASE': 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
  };
  return classes[status] || 'bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)]';
}
</script>
