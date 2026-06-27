<template>
  <div class="space-y-6 max-w-6xl mx-auto" id="track-delivery-workspace">
    <!-- NAVIGATION HEADER -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--color-border)] pb-4 gap-4">
      <div class="space-y-1">
        <router-link to="/distributor/purchases" class="text-xs text-[var(--color-primary)] font-mono hover:underline flex items-center space-x-1">
          <span>&larr;</span>
          <span>Retour à l'approvisionnement</span>
        </router-link>
        <h1 class="text-lg font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
          <span>Suivi &amp; Émargement Logistique</span>
          <span class="text-[var(--color-primary)] font-mono text-xs">#{{ purchase?.id }}</span>
        </h1>
      </div>
      <div>
        <span class="px-3 py-1 bg-[var(--color-primary-muted)] text-[var(--color-primary)] rounded-full font-mono text-xs border border-[var(--color-primary-border)] font-bold uppercase">
          Fournisseur(s) : {{ purchase?.supplierIds.map(getSupplierName).join(', ') }}
        </span>
      </div>
    </div>

    <!-- MAIN TRACK AND SIGN WORKSPACE -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- LOGISTICS TRANSIT TIMELINE (LEFT 7 COLS) -->
      <div class="lg:col-span-7 space-y-6">
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 relative overflow-hidden shadow-sm">
          <div class="flex justify-between items-center mb-6 border-b border-[var(--color-border)] pb-4">
            <div>
              <h3 class="text-base font-bold text-[var(--color-text-primary)]">Feuille de Route Amont</h3>
              <p class="text-xs text-[var(--color-text-secondary)] mt-1">Parcours géographique des conteneurs d'usine &rarr; Entrepôt central.</p>
            </div>
            
            <span class="p-1.5 px-3.5 bg-[var(--color-primary-muted)] text-[var(--color-primary)] border border-[var(--color-primary-border)] text-xs font-mono rounded-lg font-bold uppercase animate-pulse">
              Fret Actif : {{ currentFretMode }}
            </span>
          </div>

          <!-- Simulation progress controller -->
          <div class="p-4 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl mb-6 space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-xs font-mono text-[var(--color-primary)] uppercase font-black tracking-widest">Console Logistique (Simulation)</span>
              <span class="text-[10px] font-mono text-[var(--color-text-secondary)]">Partenaire Amont</span>
            </div>
            <p class="text-xs text-[var(--color-text-secondary)] leading-normal">Simulez les étapes de chargement et de transit du fret industriel.</p>
            
            <div class="flex flex-wrap gap-2 pt-1 font-mono">
              <button 
                v-for="(lvl, idx) in transitSteps" 
                :key="idx"
                @click="setSimulationLevel(idx)"
                class="px-3 py-1.5 text-[10px] rounded-lg border transition uppercase font-bold"
                :class="currentStepIndex >= idx ? 'bg-[var(--color-primary-muted)] border-[var(--color-primary)] text-[var(--color-primary)]' : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'"
              >
                Étape {{ idx + 1 }}
              </button>
            </div>
          </div>

          <!-- PROGRESS TIMELINE -->
          <div class="space-y-6 relative pl-6 border-l border-[var(--color-border)] ml-4">
            <div 
              class="absolute -left-[14px] w-7 h-7 bg-[var(--color-primary)] rounded-full border-4 border-[var(--color-surface)] flex items-center justify-center transition-all duration-500 shadow-md"
              :style="{ top: truckPinTopOffset }"
              id="truck-transit-pin"
            >
              <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.75A1.125 1.125 0 012.625 17.625V12m18 5.625c0 .621-.504 1.125-1.125 1.125H18m-9-6.375V9m-3 3h12m-.75 3H6.75m12 0h2.25A1.125 1.125 0 0022.125 14.25V12m0 0l-3.375-4.5M21 12H18m0-3V6.75A1.125 1.125 0 0016.875 5.625H12m-3 0H5.625A1.125 1.125 0 004.5 6.75V9" />
              </svg>
            </div>

            <!-- List steps -->
            <div 
              v-for="(st, idx) in transitSteps" 
              :key="idx" 
              class="relative"
              :id="'transit-step-' + idx"
            >
              <div class="space-y-1">
                <div class="flex items-center space-x-2">
                  <span 
                    class="absolute -left-[29px] top-1.5 w-2.5 h-2.5 rounded-full border transition-all"
                    :class="currentStepIndex >= idx ? 'bg-[var(--color-primary)] border-[var(--color-primary)] scale-110 shadow-lg' : 'bg-[var(--color-surface-elevated)] border-[var(--color-border)]'"
                  ></span>
                  
                  <span 
                    class="text-sm font-bold leading-none font-mono"
                    :class="currentStepIndex >= idx ? 'text-[var(--color-text-primary)] font-extrabold' : 'text-[var(--color-text-secondary)]'"
                  >
                    {{ st.city }} - {{ st.label }}
                  </span>
                </div>
                <p 
                  class="text-xs leading-relaxed pr-6"
                  :class="currentStepIndex >= idx ? 'text-[var(--color-text-secondary)]' : 'text-[var(--color-text-secondary)]/50'"
                >
                  {{ st.desc }}
                </p>
                <span 
                  v-if="currentStepIndex >= idx" 
                  class="block text-[10px] font-mono text-[var(--color-text-secondary)]/60 italic"
                >
                  Heure de passage : {{ st.time }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RECEIVING VALIDATION / PREUVE DE LIVRAISON (RIGHT 5 COLS) -->
      <div class="lg:col-span-5 space-y-6">
        
        <!-- QR CODE PRESENTATION CONTAINER -->
        <div 
          v-if="purchase?.status !== 'Received'"
          class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 text-center space-y-4 shadow-sm"
          id="qr-verification-panel"
        >
          <div>
            <span class="px-2 py-0.5 bg-[var(--color-primary-muted)] text-[var(--color-primary)] font-mono text-[9px] uppercase font-black border border-[var(--color-primary-border)] rounded-full">Validation Fret</span>
            <h3 class="text-xs font-extrabold text-[var(--color-text-primary)] uppercase mt-2">QR Code de Réception</h3>
            <p class="text-[10.5px] text-[var(--color-text-secondary)] leading-normal mt-1">À présenter au transporteur lors de l'arrivée au quai de déchargement de l'entrepôt.</p>
          </div>

          <div class="w-36 h-36 bg-white p-3 mx-auto rounded-xl flex items-center justify-center border border-[var(--color-border)] shadow">
            <div class="w-full h-full relative">
              <div class="grid grid-cols-6 gap-1 w-full h-full opacity-90">
                <div v-for="n in 36" :key="n" :class="getQrPixelColor(n)" class="rounded-sm"></div>
              </div>
              <span class="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold bg-white/90 text-[var(--color-primary)] border border-slate-350 rounded shadow px-2 select-none uppercase">
                DIST-{{ String(purchase?.id).toUpperCase() }}
              </span>
            </div>
          </div>
        </div>

        <!-- THE PROOF OF DELIVERY (PoD) EMISSION PANEL -->
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
          <div class="p-5 border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)] flex items-center space-x-2">
            <svg class="w-5 h-5 text-[var(--color-primary)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <div>
              <h3 class="text-xs font-bold text-[var(--color-text-primary)] uppercase">Émargement électronique (PoD)</h3>
              <p class="text-[10px] text-[var(--color-text-secondary)]">Signer la réception de stock Distributeur B2B.</p>
            </div>
          </div>

          <!-- IF DELIVERED -->
          <div v-if="purchase?.status === 'Received'" class="p-6 space-y-4">
            <div class="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-center">
              <span class="text-emerald-600 font-mono text-[10px] font-black uppercase">✓ STOCK ENTRÉ EN ENTREPÔT</span>
              <p class="text-[11px] text-[var(--color-text-secondary)] mt-1 leading-snug">Livraison validée par le Distributeur. Le stock d'entrepôt central a été mis à jour.</p>
            </div>

            <div class="space-y-1 bg-[var(--color-surface-elevated)] p-3 rounded-xl border border-[var(--color-border)]">
              <span class="text-[9px] uppercase font-mono text-[var(--color-text-secondary)] font-bold block">Signature Réceptionnaire :</span>
              <div class="h-20 bg-[var(--color-surface)] rounded border border-[var(--color-border)] flex items-center justify-center relative overflow-hidden">
                <img 
                  v-if="purchase.deliveryNote?.proof?.signature" 
                  :src="purchase.deliveryNote.proof.signature"
                  alt="Drawn Signature"
                  class="h-full object-contain filter invert-0 dark:invert opacity-90"
                />
                <span v-else class="text-[10px] font-mono text-[var(--color-text-secondary)] italic">Signature enregistrée</span>
              </div>
              <p class="text-[10px] text-[var(--color-text-secondary)] font-mono leading-none mt-1.5 text-right">Signé par : <strong>{{ purchase.signedByName || 'Responsable Entrepôt' }}</strong></p>
            </div>

            <button 
              @click="downloadSignedWaybill"
              class="w-full py-2.5 bg-[var(--color-primary-muted)] text-[var(--color-primary)] font-mono text-xs font-bold uppercase rounded-xl border border-[var(--color-primary-border)] transition text-center"
            >
              Imprimer Bon de Réception Émargé
            </button>
          </div>

          <!-- IF SHIPPED / IN TRANSIT: LET VENDOR SIGN -->
          <div v-else class="p-6 space-y-5">
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <label class="block text-[10px] uppercase font-mono tracking-wider text-[var(--color-primary)] font-bold">Dessiner Signature de Réception</label>
                <button @click="clearSignature" class="text-[9px] font-mono text-red-500 hover:underline uppercase">[ Effacer ]</button>
              </div>
              
              <div class="bg-white rounded-xl overflow-hidden border border-slate-350 shadow-inner relative h-36">
                <canvas 
                  ref="sigCanvas"
                  @mousedown="startDrawing"
                  @mousemove="draw"
                  @mouseup="stopDrawing"
                  @mouseleave="stopDrawing"
                  @touchstart="startDrawingTouch"
                  @touchmove="drawTouch"
                  @touchend="stopDrawing"
                  class="w-full h-full cursor-crosshair block"
                ></canvas>
                <div v-if="canvasIsEmpty" class="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-400 text-[10px] font-mono uppercase italic select-none">
                  Dessinez votre signature ici
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <label class="block">
                <span class="block text-[9px] uppercase font-mono tracking-wider text-[var(--color-text-secondary)] font-bold mb-1">Nom du Réceptionnaire</span>
                <input 
                  type="text" 
                  v-model="receiverName"
                  class="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--color-text-primary)] font-mono"
                />
              </label>
              <label class="block">
                <span class="block text-[9px] uppercase font-mono tracking-wider text-[var(--color-text-secondary)] font-bold mb-1">Date</span>
                <input 
                  type="text" 
                  v-model="todayDateStr"
                  disabled
                  class="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--color-text-secondary)] font-mono"
                />
              </label>
            </div>

            <button 
              @click="saveIndorsement"
              class="w-full py-2.5 bg-[var(--color-primary)] text-white font-mono font-bold uppercase rounded-xl text-xs tracking-wider transition shadow-lg text-center"
            >
              Confirmer la Réception &amp; Intégrer les Stocks Entrepôt
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { purchases, b2b_suppliers, warehouses, delivery_notes, walletLocked } from '@/utils/distributor_db.js';
import { useToast } from 'vue-toastification';

const route = useRoute();
const toast = useToast();
const purchaseId = route.params.id;

const purchase = computed(() => {
  return purchases.value?.find(p => p.id === purchaseId) || purchases.value?.[0];
});

const receiverName = ref('Responsable Quai Paul');
const todayDateStr = ref(new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }));

