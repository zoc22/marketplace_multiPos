<template>
  <div class="relative inline-block text-left" ref="bellContainer">
    <!-- Bell icon trigger button -->
    <button 
      @click="isDropdownOpen = !isDropdownOpen"
      class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-905 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-emerald-400 transition relative flex items-center"
      title="Notifications Système"
      aria-label="View notifications alert desk"
    >
      <BellIcon class="h-5 w-5" :class="unreadCount > 0 ? 'animate-swing text-emerald-400' : ''" aria-hidden="true" />
      <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold font-mono h-4.5 w-4.5 rounded-full flex items-center justify-center">
        {{ unreadCount }}
      </span>
    </button>

    <!-- Dropdown overlay -->
    <transition name="dropdown">
      <div 
        v-show="isDropdownOpen" 
        class="origin-top-right absolute right-0 mt-2.5 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-55 overflow-hidden font-sans"
      >
        <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-950">
          <span class="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Alertes ({{ unreadCount }} non lues)
          </span>
          <button 
            v-if="unreadCount > 0"
            @click="markAllRead" 
            class="text-[10px] font-mono font-bold text-emerald-500 hover:text-emerald-400 uppercase transition"
          >
            Tout lire
          </button>
        </div>

        <!-- Notification list -->
        <div class="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-850">
          <p v-if="notifications.length === 0" class="text-center py-8 text-xs font-mono text-slate-500 italic">
            Aucune alerte.
          </p>
          <div 
            v-for="notif in notifications.slice(0, 5)" 
            :key="notif.id"
            class="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-905 transition relative group"
            :class="[!notif.read ? 'bg-emerald-500/[0.01]' : '']"
          >
            <div class="flex items-start justify-between gap-2">
              <p class="text-xs text-slate-700 dark:text-slate-300 leading-tight">
                {{ notif.message }}
              </p>
              <button 
                v-if="!notif.read"
                @click.stop="markRead(notif.id)"
                class="text-[9px] font-mono text-slate-400 hover:text-white shrink-0 uppercase font-bold"
              >
                Lu
              </button>
            </div>
            <p class="text-[9px] font-mono text-slate-500 mt-1">
              {{ formatTime(notif.created_at) }}
            </p>
          </div>
        </div>

        <!-- Footer link -->
        <router-link 
          to="/buyer/notifications"
          @click="isDropdownOpen = false"
          class="block text-center py-2.5 bg-slate-50 dark:bg-slate-955 text-xs font-mono font-bold text-emerald-500 hover:text-emerald-400 border-t border-slate-100 dark:border-slate-850 transition"
        >
          Voir toutes les notifications
        </router-link>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useNotificationsStore } from '@/store/modules/notifications.js';
import { useAuthStore } from '@/store/modules/auth.js';
import { BellIcon } from '@heroicons/vue/24/outline';

const authStore = useAuthStore();
const notificationsStore = useNotificationsStore();
const isDropdownOpen = ref(false);
const bellContainer = ref(null);

const notifications = computed(() => {
  return notificationsStore.notifications.filter(n => 
    !n.receiver_id || n.receiver_id === authStore.user?.id || n.receiver_id === authStore.user?.tenant
  );
});
const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length;
});

function handleClickOutside(event) {
  if (bellContainer.value && !bellContainer.value.contains(event.target)) {
    isDropdownOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

function markRead(id) {
  notificationsStore.markAsRead(id);
}

function markAllRead() {
  notificationsStore.notifications.forEach(n => {
    n.read = true;
  });
}

function formatTime(val) {
  if (!val) return '';
  const date = new Date(val);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}
</script>

<style scoped>
@keyframes swing {
  0%, 100% { transform: rotate(0); }
  20% { transform: rotate(15deg); }
  40% { transform: rotate(-10deg); }
  60% { transform: rotate(5deg); }
  80% { transform: rotate(-5deg); }
}
.animate-swing {
  animation: swing 1.5s ease infinite;
  transform-origin: top center;
}
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease-out;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-5px);
}
</style>
