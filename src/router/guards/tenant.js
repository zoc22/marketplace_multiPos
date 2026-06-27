import { useTenantStore } from '@/store/modules/tenant.js';

export function tenantGuard(to, from, next) {
  const tenantStore = useTenantStore();
  // Ensure the tenant context is properly selected/applied if necessary
  if (!tenantStore.currentTenant && tenantStore.tenants.length > 0) {
    tenantStore.setTenant(tenantStore.tenants[0]);
  }
  next();
}

export default tenantGuard;
