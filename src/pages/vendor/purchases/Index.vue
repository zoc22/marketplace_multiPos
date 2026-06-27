<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Bons de Commande B2B (Approvisionnement)</h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Créez et suivez vos bons de commande émis vers vos fournisseurs B2B.</p>
      </div>
      <button @click="openCreateModal" class="px-4 py-2.5 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-xl text-sm font-semibold transition flex items-center space-x-2 shadow-sm">
        <PlusIcon class="h-5 w-5" />
        <span>Nouvelle Commande</span>
      </button>
    </div>

    <!-- Table Card -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
      <div class="p-4 border-b border-[var(--color-border)] flex flex-col sm:flex-row justify-between items-center gap-4 bg-[var(--color-surface-hover)]">
        <div class="relative w-full sm:w-96">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)]" />
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Rechercher par référence, fournisseur..." 
            class="w-full pl-10 pr-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)]"
          />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="bg-[var(--color-surface-hover)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)]">
              <th class="p-4">Réf PO</th>
              <th class="p-4">Fournisseur</th>
              <th class="p-4">Date de commande</th>
              <th class="p-4">Date de livraison prévue</th>
              <th class="p-4">Mode Paiement</th>
              <th class="p-4 text-right">Montant Total</th>
              <th class="p-4 text-center">Statut Logistique</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr v-for="po in paginatedPurchases" :key="po.id" class="hover:bg-[var(--color-surface-hover)]/40 transition text-sm">
              <td class="p-4 font-bold text-[var(--color-primary)] font-mono">
                <router-link :to="'/vendor/purchases/' + po.id" class="hover:underline">
                  {{ po.id }}
                </router-link>
              </td>
              <td class="p-4 font-medium text-[var(--color-text-primary)]">{{ getSupplierName(po.supplierId) }}</td>
              <td class="p-4 text-[var(--color-text-secondary)] font-mono">{{ formatDate(po.date) }}</td>
              <td class="p-4 text-[var(--color-text-secondary)] font-mono">{{ formatDate(po.expectedDate) }}</td>
              <td class="p-4">
                <span class="text-xs font-semibold text-[var(--color-text-secondary)]">
                  {{ po.paymentMethod === 'Escrow' ? 'Séquestre En Ligne' : 'À la livraison' }}
                </span>
              </td>
              <td class="p-4 text-right font-bold text-[var(--color-text-primary)] font-mono">{{ formatMoney(po.total) }}</td>
              <td class="p-4 text-center">
                <span class="px-2.5 py-1 rounded-full text-xs font-bold border inline-block" :class="{
                  'bg-emerald-500/25 text-emerald-300 border-emerald-500/40': po.status === 'Received',
                  'bg-sky-500/25 text-sky-300 border-sky-500/40': po.status === 'In Transit',
                  'bg-amber-500/25 text-amber-300 border-amber-500/40': po.status === 'Sent',
                  'bg-slate-500/25 text-slate-300 border-slate-500/40': po.status === 'Draft'
                }">
                  {{ po.status === 'Received' ? 'Reçu (Entré)' : po.status === 'In Transit' ? 'En cours de livraison' : po.status === 'Sent' ? 'Envoyé' : po.status }}
                </span>
              </td>
              <td class="p-4 text-right space-x-2">
                <router-link 
                  :to="'/vendor/purchases/' + po.id"
                  class="inline-flex items-center justify-center p-2 bg-[var(--color-surface-elevated)] hover:bg-[var(--color-primary-muted)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] rounded-xl border border-[var(--color-border)] transition" 
                  title="Facture & Bon de commande"
                >
                  <EyeIcon class="h-4.5 w-4.5" />
                </router-link>
                <router-link 
                  :to="'/vendor/purchases/track/' + po.id"
                  class="inline-flex items-center justify-center p-2 bg-[var(--color-primary-muted)] text-[var(--color-primary)] rounded-xl border border-[var(--color-primary-border)] transition animate-pulse" 
                  title="Suivre et émarger"
                >
                  <TruckIcon class="h-4.5 w-4.5" />
                </router-link>
              </td>
            </tr>
            <tr v-if="paginatedPurchases.length === 0">
              <td colspan="8" class="p-8 text-center text-[var(--color-text-muted)]">Aucun bon de commande trouvé.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-4" v-if="filteredPurchases.length > 0">
        <Pagination 
          :total-items="filteredPurchases.length" 
          :page-size="itemsPerPage" 
          :current-page="currentPage" 
          @update:currentPage="currentPage = $event" 
        />
      </div>
    </div>

    <!-- Create Purchase Order Modal -->
    <div v-if="isCreateModalOpen" @click.self="isCreateModalOpen = false" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm cursor-pointer">
      <div class="bg-[var(--color-surface)] rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden border border-[var(--color-border)] flex flex-col max-h-[90vh] cursor-default animate-in fade-in zoom-in-95 duration-200">
        <div class="p-6 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-surface-elevated)]">
          <div>
            <h3 class="text-xl font-bold text-[var(--color-text-primary)]">Créer un Approvisionnement Multi-Fournisseurs</h3>
            <p class="text-xs text-[var(--color-text-secondary)] mt-1">Cochez les fournisseurs et sélectionnez leurs articles pour générer des bons.</p>
          </div>
          <button @click="isCreateModalOpen = false" class="text-[var(--color-text-muted)] hover:text-red-500"><XMarkIcon class="h-6 w-6"/></button>
        </div>

        <form @submit.prevent="saveMultiPO" class="flex-1 overflow-y-auto p-6 space-y-6 bg-[var(--color-background)]">
          <!-- Main Form Configurations -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[var(--color-surface-elevated)] p-4 rounded-xl border border-[var(--color-border)]">
            <div>
              <label class="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Mode de Paiement</label>
              <select v-model="formConfig.paymentMethod" class="w-full p-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm font-semibold text-[var(--color-text-primary)]">
                <option value="Escrow">Séquestre En Ligne (Sécurisé)</option>
                <option value="Cash">À la livraison (Cash/Chèque)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Date de livraison attendue *</label>
              <input type="date" v-model="formConfig.expectedDate" required class="w-full p-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] font-medium" />
            </div>
          </div>

          <!-- Suppliers Checkboxes -->
          <div>
            <label class="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Fournisseurs Disponibles</label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div 
                v-for="sup in b2b_suppliers" 
                :key="sup.id" 
                @click="toggleSupplier(sup)"
                class="p-4 border rounded-xl cursor-pointer transition flex items-center justify-between"
                :class="isSupplierSelected(sup.id) ? 'bg-[var(--color-primary-muted)] border-[var(--color-primary-border)] text-[var(--color-primary)]' : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]'"
              >
                <div class="flex items-center space-x-3">
                  <input type="checkbox" :checked="isSupplierSelected(sup.id)" class="rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)] h-4 w-4" @click.stop="toggleSupplier(sup)" />
                  <div>
                    <span class="font-bold text-sm block">{{ sup.name }}</span>
                    <span class="text-[10px] uppercase font-bold text-[var(--color-text-muted)]">{{ sup.category }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Selected Suppliers Blocks -->
          <div v-if="selectedSuppliersData.length > 0" class="space-y-6">
            <h4 class="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider border-b border-[var(--color-border)] pb-1">Détails des articles par fournisseur</h4>
            
            <div v-for="sData in selectedSuppliersData" :key="sData.supplierId" class="border border-[var(--color-border)] rounded-xl bg-[var(--color-surface)] overflow-hidden">
              <div class="p-4 bg-[var(--color-surface-hover)] border-b border-[var(--color-border)] flex justify-between items-center">
                <div>
                  <span class="font-bold text-[var(--color-text-primary)]">{{ getSupplierName(sData.supplierId) }}</span>
                  <span class="ml-2 px-2 py-0.5 bg-[var(--color-background)] border rounded text-[10px] uppercase font-bold text-[var(--color-text-muted)]">{{ getSupplierCategory(sData.supplierId) }}</span>
                </div>
                <button type="button" @click="toggleSupplier({ id: sData.supplierId })" class="text-xs text-red-500 hover:underline">Retirer ce fournisseur</button>
              </div>

              <div class="p-4 space-y-4">
                <label class="block text-[11px] font-bold text-[var(--color-text-secondary)] uppercase">Sélectionnez les articles :</label>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div 
                    v-for="p in getProductsBySupplierCategory(sData.supplierId)" 
                    :key="p.id"
                    @click="toggleProductInSupplier(sData.supplierId, p)"
                    class="p-3 border rounded-lg cursor-pointer transition flex items-center justify-between"
                    :class="isProductSelectedInSupplier(sData.supplierId, p.id) ? 'bg-[var(--color-background)] border-[var(--color-primary-border)]' : 'bg-[var(--color-background)] border-[var(--color-border)] opacity-70 hover:opacity-100'"
                  >
                    <div class="flex items-center space-x-2.5">
                      <input type="checkbox" :checked="isProductSelectedInSupplier(sData.supplierId, p.id)" class="rounded text-[var(--color-primary)]" @click.stop="toggleProductInSupplier(sData.supplierId, p)" />
                      <div>
                        <span class="font-semibold text-xs block text-[var(--color-text-primary)]">{{ p.name }}</span>
                        <span class="text-[10px] text-[var(--color-text-muted)] font-mono">Stock Magasin : {{ p.stock }}</span>
                      </div>
                    </div>
                    <span class="text-xs font-bold text-[var(--color-text-secondary)]">{{ formatMoney(p.price * 0.8) }} <span class="text-[9px] font-normal text-slate-400">gros</span></span>
                  </div>
                </div>

                <!-- Quantities and Costs inputs for Checked Products -->
                <div v-if="sData.items.length > 0" class="mt-4 pt-4 border-t border-[var(--color-border)] space-y-3">
                  <h5 class="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Configuration Quantités &amp; Coûts</h5>
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div v-for="item in sData.items" :key="item.productId" class="p-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl space-y-2 relative">
                      <button type="button" @click="removeProductFromSupplier(sData.supplierId, item.productId)" class="absolute top-2 right-2 text-slate-400 hover:text-red-500"><XMarkIcon class="h-4.5 w-4.5"/></button>
                      <div class="font-bold text-xs text-[var(--color-text-primary)] truncate pr-4">{{ getProductName(item.productId) }}</div>
                      
                      <div class="grid grid-cols-2 gap-2">
                        <div>
                          <label class="block text-[9px] uppercase font-bold text-slate-400">Quantité</label>
                          <input type="number" v-model.number="item.quantity" min="1" required class="w-full p-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-xs font-bold text-center" />
                        </div>
                        <div>
                          <label class="block text-[9px] uppercase font-bold text-slate-400">Coût U (FCFA)</label>
                          <input type="number" v-model.number="item.unitCost" min="1" required class="w-full p-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-xs font-bold text-right font-mono" />
                        </div>
                      </div>
                      <div class="text-[10px] text-right font-bold text-[var(--color-primary)]">
                        S-Total: {{ formatMoney(item.quantity * item.unitCost) }}
                      </div>
                    </div>
                  </div>
                  
                  <div class="text-right font-bold text-xs text-[var(--color-text-primary)] mt-2">
                    Total Fournisseur estimé : <span class="text-sm font-black text-[var(--color-primary)]">{{ formatMoney(getSupplierTotal(sData)) }}</span>
                  </div>
                </div>
                <div v-else class="text-xs text-[var(--color-text-muted)] italic text-center py-4 bg-[var(--color-background)] rounded-lg">
                  Aucun article sélectionné pour ce fournisseur.
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-12 text-slate-400 bg-[var(--color-surface)] border rounded-2xl border-dashed">
            <InboxArrowDownIcon class="h-10 w-10 mx-auto opacity-30 mb-2" />
            <span>Sélectionnez au moins un fournisseur ci-dessus pour composer votre bon.</span>
          </div>

          <!-- Global estimation and controls -->
          <div class="pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row justify-between items-center gap-4 bg-[var(--color-surface-elevated)] p-4 rounded-2xl">
            <div>
              <span class="text-xs font-bold text-[var(--color-text-secondary)] block uppercase">Estimation Globale ({{ totalFormPOToCreate }} Bons de commande)</span>
              <span class="text-2xl font-black text-[var(--color-primary)]">{{ formatMoney(globalEstimatedTotal) }}</span>
            </div>
            <div class="flex space-x-3">
              <button type="button" @click="isCreateModalOpen = false" class="px-5 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] text-sm rounded-xl font-bold hover:bg-[var(--color-surface-hover)]">Annuler</button>
              <button type="submit" :disabled="!isFormPOValid" class="px-6 py-2.5 bg-[var(--color-primary)] text-white font-bold text-sm rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center space-x-2">
                <CheckCircleIcon class="h-5 w-5" />
                <span>Confirmer &amp; Envoyer les bons</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- PO Details & Logistics Tracking Modal -->
    <div v-if="isDetailsModalOpen && selectedPO" @click.self="isDetailsModalOpen = false" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm cursor-pointer">
      <div class="bg-[var(--color-surface)] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-[var(--color-border)] flex flex-col max-h-[90vh] cursor-default animate-in fade-in zoom-in-95 duration-200">
        <div class="p-6 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-surface-elevated)]">
          <div>
            <h3 class="text-xl font-bold text-[var(--color-text-primary)]">Suivi Bon de Commande {{ selectedPO.id }}</h3>
            <p class="text-xs text-[var(--color-text-secondary)] mt-1">Fournisseur B2B : <span class="font-bold">{{ getSupplierName(selectedPO.supplierId) }}</span></p>
          </div>
          <div class="flex items-center space-x-2">
            <button @click="openInvoicePrint" class="p-2 bg-[var(--color-primary-muted)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white rounded-lg transition border border-[var(--color-primary-border)]" title="Imprimer Facture">
              <PrinterIcon class="h-4.5 w-4.5" />
            </button>
            <button @click="isDetailsModalOpen = false" class="text-[var(--color-text-muted)] hover:text-red-500"><XMarkIcon class="h-6 w-6"/></button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-6 bg-[var(--color-background)]">
          <!-- Logistics Timeline -->
          <div class="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 rounded-2xl">
            <h4 class="font-bold text-xs uppercase text-[var(--color-text-secondary)] tracking-wider mb-4">Statut d'Expédition Logistique</h4>
            
            <div class="flex items-center justify-between relative">
              <!-- Timeline line -->
              <div class="absolute left-1/10 right-1/10 top-1/2 -translate-y-1/2 h-1 bg-[var(--color-border)] z-0">
                <div class="h-full bg-emerald-500 transition-all duration-500" :style="{ width: timelineProgressWidth }"></div>
              </div>
              
              <!-- Step 1: Sent -->
              <div class="flex flex-col items-center z-10">
                <div class="h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs border transition" :class="selectedPO.status === 'Sent' || selectedPO.status === 'In Transit' || selectedPO.status === 'Received' ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)]'">
                  1
                </div>
                <span class="text-[10px] font-bold text-[var(--color-text-primary)] mt-1">Commandée</span>
                <span class="text-[9px] text-[var(--color-text-muted)]">{{ formatDate(selectedPO.date) }}</span>
              </div>

              <!-- Step 2: In Transit -->
              <div class="flex flex-col items-center z-10">
                <div class="h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs border transition" :class="selectedPO.status === 'In Transit' || selectedPO.status === 'Received' ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)]'">
                  2
                </div>
                <span class="text-[10px] font-bold text-[var(--color-text-primary)] mt-1">En Cours</span>
                <span class="text-[9px] text-[var(--color-text-muted)]">Expédiée</span>
              </div>

              <!-- Step 3: Received -->
              <div class="flex flex-col items-center z-10">
                <div class="h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs border transition" :class="selectedPO.status === 'Received' ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)]'">
                  3
                </div>
                <span class="text-[10px] font-bold text-[var(--color-text-primary)] mt-1">Réceptionnée</span>
                <span class="text-[9px] text-[var(--color-text-muted)]" v-if="selectedPO.status === 'Received'">Terminée</span>
              </div>
            </div>

            <!-- Role simulation triggers -->
            <div class="mt-6 pt-5 border-t border-[var(--color-border)] flex flex-wrap gap-3 justify-center">
              <button 
                v-if="selectedPO.status === 'Sent'" 
                @click="simulateSupplierShip" 
                class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-lg transition shadow-sm flex items-center space-x-1"
              >
                <TruckIcon class="h-4 w-4 animate-bounce" />
                <span>Simuler Expédition (Distributeur/Fournisseur)</span>
              </button>
              <button 
                v-if="selectedPO.status === 'In Transit'" 
                @click="simulateClientReceive" 
                class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg transition shadow-sm flex items-center space-x-1"
              >
                <CheckCircleIcon class="h-4 w-4" />
                <span>Confirmer la Réception (Client - Moi)</span>
              </button>
              <span v-if="selectedPO.status === 'Received'" class="text-xs font-bold text-emerald-500 flex items-center space-x-1">
                <CheckCircleIcon class="h-4 w-4" />
                <span>Marchandise réceptionnée, stocks intégrés et paiement validé !</span>
              </span>
            </div>
          </div>

          <!-- Items list -->
          <div class="space-y-3">
            <h4 class="font-bold text-xs uppercase text-[var(--color-text-secondary)] tracking-wider">Articles Commandés</h4>
            <div v-for="(item, idx) in selectedPO.items" :key="idx" class="p-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl flex justify-between items-center text-sm">
              <div>
                <span class="font-bold text-[var(--color-text-primary)] block">{{ getProductName(item.productId) }}</span>
                <span class="text-xs text-[var(--color-text-muted)]">Code : {{ item.productId }}</span>
              </div>
              <div class="text-right">
                <span class="font-bold text-[var(--color-text-primary)] block">{{ formatMoney(item.quantity * item.unitCost) }}</span>
                <span class="text-xs text-[var(--color-text-secondary)]">{{ item.quantity }} unités x {{ formatMoney(item.unitCost) }}</span>
              </div>
            </div>
          </div>

          <!-- Financial summary and details -->
          <div class="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 rounded-xl space-y-2">
            <div class="flex justify-between text-xs text-[var(--color-text-secondary)]">
              <span>Date d'émission :</span>
              <span class="font-bold">{{ formatDate(selectedPO.date) }}</span>
            </div>
            <div class="flex justify-between text-xs text-[var(--color-text-secondary)]">
              <span>Livraison attendue :</span>
              <span class="font-bold">{{ formatDate(selectedPO.expectedDate) }}</span>
            </div>
            <div class="flex justify-between text-xs text-[var(--color-text-secondary)]">
              <span>Mode de Paiement :</span>
              <span class="font-bold">{{ selectedPO.paymentMethod === 'Escrow' ? 'Séquestre En Ligne' : 'À la livraison' }}</span>
            </div>
            <div class="pt-3 border-t border-[var(--color-border)] flex justify-between font-black text-base text-[var(--color-text-primary)]">
              <span>MONTANT TOTAL</span>
              <span class="text-[var(--color-primary)]">{{ formatMoney(selectedPO.total) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PRINTABLE INVOICE MODAL -->
    <div v-if="isInvoicePrintOpen && selectedPO" @click.self="isInvoicePrintOpen = false" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm cursor-pointer">
      <div class="bg-white text-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[95vh] cursor-default animate-in zoom-in-95 duration-200">
        <div class="p-4 bg-slate-100 border-b flex justify-between items-center hide-on-print">
          <span class="font-bold text-sm text-slate-700">Facture B2B (Prévisualisation avant impression)</span>
          <div class="flex space-x-2">
            <button @click="printInvoice" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition shadow flex items-center space-x-1">
              <PrinterIcon class="h-4 w-4" />
              <span>Lancer l'Impression</span>
            </button>
            <button @click="isInvoicePrintOpen = false" class="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-lg transition">Fermer</button>
          </div>
        </div>

        <!-- Print Content Sheet (A4 Proportion) -->
        <div id="invoice-sheet" class="flex-1 overflow-y-auto p-12 bg-white font-serif leading-relaxed text-sm">
          <div class="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-6">
            <div>
              <div class="font-bold text-2xl uppercase tracking-wider text-slate-800">TECHSUPPLIES SARL</div>
              <div class="text-xs text-slate-500 font-sans mt-1 space-y-0.5">
                <div>RCCM: RC/DLA/2023/B/123 | NUI: M072312345Z</div>
                <div>Douala, Akwa - Cameroun</div>
                <div>Email: finance@techsupplies.com | Tél: +237 670 000 000</div>
              </div>
            </div>
            <div class="text-right">
              <div class="font-bold text-xl text-slate-800">FACTURE B2B</div>
              <div class="text-xs font-mono bg-slate-100 p-2 rounded border mt-2">
                <div>N° Facture: FA-{{ selectedPO.id }}</div>
                <div>Date: {{ formatDate(selectedPO.date) }}</div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-8 mb-6 font-sans text-xs">
            <div class="p-3 bg-slate-50 border rounded-lg">
              <div class="font-bold uppercase tracking-wider text-slate-500 mb-1">Émetteur / Fournisseur</div>
              <div class="font-bold text-slate-800">{{ getSupplierName(selectedPO.supplierId) }}</div>
              <div class="text-slate-650 mt-1">Affectation B2B Cameroun</div>
              <div class="text-[10px] text-slate-400 mt-1">Catégorie : {{ getSupplierCategory(selectedPO.supplierId) }}</div>
            </div>
            <div class="p-3 bg-slate-50 border rounded-lg">
              <div class="font-bold uppercase tracking-wider text-slate-500 mb-1">Destinataire / Client</div>
              <div class="font-bold text-slate-800">TECHSUPPLIES SARL (Moi)</div>
              <div class="text-slate-650 mt-1">Réseau Vendeur local</div>
              <div class="text-[10px] text-slate-400 mt-1">N° Client: CL-VEN-09</div>
            </div>
          </div>

          <!-- Table of items -->
          <table class="w-full text-left font-sans border-collapse mb-8 text-xs">
            <thead>
              <tr class="bg-slate-100 text-slate-700 font-bold border-t border-b border-slate-300 uppercase">
                <th class="p-3">Description de l'article</th>
                <th class="p-3 text-center">Quantité</th>
                <th class="p-3 text-right">Prix Unitaire</th>
                <th class="p-3 text-right">Total HT</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr v-for="(item, idx) in selectedPO.items" :key="idx" class="text-slate-700">
                <td class="p-3 font-semibold">{{ getProductName(item.productId) }}</td>
                <td class="p-3 text-center">{{ item.quantity }}</td>
                <td class="p-3 text-right">{{ formatMoneyRaw(item.unitCost) }} FCFA</td>
                <td class="p-3 text-right font-bold">{{ formatMoneyRaw(item.quantity * item.unitCost) }} FCFA</td>
              </tr>
            </tbody>
          </table>

          <div class="flex justify-between items-start font-sans text-xs border-t pt-6">
            <div class="w-1/2 p-3 border border-slate-200 rounded-lg">
              <div class="font-bold text-slate-650 mb-1">Détails de Paiement</div>
              <div class="space-y-0.5 text-slate-500">
                <div>Méthode : {{ selectedPO.paymentMethod === 'Escrow' ? 'Séquestre Sécurisé (En Ligne)' : 'À la livraison' }}</div>
                <div>Statut Paiement : <span class="font-bold" :class="selectedPO.status === 'Received' ? 'text-emerald-600' : 'text-amber-600'">{{ selectedPO.status === 'Received' ? 'Libéré & Crédité' : 'En attente' }}</span></div>
              </div>
            </div>
            
            <div class="w-1/3 space-y-1.5 text-right text-slate-700">
              <div class="flex justify-between text-xs text-slate-500">
                <span>Total HT :</span>
                <span>{{ formatMoneyRaw(selectedPO.total) }} FCFA</span>
              </div>
              <div class="flex justify-between text-xs text-slate-500">
                <span>TVA (0.00% B2B) :</span>
                <span>0 FCFA</span>
              </div>
              <div class="flex justify-between font-black text-sm text-slate-900 pt-2 border-t">
                <span>NET À PAYER :</span>
                <span>{{ formatMoneyRaw(selectedPO.total) }} FCFA</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-8 mt-12 pt-12 border-t border-slate-200 border-dashed text-center text-[10px] font-sans text-slate-400">
            <div>
              <div class="mb-8 uppercase font-bold text-slate-500">Signature Fournisseur</div>
              <div class="italic text-slate-300">[ Cachet numérique conforme ]</div>
            </div>
            <div>
              <div class="mb-8 uppercase font-bold text-slate-500">Signature Destinataire (TECHSUPPLIES)</div>
              <div class="italic text-slate-300">[ Signé électroniquement ]</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { b2b_purchases, b2b_suppliers, products, b2b_deliveries } from '@/utils/vendor_db.js';
import { PlusIcon, MagnifyingGlassIcon, EyeIcon, XMarkIcon, TruckIcon, CheckCircleIcon, PrinterIcon, InboxArrowDownIcon } from '@heroicons/vue/24/outline';
import Pagination from '@/components/Pagination.vue';
import { useToast } from 'vue-toastification';

const toast = useToast();

const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 8;

const filteredPurchases = computed(() => {
  if (!searchQuery.value) return b2b_purchases.value;
  const q = searchQuery.value.toLowerCase();
  return b2b_purchases.value.filter(po => 
    po.id.toLowerCase().includes(q) || 
    getSupplierName(po.supplierId).toLowerCase().includes(q)
  );
});

const paginatedPurchases = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredPurchases.value.slice(start, start + itemsPerPage);
});

watch(filteredPurchases, () => {
  currentPage.value = 1;
});

function getSupplierName(supplierId) {
  const found = b2b_suppliers.value.find(s => s.id === supplierId);
  return found ? found.name : supplierId;
}

function getSupplierCategory(supplierId) {
  const found = b2b_suppliers.value.find(s => s.id === supplierId);
  return found ? found.category : 'Général';
}

function getProductName(productId) {
  const found = products.value.find(p => p.id === productId);
  return found ? found.name : productId;
}

// Products list filtered by supplier's category
function getProductsBySupplierCategory(supplierId) {
  const cat = getSupplierCategory(supplierId);
  return products.value.filter(p => p.category === cat);
}

// Multi-Supplier Creation Form State
const isCreateModalOpen = ref(false);
const formConfig = ref({
  expectedDate: '',
  paymentMethod: 'Escrow'
});
const selectedSuppliers = ref([]); // List of supplierIds
const selectedSuppliersData = ref([]); // [{ supplierId, items: [{ productId, quantity, unitCost }] }]

function openCreateModal() {
  formConfig.value.expectedDate = '';
  formConfig.value.paymentMethod = 'Escrow';
  selectedSuppliers.value = [];
  selectedSuppliersData.value = [];
  isCreateModalOpen.value = true;
}

function isSupplierSelected(supplierId) {
  return selectedSuppliers.value.includes(supplierId);
}

function toggleSupplier(sup) {
  const idx = selectedSuppliers.value.indexOf(sup.id);
  if (idx > -1) {
    selectedSuppliers.value.splice(idx, 1);
    selectedSuppliersData.value = selectedSuppliersData.value.filter(d => d.supplierId !== sup.id);
  } else {
    selectedSuppliers.value.push(sup.id);
    // Initialize supplier data block with a default product if available
    const possibleProds = getProductsBySupplierCategory(sup.id);
    const initialItems = [];
    if (possibleProds.length > 0) {
      initialItems.push({
        productId: possibleProds[0].id,
        quantity: 10,
        unitCost: Math.round(possibleProds[0].price * 0.8) // wholesale pricing simulation
      });
    }
    selectedSuppliersData.value.push({
      supplierId: sup.id,
      items: initialItems
    });
  }
}

function isProductSelectedInSupplier(supplierId, productId) {
  const block = selectedSuppliersData.value.find(d => d.supplierId === supplierId);
  if (!block) return false;
  return block.items.some(i => i.productId === productId);
}

function toggleProductInSupplier(supplierId, product) {
  const block = selectedSuppliersData.value.find(d => d.supplierId === supplierId);
  if (!block) return;
  
  const existingIdx = block.items.findIndex(i => i.productId === product.id);
  if (existingIdx > -1) {
    block.items.splice(existingIdx, 1);
  } else {
    block.items.push({
      productId: product.id,
      quantity: 10,
      unitCost: Math.round(product.price * 0.8)
    });
  }
}

function removeProductFromSupplier(supplierId, productId) {
  const block = selectedSuppliersData.value.find(d => d.supplierId === supplierId);
  if (block) {
    block.items = block.items.filter(i => i.productId !== productId);
  }
}

const getSupplierTotal = (sData) => {
  return sData.items.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);
};

