<template>
  <div class="space-y-6" v-if="supplier">
    <!-- Breadcrumb & Header -->
    <div class="flex items-center space-x-3 mb-2">
      <router-link to="/supplier/suppliers" class="p-2 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition">
        <ArrowLeftIcon class="h-4 w-4" />
      </router-link>
      <div class="flex items-center space-x-2 text-sm text-[var(--color-text-secondary)] font-medium">
        <router-link to="/supplier/suppliers" class="hover:text-[var(--color-primary)] transition">Fournisseurs</router-link>
        <ChevronRightIcon class="h-4 w-4 text-[var(--color-text-muted)]" />
        <span class="text-[var(--color-text-primary)] font-bold">{{ supplier.name }}</span>
      </div>
    </div>

    <!-- Main Identity Card -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
      <div class="flex items-center space-x-5">
        <div class="h-16 w-16 bg-[var(--color-primary-muted)] text-[var(--color-primary)] rounded-full flex items-center justify-center font-bold text-2xl shadow-sm border border-[var(--color-primary-border)]">
          {{ supplier.name.charAt(0) }}
        </div>
        <div>
          <h1 class="text-2xl font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
            <span>{{ supplier.name }}</span>
            <CheckBadgeIcon class="h-5 w-5 text-emerald-500" v-if="supplier.status === 'Active'" />
          </h1>
          <div class="text-sm text-[var(--color-text-secondary)] mt-1 flex items-center space-x-2">
            <span class="px-2 py-0.5 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-md text-xs">{{ supplier.category }}</span>
            <span>ID: {{ supplier.id }}</span>
          </div>
        </div>
      </div>
      
      <div class="flex flex-wrap gap-3">
        <button class="px-4 py-2 bg-[var(--color-surface-hover)] border border-[var(--color-border)] hover:bg-[var(--color-primary-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary-border)] text-[var(--color-text-primary)] rounded-lg text-sm font-semibold transition flex items-center space-x-2">
          <PencilIcon class="h-4 w-4" />
          <span>Modifier</span>
        </button>
        <button 
          @click="toggleStatus"
          class="px-4 py-2 border rounded-lg text-sm font-semibold transition flex items-center space-x-2"
          :class="supplier.status === 'Active' ? 'bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500 hover:text-white' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500 hover:text-white'"
        >
          <NoSymbolIcon v-if="supplier.status === 'Active'" class="h-4 w-4" />
          <CheckCircleIcon v-else class="h-4 w-4" />
          <span>{{ supplier.status === 'Active' ? 'Suspendre' : 'Réactiver' }}</span>
        </button>
      </div>
    </div>

    <!-- Data Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Infos Sidebar -->
      <div class="space-y-6">
        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm space-y-4">
          <h3 class="text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2 flex items-center space-x-2">
            <InformationCircleIcon class="h-5 w-5 text-[var(--color-text-muted)]" />
            <span>Informations de Contact</span>
          </h3>
          <ul class="space-y-3 text-sm text-[var(--color-text-secondary)]">
            <li class="flex items-start space-x-3">
              <EnvelopeIcon class="h-5 w-5 text-[var(--color-primary)] shrink-0" />
              <span class="break-all">{{ supplier.email }}</span>
            </li>
            <li class="flex items-start space-x-3">
              <PhoneIcon class="h-5 w-5 text-[var(--color-primary)] shrink-0" />
              <span>{{ supplier.phone }}</span>
            </li>
            <li class="flex items-start space-x-3">
              <MapPinIcon class="h-5 w-5 text-[var(--color-primary)] shrink-0" />
              <span>{{ supplier.address }}</span>
            </li>
            <li class="flex items-start space-x-3" v-if="supplier.taxId">
              <DocumentTextIcon class="h-5 w-5 text-[var(--color-primary)] shrink-0" />
              <span>NIF / RCCM : <strong class="text-[var(--color-text-primary)]">{{ supplier.taxId }}</strong></span>
            </li>
          </ul>
        </div>

        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm space-y-4">
          <h3 class="text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2 flex items-center space-x-2">
            <CreditCardIcon class="h-5 w-5 text-[var(--color-text-muted)]" />
            <span>Termes Financiers</span>
          </h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between items-center bg-[var(--color-surface-hover)] p-2 rounded-lg border border-[var(--color-border)]">
              <span class="text-[var(--color-text-secondary)]">Condition de paiement</span>
              <span class="font-bold text-[var(--color-text-primary)]">{{ supplier.paymentTerms }}</span>
            </div>
            <div class="flex justify-between items-center bg-[var(--color-surface-hover)] p-2 rounded-lg border border-[var(--color-border)]">
              <span class="text-[var(--color-text-secondary)]">Devise par défaut</span>
              <span class="font-bold text-[var(--color-text-primary)]">XAF (FCFA)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content (Purchase History) -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Historique des Bons de Commande -->
        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
          <div class="flex justify-between items-center mb-4 border-b border-[var(--color-border)] pb-2">
            <h3 class="text-base font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
              <TagIcon class="h-5 w-5 text-[var(--color-primary)]" />
              <span>Historique des commandes</span>
            </h3>
            <span class="text-xs font-semibold bg-[var(--color-primary-muted)] text-[var(--color-primary)] px-2 py-1 rounded-full">
              {{ supplierPurchases.length }} bons
            </span>
          </div>

          <div class="space-y-3">
            <div 
              v-for="po in supplierPurchases" 
              :key="po.id"
              class="p-4 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition hover:border-[var(--color-primary-border)]"
            >
              <div>
                <div class="flex items-center space-x-3 mb-1">
                  <span class="font-bold text-[var(--color-text-primary)]">#{{ po.id }}</span>
                  <span 
                    class="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase"
                    :class="po.status === 'Received' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : (po.status === 'Draft' ? 'bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] border border-[var(--color-border)]' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20')"
                  >
                    {{ po.status }}
                  </span>
                </div>
                <div class="text-xs text-[var(--color-text-secondary)]">
                  Date : {{ po.date }} • {{ getSupplierItems(po).length }} article(s) commandé(s)
                </div>
              </div>
              <div class="text-right flex flex-col sm:items-end">
                <span class="font-bold text-[var(--color-text-primary)]">{{ formatMoney(getSupplierTotal(po)) }}</span>
              </div>
            </div>

            <div v-if="supplierPurchases.length === 0" class="text-center py-6 text-sm text-[var(--color-text-muted)]">
              Aucun bon de commande n'implique ce fournisseur.
            </div>
          </div>
        </div>

        <!-- Produits Fournis -->
        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
          <div class="flex justify-between items-center mb-4 border-b border-[var(--color-border)] pb-2">
            <h3 class="text-base font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
              <ArchiveBoxIcon class="h-5 w-5 text-emerald-500" />
              <span>Produits sourcés chez eux</span>
            </h3>
          </div>
          <p class="text-sm text-[var(--color-text-secondary)] text-center py-4 italic">
            La liaison avec le catalogue local est en cours de développement. (Le fournisseur est présentement lié aux bons de commande).
          </p>
        </div>

      </div>

    </div>
  </div>
  <div v-else class="text-center py-12 text-[var(--color-text-muted)]">
    Fournisseur introuvable.
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { b2b_suppliers, purchases } from '@/utils/supplier_db';
import { useToast } from 'vue-toastification';
import { 
  ArrowLeftIcon, ChevronRightIcon, PencilIcon, NoSymbolIcon, CheckCircleIcon,
  CheckBadgeIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, DocumentTextIcon, 
  CreditCardIcon, InformationCircleIcon, TagIcon, ArchiveBoxIcon
} from '@heroicons/vue/24/outline';

const route = useRoute();
const toast = useToast();

const supplier = computed(() => {
  return b2b_suppliers.value.find(s => s.id === route.params.id);
});

// Calculate the orders that concern THIS supplier
const supplierPurchases = computed(() => {
  if (!supplier.value) return [];
  return purchases.value.filter(p => p.supplierIds && p.supplierIds.includes(supplier.value.id));
});

function getSupplierItems(po) {
  return (po.items || []).filter(i => i.supplierId === supplier.value.id);
}

function getSupplierTotal(po) {
  const items = getSupplierItems(po);
  return items.reduce((acc, itm) => acc + (itm.qty * itm.unitPrice), 0);
}

function toggleStatus() {
  if (!supplier.value) return;
  supplier.value.status = supplier.value.status === 'Active' ? 'Suspended' : 'Active';
  toast.success(`Le statut du fournisseur a été mis à jour.`);
}

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('XAF', 'FCFA');
}
</script>
