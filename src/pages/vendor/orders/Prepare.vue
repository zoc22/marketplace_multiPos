<template>
  <div class="space-y-6">
    <div v-if="!order" class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-8 rounded-2xl text-center text-[var(--color-text-muted)] shadow-sm">
      Commande introuvable.
      <div class="mt-4">
        <router-link to="/vendor/orders" class="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm">Retour aux commandes</router-link>
      </div>
    </div>

    <div v-else class="space-y-6">
      <!-- Header -->
      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div>
          <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Préparation d'Expédition - {{ order.id }}</h1>
          <p class="text-sm text-[var(--color-text-secondary)] mt-1">Veuillez vérifier et biper les articles physiques avant l'envoi.</p>
        </div>
        <div class="flex space-x-3">
          <router-link :to="`/vendor/orders`" class="px-4 py-2 bg-[var(--color-surface-hover)] border border-[var(--color-border)] hover:bg-[var(--color-border)] rounded-xl text-sm font-semibold transition text-[var(--color-text-primary)]">
            Retour
          </router-link>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Picking List Checklist -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm">
            <div class="flex justify-between items-center mb-4 pb-2 border-b border-[var(--color-border)]">
              <h3 class="font-bold text-[var(--color-text-primary)] text-base">Liste de Picking & Scan</h3>
              <!-- Scan Simulation -->
              <button @click="simulateScan" class="px-3 py-1.5 bg-[var(--color-primary-muted)] text-[var(--color-primary)] text-xs font-bold rounded-lg border border-[var(--color-primary-border)] hover:opacity-90 transition flex items-center space-x-1">
                <QrCodeIcon class="h-4 w-4" />
                <span>Simuler Scan Produit</span>
              </button>
            </div>

            <div class="space-y-4">
              <div 
                v-for="(item, idx) in pickingItems" :key="idx" 
                class="p-4 border rounded-xl flex items-center justify-between transition"
                :class="item.scannedQty === item.qty ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-[var(--color-surface)] border-[var(--color-border)]'"
              >
                <div class="flex items-center space-x-4">
                  <div class="w-12 h-12 rounded-lg border bg-white flex items-center justify-center p-1 shrink-0">
                    <img :src="item.product.image || 'https://placehold.co/50'" class="max-h-full max-w-full object-contain" />
                  </div>
                  <div>
                    <h4 class="font-bold text-sm text-[var(--color-text-primary)]">{{ item.product.name }}</h4>
                    <p class="text-xs text-[var(--color-text-muted)] font-mono mt-0.5">Code : {{ item.product.barcode || 'N/A' }}</p>
                  </div>
                </div>

                <div class="flex items-center space-x-6">
                  <!-- Progress bar / picking counts -->
                  <div class="text-right">
                    <div class="text-sm font-bold text-[var(--color-text-primary)]">{{ item.scannedQty }} / {{ item.qty }} scanné(s)</div>
                    <div class="w-24 bg-[var(--color-surface-hover)] h-1.5 rounded-full overflow-hidden border mt-1">
                      <div class="bg-emerald-500 h-full transition-all duration-300" :style="{ width: `${(item.scannedQty / item.qty) * 100}%` }"></div>
                    </div>
                  </div>

                  <!-- Direct pick confirmation button -->
                  <button 
                    @click="confirmItemPick(item)" 
                    :disabled="item.scannedQty === item.qty"
                    class="h-9 w-9 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] hover:text-emerald-500 hover:bg-emerald-500/10 flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <CheckIcon class="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Packing details and actions -->
        <div class="space-y-6">
          <!-- Customer and Delivery Address -->
          <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm space-y-4">
            <h3 class="font-bold text-[var(--color-text-primary)] text-base pb-2 border-b border-[var(--color-border)]">Destinataire</h3>
            <div class="text-sm space-y-2.5">
              <div>
                <span class="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase">Client</span>
                <span class="font-bold text-[var(--color-text-primary)]">{{ order.customerName || 'Jean Dupont' }}</span>
              </div>
              <div v-if="order.shippingAddress">
                <span class="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase">Adresse de livraison</span>
                <span class="font-medium text-[var(--color-text-primary)]">{{ order.shippingAddress }}</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm space-y-4">
            <h3 class="font-bold text-[var(--color-text-primary)] text-base pb-2 border-b border-[var(--color-border)]">Statut de la préparation</h3>
            
            <div class="text-sm flex justify-between items-center">
              <span class="text-[var(--color-text-secondary)]">Progression globale</span>
              <span class="font-bold text-emerald-500">{{ totalChecked }} / {{ totalToPick }} articles</span>
            </div>

            <button 
              @click="shipOrder"
              :disabled="totalChecked < totalToPick"
              class="w-full py-4 bg-emerald-500 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-500/10 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex justify-center items-center space-x-2"
            >
              <TruckIcon class="h-5 w-5" />
              <span>MARQUER COMME EXPÉDIÉE</span>
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
import { transactions } from '@/utils/vendor_db.js';
import { QrCodeIcon, CheckIcon, TruckIcon } from '@heroicons/vue/24/outline';
import { useToast } from 'vue-toastification';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const order = ref(null);
const pickingItems = ref([]);

onMounted(() => {
  const orderId = route.params.id;
  const found = transactions.value.find(t => t.id === orderId);
  if (found) {
    order.value = found;
    pickingItems.value = found.items.map(item => ({
      product: item.product,
      qty: item.quantity,
      scannedQty: 0
    }));
  }
});

const totalToPick = computed(() => {
  return pickingItems.value.reduce((sum, item) => sum + item.qty, 0);
});

const totalChecked = computed(() => {
  return pickingItems.value.reduce((sum, item) => sum + item.scannedQty, 0);
});

function confirmItemPick(item) {
  item.scannedQty = item.qty;
  playBeep();
  toast.success(`${item.product.name} validé.`);
}

function simulateScan() {
  const pending = pickingItems.value.filter(item => item.scannedQty < item.qty);
  if (pending.length === 0) {
    toast.info("Tous les articles ont déjà été scannés.");
    return;
  }
  // Pick random pending item and increment scanned count
  const item = pending[Math.floor(Math.random() * pending.length)];
  item.scannedQty++;
  playBeep();
  toast.info(`Bip ! Code ${item.product.barcode || 'N/A'} scanné : ${item.product.name} (${item.scannedQty}/${item.qty})`);
}

function playBeep() {
  try {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.connect(gain);
    gain.connect(context.destination);
    osc.frequency.value = 1200;
    gain.gain.setValueAtTime(0, context.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, context.currentTime + 0.02);
    gain.gain.linearRampToValueAtTime(0, context.currentTime + 0.1);
    osc.start();
    osc.stop(context.currentTime + 0.12);
  } catch (e) {
    console.log("Audio contexts blocked or not supported", e);
  }
}

function shipOrder() {
  if (totalChecked.value < totalToPick.value) {
    toast.error("Veuillez d'abord scanner tous les articles de la commande.");
    return;
  }
  const dbOrder = transactions.value.find(t => t.id === order.value.id);
  if (dbOrder) {
    dbOrder.status = 'Shipped';
    toast.success("Commande expédiée avec succès !");
    router.push('/vendor/orders');
  }
}
</script>
