export const mockPurchaseOrders = [
  {
    id: 'po_001',
    reference: 'BC-2026-001',
    emitter_id: 'usr_buyer_1', // Alice Kamga
    emitter_type: 'buyer',
    receiver_id: 'usr_vendor_1', // TechSupplies SARL
    receiver_type: 'vendor',
    date_emission: new Date('2026-06-25T10:00:00Z'),
    status: 'DELIVERED',
    products: [
      { product_id: 'prod_poivre_penja', quantity: 20, unit_price: 8500, total: 170000 }
    ],
    total: 170000,
    currency: 'XAF',
    notes: 'Livraison urgente à l\'entrepôt de Douala Akwa.',
    shipping_address: 'Douala, Rue de l\'entrepôt Akwa',
    payment_method: 'Séquestre En Ligne',
    shipping_mode: 'Routier Pro'
  },
  {
    id: 'po_002',
    reference: 'BC-2026-002',
    emitter_id: 'usr_vendor_1', // TechSupplies B2B
    emitter_type: 'vendor',
    receiver_id: 'usr_dist_1', // AgroDistrib Cameroun
    receiver_type: 'distributor',
    date_emission: new Date('2026-06-25T14:30:00Z'),
    status: 'VALIDATED',
    products: [
      { product_id: 'prod_mais_blanc', quantity: 1000, unit_price: 350, total: 350000 }
    ],
    total: 350000,
    currency: 'XAF',
    notes: 'Sacs étanches requis.',
    shipping_address: 'Yaoundé, Gare Marchande',
    payment_method: 'Séquestre En Ligne',
    shipping_mode: 'Rail Fret'
  },
  {
    id: 'po_003',
    reference: 'BC-2026-003',
    emitter_id: 'usr_dist_1', // AgroDistrib Cameroun
    emitter_type: 'distributor',
    receiver_id: 'usr_dist_2', // BTP Materials Supply
    receiver_type: 'distributor',
    date_emission: new Date('2026-06-26T08:00:00Z'),
    status: 'PENDING',
    products: [
      { product_id: 'prod_ciment_dangote', quantity: 100, unit_price: 4900, total: 490000 }
    ],
    total: 490000,
    currency: 'XAF',
    notes: 'Besoin sur chantier.',
    shipping_address: 'Limbe, Zone Industrielle',
    payment_method: 'Séquestre En Ligne',
    shipping_mode: 'Routier Pro'
  }
];
