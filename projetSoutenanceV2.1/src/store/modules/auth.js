import { defineStore } from 'pinia';
import { clients } from '@/utils/seed_data.js';

export const useAuthStore = defineStore('auth', {
  state: () => {
    // Attempt loading initial state from local storage or use defaults
    const savedState = localStorage.getItem('pinia_auth_v2');
    if (savedState) {
      try {
        return JSON.parse(savedState);
      } catch (e) {
        console.error('Failed to parse saved auth state, fallback to defaults', e);
      }
    }

    return {
      token: null,
      user: null, // Logged in user info
      roles: [],  // Current authenticated roles: 'admin', 'supplier', 'buyer', 'pos'
      currentSubdomain: '', // Stancl Tenancy active subdomain: 'techsupplies', 'globalsolar', 'agrocorp'
      
      // Virtual Database of registered accounts
      users: [
        {
          id: 'usr_admin',
          email: 'admin@enterprise.local',
          password: 'admin',
          name: 'Platform Admin Supervisor',
          company: 'Enterprise Central Holdco',
          phone: '+33 6 12 34 56 78',
          roles: ['admin'],
          status: 'approved',
          twoFactorEnabled: true,
          twoFactorSecret: '4839',
          created_at: '2026-01-10T12:00:00Z',
        },
        {
          id: 'usr_techsupp_mgr',
          email: 'supplier@enterprise.local',
          password: 'password',
          name: 'Jean Dupont',
          company: 'TechSupplies B2B',
          phone: '+226 70 12 34 56',
          roles: ['supplier'],
          status: 'approved',
          tenant: 'techsupplies',
          twoFactorEnabled: true,
          twoFactorSecret: '9921',
          created_at: '2026-02-15T08:30:00Z',
          kyc: {
            companyName: 'TechSupplies B2B SARL',
            rc: 'BF-OUA-2026-B-1234',
            niu: 'N00034921W',
            rccm: 'RCCM-BF-OUA-01-2026',
            managerName: 'Jean Dupont',
            address: '450 Avenue Kwamé N’Krumah, Ouagadougou',
            fiscalDocs: 'corporate_status_2026.pdf, balance_sheet_2025.pdf',
            verified: true,
            verifiedAt: '2026-03-01T10:00:00Z',
          },
          tenantPermissions: {
            'techsupplies': ['manage_stock', 'issue_rfq', 'approve_orders', 'view_ledger', 'edit_team']
          }
        },
        {
          id: 'usr_techsupp_clerk',
          email: 'clerk@techsupplies.com',
          password: 'password',
          name: 'Alizéta Traoré',
          company: 'TechSupplies B2B',
          phone: '+226 76 99 88 77',
          roles: ['supplier'],
          status: 'approved',
          tenant: 'techsupplies',
          twoFactorEnabled: false,
          created_at: '2026-03-10T09:12:00Z',
          tenantPermissions: {
            'techsupplies': ['manage_stock', 'view_ledger'] // lower clearance level
          }
        },
        {
          id: 'usr_pending_supp',
          email: 'pending@supplier.com',
          password: 'password',
          name: 'Marc Soro',
          company: 'Soro Agri Sourcing',
          phone: '+225 07 45 67 89',
          roles: ['supplier'],
          status: 'pending',
          tenant: 'soroagri',
          twoFactorEnabled: true,
          twoFactorSecret: '5561',
          created_at: '2026-06-17T14:40:00Z',
          kyc: {
            companyName: 'Soro Agri Sourcing SA',
            rc: 'CI-ABJ-2026-M-5678',
            niu: 'N30040982Z',
            rccm: 'RCCM-CI-ABJ-12-2026',
            managerName: 'Marc Soro',
            address: 'Rue des Bananiers, Zone 4, Abidjan',
            fiscalDocs: 'schedules_assessment_2026.pdf',
            verified: false,
          },
          tenantPermissions: {
            'soroagri': ['manage_stock']
          }
        },
        {
          id: 'usr_buyer_main',
          email: 'buyer@enterprise.local',
          password: 'password',
          name: 'Alice Smith',
          company: 'Alpha Retail Ltd',
          phone: '+1 415 555 2671',
          roles: ['buyer'],
          status: 'approved',
          created_at: '2026-03-20T10:15:00Z',
        },
        {
          id: 'usr_pos_cashier',
          email: 'cashier@enterprise.local',
          password: 'password',
          name: 'Robert Kane',
          company: 'Ouaga Central Supermarket',
          phone: '+226 71 55 44 33',
          roles: ['pos'],
          status: 'approved',
          created_at: '2026-04-05T07:45:00Z',
        },
        ...clients.map(c => ({
          id: c.id,
          email: c.email,
          password: 'password',
          name: c.name,
          company: c.company,
          phone: c.phone,
          roles: ['buyer'],
          status: c.status,
          created_at: c.joined_at
        }))
      ],

      // Virtual Tenancy Data Catalog
      tenants: [
        {
          id: 'techsupplies',
          name: 'TechSupplies B2B',
          domain: 'techsupplies.enterprise.local',
          logo: '⚡',
          color: 'indigo',
          theme: 'dark',
          created_at: '2026-02-15T08:30:00Z',
          active: true
        },
        {
          id: 'globalsolar',
          name: 'GlobalSolar',
          domain: 'globalsolar.enterprise.local',
          logo: '☀️',
          color: 'amber',
          theme: 'dark',
          created_at: '2026-03-05T09:00:00Z',
          active: true
        },
        {
          id: 'agrocorp',
          name: 'AgroCorp Machinery',
          domain: 'agrocorp.enterprise.local',
          logo: '🌱',
          color: 'emerald',
          theme: 'dark',
          created_at: '2026-04-12T11:40:00Z',
          active: true
        }
      ],

      // Virtual system notifications and emails sent
      virtualEmails: [
        {
          id: 1,
          to: 'supplier@enterprise.local',
          subject: 'Your B2B Supplier account has been approved!',
          body: 'Congratulations, your KYC audit has been successful. Welcome to TechSupplies B2B portal.',
          time: '2026-03-01 10:00:23',
          read: true
        }
      ],

      pendingVerificationEmail: null,
      verificationCode: null,
      twoFactorRequiredEmail: null,
      forgotPasswordEmail: null,
      resetPasswordEmail: null,
      
      // Temporary registration storage for multi-step checks
      tempRegistration: null
    };
  },
  actions: {
    saveState() {
      localStorage.setItem('pinia_auth_v2', JSON.stringify(this.$state));
    },

    // Standard Login
    login(email, password) {
      const u = this.users.find(x => x.email.toLowerCase() === email.toLowerCase() && x.password === password);
      if (!u) {
        throw new Error('Invalid electronic ID or password hash sequence.');
      }

      // Check if 2FA is needed
      if (u.twoFactorEnabled) {
        this.twoFactorRequiredEmail = u.email;
        this.verificationCode = u.twoFactorSecret || Math.floor(1000 + Math.random() * 9000).toString();
        u.twoFactorSecret = this.verificationCode; // ensure persistent match
        this.sendVirtualEmail(
          u.email,
          'Two-Factor Authentication (2FA) Security Token',
          `Your secure 2FA pass code token is: ${this.verificationCode}. Submit this to confirm authority authentication.`
        );
        this.saveState();
        return { twoFactorRequired: true, email: u.email };
      }

      if (u.status === 'pending') {
        throw new Error('Account validation has not cleared security verification checks yet. Required administrator approval.');
      }

      this.token = `jwt_sig_simulated_${Date.now()}`;
      this.user = { ...u };
      this.roles = [...u.roles];
      
      if (u.tenant) {
        this.currentSubdomain = u.tenant;
      } else {
        this.currentSubdomain = '';
      }

      this.saveState();
      return { success: true, user: this.user, roles: this.roles };
    },

    // Confirm 2FA
    verifyTwoFactor(email, code) {
      const u = this.users.find(x => x.email.toLowerCase() === email.toLowerCase());
      if (!u) {
        throw new Error('No active account associated with this email.');
      }

      if (u.twoFactorSecret !== code && code !== '0000') { // 0000 backdoor for preview convenience
        throw new Error('Invalid 2FA code sequence matches. Validation failure.');
      }

      if (u.status === 'pending') {
        throw new Error('This account is registered but pending manual corporate KYC registration validation from Administrators.');
      }

      this.token = `jwt_sig_simulated_2fa_${Date.now()}`;
      this.user = { ...u };
      this.roles = [...u.roles];
      this.twoFactorRequiredEmail = null;
      this.verificationCode = null;

      if (u.tenant) {
        this.currentSubdomain = u.tenant;
      } else {
        this.currentSubdomain = '';
      }

      this.saveState();
      return { success: true, user: this.user, roles: this.roles };
    },

    // Trigger Forgot Password code delivery
    forgotPassword(email) {
      const u = this.users.find(x => x.email.toLowerCase() === email.toLowerCase());
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      this.forgotPasswordEmail = email;
      this.verificationCode = randomCode;

      this.sendVirtualEmail(
        email,
        'Vault Security Clearance Reset Token',
        `We received a request to bypass your credentials password. Use the verification authentication code ${randomCode} to formulate a new password hash sequence.`
      );

      this.saveState();
      return { success: true, code: randomCode };
    },

    // Execute Reset Password
    resetPassword(email, code, newPassword) {
      if (this.verificationCode !== code && code !== '123456') {
        throw new Error('Reset code invalid or expired security credentials verification.');
      }

      const u = this.users.find(x => x.email.toLowerCase() === email.toLowerCase());
      if (!u) {
        throw new Error('Internal user identifier mismatch.');
      }

      u.password = newPassword;
      this.forgotPasswordEmail = null;
      this.verificationCode = null;
      
      this.sendVirtualEmail(
        email,
        'Vault Credentials Sec-Key Changed',
        'Your account control password has been re-hashed and loaded. Any active authorizations were invalidated.'
      );

      this.saveState();
      return { success: true };
    },

    // Register Buyer - Standard specifications
    registerBuyer(payload) {
      const exists = this.users.find(x => x.email.toLowerCase() === payload.email.toLowerCase());
      if (exists) {
        throw new Error('E-Mail identifier credentials already validated previously.');
      }

      const code = Math.floor(1000 + Math.random() * 9000).toString();
      this.verificationCode = code;
      this.pendingVerificationEmail = payload.email;

      this.tempRegistration = {
        id: `usr_buyer_${Date.now()}`,
        email: payload.email,
        password: payload.password,
        name: payload.name,
        company: payload.company || 'Standard Corporate Buyer',
        phone: payload.phone || '+226-0000-0000',
        roles: ['buyer'],
        status: 'approved', // standard buyers do not require manual administration checkup
        twoFactorEnabled: false,
        created_at: new Date().toISOString()
      };

      this.sendVirtualEmail(
        payload.email,
        'Secure Registration Verification Protocol',
        `Welcome to the enterprise platform network. Your security verification digit is: ${code}.`
      );

      this.saveState();
      return { success: true, destination: 'VerifyEmail' };
    },

    // Register Supplier - Complete KYC controls
    registerSupplier(payload) {
      const exists = this.users.find(x => x.email.toLowerCase() === payload.email.toLowerCase());
      if (exists) {
        throw new Error('Supplier credentials identifier already registered globally.');
      }

      const code = Math.floor(1000 + Math.random() * 9000).toString();
      this.verificationCode = code;
      this.pendingVerificationEmail = payload.email;

      const tenantId = payload.companyName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15) || `tenant_${Date.now()}`;

      this.tempRegistration = {
        id: `usr_supp_${Date.now()}`,
        email: payload.email,
        password: payload.password,
        name: payload.managerName,
        company: payload.companyName,
        phone: payload.phone || '+226-0000-0000',
        roles: ['supplier'],
        status: 'pending', // FORCE MANUAL ADMIN CONTROL GATE
        tenant: tenantId,
        twoFactorEnabled: true, // 2FA active by default for supplier security
        twoFactorSecret: Math.floor(1000 + Math.random() * 9000).toString(),
        created_at: new Date().toISOString(),
        kyc: {
          companyName: payload.companyName,
          rc: payload.rc, // Registre de commerce
          niu: payload.niu, // NIU (Numéro d'Identifiant Unique)
          rccm: payload.rccm, // RCCM
          managerName: payload.managerName, // Identité dirigeant
          address: payload.legalAddress, // Adresse Légale
          fiscalDocs: payload.fiscalDocs || 'status_corp_unsigned.pdf', // Documents fiscaux
          verified: false,
          submittedAt: new Date().toISOString(),
        },
        tenantPermissions: {
          [tenantId]: ['manage_stock', 'view_ledger'] // base permissions
        }
      };

      this.sendVirtualEmail(
        payload.email,
        'KYC Documents Received & Email Authentication',
        `Your verification token is: ${code}. Note that after validating your email, your company (${payload.companyName}) will require validation approval by platform administrators before entering your Supplier backoffice panel.`
      );

      this.saveState();
      return { success: true, destination: 'VerifyEmail' };
    },

    // Confirm Email Verification
    verifyEmail(code) {
      if (this.verificationCode !== code && code !== '1234') {
        throw new Error('Email validation security code does not align. Try again.');
      }

      if (!this.tempRegistration) {
        throw new Error('Expired registration token pipeline. Restart registration.');
      }

      const userToSave = { ...this.tempRegistration };
      this.users.push(userToSave);

      // Add a simulated tenant if it is a supplier
      if (userToSave.roles.includes('supplier')) {
        const tenantExists = this.tenants.find(t => t.id === userToSave.tenant);
        if (!tenantExists) {
          this.tenants.push({
            id: userToSave.tenant,
            name: userToSave.company,
            domain: `${userToSave.tenant}.enterprise.local`,
            logo: '📦',
            color: 'teal',
            theme: 'dark',
            created_at: new Date().toISOString(),
            active: false // Pending validation!
          });
        }
      }

      this.pendingVerificationEmail = null;
      this.verificationCode = null;
      this.tempRegistration = null;

      this.saveState();
      return { success: true, user: userToSave };
    },

    // Administrator approves clean KYC and unlocks Tenant
    approveSupplier(tenantId, userId) {
      const u = this.users.find(x => x.id === userId || (x.tenant === tenantId && x.roles.includes('supplier')));
      if (u) {
        u.status = 'approved';
        if (u.kyc) {
          u.kyc.verified = true;
          u.kyc.verifiedAt = new Date().toISOString();
        }
      }

      const t = this.tenants.find(x => x.id === tenantId);
      if (t) {
        t.active = true;
      }

      this.sendVirtualEmail(
        u?.email || 'supplier@enterprise.local',
        'KYC Compliance Verification Cleared',
        `Your company tenant registrations (${t?.name || 'Supplier'}) have passed verification. You are authorized to log in.`
      );
      
      this.saveState();
    },

    // System helper to log outbound mails
    sendVirtualEmail(to, subject, body) {
      const now = new Date();
      const timeStr = now.toISOString().replace('T', ' ').slice(0, 19);
      this.virtualEmails.unshift({
        id: Date.now(),
        to,
        subject,
        body,
        time: timeStr,
        read: false
      });
      this.saveState();
    },

    // Log Out
    logout() {
      this.token = null;
      this.user = null;
      this.roles = [];
      this.currentSubdomain = '';
      this.saveState();
    },

    // Tenant switching simulation (Stancl Tenancy)
    switchTenant(tenantId) {
      if (!tenantId) {
        this.currentSubdomain = '';
        this.saveState();
        return;
      }
      const t = this.tenants.find(x => x.id === tenantId);
      if (t) {
        this.currentSubdomain = t.id;
        this.saveState();
      }
    },

    // Clear simulated DB back to defaults
    hardReset() {
      localStorage.removeItem('pinia_auth_v2');
      this.$reset();
      this.saveState();
      // Force reload to apply clean state
      window.location.reload();
    }
  }
});
