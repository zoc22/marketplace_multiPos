<template>
  <!-- Full height POS wrapper overriding padding -->
  <div class="h-[calc(100vh-64px)] -m-6 md:-m-8 flex flex-col bg-[var(--color-background)] overflow-hidden font-sans">
    
    <!-- SESSION OPENING OVERLAY -->
    <div v-if="!currentSession" class="flex-1 flex items-center justify-center bg-black/60 p-4 z-50 backdrop-blur-sm">
      <div class="bg-[var(--color-surface)] p-8 rounded-2xl shadow-2xl max-w-md w-full border border-[var(--color-border)] transform transition duration-300 scale-100">
        <h2 class="text-2xl font-bold mb-6 text-center flex items-center justify-center space-x-2 text-[var(--color-primary)]">
          <BuildingStorefrontIcon class="h-8 w-8 text-[var(--color-primary)]" />
          <span>Ouverture de Caisse</span>
        </h2>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">Point de Vente / Magasin</label>
            <select v-model="sessionForm.storeId" class="w-full p-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none">
              <option v-for="store in activeStores" :key="store.id" :value="store.id">{{ store.name }} ({{ store.location }})</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">Caissier Référent</label>
            <input type="text" v-model="sessionForm.cashierName" disabled class="w-full p-3 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-muted)] cursor-not-allowed" />
          </div>
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">Fonds de caisse initial (FCFA)</label>
            <div class="relative">
              <input type="number" v-model.number="sessionForm.floatAmount" class="w-full p-3 pl-12 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl font-bold text-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none" />
              <div class="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[var(--color-text-secondary)]">FCFA</div>
            </div>
          </div>
          <button @click="openSession" :disabled="!sessionForm.storeId" class="w-full py-4 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:opacity-95 active:scale-95 transition mt-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[var(--color-primary-muted)]">
            Ouvrir la session de caisse
          </button>
        </div>
      </div>
    </div>

    <!-- MAIN POS INTERFACE -->
    <div v-else class="flex-1 flex flex-col lg:flex-row overflow-hidden">
      
      <!-- LEFT PANEL : PRODUCTS (approx 60-65%) -->
      <div class="flex-1 flex flex-col bg-[var(--color-surface)] border-r border-[var(--color-border)] overflow-hidden">
        
        <!-- Header / Search / Quick Actions -->
        <div class="p-4 border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)] flex flex-wrap gap-3 shrink-0 shadow-sm z-10">
          <div class="relative flex-1 min-w-[200px]">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)]" />
            <input 
              type="text" 
              ref="searchInput"
              v-model="searchQuery" 
              @input="handleSearch"
              placeholder="Rechercher un produit ou scanner le code-barres..." 
              class="w-full pl-10 pr-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] shadow-inner"
              autofocus
            />
          </div>
          <!-- Barcode simulation button for demo -->
          <button @click="simulateBarcodeScan" class="px-3 py-2 bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] font-bold rounded-xl hover:bg-[var(--color-border)] flex items-center space-x-1">
            <QrCodeIcon class="h-4 w-4 text-[var(--color-primary)]" />
            <span>Simuler Bip Scan</span>
          </button>
          <!-- Rapport X button -->
          <button @click="generateReportX" class="px-3 py-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-bold rounded-xl hover:bg-indigo-500 hover:text-white flex items-center space-x-1 transition">
            <DocumentTextIcon class="h-4 w-4" />
            <span>Rapport X</span>
          </button>
          <!-- Clôture / Rapport Z button -->
          <button @click="isCloseModalOpen = true" class="px-3 py-2 bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold rounded-xl hover:bg-red-500 hover:text-white flex items-center space-x-1 transition shrink-0">
            <PowerIcon class="h-4 w-4" />
            <span>Clôturer (Z)</span>
          </button>
        </div>

        <!-- Categories Tabs -->
        <div class="px-4 py-2.5 bg-[var(--color-surface-hover)] border-b border-[var(--color-border)] overflow-x-auto whitespace-nowrap shrink-0 hide-scrollbar flex space-x-2">
          <button 
            @click="selectedCategory = 'ALL'"
            class="px-4 py-1.5 rounded-full text-xs font-bold transition border"
            :class="selectedCategory === 'ALL' ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)]'"
          >
            Tous les articles
          </button>
          <button 
            v-for="cat in categories" :key="cat"
            @click="selectedCategory = cat"
            class="px-4 py-1.5 rounded-full text-xs font-bold transition border"
            :class="selectedCategory === cat ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)]'"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Product Grid -->
        <div class="flex-1 overflow-y-auto p-4 bg-[var(--color-background)]">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            <div 
              v-for="prod in displayedProducts" :key="prod.id"
              @click="addToCart(prod)"
              class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden cursor-pointer hover:border-[var(--color-primary)] hover:shadow-lg transition group flex flex-col relative select-none"
            >
              <!-- Alert badges for low stock -->
              <div 
                class="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold rounded-full z-10"
                :class="prod.stock <= prod.minStock ? 'bg-red-500 text-white animate-pulse' : 'bg-black/60 text-white'"
              >
                St: {{ prod.stock }}
              </div>
              
              <div class="h-24 bg-[var(--color-surface-hover)] flex items-center justify-center p-3">
                <img :src="prod.image" :alt="prod.name" class="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300" />
              </div>
              <div class="p-3 flex-1 flex flex-col justify-between">
                <h3 class="text-xs font-bold text-[var(--color-text-primary)] leading-tight mb-2 line-clamp-2">{{ prod.name }}</h3>
                <div class="text-[var(--color-primary)] font-black text-sm">
                  {{ formatMoney(prod.price) }}
                </div>
              </div>
            </div>
            
            <div v-if="displayedProducts.length === 0" class="col-span-full py-12 text-center text-[var(--color-text-muted)] font-medium">
              Aucun produit trouvé.
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT PANEL : CART & TOTAL (approx 35-40%) -->
      <div class="w-full lg:w-[420px] xl:w-[480px] flex flex-col bg-[var(--color-surface-elevated)] shrink-0 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-20 overflow-hidden">
        
        <!-- Cart Header -->
        <div class="p-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-surface)] shrink-0">
          <div class="flex items-center space-x-2 text-[var(--color-text-primary)] font-bold">
            <ShoppingCartIcon class="h-5 w-5 text-[var(--color-primary)]" />
            <span>Panier actif ({{ currentSession?.storeId }})</span>
          </div>
          <button @click="clearCart" :disabled="cart.length === 0" class="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition disabled:opacity-30 disabled:hover:bg-transparent" title="Vider le panier">
            <TrashIcon class="h-5 w-5" />
          </button>
        </div>

        <!-- Cart Items List -->
        <div class="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--color-surface)]">
          <div v-if="cart.length === 0" class="h-full flex flex-col items-center justify-center text-[var(--color-text-muted)] space-y-4">
            <ShoppingCartIcon class="h-16 w-16 opacity-10 animate-bounce" />
            <p class="font-medium text-sm text-[var(--color-text-secondary)]">Le panier est vide. Cliquez sur un produit pour l'ajouter.</p>
          </div>

          <div v-for="(item, index) in cart" :key="index" class="p-3 border border-[var(--color-border)] rounded-xl bg-[var(--color-background)] shadow-sm relative group transition hover:border-[var(--color-primary-border)]">
            <div class="flex justify-between items-start mb-1">
              <h4 class="font-bold text-xs text-[var(--color-text-primary)] pr-6 leading-tight">{{ item.product.name }}</h4>
              <button @click="removeFromCart(index)" class="absolute top-3 right-3 text-[var(--color-text-muted)] hover:text-red-500 transition">
                <XMarkIcon class="h-4 w-4" />
              </button>
            </div>
            
            <div class="flex items-center justify-between mt-2">
              <div class="text-[var(--color-text-secondary)] text-xs font-semibold">
                {{ formatMoney(item.product.price) }}
              </div>
              <div class="flex items-center space-x-2 bg-[var(--color-surface-hover)] p-0.5 rounded-lg border border-[var(--color-border)]">
                <button @click="updateQty(index, -1)" class="w-7 h-7 flex items-center justify-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded hover:bg-[var(--color-border)] transition"><MinusIcon class="h-3.5 w-3.5" /></button>
                <span class="font-bold text-xs w-6 text-center text-[var(--color-text-primary)]">{{ item.quantity }}</span>
                <button @click="updateQty(index, 1)" class="w-7 h-7 flex items-center justify-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded hover:bg-[var(--color-border)] transition"><PlusIcon class="h-3.5 w-3.5" /></button>
              </div>
            </div>
            
            <!-- Remise par article -->
            <div class="mt-2.5 pt-2 border-t border-[var(--color-border)] border-dashed flex items-center justify-between">
              <span class="text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-muted)]">Remise article (%)</span>
              <div class="flex items-center space-x-1">
                <input type="number" v-model.number="item.discountPercent" min="0" max="100" class="w-14 p-1 text-right text-xs bg-[var(--color-surface)] border border-[var(--color-border)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
                <span class="text-xs text-[var(--color-text-secondary)]">%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Cart Summary & Payment -->
        <div class="p-4 bg-[var(--color-surface-elevated)] border-t border-[var(--color-border)] shadow-[0_-4px_15px_-3px_rgba(0,0,0,0.05)] shrink-0 space-y-2.5">
          
          <div class="flex justify-between text-[var(--color-text-secondary)] text-xs">
            <span>Sous-total ({{ totalItems }} articles)</span>
            <span class="font-bold text-[var(--color-text-primary)]">{{ formatMoney(subtotal) }}</span>
          </div>
          
          <div class="flex justify-between items-center text-[var(--color-text-secondary)] text-xs">
            <span>Remise globale (%)</span>
            <div class="flex items-center space-x-1">
              <input type="number" v-model.number="globalDiscount" min="0" max="100" class="w-16 p-1 text-right text-xs bg-[var(--color-background)] border border-[var(--color-border)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
              <span class="text-xs">%</span>
            </div>
          </div>

          <div class="flex justify-between text-red-500 text-xs font-semibold" v-if="totalDiscountValue > 0">
            <span>Remises cumulées</span>
            <span>- {{ formatMoney(totalDiscountValue) }}</span>
          </div>

          <div class="flex justify-between text-[var(--color-text-secondary)] text-xs">
            <span>TVA ({{ vendor_settings.taxRate }}%)</span>
            <span>{{ formatMoney(taxAmount) }}</span>
          </div>

          <div class="flex justify-between items-center pt-3 border-t border-[var(--color-border)] border-dashed mt-1 mb-3">
            <span class="text-sm font-bold tracking-wider text-[var(--color-text-secondary)] uppercase">Net à payer</span>
            <span class="text-3xl font-black text-[var(--color-primary)]">{{ formatMoney(finalTotal) }}</span>
          </div>

          <button 
            @click="openPaymentModal" 
            :disabled="cart.length === 0"
            class="w-full py-4 bg-[var(--color-primary)] text-white text-lg font-black rounded-xl shadow-lg hover:opacity-95 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex justify-center items-center space-x-2"
          >
            <BanknotesIcon class="h-6 w-6 animate-pulse" />
            <span>PROCÉDER AU PAIEMENT</span>
          </button>
        </div>
      </div>
    </div>

    <!-- PAYMENT MODAL -->
    <div v-if="isPaymentModalOpen" @click.self="isPaymentModalOpen = false" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm cursor-pointer">
      <div class="bg-[var(--color-surface-elevated)] rounded-2xl shadow-2xl w-full max-w-4xl relative z-10 flex flex-col md:flex-row overflow-hidden border border-[var(--color-border)] animate-in fade-in zoom-in-95 duration-200 cursor-default">
        
        <!-- Payment Methods selection (left) -->
        <div class="w-full md:w-1/2 p-6 bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col">
          <h3 class="text-lg font-bold mb-4 text-[var(--color-text-primary)] border-b pb-2">Sélectionner le mode de règlement</h3>
          <div class="grid grid-cols-2 gap-4 flex-1 content-start">
            <button 
              @click="addPaymentMethod('Cash')"
              class="p-5 flex flex-col items-center justify-center space-y-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-muted)] transition"
            >
              <BanknotesIcon class="h-8 w-8 text-emerald-500" />
              <span class="font-bold text-xs text-[var(--color-text-primary)]">Espèces (Cash)</span>
            </button>
            <button 
              @click="addPaymentMethod('MobileMoney')"
              class="p-5 flex flex-col items-center justify-center space-y-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-muted)] transition"
            >
              <DevicePhoneMobileIcon class="h-8 w-8 text-orange-500" />
              <span class="font-bold text-xs text-[var(--color-text-primary)]">Mobile Money</span>
            </button>
            <button 
              @click="addPaymentMethod('Card')"
              class="p-5 flex flex-col items-center justify-center space-y-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-muted)] transition"
            >
              <CreditCardIcon class="h-8 w-8 text-blue-500" />
              <span class="font-bold text-xs text-[var(--color-text-primary)]">Carte Bancaire</span>
            </button>
            <button 
              @click="addPaymentMethod('Avoir')"
              class="p-5 flex flex-col items-center justify-center space-y-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-muted)] transition"
            >
              <TicketIcon class="h-8 w-8 text-purple-500" />
              <span class="font-bold text-xs text-[var(--color-text-primary)]">Bon d'Avoir</span>
            </button>
          </div>
          
          <div class="mt-4 p-4 bg-[var(--color-surface-hover)] rounded-xl text-xs text-[var(--color-text-secondary)] space-y-1">
            <span class="font-bold text-[var(--color-text-primary)]">💡 Astuce Multi-paiement :</span>
            <p>Vous pouvez ajouter plusieurs modes de règlement pour diviser la facture (Split payment).</p>
          </div>
        </div>

        <!-- Payment details/interactive mockups (right) -->
        <div class="w-full md:w-1/2 p-6 flex flex-col bg-[var(--color-surface-hover)]">
          <div class="flex justify-between items-center mb-4 border-b pb-2">
            <h3 class="text-lg font-bold text-[var(--color-text-primary)]">Détails du règlement</h3>
            <button @click="isPaymentModalOpen = false" class="text-[var(--color-text-muted)] hover:text-red-500"><XMarkIcon class="h-5 w-5"/></button>
          </div>

          <div class="bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border)] shadow-sm mb-4">
            <div class="flex justify-between text-xs text-[var(--color-text-secondary)] mb-1">
              <span>Restant à encaisser</span>
            </div>
            <div class="text-3xl font-black" :class="remainingToPay > 0 ? 'text-[var(--color-primary)]' : 'text-emerald-500'">
              {{ formatMoney(remainingToPay) }}
            </div>
          </div>

          <!-- Active Payment Methods Detail list -->
          <div class="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
            <div v-for="(pm, idx) in activePayments" :key="idx" class="bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border)] relative shadow-sm">
              <button @click="removePaymentMethod(idx)" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition z-10"><XMarkIcon class="h-3.5 w-3.5"/></button>
              
              <div class="flex items-center justify-between mb-3 border-b pb-2">
                <div class="flex items-center space-x-2">
                  <BanknotesIcon v-if="pm.method === 'Cash'" class="h-5 w-5 text-emerald-500" />
                  <DevicePhoneMobileIcon v-else-if="pm.method === 'MobileMoney'" class="h-5 w-5 text-orange-500" />
                  <CreditCardIcon v-else-if="pm.method === 'Card'" class="h-5 w-5 text-blue-500" />
                  <TicketIcon v-else class="h-5 w-5 text-purple-500" />
                  <span class="font-bold text-sm text-[var(--color-text-primary)]">{{ pm.method }}</span>
                </div>
                <!-- Mini action inputs -->
                <div class="flex items-center space-x-1">
                  <span class="text-xs font-semibold text-[var(--color-text-secondary)]">Montant:</span>
                  <input type="number" v-model.number="pm.amount" class="w-24 p-1 text-right text-xs bg-[var(--color-background)] border border-[var(--color-border)] rounded font-bold" />
                </div>
              </div>
              
              <!-- Cash Payment Details -->
              <div v-if="pm.method === 'Cash'" class="space-y-3">
                <div>
                  <label class="block text-[10px] uppercase font-bold text-[var(--color-text-muted)] mb-1">Espèces Remises par le client (FCFA)</label>
                  <input type="number" v-model.number="pm.tendered" class="w-full p-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg font-bold text-lg text-emerald-600 focus:ring-1 focus:ring-emerald-500" />
                </div>
                <div class="flex justify-between items-center text-xs pt-1">
                  <span class="text-[var(--color-text-secondary)]">Monnaie à rendre :</span>
                  <span class="font-bold text-lg" :class="(pm.tendered || 0) - pm.amount >= 0 ? 'text-red-500' : 'text-[var(--color-text-muted)]'">
                    {{ formatMoney(Math.max(0, (pm.tendered || 0) - (pm.amount || 0))) }}
                  </span>
                </div>
              </div>

              <!-- Mobile Money Payment Details & USSD Mockup -->
              <div v-if="pm.method === 'MobileMoney'" class="space-y-3">
                <div class="flex space-x-2">
                  <div class="flex-1">
                    <label class="block text-[10px] uppercase font-bold text-[var(--color-text-muted)] mb-1">Opérateur</label>
                    <select v-model="pm.operator" class="w-full p-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-xs font-semibold">
                      <option value="MTN">MTN Mobile Money</option>
                      <option value="Orange">Orange Money</option>
                    </select>
                  </div>
                  <div class="flex-[2]">
                    <label class="block text-[10px] uppercase font-bold text-[var(--color-text-muted)] mb-1">Numéro de Téléphone</label>
                    <input type="text" v-model="pm.phone" placeholder="Ex: 677889900" class="w-full p-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-xs font-bold" />
                  </div>
                </div>
                
                <button 
                  v-if="!pm.ussdStatus" 
                  @click="triggerUssdPush(pm)" 
                  :disabled="!pm.phone"
                  class="w-full py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1"
                >
                  <DevicePhoneMobileIcon class="h-4 w-4" />
                  <span>Lancer le Push USSD (Simulation)</span>
                </button>

                <!-- Phone screen simulation -->
                <div v-else class="border border-orange-300 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900/30 p-3 rounded-lg flex flex-col space-y-2">
                  <div class="flex justify-between items-center text-xs text-orange-800 dark:text-orange-400 font-bold">
                    <span class="flex items-center space-x-1">
                      <span class="h-2 w-2 rounded-full bg-orange-500 animate-ping"></span>
                      <span>Simulation USSD Client</span>
                    </span>
                    <span>{{ pm.ussdStatus }}</span>
                  </div>
                  
                  <div v-if="pm.ussdStatus === 'WAITING'" class="bg-black text-white p-3 rounded font-mono text-[10px] text-center border-2 border-slate-600 shadow-inner">
                    <p class="mb-2 font-bold">{{ pm.operator }} Money Cameroun</p>
                    <p class="mb-3">Autoriser le débit de {{ formatMoney(pm.amount) }} pour TECHSUPPLIES ?</p>
                    <div class="flex justify-center space-x-2">
                      <button @click="confirmUssdPayment(pm, true)" class="px-3 py-1 bg-green-600 text-white rounded font-bold hover:bg-green-700">1: Valider (PIN 1234)</button>
                      <button @click="confirmUssdPayment(pm, false)" class="px-3 py-1 bg-red-600 text-white rounded font-bold hover:bg-red-700">2: Annuler</button>
                    </div>
                  </div>
                  
                  <p v-else-if="pm.ussdStatus === 'SUCCESS'" class="text-xs text-green-600 dark:text-green-400 font-bold text-center">
                    ✓ Débit USSD effectué avec succès !
                  </p>
                  <p v-else-if="pm.ussdStatus === 'CANCELLED'" class="text-xs text-red-600 dark:text-red-400 font-bold text-center">
                    ✗ Paiement USSD rejeté ou expiré.
                  </p>
                </div>
              </div>

              <!-- Card Payment Simulation -->
              <div v-if="pm.method === 'Card'" class="space-y-3">
                <div class="border border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900/30 p-3 rounded-lg">
                  <div class="flex justify-between items-center text-xs text-blue-800 dark:text-blue-400 font-bold mb-2">
                    <span class="flex items-center space-x-1">
                      <WifiIcon class="h-4 w-4 animate-pulse text-blue-500" />
                      <span>Terminal de Paiement (TPE)</span>
                    </span>
                    <span>{{ pm.cardStatus || 'En attente...' }}</span>
                  </div>

                  <div v-if="!pm.cardStatus" class="flex flex-col items-center justify-center p-3 text-center space-y-3">
                    <p class="text-xs text-slate-500">Demander au client d'insérer ou approcher sa carte Visa / Mastercard.</p>
                    <button @click="simulateCardInsert(pm)" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition shadow">
                      Simuler insertion carte
                    </button>
                  </div>

                  <div v-else-if="pm.cardStatus === 'PROCESSING'" class="flex flex-col items-center justify-center p-3">
                    <span class="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                    <p class="text-xs font-bold text-blue-800 mt-2">Communication bancaire...</p>
                  </div>

                  <div v-else-if="pm.cardStatus === 'SUCCESS'" class="text-xs text-green-600 dark:text-green-400 font-bold text-center py-2">
                    ✓ Transaction de {{ formatMoney(pm.amount) }} approuvée par Visa/Mastercard (Code: AUTH-{{ Math.floor(100000+Math.random()*900000) }})
                  </div>
                </div>
              </div>

              <!-- Avoir Simulation -->
              <div v-if="pm.method === 'Avoir'" class="space-y-2">
                <label class="block text-[10px] uppercase font-bold text-[var(--color-text-muted)] mb-1">Code du bon d'avoir</label>
                <div class="flex space-x-2">
                  <input type="text" v-model="pm.voucherCode" placeholder="Ex: AV-9876" class="w-full p-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-xs font-bold uppercase" />
                  <button @click="verifyVoucher(pm)" class="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 transition">Vérifier</button>
                </div>
                <div v-if="pm.voucherResult" class="text-xs font-bold text-center mt-1 p-2 rounded" :class="pm.voucherResult.success ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/20 dark:text-purple-300' : 'bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-300'">
                  {{ pm.voucherResult.message }}
                </div>
              </div>

            </div>
            
            <div v-if="activePayments.length === 0" class="text-center text-[var(--color-text-muted)] py-12 text-sm">
              <BanknotesIcon class="h-12 w-12 mx-auto opacity-20 mb-2" />
              <span>Veuillez sélectionner un mode de paiement à gauche pour commencer le règlement.</span>
            </div>
          </div>

          <!-- Action validations -->
          <div class="space-y-3 pt-3 border-t border-[var(--color-border)]">
            <button 
              @click="validateTransaction" 
              :disabled="remainingToPay > 0 || activePayments.length === 0 || isProcessingValidation"
              class="w-full py-4 bg-emerald-500 text-white font-black text-lg rounded-xl shadow-lg hover:bg-emerald-600 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center space-x-2 shadow-emerald-500/20"
            >
              <CheckCircleIcon class="h-6 w-6" />
              <span>VALIDER LA TRANSACTION ({{ formatMoney(finalTotal) }})</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- TICKET / RECEIPT MODAL -->
    <div v-if="isTicketModalOpen" @click.self="closeTicketModal" class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm cursor-pointer">
      <div class="bg-[var(--color-surface)] rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-[var(--color-border)] flex flex-col animate-in zoom-in-95 duration-200 cursor-default">
        <!-- Receipt header/actions -->
        <div class="px-6 py-4 bg-[var(--color-surface-hover)] border-b border-[var(--color-border)] flex justify-between items-center">
          <span class="font-bold text-sm text-[var(--color-text-primary)]">Ticket de caisse généré</span>
          <div class="flex space-x-1">
            <button @click="downloadReceiptPDF" class="p-2 text-indigo-500 hover:bg-indigo-500/10 rounded-lg transition" title="Télécharger PDF (jsPDF)">
              <ArrowDownTrayIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <!-- Ticket Content (80mm styling simulation) -->
        <div id="receipt-print" class="p-6 bg-white text-black font-mono text-xs overflow-y-auto max-h-[50vh]">
          <div class="text-center mb-4 whitespace-pre-line font-bold text-sm">
            {{ vendor_settings.receiptHeader }}
          </div>
          <div class="text-center mb-4 text-[10px] space-y-0.5 text-slate-700">
            <div>Ticket ID : {{ lastTransaction?.id }}</div>
            <div>Date : {{ formatDate(lastTransaction?.date) }}</div>
            <div>Caisse : {{ lastTransaction?.storeId }} | Caissier : {{ currentSession?.cashierName }}</div>
          </div>
          
          <div class="border-t border-b border-black py-2 mb-2 border-dashed">
            <div class="flex justify-between font-bold mb-1 text-[11px]">
              <span>Désignation</span>
              <span>Total</span>
            </div>
            <div v-for="item in lastTransaction?.items" :key="item.product.id" class="mb-1 text-[10px]">
              <div class="truncate max-w-[240px] font-bold">{{ item.product.name }}</div>
              <div class="flex justify-between pl-2 text-slate-700">
                <span>{{ item.quantity }} x {{ formatRawPrice(item.product.price) }}</span>
                <span>{{ formatRawPrice(item.quantity * item.product.price) }}</span>
              </div>
              <div v-if="item.discountPercent > 0" class="flex justify-between pl-2 text-red-600 text-[9px] italic">
                <span>Remise {{ item.discountPercent }}%</span>
                <span>-{{ formatRawPrice(Math.round((item.quantity * item.product.price) * (item.discountPercent/100))) }}</span>
              </div>
            </div>
          </div>

          <div class="space-y-1 mb-2 text-[10px] text-slate-800">
            <div class="flex justify-between">
              <span>Sous-total Brut</span>
              <span>{{ formatRawPrice(lastTransaction?.subtotal + (lastTransaction?.discount || 0)) }} FCFA</span>
            </div>
            <div class="flex justify-between text-red-600" v-if="lastTransaction?.discount > 0">
              <span>Remise globale</span>
              <span>-{{ formatRawPrice(lastTransaction?.discount) }} FCFA</span>
            </div>
            <div class="flex justify-between">
              <span>TVA ({{ vendor_settings.taxRate }}%)</span>
              <span>{{ formatRawPrice(lastTransaction?.tax) }} FCFA</span>
            </div>
          </div>

          <div class="flex justify-between text-sm font-black border-t border-black pt-2 mb-4">
            <span>TOTAL TTC</span>
            <span>{{ formatRawPrice(lastTransaction?.total) }} FCFA</span>
          </div>

          <div class="space-y-1 border-t border-black border-dashed pt-2 mb-4 text-[10px] text-slate-800">
            <div v-for="pm in lastTransaction?.payments" :key="pm.method" class="flex justify-between">
              <span>{{ pm.method }}</span>
              <span>{{ formatRawPrice(pm.amount) }} FCFA</span>
            </div>
            <div class="flex justify-between font-bold text-green-700 mt-1" v-if="lastTransaction?.payments.some(p => p.method === 'Cash' && p.change > 0)">
              <span>Rendu Monnaie</span>
              <span>{{ formatRawPrice(lastTransaction?.payments.find(p => p.method === 'Cash')?.change) }} FCFA</span>
            </div>
          </div>

          <div class="flex flex-col items-center justify-center my-4">
            <QrCodeIcon class="h-20 w-20 text-black" />
            <span class="text-[9px] text-slate-500 mt-1">Scanner pour valider le ticket</span>
          </div>

          <div class="text-center whitespace-pre-line text-[9px] italic text-slate-600 border-t pt-2">
            {{ vendor_settings.receiptFooter }}
          </div>
        </div>

        <div class="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface-hover)] flex space-x-3">
          <button @click="printReceipt" class="flex-1 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl shadow hover:opacity-90 flex justify-center items-center space-x-2">
            <PrinterIcon class="h-4 w-4" />
            <span>Imprimer</span>
          </button>
          <button @click="closeTicketModal" class="flex-1 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] font-bold rounded-xl shadow hover:bg-[var(--color-surface-elevated)] flex justify-center items-center space-x-2">
            <ArrowRightIcon class="h-4 w-4" />
            <span>Suivant (F4)</span>
          </button>
        </div>
      </div>
    </div>

    <!-- CLOSE SESSION MODAL -->
    <div v-if="isCloseModalOpen" @click.self="isCloseModalOpen = false" class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm cursor-pointer">
      <div class="bg-[var(--color-surface)] rounded-2xl shadow-2xl w-full max-w-md p-6 border border-[var(--color-border)] animate-in fade-in zoom-in-95 duration-200 cursor-default">
        <h3 class="text-lg font-bold mb-4 text-[var(--color-text-primary)] flex items-center space-x-2 border-b pb-2">
          <PowerIcon class="h-6 w-6 text-red-500" />
          <span>Fermeture de Caisse (Rapport Z)</span>
        </h3>
        
        <div class="space-y-4 mb-6">
          <div class="bg-[var(--color-surface-hover)] p-4 rounded-xl border border-[var(--color-border)] space-y-2">
            <div class="flex justify-between text-xs">
              <span class="text-[var(--color-text-secondary)]">Fonds de caisse initial</span>
              <span class="font-bold">{{ formatMoney(currentSession.floatAmount) }}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-[var(--color-text-secondary)]">Ventes totales en espèces</span>
              <span class="font-bold text-emerald-500">{{ formatMoney(cashSales) }}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-[var(--color-text-secondary)]">Ventes Mobile Money</span>
              <span class="font-bold text-orange-500">{{ formatMoney(momoSales) }}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-[var(--color-text-secondary)]">Ventes Carte Bancaire</span>
              <span class="font-bold text-blue-500">{{ formatMoney(cardSales) }}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-[var(--color-text-secondary)]">Ventes par Bon d'Avoir</span>
              <span class="font-bold text-purple-500">{{ formatMoney(avoirSales) }}</span>
            </div>
            <div class="flex justify-between text-sm border-t border-[var(--color-border)] pt-2 mt-2 font-bold">
              <span class="text-[var(--color-text-primary)]">Total théorique en espèces</span>
              <span class="text-[var(--color-primary)]">{{ formatMoney(currentSession.floatAmount + cashSales) }}</span>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">Montant espèces réel compté (FCFA)</label>
            <div class="relative">
              <input type="number" v-model.number="endCash" class="w-full p-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-lg font-bold focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none" />
              <div class="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-[var(--color-text-muted)]">FCFA</div>
            </div>
          </div>

          <div v-if="endCash !== null" class="p-3 rounded-xl border text-xs font-bold text-center transition" :class="discrepancy === 0 ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'">
            Écart de caisse : {{ formatMoney(discrepancy) }}
            <p class="text-[10px] font-normal mt-0.5 text-slate-500" v-if="discrepancy !== 0">
              {{ discrepancy > 0 ? 'Surplus de caisse' : 'Déficit de caisse' }}
            </p>
          </div>
        </div>

        <div class="flex space-x-3">
          <button @click="isCloseModalOpen = false" class="flex-1 py-3 bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] border border-[var(--color-border)] font-bold rounded-xl hover:bg-[var(--color-surface-elevated)] transition">
            Annuler
          </button>
          <button @click="closeSession" :disabled="endCash === null" class="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl shadow hover:bg-red-600 transition disabled:opacity-50 flex justify-center items-center space-x-2">
            <PowerIcon class="h-5 w-5" />
            <span>Fermer la Caisse</span>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/store/modules/auth.js';
