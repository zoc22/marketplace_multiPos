<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500/30 selection:text-indigo-200 flex flex-col justify-between">
    
    <!-- Floating Quick Theme & Help trigger widget to maximize accessibility and discoverability -->
    <div class="fixed top-20 right-4 z-40 flex flex-col space-y-2 select-none">
      <button 
        @click="toggleTheme" 
        class="p-2.5 bg-slate-900/90 border border-slate-800 text-xs font-mono font-bold hover:text-indigo-400 hover:bg-slate-800 transition shadow-lg flex items-center justify-center"
        title="Toggle Theme Mode (Hotkey: T)"
        id="theme-quick-button"
      >
        <span class="mr-1.5">{{ isLightTheme ? '☀️ LIGHT' : '🌙 DARK' }}</span>
        <kbd class="text-[9px] bg-slate-950 px-1 py-0.5 border border-slate-850">T</kbd>
      </button>

      <button 
        @click="isHelpDrawerOpen = !isHelpDrawerOpen"
        class="p-2.5 bg-indigo-950/90 border border-indigo-900 text-xs font-mono font-bold text-indigo-400 hover:text-white hover:bg-indigo-900 transition shadow-lg flex items-center justify-center animate-pulse"
        title="Keyboard Shortcuts & Diagnostics (Hotkey: H)"
        id="help-quick-button"
      >
        <span class="mr-1.5">💡 KEYBOARD HOTKEYS</span>
        <kbd class="text-[9px] bg-indigo-950 px-1 py-0.5 border border-indigo-800">H</kbd>
      </button>
    </div>

    <!-- Main router view with padding bottom to prevent overlapping with the docked HUD -->
    <div class="flex-1 pb-44 md:pb-36">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

    <!-- SLIDING ACCESSIBILITY & SHORTCUTS HELP DRAWER -->
    <div 
      v-show="isHelpDrawerOpen"
      @click="isHelpDrawerOpen = false"
      class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 transition-opacity"
      id="help-drawer-overlay"
    ></div>

    <div 
      class="fixed right-0 top-0 bottom-0 w-80 bg-[#070b19] border-l-2 border-indigo-900 text-slate-100 z-50 shadow-2xl p-6 flex flex-col justify-between transform transition-transform duration-300 select-none"
      :class="isHelpDrawerOpen ? 'translate-x-0' : 'translate-x-full'"
      v-show="isHelpDrawerOpen"
      id="help-drawer-container"
    >
      <div class="space-y-6">
        <div class="flex items-center justify-between border-b border-indigo-950 pb-3">
          <h3 class="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
            Keyboard Shortcuts & Helpers
          </h3>
          <button 
            @click="isHelpDrawerOpen = false"
            class="text-[10px] font-mono text-slate-450 hover:text-slate-200 border border-slate-850 px-1.5 py-0.5"
            id="close-help-btn"
          >
            [ESC] CLOSE
          </button>
        </div>

        <p class="text-xs text-slate-400 leading-relaxed font-sans">
          Navigate and customize the administrative B2B terminal dynamically using integrated premium web hotkeys.
        </p>

        <!-- Shorts Lists -->
        <div class="space-y-3 font-mono text-xs pt-2">
          <div class="p-3 bg-slate-950 border border-slate-900 flex justify-between items-center">
            <span class="text-slate-400 text-[10.5px]">Toggle theme style</span>
            <kbd class="px-2 py-0.5 bg-indigo-950 border border-indigo-900 text-indigo-400 font-bold">T</kbd>
          </div>
          <div class="p-3 bg-slate-950 border border-slate-900 flex justify-between items-center">
            <span class="text-slate-400 text-[10.5px]">Help Guide info drawer</span>
            <kbd class="px-2 py-0.5 bg-indigo-950 border border-indigo-900 text-indigo-400 font-bold">H</kbd>
          </div>
          <div class="p-3 bg-slate-950 border border-slate-900 flex justify-between items-center">
            <span class="text-slate-400 text-[10.5px]">Back to portal root</span>
            <kbd class="px-2 py-0.5 bg-indigo-950 border border-indigo-900 text-indigo-400 font-bold">D</kbd>
          </div>
          <div class="p-3 bg-slate-950 border border-slate-900 flex justify-between items-center">
            <span class="text-slate-400 text-[10.5px]">Close active modals</span>
            <kbd class="px-2 py-0.5 bg-indigo-950 border border-indigo-900 text-indigo-400 font-bold">ESC</kbd>
          </div>
        </div>

        <div class="p-3.5 bg-slate-950 border border-indigo-950/60 text-[10px] text-slate-400 font-sans leading-relaxed">
          <strong class="text-indigo-400">Accessibility compliant:</strong> Focus markers, zero border-radius blocks and high contrast profiles optimize visibility.
        </div>
      </div>

      <div class="border-t border-indigo-950 pt-3 text-[10px] text-slate-500 font-mono flex items-center justify-between">
        <span>Sovereign central platform</span>
        <span>v1.0.0</span>
      </div>
    </div>


    <!-- Collapsible Stancl Tenancy & Mail Sandbox HUD -->
    <div 
      class="fixed bottom-0 left-0 right-0 bg-[#070b19] border-t-2 border-indigo-900 shadow-2xl z-40 select-none transition-all duration-300 ease-in-out"
      :class="isExpanded ? 'h-96' : 'h-11'"
      id="sandbox-hud-dock"
    >
      <!-- Title Switcher Header -->
      <div 
        @click="isExpanded = !isExpanded" 
        class="bg-[#0b132b] h-11 px-6 flex items-center justify-between cursor-pointer border-b border-indigo-950 hover:bg-indigo-950/40 transition"
        id="sandbox-header-bar"
      >
        <div class="flex items-center space-x-3 text-xs uppercase font-mono font-bold tracking-wider">
          <span class="animate-pulse h-2 w-2 rounded-full bg-indigo-500"></span>
          <span class="text-indigo-400">Stancl Tenancy & E-Mail Sandbox Control HUD</span>
        </div>
        <div class="flex items-center space-x-4">
          <!-- Active Address Bar Mock -->
          <div class="hidden sm:flex items-center space-x-2 bg-slate-950/80 px-3 py-1 rounded text-[10px] font-mono text-slate-400 border border-slate-900">
            <span class="text-slate-600">URL Domain:</span>
            <span class="text-emerald-400 font-bold">
              https://{{ authStore.currentSubdomain ? `${authStore.currentSubdomain}.` : '' }}enterprise-platform.local
            </span>
          </div>

          <!-- Chevron -->
          <span class="text-xs text-indigo-400 font-bold">
            {{ isExpanded ? '[ COLLAPSE HUD - ]' : '[ INSPECT SANDBOX & COMPLIANCE + ]' }}
          </span>
        </div>
      </div>

      <!-- Content Area -->
      <div v-show="isExpanded" class="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100%-44px)] overflow-y-auto font-sans text-xs">
        
        <!-- Column 1: Multi-Tenant & Domain Simulator (Stancl Tenancy) -->
        <div class="bg-slate-950/50 p-4 rounded-xl border border-slate-900 flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-[11px] font-mono uppercase tracking-wider font-bold text-indigo-300">Stancl Tenancy Simulation</h3>
              <span class="text-[9px] bg-indigo-950/60 px-1.5 py-0.5 rounded text-indigo-400 font-mono">ISOLATED DB</span>
            </div>
            
            <p class="text-slate-400 text-[11px] mb-3 leading-relaxed">
              Under Stancl Tenancy, the global database partitions records per host subdomain. Database queries automatically isolate assets by active tenant context.
            </p>

            <div class="space-y-3">
              <div>
                <label class="block text-[9px] uppercase font-mono text-slate-500 mb-1">Active Isolated Domain Context</label>
                <div class="p-2 bg-slate-900 border border-slate-800 rounded font-mono text-[10px] text-slate-350 flex justify-between items-center">
                  <span>{{ authStore.currentSubdomain ? `${authStore.currentSubdomain}.enterprise.local` : 'Global Host Platform' }}</span>
                  <span class="text-[8px] bg-slate-800 px-1 py-0.5 text-slate-400 rounded">
                    {{ authStore.currentSubdomain ? 'Tenant-Scoped' : 'Unrestricted' }}
                  </span>
                </div>
              </div>

              <div>
                <label class="block text-[9px] uppercase font-mono text-slate-500 mb-1">Simulate Subdomain Switcher</label>
                <select 
                  :value="authStore.currentSubdomain"
                  @change="onTenantSelected"
                  class="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-indigo-500 font-mono text-[10px]"
                >
                  <option value="">(None - Global Main Platform)</option>
                  <option v-for="t in authStore.tenants" :key="t.id" :value="t.id">
                    {{ t.name }} [{{ t.id }}.enterprise.local] {{ t.active ? '(KYC Approved)' : '(Pending Verification)' }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-900/60 mt-4 flex items-center justify-between">
            <span class="text-[10px] text-slate-500">Reset whole state back to default:</span>
            <button 
              @click="authStore.hardReset"
              class="px-2.5 py-1 bg-red-950/40 text-red-400 hover:bg-red-900 hover:text-slate-950 rounded border border-red-900/30 text-[10px] font-mono font-bold transition duration-200"
            >
              ☢️ Purge State DB
            </button>
          </div>
        </div>

        <!-- Column 2: Virtual Sandbox Inbox (For verification and password links retrieval) -->
        <div class="bg-slate-950/50 p-4 rounded-xl border border-slate-900 flex flex-col h-full">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-[11px] font-mono uppercase tracking-wider font-bold text-indigo-300">Sandbox Mail Terminal</h3>
            <span class="text-[9px] text-emerald-400 bg-emerald-950/20 px-1.5 py-0.5 rounded font-mono">SMTP EMULATOR</span>
          </div>

          <p class="text-slate-500 text-[10px] mb-2 font-mono">
            Outbound SMTP dispatches are recorded here for fast authentication testing:
          </p>

          <!-- Emails lists -->
          <div class="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
            <div v-if="authStore.virtualEmails.length === 0" class="text-center py-6 text-slate-650 font-mono text-[10px]">
              (Sandbox empty - No outbound transmissions generated yet)
            </div>
            <div 
              v-for="mail in authStore.virtualEmails" 
              :key="mail.id"
              class="bg-slate-900/40 border border-slate-900 p-2.5 rounded-lg space-y-1 hover:bg-slate-900 transition"
            >
              <div class="flex justify-between text-[8px] font-mono text-indigo-400">
                <span class="text-[9px] truncate max-w-[150px] font-bold">To: {{ mail.to }}</span>
                <span>{{ mail.time }}</span>
              </div>
              <div class="font-bold text-[10px] text-slate-200 leading-tight">
                {{ mail.subject }}
              </div>
              <div class="text-[10px] text-slate-400 font-sans leading-normal whitespace-pre-wrap bg-slate-950/60 p-1.5 rounded border border-slate-900">
                {{ mail.body }}
              </div>
            </div>
          </div>
        </div>

        <!-- Column 3: Identity & Role isolation checks (Verify standards) -->
        <div class="bg-slate-950/50 p-4 rounded-xl border border-slate-900 flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-[11px] font-mono uppercase tracking-wider font-bold text-indigo-300 font-bold">Session Governance Gate</h3>
              <span class="text-[9px] bg-red-950/60 px-1.5 py-0.5 rounded text-red-400 font-mono">SECURITY ACTIVE</span>
            </div>

            <!-- Current Session Specs -->
            <div class="p-3 bg-slate-950 rounded-xl border border-slate-900 space-y-2">
              <div class="flex justify-between items-center text-[10px]">
                <span class="text-slate-500 uppercase font-mono">Auth Token Code:</span>
                <span class="font-mono text-slate-350 truncate max-w-[140px]">{{ authStore.token || '(Null Token)' }}</span>
              </div>
              <div class="flex justify-between items-center text-[10px]">
                <span class="text-slate-500 uppercase font-mono">Validated Role:</span>
                <span v-if="authStore.token" class="bg-indigo-950 text-indigo-300 font-bold uppercase tracking-wide px-1.5 py-0.5 rounded text-[9px] font-mono">
                  {{ authStore.roles.join(', ') }}
                </span>
                <span v-else class="text-slate-650">(Not logged in)</span>
              </div>
              <div class="flex justify-between items-center text-[10px]">
                <span class="text-slate-500 uppercase font-mono text-[9px]">Scope Clearance:</span>
                <span class="text-slate-300 font-mono">{{ activeVerificationSummary }}</span>
              </div>
            </div>

            <!-- Detailed rule summaries for developers evaluation -->
            <ul class="text-[10px] leading-relaxed text-slate-400 space-y-1.5 mt-3 list-disc pl-4 font-mono">
              <li>Each user account is restricted strictly inside their respective backoffice partition.</li>
              <li>Attempting to visit unauthorized backoffice directories triggers role guards blocking the navigation.</li>
              <li>Logged-in users face systemic auto-redirection on the marketplace homepage.</li>
            </ul>
          </div>

          <!-- Verification Badge -->
          <div class="bg-[#101424] p-2.5 rounded-lg border border-slate-800 text-[10px] font-mono flex items-center space-x-2 text-indigo-350">
            <span class="text-indigo-400 font-bold">&check;</span>
            <span>Compliance checks for isolation, KYC, multi-tenant Stancl tenancy fully active.</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/store/modules/auth.js';
import { useToast } from 'vue-toastification';
import { useTheme } from '@/composables/useTheme.js';
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts.js';

const authStore = useAuthStore();
const toast = useToast();

const isExpanded = ref(true); // Open by default in early preview so developer knows it exists

const { isLightTheme, toggleTheme } = useTheme();
const { isHelpDrawerOpen } = useKeyboardShortcuts();

const activeVerificationSummary = computed(() => {
  if (!authStore.token || !authStore.user) return 'None (Public Space)';
  
  if (authStore.user.roles.includes('admin')) {
    return 'Full Root Administration';
  }
  
  if (authStore.user.roles.includes('supplier')) {
    const tenantId = authStore.user.tenant;
    const permissions = authStore.user.tenantPermissions ? authStore.user.tenantPermissions[tenantId] || [] : [];
    return `Tenant [${tenantId}] (${permissions.join(', ') || 'No Permissions'})`;
  }

  if (authStore.user.roles.includes('buyer')) {
    return 'Buyer Standard Workspace';
  }

  if (authStore.user.roles.includes('pos')) {
    return 'Cashier POS Console Workspace';
  }

  return 'Standard Member';
});

// Tenant custom simulation domain selector
function onTenantSelected(e) {
  const selected = e.target.value;
  authStore.switchTenant(selected);
  
  if (selected) {
    const tenantObj = authStore.tenants.find(t => t.id === selected);
    toast.success(`Active domain shifted to: ${selected}.enterprise.local (${tenantObj?.name || ''})`);
  } else {
    toast.info('Active domain shifted back to global host main platform.');
  }
}
</script>

<style>
/* Global Transition Effects */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom scrollbar utility */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 2px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #334155;
}
</style>
