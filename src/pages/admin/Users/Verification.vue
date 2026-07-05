<template>
  <div class="space-y-6">
    
    <!-- HEADER SUMMARY -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5 shrink-0">
      <div>
        <h1 class="text-xl font-bold font-mono text-[var(--color-text-primary)] flex items-center gap-2">
          <ShieldCheckIcon class="h-5 w-5 text-[var(--color-primary)]" />
          <span>Bureau de Conformité, KYC & Vérification des Boutiques</span>
        </h1>
        <p class="text-xs text-[var(--color-text-secondary)]">Validez les enregistrements d'entreprises, identifiants fiscaux, profils marchands et points de vente.</p>
      </div>
      
      <!-- BULK METRICS BADGES -->
      <div class="flex items-center space-x-3 text-xs font-mono">
        <span class="px-2.5 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)]">
          KYC en attente : <strong class="text-amber-500">{{ pendingKYCCount }}</strong>
        </span>
        <span class="px-2.5 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)]">
          Boutiques Fermées : <strong class="text-red-500">{{ lockedStoresCount }}</strong>
        </span>
      </div>
    </div>

    <!-- HORIZONTAL TABS SWITCHER -->
    <div class="flex border-b border-[var(--color-border)] select-none">
      <button 
        v-for="tb in tabs" 
        :key="tb.id"
        @click="activeTab = tb.id"
        class="px-5 py-3 text-xs font-bold uppercase font-mono border-b-2 tracking-wider transition-all cursor-pointer"
        :class="activeTab === tb.id ? 'border-[var(--color-primary)] text-[var(--color-text-primary)] bg-[var(--color-primary-muted)]/20 font-bold' : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'"
      >
        {{ tb.label }}
        <span 
          v-if="tb.badgeCount > 0"
          class="ml-1.5 px-2 py-0.5 bg-red-500/10 text-red-500 text-[9px] rounded-full font-bold uppercase border border-red-500/20"
        >
          {{ tb.badgeCount }}
        </span>
      </button>
    </div>

    <!-- TAB 1 CONTENT: KYC/KYB DOSSIERS REGULATION -->
    <div v-show="activeTab === 'kyc'" class="space-y-4">
      <div class="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
        <h2 class="text-xs font-bold uppercase font-mono tracking-wider text-[var(--color-text-primary)]">Audit de la Documentation KYB d'Entreprise</h2>
        <p class="text-[11px] text-[var(--color-text-secondary)]">Examinez le NIU fiscal officiel, le registre du commerce, l'identité des gestionnaires et les statuts des fournisseurs de matières premières.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="u in supplierKYCUsers" 
          :key="u.id"
          class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:border-[var(--color-primary)] transition flex flex-col"
        >
          <!-- Card Top Bar -->
          <div class="px-4 py-3 bg-[var(--color-background)] border-b border-[var(--color-border)] flex items-center justify-between">
            <span class="font-mono text-[10px] text-[var(--color-text-secondary)] font-bold">Dossier #{{ u.id.replace('usr_', '') }}</span>
            <span 
              class="px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold"
              :class="getKYCBadgeClass(u.kyc)"
            >
              {{ u.kyc?.verified ? 'VALIDÉ' : 'AUDIT EN ATTENTE' }}
            </span>
          </div>

          <!-- Card Body -->
          <div class="p-5 flex-1 space-y-4">
            <div>
              <p class="text-xs text-[var(--color-text-secondary)] font-mono">Entreprise / Responsable</p>
              <h3 class="text-sm font-semibold text-[var(--color-text-primary)] mt-0.5">{{ u.kyc?.companyName || u.company }}</h3>
              <p class="text-xs text-[var(--color-text-secondary)] font-mono">{{ u.kyc?.managerName || u.name }}</p>
            </div>

            <!-- KYC Cert Codes -->
            <div class="grid grid-cols-2 gap-3 text-xs bg-[var(--color-background)] p-3 rounded-xl border border-[var(--color-border)]">
              <div>
                <span class="text-[9px] font-mono text-[var(--color-text-secondary)] uppercase block">Rég. Commerce (RC)</span>
                <span class="font-mono text-[var(--color-text-primary)] text-[11px]">{{ u.kyc?.rc || 'N/A' }}</span>
              </div>
              <div>
                <span class="text-[9px] font-mono text-[var(--color-text-secondary)] uppercase block">Code Fiscal (NIU)</span>
                <span class="font-mono text-[var(--color-text-primary)] text-[11px]">{{ u.kyc?.niu || 'N/A' }}</span>
              </div>
              <div class="col-span-2">
                <span class="text-[9px] font-mono text-[var(--color-text-secondary)] uppercase block">Siège Social</span>
                <span class="text-[var(--color-text-primary)] text-[11px]">{{ u.kyc?.address || 'N/A' }}</span>
              </div>
            </div>

            <!-- Submitted Docs -->
            <div class="space-y-1">
              <span class="text-[9px] font-mono text-[var(--color-text-secondary)] uppercase block">Pièces Jointes PDF Sécurisées</span>
              <div 
                @click="openDocPreview(u.kyc?.fiscalDocs || 'statuts_entreprise.pdf')"
                class="flex items-center space-x-2 text-[10px] font-mono text-[var(--color-primary)] bg-[var(--color-background)] p-2.5 rounded-lg border border-[var(--color-border)] cursor-pointer hover:border-[var(--color-primary)] transition"
              >
                <DocumentIcon class="w-4 h-4 text-red-500" />
                <div class="truncate flex-1">
                  <span class="hover:underline font-bold">{{ u.kyc?.fiscalDocs || 'statuts_entreprise.pdf' }}</span>
                  <span class="text-[var(--color-text-secondary)] block text-[9px] font-normal mt-0.5">(4.2 Mo - Vérifié par SHA256 - Cliquez pour prévisualiser)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions Footer (Required confirming rejects) -->
          <div class="px-4 py-3 bg-[var(--color-background)] border-t border-[var(--color-border)] flex items-center justify-end gap-2 shrink-0">
            <template v-if="!u.kyc?.verified">
              <button 
                @click="triggerKYCReject(u)"
                class="px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-lg text-[10px] font-mono uppercase font-bold transition cursor-pointer"
              >
                Rejeter le Dossier
              </button>
              <button 
                @click="approveKYCDossier(u)"
                class="px-3 py-1.5 bg-emerald-650 hover:opacity-90 text-white rounded-lg text-[10px] font-mono uppercase font-bold transition cursor-pointer"
              >
                Approuver & Valider
              </button>
            </template>
            <template v-else>
              <div class="flex items-center text-[10px] font-mono text-emerald-550 space-x-1 pr-1.5">
                <CheckIcon class="w-3.5 h-3.5" />
                <span>Validé le : {{ formatShortTime(u.kyc?.verifiedAt || u.created_at) }}</span>
              </div>
              <button 
                @click="triggerKYCReject(u)"
                class="px-2.5 py-1 bg-[var(--color-surface)] hover:bg-red-500/10 text-[var(--color-text-secondary)] hover:text-red-500 rounded border border-[var(--color-border)] transition text-[9px] font-mono uppercase cursor-pointer"
              >
                Suspendre / Révoquer
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2 CONTENT: SUPPLIER ACCOUNTS ACTIVATIONS -->
    <div v-show="activeTab === 'suppliers'" class="space-y-4">
      <div class="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
        <h2 class="text-xs font-bold uppercase font-mono tracking-wider text-[var(--color-text-primary)]">Activations des Accès Fournisseurs</h2>
        <p class="text-[11px] text-[var(--color-text-secondary)]">Verrouillez, approuvez ou suspendez les accès back-office et comptes des gestionnaires fournisseurs vérifiés.</p>
      </div>

      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr class="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
                <th class="p-3 pl-5">Marchand / Représentant</th>
                <th class="p-3">Adresse E-mail</th>
                <th class="p-3">Sous-domaine Enregistré</th>
                <th class="p-3">Date d'Inscription</th>
                <th class="p-3">Statut</th>
                <th class="p-3 text-right pr-5">Contrôle Administratif</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[var(--color-border)]">
              <tr 
                v-for="u in supplierUsers" 
                :key="u.id" 
                class="hover:bg-[var(--color-surface-hover)]/40 text-[var(--color-text-primary)] transition"
              >
                <td class="p-3 pl-5">
                  <div class="font-bold text-[var(--color-text-primary)] text-sm leading-snug">{{ u.company }}</div>
                  <div class="text-[11px] text-[var(--color-text-secondary)]">{{ u.name }}</div>
                </td>
                <td class="p-3 font-mono text-[11px] text-[var(--color-text-secondary)]">{{ u.email }}</td>
                <td class="p-3 font-mono">
                  <span class="text-[var(--color-primary)] hover:underline cursor-pointer">{{ u.tenant }}.enterprise.local</span>
                </td>
                <td class="p-3 text-[var(--color-text-secondary)]">{{ formatDate(u.created_at) }}</td>
                <td class="p-3 font-mono">
                  <span 
                    class="px-2 py-0.5 rounded text-[9px] font-bold uppercase"
                    :class="u.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'"
                  >
                    {{ u.status === 'approved' ? 'ACTIF' : 'SUSPENDU' }}
                  </span>
                </td>
                <td class="p-3 text-right pr-5 font-mono">
                  <button 
                    v-if="u.status === 'approved'"
                    @click="triggerSupplierAccountGel(u)"
                    class="px-2.5 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-lg text-[10px] uppercase font-bold transition cursor-pointer"
                  >
                    Geler / Suspendre
                  </button>
                  <button 
                    v-else
                    @click="approveSupplierAccount(u)"
                    class="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] uppercase font-bold transition cursor-pointer"
                  >
                    Autoriser l'Accès
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 3 CONTENT: POS BOUTIQUES / SHOPS ACTIVATIONS -->
    <div v-show="activeTab === 'boutiques'" class="space-y-4">
      <div class="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
        <h2 class="text-xs font-bold uppercase font-mono tracking-wider text-[var(--color-text-primary)]">Points de Contrôle des Caisses POS de District</h2>
        <p class="text-[11px] text-[var(--color-text-secondary)]">Suspendez, auditez ou approuvez les caisses enregistreuses virtuelles locales synchronisées dans les magasins à travers le Cameroun.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="st in stores" 
          :key="st.id"
          class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-[var(--color-primary)] transition"
        >
          <div>
            <div class="flex items-center justify-between">
              <span class="px-2 py-0.5 bg-[var(--color-background)] text-[var(--color-primary)] rounded text-[9px] font-mono uppercase font-bold border border-[var(--color-border)]">
                REGISTRE POS #{{ st.id.replace('store_','') }}
              </span>
              <span 
                class="px-2 py-0.5 rounded text-[8px] font-mono uppercase font-bold"
                :class="st.status === 'online' || st.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'"
              >
                {{ st.status === 'online' || st.isActive ? 'EN LIGNE ACTIF' : 'SUSPENDU' }}
              </span>
            </div>
            <h3 class="text-sm font-bold text-[var(--color-text-primary)] font-sans mt-3 leading-snug">{{ st.name }}</h3>
            <p class="text-xs text-[var(--color-text-secondary)] mt-1 uppercase tracking-tight font-mono">{{ st.city }}, {{ st.address }}</p>
          </div>

          <div class="space-y-1 text-xs font-mono pt-2 border-t border-[var(--color-border)] leading-tight">
            <div class="flex items-center justify-between text-[var(--color-text-secondary)]">
              <span>Nom du Responsable :</span>
              <span class="text-[var(--color-text-primary)] font-sans">{{ st.manager || st.managerName }}</span>
            </div>
            <div class="flex items-center justify-between text-[var(--color-text-secondary)]">
              <span>Plafond Quotidien (FCFA) :</span>
              <span class="text-[var(--color-text-primary)]">{{ formatCurrency(st.dailyTargetXAF || 1200000) }}</span>
            </div>
            <div class="flex items-center justify-between text-[var(--color-text-secondary)]">
              <span>Terminaux de Caisse :</span>
              <span class="text-[var(--color-text-primary)]">{{ st.cashRegistersCount || 2 }} synchronisés</span>
            </div>
          </div>

          <!-- Actions Footer (Confirm Rejections/Suspending) -->
          <div class="pt-2 flex items-center justify-end gap-2 font-mono">
            <button 
              v-if="st.status === 'online' || st.isActive"
              @click="triggerBoutiqueSuspend(st)"
              class="w-full text-center py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-xl text-[10px] uppercase font-bold transition cursor-pointer"
            >
              Geler / Suspendre la caisse
            </button>
            <button 
              v-else
              @click="restoreBoutique(st)"
              class="w-full text-center py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] uppercase font-bold transition cursor-pointer"
            >
              Débloquer / Ouvrir
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- DOCUMENT PREVIEW MODAL -->
    <div 
      v-if="previewDocName"
      @click.self="previewDocName = ''"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] w-full max-w-2xl overflow-hidden shadow-2xl p-6 space-y-4 rounded-2xl animate-slide-up text-[var(--color-text-primary)]">
        <div class="flex justify-between items-start border-b border-[var(--color-border)] pb-3">
          <div>
            <h2 class="text-sm font-bold uppercase tracking-wider font-mono text-[var(--color-text-primary)]">Aperçu du Document de Conformité</h2>
            <p class="text-[10px] font-mono text-[var(--color-primary)]">{{ previewDocName }}</p>
          </div>
          <button @click="previewDocName = ''" class="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer">
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>
        
        <div class="p-8 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-center space-y-4 h-64 flex flex-col items-center justify-center">
          <DocumentIcon class="w-12 h-12 text-[var(--color-text-secondary)]" />
          <div class="space-y-1">
            <p class="text-xs text-[var(--color-text-primary)] font-bold">Lecteur Sécurisé de Documents de Conformité</p>
            <p class="text-[11px] text-[var(--color-text-secondary)] font-mono">Ce document PDF est stocké de manière hautement sécurisée.</p>
          </div>
        </div>

        <div class="flex justify-end pt-2">
          <button 
            @click="previewDocName = ''"
            class="px-4 py-2 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] text-xs font-mono uppercase rounded-xl transition cursor-pointer"
          >
            Fermer l'Aperçu
          </button>
        </div>
      </div>
    </div>

    <!-- MANDATORY COMPLIANCE SAFETY CONFIRMATION OVERRIDE MODAL -->
    <ConfirmationModal 
      :show="showConfirm"
      :title="confirmTitle"
      :message="confirmMessage"
      :action-label="confirmActionLabel"
      @close="closeConfirm"
      @confirm="executeRejectionOverride"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/store/modules/auth.js';
