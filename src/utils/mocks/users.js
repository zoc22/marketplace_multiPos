export const mockUsers = [
  {
    id: 'usr_admin',
    email: 'admin@test.com',
    password: 'password',
    name: 'Admin Platform',
    company: 'Enterprise Central Central',
    phone: '+237 6 99 99 99 99',
    roles: ['admin'],
    status: 'approved',
    created_at: '2026-01-10T12:00:00Z',
  },
  {
    id: 'usr_buyer_1',
    email: 'buyer@test.com',
    password: 'password',
    name: 'Alice Kamga',
    company: 'Kamga B2C Sourcing',
    phone: '+237 6 77 77 77 77',
    roles: ['buyer'],
    status: 'approved',
    created_at: '2026-03-20T10:15:00Z',
  },
  {
    id: 'usr_buyer_2',
    email: 'buyer2@test.com',
    password: 'password',
    name: 'Jean Ntolo',
    company: 'Ntolo E-commerce',
    phone: '+237 6 88 88 88 88',
    roles: ['buyer'],
    status: 'approved',
    created_at: '2026-03-21T11:30:00Z',
  },
  {
    id: 'usr_vendor_1',
    email: 'vendor@test.com',
    password: 'password',
    name: 'TechSupplies SARL',
    company: 'TechSupplies SARL',
    phone: '+237 6 99 88 77 66',
    roles: ['vendor'],
    status: 'approved',
    tenant: 'techsupplies',
    created_at: '2026-05-10T10:15:00Z',
    tenantPermissions: {
      'techsupplies': ['manage_stock', 'issue_rfq', 'approve_orders', 'view_ledger', 'edit_team']
    }
  },
  {
    id: 'usr_vendor_2',
    email: 'vendor2@test.com',
    password: 'password',
    name: 'SolarPlus Cameroun',
    company: 'SolarPlus Cameroun',
    phone: '+237 6 55 66 77 88',
    roles: ['vendor'],
    status: 'approved',
    tenant: 'solarplus',
    created_at: '2026-05-12T09:40:00Z',
    tenantPermissions: {
      'solarplus': ['manage_stock', 'issue_rfq', 'approve_orders', 'view_ledger', 'edit_team']
    }
  },
  {
    id: 'usr_dist_1',
    email: 'distributor@test.com',
    password: 'password',
    name: 'AgroDistrib Cameroun',
    company: 'AgroDistrib Cameroun',
    phone: '+237 6 77 66 55 44',
    roles: ['distributor'],
    status: 'approved',
    tenant: 'agrodistrib',
    created_at: '2026-04-20T08:30:00Z',
    tenantPermissions: {
      'agrodistrib': ['manage_stock', 'view_ledger']
    }
  },
  {
    id: 'usr_dist_2',
    email: 'distributor2@test.com',
    password: 'password',
    name: 'BTP Materials Supply',
    company: 'BTP Materials Supply',
    phone: '+237 6 22 33 44 55',
    roles: ['distributor'],
    status: 'approved',
    tenant: 'btpmaterials',
    created_at: '2026-04-22T14:50:00Z',
    tenantPermissions: {
      'btpmaterials': ['manage_stock', 'view_ledger']
    }
  }
];