import { useToast } from 'vue-toastification';
import { jsPDF } from 'jspdf';
import { 
  stores, vendor_products, categories, pos_sessions, transactions, vendor_settings 
} from '@/utils/vendor_db.js';
import { 
  MagnifyingGlassIcon, TrashIcon, XMarkIcon, PlusIcon, MinusIcon, 
  BanknotesIcon, DevicePhoneMobileIcon, CreditCardIcon, TicketIcon, CheckCircleIcon,
  PrinterIcon, ArrowRightIcon, QrCodeIcon, LockClosedIcon, PowerIcon, WifiIcon,
  BuildingStorefrontIcon, ArrowDownTrayIcon, DocumentTextIcon, ShoppingCartIcon
} from '@heroicons/vue/24/outline';

const authStore = useAuthStore();
const toast = useToast();

const isProcessingValidation = ref(false);

// Active stores list for current vendor
const activeStores = computed(() => {
  return stores.value.filter(s => s.status === 'Active');
});

// Session State
const currentSession = ref(null);
const sessionForm = ref({
  storeId: activeStores.value[0]?.id || '',
  cashierName: authStore.user?.name || 'Caissier Référent',
  floatAmount: 10000 // 10,000 FCFA par défaut
});

// Check open session on mount
onMounted(() => {
  const openSession = pos_sessions.value.find(s => s.status === 'Open');
  if (openSession) {
    currentSession.value = openSession;
  }
});

