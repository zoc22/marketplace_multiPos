import { defineStore } from 'pinia';
import { clients } from '@/utils/seed_data.js';
import { mockUsers } from '@/utils/mocks/seed.js';

export const useAuthStore = defineStore('auth', {
  state: () => {
    // Clear stale local storage persistence keys to prevent caching outdated test users
    localStorage.removeItem('pinia_auth');
    localStorage.removeItem('pinia_auth_v5');

    return {
      token: null,
      user: null, // Logged in user info
      roles: [],  // Current authenticated roles: 'admin', 'supplier', 'buyer', 'pos'
      currentSubdomain: '', // Stancl Tenancy active subdomain: 'techsupplies', 'solarplus', 'agrodistrib', 'btpmaterials'

      // Virtual Database of registered accounts
      users: [...mockUsers],

      // Virtual Tenancy Data Catalog
      tenants: [
        {
          id: 'techsupplies',
          name: 'TechSupplies SARL',
          domain: 'techsupplies.enterprise.local',
          logo: '⚡',
          color: 'indigo',
          theme: 'dark',
          created_at: '2026-02-15T08:30:00Z',
          active: true
        },
        {
          id: 'solarplus',
          name: 'SolarPlus Cameroun',
          domain: 'solarplus.enterprise.local',
          logo: '☀️',
          color: 'amber',
          theme: 'dark',
          created_at: '2026-03-05T09:00:00Z',
          active: true
        },
        {
          id: 'agrodistrib',
          name: 'AgroDistrib Cameroun',
          domain: 'agrodistrib.enterprise.local',
          logo: '🌱',
          color: 'emerald',
          theme: 'dark',
          created_at: '2026-04-12T11:40:00Z',
          active: true
        },
        {
          id: 'btpmaterials',
          name: 'BTP Materials Supply',
          domain: 'btpmaterials.enterprise.local',
          logo: '📦',
          color: 'orange',
          theme: 'dark',
          created_at: '2026-04-20T08:30:00Z',
          active: true
        }
      ],

      // Virtual system notifications and emails sent
      virtualEmails: [
        {
          id: 1,
          to: 'contact@techsupplies.com',
          subject: 'Votre compte professionnel Vendeur B2B a été approuvé !',
          body: 'Félicitations, votre enregistrement et audit KYC ont été validés. Bienvenue sur le Hub B2B Kong S.A.',
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
      localStorage.setItem('pinia_auth_v5', JSON.stringify(this.$state));
    },

    // Unified Login (Email + Password + 2FA + UniqueCode)
    loginUnified(email, password, code, isSupplier, uniqueCode) {
      const u = this.users.find(x => x.email?.toLowerCase() === email.toLowerCase() && x.password === password);
      if (!u) {
        throw new Error('Identifiant ou mot de passe incorrect.');
      }

      if (isSupplier) {
        if (!u.roles.includes('supplier') && !u.roles.includes('admin') && !u.roles.includes('vendor') && !u.roles.includes('distributor')) {
          throw new Error('Ce compte n\'a pas les privilèges professionnels requis.');
        }
        if (uniqueCode !== 'ADMIN123' && uniqueCode !== 'SUPP123' && uniqueCode !== 'VEND123' && uniqueCode !== 'DIST123') { // Mock unique code validation
          throw new Error('Code Unique d\'Administration invalide.');
        }
      }

      // Check 2FA (Validation was handled by the UI with a randomly generated code)
      if (u.twoFactorEnabled) {
        if (!code) {
          throw new Error('Code de sécurité 2FA requis.');
        }
      }

      if (u.status === 'pending') {
        throw new Error('Votre compte est en attente de validation par un administrateur.');
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

    // Social Login
    socialLogin(provider) {
      // Mock social login: logs in as the standard buyer
      const u = this.users.find(x => x.id === 'usr_buyer_main');
      if (!u) throw new Error('Utilisateur de démonstration introuvable.');

      this.token = `jwt_sig_social_${provider}_${Date.now()}`;
      this.user = { ...u };
      this.roles = [...u.roles];
      this.currentSubdomain = '';
      this.saveState();
      return { success: true, user: this.user, roles: this.roles };
    },

    // Standard Login

    // Confirm 2FA
    verifyTwoFactor(email, code) {
      const u = this.users.find(x => x.email?.toLowerCase() === email.toLowerCase());
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
      const u = this.users.find(x => x.email?.toLowerCase() === email.toLowerCase());
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

      const u = this.users.find(x => x.email?.toLowerCase() === email.toLowerCase());
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
      const exists = this.users.find(x => x.email?.toLowerCase() === payload.email.toLowerCase());
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
      const exists = this.users.find(x => x.email?.toLowerCase() === payload.email.toLowerCase());
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
      localStorage.removeItem('pinia_auth_v5');
      localStorage.removeItem('pinia_auth_v4');
      localStorage.removeItem('pinia_auth_v3');
      localStorage.removeItem('pinia_auth_v2'); // Also clean up the old one
      this.$reset();
      this.saveState();
      // SPA Bug fix: We no longer force reload. Vue reactivity will handle the UI updates.
      // A router redirect should ideally be handled at the component level.
    }
  }
});
