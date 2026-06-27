<template>
  <div class="space-y-6">
    
    <!-- Header -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
          <CircleStackIcon class="h-6 w-6 text-[var(--color-primary)]" />
          <span>Gestion du Catalogue Produits</span>
        </h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Configurez vos articles, les lots initiaux et les prix de gros.</p>
      </div>

      <button 
        @click="openCreateProductPopup"
        class="px-5 py-2.5 bg-[var(--color-primary)] hover:opacity-90 text-white font-semibold text-sm rounded-xl shadow-md transition flex items-center space-x-2 shrink-0"
      >
        <PlusIcon class="h-5 w-5 text-white" />
        <span>Nouveau Produit</span>
      </button>
    </div>

    <!-- FILTERS AND SEARCH HUD -->
    <div class="p-5 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-5 animate-fade-in-up">
      <div>
        <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Rechercher</label>
        <div class="relative">
          <input 
            type="text" 
            v-model="searchTerm"
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
            placeholder="Ex: NPK, Solaire, Cacao..."
          />
          <MagnifyingGlassIcon class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)]" />
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Catégorie</label>
        <select 
          v-model="selectedSector"
          class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
        >
          <option value="ALL">Toutes les catégories</option>
          <option value="Agriculture Intrants">Agriculture Intrants</option>
          <option value="Alimentation Féculents">Alimentation Féculents</option>
          <option value="Énergies & Solaire">Énergies & Solaire</option>
          <option value="Textiles Traditionnels">Textiles Traditionnels</option>
        </select>
      </div>

      <div class="flex items-end justify-between sm:justify-start">
        <div class="text-sm text-[var(--color-text-secondary)] font-medium bg-[var(--color-surface-elevated)] border border-[var(--color-border)] px-4 py-2.5 rounded-lg w-full flex justify-between items-center">
          <span>Articles trouvés :</span>
          <span class="text-[var(--color-text-primary)] font-bold">{{ filteredProducts.length }}</span>
        </div>
      </div>
    </div>

    <!-- PRODUCTS TABLE GRID -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm animate-fade-in-up">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm border-collapse select-none">
          <thead>
            <tr class="bg-[var(--color-surface-hover)] border-b border-[var(--color-border)] text-[var(--color-text-secondary)] font-semibold uppercase tracking-wider text-xs">
              <th class="p-4">Référence (SKU)</th>
              <th class="p-4">Nom produit</th>
              <th class="p-4">Catégorie</th>
              <th class="p-4">Prix de base</th>
              <th class="p-4 text-center">En Stock</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr 
              v-for="(p, idx) in paginatedProducts" 
              :key="p.id"
              class="hover:bg-[var(--color-surface-hover)] transition text-[var(--color-text-primary)] cursor-pointer"
              @click="openProductDetail(p)"
            >
              <!-- Code -->
              <td class="p-4 font-mono font-bold text-[var(--color-primary)]">
                {{ p.id || 'p_inconnu' }}
              </td>
              
              <!-- Name only -->
              <td class="p-4 font-bold text-[var(--color-text-primary)]">
                {{ p.name }}
              </td>

              <!-- Category -->
              <td class="p-4 text-[var(--color-text-secondary)]">
                {{ p.category || 'Ingrédients bruts' }}
              </td>
              
              <!-- Pricing -->
              <td class="p-4 font-bold text-white">
                {{ formatCurrency(p.price) }} FCFA / U
              </td>

              <!-- Stock total -->
              <td class="p-4 text-center font-semibold">
                <span 
                  class="text-xs px-3 py-1 rounded-full border"
                  :class="p.stock <= 50 ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'"
                >
                  {{ p.stock }} U
                </span>
              </td>

              <!-- Actions -->
              <td class="p-4 text-right" @click.stop>
                <div class="inline-flex items-center gap-2 justify-end">
                  <button 
                    @click="openEditProductPopup(p)"
                    class="p-2 bg-[var(--color-surface-hover)] text-[var(--color-primary)] hover:bg-[var(--color-primary-muted)] rounded-lg text-xs font-semibold border border-[var(--color-border)] flex items-center transition"
                    title="Modifier"
                  >
                    <PencilIcon class="h-4 w-4" />
                  </button>
                  <button 
                    @click="triggerDeleteConfirmation(p)"
                    class="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-xs font-semibold border border-red-500/20 transition flex items-center"
                    title="Supprimer"
                  >
                    <TrashIcon class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredProducts.length === 0">
              <td colspan="6" class="p-8 text-center text-[var(--color-text-muted)] text-sm">Aucun produit ne correspond à vos critères.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Real pagination with matched count -->
      <div v-if="totalPages > 1" class="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface-hover)] flex justify-between items-center text-sm">
        <span class="text-[var(--color-text-secondary)] font-medium">Page {{ currentPage }} sur {{ totalPages }}</span>
        <div class="flex space-x-2">
          <button 
            @click="currentPage > 1 ? currentPage-- : null"
            :disabled="currentPage === 1"
            class="px-4 py-2 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg disabled:opacity-50 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition font-medium"
          >
            Précédent
          </button>
          <button 
            @click="currentPage < totalPages ? currentPage++ : null"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg disabled:opacity-50 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition font-medium"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>

    <!-- POPUP MODALS -->
    <!-- 0. PRODUCT DETAIL MODAL -->
    <Transition name="modal-fade">
      <div v-if="showDetailPopup && selectedProduct" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" @click.self="showDetailPopup = false">
        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 md:p-8 w-full max-w-2xl shadow-2xl relative overflow-hidden text-[var(--color-text-primary)] modal-content">
          <div class="flex justify-between items-start border-b border-[var(--color-border)] pb-4 mb-6">
            <div>
              <span class="text-[10px] text-[var(--color-primary)] px-2 py-1 rounded bg-[var(--color-primary-muted)] font-bold uppercase tracking-wider">Détails du Produit</span>
              <h3 class="text-xl font-bold tracking-wide mt-2">
                {{ selectedProduct.name }}
              </h3>
            </div>
            <button @click="showDetailPopup = false" class="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] p-1 rounded-md transition bg-[var(--color-surface-hover)]">
              &times;
            </button>
          </div>

          <div class="space-y-6">
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-[var(--color-surface-hover)] p-4 rounded-xl border border-[var(--color-border)]">
                <span class="text-xs text-[var(--color-text-secondary)] block mb-1">Catégorie</span>
                <span class="font-bold text-[var(--color-text-primary)]">{{ selectedProduct.category || 'N/A' }}</span>
              </div>
              <div class="bg-[var(--color-surface-hover)] p-4 rounded-xl border border-[var(--color-border)]">
                <span class="text-xs text-[var(--color-text-secondary)] block mb-1">Prix unitaire</span>
                <span class="font-bold text-white">{{ formatCurrency(selectedProduct.price) }} FCFA / U</span>
              </div>
              <div class="bg-[var(--color-surface-hover)] p-4 rounded-xl border border-[var(--color-border)]">
                <span class="text-xs text-[var(--color-text-secondary)] block mb-1">Stock Total</span>
                <span class="font-bold text-emerald-500">{{ selectedProduct.stock }} U</span>
              </div>
              <div class="bg-[var(--color-surface-hover)] p-4 rounded-xl border border-[var(--color-border)]">
                <span class="text-xs text-[var(--color-text-secondary)] block mb-1">Référence</span>
                <span class="font-bold font-mono text-[var(--color-primary)]">{{ selectedProduct.id }}</span>
              </div>
            </div>

            <div>
              <h4 class="text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2 mb-4">Historique des Lots (FIFO)</h4>
              <div class="space-y-2 max-h-48 overflow-y-auto pr-2">
                <div 
                  v-for="(b, bIdx) in selectedProduct.batches || []" 
                  :key="bIdx"
                  class="bg-[var(--color-background)] border border-[var(--color-border)] p-3 rounded-xl flex justify-between items-center"
                >
                  <div class="flex flex-col">
                    <span class="text-xs font-bold text-[var(--color-text-primary)]">Lot-{{ b.id }}</span>
                    <span class="text-[10px] text-[var(--color-text-secondary)] mt-0.5">Entré le {{ b.date }}</span>
                  </div>
                  <span class="font-bold text-[var(--color-primary)] text-sm">{{ b.qty }} U</span>
                </div>
                <div v-if="!(selectedProduct.batches && selectedProduct.batches.length)" class="text-[var(--color-text-muted)] italic text-sm text-center py-4">
                  Aucun lot disponible
                </div>
              </div>
            </div>
          </div>

          <div class="pt-5 border-t border-[var(--color-border)] flex justify-end mt-6">
            <button 
              @click="showDetailPopup = false"
              class="px-5 py-2.5 bg-[var(--color-surface-hover)] hover:bg-[var(--color-border)] rounded-lg text-sm font-semibold transition text-[var(--color-text-primary)]"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 1. CREATE / EDIT PRODUCT POPUP MODAL -->
    <Transition name="modal-fade">
      <div v-if="showProductPopup" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" @click.self="showProductPopup = false">
        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 md:p-8 w-full max-w-2xl shadow-2xl relative overflow-hidden text-[var(--color-text-primary)] modal-content">
          <div class="flex justify-between items-start border-b border-[var(--color-border)] pb-4 mb-6">
            <div>
              <span class="text-[10px] text-[var(--color-primary)] px-2 py-1 rounded bg-[var(--color-primary-muted)] font-bold uppercase tracking-wider">Catalogue</span>
              <h3 class="text-xl font-bold tracking-wide mt-2">
                {{ isEditing ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit' }}
              </h3>
            </div>
            <button @click="showProductPopup = false" class="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] p-1 rounded-md transition bg-[var(--color-surface-hover)]">
              &times;
            </button>
          </div>

          <form @submit.prevent="saveProduct" class="space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="md:col-span-2">
                <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Nom du produit <span class="text-red-500">*</span></label>
                <input 
                  type="text" 
                  v-model="productForm.name"
                  required
                  class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                  placeholder="Ex: Engrais Granulé Complet 50kg"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Prix de base (FCFA) <span class="text-red-500">*</span></label>
                <input 
                  type="number" 
                  v-model="productForm.price"
                  required
                  min="100"
                  class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                  placeholder="Ex: 14000"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Catégorie <span class="text-red-500">*</span></label>
                <select 
                  v-model="productForm.category"
                  required
                  class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                >
                  <option value="Agriculture Intrants">Agriculture Intrants</option>
                  <option value="Énergies & Solaire">Énergies &amp; Solaire</option>
                  <option value="Alimentation Féculents">Alimentation Féculents</option>
                  <option value="Textiles Traditionnels">Textiles Traditionnels</option>
                </select>
              </div>

              <div v-if="!isEditing">
                <label class="block text-xs font-semibold text-[var(--color-primary)] mb-1.5">Stock Initial (Lot) <span class="text-red-500">*</span></label>
                <input 
                  type="number" 
                  v-model="productForm.startingStock"
                  required
                  min="1"
                  class="w-full bg-[var(--color-background)] border border-[var(--color-primary-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                  placeholder="Ex: 500"
                />
              </div>

              <div v-if="!isEditing">
                <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Date d'entrée du Lot <span class="text-red-500">*</span></label>
                <input 
                  type="date" 
                  v-model="productForm.batchDate"
                  required
                  class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                />
              </div>
            </div>

            <!-- Exec buttons -->
            <div class="pt-5 border-t border-[var(--color-border)] flex justify-end space-x-3 mt-6">
              <button 
                type="button" 
                @click="showProductPopup = false"
                class="px-5 py-2.5 bg-[var(--color-surface-hover)] hover:bg-[var(--color-border)] rounded-lg text-sm font-semibold transition text-[var(--color-text-primary)]"
              >
                Annuler
              </button>
              <button 
                type="submit"
                class="px-5 py-2.5 bg-[var(--color-primary)] hover:opacity-90 text-white rounded-lg text-sm font-semibold transition shadow-sm"
              >
                {{ isEditing ? 'Enregistrer les modifications' : 'Créer le produit' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- 2. SYSTEMIC CRITICAL DELETION CONFIRMATION DIALOG MODAL -->
    <Transition name="modal-fade">
      <div v-if="productToDelete" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" @click.self="productToDelete = null">
        <div class="bg-[var(--color-surface-elevated)] border border-red-500/50 rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl relative overflow-hidden text-[var(--color-text-primary)] modal-content">
          <div class="text-center space-y-4">
            <div class="h-16 w-16 bg-red-500/10 text-red-500 rounded-full border border-red-500/30 flex items-center justify-center mx-auto">
              <TrashIcon class="h-8 w-8" />
            </div>
            <h3 class="text-lg font-bold text-[var(--color-text-primary)]">Confirmer la suppression</h3>
            <p class="text-sm text-[var(--color-text-secondary)]">
              Êtes-vous absolument sûr de vouloir supprimer <strong class="text-[var(--color-text-primary)]">{{ productToDelete.name }}</strong> de votre catalogue ? Tous les historiques de lots seront effacés.
            </p>
          </div>

          <div class="mt-6 p-4 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-[var(--color-text-muted)] font-medium">Catégorie :</span>
              <span class="font-bold text-[var(--color-text-primary)]">{{ productToDelete.category || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-[var(--color-text-muted)] font-medium">Stock restant :</span>
              <span class="font-bold text-[var(--color-primary)]">{{ productToDelete.stock }} unités</span>
            </div>
          </div>

          <div class="mt-8 flex space-x-4">
            <button 
              @click="productToDelete = null"
              class="flex-1 py-3 bg-[var(--color-surface-hover)] hover:bg-[var(--color-border)] rounded-xl text-sm font-semibold text-[var(--color-text-primary)] transition"
            >
              Annuler
            </button>
            <button 
              @click="confirmDeleteProduct"
              class="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition shadow-sm"
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { products } from '@/utils/supplier_db';
import { useToast } from 'vue-toastification';
import { 
  CircleStackIcon, 
  PlusIcon, 
  MagnifyingGlassIcon, 
  PencilIcon, 
  TrashIcon 
} from '@heroicons/vue/24/outline';

const toast = useToast();

const searchTerm = ref('');
const selectedSector = ref('ALL');

const showProductPopup = ref(false);
const showDetailPopup = ref(false);
const isEditing = ref(false);
const targetProductId = ref(null);
const productToDelete = ref(null);
const selectedProduct = ref(null);

const currentPage = ref(1);
const itemsPerPage = 8;

const productForm = ref({
  name: '',
  price: '',
  category: 'Agriculture Intrants',
  startingStock: '',
  batchDate: new Date().toISOString().slice(0, 10),
});

// ESC key listener for modals
function handleEscKey(e) {
  if (e.key === 'Escape') {
    showProductPopup.value = false;
    showDetailPopup.value = false;
    productToDelete.value = null;
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEscKey);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscKey);
});

// Dynamic filtering
const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const searchString = searchTerm.value.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(searchString) || (p.id || '').toLowerCase().includes(searchString);
    
    if (selectedSector.value === 'ALL') return matchesSearch;
    
    let domainLabel = p.category || '';
    const matchesSector = domainLabel.toLowerCase().includes(selectedSector.value.toLowerCase());
    return matchesSearch && matchesSector;
  });
});

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage) || 1;
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredProducts.value.slice(start, start + itemsPerPage);
});

