import { ref, watch } from 'vue';
import { products as seedProducts, warehouses as seedWarehouses, orders as seedOrders, stores as seedStores } from './seed_data.js';

const seedRFQs = [];

// Load from localStorage or set default
const STORAGE_KEY = 'supplier_portal_db_v4';

export const b2b_suppliers = ref([
  { id: 'usr_vendor_1', name: 'TechSupplies SARL', category: 'Intrants Agricoles', email: 'vendor@gmail.com', phone: '+237 6 99 88 77 66', address: 'Zone Industrielle de Bassa, Douala', status: 'Active', paymentTerms: 'Net 30', taxId: 'N001' },
  { id: 'usr_vendor_2', name: 'SolarPlus Cameroun', category: 'Produits Chimiques', email: 'vendor2@gmail.com', phone: '+237 6 55 66 77 88', address: 'Yaoundé, Cameroun', status: 'Active', paymentTerms: 'Cash on Delivery', taxId: 'N002' },
  { id: 'usr_vendor_3', name: 'Nylon Packaging Douala', category: 'Emballages', email: 'nylon@gmail.com', phone: '+237 6 33 33 33 33', address: 'Bonabéri, Cameroun', status: 'Active', paymentTerms: 'Net 15', taxId: 'N003' }
]);

const defaultState = {
  walletFree: 8500000,
  walletLocked: [],
  products: seedProducts.map(p => {
    let b2bSupplierId = 'usr_vendor_1';
    const nameLow = p.name.toLowerCase();
    if (nameLow.includes('solaire') || nameLow.includes('panneau') || nameLow.includes('batterie') || nameLow.includes('ciment') || nameLow.includes('fer') || nameLow.includes('peinture') || nameLow.includes('outil')) {
      b2bSupplierId = 'usr_vendor_2';
    } else if (nameLow.includes('pagne') || nameLow.includes('ndop') || nameLow.includes('robe') || nameLow.includes('sac') || nameLow.includes('costume') || nameLow.includes('karité') || nameLow.includes('savon') || nameLow.includes('pneu') || nameLow.includes('moteur')) {
      b2bSupplierId = 'usr_vendor_3';
    }
    return {
      ...p,
      supplierId: b2bSupplierId,
      batches: [
        { id: 'b_1', date: '2026-05-10', qty: Math.floor(p.stock * 0.4), initialQty: Math.floor(p.stock * 0.4), price: p.price * 0.85 },
        { id: 'b_2', date: '2026-06-01', qty: Math.floor(p.stock * 0.6), initialQty: Math.floor(p.stock * 0.6), price: p.price * 0.90 }
      ]
    };
  }),
  warehouses: seedWarehouses.map((w, idx) => ({
    ...w,
    capacity: 500000 + (idx * 150000),
    description: w.description || 'Hub logistique B2B sécurisé.',
    manager: 'Abdoulaye K.',
    status: idx === 0 ? 'Active' : 'Maintenance',
    categories: ['Agricole', 'Chimique', 'Outillage', 'Emballages'],
    location: w.location || 'Zone Industrielle de Bassa, Douala',
    inventory: seedProducts.slice(0, 4).map(p => ({ id: p.id, name: p.name, stock: p.stock, value: p.stock * p.price }))
  })),
  orders: [
    {
      id: "BC-2026-001",
      reference: "BC-2026-001",
      clientId: "cli_buyer_demo",
      clientName: "Alice Kamga",
      clientCompany: "Kamga B2C Sourcing",
      deliveryMode: "Route Heavy Truck (Camion 10t)",
      carrierName: "Afrique Logistique Express",
      waybill: "AWB-LT-893-OM-902",
      items: [
        { productId: "prod_souris_wireless", productName: "Souris Sans Fil Logitech", sku: "EL-LOG-MOU", quantity: 2, unitPrice: 15000, totalPrice: 30000, supplierId: "usr_vendor_1", status: "Delivered" },
        { productId: "prod_panneau_solaire", productName: "Panneau Solaire Monocristallin 400W", sku: "EN-PAN-SOL", quantity: 4, unitPrice: 85000, totalPrice: 340000, supplierId: "usr_vendor_2", status: "Delivered" }
      ],
      subtotal: 370000,
      tax: 71225,
      shippingFee: 10000,
      total: 451225,
      status: "Delivered",
      paymentStatus: "Settled",
      created_at: "2026-07-01T10:00:00Z",
      history: [
        { status: "Submitted", timestamp: "2026-07-01T10:00:00Z", label: "Bon de commande soumis", description: "Soumission initiale par Kamga B2C Sourcing." },
        { status: "Approved", timestamp: "2026-07-01T14:20:00Z", label: "Approuvé par les Fournisseurs", description: "Validation des stocks physiques." },
        { status: "Shipped", timestamp: "2026-07-02T08:00:00Z", label: "En transit logistique", description: "Expédié via Afrique Logistique Express." },
        { status: "Delivered", timestamp: "2026-07-03T16:45:00Z", label: "Livré & Validé", description: "Livraison réceptionnée et signée électroniquement." }
      ]
    },
    {
      id: "BC-2026-002",
      reference: "BC-2026-002",
      clientId: "cli_buyer_demo",
      clientName: "Alice Kamga",
      clientCompany: "Kamga B2C Sourcing",
      deliveryMode: "Express Isothermal Van",
      carrierName: "Gofetch Cargo Transit",
      waybill: "AWB-CE-412-BB-312",
      items: [
        { productId: "prod_cable_hdmi", productName: "Câble HDMI 4K 1.8m", sku: "EL-CAB-HD", quantity: 5, unitPrice: 5000, totalPrice: 25000, supplierId: "usr_vendor_1", status: "Shipped" },
        { productId: "prod_jute_sac", productName: "Sacs Jute de Cacao", sku: "PK-JUT-SAC", quantity: 100, unitPrice: 1500, totalPrice: 150000, supplierId: "usr_vendor_3", status: "Preparing" }
      ],
      subtotal: 175000,
      tax: 33687,
      shippingFee: 10000,
      total: 218687,
      status: "Shipped",
      paymentStatus: "Escrow_Held",
      created_at: "2026-07-02T14:30:00Z",
      history: [
        { status: "Submitted", timestamp: "2026-07-02T14:30:00Z", label: "Bon de commande soumis", description: "Requis d'approvisionnement express pour Kamga B2C Sourcing." },
        { status: "Approved", timestamp: "2026-07-02T17:40:00Z", label: "Approuvé", description: "Stocks physiques réservés." },
        { status: "Preparing", timestamp: "2026-07-03T08:30:00Z", label: "Préparation Logistique", description: "Colisage et contrôle qualité en cours." },
        { status: "Packed", timestamp: "2026-07-03T14:00:00Z", label: "Colis emballés", description: "Génération des Bons de Livraison." },
        { status: "Shipped", timestamp: "2026-07-04T07:30:00Z", label: "En cours de livraison", description: "En cours de route vers Yaoundé Hub." }
      ]
    },
    {
      id: "BC-2026-003",
      reference: "BC-2026-003",
      clientId: "cli_buyer_demo",
      clientName: "Alice Kamga",
      clientCompany: "Kamga B2C Sourcing",
      deliveryMode: "Urban Moto Cargo",
      carrierName: "Sawa Express Riders",
      waybill: "AWB-LT-012-MC-104",
      items: [
        { productId: "prod_batterie_gel", productName: "Batterie Solaire Gel 200Ah", sku: "EN-BAT-GEL", quantity: 5, unitPrice: 135000, totalPrice: 675000, supplierId: "usr_vendor_2", status: "Preparing" }
      ],
      subtotal: 675000,
      tax: 129937,
      shippingFee: 5000,
      total: 809937,
      status: "Preparing",
      paymentStatus: "Escrow_Held",
      created_at: "2026-07-04T08:00:00Z",
      history: [
        { status: "Submitted", timestamp: "2026-07-04T08:00:00Z", label: "Bon de commande soumis", description: "Demande urgente de batteries BTP." },
        { status: "Approved", timestamp: "2026-07-04T10:00:00Z", label: "Approuvé", description: "Planification du dispatch urbain." },
        { status: "Preparing", timestamp: "2026-07-05T08:00:00Z", label: "Préparation Logistique", description: "Chargement et colisage." }
      ]
    },
    {
      id: "BC-2026-004",
      reference: "BC-2026-004",
      clientId: "cli_buyer_demo",
      clientName: "Alice Kamga",
      clientCompany: "Kamga B2C Sourcing",
      deliveryMode: "Rail Cargo (Cameroun Rail Fret)",
      carrierName: "Afrique Logistique Express",
      waybill: "AWB-RL-819-CM-401",
      items: [
        { productId: "prod_souris_wireless", productName: "Souris Sans Fil Logitech", sku: "EL-LOG-MOU", quantity: 10, unitPrice: 15000, totalPrice: 150000, supplierId: "usr_vendor_1", status: "Pending" },
        { productId: "prod_kraft_bag", productName: "Emballages Thermoscellés Kraft", sku: "PK-KRA-BAG", quantity: 200, unitPrice: 150, totalPrice: 30000, supplierId: "usr_vendor_3", status: "Pending" }
      ],
      subtotal: 180000,
      tax: 34650,
      shippingFee: 10000,
      total: 224650,
      status: "Draft",
      paymentStatus: "Escrow_Held",
      created_at: "2026-07-05T09:00:00Z",
      history: [
        { status: "Draft", timestamp: "2026-07-05T09:00:00Z", label: "Brouillon enregistré", description: "Brouillon multi-fournisseur créé." }
      ]
    },
    {
      id: "BC-2026-005",
      reference: "BC-2026-005",
      clientId: "cli_buyer_demo",
      clientName: "Alice Kamga",
      clientCompany: "Kamga B2C Sourcing",
      deliveryMode: "Route Heavy Truck (Camion 10t)",
      carrierName: "Afrique Logistique Express",
      waybill: "AWB-LT-893-OM-915",
      items: [
        { productId: "prod_panneau_solaire", productName: "Panneau Solaire Monocristallin 400W", sku: "EN-PAN-SOL", quantity: 1, unitPrice: 85000, totalPrice: 85000, supplierId: "usr_vendor_2", status: "Pending" }
      ],
      subtotal: 85000,
      tax: 16362,
      shippingFee: 5000,
      total: 106362,
      status: "Draft",
      paymentStatus: "Escrow_Held",
      created_at: "2026-07-06T11:00:00Z",
      history: [
        { status: "Draft", timestamp: "2026-07-06T11:00:00Z", label: "Brouillon enregistré", description: "Brouillon solaire créé." }
      ]
    },
    {
      id: "BC-2026-006",
      reference: "BC-2026-006",
      clientId: "cli_buyer_demo",
      clientName: "Alice Kamga",
      clientCompany: "Kamga B2C Sourcing",
      deliveryMode: "Route Heavy Truck (Camion 10t)",
      carrierName: "Afrique Logistique Express",
      waybill: "AWB-LT-893-OM-906",
      items: [
        { productId: "prod_souris_wireless", productName: "Souris Sans Fil Logitech", sku: "EL-LOG-MOU", quantity: 5, unitPrice: 15000, totalPrice: 75000, supplierId: "usr_vendor_1", status: "Pending" },
        { productId: "prod_cable_hdmi", productName: "Câble HDMI 4K 1.8m", sku: "EL-CAB-HD", quantity: 10, unitPrice: 5000, totalPrice: 50000, supplierId: "usr_vendor_1", status: "Pending" }
      ],
      subtotal: 125000,
      tax: 24062,
      shippingFee: 10000,
      total: 159062,
      status: "Packed",
      paymentStatus: "Escrow_Held",
      created_at: "2026-07-07T09:00:00Z",
      history: [
        { status: "Submitted", timestamp: "2026-07-07T09:00:00Z", label: "Bon de commande soumis", description: "Soumission initiale." },
        { status: "Approved", timestamp: "2026-07-07T14:20:00Z", label: "Approuvé par le Vendeur", description: "Validation des stocks physiques." },
        { status: "Packed", timestamp: "2026-07-08T08:00:00Z", label: "BL Généré", description: "Le vendeur a généré le bon de livraison." }
      ]
    }
  ],
  rfqs: seedRFQs.map(r => ({
    ...r,
    status: r.status || 'Received',
    deadline: r.deadline || '2026-07-20',
    demandeStock: Math.random() > 0.5,
    items: r.items || [
      { name: 'Cacao Fèves Brutes Grade A', qty: 5000, target: '1800 FCFA/kg' }
    ]
  })),
  stores: seedStores.map(s => ({
    ...s,
    banner: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200',
    description: s.description || 'Virtual B2B Sourcing point',
    manager: 'Jean Dupont',
    status: 'online',
    posConfig: {
      terminalName: 'Terminus Alpha - ' + s.name,
      isActive: true,
      lastSync: '2026-06-18 05:12'
    }
  })),
  purchases: [
    { id: 'po_001', supplierIds: ['usr_vendor_1'], date: '2026-07-01', items: [{ name: 'Sacs Jute de Cacao', qty: 1000, unitPrice: 1500, supplierId: 'usr_vendor_1' }], amount: 1500000, status: 'Received' },
    { id: 'po_002', supplierIds: ['usr_vendor_2'], date: '2026-07-04', items: [{ name: 'Batterie Solaire Gel 200Ah', qty: 250, unitPrice: 135000, supplierId: 'usr_vendor_2' }], amount: 33750000, status: 'Sent' }
  ],
  delivery_notes: [
    { id: 'dn_001', purchaseId: 'BC-2026-001', supplierId: 'usr_vendor_1', date: '2026-07-02', receivedBy: 'Alice Kamga', status: 'Verified', items: [{ name: 'Souris Sans Fil Logitech', qtyExpected: 2, qtyReceived: 2 }] },
    {
      id: 'dn_003',
      purchaseId: 'BC-2026-006',
      supplierId: 'usr_vendor_1',
      date: '2026-07-07',
      receivedBy: '',
      status: 'Awaiting_Validation',
      items: [
        { name: 'Souris Sans Fil Logitech', qtyExpected: 5, qtyReceived: 4 },
        { name: 'Câble HDMI 4K 1.8m', qtyExpected: 10, qtyReceived: 8 },
        { name: 'Panneau Solaire Monocristallin 400W', qtyExpected: 0, qtyReceived: 1 }
      ]
    }
  ],
  returns: [
    {
      id: 'RET-2026-001',
      reference: 'RET-2026-001',
      parent_order_id: 'BC-2026-006',
      parent_delivery_note_id: 'dn_003',
      buyer_id: 'usr_buyer_1',
      buyer_name: 'Alice Kamga',
      supplier_id: 'usr_vendor_1',
      supplier_name: 'TechSupplies SARL',
      created_at: '2026-07-08T11:30:00Z',
      status: 'Requested',
      reason: 'Quantité manquante et articles non conformes',
      items: [
        { productId: 'prod_souris_wireless', productName: 'Souris Sans Fil Logitech', originalQty: 5, returnQty: 1, comment: 'Manque 1 unité, emballage humide' },
        { productId: 'prod_cable_hdmi', productName: 'Câble HDMI 4K 1.8m', originalQty: 10, returnQty: 2, comment: '2 câbles non fonctionnels à l’arrivée' }
      ],
      comments: [
        { author: 'Alice Kamga', text: 'Réception incomplète et articles endommagés', date: '2026-07-08T11:30:00Z' }
      ],
      linked_bc_id: null
    }
  ],
  expenses: [
    { id: 'exp_001', date: '2026-07-05', category: 'Carburant Logistique', amount: 350000, description: 'Livraison Douala-Yaoundé Super' },
    { id: 'exp_002', date: '2026-07-10', category: 'Loyer Entrepôt', amount: 1200000, description: 'Facturation Mensuelle Hub Bassa' }
  ],
  team: [
    { id: 'usr_techsupp_mgr', name: 'Jean Dupont', email: 'supplier@enterprise.local', role: 'Business Director', permissions: ['manage_stock', 'issue_rfq', 'approve_orders', 'view_ledger', 'edit_team'] }
  ],
  withdrawals: [
    { id: 'wth_001', date: '2026-07-02', method: 'Orange Money', amount: 4500000, status: 'Completed', reference: 'OM-TXN-283401' }
  ],
  carriers: [
    { id: 'car_001', name: 'Afrique Logistique Express', type: 'Camion 10 Tonnes', plate: 'LT-893-OA', route: 'Douala - Yaoundé - Bafoussam', status: 'Active' }
  ],
  kycDoc: {
    status: 'VERIFIED',
    companyName: 'TechSupplies B2B SARL',
    rc: 'BF-OUA-2026-B-1234',
    niu: 'N00034921W',
    rccm: 'RCCM-BF-OUA-01-2026',
    managerName: 'Jean Dupont',
    address: '450 Avenue Kwamé N’Krumah, Ouagadougou',
    fiscalDocs: 'corporate_status_2026.pdf, balance_sheet_2025.pdf',
    verifiedAt: '2026-03-01T10:00:00Z',
    capital: '10,000,000 FCFA',
    taxRegime: 'Régime Réel Simplifié'
  }
};

