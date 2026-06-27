<template>
  <div class="space-y-6" v-if="order">
    <!-- Breadcrumb & Header -->
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center space-x-3">
        <router-link to="/distributor/orders" class="p-2 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition">
          <ArrowLeftIcon class="h-4 w-4" />
        </router-link>
        <div class="flex items-center space-x-2 text-sm text-[var(--color-text-secondary)] font-medium">
          <router-link to="/distributor/orders" class="hover:text-[var(--color-primary)] transition">Commandes</router-link>
          <ChevronRightIcon class="h-4 w-4 text-[var(--color-text-muted)]" />
          <span class="text-[var(--color-text-primary)] font-bold">Commande #{{ order.reference }}</span>
        </div>
      </div>
      
      <div class="flex space-x-3">
        <router-link :to="`/distributor/orders/${order.id}/prepare`" v-if="order.status === 'VALIDATED'" class="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition flex items-center shadow-sm">
          <ArchiveBoxArrowDownIcon class="h-4 w-4 mr-2" />
          Préparer Logistique
        </router-link>
        <button @click="generateAndOpenInvoice" class="px-4 py-2 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] rounded-lg text-sm font-semibold transition flex items-center shadow-sm">
          <DocumentTextIcon class="h-4 w-4 mr-2" />
          Générer/Voir Facture
        </button>
      </div>
    </div>

    <!-- Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: Details -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h2 class="text-lg font-bold text-[var(--color-text-primary)] flex items-center">
                <span>Commande #{{ order.reference }}</span>
                <span 
                  class="ml-3 px-2.5 py-1 rounded-full text-xs font-bold border capitalize"
                  :class="{
                    'bg-amber-500/10 text-amber-600 border-amber-500/20': order.status === 'PENDING',
                    'bg-blue-500/10 text-blue-600 border-blue-500/20': order.status === 'PROCESSING',
                    'bg-purple-500/10 text-purple-600 border-purple-500/20': order.status === 'SHIPPED',
                    'bg-emerald-500/10 text-emerald-600 border-emerald-500/20': order.status === 'DELIVERED',
                    'bg-red-500/10 text-red-650 border-red-500/20': order.status === 'REFUSED' || order.status === 'CANCELLED',
                  }"
                >
                  {{ order.status }}
                </span>
              </h2>
              <p class="text-sm text-[var(--color-text-secondary)] mt-1">Placée le {{ formatDate(order.date_emission) }}</p>
            </div>
            
            <div class="text-right">
              <div class="text-xs text-[var(--color-text-secondary)]">Client / Émetteur</div>
              <div class="font-bold text-[var(--color-primary)] text-lg truncate max-w-[120px] block" :title="order.emitter_id">{{ order.emitter_id }}</div>
              <div class="text-xs text-[var(--color-text-secondary)]">({{ order.emitter_type }})</div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[var(--color-border)]">
            <div>
              <div class="text-xs text-[var(--color-text-secondary)] font-semibold uppercase tracking-wider mb-1">Moyen de Paiement</div>
              <div class="text-sm text-[var(--color-text-primary)] font-bold flex items-center">
                <CreditCardIcon class="h-4 w-4 text-[var(--color-text-muted)] mr-2" />
                {{ order.payment_method || 'Séquestre En Ligne' }}
              </div>
            </div>
            <div>
              <div class="text-xs text-[var(--color-text-secondary)] font-semibold uppercase tracking-wider mb-1">Adresse de livraison</div>
              <div class="text-sm text-[var(--color-text-primary)] flex items-center">
                <MapPinIcon class="h-4 w-4 text-[var(--color-text-muted)] mr-2" />
                {{ order.shipping_address || 'Non spécifiée' }}
              </div>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-[var(--color-border)]">
            <div class="text-xs text-[var(--color-text-secondary)] font-semibold uppercase tracking-wider mb-1">Notes Client</div>
            <p class="text-sm text-[var(--color-text-primary)] italic bg-[var(--color-surface-hover)] p-3 rounded-lg">
              {{ order.notes || 'Aucune note particulière.' }}
            </p>
          </div>
        </div>

        <!-- Products -->
        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl shadow-sm overflow-hidden">
          <div class="p-4 border-b border-[var(--color-border)] bg-[var(--color-surface-hover)]">
            <h3 class="font-bold text-[var(--color-text-primary)] text-sm">Articles commandés ({{ order.products?.length || 0 }})</h3>
          </div>
          <table class="w-full text-left">
            <thead>
              <tr class="bg-[var(--color-background)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)]">
                <th class="p-4">Produit</th>
                <th class="p-4 text-center">Quantité</th>
                <th class="p-4 text-right">Prix Unitaire</th>
                <th class="p-4 text-right">Total HT</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[var(--color-border)]">
              <tr v-for="(item, idx) in order.products" :key="idx" class="text-sm hover:bg-[var(--color-surface-hover)] transition">
                <td class="p-4 font-bold text-[var(--color-text-primary)]">{{ item.name || `Produit #${item.product_id}` }}</td>
                <td class="p-4 text-center text-[var(--color-text-secondary)] font-medium">{{ item.quantity }}</td>
                <td class="p-4 text-right text-[var(--color-text-secondary)]">{{ formatMoney(item.unit_price) }}</td>
                <td class="p-4 text-right font-bold text-[var(--color-text-primary)]">{{ formatMoney(item.quantity * item.unit_price) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Notifications et historique -->
        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
          <h3 class="font-bold text-[var(--color-text-primary)] mb-4 text-sm">Notifications d'activité (français)</h3>
          <div class="space-y-3">
            <div 
              v-for="notif in associatedNotifications" 
              :key="notif.id" 
              class="p-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-xs flex justify-between items-center"
            >
              <div class="text-[var(--color-text-primary)]">
                <span class="font-bold text-[var(--color-primary)]">[{{ notif.type }}]</span> {{ notif.message }}
              </div>
              <span class="text-[10px] text-[var(--color-text-secondary)]">{{ formatDate(notif.created_at) }}</span>
            </div>
            <div v-if="associatedNotifications.length === 0" class="text-xs text-[var(--color-text-muted)] text-center py-2">
              Aucune notification d'activité pour ce bon de commande.
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Actions -->
      <div class="space-y-6">
        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
          <h3 class="font-bold text-[var(--color-text-primary)] mb-4 text-sm">Actions Administratives</h3>
          
          <div class="space-y-3" v-if="order.status === 'PENDING'">
            <button 
              @click="validatePO" 
              class="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-bold shadow transition"
            >
              VALIDER LE BON DE COMMANDE
            </button>
            <button 
              @click="refusePO" 
              class="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold shadow transition"
            >
              REFUSER LE BON DE COMMANDE
            </button>
            <button 
              @click="openModifyModal" 
              class="w-full py-2.5 border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] rounded-lg text-sm font-bold transition"
            >
              MODIFIER LE BON DE COMMANDE
            </button>
          </div>

          <div v-else class="text-sm text-[var(--color-text-secondary)]">
            Aucune action administrative disponible pour ce statut : <span class="font-bold text-[var(--color-primary)]">{{ order.status }}</span>.
          </div>
        </div>

        <!-- Info Financière -->
        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
          <h3 class="font-bold text-[var(--color-text-primary)] mb-4 text-sm">Résumé Financier</h3>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between text-[var(--color-text-secondary)]">
              <span>Sous-total HT</span>
              <span>{{ formatMoney(order.total) }}</span>
            </div>
            <div class="flex justify-between text-[var(--color-text-secondary)]">
              <span>TVA (19.25%)</span>
              <span>{{ formatMoney(order.total * 0.1925) }}</span>
            </div>
            <div class="pt-3 border-t border-[var(--color-border)] flex justify-between items-center">
              <span class="font-bold text-[var(--color-text-primary)]">Total TTC</span>
              <span class="text-xl font-black text-[var(--color-primary)]">{{ formatMoney(order.total * 1.1925) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODIFICATION MODAL -->
    <div v-if="isModifyModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4">
        <h3 class="font-bold text-md text-[var(--color-text-primary)]">Modifier le Bon de Commande</h3>
        
        <div>
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Adresse de livraison</label>
          <textarea 
            v-model="modifyData.shipping_address"
            rows="2"
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2 text-sm text-[var(--color-text-primary)] focus:outline-none"
          ></textarea>
        </div>

        <div>
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Notes</label>
          <textarea 
            v-model="modifyData.notes"
            rows="2"
            class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2 text-sm text-[var(--color-text-primary)] focus:outline-none"
          ></textarea>
        </div>

        <div class="flex justify-end space-x-2 pt-2">
          <button @click="isModifyModalOpen = false" class="px-4 py-2 border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]">Annuler</button>
          <button @click="confirmSaveModification" class="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-bold shadow hover:bg-[var(--color-primary-hover)]">Enregistrer</button>
        </div>
      </div>
    </div>

    <!-- CONFIRMATION MODALS -->
    <ConfirmationModal 
      :show="showConfirmation"
      :title="confirmTitle"
      :message="confirmMessage"
      :type="confirmType"
      :confirmLabel="confirmBtnLabel"
      @close="showConfirmation = false"
      @confirm="executeConfirmedAction"
    />
  </div>
  <div v-else class="text-center py-12 text-[var(--color-text-muted)]">
    Chargement de la commande...
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrdersStore } from '@/store/modules/orders.js';
import { useNotificationsStore } from '@/store/modules/notifications.js';
import { useInvoicesStore } from '@/store/modules/invoices.js';
import { useToast } from 'vue-toastification';
import ConfirmationModal from '@/components/common/ConfirmationModal.vue';
import { 
  ArrowLeftIcon, ChevronRightIcon, DocumentTextIcon, 
  ArchiveBoxArrowDownIcon, CreditCardIcon, MapPinIcon
} from '@heroicons/vue/24/outline';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const ordersStore = useOrdersStore();
const notificationsStore = useNotificationsStore();
const invoicesStore = useInvoicesStore();

const order = computed(() => {
  return ordersStore.purchaseOrders.find(o => o.id === route.params.id);
});

const associatedNotifications = computed(() => {
  if (!order.value) return [];
  return notificationsStore.notifications.filter(n => n.order_ref === order.value.reference);
});

// Confirmation Modal States
const showConfirmation = ref(false);
const confirmTitle = ref('');
const confirmMessage = ref('');
const confirmType = ref('warning');
const confirmBtnLabel = ref('Confirmer');
const pendingAction = ref(null);

const isModifyModalOpen = ref(false);
const modifyData = ref({
  shipping_address: '',
  notes: ''
});

const validatePO = () => {
  if (order.value) {
    confirmTitle.value = 'Valider le bon de commande';
    confirmMessage.value = 'Voulez-vous valider ce bon de commande ? Cette action confirmera la commande auprès du client et initiera la logistique.';
    confirmType.value = 'success';
    confirmBtnLabel.value = 'Valider la commande';
    pendingAction.value = () => {
      ordersStore.validatePurchaseOrder(order.value.id);
      toast.success('Le bon de commande a été validé !');
    };
    showConfirmation.value = true;
  }
};

const refusePO = () => {
  if (order.value) {
    confirmTitle.value = 'Refuser le bon de commande';
    confirmMessage.value = 'Êtes-vous sûr de vouloir refuser ce bon de commande ? Cette action est irréversible.';
    confirmType.value = 'danger';
    confirmBtnLabel.value = 'Refuser';
    pendingAction.value = () => {
      ordersStore.refusePurchaseOrder(order.value.id);
      toast.error('Le bon de commande a été refusé.');
    };
    showConfirmation.value = true;
  }
};

const openModifyModal = () => {
  if (order.value) {
    modifyData.value.shipping_address = order.value.shipping_address;
    modifyData.value.notes = order.value.notes;
    isModifyModalOpen.value = true;
  }
};

const confirmSaveModification = () => {
  isModifyModalOpen.value = false;
  confirmTitle.value = 'Modifier le bon de commande';
  confirmMessage.value = 'Voulez-vous enregistrer ces modifications et notifier le client ?';
  confirmType.value = 'warning';
  confirmBtnLabel.value = 'Enregistrer & Notifier';
  pendingAction.value = () => {
    ordersStore.modifyPurchaseOrder(order.value.id, {
      shipping_address: modifyData.value.shipping_address,
      notes: modifyData.value.notes
    });
    toast.success('Le bon de commande a été modifié et le client a été notifié.');
  };
  showConfirmation.value = true;
};

const executeConfirmedAction = () => {
  showConfirmation.value = false;
  if (pendingAction.value) {
    pendingAction.value();
    pendingAction.value = null;
  }
};

const generateAndOpenInvoice = () => {
  if (!order.value) return;
  let invoice = invoicesStore.invoices.find(i => i.purchase_order_id === order.value.id);
  if (!invoice) {
    invoice = invoicesStore.generateInvoice({
      purchase_order_id: order.value.id,
      emitter_id: order.value.receiver_id,
      emitter_type: order.value.receiver_type,
      receiver_id: order.value.emitter_id,
      receiver_type: order.value.emitter_type,
      products: order.value.products,
      subtotal: order.value.total
    });
    toast.success('Facture générée automatiquement !');
  }
  router.push(`/distributor/invoices/${invoice.id}`);
};

const formatDate = (dateVal) => {
  if (!dateVal) return 'N/A';
  return new Date(dateVal).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatMoney = (val) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('XAF', 'FCFA');
};
</script>
