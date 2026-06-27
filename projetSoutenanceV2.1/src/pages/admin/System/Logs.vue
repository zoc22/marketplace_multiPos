<template>
  <div class="space-y-6">

    <!-- HEADER BLOCK -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5 shrink-0">
      <div>
        <h1 class="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
          System telemetry & Audit Loggers
        </h1>
        <p class="text-xs text-slate-400 font-sans">Live security audit logging of admin configuration overrides, catalog moderation, and tenant integrations.</p>
      </div>

      <button 
        @click="clearPlatformLogs"
        class="px-3.5 py-2 bg-slate-90 w bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-400 border border-slate-800 transition rounded-lg text-xs font-mono uppercase font-bold shrink-0"
      >
        Clear Logs Block [ &times; ]
      </button>
    </div>

    <!-- LOG CONTROLS AND SEARCH -->
    <div class="flex flex-col sm:flex-row items-center gap-3 bg-[#040817] p-4 rounded-xl border border-slate-900">
      <div class="relative flex-1 w-full font-mono text-xs">
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="Grep specific system logs, actions, authors..."
          class="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-2.5 pl-8 text-xs text-slate-100 placeholder-slate-650"
        />
        <span class="absolute left-3 top-3.5 text-slate-600 font-sans">&telrec;</span>
      </div>

      <select 
        v-model="filterLevel"
        class="bg-slate-950 text-xs text-slate-400 rounded-lg p-2.5 font-mono border border-slate-800 focus:outline-none focus:border-indigo-500 w-full sm:w-48"
      >
        <option value="">All Log Levels</option>
        <option value="info">Info</option>
        <option value="debug">Debug</option>
        <option value="security">Security</option>
        <option value="warning">Warning / Alert</option>
        <option value="danger">Danger Override</option>
      </select>
    </div>

    <!-- MAIN syslog CONSOLE SCREEN -->
    <div class="bg-slate-950 rounded-2xl border border-[#121c3b] overflow-hidden flex flex-col">
      <!-- Console Top Bar -->
      <div class="px-4 py-3 bg-[#090f23] border-b border-slate-900 flex items-center justify-between shrink-0 select-none">
        <div class="flex items-center space-x-2">
          <span class="h-2.5 w-2.5 rounded-full bg-red-500"></span>
          <span class="h-2.5 w-2.5 rounded-full bg-yellow-500"></span>
          <span class="h-2.5 w-2.5 rounded-full bg-green-500"></span>
          <span class="pl-2 font-mono text-[10px] text-slate-450 uppercase font-bold text-slate-400 uppercase tracking-widest leading-none">ROOT@AFRI_CENTRAL_B2B_SYS_STDOUT</span>
        </div>
        <span class="text-[9px] font-mono text-emerald-500 uppercase tracking-widest font-semibold animate-pulse mr-1">● live feed</span>
      </div>

      <!-- Live logs console list -->
      <div class="p-6 font-mono text-xs space-y-3 max-h-[500px] overflow-y-auto bg-slate-955 bg-[#01040f] scrollbar-thin scroll-smooth text-slate-300">
        <div v-if="filteredLogs.length === 0" class="text-slate-600 italic text-center p-6">
          &lt;&lt; No syslog records matching the grep directives found &gt;&gt;
        </div>
        <div 
          v-else
          v-for="log in filteredLogs" 
          :key="log.id"
          class="flex flex-col sm:flex-row sm:items-start text-left gap-1 sm:gap-4 hover:bg-slate-900/40 p-1.5 rounded transition"
        >
          <!-- Timestamp segment -->
          <span class="text-slate-600 shrink-0 select-none">[{{ formatDateTime(log.date) }}]</span>
          
          <div class="flex-1 space-y-0.5">
            <div class="flex flex-wrap items-center gap-1.5">
              <!-- Action Badge -->
              <span class="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded font-bold text-[8px] uppercase tracking-wider text-slate-350 select-none">
                {{ log.action }}
              </span>
              <!-- Author -->
              <span class="text-[9px] text-[#4d97e8] font-bold">@{{ log.author }}</span>
              <!-- Level badge -->
              <span :class="getLevelColor(log.level || 'info')" class="text-[8.5px] font-extrabold uppercase ml-auto">
                {{ log.level || 'info' }}
              </span>
            </div>
            <!-- Message line -->
            <p class="text-slate-300 font-sans text-xs pt-1 leading-relaxed leading-snug">
              {{ log.details }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- TERMINAL METRIC FOOTER -->
    <div class="text-[10px] text-slate-650 font-mono flex items-center justify-between px-1 select-none text-slate-550">
      <span>Active Nodes Sync: OK</span>
      <span>Total grepped entries: {{ filteredLogs.length }} syslog blocks</span>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { systemLogs } from '@/utils/admin_db.js';

const searchQuery = ref('');
const filterLevel = ref('');

const filteredLogs = computed(() => {
  return systemLogs.value.filter(lg => {
    if (filterLevel.value && lg.level !== filterLevel.value) return false;

    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      const matchAction = lg.action.toLowerCase().includes(q);
      const matchDetails = lg.details.toLowerCase().includes(q);
      const matchAuthor = lg.author.toLowerCase().includes(q);
      return matchAction || matchDetails || matchAuthor;
    }

    return true;
  });
});

function formatDateTime(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return d.toISOString().replace('T', ' ').slice(11, 19);
}

function getLevelColor(lvl) {
  const map = {
    info: 'text-indigo-400',
    debug: 'text-slate-500',
    security: 'text-red-400 font-bold',
    warning: 'text-orange-400',
    danger: 'text-red-500 font-extrabold'
  };
  return map[lvl] || 'text-slate-400';
}

function clearPlatformLogs() {
  systemLogs.value = [
    { id: 'log_clear', action: 'LOGS_CLEARED', details: 'System logs buffer manually cleared by Supervisor credentials.', author: 'Admin Supervisor', date: new Date().toISOString(), level: 'security' }
  ];
}
</script>
