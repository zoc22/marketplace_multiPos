export const mockDeliveryNotes = [
  {
    id: 'dn_001',
    reference: 'BL-2026-001',
    purchase_order_id: 'po_001',
    emitter_id: 'usr_vendor_1',
    emitter_type: 'vendor',
    receiver_id: 'usr_buyer_1',
    receiver_type: 'buyer',
    date_emission: new Date('2026-06-25T11:00:00Z'),
    date_livraison: new Date('2026-06-26T09:00:00Z'),
    status: 'DELIVERED',
    products: [
      { product_id: 'prod_poivre_penja', quantity_delivered: 20, unit_price: 8500, total: 170000, lot_number: 'LOT-PENJA-01' }
    ],
    carrier: 'Gofetch Cargo Transit',
    tracking_number: 'TRK-2026-0941',
    shipping_mode: 'Routier Pro',
    signature: 'Alice Kamga Signature',
    photo_proof: 'proof_delivered_akwa.jpg'
  }
];
