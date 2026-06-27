<template>
  <div class="space-y-6 max-w-6xl mx-auto" id="track-delivery-workspace">
    <!-- NAVIGATION HEADER -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--color-border)] pb-4 gap-4">
      <div class="space-y-1">
        <router-link to="/buyer/orders" class="text-xs text-[var(--color-primary)] font-mono hover:underline flex items-center space-x-1">
          <span>&larr;</span>
          <span>Retour à l'historique</span>
        </router-link>
        <h1 class="text-lg font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
          <span>Suivi &amp; Émargement Logistique</span>
          <span class="text-[var(--color-primary)] font-mono text-xs">#{{ order?.reference }}</span>
        </h1>
      </div>
      <div>
        <span class="px-3 py-1 bg-[var(--color-primary-muted)] text-[var(--color-primary)] rounded-full font-mono text-xs border border-[var(--color-primary-border)] font-bold uppercase">
          Transporteur : {{ order?.carrierName || 'Afrique Logistique Express' }}
        </span>
      </div>
    </div>

    <!-- MAIN TRACK AND SIGN WORKSPACE -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- LOGISTICS TRANSIT REAL-TIME TIMELINE (LEFT 7 COLS) -->
      <div class="lg:col-span-7 space-y-6">
        
        <!-- FLUX PROGRESS MAP/ROAD HUD -->
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 relative overflow-hidden shadow-sm">
          <div class="flex justify-between items-center mb-6 border-b border-[var(--color-border)] pb-4">
            <div>
              <h3 class="text-base font-bold text-[var(--color-text-primary)]">Feuille de Route &amp; Positions</h3>
              <p class="text-xs text-[var(--color-text-secondary)] mt-1">Parcours géographique Douala Autostrade &rarr; Yaoundé Hub.</p>
            </div>
            
            <span class="p-1.5 px-3.5 bg-[var(--color-primary-muted)] text-[var(--color-primary)] border border-[var(--color-primary-border)] text-xs font-mono rounded-lg font-bold uppercase animate-pulse">
              Fret Actif : {{ currentFretMode }}
            </span>
          </div>

          <!-- Simulation progress controller -->
          <div class="p-4 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl mb-6 space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-xs font-mono text-[var(--color-primary)] uppercase font-black tracking-widest">Console Logistique (Simulation)</span>
              <span class="text-[10px] font-mono text-[var(--color-text-secondary)]">Mode démonstrateur</span>
            </div>
            <p class="text-xs text-[var(--color-text-secondary)] leading-normal">Augmentez le statut ou changez d'étape de transit pour simuler le parcours du chauffeur routier à travers le Cameroun.</p>
            
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

          <!-- VERBOSE PROGRESS TIMELINE -->
          <div class="space-y-6 relative pl-6 border-l border-[var(--color-border)] ml-4">
            
            <!-- Dynamic vertical truck container pin -->
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
                  <!-- Bullet marker -->
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
                  Heure de passage estimée : {{ st.time }}
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
          v-if="order?.status === 'Shipped'"
          class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 text-center space-y-4 shadow-sm"
          id="qr-verification-panel"
        >
          <div>
            <span class="px-2 py-0.5 bg-[var(--color-primary-muted)] text-[var(--color-primary)] font-mono text-[9px] uppercase font-black border border-[var(--color-primary-border)] rounded-full">Code de validation fret</span>
            <h3 class="text-xs font-extrabold text-[var(--color-text-primary)] uppercase mt-2">QR Livraison Sécurisé</h3>
            <p class="text-[10.5px] text-[var(--color-text-secondary)] leading-normal mt-1">Présentez ce QR code unique au chauffeur routier à l'arrivée pour déclencher la passerelle d'émargement.</p>
          </div>

          <!-- MOCK REALISTIC QR CODE GRAPHIC -->
          <div class="w-36 h-36 bg-white p-3 mx-auto rounded-xl flex items-center justify-center border border-[var(--color-border)] shadow">
            <div class="w-full h-full relative" id="qr-canvas-mock">
              <!-- Pixel Grid to simulate QR code -->
              <div class="grid grid-cols-6 gap-1 w-full h-full pointer-events-none opacity-90">
                <div v-for="n in 36" :key="n" :class="getQrPixelColor(n)" class="rounded-sm"></div>
              </div>
              <span class="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold bg-white/90 text-[var(--color-primary)] border border-slate-350 rounded shadow px-2 select-none uppercase">
                PO-{{ String(order?.id).toUpperCase() }}
              </span>
            </div>
          </div>

          <p class="text-[9.5px] font-mono text-[var(--color-primary)] uppercase">Valable pour : Sourcing Cameroun S.A.</p>
        </div>

        <!-- THE PROOF OF DELIVERY (PoD) EMISSION PANEL -->
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
          <div class="p-5 border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)] flex items-center space-x-2">
            <svg class="w-5 h-5 text-[var(--color-primary)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <div>
              <h3 class="text-xs font-bold text-[var(--color-text-primary)] uppercase">Émargement électronique (PoD)</h3>
              <p class="text-[10px] text-[var(--color-text-secondary)]">Documentez la conformité du fret et signez.</p>
            </div>
          </div>

          <!-- IF DELIVERED: SHOW PREVIEW OF SIGNATURE + PROOF PHOTO -->
          <div v-if="order?.status === 'Delivered' || order?.status === 'Completed'" class="p-6 space-y-4">
            <div class="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-center">
              <span class="text-emerald-600 font-mono text-[10px] font-black uppercase">✓ RÉCEPTION LOGISTIQUE CERTIFIÉE</span>
              <p class="text-[11px] text-[var(--color-text-secondary)] mt-1 leading-snug">Livraison reçue, emballages scellés vérifiés, preuve de livraison sauvegardée dans la blockchain locale du locataire.</p>
            </div>

            <!-- Drawn signature storage view -->
            <div class="space-y-1 bg-[var(--color-surface-elevated)] p-3 rounded-xl border border-[var(--color-border)]">
              <span class="text-[9px] uppercase font-mono text-[var(--color-text-secondary)] font-bold block">Signature du Récepteur :</span>
              <div class="h-20 bg-[var(--color-surface)] rounded border border-[var(--color-border)] flex items-center justify-center relative overflow-hidden">
                <img 
                  v-if="savedSignature" 
                  :src="savedSignature"
                  alt="Drawn Signature"
                  class="h-full object-contain filter invert-0 dark:invert opacity-90"
                />
                <span v-else class="text-[10px] font-mono text-[var(--color-text-secondary)] italic">Signature tactile/manuelle validée</span>
              </div>
              <p class="text-[10px] text-[var(--color-text-secondary)] font-mono leading-none mt-1.5 text-right">Signé par : <strong>{{ order?.signedByName || 'Comptoir Douala' }}</strong></p>
            </div>

            <!-- Photo of proof storage view -->
            <div v-if="savedPhoto" class="space-y-1 bg-[var(--color-surface-elevated)] p-3 rounded-xl border border-[var(--color-border)]">
              <span class="text-[9px] uppercase font-mono text-[var(--color-text-secondary)] font-bold block">Cliché Preuve Physique (Fret Déchargé) :</span>
              <div class="h-28 rounded overflow-hidden border border-[var(--color-border)] relative">
                <img :src="savedPhoto" alt="Proof cargo" class="w-full h-full object-cover" />
              </div>
            </div>

            <!-- Notes storage view -->
            <div v-if="order?.notes" class="text-xs p-3 bg-[var(--color-surface-elevated)] rounded-xl border border-[var(--color-border)] text-[var(--color-text-secondary)] italic">
              " {{ order.notes }} "
            </div>

            <!-- Download Signed delivery sheet -->
            <button 
              @click="downloadSignedWaybill"
              class="w-full py-2.5 bg-[var(--color-primary-muted)] text-[var(--color-primary)] font-mono text-xs font-bold uppercase rounded-xl border border-[var(--color-primary-border)] transition text-center"
            >
              Imprimer Bon de Livraison Émargé (BL)
            </button>
          </div>

          <!-- IF SHIPPED: LET THE BUYER FILE CAPTURE INDORSEMENT -->
          <div v-else-if="order?.status === 'Shipped'" class="p-6 space-y-5">
            
            <!-- SIGNATURE DRAWING PAD -->
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <label class="block text-[10px] uppercase font-mono tracking-wider text-[var(--color-primary)] font-bold">Émarger Signature Tactile/Souris</label>
                <button 
                  @click="clearSignature" 
                  class="text-[9px] font-mono text-red-500 hover:underline uppercase"
                  id="clear-sign-btn"
                >
                  [ Effacer ]
                </button>
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
                  id="canvas-signature-pad"
                ></canvas>
                <div v-if="canvasIsEmpty" class="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-400 text-[10px] font-mono uppercase italic select-none">
                  Dessinez ou tracez votre signature ici
                </div>
              </div>
            </div>

            <!-- VERBAL METADATA REGISTER -->
            <div class="grid grid-cols-2 gap-3">
              <label class="block">
                <span class="block text-[9px] uppercase font-mono tracking-wider text-[var(--color-text-secondary)] font-bold mb-1">Nom du Récepteur</span>
                <input 
                  type="text" 
                  v-model="receiverName"
                  placeholder="Ex: Armel Simon"
                  class="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] font-mono"
                  id="input-receiver-name"
                />
              </label>

              <label class="block">
                <span class="block text-[9px] uppercase font-mono tracking-wider text-[var(--color-text-secondary)] font-bold mb-1">Date Signature</span>
                <input 
                  type="text" 
                  v-model="todayDateStr"
                  disabled
                  class="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--color-text-secondary)] font-mono"
                />
              </label>
            </div>

            <!-- PROOF PHOTO SELECTION PRESET -->
            <div class="space-y-2">
              <span class="block text-[9px] uppercase font-mono tracking-wider text-[var(--color-primary)] font-bold">Preuve Physique (Photo Déchargement Cargo)</span>
              <p class="text-[9.5px] text-[var(--color-text-secondary)] leading-tight">Sélectionnez une photo de déchargement sur le quai pour la téléverser en pièce jointe certifiée.</p>
              
              <div class="grid grid-cols-3 gap-2">
                <div 
                  v-for="ph in presetPhotos" 
                  :key="ph.id"
                  @click="selectedPhotoId = ph.id"
                  class="border rounded-xl p-1 overflow-hidden cursor-pointer relative transition"
                  :class="selectedPhotoId === ph.id ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary-muted)]' : 'border-[var(--color-border)] hover:border-[var(--color-text-secondary)]'"
                >
                  <img :src="ph.url" alt="cargo proof" class="w-full h-12 object-cover rounded" />
                  <span class="absolute bottom-1 right-1 bg-black/70 text-slate-205 text-[6.5px] font-mono px-1 rounded uppercase">
                    {{ ph.name }}
                  </span>
                </div>
              </div>
            </div>

            <!-- NOTES / COMMENTS -->
            <label class="block">
              <span class="block text-[9px] uppercase font-mono tracking-wider text-[var(--color-text-secondary)] font-bold mb-1">Remarques / Réserves à la livraison</span>
              <textarea 
                v-model="deliveryNotes"
                placeholder="Ex: Reçu conforme, fèves sèches bien fermées sous scellés n°490A"
                rows="2"
                class="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] font-sans"
                id="textarea-remarks"
              ></textarea>
            </label>

            <!-- SUBMIT ACTION BUTTON -->
            <button 
              @click="saveIndorsement"
              class="w-full py-2.5 bg-[var(--color-primary)] text-white font-mono font-bold uppercase rounded-xl text-xs tracking-wider transition shadow-lg text-center"
              id="btn-confirm-delivery"
            >
              Émarger &amp; Décharger le Fret
            </button>
          </div>

          <!-- IF OTHER STATES (PREPARING, APPROVED, PACKED): NOTIFY IN-PROGRESS -->
          <div v-else class="p-8 text-center text-xs text-[var(--color-text-secondary)] font-mono space-y-2">
            <span class="text-2xl block">⚙️</span>
            <p class="font-bold text-[var(--color-text-primary)]">Le transporteur s'organise pour le départ.</p>
            <p class="text-[10px] text-[var(--color-text-secondary)]/70 leading-relaxed">Une fois que le fournisseur aura terminé le colisage FIFO (PEPS) et validé l'expédition, le code de tracking s'activera.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { orders as dbOrders } from '@/utils/supplier_db.js';
