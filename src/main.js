import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';
import pinia from './store/index.js';

// Base style sheets
import './index.css';

// Base directive installations
import vTooltip from './directives/vTooltip.js';
import vAnimate from './directives/vAnimate.js';

// Base plugin installations
import i18n from './plugins/i18n.js';
import vueQuery from './plugins/vue-query.js';
import vueToast from './plugins/vue-toast.js';
import vueCharts from './plugins/vue-charts.js';

const app = createApp(App);

// Mount directives
app.directive('tooltip', vTooltip);
app.directive('animate', vAnimate);

// Mount core modules
app.use(pinia);
app.use(router);
app.use(i18n);
app.use(vueQuery);
app.use(vueToast);
app.use(vueCharts);

app.mount('#root');
