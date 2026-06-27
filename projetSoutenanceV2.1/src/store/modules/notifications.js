import { defineStore } from 'pinia';

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [],
  }),
  actions: {
    addNotification(notif) {
      this.notifications.unshift(notif);
    },
    clearNotifications() {
      this.notifications = [];
    }
  }
});
