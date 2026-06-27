export const vendorRoutes = [
  {
    path: '/vendor',
    component: () => import('@/layouts/VendorLayout.vue'),
    meta: { requiresAuth: true, role: 'vendor' },
    children: [
      {
        path: '',
        redirect: '/vendor/dashboard'
      },
      // Dashboard
      {
        path: 'dashboard',
        name: 'VendorDashboard',
        component: () => import('@/pages/vendor/dashboard/Dashboard.vue'),
        meta: { title: 'Tableau de bord Vendeur' }
      },
      // Stores / POS
      {
        path: 'stores',
        name: 'VendorStoresIndex',
        component: () => import('@/pages/vendor/stores/Index.vue'),
        meta: { title: 'Points de vente' }
      },
      {
        path: 'stores/create',
        name: 'VendorStoresCreate',
        component: () => import('@/pages/vendor/stores/Create.vue'),
        meta: { title: 'Ajouter un point de vente' }
      },
      {
        path: 'stores/:id/edit',
        name: 'VendorStoresEdit',
        component: () => import('@/pages/vendor/stores/Edit.vue'),
        meta: { title: 'Modifier le point de vente' }
      },
      {
        path: 'stores/:id/pos-config',
        name: 'VendorStoresPOSConfig',
        component: () => import('@/pages/vendor/stores/POSConfig.vue'),
        meta: { title: 'Configuration Caisse' }
      },
      // POS Terminal
      {
        path: 'pos',
        name: 'VendorPOS',
        component: () => import('@/pages/vendor/pos/Index.vue'),
        meta: { title: 'Caisse (POS)' }
      },
      // Products
      {
        path: 'products',
        name: 'VendorProductsIndex',
        component: () => import('@/pages/vendor/products/Index.vue'),
        meta: { title: 'Catalogue Produits' }
      },
      {
        path: 'products/create',
        name: 'VendorProductsCreate',
        component: () => import('@/pages/vendor/products/Create.vue'),
        meta: { title: 'Nouveau Produit' }
      },
      {
        path: 'products/:id/edit',
        name: 'VendorProductsEdit',
        component: () => import('@/pages/vendor/products/Edit.vue'),
        meta: { title: 'Modifier le Produit' }
      },
      {
        path: 'products/stock',
        name: 'VendorProductsStock',
        component: () => import('@/pages/vendor/products/Stock.vue'),
        meta: { title: 'Gestion des Stocks' }
      },
      // Orders
      {
        path: 'orders',
        name: 'VendorOrdersIndex',
        component: () => import('@/pages/vendor/orders/Index.vue'),
        meta: { title: 'Commandes' }
      },
      {
        path: 'orders/:id',
        name: 'VendorOrdersDetail',
        component: () => import('@/pages/vendor/orders/Detail.vue'),
        meta: { title: 'Détail Commande' }
      },
      {
        path: 'orders/:id/prepare',
        name: 'VendorOrdersPrepare',
        component: () => import('@/pages/vendor/orders/Prepare.vue'),
        meta: { title: 'Préparation Commande' }
      },
      // Returns
      {
        path: 'returns',
        name: 'VendorReturnsIndex',
        component: () => import('@/pages/vendor/returns/Index.vue'),
        meta: { title: 'Retours Clients' }
      },
      {
        path: 'returns/:id',
        name: 'VendorReturnsDetail',
        component: () => import('@/pages/vendor/returns/Detail.vue'),
        meta: { title: 'Détail Retour' }
      },
      // Approvisionnement
      {
        path: 'suppliers',
        name: 'VendorSuppliersIndex',
        component: () => import('@/pages/vendor/suppliers/Index.vue'),
        meta: { title: 'Fournisseurs' }
      },
      {
        path: 'purchases',
        name: 'VendorPurchasesIndex',
        component: () => import('@/pages/vendor/purchases/Index.vue'),
        meta: { title: 'Bons de Commande' }
      },
      {
        path: 'purchases/:id',
        name: 'VendorPurchasesDetail',
        component: () => import('@/pages/vendor/purchases/Detail.vue'),
        meta: { title: 'Détail Approvisionnement' }
      },
      {
        path: 'purchases/track/:id',
        name: 'VendorPurchasesTrack',
        component: () => import('@/pages/vendor/purchases/Track.vue'),
        meta: { title: 'Suivi Livraison' }
      },
      {
        path: 'purchases/receive/:id',
        name: 'VendorPurchasesReceive',
        component: () => import('@/pages/vendor/purchases/Receive.vue'),
        meta: { title: 'Réception de livraison B2B' }
      },
      {
        path: 'deliveries',
        name: 'VendorDeliveriesIndex',
        component: () => import('@/pages/vendor/deliveries/Index.vue'),
        meta: { title: 'Réception Livraisons' }
      },
      // Equipe
      {
        path: 'users',
        name: 'VendorUsersIndex',
        component: () => import('@/pages/vendor/users/Index.vue'),
        meta: { title: 'Équipe' }
      },
      // Settings
      {
        path: 'settings/general',
        name: 'VendorSettingsGeneral',
        component: () => import('@/pages/vendor/settings/General.vue'),
        meta: { title: 'Configuration Générale' }
      },
      {
        path: 'settings/payment',
        name: 'VendorSettingsPayment',
        component: () => import('@/pages/vendor/settings/Payment.vue'),
        meta: { title: 'Modes de paiement' }
      },
      {
        path: 'settings/shipping',
        name: 'VendorSettingsShipping',
        component: () => import('@/pages/vendor/settings/Shipping.vue'),
        meta: { title: 'Frais de livraison' }
      }
    ]
  }
];
