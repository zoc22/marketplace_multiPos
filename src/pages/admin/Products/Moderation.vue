<template>
  <div class="space-y-6">

    <!-- HEADER BLOCK -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5 shrink-0">
      <div>
        <h1 class="text-xl font-bold font-mono text-[var(--color-text-primary)] flex items-center gap-2">
          <ShieldExclamationIcon class="h-5 w-5 text-[var(--color-primary)]" />
          <span>Catalogue de Produits & File de Modération de Sécurité</span>
        </h1>
        <p class="text-xs text-[var(--color-text-secondary)]">Appliquez les directives de conformité et de sécurité sur les matériaux d'approvisionnement en vrac.</p>
      </div>

      <!-- METRICS -->
      <div class="flex items-center space-x-3 text-xs font-mono">
        <span class="px-2.5 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)]">
          File non modérée : <strong class="text-amber-500">{{ pendingCount }}</strong>
        </span>
        <span class="px-2.5 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)]">
          Total Produits : <strong class="text-[var(--color-text-primary)]">{{ products.length }}</strong>
        </span>
      </div>
    </div>

    <!-- QUICK STATUS FILTERS & SEARCH -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--color-surface)] p-4 rounded-2xl border border-[var(--color-border)]">
      <div class="flex flex-wrap items-center gap-2 select-none">
        <button 
          v-for="fl in filterOptions" 
          :key="fl.value"
          @click="activeFilter = fl.value"
          class="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition cursor-pointer"
          :class="activeFilter === fl.value ? 'bg-[var(--color-primary)] text-[var(--color-text-primary)] font-bold' : 'bg-[var(--color-background)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)]'"
        >
          {{ fl.label }} ({{ countByStatus(fl.value) }})
        </button>
      </div>

      <div class="relative w-full md:w-72">
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="Rechercher des articles, catégories, SKUs..."
          class="w-full bg-[var(--color-background)] border border-[var(--color-border)] focus:border-[var(--color-primary)] rounded-lg p-2.5 pl-8 text-xs text-[var(--color-text-primary)] font-mono focus:outline-none transition"
        />
        <span class="absolute left-2.5 top-2.5 text-[var(--color-text-secondary)]">
          <MagnifyingGlassIcon class="w-4 h-4" />
        </span>
      </div>
    </div>

    <!-- MAIN GRID CATALOG LISTING -->
    <div v-if="filteredProducts.length === 0" class="p-12 text-center bg-[var(--color-surface)]/10 border border-[var(--color-border)] rounded-2xl">
      <InboxIcon class="h-10 w-10 text-[var(--color-text-secondary)] mx-auto" />
      <p class="text-xs text-[var(--color-text-secondary)] mt-2 font-mono">Aucun produit en attente de modération.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="prd in filteredProducts" 
        :key="prd.id"
        class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:border-[var(--color-primary)] transition flex flex-col justify-between"
      >
        <!-- Card Image Placeholder & ID -->
        <div class="p-4 bg-[var(--color-background)] flex items-center justify-between border-b border-[var(--color-border)]">
          <span class="text-[10px] font-mono text-[var(--color-text-secondary)] font-bold uppercase tracking-wide">
            SKU : {{ prd.sku || 'CMR-PROP-' + prd.id.toUpperCase() }}
          </span>
          <span 
            class="px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase"
            :class="getBadgeClass(prd.moderationStatus)"
          >
            {{ prd.moderationStatus === 'Approved' ? 'Approuvé' : prd.moderationStatus === 'Suspended' ? 'Suspendu' : 'En Attente' }}
          </span>
        </div>

        <!-- Product Summary Details -->
        <div class="p-5 flex-1 space-y-4">
          <div>
            <span class="text-[9px] font-mono text-[var(--color-primary)] uppercase tracking-widest font-semibold">
              {{ getCategoryName(prd.categoryId) }}
            </span>
            <h3 class="text-sm font-bold text-[var(--color-text-primary)] font-sans mt-0.5 leading-snug lg:h-10 line-clamp-2">
              {{ prd.name }}
            </h3>
            <p class="text-[11px] text-[var(--color-text-secondary)] mt-1 line-clamp-2 italic font-sans leading-relaxed">
              {{ prd.description || 'Matériel d\'approvisionnement certifié B2B prêt pour livraison.' }}
            </p>
          </div>

          <!-- Price Stock Info -->
          <div class="grid grid-cols-2 gap-3 text-xs bg-[var(--color-background)] p-3 rounded-xl border border-[var(--color-border)]">
            <div>
              <span class="text-[8px] text-[var(--color-text-secondary)] font-mono uppercase block">Coût de Base B2B</span>
              <span class="font-bold text-[var(--color-text-primary)] font-mono text-sm leading-tight">
                {{ formatCurrency(prd.price) }} <span class="text-[9px] font-normal font-sans">/ {{ prd.unit || 'sac' }}</span>
              </span>
            </div>
            <div>
              <span class="text-[8px] text-[var(--color-text-secondary)] font-mono uppercase block">Stock Actif</span>
              <span class="font-semibold text-[var(--color-text-primary)] font-mono text-sm leading-tight">
                {{ prd.stock }} <span class="text-[9px] font-normal font-sans">unités</span>
              </span>
            </div>
            <div class="col-span-2 pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-[10px] text-[var(--color-text-secondary)] leading-tight">
              <span>Fournisseur Marchand :</span>
              <span class="text-[var(--color-primary)] font-sans font-semibold truncate max-w-[150px]">{{ getSupplierName(prd.supplierId) }}</span>
            </div>
          </div>
        </div>

        <!-- Actions Footer -->
        <div class="px-4 py-3 bg-[var(--color-background)] border-t border-[var(--color-border)] flex items-center justify-end gap-2 shrink-0">
          <button 
            v-if="prd.moderationStatus !== 'Suspended'"
            @click="triggerProductSuspension(prd)"
            class="px-2.5 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-red-500 rounded-lg text-[10px] font-mono uppercase font-bold transition flex items-center space-x-1 cursor-pointer"
          >
            <ShieldExclamationIcon class="w-3.5 h-3.5" />
            <span>Geler / Suspendre</span>
          </button>
          <button 
            v-if="prd.moderationStatus !== 'Approved'"
            @click="approveProduct(prd)"
            class="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-mono uppercase font-bold transition flex items-center space-x-1 cursor-pointer"
          >
            <CheckIcon class="w-3.5 h-3.5" />
            <span>Approuver</span>
          </button>
          
          <div v-if="prd.moderationStatus === 'Approved'" class="flex items-center text-[10px] font-mono text-[var(--color-text-secondary)] space-x-1 py-1">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            <span>Approuvé en Rayon</span>
          </div>
        </div>
      </div>
    </div>

    <!-- PAGINATION ACCORDION FOOTER -->
    <div class="flex items-center justify-between text-xs font-mono text-[var(--color-text-secondary)] py-4 border-t border-[var(--color-border)] shrink-0">
      <span>Page 1 sur 1</span>
      <span>Total des articles filtrés : {{ filteredProducts.length }}</span>
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { products } from '@/utils/supplier_db.js';
import { suppliers } from '@/utils/seed_data.js';
import { useToast } from 'vue-toastification';
import { writeAuditLog } from '@/utils/admin_db.js';
import ConfirmationModal from '@/components/ConfirmationModal.vue';
import { 
  ShieldExclamationIcon, 
  CheckIcon, 
  MagnifyingGlassIcon, 
  InboxIcon 
} from '@heroicons/vue/24/outline';

