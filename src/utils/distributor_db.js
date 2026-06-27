import { ref, watch } from 'vue';
import { products as seedProducts, warehouses as seedWarehouses, orders as seedOrders } from './seed_data.js';

const STORAGE_KEY = 'distributor_portal_db_v1';

const defaultState = {
  // Catalogue
  products: seedProducts.map(p => ({
    ...p,
    distributorMargin: 15, // 15% par défaut
    wholesalePrice: p.price * 0.85
  })),
  
  // Réseau de distribution
  warehouses: seedWarehouses.map((w, idx) => ({
    ...w,
    capacity: 1000000 + (idx * 500000), // En kg
    status: idx === 0 ? 'Active' : 'Maintenance',
    categories: ['Agricole', 'Chimique', 'Outillage', 'Emballages'],
    manager: 'Chef Magasinier ' + (idx + 1),
    inventory: seedProducts.slice(0, 5).map(p => ({ id: p.id, name: p.name, stock: p.stock * 10, value: p.stock * p.price * 10 }))
  })),

  // Clients (Vendeurs)
  clients: [
    { id: 'cli_001', name: 'Agri-Centre Bafoussam', type: 'Détaillant', email: 'contact@agricentre.cm', phone: '+237 600 000 000', location: 'Bafoussam, Cameroun', status: 'Actif', totalOrders: 12 },
    { id: 'cli_002', name: 'Coopérative Les Planteurs', type: 'Coopérative', email: 'contact@planteurs.cm', phone: '+237 600 000 001', location: 'Nkongsamba, Cameroun', status: 'Actif', totalOrders: 5 },
    { id: 'cli_003', name: 'Boutique Verte Kribi', type: 'Grossiste Secondaire', email: 'vert@kribi.cm', phone: '+237 600 000 002', location: 'Kribi, Cameroun', status: 'Inactif', totalOrders: 0 }
  ],

  // Fournisseurs Industriels (Amont)
  b2b_suppliers: [
    { id: 'sup_001', name: 'Zama-Agro Sahel', category: 'Intrants Agricoles', email: 'contact@zama-agro.bf', phone: '+226 70 00 00 00', address: 'Bobo-Dioulasso, Burkina Faso', status: 'Active', paymentTerms: 'Net 30', taxId: 'N001' },
    { id: 'sup_002', name: 'SOPRO-CAM S.A.', category: 'Produits Chimiques', email: 'sales@soprocam.cm', phone: '+237 690 00 00 00', address: 'Douala, Cameroun', status: 'Active', paymentTerms: 'Cash on Delivery', taxId: 'N002' },
    { id: 'sup_003', name: 'Nylon Packaging Douala', category: 'Emballages', email: 'pack@nylondouala.cm', phone: '+237 670 00 00 00', address: 'Bonabéri, Cameroun', status: 'Suspended', paymentTerms: 'Net 15', taxId: 'N003' }
  ],

  // Achats chez les fournisseurs industriels
  purchases: [
    { id: 'po_001', supplierIds: ['sup_001'], date: '2026-06-10', items: [{ name: 'Sacs Jute de Cacao', qty: 10000, unitPrice: 1200, supplierId: 'sup_001' }], amount: 12000000, status: 'Received' },
    { id: 'po_002', supplierIds: ['sup_002'], date: '2026-06-14', items: [{ name: 'Engrais NPK (Tonnes)', qty: 50, unitPrice: 350000, supplierId: 'sup_002' }], amount: 17500000, status: 'Sent' },
    { id: 'po_003', supplierIds: ['sup_001', 'sup_003'], date: '2026-06-17', items: [{ name: 'Emballages Thermoscellés Kraft', qty: 50000, unitPrice: 100, supplierId: 'sup_003' }, { name: 'Ficelle Jute', qty: 1000, unitPrice: 400, supplierId: 'sup_001' }], amount: 5400000, status: 'Draft' }
  ],

  // Bons de livraison (Réceptions depuis fournisseurs amont)
  delivery_notes: [
    { id: 'dn_001', purchaseId: 'po_001', supplierId: 'sup_001', date: '2026-06-15', receivedBy: 'Chef Magasinier 1', status: 'Verified', items: [{ name: 'Sacs Jute de Cacao', qtyExpected: 10000, qtyReceived: 10000 }] }
  ],

  // Commandes clients (Ventes aux revendeurs)
  orders: seedOrders.map(o => ({
    ...o,
    status: o.status || 'Pending',
    client: 'cli_001',
    items: o.items || [
      { productId: 'p_1', name: 'Engrais Bio NPK Bag', qty: 200, unitPrice: 12500 },
      { productId: 'p_2', name: 'Pompe Solaire MPPT 500W', qty: 15, unitPrice: 320000 }
    ]
  })),

  // RFQ
  rfqs: [],

  // Équipe
  team: [
    { id: 'usr_dist_mgr', name: 'Alice Ndoumbe', email: 'alice@distributeur.local', role: 'Directrice Logistique', status: 'Active' },
    { id: 'usr_dist_clerk', name: 'Paul Biya', email: 'paul@distributeur.local', role: 'Chef Magasinier', status: 'Active' }
  ]
};

const saved = localStorage.getItem(STORAGE_KEY);
const parsed = saved ? JSON.parse(saved) : defaultState;

const defaultWalletFree = 12000000;
const defaultWalletLocked = [
  { id: 'L-201', refId: 'po_002', amount: 17500000, type: 'B2B', orderName: 'Achat Engrais #po_002', daysRemaining: 4, totalDays: 7, dateLocked: new Date().toISOString() }
];

export const products = ref(parsed.products);
export const warehouses = ref(parsed.warehouses);
export const clients = ref(parsed.clients);
export const b2b_suppliers = ref(parsed.b2b_suppliers);
export const purchases = ref(parsed.purchases);
export const delivery_notes = ref(parsed.delivery_notes);
export const orders = ref(parsed.orders);
export const rfqs = ref(parsed.rfqs);
export const team = ref(parsed.team);
export const walletFree = ref(parsed.walletFree !== undefined ? parsed.walletFree : defaultWalletFree);
export const walletLocked = ref(parsed.walletLocked || defaultWalletLocked);

watch(
  [products, warehouses, clients, b2b_suppliers, purchases, delivery_notes, orders, rfqs, team, walletFree, walletLocked],
  () => {
    const serialized = {
      products: products.value,
      warehouses: warehouses.value,
      clients: clients.value,
      b2b_suppliers: b2b_suppliers.value,
      purchases: purchases.value,
      delivery_notes: delivery_notes.value,
      orders: orders.value,
      rfqs: rfqs.value,
      team: team.value,
      walletFree: walletFree.value,
      walletLocked: walletLocked.value
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  },
  { deep: true }
);
