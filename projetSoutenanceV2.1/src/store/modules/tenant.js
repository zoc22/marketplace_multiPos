import { defineStore } from 'pinia';

export const useTenantStore = defineStore('tenant', {
  state: () => ({
    currentTenant: null,
    tenants: [],
  }),
  actions: {
    setTenant(tenant) {
      this.currentTenant = tenant;
    },
    setTenants(tenants) {
      this.tenants = tenants;
    }
  },
  persist: true
});
