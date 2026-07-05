<template>
  <div class="space-y-6">

    <!-- HEADER SUMMARY -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5 shrink-0 animate-fade-in">
      <div>
        <h1 class="text-xl font-bold font-mono text-[var(--color-text-primary)] flex items-center gap-2">
          <ScaleIcon class="w-5 h-5 text-[var(--color-primary)]" />
          <span>Centre de Résolution des Litiges B2B de la Plateforme</span>
        </h1>
        <p class="text-xs text-[var(--color-text-secondary)]">Médiation des conflits commerciaux, autorisation des remboursements ou gel/libération des fonds séquestrés.</p>
      </div>

      <!-- METRIC BADGES -->
      <div class="flex items-center space-x-3 text-xs font-mono">
        <span class="px-2.5 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)]">
          Litiges non réglés : <strong class="text-red-500">{{ activeCount }}</strong>
        </span>
        <span class="px-2.5 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)]">
          Somme litigieuse : <strong class="text-[var(--color-primary)]">{{ formatCurrency(totalDisputedAmount) }} FCFA</strong>
        </span>
      </div>
    </div>

    <!-- MAIN TWO-COLUMN SUBSECTION -->
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
      
      <!-- LEFT HAND COMPILATION: DISPUTE REGISTRY -->
      <div class="xl:col-span-4 space-y-4">
        
        <!-- Search bar -->
        <div class="relative w-full">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Rechercher par réf., entreprise..."
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] focus:border-[var(--color-primary)] rounded-lg p-2.5 pl-8 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] font-mono focus:outline-none"
          />
          <span class="absolute left-2.5 top-3 text-[var(--color-text-secondary)] font-mono text-[11px]">
            <MagnifyingGlassIcon class="w-4 h-4" />
          </span>
        </div>

        <div class="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
          <div 
            v-for="d in filteredDisputes" 
            :key="d.id"
            @click="selectedDispute = d"
            class="p-4 bg-[var(--color-surface)] border rounded-2xl cursor-pointer text-left transition relative"
            :class="selectedDispute?.id === d.id ? 'border-[var(--color-primary)] bg-[var(--color-primary-muted)]/20' : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'"
          >
            <!-- Badge indicators -->
            <div class="flex items-center justify-between font-mono text-[9px] mb-2 leading-none">
              <span class="text-[var(--color-primary)] font-bold uppercase tracking-wider">{{ d.disputeRef }}</span>
              <span 
                class="px-1.5 py-0.5 rounded font-bold uppercase text-[8px]"
                :class="getStatusClass(d.status)"
              >
                {{ d.status === 'open' ? 'Ouvert' : d.status === 'under_review' ? 'En Cours' : d.status === 'resolved' ? 'Résolu' : d.status === 'frozen' ? 'Gelé' : 'Rejeté' }}
              </span>
            </div>

            <h3 class="text-xs font-bold text-[var(--color-text-primary)] font-sans leading-snug line-clamp-1">{{ d.product }}</h3>
            <div class="text-[11px] text-[var(--color-text-secondary)] mt-1">
              Acheteur : <span class="text-[var(--color-text-primary)] font-semibold">{{ d.buyer }}</span>
            </div>
            <div class="text-[11px] text-[var(--color-text-secondary)]">
              Fournisseur : <span class="text-[var(--color-text-primary)]">{{ d.supplier }}</span>
            </div>

            <div class="flex items-center justify-between pt-3.5 mt-2.5 border-t border-[var(--color-border)] font-mono text-[10px]">
              <span class="text-[var(--color-text-secondary)]">{{ formatDate(d.createdAt) }}</span>
              <span class="text-[var(--color-text-primary)] font-bold">{{ formatCurrency(d.amount) }} FCFA</span>
            </div>
          </div>
        </div>

      </div>

      <!-- RIGHT HAND PANEL: RESOLUTION DESK & DIALOGUE FLUX -->
      <div class="xl:col-span-8">
        
        <div v-if="selectedDispute" class="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl space-y-6">
          
          <!-- Dispute detail header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--color-border)] pb-4 gap-3">
            <div>
              <div class="flex items-center space-x-2 text-[10px] font-mono leading-none mb-1">
                <span class="text-[var(--color-primary)] font-bold uppercase">{{ selectedDispute.disputeRef }}</span>
                <span class="text-[var(--color-text-secondary)]">&bull;</span>
                <span class="text-[var(--color-text-secondary)]">Commande : {{ selectedDispute.orderRef }}</span>
              </div>
              <h2 class="text-sm font-bold text-[var(--color-text-primary)] font-mono uppercase tracking-wider">Examen du Dossier de Réclamation</h2>
            </div>

            <!-- Current action status badge -->
            <span 
              class="px-2.5 py-1 rounded text-xs font-mono font-bold uppercase border self-start"
              :class="getStatusClass(selectedDispute.status)"
            >
              {{ selectedDispute.status === 'open' ? 'Ouvert' : selectedDispute.status === 'under_review' ? 'En Cours' : selectedDispute.status === 'resolved' ? 'Résolu' : selectedDispute.status === 'frozen' ? 'Gelé' : 'Rejeté' }}
            </span>
          </div>

          <!-- Product / Parties row -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
            <div class="p-3 bg-[var(--color-background)] rounded-xl border border-[var(--color-border)] space-y-1">
              <span class="text-[9px] font-mono text-[var(--color-text-secondary)] uppercase block">Somme en Litige</span>
              <span class="text-[13px] font-bold font-mono text-[var(--color-text-primary)]">{{ formatCurrency(selectedDispute.amount) }} FCFA</span>
            </div>
            <div class="p-3 bg-[var(--color-background)] rounded-xl border border-[var(--color-border)] space-y-1">
              <span class="text-[9px] font-mono text-[var(--color-text-secondary)] uppercase block">Acheteur Affilié</span>
              <span class="text-[var(--color-text-primary)] font-bold block truncate">{{ selectedDispute.buyer }}</span>
            </div>
            <div class="p-3 bg-[var(--color-background)] rounded-xl border border-[var(--color-border)] space-y-1">
              <span class="text-[9px] font-mono text-[var(--color-text-secondary)] uppercase block">Fournisseur Affilié</span>
              <span class="text-[var(--color-primary)] font-semibold block truncate">{{ selectedDispute.supplier }}</span>
            </div>
          </div>

          <!-- Dispute description message -->
          <div class="p-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl space-y-1">
            <span class="text-[9px] font-mono text-[var(--color-text-secondary)] uppercase tracking-widest block font-bold">Déclaration de l'Acheteur :</span>
            <p class="text-xs text-[var(--color-text-primary)] leading-relaxed font-sans">{{ selectedDispute.description }}</p>
          </div>

          <!-- Chat dialogue flux -->
          <div class="space-y-3">
            <h4 class="text-[10px] font-mono uppercase text-[var(--color-text-secondary)] tracking-wider font-bold">Examen des Déclarations & Échanges</h4>
            <div class="space-y-2.5 max-h-[220px] overflow-y-auto bg-[var(--color-background)] p-3 rounded-xl border border-[var(--color-border)]">
              
              <div 
                v-for="cmt in selectedDispute.comments" 
                :key="cmt.id"
                class="p-3 rounded-xl space-y-1 text-xs"
                :class="cmt.author.includes('Platform Rep') || cmt.author === 'System Admin' ? 'bg-[var(--color-primary-muted)]/20 border border-[var(--color-primary-border)]' : 'bg-[var(--color-surface)] border border-[var(--color-border)]'"
              >
                <div class="flex items-center justify-between font-mono text-[9px]">
                  <span class="text-[var(--color-text-primary)] uppercase font-bold tracking-wider" :class="cmt.author.includes('Platform Rep') || cmt.author === 'System Admin' ? 'text-[var(--color-primary)]' : ''">
                    &bull; {{ cmt.author }}
                  </span>
                  <span class="text-[var(--color-text-secondary)]">{{ formatDateTime(cmt.date) }}</span>
                </div>
                <p class="text-[var(--color-text-primary)] leading-normal">{{ cmt.text }}</p>
              </div>

            </div>
          </div>

          <!-- Mediate and input box reply line -->
          <div class="space-y-2">
            <label class="block text-[10px] font-mono uppercase text-[var(--color-text-secondary)] tracking-wider font-bold">Saisir la Décision d'Arbitrage Administratif</label>
            <div class="flex gap-2">
              <input 
                type="text" 
                v-model="replyText"
                placeholder="Publier un message..."
                class="flex-1 bg-[var(--color-background)] border border-[var(--color-border)] focus:border-[var(--color-primary)] rounded-xl p-2.5 text-xs text-[var(--color-text-primary)] font-mono focus:outline-none"
              />
              <button 
                @click="postArbitrateReply"
                class="px-4 py-2 bg-[var(--color-primary)] hover:opacity-90 font-mono text-xs uppercase font-bold text-[var(--color-text-primary)] rounded-xl transition cursor-pointer"
              >
                Publier
              </button>
            </div>
          </div>

          <!-- Resolution controllers -->
          <div v-if="selectedDispute.status === 'open' || selectedDispute.status === 'under_review'" class="pt-4 border-t border-[var(--color-border)] flex flex-wrap items-center justify-end gap-3 font-mono">
            
            <button 
              @click="triggerDisputeFreeze"
              class="px-3.5 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-xl text-xs uppercase font-bold transition flex items-center space-x-1.5 cursor-pointer"
            >
              <LockClosedIcon class="w-3.5 h-3.5" />
              <span>Geler le Paiement</span>
            </button>
            <button 
              @click="triggerDisputeDismiss"
              class="px-3.5 py-2 bg-[var(--color-background)] hover:bg-red-500/10 text-[var(--color-text-secondary)] hover:text-red-500 border border-[var(--color-border)] rounded-xl text-xs uppercase font-bold transition cursor-pointer"
            >
              Rejeter la Réclamation
            </button>
            <button 
              @click="approveDisputeRefunding"
              class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs uppercase font-bold transition flex items-center space-x-1.5 cursor-pointer"
            >
              <CheckIcon class="w-3.5 h-3.5" />
              <span>Rembourser l'Acheteur</span>
            </button>

          </div>

          <div v-else class="p-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-text-secondary)] font-mono text-center">
            Dossier clos ou gelé. Les surcharges sont enregistrées. Le système a finalisé les séquestres.
          </div>

        </div>

        <div v-else class="p-12 text-center bg-[var(--color-surface)]/10 border border-[var(--color-border)] rounded-2xl">
          <p class="text-xs text-[var(--color-text-secondary)] font-mono">Sélectionnez un dossier de réclamation dans le registre.</p>
        </div>

      </div>

    </div>

    <!-- REVERSIBLE ESCROW FREEZING / DISMISS SAFETY DIRECT REJECTIONS CONFIRM MODAL -->
    <ConfirmationModal 
      :show="showConfirm"
      :title="confirmTitle"
      :message="confirmMessage"
      :action-label="confirmActionLabel"
      @close="closeConfirm"
      @confirm="executeDisputeOverride"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { disputes, writeAuditLog } from '@/utils/admin_db.js';
