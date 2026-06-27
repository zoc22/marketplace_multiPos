export const authRoutes = [
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('@/pages/auth/Login.vue'),
  },
  {
    path: '/auth/register',
    name: 'Register',
    component: () => import('@/pages/auth/Register.vue'),
  },
  {
    path: '/auth/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/pages/auth/ForgotPassword.vue'),
  },
  {
    path: '/auth/reset-password',
    name: 'ResetPassword',
    component: () => import('@/pages/auth/ResetPassword.vue'),
  },
  {
    path: '/auth/verify-email',
    name: 'VerifyEmail',
    component: () => import('@/pages/auth/VerifyEmail.vue'),
  },
  {
    path: '/auth/two-factor',
    name: 'TwoFactor',
    component: () => import('@/pages/auth/TwoFactor.vue'),
  }
];

export default authRoutes;
