<template>
  <div class="space-y-6 max-w-4xl mx-auto">
    <div class="flex items-center space-x-3 mb-4">
      <router-link to="/supplier/suppliers" class="p-2 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition">
        <ArrowLeftIcon class="h-5 w-5" />
      </router-link>
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Ajouter un fournisseur</h1>
        <p class="text-sm text-[var(--color-text-secondary)]">Enregistrez un nouveau partenaire d'approvisionnement dans votre réseau.</p>
      </div>
    </div>

    <form @submit.prevent="saveSupplier" class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 md:p-8 space-y-8 shadow-sm">
      
      <!-- Infos générales -->
      <div class="space-y-4">
        <h3 class="text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2 flex items-center space-x-2">
          <BuildingOfficeIcon class="h-5 w-5 text-[var(--color-primary)]" />
          <span>Informations Générales</span>
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Nom de l'entreprise *</label>
            <input v-model="form.name" type="text" required class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none" placeholder="Ex: Zama-Agro" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Catégorie de produits *</label>
            <select v-model="form.category" required class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none">
              <option value="" disabled>Sélectionner une catégorie</option>
              <option>Intrants Agricoles</option>
              <option>Produits Chimiques</option>
              <option>Outillage Industriel</option>
              <option>Emballages</option>
              <option>Logistique & Transport</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Identifiant Fiscal (NIF/RCCM)</label>
            <input v-model="form.taxId" type="text" class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none" placeholder="Numéro d'enregistrement" />
          </div>
        </div>
      </div>

      <!-- Coordonnées -->
      <div class="space-y-4">
        <h3 class="text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2 flex items-center space-x-2">
          <MapPinIcon class="h-5 w-5 text-[var(--color-primary)]" />
          <span>Contact & Localisation</span>
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Email de contact *</label>
            <input v-model="form.email" type="email" required class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none" placeholder="contact@fournisseur.com" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Téléphone *</label>
            <input v-model="form.phone" type="text" required class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none" placeholder="+237 ..." />
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Adresse complète</label>
            <input v-model="form.address" type="text" class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none" placeholder="Rue, Ville, Pays" />
          </div>
        </div>
      </div>

      <!-- Termes et Conditions -->
      <div class="space-y-4">
        <h3 class="text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2 flex items-center space-x-2">
          <DocumentTextIcon class="h-5 w-5 text-[var(--color-primary)]" />
          <span>Conditions Commerciales</span>
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Conditions de paiement</label>
            <select v-model="form.paymentTerms" class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none">
              <option value="Cash on Delivery">Cash à la livraison (COD)</option>
              <option value="Net 15">Net 15 jours</option>
              <option value="Net 30">Net 30 jours</option>
              <option value="Prepayment">Paiement d'avance (100%)</option>
              <option value="Escrow">Via Escrow</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Statut Initial</label>
            <select v-model="form.status" class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none">
              <option value="Active">Actif</option>
              <option value="Suspended">En attente / Suspendu</option>
            </select>
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-3 pt-4 border-t border-[var(--color-border)]">
        <router-link to="/supplier/suppliers" class="px-5 py-2.5 bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg text-sm font-semibold hover:bg-[var(--color-border)] transition">
          Annuler
        </router-link>
        <button type="submit" class="px-5 py-2.5 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-lg text-sm font-semibold transition shadow-sm">
          Enregistrer le fournisseur
        </button>
      </div>

    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { b2b_suppliers } from '@/utils/supplier_db';
import { useToast } from 'vue-toastification';
import { ArrowLeftIcon, BuildingOfficeIcon, MapPinIcon, DocumentTextIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const toast = useToast();

const form = ref({
  name: '',
  category: '',
  taxId: '',
  email: '',
  phone: '',
  address: '',
  paymentTerms: 'Net 30',
  status: 'Active'
});

function saveSupplier() {
  if (!form.value.name || !form.value.email) return;
  
  const newSup = {
    id: `sup_00${b2b_suppliers.value.length + 1}`,
    ...form.value
  };
  
  b2b_suppliers.value.push(newSup);
  toast.success('Nouveau fournisseur B2B ajouté avec succès !');
  router.push('/supplier/suppliers');
}
</script>
