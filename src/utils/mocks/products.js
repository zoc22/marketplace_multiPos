export const mockProducts = [
  // Vendor 1 - TechSupplies SARL (B2C)
  {
    id: 'prod_laptop_hp',
    name: 'Ordinateur Portable HP ProBook',
    category: 'Électronique',
    price: 450000,
    stock: 25,
    unit: 'unité',
    sku: 'EL-HP-PRO',
    supplierId: 'usr_vendor_1',
    description: 'ProBook idéal pour le travail de bureau et les étudiants. 8Go RAM, 256Go SSD.'
  },
  {
    id: 'prod_souris_wireless',
    name: 'Souris Sans Fil Logitech',
    category: 'Électronique',
    price: 15000,
    stock: 120,
    unit: 'unité',
    sku: 'EL-LOG-MOU',
    supplierId: 'usr_vendor_1',
    description: 'Souris ergonomique sans fil avec autonomie longue durée.'
  },
  {
    id: 'prod_cable_hdmi',
    name: 'Câble HDMI 4K 1.8m',
    category: 'Électronique',
    price: 5000,
    stock: 300,
    unit: 'unité',
    sku: 'EL-CAB-HD',
    supplierId: 'usr_vendor_1',
    description: 'Câble HDMI haute vitesse compatible 4K HDR.'
  },

  // Vendor 2 - SolarPlus Cameroun (B2C)
  {
    id: 'prod_batterie_gel',
    name: 'Batterie Solaire Gel 200Ah',
    category: 'Énergie',
    price: 135000,
    stock: 80,
    unit: 'unité',
    sku: 'EN-BAT-GEL',
    supplierId: 'usr_vendor_2',
    description: 'Batterie solaire étanche longue durée idéale pour installations photovoltaïques.'
  },
  {
    id: 'prod_panneau_solaire',
    name: 'Panneau Solaire Monocristallin 400W',
    category: 'Énergie',
    price: 85000,
    stock: 150,
    unit: 'unité',
    sku: 'EN-PAN-SOL',
    supplierId: 'usr_vendor_2',
    description: 'Panneau solaire haute performance à haut rendement.'
  },

  // Distributor 1 - AgroDistrib Cameroun (B2B)
  {
    id: 'prod_mais_blanc',
    name: 'Maïs Blanc Séché (Sac 100kg)',
    category: 'Céréales',
    price: 25000,
    stock: 1200,
    unit: 'sac',
    sku: 'AG-MAI-WHT',
    supplierId: 'usr_dist_1',
    description: 'Maïs blanc de qualité supérieure séché au soleil, idéal pour provenderie et consommation.'
  },
  {
    id: 'prod_cacao_brut',
    name: 'Fèves de Cacao Brut (Sac 50kg)',
    category: 'Agro-alimentaire',
    price: 160000,
    stock: 500,
    unit: 'sac',
    sku: 'AG-CAC-RAW',
    supplierId: 'usr_dist_1',
    description: 'Fèves de cacao fermentées et séchées issues du bassin de Mbalmayo.'
  },

  // Distributor 2 - BTP Materials Supply (B2B)
  {
    id: 'prod_ciment_dangote',
    name: 'Ciment Dangote 42.5R (Sac 50kg)',
    category: 'Matériaux BTP',
    price: 4900,
    stock: 15000,
    unit: 'sac',
    sku: 'BT-CIM-DAN',
    supplierId: 'usr_dist_2',
    description: 'Ciment de haute résistance idéal pour tous travaux de construction.'
  },
  {
    id: 'prod_fer_beton',
    name: 'Fer à Béton Ø10 (Lot de 50 barres)',
    category: 'Matériaux BTP',
    price: 180000,
    stock: 450,
    unit: 'lot',
    sku: 'BT-FER-ROD',
    supplierId: 'usr_dist_2',
    description: 'Fer à béton haute adhérence certifié aux normes locales.'
  }
];
