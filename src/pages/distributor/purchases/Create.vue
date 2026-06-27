<template>
  <div class="space-y-6 max-w-5xl mx-auto">
    <!-- Header -->
    <div class="flex items-center space-x-3 mb-4">
      <router-link to="/distributor/purchases" class="p-2 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition">
        <ArrowLeftIcon class="h-5 w-5" />
      </router-link>
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Initialiser un Bon de Commande B2B</h1>
        <p class="text-sm text-[var(--color-text-secondary)]">Demande d'approvisionnement auprès d'un autre distributeur du réseau.</p>
      </div>
    </div>

    <!-- Purchase Order Form -->
    <PurchaseOrderForm @submit="onSubmit" @cancel="onCancel" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useOrdersStore } from '@/store/modules/orders.js';
import { useToast } from 'vue-toastification';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import PurchaseOrderForm from '@/components/distributor/PurchaseOrderForm.vue';

const router = useRouter();
const toast = useToast();
const ordersStore = useOrdersStore();

const onSubmit = (formData) => {
  const newPO = ordersStore.createPurchaseOrder({
    ...formData,
    emitter_id: 'dist_1', // Current distributor
    emitter_type: 'distributor',
    status: 'PENDING'
  });

  if (newPO) {
    toast.success('Bon de commande B2B envoyé avec succès !');
    router.push('/distributor/purchases');
  }
};

const onCancel = () => {
  router.push('/distributor/purchases');
};
</script>
