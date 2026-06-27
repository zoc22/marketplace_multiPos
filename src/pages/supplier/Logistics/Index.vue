<template>
  <div class="space-y-6 max-w-7xl mx-auto" id="logistics-board">
    <!-- PANEL HEADER -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 select-none relative overflow-hidden shadow-sm">
      <div class="flex items-center space-x-2 mb-2">
        <span class="text-[10px] font-bold bg-[var(--color-primary-muted)] text-[var(--color-primary)] px-3 py-1 rounded-full uppercase tracking-wider">
          Fret et Expéditions
        </span>
      </div>
      <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Logistique et Transporteurs</h1>
      <p class="text-sm text-[var(--color-text-secondary)] mt-1">Gérez vos flottes de livraison, attribuez les contrats de transport et éditez les feuilles de route.</p>
    </div>

    <!-- CARRIER FLEET FLEET STATUS INFO -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- CARRIER FIRMS CAPTURES (LEFT 2 COLUMNS ON DESKTOP) -->
      <div class="md:col-span-2 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 space-y-5 shadow-sm">
        <h3 class="text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">Transporteurs agréés et flotte</h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div 
            v-for="car in carriersList" 
            :key="car.id"
            class="bg-[var(--color-surface-hover)] p-4 border border-[var(--color-border)] rounded-xl flex flex-col justify-between transition hover:border-[var(--color-primary-border)]"
          >
            <div>
              <span class="text-[10px] font-semibold text-[var(--color-primary)] uppercase tracking-wider">{{ car.type }}</span>
              <h4 class="text-sm font-bold text-[var(--color-text-primary)] mt-1">{{ car.name }}</h4>
              <p class="text-xs text-[var(--color-text-secondary)] mt-1">Zone : {{ car.route }}</p>
            </div>
            
            <div class="flex justify-between items-center pt-3 mt-3 border-t border-[var(--color-border)]">
              <span class="text-xs font-semibold text-[var(--color-text-muted)]">{{ car.plate }}</span>
              <span 
                class="text-[10px] font-bold px-2 py-0.5 rounded-md border" 
                :class="car.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'"
              >
                {{ car.status === 'Active' ? 'Disponible' : 'En route' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- FLEET DENSITY ANALYSIS -->
      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4 justify-between flex flex-col shadow-sm">
        <div>
          <h3 class="text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">Modes d'expédition</h3>
          <p class="text-xs text-[var(--color-text-secondary)] mt-3 leading-relaxed">
            Soutien multimodal : transport ferroviaire lourd pour les longs trajets, fourgons réfrigérés thermo-régulés ou motocycles d'agglomération rapide.
          </p>
        </div>

        <div class="p-4 bg-[var(--color-surface-hover)] rounded-xl border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] space-y-2">
          <div class="flex justify-between font-medium">
            <span>Rail Cargo :</span>
            <span class="text-[var(--color-text-primary)] font-bold">100% Opérationnel</span>
          </div>
          <div class="flex justify-between font-medium">
            <span>Fourgonnettes :</span>
            <span class="text-sky-500 font-bold">92% Opérationnel</span>
          </div>
          <div class="flex justify-between font-medium">
            <span>Réseau Moto :</span>
            <span class="text-emerald-500 font-bold">Dispo. immédiate</span>
          </div>
        </div>
      </div>
    </div>

    <!-- PACKED PACKAGES AWAITING SHIPMENT DISPATCH -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm" id="awaiting-dispatch-table-desk">
      <div class="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
        <h3 class="text-sm font-bold text-[var(--color-text-primary)]">Expéditions en attente (Colis prêts)</h3>
        <span class="px-3 py-1 bg-[var(--color-primary-muted)] text-[var(--color-primary)] rounded-full text-xs font-semibold animate-pulse border border-[var(--color-primary-border)]">Colisage validé</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[var(--color-surface-hover)] border-b border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
              <th class="p-4">Référence</th>
              <th class="p-4">Dépôt d'origine</th>
              <th class="p-4">Acheteur</th>
              <th class="p-4">Mode requis</th>
              <th class="p-4 text-right">Valeur TTC</th>
              <th class="p-4 text-center">Statut</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr 
              v-for="order in packedOrders" 
              :key="order.id"
              class="hover:bg-[var(--color-surface-hover)] transition text-sm text-[var(--color-text-primary)]"
              :id="'log-row-' + order.id"
            >
              <td class="p-4 font-bold text-[var(--color-primary)]">
                <router-link :to="'/supplier/orders/' + order.id" class="hover:underline flex items-center space-x-1.5">
                  <CubeIcon class="h-4 w-4" aria-label="Package" />
                  <span>{{ order.reference }}</span>
                </router-link>
              </td>
              <td class="p-4 font-semibold text-[var(--color-text-primary)] flex items-center gap-1.5">
                <BuildingOfficeIcon class="h-4 w-4 text-[var(--color-text-muted)]" aria-label="Office" />
                <span>{{ order.deliveryNote?.originWarehouseName || 'Entrepôt central' }}</span>
              </td>
              <td class="p-4">
                <div>
                  <span class="block font-bold text-[var(--color-text-primary)]">{{ order.clientCompany || order.clientName }}</span>
                  <span class="block text-xs text-[var(--color-text-muted)]">{{ order.clientCity || 'Douala' }}</span>
                </div>
              </td>
              <td class="p-4 font-semibold text-[var(--color-primary)]">{{ order.deliveryMode || 'Rail Cargo Fret' }}</td>
              <td class="p-4 text-right font-bold">{{ formatMoney(order.total) }}</td>
              <td class="p-4 text-center">
                <span class="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full border border-blue-500/20 text-xs font-semibold">
                  Prêt à charger
                </span>
              </td>
              <td class="p-4 text-right">
                <button 
                  @click="openDispatchWizard(order)"
                  class="px-3 py-1.5 bg-[var(--color-primary)] hover:opacity-90 text-white font-semibold text-xs rounded-lg transition flex items-center space-x-1.5 shadow-sm ml-auto"
                  :id="'btn-log-dispatch-' + order.id"
                >
                  <TruckIcon class="h-4 w-4" aria-label="Truck" />
                  <span>Expédier</span>
                </button>
              </td>
            </tr>

            <tr v-if="packedOrders.length === 0">
              <td colspan="7" class="p-10 text-center text-sm text-[var(--color-text-muted)] italic">
                Aucun colis validé en attente. Complétez d'abord l'étape de colisage sur vos commandes.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- EXPEDITION MODAL CONSOLE: CARRIER ASSIGNATION & DISPATCH -->
    <Transition name="modal-fade">
      <div 
        v-if="showDispatchModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="closeDispatchWizard"
        id="dispatch-modal"
      >
        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] modal-content">
          
          <!-- HEADER -->
          <div class="p-6 border-b border-[var(--color-border)] flex items-center justify-between shrink-0">
            <div>
              <h2 class="text-xl font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
                <TruckIcon class="h-6 w-6 text-[var(--color-primary)]" aria-label="Truck" />
                <span>Console d'expédition</span>
              </h2>
              <p class="text-sm text-[var(--color-text-secondary)] mt-1">Affectation du transporteur et édition de la feuille de route.</p>
            </div>
            <button @click="closeDispatchWizard" class="p-1.5 bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-md transition font-bold text-lg leading-none">
              &times;
            </button>
          </div>

          <!-- WORKSPACE -->
          <div class="flex-1 overflow-y-auto p-6 space-y-6">
            <div class="p-5 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl space-y-2 text-sm text-[var(--color-text-secondary)]">
              <h3 class="font-bold text-[var(--color-text-primary)] text-sm mb-3">Résumé de l'expédition (Réf : #{{ activeOrderForDispatch?.reference }})</h3>
              <p>Articles emballés : <strong class="text-[var(--color-text-primary)]">{{ activeOrderForDispatch ? getOrderLineText(activeOrderForDispatch) : '' }}</strong></p>
              <p>Dépôt de chargement physique : <strong class="text-[var(--color-text-primary)]">{{ activeOrderForDispatch?.deliveryNote?.originWarehouseName }}</strong></p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              <!-- PICK CARRIER PARTNER -->
              <label class="block">
                <span class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Société de transport <span class="text-red-500">*</span></span>
                <select 
                  v-model="dispatchForm.carrierId"
                  class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                  id="select-dispatch-carrier"
                >
                  <option 
                    v-for="car in carriersList" 
                    :key="car.id" 
                    :value="car.id"
                  >
                    {{ car.name }} ({{ car.type }})
                  </option>
                </select>
              </label>

              <!-- CHOOSE MODE OF TRANSPORT DELIVERY -->
              <label class="block">
                <span class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Mode d'expédition <span class="text-red-500">*</span></span>
                <select 
                  v-model="dispatchForm.deliveryMode"
                  class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                  id="select-dispatch-mode"
                >
                  <option value="Rail Fast Cargo Fret">Rail Cargo Fret lourd</option>
                  <option value="Road Heavy container 10T">Camion Heavy Duty 10T</option>
                  <option value="Cold-Chain Isothermal Van">Fourgonnette Isotherme</option>
                  <option value="Urban Fast Moto">Moto Cargo urbaine rapide</option>
                </select>
              </label>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-[var(--color-border)] pt-5">
              
              <!-- WAYBILL NUMBER PREVIEW -->
              <label class="block">
                <span class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Lettre de voiture (Auto)</span>
                <input 
                  type="text" 
                  v-model="dispatchForm.waybillNumber"
                  disabled
                  class="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--color-text-muted)] cursor-not-allowed"
                />
              </label>

              <!-- LICENCE PLATE / DRIVER -->
              <label class="block">
                <span class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Immatriculation / Chauffeur <span class="text-red-500">*</span></span>
                <input 
                  type="text" 
                  v-model="dispatchForm.vehiclePlate"
                  placeholder="Ex: LT-893-OA [Simon Bello]"
                  class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                  id="input-dispatch-plate"
                />
              </label>
            </div>
          </div>

          <!-- FOOTER -->
          <div class="p-6 border-t border-[var(--color-border)] bg-[var(--color-surface-hover)] shrink-0 flex justify-end space-x-3">
            <button 
              @click="closeDispatchWizard"
              class="px-5 py-2.5 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] hover:bg-[var(--color-border)] text-[var(--color-text-primary)] rounded-xl text-sm font-semibold transition"
            >
              Annuler
            </button>
            
            <button 
              @click="executeDispatch"
              class="px-5 py-2.5 bg-[var(--color-primary)] hover:opacity-90 text-white font-bold rounded-xl text-sm transition shadow-sm flex items-center space-x-2"
              id="modal-dispatch-submit-btn"
            >
              <TruckIcon class="h-5 w-5" aria-hidden="true" />
              <span>Valider l'expédition</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { orders as dbOrders, carriers as dbCarriers } from '@/utils/supplier_db.js';
import { useToast } from 'vue-toastification';

// Only importing necessary icons assuming they are registered globally or we import them properly.
// The original used CubeIcon, BuildingOfficeIcon, TruckIcon from @heroicons/vue/24/outline
import { CubeIcon, BuildingOfficeIcon, TruckIcon } from '@heroicons/vue/24/outline';

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
      description: `L'expédition a quitté l'entrepôt. Pris en charge par ${carrierObj.name} (${dispatchForm.value.deliveryMode}), véhicule immatriculé ${dispatchForm.value.vehiclePlate}.`
    });

    toast.success(`La commande ${dispatchForm.value.waybillNumber} est officiellement en transit.`);
    closeDispatchWizard();
  }
}

// Formatters
function formatMoney(val) {
  if (!val && val !== 0) return '-';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('XAF', 'FCFA');
}
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .modal-content, .modal-fade-leave-to .modal-content {
  transform: translateY(20px) scale(0.95);
}
.modal-content {
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
</style>
