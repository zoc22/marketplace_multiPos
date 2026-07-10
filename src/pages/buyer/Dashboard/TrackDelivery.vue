<template>
  <div class="space-y-6 max-w-6xl mx-auto" id="track-delivery-workspace">
    <!-- NAVIGATION HEADER -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--color-border)] pb-4 gap-4">
      <div class="space-y-1">
        <router-link to="/buyer/purchases" class="text-xs text-[var(--color-primary)] font-mono hover:underline flex items-center space-x-1">
          <span>&larr;</span>
          <span>Retour aux Achats</span>
        </router-link>
        <h1 class="text-lg font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
          <span>Suivi &amp; Émargement Logistique</span>
          <span class="text-[var(--color-primary)] font-mono text-xs">#{{ order?.reference }}</span>
        </h1>
        <div v-if="selectedSupplierName" class="text-xs text-[var(--color-text-secondary)] font-mono uppercase">
          Fournisseur ciblé : <strong class="text-[var(--color-primary)]">{{ selectedSupplierName }}</strong>
        </div>
      </div>
      <div>
        <span class="px-3 py-1 bg-[var(--color-primary-muted)] text-[var(--color-primary)] rounded-full font-mono text-xs border border-[var(--color-primary-border)] font-bold uppercase">
          Transporteur : {{ order?.carrierName || 'Afrique Logistique Express' }}
        </span>
      </div>
    </div>

    <!-- MAIN WORKSPACE -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- TIMELINE & TRANSIT STEPS (LEFT) -->
      <div class="lg:col-span-7 space-y-6">
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
          <div class="flex justify-between items-center mb-6 border-b border-[var(--color-border)] pb-4">
            <div>
              <h3 class="text-base font-bold text-[var(--color-text-primary)]">Feuille de Route &amp; Positions</h3>
              <p class="text-xs text-[var(--color-text-secondary)] mt-1">Parcours Douala Autostrade &rarr; Yaoundé Hub.</p>
            </div>
            <span class="p-1.5 px-3.5 bg-[var(--color-primary-muted)] text-[var(--color-primary)] border border-[var(--color-primary-border)] text-xs font-mono rounded-lg font-bold uppercase animate-pulse">
              {{ currentFretMode }}
            </span>
          </div>

          <!-- Transit Steps -->
          <div class="space-y-6 relative pl-6 border-l border-[var(--color-border)] ml-4">
            <div 
              class="absolute -left-[14px] w-7 h-7 bg-[var(--color-primary)] rounded-full border-4 border-[var(--color-surface)] flex items-center justify-center transition-all duration-500 shadow-md"
              :style="{ top: truckPinTopOffset }"
            >
              <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.75A1.125 1.125 0 012.625 17.625V12m18 5.625c0 .621-.504 1.125-1.125 1.125H18m-9-6.375V9m-3 3h12m-.75 3H6.75m12 0h2.25A1.125 1.125 0 0022.125 14.25V12m0 0l-3.375-4.5M21 12H18m0-3V6.75A1.125 1.125 0 0016.875 5.625H12m-3 0H5.625A1.125 1.125 0 004.5 6.75V9" />
              </svg>
            </div>

            <div v-for="(st, idx) in transitSteps" :key="idx" class="relative">
              <div>
                <div class="flex items-center space-x-2">
                  <span 
                    class="absolute -left-[29px] top-1.5 w-2.5 h-2.5 rounded-full border transition-all"
                    :class="currentStepIndex >= idx ? 'bg-[var(--color-primary)] border-[var(--color-primary)] scale-110 shadow-lg' : 'bg-[var(--color-surface-elevated)] border-[var(--color-border)]'"
                  ></span>
                  <span 
                    class="text-sm font-bold font-mono"
                    :class="currentStepIndex >= idx ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'"
                  >
                    {{ st.city }} - {{ st.label }}
                  </span>
                </div>
                <p class="text-xs mt-1" :class="currentStepIndex >= idx ? 'text-[var(--color-text-secondary)]' : 'text-[var(--color-text-secondary)]/50'">
                  {{ st.desc }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- SIMULATOR PANEL FOR THE WORKFLOW LOOP -->
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
            <h3 class="text-xs font-mono uppercase font-black text-[var(--color-primary)]">Console Logistique &amp; Simulation</h3>
            <span class="text-[9px] font-mono text-[var(--color-text-secondary)] uppercase">Mode Démo Interactif</span>
          </div>
          <p class="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            Utilisez cette console pour simuler les actions du fournisseur ou faire transiter le fret logistique pour tester le processus.
          </p>
          <div class="flex flex-wrap gap-2 pt-1 font-mono">
            <button 
              v-for="(st, idx) in transitSteps" 
              :key="idx"
              @click="setSimulationLevel(idx)"
              class="px-2.5 py-1.5 text-[10px] rounded-lg border transition uppercase font-bold cursor-pointer"
              :class="currentStepIndex >= idx ? 'bg-[var(--color-primary-muted)] border-[var(--color-primary)] text-[var(--color-primary)]' : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)]'"
            >
              Étape {{ idx + 1 }}
            </button>
          </div>
          <div class="pt-3 border-t border-[var(--color-border)] flex items-center justify-between gap-3">
            <span class="text-[10px] text-[var(--color-text-secondary)] uppercase">Actions Fournisseur :</span>
            <button 
              v-if="['Preparing', 'Approved', 'Submitted'].includes(order?.status)"
              @click="simulateSupplierShipment"
              class="px-3 py-1.5 bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg text-[10px] font-mono font-bold uppercase transition cursor-pointer"
            >
              ⚡ Simuler Renvoi BL (Expédition)
            </button>
            <span v-else class="text-[10px] font-mono text-emerald-500 font-bold uppercase">Le fret est actuellement en transit/livré</span>
          </div>
        </div>
      </div>

      <!-- EMARGEMENT & RETURN MANAGEMENT (RIGHT) -->
      <div class="lg:col-span-5 space-y-6">
        
        <!-- PROOF OF DELIVERY CARD -->
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
          <div class="p-5 border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)] flex items-center justify-between">
            <h3 class="text-xs font-bold text-[var(--color-text-primary)] uppercase">Validation Logistique (PoD)</h3>
            <span class="text-[9px] font-mono text-[var(--color-text-secondary)] uppercase">Séquestre Sécurisé</span>
          </div>

          <!-- IF DELIVERED -->
          <div v-if="order?.status === 'Delivered' || order?.status === 'Completed'" class="p-6 space-y-4">
            <div class="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-center">
              <span class="text-emerald-600 font-mono text-[10px] font-black uppercase">✓ RÉCEPTION LOGISTIQUE CERTIFIÉE</span>
              <p class="text-[11px] text-[var(--color-text-secondary)] mt-1">
                Livraison validée et signée. Le paiement est débloqué.
              </p>
            </div>
            <div class="space-y-1 bg-[var(--color-surface-elevated)] p-3 rounded-xl border border-[var(--color-border)] text-xs">
              <span class="text-[9px] uppercase font-mono text-[var(--color-text-secondary)] font-bold block">Signé par :</span>
              <p class="font-bold text-[var(--color-text-primary)] font-mono">{{ order?.signedByName || 'Alice Kamga' }}</p>
              <span class="text-[9px] uppercase font-mono text-[var(--color-text-secondary)] font-bold block mt-2">Remarques :</span>
              <p class="italic text-[var(--color-text-secondary)]">" {{ order?.notes || 'Aucune réserve.' }} "</p>
            </div>
            <button 
              @click="printWaybill"
              class="w-full py-2.5 bg-[var(--color-primary-muted)] text-[var(--color-primary)] font-mono text-xs font-bold uppercase rounded-xl border border-[var(--color-primary-border)] hover:bg-[var(--color-primary)] hover:text-white transition cursor-pointer"
            >
              Imprimer le BL Émargé
            </button>
          </div>

          <!-- IF PREPARING OR SUBMITTED -->
          <div v-else-if="['Preparing', 'Approved', 'Submitted'].includes(order?.status)" class="p-8 text-center space-y-3 font-mono text-xs flex flex-col items-center">
            <svg class="w-10 h-10 text-[var(--color-primary)] animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h4 class="font-bold text-[var(--color-text-primary)]">En attente de colisage / Expédition</h4>
            <p class="text-[10px] text-[var(--color-text-secondary)] leading-relaxed">
              Le fournisseur prépare ou corrige la livraison. Dès qu'il émet le Bon de Livraison (BL), le statut passera à <strong>En Transit Logistique</strong>.
            </p>
          </div>

          <!-- IF PACKED AND NOT RETURN MODE -->
          <div v-else-if="order?.status === 'Packed' && !isReturnMode" class="p-6 space-y-4">
            <div class="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl flex items-start space-x-2">
              <svg class="w-4 h-4 text-amber-700 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <span class="text-amber-700 font-mono text-[10px] font-black uppercase">Bon de Livraison Reçu (Validation Requise)</span>
                <p class="text-[11px] text-[var(--color-text-secondary)] mt-1">
                  Le vendeur a émis le bon de livraison. Comparez les articles reçus avec votre BC initial avant de valider.
                </p>
              </div>
            </div>

            <!-- Comparison BC vs BL -->
            <div class="space-y-2 border-t border-b border-[var(--color-border)] py-3">
              <span class="text-[10px] uppercase font-mono tracking-wider text-[var(--color-text-secondary)] font-bold">Comparatif BC vs BL</span>
              <div class="space-y-2 max-h-56 overflow-y-auto">
                <div 
                  v-for="item in order?.items" 
                  :key="item.productId" 
                  class="bg-[var(--color-surface-elevated)] p-2.5 rounded-lg border border-[var(--color-border)] text-xs space-y-1"
                >
                  <div class="flex justify-between font-bold text-[var(--color-text-primary)]">
                    <span>{{ item.productName }}</span>
                    <span class="font-mono text-[var(--color-primary)]">BC: x{{ item.quantity }}</span>
                  </div>
                  
                  <div class="flex justify-between items-center text-[10px] text-[var(--color-text-secondary)]">
                    <span>Lot : {{ getBLLotNumber(item.productId) }}</span>
                    <span class="font-bold font-mono text-emerald-600">BL: x{{ getBLQty(item.productId) }}</span>
                  </div>

                  <div 
                    v-if="item.quantity !== getBLQty(item.productId)" 
                    class="text-[9px] font-mono text-amber-600 font-bold uppercase mt-1 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/20"
                  >
                    Divergence : {{ getBLQty(item.productId) - item.quantity > 0 ? '+' : '' }}{{ getBLQty(item.productId) - item.quantity }} unité(s)
                  </div>
                </div>

                <!-- Extra items in BL not in BC -->
                <div 
                  v-for="extra in getExtraBLItems()" 
                  :key="extra.product_id"
                  class="bg-red-500/5 p-2.5 rounded-lg border border-red-500/25 text-xs space-y-1"
                >
                  <div class="flex justify-between font-bold text-red-600">
                    <span>{{ getProductNameFromCatalog(extra.product_id) }} (Extra)</span>
                    <span class="font-mono text-red-600">BL: x{{ extra.quantity_delivered }}</span>
                  </div>
                  <div class="text-[9px] font-mono text-red-500 font-bold uppercase bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                    Produit absent du BC initial !
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Panel -->
            <div class="space-y-3">
              <div class="grid grid-cols-2 gap-2">
                <button 
                  @click="acceptBL" 
                  class="py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-mono font-bold uppercase transition cursor-pointer"
                >
                  Valider le BL
                </button>
                <router-link
                  :to="{ name: 'BuyerTrackReturn', params: { id: orderId }, query: { supplier: route.query.supplier } }"
                  class="py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-mono font-bold uppercase transition cursor-pointer text-center"
                >
                  Bon de Retour
                </router-link>
              </div>
              <button 
                @click="rejectBLCompletely" 
                class="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-mono font-bold uppercase transition cursor-pointer"
              >
                Rejeter totalement
              </button>
            </div>
          </div>

          <!-- IF PACKED AND IN RETURN SLIP MODE -->
          <div v-else-if="order?.status === 'Packed' && isReturnMode" class="p-6 space-y-4">
            <h4 class="text-xs uppercase font-mono font-bold text-rose-500">Formuler le Bon de Retour</h4>
            <p class="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
              Modifiez les quantités souhaitées pour corriger l'écart. Ce bon de retour sera traité comme un nouveau BC pour le vendeur.
            </p>

            <div class="space-y-3">
              <div v-for="item in order?.items" :key="item.productId" class="bg-[var(--color-surface-elevated)] p-2.5 rounded-lg border border-[var(--color-border)] text-xs flex justify-between items-center">
                <span>{{ item.productName }}</span>
                <div class="flex items-center space-x-2">
                  <span class="text-[10px] text-[var(--color-text-secondary)] font-mono">Qté :</span>
                  <input 
                    type="number" 
                    v-model.number="returnedQuantities[item.productId]" 
                    min="0"
                    class="w-14 p-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-center text-xs font-bold text-[var(--color-text-primary)]"
                  />
                </div>
              </div>
              
              <!-- Comment field -->
              <label class="block">
                <span class="block text-[10px] uppercase font-mono text-[var(--color-text-secondary)] font-bold mb-1">Motifs / Commentaires de retour</span>
                <textarea 
                  v-model="returnComment" 
                  rows="3" 
                  placeholder="Détaillez la raison du retour (ex: produits non demandés, casse...)" 
                  class="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg p-2 text-xs text-[var(--color-text-primary)] focus:outline-none"
                ></textarea>
              </label>

              <div class="grid grid-cols-2 gap-2 pt-2">
                <button 
                  @click="toggleReturnMode(false)" 
                  class="py-2 border border-[var(--color-border)] text-[var(--color-text-secondary)] rounded-lg text-xs font-mono font-bold uppercase cursor-pointer"
                >
                  Retour
                </button>
                <button 
                  @click="submitReturnSlip" 
                  class="py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-mono font-bold uppercase cursor-pointer font-black"
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>

          <!-- IF SHIPPED: LET BUYER ACCEPT OR RETURN -->
          <div v-else class="p-6 space-y-5">
            <!-- Mode Selector Tab -->
            <div class="grid grid-cols-2 gap-2 bg-[var(--color-surface-elevated)] p-1 rounded-xl border border-[var(--color-border)]">
              <button 
                @click="toggleReturnMode(false)"
                class="py-2 text-[10px] font-mono font-bold uppercase rounded-lg transition cursor-pointer"
                :class="!isReturnMode ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-secondary)]'"
              >
                Accepter le BL
              </button>
              <router-link
                :to="{ name: 'BuyerTrackReturn', params: { id: orderId }, query: { supplier: route.query.supplier } }"
                class="py-2 text-[10px] font-mono font-bold uppercase rounded-lg transition cursor-pointer"
                :class="'bg-red-500 text-white'
                "
              >
                Déclarer un Retour
              </router-link>
            </div>

            <!-- List of products in this BL -->
            <div class="space-y-2">
              <span class="text-[10px] uppercase font-mono tracking-wider text-[var(--color-text-secondary)] font-bold">Articles du Bon de Livraison</span>
              <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
                <div v-for="it in order?.items" :key="it.productId" class="bg-[var(--color-surface-elevated)] p-2.5 rounded-lg border border-[var(--color-border)] text-xs flex justify-between items-center">
                  <div>
                    <h5 class="font-bold text-[var(--color-text-primary)]">{{ it.productName }}</h5>
                    <p class="text-[10px] text-[var(--color-text-secondary)] font-mono">Qte expédiée : {{ it.quantity }}</p>
                  </div>
                  <!-- Quantity / Selector for returns -->
                  <div v-if="isReturnMode" class="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      v-model="returnedItems[it.productId].selected"
                      class="w-4 h-4 text-red-500 focus:ring-red-400 border-[var(--color-border)] rounded cursor-pointer"
                    />
                    <input 
                      v-if="returnedItems[it.productId].selected"
                      type="number" 
                      v-model.number="returnedItems[it.productId].quantity"
                      min="1"
                      :max="it.quantity"
                      class="w-14 p-0.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-center text-xs font-bold"
                    />
                  </div>
                  <div v-else class="text-xs font-mono font-bold text-[var(--color-text-primary)]">
                    x{{ it.quantity }}
                  </div>
                </div>
              </div>
            </div>

            <!-- RETURN NOTE MODE -->
            <div v-if="isReturnMode" class="space-y-4">
              <div class="space-y-3 p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
                <span class="text-[10px] font-mono font-black text-red-500 uppercase">Motifs de Retour</span>
                
                <div v-for="it in order?.items" :key="it.productId">
                  <div v-if="returnedItems[it.productId]?.selected" class="space-y-1 mt-2">
                    <span class="text-[9px] font-mono text-[var(--color-text-secondary)]">{{ it.productName }} :</span>
                    <select 
                      v-model="returnedItems[it.productId].reason"
                      class="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded p-1 text-[11px] focus:outline-none"
                    >
                      <option value="Articles endommagés">Articles endommagés lors du transport</option>
                      <option value="Mauvais article reçu">Mauvais produit / Erreur colisage</option>
                      <option value="Quantité manquante">Quantité manquante par rapport au BC</option>
                    </select>
                  </div>
                </div>
              </div>

              <button 
                @click="submitReturnNote"
                class="w-full py-2.5 bg-red-500 text-white font-mono font-bold uppercase rounded-xl text-xs tracking-wider transition hover:bg-red-650 cursor-pointer shadow-lg"
              >
                Générer &amp; Envoyer le Bon de Retour
              </button>
            </div>

            <!-- STANDARD ACCEPT MODE -->
            <div v-else class="space-y-4">
              <!-- signature tactile pad -->
              <div class="space-y-1">
                <span class="text-[10px] uppercase font-mono tracking-wider text-[var(--color-primary)] font-bold block">Émarger Signature (Souris/Tactile)</span>
                <div class="bg-white rounded-xl overflow-hidden border border-slate-300 relative h-28">
                  <canvas 
                    ref="sigCanvas"
                    @mousedown="startDrawing"
                    @mousemove="draw"
                    @mouseup="stopDrawing"
                    @mouseleave="stopDrawing"
                    @touchstart="startDrawingTouch"
                    @touchmove="drawTouch"
                    @touchend="stopDrawing"
                    class="w-full h-full cursor-crosshair block"
                  ></canvas>
                  <div v-if="canvasIsEmpty" class="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-400 text-[10px] font-mono uppercase italic select-none">
                    Tracez votre signature ici
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <label class="block">
                  <span class="block text-[9px] uppercase font-mono text-[var(--color-text-secondary)] font-bold mb-1">Nom Récepteur</span>
                  <input type="text" v-model="receiverName" class="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg p-1.5 text-xs font-mono text-[var(--color-text-primary)]" />
                </label>
                <label class="block">
                  <span class="block text-[9px] uppercase font-mono text-[var(--color-text-secondary)] font-bold mb-1">Date Signature</span>
                  <input type="text" v-model="todayDateStr" disabled class="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg p-1.5 text-xs text-[var(--color-text-secondary)] font-mono" />
                </label>
              </div>

              <label class="block">
                <span class="block text-[9px] uppercase font-mono text-[var(--color-text-secondary)] font-bold mb-1">Remarques / Observations</span>
                <textarea v-model="deliveryNotes" rows="2" placeholder="Ex: Livraison reçue complète et conforme" class="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg p-2 text-xs focus:outline-none"></textarea>
              </label>

              <button 
                @click="saveIndorsement"
                class="w-full py-2.5 bg-[var(--color-primary)] text-white font-mono font-bold uppercase rounded-xl text-xs tracking-wider transition shadow-lg cursor-pointer"
              >
                Émarger &amp; Valider le BL
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { walletLocked, b2b_suppliers, products as catalogProducts } from '@/utils/supplier_db.js';
import { useToast } from 'vue-toastification';
import { useOrdersStore } from '@/store/modules/orders.js';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const ordersStore = useOrdersStore();
const dbOrders = ref(ordersStore.purchaseOrders);
const orderId = route.params.id;

// Expanded/Filtered order
const order = computed(() => {
  const rawOrder = dbOrders.value?.find(o => o.id === orderId) || dbOrders.value?.[0];
  if (!rawOrder) return null;
  
  const supplierId = route.query.supplier;
  const filteredItems = supplierId
    ? (rawOrder.items || []).filter(item => item.supplierId === supplierId)
    : (rawOrder.items || []);

  return {
    ...rawOrder,
    items: filteredItems
  };
});

const selectedSupplierName = computed(() => {
  const supplierId = route.query.supplier;
  if (!supplierId) return '';
  const found = b2b_suppliers.value.find(s => s.id === supplierId);
  return found ? found.name : supplierId;
});

// Returns form state
const isReturnMode = ref(false);
const returnedItems = ref({});
const returnComment = ref('');
const returnedQuantities = ref({});

const associatedDN = computed(() => {
  if (!order.value) return null;
  const supplierId = route.query.supplier;
  const found = ordersStore.deliveryNotes.find(dn => 
    dn.purchase_order_id === order.value.id && 
    (!supplierId || dn.emitter_id === supplierId)
  );
  if (found) return found;

  // Fallback to mock data for BC-2026-006 / usr_vendor_1
  if (order.value.id === 'BC-2026-006' || order.value.reference === 'BC-2026-006') {
    return {
      reference: 'BL-2026-006',
      products: [
        { product_id: 'prod_souris_wireless', quantity_delivered: 4, unit_price: 15000, lot_number: 'LOT-MS-02' },
        { product_id: 'prod_cable_hdmi', quantity_delivered: 8, unit_price: 5000, lot_number: 'LOT-CB-10' },
        { product_id: 'prod_panneau_solaire', quantity_delivered: 1, unit_price: 85000, lot_number: 'LOT-SOL-05' }
      ],
      carrier: 'Afrique Logistique Express',
      tracking_number: 'TRK-003'
    };
  }

  // General fallback
  return {
    reference: `BL-${order.value.reference}`,
    products: order.value.items.map(it => ({
      product_id: it.productId || it.product_id,
      quantity_delivered: it.quantity,
      unit_price: it.unitPrice || it.unit_price,
      lot_number: 'LOT-FIFO-01'
    })),
    carrier: order.value.carrierName || 'Afrique Logistique Express',
    tracking_number: order.value.waybill || 'N/A'
  };
});

function getBLQty(productId) {
  if (!associatedDN.value) return 0;
  const p = associatedDN.value.products.find(prod => prod.product_id === productId);
  return p ? p.quantity_delivered : 0;
}

function getBLLotNumber(productId) {
  if (!associatedDN.value) return 'N/A';
  const p = associatedDN.value.products.find(prod => prod.product_id === productId);
  return p ? p.lot_number : 'N/A';
}

function getExtraBLItems() {
  if (!associatedDN.value || !order.value) return [];
  return associatedDN.value.products.filter(blP => {
    return !order.value.items.some(bcP => bcP.productId === blP.product_id || bcP.product_id === blP.product_id);
  });
}

function getProductNameFromCatalog(productId) {
  const p = catalogProducts.value.find(prod => prod.id === productId);
  return p ? p.name : productId;
}

function initializeReturnedQuantities() {
  if (order.value) {
    order.value.items.forEach(it => {
      returnedQuantities.value[it.productId] = it.quantity;
    });
  }
}

function toggleReturnMode(mode) {
  isReturnMode.value = mode;
  if (mode && order.value) {
    order.value.items.forEach(it => {
      if (!returnedItems.value[it.productId]) {
        returnedItems.value[it.productId] = { 
          selected: false, 
          quantity: it.quantity || 1, 
          reason: 'Articles endommagés' 
        };
      }
      if (returnedQuantities.value[it.productId] === undefined) {
        returnedQuantities.value[it.productId] = it.quantity;
      }
    });
  }
}

// Transit log mock cities
const transitSteps = [
  { city: 'Douala Bassa Hub', label: 'Départ Entrepôt', desc: 'Inspection et plombage du camion.', time: '08:35' },
  { city: 'Péage d\'Édéa', label: 'Transit National', desc: 'Contrôle routier réglementaire franchi.', time: '11:15' },
  { city: 'Boumnyébel', label: 'Escale Technique', desc: 'Vérification logistique.', time: '13:40' },
  { city: 'Yaoundé Mvan', label: 'Arrivée Hub', desc: 'Déchargement sur la plateforme de distribution locale.', time: '15:10' },
  { city: 'Yaoundé Centre', label: 'Livraison Approche', desc: 'Dernier kilomètre vers l\'acheteur.', time: '16:00' }
];

const currentStepIndex = ref(3);

const currentFretMode = computed(() => {
  if (order.value?.status === 'Delivered' || order.value?.status === 'Completed') return 'Fret Livré';
  if (currentStepIndex.value === 4) return 'Approche Finale';
  return 'En transit routier';
});

const truckPinTopOffset = computed(() => {
  const stepsCount = transitSteps.length;
  const pct = (currentStepIndex.value / (stepsCount - 1)) * 100;
  return `calc(${pct}% - 14px)`;
});

function setSimulationLevel(idx) {
  currentStepIndex.value = idx;
  toast.info(`Simulation : Position logistique mise à jour.`);
}

function simulateSupplierShipment() {
  const ordIndex = dbOrders.value.findIndex(o => o.id === order.value.id);
  if (ordIndex > -1) {
    const origOrder = dbOrders.value[ordIndex];
    origOrder.status = 'Shipped';
    origOrder.paymentStatus = origOrder.paymentStatus || 'Escrow_Held';
    if (!origOrder.history) origOrder.history = [];
    origOrder.history.push({
      status: 'Shipped',
      timestamp: new Date().toISOString(),
      label: 'Nouveau Bon de Livraison (BL)',
      description: 'Le fournisseur a corrigé la livraison et émis un nouveau bon de livraison correctif.'
    });

    const bl = ordersStore.deliveryNotes.find(dn => dn.purchase_order_id === origOrder.id);
    if (bl) {
      bl.status = 'IN_TRANSIT';
      bl.date_emission = bl.date_emission || new Date();
      bl.tracking_number = bl.tracking_number || `TRK-${Math.floor(Math.random() * 900000 + 100000)}`;
    }

    toast.success("Nouveau bon de livraison (correctif) émis par le fournisseur !");
  }
}

function acceptBL() {
  const ordIndex = dbOrders.value.findIndex(o => o.id === order.value.id);
  if (ordIndex > -1) {
    const origOrder = dbOrders.value[ordIndex];
    origOrder.status = 'Shipped';
    origOrder.paymentStatus = origOrder.paymentStatus || 'Escrow_Held';
    if (!origOrder.history) origOrder.history = [];
    origOrder.history.push({
      status: 'Shipped',
      timestamp: new Date().toISOString(),
      label: 'Bon de Livraison Accepté',
      description: 'L\'acheteur a accepté le BL. La livraison est maintenant en transit vers la réception finale.'
    });

    const bl = ordersStore.deliveryNotes.find(dn => dn.purchase_order_id === origOrder.id);
    if (bl) {
      bl.status = 'IN_TRANSIT';
      bl.date_emission = bl.date_emission || new Date();
      bl.signature = receiverName.value || bl.signature || 'Acheteur';
    }

    toast.success("Le bon de livraison a été accepté. Le fret est en transit.");
  }
}

function rejectBLCompletely() {
  const ordIndex = dbOrders.value.findIndex(o => o.id === order.value.id);
  if (ordIndex > -1) {
    const origOrder = dbOrders.value[ordIndex];
    origOrder.status = 'Rejected';
    origOrder.paymentStatus = 'Refunded';
    if (!origOrder.history) origOrder.history = [];
    origOrder.history.push({
      status: 'Rejected',
      timestamp: new Date().toISOString(),
      label: 'Bon de Livraison Rejeté',
      description: 'L\'acheteur a rejeté totalement le bon de livraison.'
    });
    const bl = ordersStore.deliveryNotes.find(dn => dn.purchase_order_id === origOrder.id);
    if (bl) {
      bl.status = 'REJECTED';
      bl.date_livraison = new Date();
    }
    toast.error("Le bon de livraison a été rejeté. Processus arrêté.");
  }
}

function submitReturnNote() {
  const itemsToReturn = [];
  Object.keys(returnedItems.value).forEach(pId => {
    const rInfo = returnedItems.value[pId];
    if (rInfo.selected) {
      const origItem = order.value.items.find(it => it.productId === pId);
      itemsToReturn.push({
        productId: pId,
        productName: origItem ? origItem.productName : 'Produit',
        quantity: rInfo.quantity,
        reason: rInfo.reason
      });
    }
  });

  if (itemsToReturn.length === 0) {
    toast.error("Veuillez cocher au moins un article à retourner.");
    return;
  }

  const ordIndex = dbOrders.value.findIndex(o => o.id === order.value.id);
  if (ordIndex > -1) {
    const origOrder = dbOrders.value[ordIndex];
    origOrder.status = 'Preparing'; // Return to Preparing
    if (!origOrder.history) origOrder.history = [];
    origOrder.history.push({
      status: 'Returned',
      timestamp: new Date().toISOString(),
      label: 'Bon de retour généré',
      description: `Refus du BL. Articles retournés : ${itemsToReturn.map(i => `${i.productName} (x${i.quantity}) - ${i.reason}`).join(', ')}`
    });

    toast.warning("Bon de retour transmis ! Le fournisseur doit émettre un BL correctif.");
    isReturnMode.value = false;
  }
}

// Accept and emarge signature functions
const receiverName = ref('Alice Kamga');
const deliveryNotes = ref('');
const todayDateStr = ref(new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }));

