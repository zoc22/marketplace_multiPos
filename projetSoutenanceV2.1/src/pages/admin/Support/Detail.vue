<template>
  <div class="space-y-6">
    <div class="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
      <span class="font-mono text-xs text-slate-400 font-bold">Helpdesk individual record route</span>
      <router-link to="/admin/support" class="text-xs text-indigo-400 hover:underline font-mono">&larr; Back to Tickets Board</router-link>
    </div>

    <div v-if="ticketItem" class="bg-[#040817] p-6 border border-[#121c3b] rounded-2xl space-y-4">
      <h2 class="text-sm font-bold font-mono text-slate-100 uppercase">Case: {{ ticketItem.ticketRef }}</h2>
      <p class="text-xs text-slate-400">Subject: <span class="text-slate-100 font-bold font-sans">{{ ticketItem.subject }}</span></p>
      
      <div class="p-4 bg-slate-950 rounded-xl border border-slate-900 text-xs text-slate-300">
        {{ ticketItem.message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { supportTickets } from '@/utils/admin_db.js';

const route = useRoute();
const ticketItem = computed(() => {
  return supportTickets.value.find(t => t.id === route.params.id);
});
</script>
