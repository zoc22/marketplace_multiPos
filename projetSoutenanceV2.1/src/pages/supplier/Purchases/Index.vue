<template>
  <div class="space-y-6">
    
    <!-- Top HUD -->
    <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div>
        <h1 class="text-xl font-bold text-slate-100">Procurements &amp; Restock purchases (Achats PO)</h1>
        <p class="text-xs text-slate-400 mt-1">Manage outbound agreements to farmers, raw materials harvesters, and logistics partners.</p>
      </div>

      <button 
        @click="openCreatePurchasePopup"
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold rounded-xl shadow-lg transition uppercase shrink-0"
      >
        + Add Restock Purchase
      </button>
    </div>

    <!-- MAIN TABLE -->
    <div class="bg-[#080d22] border border-slate-900 rounded-xl overflow-hidden shadow-xl">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse select-none">
          <thead>
            <tr class="bg-indigo-950/20 border-b border-indigo-950 text-[#5d6a94] font-mono uppercase tracking-wider text-[10px]">
              <th class="p-4">PO Code</th>
              <th class="p-4">Sourcing Partner</th>
              <th class="p-4">Requested Assets</th>
              <th class="p-4">Procurement Date</th>
              <th class="p-4 font-mono text-right">Sum total</th>
              <th class="p-4 text-center">Receipt Status</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-900">
            <tr 
              v-for="po in purchases" 
              :key="po.id"
              class="hover:bg-slate-900/40 transition text-slate-300"
            >
              <td class="p-4 font-mono font-bold text-indigo-400">{{ po.id }}</td>
              <td class="p-4 font-bold">{{ po.supplier }}</td>
              <td class="p-4 text-slate-350 italic">“{{ po.items }}”</td>
              <td class="p-4 text-slate-400 font-mono">{{ po.date }}</td>
              <td class="p-4 font-mono text-right font-bold text-slate-100">
                {{ formatCurrency(po.amount) }} FCFA
              </td>
              <td class="p-4 text-center">
                <span 
                  class="px-2 py-0.5 rounded text-[8.5px] font-semibold font-mono uppercase"
                  :class="getStatusPillClass(po.status)"
                >
                  {{ po.status }}
                </span>
              </td>
              <td class="p-4 text-right">
                <div class="inline-flex items-center gap-2">
                  <button 
                    @click="openEditPurchasePopup(po)"
                    class="p-1 px-2 bg-slate-900 text-slate-350 hover:bg-slate-800 hover:text-white rounded text-[10px] font-mono border border-slate-850"
                  >
                    ✏️ Configure
                  </button>
                  <button 
                    @click="triggerDeletePurchaseConfirmation(po)"
                    class="p-1 px-2.5 bg-red-950/20 text-red-400 hover:bg-red-900 hover:text-slate-950 rounded text-[10px] font-mono border border-red-900/30 font-bold"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- POPUPS -->
    <!-- 1. CREATE / EDIT PURCHASE -->
    <div v-if="showPurchasePopup" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-[#0b1029] border border-indigo-900/90 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative overflow-hidden animate-fade-in text-slate-100">
        <div class="flex justify-between items-start border-b border-indigo-950 pb-3 mb-4">
          <div>
            <span class="text-[9px] font-mono text-indigo-400 px-1.5 py-0.5 rounded bg-indigo-950 font-bold uppercase">OUTBOUND SOURCING AGREEMENT</span>
            <h3 class="text-sm font-bold font-mono tracking-wide mt-1">
              {{ isEditing ? 'MODIFY PURCHASE ORDER (PO)' : 'DRAFT NEW RESTOCK PURCHASE ORDER' }}
            </h3>
          </div>
          <button @click="showPurchasePopup = false" class="text-slate-400 hover:text-white font-bold font-mono">&times; CLOSE</button>
        </div>

        <form @submit.prevent="savePurchase" class="space-y-4 text-xs font-sans">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[9.5px] uppercase font-mono text-slate-400 mb-1 font-bold">Partner Sourcing Supplier *</label>
              <input 
                type="text" 
                v-model="purchaseForm.supplier"
                required
                class="w-full bg-slate-950 border border-slate-900 text-xs px-3 py-2 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                placeholder="Ex: Zama-Agro Sahel"
              />
            </div>

            <div>
              <label class="block text-[9.5px] uppercase font-mono text-slate-400 mb-1 font-bold">Sum Amount (FCFA) *</label>
              <input 
                type="number" 
                v-model="purchaseForm.amount"
                required
                min="1000"
                class="w-full bg-slate-950 border border-slate-900 text-xs px-3 py-2 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                placeholder="Ex: 1500000"
              />
            </div>

            <div>
              <label class="block text-[9.5px] uppercase font-mono text-indigo-400 mb-1 font-bold">Procurement Date *</label>
              <input 
                type="date" 
                v-model="purchaseForm.date"
                required
                class="w-full bg-slate-950 border border-indigo-900 text-xs px-2.5 py-2 rounded-lg text-slate-200 focus:outline-none font-mono text-indigo-400"
              />
            </div>

            <div>
              <label class="block text-[9.5px] uppercase font-mono text-slate-450 mb-1">Receipt/Logistical status *</label>
              <select 
                v-model="purchaseForm.status"
                required
                class="w-full bg-slate-950 border border-slate-900 text-xs px-2 py-2 rounded-lg text-slate-200 focus:outline-none"
              >
                <option value="Draft">Draft (PO Proposal)</option>
                <option value="Sent">Sent (Awaiting response)</option>
                <option value="Received">Received (FIFO Batched)</option>
                <option value="Returned">Returned (Defective)</option>
              </select>
            </div>

            <div class="col-span-2">
              <label class="block text-[9.5px] uppercase font-mono text-slate-400 mb-1">List of requested Raw materials / quantites *</label>
              <input 
                type="text" 
                v-model="purchaseForm.items"
                required
                class="w-full bg-slate-950 border border-slate-900 text-xs px-3 py-2 rounded-lg text-slate-200 focus:outline-none"
                placeholder="Ex: Sacs Jute de Cacao (x1000)"
              />
            </div>
          </div>

          <!-- Actions -->
          <div class="pt-4 border-t border-indigo-950 flex justify-end space-x-2">
            <button 
              type="button" 
              @click="showPurchasePopup = false"
              class="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-850 rounded-xl text-slate-400"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl uppercase font-bold text-xs"
            >
              Validate Restock Agreement
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 2. DELETE CONFIRMATION -->
    <div v-if="purchaseToDelete" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-red-950/80 border-2 border-red-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden animate-fade-in text-slate-100 backdrop-blur">
        <div class="text-center space-y-3">
          <div class="h-12 w-12 bg-red-500/10 text-red-500 rounded-full border border-red-500/30 flex items-center justify-center font-bold text-2xl mx-auto select-none">
            🚷
          </div>
          <h3 class="text-base font-mono font-bold uppercase tracking-wider text-red-450">AUTHENTICATE PO ABOLISH</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">
            Are you absolutely sure you want to delete and wipe B2B Purchase Order <strong class="text-slate-200 font-semibold">{{ purchaseToDelete.id }}</strong>?
          </p>
        </div>

        <div class="mt-6 flex space-x-3">
          <button 
            @click="purchaseToDelete = null"
            class="flex-1 py-2 bg-slate-900 hover:bg-slate-850 rounded-xl text-xs font-mono font-bold text-slate-400 text-center transition"
          >
            Cancel
          </button>
          <button 
            @click="confirmDeletePurchase"
            class="flex-1 py-2 bg-red-800 hover:bg-red-750 text-white rounded-xl text-xs font-mono font-bold text-center transition uppercase"
          >
            Abolish PO Agreement
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { purchases } from '@/utils/supplier_db';
import { useToast } from 'vue-toastification';

const toast = useToast();

const showPurchasePopup = ref(false);
const isEditing = ref(false);
const targetPOId = ref(null);
const purchaseToDelete = ref(null);

const purchaseForm = ref({
  supplier: '',
  amount: '',
  date: new Date().toISOString().slice(0, 10),
  status: 'Draft',
  items: ''
});

function formatCurrency(val) {
  if (!val) return '0';
  return new Intl.NumberFormat('fr-FR').format(val);
}

function getStatusPillClass(status) {
  const s = (status || '').toLowerCase();
  if (s === 'draft') return 'bg-slate-900 text-slate-400 border border-slate-800';
  if (s === 'sent') return 'bg-indigo-950 text-indigo-400 border border-indigo-900/60';
  if (s === 'received') return 'bg-emerald-950 text-emerald-400 border border-emerald-900/40';
  return 'bg-red-950 text-red-400 border border-red-900/30';
}

function openCreatePurchasePopup() {
  isEditing.value = false;
  purchaseForm.value = {
    supplier: '',
    amount: 1200000,
    date: new Date().toISOString().slice(0, 10),
    status: 'Draft',
    items: ''
  };
  showPurchasePopup.value = true;
}

function openEditPurchasePopup(po) {
  isEditing.value = true;
  targetPOId.value = po.id;
  purchaseForm.value = {
    supplier: po.supplier,
    amount: po.amount,
    date: po.date || new Date().toISOString().slice(0, 10),
    status: po.status || 'Draft',
    items: po.items
  };
  showPurchasePopup.value = true;
}

function savePurchase() {
  if (isEditing.value) {
    const existing = purchases.value.find(p => p.id === targetPOId.value);
    if (existing) {
      existing.supplier = purchaseForm.value.supplier;
      existing.amount = parseFloat(purchaseForm.value.amount);
      existing.date = purchaseForm.value.date;
      existing.status = purchaseForm.value.status;
      existing.items = purchaseForm.value.items;
      toast.success('Procurement configurations updated on database.');
    }
  } else {
    const newId = 'po_' + String(purchases.value.length + 101).padStart(3, '0');
    purchases.value.push({
      id: newId,
      supplier: purchaseForm.value.supplier,
      amount: parseFloat(purchaseForm.value.amount),
      date: purchaseForm.value.date,
      status: purchaseForm.value.status,
      items: purchaseForm.value.items
    });
    toast.success('Procurement deed PO draft established!');
  }
  showPurchasePopup.value = false;
}

function triggerDeletePurchaseConfirmation(po) {
  purchaseToDelete.value = po;
}

function confirmDeletePurchase() {
  if (purchaseToDelete.value) {
    purchases.value = purchases.value.filter(s => s.id !== purchaseToDelete.value.id);
    toast.info(`Purchase Order ${purchaseToDelete.value.id} successfully deleted.`);
    purchaseToDelete.value = null;
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.18s ease-out forwards;
}
</style>
