<template>
  <div class="space-y-6">
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Retours Clients</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Gérez les retours d'articles et les remboursements (Avoir / Espèces).</p>
      </div>
      <button @click="isSearchModalOpen = true" class="px-4 py-2 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-lg text-sm font-semibold transition flex items-center space-x-2">
        <ArrowUturnLeftIcon class="h-5 w-5" />
        <span>Nouveau Retour</span>
      </button>
    </div>

    <!-- Returns List -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
      <div class="p-4 border-b border-[var(--color-border)] flex flex-col sm:flex-row justify-between items-center gap-4 bg-[var(--color-surface-hover)]">
        <div class="relative w-full sm:w-96">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)]" />
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Rechercher par ID Retour ou ID Transaction..." 
            class="w-full pl-10 pr-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)]"
          />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[var(--color-surface-hover)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)]">
              <th class="p-4">ID Retour</th>
              <th class="p-4">ID Transaction</th>
              <th class="p-4">Date</th>
              <th class="p-4">Articles Retournés</th>
              <th class="p-4 text-right">Montant Remboursé</th>
              <th class="p-4 text-center">Type de Remboursement</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr v-for="ret in filteredReturns" :key="ret.id" class="hover:bg-[var(--color-surface-hover)] transition text-sm">
              <td class="p-4 font-bold text-[var(--color-primary)]">{{ ret.id }}</td>
              <td class="p-4 text-[var(--color-text-secondary)]">{{ ret.originalTxId }}</td>
              <td class="p-4 text-[var(--color-text-secondary)]">{{ new Date(ret.date).toLocaleDateString('fr-FR') }}</td>
              <td class="p-4 text-[var(--color-text-secondary)]">{{ Array.isArray(ret.itemsReturned) ? ret.itemsReturned.length : Array.isArray(ret.items) ? ret.items.length : 0 }} articles</td>
              <td class="p-4 text-right font-bold text-red-500">- {{ formatMoney(ret.refundAmount) }}</td>
              <td class="p-4 text-center">
                <span class="px-2.5 py-1 rounded-full text-xs font-bold border" :class="ret.refundType === 'Avoir' ? 'bg-purple-500/10 text-purple-600 border-purple-500/20' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'">
                  {{ ret.refundType }}
                </span>
              </td>
            </tr>
            <tr v-if="filteredReturns.length === 0">
              <td colspan="6" class="p-8 text-center text-[var(--color-text-muted)]">Aucun retour trouvé.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- NEW RETURN MODAL - SEARCH TX -->
    <div v-if="isSearchModalOpen" @click.self="isSearchModalOpen = false" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm cursor-pointer">
      <div class="bg-[var(--color-surface)] rounded-2xl shadow-2xl w-full max-w-lg p-6 border border-[var(--color-border)] relative cursor-default">
        <button @click="isSearchModalOpen = false" class="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-red-500"><XMarkIcon class="h-6 w-6"/></button>
        <h3 class="text-xl font-bold mb-4 text-[var(--color-text-primary)]">Rechercher la Transaction</h3>
        <p class="text-sm text-[var(--color-text-secondary)] mb-4">Saisissez l'ID de la transaction d'origine pour procéder au retour.</p>
        
        <div class="flex space-x-2">
          <input type="text" v-model="txSearchInput" placeholder="Ex: TX-169876543" class="flex-1 p-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-primary)]" />
          <button @click="searchTransaction" class="px-4 py-3 bg-[var(--color-primary)] text-white font-bold rounded-lg shadow hover:opacity-90 transition">Rechercher</button>
        </div>

        <div v-if="foundTransaction" class="mt-6 border-t border-[var(--color-border)] pt-4">
          <div class="p-4 bg-[var(--color-surface-hover)] rounded-xl border border-[var(--color-border)]">
            <div class="flex justify-between items-center mb-2">
              <span class="font-bold text-[var(--color-text-primary)]">{{ foundTransaction.id }}</span>
              <span class="text-xs text-[var(--color-text-secondary)]">{{ new Date(foundTransaction.date).toLocaleString('fr-FR') }}</span>
            </div>
            <div class="text-sm text-[var(--color-text-secondary)] mb-4">
              Total payé : <span class="font-bold text-[var(--color-primary)]">{{ formatMoney(foundTransaction.total) }}</span>
            </div>
            <button @click="proceedToReturn" class="w-full py-2 bg-emerald-500 text-white rounded-lg font-bold shadow hover:bg-emerald-600 transition">Procéder au retour</button>
          </div>
        </div>
      </div>
    </div>

    <!-- RETURN PROCESSING MODAL -->
    <div v-if="isProcessModalOpen" @click.self="isProcessModalOpen = false" class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm cursor-pointer">
      <div class="bg-[var(--color-surface)] rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-[var(--color-border)] flex flex-col max-h-[90vh] cursor-default">
        <div class="p-6 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-surface-elevated)]">
          <h3 class="text-xl font-bold text-[var(--color-text-primary)]">Retour sur Transaction {{ foundTransaction?.id }}</h3>
          <button @click="isProcessModalOpen = false" class="text-[var(--color-text-muted)] hover:text-red-500"><XMarkIcon class="h-6 w-6"/></button>
        </div>
        
        <div class="flex-1 p-6 overflow-y-auto bg-[var(--color-background)]">
          <p class="text-sm font-semibold mb-4 text-[var(--color-text-primary)]">Sélectionnez les articles à retourner :</p>
          
          <div class="space-y-3">
            <div v-for="(item, idx) in returnableItems" :key="idx" class="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl flex items-center justify-between">
              <div>
                <div class="font-bold text-sm text-[var(--color-text-primary)]">{{ item.product.name }}</div>
                <div class="text-xs text-[var(--color-text-secondary)]">Acheté : {{ item.originalQty }} | Prix unitaire (remisé) : {{ formatMoney(item.unitPrice) }}</div>
              </div>
              <div class="flex items-center space-x-4">
                <div class="flex flex-col items-center">
                  <span class="text-[10px] text-[var(--color-text-muted)] mb-1">Qté à retourner</span>
                  <div class="flex items-center border border-[var(--color-border)] rounded-lg overflow-hidden">
                    <button @click="item.returnQty > 0 ? item.returnQty-- : 0" class="px-2 py-1 bg-[var(--color-surface-hover)] hover:bg-[var(--color-border)] transition"><MinusIcon class="h-3 w-3"/></button>
                    <span class="px-3 text-sm font-bold w-10 text-center">{{ item.returnQty }}</span>
                    <button @click="item.returnQty < item.originalQty ? item.returnQty++ : item.originalQty" class="px-2 py-1 bg-[var(--color-surface-hover)] hover:bg-[var(--color-border)] transition"><PlusIcon class="h-3 w-3"/></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6 bg-[var(--color-surface-elevated)] border-t border-[var(--color-border)]">
          <div class="flex justify-between items-center mb-6">
            <span class="text-lg font-bold text-[var(--color-text-secondary)]">Montant à Rembourser</span>
            <span class="text-2xl font-black text-red-500">{{ formatMoney(totalRefund) }}</span>
          </div>
          
          <div class="flex space-x-4">
            <button @click="confirmReturn('Espèces')" :disabled="totalRefund <= 0" class="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition disabled:opacity-50">
              Rembourser en Espèces
            </button>
            <button @click="confirmReturn('Avoir')" :disabled="totalRefund <= 0" class="flex-1 py-3 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600 transition disabled:opacity-50">
              Générer Bon d'Avoir
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { returns, transactions, vendor_products } from '@/utils/vendor_db.js';
import { ArrowUturnLeftIcon, MagnifyingGlassIcon, XMarkIcon, PlusIcon, MinusIcon } from '@heroicons/vue/24/outline';
import { useToast } from 'vue-toastification';

