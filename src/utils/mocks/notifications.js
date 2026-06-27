export const mockNotifications = [
  {
    id: 'notif_1',
    type: 'ORDER_CREATED',
    emitter_id: 'usr_buyer_1',
    receiver_id: 'usr_vendor_1',
    message: 'Votre commande BC-001 a été envoyée à TechSupplies SARL.',
    read: true,
    order_ref: 'BC-001',
    created_at: new Date('2026-06-25T10:00:00Z')
  },
  {
    id: 'notif_2',
    type: 'ORDER_VALIDATED',
    emitter_id: 'usr_vendor_1',
    receiver_id: 'usr_buyer_1',
    message: 'Votre commande BC-001 a été validée par TechSupplies SARL.',
    read: true,
    order_ref: 'BC-001',
    created_at: new Date('2026-06-25T10:30:00Z')
  },
  {
    id: 'notif_3',
    type: 'DELIVERY_GENERATED',
    emitter_id: 'usr_vendor_1',
    receiver_id: 'usr_buyer_1',
    message: 'Votre commande BC-001 a été expédiée (BL-001).',
    read: true,
    order_ref: 'BC-001',
    created_at: new Date('2026-06-25T11:00:00Z')
  },
  {
    id: 'notif_4',
    type: 'DELIVERY_CONFIRMED',
    emitter_id: 'usr_buyer_1',
    receiver_id: 'usr_vendor_1',
    message: 'Vous avez confirmé la réception de la commande BC-001.',
    read: true,
    order_ref: 'BC-001',
    created_at: new Date('2026-06-26T09:00:00Z')
  },
  {
    id: 'notif_5',
    type: 'ORDER_CREATED',
    emitter_id: 'usr_vendor_1',
    receiver_id: 'usr_dist_1',
    message: 'Votre bon de commande BC-002 a été envoyé à AgroDistrib Cameroun.',
    read: false,
    order_ref: 'BC-002',
    created_at: new Date('2026-06-25T14:30:00Z')
  },
  {
    id: 'notif_6',
    type: 'ORDER_CREATED',
    emitter_id: 'usr_dist_1',
    receiver_id: 'usr_dist_2',
    message: 'Votre bon de commande BC-003 a été envoyé à BTP Materials Supply.',
    read: false,
    order_ref: 'BC-003',
    created_at: new Date('2026-06-26T08:00:00Z')
  }
];
