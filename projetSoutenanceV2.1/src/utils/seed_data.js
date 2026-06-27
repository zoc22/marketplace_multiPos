/**
 * Seed Data Generator
 * Rich, high-volume, realistic Cameroon/African context datasets
 * Relations: Product -> Supplier -> Warehouse -> Stock -> Order -> Delivery -> Payment/Transaction -> RFQ -> Offer
 */

// Simple deterministic pseudo-random number generator (LCG) to ensure stable data on reloads
function createRandom(seed = 42) {
  let currentSeed = seed;
  return function() {
    // LCG parameters (Numerical Recipes)
    currentSeed = (currentSeed * 1664525 + 1013904223) % 4294967296;
    return currentSeed / 4294967296;
  };
}

const random = createRandom(20260618);

function getRandomElement(arr, rng = random) {
  return arr[Math.floor(rng() * arr.length)];
}

function getRandomInt(min, max, rng = random) {
  return Math.floor(rng() * (max - min)) + min;
}

function getRandomFloat(min, max, decimalPlaces = 2, rng = random) {
  const rand = rng() * (max - min) + min;
  const power = Math.pow(10, decimalPlaces);
  return Math.floor(rand * power) / power;
}

// CAMEROON CITIES & TOWNS WITH REGIONS
const CAMEROON_CITIES = [
  { city: "Douala", region: "Littoral", prefix: "DLA" },
  { city: "Yaoundé", region: "Centre", prefix: "YDE" },
  { city: "Bafoussam", region: "Ouest", prefix: "BAF" },
  { city: "Garoua", region: "Nord", prefix: "GAR" },
  { city: "Bamenda", region: "Nord-Ouest", prefix: "BMD" },
  { city: "Maroua", region: "Extrême-Nord", prefix: "MRA" },
  { city: "Ngaoundéré", region: "Adamaoua", prefix: "NGA" },
  { city: "Kribi", region: "Sud", prefix: "KRI" },
  { city: "Buea", region: "Sud-Ouest", prefix: "BUE" },
  { city: "Bertoua", region: "Est", prefix: "BER" },
  { city: "Nkongsamba", region: "Littoral", prefix: "NKS" },
  { city: "Foumban", region: "Ouest", prefix: "FMN" },
  { city: "Dschang", region: "Ouest", prefix: "DSG" },
  { city: "Ebolowa", region: "Sud", prefix: "EBO" },
  { city: "Edéa", region: "Littoral", prefix: "EDA" },
  { city: "Limbe", region: "Sud-Ouest", prefix: "LMB" }
];

// REAL-WORLD CAMEROONIAN NAMES
const FIRST_NAMES = [
  "Jean", "Pierre", "Amadou", "Sali", "Dieudonné", "Marie", "Chantal", "Salomon", "Emile", "Félix", "Thérèse", 
  "Abdoulaye", "Ousmanou", "Etonde", "Ngando", "Ebenezer", "Armel", "Cyrille", "Gilles", "Sidonie", "Florent", 
  "Béatrice", "Guillaume", "Raoul", "Marc", "Alice", "Robert", "Chanceline", "Nadege", "Ateba", "Moustapha", 
  "Innocent", "Pascal", "Yolande", "Barthélémy", "Célestin", "Esther", "Aboucar", "Fadimatou", "Hamidou"
];

const SURNAMES = [
  "Fotso", "Kamga", "Nguene", "Tchatchouang", "Ndi", "Atangana", "Mvondo", "Bella", "Doumbe", "Ekotto", "Yondo", 
  "Belinga", "Ngassam", "Talla", "Simo", "Abena", "Ona", "Koundé", "Zambo", "Tagne", "Ewane", "Gwet", "Biya", 
  "Abessolo", "Ndongo", "Song", "Eto'o", "Mbappe", "Ahanda", "Mefire", "Djoko", "Kamdem", "Wambo"
];

function generatePersonName() {
  const first = getRandomElement(FIRST_NAMES);
  const last = getRandomElement(SURNAMES);
  return `${first} ${last}`;
}

// --- GENERATOR 1: CATEGORIES & SUB-CATEGORIES (200+ Categories, 300+ Sub-categories) ---
export const categories = [];
export const subcategories = [];

