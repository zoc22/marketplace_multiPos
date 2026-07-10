<template>
  <div class="space-y-6 max-w-7xl mx-auto" id="buyer-purchases-workspace">
    <!-- PANEL HEADER -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 gap-4 shadow-sm">
      <div>
        <div class="flex items-center space-x-2">
          <span class="text-xs font-mono bg-[var(--color-primary-muted)] text-[var(--color-primary)] px-2.5 py-0.5 rounded-full border border-[var(--color-primary-border)] font-bold uppercase">
            Achats &amp; Réapprovisionnement
          </span>
          <span class="text-xs font-mono bg-emerald-500/10 text-emerald-500 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-bold uppercase">
            Mon Solde : {{ formatMoney(walletFree) }}
          </span>
        </div>
        <h1 class="text-lg font-bold text-[var(--color-text-primary)] mt-1">Espace Achats &amp; Commandes</h1>
        <p class="text-xs text-[var(--color-text-secondary)] mt-0.5">Émettez des bons de commande multi-fournisseurs, suivez le transit logistique par fournisseur et gérez les livraisons.</p>
      </div>
      <div>
        <button 
          @click="openNewPOModal"
          class="px-5 py-2.5 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition shadow-lg flex items-center space-x-2 cursor-pointer"
          id="btn-create-po"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Créer une Commande</span>
        </button>
      </div>
    </div>

    <!-- FILTERS TOOLBAR -->
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 rounded-xl flex flex-wrap gap-3 items-center justify-between shadow-sm">
      <div class="flex flex-wrap gap-2 items-center flex-1">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Rechercher par référence..." 
          class="bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] w-full sm:w-60 font-mono"
        />
        <select 
          v-model="statusFilter"
          class="bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] font-mono"
        >
          <option value="all">Tous les statuts</option>
          <option value="Draft">Brouillon</option>
          <option value="Submitted">En attente validation</option>
          <option value="Approved">Approuvé</option>
          <option value="Preparing">En préparation</option>
          <option value="Shipped">En transit</option>
          <option value="Delivered">Livré / Émargé</option>
        </select>
      </div>
      <div class="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase">
        {{ filteredOrders.length }} commande(s) trouvée(s)
      </div>
    </div>

    <!-- ORDERS DATA TABLE -->
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm">
      <div class="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
        <h3 class="text-sm font-mono uppercase font-bold text-[var(--color-text-primary)]">Suivi de mes Achats</h3>
        <span class="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase">Paiements sécurisés sous séquestre administrative</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse" id="orders-table">
          <thead>
            <tr class="bg-[var(--color-surface-elevated)] border-b border-[var(--color-border)] text-xs font-mono text-[var(--color-text-secondary)] uppercase">
              <th class="p-4 w-10"></th>
              <th class="p-4">Référence</th>
              <th class="p-4">Date de Création</th>
              <th class="p-4 text-right">Valeur TTC</th>
              <th class="p-4 text-center">Statut Global</th>
              <th class="p-4 text-center">Statut Paiement</th>
              <th class="p-4 text-right">Fournisseurs</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="order in paginatedOrders" :key="order.id">
              <!-- Parent Row -->
              <tr 
                class="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition text-sm font-medium cursor-pointer"
                :class="expandedOrders.includes(order.id) ? 'bg-[var(--color-surface-hover)]' : ''"
                @click="toggleOrderExpand(order.id)"
                :id="'row-' + order.id"
              >
                <td class="p-4 text-center">
                  <span class="text-xs transition-transform inline-block" :class="expandedOrders.includes(order.id) ? 'rotate-90' : ''">▶</span>
                </td>
                <td class="p-4 font-mono font-bold text-[var(--color-text-primary)]">
                  <span class="hover:text-[var(--color-primary)]">{{ order.reference }}</span>
                </td>
                <td class="p-4 text-[var(--color-text-secondary)] font-mono">{{ formatDate(order.created_at) }}</td>
                <td class="p-4 text-right font-mono font-bold text-[var(--color-text-primary)]">
                  {{ formatMoney(order.total) }}
                </td>
                <td class="p-4 text-center">
                  <span class="px-3 py-1 rounded-full text-xs font-mono tracking-wide uppercase font-bold" :class="getStatusClasses(order.status)">
                    {{ translateStatus(order.status) }}
                  </span>
                </td>
                <td class="p-4 text-center">
                  <span class="px-3 py-1 rounded-full text-xs font-mono border uppercase font-bold" :class="getPaymentStatusClasses(order.paymentStatus || 'Escrow_Held')">
                    {{ translatePaymentStatus(order.paymentStatus || 'Escrow_Held') }}
                  </span>
                </td>
                <td class="p-4 text-right">
                  <span class="text-xs font-mono font-bold px-2 py-0.5 bg-[var(--color-surface-elevated)] rounded border border-[var(--color-border)]">
                    {{ getSupplierCount(order) }} Fns
                  </span>
                </td>
              </tr>

              <!-- Sub-Table Row containing Supplier Lines (Visible when Expanded) -->
              <tr v-if="expandedOrders.includes(order.id)" class="bg-[var(--color-surface-elevated)] border-b border-[var(--color-border)]">
                <td colspan="7" class="p-4">
                  <div class="pl-8 py-2 space-y-3">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-mono font-black text-[var(--color-primary)] uppercase tracking-wider">Lignes de Commandes par Fournisseur</span>
                      <span class="text-[10px] text-[var(--color-text-secondary)] uppercase">Veuillez sélectionner un fournisseur pour voir les détails ou émarger</span>
                    </div>

                    <div class="grid grid-cols-1 gap-2.5">
                      <div 
                        v-for="sup in getSuppliersInOrder(order)" 
                        :key="sup.id"
                        class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm"
                      >
                        <div>
                          <h4 class="text-xs font-bold text-[var(--color-text-primary)] font-mono">{{ sup.name }}</h4>
                          <!-- BL reference associated with this BC & Supplier -->
                          <p class="text-[10px] text-[var(--color-primary)] font-mono uppercase mt-0.5 font-black">
                            Bon de livraison : BL-{{ order.reference }}-{{ sup.id.toUpperCase() }}
                          </p>
                          <p class="text-[10px] text-[var(--color-text-secondary)] mt-0.5 font-mono">
                            {{ getSupplierItemsSummary(order, sup.id) }}
                          </p>
                        </div>

                        <div class="flex items-center space-x-3 self-end sm:self-auto">
                          <!-- Status badge specific to sub-supplier items -->
                          <span class="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-bold uppercase" :class="getStatusClasses(getSupplierStatus(order, sup.id))">
                            {{ translateStatus(getSupplierStatus(order, sup.id)) }}
                          </span>

                          <div class="flex space-x-1.5">
                            <!-- Edit Draft link when supplier line status is Draft -->
                            <button
                              v-if="getSupplierStatus(order, sup.id) === 'Draft'"
                              @click="openEditDraftModal(order, sup.id)"
                              class="inline-flex items-center justify-center p-2 bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white rounded-lg border border-amber-500/20 transition cursor-pointer"
                              title="Modifier les produits de ce fournisseur"
                            >
                              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>

                            <button
                              v-if="getSupplierStatus(order, sup.id) === 'Draft'"
                              @click.stop="sendDraftSupplier(order, sup.id)"
                              class="inline-flex items-center justify-center p-2 bg-slate-900/10 text-slate-800 hover:bg-slate-900 hover:text-white rounded-lg border border-slate-900/20 transition cursor-pointer"
                              title="Envoyer le bon de commande au fournisseur"
                            >
                              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4 12h16m-8-8l8 8-8 8" />
                              </svg>
                            </button>

                            <!-- Detail link with supplier query param -->
                            <router-link 
                              :to="`/buyer/orders/${order.id}?supplier=${sup.id}`"
                              class="inline-flex items-center justify-center p-2 bg-[var(--color-surface-elevated)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] rounded-lg border border-[var(--color-border)] transition"
                              title="Afficher les détails pour ce fournisseur"
                            >
                              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </router-link>

                            <!-- Track & Sign with supplier query param -->
                            <router-link
                              v-if="['Shipped', 'Preparing', 'Packed'].includes(getSupplierStatus(order, sup.id))"
                              :to="`/buyer/track/${order.id}?supplier=${sup.id}`"
                              class="inline-flex items-center justify-center p-2 bg-[var(--color-primary-muted)] text-[var(--color-primary)] rounded-lg border border-[var(--color-primary-border)] transition font-bold"
                              title="Suivre et émarger la livraison de ce fournisseur"
                            >
                              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.75A1.125 1.125 0 012.625 17.625V12m18 5.625c0 .621-.504 1.125-1.125 1.125H18m-9-6.375V9m-3 3h12m-.75 3H6.75m12 0h2.25A1.125 1.125 0 0022.125 14.25V12m0 0l-3.375-4.5M21 12H18m0-3V6.75A1.125 1.125 0 0016.875 5.625H12m-3 0H5.625A1.125 1.125 0 004.5 6.75V9" />
                              </svg>
                            </router-link>

                            <!-- View Proof of Emargement with supplier query param -->
                            <router-link
                              v-else-if="getSupplierStatus(order, sup.id) === 'Delivered' || getSupplierStatus(order, sup.id) === 'Completed'"
                              :to="`/buyer/track/${order.id}?supplier=${sup.id}`"
                              class="inline-flex items-center justify-center p-2 bg-emerald-500/10 text-emerald-600 rounded-lg border border-emerald-500/30 transition cursor-pointer font-bold"
                              title="Voir la preuve d'émargement"
                            >
                              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                              </svg>
                            </router-link>

                            <!-- Lock tracking symbol -->
                            <span 
                              v-else 
                              class="inline-flex items-center justify-center p-2 bg-slate-500/10 text-slate-400 rounded-lg border border-slate-500/20 cursor-not-allowed text-xs"
                              title="En attente de validation fournisseur (BL requis)"
                            >
                              🔒
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-if="filteredOrders.length === 0">
              <td colspan="7" class="p-8 text-center text-xs font-mono text-[var(--color-text-secondary)] uppercase">
                Aucun bon de commande trouvé.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PAGINATION CONTROLS -->
      <div v-if="totalPages > 1" class="p-4 border-t border-[var(--color-border)] flex items-center justify-between bg-[var(--color-surface-elevated)]">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1"
          class="px-3 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-xs font-mono uppercase"
        >
          Précédent
        </button>
        <span class="text-xs font-mono text-[var(--color-text-secondary)]">
          Page {{ currentPage }} sur {{ totalPages }}
        </span>
        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
          class="px-3 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-xs font-mono uppercase"
        >
          Suivant
        </button>
      </div>
    </div>

    <!-- NEW PURCHASE ORDER MODAL/DRAWER (STYLE MULTI-FOURNISSEUR) -->
    <div 
      v-if="showNewPOModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      id="new-po-modal"
      @click.self="closeNewPOModal"
    >
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        <!-- Modal Header -->
        <div class="p-6 border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)] flex items-center justify-between shrink-0">
          <div>
            <h2 class="text-md font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
              <svg class="w-5 h-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              <span>Enregistrement d'un Bon de Commande</span>
            </h2>
            <p class="text-[10px] text-[var(--color-text-secondary)] mt-0.5">Entrez les informations et sélectionnez les produits par fournisseur.</p>
          </div>
          <button @click="closeNewPOModal" class="p-1 px-2.5 bg-[var(--color-surface-elevated)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)] rounded text-xs font-mono transition cursor-pointer">
            [ Fermer ]
          </button>
        </div>

        <!-- Modal Body -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <!-- Global configuration -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-[var(--color-border)]">
            <label class="block">
              <span class="block text-[10px] uppercase font-mono tracking-wider text-[var(--color-primary)] font-bold mb-1">Mode de Transport Logistique</span>
              <select 
                v-model="newPO.deliveryMode"
                class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-3 py-2 text-xs font-mono text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
              >
                <option value="Rail Cargo (Cameroun Rail Fret)">Fret Ferroviaire Cameroun</option>
                <option value="Route Heavy Truck (Camion 10t)">Transport Routier Poids Lourd</option>
                <option value="Express Isothermal Van">Fourgon Isotherme Express</option>
              </select>
            </label>
            <div class="p-3 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl text-[11px] text-[var(--color-text-secondary)]">
              Le paiement est placé sous séquestre administratif. Les fonds ne seront débloqués qu'après validation de la livraison conforme.
            </div>
          </div>

          <!-- Grouped Suppliers Blocks (Vendor Style) -->
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <h3 class="text-xs uppercase font-mono tracking-wider text-[var(--color-text-primary)] font-black">Lignes de commande par fournisseur</h3>
              <button 
                type="button" 
                @click="addSupplierBlock" 
                class="text-xs bg-[var(--color-primary-muted)] text-[var(--color-primary)] border border-[var(--color-primary-border)] hover:bg-[var(--color-primary)] hover:text-white px-3 py-1.5 rounded-lg transition font-mono font-bold uppercase cursor-pointer"
              >
                + Ajouter Fournisseur
              </button>
            </div>

            <div 
              v-for="(sBlock, sIdx) in selectedSuppliersData" 
              :key="sIdx" 
              class="border border-[var(--color-border)] rounded-xl bg-[var(--color-surface-elevated)] overflow-hidden shadow-sm space-y-3"
            >
              <!-- Block Header -->
              <div class="p-3 bg-[var(--color-surface-hover)] border-b border-[var(--color-border)] flex justify-between items-center">
                <div class="flex items-center space-x-2 flex-1 max-w-sm">
                  <span class="text-[9px] font-black font-mono text-[var(--color-text-secondary)] uppercase">FOURNISSEUR #{{ sIdx + 1 }}</span>
                  <select 
                    v-model="sBlock.supplierId" 
                    @change="onSupplierChange(sIdx)"
                    class="flex-1 p-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-xs font-bold text-[var(--color-text-primary)]"
                  >
                    <option value="" disabled>-- Sélectionner --</option>
                    <option v-for="sup in b2b_suppliers" :key="sup.id" :value="sup.id">
                      {{ sup.name }}
                    </option>
                  </select>
                </div>
                <button 
                  type="button" 
                  @click="removeSupplierBlock(sIdx)" 
                  class="text-xs text-red-500 hover:underline cursor-pointer"
                >
                  Supprimer ce bloc
                </button>
              </div>

              <!-- Product Lines for this Block -->
              <div class="p-3 space-y-2.5" v-if="sBlock.supplierId">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="bg-[var(--color-surface)] text-[9px] font-bold text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)]">
                      <th class="p-2 w-1/2">Produit</th>
                      <th class="p-2 text-center w-20">Quantité</th>
                      <th class="p-2 text-right w-28">P.U (FCFA)</th>
                      <th class="p-2 text-right w-28">Total HT</th>
                      <th class="p-2 text-center w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, pIdx) in sBlock.items" :key="pIdx" class="border-b border-[var(--color-border)]/50">
                      <td class="p-2">
                        <select 
                          v-model="item.productId"
                          @change="updateProductPrice(sIdx, pIdx)"
                          class="w-full p-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-xs text-[var(--color-text-primary)] font-medium"
                        >
                          <option value="" disabled>-- Choisir le produit --</option>
                          <option v-for="p in getProductsBySupplier(sBlock.supplierId)" :key="p.id" :value="p.id">
                            {{ p.name }} (Stock: {{ p.stock }})
                          </option>
                        </select>
                      </td>
                      <td class="p-2 text-center">
                        <input 
                          type="number" 
                          v-model.number="item.quantity"
                          min="1"
                          class="w-full p-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-xs font-bold text-center text-[var(--color-text-primary)]"
                        />
                      </td>
                      <td class="p-2 text-right font-mono text-[var(--color-text-primary)]">
                        {{ formatMoney(item.unitPrice) }}
                      </td>
                      <td class="p-2 text-right font-mono font-bold text-[var(--color-text-primary)]">
                        {{ formatMoney((item.quantity || 0) * (item.unitPrice || 0)) }}
                      </td>
                      <td class="p-2 text-center">
                        <button 
                          type="button" 
                          @click="removeProductRow(sIdx, pIdx)" 
                          class="text-red-500 hover:text-red-600 font-bold text-base cursor-pointer"
                        >
                          &times;
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <button 
                  type="button" 
                  @click="addProductRow(sIdx)"
                  class="text-[10px] font-mono text-[var(--color-primary)] font-bold hover:underline cursor-pointer"
                >
                  + Ajouter un produit
                </button>
              </div>
              <div v-else class="p-6 text-center text-xs text-[var(--color-text-secondary)] italic">
                Veuillez sélectionner un fournisseur ci-dessus pour charger ses produits.
              </div>
            </div>
          </div>

          <!-- Totals summary -->
          <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl p-4 space-y-2">
            <h3 class="text-xs uppercase font-mono tracking-wider text-[var(--color-text-primary)] font-bold">Récapitulatif financier</h3>
            <div class="pt-2 border-t border-[var(--color-border)] divide-y divide-[var(--color-border)]/40 text-xs text-[var(--color-text-secondary)] font-mono">
              <div class="py-1 flex justify-between">
                <span>SOUS-TOTAL HT</span>
                <span class="text-[var(--color-text-primary)] font-bold">{{ formatMoney(totalSubtotal) }}</span>
              </div>
              <div class="py-1 flex justify-between">
                <span>TVA (19,25 %)</span>
                <span class="text-[var(--color-text-primary)] font-bold">{{ formatMoney(totalVAT) }}</span>
              </div>
              <div class="py-1 flex justify-between">
                <span>FRAIS DE LIVRAISON</span>
                <span class="text-[var(--color-text-primary)] font-bold">{{ formatMoney(fixedShipping) }}</span>
              </div>
              <div class="py-2 flex justify-between text-[var(--color-text-primary)] font-sans font-bold text-sm">
                <span class="text-[var(--color-primary)] uppercase font-mono text-xs">Montant total TTC séquestré</span>
                <span class="text-[var(--color-text-primary)] font-mono">{{ formatMoney(totalFinalCost) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="p-6 border-t border-[var(--color-border)] bg-[var(--color-surface-elevated)] shrink-0 flex items-center justify-between">
          <span class="text-xs font-mono text-[var(--color-text-secondary)]">Votre solde disponible : <strong class="text-emerald-500">{{ formatMoney(walletFree) }}</strong></span>
          <div class="space-x-3">
            <button @click="closeNewPOModal" class="px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-mono rounded-xl transition cursor-pointer">Annuler</button>
            <button 
              @click="saveAsDraft"
              :disabled="totalFinalCost === 0"
              class="px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white font-mono rounded-xl text-xs font-bold uppercase transition cursor-pointer"
            >
              Brouillon
            </button>
            <button 
              @click="submitPurchaseOrder"
              :disabled="totalFinalCost === 0 || totalFinalCost > walletFree"
              class="px-5 py-2 bg-[var(--color-primary)] disabled:opacity-40 disabled:cursor-not-allowed text-white font-mono font-bold uppercase rounded-xl text-xs tracking-wider transition shadow cursor-pointer"
            >
              Payer &amp; Soumettre au Séquestre
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- EDIT DRAFT ORDER MODAL -->
    <div 
      v-if="showEditDraftModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      id="edit-draft-modal"
      @click.self="closeEditDraftModal"
    >
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl w-full max-w-lg flex flex-col overflow-hidden shadow-2xl">
        <!-- Header -->
        <div class="p-5 border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)] flex items-center justify-between shrink-0">
          <h2 class="text-xs font-mono font-black text-[var(--color-primary)] uppercase tracking-wider">
            Modifier les produits du Brouillon
          </h2>
          <button @click="closeEditDraftModal" class="text-xs text-[var(--color-text-secondary)] font-mono">[ Fermer ]</button>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto space-y-4 max-h-[60vh]">
          <div class="text-xs text-[var(--color-text-secondary)] font-mono">
            Modification des produits livrés par : <strong class="text-[var(--color-text-primary)]">{{ b2b_suppliers.find(s => s.id === editingSupplierId)?.name }}</strong>
          </div>

          <!-- Add Product selector -->
          <div class="p-3 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl space-y-2">
            <span class="block text-[10px] uppercase font-mono text-[var(--color-text-secondary)]">Ajouter un produit du fournisseur</span>
            <div class="flex gap-2">
              <select 
                v-model="selectedAddProductId"
                class="flex-1 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-2 py-1 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
              >
                <option value="">-- Choisir un produit --</option>
                <option v-for="p in supplierCatalogProducts" :key="p.id" :value="p.id">
                  {{ p.name }} ({{ formatMoney(p.price) }})
                </option>
              </select>
              <button @click="addProductToDraft" class="px-3 py-1 bg-[var(--color-primary)] text-white font-mono text-xs font-bold rounded-lg uppercase cursor-pointer">
                Ajouter
              </button>
            </div>
          </div>

          <!-- Products Table -->
          <div class="space-y-3">
            <div v-for="(item, idx) in editingItems" :key="idx" class="flex items-center justify-between p-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl gap-3">
              <div class="flex-1 min-w-0">
                <div class="text-xs font-bold text-[var(--color-text-primary)] truncate">{{ item.productName }}</div>
                <div class="text-[10px] text-[var(--color-text-muted)] font-mono mt-0.5">{{ formatMoney(item.unitPrice) }} / unité</div>
              </div>
              <div class="flex items-center gap-2">
                <input 
                  type="number" 
                  v-model.number="item.quantity" 
                  min="1"
                  class="w-16 bg-[var(--color-surface)] border border-[var(--color-border)] rounded px-1.5 py-1 text-xs text-center font-mono text-[var(--color-text-primary)]"
                />
                <button @click="removeProductFromDraft(idx)" class="p-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition cursor-pointer" title="Retirer le produit">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            <div v-if="editingItems.length === 0" class="text-center py-6 text-xs text-[var(--color-text-muted)] font-mono italic">
              Aucun produit sélectionné pour ce fournisseur.
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-5 border-t border-[var(--color-border)] bg-[var(--color-surface-elevated)] flex justify-end gap-2">
          <button @click="closeEditDraftModal" class="px-4 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-mono rounded-lg transition cursor-pointer">Annuler</button>
          <button @click="saveDraftEdits" class="px-4 py-1.5 bg-[var(--color-primary)] text-white font-mono text-xs font-bold rounded-lg uppercase transition cursor-pointer">Sauvegarder</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { products as catalogProducts, walletFree, walletLocked, b2b_suppliers } from '@/utils/supplier_db.js';
import { useToast } from 'vue-toastification';
import { useOrdersStore } from '@/store/modules/orders.js';

const toast = useToast();
const ordersStore = useOrdersStore();
const dbOrders = ref(ordersStore.purchaseOrders);
const showNewPOModal = ref(false);

// Filters and Pagination
const searchQuery = ref('');
const statusFilter = ref('all');
const currentPage = ref(1);
const itemsPerPage = 5;

// Expanded list of orders (Parent table)
const expandedOrders = ref([]);

// Multi-supplier creation blocks state
const selectedSuppliersData = ref([
  { supplierId: '', items: [{ productId: '', quantity: 10, unitPrice: 0 }] }
]);

const newPO = ref({
  deliveryMode: 'Rail Cargo (Cameroun Rail Fret)',
});

function openNewPOModal() {
  selectedSuppliersData.value = [
    { supplierId: '', items: [{ productId: '', quantity: 10, unitPrice: 0 }] }
  ];
  newPO.value = {
    deliveryMode: 'Rail Cargo (Cameroun Rail Fret)',
  };
  showNewPOModal.value = true;
}

function closeNewPOModal() {
  showNewPOModal.value = false;
}

// Supplier block functions
function addSupplierBlock() {
  selectedSuppliersData.value.push({ supplierId: '', items: [{ productId: '', quantity: 1, unitPrice: 0 }] });
}

function removeSupplierBlock(sIdx) {
  selectedSuppliersData.value.splice(sIdx, 1);
}

function addProductRow(sIdx) {
  selectedSuppliersData.value[sIdx].items.push({ productId: '', quantity: 1, unitPrice: 0 });
}

function removeProductRow(sIdx, pIdx) {
  selectedSuppliersData.value[sIdx].items.splice(pIdx, 1);
}

function onSupplierChange(sIdx) {
  selectedSuppliersData.value[sIdx].items = [{ productId: '', quantity: 1, unitPrice: 0 }];
}

function updateProductPrice(sIdx, pIdx) {
  const item = selectedSuppliersData.value[sIdx].items[pIdx];
  const prod = catalogProducts.value.find(p => p.id === item.productId);
  if (prod) {
    item.unitPrice = prod.price;
  }
}

function getProductsBySupplier(supplierId) {
  return catalogProducts.value.filter(p => p.supplierId === supplierId);
}

// Computed totals
const totalSubtotal = computed(() => {
  let sum = 0;
  selectedSuppliersData.value.forEach(block => {
    block.items.forEach(it => {
      sum += (it.quantity || 0) * (it.unitPrice || 0);
    });
  });
  return sum;
});

const totalVAT = computed(() => {
  return Math.floor(totalSubtotal.value * 0.1925);
});

const fixedShipping = computed(() => {
  const validSuppliers = selectedSuppliersData.value.filter(s => s.supplierId).length;
  return validSuppliers * 5000;
});

const totalFinalCost = computed(() => {
  return totalSubtotal.value + totalVAT.value + fixedShipping.value;
});

// Toggle expanding parent row
function toggleOrderExpand(orderId) {
  const idx = expandedOrders.value.indexOf(orderId);
  if (idx > -1) {
    expandedOrders.value.splice(idx, 1);
  } else {
    expandedOrders.value.push(orderId);
  }
}

function getProductById(id) {
  return catalogProducts.value.find(p => p.id === id || p.product_id === id);
}

function getItemName(item) {
  return item.productName || item.product_name || getProductById(item.productId || item.product_id)?.name || 'Produit';
}

function getItemQuantity(item) {
  return item.quantity || item.qty || 0;
}

function getItemUnitPrice(item) {
  return item.unitPrice || item.unit_price || 0;
}

function getItemTotal(item) {
  return item.totalPrice || item.total || getItemQuantity(item) * getItemUnitPrice(item);
}

function normalizeOrderItem(item) {
  return {
    productId: item.productId || item.product_id,
    productName: getItemName(item),
    sku: item.sku || item.sku || 'SKU-01',
    quantity: getItemQuantity(item),
    unitPrice: getItemUnitPrice(item),
    totalPrice: getItemTotal(item),
    supplierId: item.supplierId,
    status: item.status || 'Draft'
  };
}

function buildOrderItems(items) {
  return items.map(i => ({
    productId: i.productId,
    productName: i.productName,
    sku: i.sku,
    quantity: i.quantity,
    unitPrice: i.unitPrice,
    totalPrice: i.totalPrice,
    supplierId: i.supplierId,
    status: i.status
  }));
}

function buildOrderProducts(items) {
  return items.map(i => ({
    product_id: i.productId,
    productName: i.productName,
    sku: i.sku,
    quantity: i.quantity,
    unit_price: i.unitPrice,
    total: i.totalPrice,
    supplierId: i.supplierId,
    status: i.status
  }));
}

// Robust helper to resolve supplier ID for old or raw mock items
function getOrderItems(order) {
  return (order.items || order.products || []).map(normalizeOrderItem);
}

function getItemSupplierId(item, order) {
  if (item.supplierId) return item.supplierId;
  const prod = catalogProducts.value.find(p => p.id === item.productId || p.name === item.productName || p.name === item.product_id);
  if (prod && prod.supplierId) return prod.supplierId;
  if (order?.supplierName === "SOPRO-CAM S.A.") return "sup_002";
  if (order?.supplierName === "Nylon Packaging Douala") return "sup_003";
  return "usr_vendor_1";
}

// Helper functions for suppliers grouping in sub-table
function getSupplierCount(order) {
  const items = getOrderItems(order);
  return new Set(items.map(i => getItemSupplierId(i, order))).size;
}

function getSuppliersInOrder(order) {
  const items = getOrderItems(order);
  const sIds = [...new Set(items.map(i => getItemSupplierId(i, order)))];
  return sIds.map(sid => {
    const found = b2b_suppliers.value.find(s => s.id === sid);
    return { id: sid, name: found ? found.name : 'Fournisseur Spécifique' };
  });
}

function getSupplierItemsSummary(order, supplierId) {
  const sItems = getOrderItems(order).filter(i => getItemSupplierId(i, order) === supplierId);
  if (sItems.length === 0) return 'Aucun produit';
  return sItems.map(i => `${getItemName(i)} (x${getItemQuantity(i)})`).join(', ');
}

function getSupplierStatus(order, supplierId) {
  const items = getOrderItems(order).filter(i => getItemSupplierId(i, order) === supplierId);
  if (!items.length) {
    return order.status || 'Draft';
  }

  const statuses = items.map(i => i.status || order.status || 'Draft').filter(Boolean);
  if (order.status === 'Draft' && statuses.every(s => ['Draft', 'Pending', undefined].includes(s))) return 'Draft';
  if (statuses.every(s => s === 'Delivered' || s === 'Completed')) return 'Delivered';
  if (statuses.some(s => s === 'Shipped')) return 'Shipped';
  if (statuses.some(s => s === 'Packed')) return 'Packed';
  if (statuses.some(s => s === 'Preparing')) return 'Preparing';
  if (statuses.some(s => s === 'Approved')) return 'Approved';
  if (statuses.some(s => s === 'Submitted' || s === 'Pending')) return 'Submitted';
  if (statuses.some(s => s === 'Draft')) return 'Draft';
  return order.status || statuses[0] || 'Draft';
}

function getSupplierDraftItems(order, supplierId) {
  return getOrderItems(order).filter(item => getItemSupplierId(item, order) === supplierId && (item.status === 'Draft' || item.status === undefined || order.status === 'Draft'));
}

function getSupplierDraftTotal(order, supplierId) {
  const items = getSupplierDraftItems(order, supplierId);
  const subtotal = items.reduce((acc, it) => acc + (getItemQuantity(it) * getItemUnitPrice(it)), 0);
  const tax = Math.floor(subtotal * 0.1925);
  return {
    subtotal,
    tax,
    shipping: 5000,
    total: subtotal + tax + 5000
  };
}

function writeOrderUpdate(order, canonicalItems) {
  order.items = buildOrderItems(canonicalItems);
  order.products = buildOrderProducts(canonicalItems);
}

function sendDraftSupplier(order, supplierId) {
  if (!order) return;
  const items = getOrderItems(order);
  const draftItems = items.filter(item => getItemSupplierId(item, order) === supplierId && (item.status === 'Draft' || item.status === undefined || order.status === 'Draft'));
  if (!draftItems.length) {
    toast.error('Aucune ligne de brouillon disponible pour ce fournisseur.');
    return;
  }

  const draftTotals = getSupplierDraftTotal(order, supplierId);
  if (draftTotals.total > walletFree.value) {
    toast.error("Solde insuffisant pour envoyer ce brouillon.");
    return;
  }

  walletFree.value -= draftTotals.total;
  walletLocked.value.push({
    id: `escrow_${Date.now()}`,
    refId: order.id,
    supplierId,
    amount: draftTotals.total,
    type: 'B22C',
    orderName: `Séquestre Fournisseur ${supplierId} - ${order.reference}`,
    dateLocked: new Date().toISOString()
  });

  const canonicalItems = items.map(item => {
    const normalized = normalizeOrderItem(item);
    if (getItemSupplierId(item, order) === supplierId) {
      normalized.status = 'Submitted';
    }
    return normalized;
  });

  writeOrderUpdate(order, canonicalItems);

  const storeOrder = ordersStore.purchaseOrders.find(o => o.id === order.id);
  if (storeOrder) {
    writeOrderUpdate(storeOrder, canonicalItems);
    storeOrder.paymentStatus = 'Escrow_Held';
    storeOrder.history = storeOrder.history || [];
    storeOrder.history.push({
      status: 'Submitted',
      timestamp: new Date().toISOString(),
      label: `Brouillon envoyé vers ${supplierId}`,
      description: `Lignes de commande pour ${supplierId} ont été soumises au séquestre.`
    });

    const itemStatuses = getOrderItems(storeOrder).map(i => i.status || storeOrder.status || 'Draft');
    if (!itemStatuses.some(s => s === 'Draft')) {
      storeOrder.status = 'Submitted';
    }
  }

  const itemStatuses = getOrderItems(order).map(i => i.status || order.status || 'Draft');
  if (!itemStatuses.some(s => s === 'Draft')) {
    order.status = 'Submitted';
  }

  const localOrder = dbOrders.value.find(o => o.id === order.id);
  if (localOrder) {
    localOrder.paymentStatus = 'Escrow_Held';
  }

  toast.success(`Le brouillon ${order.reference} pour le fournisseur a été soumis.`);
}

// Filtered and Paginated Orders
const filteredOrders = computed(() => {
  let list = dbOrders.value || [];
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(o => {
      const supplierMatch = getSuppliersInOrder(o).some(sup => sup.name.toLowerCase().includes(q));
      const productMatch = getOrderItems(o).some(item => {
        const name = (item.productName || item.product_name || '').toString().toLowerCase();
        return name.includes(q);
      });
      const refMatch = o.reference?.toLowerCase().includes(q);
      const dateMatch = o.created_at ? new Date(o.created_at).toLocaleDateString('fr-FR').toLowerCase().includes(q) : false;
      return supplierMatch || productMatch || refMatch || dateMatch;
    });
  }
  if (statusFilter.value !== 'all') {
    list = list.filter(o => o.status === statusFilter.value);
  }
  return list;
});

const totalPages = computed(() => {
  return Math.ceil(filteredOrders.value.length / itemsPerPage);
});

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredOrders.value.slice(start, start + itemsPerPage);
});

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

