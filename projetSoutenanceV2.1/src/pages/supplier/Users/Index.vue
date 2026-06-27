<template>
  <div class="space-y-6">
    
    <!-- Top HUD -->
    <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div>
        <h1 class="text-xl font-bold text-slate-100">Team Users &amp; Permissions (Utilisateurs)</h1>
        <p class="text-xs text-slate-400 mt-1">Manage physical workers, register cashiers, and restrict warehouse access keys.</p>
      </div>

      <button 
        @click="openCreateUserPopup"
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold rounded-xl shadow-lg transition uppercase shrink-0"
      >
        + Register New User (Popup)
      </button>
    </div>

    <!-- USERS DIRECTORY GRID -->
    <div class="bg-[#080d22] border border-slate-900 rounded-xl overflow-hidden shadow-xl">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse select-none">
          <thead>
            <tr class="bg-indigo-950/20 border-b border-indigo-950 text-[#5d6a94] font-mono uppercase tracking-wider text-[10px]">
              <th class="p-4">Worker ID</th>
              <th class="p-4">Full name &amp; Email</th>
              <th class="p-4">Assigned Role</th>
              <th class="p-4">Granular Permissions</th>
              <th class="p-4 text-center">Status</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-900">
            <tr 
              v-for="u in team" 
              :key="u.id"
              class="hover:bg-slate-900/40 transition text-slate-300"
            >
              <td class="p-4 font-mono text-indigo-400 font-bold">{{ u.id }}</td>
              
              <td class="p-4">
                <div class="font-bold text-slate-200">{{ u.name }}</div>
                <div class="text-[10px] text-slate-500 font-mono">{{ u.email }}</div>
              </td>
              
              <td class="p-4">
                <span class="px-2 py-0.5 bg-slate-950 text-indigo-300 rounded border border-indigo-950/40 font-mono font-bold text-[9px] uppercase">
                  {{ u.role }}
                </span>
              </td>

              <!-- Permissions tags -->
              <td class="p-4">
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="p in u.permissions || []" 
                    :key="p"
                    class="bg-slate-950 text-slate-400 font-mono text-[8.5px] px-1.5 py-0.5 rounded border border-slate-900"
                  >
                    {{ p }}
                  </span>
                </div>
              </td>

              <td class="p-4 text-center">
                <span class="text-[10px] font-bold text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-900/30">
                  ● ACTIVE
                </span>
              </td>

              <td class="p-4 text-right">
                <div class="inline-flex items-center gap-2">
                  <button 
                    @click="openEditUserPopup(u)"
                    class="p-1 px-2.5 bg-slate-900 text-slate-350 hover:bg-slate-850 rounded text-[10px] font-mono border border-slate-850 transition"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    @click="triggerDeleteUserConfirmation(u)"
                    class="p-1 px-2.5 bg-red-950/20 text-red-400 hover:bg-red-900 hover:text-slate-950 rounded text-[10px] font-mono border border-red-900/30 font-bold transition"
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
    <div v-if="showUserPopup" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-[#0b1029] border border-indigo-900/90 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden animate-fade-in text-slate-100">
        <div class="flex justify-between items-start border-b border-indigo-950 pb-3 mb-4">
          <div>
            <span class="text-[9px] font-mono text-indigo-400 px-1.5 py-0.5 rounded bg-indigo-950 font-bold uppercase">SECURITY ACCOUNT KEY</span>
            <h3 class="text-sm font-bold font-mono tracking-wide mt-1">
              {{ isEditing ? 'MODIFY ASSOCIATE PERMISSIONS' : 'REGISTER ENTERPRISE ASSOCIATE' }}
            </h3>
          </div>
          <button @click="showUserPopup = false" class="text-slate-400 hover:text-white font-bold font-mono">&times; CLOSE</button>
        </div>

        <form @submit.prevent="saveUser" class="space-y-4 text-xs font-mono">
          <div>
            <label class="block text-[9.5px] uppercase text-slate-400 mb-1 font-bold">Worker's Full Name *</label>
            <input 
              type="text" 
              v-model="userForm.name"
              required
              class="w-full bg-slate-950 border border-slate-900 px-2.5 py-1.5 rounded focus:outline-none"
              placeholder="Ex: Olivier Ndongo"
            />
          </div>

          <div>
            <label class="block text-[9.5px] uppercase text-slate-400 mb-1">Corporate Email Address *</label>
            <input 
              type="email" 
              v-model="userForm.email"
              required
              class="w-full bg-slate-950 border border-slate-900 px-2.5 py-1.5 rounded focus:outline-none"
              placeholder="Ex: olivier@sahel-firm.com"
            />
          </div>

          <div>
            <label class="block text-[9.5px] uppercase text-slate-400 mb-1">Assigned Role Designation *</label>
            <select 
              v-model="userForm.role"
              required
              class="w-full bg-slate-950 border border-slate-900 px-2.5 py-1.5 rounded focus:outline-none"
            >
              <option value="Manager">Manager (Regional Supervisor)</option>
              <option value="Cashier">Cashier (BO POS terminal agent)</option>
              <option value="Clerk">Clerk (FIFO Warehouse keeper)</option>
            </select>
          </div>

          <!-- Permissions checklists -->
          <div class="space-y-2">
            <span class="block text-[9.5px] uppercase text-slate-400 font-bold">Granted Permission Nodes</span>
            <div class="grid grid-cols-2 gap-2 p-2.5 bg-slate-950/60 rounded border border-slate-900">
              <label 
                v-for="node in availablePermissions" 
                :key="node"
                class="flex items-center space-x-2 text-[10px] text-slate-350 cursor-pointer select-none"
              >
                <input 
                  type="checkbox" 
                  :value="node"
                  v-model="userForm.permissions"
                  class="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0 focus:ring-offset-0"
                />
                <span>{{ node }}</span>
              </label>
            </div>
          </div>

          <!-- Actions -->
          <div class="pt-4 border-t border-indigo-950 flex justify-end space-x-2">
            <button 
              type="button" 
              @click="showUserPopup = false"
              class="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-850 rounded font-bold text-slate-400"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-4 py-1.5 bg-indigo-650 hover:bg-indigo-550 text-white font-bold rounded uppercase"
            >
              Deploy worker controls
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 2. USER DELETE CONFIRMATION -->
    <div v-if="userToDelete" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-red-950/80 border-2 border-red-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden animate-fade-in text-slate-100 backdrop-blur">
        <div class="text-center space-y-3">
          <div class="h-12 w-12 bg-red-500/10 text-red-500 rounded-full border border-red-500/30 flex items-center justify-center font-bold text-2xl mx-auto select-none">
            🚷
          </div>
          <h3 class="text-base font-mono font-bold uppercase tracking-wider text-red-450">DEPRIVE WORKER CREDENTIALS?</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">
            Are you sure you want to deactivate and wipe all platform permissions for <strong class="text-slate-200 font-semibold">{{ userToDelete.name }}</strong>? This will render their access badge immediate invalid.
          </p>
        </div>

        <div class="mt-6 flex space-x-3">
          <button 
            @click="userToDelete = null"
            class="flex-1 py-1.5 bg-slate-900 hover:bg-slate-850 rounded text-xs font-mono font-bold text-slate-400 text-center transition"
          >
            Cancel
          </button>
          <button 
            @click="confirmDeleteUser"
            class="flex-1 py-1.5 bg-red-800 hover:bg-red-750 text-white rounded text-xs font-mono font-bold text-center transition uppercase"
          >
            CONFIRM EVOCATION
          </button>
        </div>
      </div>
    </div>

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
      toast.success('Worker account permissions altered successfully.');
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
    toast.success('Associate worker credentials deployed!');
  }
  showUserPopup.value = false;
}

function triggerDeleteUserConfirmation(u) {
  userToDelete.value = u;
}

function confirmDeleteUser() {
  if (userToDelete.value) {
    team.value = team.value.filter(s => s.id !== userToDelete.value.id);
    toast.info(`Account key for ${userToDelete.value.name} is permanently revoked.`);
    userToDelete.value = null;
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.18s ease-out forwards;
}
</style>