const toast = useToast();

const searchQuery = ref('');
const activeFilter = ref('Pending'); // 'All', 'Pending', 'Approved', 'Suspended'

const filterOptions = [
  { value: 'Pending', label: 'Attente d\'Audit' },
  { value: 'Approved', label: 'Approuvés' },
  { value: 'Suspended', label: 'Suspendus' },
  { value: 'All', label: 'Tout le Catalogue' }
];

// Initialize product status on shelf
onMounted(() => {
  products.value.forEach((p, idx) => {
    if (!p.moderationStatus) {
      p.moderationStatus = idx % 25 === 0 ? 'Pending' : (idx % 60 === 0 ? 'Suspended' : 'Approved');
    }
  });
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
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
  return c ? c.name : 'Ingrédients en vrac';
}

function getSupplierName(suppId) {
  const s = suppliers.value.find(x => x.id === suppId);
  return s ? s.name : 'Union Coopérative';
}

function getBadgeClass(st) {
  if (st === 'Approved') return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
  if (st === 'Suspended') return 'bg-red-500/10 text-red-500 border border-red-500/20';
  return 'bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse';
}

function formatCurrency(v) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(v);
}

// APPROVE
function approveProduct(prd) {
  prd.moderationStatus = 'Approved';
  prd.status = 'available';

  writeAuditLog(
    'PRODUCT_MODERATED',
    `Produit approuvé : ${prd.name} (SKU : ${prd.sku}).`,
    'Inspecteur Catalogue'
  );

  toast.success(`Le produit "${prd.name}" a été approuvé pour le catalogue.`);
}

// SUSPEND
const showConfirm = ref(false);
const confirmTitle = ref('');
const confirmMessage = ref('');
const confirmActionLabel = ref('');
const targetPrd = ref(null);

function triggerProductSuspension(prd) {
  targetPrd.value = prd;
  confirmTitle.value = 'SURCHARGE PLATEFORME : SUSPENDRE UN PRODUIT';
  confirmMessage.value = `Vous êtes sur le point de suspendre le produit "${prd.name}". Cela supprimera la fiche de l'index de recherche B2B, arrêtera les transactions de stock et alertera immédiatement le fournisseur marchand.`;
  confirmActionLabel.value = 'CONFIRMER LE GEL IMMÉDIAT DU STOCK';
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
    prd.status = 'out_of_stock';

    writeAuditLog(
      'PRODUCT_SUSPENDED',
      `Produit suspendu : ${prd.name}. Raison : ${reason}`,
      'Inspecteur Catalogue',
      'danger'
    );

    toast.error(`Gel du stock appliqué pour "${prd.name}".`);
  }

  showConfirm.value = false;
  targetPrd.value = null;
}

function handleKeyDown(e) {
  if (e.key === 'Escape') {
    closeConfirm();
  }
}
</script>
