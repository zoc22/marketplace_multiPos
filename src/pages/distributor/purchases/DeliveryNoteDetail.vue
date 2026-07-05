<template>
  <div class="space-y-6" v-if="dn">
    <!-- Breadcrumb & Header -->
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center space-x-3">
        <router-link to="/distributor/purchases/delivery-notes" class="p-2 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition">
          <ArrowLeftIcon class="h-4 w-4" />
        </router-link>
        <div class="flex items-center space-x-2 text-sm text-[var(--color-text-secondary)] font-medium">
          <router-link to="/distributor/purchases/delivery-notes" class="hover:text-[var(--color-primary)] transition">Bons de livraison</router-link>
          <ChevronRightIcon class="h-4 w-4 text-[var(--color-text-muted)]" />
          <span class="text-[var(--color-text-primary)] font-bold">BL #{{ dn.id }}</span>
        </div>
      </div>
      
      <div class="flex items-center gap-2">
        <PrintButton 
          :documentTitle="'Bon_de_Livraison_' + dn.id" 
          label="Imprimer le BL" 
        />
        <button 
          @click="toggleStatus"
          class="px-4 py-2 border rounded-lg text-sm font-semibold transition flex items-center space-x-2 bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] cursor-pointer"
        >
          <CheckCircleIcon class="h-4 w-4 text-emerald-500" />
          <span>{{ dn.status === 'Verified' || dn.status === 'DELIVERED' ? 'Marquer comme non-vérifié' : 'Valider la réception' }}</span>
        </button>
      </div>
    </div>

    <!-- Details Card / Printable sheet -->
    <div id="printable-po-sheet" class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
      <div class="flex justify-between items-start border-b border-[var(--color-border)] pb-6">
        <div>
          <h1 class="text-xl font-bold text-[var(--color-text-primary)] uppercase tracking-wider">Bon de Livraison</h1>
          <div class="font-mono text-sm text-[var(--color-primary)] mt-1 font-bold">Réf : #{{ dn.id }}</div>
          <p class="text-xs text-[var(--color-text-secondary)] mt-1">Émis le : {{ formatDate(dn.date) }}</p>
        </div>
        <div class="text-right">
          <div class="text-xs text-[var(--color-text-secondary)]">Commande Associée</div>
          <div class="font-bold text-[var(--color-primary)] text-sm hover:underline">
            <router-link :to="'/distributor/purchases/' + dn.purchaseId">#{{ dn.purchaseId }}</router-link>
          </div>
          <p class="text-xs text-[var(--color-text-secondary)] mt-1">Méthode d'expédition : {{ dn.shipping_mode || 'Routier' }}</p>
        </div>
      </div>

      <!-- Parties -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div class="p-4 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl">
          <span class="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1">Expéditeur</span>
          <span class="font-bold text-[var(--color-text-primary)]">{{ getSupplierName(dn.supplierId) }}</span>
        </div>
        <div class="p-4 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl">
          <span class="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1">Réceptionnaire</span>
          <span class="font-bold text-[var(--color-text-primary)]">GROUPE DISTRIBUTION B2B</span>
        </div>
      </div>

      <!-- Products Table -->
      <div class="border border-[var(--color-border)] rounded-xl overflow-hidden">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-[var(--color-surface-elevated)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)]">
              <th class="p-4">Désignation</th>
              <th class="p-4 text-center">Quantité Attendue</th>
              <th class="p-4 text-center">Quantité Reçue</th>
              <th class="p-4 text-center">Écart</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr v-for="(item, idx) in dn.items" :key="idx" class="text-sm hover:bg-[var(--color-surface-hover)]/40 transition">
              <td class="p-4 font-bold text-[var(--color-text-primary)]">{{ item.name }}</td>
              <td class="p-4 text-center text-[var(--color-text-secondary)] font-medium">{{ item.qtyExpected }}</td>
              <td class="p-4 text-center font-bold text-[var(--color-text-primary)]">{{ item.qtyReceived }}</td>
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

      <!-- Logistics details -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[var(--color-border)] text-sm">
        <div>
          <span class="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1">Transporteur</span>
          <span class="font-medium text-[var(--color-text-primary)]">{{ dn.carrier || 'Logistique Interne' }}</span>
        </div>
        <div>
          <span class="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1">Numéro de Suivi</span>
          <span class="font-mono text-xs text-[var(--color-text-primary)]">{{ dn.tracking_number || 'N/A' }}</span>
        </div>
        <div>
          <span class="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1">Date de Réception</span>
          <span class="font-medium text-[var(--color-text-primary)]">{{ formatDate(dn.date) }}</span>
        </div>
      </div>

      <!-- Signatures -->
      <div class="grid grid-cols-2 gap-8 pt-8 border-t border-[var(--color-border)] text-xs h-32">
        <div class="border border-dashed border-[var(--color-border)] p-4 rounded-xl flex flex-col justify-between">
          <span class="font-bold text-[var(--color-text-secondary)]">Signature Expéditeur :</span>
          <span class="font-mono italic text-[var(--color-text-primary)]">{{ dn.signature || 'Signé électroniquement' }}</span>
        </div>
        <div class="border border-dashed border-[var(--color-border)] p-4 rounded-xl flex flex-col justify-between">
          <span class="font-bold text-[var(--color-text-secondary)]">Signature Réceptionnaire (Grossiste) :</span>
          <span class="font-mono italic text-[var(--color-text-primary)]">{{ dn.receivedBy || 'En attente' }}</span>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-12 text-[var(--color-text-secondary)] italic">
    Bon de livraison introuvable.
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useOrdersStore } from '@/store/modules/orders.js';
import { delivery_notes, b2b_suppliers } from '@/utils/distributor_db';
import { useToast } from 'vue-toastification';
import { 
  ArrowLeftIcon, ChevronRightIcon, CheckCircleIcon
} from '@heroicons/vue/24/outline';
import PrintButton from '@/components/print/PrintButton.vue';

