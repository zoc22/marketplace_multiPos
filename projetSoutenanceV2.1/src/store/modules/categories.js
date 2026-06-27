import { defineStore } from 'pinia';
import { categories } from '@/utils/seed_data.js';

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [...categories],
    loading: false,
  }),
  actions: {
    setCategories(categories) {
      this.categories = categories;
    }
  }
});
