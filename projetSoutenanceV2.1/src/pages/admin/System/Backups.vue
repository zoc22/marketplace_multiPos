<template>
  <div class="space-y-6 animate-fade-in">

    <!-- HEADER BLOCK -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5 shrink-0">
      <div>
        <h1 class="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
          Platform Snapshot Backups Registry
        </h1>
        <p class="text-xs text-slate-400">Schedule automatic cloud mirroring, capture hot instant database snapshots, and restore structural files.</p>
      </div>

      <button 
        @click="triggerHotBackup"
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-mono font-bold uppercase text-white transition flex items-center space-x-2 shrink-0 animate-bounce custom-tooltip-trigger"
        data-tooltip="Save real state right now"
        id="add-backup-btn"
      >
        <span>&plus; Hot Snapshot Now</span>
      </button>
    </div>

    <!-- GENERAL CODES -->
    <div class="p-4 bg-slate-900/40 border border-slate-900 text-xs text-slate-400 leading-relaxed font-sans">
      <span class="font-bold text-slate-200 font-mono uppercase text-[9px] block mb-1">State Integrity Note:</span>
      Incremental cluster backups save local store structures, auth tables, active disputes records, and inventory catalogs dynamically into secure off-site cloud storage.
    </div>

    <!-- SKELETON LOADERS SIMULATION -->
    <div v-if="isLoading" class="p-6 border border-slate-900 bg-slate-950">
      <SkeletonLoader type="table" :rows="4" />
    </div>

    <div v-else class="space-y-4">
      <!-- MAIN BACKUPS LIST ROW -->
      <div v-if="paginatedBackups.length === 0" class="p-12 text-center border-2 border-dashed border-slate-900 bg-slate-900/10 flex flex-col items-center justify-center space-y-3">
        <svg class="h-8 w-8 text-slate-650" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p class="text-xs text-slate-500 font-mono">No available snaps found in system storage catalog.</p>
      </div>

      <div v-else class="bg-slate-950 border border-slate-900 overflow-hidden shadow">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr class="text-[10px] font-mono text-slate-500 uppercase border-b border-slate-900 bg-slate-900/40">
                <th class="p-3 pl-5 col-span-2">Backup ID Reference</th>
                <th class="p-3">Captured By</th>
                <th class="p-3">File Size</th>
                <th class="p-3">Status</th>
                <th class="p-3 text-right pr-5">Restore State</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#121c3b]/30">
              <tr 
                v-for="bk in paginatedBackups" 
                :key="bk.id"
                class="hover:bg-slate-900/30 text-slate-300 transition"
              >
                <td class="p-3 pl-5">
                  <div class="font-mono text-[10.5px] text-indigo-400 font-bold uppercase">{{ bk.backupName || bk.name }}</div>
                  <div class="text-[9px] text-slate-450 font-mono">{{ formatDate(bk.date) }}</div>
                </td>
                <td class="p-3 text-slate-300">{{ bk.capturedBy || bk.author }}</td>
                <td class="p-3 font-mono text-slate-400">{{ bk.size || '3.42 MB' }}</td>
                <td class="p-3">
                  <span class="px-2 py-0.5 text-[8px] font-mono font-bold uppercase bg-emerald-950 text-emerald-450 border border-emerald-900/40">
                    Completed
                  </span>
                </td>
                <td class="p-3 text-right pr-5 font-mono">
                  <button 
                    @click="triggerRestoreBackup(bk)"
                    class="px-2.5 py-1 bg-red-950/20 text-red-500 hover:bg-red-650 hover:text-white border border-red-900/40 text-[10px] font-bold uppercase transition custom-tooltip-trigger"
                    data-tooltip="DANGER: Rollback whole DB to this state"
                  >
                    Restore State
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
  const currentAuthor = authStore.user?.name || 'Central Operator';
  const newBackupName = `hot_snapshot_${Date.now().toString().slice(-6)}`;
  
  const snapObj = {
    id: `bk_${Date.now()}`,
    backupName: newBackupName.toUpperCase(),
    capturedBy: currentAuthor,
    date: new Date().toISOString(),
    size: '4.14 MB'
  };

  backups.value.unshift(snapObj);
  currentPage.value = 1; // back to page 1 to see the new entry

  writeAuditLog(
    'HOT_BACKUP_CREATED',
    `Hot snapshot structural file generated successfully: ${snapObj.backupName}.`,
    currentAuthor
  );

  toast.success(`Hot database snapshot saved as ${snapObj.backupName}!`);
}

// RESTORE CONFIRM POPUP (CRITICAL ACTIONS)
const showConfirm = ref(false);
const confirmTitle = ref('');
const confirmMessage = ref('');
const confirmActionLabel = ref('');
const targetBackup = ref(null);

function triggerRestoreBackup(bk) {
  targetBackup.value = bk;
  confirmTitle.value = 'DESTRUCTIVE STATE RESTORE ROLLBACK';
  confirmMessage.value = `You are about to ROLLBACK structural platform data to database backup snap "${bk.backupName || bk.name}". Active buyer sessions could terminate, current transaction registers will overwrite, and sync states will restart!`;
  confirmActionLabel.value = 'ROLLBACK SYSTEM DATA STATE';
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
      `Restored system state directory rollback executed from backup: ${bk.backupName || bk.name}. Reason: ${reason}`,
      authStore.user?.name || 'Central Operator',
      'danger'
    );

    toast.warning(`Snapshot rollback executed successfully. Cluster synchronizing records.`);
    closeConfirm();
  }
}
</script>
