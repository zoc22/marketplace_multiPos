<template>
  <div class="space-y-6">
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex items-center space-x-4 shadow-sm">
      <div class="p-3 bg-[var(--color-primary-muted)] rounded-xl">
        <QueueListIcon class="h-8 w-8 text-[var(--color-primary)]" />
      </div>
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">File d'attente FIFO et Demandes de stock</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Surveillez l'ordre d'écoulement (Premier Entré, Premier Sorti) et gérez vos lots d'inventaire.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
      
      <!-- DETAILED BATCHES LISTINGS -->
      <div class="lg:col-span-2 space-y-6">
        
        <div class="p-6 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl shadow-sm space-y-5">
          <h3 class="text-sm font-bold uppercase text-[var(--color-text-primary)] tracking-wider flex items-center space-x-2 border-b border-[var(--color-border)] pb-3">
            <CalendarDaysIcon class="h-5 w-5 text-[var(--color-primary)]" />
            <span>Grand Livre des Lots (Du plus ancien au plus récent)</span>
          </h3>
          
          <div class="space-y-5">
            <div 
              v-for="p in products" 
              :key="p.id"
              class="p-5 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-2xl space-y-4 transition hover:border-[var(--color-primary-border)]"
            >
              <div class="flex justify-between items-center pb-3 border-b border-[var(--color-border)]">
                <div>
                  <span class="text-base font-bold text-[var(--color-text-primary)]">{{ p.name }}</span>
                  <span class="text-xs font-semibold text-[var(--color-text-muted)] block mt-0.5">Référence (SKU) : {{ p.id }}</span>
                </div>
                <div class="text-right">
                  <span class="text-xs text-[var(--color-text-secondary)] font-medium">Stock Consolidé :</span>
                  <span class="text-sm font-bold text-[var(--color-primary)] block">{{ p.stock }} unités</span>
                </div>
              </div>

              <!-- Batches lines progression bars -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                  v-for="(b, idx) in p.batches || []" 
                  :key="b.id"
                  class="p-4 rounded-xl border flex flex-col justify-between space-y-3 select-none transition"
                  :class="idx === 0 && b.qty > 0 ? 'bg-[var(--color-primary-muted)] border-[var(--color-primary-border)]' : 'bg-[var(--color-surface-elevated)] border-[var(--color-border)]' "
                >
                  <div class="flex justify-between text-xs font-semibold">
                    <span :class="idx === 0 && b.qty > 0 ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-primary)]'">Lot #{{ b.id }}</span>
                    <span class="text-[var(--color-text-secondary)]">Date : {{ b.date }}</span>
                  </div>
                  
                  <div class="space-y-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-[var(--color-text-secondary)]">Disponible :</span>
                      <span class="font-bold text-[var(--color-text-primary)]">{{ b.qty }} / {{ b.initialQty || b.qty }} unités</span>
                    </div>

                    <!-- Progress microbar -->
                    <div class="w-full bg-[var(--color-background)] h-2 rounded-full overflow-hidden border border-[var(--color-border)]">
                      <div 
                        class="h-full rounded-full" 
                        :class="idx === 0 && b.qty > 0 ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-text-muted)]'"
                        :style="{ width: ((b.qty / (b.initialQty || b.qty)) * 100) + '%' }"
                      ></div>
                    </div>
                  </div>

                  <div class="flex justify-between text-xs text-[var(--color-text-muted)]">
                    <span>Coût d'entrée :</span>
                    <span class="font-medium">{{ formatCurrency(b.price) }} FCFA/u</span>
                  </div>
                </div>
              </div>

              <!-- Quick Intake Add Tool popup drawer -->
              <div class="pt-2 flex justify-end">
                <button 
                  @click="openAddBatchPopup(p)"
                  class="px-4 py-2 bg-[var(--color-surface-elevated)] hover:bg-[var(--color-primary-muted)] text-xs text-[var(--color-primary)] rounded-lg font-semibold border border-[var(--color-border)] transition flex items-center space-x-2 shadow-sm"
                >
                  <PlusIcon class="h-4 w-4" />
                  <span>Ajouter un lot entrant</span>
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>

      <!-- FIFO POLICY MANUAL DOCUMENT & CONTROLS -->
      <div class="space-y-6">
        
        <div class="p-6 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl shadow-sm space-y-4">
          <h3 class="text-sm font-bold uppercase text-[var(--color-text-primary)] tracking-wider flex items-center space-x-2 border-b border-[var(--color-border)] pb-3">
            <ClipboardDocumentIcon class="h-5 w-5 text-[var(--color-primary)]" />
            <span>Directives d'écoulement FIFO</span>
          </h3>
          <p class="text-sm text-[var(--color-text-secondary)] leading-relaxed font-sans">
            Conformément aux règles de gestion des stocks, le système applique strictement l'ordre d'écoulement Premier Entré, Premier Sorti (FIFO). Lorsqu'une commande est acceptée, notre routeur prélève automatiquement le stock sur le lot enregistré le plus ancien, protégeant ainsi votre inventaire contre le vieillissement.
          </p>
          <div class="p-5 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl text-sm space-y-3 select-none">
            <span class="text-xs uppercase text-[var(--color-primary)] font-bold block tracking-wider mb-2">Statut du pipeline actif :</span>
            <div class="flex justify-between font-semibold">
              <span class="text-[var(--color-text-secondary)]">Priorité de séquence :</span>
              <span class="text-[var(--color-text-primary)]">Dates les plus anciennes</span>
            </div>
            <div class="flex justify-between font-semibold">
              <span class="text-[var(--color-text-secondary)]">Maintien automatique :</span>
              <span class="text-emerald-500 uppercase">Désactivé</span>
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- POPUP: ADD INTENSE INTAKE BATCH -->
    <Transition name="modal-fade">
      <div v-if="showAddBatchPopup" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" @click.self="showAddBatchPopup = false">
        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative overflow-hidden text-[var(--color-text-primary)] modal-content">
          <div class="flex justify-between items-start border-b border-[var(--color-border)] pb-4 mb-6">
            <div>
              <span class="text-[10px] text-[var(--color-primary)] px-2 py-1 rounded bg-[var(--color-primary-muted)] font-bold uppercase tracking-wider">Stock FIFO</span>
              <h3 class="text-xl font-bold tracking-wide mt-2">Ajouter un Lot d'Inventaire</h3>
            </div>
            <button @click="showAddBatchPopup = false" class="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] p-1 rounded-md transition bg-[var(--color-surface-hover)]">&times;</button>
          </div>

          <form @submit.prevent="submitAddBatch" class="space-y-5 text-sm">
            <div>
              <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Produit ciblé</label>
              <div class="p-3 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] font-bold">
                {{ activeProductForBatch?.name }}
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Identifiant du Lot <span class="text-red-500">*</span></label>
                <input 
                  type="text" 
                  v-model="batchForm.id" 
                  required
                  class="w-full bg-[var(--color-background)] border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] rounded-lg transition"
                  placeholder="Ex: lot_03"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Date d'entrée <span class="text-red-500">*</span></label>
                <input 
                  type="date" 
                  v-model="batchForm.date" 
                  required
                  class="w-full bg-[var(--color-background)] border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] rounded-lg transition"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-xs font-semibold text-[var(--color-primary)] mb-1.5">Quantité (Unités) <span class="text-red-500">*</span></label>
                <input 
                  type="number" 
                  v-model="batchForm.qty" 
                  required
                  min="1"
                  class="w-full bg-[var(--color-background)] border border-[var(--color-primary-border)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] rounded-lg transition"
                  placeholder="Ex: 250"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Coût unitaire (FCFA) <span class="text-red-500">*</span></label>
                <input 
                  type="number" 
                  v-model="batchForm.price" 
                  required
                  min="100"
                  class="w-full bg-[var(--color-background)] border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] rounded-lg transition"
                  placeholder="Ex: 12500"
                />
              </div>
            </div>

            <div class="pt-5 border-t border-[var(--color-border)] flex justify-end space-x-3 mt-6">
              <button 
                type="button" 
                @click="showAddBatchPopup = false"
                class="px-5 py-2.5 bg-[var(--color-surface-hover)] hover:bg-[var(--color-border)] rounded-lg font-semibold text-[var(--color-text-primary)] transition"
              >
                Annuler
              </button>
              <button 
                type="submit"
                class="px-5 py-2.5 bg-[var(--color-primary)] hover:opacity-90 text-white font-semibold rounded-lg shadow-sm transition"
              >
                Sécuriser le dépôt du lot
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { products } from '@/utils/supplier_db';
import { useToast } from 'vue-toastification';
import { QueueListIcon, CalendarDaysIcon, ClipboardDocumentIcon, PlusIcon } from '@heroicons/vue/24/outline';