function openSession() {
  if (!sessionForm.value.storeId) {
    toast.error('Veuillez sélectionner un point de vente.');
    return;
  }
  const newSession = {
    id: 'SESS-' + Date.now(),
    storeId: sessionForm.value.storeId,
    cashierName: sessionForm.value.cashierName,
    openingTime: new Date().toISOString(),
    closingTime: null,
    floatAmount: sessionForm.value.floatAmount || 0,
    endCash: null,
    status: 'Open'
  };
  pos_sessions.value.push(newSession);
  currentSession.value = newSession;
  toast.success('Caisse ouverte avec succès !');
  setTimeout(focusSearch, 200);
}

// POS Search State
const searchQuery = ref('');
const searchInput = ref(null);
let searchTimeout = null;
const selectedCategory = ref('ALL');

const displayedProducts = computed(() => {
  let filtered = vendor_products.value;
  if (selectedCategory.value !== 'ALL') {
    filtered = filtered.filter(p => p.category === selectedCategory.value);
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.barcode.includes(q));
  }
  return filtered;
});

function handleSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    // If exact barcode match, auto add to cart
    const exactMatch = vendor_products.value.find(p => p.barcode === searchQuery.value);
    if (exactMatch) {
      addToCart(exactMatch);
      searchQuery.value = '';
    }
  }, 300); // 300ms debounce
}

