import { defineStore } from 'pinia';
import { deliveries } from '@/utils/seed_data.js';

export const useLogisticsStore = defineStore('logistics', {
  state: () => ({
    deliveries: [...deliveries],
    carriers: [
      { id: "c_1", name: "Camrail Fret Express", serviceType: "Rail Cargo", coverage: "Douala - Yaoundé - Ngaoundéré" },
      { id: "c_2", name: "Soletrans Douala Port", serviceType: "Road Heavy Duty", coverage: "National & CEMAC Corridor" },
      { id: "c_3", name: "Guaranty Cargo", serviceType: "Express Van", coverage: "Urban Inter-City" },
      { id: "c_4", name: "Mory Cam Cargo", serviceType: "Multimodal Logistics", coverage: "Africa Hub" }
    ],
  }),
  actions: {
    setDeliveries(deliveries) {
      this.deliveries = deliveries;
    }
  }
});
