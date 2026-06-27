import { defineStore } from 'pinia';
import { usePaymentsStore } from './payments.js';
import { useWalletStore } from './wallet.js';
import { mockDisputes } from '@/utils/mocks/seed.js';

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

export const useDisputesStore = defineStore('disputes', {
  state: () => ({
    disputes: [...mockDisputes]
  }),
  actions: {
    createDispute(disputeData) {
      const paymentsStore = usePaymentsStore();
      
      const newDispute = {
        id: generateUUID(),
        reference: disputeData.reference || `DIS-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`,
        escrow_payment_id: disputeData.escrow_payment_id,
        initiator_id: disputeData.initiator_id,
        initiator_type: disputeData.initiator_type,
        reason: disputeData.reason || '',
        description: disputeData.description || '',
        status: 'OPEN',
        resolution: null,
        date_opened: new Date(),
        date_resolved: null
      };

      this.disputes.push(newDispute);

      const payment = paymentsStore.escrowPayments.find(p => p.id === disputeData.escrow_payment_id);
      if (payment) {
        payment.status = 'PENDING_RELEASE'; // Hold it
      }

      return newDispute;
    },

    resolveDispute(disputeId, resolution) {
      const paymentsStore = usePaymentsStore();
      const walletStore = useWalletStore();
      
      const dispute = this.disputes.find(d => d.id === disputeId);
      if (dispute) {
        dispute.status = 'RESOLVED';
        dispute.resolution = resolution;
        dispute.date_resolved = new Date();

        const payment = paymentsStore.escrowPayments.find(p => p.id === dispute.escrow_payment_id);
        if (payment) {
          if (resolution === 'REFUND_FULL') {
            paymentsStore.refundPayment(payment.id);
          } else if (resolution === 'RELEASE_FUNDS') {
            paymentsStore.releasePayment(payment.id);
          } else if (resolution === 'REFUND_PARTIAL') {
            const refundAmount = payment.amount * 0.5;
            const releaseAmount = payment.amount * 0.5;
            
            walletStore.creditWallet(payment.payer_id, refundAmount, `Remboursement partiel litige ${dispute.reference}`);
            walletStore.creditWallet(payment.receiver_id, releaseAmount, `Libération partielle litige ${dispute.reference}`);
            
            payment.status = 'RELEASED';
          }
        }
        return dispute;
      }
      return null;
    },

    getDisputes() {
      return this.disputes;
    }
  }
});
