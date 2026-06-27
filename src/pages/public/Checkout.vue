<template>
  <div class="min-h-screen bg-[#070b12] text-slate-100 flex flex-col justify-between">
    
    <!-- HEADER NAVBAR -->
    <PublicHeader />

    <main class="flex-1 py-12 px-4 md:px-8 max-w-4xl mx-auto w-full select-none">
      
      <!-- HEADER -->
      <div class="border-b border-[#0e2129] pb-6 mb-8 text-center sm:text-left">
        <span class="text-[9.5px] font-mono bg-emerald-950 text-emerald-450 border border-emerald-900 rounded-full px-3 py-0.5 uppercase tracking-widest font-bold">
          Step 2 of 2: Escrow Lock Validation
        </span>
        <h1 class="text-2xl font-extrabold text-white uppercase font-mono mt-2">
          🔒 Constitution des Garanties de Transit
        </h1>
        <p class="text-xs text-slate-400 mt-1 max-w-xl">
          Sélectionnez vos coordonnées de livraison coopérative et validez la signature numérique du séquestre de fonds.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- COLUMN 1: FORM CONTROLS -->
        <div class="lg:col-span-7 bg-[#091116] border border-[#142732] p-6 rounded-2xl space-y-6">
          
          <h2 class="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider border-b border-slate-900 pb-2.5">
            📋 Informations Légales de Facturation B2B
          </h2>

          <form @submit.prevent="submitEscrowOrder" class="space-y-4 text-xs font-mono">
            
            <!-- Company & Procurement officer -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-[10px] text-slate-500 uppercase">Société Acheteuse</label>
                <input 
                  type="text" 
                  required
                  v-model="checkoutForm.companyName"
                  placeholder="Ex: Santa Lucia Procurement S.A." 
                  class="w-full bg-[#03060a] border border-[#142630] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-accent-green placeholder-slate-650"
                />
              </div>
              <div class="space-y-1.5">
                <label class="text-[10px] text-slate-500 uppercase">Mandataire (Représentant)</label>
                <input 
                  type="text" 
                  required
                  v-model="checkoutForm.representative"
                  placeholder="Ex: Jean-Pierre Fotso" 
                  class="w-full bg-[#03060a] border border-[#142630] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-accent-green placeholder-slate-650"
                />
              </div>
            </div>

            <!-- Contacts and region -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-[10px] text-slate-500 uppercase">Téléphone Validation MoMo/Orange</label>
                <input 
                  type="text" 
                  required
                  v-model="checkoutForm.phone"
                  placeholder="Ex: +237 682 99 00 11" 
                  class="w-full bg-[#03060a] border border-[#142630] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-accent-green font-mono placeholder-slate-650"
                />
              </div>
              
              <div class="space-y-1.5">
                <label class="text-[10px] text-slate-500 uppercase">Entrepôt de livraison agréé</label>
                <select 
                  v-model="checkoutForm.warehouse"
                  class="w-full bg-[#03060a] border border-[#142630] rounded-xl px-2.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-accent-green"
                >
                  <option value="kribi">Silos Portuaire Spécialisé de Kribi</option>
                  <option value="douala">Quai S1 - Port Autonome de Douala</option>
                  <option value="yde_camrail">Gare de transit Fret Yaoundé</option>
                  <option value="maroua">Entrepôt d'Oignons National de Maroua</option>
                </select>
              </div>
            </div>

            <!-- Escrow terms verify slider checkbox (capter attention) -->
            <div class="p-3.5 bg-slate-950 rounded-xl border border-slate-900 space-y-2.5">
              <div class="flex items-start space-x-2.5">
                <input 
                  type="checkbox" 
                  required
                  id="escrow_check" 
                  v-model="checkoutForm.termsAccepted"
                  class="mt-0.5 accent-emerald-500 cursor-pointer h-4 w-4 rounded bg-slate-900 border-slate-800"
                />
                <label for="escrow_check" class="text-[10px] text-slate-400 select-none leading-relaxed cursor-pointer">
                  Je certifie que les fonds déclarés de <span class="text-accent-green font-bold uppercase">{{ formatCFA(grandTotal) }}</span> proviennent d'une trésorerie vérifiée et consens à les bloquer sous l'arbitrage fiduciaire de KONG S.A.
                </label>
              </div>
            </div>

            <!-- PAYMENT OPTIONS CHIPS (Africa ecosystem) -->
            <div class="space-y-3.5 pt-2">
              <label class="text-[10px] text-slate-500 uppercase block">Mode de Séquestre Bancaire ou Mobile</label>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div 
                  v-for="method in paymentGateways" 
                  :key="method.id"
                  @click="selectedMethod = method.id"
                  class="p-3 rounded-xl border bg-[#05080c] cursor-pointer flex items-center space-x-3.5 hover:border-slate-850 transition"
                  :class="selectedMethod === method.id ? 'border-accent-green text-accent-green font-bold' : 'border-slate-900 text-slate-400'"
                >
                  <span class="text-xl shrink-0">{{ method.icon }}</span>
                  <div class="truncate">
                    <div class="text-[11px] uppercase leading-tight">{{ method.name }}</div>
                    <div class="text-[8.5px] text-slate-500 mt-0.5 uppercase">{{ method.desc }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- SUBMIT BUTTON AND LOADER -->
            <div class="pt-4">
              <button 
                type="submit"
                :disabled="isProcessing"
                class="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-450 hover:to-teal-555 text-slate-955 font-bold uppercase tracking-wider rounded-xl shadow-lg transition duration-200 flex justify-center items-center space-x-2"
                :class="isProcessing ? 'opacity-70 cursor-not-allowed' : ''"
              >
                <!-- Spinner SVG overlay -->
                <svg v-if="isProcessing" class="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isProcessing ? 'ENVOI DE L\'ACCUSÉ SMS EN COURS...' : '🔒 CRÉER LE SÉQUESTRE & PAYER' }}</span>
              </button>
            </div>

          </form>

        </div>

        <!-- COLUMN 2: INVOICE LEDGER (Capter attention) -->
        <aside class="lg:col-span-5 bg-[#091116] border border-[#142732] p-5 rounded-2xl space-y-6 font-mono text-[11px]">
          
          <div class="border-b border-[#12242d] pb-3">
            <span class="text-[9.5px] uppercase tracking-wider text-slate-500 font-bold">LEDGER VERIFICATION BAR</span>
            <h3 class="text-sm font-bold text-white uppercase mt-0.5">B2B Order Manifest</h3>
          </div>

          <!-- Product records mini-scroll -->
          <div class="max-h-48 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
            <div 
              v-for="item in cartStore.items" 
              :key="item.product.id"
              class="flex justify-between items-center bg-[#05090e] p-2.5 rounded-lg border border-slate-900/60"
            >
              <div class="truncate max-w-[12rem]">
                <h4 class="font-bold text-slate-200 truncate">{{ item.product.name }}</h4>
                <p class="text-[9.5px] text-slate-500 leading-none mt-1">
                  Qty: {{ item.quantity }} {{ item.product.unit }} &bull; Supplier Lot
                </p>
              </div>
              <div class="text-right text-emerald-450 font-bold font-mono">
                {{ formatCFA(item.product.price * item.quantity) }}
              </div>
            </div>
          </div>

          <!-- Financial summary computations -->
          <div class="pt-4 border-t border-slate-900 space-y-3 text-slate-400">
            <div class="flex justify-between">
              <span>Lot Base Crops Subtotal:</span>
              <span class="text-slate-202 font-bold">{{ formatCFA(cartStore.totalAmount) }}</span>
            </div>

            <div class="flex justify-between">
              <span>Fret & Clearing Multi-Sellers:</span>
              <span class="text-cyan-405 font-bold">{{ formatCFA(mockFreightTotal) }}</span>
            </div>

            <div class="flex justify-between">
              <span>Simplified OHADA Tax (5.5%):</span>
              <span class="text-slate-202 font-bold">{{ formatCFA(mockTaxTotal) }}</span>
            </div>

            <div class="flex justify-between">
              <span>Platform Sovereign Fee (0.2%):</span>
              <span class="text-slate-455 font-bold">{{ formatCFA(mockPlatformFee) }}</span>
            </div>

            <div class="pt-4.5 border-t border-slate-900 flex justify-between items-end">
              <div>
                <span class="text-[9px] uppercase text-slate-550 block">GRAND TOTAL COUT DU SÉQUESTRE</span>
                <span class="text-emerald-404 font-extrabold text-[16px]">{{ formatCFA(grandTotal) }}</span>
              </div>
              <span class="text-[8px] bg-slate-900/80 px-1.5 py-0.5 text-slate-500 rounded font-bold uppercase">XAF CFA</span>
            </div>
          </div>

          <!-- PUSH NOTIFICATION SIMULATION FOR PAYMENTS -->
          <div 
            v-if="isProcessing && selectedMethod === 'momo'"
            class="p-3 bg-yellow-950/20 border border-yellow-900/40 rounded-xl space-y-1.5 animate-pulse text-yellow-350"
          >
            <div class="font-bold uppercase text-[9.5px]">📱 DE DISPATCH SIMULATOR</div>
            <p class="text-[10px] leading-normal font-sans text-slate-350">
              [VIRTUAL MTN MOMO TRIGGERED] Un prompt SMS d'autorisation a été poussé vers le numéro <span class="font-mono text-white font-bold">{{ checkoutForm.phone }}</span>. Insérez fictivement votre code secret PIN à 4 chiffres sur votre mobile.
            </p>
          </div>

          <div 
            v-if="isProcessing && selectedMethod === 'orange'"
            class="p-3 bg-orange-950/20 border border-orange-900/40 rounded-xl space-y-1.5 animate-pulse text-orange-400"
          >
            <div class="font-bold uppercase text-[9.5px]">📱 DE DISPATCH SIMULATOR</div>
            <p class="text-[10px] leading-normal font-sans text-slate-300">
              [VIRTUAL ORANGE MONEY TRIGGERED] Une requête de prélèvement USSD #150# de <span class="text-white font-bold">{{ formatCFA(grandTotal) }}</span> est envoyée vers votre carte SIM active.
            </p>
          </div>

        </aside>

      </div>

    </main>

    <!-- FOOTER -->
    <footer class="bg-slate-950 border-t border-[#091116] py-12 px-6 text-slate-505 text-xs text-center pb-48 md:pb-40">
      <div class="max-w-4xl mx-auto space-y-4">
        <p class="text-[11px] leading-relaxed max-w-xl mx-auto">
          KONG S.A. est une marque de technologie logistique camerounaise agréée. Tous droits réservés. Conforme CEMAC et règles de l'arbitrage commercial international.
        </p>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useCartStore } from '@/store/modules/cart.js';
