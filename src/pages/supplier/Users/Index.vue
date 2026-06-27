<template>
  <div class="space-y-6">
    
    <!-- Top HUD -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Équipe et Utilisateurs</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Gérez vos collaborateurs, caissiers et contrôlez les accès aux entrepôts.</p>
      </div>

      <button 
        @click="openCreateUserPopup"
        class="px-5 py-2.5 bg-[var(--color-primary)] hover:opacity-90 text-white font-bold rounded-xl shadow-sm transition flex items-center space-x-2 shrink-0"
      >
        <span class="text-lg leading-none">+</span>
        <span>Ajouter un collaborateur</span>
      </button>
    </div>

    <!-- USERS DIRECTORY GRID -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm border-collapse select-none">
          <thead>
            <tr class="bg-[var(--color-surface-hover)] border-b border-[var(--color-border)] text-[var(--color-text-secondary)] font-semibold uppercase tracking-wider text-xs">
              <th class="p-4">ID</th>
              <th class="p-4">Nom et Email</th>
              <th class="p-4">Rôle assigné</th>
              <th class="p-4">Permissions</th>
              <th class="p-4 text-center">Statut</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr 
              v-for="u in team" 
              :key="u.id"
              class="hover:bg-[var(--color-surface-hover)] transition text-[var(--color-text-primary)]"
            >
              <td class="p-4 font-bold text-[var(--color-primary)]">{{ u.id }}</td>
              
              <td class="p-4">
                <div class="font-bold text-[var(--color-text-primary)]">{{ u.name }}</div>
                <div class="text-xs text-[var(--color-text-secondary)] mt-0.5">{{ u.email }}</div>
              </td>
              
              <td class="p-4">
                <span class="px-3 py-1 bg-[var(--color-primary-muted)] text-[var(--color-primary)] rounded-lg border border-[var(--color-primary-border)] font-semibold text-xs">
                  {{ translateRole(u.role) }}
                </span>
              </td>

              <!-- Permissions tags -->
              <td class="p-4">
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="p in u.permissions || []" 
                    :key="p"
                    class="bg-[var(--color-background)] text-[var(--color-text-secondary)] font-semibold text-[10px] px-2 py-1 rounded-md border border-[var(--color-border)]"
                  >
                    {{ p }}
                  </span>
                </div>
              </td>

              <td class="p-4 text-center">
                <span class="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  Actif
                </span>
              </td>

              <td class="p-4 text-right">
                <div class="inline-flex items-center gap-2">
                  <button 
                    @click="openEditUserPopup(u)"
                    class="px-3 py-1.5 bg-[var(--color-background)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] rounded-lg text-xs font-bold border border-[var(--color-border)] transition"
                  >
                    ✏️ Éditer
                  </button>
                  <button 
                    @click="triggerDeleteUserConfirmation(u)"
                    class="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-xs border border-red-500/20 font-bold transition flex items-center"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- POPUPS -->
    <!-- 1. CREATE / EDIT USER FORM -->
    <Transition name="modal-fade">
      <div v-if="showUserPopup" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden modal-content flex flex-col max-h-[90vh]">
          <div class="p-6 border-b border-[var(--color-border)] flex items-center justify-between shrink-0">
            <div>
              <span class="text-[10px] text-[var(--color-primary)] px-2 py-0.5 rounded bg-[var(--color-primary-muted)] font-bold tracking-wider uppercase">CLÉ DE SÉCURITÉ</span>
              <h3 class="text-xl font-bold mt-2 text-[var(--color-text-primary)]">
                {{ isEditing ? 'Modifier les accès' : 'Ajouter un collaborateur' }}
              </h3>
            </div>
            <button @click="showUserPopup = false" class="p-1.5 bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-md transition font-bold text-lg leading-none border border-[var(--color-border)]">&times;</button>
          </div>

          <div class="flex-1 overflow-y-auto p-6">
            <form @submit.prevent="saveUser" class="space-y-5 text-sm" id="user-form">
              <div>
                <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Nom complet <span class="text-red-500">*</span></label>
                <input 
                  type="text" 
                  v-model="userForm.name"
                  required
                  class="w-full bg-[var(--color-background)] border border-[var(--color-border)] px-4 py-2.5 rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                  placeholder="Ex: Olivier Ndongo"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Adresse email professionnelle <span class="text-red-500">*</span></label>
                <input 
                  type="email" 
                  v-model="userForm.email"
                  required
                  class="w-full bg-[var(--color-background)] border border-[var(--color-border)] px-4 py-2.5 rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                  placeholder="Ex: olivier@sahel-firm.com"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Rôle assigné <span class="text-red-500">*</span></label>
                <select 
                  v-model="userForm.role"
                  required
                  class="w-full bg-[var(--color-background)] border border-[var(--color-border)] px-4 py-2.5 rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                >
                  <option value="Manager">Manager (Superviseur Régional)</option>
                  <option value="Cashier">Caissier (Agent POS)</option>
                  <option value="Clerk">Magasinier (Gestion des stocks FIFO)</option>
                </select>
              </div>

              <!-- Permissions checklists -->
              <div class="space-y-2">
                <span class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Permissions accordées</span>
                <div class="grid grid-cols-2 gap-3 p-4 bg-[var(--color-background)] rounded-xl border border-[var(--color-border)]">
                  <label 
                    v-for="node in availablePermissions" 
                    :key="node"
                    class="flex items-center space-x-2.5 text-sm text-[var(--color-text-primary)] cursor-pointer select-none"
                  >
                    <input 
                      type="checkbox" 
                      :value="node"
                      v-model="userForm.permissions"
                      class="rounded bg-[var(--color-surface-hover)] border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-offset-0 h-4 w-4"
                    />
                    <span>{{ translatePermission(node) }}</span>
                  </label>
                </div>
              </div>
            </form>
          </div>

          <!-- Actions -->
          <div class="p-6 border-t border-[var(--color-border)] bg-[var(--color-surface-hover)] shrink-0 flex justify-end space-x-3">
            <button 
              type="button" 
              @click="showUserPopup = false"
              class="px-5 py-2.5 bg-[var(--color-surface-elevated)] hover:bg-[var(--color-background)] rounded-xl text-sm font-semibold text-[var(--color-text-primary)] border border-[var(--color-border)] transition"
            >
              Annuler
            </button>
            <button 
              type="submit"
              form="user-form"
              class="px-5 py-2.5 bg-[var(--color-primary)] hover:opacity-90 text-white rounded-xl text-sm font-bold transition shadow-sm"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 2. USER DELETE CONFIRMATION -->
    <Transition name="modal-fade">
      <div v-if="userToDelete" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-[var(--color-surface-elevated)] border border-red-500/30 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden modal-content">
          <div class="text-center space-y-4">
            <div class="h-16 w-16 bg-red-500/10 text-red-500 rounded-full border border-red-500/20 flex items-center justify-center font-bold text-3xl mx-auto select-none">
              🚷
            </div>
            <h3 class="text-lg font-bold text-[var(--color-text-primary)]">Révoquer l'accès ?</h3>
            <p class="text-sm text-[var(--color-text-secondary)]">
              Êtes-vous sûr de vouloir désactiver et révoquer toutes les permissions pour <strong class="text-[var(--color-text-primary)]">{{ userToDelete.name }}</strong> ? Cela invalidera immédiatement son accès.
            </p>
          </div>

          <div class="mt-8 flex space-x-3">
            <button 
              @click="userToDelete = null"
              class="flex-1 py-2.5 bg-[var(--color-surface-hover)] hover:bg-[var(--color-background)] rounded-xl text-sm font-semibold text-[var(--color-text-primary)] border border-[var(--color-border)] transition"
            >
              Annuler
            </button>
            <button 
              @click="confirmDeleteUser"
              class="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition shadow-sm"
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { team } from '@/utils/supplier_db';
import { useToast } from 'vue-toastification';

