import { defineStore } from 'pinia';
import { orders } from '@/utils/seed_data.js';

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [...orders],
    loading: false,
  }),
  actions: {
    setOrders(orders) {
      this.orders = orders;
    }
  }
});
