export const posRoutes = [
  {
    path: '/pos',
    component: () => import('@/layouts/POSLayout.vue'),
    meta: { requiresAuth: true, role: 'pos' },
    children: [
      {
        path: '',
        name: 'POSTerminal',
        component: () => import('@/pages/pos/Index.vue'),
      },
      {
        path: 'cart',
        name: 'POSCart',
        component: () => import('@/pages/pos/Cart.vue'),
      },
      {
        path: 'payment',
        name: 'POSPaymentPage',
        component: () => import('@/pages/pos/Payment.vue'),
      },
      {
        path: 'ticket',
        name: 'POSTicketPage',
        component: () => import('@/pages/pos/Ticket.vue'),
      },
      {
        path: 'returns',
        name: 'POSReturns',
        component: () => import('@/pages/pos/Returns.vue'),
      },
      {
        path: 'report',
        name: 'POSCashierReport',
        component: () => import('@/pages/pos/CashierReport.vue'),
      },
      {
        path: 'settings',
        name: 'POSSettings',
        component: () => import('@/pages/pos/Settings.vue'),
      }
    ]
  }
];

export default posRoutes;
