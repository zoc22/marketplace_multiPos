import { defineStore } from 'pinia';
import { warehouses, stocks } from '@/utils/seed_data.js';

export const useWarehousesStore = defineStore('warehouses', {
  state: () => ({
    warehouses: [...warehouses],
    stocks: [...stocks], // FIFO stocks
  }),
  actions: {
    setWarehouses(warehouses) {
      this.warehouses = warehouses;
    }
  }
});
