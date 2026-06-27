export const mockDeliveryNotes = [
  {
    id: 'dn_001',
    reference: 'BL-001',
    purchase_order_id: 'po_001',
    emitter_id: 'usr_vendor_1',
    emitter_type: 'vendor',
    receiver_id: 'usr_buyer_1',
    receiver_type: 'buyer',
    date_emission: new Date('2026-06-25T11:00:00Z'),
    date_livraison: new Date('2026-06-26T09:00:00Z'),
    status: 'DELIVERED',
    products: [
      { product_id: 'prod_souris_wireless', quantity_delivered: 2, unit_price: 15000, total: 30000, lot_number: 'LOT-MS-01' },
      { product_id: 'prod_cable_hdmi', quantity_delivered: 3, unit_price: 5000, total: 15000, lot_number: 'LOT-CB-99' }
    ],
    carrier: 'Gofetch Cargo Transit',
    tracking_number: 'TRK-001',
    shipping_mode: 'Moto Rapide',
    signature: 'Alice Kamga',
    photo_proof: 'proof_delivered.jpg'
  },
  {
    id: 'dn_002',
    reference: 'BL-002',
    purchase_order_id: 'po_002',
    emitter_id: 'usr_dist_1',
    emitter_type: 'distributor',
    receiver_id: 'usr_vendor_1',
    receiver_type: 'vendor',
    date_emission: new Date('2026-06-26T10:00:00Z'),
    date_livraison: null,
    status: 'IN_TRANSIT',
    products: [
      { product_id: 'prod_mais_blanc', quantity_delivered: 10, unit_price: 25000, total: 250000, lot_number: 'LOT-MAIS-42' }
    ],
    carrier: 'Agro Logistique Cameroun',
    tracking_number: 'TRK-002',
    shipping_mode: 'Routier Pro',
    signature: '',
    photo_proof: ''
  }
];
