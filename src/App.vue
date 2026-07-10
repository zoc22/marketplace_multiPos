<template>
  <div 
    class="bg-light-bg-main dark:bg-slate-950 text-text-main dark:text-slate-100 font-sans antialiased selection:bg-indigo-500/30 selection:text-indigo-200 flex flex-col justify-between"
    :class="isFixedLayout ? 'h-screen overflow-hidden' : 'min-h-screen'"
  >
    
    <!-- Main router view without padding bottom (since HUD is removed) -->
    <div class="flex-1 min-h-0 flex flex-col">
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth.js';
import { useToast } from 'vue-toastification';
import { useTheme } from '@/composables/useTheme.js';
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts.js';

const route = useRoute();
const authStore = useAuthStore();
const toast = useToast();

const isExpanded = ref(true); // Open by default in early preview so developer knows it exists

const { isLightTheme, toggleTheme } = useTheme();
const { isHelpDrawerOpen } = useKeyboardShortcuts();

const isFixedLayout = computed(() => {
  const path = route.path;
  return path.startsWith('/vendor') || path.startsWith('/distributor') || path.startsWith('/buyer') || path.startsWith('/admin');
});

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
  
  if (authStore.user.roles.includes('vendor')) {
    return 'Vendor Multi-POS Workspace';
  }
  
  if (authStore.user.roles.includes('distributor')) {
    return 'Distributor B2B Workspace';
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
  transition: opacity var(--transition-duration-fast) var(--transition-timing);
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
  background: var(--color-border) !important;
  border-radius: 0px !important;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-tertiary) !important;
}
</style>