// Submit Order handler
function submitPurchaseOrder() {
  if (totalFinalCost.value > walletFree.value) {
    toast.error("Solde insuffisant pour couvrir le montant à séquestrer.");
    return;
  }

  const generatedId = `BC-2026-${String(Date.now()).slice(-4)}`;
  const generatedRef = generatedId;

  const allItems = [];
  selectedSuppliersData.value.forEach(block => {
    if (!block.supplierId) return;
    block.items.forEach(it => {
      if (!it.productId) return;
      const prod = catalogProducts.value.find(p => p.id === it.productId);
      if (prod) {
        allItems.push({
          productId: it.productId,
          productName: prod.name,
          sku: prod.sku || 'SKU-01',
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          totalPrice: it.quantity * it.unitPrice,
          supplierId: block.supplierId
        });
      }
    });
  });

  if (allItems.length === 0) {
    toast.error("Veuillez sélectionner au moins un fournisseur et un produit.");
    return;
  }

  walletFree.value -= totalFinalCost.value;
  walletLocked.value.push({
    id: `escrow_${Date.now()}`,
    refId: generatedId,
    amount: totalFinalCost.value,
    type: 'B2C',
    orderName: `Séquestre Commande ${generatedRef}`,
    dateLocked: new Date().toISOString()
  });

  const orderObj = {
    id: generatedId,
    reference: generatedRef,
    clientId: 'cli_buyer_demo',
    clientName: 'Alice Kamga',
    clientCompany: 'Kamga B2C Sourcing',
    items: allItems,
    subtotal: totalSubtotal.value,
    tax: totalVAT.value,
    shippingFee: fixedShipping.value,
    total: totalFinalCost.value,
    status: 'Submitted',
    paymentStatus: 'Escrow_Held',
    created_at: new Date().toISOString(),
    deliveryMode: newPO.value.deliveryMode,
    history: [
      { status: 'Submitted', timestamp: new Date().toISOString(), label: 'Bon de commande soumis', description: 'Le montant TTC est bloqué sur le compte séquestre de l\'administration.' }
    ]
  };

  dbOrders.value.unshift(orderObj);
  closeNewPOModal();
  toast.success(`Le bon de commande ${generatedRef} a été créé. Paiement séquestré.`);
}