function formatCurrency(val) {
  if (!val) return '0';
  return new Intl.NumberFormat('fr-FR').format(val);
}

function openProductDetail(p) {
  selectedProduct.value = p;
  showDetailPopup.value = true;
}

function openCreateProductPopup() {
  isEditing.value = false;
  productForm.value = {
    name: '',
    price: '',
    category: 'Agriculture Intrants',
    startingStock: 100,
    batchDate: new Date().toISOString().slice(0, 10),
  };
  showProductPopup.value = true;
}

function openEditProductPopup(p) {
  isEditing.value = true;
  targetProductId.value = p.id;
  productForm.value = {
    name: p.name,
    price: p.price,
    category: p.category || 'Agriculture Intrants',
    startingStock: p.stock,
    batchDate: p.batches?.[0]?.date || new Date().toISOString().slice(0, 10),
  };
  showProductPopup.value = true;
}

function saveProduct() {
  if (isEditing.value) {
    const existing = products.value.find(p => p.id === targetProductId.value);
    if (existing) {
      existing.name = productForm.value.name;
      existing.price = parseFloat(productForm.value.price);
      existing.category = productForm.value.category;
      toast.success('Produit mis à jour avec succès.');
    }
  } else {
    const newId = 'p_' + (products.value.length + 101);
    const stockVal = parseInt(productForm.value.startingStock);
    
    const newProduct = {
      id: newId,
      name: productForm.value.name,
      price: parseFloat(productForm.value.price),
      category: productForm.value.category,
      stock: stockVal,
      batches: [
        {
          id: 'b_init',
          date: productForm.value.batchDate,
          qty: stockVal,
          initialQty: stockVal,
          price: parseFloat(productForm.value.price) * 0.90
        }
      ]
    };

    products.value.push(newProduct);
    toast.success('Nouveau produit et lot enregistrés avec succès.');
  }
  showProductPopup.value = false;
}

function triggerDeleteConfirmation(product) {
  productToDelete.value = product;
}

function confirmDeleteProduct() {
  if (productToDelete.value) {
    products.value = products.value.filter(p => p.id !== productToDelete.value.id);
    toast.info(`Le produit ${productToDelete.value.name} a été supprimé.`);
    productToDelete.value = null;
    
    // Adjust pagination if needed
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value || 1;
    }
  }
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
