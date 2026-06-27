import { defineStore } from 'pinia';
import { rfqQuotes, rfqOffers } from '@/utils/seed_data.js';

export const useRfqStore = defineStore('rfq', {
  state: () => ({
    quotes: [...rfqQuotes],
    offers: [...rfqOffers],
  }),
  actions: {
    setQuotes(quotes) {
      this.quotes = quotes;
    }
  }
});