function saveAsDraft() {
  const generatedId = `BC-2026-D${String(Date.now()).slice(-3)}`;
  const generatedRef = generatedId;

  const allItems = [];
  selectedSuppliersData.value.forEach(block => {
    if (!block.supplierId) return;
    block.items.forEach(it => {
      if (!it.productId) return;
      const prod = catalogProducts.value.find(p => p.id === it.productId);
      if (prod) {
        allItems.push({
          productId: it.productId,
          productName: prod.name,
          sku: prod.sku || 'SKU-01',
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          totalPrice: it.quantity * it.unitPrice,
          supplierId: block.supplierId
        });
      }
    });
  });

  if (allItems.length === 0) {
    toast.error("Veuillez sélectionner au moins un fournisseur et un produit.");
    return;
  }

  const orderObj = {
    id: generatedId,
    reference: generatedRef,
    clientId: 'cli_buyer_demo',
    clientName: 'Alice Kamga',
    clientCompany: 'Kamga B2C Sourcing',
    items: allItems,
    subtotal: totalSubtotal.value,
    tax: totalVAT.value,
    shippingFee: fixedShipping.value,
    total: totalFinalCost.value,
    status: 'Draft',
    paymentStatus: 'Draft',
    created_at: new Date().toISOString(),
    deliveryMode: newPO.value.deliveryMode,
    history: [
      { status: 'Draft', timestamp: new Date().toISOString(), label: 'Brouillon enregistré', description: 'Le bon de commande a été enregistré comme brouillon.' }
    ]
  };

  dbOrders.value.unshift(orderObj);
  closeNewPOModal();
  toast.info(`Le brouillon ${generatedRef} a été enregistré.`);
}

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val || 0).replace('XAF', 'FCFA');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR');
}

