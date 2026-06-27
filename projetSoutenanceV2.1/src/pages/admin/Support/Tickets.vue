<template>
  <div class="space-y-6">

    <!-- HEADER BLOCK -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5 shrink-0">
      <div>
        <h1 class="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
          Corporate Support Desk Tickets
        </h1>
        <p class="text-xs text-slate-400">Manage client issues, assign engineers, and resolve technical bugs on billing networks.</p>
      </div>

      <div class="flex items-center space-x-3 text-xs font-mono">
        <span class="px-2.5 py-1 bg-indigo-950/40 text-indigo-400 border border-indigo-900/40 rounded-lg">
          Open Case folders: <strong class="text-indigo-200">{{ unassignedCount }}</strong>
        </span>
      </div>
    </div>

    <!-- DOUBLE COLUMN WORKSPACE -->
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
      
      <!-- COLUMN 1: INTERACTIVE TICKET LIST -->
      <div class="xl:col-span-5 space-y-4">
        
        <!-- Search, Priority Filt -->
        <div class="flex gap-2 bg-slate-90s/30 rounded-xl border border-slate-900 p-2 shrink-0">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Search tickets, names, topics..."
            class="flex-1 bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-2 text-xs text-slate-100 font-mono focus:outline-none"
          />
          <select 
            v-model="filterPriority"
            class="bg-slate-950 text-xs text-slate-400 border border-slate-800 rounded-lg p-2 font-mono"
          >
            <option value="">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div class="space-y-2 max-h-[550px] overflow-y-auto pr-1">
          <div 
            v-for="tk in filteredTickets" 
            :key="tk.id"
            @click="selectedTicket = tk"
            class="p-4 bg-slate-900/50 border rounded-2xl cursor-pointer text-left hover:border-slate-750 transition"
            :class="selectedTicket?.id === tk.id ? 'border-indigo-650 bg-indigo-950/20' : 'border-slate-850'"
          >
            <div class="flex items-center justify-between font-mono text-[9px] mb-2">
              <span class="text-indigo-400 font-bold uppercase">{{ tk.ticketRef }}</span>
              <span 
                class="px-1.5 py-0.5 rounded uppercase font-bold"
                :class="getPriorityClass(tk.priority)"
              >
                {{ tk.priority }}
              </span>
            </div>

            <h3 class="text-xs font-bold text-slate-100 font-sans leading-snug line-clamp-1">{{ tk.subject }}</h3>
            <p class="text-[11px] text-slate-400 font-sans mt-1 line-clamp-1 italic">{{ tk.message }}</p>

            <div class="flex items-center justify-between pt-3 mt-3 border-t border-slate-850/50 text-[10px] font-mono text-slate-500">
              <span class="truncate max-w-[150px]">{{ tk.user }} ({{ tk.role }})</span>
              <span 
                class="px-1 text-[8px] rounded uppercase font-bold"
                :class="getStatusClass(tk.status)"
              >
                {{ tk.status.replace('_',' ') }}
              </span>
            </div>
          </div>
        </div>

      </div>

      <!-- COLUMN 2: RESOLUTION INTERFACE & REPLIES THREAD -->
      <div class="xl:col-span-7">
        
        <div v-if="selectedTicket" class="p-6 bg-[#040817] border border-[#121c3b] rounded-2xl space-y-6">
          
          <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#121c3b] pb-4 gap-3">
            <div>
              <div class="flex items-center space-x-2 text-[10px] font-mono leading-none mb-1">
                <span class="text-indigo-400 font-bold uppercase">{{ selectedTicket.ticketRef }}</span>
                <span class="text-slate-650">&bull;</span>
                <span class="text-slate-450 uppercase">{{ selectedTicket.category }} Query</span>
              </div>
              <h2 class="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider">Ticket Thread Review</h2>
            </div>
            
            <div class="flex items-center gap-1.5 self-start">
              <button 
                @click="assignToMe"
                class="px-2.5 py-1 bg-slate-90 w bg-slate-900 border border-slate-800 rounded font-mono text-[9px] text-slate-350 hover:text-white uppercase transition"
              >
                {{ selectedTicket.assignedTo ? 'RE-ASSIGN TO ME' : 'CLAIM CASE' }}
              </button>
            </div>
          </div>

          <!-- Ticket original description -->
          <div class="p-4 bg-slate-950 border border-slate-900 rounded-xl space-y-1">
            <span class="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Original Query Content:</span>
            <p class="text-xs text-slate-300 leading-relaxed font-sans font-medium">{{ selectedTicket.message }}</p>
            
            <div class="text-[9px] font-mono text-slate-650 pt-2 border-t border-slate-900 flex items-center justify-between">
              <span>Opened by: {{ selectedTicket.user }} ({{ selectedTicket.email }})</span>
              <span>Assigned: {{ selectedTicket.assignedTo || 'Unclaimed Queue' }}</span>
            </div>
          </div>

          <!-- Core replies logs -->
          <div class="space-y-3">
            <h4 class="text-[10px] font-mono uppercase text-slate-450 tracking-wider font-bold">Dialogue Answers</h4>
            <div class="space-y-2.5 max-h-[180px] overflow-y-auto bg-slate-950/40 p-3 rounded-xl border border-slate-900">
              <div v-if="selectedTicket.replies.length === 0" class="text-center p-3 text-[11px] text-slate-600 font-mono italic">
                No replies posted on this technical thread yet.
              </div>
              <div 
                v-else
                v-for="rep in selectedTicket.replies" 
                :key="rep.id"
                class="p-3 bg-slate-950 rounded-xl border border-slate-900 text-xs"
              >
                <div class="flex items-center justify-between font-mono text-[8.5px] text-slate-500 mb-1 leading-none">
                  <span class="text-indigo-400 font-bold uppercase">&bull; {{ rep.author }}</span>
                  <span>{{ formatDateTime(rep.date) }}</span>
                </div>
                <p class="text-slate-300 leading-normal">{{ rep.text }}</p>
              </div>
            </div>
          </div>

          <!-- Answer submission input -->
          <div class="space-y-2 pt-1 font-mono text-xs">
            <label class="block text-slate-450 font-bold uppercase text-[9px]">Post Support Resolution Instruction</label>
            <div class="flex gap-2">
              <input 
                type="text" 
                v-model="replyInput" 
                placeholder="Post instructional reply..."
                class="flex-1 bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500"
              />
              <button 
                @click="postSupportAnswer"
                class="px-4 py-2 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl font-bold uppercase"
              >
                SEND
              </button>
            </div>
          </div>

          <!-- Close tickets actions -->
          <div v-if="selectedTicket.status !== 'closed' && selectedTicket.status !== 'resolved'" class="pt-4 border-t border-[#121c3b] flex justify-end shrink-0">
            <button 
              @click="closeTicketFinal"
              class="px-3.5 py-1.5 bg-slate-950 hover:bg-[#1a0f0d] text-slate-400 hover:text-red-400 border border-slate-850 rounded-xl font-mono text-[10px] uppercase font-bold transition"
            >
              RESOLVE & CLOSE CASE FILE [ &times; ]
            </button>
          </div>

        </div>

        <div v-else class="p-12 text-center bg-slate-9s/10 border border-slate-900 rounded-2xl">
          <p class="text-xs text-slate-500 font-mono">Select a technical help ticket from list.</p>
        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { supportTickets, writeAuditLog } from '@/utils/admin_db.js';