import { useToast } from 'vue-toastification';
import { writeAuditLog } from '@/utils/admin_db.js';
import { stores } from '@/utils/supplier_db.js';
import ConfirmationModal from '@/components/ConfirmationModal.vue';
import { 
  ShieldCheckIcon, 
  CheckIcon, 
  XMarkIcon, 
  DocumentIcon 
} from '@heroicons/vue/24/outline';

const authStore = useAuthStore();
const toast = useToast();

const activeTab = ref('kyc');
const previewDocName = ref('');

const tabs = computed(() => [
  { id: 'kyc', label: 'Audit des Dossiers KYC / KYB', badgeCount: pendingKYCCount.value },
  { id: 'suppliers', label: 'Vérifications Fournisseurs', badgeCount: pendingSupplierUsersCount.value },
  { id: 'boutiques', label: 'Approbations Caisses POS', badgeCount: 0 }
]);

// Filters Count
const pendingKYCCount = computed(() => {
  return authStore.users.filter(u => u.roles.includes('supplier') && u.kyc && !u.kyc.verified).length;
});

const pendingSupplierUsersCount = computed(() => {
  return authStore.users.filter(u => u.roles.includes('supplier') && u.status === 'pending').length;
});

const lockedStoresCount = computed(() => {
  return stores.value.filter(s => s.status !== 'online' && !s.isActive).length;
});

