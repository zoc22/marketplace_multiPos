import { ref, watch } from 'vue';
import { products as seedProducts, warehouses as seedWarehouses, orders as seedOrders, stores as seedStores } from './seed_data.js';

const seedRFQs = [];

// Load from localStorage or set default
const STORAGE_KEY = 'supplier_portal_db_v3';

const defaultState = {
  walletFree: 8500000,
  walletLocked: [],
  products: seedProducts.map(p => ({
    ...p,
    batches: [
      { id: 'b_1', date: '2026-05-10', qty: Math.floor(p.stock * 0.4), initialQty: Math.floor(p.stock * 0.4), price: p.price * 0.85 },
      { id: 'b_2', date: '2026-06-01', qty: Math.floor(p.stock * 0.6), initialQty: Math.floor(p.stock * 0.6), price: p.price * 0.90 }
    ]
  })),
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
      id: "ord_mock_1",
      reference: "B2B-PO-2026-0812-25",
      clientId: "cli_buyer_demo",
      clientName: "Alice Smith",
      clientCompany: "ALPHA RETAIL LTD",
      supplierName: "Zama-Agro Sahel",
      deliveryMode: "Route Heavy Truck (Camion 10t)",
      carrierName: "Afrique Logistique Express",
      waybill: "AWB-LT-893-OM-902",
      items: [
        { productId: "prod_1", productName: "Sac de Cacao Premium (Bord champ) Original V1", sku: "SKU-AGR-0001", quantity: 150, unitPrice: 3500, totalPrice: 525000 },
        { productId: "prod_2", productName: "Sachet de Poivre Blanc de Penja Original V2", sku: "SKU-AGR-0002", quantity: 200, unitPrice: 8000, totalPrice: 1600000 }
      ],
      subtotal: 2125000,
      tax: 409062,
      shippingFee: 5000,
      total: 2539062,
      status: "Delivered",
      paymentStatus: "Settled",
      created_at: "2026-06-15T10:30:00Z",
      history: [
        { status: "Submitted", timestamp: "2026-06-15T10:30:00Z", label: "Bon de commande soumis", description: "Soumission initiale par ALPHA RETAIL LTD." },
        { status: "Approved", timestamp: "2026-06-15T14:20:00Z", label: "Approuvé par Zama-Agro", description: "Validation des stocks physiques au hub logistique." },
        { status: "Shipped", timestamp: "2026-06-16T08:00:00Z", label: "En transit logistique", description: "Expédié via Afrique Logistique Express (Camion 10t)." },
        { status: "Delivered", timestamp: "2026-06-18T16:45:00Z", label: "Livré & Validé", description: "Livraison réceptionnée et signée électroniquement." }
      ]
    },
    {
      id: "ord_mock_2",
      reference: "B2B-PO-2026-0941-88",
      clientId: "cli_buyer_demo",
      clientName: "Alice Smith",
      clientCompany: "ALPHA RETAIL LTD",
      supplierName: "SOPRO-CAM S.A.",
      deliveryMode: "Express Isothermal Van",
      carrierName: "Gofetch Cargo Transit",
      waybill: "AWB-CE-412-BB-312",
      items: [
        { productId: "prod_3", productName: "Riz Parfumé Ndop Original V1", sku: "SKU-AGR-0003", quantity: 50, unitPrice: 15500, totalPrice: 775000 },
        { productId: "prod_4", productName: "Miel Pur de l'Adamaoua Original V2", sku: "SKU-AGR-0005", quantity: 120, unitPrice: 4500, totalPrice: 540000 }
      ],
      subtotal: 1315000,
      tax: 253137,
      shippingFee: 5000,
      total: 1573137,
      status: "Shipped",
      paymentStatus: "Escrow_Held",
      created_at: "2026-06-22T09:15:00Z",
      history: [
        { status: "Submitted", timestamp: "2026-06-22T09:15:00Z", label: "Bon de commande soumis", description: "Requis d'approvisionnement express pour ALPHA RETAIL LTD." },
        { status: "Approved", timestamp: "2026-06-22T11:40:00Z", label: "Approuvé par SOPRO-CAM", description: "Stocks physiques réservés." },
        { status: "Preparing", timestamp: "2026-06-23T08:30:00Z", label: "En préparation", description: "Colisage et contrôle qualité." },
        { status: "Packed", timestamp: "2026-06-23T14:00:00Z", label: "Colis emballé", description: "Génération du Bon de Livraison BL-0941." },
        { status: "Shipped", timestamp: "2026-06-24T07:30:00Z", label: "En cours de livraison", description: "En cours de route vers Yaoundé Hub." }
      ]
    },
    {
      id: "ord_mock_3",
      reference: "B2B-PO-2026-1025-04",
      clientId: "cli_buyer_demo",
      clientName: "Alice Smith",
      clientCompany: "ALPHA RETAIL LTD",
      supplierName: "Nylon Packaging Douala",
      deliveryMode: "Urban Moto Cargo",
      carrierName: "Sawa Express Riders",
      waybill: "AWB-LT-012-MC-104",
      items: [
        { productId: "prod_5", productName: "Sac de Ciment 50kg CPJ 35 Original V3", sku: "SKU-BTP-0001", quantity: 80, unitPrice: 4900, totalPrice: 392000 }
      ],
      subtotal: 392000,
      tax: 75460,
      shippingFee: 5000,
      total: 472460,
      status: "Preparing",
      paymentStatus: "Escrow_Held",
      created_at: "2026-06-24T14:20:00Z",
      history: [
        { status: "Submitted", timestamp: "2026-06-24T14:20:00Z", label: "Bon de commande soumis", description: "Demande urgente de sacs BTP." },
        { status: "Approved", timestamp: "2026-06-24T16:00:00Z", label: "Approuvé par Nylon Packaging", description: "Planification du dispatch urbain." },
        { status: "Preparing", timestamp: "2026-06-25T08:00:00Z", label: "En cours de colisage", description: "Chargement de la moto cargo." }
      ]
    },
    {
      id: "ord_mock_4",
      reference: "B2B-PO-2026-1108-61",
      clientId: "cli_buyer_demo",
      clientName: "Alice Smith",
      clientCompany: "ALPHA RETAIL LTD",
      supplierName: "Zama-Agro Sahel",
      deliveryMode: "Rail Cargo (Cameroun Rail Fret)",
      carrierName: "Afrique Logistique Express",
      waybill: "AWB-RL-819-CM-401",
      items: [
        { productId: "prod_6", productName: "Tenue Traditionnelle Ndop Original V1", sku: "SKU-TEX-0002", quantity: 40, unitPrice: 45000, totalPrice: 1800000 }
      ],
      subtotal: 1800000,
      tax: 346500,
      shippingFee: 5000,
      total: 2151500,
      status: "Approved",
      paymentStatus: "Escrow_Held",
      created_at: "2026-06-24T17:45:00Z",
      history: [
        { status: "Submitted", timestamp: "2026-06-24T17:45:00Z", label: "Bon de commande soumis", description: "Réquisition de textiles traditionnels." },
        { status: "Approved", timestamp: "2026-06-25T09:00:00Z", label: "Approuvé par Zama-Agro", description: "Stocks confirmés et réservés." }
      ]
    },
    {
      id: "ord_mock_5",
      reference: "B2B-PO-2026-1215-99",
      clientId: "cli_buyer_demo",
      clientName: "Alice Smith",
      clientCompany: "ALPHA RETAIL LTD",
      supplierName: "SOPRO-CAM S.A.",
      deliveryMode: "Route Heavy Truck (Camion 10t)",
      carrierName: "Afrique Logistique Express",
      waybill: "AWB-LT-893-OM-915",
      items: [
        { productId: "prod_7", productName: "Panneau Solaire Monocristallin 400W Original V1", sku: "SKU-ENE-0001", quantity: 15, unitPrice: 125000, totalPrice: 1875000 }
      ],
      subtotal: 1875000,
      tax: 360937,
      shippingFee: 5000,
      total: 2240937,
      status: "Submitted",
      paymentStatus: "Escrow_Held",
      created_at: "2026-06-25T11:30:00Z",
      history: [
        { status: "Submitted", timestamp: "2026-06-25T11:30:00Z", label: "Bon de commande soumis", description: "Soumission initiale pour ALPHA RETAIL LTD." }
      ]
    },
    ...seedOrders.map(o => ({
      ...o,
      reference: o.reference || o.id || `B2B-PO-2026-${String(Math.random()).slice(-4)}`,
      status: o.status || 'Pending',
      items: o.items || [
        { productId: 'p_1', name: 'Engrais Bio NPK Bag', qty: 200, unitPrice: 12500 },
        { productId: 'p_2', name: 'Pompe Solaire MPPT 500W', qty: 15, unitPrice: 320000 }
      ]
    }))
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
  b2b_suppliers: [
    { id: 'sup_001', name: 'Zama-Agro Sahel', category: 'Intrants Agricoles', email: 'contact@zama-agro.bf', phone: '+226 70 00 00 00', address: 'Bobo-Dioulasso, Burkina Faso', status: 'Active', paymentTerms: 'Net 30', taxId: 'N001' },
    { id: 'sup_002', name: 'SOPRO-CAM S.A.', category: 'Produits Chimiques', email: 'sales@soprocam.cm', phone: '+237 690 00 00 00', address: 'Douala, Cameroun', status: 'Active', paymentTerms: 'Cash on Delivery', taxId: 'N002' },
    { id: 'sup_003', name: 'Nylon Packaging Douala', category: 'Emballages', email: 'pack@nylondouala.cm', phone: '+237 670 00 00 00', address: 'Bonabéri, Cameroun', status: 'Suspended', paymentTerms: 'Net 15', taxId: 'N003' }
  ],
  purchases: [
    { id: 'po_001', supplierIds: ['sup_001'], date: '2026-06-10', items: [{ name: 'Sacs Jute de Cacao', qty: 1000, unitPrice: 1500, supplierId: 'sup_001' }], amount: 1500000, status: 'Received' },
    { id: 'po_002', supplierIds: ['sup_002'], date: '2026-06-14', items: [{ name: 'Intrants Azotés Solubles (Litres)', qty: 250, unitPrice: 19200, supplierId: 'sup_002' }], amount: 4800000, status: 'Sent' },
    { id: 'po_003', supplierIds: ['sup_001', 'sup_003'], date: '2026-06-17', items: [{ name: 'Emballages Thermoscellés Kraft', qty: 5000, unitPrice: 130, supplierId: 'sup_003' }, { name: 'Ficelle Jute', qty: 100, unitPrice: 500, supplierId: 'sup_001' }], amount: 700000, status: 'Draft' }
  ],
  delivery_notes: [
    { id: 'dn_001', purchaseId: 'po_001', supplierId: 'sup_001', date: '2026-06-15', receivedBy: 'Alizéta Traoré', status: 'Verified', items: [{ name: 'Sacs Jute de Cacao', qtyExpected: 1000, qtyReceived: 1000 }] }
  ],
  expenses: [
    { id: 'exp_001', date: '2026-06-05', category: 'Carburant Logistique', amount: 350000, description: 'Livraison Douala-Yaoundé Super' },
    { id: 'exp_002', date: '2026-06-10', category: 'Loyer Entrepôt', amount: 1200000, description: 'Facturation Mensuelle Hub Bassa' },
    { id: 'exp_003', date: '2026-06-15', category: 'Droits de Douane', amount: 890000, description: 'Transit Port Douala Intrants Solaire' },
    { id: 'exp_004', date: '2026-06-17', category: 'Salaires Équipe', amount: 2450000, description: 'Opérateurs entrepôts & dispatch' }
  ],
  team: [
    { id: 'usr_techsupp_mgr', name: 'Jean Dupont', email: 'supplier@enterprise.local', role: 'Business Director', permissions: ['manage_stock', 'issue_rfq', 'approve_orders', 'view_ledger', 'edit_team'] },
    { id: 'usr_techsupp_clerk', name: 'Alizéta Traoré', email: 'clerk@techsupplies.com', role: 'Storage Officer', permissions: ['manage_stock', 'view_ledger'] },
    { id: 'usr_techsupp_helper', name: 'Ibrahim Bello', email: 'bello.helper@techsupplies.com', role: 'Transit Staff', permissions: ['manage_stock'] }
  ],
  withdrawals: [
    { id: 'wth_001', date: '2026-06-02', method: 'Orange Money', amount: 4500000, status: 'Completed', reference: 'OM-TXN-283401' },
    { id: 'wth_002', date: '2026-06-12', method: 'MTN MoMo', amount: 12000000, status: 'Completed', reference: 'MOMO-PAY-983020' },
    { id: 'wth_003', date: '2026-06-16', method: 'Virement de compte CCA Bank', amount: 25000000, status: 'Pending', reference: 'CCA-EFT-400192' }
  ],
  carriers: [
    { id: 'car_001', name: 'Afrique Logistique Express', type: 'Camion 10 Tonnes', plate: 'LT-893-OA', route: 'Douala - Yaoundé - Bafoussam', status: 'Active' },
    { id: 'car_002', name: 'Gofetch Cargo Transit', type: 'Fourgonnette Isotherme', plate: 'CE-412-BB', route: 'Yaoundé - Kribi - Ebolowa', status: 'Transit' },
    { id: 'car_003', name: 'Sawa Express Riders', type: 'Motos Cargo Robust', plate: 'LT-012-MC', route: 'Zone Industrielle de Bassa (Douala)', status: 'Active' }
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
const parsed = saved ? JSON.parse(saved) : defaultState;

export const products = ref(parsed.products);
export const warehouses = ref(parsed.warehouses);
export const orders = ref(parsed.orders);
export const rfqs = ref(parsed.rfqs);
export const stores = ref(parsed.stores);
export const b2b_suppliers = ref(parsed.b2b_suppliers || defaultState.b2b_suppliers);
export const purchases = ref(parsed.purchases);
export const delivery_notes = ref(parsed.delivery_notes || defaultState.delivery_notes);
export const expenses = ref(parsed.expenses);
export const team = ref(parsed.team);
export const withdrawals = ref(parsed.withdrawals);
export const carriers = ref(parsed.carriers);
export const kycDoc = ref(parsed.kycDoc);
export const walletFree = ref(parsed.walletFree !== undefined ? parsed.walletFree : 8500000);
export const walletLocked = ref(parsed.walletLocked || []);

// Watch for deep changes and sync with localStorage
watch(
  [products, warehouses, orders, rfqs, stores, b2b_suppliers, purchases, delivery_notes, expenses, team, withdrawals, carriers, kycDoc, walletFree, walletLocked],
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
  
  // order batches oldest first (id b_1, b_2, etc or date)
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
  
  // Math remaining total stock
  prod.stock = sortedBatches.reduce((acc, b) => acc + b.qty, 0);
  return { success: leftToConsume === 0, consumedDetails };
}
