/**
 * 登录界面入口文件
 */

import Vue from 'vue';
import App from './index.vue';
import ga from 'src/utils/ga';

import 'normalize.css';

ga('GTM-PKVB73V');

Vue.config.productionTip = false;

new Vue({
    render: h => h(App)
}).$mount('#app');
