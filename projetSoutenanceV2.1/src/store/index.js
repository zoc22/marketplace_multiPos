import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import piniaLocalPersistence from './plugins/persistence.js';

const pinia = createPinia();

// Add local storage plugins
pinia.use(piniaPluginPersistedstate);
pinia.use(piniaLocalPersistence);

export default pinia;