const toast = useToast();

const showAddBatchPopup = ref(false);
const activeProductForBatch = ref(null);

const batchForm = ref({
  id: '',
  date: new Date().toISOString().slice(0, 10),
  qty: '',
  price: ''
});

// ESC key listener
function handleEscKey(e) {
  if (e.key === 'Escape') {
    showAddBatchPopup.value = false;
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEscKey);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscKey);
});

function formatCurrency(val) {
  if (!val) return '0';
  return new Intl.NumberFormat('fr-FR').format(val);
}

function openAddBatchPopup(product) {
  activeProductForBatch.value = product;
  batchForm.value = {
    id: 'lot_' + ((product.batches || []).length + 3),
    date: new Date().toISOString().slice(0, 10),
    qty: 200,
    price: product.price * 0.88
  };
  showAddBatchPopup.value = true;
}

function submitAddBatch() {
  if (activeProductForBatch.value) {
    const qtyInt = parseInt(batchForm.value.qty);
    const newBatch = {
      id: batchForm.value.id,
      date: batchForm.value.date,
      qty: qtyInt,
      initialQty: qtyInt,
      price: parseFloat(batchForm.value.price)
    };

    if (!activeProductForBatch.value.batches) {
      activeProductForBatch.value.batches = [];
    }

    activeProductForBatch.value.batches.push(newBatch);
    // Recalculate consolidated stock
    activeProductForBatch.value.stock = activeProductForBatch.value.batches.reduce((acc, b) => acc + b.qty, 0);

    toast.success(`Le lot #${newBatch.id} a été enregistré avec succès pour ${activeProductForBatch.value.name}`);
  }
  showAddBatchPopup.value = false;
}
</script>

<style scoped>
/* Modal fade animation */
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

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.4s ease-out forwards;
}
</style>
