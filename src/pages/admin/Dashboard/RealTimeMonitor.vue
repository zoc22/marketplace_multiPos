<template>
  <div class="space-y-6">
    
    <!-- Top Banner -->
    <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div>
        <h1 class="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <CpuChipIcon class="w-5 h-5 text-indigo-400" />
          <span>Real-Time System Telemetry Monitor</span>
        </h1>
        <p class="text-xs text-slate-400 mt-1">Live WebSocket-simulated metrics stream of CPU, memory, socket connections, and network node latency.</p>
      </div>

      <div class="flex items-center space-x-2 bg-slate-950 px-3.5 py-2 border border-slate-850 rounded-xl">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span class="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">WS Connection Stable</span>
      </div>
    </div>

    <!-- METRICS GRID WITH SPARKLINES -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <!-- CPU METRIC -->
      <div class="bg-[#14141E] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-4">
        <div class="flex justify-between items-start">
          <div>
            <span class="text-[10px] uppercase font-mono text-slate-400 font-bold block">CPU Load</span>
            <span class="text-2xl font-bold font-mono text-slate-100 mt-1 block">{{ cpuValue }}%</span>
          </div>
          <div class="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
            <CpuChipIcon class="w-5 h-5" />
          </div>
        </div>
        <!-- Sparkline SVG -->
        <div class="h-10 w-full">
          <svg class="w-full h-full text-indigo-500 stroke-current fill-none" viewBox="0 0 100 30" preserveAspectRatio="none">
            <path stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" :d="cpuPath" />
          </svg>
        </div>
        <div class="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>60s ago</span>
          <span>Live</span>
        </div>
      </div>

      <!-- RAM METRIC -->
      <div class="bg-[#14141E] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-4">
        <div class="flex justify-between items-start">
          <div>
            <span class="text-[10px] uppercase font-mono text-slate-400 font-bold block">RAM Allocation</span>
            <span class="text-2xl font-bold font-mono text-slate-100 mt-1 block">{{ ramValue }} GB</span>
          </div>
          <div class="p-2 bg-teal-500/10 rounded-lg text-teal-400">
            <ComputerDesktopIcon class="w-5 h-5" />
          </div>
        </div>
        <!-- Sparkline SVG -->
        <div class="h-10 w-full">
          <svg class="w-full h-full text-teal-500 stroke-current fill-none" viewBox="0 0 100 30" preserveAspectRatio="none">
            <path stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" :d="ramPath" />
          </svg>
        </div>
        <div class="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>60s ago</span>
          <span>4.1 / 8.0 GB Used</span>
        </div>
      </div>

      <!-- LATENCY METRIC -->
      <div class="bg-[#14141E] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-4">
        <div class="flex justify-between items-start">
          <div>
            <span class="text-[10px] uppercase font-mono text-slate-400 font-bold block">API Latency</span>
            <span class="text-2xl font-bold font-mono text-slate-100 mt-1 block">{{ latencyValue }} ms</span>
          </div>
          <div class="p-2 bg-amber-500/10 rounded-lg text-amber-400">
            <SignalIcon class="w-5 h-5" />
          </div>
        </div>
        <!-- Sparkline SVG -->
        <div class="h-10 w-full">
          <svg class="w-full h-full text-amber-500 stroke-current fill-none" viewBox="0 0 100 30" preserveAspectRatio="none">
            <path stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" :d="latencyPath" />
          </svg>
        </div>
        <div class="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>60s ago</span>
          <span>Douala Hub</span>
        </div>
      </div>

      <!-- ACTIVE NODES METRIC -->
      <div class="bg-[#14141E] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-4">
        <div class="flex justify-between items-start">
          <div>
            <span class="text-[10px] uppercase font-mono text-slate-400 font-bold block">Active Sockets</span>
            <span class="text-2xl font-bold font-mono text-slate-100 mt-1 block">{{ nodesValue }} Nodes</span>
          </div>
          <div class="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
            <ServerIcon class="w-5 h-5" />
          </div>
        </div>
        <!-- Sparkline SVG -->
        <div class="h-10 w-full">
          <svg class="w-full h-full text-emerald-500 stroke-current fill-none" viewBox="0 0 100 30" preserveAspectRatio="none">
            <path stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" :d="nodesPath" />
          </svg>
        </div>
        <div class="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>60s ago</span>
          <span>Load balanced</span>
        </div>
      </div>

    </div>

    <!-- SYSTEM ALERTS LOG FEED -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- LOG CONSOLE (2 COLS) -->
      <div class="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
        <div class="px-4 py-3 bg-slate-900 border-b border-slate-850 flex items-center justify-between select-none">
          <div class="flex items-center space-x-2">
            <span class="h-2 w-2 rounded-full bg-indigo-500 animate-ping"></span>
            <span class="font-mono text-[10px] uppercase font-bold text-slate-300 tracking-wider">WebSocket Inbound Stream Log</span>
          </div>
          <button @click="clearLocalAlerts" class="text-[9px] font-mono text-slate-400 hover:text-white uppercase">[Clear View]</button>
        </div>

        <div class="p-5 font-mono text-xs space-y-2 h-[350px] overflow-y-auto bg-[#01040f] scrollbar-thin">
          <div v-if="alerts.length === 0" class="text-slate-600 italic text-center pt-10">
            &lt;&lt; Awaiting simulated WebSocket events... &gt;&gt;
          </div>
          <div 
            v-else
            v-for="al in alerts" 
            :key="al.id" 
            class="flex items-start space-x-2 hover:bg-slate-900/40 p-1 rounded transition text-left"
          >
            <span class="text-slate-600 shrink-0">[{{ formatTime(al.time) }}]</span>
            <span 
              class="px-1.5 py-0.2 rounded font-bold text-[8px] uppercase tracking-wider shrink-0"
              :class="al.type === 'error' ? 'bg-red-950 text-red-400 border border-red-900/30' : (al.type === 'warning' ? 'bg-amber-950 text-amber-400 border border-amber-900/30' : 'bg-indigo-950 text-indigo-300 border border-indigo-900/30')"
            >
              {{ al.event }}
            </span>
            <p class="text-slate-300 font-sans leading-relaxed text-[11px]">{{ al.message }}</p>
          </div>
        </div>
      </div>

      <!-- NODE CLUSTER MAP (1 COL) -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 class="text-xs uppercase font-mono tracking-wider text-slate-350 font-bold flex items-center space-x-1.5">
          <GlobeAltIcon class="w-4 h-4 text-indigo-400" />
          <span>Active Cluster Nodes</span>
        </h3>

        <div class="space-y-3 pt-2 text-xs">
          
          <div class="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-200">Douala Node A (Primary)</span>
              <span class="px-1.5 py-0.5 rounded text-[8px] font-mono bg-emerald-950 text-emerald-400 uppercase">Master</span>
            </div>
            <div class="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Traffic Load:</span>
              <span>{{ (cpuValue * 0.75).toFixed(1) }}%</span>
            </div>
            <div class="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
              <div class="bg-emerald-500 h-full" :style="{ width: (cpuValue * 0.75) + '%' }"></div>
            </div>
          </div>

          <div class="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-200">Yaounde Node B</span>
              <span class="px-1.5 py-0.5 rounded text-[8px] font-mono bg-indigo-950 text-indigo-400 uppercase">Standby</span>
            </div>
            <div class="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Sync State:</span>
              <span class="text-emerald-400">100% Mirrored</span>
            </div>
          </div>

          <div class="p-3 bg-slate-950 border border-slate-855 rounded-xl space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-205">Worker Node C (Render)</span>
              <span class="px-1.5 py-0.5 rounded text-[8px] font-mono bg-slate-900 text-slate-400 uppercase">Worker</span>
            </div>
            <div class="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Active PDF Queue:</span>
              <span>0 jobs</span>
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
const ramPath = computed(() => generateSvgPath(ramHistory.value, 0, 8));
const latencyPath = computed(() => generateSvgPath(latencyHistory.value, 0, 150));
const nodesPath = computed(() => generateSvgPath(nodesHistory.value, 380, 420));

