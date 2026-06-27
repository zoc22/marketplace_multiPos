export const distributorRoutes = [
  {
    path: '/distributor',
    component: () => import('@/layouts/DistributorLayout.vue'),
    meta: { requiresAuth: true, role: 'distributor' },
    children: [
      {
        path: '',
        redirect: '/distributor/dashboard'
      },
      // Dashboard
      {
        path: 'dashboard',
        name: 'DistributorDashboard',
        component: () => import('@/pages/distributor/dashboard/Dashboard.vue'),
        meta: { title: 'Tableau de bord Distributeur' }
      },
      // Orders
      {
        path: 'orders',
        name: 'DistributorOrdersIndex',
        component: () => import('@/pages/distributor/orders/Index.vue'),
        meta: { title: 'Commandes B2B' }
      },
      {
        path: 'orders/:id',
        name: 'DistributorOrdersDetail',
        component: () => import('@/pages/distributor/orders/Detail.vue'),
        meta: { title: 'Détail Commande B2B' }
      },
      {
        path: 'orders/:id/prepare',
        name: 'DistributorOrdersPrepare',
        component: () => import('@/pages/distributor/orders/Prepare.vue'),
        meta: { title: 'Préparation Logistique' }
      },
      {
        path: 'orders/delivery-notes',
        name: 'DistributorOrdersDeliveryNotes',
        component: () => import('@/pages/distributor/orders/DeliveryNotes.vue'),
        meta: { title: 'Bons de livraison émis' }
      },
      {
        path: 'orders/delivery-notes/:id',
        name: 'DistributorOrdersDeliveryNoteDetail',
        component: () => import('@/pages/distributor/orders/DeliveryNoteDetail.vue'),
        meta: { title: 'Détail Bon de livraison émis' }
      },
      // Invoices
      {
        path: 'invoices',
        name: 'DistributorInvoicesIndex',
        component: () => import('@/pages/distributor/invoices/Index.vue'),
        meta: { title: 'Factures B2B' }
      },
      {
        path: 'invoices/:id',
        name: 'DistributorInvoicesDetail',
        component: () => import('@/pages/distributor/invoices/Detail.vue'),
        meta: { title: 'Détail Facture' }
      },
      // Warehouses
      {
        path: 'warehouses',
        name: 'DistributorWarehousesIndex',
        component: () => import('@/pages/distributor/warehouses/Index.vue'),
        meta: { title: 'Entrepôts' }
      },
      {
        path: 'warehouses/create',
        name: 'DistributorWarehousesCreate',
        component: () => import('@/pages/distributor/warehouses/Create.vue'),
        meta: { title: 'Nouvel Entrepôt' }
      },
      {
        path: 'warehouses/:id',
        name: 'DistributorWarehousesDetail',
        component: () => import('@/pages/distributor/warehouses/Detail.vue'),
        meta: { title: 'Détail Entrepôt' }
      },
      {
        path: 'warehouses/transfers',
        name: 'DistributorWarehousesTransfers',
        component: () => import('@/pages/distributor/warehouses/Transfers.vue'),
        meta: { title: 'Transferts de stock' }
      },
      {
        path: 'warehouses/adjustments',
        name: 'DistributorWarehousesAdjustments',
        component: () => import('@/pages/distributor/warehouses/Adjustments.vue'),
        meta: { title: 'Ajustements de stock' }
      },
      // Products
      {
        path: 'products',
        name: 'DistributorProductsIndex',
        component: () => import('@/pages/distributor/products/Index.vue'),
        meta: { title: 'Catalogue Grossiste' }
      },
      {
        path: 'products/create',
        name: 'DistributorProductsCreate',
        component: () => import('@/pages/distributor/products/Create.vue'),
        meta: { title: 'Nouveau Produit' }
      },
      // Clients
      {
        path: 'clients',
        name: 'DistributorClientsIndex',
        component: () => import('@/pages/distributor/clients/Index.vue'),
        meta: { title: 'Réseau de Clients' }
      },
      {
        path: 'clients/:id',
        name: 'DistributorClientsDetail',
        component: () => import('@/pages/distributor/clients/Detail.vue'),
        meta: { title: 'Profil Client' }
      },
      // RFQ
      {
        path: 'rfq/received',
        name: 'DistributorRFQReceived',
        component: () => import('@/pages/distributor/rfq/Received.vue'),
        meta: { title: 'Appels d\'Offres Reçus' }
      },
      {
        path: 'rfq/sent',
        name: 'DistributorRFQSent',
        component: () => import('@/pages/distributor/rfq/Sent.vue'),
        meta: { title: 'Appels d\'Offres Émis' }
      },
      // Approvisionnement Industriel (Fournisseurs, Achats)
      {
        path: 'suppliers',
        name: 'DistributorSuppliersIndex',
        component: () => import('@/pages/distributor/suppliers/Index.vue'),
        meta: { title: 'Partenaires Amont' }
      },
      {
        path: 'suppliers/create',
        name: 'DistributorSuppliersCreate',
        component: () => import('@/pages/distributor/suppliers/Create.vue'),
        meta: { title: 'Ajouter Fournisseur' }
      },
      {
        path: 'suppliers/:id',
        name: 'DistributorSuppliersDetail',
        component: () => import('@/pages/distributor/suppliers/Detail.vue'),
        meta: { title: 'Détail Fournisseur' }
      },
      {
        path: 'purchases',
        name: 'DistributorPurchasesIndex',
        component: () => import('@/pages/distributor/purchases/Index.vue'),
        meta: { title: 'Bons de Commande' }
      },
      {
        path: 'purchases/create',
        name: 'DistributorPurchasesCreate',
        component: () => import('@/pages/distributor/purchases/Create.vue'),
        meta: { title: 'Nouveau Bon' }
      },
      {
        path: 'purchases/:id',
        name: 'DistributorPurchasesDetail',
        component: () => import('@/pages/distributor/purchases/Detail.vue'),
        meta: { title: 'Détail Bon de Commande B2B' }
      },
      {
        path: 'purchases/track/:id',
        name: 'DistributorPurchasesTrack',
        component: () => import('@/pages/distributor/purchases/Track.vue'),
        meta: { title: 'Suivi Fret & Livraison' }
      },
      {
        path: 'purchases/receive/:id',
        name: 'DistributorPurchasesReceive',
        component: () => import('@/pages/distributor/purchases/Receive.vue'),
        meta: { title: 'Réception de livraison B2B' }
      },
      {
        path: 'purchases/delivery-notes',
        name: 'DistributorPurchasesDeliveryNotes',
        component: () => import('@/pages/distributor/purchases/DeliveryNotes.vue'),
        meta: { title: 'Bons de livraison' }
      },
      {
        path: 'purchases/delivery-notes/:id',
        name: 'DistributorPurchasesDeliveryNoteDetail',
        component: () => import('@/pages/distributor/purchases/DeliveryNoteDetail.vue'),
        meta: { title: 'Détail Bon de livraison' }
      },
      // Equipe
      {
        path: 'users',
        name: 'DistributorUsersIndex',
        component: () => import('@/pages/distributor/users/Index.vue'),
        meta: { title: 'Équipe et Manutention' }
      },
      // Settings
      {
        path: 'settings/general',
        name: 'DistributorSettingsGeneral',
        component: () => import('@/pages/distributor/settings/General.vue'),
        meta: { title: 'Configuration Distributeur' }
      },
      {
        path: 'settings/shipping',
        name: 'DistributorSettingsShipping',
        component: () => import('@/pages/distributor/settings/Shipping.vue'),
        meta: { title: 'Transport Logistique' }
      }
    ]
  }
];

export default distributorRoutes;
