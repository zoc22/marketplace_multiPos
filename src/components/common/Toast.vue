<template>
  <transition name="toast-fade">
    <div 
      v-if="show"
      class="fixed top-6 right-6 z-50 flex items-center justify-between px-5 py-4 bg-white dark:bg-slate-900 border text-[15px] font-sans shadow-xl max-w-sm w-full rounded-none"
      :class="borderClass"
      role="alert"
      aria-live="assertive"
    >
      <div class="flex items-center space-x-3">
        <component :is="statusIcon" class="h-6 w-6 shrink-0" :class="iconClass" aria-hidden="true" />
        <p class="text-slate-100 font-semibold">{{ message }}</p>
      </div>

      <button 
        @click="$emit('close')"
        class="text-slate-500 hover:text-white p-1 ml-4"
        aria-label="Dismiss notification"
      >
        <XMarkIcon class="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon, 
  XMarkIcon 
} from '@heroicons/vue/24/outline';

const props = defineProps({
  show: { type: Boolean, default: false },
  message: { type: String, default: '' },
  type: { type: String, default: 'info' } // success, warning, info
});

defineEmits(['close']);

const statusIcon = computed(() => {
  if (props.type === 'success') return CheckCircleIcon;
  if (props.type === 'warning') return ExclamationTriangleIcon;
  return InformationCircleIcon;
});

const borderClass = computed(() => {
  if (props.type === 'success') return 'border-emerald-900/60';
  if (props.type === 'warning') return 'border-amber-900/40';
  return 'border-slate-800';
});

const iconClass = computed(() => {
  if (props.type === 'success') return 'text-emerald-500';
  if (props.type === 'warning') return 'text-amber-500';
  return 'text-cyan-405';
});
</script>

<style scoped>
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all var(--transition-duration-normal) var(--transition-timing);
}
.toast-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
