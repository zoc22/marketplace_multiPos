<template>
  <div class="space-y-6 font-mono select-none">
    
    <!-- TOP HEADER -->
    <div class="bg-zinc-950 border border-emerald-950 p-5 rounded-xl flex justify-between items-center">
      <div>
        <h1 class="text-sm font-bold uppercase text-emerald-100 tracking-wider">Passation et Règlements Multi-Paiements</h1>
        <p class="text-[9.5px] text-zinc-500">Intégrations GIMAC, Orange Money, MTN MoMo, Espèces et Vouchers (Avoir).</p>
      </div>

      <router-link 
        to="/pos/cart" 
        class="px-3 py-1.5 bg-black border border-emerald-950 text-emerald-400 hover:text-white rounded text-xs transition hover:border-emerald-700"
      >
        &larr; Revenir au Panier
      </router-link>
    </div>

    <!-- PAYMENT GRID LAYOUT -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- COLUMN 1 & 2: CONSOLE AND METHODS SELECTOR -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- TARGET SUM HUD -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div class="p-4 bg-zinc-950 border border-emerald-950 rounded-xl">
            <span class="text-[9px] text-zinc-550 block font-bold uppercase">Montant Net TTC Requis</span>
            <span class="text-lg font-bold text-emerald-400 font-mono">
              {{ Math.round(cartTotalTTC).toLocaleString() }} FCFA
            </span>
          </div>

          <div class="p-4 bg-zinc-950 border border-emerald-950 rounded-xl">
            <span class="text-[9px] text-zinc-550 block font-bold uppercase">Total Règlements Enregistrés</span>
            <span class="text-lg font-bold text-zinc-300 font-mono">
              {{ Math.round(totalReceivedAmount).toLocaleString() }} FCFA
            </span>
          </div>

          <div class="p-4 bg-zinc-950 border rounded-xl" :class="remainingToPay <= 0 ? 'bg-[#041d10]/30 border-emerald-500/30' : 'bg-[#1c0707]/30 border-red-500/30'">
            <span class="text-[9px] text-zinc-550 block font-bold uppercase">Solde Restant à Régler</span>
            <span class="text-lg font-bold font-mono" :class="remainingToPay <= 0 ? 'text-emerald-400' : 'text-red-400'">
              {{ remainingToPay <= 0 ? 'COUVERT' : Math.round(remainingToPay).toLocaleString() + ' FCFA' }}
            </span>
          </div>

        </div>

        <!-- STYLED PAYMENT ACTIONS CARDS -->
        <div class="bg-[#020503] border border-emerald-950 p-5 rounded-xl space-y-4">
          <h3 class="text-xs font-bold text-emerald-500 uppercase tracking-widest pb-1 border-b border-emerald-950/65">
            Sélecteur de Mode de Versement
          </h3>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <!-- Mode 1: Cash -->
            <button 
              @click="activeMode = 'cash'"
              class="p-3 border rounded-xl text-center transition flex flex-col items-center justify-center space-y-1"
              :class="activeMode === 'cash' ? 'bg-[#0f241a] text-emerald-400 border-emerald-500' : 'bg-black border-emerald-950/60 text-zinc-400 hover:border-emerald-950 hover:text-white'"
            >
              <span class="text-lg">💵</span>
              <strong class="text-[10px] uppercase font-bold block">Espèces (Cash)</strong>
            </button>

            <!-- Mode 2: Mobile Money -->
            <button 
              @click="activeMode = 'momo'"
              class="p-3 border rounded-xl text-center transition flex flex-col items-center justify-center space-y-1"
              :class="activeMode === 'momo' ? 'bg-[#0f241a] text-emerald-400 border-emerald-500' : 'bg-black border-emerald-950/60 text-zinc-400 hover:border-emerald-950 hover:text-white'"
            >
              <span class="text-lg">📱</span>
              <strong class="text-[10px] uppercase font-bold block">Mobile Money</strong>
            </button>

            <!-- Mode 3: Carte bancaire -->
            <button 
              @click="activeMode = 'card'"
              class="p-3 border rounded-xl text-center transition flex flex-col items-center justify-center space-y-1"
              :class="activeMode === 'card' ? 'bg-[#0f241a] text-emerald-400 border-emerald-500' : 'bg-black border-emerald-950/60 text-zinc-400 hover:border-emerald-950 hover:text-white'"
            >
              <span class="text-lg">💳</span>
              <strong class="text-[10px] uppercase font-bold block">Carte (GIMAC)</strong>
            </button>

            <!-- Mode 4: Avoir -->
            <button 
              @click="activeMode = 'voucher'"
              class="p-3 border rounded-xl text-center transition flex flex-col items-center justify-center space-y-1"
              :class="activeMode === 'voucher' ? 'bg-[#0f241a] text-emerald-400 border-emerald-500' : 'bg-black border-emerald-950/60 text-zinc-400 hover:border-emerald-950 hover:text-white'"
            >
              <span class="text-lg">🎫</span>
              <strong class="text-[10px] uppercase font-bold block">Avoir (Voucher)</strong>
            </button>
          </div>

          <!-- DYNAMIC METHOD CONTROLLER INNER BOX -->
          <div class="p-4 bg-zinc-950 border border-emerald-950/60 rounded-xl mt-4">
            
            <!-- CONTROLLER A: CASH METHOD -->
            <div v-show="activeMode === 'cash'" class="space-y-4">
              <h4 class="text-[10px] uppercase text-emerald-300 font-bold">Encaissement Espèces</h4>
              <p class="text-[9.5px] text-zinc-500">Saisir le montant du billet ou de la pièce donné par l'acheteur pour évaluer le re-liquat (monnaie à rendre).</p>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-[9.5px] text-zinc-550 font-bold mb-1 uppercase">Montant versé par le client</label>
                  <div class="relative">
                    <input 
                      type="number" 
                      v-model="inputReceivedAmount"
                      placeholder="Ex: 5000"
                      class="w-full bg-black border border-emerald-950 text-emerald-400 px-3 py-1.5 pl-8 rounded text-xs focus:outline-none focus:border-emerald-600 font-bold font-mono"
                    />
                    <span class="absolute left-3 top-1.5 text-zinc-650">FCFA</span>
                  </div>
                </div>

                <div>
                  <label class="block text-[9.5px] text-zinc-550 font-bold mb-1 uppercase">Quick Billetage</label>
                  <div class="flex flex-wrap gap-1">
                    <button 
                      v-for="val in [1000, 2000, 5000, 10000]" 
                      :key="val"
                      @click="inputReceivedAmount = val"
                      class="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded font-bold text-[9px] text-zinc-350"
                    >
                      + {{ val }} ₣
                    </button>
                    <button 
                      @click="inputReceivedAmount = remainingToPay"
                      class="px-2 py-1 bg-emerald-950 text-emerald-450 border border-emerald-900 rounded font-bold text-[9px]"
                    >
                      Compte Juste
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="changeCalculation > 0" class="p-2.5 bg-[#07130b] border border-emerald-900/40 rounded flex justify-between items-center text-xs">
                <span class="text-zinc-400 uppercase font-mono tracking-wider font-bold">Reliquat à rendre :</span>
                <strong class="text-emerald-400 font-mono text-xs">{{ Math.round(changeCalculation).toLocaleString() }} FCFA</strong>
              </div>

              <button 
                @click="submitSplitPayment('cash', inputReceivedAmount)"
                class="px-4 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-white rounded text-xs font-bold"
              >
                Ajouter Versement Espèces [+]
              </button>
            </div>

            <!-- CONTROLLER B: MOBILE MONEY (SIMULATOR INTEGRATED) -->
            <div v-show="activeMode === 'momo'" class="space-y-4">
              <div class="flex justify-between items-center">
                <h4 class="text-[10px] uppercase text-emerald-300 font-bold">Procédures Réseau : Orange/MTN Mobile Money</h4>
                <span class="text-[8px] bg-emerald-950 border border-emerald-800 text-emerald-400 px-1 hover:animate-pulse">API ONLINE</span>
              </div>
              <p class="text-[9.5px] text-zinc-500">Un SMS push USSD est envoyé sur le terminal du client pour valider le débit de son compte portefeuille électronique.</p>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label class="block text-[9.5px] text-zinc-550 mb-1 font-bold">Opérateur Réseau</label>
                  <select v-model="momoOperator" class="w-full bg-black border border-emerald-950 rounded px-2.5 py-1.5 focus:outline-none">
                    <option value="orange">Orange Money (OM)</option>
                    <option value="mtn">MTN Mobile Money (MoMo)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[9.5px] text-zinc-550 mb-1 font-bold">Numéro de téléphone</label>
                  <input type="text" v-model="momoPhone" placeholder="Ex: 699112233" class="w-full bg-black border border-emerald-950 rounded px-2.5 py-1.5 focus:outline-none text-emerald-400" />
                </div>
                <div>
                  <label class="block text-[9.5px] text-zinc-550 mb-1 font-bold">Montant à prélever</label>
                  <input type="number" v-model="momoAmount" class="w-full bg-black border border-emerald-950 rounded px-2.5 py-1.5 focus:outline-none font-bold text-center" />
                </div>
              </div>

              <!-- SIMULATE PROGRESS BAR FOR USSD PIN -->
              <div v-if="momoScanState === 'pending'" class="p-4 bg-zinc-900 border border-emerald-900/30 rounded-xl space-y-2">
                <div class="flex justify-between items-center text-[9px] font-bold text-[#10b981]">
                  <span>EN ATTENTE DE LA SAGE DE L'ÉPINGLEMENT PIN SUR LE MOBILE DU CLIENT...</span>
                  <span class="animate-ping font-black">●</span>
                </div>
                <div class="w-full bg-black h-2.5 rounded overflow-hidden">
                  <div class="bg-emerald-500 h-full w-1/2 animate-infinite-loading rounded"></div>
                </div>
                <p class="text-[8px] text-zinc-650">Le client (tel: {{ momoPhone }}) est invité à saisir son code secret Orange/MTN pour valider {{ momoAmount }} FCFA.</p>
              </div>

              <div class="pt-2">
                <button 
                  v-if="momoScanState !== 'pending'"
                  @click="triggerMomoPushPayment"
                  class="px-4 py-2 bg-emerald-950 hover:bg-emerald-900 text-[#10b980] border border-emerald-900/50 rounded text-xs font-bold transition uppercase tracking-wider"
                >
                  Envoyer PUSH USSD de Facturation [ Pay ]
                </button>
                <span v-else class="text-[9px] text-zinc-500 font-bold uppercase animate-pulse">
                  Attente Validation API...
                </span>
              </div>
            </div>

            <!-- CONTROLLER C: CARD TERMINAL LINK EMULATOR -->
            <div v-show="activeMode === 'card'" class="space-y-4">
              <h4 class="text-[10px] uppercase text-emerald-300 font-bold">Terminal GIMAC Carte (NFC / Chip)</h4>
              <p class="text-[9.5px] text-zinc-500">Emulation du paiement par carte bancaire Visa, Mastercard ou GIMAC sur terminal de vente (TPE).</p>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-[9.5px] text-zinc-550 mb-1 font-bold">Montant TPE</label>
                  <input type="number" v-model="cardAmount" class="w-full bg-black border border-emerald-950 rounded px-2.5 py-1.5 text-xs text-center font-bold" />
                </div>
                <div>
                  <label class="block text-[9.5px] text-zinc-550 mb-1">Réseau d'Affiliation</label>
                  <select v-model="cardType" class="w-full bg-black border border-emerald-950 rounded px-2.5 py-1.5 text-xs">
                    <option value="visa">VISA Cameroon Network</option>
                    <option value="mastercard">MasterCard International</option>
                    <option value="gimac">Réseau Monétique GIMAC</option>
                  </select>
                </div>
              </div>

              <!-- SIMULATE CARD SWIPE -->
              <div v-if="cardScanState === 'swiped'" class="p-2.5 bg-emerald-950/20 border border-emerald-800 rounded text-[9.5px] font-bold text-center animate-pulse">
                💳 CARTE DÉTECTÉE - AUTORISATION BANCAIRE SECURE EN COURS...
              </div>

              <div class="pt-2 flex gap-2">
                <button 
                  @click="triggerCardSwipedSimulation"
                  class="px-4 py-1.5 bg-[#0d2a1a] hover:bg-[#123e25] text-emerald-450 border border-emerald-900 rounded text-xs font-bold"
                >
                  Passer Carte TPE [ Simulator ]
                </button>
              </div>
            </div>

            <!-- CONTROLLER D: AVOIR REDEMPTION -->
            <div v-show="activeMode === 'voucher'" class="space-y-4">
              <h4 class="text-[10px] uppercase text-emerald-300 font-bold">Réclamation d'un Avoir (Credit Voucher)</h4>
              <p class="text-[9.5px] text-zinc-500">Un client peut régler l'intégralité ou une partie de sa commande à l'aide d'un Bon d'Avoir préalablement généré lors d'un retour marchandise.</p>

              <div class="flex gap-2">
                <input 
                  type="text" 
                  v-model="voucherInputCode"
                  placeholder="Saisir Code de l'Avoir (ex: AV-9810-DF)..."
                  class="flex-1 bg-black border border-emerald-950 px-3 py-1.5 text-xs font-mono uppercase text-emerald-400 focus:outline-none"
                />
                <button 
                  @click="handleApplyVoucher"
                  class="px-4 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-white rounded text-xs font-bold"
                >
                  Vérifier &amp; Déduire
                </button>
              </div>

              <!-- List available demo vouchers -->
              <div class="pt-2 text-[9px] text-zinc-500 space-y-1">
                <p class="font-bold text-zinc-400">Avoirs disponibles pour test :</p>
                <div v-for="vc in unusedVouchers" :key="vc.code" class="flex justify-between bg-black p-1 rounded px-2 hover:bg-zinc-900">
                  <span>🎟️ ID: {{ vc.code }} (Tel: {{ vc.clientPhone }})</span>
                  <strong class="text-emerald-405 font-mono">{{ vc.amount }} FCFA</strong>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      <!-- COLUMN 3: SPLIT BILL REGISTRY & REGISTER SUBMIT -->
      <div class="space-y-6">
        
        <!-- BILL REGISTER DRAWER -->
        <div class="bg-zinc-950 border border-emerald-950 p-5 rounded-xl space-y-4">
          <h3 class="text-xs font-mono font-bold uppercase text-[#10b980] pb-1 border-b border-emerald-950/60 leading-tight">
            Registre des Règlements Saisis
          </h3>

          <div v-if="splitPayments.length === 0" class="text-center py-8 text-[9.5px] text-zinc-600">
            Aucun versement n'a encore été rattaché à cette vente.
          </div>

          <div v-else class="space-y-2 font-mono text-[10.5px]">
            <div 
              v-for="payment in splitPayments" 
              :key="payment.id"
              class="p-2 bg-black border border-emerald-950 rounded flex justify-between items-center hover:border-emerald-700"
            >
              <div>
                <strong class="text-zinc-300 block uppercase" v-if="payment.method === 'cash'">💵 Espèces (Cash)</strong>
                <strong class="text-zinc-300 block uppercase" v-else-if="payment.method === 'momo'">📱 Mobile Money</strong>
                <strong class="text-zinc-300 block uppercase" v-else-if="payment.method === 'card'">💳 Carte bancaire</strong>
                <strong class="text-zinc-300 block uppercase" v-else-if="payment.method === 'voucher'">🎟️ Avoir (Voucher)</strong>
                
                <span class="text-[8.5px] text-zinc-550 block" v-if="payment.memo">
                  Note : {{ payment.memo }}
                </span>
              </div>

              <div class="text-right flex items-center gap-2">
                <strong class="text-[#10b981]">
                  {{ payment.amount.toLocaleString() }} ₣
                </strong>
                <button 
                  @click="removePaymentSplit(payment.id)"
                  class="text-red-500 hover:text-red-400 font-bold"
                >
                  &times;
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- STOCKS STATE RECAP FOR FIFO VERIFIABILITY -->
        <div class="bg-[#051108]/20 border border-emerald-950 p-4 rounded-xl space-y-2.5">
          <h3 class="text-[10px] text-emerald-400 font-bold uppercase tracking-wider font-mono">Contrôle Batch FIFO avant transaction</h3>
          <p class="text-[9px] text-zinc-550 leading-relaxed">Les produits seront débités dans l'ordre de leur lot d'entrée en entrepôt (Premier Entré, Premier Sorti).</p>
          <div class="h-1 bg-[#1a4a2c]/40 rounded overflow-hidden">
            <div class="h-full bg-[#10b980] w-full"></div>
          </div>
        </div>

        <!-- COMPLETE FINISH PAYMENT TRIGGER -->
        <div class="p-5 bg-zinc-950 border border-emerald-950 rounded-xl space-y-4">
          <div class="text-center">
            <p class="text-[9px] text-zinc-500 uppercase font-mono">Dossier de vente B2B prêt</p>
          </div>

          <button 
            @click="handleCompleteSalesCheckout"
            :disabled="remainingToPay > 0"
            class="w-full py-4 rounded-xl font-bold uppercase text-xs tracking-widest transition duration-150 transform hover:scale-[1.01]"
            :class="remainingToPay <= 0 ? 'bg-[#10b981] hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/10' : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'"
          >
            Terminer la Vente (Lancement FIFO) &raquo;
          </button>
        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

