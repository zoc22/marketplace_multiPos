import { useAuthStore } from '@/store/modules/auth.js';

export function authGuard(to, from, next) {
  const authStore = useAuthStore();

  const authenticated = !!authStore.token && !!authStore.user;
  const userRoles = authStore.roles || [];

  // Determine backoffice routing for logged-in users
  let userBackofficeName = '';
  if (userRoles.includes('admin')) userBackofficeName = 'AdminDashboard';
  else if (userRoles.includes('supplier')) userBackofficeName = 'SupplierDashboard';
  else if (userRoles.includes('buyer')) userBackofficeName = 'BuyerDashboard';
  else if (userRoles.includes('pos')) userBackofficeName = 'POSTerminal';

  // Rule 3: Marketplace (and all public routes like Home, Products, categories, /auth/login)
  // MUST redirect logged-in users directly and exclusively to their own space!
  const isPublicRoute = !to.matched.some(record => record.meta.requiresAuth);
  const isAuthPage = to.path.startsWith('/auth/');

  if (authenticated && (isPublicRoute || isAuthPage) && to.name !== 'NotFound') {
    if (userBackofficeName) {
      return next({ name: userBackofficeName });
    }
  }

  // Standard authentication check
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth && !authenticated) {
    return next({ name: 'Login', query: { redirect: to.fullPath } });
  }

  next();
}

export default authGuard;
