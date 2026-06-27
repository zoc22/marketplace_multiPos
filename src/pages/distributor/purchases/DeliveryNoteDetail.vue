<template>
  <div class="space-y-6" v-if="dn">
    <!-- Breadcrumb & Header -->
    <div class="flex items-center space-x-3 mb-2">
      <router-link to="/distributor/purchases/delivery-notes" class="p-2 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition">
        <ArrowLeftIcon class="h-4 w-4" />
      </router-link>
      <div class="flex items-center space-x-2 text-sm text-[var(--color-text-secondary)] font-medium">
        <router-link to="/distributor/purchases/delivery-notes" class="hover:text-[var(--color-primary)] transition">Bons de livraison</router-link>
        <ChevronRightIcon class="h-4 w-4 text-[var(--color-text-muted)]" />
        <span class="text-[var(--color-text-primary)] font-bold">BL #{{ dn.id }}</span>
      </div>
    </div>

    <!-- Details Card -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
      <div>
        <h1 class="text-2xl font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
          <span>Bon de Livraison #{{ dn.id }}</span>
          <CheckBadgeIcon class="h-5 w-5 text-emerald-500" v-if="dn.status === 'Verified'" />
        </h1>
        <div class="text-sm text-[var(--color-text-secondary)] mt-1 flex items-center space-x-2">
          <span>Réf. Commande: #{{ dn.purchaseId }}</span>
          <span>•</span>
          <span>Fournisseur: {{ getSupplierName(dn.supplierId) }}</span>
        </div>
      </div>
      
      <div class="flex flex-col items-end">
        <span class="text-xs text-[var(--color-text-secondary)]">Reçu le {{ dn.date }} par {{ dn.receivedBy }}</span>
        <button 
          @click="toggleStatus"
          class="mt-3 px-4 py-2 border rounded-lg text-sm font-semibold transition flex items-center space-x-2"
          :class="dn.status === 'Verified' ? 'bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]' : 'bg-[var(--color-primary)] text-white hover:opacity-90'"
        >
          <CheckCircleIcon class="h-4 w-4" />
          <span>{{ dn.status === 'Verified' ? 'Marquer comme non-vérifié' : 'Valider la réception' }}</span>
        </button>
      </div>
    </div>

    <!-- Items Grid -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
      <h3 class="text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2 mb-4 flex items-center space-x-2">
        <ArchiveBoxIcon class="h-5 w-5 text-[var(--color-primary)]" />
        <span>Articles réceptionnés</span>
      </h3>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[var(--color-surface-hover)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)]">
              <th class="p-4">Désignation</th>
              <th class="p-4 text-center">Qté Attendue</th>
              <th class="p-4 text-center">Qté Reçue</th>
              <th class="p-4 text-center">Écart</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr v-for="(item, index) in dn.items" :key="index" class="hover:bg-[var(--color-surface-hover)] transition text-sm">
              <td class="p-4 font-bold text-[var(--color-text-primary)]">
                {{ item.name }}
              </td>
              <td class="p-4 text-center text-[var(--color-text-secondary)] font-medium">
                {{ item.qtyExpected }}
              </td>
              <td class="p-4 text-center font-bold text-[var(--color-text-primary)]">
                {{ item.qtyReceived }}
              </td>
              <td class="p-4 text-center">
                <span 
                  class="px-2 py-0.5 rounded text-xs font-bold"
                  :class="item.qtyReceived === item.qtyExpected ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'"
                >
                  {{ item.qtyReceived - item.qtyExpected }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-12 text-[var(--color-text-muted)]">
    Bon de livraison introuvable.
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { delivery_notes, b2b_suppliers } from '@/utils/distributor_db';
import { useToast } from 'vue-toastification';
import { 
  ArrowLeftIcon, ChevronRightIcon, CheckBadgeIcon, CheckCircleIcon, ArchiveBoxIcon
} from '@heroicons/vue/24/outline';

const route = useRoute();
const toast = useToast();

const dn = computed(() => {
  return delivery_notes.value.find(d => d.id === route.params.id);
});

function getSupplierName(id) {
  const sup = b2b_suppliers.value.find(s => s.id === id);
  return sup ? sup.name : id;
}

function toggleStatus() {
  if (!dn.value) return;
  dn.value.status = dn.value.status === 'Verified' ? 'Pending' : 'Verified';
  toast.success('Statut du bon de livraison mis à jour.');
}
</script>
