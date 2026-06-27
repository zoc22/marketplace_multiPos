import { defineStore } from 'pinia';
import { stores } from '@/utils/seed_data.js';

export const useStoresStore = defineStore('stores', {
  state: () => ({
    stores: [...stores],
    currentStore: null,
  }),
  actions: {
    setStores(stores) {
      this.stores = stores;
    },
    setCurrentStore(store) {
      this.currentStore = store;
    }
  }
});
