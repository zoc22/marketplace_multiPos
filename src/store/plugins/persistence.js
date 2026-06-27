export default function piniaLocalPersistence(context) {
  const { store } = context;
  
  // Load initial state
  const savedState = localStorage.getItem(`pinia_${store.$id}`);
  if (savedState) {
    try {
      store.$patch(JSON.parse(savedState));
    } catch (e) {
      console.error(`Failed to load persisted state for ${store.$id}`, e);
    }
  }

  // Subscribe to changes
  store.$subscribe((mutation, state) => {
    try {
      localStorage.setItem(`pinia_${store.$id}`, JSON.stringify(state));
    } catch (e) {
      console.error(`Failed to persist state for ${store.$id}`, e);
    }
  });
}
