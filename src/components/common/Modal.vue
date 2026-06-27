<template>
  <transition name="modal">
    <div v-show="show" class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Backdrop overlay -->
      <div 
        @click="handleBackdropClick" 
        class="fixed inset-0 bg-white dark:bg-slate-950/80 backdrop-blur-sm transition-opacity modal-backdrop" 
        aria-hidden="true"
      ></div>

      <!-- Spacing aligner -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <!-- Box Container -->
      <div 
        class="inline-block align-bottom bg-white dark:bg-slate-900 text-left overflow-hidden shadow-2xl border border-slate-800 rounded-none sm:my-8 sm:align-middle w-full modal-box"
        :class="large ? 'sm:max-w-[896px]' : 'sm:max-w-[640px]'"
      >
        <!-- Accent Top Strip -->
        <div class="h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600"></div>

        <!-- Inner Content -->
        <div class="bg-white dark:bg-slate-900 py-6 px-7 relative">
          <!-- Absolute Close button -->
          <button 
            @click="closeModal"
            class="absolute top-4 right-4 p-0 bg-transparent text-[#9A9A9A] dark:text-[#7A7A7A] hover:text-white transition-all duration-200 hover:scale-110 hover:rotate-90 flex items-center justify-center"
            aria-label="Fermer"
          >
            <XMarkIcon class="h-[24px] w-[24px]" aria-hidden="true" />
          </button>

          <div class="sm:flex sm:items-start">
            <!-- Alert Icon if warning is true -->
            <div 
              v-if="warning"
              class="mx-auto shrink-0 flex items-center justify-center h-12 w-12 bg-red-950 text-red-500 border border-red-900/50 sm:mx-0 sm:h-10 sm:w-10"
            >
              <ExclamationTriangleIcon class="h-6 w-6" aria-hidden="true" />
            </div>

            <div class="mt-3 text-center sm:mt-0" :class="warning ? 'sm:ml-4 sm:text-left' : 'w-full'">
              <h3 class="text-[20px] font-semibold uppercase font-mono tracking-widest text-slate-100 flex items-center justify-center sm:justify-start" id="modal-title">
                <slot name="title">Modal Window</slot>
              </h3>
              
              <div class="mt-4 text-[16px] text-slate-300 leading-relaxed font-sans">
                <slot name="content"></slot>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="bg-white dark:bg-slate-950 py-6 px-7 sm:flex sm:flex-row-reverse border-t border-slate-800 text-[16px]">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
    </div>
  </transition>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline';

defineProps({
  show: { type: Boolean, default: false },
  warning: { type: Boolean, default: false },
  large: { type: Boolean, default: false }
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};

const handleBackdropClick = (e) => {
  if (e.target === e.currentTarget) {
    closeModal();
  }
};

const handleEscape = (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape);
});
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
