// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App';
import router from './router/router.js';
import axios from 'axios';
import '../static/css/commen.css';
import VueClipboard from 'vue-clipboard2';
Vue.config.debug = true;
Vue.config.productionTip = false;
axios.defaults.withCredentials = true;
Vue.prototype.$ajax = axios;
Vue.use(ElementUI);
Vue.use(VueClipboard);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})