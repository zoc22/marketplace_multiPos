<template>
  <div class="space-y-6">

    <!-- HEADER BLOCK -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5 shrink-0">
      <div>
        <h1 class="text-xl font-bold font-mono text-[var(--color-text-primary)] flex items-center gap-2">
          Tickets de Support Clientèle Corporate
        </h1>
        <p class="text-xs text-[var(--color-text-secondary)]">Gérez les tickets d'assistance, affectez les techniciens et résolvez les bugs techniques.</p>
      </div>

      <div class="flex items-center space-x-3 text-xs font-mono">
        <span class="px-2.5 py-1 bg-[var(--color-primary-muted)] text-[var(--color-primary)] border border-[var(--color-border)] rounded-lg">
          Dossiers ouverts : <strong class="text-[var(--color-text-primary)]">{{ unassignedCount }}</strong>
        </span>
      </div>
    </div>

    <!-- DOUBLE COLUMN WORKSPACE -->
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
      
      <!-- COLUMN 1: INTERACTIVE TICKET LIST -->
      <div class="xl:col-span-5 space-y-4">
        
        <!-- Search, Priority Filt -->
        <div class="flex gap-2 bg-[var(--color-surface-elevated)] rounded-xl border border-[var(--color-border)] p-2 shrink-0">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Rechercher des tickets, noms, sujets..."
            class="flex-1 bg-[var(--color-background)] border border-[var(--color-border)] focus:border-[var(--color-primary)] rounded-lg p-2 text-xs text-[var(--color-text-primary)] font-mono focus:outline-none"
          />
          <select 
            v-model="filterPriority"
            class="bg-[var(--color-background)] text-xs text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-lg p-2 font-mono"
          >
            <option value="">Toutes les Priorités</option>
            <option value="urgent">Urgent</option>
            <option value="high">Haute</option>
            <option value="medium">Moyenne</option>
            <option value="low">Basse</option>
          </select>
        </div>

        <div class="space-y-2 max-h-[550px] overflow-y-auto pr-1">
          <div 
            v-for="tk in filteredTickets" 
            :key="tk.id"
            @click="selectedTicket = tk"
            class="p-4 bg-[var(--color-surface)] border rounded-2xl cursor-pointer text-left hover:border-[var(--color-primary)] transition"
            :class="selectedTicket?.id === tk.id ? 'border-[var(--color-primary)] bg-[var(--color-primary-muted)]/20' : 'border-[var(--color-border)]'"
          >
            <div class="flex items-center justify-between font-mono text-[9px] mb-2">
              <span class="text-[var(--color-primary)] font-bold uppercase">{{ tk.ticketRef }}</span>
              <span 
                class="px-1.5 py-0.5 rounded uppercase font-bold text-[9px]"
                :class="getPriorityClass(tk.priority)"
              >
                {{ tk.priority === 'urgent' ? 'Urgent' : tk.priority === 'high' ? 'Haute' : tk.priority === 'medium' ? 'Moyenne' : 'Basse' }}
              </span>
            </div>

            <h3 class="text-xs font-bold text-[var(--color-text-primary)] font-sans leading-snug line-clamp-1">{{ tk.subject }}</h3>
            <p class="text-[11px] text-[var(--color-text-secondary)] font-sans mt-1 line-clamp-1 italic">{{ tk.message }}</p>

            <div class="flex items-center justify-between pt-3 mt-3 border-t border-[var(--color-border)] text-[10px] font-mono text-[var(--color-text-secondary)]">
              <span class="truncate max-w-[150px]">{{ tk.user }} ({{ tk.role === 'supplier' ? 'Fournisseur' : 'Acheteur' }})</span>
              <span 
                class="px-1 text-[8px] rounded uppercase font-bold"
                :class="getStatusClass(tk.status)"
              >
                {{ tk.status === 'open' ? 'Ouvert' : tk.status === 'in_progress' ? 'En Cours' : tk.status === 'resolved' ? 'Résolu' : 'Fermé' }}
              </span>
            </div>
          </div>
        </div>

      </div>

      <!-- COLUMN 2: RESOLUTION INTERFACE & REPLIES THREAD -->
      <div class="xl:col-span-7">
        
        <div v-if="selectedTicket" class="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl space-y-6">
          
          <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--color-border)] pb-4 gap-3">
            <div>
              <div class="flex items-center space-x-2 text-[10px] font-mono leading-none mb-1">
                <span class="text-[var(--color-primary)] font-bold uppercase">{{ selectedTicket.ticketRef }}</span>
                <span class="text-[var(--color-text-secondary)]">&bull;</span>
                <span class="text-[var(--color-text-secondary)] uppercase">Catégorie : {{ selectedTicket.category }}</span>
              </div>
              <h2 class="text-sm font-bold text-[var(--color-text-primary)] font-mono uppercase tracking-wider">Suivi du Ticket</h2>
            </div>
            
            <div class="flex items-center gap-1.5 self-start">
              <button 
                @click="assignToMe"
                class="px-2.5 py-1 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded font-mono text-[9px] text-[var(--color-text-primary)] hover:bg-[var(--color-primary-muted)] uppercase transition cursor-pointer"
              >
                {{ selectedTicket.assignedTo ? 'Réassigner à moi' : 'Prendre en charge' }}
              </button>
            </div>
          </div>

          <!-- Ticket original description -->
          <div class="p-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl space-y-1">
            <span class="text-[9px] font-mono text-[var(--color-text-secondary)] uppercase tracking-widest block font-bold">Message d'Origine :</span>
            <p class="text-xs text-[var(--color-text-primary)] leading-relaxed font-sans font-medium">{{ selectedTicket.message }}</p>
            
            <div class="text-[9px] font-mono text-[var(--color-text-secondary)] pt-2 border-t border-[var(--color-border)] flex items-center justify-between">
              <span>Créé par : {{ selectedTicket.user }} ({{ selectedTicket.email }})</span>
              <span>Assigné à : {{ selectedTicket.assignedTo || 'Non assigné' }}</span>
            </div>
          </div>

          <!-- Core replies logs -->
          <div class="space-y-3">
            <h4 class="text-[10px] font-mono uppercase text-[var(--color-text-secondary)] tracking-wider font-bold">Historique des Échanges</h4>
            <div class="space-y-2.5 max-h-[180px] overflow-y-auto bg-[var(--color-background)] p-3 rounded-xl border border-[var(--color-border)]">
              <div v-if="selectedTicket.replies.length === 0" class="text-center p-3 text-[11px] text-[var(--color-text-secondary)] font-mono italic">
                Aucune réponse n'a encore été apportée à ce ticket.
              </div>
              <div 
                v-else
                v-for="rep in selectedTicket.replies" 
                :key="rep.id"
                class="p-3 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] text-xs"
              >
                <div class="flex items-center justify-between font-mono text-[8.5px] text-[var(--color-text-secondary)] mb-1 leading-none">
                  <span class="text-[var(--color-primary)] font-bold uppercase">&bull; {{ rep.author }}</span>
                  <span>{{ formatDateTime(rep.date) }}</span>
                </div>
                <p class="text-[var(--color-text-primary)] leading-normal">{{ rep.text }}</p>
              </div>
            </div>
          </div>

          <!-- Answer submission input -->
          <div class="space-y-2 pt-1 font-mono text-xs">
            <label class="block text-[var(--color-text-secondary)] font-bold uppercase text-[9px]">Ajouter une réponse de support</label>
            <div class="flex gap-2">
              <input 
                type="text" 
                v-model="replyInput" 
                placeholder="Saisir votre réponse..."
                class="flex-1 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl p-2.5 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-primary)]"
              />
              <button 
                @click="postSupportAnswer"
                class="px-4 py-2 bg-[var(--color-primary)] hover:opacity-90 text-[var(--color-text-primary)] rounded-xl font-bold uppercase cursor-pointer"
              >
                Envoyer
              </button>
            </div>
          </div>

          <!-- Close tickets actions -->
          <div v-if="selectedTicket.status !== 'closed' && selectedTicket.status !== 'resolved'" class="pt-4 border-t border-[var(--color-border)] flex justify-end shrink-0">
            <button 
              @click="closeTicketFinal"
              class="px-3.5 py-1.5 bg-[var(--color-background)] hover:bg-red-500/10 text-[var(--color-text-secondary)] hover:text-red-500 border border-[var(--color-border)] rounded-xl font-mono text-[10px] uppercase font-bold transition cursor-pointer"
            >
              Résoudre & Fermer le ticket [ &times; ]
            </button>
          </div>

        </div>

        <div v-else class="p-12 text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
          <p class="text-xs text-[var(--color-text-secondary)] font-mono">Veuillez sélectionner un ticket dans la liste.</p>
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
    urgent: 'bg-red-500/10 text-red-500 border border-red-500/20',
    high: 'bg-orange-500/10 text-orange-500 border border-orange-500/20',
    medium: 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20',
    low: 'bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'
  };
  return map[prio] || 'bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)]';
}

