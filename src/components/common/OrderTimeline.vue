<template>
  <div class="flow-root font-mono">
    <ul role="list" class="-mb-8">
      <li v-for="(step, stepIdx) in steps" :key="step.name">
        <div class="relative pb-8">
          <!-- Connector line -->
          <span 
            v-if="stepIdx !== steps.length - 1" 
            class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-800" 
            aria-hidden="true"
          ></span>
          
          <div class="relative flex space-x-3">
            <!-- Icon Bubble -->
            <div>
              <span 
                :class="[
                  step.active 
                    ? 'bg-emerald-500 text-white shadow-lg ring-4 ring-emerald-500/20' 
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-800',
                  'h-8 w-8 rounded-full flex items-center justify-center'
                ]"
              >
                <component :is="step.icon" class="h-5 w-5" aria-hidden="true" />
              </span>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
              <div>
                <p class="text-sm font-bold" :class="step.active ? 'text-slate-900 dark:text-white' : 'text-slate-500'">
                  {{ step.name }}
                </p>
                <p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  {{ step.description }}
                </p>
              </div>
              <div class="text-right text-xs whitespace-nowrap text-slate-400 dark:text-slate-500 font-mono">
                <span v-if="step.date">{{ formatDate(step.date) }}</span>
                <span v-else class="italic text-slate-600">En attente</span>
              </div>
            </div>

          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { 
  DocumentPlusIcon,
  CheckIcon,
  WrenchIcon,
  TruckIcon,
  CheckBadgeIcon
} from '@heroicons/vue/24/outline';

const props = defineProps({
  status: { type: String, required: true },
  dates: { type: Object, default: () => ({}) } 
  // Object with: emission, validation, processing, transit, delivery
});

const steps = computed(() => {
  const currentStatus = props.status.toUpperCase();
  
  // Status check variables
  const isCreated = true; // Always true if order exists
  const isValidated = ['VALIDATED', 'VALIDÉ', 'PROCESSING', 'EN_TRAITEMENT', 'PREPARED', 'PRÉPARÉ', 'IN_TRANSIT', 'EN_TRANSIT', 'DELIVERED', 'LIVRÉ'].includes(currentStatus);
  const isProcessing = ['PROCESSING', 'EN_TRAITEMENT', 'PREPARED', 'PRÉPARÉ', 'IN_TRANSIT', 'EN_TRANSIT', 'DELIVERED', 'LIVRÉ'].includes(currentStatus);
  const isTransit = ['IN_TRANSIT', 'EN_TRANSIT', 'DELIVERED', 'LIVRÉ'].includes(currentStatus);
  const isDelivered = ['DELIVERED', 'LIVRÉ'].includes(currentStatus);

  return [
    {
      name: 'Commande Émise',
      description: 'Le bon de commande a été envoyé au fournisseur.',
      icon: DocumentPlusIcon,
      active: isCreated,
      date: props.dates.emission || new Date()
    },
    {
      name: 'Commande Validée',
      description: 'Le fournisseur a accepté et validé le bon de commande.',
      icon: CheckIcon,
      active: isValidated,
      date: props.dates.validation || (isValidated ? (props.dates.validation || new Date()) : null)
    },
    {
      name: 'En Préparation',
      description: 'Les articles sont en cours de conditionnement.',
      icon: WrenchIcon,
      active: isProcessing,
      date: props.dates.processing || (isProcessing ? (props.dates.processing || new Date()) : null)
    },
    {
      name: 'En Cours d\'Expédition',
      description: 'Le colis a été remis au transporteur et est en transit.',
      icon: TruckIcon,
      active: isTransit,
      date: props.dates.transit || (isTransit ? (props.dates.transit || new Date()) : null)
    },
    {
      name: 'Livraison Confirmée',
      description: 'L\'acheteur a réceptionné et signé la livraison.',
      icon: CheckBadgeIcon,
      active: isDelivered,
      date: props.dates.delivery || (isDelivered ? (props.dates.delivery || new Date()) : null)
    }
  ];
});

function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}
</script>