import { useAuthStore } from '@/store/modules/auth.js';
import { useToast } from 'vue-toastification';
import ConfirmationModal from '@/components/ConfirmationModal.vue';
import { 
  ScaleIcon, 
  MagnifyingGlassIcon, 
  LockClosedIcon, 
  CheckIcon 
} from '@heroicons/vue/24/outline';

const toast = useToast();
const authStore = useAuthStore();

const searchQuery = ref('');
const replyText = ref('');
const selectedDispute = ref(disputes.value[0] || null);

const activeCount = computed(() => {
  return disputes.value.filter(d => d.status === 'open' || d.status === 'under_review').length;
});

const totalDisputedAmount = computed(() => {
  return disputes.value.reduce((acc, d) => d.status !== 'dismissed' ? acc + d.amount : acc, 0);
});

const filteredDisputes = computed(() => {
  return disputes.value.filter(d => {
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      const matchRef = d.disputeRef.toLowerCase().includes(q);
      const matchBuyer = d.buyer.toLowerCase().includes(q);
      const matchSupp = d.supplier.toLowerCase().includes(q);
      return matchRef || matchBuyer || matchSupp;
    }
    return true;
  });
});

function formatCurrency(v) {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(v);
}

function formatDate(isoStr) {
  if (!isoStr) return '';
  return new Date(isoStr).toLocaleDateString();
}

