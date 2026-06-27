<template>
  <div class="space-y-6 max-w-7xl mx-auto" id="logistics-board">
    <!-- PANEL HEADER -->
    <div class="bg-gradient-to-r from-[#010915] to-[#0d1633] border border-indigo-950 rounded-xl p-6 select-none relative overflow-hidden shadow-xl text-slate-100">
      <div class="flex items-center space-x-2">
        <span class="text-xs font-mono bg-indigo-950/40 text-indigo-400 px-2.5 py-0.5 rounded-full border border-indigo-900/30 font-bold uppercase">
          Division Fret &amp; Expéditions
        </span>
      </div>
      <h1 class="text-lg font-bold mt-1">Console Logistique &amp; Transporteurs</h1>
      <p class="text-xs text-slate-400 mt-0.5">Piloter les flottes de livraison, attribuer les contrats de transport multi-opérateurs et éditer les feuilles de route.</p>
    </div>

    <!-- CARRIER FLEET FLEET STATUS INFO -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- CARRIER FIRMS CAPTURES (LEFT 2 COLUMNS ON DESKTOP) -->
      <div class="md:col-span-2 bg-[#0b1226] border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 class="text-xs font-mono uppercase font-bold text-slate-350 tracking-wider">Transporteurs Agréés &amp; Flotte Disponible</h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div 
            v-for="car in carriersList" 
            :key="car.id"
            class="bg-slate-950/60 p-4 border border-slate-850 rounded-xl space-y-2 flex flex-col justify-between"
          >
            <div>
              <span class="text-[8px] font-mono text-indigo-450 uppercase font-black tracking-widest">{{ car.type }}</span>
              <h4 class="text-xs font-extrabold text-slate-205 mt-1">{{ car.name }}</h4>
              <p class="text-[10px] text-slate-500 font-mono mt-1">Couverture: {{ car.route }}</p>
            </div>
            
            <div class="flex justify-between items-center pt-2 border-t border-slate-900">
              <span class="text-[9.2px] font-mono font-bold text-slate-400">{{ car.plate }}</span>
              <span 
                class="text-[8px] font-mono px-2 py-0.2 rounded" 
                :class="car.status === 'Active' ? 'bg-emerald-950 text-emerald-450 border border-emerald-900' : 'bg-amber-955 text-amber-500 border border-amber-900'"
              >
                {{ car.status === 'Active' ? 'DISPO' : 'EN ROUTE' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- FLEET DENSITY ANALYSIS -->
      <div class="bg-[#0b1226] border border-slate-800 rounded-xl p-5 space-y-3 justify-between flex flex-col">
        <div>
          <h3 class="text-xs font-mono uppercase font-bold text-slate-350 tracking-wider">Modes d'Expédition Multiples</h3>
          <p class="text-[10px] text-slate-400 mt-1 leading-snug">
            Soutien multimodal : transport ferroviaire lourd (Camrail fret express) pour les longs trajets, fourgons réfrigérés thermo-régulés ou motocycles d'agglomération rapide.
          </p>
        </div>

        <div class="p-3 bg-slate-950 rounded-lg text-[10.5px] font-mono text-slate-400 space-y-1">
          <div class="flex justify-between">
            <span>Rail Cargo Douala-Yde:</span>
            <span class="text-slate-200">100% Fonctionnel</span>
          </div>
          <div class="flex justify-between">
            <span>Fourgonnettes Isothermes:</span>
            <span class="text-sky-400">92% Opérationnel</span>
          </div>
          <div class="flex justify-between">
            <span>Réseau Express Moto Sawa:</span>
            <span class="text-emerald-400">Disponibilité Immédiate</span>
          </div>
        </div>
      </div>
    </div>

    <!-- PACKED PACKAGES AWAITING SHIPMENT DISPATCH -->
    <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl" id="awaiting-dispatch-table-desk">
      <div class="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
        <h3 class="text-xs font-mono uppercase font-bold text-slate-300">Expéditions en attente de Transporteur (Colis Terminés)</h3>
        <span class="text-[10px] font-mono text-pink-400 uppercase font-bold animate-pulse">Colisage Validé FIFO</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-950/90 border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase">
              <th class="p-4">Référence</th>
              <th class="p-4">Dépôt d'Origine</th>
              <th class="p-4">Acheteur Destinataire</th>
              <th class="p-4">Mode requis</th>
              <th class="p-4 text-right font-mono">Valeur TTC</th>
              <th class="p-4 text-center">Status</th>
              <th class="p-4 text-right">Dispatch Console</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="order in packedOrders" 
              :key="order.id"
              class="border-b border-slate-850 hover:bg-slate-800/20 transition text-xs"
              :id="'log-row-' + order.id"
            >
              <td class="p-4 font-mono font-bold text-slate-250">
                <router-link :to="'/supplier/orders/' + order.id" class="hover:text-indigo-400 flex items-center space-x-1">
                  <span>📦</span>
                  <span>{{ order.reference }}</span>
                </router-link>
              </td>
              <td class="p-4 text-slate-300 font-bold">
                🏢 {{ order.deliveryNote?.originWarehouseName || 'Entrepôt central b2b' }}
              </td>
              <td class="p-4 text-slate-400">
                <div>
                  <span class="block text-slate-205 font-bold">{{ order.clientCompany || order.clientName }}</span>
                  <span class="block text-[9px] font-mono text-slate-550">{{ order.clientCity || 'Douala' }}</span>
                </div>
              </td>
              <td class="p-4 font-mono font-bold text-indigo-400">{{ order.deliveryMode || 'Rail Cargo Fret' }}</td>
              <td class="p-4 text-right font-mono font-bold">{{ formatMoney(order.total) }}</td>
              <td class="p-4 text-center">
                <span class="px-2 py-0.5 bg-blue-950 text-blue-400 rounded-full border border-blue-900 text-[9px] font-mono font-bold uppercase">
                  Colisé (Awaiting Truck)
                </span>
              </td>
              <td class="p-4 text-right">
                <button 
                  @click="openDispatchWizard(order)"
                  class="px-3 py-1.5 bg-indigo-650 hover:bg-indigo-550 text-white font-mono text-[10px] font-bold uppercase rounded border border-indigo-900 transition flex items-center space-x-1 shadow-md"
                  :id="'btn-log-dispatch-' + order.id"
                >
                  <span>🚛</span>
                  <span>Assigner &amp; Expédier</span>
                </button>
              </td>
            </tr>

            <tr v-if="packedOrders.length === 0">
              <td colspan="7" class="p-10 text-center text-xs text-slate-550 font-mono italic">
                Aucun colis validé en attente de chargement camion. Complétez d'abord l'étape "Colisage FIFO entrepôt" sur vos commandes en cours.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- EXPEDITION MODAL CONSOLE: CARRIER ASSIGNATION & DISPATCH -->
    <div 
      v-if="showDispatchModal"
      class="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      id="dispatch-modal"
    >
      <div class="bg-[#0c1226] border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        <!-- HEADER -->
        <div class="p-6 border-b border-indigo-950 bg-gradient-to-r from-slate-900 to-[#0e1732] flex items-center justify-between shrink-0">
          <div>
            <h2 class="text-md font-bold text-slate-100 flex items-center space-x-2">
              <span>🚚</span>
              <span>Console d'Expédition Multi-Transporteurs</span>
            </h2>
            <p class="text-[10px] text-slate-400 font-mono mt-0.5">Affectation du Waybill &amp; Signature de sortie d'allée</p>
          </div>
          <button @click="closeDispatchWizard" class="p-1 px-2 text-slate-500 hover:text-slate-350 text-xs font-mono font-bold uppercase">
            [ Fermer ]
          </button>
        </div>

        <!-- WORKSPACE -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <div class="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-1.5 text-xs">
            <h3 class="font-bold text-slate-200 font-mono text-[10px] uppercase text-indigo-400">Résumé Colis (Référence #{{ activeOrderForDispatch?.reference }})</h3>
            <p class="text-slate-400">Articles emballés: <strong class="text-slate-205">{{ activeOrderForDispatch ? getOrderLineText(activeOrderForDispatch) : '' }}</strong></p>
            <p class="text-slate-400">Dépôt de chargement physique: <strong class="text-slate-205 font-mono">{{ activeOrderForDispatch?.deliveryNote?.originWarehouseName }}</strong></p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <!-- PICK CARRIER PARTNER -->
            <label class="block">
              <span class="block text-[9.5px] uppercase font-mono tracking-wider text-indigo-400 font-bold mb-1">Société de Fret / Transporteur</span>
              <select 
                v-model="dispatchForm.carrierId"
                class="w-full bg-[#070b1a] border border-indigo-900 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                id="select-dispatch-carrier"
              >
                <option 
                  v-for="car in carriersList" 
                  :key="car.id" 
                  :value="car.id"
                >
                  🚛 {{ car.name }} ({{ car.type }} - Dispo)
                </option>
              </select>
            </label>

            <!-- CHOOSE MODE OF TRANSPORT DELIVERY -->
            <label class="block">
              <span class="block text-[9.5px] uppercase font-mono tracking-wider text-indigo-400 font-bold mb-1">Mode d'expédition d'expédition</span>
              <select 
                v-model="dispatchForm.deliveryMode"
                class="w-full bg-[#070b1a] border border-indigo-900 rounded-xl px-3 py-2 text-xs font-mono text-slate-205 focus:outline-none focus:border-indigo-500"
                id="select-dispatch-mode"
              >
                <option value="Rail Fast Cargo Fret">🚞 Rail Cargo Fret lourd (Camrail SNCB)</option>
                <option value="Road Heavy container 10T">🚛 Camion Heavy Duty container 10T (Soletrans)</option>
                <option value="Cold-Chain Isothermal Van">🚐 Fourgonnette Isotherme température régulée</option>
                <option value="Urban Fast Moto">🛵 Moto Cargo urbaine rapide Douala (Sawa Express)</option>
              </select>
            </label>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-950 pt-4">
            
            <!-- WAYBILL NUMBER PREVIEW -->
            <label class="block">
              <span class="block text-[9px] uppercase font-mono tracking-wider text-slate-500 font-bold mb-1">Lettre de Voiture (Automatique)</span>
              <input 
                type="text" 
                v-model="dispatchForm.waybillNumber"
                disabled
                class="w-full bg-[#050814] border border-slate-850 rounded-xl px-3 py-2 text-xs font-mono text-slate-400 cursor-not-allowed"
              />
            </label>

            <!-- LICENCE PLATE / DRIVER -->
            <label class="block">
              <span class="block text-[9px] uppercase font-mono tracking-wider text-slate-500 font-bold mb-1">Immatriculation du véhicule / Chauffeur</span>
              <input 
                type="text" 
                v-model="dispatchForm.vehiclePlate"
                placeholder="Ex: LT-893-OA [Simon Bello]"
                class="w-full bg-[#070b1a] border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-205 focus:outline-none focus:border-indigo-550"
                id="input-dispatch-plate"
              />
            </label>
          </div>
        </div>

        <!-- FOOTER -->
        <div class="p-6 border-t border-slate-800 bg-[#060a16] shrink-0 flex justify-end space-x-3">
          <button 
            @click="closeDispatchWizard"
            class="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-400 rounded-xl text-xs font-mono"
          >
            Annuler
          </button>
          
          <button 
            @click="executeDispatch"
            class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold uppercase rounded-xl text-xs tracking-wider transition shadow-lg hover:shadow-indigo-900/40 text-center flex items-center space-x-2"
            id="modal-dispatch-submit-btn"
          >
            <span>🚛 Expédier</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { orders as dbOrders, carriers as dbCarriers } from '@/utils/supplier_db.js';
import { useToast } from 'vue-toastification';

const toast = useToast();

const carriersList = computed(() => {
  return dbCarriers.value || [];
});

const packedOrders = computed(() => {
  // Only display orders that have been PACKED in the warehouse!
  return dbOrders.value?.filter(o => o.status === 'Packed') || [];
});

function getOrderLineText(order) {
  return order.items.map(i => `${i.productName || i.name} (x${i.quantity || i.qty})`).join(', ');
}

// Modal and state managers
const showDispatchModal = ref(false);
const activeOrderForDispatch = ref(null);

const dispatchForm = ref({
  carrierId: 'car_001',
  deliveryMode: 'Rail Fast Cargo Fret',
  waybillNumber: '',
  vehiclePlate: ''
});

function openDispatchWizard(order) {
  activeOrderForDispatch.value = order;
  const num = Math.floor(1000 + Math.random() * 9000);
  
  dispatchForm.value = {
    carrierId: 'car_001',
    deliveryMode: order.deliveryMode || 'Road Heavy container 10T',
    waybillNumber: `CMR-WYB-2026-${num}`,
    vehiclePlate: 'LT-893-OA [Ibrahim Bello]'
  };

  showDispatchModal.value = true;
}

function closeDispatchWizard() {
  showDispatchModal.value = false;
  activeOrderForDispatch.value = null;
}

// Action executor: Transitions Order to Shipped & saves Waybill data
function executeDispatch() {
  if (!activeOrderForDispatch.value) return;

  const ordIndex = dbOrders.value.findIndex(o => o.id === activeOrderForDispatch.value.id);
  if (ordIndex > -1) {
    const origOrder = dbOrders.value[ordIndex];
    const carrierObj = carriersList.value.find(c => c.id === dispatchForm.value.carrierId) || carriersList.value[0];

    // Mutate order state to local DB
    origOrder.status = 'Shipped';
    origOrder.carrierName = carrierObj.name;
    origOrder.deliveryMode = dispatchForm.value.deliveryMode;
    
    // Build delivery waybill note details
    origOrder.deliveryNote = {
      ...(origOrder.deliveryNote || {}),
      status: 'In_Transit',
      waybillNumber: dispatchForm.value.waybillNumber,
      carrierId: carrierObj.id,
      carrierName: carrierObj.name,
      deliveryMode: dispatchForm.value.deliveryMode,
      vehiclePlate: dispatchForm.value.vehiclePlate,
      dispatchedAt: new Date().toISOString()
    };

    if (!origOrder.history) origOrder.history = [];
    origOrder.history.push({
      status: 'Shipped',
      timestamp: new Date().toISOString(),
      label: 'Fret dispatché chez le transporteur',
      description: `Le convoi logistique a quitté l'aire de fret. Pris en charge par ${carrierObj.name} (${dispatchForm.value.deliveryMode}), véhicule immatriculé ${dispatchForm.value.vehiclePlate}. Waybill tracking activé.`
    });

    toast.success(`Le fret lié au waybill ${dispatchForm.value.waybillNumber} est officiellement EN TRANSIT.`);
    closeDispatchWizard();
  }
}

// Formatters
function formatMoney(val) {
  if (!val && val !== 0) return '-';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('XAF', 'FCFA');
}
</script>