const toast = useToast();

const showUserPopup = ref(false);
const isEditing = ref(false);
const targetUserId = ref(null);
const userToDelete = ref(null);

const userForm = ref({
  name: '',
  email: '',
  role: 'Clerk',
  permissions: []
});

const availablePermissions = [
  'view_orders',
  'dispatch_cargo',
  'add_batches',
  'request_retrait',
  'pos_checkout',
  'edit_boutique'
];

function translateRole(r) {
  if (r === 'Clerk') return 'Magasinier';
  if (r === 'Cashier') return 'Caissier';
  if (r === 'Manager') return 'Manager';
  return r;
}

function translatePermission(p) {
  const m = {
    'view_orders': 'Voir Commandes',
    'dispatch_cargo': 'Expédier',
    'add_batches': 'Ajouter Lots',
    'request_retrait': 'Retraits',
    'pos_checkout': 'POS Caisse',
    'edit_boutique': 'Boutiques'
  };
  return m[p] || p;
}

function openCreateUserPopup() {
  isEditing.value = false;
  userForm.value = {
    name: '',
    email: '',
    role: 'Clerk',
    permissions: ['view_orders', 'add_batches']
  };
  showUserPopup.value = true;
}

function openEditUserPopup(u) {
  isEditing.value = true;
  targetUserId.value = u.id;
  userForm.value = {
    name: u.name,
    email: u.email,
    role: u.role || 'Clerk',
    permissions: u.permissions || []
  };
  showUserPopup.value = true;
}

function saveUser() {
  if (isEditing.value) {
    const existing = team.value.find(u => u.id === targetUserId.value);
    if (existing) {
      existing.name = userForm.value.name;
      existing.email = userForm.value.email;
      existing.role = userForm.value.role;
      existing.permissions = [...userForm.value.permissions];
      toast.success('Permissions mises à jour avec succès.');
    }
  } else {
    const newId = 'team_' + (team.value.length + 101);
    team.value.push({
      id: newId,
      name: userForm.value.name,
      email: userForm.value.email,
      role: userForm.value.role,
      permissions: [...userForm.value.permissions]
    });
    toast.success('Nouveau collaborateur ajouté !');
  }
  showUserPopup.value = false;
}

function triggerDeleteUserConfirmation(u) {
  userToDelete.value = u;
}

function confirmDeleteUser() {
  if (userToDelete.value) {
    team.value = team.value.filter(s => s.id !== userToDelete.value.id);
    toast.info(`L'accès pour ${userToDelete.value.name} a été révoqué.`);
    userToDelete.value = null;
  }
}
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .modal-content, .modal-fade-leave-to .modal-content {
  transform: translateY(20px) scale(0.95);
}
.modal-content {
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
</style>
