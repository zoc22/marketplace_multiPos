import { defineStore } from 'pinia';
import { products } from '@/utils/seed_data.js';

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [...products],
    loading: false,
    error: null,
  }),
  actions: {
    setProducts(products) {
      this.products = products;
    }
  }
});
