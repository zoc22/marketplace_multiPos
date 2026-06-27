const fs = require('fs');

const content = `
// --- UTILS ---
export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
export const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const formatCFA = (amount) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(amount);

const CAMEROON_CITIES = [
  { city: 'Douala', region: 'Littoral' }, { city: 'Yaoundé', region: 'Centre' }, { city: 'Bafoussam', region: 'Ouest' },
  { city: 'Bamenda', region: 'Nord-Ouest' }, { city: 'Garoua', region: 'Nord' }, { city: 'Maroua', region: 'Extrême-Nord' },
  { city: 'Ngaoundéré', region: 'Adamaoua' }, { city: 'Bertoua', region: 'Est' }, { city: 'Ebolowa', region: 'Sud' },
  { city: 'Buea', region: 'Sud-Ouest' }, { city: 'Kribi', region: 'Sud' }, { city: 'Limbé', region: 'Sud-Ouest' }
];

const GLOBAL_CITIES = ['Paris', 'New York', 'Shanghai', 'Dubai', 'Abidjan', 'Lagos', 'London', 'Tokyo', 'Sao Paulo', 'Johannesburg', 'Singapour', 'Berlin'];

const firstNames = ['Jean', 'Paul', 'Marie', 'Luc', 'Sophie', 'Pierre', 'Aminata', 'Fatou', 'Kwame', 'Oumar', 'Alice', 'John', 'Li', 'Chen', 'Mohamed'];
const lastNames = ['Ndiaye', 'Kamga', 'Mvondo', 'Dupont', 'Smith', 'Wang', 'Garcia', 'Silva', 'Kim', 'Diop', 'Sow', 'Bello', 'Ali'];
export const generatePersonName = () => \`\${getRandomElement(firstNames)} \${getRandomElement(lastNames)}\`;

// --- 1. CATEGORIES (200+) & SUBCATEGORIES (300+) ---
export const categories = [];
const baseSectors = ['Agriculture', 'Logistics', 'Energy', 'Mining', 'Textiles', 'Machinery', 'Chemicals', 'Livestock', 'Fisheries', 'Forestry'];
for(let i=1; i<=210; i++) {
  const sector = baseSectors[i % baseSectors.length];
  categories.push({
    id: 'cat_' + i,
    name: sector + ' Global Class ' + i,
    sector: sector,
    icon: 'briefcase',
    count: getRandomInt(10, 500)
  });
}

// Subcategories (300+)
for(let i=1; i<=320; i++) {
  categories.push({
    id: 'subcat_' + i,
    parentId: 'cat_' + ((i % 210) + 1),
    name: 'Sub-Category ' + i + ' Spec',
    sector: baseSectors[i % baseSectors.length],
    count: getRandomInt(5, 100)
  });
}

// --- 2. SUPPLIERS (50+) ---
export const suppliers = [];
for(let i=1; i<=60; i++) {
  const cityObj = getRandomElement(CAMEROON_CITIES);
  suppliers.push({
    id: 'supp_' + i,
    name: \`Coopérative Mondiale \${cityObj.city} #\${i} S.A.\`,
    region: cityObj.region,
    rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
    verified: i % 3 !== 0,
    type: i % 2 === 0 ? 'Cooperative' : 'Industrial',
    joined: \`202\${getRandomInt(0,5)}-0\${getRandomInt(1,9)}-15T00:00:00Z\`
  });
}

// --- 3. PRODUCTS (500+) ---
export const products = [];
const units = ['kg', 'tonnes', 'sacs', 'bouteilles', 'palettes', 'caisses', 'unités'];
for(let i=1; i<=520; i++) {
  const supp = getRandomElement(suppliers);
  const cat = getRandomElement(categories.filter(c => !c.parentId));
  const isGlobal = i % 5 === 0;
  products.push({
    id: 'prod_' + i,
    categoryId: cat.id,
    supplierId: supp.id,
    name: \`Produit Industriel / Agricole #\${i} \${isGlobal ? 'International' : 'Local'}\`,
    sku: \`SKU-GBL-\${i.toString().padStart(4, '0')}\`,
    price: getRandomInt(1000, 500000),
    unit: getRandomElement(units),
    description: \`Lot de haute qualité, certifié aux normes internationales. Origine garantie. Idéal pour l'export et l'import B2B massif. Fourni par \${supp.name}.\`,
    stock: getRandomInt(0, 10000),
    status: i % 15 === 0 ? 'out_of_stock' : 'available',
    // LOCAL IMAGES: Using the 30 images we downloaded!
    image: \`/mock/images/\${(i % 30) + 1}.jpg\`,
    created_at: \`2026-0\${getRandomInt(1,6)}-\${getRandomInt(10,28)}T09:00:00Z\`
  });
}

// --- 4. CLIENTS (100+) ---
export const clients = [];
for(let i=1; i<=110; i++) {
  clients.push({
    id: 'client_' + i,
    name: \`Grossiste \${generatePersonName()} & Partners\`,
    country: i % 2 === 0 ? 'Cameroon' : getRandomElement(GLOBAL_CITIES),
    tier: i % 10 === 0 ? 'Platinum' : (i % 3 === 0 ? 'Gold' : 'Standard'),
    totalSpent: getRandomInt(1000000, 500000000)
  });
}

// --- 5. STORES (40+) ---
export const stores = [];
for(let i=1; i<=45; i++) {
  stores.push({
    id: 'store_' + i,
    name: \`Magasin de Gros Hub #\${i}\`,
    city: getRandomElement(CAMEROON_CITIES).city,
    capacity: getRandomInt(100, 1000) + ' palettes'
  });
}

// --- 6. WAREHOUSES (80+) ---
export const warehouses = [];
for(let i=1; i<=85; i++) {
  warehouses.push({
    id: 'wh_' + i,
    name: \`Entrepôt Douanier ZES #\${i}\`,
    zone: i % 2 === 0 ? 'Port Kribi' : 'Port Douala',
    status: 'Active'
  });
}

// --- 7. ORDERS (1000+) & TRANSACTIONS (500+) & DELIVERIES (300+) ---
export const orders = [];
export const transactions = [];
export const deliveries = [];
export const rfqs = [];
export const offers = [];

for(let i=1; i<=1050; i++) {
  const client = getRandomElement(clients);
  const total = getRandomInt(50000, 20000000);
  orders.push({
    id: 'ORD-' + i.toString().padStart(5, '0'),
    clientId: client.id,
    date: \`2026-0\${getRandomInt(1,6)}-\${getRandomInt(10,28)}T09:00:00Z\`,
    status: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'][i % 5],
    total: total
  });
  
  if(i <= 550) {
    transactions.push({
      id: 'TXN-' + i.toString().padStart(5, '0'),
      orderId: 'ORD-' + i.toString().padStart(5, '0'),
      amount: total,
      method: ['Escrow', 'Bank Wire', 'MoMo', 'Crypto'][i % 4],
      status: ['completed', 'pending', 'failed'][i % 3]
    });
  }
  
  if(i <= 320) {
    deliveries.push({
      id: 'DEL-' + i.toString().padStart(5, '0'),
      orderId: 'ORD-' + i.toString().padStart(5, '0'),
      carrier: ['Maersk', 'Bolloré', 'Local Trucking', 'Air France Cargo'][i % 4],
      status: ['in_transit', 'delivered', 'delayed'][i % 3]
    });
  }
  
  if(i <= 350) {
    rfqs.push({
      id: 'RFQ-' + i.toString().padStart(5, '0'),
      clientId: client.id,
      productName: 'Demande spéciale ' + i,
      volume: getRandomInt(10, 500) + ' Tonnes',
      status: ['open', 'closed', 'awarded'][i % 3]
    });
    
    offers.push({
      id: 'OFF-' + i.toString().padStart(5, '0'),
      rfqId: 'RFQ-' + i.toString().padStart(5, '0'),
      supplierId: getRandomElement(suppliers).id,
      priceOffered: getRandomInt(100000, 5000000),
      status: ['pending', 'accepted', 'rejected'][i % 3]
    });
  }
}

// Helpers
export const getSupplierName = (id) => {
  const s = suppliers.find(x => x.id === id);
  return s ? s.name : 'Unknown Coop';
};
export const getCategorySector = (id) => {
  const c = categories.find(x => x.id === id);
  return c ? c.sector : 'General';
};
export const getCameroonRegion = (prodId) => {
  return getRandomElement(CAMEROON_CITIES).region;
};
`;

fs.writeFileSync('c:/wamp64/www/projetSoutenanceV2.1/src/utils/seed_data.js', content);
console.log('Massive seed_data generated successfully.');
