<template>
  <aside 
    class="fixed inset-y-0 left-0 transform md:transform-none md:relative z-40 bg-white dark:bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out shrink-0 select-none"
    :class="[
      isCollapsed ? 'md:w-20' : 'md:w-72',
      isOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'
    ]"
    role="navigation"
    :aria-label="title"
  >
    <!-- BRAND TERMINAL IDENTITY -->
    <div class="h-16 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
      <div class="flex items-center space-x-3 truncate" v-show="!isCollapsed || isOpen">
        <div class="h-8 w-8 bg-emerald-500 flex items-center justify-center text-[#1A1A1A] font-bold font-mono">
          <CommandLineIcon class="h-5 w-5" aria-hidden="true" />
        </div>
        <span class="font-bold text-slate-200 uppercase text-sm tracking-wider font-mono">{{ title }}</span>
      </div>
      <div class="flex justify-center w-full" v-show="isCollapsed && !isOpen">
        <CommandLineIcon class="h-6 w-6 text-emerald-500" aria-hidden="true" />
      </div>
      
      <!-- COLLAPSE TOGGLER -->
      <button 
        @click="$emit('toggle-collapse')"
        class="hidden md:block p-1.5 bg-white dark:bg-slate-950 hover:bg-[#F0EFEB] dark:bg-slate-800 text-slate-400 hover:text-white transition"
        :aria-label="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      >
        <span class="text-xs font-mono">{{ isCollapsed ? '&rarr;' : '&larr;' }}</span>
      </button>
    </div>

    <!-- PROFILE/USER DOCK -->
    <div 
      class="m-4 p-4 bg-white dark:bg-slate-950 border border-slate-800 text-sm shrink-0"
      v-show="!isCollapsed || isOpen"
    >
      <div class="text-[10px] uppercase font-mono text-emerald-400 tracking-wider font-bold mb-1">AUTH STATUS</div>
      <p class="font-semibold text-slate-200 truncate leading-tight">{{ userName }}</p>
      <p class="text-xs font-mono text-slate-400 mt-1.5 uppercase flex items-center space-x-1">
        <span class="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-ping"></span>
        <span>{{ userRole }}</span>
      </p>
    </div>

    <!-- COLLAPSED PROFILE SHORTCUT -->
    <div 
      class="my-4 py-2 flex flex-col items-center border-b border-slate-800 group relative cursor-pointer"
      v-show="isCollapsed && !isOpen"
    >
      <div class="h-10 w-10 bg-white dark:bg-slate-950 text-emerald-400 border border-slate-800 flex items-center justify-center font-bold font-sans text-sm uppercase shadow">
        {{ userName ? userName[0] : 'U' }}
      </div>
      <div class="hidden group-hover:block absolute left-16 bg-white dark:bg-slate-950 text-slate-200 font-mono text-xs uppercase border border-slate-800 p-2.5 shadow-xl z-50 whitespace-nowrap">
        Role: {{ userRole }}
      </div>
    </div>

    <!-- SIDEBAR NAVIGATION CONTAINER -->
    <nav class="flex-1 overflow-y-auto px-4 py-3 space-y-5 scrollbar-thin">
      <div v-for="group in menuGroups" :key="group.label" class="space-y-2">
        <!-- Category Title -->
        <div 
          class="px-2 pb-1.5 text-xs uppercase font-mono tracking-widest text-slate-500 font-bold"
          v-show="!isCollapsed || isOpen"
        >
          {{ group.label }}
        </div>

        <div 
          class="h-px bg-[#F0EFEB] dark:bg-slate-800 my-2 mx-1" 
          v-show="isCollapsed && !isOpen"
        ></div>

        <!-- Loop Items -->
        <div v-for="item in group.items" :key="item.name" class="space-y-1">
          <!-- Standard link without children -->
          <router-link 
            v-if="!item.children"
            :to="item.to"
            class="flex items-center px-3 py-2.5 text-base font-mono transition group relative"
            :class="isActive(item.to) ? 'bg-emerald-950/40 text-emerald-400 font-bold border-l-2 border-emerald-400' : 'text-slate-400 hover:bg-slate-955 hover:text-white'"
            @click="$emit('close-mobile')"
          >
            <component :is="item.icon" class="h-6 w-6 mr-3 text-slate-400 group-hover:text-white shrink-0" aria-hidden="true" />
            <span v-show="!isCollapsed || isOpen" class="truncate">{{ item.name }}</span>
            
            <div 
              v-show="isCollapsed && !isOpen" 
              class="hidden group-hover:block absolute left-16 bg-white dark:bg-slate-950 text-slate-200 border border-slate-800 p-2.5 shadow-xl font-mono text-xs uppercase z-50 whitespace-nowrap"
            >
              {{ item.name }}
            </div>
          </router-link>

          <!-- Interactive Dropdown parent block -->
          <div v-else class="space-y-1">
            <button 
              @click="$emit('toggle-dropdown', item.id)"
              class="w-full flex items-center justify-between px-3 py-2.5 text-base font-mono transition group relative text-left"
              :class="[
                isDropdownActive(item) ? 'text-emerald-400 font-semibold bg-white dark:bg-slate-950/40' : 'text-slate-400 hover:bg-slate-955 hover:text-white',
              ]"
              :aria-expanded="openDropdowns[item.id]"
            >
              <div class="flex items-center truncate">
                <component :is="item.icon" class="h-6 w-6 mr-3 text-slate-400 group-hover:text-white shrink-0" aria-hidden="true" />
                <span v-show="!isCollapsed || isOpen" class="truncate">{{ item.name }}</span>
              </div>
              <ChevronDownIcon 
                v-show="!isCollapsed || isOpen" 
                class="h-4 w-4 text-slate-500 transition-transform duration-200 shrink-0"
                :class="openDropdowns[item.id] ? 'rotate-180' : ''"
                aria-hidden="true"
              />

              <div 
                v-show="isCollapsed && !isOpen" 
                class="hidden group-hover:block absolute left-16 bg-white dark:bg-slate-950 text-slate-200 border border-slate-800 p-2.5 shadow-xl font-mono text-xs uppercase z-50 whitespace-nowrap"
              >
                {{ item.name }}
              </div>
            </button>

            <!-- Dropdown Children -->
            <div 
              v-show="openDropdowns[item.id] && (!isCollapsed || isOpen)" 
              class="pl-6 space-y-1 border-l border-slate-800 ml-6 pr-1 py-1"
            >
              <router-link 
                v-for="sub in item.children" 
                :key="sub.name"
                :to="sub.to"
                class="block px-3 py-2 text-sm font-mono text-slate-405 hover:text-white hover:bg-slate-955 transition truncate"
                :class="isActive(sub.to) ? 'text-emerald-400 font-bold bg-[#0d2226]' : ''"
                @click="$emit('close-mobile')"
              >
                {{ sub.name }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- DISCONNECT CORE BUTTON -->
    <div class="p-4 border-t border-slate-800 shrink-0">
      <button 
        @click="$emit('logout')"
        class="w-full py-2.5 bg-red-950/20 text-red-400 hover:bg-red-900 hover:text-[#1A1A1A] text-xs font-mono uppercase font-bold tracking-wider transition border border-red-900/30 flex justify-center items-center space-x-2"
        aria-label="Logout Session"
      >
        <ArrowRightOnRectangleIcon class="h-5 w-5" aria-hidden="true" />
        <span v-show="!isCollapsed || isOpen">Disengage Console</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { 
  CommandLineIcon, 
  ChevronDownIcon, 
  ArrowRightOnRectangleIcon 
} from '@heroicons/vue/24/outline';
import { useRoute } from 'vue-router';

const props = defineProps({
  title: { type: String, default: 'CORE PLATFORM' },
  isCollapsed: { type: Boolean, default: false },
  isOpen: { type: Boolean, default: false },
  userName: { type: String, default: 'Supervisor' },
  userRole: { type: String, default: 'Administrator' },
  menuGroups: { type: Array, required: true },
  openDropdowns: { type: Object, default: () => ({}) }
});

const emit = defineEmits([
  'toggle-collapse', 
  'toggle-dropdown', 
  'close-mobile', 
  'logout'
]);

const route = useRoute();

function isActive(targetPath) {
  return route.path === targetPath || route.path.startsWith(targetPath + '/');
}

function isDropdownActive(item) {
  if (!item.children) return false;
  return item.children.some(child => isActive(child.to));
}
</script>