const transitSteps = [
  { city: 'Usine Industrielle', label: 'Colisage & Départ', desc: 'Emballage, mise en conteneur et départ.', time: '08:00' },
  { city: 'Transit Autoroute', label: 'En Transit', desc: 'Fret en transit routier national.', time: '12:00' },
  { city: 'Quai de Déchargement', label: 'Arrivée Entrepôt', desc: 'Arrivée à destination, vérification qualitative.', time: '16:00' }
];

const currentStepIndex = ref(1);

const currentFretMode = computed(() => {
  if (purchase.value?.status === 'Received') return 'Fret Réceptionné';
  if (currentStepIndex.value === 2) return 'Approche Destination';
  return 'En transit';
});

const truckPinTopOffset = computed(() => {
  const stepsCount = transitSteps.length;
  const pct = (currentStepIndex.value / (stepsCount - 1)) * 100;
  return `calc(${pct}% - 14px)`;
});

function setSimulationLevel(idx) {
  currentStepIndex.value = idx;
  if (idx === 2 && purchase.value.status === 'Sent') {
    purchase.value.status = 'In Transit';
  }
}

function getSupplierName(id) {
  const found = b2b_suppliers.value.find(s => s.id === id);
  return found ? found.name : id;
}

function getQrPixelColor(n) {
  const pList = [1, 4, 7, 10, 15, 18, 22, 25, 29, 31, 35];
  return pList.includes(n % 8) ? 'bg-slate-900' : 'bg-slate-200';
}

