<template>
  <div class="space-y-6">
    <div class="p-6 bg-[#040817] border border-[#121c3b] rounded-2xl space-y-4">
      <h1 class="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono">B2B Verified Suppliers Catalog</h1>
      <p class="text-xs text-slate-400">View and audit general contact records of registered material cooperative unions.</p>

      <div class="space-y-2">
        <div v-for="u in suppliersList" :key="u.id" class="p-3 bg-slate-950 rounded-xl flex items-center justify-between text-xs font-mono text-slate-350">
          <div>
            <strong class="text-slate-200">{{ u.company }}</strong>
            <span class="block text-[10px] text-slate-500">{{ u.name }} &bull; {{ u.email }}</span>
          </div>
          <span class="px-2 py-0.5 bg-indigo-950 text-indigo-400 text-[9px] rounded font-bold">SUPPLIER</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/store/modules/auth.js';

const authStore = useAuthStore();
const suppliersList = computed(() => {
  return authStore.users.filter(u => u.roles.includes('supplier'));
});
</script>
