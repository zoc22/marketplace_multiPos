import { ref, onMounted } from 'vue';

const isLightTheme = ref(localStorage.getItem('isLightTheme') === 'true');

export function useTheme() {
  function applyTheme() {
    if (isLightTheme.value) {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }

  function toggleTheme() {
    isLightTheme.value = !isLightTheme.value;
    localStorage.setItem('isLightTheme', String(isLightTheme.value));
    applyTheme();
  }

  // Set the theme when the applet boots
  onMounted(() => {
    applyTheme();
  });

  return {
    isLightTheme,
    toggleTheme,
    applyTheme
  };
}
