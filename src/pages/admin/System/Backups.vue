<template>
  <div class="space-y-6 animate-fade-in">

    <!-- HEADER BLOCK -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5 shrink-0">
      <div>
        <h1 class="text-xl font-bold font-mono text-[var(--color-text-primary)] flex items-center gap-2">
          Registre des Sauvegardes de la Plateforme
        </h1>
        <p class="text-xs text-[var(--color-text-secondary)]">Planifiez la réplication cloud automatique, effectuez des instantanés de bases de données et restaurez les fichiers de structure.</p>
      </div>

      <button 
        @click="triggerHotBackup"
        class="px-4 py-2 bg-[var(--color-primary)] hover:opacity-90 text-xs font-mono font-bold uppercase text-[var(--color-text-primary)] transition flex items-center space-x-2 shrink-0 animate-bounce cursor-pointer"
        title="Enregistrer l'état réel maintenant"
        id="add-backup-btn"
      >
        <span>+ Nouvel Instantané</span>
      </button>
    </div>

    <!-- GENERAL CODES -->
    <div class="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] leading-relaxed font-sans">
      <span class="font-bold text-[var(--color-text-primary)] font-mono uppercase text-[9px] block mb-1">Note d'Intégrité de l'État :</span>
      Les sauvegardes incrémentielles du cluster enregistrent dynamiquement les structures des magasins, les tables d'authentification, les litiges actifs et le catalogue d'inventaire sur un stockage cloud externe sécurisé.
    </div>

    <!-- SKELETON LOADERS SIMULATION -->
    <div v-if="isLoading" class="p-6 border border-[var(--color-border)] bg-[var(--color-background)]">
      <SkeletonLoader type="table" :rows="4" />
    </div>

    <div v-else class="space-y-4">
      <!-- MAIN BACKUPS LIST ROW -->
      <div v-if="paginatedBackups.length === 0" class="p-12 text-center border-2 border-dashed border-var(--color-border) bg-[var(--color-surface)]/10 flex flex-col items-center justify-center space-y-3">
        <svg class="h-8 w-8 text-[var(--color-text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p class="text-xs text-[var(--color-text-secondary)] font-mono">Aucun instantané disponible dans le catalogue système.</p>
      </div>

      <div v-else class="bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden shadow rounded-2xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr class="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
                <th class="p-3 pl-5">Référence de la Sauvegarde</th>
                <th class="p-3">Capturé Par</th>
                <th class="p-3">Taille du Fichier</th>
                <th class="p-3">Statut</th>
                <th class="p-3 text-right pr-5">Restaurer l'État</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[var(--color-border)]">
              <tr 
                v-for="bk in paginatedBackups" 
                :key="bk.id"
                class="hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] transition"
              >
                <td class="p-3 pl-5">
                  <div class="font-mono text-[10.5px] text-[var(--color-primary)] font-bold uppercase">{{ bk.backupName || bk.name }}</div>
                  <div class="text-[9px] text-[var(--color-text-secondary)] font-mono">{{ formatDate(bk.date) }}</div>
                </td>
                <td class="p-3 text-[var(--color-text-primary)]">{{ bk.capturedBy || bk.author }}</td>
                <td class="p-3 font-mono text-[var(--color-text-secondary)]">{{ bk.size || '3,42 Mo' }}</td>
                <td class="p-3">
                  <span class="px-2 py-0.5 text-[8px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded">
                    Terminée
                  </span>
                </td>
                <td class="p-3 text-right pr-5 font-mono">
                  <button 
                    @click="triggerRestoreBackup(bk)"
                    class="px-2.5 py-1 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 text-[10px] font-bold uppercase transition cursor-pointer rounded"
                    title="DANGER : Restaurer toute la base de données à cet état"
                  >
                    Restaurer l'État
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- PAGINATION CONTROLLERS -->
      <Pagination 
        :totalItems="backups.length" 
        :pageSize="pageSize" 
        v-model:currentPage="currentPage" 
      />
    </div>

    <!-- MANDATORY RESTORE STATE POLICY SAFETY ALERT SHIELD -->
    <ConfirmationModal 
      :show="showConfirm"
      :title="confirmTitle"
      :message="confirmMessage"
      :action-label="confirmActionLabel"
      @close="closeConfirm"
      @confirm="executeRestoreOverride"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { backups, writeAuditLog } from '@/utils/admin_db.js';
import { useAuthStore } from '@/store/modules/auth.js';
import { useToast } from 'vue-toastification';
import ConfirmationModal from '@/components/ConfirmationModal.vue';
import Pagination from '@/components/Pagination.vue';
import SkeletonLoader from '@/components/SkeletonLoader.vue';

const authStore = useAuthStore();
const toast = useToast();

const isLoading = ref(true);
const currentPage = ref(1);
const pageSize = ref(4);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 600);
});

function formatDate(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return d.toISOString().replace('T', ' ').slice(0, 19);
}

// Paginate snapshots database list array
const paginatedBackups = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return backups.value.slice(start, start + pageSize.value);
});

// CAPTURE NEW SNAPSHOT
function triggerHotBackup() {
  const currentAuthor = authStore.user?.name || 'Opérateur Central';
  const newBackupName = `hot_snapshot_${Date.now().toString().slice(-6)}`;
  
  const snapObj = {
    id: `bk_${Date.now()}`,
    backupName: newBackupName.toUpperCase(),
    capturedBy: currentAuthor,
    date: new Date().toISOString(),
    size: '4,14 MB'
  };

  backups.value.unshift(snapObj);
  currentPage.value = 1;

  writeAuditLog(
    'HOT_BACKUP_CREATED',
    `Fichier d'instantané structurel généré avec succès : ${snapObj.backupName}.`,
    currentAuthor
  );

  toast.success(`Instantané de base de données enregistré sous ${snapObj.backupName} !`);
}

// RESTORE CONFIRM POPUP (CRITICAL ACTIONS)
const showConfirm = ref(false);
const confirmTitle = ref('');
const confirmMessage = ref('');
const confirmActionLabel = ref('');
const targetBackup = ref(null);

function triggerRestoreBackup(bk) {
  targetBackup.value = bk;
  confirmTitle.value = 'RESTAURATION DÉSTRUCTIVE DE L\'ÉTAT';
  confirmMessage.value = `Vous êtes sur le point de RESTAURER les données structurelles de la plateforme vers la sauvegarde "${bk.backupName || bk.name}". Les sessions actives seront fermées, les transactions en cours seront écrasées et les états de synchronisation redémarreront !`;
  confirmActionLabel.value = 'RESTAURER L\'ÉTAT DU SYSTÈME';
  showConfirm.value = true;
}

function closeConfirm() {
  showConfirm.value = false;
  targetBackup.value = null;
}

function executeRestoreOverride(reason) {
  if (targetBackup.value) {
    const bk = targetBackup.value;

    writeAuditLog(
      'DATABASE_SNAPSHOT_RESTORED',
      `Restauration système exécutée à partir de la sauvegarde : ${bk.backupName || bk.name}. Raison : ${reason}`,
      authStore.user?.name || 'Opérateur Central',
      'danger'
    );

    toast.warning(`Restauration de l'instantané effectuée avec succès.`);
    closeConfirm();
  }
}
</script>
