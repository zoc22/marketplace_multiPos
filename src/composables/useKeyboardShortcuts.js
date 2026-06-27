import { ref, onMounted, onUnmounted } from 'vue';

const isHelpDrawerOpen = ref(false);

/**
 * Composable to manage keyboard shortcuts globally or contextually.
 */
export function useKeyboardShortcuts(shortcuts = {}) {

  const handleKeyDown = (e) => {
    // Avoid triggering shortcuts inside input / textarea elements except for specific ones (like escape)
    const isInputActive = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);

    // Escape Key
    if (e.key === 'Escape') {
      if (isHelpDrawerOpen.value) {
        e.preventDefault();
        isHelpDrawerOpen.value = false;
      }
      if (shortcuts.escape) {
        e.preventDefault();
        shortcuts.escape();
      }
      return;
    }

    if (isInputActive && e.key !== 'Enter') {
      // Do not intercept hotkeys while typing in inputs
      return;
    }

    // Ctrl + Key actions
    if (e.ctrlKey || e.metaKey) {
      const key = e.key.toLowerCase();
      if (key === 'k') {
        if (shortcuts.ctrlK) {
          e.preventDefault();
          shortcuts.ctrlK();
        }
      } else if (key === 'n') {
        if (shortcuts.ctrlN) {
          e.preventDefault();
          shortcuts.ctrlN();
        }
      } else if (key === 's') {
        if (shortcuts.ctrlS) {
          e.preventDefault();
          shortcuts.ctrlS();
        }
      }
      return;
    }

    // Alt + Numbers 1-9 (navigation)
    if (e.altKey) {
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 9) {
        if (shortcuts.altNum) {
          e.preventDefault();
          shortcuts.altNum(num);
        }
      }
      return;
    }

    // Single keys
    if (e.key === '/') {
      if (shortcuts.slash) {
        e.preventDefault();
        shortcuts.slash();
      }
    } else if (e.key === '?' || e.key === 'h' || e.key === 'H') {
      e.preventDefault();
      isHelpDrawerOpen.value = !isHelpDrawerOpen.value;
      if (shortcuts.questionMark) {
        shortcuts.questionMark();
      }
    }
  };

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