function simulateBarcodeScan() {
  // Pick a random product from DB
  const randomProduct = vendor_products.value[Math.floor(Math.random() * vendor_products.value.length)];
  if (randomProduct) {
    searchQuery.value = randomProduct.barcode;
    handleSearch();
    // Simulate scanner sound
    playBeepSound();
    toast.info(`Code-barres détecté : ${randomProduct.barcode} (${randomProduct.name})`);
  }
}

function playBeepSound() {
  try {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.connect(gain);
    gain.connect(context.destination);
    osc.frequency.value = 1046.50; // C6 note (high pitched beep)
    gain.gain.setValueAtTime(0, context.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.02);
    gain.gain.linearRampToValueAtTime(0, context.currentTime + 0.15);
    osc.start(context.currentTime);
    osc.stop(context.currentTime + 0.16);
  } catch (e) {
    console.log('Audio Context scan simulation failed or blocked.', e);
  }
}

function focusSearch() {
  if (searchInput.value) {
    searchInput.value.focus();
  }
}

// Cart State
const cart = ref([]);
const globalDiscount = ref(0);

function addToCart(product) {
  if (product.stock <= 0) {
    toast.error('Rupture de stock pour cet article !');
    return;
  }
  const existing = cart.value.find(i => i.product.id === product.id);
  if (existing) {
    if (existing.quantity >= product.stock) {
      toast.warning('Quantité maximale disponible en stock atteinte.');
      return;
    }
    existing.quantity++;
  } else {
    cart.value.push({ product, quantity: 1, discountPercent: 0 });
  }
  playBeepSound();
}