import { 
  cart, 
  splitPayments, 
  addPaymentSplit, 
  removePaymentSplit,
  vouchers, 
  claimVoucher,
  cartTotalTTC,
  checkoutTransaction
} from '@/composables/usePOS.js';

const router = useRouter();
const toast = useToast();

const activeMode = ref('cash');

// Cash inputs
const inputReceivedAmount = ref(0);

// MoMo inputs
const momoOperator = ref('orange');
const momoPhone = ref('');
const momoAmount = ref(0);
const momoScanState = ref('idle'); // idle, pending, succ

// Card inputs
const cardAmount = ref(0);
const cardType = ref('gimac');
const cardScanState = ref('idle');

// Voucher inputs
const voucherInputCode = ref('');

// Seed/active unused vouchers list for test reference
const unusedVouchers = computed(() => {
  return vouchers.value.filter(v => v.status === 'unused');
});

// Automatically preset payment fields to remaining amount
const remainingToPay = computed(() => {
  const got = totalReceivedAmount.value;
  const req = cartTotalTTC.value;
  return Math.max(0, req - got);
});

// Calc total pay registered
const totalReceivedAmount = computed(() => {
  return splitPayments.value.reduce((sum, p) => sum + p.amount, 0);
});

const changeCalculation = computed(() => {
  const got = parseFloat(inputReceivedAmount.value) || 0;
  const rem = remainingToPay.value;
  return Math.max(0, got - rem);
});