function translateStatus(stat) {
  const m = {
    'Draft': 'Brouillon',
    'Submitted': 'En attente de validation',
    'Approved': 'Validé (En attente BL)',
    'Preparing': 'Préparation Logistique',
    'Packed': 'BL généré / En transit',
    'Shipped': 'En Transit Logistique',
    'Delivered': 'Livré / Émargé',
    'Completed': 'Terminé'
  };
  return m[stat] || stat;
}

function getStatusClasses(stat) {
  const classes = {
    'Draft': 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-700/40',
    'Submitted': 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30',
    'Approved': 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30',
    'Preparing': 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200 dark:bg-fuchsia-950/20 dark:text-fuchsia-400 dark:border-fuchsia-900/30',
    'Packed': 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30',
    'Shipped': 'bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900/30',
    'Delivered': 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
    'Completed': 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
  };
  return classes[stat] || 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-700/40';
}

function translatePaymentStatus(pStat) {
  const m = {
    'Draft': 'Brouillon',
    'Settled': 'Transféré au Vendeur',
    'Escrow_Held': 'Séquestré par Admin',
    'Refunded': 'Remboursé'
  };
  return m[pStat] || pStat;
}

function getPaymentStatusClasses(pStat) {
  const classes = {
    'Draft': 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-700/40',
    'Settled': 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
    'Escrow_Held': 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30',
    'Refunded': 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30'
  };
  return classes[pStat] || 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-700/40';
}

