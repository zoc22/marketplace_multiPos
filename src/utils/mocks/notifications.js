export const mockNotifications = [
  {
    id: 'notif_1',
    type: 'ORDER_CREATED',
    emitter_id: 'usr_buyer_1',
    receiver_id: 'usr_vendor_1',
    message: 'Un nouveau bon de commande (BC-2026-001) a été créé pour un montant de 170 000 XAF.',
    read: false,
    order_ref: 'BC-2026-001',
    created_at: new Date('2026-06-25T10:05:00Z')
  },
  {
    id: 'notif_2',
    type: 'ORDER_VALIDATED',
    emitter_id: 'usr_vendor_1',
    receiver_id: 'usr_buyer_1',
    message: 'Le bon de commande (BC-2026-001) a été validé avec succès.',
    read: true,
    order_ref: 'BC-2026-001',
    created_at: new Date('2026-06-25T10:30:00Z')
  },
  {
    id: 'notif_3',
    type: 'DELIVERY_GENERATED',
    emitter_id: 'usr_vendor_1',
    receiver_id: 'usr_buyer_1',
    message: 'Un bon de livraison a été généré pour la commande (BC-2026-001).',
    read: true,
    order_ref: 'BC-2026-001',
    created_at: new Date('2026-06-25T11:00:00Z')
  }
];