const saved = localStorage.getItem(STORAGE_KEY);
let parsed = saved ? JSON.parse(saved) : defaultState;

// Force schema migration if legacy data is present
if (parsed && parsed.b2b_suppliers) {
  const hasOldIds = parsed.b2b_suppliers.some(s => s.id === 'sup_001');
  if (hasOldIds || !parsed.orders || parsed.orders.length < 5) {
    // Migration: overwrite with the aligned mock data structure
    parsed = defaultState;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
  }
}

export const products = ref(parsed.products);
export const warehouses = ref(parsed.warehouses);
export const orders = ref(parsed.orders);
export const rfqs = ref(parsed.rfqs);
export const stores = ref(parsed.stores);
export const purchases = ref(parsed.purchases);
export const delivery_notes = ref(parsed.delivery_notes || defaultState.delivery_notes);
export const returns = ref(parsed.returns || defaultState.returns);
export const expenses = ref(parsed.expenses);
export const team = ref(parsed.team);
export const withdrawals = ref(parsed.withdrawals);
export const carriers = ref(parsed.carriers);
export const kycDoc = ref(parsed.kycDoc);
export const walletFree = ref(parsed.walletFree !== undefined ? parsed.walletFree : 8500000);
export const walletLocked = ref(parsed.walletLocked || []);

