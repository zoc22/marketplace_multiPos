import { defineStore } from 'pinia';
import { mockInvoices } from '@/utils/mocks/seed.js';

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

export const useInvoicesStore = defineStore('invoices', {
  state: () => ({
    invoices: [...mockInvoices]
  }),
  actions: {
    generateInvoice(invoiceData) {
      const newInvoice = {
        id: generateUUID(),
        reference: invoiceData.reference || `FAC-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`,
        purchase_order_id: invoiceData.purchase_order_id,
        delivery_note_id: invoiceData.delivery_note_id || null,
        emitter_id: invoiceData.emitter_id,
        emitter_type: invoiceData.emitter_type,
        receiver_id: invoiceData.receiver_id,
        receiver_type: invoiceData.receiver_type,
        date_emission: new Date(),
        due_date: invoiceData.due_date ? new Date(invoiceData.due_date) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // J+30
        status: invoiceData.status || 'UNPAID', // 'UNPAID', 'PAID', 'OVERDUE', 'CANCELLED'
        products: invoiceData.products || [],
        subtotal: invoiceData.subtotal || 0,
        tax: invoiceData.tax || 0,
        total: invoiceData.total || 0,
        currency: 'XAF',
        notes: invoiceData.notes || ''
      };

      // Calculate total if not provided
      if (!newInvoice.subtotal && newInvoice.products.length > 0) {
        newInvoice.subtotal = newInvoice.products.reduce((sum, p) => sum + (p.quantity * (p.unit_price || p.price || 0)), 0);
        newInvoice.tax = newInvoice.subtotal * 0.1925; // 19.25% TVA Cameroun
        newInvoice.total = newInvoice.subtotal + newInvoice.tax;
      } else if (!newInvoice.total) {
        newInvoice.total = newInvoice.subtotal + newInvoice.tax;
      }

      this.invoices.push(newInvoice);
      return newInvoice;
    },

    getInvoice(invoiceId) {
      return this.invoices.find(inv => inv.id === invoiceId) || null;
    },

    printInvoice(invoiceId) {
      const inv = this.getInvoice(invoiceId);
      if (inv) {
        console.log(`Impression de la facture ${inv.reference}...`);
        // Simuler l'impression ou ouvrir le print dialog si approprié
        return true;
      }
      return false;
    }
  }
});
