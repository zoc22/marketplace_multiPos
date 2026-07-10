<template>
  <div class="space-y-6 font-mono select-none text-slate-100 animate-slide-up">
    
    <!-- TOP HEADER -->
    <div class="bg-[#14141E] border border-slate-800 p-5 rounded-2xl flex justify-between items-center relative overflow-hidden">
      <div class="absolute -right-16 -top-16 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
      <div>
        <h1 class="text-sm font-bold uppercase text-slate-200 tracking-wider">Passation et Règlements Multi-Paiements</h1>
        <p class="text-[9.5px] text-slate-500 font-mono">Intégrations GIMAC, Orange Money, MTN MoMo, Espèces et Vouchers (Avoir).</p>
      </div>

      <router-link 
        to="/pos/cart" 
        class="px-3.5 py-1.5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs transition hover:border-slate-700 flex items-center gap-1.5"
      >
        <ArrowLeftIcon class="w-3.5 h-3.5" />
        <span>Revenir au Panier</span>
      </router-link>
    </div>

    <!-- PAYMENT GRID LAYOUT -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- COLUMN 1 & 2: CONSOLE AND METHODS SELECTOR -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- TARGET SUM HUD -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div class="p-4 bg-[#14141E] border border-slate-800 rounded-2xl relative overflow-hidden">
            <div class="absolute -right-6 -bottom-6 w-16 h-16 bg-[#C8A96E]/5 rounded-full blur-xl"></div>
            <span class="text-[9px] text-slate-500 block font-bold uppercase">Montant Net TTC Requis</span>
            <span class="text-lg font-bold text-[#C8A96E] font-mono">
              {{ Math.round(cartTotalTTC).toLocaleString() }} FCFA
            </span>
          </div>

          <div class="p-4 bg-[#14141E] border border-slate-800 rounded-2xl">
            <span class="text-[9px] text-slate-500 block font-bold uppercase">Total Règlements Enregistrés</span>
            <span class="text-lg font-bold text-slate-200 font-mono">
              {{ Math.round(totalReceivedAmount).toLocaleString() }} FCFA
            </span>
          </div>

          <div class="p-4 border rounded-2xl transition-colors duration-200" :class="remainingToPay <= 0 ? 'bg-[#2D7D6E]/10 border-[#2D7D6E]/40' : 'bg-red-950/10 border-red-900/40'">
            <span class="text-[9px] text-slate-500 block font-bold uppercase">Solde Restant à Régler</span>
            <span class="text-lg font-bold font-mono" :class="remainingToPay <= 0 ? 'text-[#2D7D6E]' : 'text-red-400'">
              {{ remainingToPay <= 0 ? 'COUVERT' : Math.round(remainingToPay).toLocaleString() + ' FCFA' }}
            </span>
          </div>

        </div>

        <!-- STYLED PAYMENT ACTIONS CARDS -->
        <div class="bg-[#14141E] border border-slate-800 p-5 rounded-2xl space-y-4">
          <h3 class="text-xs font-bold text-slate-300 uppercase tracking-widest pb-2 border-b border-slate-800">
            Sélecteur de Mode de Versement
          </h3>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <!-- Mode 1: Cash -->
            <button 
              @click="activeMode = 'cash'"
              class="p-3 border rounded-xl text-center transition flex flex-col items-center justify-center space-y-1.5"
              :class="activeMode === 'cash' ? 'bg-[#C8A96E]/10 text-[#C8A96E] border-[#C8A96E]' : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-800 hover:text-white'"
            >
              <BanknotesIcon class="w-5 h-5" />
              <strong class="text-[10px] uppercase font-bold block">Espèces (Cash)</strong>
            </button>

            <!-- Mode 2: Mobile Money -->
            <button 
              @click="activeMode = 'momo'"
              class="p-3 border rounded-xl text-center transition flex flex-col items-center justify-center space-y-1.5"
              :class="activeMode === 'momo' ? 'bg-[#C8A96E]/10 text-[#C8A96E] border-[#C8A96E]' : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-800 hover:text-white'"
            >
              <DevicePhoneMobileIcon class="w-5 h-5" />
              <strong class="text-[10px] uppercase font-bold block">Mobile Money</strong>
            </button>

            <!-- Mode 3: Carte bancaire -->
            <button 
              @click="activeMode = 'card'"
              class="p-3 border rounded-xl text-center transition flex flex-col items-center justify-center space-y-1.5"
              :class="activeMode === 'card' ? 'bg-[#C8A96E]/10 text-[#C8A96E] border-[#C8A96E]' : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-800 hover:text-white'"
            >
              <CreditCardIcon class="w-5 h-5" />
              <strong class="text-[10px] uppercase font-bold block">Carte (GIMAC)</strong>
            </button>

            <!-- Mode 4: Avoir -->
            <button 
              @click="activeMode = 'voucher'"
              class="p-3 border rounded-xl text-center transition flex flex-col items-center justify-center space-y-1.5"
              :class="activeMode === 'voucher' ? 'bg-[#C8A96E]/10 text-[#C8A96E] border-[#C8A96E]' : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-800 hover:text-white'"
            >
              <TicketIcon class="w-5 h-5" />
              <strong class="text-[10px] uppercase font-bold block">Avoir (Voucher)</strong>
            </button>
          </div>

          <!-- DYNAMIC METHOD CONTROLLER INNER BOX -->
          <div class="p-4 bg-slate-950 border border-slate-850 rounded-xl mt-4">
            
            <!-- CONTROLLER A: CASH METHOD -->
            <div v-show="activeMode === 'cash'" class="space-y-4">
              <h4 class="text-[10px] uppercase text-[#C8A96E] font-bold">Encaissement Espèces</h4>
              <p class="text-[9.5px] text-slate-500">Saisir le montant du billet ou de la pièce donné par l'acheteur pour évaluer le re-liquat (monnaie à rendre).</p>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-[9.5px] text-slate-500 font-bold mb-1.5 uppercase">Montant versé par le client</label>
                  <div class="relative">
                    <input 
                      type="number" 
                      v-model="inputReceivedAmount"
                      placeholder="Ex: 5000"
                      class="w-full bg-slate-900 border border-slate-800 text-emerald-400 px-3 py-2 pl-16 rounded-lg text-xs focus:outline-none focus:border-slate-700 font-bold font-mono"
                    />
                    <span class="absolute left-3 top-2 text-slate-600 text-[10px]">FCFA</span>
                  </div>
                </div>

                <div>
                  <label class="block text-[9.5px] text-slate-500 font-bold mb-1.5 uppercase">Quick Billetage</label>
                  <div class="flex flex-wrap gap-1">
                    <button 
                      v-for="val in [1000, 2000, 5000, 10000]" 
                      :key="val"
                      @click="inputReceivedAmount = val"
                      class="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg font-bold text-[9px] text-slate-350 transition-colors"
                    >
                      + {{ val }} ₣
                    </button>
                    <button 
                      @click="inputReceivedAmount = remainingToPay"
                      class="px-2.5 py-1.5 bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 rounded-lg font-bold text-[9px] hover:bg-emerald-900/40 transition-colors"
                    >
                      Compte Juste
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="changeCalculation > 0" class="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-lg flex justify-between items-center text-xs">
                <span class="text-slate-400 uppercase font-mono tracking-wider font-bold">Reliquat à rendre :</span>
                <strong class="text-emerald-400 font-mono text-xs">{{ Math.round(changeCalculation).toLocaleString() }} FCFA</strong>
              </div>

              <button 
                @click="submitSplitPayment('cash', inputReceivedAmount)"
                class="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Ajouter Versement Espèces [+]
              </button>
            </div>

            <!-- CONTROLLER B: MOBILE MONEY (SIMULATOR INTEGRATED) -->
            <div v-show="activeMode === 'momo'" class="space-y-4">
              <div class="flex justify-between items-center">
                <h4 class="text-[10px] uppercase text-[#C8A96E] font-bold">Procédures Réseau : Orange/MTN Mobile Money</h4>
                <span class="text-[8px] bg-emerald-950/80 border border-emerald-800 text-emerald-400 px-1.5 py-0.5 rounded font-bold hover:animate-pulse">API ONLINE</span>
              </div>
              <p class="text-[9.5px] text-slate-500">Un SMS push USSD est envoyé sur le terminal du client pour valider le débit de son compte portefeuille électronique.</p>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label class="block text-[9.5px] text-slate-500 mb-1.5 font-bold">Opérateur Réseau</label>
                  <select v-model="momoOperator" class="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 focus:outline-none focus:border-slate-700">
                    <option value="orange">Orange Money (OM)</option>
                    <option value="mtn">MTN Mobile Money (MoMo)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[9.5px] text-slate-500 mb-1.5 font-bold">Numéro de téléphone</label>
                  <input type="text" v-model="momoPhone" placeholder="Ex: 699112233" class="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 focus:outline-none focus:border-slate-700 text-emerald-450 font-bold" />
                </div>
                <div>
                  <label class="block text-[9.5px] text-slate-500 mb-1.5 font-bold">Montant à prélever</label>
                  <input type="number" v-model="momoAmount" class="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 focus:outline-none focus:border-slate-700 font-bold text-center" />
                </div>
              </div>

              <!-- SIMULATE PROGRESS BAR FOR USSD PIN -->
              <div v-if="momoScanState === 'pending'" class="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <div class="flex justify-between items-center text-[9px] font-bold text-emerald-400">
                  <span>EN ATTENTE DE LA SAGE DE L'ÉPINGLEMENT PIN SUR LE MOBILE DU CLIENT...</span>
                  <span class="animate-ping font-black">●</span>
                </div>
                <div class="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                  <div class="bg-emerald-500 h-full w-1/2 animate-infinite-loading rounded-full"></div>
                </div>
                <p class="text-[8px] text-slate-500">Le client (tel: {{ momoPhone }}) est invité à saisir son code secret Orange/MTN pour valider {{ momoAmount }} FCFA.</p>
              </div>

              <div class="pt-2">
                <button 
                  v-if="momoScanState !== 'pending'"
                  @click="triggerMomoPushPayment"
                  class="px-4 py-2 bg-emerald-950 text-emerald-400 border border-emerald-900/60 hover:bg-emerald-900/40 rounded-lg text-xs font-bold transition uppercase tracking-wider"
                >
                  Envoyer PUSH USSD de Facturation [ Pay ]
                </button>
                <span v-else class="text-[9px] text-slate-500 font-bold uppercase animate-pulse">
                  Attence Validation API...
                </span>
              </div>
            </div>

            <!-- CONTROLLER C: CARD TERMINAL LINK EMULATOR -->
            <div v-show="activeMode === 'card'" class="space-y-4">
              <h4 class="text-[10px] uppercase text-[#C8A96E] font-bold">Terminal GIMAC Carte (NFC / Chip)</h4>
              <p class="text-[9.5px] text-slate-500">Emulation du paiement par carte bancaire Visa, Mastercard ou GIMAC sur terminal de vente (TPE).</p>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-[9.5px] text-slate-500 mb-1.5 font-bold">Montant TPE</label>
                  <input type="number" v-model="cardAmount" class="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-center font-bold focus:outline-none focus:border-slate-700" />
                </div>
                <div>
                  <label class="block text-[9.5px] text-slate-500 mb-1.5 font-bold">Réseau d'Affiliation</label>
                  <select v-model="cardType" class="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-slate-700">
                    <option value="visa">VISA Cameroon Network</option>
                    <option value="mastercard">MasterCard International</option>
                    <option value="gimac">Réseau Monétique GIMAC</option>
                  </select>
                </div>
              </div>

              <!-- SIMULATE CARD SWIPE -->
              <div v-if="cardScanState === 'swiped'" class="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-lg text-[9.5px] font-bold text-center text-emerald-400 animate-pulse">
                💳 CARTE DÉTECTÉE - AUTORISATION BANCAIRE SECURE EN COURS...
              </div>

              <div class="pt-2 flex gap-2">
                <button 
                  @click="triggerCardSwipedSimulation"
                  class="px-4 py-2 bg-emerald-950 text-emerald-400 border border-emerald-900/60 hover:bg-emerald-900/40 rounded-lg text-xs font-bold transition-colors"
                >
                  Passer Carte TPE [ Simulator ]
                </button>
              </div>
            </div>

            <!-- CONTROLLER D: AVOIR REDEMPTION -->
            <div v-show="activeMode === 'voucher'" class="space-y-4">
              <h4 class="text-[10px] uppercase text-[#C8A96E] font-bold">Réclamation d'un Avoir (Credit Voucher)</h4>
              <p class="text-[9.5px] text-slate-500">Un client peut régler l'intégralité ou une partie de sa commande à l'aide d'un Bon d'Avoir préalablement généré lors d'un retour marchandise.</p>

              <div class="flex gap-2">
                <input 
                  type="text" 
                  v-model="voucherInputCode"
                  placeholder="Saisir Code de l'Avoir (ex: AV-9810-DF)..."
                  class="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono uppercase text-emerald-400 focus:outline-none focus:border-slate-700"
                />
                <button 
                  @click="handleApplyVoucher"
                  class="px-4 py-2 bg-indigo-650 hover:bg-indigo-600 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Vérifier &amp; Déduire
                </button>
              </div>

              <!-- List available demo vouchers -->
              <div class="pt-2 text-[9px] text-slate-500 space-y-1">
                <p class="font-bold text-slate-400">Avoirs disponibles pour test :</p>
                <div v-for="vc in unusedVouchers" :key="vc.code" class="flex justify-between bg-slate-900 border border-slate-850 p-2 rounded-lg hover:bg-slate-850 transition-colors">
                  <span class="text-slate-350">🎟️ ID: {{ vc.code }} (Tel: {{ vc.clientPhone }})</span>
                  <strong class="text-[#C8A96E] font-mono">{{ vc.amount }} FCFA</strong>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      <!-- COLUMN 3: SPLIT BILL REGISTRY & REGISTER SUBMIT -->
      <div class="space-y-6">
        
        <!-- BILL REGISTER DRAWER -->
        <div class="bg-[#14141E] border border-slate-800 p-5 rounded-2xl space-y-4">
          <h3 class="text-xs font-mono font-bold uppercase text-[#C8A96E] pb-2 border-b border-slate-800 leading-tight">
            Registre des Règlements Saisis
          </h3>

          <div v-if="splitPayments.length === 0" class="text-center py-10 text-[9.5px] text-slate-650">
            Aucun versement n'a encore été rattaché à cette vente.
          </div>

          <div v-else class="space-y-2 font-mono text-[10.5px]">
            <div 
              v-for="payment in splitPayments" 
              :key="payment.id"
              class="p-2.5 bg-slate-950 border border-slate-850 rounded-xl flex justify-between items-center hover:border-slate-700 transition-colors"
            >
              <div>
                <strong class="text-slate-300 block uppercase" v-if="payment.method === 'cash'">💵 Espèces (Cash)</strong>
                <strong class="text-slate-300 block uppercase" v-else-if="payment.method === 'momo'">📱 Mobile Money</strong>
                <strong class="text-slate-300 block uppercase" v-else-if="payment.method === 'card'">💳 Carte bancaire</strong>
                <strong class="text-slate-300 block uppercase" v-else-if="payment.method === 'voucher'">🎟️ Avoir (Voucher)</strong>
                
                <span class="text-[8.5px] text-slate-500 block mt-0.5" v-if="payment.memo">
                  Note : {{ payment.memo }}
                </span>
              </div>

              <div class="text-right flex items-center gap-2">
                <strong class="text-emerald-450">
                  {{ payment.amount.toLocaleString() }} ₣
                </strong>
                <button 
                  @click="removePaymentSplit(payment.id)"
                  class="text-red-500 hover:text-red-400 font-bold p-1 bg-red-950/20 border border-red-900/30 rounded-lg hover:border-red-500/50 transition"
                >
                  <XMarkIcon class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- STOCKS STATE RECAP FOR FIFO VERIFIABILITY -->
        <div class="bg-[#2D7D6E]/5 border border-slate-800 p-5 rounded-2xl space-y-3">
          <h3 class="text-[10px] text-emerald-450 font-bold uppercase tracking-wider font-mono flex items-center gap-1.5">
            <SparklesIcon class="w-4 h-4 text-emerald-500" />
            <span>Contrôle Batch FIFO avant transaction</span>
          </h3>
          <p class="text-[9px] text-slate-500 leading-relaxed font-sans">Les produits seront débités dans l'ordre de leur lot d'entrée en entrepôt (Premier Entré, Premier Sorti).</p>
          <div class="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div class="h-full bg-emerald-500 w-full"></div>
          </div>
        </div>

        <!-- COMPLETE FINISH PAYMENT TRIGGER -->
        <div class="p-5 bg-[#14141E] border border-slate-800 rounded-2xl space-y-4">
          <div class="text-center">
            <p class="text-[9px] text-slate-500 uppercase font-mono">Dossier de vente B2B prêt</p>
          </div>

          <button 
            @click="handleCompleteSalesCheckout"
            :disabled="remainingToPay > 0"
            class="w-full py-4 rounded-xl font-bold uppercase text-xs tracking-widest transition duration-150 transform hover:scale-[1.01]"
            :class="remainingToPay <= 0 ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/20' : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'"
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
  ArrowLeftIcon, 
  BanknotesIcon, 
  DevicePhoneMobileIcon, 
  CreditCardIcon, 
  TicketIcon, 
  XMarkIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline';

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
@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
  animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
