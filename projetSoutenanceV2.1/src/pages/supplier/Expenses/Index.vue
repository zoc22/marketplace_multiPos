<template>
  <div class="space-y-6">
    
    <!-- Top HUD -->
    <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div>
        <h1 class="text-xl font-bold text-slate-100">Operational Expenses (Dépenses)</h1>
        <p class="text-xs text-slate-400 mt-1">Scribe and catalog your company physical and logistical expenditures.</p>
      </div>

      <button 
        @click="openCreateExpensePopup"
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold rounded-xl shadow-lg transition uppercase shrink-0"
      >
        + Add Expense (Popup)
      </button>
    </div>

    <!-- MAIN GRID METRIC CARDS -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <div class="p-5 bg-[#090e24] border border-slate-800 rounded-xl relative overflow-hidden">
        <span class="text-[9px] uppercase font-mono text-slate-400 block tracking-wider">Total Monthly Expenses</span>
        <div class="text-2xl font-bold font-mono text-slate-200 mt-2">
          {{ formatCurrency(totalMonthlyExpenses) }} FCFA
        </div>
        <p class="text-[10px] text-slate-500 mt-1">Sum of active operational debits</p>
      </div>

      <div class="p-5 bg-[#090e24] border border-slate-800 rounded-xl relative overflow-hidden">
        <span class="text-[9px] uppercase font-mono text-slate-400 block tracking-wider">Highest Cost Segment</span>
        <div class="text-2xl font-bold font-mono text-slate-100 mt-2">
          Salaires Équipe
        </div>
        <p class="text-[10px] text-slate-500 mt-1">Staffing expenditures allocation</p>
      </div>

      <div class="p-5 bg-[#090e24] border border-slate-800 rounded-xl relative overflow-hidden">
        <span class="text-[9px] uppercase font-mono text-slate-400 block tracking-wider">Total Registered Slips</span>
        <div class="text-2xl font-bold font-mono text-slate-100 mt-2">
          {{ expenses.length }} Receipts
        </div>
        <p class="text-[10px] text-slate-500 mt-1">Checked compliance audits</p>
      </div>

    </div>

    <!-- LOG TABLE -->
    <div class="bg-[#080d22] border border-slate-900 rounded-xl overflow-hidden shadow-xl">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse select-none">
          <thead>
            <tr class="bg-indigo-950/20 border-b border-indigo-950 text-[#5d6a94] font-mono uppercase tracking-wider text-[10px]">
              <th class="p-4">Slip ID</th>
              <th class="p-4">Expense category</th>
              <th class="p-4">Descriptive context</th>
              <th class="p-4">Log date</th>
              <th class="p-4 font-mono text-right">Debit amount</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-900">
            <tr 
              v-for="e in expenses" 
              :key="e.id"
              class="hover:bg-slate-900/40 transition text-slate-300"
            >
              <td class="p-4 font-mono text-slate-500">{{ e.id }}</td>
              <td class="p-4">
                <span class="px-2 py-0.5 bg-slate-950 text-indigo-400 rounded border border-indigo-950/40 font-mono font-bold">
                  {{ e.category }}
                </span>
              </td>
              <td class="p-4 font-sans text-slate-350">{{ e.description }}</td>
              <td class="p-4 font-mono text-slate-400">{{ e.date }}</td>
              <td class="p-4 font-mono text-right font-bold text-red-400">
                - {{ formatCurrency(e.amount) }} FCFA
              </td>
              <td class="p-4 text-right">
                <div class="inline-flex items-center gap-2">
                  <button 
                    @click="openEditExpensePopup(e)"
                    class="p-1 px-2.5 bg-slate-900 text-slate-350 hover:bg-slate-800 hover:text-white rounded text-[10px] font-mono border border-slate-850 transition"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    @click="triggerDeleteExpenseConfirmation(e)"
                    class="p-1 px-2.5 bg-red-950/20 text-red-400 hover:bg-red-900 hover:text-slate-950 rounded text-[10px] font-mono border border-red-900/30 font-bold transition"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- POPUP MODALS -->
    <!-- 1. CREATE / EDIT EXPENSE MODAL -->
    <div v-if="showExpensePopup" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-[#0b1029] border border-indigo-900/90 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden animate-fade-in text-slate-100">
        <div class="flex justify-between items-start border-b border-indigo-950 pb-3 mb-4">
          <div>
            <span class="text-[9px] font-mono text-indigo-400 px-1.5 py-0.5 rounded bg-indigo-950 font-bold uppercase">TREASURY EXPENSE SLIP</span>
            <h3 class="text-sm font-bold font-mono tracking-wide mt-1">
              {{ isEditing ? 'MODIFY EXPENSE DEBIT RECORD' : 'CREATE OUTBOUND OPERATIONS DEBIT' }}
            </h3>
          </div>
          <button @click="showExpensePopup = false" class="text-slate-400 hover:text-white font-bold font-mono">&times; CLOSE</button>
        </div>

        <form @submit.prevent="saveExpense" class="space-y-4 text-xs font-mono">
          <div>
            <label class="block text-[9.5px] uppercase text-slate-400 mb-1">Cost segment Category *</label>
            <select 
              v-model="expenseForm.category"
              required
              class="w-full bg-slate-950 border border-slate-900 px-2 py-1.5 rounded text-slate-200 focus:outline-none"
            >
              <option value="Carburant Logistique">Carburant Logistique</option>
              <option value="Loyer Entrepôt">Loyer Entrepôt</option>
              <option value="Droits de Douane">Droits de Douane</option>
              <option value="Salaires Équipe">Salaires Équipe</option>
              <option value="Entretien Matériel">Entretien Matériel</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[9.5px] uppercase text-slate-450 mb-1">Debit Amount (FCFA) *</label>
              <input 
                type="number" 
                v-model="expenseForm.amount"
                required
                min="1"
                class="w-full bg-slate-950 border border-slate-900 px-2 py-1.5 rounded focus:outline-none"
                placeholder="Ex: 350000"
              />
            </div>
            <div>
              <label class="block text-[9.5px] uppercase text-slate-430 mb-1">Spend Date *</label>
              <input 
                type="date" 
                v-model="expenseForm.date"
                required
                class="w-full bg-slate-950 border border-slate-900 px-2 py-1.5 rounded text-indigo-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label class="block text-[9.5px] uppercase text-slate-400 mb-1">Spend Descriptive objective *</label>
            <input 
              type="text" 
              v-model="expenseForm.description"
              required
              class="w-full bg-slate-950 border border-slate-900 px-2.5 py-2 rounded focus:outline-none text-slate-200"
              placeholder="Ex: Carburant pour livraison co-op"
            />
          </div>

          <!-- Actions -->
          <div class="pt-4 border-t border-indigo-950 flex justify-end space-x-2">
            <button 
              type="button" 
              @click="showExpensePopup = false"
              class="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 rounded font-bold text-slate-455"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-4 py-1.5 bg-indigo-650 hover:bg-indigo-550 text-white font-bold rounded uppercase"
            >
              Deploy Debit
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 2. EXPENSE DELETE CONFIRMATION -->
    <div v-if="expenseToDelete" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-red-950/80 border-2 border-red-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden animate-fade-in text-slate-100 backdrop-blur">
        <div class="text-center space-y-3">
          <div class="h-12 w-12 bg-red-500/10 text-red-500 rounded-full border border-red-500/30 flex items-center justify-center font-bold text-2xl mx-auto select-none">
            🚷
          </div>
          <h3 class="text-base font-mono font-bold uppercase tracking-wider text-red-450">AUTHENTICATE DELETION</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">
            Are you sure you want to delete and wipe the expense record <strong class="text-slate-200 font-semibold">{{ expenseToDelete.id }}</strong>? This will permanently skew monthly auditing indexes.
          </p>
        </div>

        <div class="mt-6 flex space-x-3">
          <button 
            @click="expenseToDelete = null"
            class="flex-1 py-1.5 bg-slate-900 hover:bg-slate-850 rounded text-xs font-mono font-bold text-slate-400 text-center transition"
          >
            Cancel
          </button>
          <button 
            @click="confirmDeleteExpense"
            class="flex-1 py-1.5 bg-red-800 hover:bg-red-750 text-white rounded text-xs font-mono font-bold text-center transition uppercase"
          >
            Wipe Expense Records
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { expenses } from '@/utils/supplier_db';
import { useToast } from 'vue-toastification';

const toast = useToast();

const showExpensePopup = ref(false);
const isEditing = ref(false);
const targetExpenseId = ref(null);
const expenseToDelete = ref(null);

const expenseForm = ref({
  category: 'Carburant Logistique',
  amount: '',
  date: new Date().toISOString().slice(0, 10),
  description: ''
});

const totalMonthlyExpenses = computed(() => {
  return expenses.value.reduce((acc, e) => acc + (parseFloat(e.amount) || 0), 0);
});

function formatCurrency(val) {
  if (!val) return '0';
  return new Intl.NumberFormat('fr-FR').format(val);
}

function openCreateExpensePopup() {
  isEditing.value = false;
  expenseForm.value = {
    category: 'Carburant Logistique',
    amount: 150000,
    date: new Date().toISOString().slice(0, 10),
    description: ''
  };
  showExpensePopup.value = true;
}

function openEditExpensePopup(e) {
  isEditing.value = true;
  targetExpenseId.value = e.id;
  expenseForm.value = {
    category: e.category,
    amount: e.amount,
    date: e.date || new Date().toISOString().slice(0, 10),
    description: e.description
  };
  showExpensePopup.value = true;
}

function saveExpense() {
  if (isEditing.value) {
    const existing = expenses.value.find(e => e.id === targetExpenseId.value);
    if (existing) {
      existing.category = expenseForm.value.category;
      existing.amount = parseFloat(expenseForm.value.amount);
      existing.date = expenseForm.value.date;
      existing.description = expenseForm.value.description;
      toast.success('Expense receipt records updated on DB.');
    }
  } else {
    const newId = 'exp_' + String(expenses.value.length + 101).padStart(3, '0');
    expenses.value.push({
      id: newId,
      category: expenseForm.value.category,
      amount: parseFloat(expenseForm.value.amount),
      date: expenseForm.value.date,
      description: expenseForm.value.description
    });
    toast.success('Operational expense debited and catalogued!');
  }
  showExpensePopup.value = false;
}

function triggerDeleteExpenseConfirmation(e) {
  expenseToDelete.value = e;
}

function confirmDeleteExpense() {
  if (expenseToDelete.value) {
    expenses.value = expenses.value.filter(s => s.id !== expenseToDelete.value.id);
    toast.info(`Expense ticket ${expenseToDelete.value.id} is permanently redacted.`);
    expenseToDelete.value = null;
  }
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