// Edit draft states & functions
const showEditDraftModal = ref(false);
const editingOrder = ref(null);
const editingSupplierId = ref('');
const editingItems = ref([]);
const selectedAddProductId = ref('');

function openEditDraftModal(order, supplierId) {
  editingOrder.value = order;
  editingSupplierId.value = supplierId;
  const sItems = getOrderItems(order).filter(i => getItemSupplierId(i, order) === supplierId);
  editingItems.value = JSON.parse(JSON.stringify(sItems));
  showEditDraftModal.value = true;
}

function closeEditDraftModal() {
  showEditDraftModal.value = false;
  editingOrder.value = null;
  editingSupplierId.value = '';
  editingItems.value = [];
}

const supplierCatalogProducts = computed(() => {
  if (!editingSupplierId.value) return [];
  return catalogProducts.value.filter(p => p.supplierId === editingSupplierId.value);
});

function addProductToDraft() {
  if (!selectedAddProductId.value) return;
  const prod = catalogProducts.value.find(p => p.id === selectedAddProductId.value);
  if (!prod) return;
  
  const exists = editingItems.value.find(i => i.productId === prod.id);
  if (exists) {
    exists.quantity++;
  } else {
    editingItems.value.push({
      productId: prod.id,
      productName: prod.name,
      sku: prod.sku || 'SKU-01',
      quantity: 1,
      unitPrice: prod.price,
      supplierId: editingSupplierId.value
    });
  }
  selectedAddProductId.value = '';
}

