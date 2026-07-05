<template>
  <div class="space-y-6">
    
    <!-- En-tête -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
          <CpuChipIcon class="w-5 h-5 text-[var(--color-primary)]" />
          <span>Moniteur de Télémétrie Système en Temps Réel</span>
        </h1>
        <p class="text-xs text-[var(--color-text-secondary)] mt-1">Flux en direct des métriques de charge CPU, d'allocation mémoire RAM, de sockets actifs et de latence réseau.</p>
      </div>

      <div class="flex items-center space-x-2 bg-[var(--color-surface)] px-3.5 py-2 border border-[var(--color-border)] rounded-xl">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span class="text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-wider">Connexion WS Stable</span>
      </div>
    </div>

    <!-- GRILLE DES MÉTRIQUES -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <!-- CHARGE CPU -->
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm">
        <div class="flex justify-between items-start">
          <div>
            <span class="text-[10px] uppercase font-mono text-[var(--color-text-secondary)] font-bold block">Charge CPU</span>
            <span class="text-2xl font-bold font-mono text-[var(--color-text-primary)] mt-1 block">{{ cpuValue }}%</span>
          </div>
          <div class="p-2 bg-[var(--color-primary-muted)] rounded-lg text-[var(--color-primary)]">
            <CpuChipIcon class="w-5 h-5" />
          </div>
        </div>
        <!-- Courbe Sparkline -->
        <div class="h-10 w-full">
          <svg class="w-full h-full text-[var(--color-primary)] stroke-current fill-none" viewBox="0 0 100 30" preserveAspectRatio="none">
            <path stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" :d="cpuPath" />
          </svg>
        </div>
        <div class="flex justify-between text-[10px] text-[var(--color-text-tertiary)] font-mono">
          <span>Il y a 60s</span>
          <span>En direct</span>
        </div>
      </div>

      <!-- ALLOCATION RAM -->
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm">
        <div class="flex justify-between items-start">
          <div>
            <span class="text-[10px] uppercase font-mono text-[var(--color-text-secondary)] font-bold block">Allocation RAM</span>
            <span class="text-2xl font-bold font-mono text-[var(--color-text-primary)] mt-1 block">{{ ramValue }} Go</span>
          </div>
          <div class="p-2 bg-teal-500/10 rounded-lg text-teal-500">
            <ComputerDesktopIcon class="w-5 h-5" />
          </div>
        </div>
        <!-- Courbe Sparkline -->
        <div class="h-10 w-full">
          <svg class="w-full h-full text-teal-500 stroke-current fill-none" viewBox="0 0 100 30" preserveAspectRatio="none">
            <path stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" :d="ramPath" />
          </svg>
        </div>
        <div class="flex justify-between text-[10px] text-[var(--color-text-tertiary)] font-mono">
          <span>Il y a 60s</span>
          <span>4.1 / 8.0 Go Utilisés</span>
        </div>
      </div>

      <!-- LATENCE API -->
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm">
        <div class="flex justify-between items-start">
          <div>
            <span class="text-[10px] uppercase font-mono text-[var(--color-text-secondary)] font-bold block">Latence API</span>
            <span class="text-2xl font-bold font-mono text-[var(--color-text-primary)] mt-1 block">{{ latencyValue }} ms</span>
          </div>
          <div class="p-2 bg-amber-500/10 rounded-lg text-amber-500">
            <SignalIcon class="w-5 h-5" />
          </div>
        </div>
        <!-- Courbe Sparkline -->
        <div class="h-10 w-full">
          <svg class="w-full h-full text-amber-500 stroke-current fill-none" viewBox="0 0 100 30" preserveAspectRatio="none">
            <path stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" :d="latencyPath" />
          </svg>
        </div>
        <div class="flex justify-between text-[10px] text-[var(--color-text-tertiary)] font-mono">
          <span>Il y a 60s</span>
          <span>Hub de Douala</span>
        </div>
      </div>

      <!-- SOCKETS ACTIFS -->
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm">
        <div class="flex justify-between items-start">
          <div>
            <span class="text-[10px] uppercase font-mono text-[var(--color-text-secondary)] font-bold block">Sockets Actifs</span>
            <span class="text-2xl font-bold font-mono text-[var(--color-text-primary)] mt-1 block">{{ nodesValue }} Nœuds</span>
          </div>
          <div class="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
            <ServerIcon class="w-5 h-5" />
          </div>
        </div>
        <!-- Courbe Sparkline -->
        <div class="h-10 w-full">
          <svg class="w-full h-full text-emerald-500 stroke-current fill-none" viewBox="0 0 100 30" preserveAspectRatio="none">
            <path stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" :d="nodesPath" />
          </svg>
        </div>
        <div class="flex justify-between text-[10px] text-[var(--color-text-tertiary)] font-mono">
          <span>Il y a 60s</span>
          <span>Équilibrage de charge</span>
        </div>
      </div>

    </div>

    <!-- CONSOLE D'ALERTE ET CLUSTER -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- CONSOLE DE LOGS (2 COLS) -->
      <div class="lg:col-span-2 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden flex flex-col shadow-sm">
        <div class="px-4 py-3 bg-[var(--color-surface-hover)] border-b border-[var(--color-border)] flex items-center justify-between select-none">
          <div class="flex items-center space-x-2">
            <span class="h-2 w-2 rounded-full bg-[var(--color-primary)] animate-ping"></span>
            <span class="font-mono text-[10px] uppercase font-bold text-[var(--color-text-primary)] tracking-wider">Flux des Événements Entrants (WS)</span>
          </div>
          <button @click="clearLocalAlerts" class="text-[9px] font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] uppercase">[Vider la Console]</button>
        </div>

        <div class="p-5 font-mono text-xs space-y-2 h-[350px] overflow-y-auto bg-[var(--color-background)] scrollbar-thin">
          <div v-if="alerts.length === 0" class="text-[var(--color-text-tertiary)] italic text-center pt-10">
            &lt;&lt; En attente de nouveaux événements WebSocket... &gt;&gt;
          </div>
          <div 
            v-else
            v-for="al in alerts" 
            :key="al.id" 
            class="flex items-start space-x-2 hover:bg-[var(--color-surface-hover)]/40 p-1 rounded transition text-left"
          >
            <span class="text-[var(--color-text-secondary)] shrink-0">[{{ formatTime(al.time) }}]</span>
            <span 
              class="px-1.5 py-0.2 rounded font-bold text-[8px] uppercase tracking-wider shrink-0"
              :class="al.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : (al.type === 'warning' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' : 'bg-[var(--color-primary-muted)] text-[var(--color-primary)] border border-[var(--color-primary-border)]')"
            >
              {{ al.event }}
            </span>
            <p class="text-[var(--color-text-primary)] font-sans leading-relaxed text-[11px]">{{ al.message }}</p>
          </div>
        </div>
      </div>

      <!-- CARTE DES NŒUDS ACTIFS (1 COL) -->
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 class="text-xs uppercase font-mono tracking-wider text-[var(--color-text-primary)] font-bold flex items-center space-x-1.5">
          <GlobeAltIcon class="w-4 h-4 text-[var(--color-primary)]" />
          <span>Nœuds Actifs du Cluster</span>
        </h3>

        <div class="space-y-3 pt-2 text-xs">
          
          <div class="p-3 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-bold text-[var(--color-text-primary)]">Nœud Douala A (Principal)</span>
              <span class="px-1.5 py-0.5 rounded text-[8px] font-mono bg-emerald-500/10 text-emerald-500 uppercase font-bold border border-emerald-500/20">Master</span>
            </div>
            <div class="flex justify-between text-[10px] text-[var(--color-text-secondary)] font-mono">
              <span>Charge de Trafic :</span>
              <span>{{ (cpuValue * 0.75).toFixed(1) }}%</span>
            </div>
            <div class="w-full bg-[var(--color-background)] h-1 rounded-full overflow-hidden border border-[var(--color-border)]">
              <div class="bg-emerald-500 h-full" :style="{ width: (cpuValue * 0.75) + '%' }"></div>
            </div>
          </div>

          <div class="p-3 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-bold text-[var(--color-text-primary)]">Nœud Yaoundé B</span>
              <span class="px-1.5 py-0.5 rounded text-[8px] font-mono bg-[var(--color-primary-muted)] text-[var(--color-primary)] uppercase font-bold border border-[var(--color-primary-border)]">Standby</span>
            </div>
            <div class="flex justify-between text-[10px] text-[var(--color-text-secondary)] font-mono">
              <span>État de synchro :</span>
              <span class="text-emerald-500">100% Miroir</span>
            </div>
          </div>

          <div class="p-3 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-bold text-[var(--color-text-primary)]">Nœud Rendu C</span>
              <span class="px-1.5 py-0.5 rounded text-[8px] font-mono bg-[var(--color-surface)] text-[var(--color-text-secondary)] uppercase font-bold border border-[var(--color-border)]">Worker</span>
            </div>
            <div class="flex justify-between text-[10px] text-[var(--color-text-secondary)] font-mono">
              <span>File de rendu PDF :</span>
              <span>0 tâches</span>
            </div>
          </div>

        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useIntervalFn } from '@vueuse/core';
