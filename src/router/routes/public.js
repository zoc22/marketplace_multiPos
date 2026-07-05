export const publicRoutes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/public/Home.vue'),
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('@/pages/public/Products.vue'),
  },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: () => import('@/pages/public/ProductDetail.vue'),
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('@/pages/public/Categories.vue'),
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/pages/public/Search.vue'),
  },
  {
    path: '/suppliers',
    name: 'SupplierSearch',
    component: () => import('@/pages/public/SupplierSearch.vue'),
  },
  {
    path: '/store/:id',
    name: 'SupplierStorefront',
    component: () => import('@/pages/public/SupplierStorefront.vue'),
  },
  {
    path: '/store/external/:id',
    name: 'ExternalStorefrontPreview',
    component: () => import('@/pages/shared/ExternalStorefront.vue'),
    meta: { title: 'Site Vitrine Hors-ERP' }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/pages/public/Cart.vue'),
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/pages/public/Checkout.vue'),
  },
  {
    path: '/wishlist',
    name: 'PublicWishlist',
    component: () => import('@/pages/public/Wishlist.vue'),
  },
  {
    path: '/order-success',
    name: 'OrderSuccess',
    component: () => import('@/pages/public/OrderSuccess.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/pages/public/About.vue'),
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/pages/public/Contact.vue'),
  }
];

export default publicRoutes;