const sigCanvas = ref(null);
const canvasIsEmpty = ref(true);
let isDrawing = false;
let ctx = null;

onMounted(() => {
  initializeReturnedQuantities();
  if (order.value && order.value.status === 'Shipped') {
    setTimeout(initCanvas, 150);
  }
});

function initCanvas() {
  if (!sigCanvas.value) return;
  const canvas = sigCanvas.value;
  ctx = canvas.getContext('2d');
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
}

function startDrawing(e) {
  isDrawing = true;
  canvasIsEmpty.value = false;
  ctx.beginPath();
  const rect = sigCanvas.value.getBoundingClientRect();
  ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function draw(e) {
  if (!isDrawing) return;
  const rect = sigCanvas.value.getBoundingClientRect();
  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
  ctx.stroke();
}

function stopDrawing() {
  isDrawing = false;
}

function startDrawingTouch(e) {
  e.preventDefault();
  isDrawing = true;
  canvasIsEmpty.value = false;
  ctx.beginPath();
  const rect = sigCanvas.value.getBoundingClientRect();
  const touch = e.touches[0];
  ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
}

function drawTouch(e) {
  e.preventDefault();
  if (!isDrawing) return;
  const rect = sigCanvas.value.getBoundingClientRect();
  const touch = e.touches[0];
  ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
  ctx.stroke();
}

function saveIndorsement() {
  if (!order.value) return;
  
  let signatureData = '';
  if (sigCanvas.value) {
    signatureData = sigCanvas.value.toDataURL('image/png');
  }

  const ordIndex = dbOrders.value.findIndex(o => o.id === order.value.id);
  if (ordIndex > -1) {
    const origOrder = dbOrders.value[ordIndex];
    origOrder.status = 'Delivered';
    origOrder.signedByName = receiverName.value;
    origOrder.notes = deliveryNotes.value;
    origOrder.paymentStatus = 'Settled';
    
    if (!origOrder.history) origOrder.history = [];
    origOrder.history.push({
      status: 'Delivered',
      timestamp: new Date().toISOString(),
      label: 'Livraison Validée & Émargée',
      description: `Fret réceptionné par ${receiverName.value}. Séquestre débloqué.`
    });

    // Release escrow money
    import('@/utils/vendor_db.js').then(vendorDb => {
      const escrowEntryIndex = walletLocked.value.findIndex(e => e.refId === origOrder.id);
      if (escrowEntryIndex > -1) {
        const escrowEntry = walletLocked.value[escrowEntryIndex];
        walletLocked.value.splice(escrowEntryIndex, 1);
        vendorDb.walletFree.value += escrowEntry.amount;
        toast.success(`Montant séquestre libéré : ${formatMoney(escrowEntry.amount)} versé.`);
      }
    }).catch(err => {
      console.error(err);
    });

    toast.success('Bon de livraison validé avec émargement !');
  }
}

function printWaybill() {
  window.print();
  toast.success('Impression lancée.');
}

function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val || 0).replace('XAF', 'FCFA');
}
</script>
