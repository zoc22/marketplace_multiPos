<template>
  <div class="space-y-6">
    
    <!-- Top HUD -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Boutiques et Points de vente</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Configurez les terminaux virtuels et gérez les paramètres des boutiques.</p>
      </div>

      <button 
        @click="openCreateStorePopup"
        class="px-5 py-2.5 bg-[var(--color-primary)] hover:opacity-90 text-white font-bold rounded-xl shadow-sm transition flex items-center space-x-2 shrink-0"
      >
        <span class="text-lg leading-none">+</span>
        <span>Ajouter une boutique</span>
      </button>
    </div>

    <!-- CORE LISTS Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- BOUTIQUE CARD GRID -->
      <div 
        v-for="s in stores" 
        :key="s.id"
        class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between transition hover:border-[var(--color-primary-border)]"
      >
        <!-- Covers Banner -->
        <div class="h-36 w-full relative">
          <img :src="s.banner" :alt="s.name" class="h-full w-full object-cover opacity-90" />
          <div class="absolute inset-0 bg-gradient-to-t from-[var(--color-surface-elevated)] via-transparent to-transparent"></div>
          
          <span class="absolute top-3 left-3 bg-[var(--color-surface-hover)] px-2.5 py-1 rounded-md text-[10px] font-semibold text-[var(--color-primary)] border border-[var(--color-border)] uppercase tracking-wider">
            ID: {{ s.id }}
          </span>

          <span class="absolute top-3 right-3 bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border border-emerald-500/20">
            ● {{ translateStatus(s.status) }}
          </span>

          <div class="absolute bottom-4 left-5">
            <h2 class="text-lg font-bold text-white">{{ s.name }}</h2>
            <p class="text-xs text-white/80 font-mono mt-0.5">{{ s.domain || 'virtual.local' }}</p>
          </div>
        </div>

        <!-- Body specs -->
        <div class="p-6 space-y-4 flex-1 text-sm">
          <p class="text-[var(--color-text-secondary)] leading-relaxed">{{ s.description }}</p>
          
          <div class="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--color-border)] text-xs text-[var(--color-text-secondary)]">
            <div>
              <span class="font-semibold">Responsable :</span>
              <span class="block text-[var(--color-text-primary)] mt-1 font-bold">{{ s.manager || 'N/A' }}</span>
            </div>
            <div>
              <span class="font-semibold">Terminal POS :</span>
              <span class="block text-[var(--color-primary)] mt-1 font-bold">{{ s.posConfig?.terminalName || 'Terminal Alpha' }}</span>
            </div>
          </div>
        </div>

        <!-- Bottom tools -->
        <div class="p-4 bg-[var(--color-surface-hover)] border-t border-[var(--color-border)] flex justify-between gap-3">
          <!-- Boutique preview trigger -->
          <button 
            @click="triggerBoutiquePreview(s)"
            class="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-500 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 border border-emerald-500/20"
          >
            <span>👁️ Aperçu</span>
          </button>

          <div class="flex items-center space-x-2">
            <button 
              @click="openEditStorePopup(s)"
              class="px-4 py-2 bg-[var(--color-background)] hover:bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-lg text-xs font-bold border border-[var(--color-border)] transition"
            >
              Configurer
            </button>
            <button 
              @click="triggerDeleteStoreConfirmation(s)"
              class="px-3 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-xs border border-red-500/20 font-bold transition flex items-center"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- POPUP MODALS -->
    
    <!-- 1. CREATE / EDIT STORE DETAILS -->
    <Transition name="modal-fade">
      <div v-if="showStorePopup" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl w-full max-w-xl shadow-2xl relative overflow-hidden modal-content flex flex-col max-h-[90vh]">
          <div class="p-6 border-b border-[var(--color-border)] flex items-center justify-between shrink-0">
            <div>
              <span class="text-[10px] text-[var(--color-primary)] px-2 py-0.5 rounded bg-[var(--color-primary-muted)] font-bold tracking-wider">CRÉATEUR DE BOUTIQUE</span>
              <h3 class="text-xl font-bold mt-2 text-[var(--color-text-primary)]">
                {{ isEditing ? 'Configurer la boutique' : 'Ajouter une boutique' }}
              </h3>
            </div>
            <button @click="showStorePopup = false" class="p-1.5 bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-md transition font-bold text-lg leading-none">
              &times;
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-6">
            <form @submit.prevent="saveStore" class="space-y-5 text-sm" id="store-form">
              <div class="grid grid-cols-2 gap-5">
                <div class="col-span-2">
                  <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Nom de la boutique <span class="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    v-model="storeForm.name"
                    required
                    class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                    placeholder="Ex: Yaoundé Main Sourcing depot"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Nom du responsable <span class="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    v-model="storeForm.manager"
                    required
                    class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                    placeholder="Ex: Robert Kane"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Nom du terminal POS <span class="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    v-model="storeForm.terminalName"
                    required
                    class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                    placeholder="Ex: Terminal Alpha-1"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">URL de l'image de couverture</label>
                <input 
                  type="url" 
                  v-model="storeForm.banner"
                  class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Description et message de bienvenue</label>
                <textarea 
                  v-model="storeForm.description"
                  rows="3"
                  class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition resize-none"
                  placeholder="Ex: Dépôt d'approvisionnement desservant directement les opérateurs B2B..."
                ></textarea>
              </div>
            </form>
          </div>

          <!-- Actions -->
          <div class="p-6 border-t border-[var(--color-border)] bg-[var(--color-surface-hover)] shrink-0 flex justify-end space-x-3">
            <button 
              type="button" 
              @click="showStorePopup = false"
              class="px-5 py-2.5 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] hover:bg-[var(--color-background)] text-[var(--color-text-primary)] rounded-xl font-semibold transition"
            >
              Annuler
            </button>
            <button 
              type="submit"
              form="store-form"
              class="px-5 py-2.5 bg-[var(--color-primary)] hover:opacity-90 text-white rounded-xl font-bold transition shadow-sm"
            >
              Déployer la boutique
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 2. BOUTIQUE PREVIEW HIGH-FIDELITY MODAL (THE COMPANION BUYER WORKSPACE VIEW) -->
    <Transition name="modal-fade">
      <div v-if="previewStore" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative modal-content flex flex-col">
          
          <!-- Frame header visual -->
          <div class="h-12 bg-[var(--color-surface-hover)] border-b border-[var(--color-border)] px-5 flex items-center justify-between shrink-0">
            <div class="flex items-center space-x-2 text-[10px] font-bold text-[var(--color-text-secondary)] rounded uppercase">
              <span class="h-2 w-2 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
              <span>Aperçu de la boutique - Vue Acheteur</span>
            </div>
            <button @click="previewStore = null" class="p-1.5 bg-[var(--color-background)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-md transition font-bold text-lg leading-none border border-[var(--color-border)]">&times;</button>
          </div>

          <!-- The Buyer View container -->
          <div class="flex-1 overflow-y-auto max-h-[75vh]">
            
            <!-- Cover -->
            <div class="h-48 w-full relative">
              <img :src="previewStore.banner" :alt="previewStore.name" class="h-full w-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-[var(--color-surface-elevated)] via-transparent to-transparent"></div>
              
              <div class="absolute bottom-5 left-6">
                <span class="text-[10px] bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider mb-2 inline-block">
                  ✓ Marchand vérifié
                </span>
                <h1 class="text-2xl font-bold text-[var(--color-text-primary)] leading-none">{{ previewStore.name }}</h1>
                <p class="text-sm text-[var(--color-primary)] mt-1.5 font-semibold">{{ previewStore.domain }} • Sourcing Hub</p>
              </div>
            </div>

            <!-- Retail details -->
            <div class="p-6 space-y-8">
              <div class="space-y-3">
                <h3 class="text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">Profil de l'entreprise</h3>
                <p class="text-sm text-[var(--color-text-secondary)] leading-relaxed bg-[var(--color-surface-hover)] border border-[var(--color-border)] p-4 rounded-xl">
                  {{ previewStore.description }}
                </p>
              </div>

              <!-- Featured products lists -->
              <div class="space-y-3">
                <h3 class="text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">Produits vérifiés</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div 
                    v-for="p in catalogProductsSample" 
                    :key="p.id"
                    class="p-4 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl flex items-center space-x-4 text-sm"
                  >
                    <div class="h-12 w-12 bg-[var(--color-background)] rounded-lg flex items-center justify-center border border-[var(--color-border)] overflow-hidden shrink-0">
                      <img v-if="p.image" :src="p.image" class="h-full w-full object-cover" />
                      <span v-else class="text-[var(--color-text-muted)]">Img</span>
                    </div>
                    <div class="truncate">
                      <strong class="text-[var(--color-text-primary)] block truncate">{{ p.name }}</strong>
                      <span class="text-xs text-[var(--color-primary)] font-bold mt-1 block">{{ formatCurrency(p.price) }} FCFA</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          <div class="p-5 bg-[var(--color-surface-hover)] border-t border-[var(--color-border)] flex justify-between items-center text-xs text-[var(--color-text-secondary)] font-semibold shrink-0">
            <span>Certification : Profil de fournisseur</span>
            <span class="text-[var(--color-primary)] font-bold">100% SÉCURISÉ</span>
          </div>

        </div>
      </div>
    </Transition>

    <!-- 3. STORE DELETION DIALOG -->
    <Transition name="modal-fade">
      <div v-if="storeToDelete" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-[var(--color-surface-elevated)] border border-red-500/30 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden modal-content">
          <div class="text-center space-y-4">
            <div class="h-16 w-16 bg-red-500/10 text-red-500 rounded-full border border-red-500/20 flex items-center justify-center font-bold text-3xl mx-auto select-none">
              🚷
            </div>
            <h3 class="text-lg font-bold text-[var(--color-text-primary)]">Fermer la boutique ?</h3>
            <p class="text-sm text-[var(--color-text-secondary)]">
              Êtes-vous sûr de vouloir fermer le terminal de la boutique <strong class="text-[var(--color-text-primary)]">{{ storeToDelete.name }}</strong> ? Cela rompra les synchronisations en direct.
            </p>
          </div>

          <div class="mt-8 flex space-x-3">
            <button 
              @click="storeToDelete = null"
              class="flex-1 py-2.5 bg-[var(--color-surface-hover)] hover:bg-[var(--color-background)] rounded-xl text-sm font-semibold text-[var(--color-text-primary)] border border-[var(--color-border)] transition"
            >
              Annuler
            </button>
            <button 
              @click="confirmDeleteStore"
              class="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition shadow-sm"
            >
              Confirmer la fermeture
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { stores, products } from '@/utils/supplier_db';
import { useToast } from 'vue-toastification';

