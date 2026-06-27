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

  // Rule 3: Auth pages (/auth/login, /auth/register)
  // MUST redirect logged-in users to their dashboard.
  const isAuthPage = to.path.startsWith('/auth/');

  if (authenticated && isAuthPage) {
    // Le plan spécifie : si un utilisateur connecté va sur une page d'auth, 
    // il est automatiquement déconnecté pour lui permettre de s'authentifier à nouveau.
    authStore.logout();
    return next();
  }

  // Standard authentication check
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth && !authenticated) {
    return next({ name: 'Login', query: { redirect: to.fullPath } });
  }

  next();
}

export default authGuard;
