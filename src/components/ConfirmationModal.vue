<template>
  <transition name="modal">
    <div v-show="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      
      <!-- Tinted Overlay -->
      <div 
        @click="handleBackdropClick" 
        class="fixed inset-0 bg-light-bg-main dark:bg-slate-950/80 backdrop-blur-sm transition-opacity modal-backdrop" 
        aria-hidden="true"
      ></div>

      <!-- Spacing centerer -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <!-- Box Container -->
      <div class="inline-block align-bottom bg-light-bg-main dark:bg-slate-900 rounded-none text-left overflow-hidden shadow-2xl border border-red-900/60 sm:my-8 sm:align-middle sm:max-w-[640px] sm:w-full modal-box relative">
        
        <!-- Red Hazard Top Strip -->
        <div class="h-1.5 bg-gradient-to-r from-red-600 via-orange-500 to-red-600"></div>

        <!-- Absolute Close button -->
        <button 
          @click="closeModal"
          class="absolute top-4 right-4 p-0 bg-transparent text-[#9A9A9A] dark:text-text-sec hover:text-white transition-all duration-200 hover:scale-110 hover:rotate-90 flex items-center justify-center z-10"
          aria-label="Fermer"
        >
          <XMarkIcon class="h-[24px] w-[24px]" aria-hidden="true" />
        </button>

        <div class="bg-light-bg-main dark:bg-slate-900 py-6 px-7">
          <div class="sm:flex sm:items-start">
            
            <!-- Alert Icon -->
            <div class="mx-auto shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-950 text-red-500 border border-red-800/50 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6.5 w-6.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-[20px] font-semibold uppercase font-mono tracking-widest text-red-500" id="modal-title">
                {{ title || 'CONFIRM REJECT / SUSPENSION REQUEST' }}
              </h3>
              
              <div class="mt-2 text-[16px]">
                <p class="text-slate-300 leading-relaxed font-sans">
                  {{ message || 'You are about to execute a destructive platform override. Suspending accounts, freezing escrows, or rejecting files restricts B2B member activity immediately.' }}
                </p>
                
                <div class="mt-2.5 p-3.5 bg-light-bg-main dark:bg-slate-950 border border-red-950/60 rounded-lg text-red-400 text-sm font-mono leading-tight">
                  <span class="font-bold">ALERT:</span> This override is logged in the system audit console. The vendor or operator will receive immediate notification of suspension.
                </div>
              </div>

              <!-- Mandatory justification reasons -->
              <div class="mt-4" v-if="requireReason">
                <label class="block text-[16px] font-mono uppercase tracking-widest text-slate-400 font-bold mb-1.5">
                  Mandatory Justification Reason <span class="text-red-500">*</span>
                </label>
                <textarea
                  v-model="reasonText"
                  rows="3"
                  class="w-full bg-light-bg-main dark:bg-slate-950 border border-slate-800 focus:border-red-500 rounded-none p-2.5 text-[16px] text-slate-100 placeholder-slate-650 font-mono transition focus:outline-none"
                  placeholder="State the regulatory, compliance, or logistics justification for this override (minimum 8 characters)..."
                ></textarea>
                <p v-if="validationError" class="text-sm font-mono text-red-400 mt-1">
                  &times; Please provide a clear, valid justification (min. 8 characters).
                </p>
              </div>

            </div>
          </div>
        </div>

        <!-- Footer Action Buttons -->
        <div class="bg-light-bg-main dark:bg-slate-950 py-6 px-7 sm:flex sm:flex-row-reverse border-t border-slate-900/60">
          <button 
            type="button" 
            :disabled="requireReason && reasonText.trim().length < 8"
            @click="submitConfirm"
            class="w-full inline-flex justify-center rounded-none border border-red-650 px-4 py-2 bg-red-600 hover:bg-red-700 text-[16px] font-mono font-bold uppercase text-white transition focus:outline-none focus:ring-0 sm:ml-3 sm:w-auto disabled:opacity-40 disabled:hover:bg-red-600"
          >
            {{ actionLabel || 'EXECUTE REJECTION / GEL' }}
          </button>
          <button 
            type="button" 
            @click="closeModal"
            class="mt-3 w-full inline-flex justify-center rounded-none border border-slate-800 px-4 py-2 bg-light-bg-main dark:bg-slate-900 hover:bg-slate-850 hover:text-white text-[16px] font-mono font-bold uppercase text-slate-400 transition focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto"
          >
            ABORT OVERRIDE [ ESC ]
          </button>
        </div>

      </div>
    </div>
  </div>
  </transition>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: '' },
  message: { type: String, default: '' },
  actionLabel: { type: String, default: '' },
  requireReason: { type: Boolean, default: true }
});

const emit = defineEmits(['close', 'confirm']);

const reasonText = ref('');
const validationError = ref(false);

// Reset when modal states switch
watch(() => props.show, (newVal) => {
  if (newVal) {
    reasonText.value = '';
    validationError.value = false;
  }
});

function closeModal() {
  emit('close');
}

const handleBackdropClick = (e) => {
  if (e.target === e.currentTarget) {
    closeModal();
  }
};

const handleEscape = (e) => {
  if (e.key === 'Escape' && props.show) {
    closeModal();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape);
});

function submitConfirm() {
  if (props.requireReason && reasonText.value.trim().length < 8) {
    validationError.value = true;
    return;
  }
  emit('confirm', reasonText.value.trim());
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-active .modal-box,
.modal-leave-active .modal-box {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-box,
.modal-leave-to .modal-box {
  opacity: 0;
  transform: translateY(30px);
}
</style>
