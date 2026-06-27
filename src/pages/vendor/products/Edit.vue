<template>
  <div class="space-y-6">
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex items-center justify-between shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Modifier le Produit</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Mettez à jour les informations de l'article dans votre catalogue B2C.</p>
      </div>
    </div>

    <div v-if="!product" class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-8 rounded-2xl text-center text-[var(--color-text-muted)]">
      Produit introuvable.
      <div class="mt-4">
        <router-link to="/vendor/products" class="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm">Retour au catalogue</router-link>
      </div>
    </div>

    <form v-else @submit.prevent="updateProduct" class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl space-y-5 max-w-3xl shadow-sm">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="md:col-span-2">
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Nom du produit <span class="text-red-500">*</span></label>
          <input 
            type="text" 
            v-model="form.name" 
            required 
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" 
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Code-barres <span class="text-red-500">*</span></label>
          <input 
            type="text" 
            v-model="form.barcode" 
            required 
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
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Stock Disponible <span class="text-red-500">*</span></label>
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
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { vendor_products, categories } from '@/utils/vendor_db.js';
import { useToast } from 'vue-toastification';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const product = ref(null);
const form = ref({
  name: '',
  barcode: '',
  category: '',
  price: 0,
  stock: 0,
  minStock: 10
});

onMounted(() => {
  const prodId = route.params.id;
  const found = vendor_products.value.find(p => p.id === prodId);
  if (found) {
    product.value = found;
    form.value = {
      name: found.name,
      barcode: found.barcode,
      category: found.category,
      price: found.price,
      stock: found.stock,
      minStock: found.minStock || 10
    };
  }
});

function updateProduct() {
  if (!product.value) return;

  // Check if barcode already exists on another product
  const exists = vendor_products.value.some(p => p.barcode === form.value.barcode && p.id !== product.value.id);
  if (exists) {
    toast.error('Ce code-barres est déjà attribué à un autre produit.');
    return;
  }

  // Update object properties in place to trigger the deep watch
  product.value.name = form.value.name;
  product.value.barcode = form.value.barcode;
  product.value.category = form.value.category;
  product.value.price = form.value.price;
  product.value.stock = form.value.stock;
  product.value.minStock = form.value.minStock;

  toast.success('Produit mis à jour avec succès.');
  router.push('/vendor/products');
}
</script>