import { 
  CpuChipIcon, 
  ComputerDesktopIcon, 
  SignalIcon, 
  ServerIcon,
  GlobeAltIcon
} from '@heroicons/vue/24/outline';

const cpuHistory = ref(Array(15).fill(12));
const ramHistory = ref(Array(15).fill(4.1));
const latencyHistory = ref(Array(15).fill(15));
const nodesHistory = ref(Array(15).fill(402));

const cpuValue = computed(() => cpuHistory.value[cpuHistory.value.length - 1]);
const ramValue = computed(() => ramHistory.value[ramHistory.value.length - 1].toFixed(2));
const latencyValue = computed(() => latencyHistory.value[latencyHistory.value.length - 1]);
const nodesValue = computed(() => nodesHistory.value[nodesHistory.value.length - 1]);

// Path generation helper for Sparklines
function generateSvgPath(historyArray, minVal, maxVal) {
  if (historyArray.length < 2) return '';
  const points = historyArray.map((val, idx) => {
    const x = (idx / (historyArray.length - 1)) * 100;
    const norm = (val - minVal) / ((maxVal - minVal) || 1);
    const y = 30 - norm * 26 - 2; // Keep padding
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return `M ${points.join(' L ')}`;
}

const cpuPath = computed(() => generateSvgPath(cpuHistory.value, 0, 100));
const ramPath = computed(() => generateSvgPath(ramHistory.value, 0, 8.0));
const latencyPath = computed(() => generateSvgPath(latencyHistory.value, 0, 100));
const nodesPath = computed(() => generateSvgPath(nodesHistory.value, 350, 450));

// Simulated WS logs feed
const alerts = ref([
  { id: 1, time: new Date(Date.now() - 30000), event: 'API_GW', type: 'info', message: 'Passerelle API connectée au nœud régional A' },
  { id: 2, time: new Date(Date.now() - 25000), event: 'SYNC', type: 'info', message: 'Base de données synchronisée sur le nœud secondaire B' },
]);

function formatTime(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toTimeString().split(' ')[0];
}

function clearLocalAlerts() {
  alerts.value = [];
}

// Tick interval simulation
const { pause, resume } = useIntervalFn(() => {
  // Rotate metrics array
  cpuHistory.value.shift();
  cpuHistory.value.push(Math.floor(8 + Math.random() * 20));

  ramHistory.value.shift();
  const prevRam = ramHistory.value[ramHistory.value.length - 1];
  const newRam = Math.max(3.8, Math.min(5.2, prevRam + (Math.random() - 0.5) * 0.15));
  ramHistory.value.push(newRam);

  latencyHistory.value.shift();
  latencyHistory.value.push(Math.floor(10 + Math.random() * 12));

  nodesHistory.value.shift();
  const prevNodes = nodesHistory.value[nodesHistory.value.length - 1];
  const diffNodes = Math.random() > 0.6 ? (Math.random() > 0.5 ? 1 : -1) : 0;
  nodesHistory.value.push(prevNodes + diffNodes);

  // Random inbound WS log
  if (Math.random() > 0.7) {
    const events = ['GATEWAY', 'AUTH', 'ESCROW', 'STORE'];
    const selectedEv = events[Math.floor(Math.random() * events.length)];
    let msg = '';
    let type = 'info';

    if (selectedEv === 'GATEWAY') {
      msg = `Requête entrante traitée en ${latencyValue.value}ms par le routeur Douala`;
    } else if (selectedEv === 'AUTH') {
      msg = `Vérification du token de session administrateur réussie`;
    } else if (selectedEv === 'ESCROW') {
      msg = `Contrat intelligent de séquestre mis à jour : solde nominal vérifié`;
    } else {
      msg = `Boutique mise en cache réactualisée pour le nœud agricole local`;
    }

    if (Math.random() > 0.95) {
      msg = `Alerte : Latence réseau élevée détectée sur le nœud C`;
      type = 'warning';
    }

    alerts.value.unshift({
      id: Date.now(),
      time: new Date(),
      event: selectedEv,
      type,
      message: msg
    });

    if (alerts.value.length > 50) alerts.value.pop();
  }
}, 2500);

onMounted(() => {
  resume();
});

onUnmounted(() => {
  pause();
});
</script>
