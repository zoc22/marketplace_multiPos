export const supplierRoutes = [
  {
    path: '/supplier',
    component: () => import('@/layouts/SupplierLayout.vue'),
    meta: { requiresAuth: true, role: 'supplier' },
    children: [
      {
        path: 'dashboard',
        name: 'SupplierDashboard',
        component: () => import('@/pages/supplier/Dashboard/Dashboard.vue'),
      },
      {
        path: 'kpis',
        name: 'SupplierKPIs',
        component: () => import('@/pages/supplier/Dashboard/KPIs.vue'),
      },
      {
        path: 'analytics',
        name: 'SupplierAnalytics',
        component: () => import('@/pages/supplier/Dashboard/SalesAnalytics.vue'),
      },
      {
        path: 'earnings',
        name: 'SupplierEarnings',
        component: () => import('@/pages/supplier/Dashboard/Earnings.vue'),
      },
      {
        path: 'products',
        name: 'SupplierProductsIndex',
        component: () => import('@/pages/supplier/Products/Index.vue'),
      },
      {
        path: 'products/create',
        name: 'SupplierProductCreate',
        component: () => import('@/pages/supplier/Products/Create.vue'),
      },
      {
        path: 'products/:id/edit',
        name: 'SupplierProductEdit',
        component: () => import('@/pages/supplier/Products/Edit.vue'),
      },
      {
        path: 'products/import',
        name: 'SupplierProductsImport',
        component: () => import('@/pages/supplier/Products/Import.vue'),
      },
      {
        path: 'products/stock',
        name: 'SupplierProductStock',
        component: () => import('@/pages/supplier/Products/Stock.vue'),
      },
      {
        path: 'products/categories',
        name: 'SupplierProductCategories',
        component: () => import('@/pages/supplier/Products/Categories.vue'),
      },
      {
        path: 'orders',
        name: 'SupplierOrdersIndex',
        component: () => import('@/pages/supplier/Orders/Index.vue'),
      },
      {
        path: 'orders/:id',
        name: 'SupplierOrderDetail',
        component: () => import('@/pages/supplier/Orders/Detail.vue'),
      },
      {
        path: 'orders/:id/prepare',
        name: 'SupplierOrderPrepare',
        component: () => import('@/pages/supplier/Orders/Prepare.vue'),
      },
      {
        path: 'orders/shipping-labels',
        name: 'SupplierShippingLabels',
        component: () => import('@/pages/supplier/Orders/ShippingLabels.vue'),
      },
      {
        path: 'warehouses',
        name: 'SupplierWarehousesIndex',
        component: () => import('@/pages/supplier/Warehouses/Index.vue'),
      },
      {
        path: 'warehouses/create',
        name: 'SupplierWarehouseCreate',
        component: () => import('@/pages/supplier/Warehouses/Create.vue'),
      },
      {
        path: 'warehouses/:id',
        name: 'SupplierWarehouseDetail',
        component: () => import('@/pages/supplier/Warehouses/Detail.vue'),
      },
      {
        path: 'warehouses/:id/stock',
        name: 'SupplierWarehouseStock',
        component: () => import('@/pages/supplier/Warehouses/Stock.vue'),
      },
      {
        path: 'warehouses/transfers',
        name: 'SupplierWarehouseTransfers',
        component: () => import('@/pages/supplier/Warehouses/Transfers.vue'),
      },
      {
        path: 'warehouses/adjustments',
        name: 'SupplierWarehouseAdjustments',
        component: () => import('@/pages/supplier/Warehouses/Adjustments.vue'),
      },
      {
        path: 'stores',
        name: 'SupplierStoresIndex',
        component: () => import('@/pages/supplier/Stores/Index.vue'),
      },
      {
        path: 'stores/create',
        name: 'SupplierStoreCreate',
        component: () => import('@/pages/supplier/Stores/Create.vue'),
      },
      {
        path: 'stores/:id',
        name: 'SupplierStoreDetail',
        component: () => import('@/pages/supplier/Stores/Detail.vue'),
      },
      {
        path: 'stores/:id/pos-config',
        name: 'SupplierStorePOSConfig',
        component: () => import('@/pages/supplier/Stores/POSConfig.vue'),
      },
      {
        path: 'suppliers',
        name: 'SupplierB2BSuppliersIndex',
        component: () => import('@/pages/supplier/Suppliers/Index.vue'),
      },
      {
        path: 'suppliers/create',
        name: 'SupplierB2BSupplierCreate',
        component: () => import('@/pages/supplier/Suppliers/Create.vue'),
      },
      {
        path: 'suppliers/:id',
        name: 'SupplierB2BSupplierDetail',
        component: () => import('@/pages/supplier/Suppliers/Detail.vue'),
      },
      {
        path: 'stores/:id/sales',
        name: 'SupplierStoreSales',
        component: () => import('@/pages/supplier/Stores/Sales.vue'),
      },
      {
        path: 'purchases',
        name: 'SupplierPurchasesIndex',
        component: () => import('@/pages/supplier/Purchases/Index.vue'),
      },
      {
        path: 'purchases/create',
        name: 'SupplierPurchaseCreate',
        component: () => import('@/pages/supplier/Purchases/Create.vue'),
      },
      {
        path: 'purchases/delivery-notes',
        name: 'SupplierPurchaseDeliveryNotes',
        component: () => import('@/pages/supplier/Purchases/DeliveryNotes.vue'),
      },
      {
        path: 'purchases/delivery-notes/:id',
        name: 'SupplierPurchaseDeliveryNoteDetail',
        component: () => import('@/pages/supplier/Purchases/DeliveryNoteDetail.vue'),
      },
      {
        path: 'purchases/returns',
        name: 'SupplierPurchaseReturns',
        component: () => import('@/pages/supplier/Purchases/Returns.vue'),
      },
      {
        path: 'expenses',
        name: 'SupplierExpensesIndex',
        component: () => import('@/pages/supplier/Expenses/Index.vue'),
      },
      {
        path: 'expenses/create',
        name: 'SupplierExpenseCreate',
        component: () => import('@/pages/supplier/Expenses/Create.vue'),
      },
      {
        path: 'expenses/categories',
        name: 'SupplierExpenseCategories',
        component: () => import('@/pages/supplier/Expenses/Categories.vue'),
      },
      {
        path: 'rfq/received',
        name: 'SupplierRFQReceived',
        component: () => import('@/pages/supplier/RFQ/Received.vue'),
      },
      {
        path: 'rfq/sent',
        name: 'SupplierRFQSent',
        component: () => import('@/pages/supplier/RFQ/Sent.vue'),
      },
      {
        path: 'rfq/offers',
        name: 'SupplierRFQOffers',
        component: () => import('@/pages/supplier/RFQ/Offers.vue'),
      },
      {
        path: 'rfq/create',
        name: 'SupplierRFQCreate',
        component: () => import('@/pages/supplier/RFQ/Create.vue'),
      },
      {
        path: 'finance/transactions',
        name: 'SupplierFinanceTransactions',
        component: () => import('@/pages/supplier/Finance/Transactions.vue'),
      },
      {
        path: 'finance/balance',
        name: 'SupplierFinanceBalance',
        component: () => import('@/pages/supplier/Finance/Balance.vue'),
      },
      {
        path: 'finance/withdrawals',
        name: 'SupplierFinanceWithdrawals',
        component: () => import('@/pages/supplier/Finance/Withdrawals.vue'),
      },
      {
        path: 'finance/commissions',
        name: 'SupplierFinanceCommissions',
        component: () => import('@/pages/supplier/Finance/Commissions.vue'),
      },
      {
        path: 'finance/invoices',
        name: 'SupplierFinanceInvoices',
        component: () => import('@/pages/supplier/Finance/Invoices.vue'),
      },
      {
        path: 'team',
        name: 'SupplierTeamIndex',
        component: () => import('@/pages/supplier/Team/Index.vue'),
      },
      {
        path: 'team/create',
        name: 'SupplierTeamCreate',
        component: () => import('@/pages/supplier/Team/Create.vue'),
      },
      {
        path: 'team/roles',
        name: 'SupplierTeamRoles',
        component: () => import('@/pages/supplier/Team/Roles.vue'),
      },
      {
        path: 'team/permissions',
        name: 'SupplierTeamPermissions',
        component: () => import('@/pages/supplier/Team/Permissions.vue'),
      },
      {
        path: 'logistics',
        name: 'SupplierLogisticsIndex',
        component: () => import('@/pages/supplier/Logistics/Index.vue'),
      },
      {
        path: 'logistics/create',
        name: 'SupplierLogisticsCreate',
        component: () => import('@/pages/supplier/Logistics/Create.vue'),
      },
      {
        path: 'logistics/carriers',
        name: 'SupplierCarriersIndex',
        component: () => import('@/pages/supplier/Logistics/Carriers.vue'),
      },
      {
        path: 'settings/general',
        name: 'SupplierSettingsGeneral',
        component: () => import('@/pages/supplier/Settings/General.vue'),
      },
      {
        path: 'settings/shipping',
        name: 'SupplierSettingsShipping',
        component: () => import('@/pages/supplier/Settings/Shipping.vue'),
      },
      {
        path: 'settings/payments',
        name: 'SupplierSettingsPayments',
        component: () => import('@/pages/supplier/Settings/Payments.vue'),
      },
      {
        path: 'settings/taxes',
        name: 'SupplierSettingsTaxes',
        component: () => import('@/pages/supplier/Settings/Taxes.vue'),
      },
      {
        path: 'settings/legal',
        name: 'SupplierSettingsLegal',
        component: () => import('@/pages/supplier/Settings/Legal.vue'),
      }
    ]
  }
];

export default supplierRoutes;