const sigCanvas = ref(null);
const canvasIsEmpty = ref(true);
let isDrawing = false;
let ctx = null;

onMounted(() => {
  initCanvas();
});

function initCanvas() {
  if (!sigCanvas.value) return;
  const canvas = sigCanvas.value;
  ctx = canvas.getContext('2d');
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
}

function startDrawing(e) {
  isDrawing = true;
  canvasIsEmpty.value = false;
  ctx.beginPath();
  const rect = sigCanvas.value.getBoundingClientRect();
  ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function draw(e) {
  if (!isDrawing) return;
  const rect = sigCanvas.value.getBoundingClientRect();
  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
  ctx.stroke();
}

function stopDrawing() {
  isDrawing = false;
}

function startDrawingTouch(e) {
  e.preventDefault();
  isDrawing = true;
  canvasIsEmpty.value = false;
  ctx.beginPath();
  const rect = sigCanvas.value.getBoundingClientRect();
  const touch = e.touches[0];
  ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
}

function drawTouch(e) {
  e.preventDefault();
  if (!isDrawing) return;
  const rect = sigCanvas.value.getBoundingClientRect();
  const touch = e.touches[0];
  ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
  ctx.stroke();
}

function clearSignature() {
  if (!sigCanvas.value) return;
  ctx.clearRect(0, 0, sigCanvas.value.width, sigCanvas.value.height);
  canvasIsEmpty.value = true;
}

function saveIndorsement() {
  if (!purchase.value) return;
  let signatureData = '';
  if (sigCanvas.value) {
    signatureData = sigCanvas.value.toDataURL('image/png');
  }

  purchase.value.status = 'Received';
  purchase.value.signedByName = receiverName.value;
  purchase.value.deliveryNote = {
    status: 'Completed',
    proof: {
      signature: signatureData,
      signedByName: receiverName.value,
      signedAt: new Date().toISOString()
    }
  };

  // Pick the first warehouse to store the items
  const wh = warehouses.value[0];
  
  // Create a Delivery Note (BL)
  const newBL = {
    id: `dn_00${delivery_notes.value.length + 1}`,
    purchaseId: purchase.value.id,
    supplierId: purchase.value.supplierIds[0] || 'Unknown',
    date: new Date().toISOString().split('T')[0],
    receivedBy: receiverName.value,
    status: 'Verified',
    warehouseId: wh?.id || 'wh_1',
    items: purchase.value.items.map(item => ({
      name: item.name,
      qtyExpected: item.qty,
      qtyReceived: item.qty
    }))
  };
  
  delivery_notes.value.unshift(newBL);
  
  // Increment stocks in the warehouse inventory
  if (wh) {
    purchase.value.items.forEach(item => {
      const existing = wh.inventory.find(i => i.name === item.name);
      if (existing) {
        existing.stock += item.qty;
        existing.value += (item.qty * item.unitPrice);
      } else {
        wh.inventory.push({
          id: 'prod_' + Math.floor(Math.random() * 1000 + 500),
          name: item.name,
          stock: item.qty,
          value: item.qty * item.unitPrice
        });
      }
    });
  }

  // ESCROW: Release the funds (remove from locked wallet)
  if (purchase.value.paymentMethod === 'Escrow') {
    const lockedEntryIndex = walletLocked.value.findIndex(l => l.refId === purchase.value.id);
    if (lockedEntryIndex > -1) {
      const lockedEntry = walletLocked.value[lockedEntryIndex];
      walletLocked.value.splice(lockedEntryIndex, 1);
      toast.success(`Paiement de ${formatMoney(lockedEntry.amount)} débloqué du séquestre.`);
    }
  }

  toast.success('Réception validée. Stocks d\'entrepôt mis à jour !');
}

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val || 0).replace('XAF', 'FCFA');
}

function downloadSignedWaybill() {
  window.print();
}
</script>

<style scoped>
#canvas-signature-pad {
  touch-action: none;
}
</style>
