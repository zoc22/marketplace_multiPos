<template>
  <div class="space-y-6">
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex items-center justify-between shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Nouveau Produit</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Ajoutez un nouvel article à votre catalogue B2C.</p>
      </div>
    </div>

    <form @submit.prevent="saveProduct" class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl space-y-5 max-w-3xl shadow-sm">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="md:col-span-2">
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Nom du produit <span class="text-red-500">*</span></label>
          <input 
            type="text" 
            v-model="form.name" 
            required 
            placeholder="Ex: Smartphone Pro X" 
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" 
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Code-barres <span class="text-red-500">*</span></label>
          <input 
            type="text" 
            v-model="form.barcode" 
            required 
            placeholder="Ex: 370000000099" 
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] font-mono" 
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Catégorie <span class="text-red-500">*</span></label>
          <select 
            v-model="form.category" 
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Prix de vente (FCFA) <span class="text-red-500">*</span></label>
          <input 
            type="number" 
            v-model.number="form.price" 
            required 
            min="0" 
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] font-bold text-[var(--color-primary)]" 
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Stock Initial <span class="text-red-500">*</span></label>
          <input 
            type="number" 
            v-model.number="form.stock" 
            required 
            min="0" 
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] font-bold" 
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Seuil d'alerte stock <span class="text-red-500">*</span></label>
          <input 
            type="number" 
            v-model.number="form.minStock" 
            required 
            min="1" 
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" 
          />
        </div>
      </div>
      <div class="pt-5 border-t border-[var(--color-border)] flex justify-end space-x-3 mt-6">
        <router-link to="/vendor/products" class="px-5 py-2.5 bg-[var(--color-surface-hover)] hover:bg-[var(--color-border)] rounded-lg text-sm font-semibold transition text-[var(--color-text-primary)]">Annuler</router-link>
        <button type="submit" class="px-5 py-2.5 bg-[var(--color-primary)] hover:opacity-90 text-white rounded-lg text-sm font-semibold transition shadow-sm">Enregistrer</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { vendor_products, categories } from '@/utils/vendor_db.js';
import { useToast } from 'vue-toastification';

const router = useRouter();
const toast = useToast();

const form = ref({
  name: '',
  barcode: '',
  category: categories.value[0] || 'Alimentaire',
  price: 0,
  stock: 0,
  minStock: 10
});

function saveProduct() {
  // Check if barcode already exists
  const exists = vendor_products.value.some(p => p.barcode === form.value.barcode);
  if (exists) {
    toast.error('Ce code-barres est déjà attribué à un autre produit.');
    return;
  }

  const newProduct = {
    id: 'PRD-' + Date.now().toString().slice(-6),
    barcode: form.value.barcode,
    name: form.value.name,
    category: form.value.category,
    price: form.value.price,
    stock: form.value.stock,
    minStock: form.value.minStock,
    image: 'https://placehold.co/100?text=' + encodeURIComponent(form.value.name.substring(0, 3))
  };

  vendor_products.value.unshift(newProduct);
  toast.success('Produit enregistré avec succès.');
  router.push('/vendor/products');
}
</script>
