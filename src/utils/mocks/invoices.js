export const mockInvoices = [
  {
    id: 'inv_001',
    reference: 'FA-001',
    purchase_order_id: 'po_001',
    delivery_note_id: 'dn_001',
    emitter_id: 'usr_vendor_1',
    emitter_type: 'vendor',
    receiver_id: 'usr_buyer_1',
    receiver_type: 'buyer',
    date_emission: new Date('2026-06-25T11:00:00Z'),
    due_date: new Date('2026-07-25T11:00:00Z'),
    status: 'PAID',
    products: [
      { product_id: 'prod_souris_wireless', quantity: 2, unit_price: 15000, total: 30000 },
      { product_id: 'prod_cable_hdmi', quantity: 3, unit_price: 5000, total: 15000 }
    ],
    subtotal: 37736,
    tax: 7264, // 19.25% TVA Cameroun
    total: 45000,
    currency: 'XAF',
    notes: 'Facture acquittée. Merci de votre confiance !'
  }
];
