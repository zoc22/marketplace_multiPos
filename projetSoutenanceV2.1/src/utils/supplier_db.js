import { ref, watch } from 'vue';
import { products as seedProducts, warehouses as seedWarehouses, orders as seedOrders, rfqQuotes as seedRFQs, stores as seedStores } from './seed_data.js';

// Load from localStorage or set default
const STORAGE_KEY = 'supplier_portal_db_v2';

const defaultState = {
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
    description: w.description || 'Controlled temp logistics hub'
  })),
  orders: seedOrders.map(o => ({
    ...o,
    status: o.status || 'Pending',
    items: o.items || [
      { productId: 'p_1', name: 'Engrais Bio NPK Bag', qty: 200, unitPrice: 12500 },
      { productId: 'p_2', name: 'Pompe Solaire MPPT 500W', qty: 15, unitPrice: 320000 }
    ]
  })),
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
    { id: 'po_001', supplier: 'Zama-Agro Sahel', date: '2026-06-10', items: 'Sacs Jute de Cacao (x1000)', amount: 1500000, status: 'Received' },
    { id: 'po_002', supplier: 'SOPRO-CAM S.A.', date: '2026-06-14', items: 'Intrants Azotés Solubles (x250 Litres)', amount: 4800000, status: 'Sent' },
    { id: 'po_003', supplier: 'Nylon Packaging Douala', date: '2026-06-17', items: 'Emballages Thermoscellés Kraft (x5000)', amount: 650000, status: 'Draft' }
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
export const purchases = ref(parsed.purchases);
export const expenses = ref(parsed.expenses);
export const team = ref(parsed.team);
export const withdrawals = ref(parsed.withdrawals);
export const carriers = ref(parsed.carriers);
export const kycDoc = ref(parsed.kycDoc);

// Watch for deep changes and sync with localStorage
watch(
  [products, warehouses, orders, rfqs, stores, purchases, expenses, team, withdrawals, carriers, kycDoc],
  () => {
    const serialized = {
      products: products.value,
      warehouses: warehouses.value,
      orders: orders.value,
      rfqs: rfqs.value,
      stores: stores.value,
      purchases: purchases.value,
      expenses: expenses.value,
      team: team.value,
      withdrawals: withdrawals.value,
      carriers: carriers.value,
      kycDoc: kycDoc.value
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
