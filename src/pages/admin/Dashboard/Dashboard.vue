<template>
  <div class="space-y-6">
    
    <!-- BANNIÈRE SUPÉRIEURE & BIENVENUE -->
    <div class="p-6 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div class="absolute top-0 right-0 p-8 opacity-5 select-none pointer-events-none">
        <CpuChipIcon class="h-40 w-40 text-[var(--color-primary)]" />
      </div>
      <div>
        <div class="flex items-center space-x-3">
          <span class="px-2.5 py-0.5 bg-red-500/10 text-red-500 font-mono text-[9px] uppercase font-bold border border-red-500/20 rounded-md flex items-center space-x-1">
            <span class="h-1.5 w-1.5 bg-red-500 rounded-full animate-ping"></span>
            <span>STATUT DU MOTEUR : NOMINAL</span>
          </span>
          <span class="font-mono text-xs text-[var(--color-text-secondary)]">v3.5L-Stable</span>
        </div>
        <h1 class="text-xl font-bold font-mono text-[var(--color-text-primary)] mt-2">Centre d'Administration Central B2B</h1>
        <p class="text-xs text-[var(--color-text-secondary)] max-w-xl mt-1">
          Système de contrôle gérant les approbations des commerçants, la modération du catalogue, la résolution des litiges financiers et les audits système continus.
        </p>
      </div>

      <!-- SÉLECTEUR DE RÔLE ADMIN -->
      <div class="bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border)] shrink-0 w-full md:w-auto z-10">
        <div class="text-[9px] font-mono uppercase font-bold text-[var(--color-primary)] tracking-wider mb-2 flex items-center space-x-1">
          <ShieldCheckIcon class="w-3.5 h-3.5" />
          <span>Sélecteur de Rôle de Sécurité</span>
        </div>
        <div class="flex flex-col gap-1.5 min-w-[200px]">
          <label class="text-[10px] font-mono text-[var(--color-text-secondary)]">Rôle d'administration actif :</label>
          <select 
            v-model="activeAdminSubRole"
            @change="updateActivePersona"
            class="bg-[var(--color-background)] border border-[var(--color-border)] text-xs font-mono text-[var(--color-text-primary)] rounded-lg p-2 focus:outline-none focus:border-[var(--color-primary)]"
          >
            <option value="supervisor">Superviseur (Tous les droits)</option>
            <option value="finance_officer">Responsable Financier (Séquestres & Livret)</option>
            <option value="moderator">Modérateur Catalogue (Produits & Boutiques)</option>
            <option value="support_rep">Agent du Support (Litiges & Tickets)</option>
          </select>
          <p class="text-[9px] text-[var(--color-text-tertiary)] italic mt-1 leading-tight">
            Modifie instantanément vos droits et menus visibles.
          </p>
        </div>
      </div>
    </div>

    <!-- ALERTES DYNAMIQUES SELON LE RÔLE -->
    <div v-if="activeAdminSubRole !== 'supervisor'" class="p-3 bg-[var(--color-primary-muted)] border border-[var(--color-primary-border)] rounded-xl flex items-center space-x-3 text-xs">
      <div class="h-6 w-6 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center">
        <InformationCircleIcon class="w-4 h-4" />
      </div>
      <p class="text-[var(--color-text-primary)]">
        Vous naviguez actuellement en tant que <span class="font-bold text-[var(--color-primary)] font-mono">{{ (activeAdminSubRole || '').toUpperCase().replace('_', ' ') }}</span>. Certaines configurations et actions sont restreintes selon vos habilitations.
      </p>
    </div>

    <!-- GRILLE DES STATUT ET MÉTRIQUES -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      <!-- Conformité KYC -->
      <router-link to="/admin/users/verification" class="p-4 bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-2xl transition group flex flex-col justify-between shadow-sm">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Conformité KYC</span>
          <span class="h-[24px] w-[24px] rounded-full bg-amber-500 animate-pulse flex items-center justify-center text-white text-xs font-bold">!</span>
        </div>
        <div class="text-[28px] font-bold font-mono text-[var(--color-text-primary)] mt-2">
          {{ pendingKYCCount }} <span class="text-xs text-red-500 font-normal">en attente</span>
        </div>
        <p class="text-[10px] text-[var(--color-primary)] mt-1 transition flex items-center space-x-1">
          <span>Vérifier les dossiers marchands</span>
          <span>&rarr;</span>
        </p>
      </router-link>

      <!-- Boutiques Approvals -->
      <router-link to="/admin/users/verification" class="p-4 bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-2xl transition group flex flex-col justify-between shadow-sm">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Approbation Boutiques</span>
          <span class="h-[24px] w-[24px] rounded-full bg-indigo-400 animate-pulse flex items-center justify-center text-white text-xs font-bold">i</span>
        </div>
        <div class="text-[28px] font-bold font-mono text-[var(--color-text-primary)] mt-2">
          {{ pendingStoresCount }} <span class="text-xs text-red-500 font-normal">en attente</span>
        </div>
        <p class="text-[10px] text-[var(--color-primary)] mt-1 transition flex items-center space-x-1">
          <span>Vérifier les points de vente virtuels</span>
          <span>&rarr;</span>
        </p>
      </router-link>

      <!-- Modération catalogue -->
      <router-link to="/admin/products" class="p-4 bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-2xl transition group flex flex-col justify-between shadow-sm">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Catalogue Produits</span>
          <span class="text-[10px] font-mono text-emerald-500 uppercase font-bold border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 rounded">Audit Actif</span>
        </div>
        <div class="text-[28px] font-bold font-mono text-[var(--color-text-primary)] mt-2">
          {{ pendingProductsCount }} <span class="text-xs text-red-500 font-normal font-mono">à modérer</span>
        </div>
        <p class="text-[10px] text-[var(--color-primary)] mt-1 transition flex items-center space-x-1">
          <span>Appliquer les règles du catalogue</span>
          <span>&rarr;</span>
        </p>
      </router-link>

      <!-- Litiges actifs -->
      <router-link to="/admin/disputes" class="p-4 bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-2xl transition group flex flex-col justify-between shadow-sm">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Litiges Actifs</span>
          <span class="h-[24px] w-[24px] rounded-full bg-red-500 animate-pulse flex items-center justify-center text-white text-xs font-bold">!</span>
        </div>
        <div class="text-[28px] font-bold font-mono text-[var(--color-text-primary)] mt-2">
          {{ openDisputesCount }} <span class="text-xs text-red-500 font-normal font-mono">actifs</span>
        </div>
        <p class="text-[10px] text-red-500 mt-1 transition flex items-center space-x-1">
          <span>Résolution & arbitrages séquestres</span>
          <span>&rarr;</span>
        </p>
      </router-link>

    </div>

    <!-- GRILLE PRINCIPALE DEUX COLONNES -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- COLONNE DE GAUCHE : WORKSPACE ACTIONS -->
      <div class="lg:col-span-8 space-y-6">
        
        <!-- PROVISIONNEMENT DES UTILISATEURS INTERNES -->
        <div 
          v-if="hasAccess('user_creation')"
          class="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl space-y-4 shadow-sm"
        >
          <div class="flex items-center justify-between border-b border-[var(--color-border)] pb-3 shrink-0">
            <div>
              <h2 class="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)] font-sans flex items-center space-x-2">
                <UserGroupIcon class="w-4 h-4 text-[var(--color-primary)]" />
                <span>Création de Comptes Administrateurs / Agents</span>
              </h2>
              <p class="text-xs text-[var(--color-text-secondary)]">Ajoutez des collaborateurs avec des habilitations d'accès spécifiques.</p>
            </div>
            <span class="px-2 py-0.5 bg-[var(--color-primary-muted)] text-[var(--color-primary)] rounded text-[9px] font-mono font-bold uppercase">
              Droits de Gestion Uniquement
            </span>
          </div>

          <!-- FORMULAIRE COMPTE COLLABORATEUR -->
          <form @submit.prevent="createInternalColleague" class="space-y-4 pt-1">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="block text-[10px] font-mono uppercase text-[var(--color-text-secondary)] font-bold mb-1">Nom Complet Légal</label>
                <input 
                  type="text" 
                  v-model="newColleague.name" 
                  required
                  placeholder="Ex : Marie-Thérèse Kamga"
                  class="w-full bg-[var(--color-background)] border border-[var(--color-border)] focus:border-[var(--color-primary)] rounded-lg p-2.5 text-xs text-[var(--color-text-primary)] focus:outline-none transition"
                />
              </div>
              <div class="space-y-1">
                <label class="block text-[10px] font-mono uppercase text-[var(--color-text-secondary)] font-bold mb-1">Adresse E-mail Institutionnelle</label>
                <input 
                  type="email" 
                  v-model="newColleague.email" 
                  required
                  placeholder="Ex : kamga@plateforme.local"
                  class="w-full bg-[var(--color-background)] border border-[var(--color-border)] focus:border-[var(--color-primary)] rounded-lg p-2.5 text-xs text-[var(--color-text-primary)] focus:outline-none transition"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="space-y-1">
                <label class="block text-[10px] font-mono uppercase text-[var(--color-text-secondary)] font-bold mb-1">Code Temporaire de Connexion</label>
                <input 
                  type="password" 
                  v-model="newColleague.password" 
                  required
                  placeholder="Mot de passe temporaire"
                  class="w-full bg-[var(--color-background)] border border-[var(--color-border)] focus:border-[var(--color-primary)] rounded-lg p-2.5 text-xs text-[var(--color-text-primary)] focus:outline-none transition"
                />
              </div>
              <div class="space-y-1">
                <label class="block text-[10px] font-mono uppercase text-[var(--color-text-secondary)] font-bold mb-1">Habilitation de Sécurité</label>
                <select 
                  v-model="newColleague.subRole"
                  class="w-full bg-[var(--color-background)] border border-[var(--color-border)] focus:border-[var(--color-primary)] text-xs text-[var(--color-text-primary)] rounded-lg p-2.5 focus:outline-none transition"
                >
                  <option value="supervisor">Superviseur (Contrôle total)</option>
                  <option value="finance_officer">Financier (Grand Livre & Séquestres)</option>
                  <option value="moderator">Modérateur (Validation catalogue)</option>
                  <option value="support_rep">Agent Support (Traitement litiges)</option>
                </select>
              </div>
              <div class="space-y-1">
                <label class="block text-[10px] font-mono uppercase text-[var(--color-text-secondary)] font-bold mb-1">Département Assigné</label>
                <input 
                  type="text" 
                  v-model="newColleague.department" 
                  placeholder="Ex : Département Conformité"
                  class="w-full bg-[var(--color-background)] border border-[var(--color-border)] focus:border-[var(--color-primary)] rounded-lg p-2.5 text-xs text-[var(--color-text-primary)] focus:outline-none transition"
                />
              </div>
            </div>

            <div class="flex justify-end pt-2">
              <button 
                type="submit"
                class="px-4 py-2.5 bg-[var(--color-primary)] hover:opacity-90 text-xs font-mono font-bold uppercase rounded-lg text-white transition flex items-center space-x-1.5"
              >
                <PlusIcon class="w-4 h-4" />
                <span>Créer le Compte</span>
              </button>
            </div>
          </form>

          <!-- LISTE DES COLLABORATEURS INTERNES DE LA PLATEFORME -->
          <div class="mt-4 pt-3 border-t border-[var(--color-border)]">
            <h3 class="text-[10px] font-mono uppercase text-[var(--color-text-secondary)] font-bold mb-2">Membres de l'Équipe Système Active</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-xs">
                <thead>
                  <tr class="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)]">
                    <th class="pb-2">Collaborateur</th>
                    <th class="pb-2">Identifiant / E-mail</th>
                    <th class="pb-2">Habilitation</th>
                    <th class="pb-2">Statut</th>
                    <th class="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[var(--color-border)]">
                  <tr v-for="cl in platformInternalCadre" :key="cl.id" class="text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]">
                    <td class="py-2.5 font-semibold text-[var(--color-text-primary)]">{{ cl.name }}</td>
                    <td class="py-2.5 font-mono text-[var(--color-text-secondary)]">{{ cl.email }}</td>
                    <td class="py-2.5">
                      <span class="px-2 py-0.5 rounded text-[10px] bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] font-semibold">
                        {{ (cl.subRole || 'supervisor').toUpperCase().replace('_', ' ') }}
                      </span>
                    </td>
                    <td class="py-2.5 font-mono">
                      <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block mr-1"></span> Actif
                    </td>
                    <td class="py-2.5 text-right font-mono">
                      <button 
                        @click="triggerRevokeColleague(cl)"
                        class="text-[10px] text-red-500 hover:underline"
                        :disabled="cl.id === 'usr_admin'"
                      >
                        {{ cl.id === 'usr_admin' ? '[ Verrouillé ]' : '[ Révoquer Access ]' }}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <!-- DICTIONNAIRE DE LA MATRICE DES HABILITATIONS -->
        <div class="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl space-y-4 shadow-sm">
          <div class="border-b border-[var(--color-border)] pb-3 shrink-0">
            <h2 class="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)] font-sans">Matrice des Niveaux d'Habilitation B2B</h2>
            <p class="text-xs text-[var(--color-text-secondary)]">Explication des droits et limitations d'accès par rôle.</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-3 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl space-y-2">
              <span class="px-2 py-0.5 bg-red-500/10 text-red-500 rounded text-[9px] font-mono font-bold uppercase border border-red-500/20">Superviseur</span>
              <p class="text-xs text-[var(--color-text-primary)] leading-normal">
                Contrôle total sur la plateforme. Peut gérer l'équipe, éditer les taux de commission, suspendre/débloquer des comptes et restaurer les sauvegardes.
              </p>
            </div>
            <div class="p-3 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl space-y-2">
              <span class="px-2 py-0.5 bg-indigo-500/10 text-indigo-500 rounded text-[9px] font-mono font-bold uppercase border border-indigo-500/20">Responsable Financier</span>
              <p class="text-xs text-[var(--color-text-primary)] leading-normal">
                Spécialiste de la comptabilité. Peut auditer les séquestres et approuver les demandes de retrait de fonds.
              </p>
            </div>
            <div class="p-3 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl space-y-2">
              <span class="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[9px] font-mono font-bold uppercase border border-emerald-500/20">Modérateur Catalogue</span>
              <p class="text-xs text-[var(--color-text-primary)] leading-normal">
                Responsable de l'approbation des boutiques et de la modération des fiches produits soumises par les vendeurs.
              </p>
            </div>
            <div class="p-3 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl space-y-2">
              <span class="px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded text-[9px] font-mono font-bold uppercase border border-amber-500/20">Support Client</span>
              <p class="text-xs text-[var(--color-text-primary)] leading-normal">
                Résolution des réclamations, suivi des litiges entre acheteurs et vendeurs et clôture des tickets de support.
              </p>
            </div>
          </div>
        </div>

      </div>

      <!-- COLONNE DE DROITE : TÉLÉMÉTRIE & AUDITS -->
      <div class="lg:col-span-4 space-y-6">
        
        <!-- TÉLÉMÉTRIE SYSTÈME EN DIRECT -->
        <div class="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl space-y-3 shadow-sm">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-bold uppercase font-mono tracking-wider text-[var(--color-text-primary)]">Télémétrie Système</h3>
            <span class="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          
          <div class="space-y-2.5 pt-1 text-xs">
            <div class="flex items-center justify-between font-mono">
              <span class="text-[var(--color-text-secondary)] uppercase text-[10px]">Charge CPU :</span>
              <span class="text-[var(--color-text-primary)] font-bold">4.12%</span>
            </div>
            <div class="w-full bg-[var(--color-background)] h-1.5 rounded-full overflow-hidden border border-[var(--color-border)]">
              <div class="bg-[var(--color-primary)] h-full rounded-full" style="width: 4%"></div>
            </div>

            <div class="flex items-center justify-between font-mono">
              <span class="text-[var(--color-text-secondary)] uppercase text-[10px]">RAM Allouée :</span>
              <span class="text-[var(--color-text-primary)] font-bold">2.14 / 8 Go</span>
            </div>
            <div class="w-full bg-[var(--color-background)] h-1.5 rounded-full overflow-hidden border border-[var(--color-border)]">
              <div class="bg-emerald-500 h-full rounded-full" style="width: 26%"></div>
            </div>

            <div class="flex items-center justify-between font-mono">
              <span class="text-[var(--color-text-secondary)] uppercase text-[10px]">Latence API (Douala) :</span>
              <span class="text-[var(--color-text-primary)] font-bold">14 ms</span>
            </div>
            <div class="flex items-center justify-between font-mono">
              <span class="text-[var(--color-text-secondary)] uppercase text-[10px]">Sockets Actifs :</span>
              <span class="text-emerald-500 font-bold">402 nœuds actifs</span>
            </div>
          </div>
        </div>

        <!-- DERNIERS RAPPORTS D'AUDIT SÉCURITÉ -->
        <div class="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl space-y-4 shadow-sm">
          <div class="flex items-center justify-between border-b border-[var(--color-border)] pb-2 shrink-0">
            <h3 class="text-xs font-bold uppercase font-mono tracking-wider text-[var(--color-text-primary)]">Derniers Journaux d'Audit</h3>
            <router-link to="/admin/system/logs" class="text-[10px] font-mono text-[var(--color-primary)] hover:underline">Voir Tout &rarr;</router-link>
          </div>

          <div class="space-y-3">
            <div 
              v-for="lg in systemLogs.slice(0, 5)" 
              :key="lg.id" 
              class="p-2.5 bg-[var(--color-surface-elevated)] rounded-lg space-y-1 border border-transparent hover:border-[var(--color-border)] transition"
            >
              <div class="flex items-center justify-between">
                <span class="px-1.5 py-0.5 bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] font-mono text-[8px] uppercase tracking-wider font-bold">
                  {{ lg.action }}
                </span>
                <span class="text-[8px] font-mono text-[var(--color-text-tertiary)]">
                  {{ formatTime(lg.date) }}
                </span>
              </div>
              <p class="text-[11px] text-[var(--color-text-primary)] leading-relaxed">
                {{ lg.details }}
              </p>
              <div class="text-[9px] font-mono text-[var(--color-text-tertiary)] flex items-center justify-between pt-0.5">
                <span>Par : {{ lg.author }}</span>
                <span :class="getLevelColor(lg.level || 'info')" class="text-[8px] font-bold uppercase">
                  {{ lg.level || 'info' }}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- MODAL DE SÉCURITÉ DE CONFIRMATION -->
    <ConfirmationModal 
      :show="showSafetyModal"
      :title="safetyTitle"
      :message="safetyMessage"
      :action-label="safetyActionLabel"
      @close="closeSafetyModal"
      @confirm="executeSafetyAction"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/store/modules/auth.js';
