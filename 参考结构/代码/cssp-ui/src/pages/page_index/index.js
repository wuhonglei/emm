/**
 * 主页面入口文件
 */

import 'babel-polyfill';
import Vue from 'vue';
import App from './app.vue';

import store from './store';
import router from './router';

import 'normalize.css';
import 'src/common/assets/iconfont/iconfont.css';
import 'src/common/assets/css/global.css';
import 'src/common/assets/css/mod_log.css';
import 'src/common/assets/css/mod_table_search.css';
import 'src/common/assets/css/overwrite.css';
import 'src/common/assets/css/query.css';

import './sf_vue_config';
import './pear_config';
import 'src/utils/polyfill.js';
import initComponents from 'src/common/init/init_components';
import NavManager from 'src/common/lib/nav_manager';

initComponents(Vue); //初始化组件

Vue.config.productionTip = false;
Vue.use(NavManager, {
    source: router.options.routes,
    router
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
