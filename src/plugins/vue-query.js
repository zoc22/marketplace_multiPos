import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default {
  install(app) {
    app.use(VueQueryPlugin, { queryClient });
  },
};
