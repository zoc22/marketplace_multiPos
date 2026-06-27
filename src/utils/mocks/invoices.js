export const mockInvoices = [
  {
    id: 'inv_001',
    reference: 'FA-2026-001',
    purchase_order_id: 'po_001',
    emitter_id: 'usr_vendor_1',
    emitter_type: 'vendor',
    receiver_id: 'usr_buyer_1',
    receiver_type: 'buyer',
    date_emission: new Date('2026-06-25T11:00:00Z'),
    due_date: new Date('2026-07-25T11:00:00Z'),
    status: 'PAID',
    products: [
      { product_id: 'prod_poivre_penja', quantity: 20, unit_price: 8500, total: 170000 }
    ],
    subtotal: 142557,
    tax: 27443, // 19.25% TVA
    total: 170000
  }
];
