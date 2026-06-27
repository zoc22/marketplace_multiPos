import { defineStore } from 'pinia';
import { transactions } from '@/utils/seed_data.js';

export const useFinanceStore = defineStore('finance', {
  state: () => ({
    balances: {
      'techsupplies': 89254000,
      'globalsolar': 41200000,
      'agrocorp': 154784900
    },
    payoutRules: [
      { id: 'rule_1', type: 'Instant_Mobile_Money', limitXAF: 500000, feePercent: 1.0 },
      { id: 'rule_2', type: 'Bank_Wire_Afriland', limitXAF: 25000000, feePercent: 0.1 }
    ],
    transactions: [...transactions]
  }),
  actions: {
    setBalance(tenantId, amount) {
      this.balances[tenantId] = amount;
    }
  }
});
