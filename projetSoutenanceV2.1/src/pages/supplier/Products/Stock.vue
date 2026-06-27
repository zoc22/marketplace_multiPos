<template>
  <div class="space-y-6">
    <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
      <h1 class="text-xl font-bold text-slate-100">FIFO Stock Queue &amp; Demandes de Stock</h1>
      <p class="text-xs text-slate-400 mt-1">First-In-First-Out batch visual sequence monitor. Verify product age and simulate depletion checks.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- DETAILED BATCHES LISTINGS -->
      <div class="lg:col-span-2 space-y-4">
        
        <div class="p-5 bg-[#080d22] border border-slate-900 rounded-xl space-y-4">
          <h3 class="text-xs font-mono font-bold uppercase text-slate-200 tracking-wider">Storage Batches Ledger (Ordered Oldest First)</h3>
          
          <div class="space-y-4">
            <div 
              v-for="p in products" 
              :key="p.id"
              class="p-4 bg-slate-950 border border-slate-900 rounded-xl space-y-3"
            >
              <div class="flex justify-between items-center pb-2 border-b border-indigo-950/40">
                <div>
                  <span class="text-xs font-bold text-slate-200">{{ p.name }}</span>
                  <span class="text-[9.5px] font-mono text-indigo-400 block uppercase">SKU: {{ p.id }}</span>
                </div>
                <div class="text-right">
                  <span class="text-[10px] text-slate-500 font-mono">Consolidated Stock:</span>
                  <span class="text-xs font-bold font-mono text-emerald-400 block">{{ p.stock }} units</span>
                </div>
              </div>

              <!-- Batches lines progression bars -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div 
                  v-for="(b, idx) in p.batches || []" 
                  :key="b.id"
                  class="p-3 rounded-lg border flex flex-col justify-between space-y-2 select-none"
                  :class="idx === 0 && b.qty > 0 ? 'bg-indigo-950/20 border-indigo-500/30' : 'bg-slate-900/40 border-slate-900' "
                >
                  <div class="flex justify-between text-[10px] font-mono">
                    <span class="font-bold text-indigo-300">BATCH #{{ b.id }}</span>
                    <span class="text-slate-500">Date: {{ b.date }}</span>
                  </div>
                  
                  <div class="space-y-1">
                    <div class="flex justify-between text-[11px] font-mono">
                      <span>Available:</span>
                      <span class="font-bold">{{ b.qty }} / {{ b.initialQty || b.qty }} units</span>
                    </div>

                    <!-- Progress microbar -->
                    <div class="w-full bg-slate-950 h-1.5 rounded overflow-hidden">
                      <div 
                        class="h-full rounded" 
                        :class="idx === 0 && b.qty > 0 ? 'bg-indigo-500' : 'bg-slate-700'"
                        :style="{ width: ((b.qty / (b.initialQty || b.qty)) * 100) + '%' }"
                      ></div>
                    </div>
                  </div>

                  <div class="flex justify-between text-[9px] font-mono text-slate-500">
                    <span>Intake Cost:</span>
                    <span>{{ formatCurrency(b.price) }} FCFA/u</span>
                  </div>
                </div>
              </div>

              <!-- Quick Intake Add Tool popup drawer -->
              <div class="pt-2 flex justify-end">
                <button 
                  @click="openAddBatchPopup(p)"
                  class="px-2.5 py-1 bg-[#121935] hover:bg-indigo-900 text-[10px] font-mono text-indigo-300 rounded font-bold border border-indigo-950/80 transition uppercase"
                >
                  + Add Intake Batch (Popup)
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>

      <!-- FIFO POLICY MANUAL DOCUMENT & CONTROLS -->
      <div class="space-y-6">
        
        <div class="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
          <h3 class="text-xs font-mono font-bold uppercase text-slate-200 tracking-wider">FIFO depletion instructions</h3>
          <p class="text-xs text-slate-450 leading-relaxed font-sans">
            Under agricultural cargo compliance rules, the system strict enforces First-In, First-Out (FIFO) queue validation. When client orders are accepted, our fulfillment router automatically eats inventories from the oldest registered storage batch, protecting your business balance sheet against product aging, spoilage, or decay.
          </p>
          <div class="p-4 bg-indigo-950/45 border border-indigo-900/60 rounded-xl text-xs space-y-2 select-none">
            <span class="text-[9.5px] uppercase font-mono text-indigo-400 font-bold block tracking-wider">ACTIVE PIPELINE STATUS:</span>
            <div class="flex justify-between font-mono text-[10.5px]">
              <span>Sequence Priority:</span>
              <span class="text-slate-100 font-bold">Oldest Dates Direct</span>
            </div>
            <div class="flex justify-between font-mono text-[10.5px]">
              <span>Intake Auto-Hold:</span>
              <span class="text-slate-150 text-emerald-400">DISABLED (Unlocked)</span>
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- POPUP: ADD INTENSE INTAKE BATCH -->
    <div v-if="showAddBatchPopup" class="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-[#0b1029] border border-indigo-900/90 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden animate-fade-in text-slate-100">
        <div class="flex justify-between items-start border-b border-indigo-950 pb-3 mb-4">
          <div>
            <span class="text-[9px] font-mono text-indigo-400 px-1.5 py-0.5 rounded bg-indigo-950 font-bold uppercase">FIFO STORAGE INTAKE</span>
            <h3 class="text-sm font-bold font-mono tracking-wide mt-1">ADD INVENTORY BATCH</h3>
          </div>
          <button @click="showAddBatchPopup = false" class="text-slate-400 hover:text-white font-bold font-mono">&times; CLOSE</button>
        </div>

        <form @submit.prevent="submitAddBatch" class="space-y-4 font-mono text-xs">
          <div>
            <label class="block text-[9.5px] uppercase text-slate-400 mb-1">Target Product</label>
            <div class="p-2.5 bg-slate-950 rounded text-slate-200 font-bold">
              {{ activeProductForBatch?.name }}
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[9.5px] uppercase text-slate-450 mb-1">Batch ID/Code</label>
              <input 
                type="text" 
                v-model="batchForm.id" 
                required
                class="w-full bg-slate-950 border border-slate-900 px-2 py-1.5 text-xs text-slate-350 focus:outline-none focus:border-indigo-500 rounded"
                placeholder="Ex: b_3"
              />
            </div>
            <div>
              <label class="block text-[9.5px] uppercase text-slate-450 mb-1">Intake Date</label>
              <input 
                type="date" 
                v-model="batchForm.date" 
                required
                class="w-full bg-slate-950 border border-slate-900 px-2 py-1.5 text-xs text-indigo-400 focus:outline-none focus:border-indigo-500 rounded"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[9.5px] uppercase text-slate-450 mb-1">Batch Qty</label>
              <input 
                type="number" 
                v-model="batchForm.qty" 
                required
                min="1"
                class="w-full bg-slate-950 border border-slate-900 px-2 py-1.5 text-xs text-slate-350 focus:outline-none focus:border-indigo-500 rounded"
                placeholder="Ex: 250"
              />
            </div>
            <div>
              <label class="block text-[9.5px] uppercase text-slate-450 mb-1">Cost per Unit (FCFA)</label>
              <input 
                type="number" 
                v-model="batchForm.price" 
                required


                min="100"
                class="w-full bg-slate-950 border border-slate-900 px-2 py-1.5 text-xs text-slate-350 focus:outline-none focus:border-indigo-500 rounded"
                placeholder="Ex: 12500"
              />
            </div>
          </div>

          <div class="pt-4 border-t border-indigo-950 flex justify-end space-x-2">
            <button 
              type="button" 
              @click="showAddBatchPopup = false"
              class="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 rounded font-bold text-slate-400"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-4 py-1.5 bg-indigo-650 hover:bg-indigo-550 text-white font-bold rounded uppercase"
            >
              Secure Batch Deposit
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { products } from '@/utils/supplier_db';
import { useToast } from 'vue-toastification';

