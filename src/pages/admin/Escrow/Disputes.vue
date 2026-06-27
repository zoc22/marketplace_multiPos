<template>
  <div class="space-y-6 max-w-7xl mx-auto" id="admin-escrow-disputes">
    <!-- PANEL HEADER -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between bg-slate-900 border border-slate-800 rounded-xl p-6 gap-4 shadow-sm animate-fade-in">
      <div>
        <h1 class="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
          <span>Centre d'Arbitrage des Litiges B2B</span>
        </h1>
        <p class="text-xs text-slate-400">Gérez les réclamations et arbitrez les différends commerciaux de la plateforme.</p>
      </div>
    </div>

    <!-- DISPUTES REGISTRY -->
    <div class="bg-[#14141E] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs font-sans">
          <thead>
            <tr class="text-[10px] font-mono text-slate-400 uppercase border-b border-slate-800 bg-slate-900/60">
              <th class="p-4 pl-6">Référence Litige</th>
              <th class="p-4">Référence Séquestre</th>
              <th class="p-4">Initiateur</th>
              <th class="p-4">Date de Déclaration</th>
              <th class="p-4 text-center">Statut</th>
              <th class="p-4 text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr 
              v-for="dispute in disputesStore.disputes" 
              :key="dispute.id"
              class="hover:bg-slate-900/30 text-slate-350 transition"
            >
              <td class="p-4 pl-6 font-mono font-bold text-indigo-400">
                {{ dispute.reference }}
              </td>
              <td class="p-4 font-mono">
                #{{ getEscrowRef(dispute.escrow_payment_id) }}
              </td>
              <td class="p-4 font-semibold text-slate-200">
                {{ dispute.initiator_id }} ({{ dispute.initiator_type }})
              </td>
              <td class="p-4 text-slate-455 font-mono">
                {{ formatDate(dispute.date_opened) }}
              </td>
              <td class="p-4 text-center">
                <span 
                  class="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase"
                  :class="dispute.status === 'OPEN' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'"
                >
                  {{ dispute.status }}
                </span>
              </td>
              <td class="p-4 text-right pr-6">
                <router-link
                  :to="'/admin/escrow/disputes/' + dispute.id"
                  class="px-3.5 py-1.5 bg-indigo-650 hover:bg-indigo-700 text-white font-mono text-[10px] font-bold rounded-lg transition"
                >
                  Résoudre / Arbitrer
                </router-link>
              </td>
            </tr>
            <tr v-if="disputesStore.disputes.length === 0">
              <td colspan="6" class="p-8 text-center text-sm text-slate-500 font-mono italic">
                Aucun dossier de litige actif sur la plateforme.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDisputesStore } from '@/store/modules/disputes.js';
import { usePaymentsStore } from '@/store/modules/payments.js';

const disputesStore = useDisputesStore();
const paymentsStore = usePaymentsStore();

function getEscrowRef(paymentId) {
  const p = paymentsStore.escrowPayments.find(pay => pay.id === paymentId);
  return p ? p.reference : paymentId;
}

function formatDate(dateVal) {
  if (!dateVal) return 'N/A';
  return new Date(dateVal).toLocaleDateString('fr-FR');
}
</script>
