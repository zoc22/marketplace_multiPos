<template>
  <div class="space-y-6 max-w-4xl mx-auto" id="buyer-confirm-delivery">
    <!-- NAVIGATION HEADER -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--color-border)] pb-4 gap-4">
      <div class="space-y-1">
        <router-link to="/buyer/orders" class="text-xs text-[var(--color-primary)] font-mono hover:underline flex items-center space-x-1">
          <span>&larr;</span>
          <span>Retour aux commandes</span>
        </router-link>
        <h1 class="text-lg font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
          <span>Validation de Réception &amp; Émargement</span>
          <span class="text-[var(--color-primary)] font-mono text-xs">#{{ order?.reference }}</span>
        </h1>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- DELIVERY NOTE VIEW (LEFT 7 COLS) -->
      <div class="lg:col-span-7 space-y-6">
        <div class="bg-white text-slate-900 p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div class="border-b pb-4 mb-4">
            <h3 class="font-bold text-sm text-slate-900 font-mono uppercase">BON DE LIVRAISON : {{ deliveryNote?.reference || 'N/A' }}</h3>
            <p class="text-xs text-slate-500 font-mono mt-1">Date d'émission : {{ formatDate(deliveryNote?.date_emission) }}</p>
          </div>

          <div class="space-y-4">
            <div class="text-xs font-mono space-y-1">
              <div><span class="text-slate-500">Expéditeur (Vendor) :</span> <strong class="text-slate-900">{{ deliveryNote?.emitter_id }}</strong></div>
              <div><span class="text-slate-500">Transporteur :</span> <span class="text-slate-700">{{ deliveryNote?.carrier || 'Afrique Logistique Express' }}</span></div>
              <div><span class="text-slate-500">Numéro de Suivi :</span> <span class="text-slate-700 font-bold">{{ deliveryNote?.tracking_number || 'N/A' }}</span></div>
            </div>

            <!-- Products checklist -->
            <div class="space-y-2 pt-4 border-t">
              <h4 class="text-xs font-mono uppercase font-bold text-slate-800">Contrôle des Articles Reçus</h4>
              <div v-for="(item, idx) in deliveryNote?.products" :key="idx" class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                <div>
                  <span class="font-bold text-slate-900">{{ item.product_id }}</span>
                  <span class="block text-[10px] text-slate-500 font-mono">Lot: {{ item.lot_number || 'N/A' }}</span>
                </div>
                <div class="flex items-center space-x-3">
                  <span class="font-mono font-bold text-slate-900">Quantité : {{ item.quantity_delivered }}</span>
                  <!-- Checkbox verification -->
                  <input type="checkbox" v-model="verifiedItems[idx]" class="w-4 h-4 text-[var(--color-primary)] border-slate-300 rounded focus:ring-[var(--color-primary)]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SIGNATURE & CONFIRMATION PANEL (RIGHT 5 COLS) -->
      <div class="lg:col-span-5 space-y-6">
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
          <div class="p-5 border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)] flex items-center space-x-2">
            <svg class="w-5 h-5 text-[var(--color-primary)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
            <div>
              <h3 class="text-xs font-bold text-[var(--color-text-primary)] uppercase">Émargement Preuve (PoD)</h3>
              <p class="text-[10px] text-[var(--color-text-secondary)]">Signez manuellement pour valider.</p>
            </div>
          </div>

          <div v-if="order?.status === 'DELIVERED'" class="p-6 space-y-4">
            <div class="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-center">
              <span class="text-emerald-600 font-mono text-[10px] font-black uppercase">✓ RÉCEPTION LOGISTIQUE CERTIFIÉE</span>
              <p class="text-[11px] text-[var(--color-text-secondary)] mt-1">La commande a été réceptionnée et émargée avec succès.</p>
            </div>
          </div>

          <div v-else class="p-6 space-y-4">
            <!-- CANVAS SIGNATURE PAD -->
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <label class="block text-[10px] uppercase font-mono tracking-wider text-[var(--color-primary)] font-bold">Émarger Signature</label>
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
                  Tracez votre signature ici
                </div>
              </div>
            </div>

            <!-- Notes -->
            <label class="block">
              <span class="block text-[9px] uppercase font-mono tracking-wider text-[var(--color-text-secondary)] font-bold mb-1">Réserves / Remarques</span>
              <textarea 
                v-model="deliveryNotes"
                placeholder="Ex: Reçu conforme sans anomalies"
                rows="2"
                class="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
              ></textarea>
            </label>

            <button 
              @click="submitDeliveryConfirmation"
              :disabled="!isFullyVerified || canvasIsEmpty"
              class="w-full py-2.5 bg-[var(--color-primary)] disabled:opacity-40 disabled:cursor-not-allowed text-white font-mono font-bold uppercase rounded-xl text-xs tracking-wider transition shadow-lg text-center"
              id="btn-confirm-reception"
            >
              Émarger &amp; Valider la livraison
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrdersStore } from '@/store/modules/orders.js';
import { useToast } from 'vue-toastification';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const ordersStore = useOrdersStore();
const orderId = route.params.id;

const order = computed(() => {
  return ordersStore.purchaseOrders.find(o => o.id === orderId);
});

const deliveryNote = computed(() => {
  return ordersStore.deliveryNotes.find(dn => dn.purchase_order_id === orderId);
});

const verifiedItems = ref([]);
const deliveryNotes = ref('');

const isFullyVerified = computed(() => {
  if (!deliveryNote.value) return false;
  return verifiedItems.value.length === deliveryNote.value.products.length && verifiedItems.value.every(v => v === true);
});

const sigCanvas = ref(null);
const canvasIsEmpty = ref(true);
let isDrawing = false;
let ctx = null;

onMounted(() => {
  if (deliveryNote.value) {
    verifiedItems.value = new Array(deliveryNote.value.products.length).fill(false);
  }
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

function submitDeliveryConfirmation() {
  if (!deliveryNote.value) return;

  // Sign & confirm delivery note
  ordersStore.confirmDelivery(deliveryNote.value.id);
  
  toast.success('Réception émargée. Les fonds séquestrés sont prêts à être libérés par le Super Admin.');
  router.push('/buyer/orders');
}

function formatDate(dateVal) {
  if (!dateVal) return 'N/A';
  return new Date(dateVal).toLocaleDateString('fr-FR');
}
</script>
