<template>
  <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4">
    <div class="flex justify-between items-start">
      <div>
        <div class="flex items-center space-x-2">
          <span class="font-mono text-sm font-bold text-[var(--color-primary)]">#{{ order.reference }}</span>
          <span 
            class="px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize"
            :class="{
              'bg-amber-500/10 text-amber-500 border-amber-500/20': order.status === 'PENDING' || order.status === 'DRAFT',
              'bg-emerald-500/10 text-emerald-500 border-emerald-500/20': order.status === 'VALIDATED' || order.status === 'DELIVERED',
              'bg-red-500/10 text-red-500 border-red-500/20': order.status === 'REFUSED' || order.status === 'CANCELLED',
              'bg-blue-500/10 text-blue-500 border-blue-500/20': order.status === 'PROCESSING'
            }"
          >
            {{ order.status }}
          </span>
        </div>
        <p class="text-xs text-[var(--color-text-secondary)] mt-1">Émis le : {{ formatDate(order.date_emission) }}</p>
      </div>
      
      <div class="text-right">
        <span class="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block">Émetteur</span>
        <span class="text-sm font-bold text-[var(--color-text-primary)] truncate max-w-[120px] block" :title="order.emitter_id">{{ order.emitter_id }}</span>
        <span class="text-[10px] text-[var(--color-text-secondary)] block">({{ order.emitter_type }})</span>
      </div>
    </div>

    <div class="border-t border-b border-[var(--color-border)] py-3 my-2 flex justify-between items-center text-sm">
      <span class="text-[var(--color-text-secondary)]">Articles commandés :</span>
      <span class="font-bold text-[var(--color-text-primary)]">{{ order.products?.length || 0 }}</span>
    </div>

    <div class="flex justify-between items-center">
      <div>
        <span class="text-xs text-[var(--color-text-secondary)]">Total</span>
        <div class="text-md font-black text-[var(--color-text-primary)]">{{ formatMoney(order.total) }}</div>
      </div>

      <div class="flex items-center space-x-1.5">
        <router-link 
          :to="`/distributor/orders/${order.id}`"
          class="p-2 bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] rounded-lg transition"
          title="Voir Détails"
        >
          <EyeIcon class="h-4 w-4" />
        </router-link>
        
        <button 
          v-if="order.status === 'PENDING'"
          @click="$emit('validate', order.id)"
          class="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] rounded-lg transition"
        >
          Valider
        </button>
        <button 
          v-if="order.status === 'PENDING'"
          @click="$emit('refuse', order.id)"
          class="px-2.5 py-1.5 bg-red-500 hover:bg-red-600 text-white font-bold text-[11px] rounded-lg transition"
        >
          Refuser
        </button>

        <router-link 
          v-if="order.status === 'VALIDATED'"
          :to="`/distributor/orders/${order.id}/prepare`"
          class="px-2.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-[11px] rounded-lg transition"
        >
          Préparer
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { EyeIcon } from '@heroicons/vue/24/outline';

defineProps({
  order: {
    type: Object,
    required: true
  }
});

defineEmits(['validate', 'refuse']);

const formatDate = (dateVal) => {
  if (!dateVal) return 'N/A';
  const d = new Date(dateVal);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatMoney = (amount) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(amount).replace('XAF', 'FCFA');
};
</script>
