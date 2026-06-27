import { defineStore } from 'pinia';
import { suppliers } from '@/utils/seed_data.js';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [], // Array of { product: Object, quantity: Number }
    wishlist: [], // Array of products
    compareList: [], // Array of products (max 3)
  }),
  actions: {
    addToCart(product, quantity = 1) {
      const existing = this.items.find(item => item.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        existing.quantity = product.stock ? Math.min(newQty, product.stock) : newQty;
      } else {
        this.items.push({
          product,
          quantity: product.stock ? Math.min(quantity, product.stock) : quantity
        });
      }
    },
    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.product.id === productId);
      if (item) {
        if (quantity <= 0) {
          this.removeFromCart(productId);
        } else {
          item.quantity = item.product.stock ? Math.min(quantity, item.product.stock) : quantity;
        }
      }
    },
    removeFromCart(productId) {
      this.items = this.items.filter(item => item.product.id !== productId);
    },
    clearCart() {
      this.items = [];
    },
    
    // --- WISHLIST MANAGEMENT ---
    toggleWishlist(product) {
      const existsIdx = this.wishlist.findIndex(p => p.id === product.id);
      if (existsIdx > -1) {
        this.wishlist.splice(existsIdx, 1);
        return false; // Removed
      } else {
        this.wishlist.push(product);
        return true; // Added
      }
    },
    isInWishlist(productId) {
      return this.wishlist.some(p => p.id === productId);
    },

    // --- COMPARISON MANAGEMENT ---
    toggleCompare(product) {
      const existsIdx = this.compareList.findIndex(p => p.id === product.id);
      if (existsIdx > -1) {
        this.compareList.splice(existsIdx, 1);
        return 'removed';
      } else {
        if (this.compareList.length >= 3) {
          return 'full'; // Limit exceeded
        }
        this.compareList.push(product);
        return 'added';
      }
    },
    isInCompare(productId) {
      return this.compareList.some(p => p.id === productId);
    },
    clearCompare() {
      this.compareList = [];
    }
  },
  getters: {
    totalItems() {
      return this.items.reduce((acc, item) => acc + item.quantity, 0);
    },
    totalAmount() {
      return this.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    },
    // Grouping by supplierId dynamic seller sub-baskets
    cartGroupedBySupplier() {
      const groups = {};
      this.items.forEach(item => {
        const sId = item.product.supplierId || 'unknown_supplier';
        // Try looking up in the verified suppliers array
        const found = suppliers.find(s => s.id === sId);
        const sName = found ? found.name : 'Coopérative Agro-B2B du Cameroun';
        
        if (!groups[sId]) {
          groups[sId] = {
            supplierId: sId,
            supplierName: sName,
            items: [],
            subtotal: 0
          };
        }
        groups[sId].items.push(item);
        groups[sId].subtotal += item.product.price * item.quantity;
      });
      return Object.values(groups);
    }
  },
  persist: true
});

