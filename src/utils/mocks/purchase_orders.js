export const mockPurchaseOrders = [
  {
    id: 'BC-2026-001',
    reference: 'BC-2026-001',
    emitter_id: 'usr_buyer_1', // Alice Kamga
    emitter_type: 'buyer',
    receiver_id: 'usr_vendor_1', // primary/receiver ID
    receiver_type: 'vendor',
    date_emission: new Date('2026-07-01T10:00:00Z'),
    status: 'Delivered',
    products: [
      { product_id: 'prod_souris_wireless', quantity: 2, unit_price: 15000, total: 30000, supplierId: 'usr_vendor_1', status: 'Delivered' },
      { product_id: 'prod_panneau_solaire', quantity: 4, unit_price: 85000, total: 340000, supplierId: 'usr_vendor_2', status: 'Delivered' }
    ],
    total: 370000,
    currency: 'XAF',
    shipping_address: 'Bonapriso, Douala',
    payment_method: 'Escrow',
    shipping_mode: 'Routier Pro',
    created_at: '2026-07-01T10:00:00Z'
  },
  {
    id: 'BC-2026-002',
    reference: 'BC-2026-002',
    emitter_id: 'usr_buyer_1',
    emitter_type: 'buyer',
    receiver_id: 'usr_vendor_1',
    receiver_type: 'vendor',
    date_emission: new Date('2026-07-02T14:30:00Z'),
    status: 'Shipped',
    products: [
      { product_id: 'prod_cable_hdmi', quantity: 5, unit_price: 5000, total: 25000, supplierId: 'usr_vendor_1', status: 'Shipped' },
      { product_id: 'prod_jute_sac', quantity: 100, unit_price: 1500, total: 150000, supplierId: 'usr_vendor_3', status: 'Preparing' }
    ],
    total: 175000,
    currency: 'XAF',
    shipping_address: 'Yaoundé, Avenue Germaine',
    payment_method: 'Escrow',
    shipping_mode: 'Routier Pro',
    created_at: '2026-07-02T14:30:00Z'
  },
  {
    id: 'BC-2026-003',
    reference: 'BC-2026-003',
    emitter_id: 'usr_buyer_1',
    emitter_type: 'buyer',
    receiver_id: 'usr_vendor_2',
    receiver_type: 'vendor',
    date_emission: new Date('2026-07-04T08:00:00Z'),
    status: 'Preparing',
    products: [
      { product_id: 'prod_batterie_gel', quantity: 5, unit_price: 135000, total: 675000, supplierId: 'usr_vendor_2', status: 'Preparing' }
    ],
    total: 675000,
    currency: 'XAF',
    shipping_address: 'Kribi, Zone Portuaire',
    payment_method: 'Escrow',
    shipping_mode: 'Camion grue BTP',
    created_at: '2026-07-04T08:00:00Z'
  },
  {
    id: 'BC-2026-004',
    reference: 'BC-2026-004',
    emitter_id: 'usr_buyer_1',
    emitter_type: 'buyer',
    receiver_id: 'usr_vendor_1',
    receiver_type: 'vendor',
    date_emission: new Date('2026-07-05T09:00:00Z'),
    status: 'Draft',
    products: [
      { product_id: 'prod_souris_wireless', quantity: 10, unit_price: 15000, total: 150000, supplierId: 'usr_vendor_1', status: 'Pending' },
      { product_id: 'prod_kraft_bag', quantity: 200, unit_price: 150, total: 30000, supplierId: 'usr_vendor_3', status: 'Pending' }
    ],
    total: 180000,
    currency: 'XAF',
    shipping_address: 'Bonapriso, Douala',
    payment_method: 'Escrow',
    shipping_mode: 'Moto Rapide',
    created_at: '2026-07-05T09:00:00Z'
  },
  {
    id: 'BC-2026-005',
    reference: 'BC-2026-005',
    emitter_id: 'usr_buyer_1',
    emitter_type: 'buyer',
    receiver_id: 'usr_vendor_2',
    receiver_type: 'vendor',
    date_emission: new Date('2026-07-06T11:00:00Z'),
    status: 'Draft',
    products: [
      { product_id: 'prod_panneau_solaire', quantity: 1, unit_price: 85000, total: 85000, supplierId: 'usr_vendor_2', status: 'Pending' }
    ],
    total: 85000,
    currency: 'XAF',
    shipping_address: 'Yaoundé, Centre',
    payment_method: 'Escrow',
    shipping_mode: 'Routier Pro',
    created_at: '2026-07-06T11:00:00Z'
  },
  {
    id: 'BC-2026-006',
    reference: 'BC-2026-006',
    emitter_id: 'usr_buyer_1',
    emitter_type: 'buyer',
    receiver_id: 'usr_vendor_1',
    receiver_type: 'vendor',
    date_emission: new Date('2026-07-07T09:00:00Z'),
    status: 'Packed',
    paymentStatus: 'Escrow_Held',
    products: [
      { product_id: 'prod_souris_wireless', quantity: 5, unit_price: 15000, total: 75000, supplierId: 'usr_vendor_1', status: 'Pending' },
      { product_id: 'prod_cable_hdmi', quantity: 10, unit_price: 5000, total: 50000, supplierId: 'usr_vendor_1', status: 'Pending' }
    ],
    total: 125000,
    currency: 'XAF',
    shipping_address: 'Bonapriso, Douala',
    payment_method: 'Escrow',
    shipping_mode: 'Routier Pro',
    created_at: '2026-07-07T09:00:00Z'
  },
  {
    id: 'BC-2026-007',
    reference: 'BC-2026-007',
    emitter_id: 'usr_buyer_1',
    emitter_type: 'buyer',
    receiver_id: 'usr_vendor_3',
    receiver_type: 'vendor',
    date_emission: new Date('2026-07-08T15:20:00Z'),
    status: 'Submitted',
    paymentStatus: 'Escrow_Held',
    products: [
      { product_id: 'prod_bouteille_eau', quantity: 120, unit_price: 800, total: 96000, supplierId: 'usr_vendor_3', status: 'Submitted' },
      { product_id: 'prod_cable_hdmi', quantity: 5, unit_price: 5000, total: 25000, supplierId: 'usr_vendor_1', status: 'Draft' }
    ],
    total: 121000,
    currency: 'XAF',
    shipping_address: 'Bafoussam, Centre-ville',
    payment_method: 'Escrow',
    shipping_mode: 'Routier Pro',
    created_at: '2026-07-08T15:20:00Z'
  }
];
