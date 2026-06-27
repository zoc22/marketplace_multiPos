export const mockPurchaseOrders = [
  {
    id: 'po_001',
    reference: 'BC-001',
    emitter_id: 'usr_buyer_1', // Alice Kamga
    emitter_type: 'buyer',
    receiver_id: 'usr_vendor_1', // TechSupplies SARL
    receiver_type: 'vendor',
    date_emission: new Date('2026-06-25T10:00:00Z'),
    date_livraison_souhaitee: new Date('2026-06-26T10:00:00Z'),
    status: 'DELIVERED',
    products: [
      { product_id: 'prod_souris_wireless', quantity: 2, unit_price: 15000, total: 30000 },
      { product_id: 'prod_cable_hdmi', quantity: 3, unit_price: 5000, total: 15000 }
    ],
    total: 45000,
    currency: 'XAF',
    notes: 'Livraison express à domicile.',
    shipping_address: 'Bonapriso, Douala',
    payment_method: 'Escrow',
    shipping_mode: 'Moto Rapide'
  },
  {
    id: 'po_002',
    reference: 'BC-002',
    emitter_id: 'usr_vendor_1', // TechSupplies B2B
    emitter_type: 'vendor',
    receiver_id: 'usr_dist_1', // AgroDistrib Cameroun
    receiver_type: 'distributor',
    date_emission: new Date('2026-06-25T14:30:00Z'),
    date_livraison_souhaitee: new Date('2026-06-28T14:30:00Z'),
    status: 'VALIDATED',
    products: [
      { product_id: 'prod_mais_blanc', quantity: 10, unit_price: 25000, total: 250000 }
    ],
    total: 250000,
    currency: 'XAF',
    notes: 'Stockage à sec pour revente.',
    shipping_address: 'Yaoundé, Avenue Germaine',
    payment_method: 'Escrow',
    shipping_mode: 'Routier Pro'
  },
  {
    id: 'po_003',
    reference: 'BC-003',
    emitter_id: 'usr_dist_1', // AgroDistrib Cameroun
    emitter_type: 'distributor',
    receiver_id: 'usr_dist_2', // BTP Materials Supply
    receiver_type: 'distributor',
    date_emission: new Date('2026-06-26T08:00:00Z'),
    date_livraison_souhaitee: new Date('2026-06-30T08:00:00Z'),
    status: 'PENDING',
    products: [
      { product_id: 'prod_fer_beton', quantity: 6, unit_price: 180000, total: 1080000 },
      { product_id: 'prod_ciment_dangote', quantity: 24, unit_price: 5000, total: 120000 }
    ],
    total: 1200000,
    currency: 'XAF',
    notes: 'Matériaux urgents pour chantier routier.',
    shipping_address: 'Kribi, Zone Portuaire',
    payment_method: 'Escrow',
    shipping_mode: 'Camion grue BTP'
  }
];
