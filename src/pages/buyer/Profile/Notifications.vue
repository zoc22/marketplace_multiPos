<template>
  <div class="space-y-6 max-w-4xl mx-auto" id="buyer-notifications">
    <!-- Header -->
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)] font-mono uppercase tracking-wide">Notifications d'Entreprise</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Gérez vos alertes de commandes, livraisons et transactions financières.</p>
      </div>
      <button 
        @click="clearAll"
        class="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-xs font-mono uppercase font-bold transition border border-red-500/35"
      >
        Effacer tout l'historique
      </button>
    </div>

    <!-- Layout Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- Notification settings (1 col) -->
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm space-y-4 h-fit">
        <h3 class="font-bold text-sm text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2 uppercase font-mono">Canaux de Réception</h3>
        
        <div class="space-y-4 text-xs font-bold text-[var(--color-text-secondary)]">
          <label class="flex items-center space-x-3 cursor-pointer">
            <input type="checkbox" v-model="channels.email" class="rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)] h-4.5 w-4.5 border-[var(--color-border)] bg-[var(--color-background)]" />
            <span>Alertes par Email</span>
          </label>
          <label class="flex items-center space-x-3 cursor-pointer">
            <input type="checkbox" v-model="channels.sms" class="rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)] h-4.5 w-4.5 border-[var(--color-border)] bg-[var(--color-background)]" />
            <span>Alertes par SMS</span>
          </label>
          <label class="flex items-center space-x-3 cursor-pointer">
            <input type="checkbox" v-model="channels.push" class="rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)] h-4.5 w-4.5 border-[var(--color-border)] bg-[var(--color-background)]" />
            <span>Notifications Push Web</span>
          </label>
        </div>
      </div>

      <!-- History of alerts (2 cols) -->
      <div class="md:col-span-2">
        <NotificationList />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useNotificationsStore } from '@/store/modules/notifications.js';
import { useToast } from 'vue-toastification';
import NotificationList from '@/components/notifications/NotificationList.vue';

const toast = useToast();
const notificationsStore = useNotificationsStore();

const channels = ref({
  email: true,
  sms: false,
  push: true
});

function clearAll() {
  notificationsStore.clearNotifications();
  toast.info('Historique des notifications effacé.');
}
</script>