import { useToast } from 'vue-toastification';

const route = useRoute();
const toast = useToast();
const orderId = route.params.id;

const order = computed(() => {
  return dbOrders.value?.find(o => o.id === orderId) || dbOrders.value?.[0];
});

const presetPhotos = [
  { id: 'pres_1', name: 'Sacs Cacao', url: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&q=80&w=300' },
  { id: 'pres_2', name: 'Fûts Métal', url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=300' },
  { id: 'pres_3', name: 'Entrepôt Sec', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=300' }
];

const selectedPhotoId = ref('pres_1');
const receiverName = ref('Armel Simon (Sourcing S.A.)');
const deliveryNotes = ref('');
const todayDateStr = ref(new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }));

const transitSteps = [
  { city: 'Douala Bassa', label: 'Départ Entrepôt', desc: 'Chassez les scellés, inspection de la cargaison et départ camion.', time: '08:35', bgOffset: '0%' },
  { city: 'Péage d\'Édéa', label: 'Transit National', desc: 'Point de contrôle routier national franchi avec succès.', time: '11:15', bgOffset: '25%' },
  { city: 'Mandoumba', label: 'Escale Technique', desc: 'Point relais logistique, vérification de la tension des sangles.', time: '13:40', bgOffset: '50%' },
  { city: 'Yaoundé Mvan', label: 'Centre de Tri', desc: 'Arrivée à la plateforme de déserte locale du Centre.', time: '15:10', bgOffset: '75%' },
  { city: 'Douala Sawa', label: 'En cours de Livraison', desc: 'Chauffeur en cours d\'approche finale de vos entrepôts.', time: '16:00', bgOffset: '100%' }
];

const currentStepIndex = ref(2);

const currentFretMode = computed(() => {
  if (order.value?.status === 'Delivered' || order.value?.status === 'Completed') return 'Fret Livré';
  if (currentStepIndex.value === 4) return 'Approche Destination';
  return 'En transit routier';
});

const truckPinTopOffset = computed(() => {
  const stepsCount = transitSteps.length;
  const pct = (currentStepIndex.value / (stepsCount - 1)) * 100;
  return `calc(${pct}% - 14px)`;
});

function setSimulationLevel(idx) {
  currentStepIndex.value = idx;
  toast.info(`Étape de simulation modifiée : ${transitSteps[idx].city}`);
}

function getQrPixelColor(n) {
  const pList = [1, 2, 3, 4, 11, 15, 18, 22, 23, 24, 25, 29, 32, 33, 34, 35, 36];
  return pList.includes(n % pList.length) ? 'bg-slate-900' : 'bg-slate-200';
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

const savedSignature = computed(() => {
  return order.value?.deliveryNote?.proof?.signature || null;
});

const savedPhoto = computed(() => {
  return order.value?.deliveryNote?.proof?.photoUrl || null;
});

function saveIndorsement() {
  if (!order.value) return;
  
  let signatureData = '';
  if (sigCanvas.value) {
    signatureData = sigCanvas.value.toDataURL('image/png');
  }

  const selectedPhotoUrl = presetPhotos.find(p => p.id === selectedPhotoId.value)?.url || presetPhotos[0].url;

  const ordIndex = dbOrders.value.findIndex(o => o.id === order.value.id);
  if (ordIndex > -1) {
    const origOrder = dbOrders.value[ordIndex];
    origOrder.status = 'Delivered';
    origOrder.signedByName = receiverName.value;
    origOrder.notes = deliveryNotes.value;
    origOrder.paymentStatus = 'Settled';
    
    origOrder.deliveryNote = {
      ...(origOrder.deliveryNote || {}),
      status: 'Delivered',
      proof: {
        signature: signatureData,
        photoUrl: selectedPhotoUrl,
        signedByName: receiverName.value,
        signedAt: new Date().toISOString()
      }
    };

    if (!origOrder.history) origOrder.history = [];
    origOrder.history.push({
      status: 'Delivered',
      timestamp: new Date().toISOString(),
      label: 'Livré & Émargé (Validated)',
      description: `Cargaison vérifiée et déchargée. Émargé électroniquement sous la supervision de l'officier logistique.`
    });

    // Release escrow money from buyer's locked wallet and transfer to vendor's free wallet
    import('@/utils/vendor_db.js').then(vendorDb => {
      const escrowEntryIndex = walletLocked.value.findIndex(e => e.refId === origOrder.id);
      if (escrowEntryIndex > -1) {
        const escrowEntry = walletLocked.value[escrowEntryIndex];
        walletLocked.value.splice(escrowEntryIndex, 1);
        vendorDb.walletFree.value += escrowEntry.amount;
        toast.success(`Séquestre de ${formatMoney(escrowEntry.amount)} libéré et versé au vendeur.`);
      }
    }).catch(err => {
      console.error('Failed to release escrow to vendor:', err);
    });

    toast.success('Réception logistique validée, émargement sauvegardé !');
  }
}

function downloadSignedWaybill() {
  window.print();
  toast.success('Génération de l\'imprimable du Bon de Livraison Émargé lancée.');
}
</script>

<style scoped>
#canvas-signature-pad {
  touch-action: none;
}
</style>
