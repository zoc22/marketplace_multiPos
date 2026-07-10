<template>
  <div class="space-y-6" v-if="order">
    <!-- Breadcrumb & Header -->
    <div class="flex items-center space-x-3 mb-2">
      <router-link :to="`/vendor/orders/b2b/${order.id}`" class="p-2 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition">
        <ArrowLeftIcon class="h-4 w-4" />
      </router-link>
      <div class="flex items-center space-x-2 text-sm text-[var(--color-text-secondary)] font-medium">
        <router-link to="/vendor/orders" class="hover:text-[var(--color-primary)] transition">Commandes</router-link>
        <ChevronRightIcon class="h-4 w-4 text-[var(--color-text-muted)]" />
        <router-link :to="`/vendor/orders/b2b/${order.id}`" class="hover:text-[var(--color-primary)] transition">#{{ order.reference }}</router-link>
        <ChevronRightIcon class="h-4 w-4 text-[var(--color-text-muted)]" />
        <span class="text-[var(--color-text-primary)] font-bold">Préparation Logistique &amp; Émission BL</span>
      </div>
    </div>

    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm space-y-6">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Préparation du Bon de Livraison (BL)</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">
          Renseignez les détails du transporteur, les lots FIFO et les quantités réelles expédiées pour la commande B2B #{{ order.reference }}.
        </p>
      </div>

      <!-- Rule validation: order needs to be validated or pending to be prepared -->
      <div v-if="order.status === 'CANCELLED' || order.status === 'REFUSED'" class="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold rounded-lg">
        Attention : Cette commande est annulée ou refusée. Impossible de générer un bon de livraison.
      </div>

      <div v-else>
        <!-- Inline Form for Delivery Note -->
        <DeliveryNoteForm :purchase-order="order" @submit="onGenerateDN" @cancel="onCancel" />
      </div>
    </div>
  </div>
  <div v-else class="text-center py-12 text-[var(--color-text-secondary)] italic">
    Commande B2B introuvable.
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrdersStore } from '@/store/modules/orders.js';
import { useToast } from 'vue-toastification';
import { ArrowLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';
import DeliveryNoteForm from '@/components/distributor/DeliveryNoteForm.vue';

import { useAuthStore } from '@/store/modules/auth.js';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const ordersStore = useOrdersStore();
const authStore = useAuthStore();

const order = computed(() => {
  const rawOrder = ordersStore.purchaseOrders.find(o => o.id === route.params.id);
  if (!rawOrder) return null;
  const cloned = JSON.parse(JSON.stringify(rawOrder));
  if (cloned.products) {
    cloned.products = cloned.products.filter(p => p.supplierId === authStore.user?.id || p.supplierId === authStore.user?.tenant);
  }
  cloned.total = cloned.products.reduce((acc, p) => acc + (p.quantity * p.unit_price), 0);
  return cloned;
});

const onGenerateDN = (data) => {
  if (!order.value) return;
  
  // Auto-validate order if it was pending
  if (order.value.status === 'PENDING') {
    ordersStore.validatePurchaseOrder(order.value.id);
  }

  const newDN = ordersStore.generateDeliveryNote(order.value.id, data);
  if (newDN) {
    toast.success('Le bon de livraison a été généré avec succès ! Le suivi de livraison est actif.');
    router.push(`/vendor/orders/delivery-notes/${newDN.id}`);
  }
};

const onCancel = () => {
  if (order.value) {
    router.push(`/vendor/orders/b2b/${order.value.id}`);
  } else {
    router.push('/vendor/orders');
  }
};
</script>
