<template>
  <div class="space-y-6">
    
    <!-- Top HUD Banner -->
    <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-xl font-bold text-slate-100">Withdrawals &amp; Liquidations (Retraits)</h1>
        <p class="text-xs text-slate-400 mt-1">Request local Mobile Money transfers or international bank wire settlements.</p>
      </div>

      <button 
        @click="openCreateWithdrawalPopup"
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold rounded-xl shadow-lg transition uppercase shrink-0"
      >
        + Request Cash-Out (Popup)
      </button>
    </div>

    <!-- METRICS GRID -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <div class="p-5 bg-[#090e24] border border-slate-800 rounded-xl relative overflow-hidden">
        <span class="text-[9px] uppercase font-mono text-slate-400 block tracking-wider">Withdrawable liquidity</span>
        <div class="text-2xl font-bold font-mono text-emerald-400 mt-2">
          {{ formatCurrency(availableBalance) }} FCFA
        </div>
        <p class="text-[10px] text-slate-500 mt-1">Cleared for immediate release</p>
      </div>

      <div class="p-5 bg-[#090e24] border border-slate-800 rounded-xl relative overflow-hidden">
        <span class="text-[9px] uppercase font-mono text-slate-400 block tracking-wider">Pending Payouts</span>
        <div class="text-2xl font-bold font-mono text-amber-400 mt-2">
          {{ formatCurrency(pendingSum) }} FCFA
        </div>
        <p class="text-[10px] text-slate-500 mt-1">Currently in settlement transit queue</p>
      </div>

      <div class="p-5 bg-[#090e24] border border-slate-800 rounded-xl relative overflow-hidden">
        <span class="text-[9px] uppercase font-mono text-slate-400 block tracking-wider">Cleared cash-outs to date</span>
        <div class="text-2xl font-bold font-mono text-slate-200 mt-2">
          {{ formatCurrency(clearedSum) }} FCFA
        </div>
        <p class="text-[10px] text-slate-500 mt-1">Aggregate validated transactions</p>
      </div>

    </div>

    <!-- WITHDRAWALS LOG TABLE -->
    <div class="bg-[#080d22] border border-slate-900 rounded-xl overflow-hidden shadow-xl">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse select-none">
          <thead>
            <tr class="bg-indigo-950/20 border-b border-indigo-950 text-[#5d6a94] font-mono uppercase tracking-wider text-[10px]">
              <th class="p-4">Reference Slip</th>
              <th class="p-4">Payment Method</th>
              <th class="p-4">Receiver info / Name</th>
              <th class="p-4">Requested date</th>
              <th class="p-4 font-mono text-right">Settlement sum</th>
              <th class="p-4 text-center">Transfer State</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-900">
            <tr 
              v-for="w in withdrawals" 
              :key="w.id"
              class="hover:bg-slate-900/40 transition text-slate-300"
            >
              <td class="p-4 font-mono font-bold text-indigo-400">{{ w.id }}</td>
              <td class="p-4">
                <span class="px-2 py-0.5 bg-slate-950 text-indigo-300 rounded border border-indigo-950/40 font-mono font-bold uppercase text-[9px]">
                  {{ w.method }}
                </span>
              </td>
              <td class="p-4">
                <div class="font-bold text-slate-200">{{ w.name }}</div>
                <div class="text-[9.5px] text-slate-500 font-mono">{{ w.accountNumber || 'N/A' }}</div>
              </td>
              <td class="p-4 font-mono text-slate-400">{{ w.date }}</td>
              <td class="p-4 font-mono text-right font-bold text-slate-100">
                {{ formatCurrency(w.amount) }} FCFA
              </td>
              <td class="p-4 text-center">
                <span 
                  class="px-2 py-0.5 rounded text-[8.5px] font-semibold font-mono uppercase"
                  :class="getWithdrawalStatusClass(w.status)"
                >
                  {{ w.status }}
                </span>
              </td>
              <td class="p-4 text-right font-mono text-[11px] text-slate-500">
                <span v-if="w.status === 'success'" class="text-emerald-400 font-bold block">✓ ARCHIVED</span>
                <button 
                  v-else 
                  @click="openConfigureWithdrawalPopup(w)"
                  class="p-1 px-2.5 bg-slate-900 text-slate-350 hover:bg-slate-800 rounded font-mono border border-slate-850"
                >
                  ⚙️ Edit details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- POPUPS -->
    <!-- 1. INITIATE WITHDRAWAL POPUP -->
    <div v-if="showWithdrawalPopup" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-[#0b1029] border border-indigo-900/90 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden animate-fade-in text-slate-100">
        <div class="flex justify-between items-start border-b border-indigo-950 pb-3 mb-4">
          <div>
            <span class="text-[9px] font-mono text-indigo-400 px-1.5 py-0.5 rounded bg-indigo-950 font-bold uppercase">OUTBOUND CLEARANCE GATEWAY</span>
            <h3 class="text-sm font-bold font-mono tracking-wide mt-1">
              {{ isEditing ? 'RE-CONFIGURE CASHOUT ADAPTATION' : 'REQUEST NEW CASHOUT Payout' }}
            </h3>
          </div>
          <button @click="showWithdrawalPopup = false" class="text-slate-400 hover:text-white font-bold font-mono">&times; CLOSE</button>
        </div>

        <form @submit.prevent="submitWithdrawal" class="space-y-4 text-xs font-mono">
          <div>
            <label class="block text-[9.5px] uppercase text-slate-400 mb-1">Transfer Gateway destination *</label>
            <select 
              v-model="withdrawalForm.method"
              required
              class="w-full bg-slate-950 border border-slate-900 px-2.5 py-1.5 rounded focus:outline-none"
            >
              <option value="Orange MoMo">Orange Money Cameroon - MoMo</option>
              <option value="MTN MoMo">MTN Mobile Money - MoMo</option>
              <option value="Direct Bank Wire">Direct Bank Wire (IBAN/SWIFT)</option>
            </select>
          </div>

          <div>
            <label class="block text-[9.5px] uppercase text-slate-400 mb-1">Receiver Account Holder Name *</label>
            <input 
              type="text" 
              v-model="withdrawalForm.name"
              required
              class="w-full bg-slate-950 border border-slate-900 px-2.5 py-1.5 rounded text-slate-200 focus:outline-none"
              placeholder="Ex: Robert Kane Sarl"
            />
          </div>

          <div>
            <label class="block text-[9.5px] uppercase text-slate-400 mb-1">Destination Phone Number or IBAN *</label>
            <input 
              type="text" 
              v-model="withdrawalForm.accountNumber"
              required
              class="w-full bg-slate-950 border border-slate-900 px-2.5 py-1.5 rounded text-indigo-400 focus:outline-none"
              placeholder="Ex: +237 677 88 99 00"
            />
          </div>

          <div>
            <label class="block text-[9.5px] uppercase text-slate-450 mb-1">Withdrawal Amount (FCFA) *</label>
            <input 
              type="number" 
              v-model="withdrawalForm.amount"
              required
              :max="availableBalance"
              min="10000"
              class="w-full bg-slate-950 border border-slate-900 px-2.5 py-1.5 rounded text-slate-200 focus:outline-none"
              placeholder="Ex: 5000000"
            />
            <p class="text-[9.5px] text-slate-500 mt-1">Available range: 10k to {{ formatCurrency(availableBalance) }} FCFA</p>
          </div>

          <!-- Actions -->
          <div class="pt-4 border-t border-indigo-950 flex justify-end space-x-2">
            <button 
              type="button" 
              @click="showWithdrawalPopup = false"
              class="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-850 rounded font-bold text-slate-405"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-4 py-1.5 bg-indigo-650 hover:bg-indigo-550 text-white font-bold rounded uppercase"
            >
              Submit transfer request
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { withdrawals } from '@/utils/supplier_db';
import { useToast } from 'vue-toastification';

const toast = useToast();

const availableBalance = ref(89254000);

const showWithdrawalPopup = ref(false);
const isEditing = ref(false);
const targetWithdrawalId = ref(null);

const withdrawalForm = ref({
  method: 'MTN MoMo',
  name: '',
  accountNumber: '',
  amount: ''
});

const pendingSum = computed(() => {
  return withdrawals.value
    .filter(w => w.status === 'processing')
    .reduce((acc, w) => acc + (parseFloat(w.amount) || 0), 0);
});

const clearedSum = computed(() => {
  return withdrawals.value
    .filter(w => w.status === 'success')
    .reduce((acc, w) => acc + (parseFloat(w.amount) || 0), 0);
});

function formatCurrency(val) {
  if (!val) return '0';
  return new Intl.NumberFormat('fr-FR').format(val);
}

function getWithdrawalStatusClass(status) {
  const s = (status || '').toLowerCase();
  if (s === 'processing') return 'bg-amber-950 text-amber-400 border border-amber-900/40';
  if (s === 'success') return 'bg-emerald-950 text-emerald-400 border border-emerald-900/45';
  return 'bg-red-950 text-red-400 border border-red-900/30';
}

function openCreateWithdrawalPopup() {
  isEditing.value = false;
  withdrawalForm.value = {
    method: 'MTN MoMo',
    name: 'Robert Kane Sarl',
    accountNumber: '+237 677 88 99 00',
    amount: 1540000
  };
  showWithdrawalPopup.value = true;
}

function openConfigureWithdrawalPopup(w) {
  isEditing.value = true;
  targetWithdrawalId.value = w.id;
  withdrawalForm.value = {
    method: w.method,
    name: w.name,
    accountNumber: w.accountNumber || '',
    amount: w.amount
  };
  showWithdrawalPopup.value = true;
}

function submitWithdrawal() {
  if (isEditing.value) {
    const existing = withdrawals.value.find(w => w.id === targetWithdrawalId.value);
    if (existing) {
      existing.method = withdrawalForm.value.method;
      existing.name = withdrawalForm.value.name;
      existing.accountNumber = withdrawalForm.value.accountNumber;
      existing.amount = parseFloat(withdrawalForm.value.amount);
      toast.success('Withdrawal transit parameters overridden.');
    }
  } else {
    const reqAmount = parseFloat(withdrawalForm.value.amount);
    if (reqAmount > availableBalance.value) {
      toast.error('Insufficient withdrawable liquid assets inside ledger balance!');
      return;
    }

    const newId = 'LT-OM-' + Math.floor(Math.random() * 90000 + 100000);
    withdrawals.value.unshift({
      id: newId,
      method: withdrawalForm.value.method,
      name: withdrawalForm.value.name,
      amount: reqAmount,
      date: new Date().toISOString().slice(0, 10),
      status: 'processing',
      accountNumber: withdrawalForm.value.accountNumber
    });

    toast.success('Your transfer request of ' + reqAmount.toLocaleString() + ' FCFA has been safely routed to bank clearances.');
  }

  showWithdrawalPopup.value = false;
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
