export const mockEscrowPayments = [
  {
    id: 'pay_001',
    order_id: 'po_001',
    order_ref: 'BC-2026-001',
    amount: 170000,
    status: 'released', // Already completed
    buyer_id: 'usr_buyer_1',
    seller_id: 'usr_vendor_1',
    created_at: new Date('2026-06-25T10:00:00Z'),
    released_at: new Date('2026-06-26T09:00:00Z')
  },
  {
    id: 'pay_002',
    order_id: 'po_002',
    order_ref: 'BC-2026-002',
    amount: 350000,
    status: 'locked', // Validated but in logistics preparation
    buyer_id: 'usr_vendor_1',
    seller_id: 'usr_dist_1',
    created_at: new Date('2026-06-25T14:30:00Z')
  }
];
