<template>
  <transition name="fade">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div 
        class="bg-white dark:bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl transform transition-all duration-300 scale-100"
        role="dialog" 
        aria-modal="true"
      >
        <!-- Top accent line -->
        <div :class="['h-1.5 w-full bg-gradient-to-r', accentClass]"></div>

        <div class="p-6">
          <div class="flex items-start space-x-4">
            <!-- Icon Dynamic based on type -->
            <div :class="['p-3 rounded-full shrink-0', iconBgClass]">
              <component :is="activeIcon" class="h-6 w-6" :class="iconTextClass" />
            </div>

            <div class="flex-1 min-w-0">
              <h3 class="text-base font-bold text-slate-900 dark:text-white truncate font-mono uppercase tracking-wider">
                {{ title }}
              </h3>
              <p class="mt-2 text-sm text-slate-500 dark:text-slate-450 leading-relaxed font-sans">
                {{ message }}
              </p>

              <!-- Optional custom text justification input (e.g. for modifications or rejection notes) -->
              <div v-if="requireReason" class="mt-4">
                <label class="block text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-1.5">
                  {{ reasonLabel || 'Motif / Justification' }} <span class="text-red-500">*</span>
                </label>
                <textarea
                  v-model="reasonText"
                  rows="3"
                  class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-350 dark:border-slate-850 focus:border-emerald-500 rounded-xl p-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-500 font-mono transition focus:outline-none"
                  :placeholder="reasonPlaceholder || 'Saisissez une justification...'"
                ></textarea>
                <p v-if="validationError" class="text-xs font-mono text-rose-500 mt-1">
                  &times; Une justification valide est requise (min. 5 caractères).
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="bg-slate-50 dark:bg-slate-950 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 border-t border-slate-100 dark:border-slate-850">
          <button 
            type="button" 
            @click="cancel"
            class="px-4 py-2 border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-400 rounded-xl text-xs font-mono uppercase font-bold transition flex items-center justify-center"
          >
            {{ cancelLabel || 'Annuler' }}
          </button>
          <button 
            type="button" 
            @click="confirm"
            :disabled="requireReason && reasonText.trim().length < 5"
            :class="['px-4 py-2 text-white rounded-xl text-xs font-mono uppercase font-bold transition flex items-center justify-center disabled:opacity-40', buttonClass]"
          >
            {{ confirmLabel || 'Confirmer' }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { 
  ExclamationTriangleIcon, 
  InformationCircleIcon, 
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline';

const props = defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: 'Confirmation requise' },
  message: { type: String, default: 'Êtes-vous sûr de vouloir effectuer cette action ?' },
  confirmLabel: { type: String, default: 'Confirmer' },
  cancelLabel: { type: String, default: 'Annuler' },
  type: { type: String, default: 'warning' }, // 'warning' | 'danger' | 'success' | 'info'
  requireReason: { type: Boolean, default: false },
  reasonLabel: { type: String, default: 'Motif / Justification' },
  reasonPlaceholder: { type: String, default: 'Saisissez une justification...' }
});

const emit = defineEmits(['close', 'confirm']);

const reasonText = ref('');
const validationError = ref(false);

watch(() => props.show, (newVal) => {
  if (newVal) {
    reasonText.value = '';
    validationError.value = false;
  }
});

const activeIcon = computed(() => {
  switch (props.type) {
    case 'danger': return XCircleIcon;
    case 'success': return CheckCircleIcon;
    case 'info': return InformationCircleIcon;
    case 'warning':
    default:
      return ExclamationTriangleIcon;
  }
});

const accentClass = computed(() => {
  switch (props.type) {
    case 'danger': return 'from-red-500 to-rose-600';
    case 'success': return 'from-emerald-500 to-teal-600';
    case 'info': return 'from-sky-500 to-blue-600';
    case 'warning':
    default:
      return 'from-amber-500 to-orange-600';
  }
});

const iconBgClass = computed(() => {
  switch (props.type) {
    case 'danger': return 'bg-rose-500/10 dark:bg-rose-950/20';
    case 'success': return 'bg-emerald-500/10 dark:bg-emerald-950/20';
    case 'info': return 'bg-sky-500/10 dark:bg-sky-950/20';
    case 'warning':
    default:
      return 'bg-amber-500/10 dark:bg-amber-950/20';
  }
});

const iconTextClass = computed(() => {
  switch (props.type) {
    case 'danger': return 'text-rose-500 dark:text-rose-400';
    case 'success': return 'text-emerald-500 dark:text-emerald-400';
    case 'info': return 'text-sky-500 dark:text-sky-400';
    case 'warning':
    default:
      return 'text-amber-500 dark:text-amber-400';
  }
});

const buttonClass = computed(() => {
  switch (props.type) {
    case 'danger': return 'bg-rose-600 hover:bg-rose-700';
    case 'success': return 'bg-emerald-600 hover:bg-emerald-700';
    case 'info': return 'bg-sky-600 hover:bg-sky-700';
    case 'warning':
    default:
      return 'bg-amber-600 hover:bg-amber-700';
  }
});

function cancel() {
  emit('close');
}

function confirm() {
  if (props.requireReason && reasonText.value.trim().length < 5) {
    validationError.value = true;
    return;
  }
  emit('confirm', props.requireReason ? reasonText.value.trim() : null);
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
