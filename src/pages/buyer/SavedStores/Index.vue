<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm">
      <h1 class="text-xl font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
        <HeartIcon class="h-6 w-6 text-red-500" />
        <span>Mes Boutiques Enregistrées (Favoris)</span>
      </h1>
      <p class="text-sm text-[var(--color-text-secondary)] mt-1">
        Retrouvez rapidement vos boutiques préférées de la marketplace pour vos futurs approvisionnements.
      </p>
    </div>

    <!-- Stores Grid -->
    <div v-if="savedShops.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="shop in savedShops" :key="shop.id" class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
        
        <!-- Shop Info -->
        <div class="p-6 space-y-3 flex-1">
          <div class="flex items-center space-x-3">
            <div class="h-12 w-12 rounded-xl bg-[var(--color-primary-muted)] text-[var(--color-primary)] flex items-center justify-center font-bold text-lg">
              {{ shop.name.charAt(0) }}
            </div>
            <div>
              <h3 class="font-bold text-sm text-[var(--color-text-primary)]">{{ shop.name }}</h3>
              <span class="text-xs text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold inline-block mt-0.5">
                Certifié Marketplace
              </span>
            </div>
          </div>
          <p class="text-xs text-[var(--color-text-secondary)] leading-relaxed line-clamp-3">
            {{ shop.description }}
          </p>
        </div>

        <!-- Card Footer -->
        <div class="p-4 bg-[var(--color-surface-hover)] border-t border-[var(--color-border)] flex justify-between gap-3 shrink-0">
          <button 
            @click="removeShop(shop.id)"
            class="px-3 py-2 text-red-500 hover:bg-red-500/10 text-xs font-bold rounded-lg border border-red-500/10 hover:border-red-500/20 transition flex items-center justify-center"
            title="Retirer des favoris"
          >
            <TrashIcon class="h-4.5 w-4.5" />
          </button>
          <button 
            @click="visitShop(shop)"
            class="flex-1 py-2 text-center bg-[var(--color-primary)] text-white hover:opacity-90 text-xs font-bold rounded-lg transition"
          >
            Visiter la Boutique
          </button>
        </div>

      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-12 rounded-2xl text-center shadow-sm space-y-4">
      <div class="h-16 w-16 bg-[var(--color-surface-hover)] rounded-full flex items-center justify-center mx-auto text-[var(--color-text-muted)]">
        <HeartIcon class="h-8 w-8" />
      </div>
      <div>
        <h3 class="font-bold text-base text-[var(--color-text-primary)]">Aucune boutique enregistrée</h3>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Parcourez la marketplace et enregistrez des boutiques pour les retrouver ici.</p>
      </div>
      <router-link to="/buyer/orders" class="inline-block px-5 py-2.5 bg-[var(--color-primary)] text-white font-semibold text-xs rounded-xl hover:opacity-90 transition">
        Retourner au catalogue
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { HeartIcon, TrashIcon } from '@heroicons/vue/24/outline';
import { suppliers } from '@/utils/seed_data.js';

const router = useRouter();
const toast = useToast();

const savedShops = ref([]);

onMounted(() => {
  const saved = localStorage.getItem('saved_shops_buyer');
  if (saved) {
    savedShops.value = JSON.parse(saved);
  } else {
    // Generate default favorite stores matching existing supplier ids
    const s1 = suppliers.find(s => s.id === 'supp_1') || { name: 'AgroDistrib Centre-Sud', city: 'Douala' };
    const s2 = suppliers.find(s => s.id === 'supp_2') || { name: 'TechSupplies Cameroun', city: 'Yaoundé' };
    
    savedShops.value = [
      {
        id: 'supp_1',
        name: s1.name,
        description: `Boutique officielle ${s1.name} basée à ${s1.city}. Spécialiste de la distribution et d'approvisionnement en gros.`
      },
      {
        id: 'supp_2',
        name: s2.name,
        description: `Boutique officielle ${s2.name} basée à ${s2.city}. Fournisseur d'équipements de premier choix.`
      }
    ];
    localStorage.setItem('saved_shops_buyer', JSON.stringify(savedShops.value));
  }
});

const removeShop = (id) => {
  savedShops.value = savedShops.value.filter(s => s.id !== id);
  localStorage.setItem('saved_shops_buyer', JSON.stringify(savedShops.value));
  toast.success("Boutique retirée de vos favoris.");
};

const visitShop = (shop) => {
  router.push(`/store/${shop.id}`);
};
</script>