// On mounting or view, set default payment amounts to exact remaining
computed(() => {
  const rem = remainingToPay.value;
  momoAmount.value = rem;
  cardAmount.value = rem;
  inputReceivedAmount.value = rem;
  return rem;
});

function submitSplitPayment(method, amount, memo = '') {
  const amt = parseFloat(amount);
  if (!amt || amt <= 0) {
    toast.error('Veuillez spécifier un montant positif.');
    return;
  }
  
  addPaymentSplit(method, amt, memo);
  
  // reset inputs
  inputReceivedAmount.value = 0;
  momoAmount.value = 0;
  cardAmount.value = 0;
  voucherInputCode.value = '';
}

function triggerMomoPushPayment() {
  if (!momoPhone.value || momoPhone.value.length < 9) {
    toast.error('Veuillez saisir un numéro de téléphone valide à 9 chiffres.');
    return;
  }

  const amt = parseFloat(momoAmount.value) || remainingToPay.value;
  if (!amt || amt <= 0) {
    toast.error('Spécifiez le montant final pour le Mobile Money.');
    return;
  }

  momoScanState.value = 'pending';
  toast.info('Message PUSH envoyé sur le téléphone du client...');

  setTimeout(() => {
    momoScanState.value = 'success';
    submitSplitPayment('momo', amt, `${momoOperator.value.toUpperCase()} Pays - No: ${momoPhone.value}`);
    momoScanState.value = 'idle';
    toast.success('Paiement Mobile Money validé avec SUCCÈS.');
  }, 2500);
}