const toast = useToast();

const showAddBatchPopup = ref(false);
const activeProductForBatch = ref(null);

const batchForm = ref({
  id: '',
  date: new Date().toISOString().slice(0, 10),
  qty: '',
  price: ''
});

function formatCurrency(val) {
  if (!val) return '0';
  return new Intl.NumberFormat('fr-FR').format(val);
}

function openAddBatchPopup(product) {
  activeProductForBatch.value = product;
  batchForm.value = {
    id: 'b_' + ((product.batches || []).length + 3),
    date: new Date().toISOString().slice(0, 10),
    qty: 200,
    price: product.price * 0.88
  };
  showAddBatchPopup.value = true;
}

function submitAddBatch() {
  if (activeProductForBatch.value) {
    const qtyInt = parseInt(batchForm.value.qty);
    const newBatch = {
      id: batchForm.value.id,
      date: batchForm.value.date,
      qty: qtyInt,
      initialQty: qtyInt,
      price: parseFloat(batchForm.value.price)
    };

    if (!activeProductForBatch.value.batches) {
      activeProductForBatch.value.batches = [];
    }

    activeProductForBatch.value.batches.push(newBatch);
    // Recalculate consolidated stock
    activeProductForBatch.value.stock = activeProductForBatch.value.batches.reduce((acc, b) => acc + b.qty, 0);

    toast.success(`Batch #${newBatch.id} successfully checked in for ${activeProductForBatch.value.name}`);
  }
  showAddBatchPopup.value = false;
}
</script>