import { useAuthStore } from '@/store/modules/auth.js';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

// Import components
import PublicHeader from '@/components/PublicHeader.vue';

const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const isProcessing = ref(false);
const selectedMethod = ref('momo');

const paymentGateways = [
  { id: 'momo', name: 'MTN Mobile Money', desc: 'Secure direct authorization push', icon: '📲' },
  { id: 'orange', name: 'Orange Money API', desc: 'USSD prompt direct response code', icon: '🍊' },
  { id: 'afriland', name: 'Afriland Sawa Bank Wire', desc: 'Pre-approved corporate transfer routing', icon: '🏦' },
  { id: 'eu_flash', name: 'Express Union FLASH', desc: 'Voucher code redemption center', icon: '⚡' }
];

const checkoutForm = reactive({
  companyName: authStore.user?.company || 'Ets Boulangerie Yaoundé',
  representative: authStore.user?.name || 'Dieudonné Atangana',
  phone: authStore.user?.phone || '+237 677 34 56 78',
  warehouse: 'douala',
  termsAccepted: false
});

// Mock values based on active cart amounts
const mockFreightTotal = computed(() => {
  if (cartStore.items.length === 0) return 0;
  // Dynamic calculation fallback
  return cartStore.items.length * 18000;
});

const mockTaxTotal = computed(() => {
  return Math.floor(cartStore.totalAmount * 0.055);
});

const mockPlatformFee = computed(() => {
  return Math.floor(cartStore.totalAmount * 0.002);
});

const grandTotal = computed(() => {
  return cartStore.totalAmount + mockFreightTotal.value + mockTaxTotal.value + mockPlatformFee.value;
});

function submitEscrowOrder() {
  if (cartStore.items.length === 0) {
    toast.error('Cannot checkout empty cart items.');
    return;
  }
  
  if (!checkoutForm.termsAccepted) {
    toast.error('You must agree to lock funds under sovereign Escrow terms.');
    return;
  }

  isProcessing.value = true;
  toast.info('📱 Déclenchement de l\'alerte de validation de paiement...');

  setTimeout(() => {
    isProcessing.value = false;
    toast.success('🔒 Séquestration Fiduciaire validée! Commande enregistrée.');
    
    // Purge cart
    cartStore.clearCart();
    
    // Redirect to success
    router.push('/order-success');
  }, 4500);
}

// Format currency
function formatCFA(val) {
  if (val === undefined || val === null) return '0 CFA';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('FCFA', 'CFA').replace('XAF', 'CFA');
}
</script>