const totalFormPOToCreate = computed(() => {
  return selectedSuppliersData.value.filter(d => d.items.length > 0).length;
});

const globalEstimatedTotal = computed(() => {
  return selectedSuppliersData.value.reduce((sum, d) => sum + getSupplierTotal(d), 0);
});

const isFormPOValid = computed(() => {
  return formConfig.value.expectedDate && 
         selectedSuppliersData.value.length > 0 &&
         selectedSuppliersData.value.every(d => d.items.length > 0 && d.items.every(i => i.quantity > 0 && i.unitCost > 0));
});

function saveMultiPO() {
  if (!isFormPOValid.value) {
    toast.warning("Veuillez remplir correctement la date de livraison et choisir des articles.");
    return;
  }

  // Split selectedSuppliersData into separate POs
  let createdCount = 0;
  selectedSuppliersData.value.forEach(sData => {
    if (sData.items.length === 0) return;

    const newPO = {
      id: 'PO-00' + (b2b_purchases.value.length + 1),
      supplierId: sData.supplierId,
      date: new Date().toISOString().split('T')[0],
      expectedDate: formConfig.value.expectedDate,
      paymentMethod: formConfig.value.paymentMethod,
      status: 'Sent',
      items: JSON.parse(JSON.stringify(sData.items)),
      total: getSupplierTotal(sData)
    };

    b2b_purchases.value.unshift(newPO);
    createdCount++;

    // ESCROW Simulation: If paid online (Escrow), mock lock distributor balance
    if (formConfig.value.paymentMethod === 'Escrow') {
      try {
        // Trigger simulation side-effect in distributor's locked wallet if distributor_db is available (mock integration)
        import('@/utils/distributor_db.js').then(dist => {
          dist.walletLocked.value.push({
            id: 'L-B2B-' + Date.now() + '-' + newPO.id,
            refId: newPO.id,
            amount: newPO.total,
            type: 'B2B',
            orderName: `Vente B2B #${newPO.id} (TECHSUPPLIES)`,
            daysRemaining: 5,
            totalDays: 5,
            dateLocked: new Date().toISOString()
          });
        }).catch(e => console.log('Escrow bridge to distributor locked wallet skipped.', e));
      } catch (e) {
        console.log(e);
      }
    }
  });

  toast.success(`${createdCount} bons de commande B2B créés et envoyés aux fournisseurs concernés.`);
  isCreateModalOpen.value = false;
}

