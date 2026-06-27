<template>
  <div class="space-y-6">
    
    <!-- Top HUD -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Dépenses Opérationnelles</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Enregistrez et cataloguez les dépenses physiques et logistiques de votre entreprise.</p>
      </div>

      <button 
        @click="openCreateExpensePopup"
        class="px-5 py-2.5 bg-[var(--color-primary)] hover:opacity-90 text-white font-bold rounded-xl shadow-sm transition flex items-center space-x-2 shrink-0"
      >
        <span class="text-lg leading-none">+</span>
        <span>Ajouter une dépense</span>
      </button>
    </div>

    <!-- MAIN GRID METRIC CARDS -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <div class="p-6 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl relative overflow-hidden shadow-sm">
        <span class="text-xs uppercase font-semibold text-[var(--color-text-secondary)] block tracking-wider">Total Dépenses Mensuelles</span>
        <div class="text-3xl font-bold text-[var(--color-text-primary)] mt-3">
          {{ formatCurrency(totalMonthlyExpenses) }} FCFA
        </div>
        <p class="text-sm text-[var(--color-text-muted)] mt-2">Somme des débits opérationnels actifs</p>
      </div>

      <div class="p-6 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl relative overflow-hidden shadow-sm">
        <span class="text-xs uppercase font-semibold text-[var(--color-text-secondary)] block tracking-wider">Segment le Plus Coûteux</span>
        <div class="text-3xl font-bold text-[var(--color-text-primary)] mt-3">
          Salaires Équipe
        </div>
        <p class="text-sm text-[var(--color-text-muted)] mt-2">Allocation des dépenses de personnel</p>
      </div>

      <div class="p-6 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl relative overflow-hidden shadow-sm">
        <span class="text-xs uppercase font-semibold text-[var(--color-text-secondary)] block tracking-wider">Total des Reçus</span>
        <div class="text-3xl font-bold text-[var(--color-text-primary)] mt-3">
          {{ expenses.length }} Reçus
        </div>
        <p class="text-sm text-[var(--color-text-muted)] mt-2">Audits de conformité vérifiés</p>
      </div>

    </div>

    <!-- LOG TABLE -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm border-collapse select-none">
          <thead>
            <tr class="bg-[var(--color-surface-hover)] border-b border-[var(--color-border)] text-[var(--color-text-secondary)] font-semibold uppercase tracking-wider text-xs">
              <th class="p-4">ID Reçu</th>
              <th class="p-4">Catégorie</th>
              <th class="p-4">Description</th>
              <th class="p-4">Date</th>
              <th class="p-4 text-right">Montant (Débit)</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr 
              v-for="e in expenses" 
              :key="e.id"
              class="hover:bg-[var(--color-surface-hover)] transition text-[var(--color-text-primary)]"
            >
              <td class="p-4 font-mono text-[var(--color-text-secondary)]">{{ e.id }}</td>
              <td class="p-4">
                <span class="px-3 py-1 bg-[var(--color-primary-muted)] text-[var(--color-primary)] rounded-lg border border-[var(--color-primary-border)] font-semibold text-xs">
                  {{ e.category }}
                </span>
              </td>
              <td class="p-4">{{ e.description }}</td>
              <td class="p-4 text-[var(--color-text-secondary)]">{{ e.date }}</td>
              <td class="p-4 text-right font-bold text-red-500">
                - {{ formatCurrency(e.amount) }} FCFA
              </td>
              <td class="p-4 text-right">
                <div class="inline-flex items-center gap-2">
                  <button 
                    @click="openEditExpensePopup(e)"
                    class="px-3 py-1.5 bg-[var(--color-background)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] rounded-lg text-xs font-bold border border-[var(--color-border)] transition"
                  >
                    ✏️ Éditer
                  </button>
                  <button 
                    @click="triggerDeleteExpenseConfirmation(e)"
                    class="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-xs border border-red-500/20 font-bold transition flex items-center"
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
    <Transition name="modal-fade">
      <div v-if="showExpensePopup" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl w-full max-w-sm shadow-2xl relative overflow-hidden modal-content">
          <div class="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
            <div>
              <span class="text-[10px] text-[var(--color-primary)] px-2 py-0.5 rounded bg-[var(--color-primary-muted)] font-bold tracking-wider">Bordereau de Dépense</span>
              <h3 class="text-xl font-bold mt-2 text-[var(--color-text-primary)]">
                {{ isEditing ? 'Modifier la dépense' : 'Enregistrer une dépense' }}
              </h3>
            </div>
            <button @click="showExpensePopup = false" class="p-1.5 bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-md transition font-bold text-lg leading-none border border-[var(--color-border)]">&times;</button>
          </div>

          <form @submit.prevent="saveExpense" class="p-6 space-y-5 text-sm" id="expense-form">
            <div>
              <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Catégorie <span class="text-red-500">*</span></label>
              <select 
                v-model="expenseForm.category"
                required
                class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
              >
                <option value="Carburant Logistique">Carburant Logistique</option>
                <option value="Loyer Entrepôt">Loyer Entrepôt</option>
                <option value="Droits de Douane">Droits de Douane</option>
                <option value="Salaires Équipe">Salaires Équipe</option>
                <option value="Entretien Matériel">Entretien Matériel</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-5">
              <div>
                <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Montant (FCFA) <span class="text-red-500">*</span></label>
                <input 
                  type="number" 
                  v-model="expenseForm.amount"
                  required
                  min="1"
                  class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                  placeholder="Ex: 350000"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Date <span class="text-red-500">*</span></label>
                <input 
                  type="date" 
                  v-model="expenseForm.date"
                  required
                  class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Description <span class="text-red-500">*</span></label>
              <input 
                type="text" 
                v-model="expenseForm.description"
                required
                class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                placeholder="Ex: Carburant pour livraison co-op"
              />
            </div>
          </form>

          <!-- Actions -->
          <div class="p-6 border-t border-[var(--color-border)] bg-[var(--color-surface-hover)] flex justify-end space-x-3">
            <button 
              type="button" 
              @click="showExpensePopup = false"
              class="px-5 py-2.5 bg-[var(--color-surface-elevated)] hover:bg-[var(--color-background)] rounded-xl text-sm font-semibold text-[var(--color-text-primary)] border border-[var(--color-border)] transition"
            >
              Annuler
            </button>
            <button 
              type="submit"
              form="expense-form"
              class="px-5 py-2.5 bg-[var(--color-primary)] hover:opacity-90 text-white rounded-xl text-sm font-bold transition shadow-sm"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 2. EXPENSE DELETE CONFIRMATION -->
    <Transition name="modal-fade">
      <div v-if="expenseToDelete" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-[var(--color-surface-elevated)] border border-red-500/30 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden modal-content">
          <div class="text-center space-y-4">
            <div class="h-16 w-16 bg-red-500/10 text-red-500 rounded-full border border-red-500/20 flex items-center justify-center font-bold text-3xl mx-auto select-none">
              🚷
            </div>
            <h3 class="text-lg font-bold text-[var(--color-text-primary)]">Confirmer la suppression</h3>
            <p class="text-sm text-[var(--color-text-secondary)]">
              Êtes-vous sûr de vouloir supprimer définitivement le reçu <strong class="text-[var(--color-text-primary)]">{{ expenseToDelete.id }}</strong> ?
            </p>
          </div>

          <div class="mt-8 flex space-x-3">
            <button 
              @click="expenseToDelete = null"
              class="flex-1 py-2.5 bg-[var(--color-surface-hover)] hover:bg-[var(--color-background)] rounded-xl text-sm font-semibold text-[var(--color-text-primary)] border border-[var(--color-border)] transition"
            >
              Annuler
            </button>
            <button 
              @click="confirmDeleteExpense"
              class="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition shadow-sm"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </Transition>

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
      toast.success('Reçu de dépense mis à jour.');
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
    toast.success('Dépense opérationnelle enregistrée !');
  }
  showExpensePopup.value = false;
}

function triggerDeleteExpenseConfirmation(e) {
  expenseToDelete.value = e;
}

function confirmDeleteExpense() {
  if (expenseToDelete.value) {
    expenses.value = expenses.value.filter(s => s.id !== expenseToDelete.value.id);
    toast.info(`Le reçu ${expenseToDelete.value.id} a été supprimé.`);
    expenseToDelete.value = null;
  }
}
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