// Watch for deep changes and sync with localStorage
watch(
  [products, warehouses, orders, rfqs, stores, b2b_suppliers, purchases, delivery_notes, returns, expenses, team, withdrawals, carriers, kycDoc, walletFree, walletLocked],
  () => {
    const serialized = {
      products: products.value,
      warehouses: warehouses.value,
      orders: orders.value,
      rfqs: rfqs.value,
      stores: stores.value,
      b2b_suppliers: b2b_suppliers.value,
      purchases: purchases.value,
      delivery_notes: delivery_notes.value,
      returns: returns.value,
      expenses: expenses.value,
      team: team.value,
      withdrawals: withdrawals.value,
      carriers: carriers.value,
      kycDoc: kycDoc.value,
      walletFree: walletFree.value,
      walletLocked: walletLocked.value
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  },
  { deep: true }
);

// FIFO algorithm trigger helper
export function purchaseFIFOStock(productId, qtyNeeded) {
  const prod = products.value.find(p => p.id === productId);
  if (!prod) return false;
  
  const sortedBatches = (prod.batches || []).sort((a, b) => new Date(a.date) - new Date(b.date));
  
  let leftToConsume = qtyNeeded;
  let consumedDetails = [];
  
  for (let batch of sortedBatches) {
    if (batch.qty <= 0) continue;
    
    if (batch.qty >= leftToConsume) {
      batch.qty -= leftToConsume;
      consumedDetails.push({ batchId: batch.id, date: batch.date, qty: leftToConsume });
      leftToConsume = 0;
      break;
    } else {
      leftToConsume -= batch.qty;
      consumedDetails.push({ batchId: batch.id, date: batch.date, qty: batch.qty });
      batch.qty = 0;
    }
  }
  
  prod.stock = sortedBatches.reduce((acc, b) => acc + b.qty, 0);
  return { success: leftToConsume === 0, consumedDetails };
}