const toast = useToast();

const searchQuery = ref('');

const filteredReturns = computed(() => {
  return returns.value.filter(r => r.id.toLowerCase().includes(searchQuery.value.toLowerCase()) || r.originalTxId.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const isSearchModalOpen = ref(false);
const txSearchInput = ref('');
const foundTransaction = ref(null);

function searchTransaction() {
  const tx = transactions.value.find(t => t.id === txSearchInput.value);
  if (tx) {
    foundTransaction.value = tx;
  } else {
    toast.error('Transaction introuvable.');
    foundTransaction.value = null;
  }
}

const isProcessModalOpen = ref(false);
const returnableItems = ref([]);

function proceedToReturn() {
  if (!foundTransaction.value) return;
  
  // Calculate effective unit price including any item discount and global discount proportion
  const globalDiscountPercent = foundTransaction.value.subtotal > 0 ? (foundTransaction.value.discount / foundTransaction.value.subtotal) : 0;
  
  returnableItems.value = foundTransaction.value.items.map(item => {
    // 1. Item level discount
    let effectivePrice = item.product.price * (1 - (item.discountPercent / 100));
    // 2. Global discount proportion
    effectivePrice = effectivePrice * (1 - globalDiscountPercent);
    // 3. Tax addition (if needed)
    // Here we just keep it simple and use proportional value for refund
    const taxRate = foundTransaction.value.tax / (foundTransaction.value.subtotal - foundTransaction.value.discount);
    effectivePrice = effectivePrice * (1 + taxRate);

    return {
      product: item.product,
      originalQty: item.quantity,
      returnQty: 0,
      unitPrice: effectivePrice
    };
  });

  isSearchModalOpen.value = false;
  isProcessModalOpen.value = true;
}

const totalRefund = computed(() => {
  return returnableItems.value.reduce((sum, item) => sum + (item.returnQty * item.unitPrice), 0);
});

function confirmReturn(type) {
  if (totalRefund.value <= 0) return;

  const itemsReturned = returnableItems.value.filter(i => i.returnQty > 0);
  
  const newReturn = {
    id: 'RET-' + Date.now(),
    originalTxId: foundTransaction.value.id,
    date: new Date().toISOString(),
    itemsReturned: itemsReturned.map(i => ({ productId: i.product.id, quantity: i.returnQty, name: i.product.name })),
    refundAmount: totalRefund.value,
    refundType: type
  };

  returns.value.unshift(newReturn);

  // Restore Stock
  itemsReturned.forEach(i => {
    const prod = vendor_products.value.find(p => p.id === i.product.id);
    if (prod) prod.stock += i.returnQty;
  });

  toast.success(`Retour validé. Remboursement : ${type}. Stock restauré.`);
  isProcessModalOpen.value = false;
  txSearchInput.value = '';
  foundTransaction.value = null;
}

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('XAF', 'FCFA');
}
</script>
