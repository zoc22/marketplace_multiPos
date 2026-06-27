<template>
  <div class="space-y-6">
    <div v-if="!order" class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-8 rounded-2xl text-center text-[var(--color-text-muted)] shadow-sm">
      Commande introuvable.
      <div class="mt-4">
        <router-link to="/vendor/orders" class="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm">Retour aux commandes</router-link>
      </div>
    </div>

    <div v-else class="space-y-6">
      <!-- Header -->
      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div>
          <div class="flex items-center space-x-3">
            <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Commande {{ order.id }}</h1>
            <span class="px-2.5 py-1 rounded-full text-xs font-bold border inline-block" :class="{
              'bg-emerald-500/10 text-emerald-600 border-emerald-500/20': order.status === 'Completed',
              'bg-amber-500/10 text-amber-600 border-amber-500/20': order.status === 'Pending',
              'bg-blue-500/10 text-blue-600 border-blue-500/20': order.status === 'Shipped',
              'bg-red-500/10 text-red-600 border-red-500/20': order.status === 'Cancelled'
            }">
              {{ order.status === 'Pending' ? 'En attente' : order.status === 'Completed' ? 'Complétée' : order.status === 'Shipped' ? 'Expédiée' : order.status }}
            </span>
          </div>
          <p class="text-sm text-[var(--color-text-secondary)] mt-1">Enregistrée le : {{ formatDate(order.date) }}</p>
        </div>
        <div class="flex space-x-2">
          <router-link to="/vendor/orders" class="px-4 py-2.5 bg-[var(--color-surface-hover)] border border-[var(--color-border)] hover:bg-[var(--color-border)] rounded-xl text-sm font-semibold transition text-[var(--color-text-primary)]">
            Retour
          </router-link>
          <button @click="openInvoicePrint" class="px-4 py-2.5 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-xl text-sm font-semibold hover:bg-[var(--color-surface-hover)] transition flex items-center space-x-1.5 shadow-sm">
            <PrinterIcon class="h-4.5 w-4.5" />
            <span>Imprimer Facture</span>
          </button>
          <router-link v-if="order.type === 'Online' && order.status === 'Pending'" :to="`/vendor/orders/${order.id}/prepare`" class="px-4 py-2.5 bg-amber-500 text-white hover:opacity-90 rounded-xl text-sm font-semibold transition shadow-sm">
            Préparer l'expédition
          </router-link>
        </div>
      </div>

      <!-- Logistics timeline card (B2C) -->
      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm">
        <h3 class="font-bold text-xs uppercase text-[var(--color-text-secondary)] tracking-wider mb-4">Statut d'Expédition Logistique (B2C Vente)</h3>
        
        <div class="flex items-center justify-between relative max-w-xl mx-auto">
          <!-- Line -->
          <div class="absolute left-1/10 right-1/10 top-1/2 -translate-y-1/2 h-1 bg-[var(--color-border)] z-0">
            <div class="h-full bg-emerald-500 transition-all duration-500" :style="{ width: timelineProgressWidth }"></div>
          </div>
          
          <!-- Step 1: Pending -->
          <div class="flex flex-col items-center z-10">
            <div class="h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs border transition" :class="order.status === 'Pending' || order.status === 'Shipped' || order.status === 'Completed' ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)]'">
              1
            </div>
            <span class="text-[10px] font-bold text-[var(--color-text-primary)] mt-1">Reçue (En attente)</span>
          </div>

          <!-- Step 2: Shipped -->
          <div class="flex flex-col items-center z-10">
            <div class="h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs border transition" :class="order.status === 'Shipped' || order.status === 'Completed' ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)]'">
              2
            </div>
            <span class="text-[10px] font-bold text-[var(--color-text-primary)] mt-1">Expédiée</span>
          </div>

          <!-- Step 3: Completed -->
          <div class="flex flex-col items-center z-10">
            <div class="h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs border transition" :class="order.status === 'Completed' ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)]'">
              3
            </div>
            <span class="text-[10px] font-bold text-[var(--color-text-primary)] mt-1">Livrée / Validée</span>
          </div>
        </div>

        <!-- Simulation control for client confirmation -->
        <div class="mt-6 pt-4 border-t border-[var(--color-border)] text-center">
          <button 
            v-if="order.status === 'Pending' || order.status === 'Shipped'"
            @click="simulateClientConfirmation"
            class="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition shadow-sm flex items-center space-x-1.5 mx-auto"
          >
            <CheckCircleIcon class="h-4.5 w-4.5" />
            <span>Simuler Validation de Réception par le Client (Libère l'argent séquestré)</span>
          </button>
          <div v-else-if="order.status === 'Completed'" class="text-xs font-bold text-emerald-500 flex items-center justify-center space-x-1">
            <CheckCircleIcon class="h-5 w-5" />
            <span>Livraison validée par le client. Montant crédité sur le Portefeuille Libre.</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main details -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm">
            <h3 class="font-bold text-[var(--color-text-primary)] text-base mb-4 pb-2 border-b border-[var(--color-border)]">Articles de la commande</h3>
            <div class="divide-y divide-[var(--color-border)]">
              <div v-for="(item, idx) in order.items" :key="idx" class="py-4 flex justify-between items-center first:pt-0 last:pb-0">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 rounded-lg border bg-white flex items-center justify-center p-1">
                    <img :src="getProductImage(item.product.id)" class="max-h-full max-w-full object-contain" />
                  </div>
                  <div>
                    <h4 class="font-bold text-sm text-[var(--color-text-primary)]">{{ item.product.name }}</h4>
                    <p class="text-xs text-[var(--color-text-secondary)] font-medium">{{ formatMoney(item.product.price) }} x {{ item.quantity }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-bold text-sm text-[var(--color-text-primary)]">
                    {{ formatMoney(item.quantity * item.product.price * (1 - item.discountPercent/100)) }}
                  </div>
                  <div v-if="item.discountPercent > 0" class="text-xs text-red-500 font-medium">Remise {{ item.discountPercent }}%</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment history -->
          <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm">
            <h3 class="font-bold text-[var(--color-text-primary)] text-base mb-4 pb-2 border-b border-[var(--color-border)]">Informations de Paiement</h3>
            <div class="space-y-3">
              <div v-for="(pm, idx) in order.payments" :key="idx" class="flex justify-between items-center p-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-sm">
                <span class="font-bold text-[var(--color-text-secondary)]">{{ pm.method }}</span>
                <span class="font-bold text-[var(--color-text-primary)]">{{ formatMoney(pm.amount) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right sidebar (Summary and customer info) -->
        <div class="space-y-6">
          <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm">
            <h3 class="font-bold text-[var(--color-text-primary)] text-base mb-4 pb-2 border-b border-[var(--color-border)]">Client</h3>
            <div class="space-y-4 text-sm">
              <div>
                <span class="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Nom Complet</span>
                <span class="font-bold text-[var(--color-text-primary)]">{{ order.customerName || 'Client Comptant' }}</span>
              </div>
              <div v-if="order.shippingAddress">
                <span class="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Adresse de livraison</span>
                <span class="font-medium text-[var(--color-text-primary)]">{{ order.shippingAddress }}</span>
              </div>
              <div>
                <span class="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Canal de commande</span>
                <span class="px-2 py-0.5 bg-[var(--color-primary-muted)] text-[var(--color-primary)] text-xs rounded font-bold inline-block">{{ order.type }}</span>
              </div>
            </div>
          </div>

          <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm space-y-3">
            <h3 class="font-bold text-[var(--color-text-primary)] text-base mb-4 pb-2 border-b border-[var(--color-border)]">Récapitulatif Financier</h3>
            <div class="flex justify-between text-sm">
              <span class="text-[var(--color-text-secondary)]">Sous-total</span>
              <span class="font-medium text-[var(--color-text-primary)]">{{ formatMoney(order.subtotal) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-[var(--color-text-secondary)]">Remises</span>
              <span class="font-medium text-red-500">- {{ formatMoney(order.discount) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-[var(--color-text-secondary)]">TVA</span>
              <span class="font-medium text-[var(--color-text-primary)]">{{ formatMoney(order.tax) }}</span>
            </div>
            <div class="flex justify-between text-lg font-black pt-3 border-t border-[var(--color-border)]">
              <span>TOTAL TTC</span>
              <span class="text-[var(--color-primary)]">{{ formatMoney(order.total) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PRINTABLE INVOICE MODAL -->
    <div v-if="isInvoicePrintOpen && order" @click.self="isInvoicePrintOpen = false" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm cursor-pointer">
      <div class="bg-white text-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[95vh] cursor-default animate-in zoom-in-95 duration-200">
        <div class="p-4 bg-slate-100 border-b flex justify-between items-center hide-on-print">
          <span class="font-bold text-sm text-slate-700">Facture Client B2C (Prévisualisation)</span>
          <div class="flex space-x-2">
            <button @click="printInvoice" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition shadow flex items-center space-x-1">
              <PrinterIcon class="h-4 w-4" />
              <span>Lancer l'Impression</span>
            </button>
            <button @click="isInvoicePrintOpen = false" class="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-lg transition">Fermer</button>
          </div>
        </div>

        <div id="invoice-sheet" class="flex-1 overflow-y-auto p-12 bg-white font-sans leading-relaxed text-sm">
          <div class="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-6">
            <div>
              <div class="font-bold text-2xl uppercase tracking-wider text-slate-800">TECHSUPPLIES SARL</div>
              <div class="text-xs text-slate-500 mt-1 space-y-0.5">
                <div> RCCM: RC/DLA/2023/B/123 | Douala, Akwa</div>
                <div> finance@techsupplies.com | Tél: +237 670 000 000</div>
              </div>
            </div>
            <div class="text-right">
              <div class="font-bold text-xl text-slate-800">FACTURE CLIENT</div>
              <div class="text-xs font-mono bg-slate-100 p-2 rounded border mt-2">
                <div>N° Facture: FT-{{ order.id }}</div>
                <div>Date: {{ formatDate(order.date) }}</div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-8 mb-6 text-xs">
            <div class="p-3 bg-slate-50 border rounded-lg">
              <div class="font-bold uppercase tracking-wider text-slate-500 mb-1">Vendeur / Boutique</div>
              <div class="font-bold text-slate-800">TechSupplies Akwa Branch</div>
              <div class="text-slate-600 mt-1">Douala, Bali, Rue 1.2</div>
            </div>
            <div class="p-3 bg-slate-50 border rounded-lg">
              <div class="font-bold uppercase tracking-wider text-slate-500 mb-1">Client</div>
              <div class="font-bold text-slate-800">{{ order.customerName || 'Client Comptant' }}</div>
              <div class="text-slate-600 mt-1" v-if="order.shippingAddress">{{ order.shippingAddress }}</div>
            </div>
          </div>

          <!-- Table of items -->
          <table class="w-full text-left border-collapse mb-8 text-xs">
            <thead>
              <tr class="bg-slate-100 text-slate-700 font-bold border-t border-b border-slate-300 uppercase">
                <th class="p-3">Désignation</th>
                <th class="p-3 text-center">Quantité</th>
                <th class="p-3 text-right">Prix Unitaire</th>
                <th class="p-3 text-right">Total HT</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr v-for="(item, idx) in order.items" :key="idx" class="text-slate-700">
                <td class="p-3 font-semibold">{{ item.product.name }}</td>
                <td class="p-3 text-center">{{ item.quantity }}</td>
                <td class="p-3 text-right">{{ formatMoneyRaw(item.product.price) }} FCFA</td>
                <td class="p-3 text-right font-bold">{{ formatMoneyRaw(item.quantity * item.product.price) }} FCFA</td>
              </tr>
            </tbody>
          </table>

          <div class="flex justify-between items-start text-xs border-t pt-6">
            <div class="w-1/2 p-3 border border-slate-200 rounded-lg">
              <div class="font-bold text-slate-600 mb-1">Détails Règlement</div>
              <div class="space-y-0.5 text-slate-500">
                <div v-for="pm in order.payments" :key="pm.method">
                  - {{ pm.method }} : {{ formatMoneyRaw(pm.amount) }} FCFA
                </div>
              </div>
            </div>
            
            <div class="w-1/3 space-y-1.5 text-right text-slate-700">
              <div class="flex justify-between text-slate-500">
                <span>Sous-total Brut:</span>
                <span>{{ formatMoneyRaw(order.subtotal + order.discount) }} FCFA</span>
              </div>
              <div class="flex justify-between text-red-600" v-if="order.discount > 0">
                <span>Remises:</span>
                <span>-{{ formatMoneyRaw(order.discount) }} FCFA</span>
              </div>
              <div class="flex justify-between text-slate-500">
                <span>TVA ({{ vendor_settings?.taxRate || 19.25 }}%):</span>
                <span>{{ formatMoneyRaw(order.tax) }} FCFA</span>
              </div>
              <div class="flex justify-between font-black text-sm text-slate-900 pt-2 border-t">
                <span>TOTAL TTC:</span>
                <span>{{ formatMoneyRaw(order.total) }} FCFA</span>
              </div>
            </div>
          </div>

          <div class="text-center text-[10px] text-slate-400 mt-12 pt-12 border-t border-dashed">
            {{ vendor_settings?.receiptFooter || 'Merci de votre fidélité !' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { transactions, walletFree, walletLocked, products, settings as vendor_settings } from '@/utils/vendor_db.js';
import { PrinterIcon, CheckCircleIcon, ArrowLeftIcon, ChevronRightIcon, CreditCardIcon, TruckIcon, ArchiveBoxIcon, DocumentCheckIcon } from '@heroicons/vue/24/outline';
import { useToast } from 'vue-toastification';

const route = useRoute();
const toast = useToast();
const order = ref(null);

onMounted(() => {
  const orderId = route.params.id;
  const found = transactions.value.find(t => t.id === orderId);
  if (found) {
    order.value = found;
  }
});

// Lookup product image in catalog
function getProductImage(productId) {
  const found = products.value.find(p => p.id === productId);
  return found ? found.image : 'https://placehold.co/50';
}

const timelineProgressWidth = computed(() => {
  if (!order.value) return '0%';
  if (order.value.status === 'Pending') return '0%';
  if (order.value.status === 'Shipped') return '50%';
  if (order.value.status === 'Completed') return '100%';
  return '0%';
});

function simulateClientConfirmation() {
  if (!order.value) return;

  // Change order status to Completed
  order.value.status = 'Completed';

  // Release funds from escrow en ligne if applicable
  const lockedEntry = walletLocked.value.find(l => l.refId === order.value.id);
  if (lockedEntry) {
    walletFree.value += lockedEntry.amount;
    walletLocked.value = walletLocked.value.filter(l => l.id !== lockedEntry.id);
    toast.success(`Fonds séquestrés de ${formatMoney(lockedEntry.amount)} libérés et transférés dans votre portefeuille libre !`);
  } else {
    toast.success("Livraison confirmée avec succès par le client !");
  }
}

// Printable invoice
const isInvoicePrintOpen = ref(false);

function openInvoicePrint() {
  isInvoicePrintOpen.value = true;
}

function printInvoice() {
  window.print();
}

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val || 0).replace('XAF', 'FCFA');
}

function formatMoneyRaw(val) {
  return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0 }).format(val || 0);
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('fr-FR');
}
</script>

<style scoped>
@media print {
  body * {
    visibility: hidden;
  }
  #invoice-sheet, #invoice-sheet * {
    visibility: visible;
  }
  #invoice-sheet {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 0;
  }
  .hide-on-print {
    display: none !important;
  }
}
</style>
