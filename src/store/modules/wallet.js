import { defineStore } from 'pinia';

const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    // Map containing userId -> { balance: Number, transactions: Array }
    wallets: {}
  }),
  actions: {
    ensureWallet(userId) {
      if (!this.wallets[userId]) {
        this.wallets[userId] = {
          balance: 0,
          transactions: []
        };
      }
      return this.wallets[userId];
    },

    getBalance(userId) {
      const wallet = this.ensureWallet(userId);
      return wallet.balance;
    },

    creditWallet(userId, amount, description) {
      const wallet = this.ensureWallet(userId);
      wallet.balance += amount;
      
      const newTransaction = {
        id: generateUUID(),
        type: 'CREDIT',
        amount: amount,
        description: description || 'Dépôt/Crédit',
        date: new Date()
      };
      
      wallet.transactions.unshift(newTransaction);
      return wallet.balance;
    },

    debitWallet(userId, amount, description) {
      const wallet = this.ensureWallet(userId);
      wallet.balance -= amount;

      const newTransaction = {
        id: generateUUID(),
        type: 'DEBIT',
        amount: amount,
        description: description || 'Retrait/Débit',
        date: new Date()
      };

      wallet.transactions.unshift(newTransaction);
      return wallet.balance;
    },

    getTransactions(userId) {
      const wallet = this.ensureWallet(userId);
      return wallet.transactions;
    }
  }
});
