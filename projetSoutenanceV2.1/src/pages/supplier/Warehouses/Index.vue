<template>
  <div class="space-y-6">
    
    <!-- Top HUD -->
    <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div>
        <h1 class="text-xl font-bold text-slate-100">B2B Storage Warehouses (Entrepôts)</h1>
        <p class="text-xs text-slate-400 mt-1">Configure logistics hubs, thermal attributes, capacities allocation, and physical addresses.</p>
      </div>

      <button 
        @click="openCreateWarehousePopup"
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold rounded-xl shadow-lg transition uppercase shrink-0"
      >
        + Register New Warehouse (Popup)
      </button>
    </div>

    <!-- MAIN CARDS GRID -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="w in warehouses" 
        :key="w.id"
        class="bg-[#080d22] border border-[#15204c]/60 rounded-xl overflow-hidden shadow-xl flex flex-col justify-between"
      >
        <!-- Body specs -->
        <div class="p-5 space-y-4 flex-1">
          <div class="flex justify-between items-start">
            <div class="space-y-1">
              <span class="text-xs text-indigo-400 font-mono font-bold uppercase tracking-wider">CODE: {{ w.id || 'WH_00' }}</span>
              <h2 class="text-base font-bold text-slate-100">{{ w.name }}</h2>
            </div>
            
            <span 
              class="text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold"
              :class="w.type === 'Thermal' || w.type === 'Cold Storage' ? 'bg-indigo-950 text-indigo-300 border border-indigo-900' : 'bg-slate-900 text-slate-400 border border-slate-800'"
            >
              {{ w.type || 'Dry Bulk' }}
            </span>
          </div>

          <p class="text-[11.5px] text-slate-350 leading-relaxed font-sans mt-2">{{ w.description }}</p>

          <div class="pt-3 border-t border-slate-900/80 space-y-2 select-none">
            <div class="flex justify-between text-[11px] font-mono text-slate-450">
              <span>Fulfillment Address:</span>
              <span class="text-slate-200">{{ w.location || w.city || 'Douala' }}</span>
            </div>

            <!-- Capacity bar indicator -->
            <div class="space-y-1">
              <div class="flex justify-between text-[10.5px] font-mono">
                <span>Capacity Usage:</span>
                <span class="font-bold text-indigo-400">72.4% ({{ formatVolume(w.capacity * 0.724) }} / {{ formatVolume(w.capacity) }} kg)</span>
              </div>
              <div class="w-full bg-slate-950 h-2 rounded overflow-hidden">
                <div class="bg-indigo-500 h-full rounded" style="width: 72.4%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions panel footer -->
        <div class="p-4 bg-slate-950/45 border-t border-slate-900 flex justify-end space-x-2">
          <button 
            @click="openEditWarehousePopup(w)"
            class="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-350 hover:text-white rounded text-[10px] font-mono border border-slate-850 transition"
          >
            ✏️ Manage Hub
          </button>
          <button 
            @click="triggerDeleteWarehouseConfirmation(w)"
            class="px-2.5 py-1.5 bg-red-950/20 text-red-400 hover:bg-red-900 hover:text-slate-950 rounded text-[10px] font-mono border border-red-900/30 font-bold transition"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>

    <!-- POPUPS -->
    <!-- 1. CREATE / EDIT WAREHOUSE MODAL -->
    <div v-if="showWarehousePopup" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-[#0b1029] border border-indigo-900/90 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative overflow-hidden animate-fade-in text-slate-100">
        <div class="flex justify-between items-start border-b border-indigo-950 pb-3 mb-4">
          <div>
            <span class="text-[9px] font-mono text-indigo-400 px-1.5 py-0.5 rounded bg-indigo-950 font-bold uppercase">LOGISTICS ARCHITECTURE</span>
            <h3 class="text-sm font-bold font-mono tracking-wide mt-1">
              {{ isEditing ? 'CONFIGURE EXPÉDIENT / WAREHOUSE' : 'PROVISION NEW PHYSICAL STORAGE HUB' }}
            </h3>
          </div>
          <button @click="showWarehousePopup = false" class="text-slate-400 hover:text-white font-bold font-mono">&times; CLOSE</button>
        </div>

        <form @submit.prevent="saveWarehouse" class="space-y-4 text-xs font-sans">
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="block text-[9.5px] uppercase font-mono text-slate-400 mb-1 font-bold">Warehouse Name *</label>
              <input 
                type="text" 
                v-model="warehouseForm.name"
                required
                class="w-full bg-slate-950 border border-slate-900 text-xs px-3 py-2 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                placeholder="Ex: Hub Isotherme Littoral Douala Bassa"
              />
            </div>

            <div>
              <label class="block text-[9.5px] uppercase font-mono text-slate-400 mb-1 font-bold">Climate/Dry Segment *</label>
              <select 
                v-model="warehouseForm.type"
                required
                class="w-full bg-slate-950 border border-slate-900 text-xs px-2.5 py-2 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Cold Storage">Thermal (Cold Storage)</option>
                <option value="Dry Storage">Dry Storage</option>
                <option value="Open Air Silo">Open Air Silo</option>
              </select>
            </div>

            <div>
              <label class="block text-[9.5px] uppercase font-mono text-slate-400 mb-1 font-bold">Maximum Payload Capacity (kg) *</label>
              <input 
                type="number" 
                v-model="warehouseForm.capacity"
                required
                min="100"
                class="w-full bg-slate-950 border border-slate-900 text-xs px-3 py-2 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                placeholder="Ex: 500000"
              />
            </div>

            <div class="col-span-2">
              <label class="block text-[9.5px] uppercase font-mono text-slate-400 mb-1 font-bold">Physical Address *</label>
              <input 
                type="text" 
                v-model="warehouseForm.location"
                required
                class="w-full bg-slate-950 border border-slate-900 text-xs px-3 py-2 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                placeholder="Ex: Zone Industrielle de Bassa, B.P. 1240, Douala"
              />
            </div>
          </div>

          <div>
            <label class="block text-[9.5px] uppercase font-mono text-slate-400 mb-1">Operational Area description</label>
            <textarea 
              v-model="warehouseForm.description"
              rows="3"
              class="w-full bg-slate-950 border border-slate-900 text-xs px-3 py-2 rounded-lg text-slate-350 focus:outline-none resize-none"
              placeholder="Describe access routes, active crew details, or specialized machinery..."
            ></textarea>
          </div>

          <!-- Actions -->
          <div class="pt-4 border-t border-indigo-950 flex justify-end space-x-2">
            <button 
              type="button" 
              @click="showWarehousePopup = false"
              class="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 rounded-xl text-slate-400"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl uppercase font-bold text-xs"
            >
              Fulfill Provisioning
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 2. WAREHOUSE REDACT DELETION DIALOG -->
    <div v-if="warehouseToDelete" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-red-950/80 border-2 border-red-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden animate-fade-in text-slate-100 backdrop-blur">
        <div class="text-center space-y-3">
          <div class="h-12 w-12 bg-red-500/10 text-red-500 rounded-full border border-red-500/30 flex items-center justify-center font-bold text-2xl mx-auto select-none">
            🚷
          </div>
          <h3 class="text-base font-mono font-bold uppercase tracking-wider text-red-450">AUTHENTICATE REDACT</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">
            Are you absolutely sure you want to deactivate <strong class="text-slate-200 font-semibold">{{ warehouseToDelete.name }}</strong>? This will trigger relocation warnings to dispatch agencies.
          </p>
        </div>

        <div class="mt-6 flex space-x-3">
          <button 
            @click="warehouseToDelete = null"
            class="flex-1 py-2 bg-slate-900 hover:bg-slate-850 rounded-xl text-xs font-mono font-bold text-slate-400 text-center transition"
          >
            Cancel
          </button>
          <button 
            @click="confirmDeleteWarehouse"
            class="flex-1 py-2 bg-red-800 hover:bg-red-750 text-white rounded-xl text-xs font-mono font-bold text-center transition uppercase"
          >
            Decommission Hub
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { warehouses } from '@/utils/supplier_db';
import { useToast } from 'vue-toastification';

const toast = useToast();

const showWarehousePopup = ref(false);
const isEditing = ref(false);
const targetWarehouseId = ref(null);
const warehouseToDelete = ref(null);

const warehouseForm = ref({
  name: '',
  type: 'Dry Storage',
  capacity: '',
  location: '',
  description: ''
});

function formatVolume(val) {
  if (!val) return '0';
  return new Intl.NumberFormat('fr-FR').format(Math.round(val));
}

function openCreateWarehousePopup() {
  isEditing.value = false;
  warehouseForm.value = {
    name: '',
    type: 'Dry Storage',
    capacity: 250000,
    location: '',
    description: ''
  };
  showWarehousePopup.value = true;
}

function openEditWarehousePopup(w) {
  isEditing.value = true;
  targetWarehouseId.value = w.id;
  warehouseForm.value = {
    name: w.name,
    type: w.type || 'Dry Storage',
    capacity: w.capacity || 250000,
    location: w.location || w.city || '',
    description: w.description || ''
  };
  showWarehousePopup.value = true;
}

function saveWarehouse() {
  if (isEditing.value) {
    const existing = warehouses.value.find(w => w.id === targetWarehouseId.value);
    if (existing) {
      existing.name = warehouseForm.value.name;
      existing.type = warehouseForm.value.type;
      existing.capacity = parseFloat(warehouseForm.value.capacity);
      existing.location = warehouseForm.value.location;
      existing.description = warehouseForm.value.description;
      toast.success('Warehouse configurations altered successfully.');
    }
  } else {
    const newId = 'wh_' + (warehouses.value.length + 101);
    warehouses.value.push({
      id: newId,
      name: warehouseForm.value.name,
      type: warehouseForm.value.type,
      capacity: parseFloat(warehouseForm.value.capacity),
      location: warehouseForm.value.location,
      city: warehouseForm.value.location.split(',').pop().trim() || 'Yaoundé',
      description: warehouseForm.value.description || 'Controlled provisioning logistics zone'
    });
    toast.success('New logistics storage warehouse initialized in DB!');
  }
  showWarehousePopup.value = false;
}

function triggerDeleteWarehouseConfirmation(w) {
  warehouseToDelete.value = w;
}

function confirmDeleteWarehouse() {
  if (warehouseToDelete.value) {
    warehouses.value = warehouses.value.filter(s => s.id !== warehouseToDelete.value.id);
    toast.info(`Warehouse ${warehouseToDelete.value.name} successfully decommissioned.`);
    warehouseToDelete.value = null;
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