import { useAuthStore } from '@/store/modules/auth.js';
import { useToast } from 'vue-toastification';

const authStore = useAuthStore();
const toast = useToast();

const searchQuery = ref('');
const filterPriority = ref('');
const replyInput = ref('');
const selectedTicket = ref(supportTickets.value[0] || null);

const unassignedCount = computed(() => {
  return supportTickets.value.filter(t => !t.assignedTo || t.status === 'open').length;
});

const filteredTickets = computed(() => {
  return supportTickets.value.filter(tk => {
    if (filterPriority.value && tk.priority !== filterPriority.value) return false;
    
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      const matchSub = tk.subject.toLowerCase().includes(q);
      const matchMsg = tk.message.toLowerCase().includes(q);
      return matchSub || matchMsg;
    }
    return true;
  });
});

// Formatting
function formatDateTime(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return d.toISOString().replace('T', ' ').slice(0, 19);
}

function getPriorityClass(prio) {
  const map = {
    urgent: 'bg-red-950 text-red-500 border border-red-900/40 animate-pulse',
    high: 'bg-orange-950 text-orange-400 border border-orange-900/40',
    medium: 'bg-indigo-950 text-indigo-400 border border-indigo-900/40',
    low: 'bg-slate-900 text-slate-400 border border-slate-850'
  };
  return map[prio] || 'bg-slate-900 text-slate-400';
}

function getStatusClass(st) {
  const map = {
    open: 'bg-[#180b08] text-orange-500 border border-orange-905/40',
    in_progress: 'bg-indigo-950 text-indigo-400 border border-indigo-900/40 animate-pulse',
    resolved: 'bg-emerald-950 text-emerald-400 border border-emerald-900/50',
    closed: 'bg-slate-950 text-slate-550 border border-slate-900'
  };
  return map[st] || 'bg-slate-900 text-slate-400';
}

// ACTION HANDLERS
function assignToMe() {
  const adminName = authStore.user?.name || 'Administrator';
  selectedTicket.value.assignedTo = adminName;
  selectedTicket.value.status = 'in_progress';

  writeAuditLog(
    'TICKET_CLAIMED',
    `Support ticket ${selectedTicket.value.ticketRef} claimed by ${adminName}.`,
    adminName
  );

  toast.info(`Claimed ticket ${selectedTicket.value.ticketRef}!`);
}

function postSupportAnswer() {
  if (!replyInput.value.trim()) return;

  const currentAuthor = authStore.user?.name || 'ROOT CENTRAL';
  const newRep = {
    id: `rep_${Date.now()}`,
    author: `${currentAuthor} (Support Rep)`,
    text: replyInput.value.trim(),
    date: new Date().toISOString()
  };

  selectedTicket.value.replies.push(newRep);
  replyInput.value = '';

  if (selectedTicket.value.status === 'open') {
    selectedTicket.value.status = 'in_progress';
  }

  writeAuditLog(
    'TICKET_REPLIED',
    `Message response posted to support dossier ${selectedTicket.value.ticketRef} by ${currentAuthor}.`,
    currentAuthor
  );

  toast.success('Support reply submitted.');
}

function closeTicketFinal() {
  selectedTicket.value.status = 'closed';
  selectedTicket.value.replies.push({
    id: `sys_${Date.now()}`,
    author: 'System Admin',
    text: 'Ticket resolved and docket closed. Further correspondence requires initiating a new compliance dossier.',
    date: new Date().toISOString()
  });

  writeAuditLog(
    'TICKET_RESOLVED',
    `Support case file closed: ${selectedTicket.value.ticketRef}.`,
    authStore.user?.name || 'System Admin'
  );

  toast.success(`Dossier resolved and closed.`);
}
</script>
