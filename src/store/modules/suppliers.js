import { defineStore } from 'pinia';
import { suppliers } from '@/utils/seed_data.js';

export const useSuppliersStore = defineStore('suppliers', {
  state: () => ({
    suppliers: [...suppliers],
    loading: false,
  }),
  actions: {
    setSuppliers(suppliers) {
      this.suppliers = suppliers;
    }
  }
});
