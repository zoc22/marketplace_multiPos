<template>
  <div class="space-y-6" v-if="order">
    <!-- Breadcrumb & Header -->
    <div class="flex items-center space-x-3 mb-2">
      <router-link :to="`/distributor/orders/${order.id}`" class="p-2 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition">
        <ArrowLeftIcon class="h-4 w-4" />
      </router-link>
      <div class="flex items-center space-x-2 text-sm text-[var(--color-text-secondary)] font-medium">
        <router-link to="/distributor/orders" class="hover:text-[var(--color-primary)] transition">Commandes</router-link>
        <ChevronRightIcon class="h-4 w-4 text-[var(--color-text-muted)]" />
        <router-link :to="`/distributor/orders/${order.id}`" class="hover:text-[var(--color-primary)] transition">#{{ order.reference }}</router-link>
        <ChevronRightIcon class="h-4 w-4 text-[var(--color-text-muted)]" />
        <span class="text-[var(--color-text-primary)] font-bold">Préparation Logistique (FIFO)</span>
      </div>
    </div>

    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm space-y-6">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Préparation du Bon de Livraison</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">
          Renseignez les détails du transporteur, les lots FIFO et les quantités réelles expédiées pour la commande #{{ order.reference }}.
        </p>
      </div>

      <div v-if="order.status !== 'VALIDATED'" class="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-semibold rounded-lg">
        Attention : Règle métier - Un bon de livraison ne peut être généré que si le bon de commande est VALIDÉ. Statut actuel : {{ order.status }}.
      </div>

      <div v-else>
        <DeliveryNoteForm :purchase-order="order" @submit="onGenerateDN" @cancel="onCancel" />
      </div>
    </div>
  </div>
  <div v-else class="text-center py-12 text-[var(--color-text-muted)]">
    Commande introuvable...
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrdersStore } from '@/store/modules/orders.js';
import { useToast } from 'vue-toastification';
import { ArrowLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';
import DeliveryNoteForm from '@/components/distributor/DeliveryNoteForm.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const ordersStore = useOrdersStore();

const order = computed(() => {
  return ordersStore.purchaseOrders.find(o => o.id === route.params.id);
});

const onGenerateDN = (data) => {
  if (!order.value) return;
  
  if (order.value.status !== 'VALIDATED') {
    toast.error("Impossible de générer le bon de livraison. La commande n'est pas validée.");
    return;
  }

  const newDN = ordersStore.generateDeliveryNote(order.value.id, data);
  if (newDN) {
    toast.success('Le bon de livraison a été généré avec succès !');
    router.push(`/distributor/orders/delivery-notes/${newDN.id}`);
  }
};

const onCancel = () => {
  if (order.value) {
    router.push(`/distributor/orders/${order.value.id}`);
  } else {
    router.push('/distributor/orders');
  }
};
</script>
