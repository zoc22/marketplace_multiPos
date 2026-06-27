import { defineStore } from 'pinia';
import { transactions } from '@/utils/seed_data.js';
import { mockEscrowPayments } from '@/utils/mocks/seed.js';
import { useNotificationsStore } from './notifications.js';
import { useWalletStore } from './wallet.js';

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

export const usePaymentsStore = defineStore('payments', {
  state: () => ({
    escrows: [...transactions.filter(t => t.status === "Escrow_Held")],
    escrowPayments: [...mockEscrowPayments],
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
    },

    initiatePayment(paymentData) {
      const newPayment = {
        id: generateUUID(),
        reference: paymentData.reference || `ESC-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`,
        purchase_order_id: paymentData.purchase_order_id,
        payer_id: paymentData.payer_id,
        payer_type: paymentData.payer_type, // 'buyer' | 'vendor' | 'distributor'
        receiver_id: paymentData.receiver_id,
        receiver_type: paymentData.receiver_type, // 'vendor' | 'distributor'
        amount: paymentData.amount,
        currency: 'XAF',
        status: 'INITIATED',
        date_initiated: new Date(),
        date_escrowed: null,
        date_released: null,
        date_refunded: null,
        dispute_deadline: null
      };

      this.escrowPayments.push(newPayment);
      return newPayment;
    },

    escrowPayment(paymentId) {
      const notificationsStore = useNotificationsStore();
      const walletStore = useWalletStore();
      const p = this.escrowPayments.find(pay => pay.id === paymentId);
      if (p) {
        p.status = 'ESCROWED';
        p.date_escrowed = new Date();
        
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 3);
        p.dispute_deadline = deadline;

        walletStore.debitWallet(p.payer_id, p.amount, `Séquestre pour la commande ${p.purchase_order_id || p.reference}`);

        notificationsStore.sendNotification({
          type: 'PAYMENT_ESCROWED',
          emitter_id: p.payer_id,
          receiver_id: p.receiver_id,
          amount: p.amount,
          order_ref: p.reference
        });
        return p;
      }
      return null;
    },

    releasePayment(paymentId) {
      const notificationsStore = useNotificationsStore();
      const walletStore = useWalletStore();
      const p = this.escrowPayments.find(pay => pay.id === paymentId);
      if (p) {
        p.status = 'RELEASED';
        p.date_released = new Date();

        walletStore.creditWallet(p.receiver_id, p.amount, `Libération séquestre pour la commande ${p.purchase_order_id || p.reference}`);

        notificationsStore.sendNotification({
          type: 'PAYMENT_RELEASED',
          emitter_id: p.payer_id,
          receiver_id: p.receiver_id,
          amount: p.amount,
          order_ref: p.reference
        });
        return p;
      }
      return null;
    },

    refundPayment(paymentId) {
      const notificationsStore = useNotificationsStore();
      const walletStore = useWalletStore();
      const p = this.escrowPayments.find(pay => pay.id === paymentId);
      if (p) {
        p.status = 'REFUNDED';
        p.date_refunded = new Date();

        walletStore.creditWallet(p.payer_id, p.amount, `Remboursement séquestre pour la commande ${p.purchase_order_id || p.reference}`);

        notificationsStore.sendNotification({
          type: 'PAYMENT_REFUNDED',
          emitter_id: p.receiver_id,
          receiver_id: p.payer_id,
          amount: p.amount,
          order_ref: p.reference
        });
        return p;
      }
      return null;
    }
  }
});
