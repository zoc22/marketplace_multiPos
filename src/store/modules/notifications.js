import { defineStore } from 'pinia';
import { mockNotifications } from '@/utils/mocks/seed.js';

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

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [...mockNotifications],
  }),
  getters: {
    unreadCount(state) {
      return state.notifications.filter(n => !n.read).length;
    }
  },
  actions: {
    addNotification(notif) {
      this.notifications.unshift(notif);
    },
    clearNotifications() {
      this.notifications = [];
    },
    sendNotification({ type, emitter_id, receiver_id, order_ref, amount, customMessage }) {
      let message = '';
      
      switch (type) {
        case 'ORDER_CREATED':
          message = `Un nouveau bon de commande (${order_ref || 'N/A'}) a été créé pour un montant de ${amount ? amount.toLocaleString('fr-FR') + ' XAF' : 'N/A'}.`;
          break;
        case 'ORDER_VALIDATED':
          message = `Le bon de commande (${order_ref || 'N/A'}) a été validé avec succès.`;
          break;
        case 'ORDER_REFUSED':
          message = `Le bon de commande (${order_ref || 'N/A'}) a été refusé.`;
          break;
        case 'ORDER_MODIFIED':
          message = `Le bon de commande (${order_ref || 'N/A'}) a été modifié.`;
          break;
        case 'DELIVERY_GENERATED':
          message = `Un bon de livraison a été généré pour la commande (${order_ref || 'N/A'}).`;
          break;
        case 'DELIVERY_CONFIRMED':
          message = `La livraison pour la commande (${order_ref || 'N/A'}) a été confirmée par le destinataire.`;
          break;
        case 'PAYMENT_ESCROWED':
          message = `Un paiement séquestre de ${amount ? amount.toLocaleString('fr-FR') + ' XAF' : 'N/A'} a été sécurisé pour la commande (${order_ref || 'N/A'}).`;
          break;
        case 'PAYMENT_RELEASED':
          message = `Les fonds de ${amount ? amount.toLocaleString('fr-FR') + ' XAF' : 'N/A'} pour la commande (${order_ref || 'N/A'}) ont été libérés.`;
          break;
        case 'PAYMENT_REFUNDED':
          message = `Le paiement séquestre de ${amount ? amount.toLocaleString('fr-FR') + ' XAF' : 'N/A'} pour la commande (${order_ref || 'N/A'}) a été remboursé.`;
          break;
        default:
          message = customMessage || `Nouvelle notification de type ${type}.`;
      }

      const notif = {
        id: generateUUID(),
        type,
        emitter_id,
        receiver_id,
        message,
        read: false,
        created_at: new Date()
      };

      this.addNotification(notif);
      return notif;
    },
    getUnreadCount() {
      return this.notifications.filter(n => !n.read).length;
    },
    markAsRead(notificationId) {
      const notif = this.notifications.find(n => n.id === notificationId);
      if (notif) {
        notif.read = true;
      }
    }
  }
});
