import { useAuthStore } from '@/store/modules/auth.js';

export function roleGuard(to, from, next) {
  const authStore = useAuthStore();
  const authenticated = !!authStore.token && !!authStore.user;

  if (authenticated) {
    const userRoles = authStore.roles || [];
    
    // Find if the target route expects a specific role
    const recordWithRole = to.matched.find(record => record.meta && record.meta.role);
    const requiredRole = recordWithRole ? recordWithRole.meta.role : null;

    if (requiredRole) {
      const hasAccess = userRoles.includes(requiredRole);

      if (!hasAccess) {
        // Redirection as they are not authorized to cross-access backoffices
        if (userRoles.includes('admin')) {
          return next({ name: 'AdminDashboard' });
        } else if (userRoles.includes('supplier')) {
          return next({ name: 'SupplierDashboard' });
        } else if (userRoles.includes('buyer')) {
          return next({ name: 'BuyerDashboard' });
        } else if (userRoles.includes('pos')) {
          return next({ name: 'POSTerminal' });
        } else {
          return next({ name: 'Login' });
        }
      }
    }
  }

  next();
}

export default roleGuard;
