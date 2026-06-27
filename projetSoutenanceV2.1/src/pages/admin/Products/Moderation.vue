<template>
  <div class="space-y-6">

    <!-- HEADER BLOCK -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5 shrink-0">
      <div>
        <h1 class="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
          <svg class="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          Product Catalog & Moderation Safety Queue
        </h1>
        <p class="text-xs text-slate-400">Enforce agricultural, BTP, and compliance safety guidelines on bulk supply materials.</p>
      </div>

      <!-- METRICS -->
      <div class="flex items-center space-x-3 text-xs font-mono">
        <span class="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-350">
          Unmoderated Queue: <strong class="text-amber-400">{{ pendingCount }}</strong>
        </span>
        <span class="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-350">
          Total Products: <strong class="text-slate-100">{{ products.length }}</strong>
        </span>
      </div>
    </div>

    <!-- QUICK STATUS FILTERS & SEARCH -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-900">
      <div class="flex flex-wrap items-center gap-2 select-none">
        <button 
          v-for="fl in filterOptions" 
          :key="fl.value"
          @click="activeFilter = fl.value"
          class="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition"
          :class="activeFilter === fl.value ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-850'"
        >
          {{ fl.label }} ({{ countByStatus(fl.value) }})
        </button>
      </div>

      <div class="relative w-full md:w-72">
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="Search items, categories, SKUs..."
          class="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg p-2 pl-8 text-xs text-slate-100 font-mono focus:outline-none transition"
        />
        <span class="absolute left-2.5 top-2.5 text-slate-500 font-sans">&telrec;</span>
      </div>
    </div>

    <!-- MAIN GRID CATALOG LISTING -->
    <div v-if="filteredProducts.length === 0" class="p-12 text-center bg-slate-900/10 border border-slate-900 rounded-2xl">
      <svg class="h-10 w-10 text-slate-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v2m4-3.5h8m-8 3h4M12 17h.01" />
      </svg>
      <p class="text-xs text-slate-500 mt-2 font-mono">No products matching moderation standards found.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="prd in filteredProducts" 
        :key="prd.id"
        class="bg-slate-900/60 border border-slate-850 rounded-2xl overflow-hidden hover:border-slate-700 transition flex flex-col justify-between"
      >
        <!-- Card Image Placeholder & ID -->
        <div class="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-850">
          <span class="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wide">
            SKU: {{ prd.sku || 'CMR-PROP-' + prd.id.toUpperCase() }}
          </span>
          <span 
            class="px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase"
            :class="getBadgeClass(prd.moderationStatus)"
          >
            {{ prd.moderationStatus || 'Pending Review' }}
          </span>
        </div>

        <!-- Product Summary Details -->
        <div class="p-5 flex-1 space-y-4">
          <div>
            <span class="text-[9px] font-mono text-indigo-400 uppercase tracking-widest font-semibold">
              {{ getCategoryName(prd.categoryId) }}
            </span>
            <h3 class="text-sm font-bold text-slate-100 font-sans mt-0.5 leading-snug lg:h-10 line-clamp-2">
              {{ prd.name }}
            </h3>
            <p class="text-[11px] text-slate-400 mt-1 line-clamp-2 italic font-sans leading-relaxed">
              {{ prd.description || 'Raw certified B2B supply material ready for regional shipping hubs.' }}
            </p>
          </div>

          <!-- Price Stock Info -->
          <div class="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3 rounded-xl border border-slate-850">
            <div>
              <span class="text-[8px] text-slate-500 font-mono uppercase block">B2B Base Cost</span>
              <span class="font-bold text-slate-300 font-mono text-sm leading-tight">
                {{ formatCurrency(prd.price) }} <span class="text-[9px] font-normal font-sans">/ {{ prd.unit || 'sac' }}</span>
              </span>
            </div>
            <div>
              <span class="text-[8px] text-slate-500 font-mono uppercase block">Active Stock</span>
              <span class="font-semibold text-slate-300 font-mono text-sm leading-tight">
                {{ prd.stock }} <span class="text-[9px] font-normal font-sans">units</span>
              </span>
            </div>
            <div class="col-span-2 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-450 leading-tight">
              <span>Merchant Supplier:</span>
              <span class="text-indigo-400 font-sans font-semibold truncate max-w-[150px]">{{ getSupplierName(prd.supplierId) }}</span>
            </div>
          </div>
        </div>

        <!-- Actions Footer -->
        <div class="px-4 py-3 bg-slate-950 border-t border-slate-850 flex items-center justify-end gap-2 shrink-0">
          <button 
            v-if="prd.moderationStatus !== 'Suspended'"
            @click="triggerProductSuspension(prd)"
            class="px-2.5 py-1.5 bg-red-950/20 text-red-500 hover:bg-red-600 hover:text-white border border-red-950/50 hover:border-red-600 rounded-lg text-[10px] font-mono uppercase font-bold transition"
          >
            Geler / Suspend
          </button>
          <button 
            v-if="prd.moderationStatus !== 'Approved'"
            @click="approveProduct(prd)"
            class="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-750 text-white rounded-lg text-[10px] font-mono uppercase font-bold transition"
          >
            Approve Catalog
          </button>
          
          <div v-if="prd.moderationStatus === 'Approved'" class="flex items-center text-[10px] font-mono text-slate-450 space-x-1 py-1">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            <span>Cleared on Shelf</span>
          </div>
        </div>
      </div>
    </div>

    <!-- PAGINATION ACCORDION FOOTER -->
    <div class="flex items-center justify-between text-xs font-mono text-slate-450 py-4 border-t border-slate-900 shrink-0">
      <span>Page 1 of 1</span>
      <span>Total listed items filtered: {{ filteredProducts.length }}</span>
    </div>

    <!-- MANDATORY OVERRIDE SAFELY WARNING MODAL -->
    <ConfirmationModal 
      :show="showConfirm"
      :title="confirmTitle"
      :message="confirmMessage"
      :action-label="confirmActionLabel"
      @close="closeConfirm"
      @confirm="executeSuspensionOverride"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { products } from '@/utils/supplier_db.js';
