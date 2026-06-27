import { defineStore } from 'pinia';

export const useReportsStore = defineStore('reports', {
  state: () => ({
    analyticsData: null,
  }),
  actions: {
    setAnalytics(data) {
      this.analyticsData = data;
    }
  }
});