const toast = useToast();

const showStorePopup = ref(false);
const isEditing = ref(false);
const targetStoreId = ref(null);
const storeToDelete = ref(null);
const previewStore = ref(null);

const storeForm = ref({
  name: '',
  banner: '',
  description: '',
  manager: 'Jean Dupont',
  terminalName: ''
});

const catalogProductsSample = computed(() => {
  return products.value.slice(0, 4);
});

function translateStatus(s) {
  if (s === 'Active' || s === 'online') return 'Active';
  return s;
}

function formatCurrency(val) {
  if (!val) return '0';
  return new Intl.NumberFormat('fr-FR').format(val);
}

function openCreateStorePopup() {
  isEditing.value = false;
  storeForm.value = {
    name: '',
    banner: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200',
    description: '',
    manager: 'Jean Dupont',
    terminalName: 'Terminus ' + String.fromCharCode(65 + stores.value.length)
  };
  showStorePopup.value = true;
}

function openEditStorePopup(s) {
  isEditing.value = true;
  targetStoreId.value = s.id;
  storeForm.value = {
    name: s.name,
    banner: s.banner || '',
    description: s.description || '',
    manager: s.manager || 'Jean Dupont',
    terminalName: s.posConfig?.terminalName || ''
  };
  showStorePopup.value = true;
}