const BASE_SECTOR_TEMPLATES = [
  { code: "AGR", name: "Agriculture", sub: ["Intrants", "Semences", "Outillages", "Moisson", "Irrigation", "Engrais Bios", "Silos", "Greehouse"] },
  { code: "ALM", name: "Alimentation Générale", sub: ["Tubercules", "Féculent", "Épices Locales", "Arachides", "Farines", "Céréales Nord", "Fruits tropicaux", "Produits Maraichers"] },
  { code: "EXP", name: "Cacao & Café Export", sub: ["Fèves Brutes", "Poudre de cacao", "Beurre de cacao", "Café Robusta Moulu", "Café Arabica Vert", "Torréfaction", "Sacs Jute"] },
  { code: "BTP", name: "Matériaux de Construction (BTP)", sub: ["Ciment Cameroun", "Fer à Béton", "Tôles Alu", "Plomberie PVC", "Sable du Ntem", "Graviers Carrière", "Briques Cuites"] },
  { code: "ENR", name: "Énergies & Solaire Africain", sub: ["Panneaux Solaires", "Batteries Gel", "Régulateurs MPPT", "Onduleurs Hybrides", "Kits Domestiques", "Lampadaires Solaires"] },
  { code: "TXT", name: "Textiles Traditional Cameroun", sub: ["Ndop Ouest", "Toghu Bamenda", "Pagne Ngondo", "Kaba Sawa", "Bazin Riche", "Coton Brut", "Fils de couleur"] },
  { code: "MED", name: "Phytothérapie & Pharmacopée", sub: ["Écorces de Ndolo", "Extraits de Ginseng", "Seringues Jetables", "Solutés Ringer", "Gants Médicaux", "Coussins Thermiques"] },
  { code: "TEL", name: "Télécoms, Connectivité MTN/Orange", sub: ["Cartes de recharge", "Modems 4G Cam", "Routeurs Pro", "Câbles Réseau", "Puces GSM", "Antennes Relais"] },
  { code: "LOG", name: "Flottes & Pièces Logistiques", sub: ["Pneus Camions", "Lubrifiants Moteur", "Filtres à gasoil", "Courroies d'engins", "Gilets Haute Visibilité"] },
  { code: "ART", name: "Artisanat d'Afrique Centrale", sub: ["Masques en Bois", "Paniers de rotin", "Poterie de Maroua", "Bronzes de Foumban", "Peaux de Cuir", "Colliers Perles"] }
];

// Let's generate 205 Categories deterministically
// We expand the base sectors by adding Cameroon regions or usage modifiers to achieve exactly 205 categories and 305 subcategories!
let categoryCounter = 1;
let subcategoryCounter = 1;

while (categories.length < 205) {
  for (const sector of BASE_SECTOR_TEMPLATES) {
    if (categories.length >= 205) break;
    
    // Add variations representing specialized domains across Cameroon provinces
    const currentCityObj = getRandomElement(CAMEROON_CITIES);
    const regionName = currentCityObj.region;
    const modifier = categories.length % 3 === 0 
      ? ` - Bassin de ${currentCityObj.city}` 
      : (categories.length % 3 === 1 ? ` - Spécialité ${regionName}` : ` - Catégorie Standard #${categories.length + 1}`);

    const categoryId = `cat_${categoryCounter++}`;
    const categoryName = `${sector.name}${modifier}`;
    
    categories.push({
      id: categoryId,
      code: `${sector.code}-${getRandomInt(100, 999)}`,
      name: categoryName,
      sector: sector.name,
      description: `Gamme de produits professionnels ${sector.name} rattachée au pôle régional ${regionName}.`,
    });

    // Populate Subcategories (Each category should have 1 to 3 subcategories)
    // We will generate at least 305 subcategories
    const subCount = getRandomInt(1, 3);
    for (let s = 0; s < subCount; s++) {
      const parentSubName = getRandomElement(sector.sub);
      const subNameModifier = s === 0 ? "Premium" : (s === 1 ? "Standard" : "Vrac/Grossiste");
      const subId = `sub_${subcategoryCounter++}`;
      
      subcategories.push({
        id: subId,
        categoryId: categoryId,
        name: `${parentSubName} - ${subNameModifier}`,
        code: `${sector.code}-SUB-${getRandomInt(1000, 9999)}`,
        description: `Sous-classe logistique de ${parentSubName} pour les transactions B2B d'Afrique Subsaharienne.`
      });
    }
  }
}