// Simulated WebSocket alerts feed
const alerts = ref([
  { id: 1, time: new Date(Date.now() - 30000), event: 'WS_OPEN', type: 'info', message: 'WebSocket handshake validated with Afrika Central Telemetry clusters.' },
  { id: 2, time: new Date(Date.now() - 15000), event: 'SYNC_OK', type: 'info', message: 'Node A state synchronized with Yaoundé Node B repository mirrors.' }
]);

// Update values using VueUse useIntervalFn
const { pause, resume } = useIntervalFn(() => {
  // CPU
  const prevCpu = cpuHistory.value[cpuHistory.value.length - 1];
  const changeCpu = (Math.random() - 0.5) * 12;
  const newCpu = Math.max(2, Math.min(95, Math.round(prevCpu + changeCpu)));
  cpuHistory.value.push(newCpu);
  cpuHistory.value.shift();

  // RAM
  const prevRam = ramHistory.value[ramHistory.value.length - 1];
  const changeRam = (Math.random() - 0.5) * 0.4;
  const newRam = Math.max(1, Math.min(7.8, prevRam + changeRam));
  ramHistory.value.push(newRam);
  ramHistory.value.shift();

  // Latency
  const prevLat = latencyHistory.value[latencyHistory.value.length - 1];
  const changeLat = (Math.random() - 0.5) * 8;
  const newLat = Math.max(3, Math.min(200, Math.round(prevLat + changeLat)));
  latencyHistory.value.push(newLat);
  latencyHistory.value.shift();

  // Nodes
  const prevNodes = nodesHistory.value[nodesHistory.value.length - 1];
  const changeNodes = Math.random() > 0.85 ? (Math.random() > 0.5 ? 1 : -1) : 0;
  const newNodes = Math.max(390, Math.min(415, prevNodes + changeNodes));
  nodesHistory.value.push(newNodes);
  nodesHistory.value.shift();

  // Trigger random event logs
  if (Math.random() > 0.88) {
    let type = 'info';
    let event = 'NODE_METRIC';
    let message = 'Heartbeat acknowledgement collected from backup cluster Nodes.';
    const rand = Math.random();
    if (rand > 0.9) {
      type = 'error';
      event = 'SYS_ALERT';
      message = `High latency spike of ${newLat}ms registered on Orange MoMo payment webhook handshakes.`;
    } else if (rand > 0.6) {
      type = 'warning';
      event = 'DB_LOCK';
      message = 'Escrow ledger locks queue exceeding 12 active blocks; performance holds standard range.';
    }
    
    alerts.value.unshift({
      id: Date.now(),
      time: new Date(),
      event,
      type,
      message
    });
    // Keep last 40 alerts
    if (alerts.value.length > 40) {
      alerts.value.pop();
    }
  }
}, 2000);

function clearLocalAlerts() {
  alerts.value = [];
}

function formatTime(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toTimeString().split(' ')[0];
}

onUnmounted(() => {
  pause();
});
</script>

<style scoped>
/* Scrollbar custom styles */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}
</style>