function removeFromCart(index) {
  cart.value.splice(index, 1);
}

function updateQty(index, delta) {
  const item = cart.value[index];
  if (!item) return;
  const newQty = item.quantity + delta;
  if (newQty <= 0) {
    removeFromCart(index);
  } else if (newQty > item.product.stock) {
    toast.warning('Stock insuffisant en magasin.');
  } else {
    item.quantity = newQty;
  }
}

function clearCart() {
  cart.value = [];
  globalDiscount.value = 0;
}

const totalItems = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0));

const subtotal = computed(() => {
  return cart.value.reduce((sum, item) => {
    const itemTotal = item.quantity * item.product.price;
    const itemDiscount = itemTotal * ((item.discountPercent || 0) / 100);
    return sum + (itemTotal - itemDiscount);
  }, 0);
});

const totalDiscountValue = computed(() => {
  return subtotal.value * ((globalDiscount.value || 0) / 100);
});

const netSubtotal = computed(() => subtotal.value - totalDiscountValue.value);

const taxAmount = computed(() => {
  return Math.round(netSubtotal.value * ((vendor_settings.value.taxRate || 19.25) / 100));
});

const finalTotal = computed(() => Math.round(netSubtotal.value + taxAmount.value));

// Payment Modal State
const isPaymentModalOpen = ref(false);
const activePayments = ref([]);

