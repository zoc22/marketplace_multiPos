<template>
  <div class="space-y-6 max-w-6xl mx-auto" id="buyer-wishlist">
    <!-- Header -->
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
      <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Ma Liste d'Envies</h1>
      <p class="text-sm text-[var(--color-text-secondary)] mt-1">Retrouvez les articles sauvegardés et ajoutez-les directement à votre panier.</p>
    </div>

    <!-- Grid items -->
    <div v-if="wishlistItems.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="item in wishlistItems" 
        :key="item.id"
        class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:border-[var(--color-primary)] transition"
      >
        <div class="h-44 w-full relative">
          <img :src="item.image" alt="produit" class="w-full h-full object-cover" />
          <button 
            @click="removeFromWishlist(item.id)"
            class="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition"
            title="Retirer des favoris"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <div class="p-4 space-y-2 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="font-bold text-sm text-[var(--color-text-primary)] leading-snug">{{ item.name }}</h3>
            <p class="text-xs text-[var(--color-text-secondary)] line-clamp-2 mt-1">{{ item.description }}</p>
          </div>
          
          <div class="pt-3 border-t border-[var(--color-border)] flex justify-between items-center mt-3">
            <span class="text-base font-bold font-mono text-[var(--color-primary)]">{{ formatMoney(item.price) }}</span>
            <button 
              @click="addToCart(item)"
              class="px-3.5 py-1.5 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-lg text-xs font-semibold uppercase tracking-wider transition shadow flex items-center space-x-1"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span>Acheter</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="bg-[var(--color-surface)] border border-[var(--color-border)] p-12 rounded-2xl text-center text-[var(--color-text-secondary)] shadow-sm">
      <svg class="w-12 h-12 mx-auto text-[var(--color-text-muted)] opacity-50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
      <p class="text-sm font-semibold">Votre liste d'envies est vide.</p>
      <p class="text-xs text-[var(--color-text-muted)] mt-1">Parcourez notre catalogue pour y ajouter des coups de cœur.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();

const wishlistItems = ref([
  {
    id: 1,
    name: 'Sachet de Poivre Blanc de Penja Original',
    description: 'Poivre noir ou blanc du terroir Penja, Cameroun. Arôme puissant et piquant naturel.',
    price: 8000,
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&q=80'
  },
  {
    id: 2,
    name: 'Tenue Traditionnelle Ndop Premium',
    description: 'Tissu Ndop royal authentique, cousu main à l\'Ouest du Cameroun.',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80'
  },
  {
    id: 3,
    name: 'Miel Pur de l\'Adamaoua (1L)',
    description: 'Miel de forêt sauvage récolté à Ngaoundéré. 100% biologique.',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80'
  }
]);

function removeFromWishlist(id) {
  wishlistItems.value = wishlistItems.value.filter(i => i.id !== id);
  toast.info('Article retiré de vos favoris.');
}

function addToCart(item) {
  toast.success(`Le produit "${item.name}" a été ajouté au panier d'achat.`);
}

function formatMoney(val) {
  if (!val && val !== 0) return '-';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('XAF', 'FCFA');
}
</script>