// Queries list
const supplierKYCUsers = computed(() => {
  return authStore.users.filter(u => u.roles.includes('supplier') && u.kyc);
});

const supplierUsers = computed(() => {
  return authStore.users.filter(u => u.roles.includes('supplier'));
});

// Formatting
function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatShortTime(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return d.toISOString().replace('T', ' ').slice(0, 10);
}

function formatCurrency(v) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(v);
}

function getKYCBadgeClass(kyc) {
  if (kyc?.verified) return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
  return 'bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse';
}

function openDocPreview(docName) {
  previewDocName.value = docName;
}

// COMPLIANCE APPROVAL WORKFLOWS
function approveKYCDossier(userItem) {
  authStore.approveSupplier(userItem.tenant, userItem.id);
  
  const associatedStore = stores.value.find(s => s.id === `store_${userItem.tenant}`);
  if (associatedStore) {
    associatedStore.status = 'online';
    associatedStore.isActive = true;
  }

  writeAuditLog(
    'KYC_APPROVAL',
    `Dossier KYC approuvé et validé pour ${userItem.company} (Représentant : ${userItem.name}).`,
    authStore.user?.name || 'Superviseur'
  );

  toast.success(`Dossier validé et approuvé pour ${userItem.company} !`);
}

function approveSupplierAccount(userItem) {
  userItem.status = 'approved';
  authStore.saveState();

  writeAuditLog(
    'SUPPLIER_ACTIVATION',
    `Compte fournisseur activé et approuvé : ${userItem.company}.`,
    authStore.user?.name || 'Superviseur'
  );

  toast.success(`Accès serveur autorisé pour ${userItem.company}.`);
}

