<template>
  <div class="space-y-6">
    <!-- WELCOME AND CLEAR LEVEL IDENTITY BANNER -->
    <div class="p-6 bg-gradient-to-r from-[var(--color-primary-muted)] via-[var(--color-surface-elevated)] to-[var(--color-primary-muted)] border border-[var(--color-primary-border)] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
      <div>
        <div class="flex items-center space-x-2 text-[var(--color-primary)] font-semibold text-xs tracking-wider">
          <span class="animate-ping h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          <span>Espace Fournisseur • Connexion Sécurisée</span>
        </div>
        <h1 class="text-2xl font-bold text-[var(--color-text-primary)] mt-1 font-sans">Bonjour, {{ kycDoc.managerName }}!</h1>
        <p class="text-sm text-[var(--color-text-secondary)] max-w-2xl mt-1 font-sans">
          Bienvenue sur l'espace de gestion de <strong class="text-[var(--color-primary)] font-semibold">{{ kycDoc.companyName }}</strong>. En tant que fournisseur agréé, vous pouvez recevoir et traiter les commandes, les demandes de devis (RFQ) et assurer l'approvisionnement des stocks de manière fluide.
        </p>
      </div>
      
      <!-- Quick KYC Approval Pill Badge -->
      <div class="bg-[var(--color-surface-hover)] border border-[var(--color-border)] p-3.5 rounded-xl flex items-center space-x-3 self-start md:self-center shrink-0">
        <div class="h-9 w-9 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full flex items-center justify-center font-bold text-lg select-none">
          ✓
        </div>
        <div>
          <span class="text-xs text-[var(--color-text-muted)] block font-medium">Statut de conformité</span>
          <span class="text-sm text-emerald-500 font-bold tracking-wide capitalize">{{ kycDoc.status }}</span>
        </div>
      </div>
    </div>

    <!-- CORE WARNING HUD: "IMPORTANT : Le fournisseur ne crée pas directement des ventes. Il reçoit..." -->
    <div class="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start space-x-3.5">
      <div class="text-xl mt-0.5 select-none">
        <ExclamationTriangleIcon class="h-6 w-6 text-amber-500" />
      </div>
      <div class="space-y-1">
        <h4 class="text-sm font-bold text-amber-500 tracking-wide">Mode de fonctionnement (Réception uniquement)</h4>
        <p class="text-xs text-[var(--color-text-secondary)] leading-relaxed font-sans">
          <strong>Note importante :</strong> Vous opérez en mode de traitement back-office. Vous ne participez pas aux ventes de détail. Votre rôle consiste exclusivement à recevoir, évaluer et exécuter les 
          <span class="text-[var(--color-primary)] font-semibold">Bons de commande</span>, 
          <span class="text-[var(--color-primary)] font-semibold">Demandes de devis (RFQ)</span>, et 
          <span class="text-[var(--color-primary)] font-semibold">Demandes de réapprovisionnement</span>.
        </p>
      </div>
    </div>

    <!-- KPI HIGHLIGHT CARDS -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      <!-- Escrow Balance -->
      <div class="p-5 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] hover:border-[var(--color-primary-border)] transition rounded-2xl flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg duration-300">
        <div class="flex items-center justify-between">
          <span class="text-sm font-semibold text-[var(--color-text-secondary)]">Fonds en attente</span>
          <ShieldCheckIcon class="w-6 h-6 text-cyan-500" />
        </div>
        <div class="text-2xl font-bold text-[var(--color-text-primary)] mt-3">
          {{ formatCurrency(lockedEscrowBalance) }}
        </div>
        <p class="text-xs text-emerald-500 mt-2 flex items-center font-medium">
          <span>+2.4% ce mois</span>
        </p>
      </div>

      <!-- Card 2 -->
      <div class="p-5 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] hover:border-[var(--color-primary-border)] transition rounded-2xl flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg duration-300 relative overflow-hidden group">
        <div class="flex justify-between items-start">
          <span class="text-sm font-semibold text-[var(--color-text-secondary)]">Commandes reçues</span>
          <DocumentCheckIcon class="w-6 h-6 text-[var(--color-primary)]" />
        </div>
        <div class="mt-3 text-2xl font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
          <span>{{ ordersCount }}</span>
          <span v-if="pendingOrdersCount > 0" class="text-xs bg-[var(--color-primary-muted)] text-[var(--color-primary)] px-2 py-0.5 rounded-full font-bold animate-pulse border border-[var(--color-primary-border)]">
            {{ pendingOrdersCount }} NOUVELLES
          </span>
        </div>
        <p class="text-xs text-[var(--color-text-muted)] mt-2 font-medium">En attente de traitement</p>
      </div>

      <!-- RFQs Pending -->
      <div class="p-5 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] hover:border-[var(--color-primary-border)] transition rounded-2xl flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg duration-300">
        <div class="flex items-center justify-between">
          <span class="text-sm font-semibold text-[var(--color-text-secondary)]">Devis en attente</span>
          <DocumentTextIcon class="w-6 h-6 text-amber-500" />
        </div>
        <div class="text-2xl font-bold text-[var(--color-text-primary)] mt-3">
          {{ pendingRFQsCount }}
        </div>
        <p class="text-xs text-red-400 mt-2 flex items-center font-medium">
          <span>-2.4% cette semaine</span>
        </p>
      </div>

      <!-- Ventes Mensuelles -->
      <div class="p-5 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] hover:border-[var(--color-primary-border)] transition rounded-2xl flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg duration-300">
        <div class="flex items-center justify-between">
          <span class="text-sm font-semibold text-[var(--color-text-secondary)]">Revenus totaux</span>
          <CurrencyDollarIcon class="w-6 h-6 text-emerald-500" />
        </div>
        <div class="text-2xl font-bold text-[var(--color-text-primary)] mt-3">
          {{ formattedTotalRevenue }}
        </div>
        <p class="text-xs text-emerald-500 mt-2 flex items-center font-medium">
          <span>+12.5% progression</span>
        </p>
      </div>

    </div>

    <!-- CORE WORKSPACE GRIDS -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- COLUMN 1 & 2: INBOUND QUEUE HUD (Bons de commande, RFQs, Stock requests) -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- BONS DE COMMANDE DIVISION -->
        <div class="p-6 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl shadow-sm">
          <div class="flex items-center justify-between border-b border-[var(--color-border)] pb-4 mb-4">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-[var(--color-primary-muted)] rounded-lg">
                <DocumentCheckIcon class="h-6 w-6 text-[var(--color-primary)]" />
              </div>
              <div>
                <h2 class="text-base font-bold text-[var(--color-text-primary)]">Bons de commande récents</h2>
                <span class="text-xs text-[var(--color-text-muted)] font-sans">Aperçu des accords d'achat soumis par les clients.</span>
              </div>
            </div>
            <router-link to="/supplier/orders" class="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center">
              Voir tout <ChevronRightIcon class="h-4 w-4 ml-1" />
            </router-link>
          </div>

          <!-- List of orders -->
          <div class="space-y-3">
            <div 
              v-for="order in recentOrders" 
              :key="order.id"
              class="p-4 bg-[var(--color-surface-hover)] border border-[var(--color-border)] hover:border-[var(--color-primary-border)] rounded-xl transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div class="space-y-1.5">
                <div class="flex items-center space-x-3">
                  <span class="text-sm font-bold text-[var(--color-text-primary)] uppercase">#{{ order.id }}</span>
                  <span class="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider" :class="getStatusBadgeClass(order.status)">
                    {{ order.status === 'Pending' ? 'En attente' : order.status === 'Ready' ? 'Prêt' : order.status === 'Delivered' ? 'Livré' : order.status === 'Canceled' ? 'Annulé' : order.status }}
                  </span>
                </div>
                <div class="text-xs text-[var(--color-text-secondary)] font-sans">
                  Client : <strong class="text-[var(--color-text-primary)]">{{ order.client?.name || order.client_name || 'Client Standard' }}</strong> • {{ order.items_count || order.items?.length || 2 }} Articles
                </div>
                <div class="text-xs text-[var(--color-text-muted)]">
                  Date : {{ order.created_at || order.date || '2026-06-17' }} • Destination : {{ order.delivery_city || 'Douala' }}
                </div>
              </div>

              <!-- Action metrics -->
              <div class="flex items-center gap-4 self-end sm:self-center">
                <span class="text-sm font-bold text-[var(--color-text-primary)]">
                  {{ formatCurrency(order.amount || order.total) }} FCFA
                </span>
                <button 
                  @click="openOrderDetailPopup(order)"
                  class="px-3 py-2 bg-[var(--color-surface-elevated)] hover:bg-[var(--color-primary-muted)] rounded-lg text-xs text-[var(--color-primary)] font-semibold transition border border-[var(--color-primary-border)] flex items-center space-x-1.5"
                >
                  <EyeIcon class="h-4 w-4" />
                  <span>Inspecter</span>
                </button>
              </div>
            </div>

            <div v-if="recentOrders.length === 0" class="text-center py-8 text-[var(--color-text-muted)] text-sm">
              Aucune commande reçue pour le moment.
            </div>
          </div>
        </div>

        <!-- RFQs DIVISION -->
        <div class="p-6 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl shadow-sm">
          <div class="flex items-center justify-between border-b border-[var(--color-border)] pb-4 mb-4">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-[var(--color-primary-muted)] rounded-lg">
                <ChatBubbleLeftRightIcon class="h-6 w-6 text-[var(--color-primary)]" />
              </div>
              <div>
                <h2 class="text-base font-bold text-[var(--color-text-primary)]">Demandes de devis (RFQ)</h2>
                <span class="text-xs text-[var(--color-text-muted)] font-sans">Clients demandant une tarification personnalisée pour un volume important.</span>
              </div>
            </div>
            <router-link to="/supplier/rfq/received" class="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center">
              Gérer les devis <ChevronRightIcon class="h-4 w-4 ml-1" />
            </router-link>
          </div>

          <!-- List of RFQs -->
          <div class="space-y-3">
            <div 
              v-for="rfq in inboundRFQs" 
              :key="rfq.id"
              class="p-4 bg-[var(--color-surface-hover)] border border-[var(--color-border)] hover:border-[var(--color-primary-border)] rounded-xl transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div class="space-y-1.5">
                <div class="flex items-center space-x-3">
                  <span class="text-sm font-bold text-[var(--color-text-primary)] uppercase">RFQ-{{ rfq.id }}</span>
                  <span class="text-[10px] bg-[var(--color-surface-elevated)] text-[var(--color-primary)] border border-[var(--color-primary-border)] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                    {{ rfq.status === 'Received' ? 'Reçu' : rfq.status }}
                  </span>
                </div>
                <p class="text-sm text-[var(--color-text-primary)] font-medium font-sans">
                  « {{ rfq.title || rfq.items?.[0]?.name || 'Accord d\'approvisionnement' }} »
                </p>
                <div class="text-xs text-[var(--color-text-secondary)] font-sans">
                  Volume ciblé : <strong class="text-[var(--color-text-primary)]">{{ rfq.items?.[0]?.qty || '5000' }} kg</strong> • Budget cible : {{ rfq.items?.[0]?.target || 'Négociable' }}
                </div>
                <div class="text-xs text-[var(--color-text-muted)]">
                  Échéance : {{ rfq.deadline }}
                </div>
              </div>

              <!-- Quick Quote submission popup trigger -->
              <div class="flex items-center self-end sm:self-center">
                <button 
                  @click="openRFQResponsePopup(rfq)"
                  class="px-3 py-2 bg-[var(--color-primary)] hover:opacity-90 text-white rounded-lg text-xs font-semibold transition flex items-center space-x-1.5"
                >
                  <PaperAirplaneIcon class="h-4 w-4" />
                  <span>Soumettre l'offre</span>
                </button>
              </div>
            </div>
            <div v-if="inboundRFQs.length === 0" class="text-center py-8 text-[var(--color-text-muted)] text-sm">
              Aucune demande de devis en attente.
            </div>
          </div>
        </div>

        <!-- DEMANDES DE STOCK & REPLENISHMENTS DIVISION -->
        <div class="p-6 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl shadow-sm">
          <div class="flex items-center justify-between border-b border-[var(--color-border)] pb-4 mb-4">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-[var(--color-primary-muted)] rounded-lg">
                <InboxStackIcon class="h-6 w-6 text-[var(--color-primary)]" />
              </div>
              <div>
                <h2 class="text-base font-bold text-[var(--color-text-primary)]">Réapprovisionnement de stock</h2>
                <span class="text-xs text-[var(--color-text-muted)] font-sans">Demandes de transfert vers les succursales et points de vente.</span>
              </div>
            </div>
            <router-link to="/supplier/products/stock" class="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center">
              Gestion de la file FIFO <ChevronRightIcon class="h-4 w-4 ml-1" />
            </router-link>
          </div>

          <!-- List of stock demands -->
          <div class="space-y-3">
            <div 
              v-for="demand in simulatedStockDemands" 
              :key="demand.id"
              class="p-4 bg-[var(--color-surface-hover)] border border-[var(--color-border)] hover:border-[var(--color-primary-border)] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition"
            >
              <div class="space-y-1.5">
                <div class="flex items-center space-x-3">
                  <span class="text-sm font-bold text-amber-500 uppercase">REPL-{{ demand.id }}</span>
                  <span class="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                    En attente d'allocation
                  </span>
                </div>
                <div class="text-sm text-[var(--color-text-primary)] font-medium font-sans">
                  Produit demandé : <strong>{{ demand.productName }}</strong>
                </div>
                <div class="text-xs text-[var(--color-text-secondary)]">
                  Volume requis : <span class="text-[var(--color-primary)] font-bold">{{ demand.requestedQty }} unités</span>
                </div>
                <div class="text-xs text-[var(--color-text-muted)]">
                  Source : {{ demand.sourceUnit }} • Extraction stricte FIFO
                </div>
              </div>

              <!-- FIFO Visual execution activator -->
              <div class="self-end sm:self-center">
                <button 
                  @click="simulateFIFOAllocation(demand)"
                  class="px-4 py-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg text-xs font-semibold border border-emerald-500/30 transition shadow-sm flex items-center space-x-2"
                >
                  <BoltIcon class="h-4 w-4" />
                  <span>Allouer le stock (FIFO)</span>
                </button>
              </div>
            </div>
            <div v-if="simulatedStockDemands.length === 0" class="text-center py-8 text-[var(--color-text-muted)] text-sm">
              Aucune demande de réapprovisionnement.
            </div>
          </div>
        </div>

      </div>

      <!-- RIGHT SIDEBAR (COLUMN 3): FIFO REAL-TIME QUEUE & KEY VERIFIED STORES -->
      <div class="space-y-6">
        
        <!-- FIFO QUEUE PREVIEW METRIC -->
        <div class="p-6 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl shadow-sm space-y-4">
          <div class="border-b border-[var(--color-border)] pb-3">
            <h3 class="text-sm font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
              <BoltIcon class="h-5 w-5 text-[var(--color-primary)]" />
              <span>État des lots FIFO</span>
            </h3>
            <span class="text-xs text-[var(--color-text-muted)] block mt-1">Aperçu de la séquence d'écoulement pour vos produits phares :</span>
          </div>

          <div class="space-y-4 select-none">
            <div 
              v-for="p in fifoHighrunners" 
              :key="p.id"
              class="p-3 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl space-y-2.5"
            >
              <div class="flex justify-between items-center text-xs">
                <span class="font-bold text-[var(--color-text-primary)] truncate max-w-[150px]">{{ p.name }}</span>
                <span class="text-[var(--color-text-secondary)] font-medium">{{ p.stock }} restants</span>
              </div>
              
              <!-- Batches lines progression -->
              <div class="space-y-1.5">
                <div 
                  v-for="(b, idx) in p.batches" 
                  :key="b.id"
                  class="flex justify-between items-center text-xs p-1.5 rounded-md transition"
                  :class="idx === 0 && b.qty > 0 ? 'bg-[var(--color-primary-muted)] border border-[var(--color-primary-border)] text-[var(--color-primary)] font-medium' : 'bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)]'"
                >
                  <span>Lot #{{ b.id }} ({{ b.date }}) :</span>
                  <span class="font-bold">{{ b.qty }} u @ {{ formatCurrency(b.price) }} FCFA</span>
                </div>
              </div>
            </div>
            <div v-if="fifoHighrunners.length === 0" class="text-center py-4 text-[var(--color-text-muted)] text-sm">
              Aucun lot configuré.
            </div>
          </div>
        </div>

        <!-- QUICK SYSTEM STATUS & LOGS -->
        <div class="p-6 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl shadow-sm space-y-3">
          <h3 class="text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-3 flex items-center space-x-2">
            <DocumentTextIcon class="h-5 w-5 text-[var(--color-text-muted)]" />
            <span>Audits de conformité récents</span>
          </h3>
          <div class="text-xs space-y-3 text-[var(--color-text-secondary)] select-none mt-3">
            <div class="leading-relaxed border-l-2 border-[var(--color-primary)] pl-3">
              <span class="text-[var(--color-text-primary)] font-bold block mb-0.5">Aujourd'hui, 04:30</span>
              Commandes XML entrantes traitées avec succès depuis le hub principal. Aucune erreur.
            </div>
            <div class="leading-relaxed border-l-2 border-emerald-500 pl-3">
              <span class="text-[var(--color-text-primary)] font-bold block mb-0.5">Aujourd'hui, 03:12</span>
              Pièces jointes sécurisées analysées. Statut vérifié par la gouvernance administrative.
            </div>
            <div class="leading-relaxed border-l-2 border-amber-500 pl-3">
              <span class="text-[var(--color-text-primary)] font-bold block mb-0.5">Hier, 19:20</span>
              Séquence de vidange FIFO déclenchée automatiquement pour l'appel de stock REPL-101.
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- POPUP MODALS -->
    <!-- 1. ORDER DETAIL & ACTION POPUP -->
    <Transition name="modal-fade">
      <div v-if="activeOrderPopup" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" @click.self="activeOrderPopup = null">
        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 md:p-8 w-full max-w-2xl shadow-2xl relative overflow-hidden text-[var(--color-text-primary)] modal-content flex flex-col max-h-[90vh]">
          <div class="flex justify-between items-start border-b border-[var(--color-border)] pb-4 mb-5 shrink-0">
            <div>
              <span class="text-[10px] text-[var(--color-primary)] px-2 py-1 rounded bg-[var(--color-primary-muted)] font-bold uppercase tracking-wider">Traitement de commande</span>
              <h3 class="text-xl font-bold tracking-wide mt-2 text-[var(--color-text-primary)]">Inspection de la Commande #{{ activeOrderPopup.id }}</h3>
            </div>
            <button @click="activeOrderPopup = null" class="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] p-1 rounded-md transition bg-[var(--color-surface-hover)]">
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>

          <div class="space-y-6 overflow-y-auto pr-2 scrollbar-thin">
            <!-- Client Card -->
            <div class="p-4 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl text-sm space-y-1.5">
              <div class="text-[var(--color-text-muted)] font-semibold mb-2">Informations de l'acheteur</div>
              <div class="font-bold text-[var(--color-text-primary)] text-base">{{ activeOrderPopup.client?.name || activeOrderPopup.client_name || 'Entreprise Acheteuse SA' }}</div>
              <div class="text-[var(--color-text-secondary)]">Téléphone : {{ activeOrderPopup.client?.phone || '+237 670 123 456' }}</div>
              <div class="text-[var(--color-text-secondary)]">Ville de livraison : {{ activeOrderPopup.delivery_city || 'Douala, Cameroun' }}</div>
            </div>

            <!-- Items Ledger -->
            <div class="space-y-3">
              <h4 class="text-sm font-bold text-[var(--color-text-secondary)] border-b border-[var(--color-border)] pb-2">Articles demandés</h4>
              <div class="space-y-2">
                <div 
                  v-for="item in activeOrderPopup.items" 
                  :key="item.id || item.productId"
                  class="flex justify-between items-center text-sm py-2 px-3 bg-[var(--color-surface-hover)] rounded-lg border border-[var(--color-border)]"
                >
                  <div>
                    <span class="font-bold text-[var(--color-text-primary)]">{{ item.name || 'Produit Agricole' }}</span>
                    <p class="text-xs text-[var(--color-text-muted)] mt-1">Qté : {{ item.qty || item.quantity }} unités • Prix U. : {{ formatCurrency(item.unitPrice || item.price) }} FCFA</p>
                  </div>
                  <span class="font-bold text-[var(--color-primary)]">
                    {{ formatCurrency((item.qty || item.quantity) * (item.unitPrice || item.price)) }} FCFA
                  </span>
                </div>
              </div>
            </div>

            <!-- Summary numbers -->
            <div class="flex justify-between items-center py-4 px-4 bg-[var(--color-primary-muted)] border border-[var(--color-primary-border)] rounded-xl">
              <span class="text-sm font-bold text-[var(--color-text-primary)]">Montant Total :</span>
              <span class="text-xl font-bold text-[var(--color-primary)]">{{ formatCurrency(activeOrderPopup.amount || activeOrderPopup.total) }} FCFA</span>
            </div>
          </div>

          <!-- Action tools -->
          <div class="mt-6 pt-4 border-t border-[var(--color-border)] flex justify-end space-x-3 shrink-0">
            <button 
              @click="rejectOrder(activeOrderPopup.id)"
              class="px-5 py-2.5 bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white rounded-lg text-sm font-semibold transition"
            >
              Refuser la commande
            </button>
            <button 
              @click="dispatchOrder(activeOrderPopup.id)"
              class="px-5 py-2.5 bg-emerald-500 text-white hover:opacity-90 rounded-lg text-sm font-semibold transition shadow-sm"
            >
              Exécuter et Expédier
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 2. RFQ RESPONSE POPUP -->
    <Transition name="modal-fade">
      <div v-if="activeRFQPopup" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" @click.self="activeRFQPopup = null">
        <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 md:p-8 w-full max-w-2xl shadow-2xl relative overflow-hidden text-[var(--color-text-primary)] modal-content">
          <div class="flex justify-between items-start border-b border-[var(--color-border)] pb-4 mb-5">
            <div>
              <span class="text-[10px] text-[var(--color-primary)] px-2 py-1 rounded bg-[var(--color-primary-muted)] font-bold uppercase tracking-wider">Réponse au Devis</span>
              <h3 class="text-xl font-bold tracking-wide mt-2 text-[var(--color-text-primary)]">Soumettre une offre détaillée</h3>
            </div>
            <button @click="activeRFQPopup = null" class="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] p-1 rounded-md transition bg-[var(--color-surface-hover)]">
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="submitRFQProposal" class="space-y-5">
            <div>
              <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Description de la demande</label>
              <div class="p-3 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)]">
                {{ activeRFQPopup.items?.[0]?.name || 'Approvisionnement standard' }}
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-xs font-semibold text-[var(--color-primary)] mb-1.5">Prix proposé (FCFA unitaire)</label>
                <input 
                  type="number" 
                  v-model="rfqForm.proposedPrice"
                  required 
                  class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                  placeholder="Ex: 1750"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Délai de livraison estimé (Jours)</label>
                <input 
                  type="number" 
                  v-model="rfqForm.etaDays"
                  required 
                  class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                  placeholder="Ex: 5"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Conditions de paiement et Spécifications techniques</label>
              <textarea 
                v-model="rfqForm.terms"
                rows="4"
                class="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm px-4 py-3 rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none transition"
                placeholder="Spécifiez les garanties de paiement, le certificat d'origine, etc..."
              ></textarea>
            </div>

            <!-- Form execution buttons -->
            <div class="pt-5 border-t border-[var(--color-border)] flex justify-end space-x-3">
              <button 
                type="button"
                @click="activeRFQPopup = null"
                class="px-5 py-2.5 bg-[var(--color-surface-hover)] hover:bg-[var(--color-border)] rounded-lg text-sm font-semibold transition text-[var(--color-text-primary)]"
              >
                Annuler
              </button>
              <button 
                type="submit"
                class="px-5 py-2.5 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-lg text-sm font-semibold transition shadow-sm"
              >
                Envoyer le devis
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- 3. COMPREHENSIVE FIFO OUTCOME STATUS ALERT MODAL -->
    <Transition name="modal-fade">
      <div v-if="fifoAllocationOutcome" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" @click.self="fifoAllocationOutcome = null">
        <div class="bg-[var(--color-surface-elevated)] border border-emerald-500/50 rounded-2xl p-6 w-full max-w-md shadow-2xl relative overflow-hidden text-[var(--color-text-primary)] modal-content">
          <div class="text-center space-y-4">
            <div class="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/30 flex items-center justify-center mx-auto">
              <BoltIcon class="h-8 w-8" />
            </div>
            <h3 class="text-lg font-bold text-[var(--color-text-primary)]">Stock FIFO alloué avec succès !</h3>
            <p class="text-sm text-[var(--color-text-secondary)] max-w-sm mx-auto">
              La demande a été résolue en utilisant l'approche stricte First In First Out (FIFO), en prélevant depuis le lot de stockage actif le plus ancien :
            </p>
          </div>

          <div class="mt-6 p-4 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-[var(--color-text-muted)] font-medium">Produit :</span>
              <span class="font-bold text-[var(--color-text-primary)]">{{ fifoAllocationOutcome.productName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-[var(--color-text-muted)] font-medium">Total demandé :</span>
              <span class="font-bold text-[var(--color-primary)]">{{ fifoAllocationOutcome.requestedQty }} unités</span>
            </div>
            
            <div class="pt-3 border-t border-[var(--color-border)] space-y-2">
              <span class="text-xs text-[var(--color-text-secondary)] block font-semibold">Lots consommés :</span>
              <div 
                v-for="b in fifoAllocationOutcome.consumedDetails" 
                :key="b.batchId"
                class="flex justify-between text-sm text-[var(--color-text-primary)] bg-[var(--color-background)] px-3 py-2 rounded-lg border border-[var(--color-border)]"
              >
                <span>Lot #{{ b.batchId }} ({{ b.date }})</span>
                <span class="text-emerald-500 font-bold">-{{ b.qty }} u</span>
              </div>
            </div>
          </div>

          <button 
            @click="fifoAllocationOutcome = null"
            class="mt-6 w-full py-3 bg-emerald-500 text-white hover:opacity-90 rounded-xl text-sm font-bold transition shadow-md"
          >
            Confirmer et Expédier
          </button>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { products, warehouses, orders, rfqs, kycDoc, purchaseFIFOStock } from '@/utils/supplier_db';
import { useToast } from 'vue-toastification';
import { 
  ExclamationTriangleIcon,
  DocumentCheckIcon,
  ChatBubbleLeftRightIcon,
  InboxStackIcon,
  EyeIcon,
  PaperAirplaneIcon,
  BoltIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ChevronRightIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline';

const toast = useToast();

const activeOrderPopup = ref(null);
const activeRFQPopup = ref(null);
const fifoAllocationOutcome = ref(null);

const rfqForm = ref({
  proposedPrice: '',
  etaDays: '',
  terms: ''
});

function handleEscKey(e) {
  if (e.key === 'Escape') {
    activeOrderPopup.value = null;
    activeRFQPopup.value = null;
    fifoAllocationOutcome.value = null;
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEscKey);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscKey);
});

const lockedEscrowBalance = ref(8450000);

const formattedTotalRevenue = computed(() => {
  const tot = orders.value
    .filter(o => o.status === 'Delivered' || o.status === 'Processing' || o.status === 'Completed' || o.status === 'Ready')
    .reduce((acc, o) => acc + (o.amount || o.total || 0), 125480000);
  return new Intl.NumberFormat('fr-FR').format(tot);
});

const ordersCount = computed(() => orders.value.length);
const pendingOrdersCount = computed(() => orders.value.filter(o => o.status === 'Pending' || o.status === 'Received').length);
const pendingRFQsCount = computed(() => rfqs.value.filter(r => r.status === 'Received' || r.status === 'Pending').length);
const activeProductsCount = computed(() => products.value.filter(p => p.stock > 0).length);

const recentOrders = computed(() => {
  return orders.value.slice(0, 5);
});

const inboundRFQs = computed(() => {
  return rfqs.value.filter(r => r.status === 'Received').slice(0, 3);
});

const simulatedStockDemands = ref([
  { id: '101', productId: 'p_1', productName: 'Engrais Bio NPK Bag', requestedQty: 400, sourceUnit: 'Boutique POS Douala' },
  { id: '102', productId: 'p_2', productName: 'Pompe Solaire MPPT 500W', requestedQty: 25, sourceUnit: 'Succursale Yaoundé' }
]);

const fifoHighrunners = computed(() => {
  return products.value.filter(p => (p.batches || []).length > 0).slice(0, 4);
});

function formatCurrency(val) {
  if (!val) return '0';
  return new Intl.NumberFormat('fr-FR').format(val);
}

function getStatusBadgeClass(status) {
  const norm = (status || '').toLowerCase();
  if (norm === 'pending' || norm === 'received') return 'bg-[var(--color-primary-muted)] text-[var(--color-primary)] border border-[var(--color-primary-border)]';
  if (norm === 'shipping' || norm === 'processing') return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
  if (norm === 'ready' || norm === 'delivered' || norm === 'completed') return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
  if (norm === 'canceled') return 'bg-red-500/10 text-red-500 border border-red-500/20';
  return 'bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] border border-[var(--color-border)]';
}

function openOrderDetailPopup(order) {
  activeOrderPopup.value = order;
}

function openRFQResponsePopup(rfq) {
  activeRFQPopup.value = rfq;
  rfqForm.value = {
    proposedPrice: Math.round(rfq.items?.[0]?.qty ? 1450 : 2200),
    etaDays: 7,
    terms: 'L\'offre inclut l\'emballage de transport et le dédouanement. Paiement sécurisé via Escrow.'
  };
}

function rejectOrder(id) {
  const o = orders.value.find(ord => ord.id === id);
  if (o) {
    o.status = 'Canceled';
    toast.error(`La commande #${id} a été refusée.`);
  }
  activeOrderPopup.value = null;
}

function dispatchOrder(id) {
  const o = orders.value.find(ord => ord.id === id);
  if (o) {
    const items = o.items || [];
    let messages = [];
    
    items.forEach(itm => {
      const result = purchaseFIFOStock(itm.productId, itm.qty || itm.quantity || 100);
      if (result && result.success) {
        messages.push(`${itm.name} : FIFO traité`);
      }
    });

    o.status = 'Ready';
    toast.success(`Commande #${id} validée et expédiée !`);
  }
  activeOrderPopup.value = null;
}

function simulateFIFOAllocation(demand) {
  const result = purchaseFIFOStock(demand.productId, demand.requestedQty);
  if (result && result.success) {
    fifoAllocationOutcome.value = {
      productName: demand.productName,
      requestedQty: demand.requestedQty,
      consumedDetails: result.consumedDetails
    };
    
    simulatedStockDemands.value = simulatedStockDemands.value.filter(d => d.id !== demand.id);
    toast.success('Allocation FIFO réussie.');
  } else {
    toast.error('Stock insuffisant dans les lots pour répondre à cette demande via la file FIFO.');
  }
}

function submitRFQProposal() {
  if (activeRFQPopup.value) {
    activeRFQPopup.value.status = 'Offer Sent';
    toast.success(`Devis envoyé pour la demande RFQ-${activeRFQPopup.value.id} !`);
  }
  activeRFQPopup.value = null;
}
</script>

<style scoped>
/* Modal fade animation */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .modal-content, .modal-fade-leave-to .modal-content {
  transform: translateY(20px) scale(0.95);
}
.modal-content {
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
</style>
