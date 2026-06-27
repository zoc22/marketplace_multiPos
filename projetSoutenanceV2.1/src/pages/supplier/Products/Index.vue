<template>
  <div class="space-y-6">
    
    <!-- Header -->
    <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div>
        <h1 class="text-xl font-bold text-slate-100">B2B Products &amp; Catalog Management</h1>
        <p class="text-xs text-slate-400 mt-1">Configure your B2B supply items, initial batch configurations, and custom prices.</p>
      </div>

      <button 
        @click="openCreateProductPopup"
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold rounded-xl shadow-lg transition uppercase shrink-0"
      >
        + Register New Product (Popup)
      </button>
    </div>

    <!-- FILTERS AND SEARCH HUD -->
    <div class="p-4 bg-[#090e24] border border-slate-800 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-[10px] uppercase font-mono text-slate-500 mb-1">Search Catalog</label>
        <input 
          type="text" 
          v-model="searchTerm"
          class="w-full bg-slate-950 border border-slate-800 text-xs px-3 py-2 rounded-lg text-slate-350 focus:outline-none focus:border-indigo-500"
          placeholder="Ex: NPK, Solaire, Cacao..."
        />
      </div>

      <div>
        <label class="block text-[10px] uppercase font-mono text-slate-500 mb-1">Filter Sector</label>
        <select 
          v-model="selectedSector"
          class="w-full bg-slate-950 border border-slate-800 text-xs px-2.5 py-2 rounded-lg text-slate-330 focus:outline-none"
        >
          <option value="ALL">All Segments</option>
          <option value="Agriculture">Agriculture</option>
          <option value="Alimentation">Alimentation Générale</option>
          <option value="Energie">Énergies &amp; Solaire</option>
          <option value="Textile">Textiles &amp; Arts</option>
        </select>
      </div>

      <div class="flex items-end">
        <div class="text-[10px] text-slate-500 font-mono">
          Matching items: <span class="text-slate-200 font-bold font-sans">{{ filteredProducts.length }} SKUs</span>
        </div>
      </div>
    </div>

    <!-- PRODUCTS TABLE GRID -->
    <div class="bg-[#080d22] border border-slate-900 rounded-xl overflow-hidden shadow-xl">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse select-none">
          <thead>
            <tr class="bg-indigo-950/20 border-b border-indigo-950 text-[#5d6a94] font-mono uppercase tracking-wider text-[10px]">
              <th class="p-4">SKU Code</th>
              <th class="p-4">Product details</th>
              <th class="p-4">Core pricing</th>
              <th class="p-4 text-center">In-Stock (Total)</th>
              <th class="p-4">FIFO Batches Sequence</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-900">
            <tr 
              v-for="p in filteredProducts" 
              :key="p.id"
              class="hover:bg-slate-900/40 transition text-slate-300"
            >
              <!-- Code -->
              <td class="p-4 font-mono font-bold text-indigo-400">
                {{ p.id || 'p_unknown' }}
              </td>
              
              <!-- Img + Info -->
              <td class="p-4">
                <div class="flex items-center space-x-3">
                  <div class="h-10 w-10 rounded-lg bg-indigo-950/40 border border-indigo-900/30 flex items-center justify-center font-bold text-lg overflow-hidden shrink-0">
                    <img v-if="p.image" :src="p.image" :alt="p.name" class="h-full w-full object-cover" />
                    <span v-else>🌾</span>
                  </div>
                  <div>
                    <span class="font-bold text-slate-200 block">{{ p.name }}</span>
                    <span class="text-[10px] text-slate-500 block">Category: {{ p.category || 'Raw ingredients' }}</span>
                  </div>
                </div>
              </td>
              
              <!-- Pricing -->
              <td class="p-4 font-mono font-bold text-slate-100">
                {{ formatCurrency(p.price) }} FCFA
              </td>

              <!-- Stock total -->
              <td class="p-4 text-center font-semibold">
                <span 
                  class="font-mono text-xs px-2 py-0.5 rounded-lg"
                  :class="p.stock <= 50 ? 'bg-red-950 text-red-400 border border-red-900/30' : 'bg-slate-950 text-emerald-400'"
                >
                  {{ p.stock }} units
                </span>
              </td>

              <!-- Batches -->
              <td class="p-4 space-y-1">
                <div class="flex flex-col gap-0.5 text-[8.5px] font-mono">
                  <div 
                    v-for="(b, idx) in p.batches || []" 
                    :key="idx"
                    class="bg-slate-950 px-1.5 py-0.5 rounded text-indigo-300 flex justify-between"
                  >
                    <span>b-{{ b.id }} ({{ b.date }}):</span>
                    <span class="font-bold text-slate-400">{{ b.qty }} u</span>
                  </div>
                  <span v-if="!(p.batches && p.batches.length)" class="text-slate-550 italic">No batches created</span>
                </div>
              </td>

              <!-- Actions -->
              <td class="p-4 text-right">
                <div class="inline-flex items-center gap-2">
                  <button 
                    @click="openEditProductPopup(p)"
                    class="p-1 px-2.5 bg-slate-900 text-slate-350 hover:bg-slate-800 hover:text-white rounded text-[10px] font-mono border border-slate-800"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    @click="triggerDeleteConfirmation(p)"
                    class="p-1 px-2.5 bg-red-950/30 text-red-450 hover:bg-red-900 hover:text-slate-950 rounded text-[10px] font-mono border border-red-900/30 font-bold"
                  >
                    🗑️ Del
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredProducts.length === 0">
              <td colspan="6" class="p-8 text-center text-slate-500 font-mono">No products matched current filters.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- POPUP MODALS -->
    <!-- 1. CREATE / EDIT PRODUCT POPUP MODAL -->
    <div v-if="showProductPopup" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-[#0b1029] border border-indigo-900/90 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative overflow-hidden animate-fade-in text-slate-100">
        <div class="flex justify-between items-start border-b border-indigo-950 pb-3 mb-4">
          <div>
            <span class="text-[9px] font-mono text-indigo-400 px-1.5 py-0.5 rounded bg-indigo-950 font-bold uppercase">B2B CATALOG ARCHITECTURE</span>
            <h3 class="text-lg font-bold font-mono tracking-wide mt-1">
              {{ isEditing ? 'MODIFY REGISTERED SKU' : 'REGISTER NEW B2B SALES SKU' }}
            </h3>
          </div>
          <button @click="showProductPopup = false" class="text-slate-400 hover:text-white font-bold font-mono">&times; CLOSE</button>
        </div>

        <form @submit.prevent="saveProduct" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="block text-[9.5px] uppercase font-mono text-slate-400 mb-1 font-bold">Product Name *</label>
              <input 
                type="text" 
                v-model="productForm.name"
                required
                class="w-full bg-slate-950 border border-slate-900 text-xs px-3 py-2 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                placeholder="Ex: Engrais Granulé Complet 50kg"
              />
            </div>

            <div>
              <label class="block text-[9.5px] uppercase font-mono text-slate-400 mb-1">Standard B2B Price (FCFA) *</label>
              <input 
                type="number" 
                v-model="productForm.price"
                required
                min="100"
                class="w-full bg-slate-950 border border-slate-900 text-xs px-3 py-2 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                placeholder="Ex: 14000"
              />
            </div>

            <div>
              <label class="block text-[9.5px] uppercase font-mono text-slate-400 mb-1">Taxon Category Segment *</label>
              <select 
                v-model="productForm.category"
                required
                class="w-full bg-slate-950 border border-slate-900 text-xs px-2.5 py-2 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Agriculture Intrants">Agriculture Intrants</option>
                <option value="Énergies & Solaire">Énergies &amp; Solaire</option>
                <option value="Alimentation Féculents">Alimentation Féculents</option>
                <option value="Textiles Traditionnels">Textiles Traditionnels</option>
              </select>
            </div>

            <div v-if="!isEditing">
              <label class="block text-[9.5px] uppercase font-mono text-indigo-400 mb-1 font-bold">Initial Batch Stock Quantity *</label>
              <input 
                type="number" 
                v-model="productForm.startingStock"
                required
                min="1"
                class="w-full bg-slate-950 border border-indigo-900 text-xs px-3 py-2 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                placeholder="Ex: 500"
              />
            </div>

            <div v-if="!isEditing">
              <label class="block text-[9.5px] uppercase font-mono text-slate-400 mb-1">Initial Batch Intake Date *</label>
              <input 
                type="date" 
                v-model="productForm.batchDate"
                required
                class="w-full bg-slate-950 border border-slate-900 text-xs px-3 py-2 rounded-lg text-indigo-400 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label class="block text-[9.5px] uppercase font-mono text-slate-400 mb-1">Product Visual Image URL (Optional)</label>
            <input 
              type="url" 
              v-model="productForm.image"
              class="w-full bg-slate-950 border border-slate-900 text-xs px-3 py-2 rounded-lg text-slate-400 focus:outline-none focus:border-indigo-500"
              placeholder="https://images.unsplash.com/photo-..."
            />
          </div>

          <!-- Exec buttons -->
          <div class="pt-4 border-t border-indigo-950 flex justify-end space-x-3">
            <button 
              type="button" 
              @click="showProductPopup = false"
              class="px-4 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-xs font-mono font-bold transition text-slate-400"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-mono font-bold transition uppercase"
            >
              {{ isEditing ? 'Overwrite Product details' : 'Deploy Product & Batch FIFO' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 2. SYSTEMIC CRITICAL DELETION CONFIRMATION DIALOG MODAL -->
    <div v-if="productToDelete" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-red-950/80 border-2 border-red-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden animate-fade-in text-slate-100 backdrop-blur">
        <div class="text-center space-y-3">
          <div class="h-12 w-12 bg-red-500/10 text-red-500 rounded-full border border-red-500/30 flex items-center justify-center font-bold text-2xl mx-auto select-none">
            🚷
          </div>
          <h3 class="text-base font-mono font-bold uppercase tracking-wider text-red-450">AUTHENTICATE DELETION PROTOCOL</h3>
          <p class="text-xs text-slate-400 max-w-sm mx-auto">
            Are you absolutely sure you want to remove <strong class="text-slate-100 font-semibold">{{ productToDelete.name }}</strong> from your B2B supply directory? This will wipe all historic batch allocation queue logs.
          </p>
        </div>

        <div class="mt-4 p-3 bg-slate-950/60 border border-red-900/30 rounded-xl space-y-1 text-xs select-none">
          <div class="flex justify-between font-mono text-[10.5px]">
            <span class="text-slate-500">Target Segment:</span>
            <span class="font-bold text-slate-350">{{ productToDelete.category }}</span>
          </div>
          <div class="flex justify-between font-mono text-[10.5px]">
            <span class="text-slate-500">Unsold Balance:</span>
            <span class="font-bold text-slate-350">{{ productToDelete.stock }} units</span>
          </div>
        </div>

        <div class="mt-6 flex space-x-3">
          <button 
            @click="productToDelete = null"
            class="flex-1 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-xs font-mono font-bold text-slate-400 text-center transition"
          >
            Cancel
          </button>
          <button 
            @click="confirmDeleteProduct"
            class="flex-1 py-2 bg-red-800 hover:bg-red-750 text-white rounded-xl text-xs font-mono font-bold text-center transition uppercase"
          >
            CONFIRM WIPE 🗑️
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { products } from '@/utils/supplier_db';
import { useToast } from 'vue-toastification';

const toast = useToast();

const searchTerm = ref('');
const selectedSector = ref('ALL');

const showProductPopup = ref(false);
const isEditing = ref(false);
const targetProductId = ref(null);
const productToDelete = ref(null);

const productForm = ref({
  name: '',
  price: '',
  category: 'Agriculture Intrants',
  startingStock: '',
  batchDate: new Date().toISOString().slice(0, 10),
  image: ''
});

// Dynamic filtering
const filteredProducts = computed(() => {
  return products.value.filter(p => {
    // search text filter
    const searchString = searchTerm.value.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(searchString) || (p.id || '').toLowerCase().includes(searchString);
    
    // sector dropdown selection mapping
    if (selectedSector.value === 'ALL') return matchesSearch;
    
    let domainLabel = p.category || '';
    const matchesSector = domainLabel.toLowerCase().includes(selectedSector.value.toLowerCase());
    return matchesSearch && matchesSector;
  });
});

function formatCurrency(val) {
  if (!val) return '0';
  return new Intl.NumberFormat('fr-FR').format(val);
}

function openCreateProductPopup() {
  isEditing.value = false;
  productForm.value = {
    name: '',
    price: '',
    category: 'Agriculture Intrants',
    startingStock: 100,
    batchDate: new Date().toISOString().slice(0, 10),
    image: 'https://images.unsplash.com/photo-1574325131876-a7999335cfa3?auto=format&fit=crop&q=80&w=300'
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
    image: p.image || ''
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
      existing.image = productForm.value.image;
      toast.success('Product configurations overridden successfully.');
    }
  } else {
    // Generate new entry with custom active batches
    const newId = 'p_' + (products.value.length + 101);
    const stockVal = parseInt(productForm.value.startingStock);
    
    const newProduct = {
      id: newId,
      name: productForm.value.name,
      price: parseFloat(productForm.value.price),
      category: productForm.value.category,
      stock: stockVal,
      image: productForm.value.image || 'https://images.unsplash.com/photo-1574325131876-a7999335cfa3?auto=format&fit=crop&q=80&w=300',
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
    toast.success('New B2B Product and initial intake batch registered safely in DB.');
  }
  showProductPopup.value = false;
}

function triggerDeleteConfirmation(product) {
  productToDelete.value = product;
}

function confirmDeleteProduct() {
  if (productToDelete.value) {
    products.value = products.value.filter(p => p.id !== productToDelete.value.id);
    toast.info(`Product ${productToDelete.value.name} is permanently redacted from taxonomy catalogs.`);
    productToDelete.value = null;
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