function saveStore() {
  if (isEditing.value) {
    const existing = stores.value.find(s => s.id === targetStoreId.value);
    if (existing) {
      existing.name = storeForm.value.name;
      existing.banner = storeForm.value.banner;
      existing.description = storeForm.value.description;
      existing.manager = storeForm.value.manager;
      if (!existing.posConfig) existing.posConfig = {};
      existing.posConfig.terminalName = storeForm.value.terminalName;
      toast.success('Boutique mise à jour avec succès.');
    }
  } else {
    const newId = 'store_' + (stores.value.length + 1);
    stores.value.push({
      id: newId,
      name: storeForm.value.name,
      banner: storeForm.value.banner || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200',
      description: storeForm.value.description,
      manager: storeForm.value.manager,
      domain: newId + '.enterprise-platform.local',
      status: 'online',
      posConfig: {
        terminalName: storeForm.value.terminalName,
        isActive: true,
        lastSync: '2026-06-18 06:12'
      }
    });
    toast.success('Nouvelle boutique virtuelle ajoutée avec succès !');
  }
  showStorePopup.value = false;
}

function triggerBoutiquePreview(s) {
  previewStore.value = s;
}

function triggerDeleteStoreConfirmation(s) {
  storeToDelete.value = s;
}

function confirmDeleteStore() {
  if (storeToDelete.value) {
    stores.value = stores.value.filter(s => s.id !== storeToDelete.value.id);
    toast.info(`La boutique ${storeToDelete.value.name} a été fermée.`);
    storeToDelete.value = null;
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
