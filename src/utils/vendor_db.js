import { ref, watch } from 'vue';

const STORAGE_KEY = 'vendor_portal_db_v1';

// Magasins / POS par défaut
const defaultStores = [
  { id: 'ST-001', name: 'Supermarché Central', location: 'Douala, Akwa', status: 'Active', posCount: 3 },
  { id: 'ST-002', name: 'Boutique Bonamoussadi', location: 'Douala, Bonamoussadi', status: 'Active', posCount: 1 },
];

// Produits B2C par défaut (prix de vente public, stock magasin, seuil alerte)
const defaultProducts = [
  { id: 'PRD-001', barcode: '370000000001', name: 'Riz Parfumé 5kg', category: 'Alimentaire', price: 4500, stock: 120, minStock: 20, image: 'https://placehold.co/100?text=Riz' },
  { id: 'PRD-002', barcode: '370000000002', name: 'Huile Végétale 1L', category: 'Alimentaire', price: 1200, stock: 45, minStock: 10, image: 'https://placehold.co/100?text=Huile' },
  { id: 'PRD-003', barcode: '370000000003', name: 'Savon de Toilette', category: 'Hygiène', price: 350, stock: 200, minStock: 30, image: 'https://placehold.co/100?text=Savon' },
  { id: 'PRD-004', barcode: '370000000004', name: 'Lait en Poudre 400g', category: 'Alimentaire', price: 2500, stock: 8, minStock: 15, image: 'https://placehold.co/100?text=Lait' }, // Bas stock pour démo alerte
  { id: 'PRD-005', barcode: '370000000005', name: 'Jus d\'Orange 1L', category: 'Boissons', price: 900, stock: 80, minStock: 25, image: 'https://placehold.co/100?text=Jus' },
  { id: 'PRD-006', barcode: '370000000006', name: 'Eau Minérale 1.5L', category: 'Boissons', price: 400, stock: 500, minStock: 50, image: 'https://placehold.co/100?text=Eau' },
  { id: 'PRD-007', barcode: '370000000007', name: 'Sucre en Morceaux', category: 'Alimentaire', price: 800, stock: 60, minStock: 15, image: 'https://placehold.co/100?text=Sucre' },
  { id: 'PRD-008', barcode: '370000000008', name: 'Papier Toilette x6', category: 'Hygiène', price: 1500, stock: 4, minStock: 10, image: 'https://placehold.co/100?text=Papier' }, // Bas stock pour démo alerte
];

const defaultCategories = ['Alimentaire', 'Boissons', 'Hygiène', 'Entretien', 'Électronique'];

const defaultSuppliers = [
  { id: 'SUP-001', name: 'Grossiste Alimentaire SA', email: 'contact@grossiste-alim.com', phone: '+237 600 00 00 01', category: 'Alimentaire', status: 'Active' },
  { id: 'SUP-002', name: 'Bralima Distrib', email: 'distrib@bralima.com', phone: '+237 600 00 00 02', category: 'Boissons', status: 'Active' },
];

const defaultPurchases = [
  { id: 'PO-001', supplierId: 'SUP-001', date: '2026-06-20', expectedDate: '2026-06-25', status: 'Received', items: [{ productId: 'PRD-001', quantity: 50, unitCost: 4000 }], total: 200000 },
  { id: 'PO-002', supplierId: 'SUP-002', date: '2026-06-24', expectedDate: '2026-06-28', status: 'Sent', items: [{ productId: 'PRD-006', quantity: 200, unitCost: 300 }], total: 60000 },
];

const defaultDeliveries = [
  { id: 'DEL-001', purchaseId: 'PO-001', supplierId: 'SUP-001', date: '2026-06-25', status: 'Completed', items: [{ productId: 'PRD-001', expectedQuantity: 50, receivedQuantity: 50 }] }
];

const defaultUsers = [
  { id: 'USR-001', name: 'Alice Caissière', role: 'Cashier', email: 'alice@techsupplies.com', storeId: 'ST-001', status: 'Active' },
  { id: 'USR-002', name: 'Bob Manager', role: 'Store Manager', email: 'bob@techsupplies.com', storeId: 'ST-001', status: 'Active' },
];

const defaultSettings = {
  currency: 'XAF',
  taxRate: 19.25,
  receiptHeader: 'TECHSUPPLIES SARL\nDouala, Akwa\nRCCM: RC/DLA/2023/B/123',
  receiptFooter: 'Merci de votre visite !\nLes articles non ouverts peuvent être retournés sous 7 jours.'
};

