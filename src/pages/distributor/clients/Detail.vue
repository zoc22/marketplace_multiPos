<template>
  <div class="space-y-6" v-if="client">
    <!-- Breadcrumb -->
    <div class="flex items-center space-x-3 mb-2">
      <router-link to="/distributor/clients" class="p-2 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition">
        <ArrowLeftIcon class="h-4 w-4" />
      </router-link>
      <div class="flex items-center space-x-2 text-sm text-[var(--color-text-secondary)] font-medium">
        <router-link to="/distributor/clients" class="hover:text-[var(--color-primary)] transition">Réseau de Clients</router-link>
        <ChevronRightIcon class="h-4 w-4 text-[var(--color-text-muted)]" />
        <span class="text-[var(--color-text-primary)] font-bold">{{ client.name }}</span>
      </div>
    </div>

    <!-- Top Card -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
      <div class="flex items-center space-x-6">
        <div class="h-16 w-16 bg-[var(--color-primary-muted)] text-[var(--color-primary)] flex items-center justify-center rounded-2xl text-2xl font-bold shadow-inner">
          {{ client.name.substring(0, 1) }}
        </div>
        <div>
          <h1 class="text-2xl font-bold text-[var(--color-text-primary)] flex items-center space-x-3">
            <span>{{ client.name }}</span>
            <span 
              class="px-2.5 py-1 rounded-full text-xs font-bold border"
              :class="client.status === 'Actif' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'"
            >
              {{ client.status }}
            </span>
          </h1>
          <p class="text-sm text-[var(--color-text-secondary)] mt-1 flex items-center">
            <TagIcon class="h-4 w-4 mr-1.5 text-[var(--color-text-muted)]" />
            {{ client.type }}
          </p>
        </div>
      </div>
      
      <div class="flex space-x-3">
        <button class="px-4 py-2 border border-[var(--color-border)] bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] rounded-lg text-sm font-semibold transition flex items-center space-x-2">
          <EnvelopeIcon class="h-4 w-4" />
          <span>Contacter</span>
        </button>
        <button class="px-4 py-2 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-lg text-sm font-semibold transition flex items-center space-x-2 shadow-sm">
          <PencilSquareIcon class="h-4 w-4" />
          <span>Éditer le profil</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: Info & Stats -->
      <div class="space-y-6">
        
        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
          <h3 class="font-bold text-[var(--color-text-primary)] mb-4 text-sm flex items-center">
            <IdentificationIcon class="h-5 w-5 text-[var(--color-primary)] mr-2" />
            Coordonnées
          </h3>
          <div class="space-y-4 text-sm text-[var(--color-text-secondary)]">
            <div class="flex items-start space-x-3">
              <EnvelopeIcon class="h-5 w-5 text-[var(--color-text-muted)] shrink-0" />
              <div class="truncate">
                <div class="font-semibold text-[var(--color-text-primary)]">Email</div>
                <a :href="`mailto:${client.email}`" class="hover:text-[var(--color-primary)] transition">{{ client.email }}</a>
              </div>
            </div>
            <div class="flex items-start space-x-3">
              <PhoneIcon class="h-5 w-5 text-[var(--color-text-muted)] shrink-0" />
              <div>
                <div class="font-semibold text-[var(--color-text-primary)]">Téléphone</div>
                <a :href="`tel:${client.phone}`" class="hover:text-[var(--color-primary)] transition">{{ client.phone }}</a>
              </div>
            </div>
            <div class="flex items-start space-x-3">
              <MapPinIcon class="h-5 w-5 text-[var(--color-text-muted)] shrink-0" />
              <div>
                <div class="font-semibold text-[var(--color-text-primary)]">Localisation</div>
                <div>{{ client.location }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
          <h3 class="font-bold text-[var(--color-text-primary)] mb-4 text-sm flex items-center">
            <ChartBarIcon class="h-5 w-5 text-[var(--color-primary)] mr-2" />
            Performance
          </h3>
          <div class="space-y-4">
            <div class="bg-[var(--color-surface-hover)] p-3 rounded-lg border border-[var(--color-border)]">
              <div class="text-xs text-[var(--color-text-secondary)] font-semibold">Total des commandes</div>
              <div class="text-xl font-bold text-[var(--color-text-primary)] mt-1">{{ client.totalOrders }}</div>
            </div>
            <div class="bg-[var(--color-surface-hover)] p-3 rounded-lg border border-[var(--color-border)]">
              <div class="text-xs text-[var(--color-text-secondary)] font-semibold">Chiffre d'Affaires généré (Est.)</div>
              <div class="text-xl font-bold text-[var(--color-primary)] mt-1">{{ formatMoney(client.totalOrders * 150000) }}</div>
            </div>
          </div>
        </div>

      </div>

      <!-- Right Column: Order History -->
      <div class="lg:col-span-2">
        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
          <div class="p-6 border-b border-[var(--color-border)] flex justify-between items-center">
            <h3 class="font-bold text-[var(--color-text-primary)] text-sm flex items-center">
              <ShoppingCartIcon class="h-5 w-5 text-[var(--color-primary)] mr-2" />
              Historique des commandes B2B
            </h3>
            <router-link to="/distributor/orders" class="text-xs font-semibold text-[var(--color-primary)] hover:underline">
              Voir tout
            </router-link>
          </div>
          
          <div class="flex-1 overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-[var(--color-surface-hover)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)]">
                  <th class="p-4">Réf.</th>
                  <th class="p-4">Date</th>
                  <th class="p-4 text-right">Montant</th>
                  <th class="p-4 text-center">Statut</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[var(--color-border)]">
                <tr v-for="o in clientOrders" :key="o.id" class="text-sm hover:bg-[var(--color-surface-hover)] transition cursor-pointer" @click="goToOrder(o.id)">
                  <td class="p-4 font-bold text-[var(--color-primary)]">#{{ o.id }}</td>
                  <td class="p-4 text-[var(--color-text-secondary)]">{{ o.date }}</td>
                  <td class="p-4 text-right font-bold text-[var(--color-text-primary)]">{{ formatMoney(calculateTotal(o.items)) }}</td>
                  <td class="p-4 text-center">
                    <span 
                      class="px-2.5 py-1 rounded-full text-xs font-bold border inline-block"
                      :class="{
                        'bg-amber-500/10 text-amber-500 border-amber-500/20': o.status === 'Pending',
                        'bg-blue-500/10 text-blue-500 border-blue-500/20': o.status === 'Processing',
                        'bg-purple-500/10 text-purple-500 border-purple-500/20': o.status === 'Shipped',
                        'bg-emerald-500/10 text-emerald-500 border-emerald-500/20': o.status === 'Delivered',
                      }"
                    >
                      {{ o.status }}
                    </span>
                  </td>
                </tr>
                <tr v-if="clientOrders.length === 0">
                  <td colspan="4" class="p-8 text-center text-[var(--color-text-muted)]">
                    Ce client n'a pas encore passé de commande.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-12 text-[var(--color-text-muted)]">
    Client introuvable.
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { clients, orders } from '@/utils/distributor_db';
import { 
  ArrowLeftIcon, ChevronRightIcon, TagIcon, EnvelopeIcon, PencilSquareIcon,
  IdentificationIcon, PhoneIcon, MapPinIcon, ChartBarIcon, ShoppingCartIcon
} from '@heroicons/vue/24/outline';

const route = useRoute();
const router = useRouter();

const client = computed(() => {
  return clients.value.find(c => c.id === route.params.id);
});

const clientOrders = computed(() => {
  if (!client.value) return [];
  return orders.value.filter(o => o.client === client.value.id);
});

function calculateTotal(items) {
  if (!items) return 0;
  return items.reduce((acc, i) => acc + ((i.qty || 0) * (i.unitPrice || 0)), 0);
}

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('XAF', 'FCFA');
}

function goToOrder(id) {
  router.push(`/distributor/orders/${id}`);
}
</script>
