export const mockEscrowPayments = [
  {
    id: 'pay_001',
    reference: 'ESC-001',
    purchase_order_id: 'po_001',
    order_id: 'po_001',
    order_ref: 'BC-001',
    amount: 45000,
    status: 'RELEASED', // Released to beneficiary
    payer_id: 'usr_buyer_1',
    buyer_id: 'usr_buyer_1',
    payer_type: 'buyer',
    receiver_id: 'usr_vendor_1',
    seller_id: 'usr_vendor_1',
    receiver_type: 'vendor',
    date_initiated: new Date('2026-06-25T10:00:00Z'),
    date_escrowed: new Date('2026-06-25T10:05:00Z'),
    date_released: new Date('2026-06-26T09:30:00Z')
  },
  {
    id: 'pay_002',
    reference: 'ESC-002',
    purchase_order_id: 'po_002',
    order_id: 'po_002',
    order_ref: 'BC-002',
    amount: 250000,
    status: 'PENDING', // Waiting for client to confirm delivery
    payer_id: 'usr_vendor_1',
    buyer_id: 'usr_vendor_1',
    payer_type: 'vendor',
    receiver_id: 'usr_dist_1',
    seller_id: 'usr_dist_1',
    receiver_type: 'distributor',
    date_initiated: new Date('2026-06-25T14:30:00Z'),
    date_escrowed: new Date('2026-06-25T14:35:00Z')
  },
  {
    id: 'pay_003',
    reference: 'ESC-003',
    purchase_order_id: 'po_003',
    order_id: 'po_003',
    order_ref: 'BC-003',
    amount: 1200000,
    status: 'ESCROWED', // Held in escrow
    payer_id: 'usr_dist_1',
    buyer_id: 'usr_dist_1',
    payer_type: 'distributor',
    receiver_id: 'usr_dist_2',
    seller_id: 'usr_dist_2',
    receiver_type: 'distributor',
    date_initiated: new Date('2026-06-26T08:00:00Z'),
    date_escrowed: new Date('2026-06-26T08:05:00Z')
  }
];
