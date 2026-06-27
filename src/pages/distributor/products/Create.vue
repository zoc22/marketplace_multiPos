<template>
  <div class="space-y-6 max-w-5xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-3">
        <router-link to="/distributor/products" class="p-2 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition">
          <ArrowLeftIcon class="h-5 w-5" />
        </router-link>
        <div>
          <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Ajouter un Produit (Catalogue Grossiste)</h1>
          <p class="text-sm text-[var(--color-text-secondary)]">Référencez un nouveau produit pour vos clients revendeurs.</p>
        </div>
      </div>
      <button 
        @click="saveProduct"
        class="px-6 py-2.5 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-lg text-sm font-bold transition shadow-sm"
      >
        Enregistrer le produit
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: Main Info -->
      <div class="lg:col-span-2 space-y-6">
        
        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
          <h3 class="text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2 mb-4">Informations Générales</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Nom du produit *</label>
              <input type="text" v-model="form.name" class="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none" placeholder="Ex: Engrais NPK 20-10-10" />
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Catégorie *</label>
                <select v-model="form.category" class="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none">
                  <option value="Intrants Agricoles">Intrants Agricoles</option>
                  <option value="Équipement">Équipement</option>
                  <option value="Semences">Semences</option>
                  <option value="Emballages">Emballages</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">SKU / Référence *</label>
                <input type="text" v-model="form.id" class="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none" placeholder="Ex: NPK-2010" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Description</label>
              <textarea v-model="form.description" rows="3" class="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none" placeholder="Description technique du produit..."></textarea>
            </div>
          </div>
        </div>

        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
          <h3 class="text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2 mb-4">Tarification & Marges</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Coût d'Achat (HT)</label>
              <div class="relative">
                <input type="number" v-model.number="form.costPrice" class="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none" />
                <span class="absolute right-3 top-2.5 text-xs text-[var(--color-text-muted)] font-bold">FCFA</span>
              </div>
            </div>
            
            <div>
              <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Marge Souhaitée (%)</label>
              <div class="relative">
                <input type="number" v-model.number="form.margin" class="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none" />
                <span class="absolute right-3 top-2.5 text-xs text-[var(--color-text-muted)] font-bold">%</span>
              </div>
            </div>

            <div class="bg-[var(--color-background)] p-3 rounded-lg border border-[var(--color-border)] flex flex-col justify-center">
              <div class="text-xs text-[var(--color-text-secondary)] font-semibold">Prix de Gros Suggéré (HT)</div>
              <div class="text-lg font-bold text-[var(--color-primary)]">{{ formatMoney(calculatedWholesale) }}</div>
            </div>
          </div>
        </div>

      </div>

      <!-- Right Column: Image & Stock -->
      <div class="space-y-6">
        
        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
          <h3 class="text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2 mb-4">Image Principale</h3>
          <div class="w-full h-48 border-2 border-dashed border-[var(--color-border)] rounded-xl flex flex-col items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition cursor-pointer bg-[var(--color-surface-hover)]">
            <PhotoIcon class="h-10 w-10 mb-2" />
            <span class="text-sm font-semibold">Cliquez pour ajouter</span>
          </div>
        </div>

        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
          <h3 class="text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2 mb-4">Stock Initial</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Quantité Disponible</label>
              <input type="number" v-model.number="form.stock" class="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Entrepôt de réception</label>
              <select class="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none">
                <option value="w1">Dépôt Central Douala</option>
                <option value="w2">Magasin Relais Bafoussam</option>
              </select>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { products } from '@/utils/distributor_db';
import { ArrowLeftIcon, PhotoIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const toast = useToast();

const form = ref({
  id: '',
  name: '',
  category: 'Intrants Agricoles',
  description: '',
  costPrice: 0,
  margin: 15,
  stock: 0
});

const calculatedWholesale = computed(() => {
  if (!form.value.costPrice) return 0;
  return form.value.costPrice * (1 + (form.value.margin / 100));
});

function saveProduct() {
  if (!form.value.name || !form.value.id) {
    toast.error('Veuillez remplir le nom et le SKU du produit.');
    return;
  }
  
  products.value.push({
    id: form.value.id,
    name: form.value.name,
    category: form.value.category,
    price: form.value.costPrice, 
    wholesalePrice: calculatedWholesale.value,
    distributorMargin: form.value.margin,
    stock: form.value.stock,
    image: 'https://placehold.co/200'
  });
  
  toast.success('Produit ajouté au catalogue avec succès !');
  router.push('/distributor/products');
}

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('XAF', 'FCFA');
}
</script>
