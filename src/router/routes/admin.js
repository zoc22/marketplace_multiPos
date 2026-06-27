export const adminRoutes = [
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/pages/admin/Dashboard/Dashboard.vue'),
      },
      {
        path: 'stats',
        name: 'PlatformStats',
        component: () => import('@/pages/admin/Dashboard/PlatformStats.vue'),
      },
      {
        path: 'live',
        name: 'RealTimeMonitor',
        component: () => import('@/pages/admin/Dashboard/RealTimeMonitor.vue'),
      },
      {
        path: 'users',
        name: 'AdminUsersIndex',
        component: () => import('@/pages/admin/Users/Index.vue'),
      },
      {
        path: 'users/suppliers',
        name: 'AdminSuppliers',
        component: () => import('@/pages/admin/Users/Suppliers.vue'),
      },
      {
        path: 'users/buyers',
        name: 'AdminBuyers',
        component: () => import('@/pages/admin/Users/Buyers.vue'),
      },
      {
        path: 'users/verification',
        name: 'AdminVerification',
        component: () => import('@/pages/admin/Users/Verification.vue'),
      },
      {
        path: 'users/:id',
        name: 'AdminUserDetail',
        component: () => import('@/pages/admin/Users/Detail.vue'),
      },
      {
        path: 'products',
        name: 'AdminProductsIndex',
        component: () => import('@/pages/admin/Products/Index.vue'),
      },
      {
        path: 'products/moderation',
        name: 'AdminProductsModeration',
        component: () => import('@/pages/admin/Products/Moderation.vue'),
      },
      {
        path: 'products/reported',
        name: 'AdminProductsReported',
        component: () => import('@/pages/admin/Products/Reported.vue'),
      },
      {
        path: 'products/categories',
        name: 'AdminProductsCategories',
        component: () => import('@/pages/admin/Products/Categories.vue'),
      },
      {
        path: 'orders',
        name: 'AdminOrdersIndex',
        component: () => import('@/pages/admin/Orders/Index.vue'),
      },
      {
        path: 'orders/:id',
        name: 'AdminOrderDetail',
        component: () => import('@/pages/admin/Orders/Detail.vue'),
      },
      {
        path: 'escrow',
        name: 'AdminEscrow',
        component: () => import('@/pages/admin/Escrow/Index.vue'),
      },
      {
        path: 'escrow/:id',
        name: 'AdminEscrowDetail',
        component: () => import('@/pages/admin/Escrow/Detail.vue'),
      },
      {
        path: 'escrow/:id/release',
        name: 'AdminEscrowRelease',
        component: () => import('@/pages/admin/Escrow/Release.vue'),
      },
      {
        path: 'escrow/:id/refund',
        name: 'AdminEscrowRefund',
        component: () => import('@/pages/admin/Escrow/Refund.vue'),
      },
      {
        path: 'escrow/disputes',
        name: 'AdminEscrowDisputes',
        component: () => import('@/pages/admin/Escrow/Disputes.vue'),
      },
      {
        path: 'escrow/disputes/:id',
        name: 'AdminEscrowDisputeDetail',
        component: () => import('@/pages/admin/Escrow/DisputeDetail.vue'),
      },
      {
        path: 'disputes',
        name: 'AdminDisputesIndex',
        component: () => import('@/pages/admin/Escrow/Disputes.vue'),
      },
      {
        path: 'disputes/:id',
        name: 'AdminDisputeDetail',
        component: () => import('@/pages/admin/Escrow/DisputeDetail.vue'),
      },
      {
        path: 'finance/transactions',
        name: 'AdminTransactions',
        component: () => import('@/pages/admin/Finance/Transactions.vue'),
      },
      {
        path: 'finance/commissions',
        name: 'AdminCommissions',
        component: () => import('@/pages/admin/Finance/Commissions.vue'),
      },
      {
        path: 'finance/withdrawals',
        name: 'AdminWithdrawals',
        component: () => import('@/pages/admin/Finance/Withdrawals.vue'),
      },
      {
        path: 'finance/escrow',
        name: 'AdminFinanceEscrow',
        component: () => import('@/pages/admin/Escrow/Index.vue'),
      },
      {
        path: 'finance/settings',
        name: 'AdminFinanceSettings',
        component: () => import('@/pages/admin/Finance/Settings.vue'),
      },
      {
        path: 'support',
        name: 'AdminSupportTickets',
        component: () => import('@/pages/admin/Support/Tickets.vue'),
      },
      {
        path: 'support/:id',
        name: 'AdminSupportTicketDetail',
        component: () => import('@/pages/admin/Support/Detail.vue'),
      },
      {
        path: 'analytics/reports',
        name: 'AdminReports',
        component: () => import('@/pages/admin/Analytics/Reports.vue'),
      },
      {
        path: 'analytics/export',
        name: 'AdminExport',
        component: () => import('@/pages/admin/Analytics/Export.vue'),
      },
      {
        path: 'analytics/trends',
        name: 'AdminTrends',
        component: () => import('@/pages/admin/Analytics/Trends.vue'),
      },
      {
        path: 'system/logs',
        name: 'AdminSystemLogs',
        component: () => import('@/pages/admin/System/Logs.vue'),
      },
      {
        path: 'system/queue',
        name: 'AdminSystemQueue',
        component: () => import('@/pages/admin/System/Queue.vue'),
      },
      {
        path: 'system/backups',
        name: 'AdminSystemBackups',
        component: () => import('@/pages/admin/System/Backups.vue'),
      },
      {
        path: 'system/health',
        name: 'AdminSystemHealth',
        component: () => import('@/pages/admin/System/Health.vue'),
      },
      {
        path: 'settings/general',
        name: 'AdminSettingsGeneral',
        component: () => import('@/pages/admin/Settings/General.vue'),
      },
      {
        path: 'settings/tenants',
        name: 'AdminSettingsTenants',
        component: () => import('@/pages/admin/Settings/Tenants.vue'),
      },
      {
        path: 'settings/rules',
        name: 'AdminSettingsRules',
        component: () => import('@/pages/admin/Settings/Rules.vue'),
      },
      {
        path: 'settings/email',
        name: 'AdminSettingsEmail',
        component: () => import('@/pages/admin/Settings/Email.vue'),
      }
    ]
  }
];

export default adminRoutes;
