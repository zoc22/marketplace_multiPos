export const mockDisputes = [
  {
    id: 'disp_001',
    purchase_order_id: 'po_001',
    order_id: 'po_001',
    order_ref: 'BC-001',
    escrow_payment_id: 'pay_001',
    escrow_id: 'pay_001',
    initiator_id: 'usr_buyer_1',
    buyer_id: 'usr_buyer_1',
    initiator_type: 'buyer',
    receiver_id: 'usr_vendor_1',
    seller_id: 'usr_vendor_1',
    reason: 'Articles non conformes',
    claim_reason: 'Articles non conformes',
    description: 'Les articles présentent un défaut de fabrication ou ne correspondent pas aux spécifications.',
    claim_description: 'Les articles présentent un défaut de fabrication ou ne correspondent pas aux spécifications.',
    status: 'CLOSED', // Settled
    resolution: 'RELEASE_FUNDS',
    date_opened: new Date('2026-06-25T15:00:00Z'),
    date_resolved: new Date('2026-06-26T09:30:00Z'),
    messages: [
      { sender: 'usr_buyer_1', text: 'Les articles reçus ont un problème.', date: new Date('2026-06-25T15:00:00Z') },
      { sender: 'usr_vendor_1', text: 'Nous acceptons de libérer la totalité suite à la réparation.', date: new Date('2026-06-25T16:00:00Z') }
    ]
  }
];
