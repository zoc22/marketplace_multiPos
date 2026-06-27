<template>
  <div class="space-y-6">
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm">
      <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Paramètres et Vérification KYC</h1>
      <p class="text-sm text-[var(--color-text-secondary)] mt-1">Configurez le profil de l'entreprise, le sous-domaine, et vérifiez les certifications conformes.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- CORE SETTINGS FORM -->
      <div class="lg:col-span-2 p-6 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl space-y-5 shadow-sm">
        <h3 class="text-sm font-bold uppercase text-[var(--color-text-primary)] tracking-wider border-b border-[var(--color-border)] pb-2">Informations de l'entreprise</h3>
        
        <form @submit.prevent="updateSettings" class="space-y-5 text-sm select-none" id="settings-form">
          <div class="grid grid-cols-2 gap-5">
            <div>
              <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Nom Légal Enregistré</label>
              <input 
                type="text" 
                v-model="supplierCompany.name"
                class="w-full bg-[var(--color-background)] border border-[var(--color-border)] px-4 py-2.5 rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Sous-domaine B2B</label>
              <div class="p-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-primary)] font-bold font-mono">
                {{ supplierCompany.subdomain }}.platform.local
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Numéro de Registre de Commerce (RCCM)</label>
              <input 
                type="text" 
                v-model="supplierCompany.rccm"
                class="w-full bg-[var(--color-background)] border border-[var(--color-border)] px-4 py-2.5 rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Numéro d'Identifiant Unique (NUI)</label>
              <input 
                type="text" 
                v-model="supplierCompany.nui"
                class="w-full bg-[var(--color-background)] border border-[var(--color-border)] px-4 py-2.5 rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Adresse du Siège Social</label>
            <input 
              type="text" 
              v-model="supplierCompany.headquarters"
              class="w-full bg-[var(--color-background)] border border-[var(--color-border)] px-4 py-2.5 rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
            />
          </div>

          <div class="pt-5 border-t border-[var(--color-border)] flex justify-end">
            <button 
              type="submit"
              class="px-6 py-2.5 bg-[var(--color-primary)] hover:opacity-90 text-white font-bold text-sm rounded-xl shadow-sm transition"
            >
              Mettre à jour les informations
            </button>
          </div>
        </form>
      </div>

      <!-- SIDEBAR FOR KYC DOCUMENTS PREVIEW -->
      <div class="space-y-6">
        
        <div class="p-6 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl space-y-5 shadow-sm">
          <div class="flex justify-between items-center pb-3 border-b border-[var(--color-border)]">
            <h3 class="text-sm font-bold uppercase text-[var(--color-text-primary)] tracking-wider">Dossier Conformité KYC</h3>
            <span class="text-xs font-bold text-emerald-500 uppercase bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">Vérifié</span>
          </div>

          <p class="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Vos dossiers légaux ont été traités et confirmés par le comité de régulation. Toutes les transactions entrantes B2B sont autorisées.
          </p>

          <!-- List of verified file credentials -->
          <div class="space-y-3 text-xs">
            <!-- Doc 1 -->
            <div class="p-4 bg-[var(--color-background)] rounded-xl flex justify-between items-center border border-[var(--color-border)]">
              <div>
                <span class="font-bold text-[var(--color-text-primary)] block">Certificat RCCM</span>
                <span class="text-[var(--color-text-muted)] block mt-0.5">Téléchargé le 2026-03-12</span>
              </div>
              <span class="text-[10px] bg-emerald-500/10 text-emerald-500 font-bold px-2 py-1 rounded border border-emerald-500/20">✓ OK</span>
            </div>

            <!-- Doc 2 -->
            <div class="p-4 bg-[var(--color-background)] rounded-xl flex justify-between items-center border border-[var(--color-border)]">
              <div>
                <span class="font-bold text-[var(--color-text-primary)] block">Quitus Fiscal</span>
                <span class="text-[var(--color-text-muted)] block mt-0.5">Téléchargé le 2026-03-14</span>
              </div>
              <span class="text-[10px] bg-emerald-500/10 text-emerald-500 font-bold px-2 py-1 rounded border border-emerald-500/20">✓ OK</span>
            </div>

            <!-- Doc 3 -->
            <div class="p-4 bg-[var(--color-primary-muted)] rounded-xl flex justify-between items-center border border-[var(--color-primary-border)]">
              <div>
                <span class="font-bold text-[var(--color-primary)] block">Pièce d'Identité Dirigeant</span>
                <span class="text-[var(--color-text-secondary)] block mt-0.5">Vérifié via base gouvernementale</span>
              </div>
              <span class="text-[10px] bg-[var(--color-background)] text-[var(--color-primary)] font-bold px-2 py-1 rounded border border-[var(--color-primary-border)]">SÉCURISÉ ✅</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();

const supplierCompany = ref({
  name: 'Robert Kane Sourcing Sarl',
  subdomain: 'robertkane',
  rccm: 'RC/DLA/2026/B/4521',
  nui: 'M082613240214Z',
  headquarters: 'Zone Industrielle Bassa, Douala, Cameroun'
});

function updateSettings() {
  toast.success('Paramètres de l\'entreprise mis à jour avec succès.');
}
</script>
