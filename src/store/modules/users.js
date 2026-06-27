import { defineStore } from 'pinia';
import { clients } from '@/utils/seed_data.js';

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [...clients],
  }),
  actions: {
    setUsers(users) {
      this.users = users;
    }
  }
});
