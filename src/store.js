import { defineStore } from 'pinia';

export const useAppStore = defineStore('appStore', {
  state: () => ({
    counter: 0,
    logs: [
      { time: '11:45:10', msg: 'Core control systems initialized.', isEvent: true },
      { time: '11:45:11', msg: 'Pinia state engine connected to persistent space.', isEvent: false }
    ]
  }),
  actions: {
    increment() {
      this.counter++;
      this.addLog('State mutated: transaction counter incremented.');
    },
    resetCounter() {
      this.counter = 0;
      this.addLog('State reset: active transactions purged.');
    },
    addLog(msg, isEvent = false, isError = false) {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      this.logs.push({ time: timeStr, msg, isEvent, isError });
    }
  },
  persist: true
});