// Details Modal State
const isDetailsModalOpen = ref(false);
const selectedPO = ref(null);

function openPODetails(po) {
  selectedPO.value = po;
  isDetailsModalOpen.value = true;
}

// Timeline progress percentage helper
const timelineProgressWidth = computed(() => {
  if (!selectedPO.value) return '0%';
  if (selectedPO.value.status === 'Sent') return '0%';
  if (selectedPO.value.status === 'In Transit') return '50%';
  if (selectedPO.value.status === 'Received') return '100%';
  return '0%';
});

// Timeline Simulations
function simulateSupplierShip() {
  if (selectedPO.value) {
    selectedPO.value.status = 'In Transit';
    toast.info(`Simulation : Le fournisseur a expédié votre commande ${selectedPO.value.id}. Le statut est passé en Transit.`);
  }
}

function simulateClientReceive() {
  if (!selectedPO.value) return;

  // Change PO status to Received
  selectedPO.value.status = 'Received';

  // Automatically create a Delivery Note (BL) in b2b_deliveries
  const newDelivery = {
    id: 'DEL-00' + (b2b_deliveries.value.length + 1),
    purchaseId: selectedPO.value.id,
    supplierId: selectedPO.value.supplierId,
    date: new Date().toISOString().split('T')[0],
    status: 'Completed',
    items: selectedPO.value.items.map(item => ({
      productId: item.productId,
      expectedQuantity: item.quantity,
      receivedQuantity: item.quantity
    }))
  };
  b2b_deliveries.value.unshift(newDelivery);

  // Auto-increment the vendor product stock
  selectedPO.value.items.forEach(item => {
    const prod = products.value.find(p => p.id === item.productId);
    if (prod) {
      prod.stock += item.quantity;
    }
  });

  // ESCROW Simulation: Release the funds to supplier in distributor_db (if Escrow was used)
  if (selectedPO.value.paymentMethod === 'Escrow') {
    import('@/utils/distributor_db.js').then(dist => {
      const lockedEntry = dist.walletLocked.value.find(l => l.refId === selectedPO.value.id);
      if (lockedEntry) {
        dist.walletFree.value += lockedEntry.amount;
        dist.walletLocked.value = dist.walletLocked.value.filter(l => l.id !== lockedEntry.id);
        toast.success(`Fonds de ${formatMoney(lockedEntry.amount)} débloqués et crédités au fournisseur dans son Portefeuille Libre !`);
      }
    }).catch(e => console.log('Escrow release to distributor skipped.', e));
  }

  toast.success(`Livraison validée pour ${selectedPO.value.id}. Stocks rechargés et bon de réception DEL créé.`);
}

// Printable Invoice Modal State
const isInvoicePrintOpen = ref(false);

function openInvoicePrint() {
  isInvoicePrintOpen.value = true;
}

function printInvoice() {
  window.print();
}

// Format Helpers
function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val || 0).replace('XAF', 'FCFA');
}

function formatMoneyRaw(val) {
  return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0 }).format(val || 0);
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR');
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