function openPaymentModal() {
  isPaymentModalOpen.value = true;
  activePayments.value = [];
  addPaymentMethod('Cash'); // Cash is default
}

function addPaymentMethod(method) {
  if (remainingToPay.value <= 0 && activePayments.value.length > 0) return;
  
  const paymentObj = {
    method,
    amount: remainingToPay.value > 0 ? remainingToPay.value : 0,
    tendered: method === 'Cash' ? (remainingToPay.value > 0 ? remainingToPay.value : 0) : null,
    change: 0
  };

  // Add properties for MobileMoney
  if (method === 'MobileMoney') {
    paymentObj.operator = 'MTN';
    paymentObj.phone = '';
    paymentObj.ussdStatus = null; // WAITING, SUCCESS, CANCELLED
  }

  // Add properties for Card
  if (method === 'Card') {
    paymentObj.cardStatus = null; // PROCESSING, SUCCESS
  }

  // Add properties for Voucher (Avoir)
  if (method === 'Avoir') {
    paymentObj.voucherCode = '';
    paymentObj.voucherResult = null;
  }

  activePayments.value.push(paymentObj);
}

function removePaymentMethod(index) {
  activePayments.value.splice(index, 1);
}

const totalPaid = computed(() => {
  return activePayments.value.reduce((sum, pm) => sum + (pm.amount || 0), 0);
});

const remainingToPay = computed(() => {
  return Math.max(0, finalTotal.value - totalPaid.value);
});

// Interactive Simulations
function triggerUssdPush(pm) {
  if (!pm.phone) {
    toast.warning("Veuillez saisir un numéro de téléphone.");
    return;
  }
  pm.ussdStatus = 'WAITING';
  toast.info("Lancement du push USSD au client...");
}

function confirmUssdPayment(pm, success) {
  if (success) {
    pm.ussdStatus = 'SUCCESS';
    toast.success(`Paiement Mobile Money de ${formatMoney(pm.amount)} validé !`);
  } else {
    pm.ussdStatus = 'CANCELLED';
    toast.error("Paiement Mobile Money annulé par le client.");
  }
}

function simulateCardInsert(pm) {
  pm.cardStatus = 'PROCESSING';
  setTimeout(() => {
    pm.cardStatus = 'SUCCESS';
    toast.success("Carte acceptée. Transaction approuvée !");
  }, 2000);
}

