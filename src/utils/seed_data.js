
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
export const generatePersonName = () => `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`;

// --- 1. CATEGORIES & SECTORS ---
export const categories = [];
const baseSectors = [
  'Agriculture & Alimentation',
  'Électronique & High-Tech',
  'Mode & Textiles',
  'Énergies & Solaire',
  'Maison & BTP',
  'Santé & Beauté',
  'Automobile & Pièces'
];

const categoryDict = {
  'Agriculture & Alimentation': ['Cacao & Café', 'Fruits Exotiques', 'Épices (Poivre de Penja)', 'Céréales (Maïs, Riz)', 'Huiles Locales'],
  'Électronique & High-Tech': ['Smartphones', 'Ordinateurs Portables', 'Accessoires Réseaux', 'Électroménager', 'Composants Informatiques'],
  'Mode & Textiles': ['Tissus Traditionnels (Ndop)', 'Vêtements Prêt-à-porter', 'Chaussures & Baskets', 'Accessoires de Mode', 'Maroquinerie'],
  'Énergies & Solaire': ['Panneaux Solaires', 'Batteries Gel/Lithium', 'Câblages', 'Générateurs Électriques', 'Onduleurs'],
  'Maison & BTP': ['Ciment & Fer à béton', 'Meubles & Décoration', 'Plomberie', 'Peintures', 'Outillage'],
  'Santé & Beauté': ['Phytothérapie', 'Cosmétiques Naturels', 'Soins Capillaires', 'Savons Artisanaux', 'Parfums'],
  'Automobile & Pièces': ['Pneus & Jantes', 'Pièces Moteur', 'Huiles de Vidange', 'Accessoires Auto', 'Équipements Moto']
};

let catCounter = 1;
for (const [sector, subcats] of Object.entries(categoryDict)) {
  for (const sub of subcats) {
    categories.push({
      id: 'cat_' + catCounter,
      name: sub,
      sector: sector,
      code: sub.substring(0, 3).toUpperCase() + '-' + getRandomInt(10, 99),
      description: `Produits de haute qualité dans la catégorie ${sub}. Disponibles en détail ou en gros.`,
      count: getRandomInt(50, 500)
    });
    catCounter++;
  }
}

// --- 2. BOUTIQUES / VENDEURS (50+) ---
export const suppliers = []; // Fournisseurs industriels
export const vendors = []; // Vendeurs B2C
export const distributors = []; // Grossistes B2B

for(let i=1; i<=60; i++) {
  const cityObj = getRandomElement(CAMEROON_CITIES);
  suppliers.push({
    id: 'supp_' + i,
    name: `Usine / Marque Officielle ${cityObj.city} #${i}`,
    city: cityObj.city,
    region: cityObj.region,
    rating: (Math.random() * 1.5 + 3.5).toFixed(1),
    verified: i % 3 !== 0,
    type: 'Industriel/Fabricant',
    joined: `202${getRandomInt(0,5)}-0${getRandomInt(1,9)}-15T00:00:00Z`
  });
}

// 10 Vendeurs (B2C)
for(let i=1; i<=10; i++) {
  vendors.push({
    id: 'vendor_' + i,
    name: `Boutique Détail #${i}`,
    city: getRandomElement(CAMEROON_CITIES).city,
    rating: 4.5,
    joined: '2025-01-15T00:00:00Z'
  });
}

// 10 Distributeurs (B2B)
for(let i=1; i<=10; i++) {
  distributors.push({
    id: 'dist_' + i,
    name: `Grossiste Distribution B2B #${i}`,
    city: getRandomElement(CAMEROON_CITIES).city,
    rccm: `RCCM-2025-B-${i}000`,
    joined: '2024-06-20T00:00:00Z'
  });
}

// --- 3. PRODUCTS (500+) ---
export const products = [];
const units = ['unité', 'pack', 'kg', 'carton', 'palette', 'tonne'];

// Dictionnaire de noms réels par secteur pour générer des produits cohérents
const productNamesDict = {
  'Agriculture & Alimentation': ['Sac de Cacao Premium (Bord champ)', 'Sachet de Poivre Blanc de Penja', 'Riz Parfumé Ndop', 'Huile de Palme Rouge Pure', 'Miel Pur de l\'Adamaoua', 'Mangues Greffées (Caisse)'],
  'Électronique & High-Tech': ['Smartphone Ultra Pro 5G', 'Ordinateur Portable Gamer 16GB RAM', 'Batterie Externe 20000mAh', 'Écran TV 4K UHD 55"', 'Écouteurs Sans Fil Bluetooth', 'Routeur Wi-Fi 6 Haute Vitesse'],
  'Mode & Textiles': ['Tissu Pagne Wax Original', 'Tenue Traditionnelle Ndop', 'Sneakers Urban Style', 'Robe de Soirée Élégante', 'Sac à Main en Cuir Véritable', 'Costume Homme Sur-mesure'],
  'Énergies & Solaire': ['Panneau Solaire Monocristallin 400W', 'Batterie Solaire Lithium 200Ah', 'Kit Solaire Domestique Complet', 'Onduleur Hybride 5kVA', 'Lampadaire Solaire LED 100W'],
  'Maison & BTP': ['Sac de Ciment 50kg CPJ 35', 'Canapé d\'Angle Moderne', 'Set de Casseroles Inox', 'Fer à Béton 10mm (La barre)', 'Pot de Peinture Acrylique 15L'],
  'Santé & Beauté': ['Lait Corporel au Beurre de Karité', 'Savon Noir Africain', 'Sérum Anti-Âge Naturel', 'Thé Détox Moringa', 'Huile de Baobab Pure', 'Gommage au Café'],
  'Automobile & Pièces': ['Pneu Tout Terrain 4x4', 'Huile Moteur Synthétique 5W40', 'Batterie de Voiture 12V 70Ah', 'Kit de Plaquettes de Frein', 'Housse de Siège Auto Premium']
};

