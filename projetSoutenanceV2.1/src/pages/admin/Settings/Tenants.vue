<template>
  <div class="space-y-6">
    <div class="p-[#040817] p-6 bg-[#040817] border border-[#121c3b] rounded-2xl space-y-4">
      <h1 class="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono">B2B Tenant Subdomain Registrations</h1>
      <p class="text-xs text-slate-400">Review multi-tenant B2B portals, dedicated supplier subdomains, and DNS mapping status.</p>

      <div class="space-y-2 pt-2">
        <div v-for="t in authStore.tenants" :key="t.id" class="p-3 bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-between text-xs font-mono">
          <div>
            <span class="font-bold text-slate-150 text-slate-200">{{ t.name }}</span>
            <span class="block text-[9px] text-slate-450 text-indigo-400">{{ t.id }}.enterprise.local</span>
          </div>
          <span class="px-2 py-0.5 rounded text-[9px]" :class="t.active ? 'bg-emerald-950 text-emerald-450 border border-emerald-900/50' : 'bg-red-950 text-red-500'">
            {{ t.active ? 'DNS_RESOLVED' : 'INACTIVE' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/store/modules/auth.js';
const authStore = useAuthStore();
</script>