function getStatusClass(st) {
  const map = {
    open: 'bg-orange-500/10 text-orange-500 border border-orange-500/20',
    in_progress: 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20',
    resolved: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
    closed: 'bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'
  };
  return map[st] || 'bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)]';
}

// ACTION HANDLERS
function assignToMe() {
  const adminName = authStore.user?.name || 'Administrateur';
  selectedTicket.value.assignedTo = adminName;
  selectedTicket.value.status = 'in_progress';

  writeAuditLog(
    'TICKET_CLAIMED',
    `Ticket de support ${selectedTicket.value.ticketRef} pris en charge par ${adminName}.`,
    adminName
  );

  toast.info(`Ticket ${selectedTicket.value.ticketRef} pris en charge !`);
}

function postSupportAnswer() {
  if (!replyInput.value.trim()) return;

  const currentAuthor = authStore.user?.name || 'CONTRÔLE CENTRAL';
  const newRep = {
    id: `rep_${Date.now()}`,
    author: `${currentAuthor} (Support)`,
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
    `Réponse publiée sur le ticket ${selectedTicket.value.ticketRef} par ${currentAuthor}.`,
    currentAuthor
  );

  toast.success('Réponse soumise.');
}

function closeTicketFinal() {
  selectedTicket.value.status = 'closed';
  selectedTicket.value.replies.push({
    id: `sys_${Date.now()}`,
    author: 'Admin Système',
    text: 'Ticket résolu et dossier fermé.',
    date: new Date().toISOString()
  });

  writeAuditLog(
    'TICKET_RESOLVED',
    `Ticket fermé : ${selectedTicket.value.ticketRef}.`,
    authStore.user?.name || 'Admin Système'
  );

  toast.success(`Ticket résolu et fermé.`);
}
</script>