function triggerCardSwipedSimulation() {
  const amt = parseFloat(cardAmount.value) || remainingToPay.value;
  if (!amt || amt <= 0) {
    toast.error('Spécifiez le montant final de règlement par carte.');
    return;
  }

  cardScanState.value = 'swiped';
  setTimeout(() => {
    cardScanState.value = 'idle';
    submitSplitPayment('card', amt, `Carte ${cardType.value.toUpperCase()} - Autorisation: ACC-901B`);
    toast.success('Carte authentifiée. Opération GIMAC approuvée.');
  }, 1505);
}

function handleApplyVoucher() {
  const code = voucherInputCode.value.trim().toUpperCase();
  if (!code) {
    toast.error("Veuillez saisir le code de l'avoir.");
    return;
  }

  const check = claimVoucher(code);
  if (!check.success) {
    toast.error(check.message);
    return;
  }

  const vc = check.voucher;
  
  // Voucher can cover up to its value
  const coverAmount = Math.min(vc.amount, remainingToPay.value);
  submitSplitPayment('voucher', coverAmount, code);
  
  toast.success(`Avoir appliqué : -${coverAmount} FCFA. Code enregistré.`);
}

function handleCompleteSalesCheckout() {
  // Let the store module trigger FIFO checkout decrement
  const success = checkoutTransaction();
  if (success) {
    router.push('/pos/ticket');
  }
}
</script>

<style scoped>
@keyframes infinite-loading {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}
.animate-infinite-loading {
  animation: infinite-loading 1.5s infinite linear;
}
</style>
