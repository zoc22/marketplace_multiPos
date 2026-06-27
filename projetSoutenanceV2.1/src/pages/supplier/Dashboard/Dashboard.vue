<template>
  <div class="space-y-6">
    <!-- WELCOME AND CLEAR LEVEL IDENTITY BANNER -->
    <div class="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/40 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
      <div>
        <div class="flex items-center space-x-2 text-indigo-400 font-mono text-[10px] uppercase font-bold tracking-widest">
          <span class="animate-ping h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          <span>Merchant Console • Secure Channel Established</span>
        </div>
        <h1 class="text-2xl font-bold text-slate-100 mt-1">Bonjour, {{ kycDoc.managerName }}!</h1>
        <p class="text-xs text-slate-400 max-w-2xl mt-1 font-sans">
          Welcome to the control hub for <strong class="text-indigo-300 font-semibold">{{ kycDoc.companyName }}</strong>. As an authorized supplier, your platform workflow has specific security partitions: <span class="text-indigo-400 underline decoration-indigo-700 decoration-wavy">you do not initiate retail sales</span>; instead, you fulfill global B2B assets via inbound demands.
        </p>
      </div>
      
      <!-- Quick KYC Approval Pill Badge -->
      <div class="bg-indigo-950/70 border border-indigo-500/30 p-3.5 rounded-xl flex items-center space-x-3 self-start md:self-center shrink-0">
        <div class="h-9 w-9 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center font-bold text-lg select-none">
          ✓
        </div>
        <div>
          <span class="text-[9px] text-[#5d6a94] uppercase font-mono block">Compliance State</span>
          <span class="text-xs text-emerald-400 font-mono font-bold tracking-wide uppercase">{{ kycDoc.status }} KYC PORTAL</span>
        </div>
      </div>
    </div>

    <!-- CORE WARNING HUD: "IMPORTANT : Le fournisseur ne crée pas directement des ventes. Il reçoit..." -->
    <div class="p-4 bg-amber-950/30 border border-amber-900/40 rounded-xl flex items-start space-x-3.5">
      <div class="text-xl mt-0.5 select-none">⚠️</div>
      <div class="space-y-1">
        <h4 class="text-xs font-mono font-bold uppercase text-amber-400 tracking-wider">REGULATORY RULE OF ENGAGEMENT (INBOUND-ONLY ENGINE)</h4>
        <p class="text-[11.5px] text-slate-300 leading-relaxed font-sans">
          <strong>Notice:</strong> High-volume suppliers do not participate in direct retail POS transactions or create manual customer checkouts. You operate in backoffice dispatch mode. You exclusively receive, evaluate, and fulfill 
          <span class="text-indigo-300 font-bold font-mono text-xs">Bons de commande</span>, 
          <span class="text-indigo-300 font-bold font-mono text-xs">RFQs (Request for Quotations)</span>, and 
          <span class="text-indigo-300 font-bold font-mono text-xs">Demandes de stock</span>.
        </p>
      </div>
    </div>

    <!-- KPI HIGHLIGHT CARDS -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      <div class="p-5 bg-[#090e24] border border-[#15204c]/80 rounded-xl relative overflow-hidden group hover:border-indigo-500/40 transition">
        <label class="block text-[9px] tracking-wider uppercase font-mono text-slate-400">Total B2B Fulfillments</label>
        <div class="mt-2 text-2xl font-bold text-slate-100 font-mono">
          {{ formattedTotalRevenue }} FCFA
        </div>
        <p class="text-[10px] text-slate-500 mt-1 font-mono">Based on completed dispatches</p>
        <span class="absolute right-4 bottom-4 font-bold text-3xl opacity-5 select-none text-indigo-400">📊</span>
      </div>

      <div class="p-5 bg-[#090e24] border border-[#15204c]/80 rounded-xl relative overflow-hidden group hover:border-indigo-500/40 transition">
        <label class="block text-[9px] tracking-wider uppercase font-mono text-slate-400">Incoming Orders (Bons)</label>
        <div class="mt-2 text-2xl font-semibold text-slate-100 font-mono flex items-center space-x-2">
          <span>{{ ordersCount }}</span>
          <span v-if="pendingOrdersCount > 0" class="text-xs bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded font-bold animate-pulse">
            {{ pendingOrdersCount }} NEW
          </span>
        </div>
        <p class="text-[10px] text-slate-500 mt-1 font-mono">Fulfillment clearance queues</p>
        <span class="absolute right-4 bottom-4 font-bold text-3xl opacity-5 select-none text-indigo-400">📋</span>
      </div>

      <div class="p-5 bg-[#090e24] border border-[#15204c]/80 rounded-xl relative overflow-hidden group hover:border-indigo-500/40 transition">
        <label class="block text-[9px] tracking-wider uppercase font-mono text-slate-400">RFQs Under Assessment</label>
        <div class="mt-2 text-2xl font-bold text-slate-100 font-mono">
          {{ rfqsCount }}
        </div>
        <p class="text-[10px] text-slate-500 mt-1 font-mono">Custom raw materials demand</p>
        <span class="absolute right-4 bottom-4 font-bold text-3xl opacity-5 select-none text-indigo-400">💬</span>
      </div>

      <div class="p-5 bg-[#090e24] border border-[#15204c]/80 rounded-xl relative overflow-hidden group hover:border-indigo-500/40 transition">
        <label class="block text-[9px] tracking-wider uppercase font-mono text-slate-400">Active Supply Products</label>
        <div class="mt-2 text-2xl font-bold text-slate-100 font-mono">
          {{ activeProductsCount }}
        </div>
        <p class="text-[10px] text-slate-500 mt-1 font-mono">Distributed across {{ warehouses.length }} hubs</p>
        <span class="absolute right-4 bottom-4 font-bold text-3xl opacity-5 select-none text-indigo-400">📦</span>
      </div>

    </div>

    <!-- CORE WORKSPACE GRIDS -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- COLUMN 1 & 2: INBOUND QUEUE HUD (Bons de commande, RFQs, Stock requests) -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- BONS DE COMMANDE DIVISION -->
        <div class="p-5 bg-[#080d22] border border-slate-900 rounded-xl shadow-md">
          <div class="flex items-center justify-between border-b border-indigo-950/60 pb-3 mb-4">
            <div class="flex items-center space-x-2.5">
              <span class="text-xl select-none">📋</span>
              <div>
                <h2 class="text-sm font-semibold text-slate-100 font-mono uppercase tracking-wider">BONS DE COMMANDE (RECEIVED ORDERS)</h2>
                <span class="text-[10px] text-slate-400 font-sans">Incoming purchasing agreements submitted by verified B2B buyers.</span>
              </div>
            </div>
            <router-link to="/supplier/orders" class="text-[10px] font-mono font-bold text-indigo-400 hover:underline">
              VIEW ALL &rarr;
            </router-link>
          </div>

          <!-- List of orders -->
          <div class="space-y-3">
            <div 
              v-for="order in recentOrders" 
              :key="order.id"
              class="p-4 bg-slate-950/60 hover:bg-slate-950/95 border border-slate-900 rounded-xl transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div class="space-y-1">
                <div class="flex items-center space-x-2">
                  <span class="font-mono text-xs font-bold text-slate-200 uppercase">#{{ order.id }}</span>
                  <span class="text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold uppercase" :class="getStatusBadgeClass(order.status)">
                    {{ order.status }}
                  </span>
                </div>
                <div class="text-[11px] text-slate-400">
                  Buyer: <strong class="text-slate-350">{{ order.client?.name || order.client_name || 'Standard Client' }}</strong> • {{ order.items_count || order.items?.length || 2 }} Item types
                </div>
                <div class="text-[10px] text-slate-500 font-mono">
                  Submitted: {{ order.created_at || order.date || '2026-06-17' }} • Destination: {{ order.delivery_city || 'Douala' }}
                </div>
              </div>

              <!-- Action metrics -->
              <div class="flex items-center gap-3 self-end sm:self-center">
                <span class="font-mono text-xs font-bold text-indigo-300 mr-2">
                  {{ formatCurrency(order.amount || order.total) }} FCFA
                </span>
                <button 
                  @click="openOrderDetailPopup(order)"
                  class="px-2.5 py-1.5 bg-[#171e3d] hover:bg-indigo-900/60 rounded text-[10px] font-mono text-indigo-300 font-bold transition border border-indigo-950"
                >
                  INSPECT &amp; ACTION
                </button>
              </div>
            </div>

            <div v-if="recentOrders.length === 0" class="text-center py-8 text-slate-500 font-mono text-xs">
              No inbound orders found.
            </div>
          </div>
        </div>

        <!-- RFQs DIVISION -->
        <div class="p-5 bg-[#080d22] border border-slate-900 rounded-xl shadow-md">
          <div class="flex items-center justify-between border-b border-indigo-950/60 pb-3 mb-4">
            <div class="flex items-center space-x-2.5">
              <span class="text-xl select-none">💬</span>
              <div>
                <h2 class="text-sm font-semibold text-slate-100 font-mono uppercase tracking-wider">INBOUND B2B PRICE QUOTATION REQUESTS (RFQS)</h2>
                <span class="text-[10px] text-slate-400 font-sans">Corporate clients requesting custom bulk supply pricing schedules.</span>
              </div>
            </div>
            <router-link to="/supplier/rfq/received" class="text-[10px] font-mono font-bold text-indigo-400 hover:underline">
              MANAGE RFQS &rarr;
            </router-link>
          </div>

          <!-- List of RFQs -->
          <div class="space-y-3">
            <div 
              v-for="rfq in inboundRFQs" 
              :key="rfq.id"
              class="p-4 bg-slate-950/60 hover:bg-slate-950/95 border border-slate-900 rounded-xl transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div class="space-y-1">
                <div class="flex items-center space-x-2">
                  <span class="font-mono text-xs font-bold text-slate-200">RFQ-{{ rfq.id }}</span>
                  <span class="text-[9px] bg-slate-900 text-purple-400 border border-purple-900/40 px-1.5 py-0.2 rounded font-mono font-semibold uppercase">
                    {{ rfq.status }}
                  </span>
                </div>
                <p class="text-[11.5px] text-slate-350 italic">
                  &ldquo;{{ rfq.title || rfq.items?.[0]?.name || 'Bulk Supply Agreement' }}&rdquo;
                </p>
                <div class="text-[10px] text-slate-400">
                  Target volume: <strong class="text-slate-300">{{ rfq.items?.[0]?.qty || '5000' }} kg</strong> • Target limit: {{ rfq.items?.[0]?.target || 'Negotiable' }}
                </div>
                <div class="text-[9.5px] text-slate-500 font-mono">
                  Deadline: {{ rfq.deadline }} • Subdomain validation active
                </div>
              </div>

              <!-- Quick Quote submission popup trigger -->
              <div class="flex items-center self-end sm:self-center">
                <button 
                  @click="openRFQResponsePopup(rfq)"
                  class="px-3 py-1.5 bg-indigo-950/50 hover:bg-indigo-900/40 text-indigo-400 border border-indigo-900/60 rounded text-[10px] font-mono font-bold transition uppercase"
                >
                  ⚡ SUBMIT PROPOSAL
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- DEMANDES DE STOCK & REPLENISHMENTS DIVISION -->
        <div class="p-5 bg-[#080d22] border border-slate-900 rounded-xl shadow-md">
          <div class="flex items-center justify-between border-b border-indigo-950/60 pb-3 mb-4">
            <div class="flex items-center space-x-2.5">
              <span class="text-xl select-none">🔄</span>
              <div>
                <h2 class="text-sm font-semibold text-slate-100 font-mono uppercase tracking-wider">DEMANDES DE STOCK (INVENTORY ASSIGNMENT CALLS)</h2>
                <span class="text-[10px] text-slate-400 font-sans">Simulated sub-branch and warehouse replenishment pipeline.</span>
              </div>
            </div>
            <router-link to="/supplier/products/stock" class="text-[10px] font-mono font-bold text-indigo-400 hover:underline">
              FIFO QUEUE MONITOR &rarr;
            </router-link>
          </div>

          <!-- List of stock demands -->
          <div class="space-y-3">
            <div 
              v-for="demand in simulatedStockDemands" 
              :key="demand.id"
              class="p-4 bg-slate-950/60 border border-slate-900 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div class="space-y-1">
                <div class="flex items-center space-x-2">
                  <span class="font-mono text-xs font-bold text-amber-400">REPL-{{ demand.id }}</span>
                  <span class="text-[8.5px] bg-amber-950/60 text-amber-400 border border-amber-900/40 px-1.5 py-0.2 rounded font-mono uppercase tracking-wider font-bold">
                    PENDING ALLOCATION
                  </span>
                </div>
                <div class="text-[11px] text-slate-350">
                  Requested Asset: <strong class="text-white">{{ demand.productName }}</strong>
                </div>
                <div class="text-[11px] text-slate-400 font-mono">
                  Volume Urgently Commited: <span class="text-indigo-300 font-bold">{{ demand.requestedQty }} units</span>
                </div>
                <div class="text-[9px] text-slate-500 font-mono">
                  Source: {{ demand.sourceUnit }} • Strict FIFO extraction enforced
                </div>
              </div>

              <!-- FIFO Visual execution activator -->
              <div class="self-end sm:self-center">
                <button 
                  @click="simulateFIFOAllocation(demand)"
                  class="px-3! py-1.5 bg-emerald-950 text-emerald-400 hover:bg-emerald-900 hover:text-slate-950 rounded text-[10px] font-mono font-bold border border-emerald-900/30 transition uppercase"
                >
                  Allocate FIFO Stock ⚡
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- RIGHT SIDEBAR (COLUMN 3): FIFO REAL-TIME QUEUE & KEY VERIFIED STORES -->
      <div class="space-y-6">
        
        <!-- FIFO QUEUE PREVIEW METRIC -->
        <div class="p-5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
          <div class="border-b border-slate-800 pb-2">
            <h3 class="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest flex items-center space-x-1.5">
              <span>🧬</span>
              <span>FIFO Batch State (Queue)</span>
            </h3>
            <span class="text-[9px] text-slate-500 block leading-tight mt-0.5">Showing batches sequence order for your primary high-runners:</span>
          </div>

          <div class="space-y-3 select-none">
            <div 
              v-for="p in fifoHighrunners" 
              :key="p.id"
              class="p-3 bg-slate-950 border border-slate-900 rounded-lg space-y-2"
            >
              <div class="flex justify-between items-center text-[10.5px]">
                <span class="font-bold text-slate-300 truncate max-w-[120px]">{{ p.name }}</span>
                <span class="font-mono text-slate-450">{{ p.stock }} units left</span>
              </div>
              
              <!-- Batches lines progression -->
              <div class="space-y-1">
                <div 
                  v-for="(b, idx) in p.batches" 
                  :key="b.id"
                  class="flex justify-between items-center text-[9px] font-mono p-1 rounded transition"
                  :class="idx === 0 && b.qty > 0 ? 'bg-indigo-950/40 border border-indigo-900/50 text-indigo-300' : 'bg-slate-900/40 text-slate-500'"
                >
                  <span>Batch #{{ b.id }} ({{ b.date }}):</span>
                  <span class="font-bold">{{ b.qty }} u @ {{ formatCurrency(b.price) }} FCFA</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- QUICK SYSTEM STATUS & LOGS -->
        <div class="p-5 bg-[#070b1a] border border-slate-800 rounded-xl space-y-2.5">
          <h3 class="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest border-b border-slate-800 pb-2">
            🪵 RECENT COMPLIANCE AUDITS
          </h3>
          <div class="font-mono text-[9px] space-y-2 text-slate-400 select-none">
            <p class="leading-relaxed border-l border-indigo-500 pl-2">
              <span class="text-indigo-400 font-bold block">[2026-06-18 04:30]</span>
               Inbound XML orders successfully polled from main buyer hub. No errors.
            </p>
            <p class="leading-relaxed border-l border-emerald-500 pl-2">
              <span class="text-emerald-400 font-bold block">[2026-06-18 03:12]</span>
               KYC secure attachments parsed. Status verified by administrative governance.
            </p>
            <p class="leading-relaxed border-l border-amber-500 pl-2">
              <span class="text-amber-400 font-bold block">[2026-06-17 19:20]</span>
               FIFO auto-drain sequence triggered for stock call REPL-101. Out of stock warning raised.
            </p>
          </div>
        </div>

      </div>

    </div>

    <!-- POPUP MODALS: ALL IN ONE PLACE OR DETAILED MODULAR POPUPS -->
    <!-- 1. ORDER DETAIL & ACTION POPUP -->
    <div v-if="activeOrderPopup" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-[#0b1029] border border-indigo-900/90 rounded-2xl p-6 w-full max-w-xl shadow-2xl relative overflow-hidden animate-fade-in text-slate-100">
        <div class="flex justify-between items-start border-b border-indigo-950 pb-3 mb-4">
          <div>
            <span class="text-[9px] font-mono text-indigo-400 px-1.5 py-0.5 rounded bg-indigo-950 font-bold uppercase">BOM COMMANDE FULFILLMENT</span>
            <h3 class="text-lg font-bold font-mono tracking-wide mt-1">INSPECT ORDER #{{ activeOrderPopup.id }}</h3>
          </div>
          <button @click="activeOrderPopup = null" class="text-slate-400 hover:text-white font-bold font-mono">&times; CLOSE</button>
        </div>

        <div class="space-y-4">
          <!-- Client Card -->
          <div class="p-3 bg-slate-950 border border-slate-900 rounded-xl text-xs space-y-1">
            <div class="text-slate-500 uppercase font-mono text-[9px]">Purchasing Organization</div>
            <div class="font-bold text-slate-200">{{ activeOrderPopup.client?.name || activeOrderPopup.client_name || 'Enterprise Buyer Co.' }}</div>
            <div class="text-slate-400">Phone: {{ activeOrderPopup.client?.phone || '+237 670 123 456' }}</div>
            <div class="text-slate-400">Location city: {{ activeOrderPopup.delivery_city || 'Bafoussam, Cameroon' }}</div>
          </div>

          <!-- Items Ledger -->
          <div class="space-y-2">
            <h4 class="text-xs font-mono font-bold uppercase text-slate-400">Requested Linage items</h4>
            <div class="max-h-36 overflow-y-auto space-y-1.5 bg-slate-950/50 p-2.5 rounded-lg border border-slate-900">
              <div 
                v-for="item in activeOrderPopup.items" 
                :key="item.id || item.productId"
                class="flex justify-between items-center text-xs py-1 border-b border-slate-900/45"
              >
                <div>
                  <span class="font-bold text-slate-250">{{ item.name || 'Agri Item' }}</span>
                  <p class="text-[10px] text-slate-500">Qty: {{ item.qty || item.quantity }} units • Unit: {{ formatCurrency(item.unitPrice || item.price) }} FCFA</p>
                </div>
                <span class="font-mono font-bold text-indigo-300">
                  {{ formatCurrency((item.qty || item.quantity) * (item.unitPrice || item.price)) }} FCFA
                </span>
              </div>
            </div>
          </div>

          <!-- Summary numbers -->
          <div class="flex justify-between items-center py-2 border-t border-indigo-950">
            <span class="text-xs uppercase font-mono font-bold text-slate-400">Simulated Total Invoice:</span>
            <span class="text-lg font-bold font-mono text-emerald-400">{{ formatCurrency(activeOrderPopup.amount || activeOrderPopup.total) }} FCFA</span>
          </div>
        </div>

        <!-- Action tools -->
        <div class="mt-6 flex justify-end space-x-3">
          <button 
            @click="rejectOrder(activeOrderPopup.id)"
            class="px-4 py-2 bg-red-950 text-red-400 border border-red-900/30 hover:bg-red-900 hover:text-slate-950 rounded-xl text-xs font-mono font-bold transition uppercase"
          >
            Refuse order
          </button>
          <button 
            @click="dispatchOrder(activeOrderPopup.id)"
            class="px-4 py-2 bg-emerald-950 text-emerald-400 border border-emerald-900/30 hover:bg-emerald-900 hover:text-slate-950 rounded-xl text-xs font-mono font-bold transition uppercase"
          >
            Fulfill & Dispatch (FIFO)
          </button>
        </div>
      </div>
    </div>

    <!-- 2. RFQ RESPONSE POPUP -->
    <div v-if="activeRFQPopup" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-[#0b1029] border border-indigo-900/90 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative overflow-hidden animate-fade-in text-slate-100">
        <div class="flex justify-between items-start border-b border-indigo-950 pb-3 mb-4">
          <div>
            <span class="text-[9px] font-mono text-indigo-400 px-1.5 py-0.5 rounded bg-indigo-950 font-bold uppercase">RFQ RESPONSE OFFICE</span>
            <h3 class="text-lg font-bold font-mono tracking-wide mt-1">SUBMIT DETAILED B2B PROPOSAL</h3>
          </div>
          <button @click="activeRFQPopup = null" class="text-slate-400 hover:text-white font-bold font-mono">&times; CLOSE</button>
        </div>

        <form @submit.prevent="submitRFQProposal" class="space-y-4">
          <div>
            <label class="block text-[9.5px] uppercase font-mono text-slate-400 mb-1">Target Description</label>
            <div class="p-2.5 bg-slate-950 rounded text-xs text-slate-350 select-none">
              {{ activeRFQPopup.items?.[0]?.name || 'Standard Agricultural Assets Sourcing' }}
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[9.5px] uppercase font-mono text-indigo-400 mb-1 font-bold">Your Offered Price (FCFA per Unit)</label>
              <input 
                type="number" 
                v-model="rfqForm.proposedPrice"
                required 
                class="w-full bg-slate-950 border border-indigo-900 text-xs px-3 py-2 rounded-lg text-slate-350 focus:outline-none focus:border-indigo-500 font-mono"
                placeholder="Ex: 1750"
              />
            </div>
            <div>
              <label class="block text-[9.5px] uppercase font-mono text-slate-400 mb-1">Delivery ETA (Days)</label>
              <input 
                type="number" 
                v-model="rfqForm.etaDays"
                required 
                class="w-full bg-slate-950 border border-slate-900 text-xs px-3 py-2 rounded-lg text-slate-350 focus:outline-none focus:border-indigo-500 font-mono"
                placeholder="Ex: 5"
              />
            </div>
          </div>

          <div>
            <label class="block text-[9.5px] uppercase font-mono text-slate-400 mb-1">Custom Settlement terms / Technical specs</label>
            <textarea 
              v-model="rfqForm.terms"
              rows="3"
              class="w-full bg-slate-950 border border-slate-900 text-xs px-3 py-2 rounded-lg text-slate-350 focus:outline-none focus:border-indigo-500 resize-none"
              placeholder="Specify payment guarantees, certificate of origin, chemical grade specs..."
            ></textarea>
          </div>

          <!-- Form execution buttons -->
          <div class="pt-4 border-t border-indigo-950 flex justify-end space-x-3">
            <button 
              type="button"
              @click="activeRFQPopup = null"
              class="px-4 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-xs font-mono font-bold transition text-slate-400"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-4 py-2 bg-indigo-900 text-white hover:bg-indigo-700 rounded-xl text-xs font-mono font-bold transition uppercase"
            >
              Seal & Send Quotation
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 3. COMPREHENSIVE FIFO OUTCOME STATUS ALERT MODAL -->
    <div v-if="fifoAllocationOutcome" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-[#050919] border border-emerald-900/90 rounded-2xl p-6 w-full max-w-md shadow-2xl relative overflow-hidden animate-fade-in text-slate-100">
        <div class="text-center space-y-3">
          <div class="h-12 w-12 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/30 flex items-center justify-center font-bold text-2xl mx-auto select-none">
            ⚡
          </div>
          <h3 class="text-base font-mono font-bold uppercase tracking-wider text-emerald-400">FIFO Stock allocated successfully!</h3>
          <p class="text-xs text-slate-400 max-w-sm mx-auto">
            The replenishment call was handled and resolved using strict First In First Out (FIFO) sequencing to pull items from the oldest active storage batch:
          </p>
        </div>

        <div class="mt-4 p-4.5 bg-slate-950 border border-slate-900 rounded-xl space-y-2 text-xs">
          <div class="flex justify-between font-mono">
            <span class="text-slate-550">Target Asset:</span>
            <span class="font-bold text-slate-300">{{ fifoAllocationOutcome.productName }}</span>
          </div>
          <div class="flex justify-between font-mono">
            <span class="text-slate-550">Total Requested:</span>
            <span class="font-bold text-indigo-300">{{ fifoAllocationOutcome.requestedQty }} units</span>
          </div>
          
          <div class="pt-2.5 border-t border-slate-900/80 space-y-1">
            <span class="text-[9.5px] uppercase font-mono text-emerald-400 block tracking-wider font-bold">Batches Eaten Progression:</span>
            <div 
              v-for="b in fifoAllocationOutcome.consumedDetails" 
              :key="b.batchId"
              class="flex justify-between text-[11px] font-mono text-slate-350"
            >
              <span>Batch #{{ b.batchId }} (Entry date: {{ b.date }})</span>
              <span class="text-emerald-400 font-bold">-{{ b.qty }} units</span>
            </div>
          </div>
        </div>

        <button 
          @click="fifoAllocationOutcome = null"
          class="mt-6 w-full py-2 bg-emerald-950 text-emerald-400 hover:bg-emerald-900 hover:text-slate-950 rounded-xl text-xs font-mono font-bold uppercase transition border border-emerald-900/30"
        >
          CONFIRM &amp; DISPATCH AGENTS
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { products, warehouses, orders, rfqs, kycDoc, purchaseFIFOStock } from '@/utils/supplier_db';
import { useToast } from 'vue-toastification';

const toast = useToast();

const activeOrderPopup = ref(null);
const activeRFQPopup = ref(null);
const fifoAllocationOutcome = ref(null);

const rfqForm = ref({
  proposedPrice: '',
  etaDays: '',
  terms: ''
});

// Dynamic calculations based on state values
const formattedTotalRevenue = computed(() => {
  const tot = orders.value
    .filter(o => o.status === 'Delivered' || o.status === 'Processing' || o.status === 'Completed' || o.status === 'Ready')
    .reduce((acc, o) => acc + (o.amount || o.total || 0), 125480000);
  return new Intl.NumberFormat('fr-FR').format(tot);
});

const ordersCount = computed(() => orders.value.length);
const pendingOrdersCount = computed(() => orders.value.filter(o => o.status === 'Pending' || o.status === 'Received').length);
const rfqsCount = computed(() => rfqs.value.filter(r => r.status === 'Received' || r.status === 'Pending').length);
const activeProductsCount = computed(() => products.value.filter(p => p.stock > 0).length);

const recentOrders = computed(() => {
  return orders.value.slice(0, 5);
});

const inboundRFQs = computed(() => {
  return rfqs.value.filter(r => r.status === 'Received').slice(0, 3);
});

const simulatedStockDemands = ref([
  { id: '101', productId: 'p_1', productName: 'Engrais Bio NPK Bag', requestedQty: 400, sourceUnit: 'POS Retailing Centre Douala' },
  { id: '102', productId: 'p_2', productName: 'Pompe Solaire MPPT 500W', requestedQty: 25, sourceUnit: 'Retail Outlet Yaounde Mvan' }
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
  if (norm === 'pending' || norm === 'received') return 'bg-indigo-950 text-indigo-300 border border-indigo-900/60';
  if (norm === 'shipping' || norm === 'processing') return 'bg-amber-950 text-amber-400 border border-amber-900/40';
  if (norm === 'ready' || norm === 'delivered' || norm === 'completed') return 'bg-emerald-950 text-emerald-400 border border-emerald-950/40';
  return 'bg-slate-900 text-slate-400';
}

function openOrderDetailPopup(order) {
  activeOrderPopup.value = order;
}

function openRFQResponsePopup(rfq) {
  activeRFQPopup.value = rfq;
  rfqForm.value = {
    proposedPrice: Math.round(rfq.items?.[0]?.qty ? 1450 : 2200),
    etaDays: 7,
    terms: 'Offer includes bulk shipping packing materials custom cleared at local rail depot. Payment via Escrow and certified bank guarantees.'
  };
}

function rejectOrder(id) {
  const o = orders.value.find(ord => ord.id === id);
  if (o) {
    o.status = 'Canceled';
    toast.error(`Order #${id} has been refused.`);
  }
  activeOrderPopup.value = null;
}

function dispatchOrder(id) {
  const o = orders.value.find(ord => ord.id === id);
  if (o) {
    // Fulfill items using FIFO model
    const items = o.items || [];
    let messages = [];
    
    items.forEach(itm => {
      const result = purchaseFIFOStock(itm.productId, itm.qty || itm.quantity || 100);
      if (result && result.success) {
        messages.push(`${itm.name}: FIFO batched correctly`);
      }
    });

    o.status = 'Ready';
    toast.success(`Order #${id} verified. Fulfillments dispatched!`);
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
    
    // Remove allocated demand from listing
    simulatedStockDemands.value = simulatedStockDemands.value.filter(d => d.id !== demand.id);
    toast.success('FIFO allocation computed successfully.');
  } else {
    toast.error('Insufficient inventory batches stock to execute demand via FIFO queue.');
  }
}

function submitRFQProposal() {
  if (activeRFQPopup.value) {
    activeRFQPopup.value.status = 'Offer Sent';
    toast.success(`Exclusive quotation submitted for RFQ-${activeRFQPopup.value.id}!`);
  }
  activeRFQPopup.value = null;
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.2s ease-out forwards;
}
</style>
