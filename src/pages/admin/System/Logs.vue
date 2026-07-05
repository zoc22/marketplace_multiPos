<template>
  <div class="space-y-6">

    <!-- HEADER BLOCK -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5 shrink-0">
      <div>
        <h1 class="text-xl font-bold font-mono text-[var(--color-text-primary)] flex items-center gap-2">
          <CommandLineIcon class="w-5 h-5 text-[var(--color-primary)]" />
          <span>Télémétrie Système & Journaux d'Audit</span>
        </h1>
        <p class="text-xs text-[var(--color-text-secondary)] font-sans">Journalisation d'audit de sécurité en direct pour les modifications de configuration de l'administrateur, la modération du catalogue et l'intégration des locataires.</p>
      </div>

      <button 
        @click="clearPlatformLogs"
        class="px-3.5 py-2.5 bg-[var(--color-surface-elevated)] hover:bg-red-500/10 text-[var(--color-text-secondary)] hover:text-red-500 border border-[var(--color-border)] transition rounded-lg text-xs font-mono uppercase font-bold shrink-0 flex items-center space-x-1.5 cursor-pointer"
      >
        <TrashIcon class="w-4 h-4" />
        <span>Effacer les Journaux</span>
      </button>
    </div>

    <!-- LOG CONTROLS AND SEARCH -->
    <div class="flex flex-col sm:flex-row items-center gap-3 bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border)]">
      <div class="relative flex-1 w-full font-mono text-xs">
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="Rechercher des journaux système, actions, auteurs..."
          class="w-full bg-[var(--color-background)] border border-[var(--color-border)] focus:border-[var(--color-primary)] rounded-lg p-2.5 pl-8 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none"
        />
        <span class="absolute left-3 top-3.5 text-[var(--color-text-secondary)]">
          <MagnifyingGlassIcon class="w-4 h-4" />
        </span>
      </div>

      <select 
        v-model="filterLevel"
        class="bg-[var(--color-background)] text-xs text-[var(--color-text-secondary)] rounded-lg p-2.5 font-mono border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] w-full sm:w-48"
      >
        <option value="">Tous les Niveaux</option>
        <option value="info">Info</option>
        <option value="debug">Débogage</option>
        <option value="security">Sécurité</option>
        <option value="warning">Avertissement</option>
        <option value="danger">Danger</option>
      </select>
    </div>

    <!-- MAIN syslog CONSOLE SCREEN -->
    <div class="bg-[var(--color-background)] rounded-2xl border border-[var(--color-border)] overflow-hidden flex flex-col">
      <!-- Console Top Bar -->
      <div class="px-4 py-3 bg-[var(--color-surface-elevated)] border-b border-[var(--color-border)] flex items-center justify-between shrink-0 select-none">
        <div class="flex items-center space-x-2">
          <span class="h-2.5 w-2.5 rounded-full bg-red-500"></span>
          <span class="h-2.5 w-2.5 rounded-full bg-yellow-500"></span>
          <span class="h-2.5 w-2.5 rounded-full bg-green-500"></span>
          <span class="pl-2 font-mono text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest leading-none">ROOT@AFRI_CENTRAL_B2B_SYS_STDOUT</span>
        </div>
        <span class="text-[9px] font-mono text-emerald-500 uppercase tracking-widest font-semibold animate-pulse mr-1">&bull; Flux en Direct</span>
      </div>

      <!-- Live logs console list -->
      <div class="p-6 font-mono text-xs space-y-3 max-h-[500px] overflow-y-auto bg-[var(--color-background)] scrollbar-thin scroll-smooth text-[var(--color-text-primary)]">
        <div v-if="filteredLogs.length === 0" class="text-[var(--color-text-secondary)] italic text-center p-6">
          &lt;&lt; Aucun journal ne correspond aux critères de recherche &gt;&gt;
        </div>
        <div 
          v-else
          v-for="log in filteredLogs" 
          :key="log.id"
          class="flex flex-col sm:flex-row sm:items-start text-left gap-1 sm:gap-4 hover:bg-[var(--color-surface-hover)] p-1.5 rounded transition"
        >
          <!-- Timestamp segment -->
          <span class="text-[var(--color-text-secondary)] shrink-0 select-none">[{{ formatDateTime(log.date) }}]</span>
          
          <div class="flex-1 space-y-0.5">
            <div class="flex flex-wrap items-center gap-1.5">
              <!-- Action Badge -->
              <span class="px-1.5 py-0.5 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded font-bold text-[8px] uppercase tracking-wider text-[var(--color-text-secondary)] select-none">
                {{ log.action }}
              </span>
              <!-- Author -->
              <span class="text-[9px] text-[var(--color-primary)] font-bold">@{{ log.author }}</span>
              <!-- Level badge -->
              <span :class="getLevelColor(log.level || 'info')" class="text-[8.5px] font-extrabold uppercase ml-auto">
                {{ log.level === 'info' ? 'Info' : log.level === 'debug' ? 'Débogage' : log.level === 'security' ? 'Sécurité' : log.level === 'warning' ? 'Avertissement' : 'Danger' }}
              </span>
            </div>
            <!-- Message line -->
            <p class="text-[var(--color-text-primary)] font-sans text-xs pt-1 leading-snug">
              {{ log.details }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- TERMINAL METRIC FOOTER -->
    <div class="text-[10px] text-[var(--color-text-secondary)] font-mono flex items-center justify-between px-1 select-none">
      <span>Synchronisation des Nœuds : OK</span>
      <span>Entrées filtrées : {{ filteredLogs.length }} lignes</span>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { systemLogs } from '@/utils/admin_db.js';
import { 
  CommandLineIcon, 
  TrashIcon, 
  MagnifyingGlassIcon 
} from '@heroicons/vue/24/outline';

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
    info: 'text-[var(--color-primary)]',
    debug: 'text-[var(--color-text-secondary)]',
    security: 'text-red-500 font-bold',
    warning: 'text-orange-500',
    danger: 'text-red-600 font-extrabold'
  };
  return map[lvl] || 'text-[var(--color-text-secondary)]';
}

function clearPlatformLogs() {
  systemLogs.value = [
    { id: 'log_clear', action: 'LOGS_CLEARED', details: 'Mémoire tampon des journaux effacée manuellement par le Superviseur.', author: 'Superviseur Admin', date: new Date().toISOString(), level: 'security' }
  ];
}
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgba(var(--color-text-primary), 0.1);
  border-radius: 2px;
}
</style>
