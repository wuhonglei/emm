/**
 * vuex 根文件
 */

import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import splitPanel from './split_panel';
import query from './query';
import auth from './auth';
import homePage from './home_page';
import nfs from './nfs';

Vue.use(Vuex);

let vuexLocal = new VuexPersistence();
export default new Vuex.Store({
    state: {
        username: 'admin'
    },
    mutations: {

    },
    actions: {

    },
    modules: {
        splitPanel,
        query,
        auth,
        homePage,
        nfs
    },
    plugins: [vuexLocal.plugin]
});
