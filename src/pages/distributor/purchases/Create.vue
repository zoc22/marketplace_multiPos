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
import { useAuthStore } from '@/store/modules/auth.js';
import { useToast } from 'vue-toastification';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import PurchaseOrderForm from '@/components/distributor/PurchaseOrderForm.vue';

const router = useRouter();
const toast = useToast();
const ordersStore = useOrdersStore();
const authStore = useAuthStore();

const onSubmit = (formData) => {
  // Group products by supplier_id
  const groups = {};
  formData.products.forEach(p => {
    if (!groups[p.supplier_id]) {
      groups[p.supplier_id] = [];
    }
    groups[p.supplier_id].push({
      productId: p.product_id,
      quantity: p.quantity,
      price: p.unit_price,
      total: p.total
    });
  });

  // Create a separate purchase order for each group
  Object.keys(groups).forEach(supplierId => {
    const groupProducts = groups[supplierId];
    const totalAmount = groupProducts.reduce((sum, p) => sum + p.total, 0);
    const supplierUser = authStore.users.find(u => u.id === supplierId);
    const receiverType = supplierUser ? supplierUser.roles[0] : 'distributor';

    ordersStore.createPurchaseOrder({
      emitter_id: authStore.user?.id || 'usr_dist_1',
      emitter_type: 'distributor',
      receiver_id: supplierId,
      receiver_type: receiverType,
      date_emission: new Date().toISOString(),
      date_livraison_souhaitee: formData.date_livraison_souhaitee,
      shipping_mode: formData.shipping_mode,
      payment_method: formData.payment_method,
      shipping_address: formData.shipping_address,
      notes: formData.notes,
      products: groupProducts,
      total: totalAmount,
      status: 'PENDING'
    });
  });

  toast.success('Bons de commande B2B créés et envoyés aux fournisseurs concernés !');
  router.push('/distributor/purchases');
};

const onCancel = () => {
  router.push('/distributor/purchases');
};
</script>