import { suppliers } from '@/utils/seed_data.js';
import { useToast } from 'vue-toastification';
import { writeAuditLog } from '@/utils/admin_db.js';
import ConfirmationModal from '@/components/ConfirmationModal.vue';

const toast = useToast();

const searchQuery = ref('');
const activeFilter = ref('Pending'); // 'All', 'Pending', 'Approved', 'Suspended'

const filterOptions = [
  { value: 'Pending', label: 'Pending Safety Review' },
  { value: 'Approved', label: 'Approved Shelf' },
  { value: 'Suspended', label: 'Suspended / Suspended' },
  { value: 'All', label: 'All Catalog' }
];

// Initialize product status on shelf
onMounted(() => {
  products.value.forEach((p, idx) => {
    if (!p.moderationStatus) {
      p.moderationStatus = idx % 25 === 0 ? 'Pending' : (idx % 60 === 0 ? 'Suspended' : 'Approved');
    }
  });
});

const pendingCount = computed(() => {
  return products.value.filter(p => !p.moderationStatus || p.moderationStatus === 'Pending').length;
});

function countByStatus(st) {
  if (st === 'All') return products.value.length;
  return products.value.filter(p => {
    if (st === 'Pending') return !p.moderationStatus || p.moderationStatus === 'Pending';
    return p.moderationStatus === st;
  }).length;
}

// Search and filter pipeline
const filteredProducts = computed(() => {
  return products.value.filter(p => {
    // 1. Status Check
    if (activeFilter.value !== 'All') {
      const matchPending = activeFilter.value === 'Pending' && (!p.moderationStatus || p.moderationStatus === 'Pending');
      const matchOther = p.moderationStatus === activeFilter.value;
      if (!matchPending && !matchOther) return false;
    }

    // 2. Search query check
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku?.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      return matchName || matchSku || matchDesc;
    }

    return true;
  });
});

// Seed data relations help
import { categories } from '@/utils/seed_data.js';
function getCategoryName(catId) {
  const c = categories.find(cat => cat.id === catId);
  return c ? c.name : 'Bulk Ingredients';
}

function getSupplierName(suppId) {
  const s = suppliers.value.find(x => x.id === suppId);
  return s ? s.name : 'Cooperative Union';
}

function getBadgeClass(st) {
  if (st === 'Approved') return 'bg-emerald-950 text-emerald-450 border border-emerald-900/50';
  if (st === 'Suspended') return 'bg-red-950 text-red-400 border border-red-900/50';
  return 'bg-amber-950 text-amber-400 border border-amber-900/50 animate-pulse';
}

function formatCurrency(v) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(v);
}

// APPROVE
function approveProduct(prd) {
  prd.moderationStatus = 'Approved';
  prd.status = 'available'; // Set active for sales

  writeAuditLog(
    'PRODUCT_MODERATED',
    `Product catalogue item cleared: ${prd.name} (SKU: ${prd.sku}).`,
    'Inspector Catalog Specialist'
  );

  toast.success(`Approved product "${prd.name}" for public B2B catalog shelves.`);
}

// SUSPEND/GEL REJECT REQUIRE EXPLICIT HARSH POPUP MODAL
const showConfirm = ref(false);
const confirmTitle = ref('');
const confirmMessage = ref('');
const confirmActionLabel = ref('');
const targetPrd = ref(null);

function triggerProductSuspension(prd) {
  targetPrd.value = prd;
  confirmTitle.value = 'PLATFORM OVERRIDE: SUSPEND PROD CATALOG ITEM';
  confirmMessage.value = `You are about to enforce a product halt or suspension override on item "${prd.name}". This deletes the listing from B2B search index, stops stock transactions, and alerts the merchant supplier immediately.`;
  confirmActionLabel.value = 'CONFIRM IMMEDIATE STOCK FREEZE';
  showConfirm.value = true;
}

function closeConfirm() {
  showConfirm.value = false;
  targetPrd.value = null;
}

function executeSuspensionOverride(reason) {
  if (targetPrd.value) {
    const prd = targetPrd.value;
    prd.moderationStatus = 'Suspended';
    prd.status = 'out_of_stock'; // Mark catalog sales locked

    writeAuditLog(
      'PRODUCT_SUSPENDED',
      `Product catalog item is SUSPENDED: ${prd.name}. Reason: ${reason}`,
      'Inspector Catalog Specialist',
      'danger'
    );

    toast.error(`Stock freeze applied to "${prd.name}". Event audit logged.`);
  }

  showConfirm.value = false;
  targetPrd.value = null;
}
</script>
