import { defineStore } from 'pinia';
import { transactions } from '@/utils/seed_data.js';

export const usePaymentsStore = defineStore('payments', {
  state: () => ({
    escrows: [...transactions.filter(t => t.status === "Escrow_Held")],
    paymentMethods: [
      { id: "m_mtn", type: "Mobile_Money", gate: "MTN MoMo API", active: true },
      { id: "m_om", type: "Mobile_Money", gate: "Orange Money API", active: true },
      { id: "m_afriland", type: "Bank_Direct", gate: "Afriland Sawa Online", active: true },
      { id: "m_eu", type: "Local_Voucher", gate: "Express Union Flash", active: true }
    ],
  }),
  actions: {
    setEscrows(escrows) {
      this.escrows = escrows;
    }
  }
});
