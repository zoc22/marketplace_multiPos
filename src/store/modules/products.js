import { defineStore } from 'pinia';
import { mockProducts } from '@/utils/mocks/products.js';

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [...mockProducts],
    loading: false,
    error: null,
  }),
  actions: {
    setProducts(products) {
      this.products = products;
    },
    adjustStock(productId, amount) {
      const prod = this.products.find(p => p.id === productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock + amount);
        return prod;
      }
      return null;
    }
  }
});
