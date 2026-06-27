import { onMounted, onUnmounted, ref } from 'vue';
import { useTheme } from './useTheme.js';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

export const isHelpDrawerOpen = ref(false);

export function useKeyboardShortcuts() {
  const { toggleTheme } = useTheme();
  const router = useRouter();
  const toast = useToast();

  function handleKeyDown(event) {
    // Skip shortcut logic if the active element is an input, textarea or editable area
    const activeEl = document.activeElement;
    if (activeEl) {
      const tag = activeEl.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || activeEl.isContentEditable) {
        return;
      }
    }

    const key = event.key.toLowerCase();

    // 't' -> Toggle dark/light theme
    if (key === 't') {
      event.preventDefault();
      toggleTheme();
      toast.success(
        `Workspace theme swapped!`,
        { timeout: 1500 }
      );
    }

    // 'h' -> Toggle help/keyboard shortcuts drawer info
    if (key === 'h') {
      event.preventDefault();
      isHelpDrawerOpen.value = !isHelpDrawerOpen.value;
    }

    // 'escape' -> Close help list, modals or overlays
    if (event.key === 'Escape') {
      isHelpDrawerOpen.value = false;
    }

    // 'g' then 'd' -> Go to Dashboard (Quick redirect)
    if (key === 'd') {
      event.preventDefault();
      router.push('/');
      toast.info('Routing to main portal index...', { timeout: 1500 });
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });

  return {
    isHelpDrawerOpen
  };
}