const route = useRoute();
const toast = useToast();
const ordersStore = useOrdersStore();

const dn = computed(() => {
  const storeNote = ordersStore.deliveryNotes.find(d => d.id === route.params.id || d.reference === route.params.id);
  if (storeNote) {
    return {
      id: storeNote.reference || storeNote.id,
      purchaseId: storeNote.purchase_order_id,
      supplierId: storeNote.emitter_id,
      date: storeNote.date_emission,
      receivedBy: storeNote.receiver_signature || 'Magasinier Central',
      status: storeNote.status === 'DELIVERED' ? 'Verified' : 'Pending',
      shipping_mode: storeNote.shipping_mode,
      carrier: storeNote.carrier,
      tracking_number: storeNote.tracking_number,
      signature: storeNote.signature,
      items: storeNote.products?.map(p => ({
        name: p.name || `Produit #${p.product_id}`,
        qtyExpected: p.quantity_delivered || p.quantity || 0,
        qtyReceived: p.quantity_delivered || p.quantity || 0
      })) || [],
      raw: storeNote
    };
  }
  
  const dbNote = delivery_notes.value.find(d => d.id === route.params.id);
  if (dbNote) {
    return {
      ...dbNote,
      purchaseId: dbNote.purchaseId
    };
  }
  
  return null;
});

function getSupplierName(id) {
  const sup = b2b_suppliers.value.find(s => s.id === id);
  return sup ? sup.name : id;
}

function toggleStatus() {
  if (!dn.value) return;
  if (dn.value.raw) {
    dn.value.raw.status = dn.value.raw.status === 'DELIVERED' ? 'IN_TRANSIT' : 'DELIVERED';
  } else {
    dn.value.status = dn.value.status === 'Verified' ? 'Pending' : 'Verified';
  }
  toast.success('Statut du bon de livraison mis à jour.');
}

const formatDate = (dateVal) => {
  if (!dateVal) return 'N/A';
  return new Date(dateVal).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const formatMoney = (val) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('XAF', 'FCFA');
};
</script>
