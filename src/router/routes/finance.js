export const financeRoutes = [
  {
    path: '/finance-dashboard',
    name: 'FinanceDashboardGlobal',
    component: () => import('@/pages/supplier/Finance/Transactions.vue'),
    meta: { requiresAuth: true, role: 'finance' }
  }
];

export default financeRoutes;
