<template>
  <div 
    class="p-4 border-b border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition duration-150 flex items-start space-x-3.5 relative group"
    :class="[!notification.read ? 'bg-emerald-500/[0.02] border-l-2 border-l-emerald-500' : '']"
  >
    <!-- Icon Container -->
    <div :class="['p-2 rounded-xl shrink-0', iconBgClass]">
      <component :is="iconComponent" class="h-5 w-5" :class="iconTextClass" />
    </div>

    <!-- Info Column -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between">
        <span class="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          {{ typeLabel }}
        </span>
        <span class="text-[10px] font-mono text-slate-500">
          {{ formatTime(notification.created_at) }}
        </span>
      </div>
      <p class="mt-1 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-medium">
        {{ notification.message }}
      </p>

      <!-- Deep link button -->
      <div class="mt-2 flex items-center space-x-2">
        <router-link 
          v-if="targetLink"
          :to="targetLink"
          class="text-xs font-mono uppercase font-bold text-emerald-500 hover:text-emerald-400 transition flex items-center"
        >
          <span>Consulter</span>
          <ArrowRightIcon class="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </router-link>

        <button
          v-if="!notification.read"
          @click.stop="$emit('mark-read', notification.id)"
          class="text-xs font-mono uppercase font-bold text-slate-500 hover:text-slate-300 transition"
        >
          Marquer comme lu
        </button>
      </div>
    </div>

    <!-- Status dot -->
    <span 
      v-if="!notification.read" 
      class="absolute top-4 right-4 h-2 w-2 rounded-full bg-emerald-500 animate-pulse"
    ></span>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { 
  DocumentPlusIcon,
  CheckIcon,
  XCircleIcon,
  DocumentDuplicateIcon,
  TruckIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline';

const props = defineProps({
  notification: {
    type: Object,
    required: true
  }
});

defineEmits(['mark-read']);

const typeLabel = computed(() => {
  switch (props.notification.type) {
    case 'ORDER_CREATED': return 'Commande Créée';
    case 'ORDER_VALIDATED': return 'Commande Validée';
    case 'ORDER_REFUSED': return 'Commande Refusée';
    case 'ORDER_MODIFIED': return 'Commande Modifiée';
    case 'DELIVERY_GENERATED': return 'Livraison Créée';
    case 'DELIVERY_CONFIRMED': return 'Livraison Validée';
    case 'PAYMENT_ESCROWED': return 'Fonds Séquestrés';
    case 'PAYMENT_RELEASED': return 'Fonds Libérés';
    case 'PAYMENT_REFUNDED': return 'Remboursement';
    default: return 'Notification';
  }
});

const iconComponent = computed(() => {
  switch (props.notification.type) {
    case 'ORDER_CREATED': return DocumentPlusIcon;
    case 'ORDER_VALIDATED': return CheckIcon;
    case 'ORDER_REFUSED': return XCircleIcon;
    case 'ORDER_MODIFIED': return DocumentDuplicateIcon;
    case 'DELIVERY_GENERATED': return TruckIcon;
    case 'DELIVERY_CONFIRMED': return CheckBadgeIcon;
    case 'PAYMENT_ESCROWED': return ShieldCheckIcon;
    case 'PAYMENT_RELEASED': return ShieldCheckIcon;
    case 'PAYMENT_REFUNDED': return ArrowPathIcon;
    default: return DocumentPlusIcon;
  }
});

const iconBgClass = computed(() => {
  switch (props.notification.type) {
    case 'ORDER_CREATED':
    case 'ORDER_MODIFIED':
      return 'bg-blue-500/10 dark:bg-blue-950/20';
    case 'ORDER_VALIDATED':
    case 'DELIVERY_CONFIRMED':
    case 'PAYMENT_RELEASED':
      return 'bg-emerald-500/10 dark:bg-emerald-950/20';
    case 'ORDER_REFUSED':
    case 'PAYMENT_REFUNDED':
      return 'bg-rose-500/10 dark:bg-rose-950/20';
    case 'DELIVERY_GENERATED':
      return 'bg-indigo-500/10 dark:bg-indigo-950/20';
    case 'PAYMENT_ESCROWED':
      return 'bg-amber-500/10 dark:bg-amber-950/20';
    default:
      return 'bg-slate-550/10 dark:bg-slate-950/20';
  }
});

const iconTextClass = computed(() => {
  switch (props.notification.type) {
    case 'ORDER_CREATED':
    case 'ORDER_MODIFIED':
      return 'text-blue-500 dark:text-blue-400';
    case 'ORDER_VALIDATED':
    case 'DELIVERY_CONFIRMED':
    case 'PAYMENT_RELEASED':
      return 'text-emerald-500 dark:text-emerald-400';
    case 'ORDER_REFUSED':
    case 'PAYMENT_REFUNDED':
      return 'text-rose-500 dark:text-rose-400';
    case 'DELIVERY_GENERATED':
      return 'text-indigo-500 dark:text-indigo-400';
    case 'PAYMENT_ESCROWED':
      return 'text-amber-500 dark:text-amber-400';
    default:
      return 'text-slate-400';
  }
});

const targetLink = computed(() => {
  // Check pathname or determine based on role if needed
  // Since we don't have user roles explicitly in notifications, we can look at the notification type
  const type = props.notification.type;
  
  if (['PAYMENT_ESCROWED', 'PAYMENT_RELEASED', 'PAYMENT_REFUNDED'].includes(type)) {
    return '/admin/escrow';
  }
  if (type === 'DELIVERY_GENERATED') {
    return '/buyer/delivery-notes';
  }
  // Otherwise order detail page
  return '/buyer/orders';
});

function formatTime(val) {
  if (!val) return '';
  const date = new Date(val);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) + ' - ' + date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}
</script>
