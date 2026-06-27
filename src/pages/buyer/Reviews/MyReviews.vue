<template>
  <div class="space-y-6 max-w-4xl mx-auto" id="buyer-reviews">
    <!-- Header -->
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Mes Évaluations</h1>
        <p class="text-sm text-[var(--color-text-secondary)]">Exprimez-vous et notez les boutiques partenaires suite à vos livraisons.</p>
      </div>
      <button 
        @click="isModalOpen = true"
        class="px-4 py-2 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-xl text-xs font-semibold uppercase tracking-wider transition shadow flex items-center space-x-2"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span>Ajouter un avis</span>
      </button>
    </div>

    <!-- Reviews Grid -->
    <div class="grid grid-cols-1 gap-4">
      <div 
        v-for="rev in reviewsList" 
        :key="rev.id"
        class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4 shadow-sm"
      >
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-bold text-sm text-[var(--color-text-primary)]">{{ rev.storeName }}</h3>
            <span class="text-xs text-[var(--color-text-secondary)] font-mono">Commande : {{ rev.orderRef }} &bull; le {{ rev.date }}</span>
          </div>
          <!-- Stars rating -->
          <div class="flex items-center space-x-1">
            <span v-for="star in 5" :key="star" :class="star <= rev.rating ? 'text-amber-500' : 'text-slate-300'">
              <svg class="w-4.5 h-4.5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </span>
          </div>
        </div>
        <p class="text-sm text-[var(--color-text-secondary)] leading-relaxed italic">" {{ rev.comment }} "</p>
      </div>
    </div>

    <!-- Review Form Modal -->
    <div 
      v-if="isModalOpen"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
      @click.self="isModalOpen = false"
    >
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl w-full max-w-md p-6 shadow-2xl cursor-default animate-in zoom-in-95 duration-200 space-y-4">
        <h3 class="text-sm font-bold text-[var(--color-text-primary)] uppercase font-mono border-b border-[var(--color-border)] pb-2">Déposer une évaluation</h3>
        
        <form @submit.prevent="submitReview" class="space-y-4">
          <label class="block">
            <span class="block text-xs text-[var(--color-text-secondary)] mb-1">Boutique partenaire</span>
            <select v-model="form.storeName" class="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] p-2 rounded-lg">
              <option value="Zama-Agro Sahel">Zama-Agro Sahel</option>
              <option value="SOPRO-CAM S.A.">SOPRO-CAM S.A.</option>
              <option value="Nylon Packaging Douala">Nylon Packaging Douala</option>
            </select>
          </label>

          <label class="block">
            <span class="block text-xs text-[var(--color-text-secondary)] mb-1">Référence commande</span>
            <input type="text" v-model="form.orderRef" placeholder="Ex: B2B-PO-2026-0812-25" required class="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] p-2 rounded-lg font-mono" />
          </label>

          <label class="block">
            <span class="block text-xs text-[var(--color-text-secondary)] mb-1">Note (Étoiles)</span>
            <select v-model.number="form.rating" class="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] p-2 rounded-lg">
              <option :value="5">⭐⭐⭐⭐⭐ (5 / 5)</option>
              <option :value="4">⭐⭐⭐⭐ (4 / 5)</option>
              <option :value="3">⭐⭐⭐ (3 / 5)</option>
              <option :value="2">⭐⭐ (2 / 5)</option>
              <option :value="1">⭐ (1 / 5)</option>
            </select>
          </label>

          <label class="block">
            <span class="block text-xs text-[var(--color-text-secondary)] mb-1">Votre commentaire</span>
            <textarea v-model="form.comment" required rows="3" class="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] p-2 rounded-lg font-sans"></textarea>
          </label>

          <div class="flex justify-end space-x-3 pt-2">
            <button type="button" @click="isModalOpen = false" class="px-4 py-2 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-secondary)]">Annuler</button>
            <button type="submit" class="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-xs font-semibold">Envoyer</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();

const isModalOpen = ref(false);

const reviewsList = ref([
  {
    id: 1,
    storeName: 'Zama-Agro Sahel',
    orderRef: 'B2C-00241',
    date: '18 juin 2026',
    rating: 5,
    comment: 'Les sacs de cacao sont de superbe qualité, très bien emballés. La livraison ferroviaire a été plus rapide que prévu.'
  },
  {
    id: 2,
    storeName: 'Nylon Packaging Douala',
    orderRef: 'B2C-00109',
    date: '10 mai 2026',
    rating: 4,
    comment: 'Excellents produits, livraison à moto cargo Douala Bassa très fluide. Je recommande vivement.'
  }
]);

const form = ref({
  storeName: 'Zama-Agro Sahel',
  orderRef: '',
  rating: 5,
  comment: ''
});

function submitReview() {
  reviewsList.value.unshift({
    id: Date.now(),
    storeName: form.value.storeName,
    orderRef: form.value.orderRef,
    date: 'Aujourd\'hui',
    rating: form.value.rating,
    comment: form.value.comment
  });
  isModalOpen.value = false;
  toast.success('Votre évaluation a été partagée publiquement.');
  form.value.orderRef = '';
  form.value.comment = '';
}
</script>