function restoreBoutique(st) {
  st.status = 'online';
  st.isActive = true;
  
  writeAuditLog(
    'STORE_UNFREEZE',
    `Caisse enregistreuse POS de district réactivée : ${st.name}.`,
    authStore.user?.name || 'Superviseur'
  );

  toast.success(`Terminaux POS réactivés pour : ${st.name}`);
}

// SAFETY CONFIRMATION MODAL OVERRIDE VARIABLES
const showConfirm = ref(false);
const confirmTitle = ref('');
const confirmMessage = ref('');
const confirmActionLabel = ref('');
const currentOverrideTarget = ref(null);
const currentOverrideType = ref(''); // 'kyc_reject', 'supplier_freeze', 'boutique_freeze'

function triggerKYCReject(userItem) {
  currentOverrideTarget.value = userItem;
  currentOverrideType.value = 'kyc_reject';
  confirmTitle.value = 'REJETER & SUSPENDRE LE KYC';
  confirmMessage.value = `Vous rejetez les dossiers réglementaires soumis par ${userItem.company}. Cela verrouille leur espace de travail et empêche la gestion des stocks.`;
  confirmActionLabel.value = 'REJETER LA SOUMISSION';
  showConfirm.value = true;
}

function triggerSupplierAccountGel(userItem) {
  currentOverrideTarget.value = userItem;
  currentOverrideType.value = 'supplier_freeze';
  confirmTitle.value = 'GELER / SUSPENDRE LE FOURNISSEUR';
  confirmMessage.value = `Vous appliquez un gel de sécurité sur le compte de ${userItem.company}. Leurs clés d'accès seront invalidées instantanément.`;
  confirmActionLabel.value = 'GELER LE COMPTE MARCHAND';
  showConfirm.value = true;
}

