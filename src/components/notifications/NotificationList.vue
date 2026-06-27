<template>
  <div class="space-y-4 font-sans">
    <!-- Filter bar -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
      <div class="flex flex-wrap items-center gap-2">
        <!-- Type Filter Button Groups -->
        <button 
          v-for="typeOpt in typeOptions" 
          :key="typeOpt.value"
          @click="selectedType = typeOpt.value"
          class="px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition"
          :class="[
            selectedType === typeOpt.value 
              ? 'bg-emerald-500 text-white shadow-md' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-650 hover:bg-slate-200 dark:hover:bg-slate-750'
          ]"
        >
          {{ typeOpt.label }}
        </button>
      </div>

      <div class="flex items-center space-x-3 w-full md:w-auto justify-end">
        <!-- Date Selector -->
        <select 
          v-model="selectedDateRange"
          class="bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-emerald-500 rounded-xl px-3 py-1.5 text-xs font-mono font-bold uppercase text-slate-350 transition focus:outline-none"
        >
          <option value="all">Toutes dates</option>
          <option value="today">Aujourd'hui</option>
          <option value="week">Cette semaine</option>
        </select>

        <!-- Mark all as read -->
        <button 
          @click="markAllAsRead"
          class="px-4 py-1.5 border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-400 rounded-xl text-xs font-mono font-bold uppercase transition shrink-0"
        >
          Tout marquer lu
        </button>
      </div>
    </div>

    <!-- Notification Feed -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      <div v-if="filteredNotifications.length > 0" class="divide-y divide-slate-100 dark:divide-slate-850">
        <NotificationItem 
          v-for="notif in filteredNotifications" 
          :key="notif.id" 
          :notification="notif" 
          @mark-read="markRead"
        />
      </div>

      <div v-else class="text-center py-12 p-6">
        <div class="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3.5 text-slate-400">
          <BellIcon class="h-6 w-6" />
        </div>
        <h4 class="text-sm font-bold text-slate-800 dark:text-slate-300 uppercase font-mono">Aucune notification</h4>
        <p class="text-xs text-slate-500 mt-1 font-mono">
          Aucun événement ne correspond à vos critères de recherche actuels.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useNotificationsStore } from '@/store/modules/notifications.js';
import NotificationItem from './NotificationItem.vue';
import { BellIcon } from '@heroicons/vue/24/outline';

const notificationsStore = useNotificationsStore();

const selectedType = ref('all');
const selectedDateRange = ref('all');

const typeOptions = [
  { label: 'Tous', value: 'all' },
  { label: 'Commandes', value: 'orders' },
  { label: 'Livraisons', value: 'deliveries' },
  { label: 'Finances', value: 'finances' }
];

const filteredNotifications = computed(() => {
  let list = [...notificationsStore.notifications];

  // Filter by Type
  if (selectedType.value !== 'all') {
    if (selectedType.value === 'orders') {
      list = list.filter(n => ['ORDER_CREATED', 'ORDER_VALIDATED', 'ORDER_REFUSED', 'ORDER_MODIFIED'].includes(n.type));
    } else if (selectedType.value === 'deliveries') {
      list = list.filter(n => ['DELIVERY_GENERATED', 'DELIVERY_CONFIRMED'].includes(n.type));
    } else if (selectedType.value === 'finances') {
      list = list.filter(n => ['PAYMENT_ESCROWED', 'PAYMENT_RELEASED', 'PAYMENT_REFUNDED'].includes(n.type));
    }
  }

  // Filter by Date
  if (selectedDateRange.value !== 'all') {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (selectedDateRange.value === 'today') {
      list = list.filter(n => new Date(n.created_at) >= startOfToday);
    } else if (selectedDateRange.value === 'week') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      list = list.filter(n => new Date(n.created_at) >= oneWeekAgo);
    }
  }

  return list;
});

function markRead(id) {
  notificationsStore.markAsRead(id);
}

function markAllAsRead() {
  notificationsStore.notifications.forEach(n => {
    n.read = true;
  });
}
</script>
