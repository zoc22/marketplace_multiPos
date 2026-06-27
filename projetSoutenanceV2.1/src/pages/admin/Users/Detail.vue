<template>
  <div class="space-y-6">
    <div class="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
      <span class="font-mono text-xs text-slate-400 font-bold">User profile route</span>
      <router-link to="/admin/users" class="text-xs text-indigo-400 hover:underline font-mono">&larr; Back to Security Board</router-link>
    </div>

    <div v-if="userItem" class="bg-[#040817] p-6 border border-[#121c3b] rounded-2xl space-y-4">
      <h2 class="text-sm font-bold font-mono text-slate-100 uppercase">{{ userItem.name }}</h2>
      <p class="text-xs text-slate-300">Mail ID: {{ userItem.email }} &bull; Affiliated: {{ userItem.company }}</p>
      
      <div class="p-4 bg-slate-950 rounded-xl border border-slate-900 text-xs text-slate-350 space-y-1 font-mono">
        <div>Registered On: {{ userItem.created_at || 'Jan 2026' }}</div>
        <div>Tenant Subdomain: {{ userItem.tenant || 'None' }}</div>
        <div>Current Status: <span class="text-emerald-400 uppercase font-bold">{{ userItem.status }}</span></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth.js';

const route = useRoute();
const authStore = useAuthStore();
const userItem = computed(() => {
  return authStore.users.find(u => u.id === route.params.id);
});
</script>
