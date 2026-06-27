<template>
  <div class="space-y-6">
    
    <!-- Top HUD -->
    <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div>
        <h1 class="text-xl font-bold text-slate-100">Boutiques &amp; POS Outlets</h1>
        <p class="text-xs text-slate-400 mt-1">Configure virtual storefront terminals and review cashiers configurations.</p>
      </div>

      <button 
        @click="openCreateStorePopup"
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold rounded-xl shadow-lg transition uppercase shrink-0"
      >
        + Add New Boutique/POS
      </button>
    </div>

    <!-- CORE LISTS Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- BOUTIQUE CARD GRID -->
      <div 
        v-for="s in stores" 
        :key="s.id"
        class="bg-[#080d22] border border-[#15204c]/60 rounded-xl overflow-hidden shadow-xl flex flex-col justify-between"
      >
        <!-- Covers Banner -->
        <div class="h-32 w-full relative">
          <img :src="s.banner" :alt="s.name" class="h-full w-full object-cover opacity-80" />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
          
          <span class="absolute top-3 left-3 bg-[#0c1024] px-2 py-0.5 rounded text-[9px] font-mono text-indigo-400 font-bold border border-indigo-900/60 uppercase">
            ID: {{ s.id }}
          </span>

          <span class="absolute top-3 right-3 bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wide">
            ● {{ s.status || 'Active' }}
          </span>

          <div class="absolute bottom-3 left-4">
            <h2 class="text-base font-bold text-slate-100">{{ s.name }}</h2>
            <p class="text-[10px] text-slate-400 font-mono">{{ s.domain || 'virtual.local' }}</p>
          </div>
        </div>

        <!-- Body specs -->
        <div class="p-5 space-y-3 flex-1 text-xs">
          <p class="text-slate-350 leading-relaxed font-sans">{{ s.description }}</p>
          
          <div class="grid grid-cols-2 gap-3 pt-2.5 border-t border-slate-900 font-mono text-[10px] text-slate-450">
            <div>
              <span>Store Manager:</span>
              <span class="block text-slate-200 mt-0.5 font-sans font-semibold">{{ s.manager || 'N/A' }}</span>
            </div>
            <div>
              <span>POS Configured:</span>
              <span class="block text-indigo-400 mt-0.5 font-bold uppercase">{{ s.posConfig?.terminalName || 'Terminus Alpha' }}</span>
            </div>
          </div>
        </div>

        <!-- Bottom tools -->
        <div class="p-4 bg-slate-950/45 border-t border-slate-900 flex justify-between gap-3">
          <!-- Boutique preview trigger -->
          <button 
            @click="triggerBoutiquePreview(s)"
            class="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded text-[10px] font-mono font-bold transition uppercase"
          >
            👁️ Boutique Preview
          </button>

          <div class="flex items-center space-x-2">
            <button 
              @click="openEditStorePopup(s)"
              class="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-350 hover:text-white rounded text-[10px] font-mono border border-slate-800 transition"
            >
              Configure
            </button>
            <button 
              @click="triggerDeleteStoreConfirmation(s)"
              class="px-3 py-1.5 bg-red-950/20 text-red-400 hover:bg-red-900 hover:text-slate-950 rounded text-[10px] font-mono border border-red-900/30 font-bold transition"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- POPUP MODALS -->
    
    <!-- 1. CREATE / EDIT STORE DETAILS -->
    <div v-if="showStorePopup" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-[#0b1029] border border-indigo-900/90 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative overflow-hidden animate-fade-in text-slate-100">
        <div class="flex justify-between items-start border-b border-indigo-950 pb-3 mb-4">
          <div>
            <span class="text-[9px] font-mono text-indigo-400 px-1.5 py-0.5 rounded bg-indigo-950 font-bold uppercase">RETAIL HUB DESIGNER</span>
            <h3 class="text-sm font-bold font-mono tracking-wide mt-1">
              {{ isEditing ? 'CONFIGURE RETAIL OUTLET / TERMINAL' : 'ADD NEW B2B OUTLET HUB' }}
            </h3>
          </div>
          <button @click="showStorePopup = false" class="text-slate-400 hover:text-white font-bold font-mono">&times; CLOSE</button>
        </div>

        <form @submit.prevent="saveStore" class="space-y-4 text-xs font-sans">
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="block text-[9.5px] uppercase font-mono text-slate-400 mb-1 font-bold">Outlet Name *</label>
              <input 
                type="text" 
                v-model="storeForm.name"
                required
                class="w-full bg-slate-950 border border-slate-900 text-xs px-3 py-2 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                placeholder="Ex: Yaoundé Main Sourcing depot"
              />
            </div>

            <div>
              <label class="block text-[9.5px] uppercase font-mono text-slate-400 mb-1">Assigned Manager name *</label>
              <input 
                type="text" 
                v-model="storeForm.manager"
                required
                class="w-full bg-slate-950 border border-slate-900 text-xs px-3 py-2 rounded-lg text-slate-200 focus:outline-none"
                placeholder="Ex: Robert Kane"
              />
            </div>

            <div>
              <label class="block text-[9.5px] uppercase font-mono text-slate-400 mb-1">POS Terminal Name *</label>
              <input 
                type="text" 
                v-model="storeForm.terminalName"
                required
                class="w-full bg-slate-950 border border-slate-900 text-xs px-3 py-2 rounded-lg text-slate-250 focus:outline-none focus:border-indigo-500 font-mono"
                placeholder="Ex: POS OUTLET ALPHA-1"
              />
            </div>
          </div>

          <div>
            <label class="block text-[9.5px] uppercase font-mono text-slate-400 mb-1">Boutique Cover Banner image URL</label>
            <input 
              type="url" 
              v-model="storeForm.banner"
              class="w-full bg-slate-950 border border-slate-900 text-xs px-3 py-2 rounded-lg text-slate-400 focus:outline-none"
              placeholder="https://images.unsplash.com/photo-..."
            />
          </div>

          <div>
            <label class="block text-[9.5px] uppercase font-mono text-slate-400 mb-1">Outlet Description &amp; welcome Slogan</label>
            <textarea 
              v-model="storeForm.description"
              rows="3"
              class="w-full bg-slate-950 border border-slate-900 text-xs px-3 py-2 rounded-lg text-slate-350 focus:outline-none resize-none"
              placeholder="Ex: Sourcing depot serving B2B operators directly..."
            ></textarea>
          </div>

          <!-- Actions -->
          <div class="pt-4 border-t border-indigo-950 flex justify-end space-x-2">
            <button 
              type="button" 
              @click="showStorePopup = false"
              class="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 rounded-xl text-slate-400"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl uppercase font-bold text-xs"
            >
              Deploy Boutique Outlets
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 2. BOUTIQUE PREVIEW HIGH-FIDELITY MODAL (THE COMPANION BUYER WORKSPACE VIEW) -->
    <div v-if="previewStore" class="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-[#050814] border-2 border-indigo-900 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative animate-fade-in text-slate-100 flex flex-col">
        
        <!-- Frame header visual -->
        <div class="h-11 bg-indigo-950 border-b border-indigo-900/60 px-4 flex items-center justify-between">
          <div class="flex items-center space-x-2 text-[10px] font-mono text-slate-4D rounded">
            <span class="h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
            <span class="text-indigo-300 font-bold uppercase tracking-wider">LIVE BOUTIQUE PREVIEW MODE - AS VIEWED BY B2B BUYERS</span>
          </div>
          <button @click="previewStore = null" class="text-slate-400 hover:text-white font-bold text-xs font-mono">&times; CLOSE PREVIEW</button>
        </div>

        <!-- The Buyer View container -->
        <div class="flex-1 overflow-y-auto max-h-[70vh]">
          
          <!-- Cover -->
          <div class="h-44 w-full relative">
            <img :src="previewStore.banner" :alt="previewStore.name" class="h-full w-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-[#050814] via-[#050814]/40 to-black/50"></div>
            
            <div class="absolute bottom-4 left-6">
              <span class="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-900/40 px-2.5 py-0.5 rounded-full font-sans font-bold uppercase tracking-wider mb-1.5 inline-block">
                ✓ VERIFIED B2B MERCHANT
              </span>
              <h1 class="text-2xl font-bold font-sans text-white leading-none">{{ previewStore.name }}</h1>
              <p class="text-xs text-indigo-300 font-mono mt-1">{{ previewStore.domain }} • Sourcing Hub</p>
            </div>
          </div>

          <!-- Retail details -->
          <div class="p-6 space-y-6">
            <div class="space-y-2">
              <h3 class="text-xs font-mono font-bold uppercase text-[#546296] tracking-wider">Corporate Identity Profile</h3>
              <p class="text-xs text-slate-300 leading-relaxed font-sans bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
                {{ previewStore.description }}
              </p>
            </div>

            <!-- Featured products lists -->
            <div class="space-y-3">
              <h3 class="text-xs font-mono font-bold uppercase text-[#546296] tracking-wider">Verified Products Sourced</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div 
                  v-for="p in catalogProductsSample" 
                  :key="p.id"
                  class="p-3 bg-slate-900/60 border border-slate-905 rounded-xl flex items-center space-x-3 text-xs"
                >
                  <div class="h-10 w-10 bg-indigo-950 rounded-lg flex items-center justify-center font-bold text-base overflow-hidden shrink-0">
                    <img v-if="p.image" :src="p.image" class="h-full w-full object-cover" />
                    <span v-else>🌾</span>
                  </div>
                  <div class="truncate">
                    <strong class="text-slate-200 block truncate">{{ p.name }}</strong>
                    <span class="text-[10px] text-indigo-400 font-mono block font-bold mt-0.5">{{ formatCurrency(p.price) }} FCFA</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        <div class="p-4 bg-slate-900/50 border-t border-slate-900 flex justify-between items-center text-[10.5px] font-mono text-slate-500">
          <span>Active Clearance: Corporate Supplier Profile</span>
          <span class="text-indigo-400 font-bold">100% SECURE ESCROW ENFORCED</span>
        </div>

      </div>
    </div>

    <!-- 3. STORE DELETION DIALOG -->
    <div v-if="storeToDelete" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-red-950/80 border-2 border-red-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden animate-fade-in text-slate-100 backdrop-blur">
        <div class="text-center space-y-3">
          <div class="h-12 w-12 bg-red-500/10 text-red-500 rounded-full border border-red-500/30 flex items-center justify-center font-bold text-2xl mx-auto select-none">
            🚷
          </div>
          <h3 class="text-base font-mono font-bold uppercase tracking-wider text-red-450">REMOVE RETAL TERMINAL?</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">
            Are you sure you want to shut down the boutique storefront terminal <strong class="text-slate-200 font-semibold">{{ storeToDelete.name }}</strong>? This will break live synchronizations.
          </p>
        </div>

        <div class="mt-6 flex space-x-3">
          <button 
            @click="storeToDelete = null"
            class="flex-1 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-xs font-mono font-bold text-slate-400 text-center transition"
          >
            Cancel
          </button>
          <button 
            @click="confirmDeleteStore"
            class="flex-1 py-2 bg-red-800 hover:bg-red-750 text-white rounded-xl text-xs font-mono font-bold text-center transition uppercase"
          >
            CONFIRM SHUTDOWN
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { stores, products } from '@/utils/supplier_db';
import { useToast } from 'vue-toastification';

const toast = useToast();

const showStorePopup = ref(false);
const isEditing = ref(false);
const targetStoreId = ref(null);
const storeToDelete = ref(null);
const previewStore = ref(null);

const storeForm = ref({
  name: '',
  banner: '',
  description: '',
  manager: 'Jean Dupont',
  terminalName: ''
});

const catalogProductsSample = computed(() => {
  return products.value.slice(0, 4);
});

function formatCurrency(val) {
  if (!val) return '0';
  return new Intl.NumberFormat('fr-FR').format(val);
}

function openCreateStorePopup() {
  isEditing.value = false;
  storeForm.value = {
    name: '',
    banner: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200',
    description: '',
    manager: 'Jean Dupont',
    terminalName: 'Terminus ' + String.fromCharCode(65 + stores.value.length)
  };
  showStorePopup.value = true;
}

function openEditStorePopup(s) {
  isEditing.value = true;
  targetStoreId.value = s.id;
  storeForm.value = {
    name: s.name,
    banner: s.banner || '',
    description: s.description || '',
    manager: s.manager || 'Jean Dupont',
    terminalName: s.posConfig?.terminalName || ''
  };
  showStorePopup.value = true;
}

function saveStore() {
  if (isEditing.value) {
    const existing = stores.value.find(s => s.id === targetStoreId.value);
    if (existing) {
      existing.name = storeForm.value.name;
      existing.banner = storeForm.value.banner;
      existing.description = storeForm.value.description;
      existing.manager = storeForm.value.manager;
      if (!existing.posConfig) existing.posConfig = {};
      existing.posConfig.terminalName = storeForm.value.terminalName;
      toast.success('Boutique outlet specs rewritten safely.');
    }
  } else {
    const newId = 'store_' + (stores.value.length + 1);
    stores.value.push({
      id: newId,
      name: storeForm.value.name,
      banner: storeForm.value.banner || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200',
      description: storeForm.value.description,
      manager: storeForm.value.manager,
      domain: newId + '.enterprise-platform.local',
      status: 'online',
      posConfig: {
        terminalName: storeForm.value.terminalName,
        isActive: true,
        lastSync: '2026-06-18 06:12'
      }
    });
    toast.success('New virtual Boutique outlet added successfully!');
  }
  showStorePopup.value = false;
}

function triggerBoutiquePreview(s) {
  previewStore.value = s;
}

function triggerDeleteStoreConfirmation(s) {
  storeToDelete.value = s;
}

function confirmDeleteStore() {
  if (storeToDelete.value) {
    stores.value = stores.value.filter(s => s.id !== storeToDelete.value.id);
    toast.info(`Boutique storefront terminal ${storeToDelete.value.name} shut down.`);
    storeToDelete.value = null;
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