function verifyVoucher(pm) {
  if (!pm.voucherCode) {
    pm.voucherResult = { success: false, message: "Code manquant" };
    return;
  }
  // Simulate checking voucher
  const cleanCode = pm.voucherCode.trim().toUpperCase();
  if (cleanCode.startsWith('AV-')) {
    const mockValue = 15000; // Mock 15,000 FCFA credit note
    if (pm.amount > mockValue) {
      pm.voucherResult = { 
        success: true, 
        message: `Bon d'Avoir valide (Solde: ${formatMoney(mockValue)}). Reste à payer par d'autres moyens : ${formatMoney(pm.amount - mockValue)}` 
      };
      pm.amount = mockValue;
    } else {
      pm.voucherResult = { 
        success: true, 
        message: `Bon d'Avoir valide (Solde: ${formatMoney(mockValue)}). Bon utilisé en totalité.` 
      };
    }
  } else {
    pm.voucherResult = { success: false, message: "Code d'avoir invalide. Doit commencer par 'AV-'" };
  }
}

// Transaction Validation
const isTicketModalOpen = ref(false);
const lastTransaction = ref(null);

function validateTransaction() {
  let valid = true;
  
  activePayments.value.forEach(pm => {
    if (pm.method === 'Cash') {
      if ((pm.tendered || 0) < pm.amount) {
        toast.error('Le montant espèces remis est inférieur au montant dû.');
        valid = false;
      } else {
        pm.change = (pm.tendered || 0) - pm.amount;
      }
    }
    if (pm.method === 'MobileMoney' && pm.ussdStatus !== 'SUCCESS') {
      toast.error('Veuillez d\'abord valider la simulation de transaction USSD.');
      valid = false;
    }
    if (pm.method === 'Card' && pm.cardStatus !== 'SUCCESS') {
      toast.error('Veuillez insérer ou passer la carte bancaire sur le terminal.');
      valid = false;
    }
    if (pm.method === 'Avoir' && (!pm.voucherResult || !pm.voucherResult.success)) {
      toast.error('Veuillez valider le code de bon d\'avoir.');
      valid = false;
    }
  });

  if (!valid) return;

  isProcessingValidation.value = true;

  // Build transaction model
  const tx = {
    id: 'TX-' + Date.now(),
    sessionId: currentSession.value.id,
    storeId: currentSession.value.storeId,
    type: 'POS',
    items: JSON.parse(JSON.stringify(cart.value)),
    subtotal: subtotal.value,
    discount: totalDiscountValue.value,
    tax: taxAmount.value,
    total: finalTotal.value,
    payments: JSON.parse(JSON.stringify(activePayments.value.map(pm => ({
      method: pm.method,
      amount: pm.amount,
      change: pm.change || 0
    })))),
    status: 'Completed',
    date: new Date().toISOString()
  };

  // Add to DB
  transactions.value.push(tx);
  lastTransaction.value = tx;

  // Deduct Stocks FIFO/Store Inventory
  cart.value.forEach(item => {
    const prod = vendor_products.value.find(p => p.id === item.product.id);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - item.quantity);
    }
  });

  isProcessingValidation.value = false;
  isPaymentModalOpen.value = false;
  isTicketModalOpen.value = true;
  toast.success('Facture encaissée avec succès !');
}

function printReceipt() {
  window.print();
}

// jsPDF Receipt Generation
function downloadReceiptPDF() {
  if (!lastTransaction.value) return;
  
  const tx = lastTransaction.value;
  const doc = new jsPDF({
    unit: 'mm',
    format: [80, 150 + (tx.items.length * 10)] // width 80mm, custom height based on item count
  });

  doc.setFont('courier', 'normal');
  doc.setFontSize(8);

  let y = 10;
  // Header
  const headerLines = doc.splitTextToSize(vendor_settings.value.receiptHeader, 70);
  doc.text(headerLines, 40, y, { align: 'center' });
  y += headerLines.length * 4 + 4;

  // Meta
  doc.text(`TICKET ID: ${tx.id}`, 5, y);
  y += 4;
  doc.text(`DATE: ${formatDate(tx.date)}`, 5, y);
  y += 4;
  doc.text(`CAISSIER: ${currentSession.value?.cashierName || 'Standard'}`, 5, y);
  y += 4;
  doc.text(`BOUTIQUE: ${tx.storeId}`, 5, y);
  y += 3;

  doc.line(5, y, 75, y); // Separator
  y += 4;

  // Table header
  doc.setFont('courier', 'bold');
  doc.text('Article', 5, y);
  doc.text('Total (FCFA)', 75, y, { align: 'right' });
  y += 4;
  doc.setFont('courier', 'normal');

  // Items
  tx.items.forEach(item => {
    // Print item name
    const nameLines = doc.splitTextToSize(item.product.name, 45);
    doc.text(nameLines, 5, y);
    
    // Print values
    const itemTotalStr = `${item.quantity * item.product.price}`;
    doc.text(itemTotalStr, 75, y, { align: 'right' });
    y += 4;
    
    // Sub-details
    doc.text(`  ${item.quantity} x ${item.product.price}`, 5, y);
    y += 4;
    
    if (item.discountPercent > 0) {
      doc.text(`  Remise ${item.discountPercent}% : -${Math.round((item.quantity * item.product.price) * (item.discountPercent/100))}`, 5, y);
      y += 4;
    }
  });

  doc.line(5, y, 75, y);
  y += 4;

  // Totals
  doc.text(`Sous-total Brut:`, 5, y);
  doc.text(`${tx.subtotal + tx.discount} FCFA`, 75, y, { align: 'right' });
  y += 4;

  if (tx.discount > 0) {
    doc.text(`Remise globale:`, 5, y);
    doc.text(`-${tx.discount} FCFA`, 75, y, { align: 'right' });
    y += 4;
  }

  doc.text(`TVA (19.25%):`, 5, y);
  doc.text(`${tx.tax} FCFA`, 75, y, { align: 'right' });
  y += 4;

  doc.setFont('courier', 'bold');
  doc.setFontSize(10);
  doc.text(`TOTAL TTC:`, 5, y);
  doc.text(`${tx.total} FCFA`, 75, y, { align: 'right' });
  y += 5;
  doc.setFontSize(8);
  doc.setFont('courier', 'normal');

  doc.line(5, y, 75, y);
  y += 4;

  // Payments
  tx.payments.forEach(pm => {
    doc.text(`${pm.method}:`, 5, y);
    doc.text(`${pm.amount} FCFA`, 75, y, { align: 'right' });
    y += 4;
  });

  // Change
  const cashPm = tx.payments.find(p => p.method === 'Cash');
  if (cashPm && cashPm.change > 0) {
    doc.text(`Monnaie rendue:`, 5, y);
    doc.text(`${cashPm.change} FCFA`, 75, y, { align: 'right' });
    y += 4;
  }

  y += 2;
  // Footer
  const footerLines = doc.splitTextToSize(vendor_settings.value.receiptFooter, 70);
  doc.text(footerLines, 40, y, { align: 'center' });

  // Save PDF
  doc.save(`Ticket_${tx.id}.pdf`);
  toast.success('Le ticket PDF a été généré et téléchargé.');
}