// Make sure we have exactly at least 305 subcategories. 
// If not, add trailing subcategories
while (subcategories.length < 305) {
  const parentCat = getRandomElement(categories);
  const subId = `sub_${subcategoryCounter++}`;
  subcategories.push({
    id: subId,
    categoryId: parentCat.id,
    name: `Sous-Secteur Spécialisé V${subcategories.length + 1}`,
    code: `SPEC-SUB-${getRandomInt(1000, 9999)}`,
    description: `Division complémentaire pour atteindre le volume d'audit standard.`
  });
}


// --- GENERATOR 2: SUPPLIERS (50+ Suppliers / Fournisseurs) ---
export const suppliers = [];
const SUPPLIER_BRANDS = [
  "Société Camerounaise de Cacao (Soca-Cacao)",
  "Confédération Coopérative du Poivre Blanc de Penja",
  "Agro-Industries de l'Ouest (AIO S.A.)",
  "Sahel Grain & Céréales S.A.",
  "Établissements Mbouda Frères & Cie",
  "Les Grandes Plantations de la Sanaga",
  "Union Coopérative de Caféière du Moungo",
  "Union des GIC de la Plaine du Noun",
  "Kribi Logistique Industrielle Port",
  "Douala Agro-Exporting Group S.A.",
  "Sodecoton S.A. Garoua Centrale",
  "Cameroon Tea Estates (CTE)",
  "Socapalm S.A. Edéa",
  "Cameroun Engrais & Semences (CES)",
  "Bafoussam Matériaux Distribution",
  "Sawa Woodworks & Lumber SARL",
  "Mokolo Maraichers Cooperative",
  "Afrinetwork Telecom & Fibre SARL",
  "Centrale Solaire du Cameroun",
  "Pharmacie de la Réunification Douala"
];

for (let i = 1; i <= 55; i++) {
  const cityObj = getRandomElement(CAMEROON_CITIES);
  const companyName = i <= SUPPLIER_BRANDS.length 
    ? SUPPLIER_BRANDS[i - 1] 
    : `Ets ${generatePersonName()} & Fils (${cityObj.city})`;

  const supplierId = `supp_${i}`;
  suppliers.push({
    id: supplierId,
    name: companyName,
    managerName: generatePersonName(),
    email: `contact@${companyName.toLowerCase().replace(/[^a-z0-9]/g, "")}.cm`,
    phone: `+237 6${getRandomInt(5, 9)}${getRandomInt(10, 99)}${getRandomInt(10, 99)}${getRandomInt(10, 99)}`,
    address: `Rue de la Gare, Quartier ${getRandomElement(["Bastos", "Akwa", "Ancien Aéroport", "Mvan", "Ndokoti", "Nlongkak"])}, ${cityObj.city}`,
    city: cityObj.city,
    region: cityObj.region,
    rc: `${cityObj.prefix}-RC-2026-B-${getRandomInt(1000, 9999)}`,
    niu: `M${getRandomInt(100, 999)}000${getRandomInt(100000, 999999)}B`,
    verified: i % 10 !== 0, // 1 in 10 is pending
    created_at: `2026-${getRandomElement(["01", "02", "03", "04", "05"])}-${getRandomInt(10, 28)}T10:00:00Z`
  });
}


// --- GENERATOR 3: CLIENTS / BUYERS (100+ Clients) ---
export const clients = [];
const DEPT_COMPANIES = [
  "Dovv Supermarchés S.A.", "Santa Lucia Distributeurs", "Spar Douala Mall Procurement", "Boulangerie Acropole Yaoundé", 
  "Ets Baba et Sœur (Ngaoundéré)", "Kribi Fishmongers Union", "Chantier Naval du Littoral", "Coopérative Rizicole de Yagoua",
  "Sorepco Quincaillerie Centrale", "Quincaillerie Fokou Douala", "Africa Solar Solutions SARL", "Supermarché Mahima Akwa"
];

