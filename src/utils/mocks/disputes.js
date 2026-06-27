export const mockDisputes = [
  {
    id: 'disp_001',
    order_id: 'po_001',
    order_ref: 'BC-2026-001',
    escrow_id: 'pay_001',
    buyer_id: 'usr_buyer_1',
    seller_id: 'usr_vendor_1',
    claim_reason: 'Articles non conformes',
    claim_description: 'Les sacs de Poivre Blanc reçus présentent une humidité supérieure à 15%. Risque de moisissure.',
    status: 'CLOSED', // Already settled
    created_at: new Date('2026-06-25T15:00:00Z'),
    messages: [
      { sender: 'usr_buyer_1', text: 'Humidité excessive sur le lot.', date: new Date('2026-06-25T15:00:00Z') },
      { sender: 'usr_vendor_1', text: 'Nous acceptons de renvoyer un lot sec ou de libérer 50% des fonds.', date: new Date('2026-06-25T16:00:00Z') }
    ]
  }
];