function closeTicketModal() {
  isTicketModalOpen.value = false;
  clearCart();
  setTimeout(focusSearch, 200);
}

// Close Session State
const isCloseModalOpen = ref(false);
const endCash = ref(null);

const sessionTransactions = computed(() => {
  if (!currentSession.value) return [];
  return transactions.value.filter(tx => tx.sessionId === currentSession.value.id);
});

// Calculate sales per payment method for session Z-Report
const cashSales = computed(() => {
  return sessionTransactions.value.reduce((sum, tx) => {
    const payments = tx.payments.filter(p => p.method === 'Cash');
    return sum + payments.reduce((s, p) => s + p.amount, 0);
  }, 0);
});

const momoSales = computed(() => {
  return sessionTransactions.value.reduce((sum, tx) => {
    const payments = tx.payments.filter(p => p.method === 'MobileMoney');
    return sum + payments.reduce((s, p) => s + p.amount, 0);
  }, 0);
});

const cardSales = computed(() => {
  return sessionTransactions.value.reduce((sum, tx) => {
    const payments = tx.payments.filter(p => p.method === 'Card');
    return sum + payments.reduce((s, p) => s + p.amount, 0);
  }, 0);
});

const avoirSales = computed(() => {
  return sessionTransactions.value.reduce((sum, tx) => {
    const payments = tx.payments.filter(p => p.method === 'Avoir');
    return sum + payments.reduce((s, p) => s + p.amount, 0);
  }, 0);
});

const expectedCash = computed(() => {
  if (!currentSession.value) return 0;
  return currentSession.value.floatAmount + cashSales.value;
});

const discrepancy = computed(() => {
  if (endCash.value === null) return 0;
  return endCash.value - expectedCash.value;
});

function closeSession() {
  const session = pos_sessions.value.find(s => s.id === currentSession.value.id);
  if (session) {
    session.closingTime = new Date().toISOString();
    session.endCash = endCash.value;
    session.discrepancy = discrepancy.value;
    session.cashSales = cashSales.value;
    session.momoSales = momoSales.value;
    session.cardSales = cardSales.value;
    session.avoirSales = avoirSales.value;
    session.status = 'Closed';
    
    currentSession.value = null;
    isCloseModalOpen.value = false;
    toast.success('Caisse clôturée avec succès. Rapport Z enregistré.');
    endCash.value = null;
  }
}

// Generate X-Report (comptage mi-journée)
function generateReportX() {
  if (!currentSession.value) return;

  const doc = new jsPDF({
    unit: 'mm',
    format: [80, 140]
  });

  doc.setFont('courier', 'bold');
  doc.setFontSize(10);
  doc.text("RAPPORT X (MI-JOURNÉE)", 40, 10, { align: 'center' });
  doc.line(5, 12, 75, 12);
  
  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  let y = 18;
  doc.text(`SESSION ID : ${currentSession.value.id}`, 5, y);
  y += 4;
  doc.text(`MAGASIN : ${currentSession.value.storeId}`, 5, y);
  y += 4;
  doc.text(`CAISSIER : ${currentSession.value.cashierName}`, 5, y);
  y += 4;
  doc.text(`DATE : ${new Date().toLocaleString('fr-FR')}`, 5, y);
  y += 6;

  doc.line(5, y, 75, y);
  y += 4;

  doc.setFont('courier', 'bold');
  doc.text("FLUX DE TRÉSORERIE", 5, y);
  y += 4;
  doc.setFont('courier', 'normal');

  doc.text(`Fonds Initial:`, 5, y);
  doc.text(`${currentSession.value.floatAmount} FCFA`, 75, y, { align: 'right' });
  y += 4;

  doc.text(`Ventes Cash:`, 5, y);
  doc.text(`${cashSales.value} FCFA`, 75, y, { align: 'right' });
  y += 4;

  doc.setFont('courier', 'bold');
  doc.text(`Trésorerie attendue:`, 5, y);
  doc.text(`${currentSession.value.floatAmount + cashSales.value} FCFA`, 75, y, { align: 'right' });
  y += 6;

  doc.line(5, y, 75, y);
  y += 4;

  doc.text("AUTRES MODES PAIEMENT", 5, y);
  y += 4;
  doc.setFont('courier', 'normal');

  doc.text(`Mobile Money:`, 5, y);
  doc.text(`${momoSales.value} FCFA`, 75, y, { align: 'right' });
  y += 4;

  doc.text(`Carte Bancaire:`, 5, y);
  doc.text(`${cardSales.value} FCFA`, 75, y, { align: 'right' });
  y += 4;

  doc.text(`Bons d'Avoir:`, 5, y);
  doc.text(`${avoirSales.value} FCFA`, 75, y, { align: 'right' });
  y += 6;

  doc.line(5, y, 75, y);
  y += 4;
  doc.setFont('courier', 'bold');
  doc.text(`TOTAL DES VENTES :`, 5, y);
  doc.text(`${cashSales.value + momoSales.value + cardSales.value + avoirSales.value} FCFA`, 75, y, { align: 'right' });

  doc.save(`RapportX_${currentSession.value.id}.pdf`);
  toast.success('Rapport X (PDF) généré avec succès.');
}

// Helpers
function formatMoney(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val || 0).replace('XAF', 'FCFA');
}

function formatRawPrice(val) {
  return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0 }).format(val || 0);
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('fr-FR');
}

// Global hotkeys (F2: Pay, F4: Next ticket, Esc: Close modals)
function handleKeydown(e) {
  if (e.key === 'F2') {
    e.preventDefault();
    if (cart.value.length > 0 && !isPaymentModalOpen.value && !isTicketModalOpen.value) {
      openPaymentModal();
    }
  } else if (e.key === 'F4') {
    e.preventDefault();
    if (isTicketModalOpen.value) {
      closeTicketModal();
    }
  } else if (e.key === 'Escape') {
    isPaymentModalOpen.value = false;
    isCloseModalOpen.value = false;
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style>
/* Hide scrollbar for tabs */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@media print {
  @page { margin: 0; size: 80mm auto; }
  body * { visibility: hidden; }
  #receipt-print, #receipt-print * {
    visibility: visible;
  }
  #receipt-print {
    position: absolute;
    left: 0;
    top: 0;
    width: 80mm;
    padding: 5mm;
    font-family: monospace;
    font-size: 11px;
    background: white;
    color: black;
  }
}
</style>