const defaultTransactions = [
  {
    id: 'TX-1001',
    sessionId: null,
    storeId: 'Web Store',
    type: 'Online',
    items: [
      { product: { id: 'PRD-001', name: 'Riz Parfumé 5kg', price: 4500 }, quantity: 2, discountPercent: 0 }
    ],
    subtotal: 9000,
    discount: 0,
    tax: 1733,
    total: 10733,
    payments: [{ method: 'MobileMoney', amount: 10733 }],
    status: 'Pending',
    date: '2026-06-24T14:30:00Z',
    customerName: 'Jean Dupont',
    shippingAddress: 'Douala, Bali, Rue 1.2'
  },
  {
    id: 'TX-1002',
    sessionId: 'SESS-12345',
    storeId: 'ST-001',
    type: 'POS',
    items: [
      { product: { id: 'PRD-002', name: 'Huile Végétale 1L', price: 1200 }, quantity: 3, discountPercent: 10 }
    ],
    subtotal: 3240,
    discount: 324,
    tax: 561,
    total: 3477,
    payments: [{ method: 'Cash', amount: 4000, change: 523 }],
    status: 'Completed',
    date: '2026-06-25T09:15:00Z',
    customerName: 'Client Comptant',
    shippingAddress: ''
  }
];
const defaultSessions = [];
const defaultReturns = [
  {
    id: 'RET-001',
    originalTxId: 'TX-1002',
    date: '2026-06-25T10:00:00Z',
    itemsReturned: [{ productId: 'PRD-002', quantity: 1, name: 'Huile Végétale 1L' }],
    refundAmount: 1080,
    refundType: 'Espèces',
    reason: 'Changement d\'avis',
    status: 'Approved'
  }
];

// SVG Dynamic Data URL Generator for offline use
export function getProductSVG(name, category) {
  let color = 'hsl(142, 70%, 45%)'; // emerald
  if (category === 'Alimentaire') color = 'hsl(35, 85%, 55%)'; // amber
  else if (category === 'Boissons') color = 'hsl(200, 80%, 55%)'; // blue
  else if (category === 'Hygiène') color = 'hsl(280, 65%, 60%)'; // purple
  else if (category === 'Entretien') color = 'hsl(180, 65%, 45%)'; // cyan
  
  let icon = '📦';
  if (name.includes('Riz')) icon = '🌾';
  else if (name.includes('Huile')) icon = '🛢️';
  else if (name.includes('Savon')) icon = '🧼';
  else if (name.includes('Lait')) icon = '🥛';
  else if (name.includes('Jus')) icon = '🍹';
  else if (name.includes('Eau')) icon = '💧';
  else if (name.includes('Sucre')) icon = '🍬';
  else if (name.includes('Papier')) icon = '🧻';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <rect width="100" height="100" rx="16" fill="${color}" fill-opacity="0.15"/>
    <rect width="100" height="100" rx="16" stroke="${color}" stroke-width="2" fill="none" stroke-opacity="0.3"/>
    <text x="50" y="45" font-family="system-ui, sans-serif" font-size="28" text-anchor="middle" dominant-baseline="central">${icon}</text>
    <text x="50" y="75" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="${color}" text-anchor="middle" dominant-baseline="central">${name.substring(0, 10)}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const migrateProducts = (productsList) => {
  return productsList.map(p => {
    if (!p.image || p.image.includes('placehold.co') || p.image.includes('placehold.it')) {
      return { ...p, image: getProductSVG(p.name, p.category) };
    }
    return p;
  });
};

// Chargement initial
const saved = localStorage.getItem(STORAGE_KEY);
const parsed = saved ? JSON.parse(saved) : {};

const defaultWalletFree = 550000;
const defaultWalletLocked = [
  { id: 'L-101', refId: 'TX-1001', amount: 10733, type: 'B2C', orderName: 'Commande Web #TX-1001', daysRemaining: 3, totalDays: 5, dateLocked: new Date().toISOString() }
];

export const stores = ref(parsed.stores || defaultStores);
export const vendor_products = ref(migrateProducts(parsed.vendor_products || defaultProducts));
export const categories = ref(parsed.categories || defaultCategories);
export const pos_sessions = ref(parsed.pos_sessions || defaultSessions);
export const transactions = ref(parsed.transactions || defaultTransactions);
export const returns = ref(parsed.returns || defaultReturns);
export const vendor_suppliers = ref(parsed.vendor_suppliers || defaultSuppliers);
export const vendor_purchases = ref(parsed.vendor_purchases || defaultPurchases);
export const vendor_deliveries = ref(parsed.vendor_deliveries || defaultDeliveries);
export const vendor_users = ref(parsed.vendor_users || defaultUsers);
export const vendor_settings = ref(parsed.vendor_settings || defaultSettings);
export const walletFree = ref(parsed.walletFree !== undefined ? parsed.walletFree : defaultWalletFree);
export const walletLocked = ref(parsed.walletLocked || defaultWalletLocked);

// Alias pour s'aligner sur les exigences du plan
export const products = vendor_products;
export const b2c_orders = transactions;
export const b2b_suppliers = vendor_suppliers;
export const b2b_purchases = vendor_purchases;
export const b2b_deliveries = vendor_deliveries;
export const users = vendor_users;
export const settings = vendor_settings;

// Synchronisation automatique
watch(
  [stores, vendor_products, categories, pos_sessions, transactions, returns, vendor_suppliers, vendor_purchases, vendor_deliveries, vendor_users, vendor_settings, walletFree, walletLocked],
  () => {
    const serialized = {
      stores: stores.value,
      vendor_products: vendor_products.value,
      categories: categories.value,
      pos_sessions: pos_sessions.value,
      transactions: transactions.value,
      returns: returns.value,
      vendor_suppliers: vendor_suppliers.value,
      vendor_purchases: vendor_purchases.value,
      vendor_deliveries: vendor_deliveries.value,
      vendor_users: vendor_users.value,
      vendor_settings: vendor_settings.value,
      walletFree: walletFree.value,
      walletLocked: walletLocked.value,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  },
  { deep: true }
);