import { useToast } from 'vue-toastification';
import { systemLogs, writeAuditLog } from '@/utils/admin_db.js';
import { products, stores } from '@/utils/supplier_db.js';
import ConfirmationModal from '@/components/ConfirmationModal.vue';
import { 
  CpuChipIcon, 
  ShieldCheckIcon, 
  InformationCircleIcon, 
  UserGroupIcon, 
  PlusIcon 
} from '@heroicons/vue/24/outline';

const authStore = ref(useAuthStore());
const toast = useToast();

const activeAdminSubRole = ref('supervisor');

// Loaded inputs
const newColleague = ref({
  name: '',
  email: '',
  password: '',
  subRole: 'support_rep',
  department: 'Département Support'
});

// Calculate statistics dynamically
const pendingKYCCount = computed(() => {
  return authStore.value.users.filter(u => u.roles.includes('supplier') && u.status === 'pending').length;
});

const pendingStoresCount = computed(() => {
  return stores.value.filter(s => s.status !== 'online').length;
});

const pendingProductsCount = computed(() => {
  return products.value.filter(p => !p.moderationStatus || p.moderationStatus === 'Pending').length;
});

// Import disputes or counts dynamically
import { disputes } from '@/utils/admin_db.js';
const openDisputesCount = computed(() => {
  return disputes.value.filter(d => d.status === 'open' || d.status === 'under_review').length;
});

