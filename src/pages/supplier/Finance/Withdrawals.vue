<template>
  <div class="space-y-6">
    
    <!-- Top HUD Banner -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Retraits et Liquidations</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Demandez des transferts Mobile Money locaux ou des virements bancaires internationaux.</p>
      </div>

      <button 
        @click="openCreateWithdrawalPopup"
        class="px-5 py-2.5 bg-[var(--color-primary)] hover:opacity-90 text-white font-bold rounded-xl shadow-sm transition flex items-center space-x-2 shrink-0"
      >
        <PlusIcon class="w-5 h-5 font-bold" />
        <span>Demander un retrait</span>
      </button>
    </div>

    <!-- METRICS GRID -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <div class="p-6 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl relative overflow-hidden flex items-start justify-between shadow-sm">
        <div class="space-y-2">
          <span class="text-xs font-semibold text-[var(--color-text-secondary)] block tracking-wider uppercase">Liquidité disponible</span>
          <div class="text-3xl font-bold text-[var(--color-text-primary)] mt-2">
            {{ formatCurrency(availableBalance) }} FCFA
          </div>
          <p class="text-sm text-[var(--color-text-muted)] mt-1">Prêt pour transfert immédiat</p>
        </div>
        <div class="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
          <BanknotesIcon class="w-7 h-7" />
        </div>
      </div>

      <div class="p-6 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl relative overflow-hidden flex items-start justify-between shadow-sm">
        <div class="space-y-2">
          <span class="text-xs font-semibold text-[var(--color-text-secondary)] block tracking-wider uppercase">Retraits en attente</span>
          <div class="text-3xl font-bold text-[var(--color-text-primary)] mt-2">
            {{ formatCurrency(pendingSum) }} FCFA
          </div>
          <p class="text-sm text-[var(--color-text-muted)] mt-1">En cours de traitement</p>
        </div>
        <div class="p-3 bg-amber-500/10 rounded-xl text-amber-500">
          <ClockIcon class="w-7 h-7" />
        </div>
      </div>

      <div class="p-6 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl relative overflow-hidden flex items-start justify-between shadow-sm">
        <div class="space-y-2">
          <span class="text-xs font-semibold text-[var(--color-text-secondary)] block tracking-wider uppercase">Total retiré à ce jour</span>
          <div class="text-3xl font-bold text-[var(--color-text-primary)] mt-2">
            {{ formatCurrency(clearedSum) }} FCFA
          </div>
          <p class="text-sm text-[var(--color-text-muted)] mt-1">Transactions validées au total</p>
        </div>
        <div class="p-3 bg-[var(--color-primary-muted)] rounded-xl text-[var(--color-primary)]">
          <CheckCircleIcon class="w-7 h-7" />
        </div>
      </div>

    </div>

    <!-- WITHDRAWALS LOG TABLE -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm border-collapse select-none">
          <thead>
            <tr class="bg-[var(--color-surface-hover)] border-b border-[var(--color-border)] text-[var(--color-text-secondary)] font-semibold uppercase tracking-wider text-xs">
              <th class="p-4">Référence</th>
              <th class="p-4">Méthode de paiement</th>
              <th class="p-4">Bénéficiaire</th>
              <th class="p-4">Date de demande</th>
              <th class="p-4 text-right">Montant</th>
              <th class="p-4 text-center">Statut</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr 
              v-for="(w, idx) in withdrawals" 
              :key="w.id"
              class="hover:bg-[var(--color-surface-hover)] transition text-[var(--color-text-primary)]"
            >
              <td class="p-4 font-bold text-[var(--color-primary)]">{{ w.id }}</td>
              <td class="p-4">
                <span class="px-3 py-1 bg-[var(--color-primary-muted)] text-[var(--color-primary)] rounded-lg border border-[var(--color-primary-border)] font-semibold uppercase text-[10px]">
                  {{ w.method }}
                </span>
              </td>
              <td class="p-4">
                <div class="font-bold text-[var(--color-text-primary)]">{{ w.name }}</div>
                <div class="text-xs text-[var(--color-text-secondary)] mt-0.5">{{ w.accountNumber || 'N/A' }}</div>
              </td>
              <td class="p-4 text-[var(--color-text-secondary)]">{{ w.date }}</td>
              <td class="p-4 text-right font-bold text-[var(--color-text-primary)]">
                {{ formatCurrency(w.amount) }} FCFA
              </td>
              <td class="p-4 text-center">
                <span 
                  class="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                  :class="getWithdrawalStatusClass(w.status)"
                >
                  {{ translateStatus(w.status) }}
                </span>
              </td>
              <td class="p-4 text-right">
                <span v-if="w.status === 'success'" class="text-emerald-500 font-bold flex items-center justify-end space-x-1.5 text-xs">
                  <CheckIcon class="w-4 h-4" />
                  <span>ARCHIVÉ</span>
                </span>
                <button 
                  v-else 
                  @click="openConfigureWithdrawalPopup(w)"
                  class="px-3 py-1.5 bg-[var(--color-background)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-lg font-bold border border-[var(--color-border)] transition flex items-center space-x-1.5 ml-auto text-xs"
                >
                  <Cog6ToothIcon class="w-4 h-4 text-[var(--color-primary)]" />
                  <span>Modifier</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- POPUPS -->
    <!-- 1. INITIATE WITHDRAWAL POPUP -->
    <Transition name="modal-fade">
      <div 
        v-if="showWithdrawalPopup" 
        @click.self="showWithdrawalPopup = false"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      >
        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl w-full max-w-sm shadow-2xl relative overflow-hidden modal-content flex flex-col max-h-[90vh]">
          <div class="p-6 border-b border-[var(--color-border)] flex items-center justify-between shrink-0">
            <div>
              <span class="text-[10px] text-[var(--color-primary)] px-2 py-0.5 rounded bg-[var(--color-primary-muted)] font-bold tracking-wider">PORTAIL DE RETRAIT</span>
              <h3 class="text-xl font-bold mt-2 text-[var(--color-text-primary)]">
                {{ isEditing ? 'Reconfigurer le retrait' : 'Nouveau retrait' }}
              </h3>
            </div>
            <button @click="showWithdrawalPopup = false" class="p-1.5 bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-md transition font-bold text-lg leading-none border border-[var(--color-border)]">
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-6">
            <form @submit.prevent="submitWithdrawal" class="space-y-5 text-sm" id="withdrawal-form">
              <div>
                <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Méthode de transfert <span class="text-red-500">*</span></label>
                <select 
                  v-model="withdrawalForm.method"
                  required
                  class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                >
                  <option value="Orange MoMo">Orange Money Cameroun</option>
                  <option value="MTN MoMo">MTN Mobile Money</option>
                  <option value="Direct Bank Wire">Virement Bancaire Direct (IBAN/SWIFT)</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Nom du bénéficiaire <span class="text-red-500">*</span></label>
                <input 
                  type="text" 
                  v-model="withdrawalForm.name"
                  required
                  class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                  placeholder="Ex: Robert Kane Sarl"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Téléphone ou IBAN <span class="text-red-500">*</span></label>
                <input 
                  type="text" 
                  v-model="withdrawalForm.accountNumber"
                  required
                  class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                  placeholder="Ex: +237 677 88 99 00"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Montant du retrait (FCFA) <span class="text-red-500">*</span></label>
                <input 
                  type="number" 
                  v-model="withdrawalForm.amount"
                  required
                  :max="availableBalance"
                  min="10000"
                  class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                  placeholder="Ex: 5000000"
                />
                <p class="text-xs text-[var(--color-text-muted)] mt-1.5">Disponible : de 10 000 à {{ formatCurrency(availableBalance) }} FCFA</p>
              </div>
            </form>
          </div>

          <!-- Actions -->
          <div class="p-6 border-t border-[var(--color-border)] bg-[var(--color-surface-hover)] shrink-0 flex justify-end space-x-3">
            <button 
              type="button" 
              @click="showWithdrawalPopup = false"
              class="px-5 py-2.5 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] hover:bg-[var(--color-background)] text-[var(--color-text-primary)] rounded-xl font-semibold transition"
            >
              Annuler
            </button>
            <button 
              type="submit"
              form="withdrawal-form"
              class="px-5 py-2.5 bg-[var(--color-primary)] hover:opacity-90 text-white rounded-xl font-bold transition shadow-sm"
            >
              Valider le transfert
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { withdrawals } from '@/utils/supplier_db';
import { useToast } from 'vue-toastification';
import { 
  BanknotesIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  Cog6ToothIcon, 
  CheckIcon, 
  XMarkIcon,
  PlusIcon
} from '@heroicons/vue/24/outline';

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

function translateStatus(s) {
  if (s === 'processing') return 'En cours';
  if (s === 'success') return 'Succès';
  if (s === 'failed') return 'Échec';
  return s;
}

function getWithdrawalStatusClass(status) {
  const s = (status || '').toLowerCase();
  if (s === 'processing') return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
  if (s === 'success') return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
  return 'bg-red-500/10 text-red-500 border border-red-500/20';
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
      toast.success('Paramètres du transfert mis à jour.');
    }
  } else {
    const reqAmount = parseFloat(withdrawalForm.value.amount);
    if (reqAmount > availableBalance.value) {
      toast.error('Fonds disponibles insuffisants pour ce retrait !');
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

    toast.success('Votre demande de retrait de ' + reqAmount.toLocaleString() + ' FCFA a été envoyée.');
  }

  showWithdrawalPopup.value = false;
}

// Esc key listener
function handleKeyDown(e) {
  if (e.key === 'Escape') {
    showWithdrawalPopup.value = false;
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
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
