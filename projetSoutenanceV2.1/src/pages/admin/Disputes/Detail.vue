<template>
  <div class="space-y-6">
    <div class="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
      <span class="font-mono text-xs text-slate-400">Dossier details route</span>
      <router-link to="/admin/disputes" class="text-xs text-indigo-400 hover:underline font-mono">&larr; Back to Disputes Board</router-link>
    </div>

    <div v-if="disputedItem" class="bg-[#040817] p-6 border border-[#121c3b] rounded-2xl space-y-4">
      <h2 class="text-sm font-bold font-mono text-slate-100 uppercase">Case: {{ disputedItem.disputeRef }}</h2>
      <p class="text-xs text-slate-300">Party Conflict: {{ disputedItem.buyer }} versus {{ disputedItem.supplier }}</p>
      
      <div class="p-4 bg-slate-950 rounded-xl border border-slate-900 text-xs text-slate-300">
        {{ disputedItem.description }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { disputes } from '@/utils/admin_db.js';

const route = useRoute();
const disputedItem = computed(() => {
  return disputes.value.find(d => d.id === route.params.id);
});
</script>