function removeProductFromDraft(idx) {
  editingItems.value.splice(idx, 1);
}

function saveDraftEdits() {
  if (!editingOrder.value) return;

  const originalItems = getOrderItems(editingOrder.value);
  const otherItems = originalItems.filter(i => getItemSupplierId(i, editingOrder.value) !== editingSupplierId.value);

  const updatedItems = [
    ...otherItems,
    ...editingItems.value.map(i => ({
      ...i,
      totalPrice: i.quantity * i.unitPrice,
      status: i.status || 'Draft'
    }))
  ];

  if (updatedItems.length === 0) {
    toast.error("La commande ne peut pas être vide.");
    return;
  }

  const subtotal = updatedItems.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0);
  const tax = Math.floor(subtotal * 0.1925);
  const uniqueSuppliers = new Set(updatedItems.map(i => getItemSupplierId(i, editingOrder.value))).size;
  const shippingFee = uniqueSuppliers * 5000;
  const total = subtotal + tax + shippingFee;

  editingOrder.value.subtotal = subtotal;
  editingOrder.value.tax = tax;
  editingOrder.value.shippingFee = shippingFee;
  editingOrder.value.total = total;

  writeOrderUpdate(editingOrder.value, updatedItems);

  const storeOrder = ordersStore.purchaseOrders.find(o => o.id === editingOrder.value.id);
  if (storeOrder) {
    writeOrderUpdate(storeOrder, updatedItems);
    storeOrder.total = total;
  }

  closeEditDraftModal();
  toast.success("Les modifications du brouillon ont été enregistrées avec succès.");
}
</script>
