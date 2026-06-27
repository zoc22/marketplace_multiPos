import { defineStore } from 'pinia';

export const useExpensesStore = defineStore('expenses', {
  state: () => ({
    expenses: [],
  }),
  actions: {
    setExpenses(expenses) {
      this.expenses = expenses;
    }
  }
});
