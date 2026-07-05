export const buyerRoutes = [
  {
    path: '/buyer',
    component: () => import('@/layouts/BuyerLayout.vue'),
    meta: { requiresAuth: true, role: 'buyer' },
    children: [
      {
        path: 'dashboard',
        name: 'BuyerDashboard',
        component: () => import('@/pages/buyer/Dashboard/Dashboard.vue'),
      },
      {
        path: 'orders',
        name: 'BuyerOrders',
        component: () => import('@/pages/buyer/Orders/Index.vue'),
      },
      {
        path: 'orders/:id',
        name: 'BuyerOrderDetail',
        component: () => import('@/pages/buyer/Orders/Detail.vue'),
      },
      {
        path: 'delivery-notes',
        name: 'BuyerDeliveryNotes',
        component: () => import('@/pages/buyer/Orders/DeliveryNotes.vue'),
      },
      {
        path: 'confirm-delivery/:id',
        name: 'BuyerConfirmDelivery',
        component: () => import('@/pages/buyer/Orders/ConfirmDelivery.vue'),
      },
      {
        path: 'invoices',
        name: 'BuyerInvoicesIndex',
        component: () => import('@/pages/buyer/Invoices/Index.vue'),
      },
      {
        path: 'invoices/:id',
        name: 'BuyerInvoicesDetail',
        component: () => import('@/pages/buyer/Invoices/Detail.vue'),
      },
      {
        path: 'purchases',
        name: 'BuyerPurchases',
        component: () => import('@/pages/buyer/Dashboard/Purchases.vue'),
      },
      {
        path: 'track/:id',
        name: 'TrackDelivery',
        component: () => import('@/pages/buyer/Dashboard/TrackDelivery.vue'),
      },
      {
        path: 'saved-stores',
        name: 'BuyerSavedStores',
        component: () => import('@/pages/buyer/SavedStores/Index.vue'),
      },
      {
        path: 'wishlist',
        name: 'Wishlist',
        component: () => import('@/pages/buyer/Dashboard/Wishlist.vue'),
      },
      {
        path: 'addresses',
        name: 'AddressBook',
        component: () => import('@/pages/buyer/Dashboard/AddressBook.vue'),
      },
      {
        path: 'payment-methods',
        name: 'PaymentMethods',
        component: () => import('@/pages/buyer/Dashboard/PaymentMethods.vue'),
      },
      {
        path: 'loyalty',
        name: 'LoyaltyPoints',
        component: () => import('@/pages/buyer/Dashboard/LoyaltyPoints.vue'),
      },
      {
        path: 'profile',
        name: 'BuyerProfileEdit',
        component: () => import('@/pages/buyer/Profile/ProfileEdit.vue'),
      },
      {
        path: 'security',
        name: 'BuyerSecurity',
        component: () => import('@/pages/buyer/Profile/Security.vue'),
      },
      {
        path: 'notifications',
        name: 'BuyerNotifications',
        component: () => import('@/pages/buyer/Profile/Notifications.vue'),
      },
      {
        path: 'reviews',
        name: 'MyReviews',
        component: () => import('@/pages/buyer/Reviews/MyReviews.vue'),
      }
    ]
  }
];

export default buyerRoutes;
