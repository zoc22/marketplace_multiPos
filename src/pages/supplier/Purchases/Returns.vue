<template>
  <div class="space-y-6">
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm">
      <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Retours fournisseur</h1>
      <p class="text-sm text-[var(--color-text-secondary)] mt-1">Gérez les retours de marchandises défectueuses ou non conformes.</p>
    </div>
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[var(--color-surface-elevated)] border-b border-[var(--color-border)] text-xs font-mono text-[var(--color-text-secondary)] uppercase">
              <th class="p-4">Référence</th>
              <th class="p-4">BC lié</th>
              <th class="p-4">Acheteur</th>
              <th class="p-4">Date</th>
              <th class="p-4 text-center">Statut</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in returnsList" :key="r.id" class="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]">
              <td class="p-4 font-mono font-bold text-[var(--color-text-primary)]">{{ r.reference }}</td>
              <td class="p-4">{{ r.parent_order_id }}</td>
              <td class="p-4">{{ r.buyer_name }}</td>
              <td class="p-4">{{ formatDate(r.created_at) }}</td>
              <td class="p-4 text-center"><span class="px-3 py-1 rounded-full text-xs font-mono" :class="getStatusClasses(r.status)">{{ r.status }}</span></td>
              <td class="p-4 text-right">
                <div class="flex items-center justify-end space-x-2">
                  <button @click="openReturnDetail(r)" class="px-3 py-1.5 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg text-xs">Détail</button>
                  <button v-if="r.status === 'Requested'" @click="convertToBC(r)" class="px-3 py-1.5 bg-[var(--color-primary)] text-white rounded-lg text-xs">Traiter comme BC</button>
                  <button v-if="r.status === 'Requested'" @click="rejectReturn(r)" class="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs">Rejeter</button>
                </div>
              </td>
            </tr>
            <tr v-if="returnsList.length === 0"><td colspan="6" class="p-6 text-center text-[var(--color-text-secondary)]">Aucun retour</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { returns, orders } from '@/utils/supplier_db.js';
import { ref, computed } from 'vue';

const returnsList = computed(() => returns.value || []);

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleString('fr-FR');
}

function getStatusClasses(s) {
  if (s === 'Requested') return 'bg-amber-50 text-amber-700 border border-amber-200';
  if (s === 'TreatedAsBC') return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
  if (s === 'Accepted') return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  if (s === 'Rejected') return 'bg-red-50 text-red-700 border border-red-200';
  return 'bg-slate-50 text-slate-600 border border-slate-200';
}

function openReturnDetail(r) {
  // Simple detail: show JSON in alert for now
  alert(JSON.stringify(r, null, 2));
}

async function convertToBC(r) {
  // Mark as treated and create a BC linked entry
  r.status = 'TreatedAsBC';
  const newBcId = 'BC-RET-' + new Date().toISOString().replace(/[^0-9]/g,'').slice(0,12);
  r.linked_bc_id = newBcId;
  // Create a minimal BC in orders for vendor processing
  orders.value.unshift({ id: newBcId, reference: newBcId, clientId: r.buyer_id, clientName: r.buyer_name, items: r.items.map(i => ({ productId: i.productId, productName: i.productName, quantity: i.returnQty, unitPrice: 0 })), subtotal: 0, tax: 0, shippingFee: 0, total: 0, status: 'Submitted', created_at: new Date().toISOString(), history: [{ status: 'Submitted', timestamp: new Date().toISOString(), label: 'BC créé via traitement de retour' }] });
}

function rejectReturn(r) {
  r.status = 'Rejected';
}
</script>
