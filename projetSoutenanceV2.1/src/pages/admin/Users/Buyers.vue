<template>
  <div class="space-y-6">
    <div class="p-6 bg-[#040817] border border-[#121c3b] rounded-2xl space-y-4">
      <h1 class="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono">B2B Verified Buyers</h1>
      <p class="text-xs text-slate-400">View contact and volume profiles of retail buying chains.</p>

      <div class="space-y-2">
        <div v-for="u in buyersList" :key="u.id" class="p-3 bg-slate-950 rounded-xl flex items-center justify-between text-xs font-mono text-slate-350">
          <div>
            <strong class="text-slate-200">{{ u.company || u.name }}</strong>
            <span class="block text-[10px] text-slate-500">{{ u.email }} &bull; {{ u.phone || 'No Phone' }}</span>
          </div>
          <span class="px-2 py-0.5 bg-sky-950 text-sky-400 text-[9px] rounded font-bold">BUYER</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/store/modules/auth.js';

const authStore = useAuthStore();
const buyersList = computed(() => {
  return authStore.users.filter(u => u.roles.includes('buyer'));
});
</script>
