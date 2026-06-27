import { createRouter, createWebHistory } from 'vue-router';
import { publicRoutes } from './routes/public.js';
import { authRoutes } from './routes/auth.js';
import { buyerRoutes } from './routes/buyer.js';
import { supplierRoutes } from './routes/supplier.js';
import { posRoutes } from './routes/pos.js';
import { adminRoutes } from './routes/admin.js';
import { financeRoutes } from './routes/finance.js';

import { authGuard } from './guards/auth.js';
import { roleGuard } from './guards/role.js';
import { tenantGuard } from './guards/tenant.js';

const routes = [
  ...publicRoutes,
  ...authRoutes,
  ...buyerRoutes,
  ...supplierRoutes,
  ...posRoutes,
  ...adminRoutes,
  ...financeRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/shared/NotFound.vue')
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(authGuard);
router.beforeEach(roleGuard);
router.beforeEach(tenantGuard);

export default router;