function formatDateTime(isoStr) {
  if (!isoStr) return '';
  return new Date(isoStr).toISOString().replace('T', ' ').slice(0, 19);
}

function getStatusClass(st) {
  const map = {
    open: 'bg-red-500/10 text-red-500 border border-red-500/20',
    under_review: 'bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse',
    resolved: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
    frozen: 'bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] border border-[var(--color-border)]',
    dismissed: 'bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'
  };
  return map[st] || 'bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)]';
}

function postArbitrateReply() {
  if (!replyText.value.trim()) return;
  
  const currentAuthor = authStore.user?.name || 'CONTRÔLE CENTRAL';
  const newCmt = {
    id: `cmt_${Date.now()}`,
    author: `${currentAuthor} (Arbitre)`,
    text: replyText.value.trim(),
    date: new Date().toISOString()
  };

  selectedDispute.value.comments.push(newCmt);
  replyText.value = '';

  if (selectedDispute.value.status === 'open') {
    selectedDispute.value.status = 'under_review';
  }

  writeAuditLog(
    'DISPUTE_MEDIATED',
    `Nouveau commentaire posté sur le litige ${selectedDispute.value.disputeRef} par ${currentAuthor}.`,
    currentAuthor
  );

  toast.success('Réponse d\'arbitrage soumise.');
}

