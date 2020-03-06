/**
 * 主页面入口文件
 */

import 'babel-polyfill';
import Vue from 'vue';
import App from './app.vue';

import focusDerective from 'src/derective/auth';

import store from './store';
import router from './router';
import tips from './mixins/tips';

import vueComponent from '@sxf/sf-vue-component';
import validator from '@sxf/pineapple/dist/sf_vue.esm';
import '@sxf/sf-vue-component/dist/theme/default.css';

import 'src/components/svg';

import 'normalize.css';
import 'src/style/var.css';
import 'src/style/global.css';
import 'src/style/overwrite.css';
import 'src/style/iconfont/iconfont.css';

import { getAllNav } from 'src/api/base';
import { navDataFormat, initInterface } from 'src/utils/module_init';
import utils from 'src/utils/utils_data';
import 'src/utils/api_compatible';
Vue.mixin(tips);

Vue.use(focusDerective);
Vue.use(vueComponent, {
    pineapple: {
        validator
    }
});
Vue.config.productionTip = false;
(async function () {
    utils.setSchema(initInterface()); // 预先加载一次，保障接口运行

    await getAllNav().then(res => {
        let {navObj, navData} = navDataFormat(res.data.data.data || []);
        utils.setNav(navData);
        utils.setNavObj(navObj);
    });
    
    new Vue({
        router,
        store,
        render: h => h(App)
    }).$mount('#app');
    
})();