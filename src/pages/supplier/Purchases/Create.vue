<template>
  <div class="space-y-6 max-w-5xl mx-auto">
    <!-- Header -->
    <div class="flex items-center space-x-3 mb-4">
      <router-link to="/supplier/purchases" class="p-2 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition">
        <ArrowLeftIcon class="h-5 w-5" />
      </router-link>
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Initialiser un Bon de Commande</h1>
        <p class="text-sm text-[var(--color-text-secondary)]">Demande d'approvisionnement (peut concerner plusieurs fournisseurs)</p>
      </div>
    </div>

    <!-- Main Form -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Left col: Items & Suppliers -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
          <h3 class="text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2 mb-4 flex items-center space-x-2">
            <ArchiveBoxIcon class="h-5 w-5 text-[var(--color-primary)]" />
            <span>Articles à commander</span>
          </h3>

          <div class="space-y-4">
            <div v-for="(item, index) in items" :key="index" class="p-4 border border-[var(--color-border)] bg-[var(--color-background)] rounded-xl relative group">
              <button 
                @click="removeItem(index)" 
                class="absolute -top-3 -right-3 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow hover:scale-110 transition opacity-0 group-hover:opacity-100"
              >
                <XMarkIcon class="h-4 w-4" />
              </button>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="sm:col-span-2">
                  <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Fournisseur ciblé *</label>
                  <select v-model="item.supplierId" class="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-sm px-4 py-2 rounded-lg text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none">
                    <option value="" disabled>Sélectionner un fournisseur</option>
                    <option v-for="sup in b2b_suppliers" :key="sup.id" :value="sup.id">
                      {{ sup.name }} ({{ sup.category }})
                    </option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Désignation du produit *</label>
                  <input v-model="item.name" type="text" placeholder="Ex: Sacs de Jute..." class="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-sm px-4 py-2 rounded-lg text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none" />
                </div>
                
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Quantité *</label>
                    <input v-model.number="item.qty" type="number" min="1" class="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-sm px-4 py-2 rounded-lg text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Prix U. (FCFA)</label>
                    <input v-model.number="item.unitPrice" type="number" min="0" class="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-sm px-4 py-2 rounded-lg text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none" />
                  </div>
                </div>
              </div>
            </div>

            <button 
              @click="addItem" 
              class="w-full py-3 border-2 border-dashed border-[var(--color-primary-muted)] text-[var(--color-primary)] rounded-xl text-sm font-semibold hover:bg-[var(--color-primary-muted)] transition flex items-center justify-center space-x-2"
            >
              <PlusIcon class="h-5 w-5" />
              <span>Ajouter une ligne de commande</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Right col: Summary & Confirm -->
      <div class="space-y-6">
        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
          <h3 class="text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2 mb-4 flex items-center space-x-2">
            <DocumentCheckIcon class="h-5 w-5 text-[var(--color-primary)]" />
            <span>Résumé de la commande</span>
          </h3>
          
          <div class="space-y-3 mb-6">
            <div class="flex justify-between text-sm">
              <span class="text-[var(--color-text-secondary)]">Fournisseurs impliqués</span>
              <span class="font-bold text-[var(--color-text-primary)]">{{ uniqueSuppliersCount }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-[var(--color-text-secondary)]">Total articles</span>
              <span class="font-bold text-[var(--color-text-primary)]">{{ items.length }}</span>
            </div>
            <div class="pt-3 border-t border-[var(--color-border)] flex justify-between items-center">
              <span class="font-bold text-[var(--color-text-primary)]">Montant Total</span>
              <span class="text-xl font-black text-[var(--color-primary)]">{{ formatMoney(totalAmount) }}</span>
            </div>
          </div>

          <div class="space-y-4">
            <div class="text-xs text-[var(--color-text-secondary)] bg-[var(--color-surface-hover)] p-3 rounded-lg border border-[var(--color-border)]">
              <strong>Info:</strong> Si vous impliquez plusieurs fournisseurs, le système générera virtuellement des bons de commande distincts pour chaque fournisseur.
            </div>
            
            <button 
              @click="submitOrder"
              :disabled="items.length === 0 || !isFormValid"
              class="w-full py-3 bg-[var(--color-primary)] text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-bold transition shadow-sm"
            >
              Générer et Envoyer
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { b2b_suppliers, purchases } from '@/utils/supplier_db';
import { useToast } from 'vue-toastification';
import { 
  ArrowLeftIcon, PlusIcon, XMarkIcon, 
  ArchiveBoxIcon, DocumentCheckIcon 
} from '@heroicons/vue/24/outline';

const router = useRouter();
const toast = useToast();

const items = ref([
  { supplierId: '', name: '', qty: 1, unitPrice: 0 }
]);

const uniqueSuppliersCount = computed(() => {
  const sups = new Set();
  items.value.forEach(i => {
    if (i.supplierId) sups.add(i.supplierId);
  });
  return sups.size;
});

const totalAmount = computed(() => {
  return items.value.reduce((acc, i) => acc + ((i.qty || 0) * (i.unitPrice || 0)), 0);
});

const isFormValid = computed(() => {
  return items.value.every(i => i.supplierId && i.name && i.qty > 0);
});

function addItem() {
  items.value.push({ supplierId: '', name: '', qty: 1, unitPrice: 0 });
}

function removeItem(idx) {
  items.value.splice(idx, 1);
}

function submitOrder() {
  if (!isFormValid.value) {
    toast.error('Veuillez remplir correctement toutes les lignes.');
    return;
  }
  
  const supplierIds = Array.from(new Set(items.value.map(i => i.supplierId)));
  
  const newPo = {
    id: `po_00${purchases.value.length + 1}`,
    supplierIds,
    date: new Date().toISOString().split('T')[0],
    items: JSON.parse(JSON.stringify(items.value)),
    amount: totalAmount.value,
    status: 'Sent'
  };
  
  purchases.value.push(newPo);
  toast.success('Le bon de commande a été généré et envoyé !');
  router.push('/supplier/purchases');
}

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('XAF', 'FCFA');
}
</script>
