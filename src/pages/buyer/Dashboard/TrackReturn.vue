<template>
  <div class="space-y-6 max-w-6xl mx-auto">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--color-border)] pb-4 gap-4">
      <div class="space-y-1">
        <router-link :to="{ name: 'TrackDelivery', params: { id: orderId }, query: { supplier: supplierId } }" class="text-xs text-[var(--color-primary)] font-mono hover:underline flex items-center space-x-1">
          <span>&larr;</span>
          <span>Retour au Suivi</span>
        </router-link>
        <h1 class="text-lg font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
          <span>Déclaration de Retour</span>
          <span class="text-[var(--color-primary)] font-mono text-xs">#{{ order?.reference || orderId }}</span>
        </h1>
        <div v-if="supplierName" class="text-xs text-[var(--color-text-secondary)] font-mono uppercase">
          Fournisseur : <strong class="text-[var(--color-primary)]">{{ supplierName }}</strong>
        </div>
      </div>
      <div class="text-right">
        <span class="px-3 py-1 bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] rounded-full text-[10px] uppercase font-mono tracking-wider">
          Statut BC : {{ order?.status || 'Inconnu' }}
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-8 space-y-6">
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 class="text-base font-bold text-[var(--color-text-primary)]">Résumé de la commande</h2>
              <p class="text-xs text-[var(--color-text-secondary)] mt-1">Vérifiez les lignes concernées avant d’émettre le bon de retour.</p>
            </div>
            <div class="text-sm font-bold text-[var(--color-text-primary)] font-mono">
              Total estimé : {{ formatMoney(order?.total || 0) }}
            </div>
          </div>
          <div v-if="order" class="space-y-3 text-xs text-[var(--color-text-secondary)]">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span class="block uppercase font-mono text-[10px] text-[var(--color-text-secondary)]">Créé le</span>
                <p class="font-bold text-[var(--color-text-primary)]">{{ formatDate(order.created_at || order.date_emission) }}</p>
              </div>
              <div>
                <span class="block uppercase font-mono text-[10px] text-[var(--color-text-secondary)]">Mode de livraison</span>
                <p class="font-bold text-[var(--color-text-primary)]">{{ order.deliveryMode || order.shipping_mode || 'Non défini' }}</p>
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span class="block uppercase font-mono text-[10px] text-[var(--color-text-secondary)]">Transporteur</span>
                <p class="font-bold text-[var(--color-text-primary)]">{{ order.carrierName || order.carrier || 'Afrique Logistique Express' }}</p>
              </div>
              <div>
                <span class="block uppercase font-mono text-[10px] text-[var(--color-text-secondary)]">Acheteur</span>
                <p class="font-bold text-[var(--color-text-primary)]">{{ order.clientName || order.buyer_name || 'Acheteur' }}</p>
              </div>
            </div>
          </div>
          <div v-else class="text-sm text-[var(--color-text-secondary)] py-6">Commande introuvable. Vérifiez le numéro de BC ou reconnectez-vous.</div>
        </div>

        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-sm font-bold text-[var(--color-text-primary)]">Bon de retour</h3>
              <p class="text-xs text-[var(--color-text-secondary)] mt-1">Sélectionnez les produits à retourner et décrivez le motif.</p>
            </div>
            <span class="text-[10px] uppercase font-mono text-[var(--color-primary)] tracking-[0.2em]">Interface dédiée</span>
          </div>

          <ReturnForm
            v-if="order"
            :items="supplierItems"
            :orderId="order.id"
            :supplierId="supplierId || fallbackSupplierId"
            :supplierName="supplierName"
            :buyerId="order.clientId || order.buyer_id"
            :buyerName="order.clientName || order.buyer_name"
            @created="handleReturnCreated"
          />
          <div v-else class="text-xs text-[var(--color-text-secondary)]">Aucun article à retourner pour cette commande.</div>
        </div>
      </div>

      <aside class="lg:col-span-4 space-y-6">
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
          <h4 class="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary)] mb-4">Aide</h4>
          <ul class="space-y-3 text-xs text-[var(--color-text-secondary)]">
            <li>1. Vérifiez les quantités par produit.</li>
            <li>2. Indiquez au moins une ligne de retour.</li>
            <li>3. Un retour est soumis comme nouveau BC correctif vers le fournisseur.</li>
            <li>4. Le bon de retour sera visible dans l’historique de la commande.</li>
          </ul>
        </div>
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
          <h4 class="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary)] mb-4">Détails fournisseur</h4>
          <p class="text-sm font-bold text-[var(--color-text-primary)]">{{ supplierName }}</p>
          <p class="text-xs text-[var(--color-text-secondary)] mt-2">Si le fournisseur n’est pas correct, revenez au suivi ou sélectionnez une autre ligne.</p>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { orders as dbOrders, b2b_suppliers } from '@/utils/supplier_db.js';
import ReturnForm from '@/components/buyer/ReturnForm.vue';

const route = useRoute();
const router = useRouter();
const orderId = route.params.id;
const supplierId = route.query.supplier || '';

const order = computed(() => {
  return dbOrders.value.find(o => o.id === orderId) || null;
});

const fallbackSupplierId = computed(() => {
  if (!order.value || !order.value.items) return '';
  return order.value.items[0]?.supplierId || order.value.items[0]?.supplier_id || '';
});

const supplier = computed(() => {
  const supplierKey = supplierId || fallbackSupplierId.value;
  return b2b_suppliers.value.find(s => s.id === supplierKey) || null;
});

const supplierName = computed(() => supplier.value?.name || 'Fournisseur inconnu');

const supplierItems = computed(() => {
  if (!order.value || !order.value.items) return [];
  const targetSupplierId = supplierId || fallbackSupplierId.value;
  return order.value.items.filter(item => item.supplierId === targetSupplierId || item.supplier_id === targetSupplierId);
});

function formatMoney(value) {
  if (value == null) return '0 FCFA';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(value);
}

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function handleReturnCreated(newReturn) {
  const ord = ordersStore.purchaseOrders.find(o => o.id === newReturn.parent_order_id || o.reference === newReturn.parent_order_id);
  if (ord) {
    ord.history = ord.history || [];
    ord.history.push({
      status: 'ReturnRequested',
      timestamp: new Date().toISOString(),
      label: 'Bon de retour déclaré',
      description: `Retour ${newReturn.reference} créé par ${newReturn.buyer_name || 'acheteur'}`
    });
  }
  if (order.value) {
    order.value.history = order.value.history || [];
    order.value.history.push({
      status: 'ReturnRequested',
      timestamp: new Date().toISOString(),
      label: 'Bon de retour déclaré',
      description: `Retour ${newReturn.reference} créé par ${newReturn.buyer_name || 'acheteur'}`
    });
  }
  router.push({ name: 'TrackDelivery', params: { id: orderId }, query: { supplier: supplierId || fallbackSupplierId.value } });
}
</script>

<style scoped>
</style>