for (let i = 1; i <= 105; i++) {
  const cityObj = getRandomElement(CAMEROON_CITIES);
  const companyName = i <= DEPT_COMPANIES.length 
    ? DEPT_COMPANIES[i - 1] 
    : `Société Commerciale ${generatePersonName()} (${cityObj.city})`;

  clients.push({
    id: `cli_${i}`,
    name: generatePersonName(),
    company: companyName,
    email: `procure@${companyName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
    phone: `+237 6${getRandomInt(5, 9)}${getRandomInt(10, 99)}${getRandomInt(10, 99)}${getRandomInt(10, 99)}`,
    address: `Avenue Charles de Gaulle, ${cityObj.city}`,
    city: cityObj.city,
    region: cityObj.region,
    status: i % 15 === 0 ? "restricted" : "approved",
    joined_at: `2026-${getRandomElement(["01", "02", "03", "04", "05"])}-${getRandomInt(10, 28)}T08:00:00Z`
  });
}


// --- GENERATOR 4: PRODUCTS (500+ Products / Produits) ---
export const products = [];
const REALISTIC_PRODUCT_TITLES = [
  { name: "Poivre Blanc de Penja Premium", basePrice: 12000, desc: "Poivre blanc authentique labellisé IGP Penja, récolté à la main." },
  { name: "Cacao Noir Brut Supérieur Sangmélima", basePrice: 3200, desc: "Fèves de cacao séchées au soleil, fermentation optimale de 6 jours." },
  { name: "Café Arabica Pur Foumbot d'altitude", basePrice: 4500, desc: "Grains torréfiés artisanalement sur les hauts plateaux de l'Ouest." },
  { name: "Café Robusta Sélection Moungo", basePrice: 3100, desc: "Robusta fort avec beaucoup de corps, idéal pour espresso corsé." },
  { name: "Miel Blanc Raffiné d'Adamaoua", basePrice: 6500, desc: "Miel blanc crémeux extrait des forêts de Ngaoundéré." },
  { name: "Huile de Palme Rouge Pure Socapalm", basePrice: 1400, desc: "Huile extraite par pression mécanique douce pour usages divers." },
  { name: "Sacs de Maïs Blanc Concasseur Garoua", basePrice: 18000, desc: "Céréales de qualité supérieure idéal pour la fabrication de farines." },
  { name: "Bâtons de Manioc Bobolo Traditionnels", basePrice: 3500, desc: "Pack grossiste de bâtonnets de manioc fermenté et étuvé." },
  { name: "Tomates de Foumbot en cageots de 20kg", basePrice: 15000, desc: "Tomates charnues fraîches idéales pour grossistes de marchés urbains." },
  { name: "Oignons Rouges de Garoua Sac 50kg", basePrice: 24000, desc: "Oignons rustiques séchés sur paille, excellente conservation." },
  { name: "Ciment Cimencam Multi-Usages 42.5R", basePrice: 5100, desc: "Sac de ciment de haute résistance produit à l'usine de Bonabéri." },
  { name: "Kit Solaire Domestique 250W + Ampoules", basePrice: 145000, desc: "Panneau solaire monocristallin complet avec batteries de stockage gel." },
  { name: "Écorce de Ndolo Médicinale Séchée", basePrice: 8500, desc: "Écorces préparées en sachets de 500g pour décoctions traditionnelles." },
  { name: "Ndop Traditionnel Tissé Rouge-Bleu", basePrice: 65000, desc: "Tissu royal de l'Ouest Cameroun, brodé main sur coton local." },
  { name: "Toghu Royal Bamenda Brodé Or", basePrice: 55000, desc: "Habit cérémoniel de luxe avec motifs colorés géométriques cousus main." }
];

for (let i = 1; i <= 505; i++) {
  // Coherently link to category & subcategory, and supplier
  const sub = getRandomElement(subcategories);
  const cat = categories.find(c => c.id === sub.categoryId);
  const supp = getRandomElement(suppliers);
  
  const baseTpl = REALISTIC_PRODUCT_TITLES[i % REALISTIC_PRODUCT_TITLES.length];
  const itemModifier = i % 4 === 0 ? " - Lot Standard" : (i % 4 === 1 ? " - Premium Grade A" : (i % 4 === 2 ? " - Export Qualité" : " - Vrac Coopérative"));
  const finalPrice = Math.floor(baseTpl.basePrice * getRandomFloat(0.85, 1.3, 2) / 50) * 50; // rounded to 50 XAF (Cameroun currency convention)

  products.push({
    id: `prod_${i}`,
    name: `${baseTpl.name}${itemModifier}`,
    sku: `CMR-PROD-${cat.code.split('-')[0]}-${i.toString().padStart(4, '0')}`,
    categoryId: cat.id,
    subcategoryId: sub.id,
    supplierId: supp.id,
    price: finalPrice,
    unit: ["kg", "sac 50kg", "régime", "kit", "tige", "mètre", "carton", "bouteille"][i % 8],
    description: `${baseTpl.desc} Fourni par ${supp.name} sous contrôle sanitaire douanier.`,
    stock: getRandomInt(80, 5500),
    status: i % 24 === 0 ? "out_of_stock" : "available",
    image: `https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&q=80&w=200`,
    created_at: `2026-02-${(i % 27 + 1).toString().padStart(2, '0')}T09:00:00Z`
  });
}


// --- GENERATOR 5: POS STORES (40+ Stores / Magasins) ---
export const stores = [];
const STORE_PREFIXES = ["Dovv", "Santa Lucia", "Spar", "Acropole", "Leader Price", "Carrefour Express", "Marché Bio"];

for (let i = 1; i <= 42; i++) {
  const cityObj = getRandomElement(CAMEROON_CITIES);
  const storeName = `${getRandomElement(STORE_PREFIXES)} - Enclave ${cityObj.city} #${i}`;
  
  stores.push({
    id: `store_${i}`,
    name: storeName,
    city: cityObj.city,
    address: `${getRandomInt(10, 250)} Rue de l'Indépendance, Quartier Central, ${cityObj.city}`,
    phone: `+237 233 ${getRandomInt(40, 49)} ${getRandomInt(10, 99)} ${getRandomInt(10, 99)}`,
    isActive: true,
    cashRegistersCount: getRandomInt(2, 8),
    managerName: generatePersonName(),
    dailyTargetXAF: getRandomInt(500, 4500) * 1000
  });
}


// --- GENERATOR 6: WAREHOUSES & STOCKS (80+ Warehouses / Entrepôts) ---
export const warehouses = [];
export const stocks = [];

const WAREHOUSE_AREAS = [
  "Zone Portuaire Douala", "Mvan Gare Routière Yaoundé", "Marché A Bafoussam Hub", "Silo Sodecoton Garoua", 
  "Bamenda Commercial Avenue", "Zone Industrielle Bertoua", "Kribi Deep Sea Port Hangar", "Buea Mile 4 Logistics"
];

for (let i = 1; i <= 82; i++) {
  const cityObj = getRandomElement(CAMEROON_CITIES);
  const area = getRandomElement(WAREHOUSE_AREAS);
  const warehouseName = `Entrepôt ${area} (${cityObj.city} #${i})`;

  warehouses.push({
    id: `wh_${i}`,
    name: warehouseName,
    city: cityObj.city,
    address: `Liaison Route Nationale, Zone Industrielle, ${cityObj.city}`,
    capacityCubicMeters: getRandomInt(1000, 15000),
    temperatureControlled: i % 4 === 0,
    isActive: true,
    managerName: generatePersonName(),
    phone: `+237 6${getRandomInt(7, 9)}${getRandomInt(100, 999)}0${getRandomInt(10, 99)}`
  });
}

// Generate Stocks (FIFO stock queues linking products and warehouses)
// To maintain coherence, we link 10 products per warehouse, creating exactly ~820 stock records
let stockIdCounter = 1;
for (let wIdx = 0; wIdx < warehouses.length; wIdx++) {
  const wh = warehouses[wIdx];
  for (let pIdx = 0; pIdx < 10; pIdx++) {
    // Select product deterministically to ensure stable mapping
    const prod = products[(wIdx * 10 + pIdx) % products.length];
    
    stocks.push({
      id: `stock_${stockIdCounter++}`,
      warehouseId: wh.id,
      productId: prod.id,
      quantityInStock: getRandomInt(50, 1200),
      batchNumber: `BAT-2026-F${getRandomInt(1000, 9999)}`,
      expiryDate: getRandomElement(["2026-12-31", "2027-04-18", "2027-08-24", null]),
      lastAuditAt: `2026-06-${getRandomInt(10, 18)}T15:00:00`
    });
  }
}


// --- GENERATOR 7: ORDERS (1000+ Orders / Commandes) ---
export const orders = [];
const ORDER_STATUSES = ["Completed", "Completed", "Completed", "Pending", "Paid", "Shipped", "Cancelled"];

let orderIdCounter = 1;
const startTS = new Date("2026-01-01T08:00:00Z").getTime();
const endTS = new Date("2026-06-18T12:00:00Z").getTime();

while (orders.length < 1005) {
  const client = getRandomElement(clients);
  const dateObj = new Date(startTS + (endTS - startTS) * random());
  const formattedDate = dateObj.toISOString();
  
  // Choose random number of items (between 1 and 4)
  const lineItemsCount = getRandomInt(1, 4);
  const itemsList = [];
  let subTotal = 0;
  
  // Keep track of products added to avoid duplicate SKUs in same order
  const addedProductIds = new Set();
  
  for (let idx = 0; idx < lineItemsCount; idx++) {
    const prod = getRandomElement(products);
    if (addedProductIds.has(prod.id)) continue;
    addedProductIds.add(prod.id);

    const qty = getRandomInt(5, 50);
    const linePrice = prod.price;
    const lineTotal = linePrice * qty;
    subTotal += lineTotal;

    itemsList.push({
      productId: prod.id,
      productName: prod.name,
      sku: prod.sku,
      quantity: qty,
      unitPrice: linePrice,
      totalPrice: lineTotal
    });
  }

  if (itemsList.length === 0) continue; // Skip empty orders

  const taxXAF = Math.floor(subTotal * 0.1925); // Cameroun VAT = 19.25%
  const shippingFeeXAF = getRandomInt(3, 15) * 1000;
  const totalAmountXAF = subTotal + taxXAF + shippingFeeXAF;
  
  const status = getRandomElement(ORDER_STATUSES);

  orders.push({
    id: `ord_${orderIdCounter++}`,
    reference: `B2B-ORD-${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${orderIdCounter.toString().padStart(5, '0')}`,
    clientId: client.id,
    clientName: client.name,
    clientCompany: client.company,
    items: itemsList,
    subtotal: subTotal,
    tax: taxXAF,
    shippingFee: shippingFeeXAF,
    total: totalAmountXAF,
    status: status,
    paymentStatus: status === "Completed" || status === "Paid" || status === "Shipped" ? "Settled" : (status === "Cancelled" ? "Refunded" : "Escrow_Held"),
    created_at: formattedDate
  });
}

// Sort orders chronologically to make tables and histories look extremely natural
orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());


// --- GENERATOR 8: DELIVERIES (300+ Deliveries / Livraisons) ---
export const deliveries = [];

// Generate exact count of 305 deliveries
// We link them to completed, shipped, or paid orders from our orders array
let deliveryIdCounter = 1;
let orderIndex = 0;

while (deliveries.length < 305 && orderIndex < orders.length) {
  const ord = orders[orderIndex++];
  // Only create waybills for orders that have logic to be shipped or completed
  if (ord.status === "Completed" || ord.status === "Shipped" || ord.status === "Paid") {
    const wh = getRandomElement(warehouses);
    const clientRecord = clients.find(c => c.id === ord.clientId);
    const shipDate = new Date(new Date(ord.created_at).getTime() + getRandomInt(24, 72) * 3600000);
    const delivDate = ord.status === "Completed" 
      ? new Date(shipDate.getTime() + getRandomInt(24, 48) * 3600000) 
      : null;

    deliveries.push({
      id: `deliv_${deliveryIdCounter++}`,
      waybillNumber: `CMR-WYB-2026-${getRandomInt(100, 999)}-${deliveryIdCounter.toString().padStart(4, '0')}`,
      orderId: ord.id,
      orderReference: ord.reference,
      originWarehouseId: wh.id,
      originWarehouseName: wh.name,
      destinationAddress: `${ord.clientCompany}, ${clientRecord?.address || 'Avenue centrale'}, ${clientRecord?.city || 'Douala'}`,
      carrierName: getRandomElement(["Camrail Fret Express", "Soletrans Douala Port", "Afriland Shippers Ltd", "Guaranty Cargo", "Mory Cam Cargo"]),
      status: ord.status === "Completed" ? "Delivered" : "In_Transit",
      dispatchedAt: shipDate.toISOString(),
      deliveredAt: delivDate ? delivDate.toISOString() : null,
      trackingUrl: `https://logistic.enterprise.local/track/CMR-${deliveryIdCounter}`
    });
  }
}

// Ensure at least 305 deliveries (by relaxing filter if needed)
while (deliveries.length < 305) {
  const ord = getRandomElement(orders);
  const wh = getRandomElement(warehouses);
  deliveries.push({
    id: `deliv_${deliveryIdCounter++}`,
    waybillNumber: `CMR-WYB-2026-${getRandomInt(100, 999)}-${deliveryIdCounter.toString().padStart(4, '0')}`,
    orderId: ord.id,
    orderReference: ord.reference,
    originWarehouseId: wh.id,
    originWarehouseName: wh.name,
    destinationAddress: `${ord.clientCompany}, Douala Quartier Sawa`,
    carrierName: "Soletrans Douala Port",
    status: "Pending_Pickup",
    dispatchedAt: null,
    deliveredAt: null,
    trackingUrl: `https://logistic.enterprise.local/track/CMR-${deliveryIdCounter}`
  });
}


// --- GENERATOR 9: TRANSACTIONS / ESCROWS (500+ Transactions) ---
export const transactions = [];

// We will generate exactly 505 financial transaction movements
// Most of them map directly to B2B orders, representing payment collections
let transactionIdCounter = 1;

for (let i = 0; i < orders.length; i++) {
  if (transactions.length >= 505) break;
  const ord = orders[i];

  transactions.push({
    id: `tx_${transactionIdCounter++}`,
    reference: `TXN-XAF-2026-${transactionIdCounter.toString().padStart(6, '0')}`,
    orderId: ord.id,
    orderReference: ord.reference,
    type: "Collection",
    amount: ord.total,
    currency: "XAF", // Central African Franc CFA
    paymentMethod: getRandomElement(["MTN Mobile Money", "Orange Money", "Orange Money", "Afriland Wire Transfer", "Express Union Mobile", "Visa/Mastercard IFC", "Cash"]),
    fee: Math.floor(ord.total * 0.015), // 1.5% average financial intermediate routing fee
    status: ord.paymentStatus === "Settled" ? "Approved" : (ord.paymentStatus === "Refunded" ? "Refunded" : "Escrow_Held"),
    processedAt: ord.created_at,
    recipientInstitution: "Central Platform Holding Bank"
  });
}

// If we still need to reach 505 transactions (e.g. some orders are ignored), generate separate payout transfers or commissions
while (transactions.length < 505) {
  const supp = getRandomElement(suppliers);
  const payoutAmount = getRandomInt(100, 1500) * 5000;
  const dateObj = new Date(startTS + (endTS - startTS) * random());
  
  transactions.push({
    id: `tx_${transactionIdCounter++}`,
    reference: `TXN-XAF-PAY-${transactionIdCounter.toString().padStart(6, '0')}`,
    orderId: null,
    orderReference: "SUPPLIER_PAYOUT",
    type: "Payout_Transfer",
    amount: -payoutAmount,
    currency: "XAF",
    paymentMethod: "Afriland First Bank S.A.",
    fee: 2500, // Fixed wire charge
    status: "Approved",
    processedAt: dateObj.toISOString(),
    recipientInstitution: supp.name
  });
}

transactions.sort((a, b) => new Date(b.processedAt).getTime() - new Date(a.processedAt).getTime());


// --- GENERATOR 10: RFQs & OFFERS (300+ RFQs, 300+ Offers) ---
export const rfqQuotes = [];
export const rfqOffers = [];

const RFQ_REQUISITION_TITLES = [
  { title: "Approvisionnement massif Fèves de Cacao Grade 1", desc: "Besoin de fèves fermentées de qualité supérieure prêtes pour fabrication de beurre de cacao.", catCode: "EXP" },
  { title: "Acquisition 250 Panneaux Solaires Monocristallins 400W", desc: "Recherche de panneaux photovoltaïques à haut rendement avec certificats de conformité CE/Cameroun.", catCode: "ENR" },
  { title: "Fourniture de 20 tonnes de Poivre Blanc de Penja certifié", desc: "Recherche de sacs de poivre blanc conditionnés de 25kg, label IGP indispensable.", catCode: "ALM" },
  { title: "Ciment pour Fondations Résistant à l'Eau saline Yaoundé", desc: "Fourniture de sacs de ciment spéciaux pour grands oeuvre type ciment de volis.", catCode: "BTP" },
  { title: "Acquisition de 1000 Tôles de construction alu ondulées", desc: "Tôles métalliques de 0.5mm d'épaisseur pour couverture de hangars à Bafoussam.", catCode: "BTP" },
  { title: "Achat de Connecteurs & Modems Routeurs MiFi 4G", desc: "Besoin de terminaux réseaux pré-configurés pour réseau de succursales.", catCode: "TEL" },
  { title: "Achat Céréales & Sorgho Rouge Grand Nord de grosse taille", desc: "Volume de gros pour formulation d'intrants pour bétail.", catCode: "ALM" }
];

let rfqIdCounter = 1;
let offerIdCounter = 1;

while (rfqQuotes.length < 305) {
  const cli = getRandomElement(clients);
  const tpl = getRandomElement(RFQ_REQUISITION_TITLES);
  const rfqDate = new Date(startTS + (endTS - startTS) * random());
  const rfqDeadline = new Date(rfqDate.getTime() + getRandomInt(10, 30) * 24 * 3600000);
  
  const quantityDemand = getRandomInt(100, 2000);
  const estimatedCost = quantityDemand * getRandomInt(2000, 8500);

  const rfqId = `rf_quote_${rfqIdCounter++}`;
  const status = rfqDate.getTime() < new Date("2026-06-01").getTime() ? "Closed" : "Open";

  rfqQuotes.push({
    id: rfqId,
    reference: `B2B-RFQ-${rfqDate.getFullYear()}-${rfqIdCounter.toString().padStart(4, '0')}`,
    buyerId: cli.id,
    buyerName: cli.name,
    buyerCompany: cli.company,
    title: `${tpl.title} - Lot #${rfqIdCounter}`,
    description: `${tpl.desc} Les livraisons devront être faites sous conteneurs scellés.`,
    categoryCode: tpl.catCode,
    quantityRequested: quantityDemand,
    estimatedBudgetXAF: estimatedCost,
    deadlineDate: rfqDeadline.toISOString().split('T')[0],
    status: status,
    locationTarget: cli.city,
    created_at: rfqDate.toISOString()
  });

  // For every RFQ, generate a bid (Offer) submitted by Cameroon suppliers
  // 305 RFQs will correspond 1-to-1 to 305 Offers
  const supp = getRandomElement(suppliers);
  const bidPrice = Math.floor(estimatedCost * getRandomFloat(0.9, 1.15, 2) / 1000) * 1000;
  const statusOffer = status === "Closed" 
    ? (rfqIdCounter % 3 === 0 ? "Accepted" : "Rejected") 
    : "Pending";

  rfqOffers.push({
    id: `offer_${offerIdCounter++}`,
    rfqId: rfqId,
    rfqReference: `B2B-RFQ-${rfqDate.getFullYear()}-${(rfqIdCounter - 1).toString().padStart(4, '0')}`,
    supplierId: supp.id,
    supplierName: supp.name,
    proposedUnitCostXAF: Math.floor(bidPrice / quantityDemand),
    totalBiddingCostXAF: bidPrice,
    deliveryDelayDays: getRandomInt(5, 25),
    paymentTerms: getRandomElement(["30% d'acompte, 70% à la livraison", "Paiement intégral à l'expédition", "Lettre de crédit irrévocable 60 jours"]),
    status: statusOffer,
    submittedAt: new Date(rfqDate.getTime() + getRandomInt(2, 7) * 3600000 * 24).toISOString()
  });
}

rfqQuotes.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
rfqOffers.sort((a,b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

/**
 * Hydrates state arrays with programmatic seed data in case arrays are currently empty.
 * Call this function on app init or on individual store loads.
 */
export function hydrateStores(storesMap) {
  // Check and run hydration
  if (storesMap.categories && storesMap.categories.categories.length === 0) {
    storesMap.categories.setCategories(categories);
  }
  if (storesMap.suppliers && storesMap.suppliers.suppliers.length === 0) {
    storesMap.suppliers.setSuppliers(suppliers);
  }
  if (storesMap.products && storesMap.products.products.length === 0) {
    storesMap.products.setProducts(products);
  }
  if (storesMap.warehouses && storesMap.warehouses.warehouses.length === 0) {
    storesMap.warehouses.setWarehouses(warehouses);
    storesMap.warehouses.stocks = stocks;
  }
  if (storesMap.orders && storesMap.orders.orders.length === 0) {
    storesMap.orders.setOrders(orders);
  }
  if (storesMap.logistics && storesMap.logistics.deliveries.length === 0) {
    storesMap.logistics.setDeliveries(deliveries);
  }
  if (storesMap.finance && Object.keys(storesMap.finance.balances).length === 0) {
    // Populate base tenant balances
    storesMap.finance.setBalance('techsupplies', 89254000);
    storesMap.finance.setBalance('globalsolar', 41200000);
    storesMap.finance.setBalance('agrocorp', 154784900);
    storesMap.finance.transactions = transactions; // Dynamic attach
  }
  if (storesMap.payments && storesMap.payments.escrows.length === 0) {
    // Filter escrow status transactions as held escrows
    const activeEscrowTx = transactions.filter(t => t.status === "Escrow_Held");
    storesMap.payments.setEscrows(activeEscrowTx);
  }
  if (storesMap.rfq && storesMap.rfq.quotes.length === 0) {
    storesMap.rfq.setQuotes(rfqQuotes);
    storesMap.rfq.offers = rfqOffers;
  }
  if (storesMap.stores && storesMap.stores.stores.length === 0) {
    storesMap.stores.setStores(stores);
  }
}
