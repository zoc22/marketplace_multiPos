import { defineStore } from 'pinia';
import { orders } from '@/utils/seed_data.js';
import { mockPurchaseOrders, mockDeliveryNotes } from '@/utils/mocks/seed.js';
import { useNotificationsStore } from './notifications.js';
import { useProductsStore } from './products.js';
import { usePaymentsStore } from './payments.js';

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

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [...orders],
    purchaseOrders: [...mockPurchaseOrders],
    deliveryNotes: [...mockDeliveryNotes],
    loading: false,
  }),
  actions: {
    setOrders(orders) {
      this.orders = orders;
    },
    
    createPurchaseOrder(orderData) {
      const notificationsStore = useNotificationsStore();
      
      const newPO = {
        id: generateUUID(),
        reference: orderData.reference || `BC-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`,
        emitter_id: orderData.emitter_id,
        emitter_type: orderData.emitter_type, // 'buyer' | 'vendor' | 'distributor'
        receiver_id: orderData.receiver_id,
        receiver_type: orderData.receiver_type, // 'vendor' | 'distributor'
        date_emission: new Date(),
        date_livraison_souhaitee: orderData.date_livraison_souhaitee ? new Date(orderData.date_livraison_souhaitee) : null,
        status: orderData.status || 'PENDING',
        products: orderData.products || [], // Array of {product_id, quantity, unit_price, total}
        total: orderData.products ? orderData.products.reduce((sum, p) => sum + (p.total || (p.quantity * p.unit_price)), 0) : 0,
        currency: 'XAF',
        notes: orderData.notes || '',
        shipping_address: orderData.shipping_address || '',
        payment_method: orderData.payment_method || '',
        shipping_mode: orderData.shipping_mode || ''
      };

      this.purchaseOrders.push(newPO);

      notificationsStore.sendNotification({
        type: 'ORDER_CREATED',
        emitter_id: newPO.emitter_id,
        receiver_id: newPO.receiver_id,
        order_ref: newPO.reference,
        amount: newPO.total
      });

      return newPO;
    },

    validatePurchaseOrder(orderId) {
      const notificationsStore = useNotificationsStore();
      const po = this.purchaseOrders.find(o => o.id === orderId);
      if (po) {
        po.status = 'VALIDATED';
        notificationsStore.sendNotification({
          type: 'ORDER_VALIDATED',
          emitter_id: po.receiver_id,
          receiver_id: po.emitter_id,
          order_ref: po.reference,
          amount: po.total
        });
        return po;
      }
      return null;
    },

    refusePurchaseOrder(orderId) {
      const notificationsStore = useNotificationsStore();
      const po = this.purchaseOrders.find(o => o.id === orderId);
      if (po) {
        po.status = 'REFUSED';
        notificationsStore.sendNotification({
          type: 'ORDER_REFUSED',
          emitter_id: po.receiver_id,
          receiver_id: po.emitter_id,
          order_ref: po.reference,
          amount: po.total
        });
        return po;
      }
      return null;
    },

    modifyPurchaseOrder(orderId, updatedData) {
      const notificationsStore = useNotificationsStore();
      const po = this.purchaseOrders.find(o => o.id === orderId);
      if (po) {
        Object.assign(po, updatedData);
        if (updatedData.products) {
          po.total = updatedData.products.reduce((sum, p) => sum + (p.total || (p.quantity * p.unit_price)), 0);
        }
        notificationsStore.sendNotification({
          type: 'ORDER_MODIFIED',
          emitter_id: po.emitter_id,
          receiver_id: po.receiver_id,
          order_ref: po.reference,
          amount: po.total
        });
        return po;
      }
      return null;
    },

    generateDeliveryNote(poId, deliveryNoteData) {
      const notificationsStore = useNotificationsStore();
      const productsStore = useProductsStore();
      const po = this.purchaseOrders.find(o => o.id === poId);
      if (po) {
        po.status = 'Packed';
        const newDN = {
          id: generateUUID(),
          reference: deliveryNoteData.reference || `BL-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`,
          purchase_order_id: poId,
          emitter_id: deliveryNoteData.emitter_id || po.receiver_id,
          emitter_type: deliveryNoteData.emitter_type || po.receiver_type,
          receiver_id: deliveryNoteData.receiver_id || po.emitter_id,
          receiver_type: deliveryNoteData.receiver_type || po.emitter_type,
          date_emission: new Date(),
          date_livraison: deliveryNoteData.date_livraison ? new Date(deliveryNoteData.date_livraison) : null,
          status: 'IN_TRANSIT',
          products: deliveryNoteData.products || po.products.map(p => ({
            product_id: p.product_id,
            quantity_delivered: p.quantity,
            unit_price: p.unit_price,
            total: p.total || (p.quantity * p.unit_price),
            lot_number: deliveryNoteData.lot_number || `LOT-${Date.now().toString().slice(-4)}`
          })),
          carrier: deliveryNoteData.carrier || 'Logistique Express',
          tracking_number: deliveryNoteData.tracking_number || `TRK-${Math.floor(Math.random() * 900000 + 100000)}`,
          shipping_mode: deliveryNoteData.shipping_mode || po.shipping_mode || 'Routier Pro',
          signature: deliveryNoteData.signature || '',
          photo_proof: deliveryNoteData.photo_proof || ''
        };
        this.deliveryNotes.push(newDN);

        // Decrease seller's stock
        newDN.products.forEach(p => {
          productsStore.adjustStock(p.product_id, -p.quantity_delivered);
        });

        notificationsStore.sendNotification({
          type: 'DELIVERY_GENERATED',
          emitter_id: newDN.emitter_id,
          receiver_id: newDN.receiver_id,
          order_ref: po.reference,
          amount: po.total
        });

        return newDN;
      }
      return null;
    },

    confirmDelivery(deliveryNoteId) {
      const notificationsStore = useNotificationsStore();
      const productsStore = useProductsStore();
      const dn = this.deliveryNotes.find(n => n.id === deliveryNoteId);
      if (dn) {
        dn.status = 'DELIVERED';
        dn.date_livraison = new Date();
        const po = this.purchaseOrders.find(o => o.id === dn.purchase_order_id);
        if (po) {
          po.status = 'DELIVERED';
          
          // Increase buyer's stock if they are a vendor or distributor
          if (po.emitter_type === 'vendor' || po.emitter_type === 'distributor') {
            dn.products.forEach(item => {
              // Find buyer's own product with same name/category or matching id
              const sourceProduct = productsStore.products.find(p => p.id === item.product_id);
              if (sourceProduct) {
                // Find if the buyer already has a product with similar name
                const buyerProduct = productsStore.products.find(p => 
                  p.supplierId === po.emitter_id && 
                  (p.name.toLowerCase() === sourceProduct.name.toLowerCase() || p.category === sourceProduct.category)
                );
                if (buyerProduct) {
                  productsStore.adjustStock(buyerProduct.id, item.quantity_delivered);
                } else {
                  // Fallback: increase stock of original or copy it
                  productsStore.adjustStock(item.product_id, item.quantity_delivered);
                }
              }
            });
          }

          // Trigger Payment status update to PENDING (EN_ATTENTE)
          const paymentsStore = usePaymentsStore();
          const payment = paymentsStore.escrowPayments.find(p => p.purchase_order_id === po.id || p.order_id === po.id);
          if (payment) {
            payment.status = 'PENDING';
          }
        }
        notificationsStore.sendNotification({
          type: 'DELIVERY_CONFIRMED',
          emitter_id: dn.receiver_id,
          receiver_id: dn.emitter_id,
          order_ref: po ? po.reference : 'Inconnu',
          amount: po ? po.total : 0
        });
        return dn;
      }
      return null;
    }
  }
});