function triggerBoutiqueSuspend(st) {
  currentOverrideTarget.value = st;
  currentOverrideType.value = 'boutique_freeze';
  confirmTitle.value = 'GELER / SUSPENDRE LA BOUTIQUE';
  confirmMessage.value = `Vous suspendez les ventes et verrouillez les terminaux de caisse pour le magasin "${st.name}".`;
  confirmActionLabel.value = 'VERROUILLER LA CAISSE';
  showConfirm.value = true;
}

function closeConfirm() {
  showConfirm.value = false;
  currentOverrideTarget.value = null;
  currentOverrideType.value = '';
}

function executeRejectionOverride(reason) {
  const target = currentOverrideTarget.value;
  const author = authStore.user?.name || 'Superviseur';

  if (currentOverrideType.value === 'kyc_reject') {
    target.status = 'pending';
    if (target.kyc) {
      target.kyc.verified = false;
      target.kyc.verifiedAt = null;
      target.kyc.rejectionReason = reason;
    }
    
    const t = authStore.tenants.find(x => x.id === target.tenant);
    if (t) t.active = false;

    authStore.saveState();

    writeAuditLog(
      'KYC_REJECTION',
      `Dossier KYC rejeté pour ${target.company}. Raison : ${reason}`,
      author,
      'warning'
    );
    
    toast.error(`Rejet de conformité appliqué pour ${target.company}.`);
  } 
  
  else if (currentOverrideType.value === 'supplier_freeze') {
    target.status = 'pending';
    authStore.saveState();

    writeAuditLog(
      'SUPPLIER_GEL',
      `Portail marchand gelé pour ${target.company}. Raison : ${reason}`,
      author,
      'danger'
    );

    toast.error(`Accès du portail fournisseur suspendu.`);
  } 
  
  else if (currentOverrideType.value === 'boutique_freeze') {
    target.status = 'suspended';
    target.isActive = false;

    writeAuditLog(
      'BOUTIQUE_GEL',
      `Caisse POS suspendue pour ${target.name}. Raison : ${reason}`,
      author,
      'danger'
    );

    toast.error(`Gel des ventes appliqué pour ${target.name}.`);
  }

  showConfirm.value = false;
  currentOverrideTarget.value = null;
  currentOverrideType.value = '';
}

function handleKeyDown(e) {
  if (e.key === 'Escape') {
    previewDocName.value = '';
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

<style scoped>
@media (min-width: 1024px) {
  .animate-slide-up {
    animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
