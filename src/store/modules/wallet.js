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
    wallets: {
      'usr_admin': {
        balance: 100000000,
        transactions: [{ id: 'tx_init_admin', type: 'CREDIT', amount: 100000000, description: 'Solde initial système', date: new Date('2026-01-10T12:00:00Z') }]
      },
      'usr_buyer_1': {
        balance: 500000,
        transactions: [
          { id: 'tx_init_buyer1', type: 'CREDIT', amount: 500000, description: 'Approvisionnement initial MoMo', date: new Date('2026-03-20T10:15:00Z') }
        ]
      },
      'usr_buyer_2': {
        balance: 500000,
        transactions: [
          { id: 'tx_init_buyer2', type: 'CREDIT', amount: 500000, description: 'Approvisionnement initial Orange Money', date: new Date('2026-03-21T11:30:00Z') }
        ]
      },
      'usr_vendor_1': {
        balance: 2000000,
        transactions: [
          { id: 'tx_init_vendor1', type: 'CREDIT', amount: 2000000, description: 'Fonds de roulement de départ', date: new Date('2026-05-10T10:15:00Z') }
        ]
      },
      'usr_vendor_2': {
        balance: 1500000,
        transactions: [
          { id: 'tx_init_vendor2', type: 'CREDIT', amount: 1500000, description: 'Fonds de roulement de départ', date: new Date('2026-05-12T09:40:00Z') }
        ]
      },
      'usr_dist_1': {
        balance: 5000000,
        transactions: [
          { id: 'tx_init_dist1', type: 'CREDIT', amount: 5000000, description: 'Dépôt capital B2B', date: new Date('2026-04-20T08:30:00Z') }
        ]
      },
      'usr_dist_2': {
        balance: 10000000,
        transactions: [
          { id: 'tx_init_dist2', type: 'CREDIT', amount: 10000000, description: 'Dépôt capital B2B', date: new Date('2026-04-22T14:50:00Z') }
        ]
      }
    }
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
