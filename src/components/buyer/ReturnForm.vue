<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
    <div class="bg-[var(--color-surface)] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-[var(--color-border)] p-6 space-y-4">
      <div class="flex justify-between items-center border-b border-[var(--color-border)] pb-3">
        <div>
          <h3 class="text-sm font-bold text-[var(--color-text-primary)] font-mono">Déclarer un Bon de Retour</h3>
          <p class="text-[10px] text-[var(--color-text-secondary)] font-mono mt-0.5">Vérifiez les lignes et indiquez les quantités à retourner.</p>
        </div>
        <button @click="$emit('close')" class="text-sm text-[var(--color-text-secondary)] hover:text-red-500 font-mono cursor-pointer font-bold">[ Fermer ]</button>
      </div>

      <div>
        <div class="overflow-x-auto border border-[var(--color-border)] rounded-xl">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-[var(--color-surface-elevated)] border-b border-[var(--color-border)] text-[10px] font-mono text-[var(--color-text-secondary)] uppercase">
                <th class="p-3">Produit</th>
                <th class="p-3 text-center">Qté BL</th>
                <th class="p-3 text-center">Qté à retourner</th>
                <th class="p-3">Commentaire</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(line, idx) in localItems" :key="idx" class="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition">
                <td class="p-3 font-bold text-[var(--color-text-primary)]">{{ line.productName || line.product_id }}</td>
                <td class="p-3 text-center font-mono">{{ line.quantity || line.qty || line.qtyExpected || line.originalQty || 0 }}</td>
                <td class="p-3 text-center">
                  <input type="number" min="0" :max="line.quantity || line.qty || line.qtyExpected || line.originalQty || 0" v-model.number="line.returnQty" class="w-20 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-2 py-1 text-xs font-mono text-[var(--color-text-primary)]" />
                </td>
                <td class="p-3">
                  <input type="text" v-model="line.comment" placeholder="Observation (ex: emballage abîmé)" class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-2 py-1 text-xs font-mono text-[var(--color-text-primary)]" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <label class="block mt-3">
          <span class="block text-[10px] uppercase font-mono text-[var(--color-text-secondary)] mb-1">Motif général</span>
          <select v-model="reason" class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-xs text-[var(--color-text-primary)] focus:outline-none font-mono">
            <option value="Quantité manquante">Quantité manquante</option>
            <option value="Article non conforme">Article non conforme</option>
            <option value="Dommage / Défectueux">Dommage / Défectueux</option>
            <option value="Autre">Autre</option>
          </select>
        </label>

        <label class="block mt-2">
          <span class="block text-[10px] uppercase font-mono text-[var(--color-text-secondary)] mb-1">Commentaire global</span>
          <textarea v-model="globalComment" rows="3" class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-xs font-mono text-[var(--color-text-primary)]"></textarea>
        </label>

        <div class="flex justify-end mt-4 space-x-2">
          <button @click="$emit('close')" class="px-3 py-1.5 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg text-xs font-mono">Annuler</button>
          <button @click="submitReturn" class="px-3 py-1.5 bg-[var(--color-primary)] text-white rounded-lg text-xs font-mono">Soumettre le bon de retour</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { returns } from '@/utils/supplier_db.js';

const props = defineProps({ items: Array, orderId: String, supplierId: String, supplierName: String, buyerId: String, buyerName: String });
const emit = defineEmits(['close','created']);

const localItems = reactive((props.items || []).map(i => ({
  productId: i.productId || i.product_id || i.id,
  productName: i.productName || i.product_name || i.name,
  quantity: i.quantity || i.qty || i.qtyExpected || i.originalQty || 0,
  returnQty: 0,
  comment: ''
})));

let reason = 'Quantité manquante';
let globalComment = '';

function submitReturn() {
  const picked = localItems.filter(l => l.returnQty && l.returnQty > 0).map(l => ({ productId: l.productId, productName: l.productName, originalQty: l.quantity, returnQty: l.returnQty, comment: l.comment }));
  if (picked.length === 0) return alert('Veuillez indiquer au moins une quantité à retourner.');

  const id = 'RET-' + new Date().toISOString().replace(/[^0-9]/g,'').slice(0,14);
  const newReturn = {
    id,
    reference: id,
    parent_order_id: props.orderId || null,
    parent_delivery_note_id: null,
    buyer_id: props.buyerId || null,
    buyer_name: props.buyerName || '',
    supplier_id: props.supplierId || null,
    supplier_name: props.supplierName || '',
    created_at: new Date().toISOString(),
    status: 'Requested',
    reason,
    items: picked,
    comments: [{ author: props.buyerName || 'Acheteur', text: globalComment || '', date: new Date().toISOString() }],
    linked_bc_id: props.orderId || null
  };

  returns.value.unshift(newReturn);
  emit('created', newReturn);
  emit('close');
}
</script>

<style scoped>
</style>