const platformInternalCadre = computed(() => {
  return authStore.value.users.filter(u => u.roles.includes('admin') || u.subRole);
});

// On loaded, pick active subRole from session
onMounted(() => {
  const currentSessionUser = authStore.value.user;
  if (currentSessionUser) {
    if (!currentSessionUser.subRole) {
      currentSessionUser.subRole = 'supervisor'; // supervisor gets everything
      authStore.value.saveState();
    }
    activeAdminSubRole.value = currentSessionUser.subRole;
  }
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

function updateActivePersona() {
  const currentSessionUser = authStore.value.user;
  if (currentSessionUser) {
    currentSessionUser.subRole = activeAdminSubRole.value;
    authStore.value.saveState();
    writeAuditLog(
      'ROLE_SWITCH',
      `Administrator simulated security session swapped to ${(activeAdminSubRole.value || '').toUpperCase()}`,
      currentSessionUser.name,
      'security'
    );
    toast.info(`Habilitation modifiée pour : ${(activeAdminSubRole.value || '').toUpperCase().replace('_', ' ')}.`);
  }
}

// Access Control Matrix checks
function hasAccess(capability) {
  if (activeAdminSubRole.value === 'supervisor') return true;
  
  if (capability === 'user_creation') {
    return false; // Supervisor exclusive
  }
  return true;
}

// Formatting helpers
function formatTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toISOString().replace('T', ' ').slice(11, 19);
}

function getLevelColor(lvl) {
  const map = {
    info: 'text-indigo-400',
    debug: 'text-slate-500',
    security: 'text-red-400',
    warning: 'text-orange-400',
    danger: 'text-red-500'
  };
  return map[lvl] || 'text-slate-400';
}

// CREATING INTERNAL COLLEAGUE (INTERNAL USERS WITH SELECTED PERMISSIONS/ROLES)
function createInternalColleague() {
  const exists = authStore.value.users.find(u => u.email.toLowerCase() === newColleague.value.email.toLowerCase());
  if (exists) {
    toast.error('Un utilisateur avec cette adresse email existe déjà.');
    return;
  }

  // Create internal administrator with subRole
  const structuredAdminUser = {
    id: `usr_colleague_${Date.now()}`,
    email: newColleague.value.email,
    password: newColleague.value.password,
    name: newColleague.value.name,
    company: 'Enterprise Admin Corp',
    phone: '+237 000 000 000',
    roles: ['admin'],
    subRole: newColleague.value.subRole,
    department: newColleague.value.department,
    status: 'approved',
    twoFactorEnabled: false,
    created_at: new Date().toISOString()
  };

  authStore.value.users.push(structuredAdminUser);
  authStore.value.saveState();

  writeAuditLog(
    'colleague_created',
    `New internal profile created for ${newColleague.value.name} with administrative duty ${(newColleague.value.subRole || '').toUpperCase()}`,
    authStore.value.user?.name || 'Supervisor',
    'security'
  );

  toast.success(`Compte créé pour ${newColleague.value.name} ! Rôle : ${(newColleague.value.subRole || '').toUpperCase().replace('_', ' ')}`);
  
  // Clear layout inputs
  newColleague.value.name = '';
  newColleague.value.email = '';
  newColleague.value.password = '';
  newColleague.value.department = 'Département Support';
}

// MANDATORY SAFETY MODAL HOOK OVERRIDES FOR REJECTIONS/GELS
const showSafetyModal = ref(false);
const safetyTitle = ref('');
const safetyMessage = ref('');
const safetyActionLabel = ref('');
const pendingTargetItem = ref(null);

function triggerRevokeColleague(cl) {
  pendingTargetItem.value = cl;
  safetyTitle.value = 'REVOKE SYSTEM Clearances';
  safetyMessage.value = `You are about to freeze and revoke administrative directory access for colleague ${cl.name}. This is an immediate and absolute block.`;
  safetyActionLabel.value = 'CONFIRM IMMEDIATE REVOC';
  showSafetyModal.value = true;
}

function closeSafetyModal() {
  showSafetyModal.value = false;
  pendingTargetItem.value = null;
}

function executeSafetyAction(justificationStr) {
  if (pendingTargetItem.value) {
    const cl = pendingTargetItem.value;
    const idx = authStore.value.users.findIndex(u => u.id === cl.id);
    if (idx !== -1) {
      authStore.value.users.splice(idx, 1);
      authStore.value.saveState();

      writeAuditLog(
        'colleague_revoked',
        `Administrative access revoked for ${cl.name}. Reason: ${justificationStr}`,
        authStore.value.user?.name || 'Supervisor',
        'security'
      );

      toast.warning(`Accès révoqué avec succès. Événement journalisé.`);
    }
  }
  showSafetyModal.value = false;
  pendingTargetItem.value = null;
}

// Escape key support
function handleKeyDown(e) {
  if (e.key === 'Escape') {
    closeSafetyModal();
  }
}
</script>