function approveDisputeRefunding() {
  const currentAuthor = authStore.user?.name || 'CONTRÔLE CENTRAL';
  selectedDispute.value.status = 'resolved';

  selectedDispute.value.comments.push({
    id: `sys_${Date.now()}`,
    author: 'Admin Système',
    text: `Décision finale d'arbitrage exécutée. Transaction de séquestre débloquée pour le remboursement total de ${selectedDispute.value.amount} FCFA vers le compte de l'acheteur.`,
    date: new Date().toISOString()
  });

  writeAuditLog(
    'DISPUTE_REFUND_APPROVED',
    `Remboursement de litige approuvé pour ${selectedDispute.value.buyer}. Montant résolu : ${selectedDispute.value.amount} FCFA.`,
    currentAuthor
  );

  toast.success(`Litige résolu en faveur de l'acheteur. Fonds remboursés.`);
}

const showConfirm = ref(false);
const confirmTitle = ref('');
const confirmMessage = ref('');
const confirmActionLabel = ref('');
const pendingType = ref('');

function triggerDisputeFreeze() {
  pendingType.value = 'dispute_freeze';
  confirmTitle.value = 'SURCHARGE SÉCURITÉ : GELER LES PAIEMENTS SÉQUESTRES';
  confirmMessage.value = `Vous êtes sur le point de geler les fonds séquestrés d'un montant de ${selectedDispute.value.amount} FCFA. Aucun parti ne pourra retirer les fonds avant la fin de l'audit.`;
  confirmActionLabel.value = 'GELER LES FONDS';
  showConfirm.value = true;
}

function triggerDisputeDismiss() {
  pendingType.value = 'dispute_dismiss';
  confirmTitle.value = 'REJETER LA RÉCLAMATION / CLÔTURER LE LITIGE';
  confirmMessage.value = `Vous rejetez la réclamation de l'acheteur ${selectedDispute.value.disputeRef} et clôturez le litige. Tous les fonds séquestrés de ${selectedDispute.value.amount} FCFA seront reversés directement au fournisseur ${selectedDispute.value.supplier}.`;
  confirmActionLabel.value = 'REJETER & CLÔTURER LA RÉCLAMATION';
  showConfirm.value = true;
}

function closeConfirm() {
  showConfirm.value = false;
  pendingType.value = '';
}

function executeDisputeOverride(reason) {
  const currentAuthor = authStore.user?.name || 'CONTRÔLE CENTRAL';

  if (pendingType.value === 'dispute_freeze') {
    selectedDispute.value.status = 'frozen';
    selectedDispute.value.comments.push({
      id: `sys_${Date.now()}`,
      author: 'Admin Système',
      text: `Fonds séquestrés gelés par l'arbitre. Revue de conformité en cours. Raison : ${reason}`,
      date: new Date().toISOString()
    });

    writeAuditLog(
      'DISPUTE_FREEZE_OVERRIDE',
      `Blocage d'arbitrage placé sur le litige ${selectedDispute.value.disputeRef}. Raison : ${reason}`,
      currentAuthor,
      'danger'
    );

    toast.error(`Séquestre verrouillé et gelé.`);
  } 
  
  else if (pendingType.value === 'dispute_dismiss') {
    selectedDispute.value.status = 'dismissed';
    selectedDispute.value.comments.push({
      id: `sys_${Date.now()}`,
      author: 'Admin Système',
      text: `Réclamation rejetée. Litige clos. Fonds débloqués pour le fournisseur. Raison : ${reason}`,
      date: new Date().toISOString()
    });

    writeAuditLog(
      'DISPUTE_DISMISSED',
      `Réclamation de l'acheteur rejetée pour le litige ${selectedDispute.value.disputeRef}. Séquestre débloqué pour le fournisseur. Raison : ${reason}`,
      currentAuthor,
      'warning'
    );

    toast.warning(`Réclamation de l'acheteur rejetée. Fonds débloqués pour le fournisseur.`);
  }

  showConfirm.value = false;
  pendingType.value = '';
}

function handleKeyDown(e) {
  if (e.key === 'Escape') {
    closeConfirm();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>