for(let i=1; i<=520; i++) {
  const supp = getRandomElement(suppliers);
  const cat = getRandomElement(categories);
  const isGlobal = i % 5 === 0;
  
  // Noms cohérents
  const possibleNames = productNamesDict[cat.sector] || ['Produit Générique'];
  const baseName = getRandomElement(possibleNames);
  
  // Unsplash URLs by sector to ensure image matches description
  const sectorImages = {
    'Agriculture & Alimentation': [
      'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&q=80',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80',
      'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80',
      'https://images.unsplash.com/photo-1506484381205-f7945653044d?w=600&q=80'
    ],
    'Électronique & High-Tech': [
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
      'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&q=80',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&q=80'
    ],
    'Mode & Textiles': [
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80',
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80'
    ],
    'Maison & BTP': [
      'https://images.unsplash.com/photo-1541888081636-61dc225fbd45?w=600&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356f27?w=600&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80',
      'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=600&q=80'
    ],
    'Énergies & Solaire': [
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80',
      'https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?w=600&q=80',
      'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=600&q=80'
    ],
    'Santé & Beauté': [
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80',
      'https://images.unsplash.com/photo-1556228720-192a6af4e86e?w=600&q=80',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80'
    ],
    'Automobile & Pièces': [
      'https://images.unsplash.com/photo-1600706432502-77a0e2e32729?w=600&q=80',
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&q=80'
    ]
  };
  
  const defaultImages = [
    'https://images.unsplash.com/photo-1586528116311-ad8ed7c50a11?w=600&q=80',
    'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=600&q=80'
  ];
  
  const categoryImages = sectorImages[cat.sector] || defaultImages;
  const prodImgUrl = getRandomElement(categoryImages);
  
  products.push({
    id: 'prod_' + i,
    categoryId: cat.id,
    supplierId: supp.id,
    name: `${baseName} ${isGlobal ? 'International' : 'Original'} V${getRandomInt(1, 5)}`,
    sku: `SKU-${cat.name.substring(0,3).toUpperCase()}-${i.toString().padStart(4, '0')}`,
    price: getRandomInt(2500, 750000),
    unit: cat.sector === 'Agriculture & Alimentation' ? getRandomElement(['kg', 'tonne', 'sac']) : getRandomElement(['unité', 'pack', 'carton']),
    description: `Découvrez la qualité exceptionnelle de ce produit de la catégorie ${cat.name}. Disponible pour les commandes individuelles ou les achats de gros via ${supp.name}. Qualité certifiée pour livraison locale ou internationale.`,
    stock: getRandomInt(5, 5000),
    status: i % 15 === 0 ? 'out_of_stock' : 'available',
    image: prodImgUrl,
    media: [
      { type: 'image', url: prodImgUrl },
      { type: 'image', url: getRandomElement(categoryImages) },
      { type: 'image', url: getRandomElement(categoryImages) },
      { type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail: prodImgUrl }
    ],
    created_at: `2026-0${getRandomInt(1,6)}-${getRandomInt(10,28)}T09:00:00Z`,
    rating: (Math.random() * 2 + 3).toFixed(1), // Note sur 5
    reviewsCount: getRandomInt(0, 350)
  });
}

// --- 4. CLIENTS (100+) ---
export const clients = [];
for(let i=1; i<=110; i++) {
  clients.push({
    id: 'client_' + i,
    name: `Grossiste ${generatePersonName()} & Partners`,
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
    name: `Magasin de Gros Hub #${i}`,
    city: getRandomElement(CAMEROON_CITIES).city,
    capacity: getRandomInt(100, 1000) + ' palettes'
  });
}

// --- 6. WAREHOUSES (80+) ---
export const warehouses = [];
for(let i=1; i<=85; i++) {
  warehouses.push({
    id: 'wh_' + i,
    name: `Entrepôt Douanier ZES #${i}`,
    zone: i % 2 === 0 ? 'Port Kribi' : 'Port Douala',
    status: 'Active'
  });
}

// --- 7. ORDERS (1000+) & TRANSACTIONS (500+) & DELIVERIES (300+) ---
export const orders = []; // Keep old array for legacy B2B tests if needed
export const ordersB2C = []; // Commandes Consommateurs -> Vendeurs
export const ordersB2B = []; // Commandes Vendeurs -> Distributeurs
export const transactions = [];
export const deliveries = [];
export const rfqs = [];
export const offers = [];

for(let i=1; i<=1050; i++) {
  const client = getRandomElement(clients);
  const total = getRandomInt(50000, 20000000);
  
  const orderObj = {
    id: 'ORD-' + i.toString().padStart(5, '0'),
    clientId: client.id,
    date: `2026-0${getRandomInt(1,6)}-${getRandomInt(10,28)}T09:00:00Z`,
    status: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'][i % 5],
    total: total
  };
  orders.push(orderObj);
  
  if (i % 2 === 0) {
    ordersB2C.push({
      ...orderObj,
      id: 'B2C-' + i.toString().padStart(5, '0'),
      vendorId: getRandomElement(vendors).id,
      customerName: generatePersonName()
    });
  } else {
    ordersB2B.push({
      ...orderObj,
      id: 'B2B-' + i.toString().padStart(5, '0'),
      distributorId: getRandomElement(distributors).id,
      vendorId: getRandomElement(vendors).id
    });
  }
  
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
