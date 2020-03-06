/**
 * 
 */

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import resourceManage from './modules/resource_manage';
import localUserManage from './modules/local_user_manege';

function filterData (item, state) {
    if (!item) { // undefined
        return [];
    }
    let arrItem = item;
    state.addRoleData.push(arrItem);
    return state.addRoleData;
    
}

export default new Vuex.Store({
    state: {
        addTrustData: [],
        addRoleData: [],
        addAuthData: []
    },
    getters: {
        addTrustData: state => state.addTrustData,
        addRoleData: state => state.addRoleData,
        addAuthData: state => state.addAuthData
    },
    mutations: {
        setTrustData (state, payload) {
            state.addTrustData = filterData(payload);
        },
        setRoleData (state, payload) {
            state.addRoleData = filterData(payload, state);
        },
        setAuthData (state, payload) {
            state.addAuthData = filterData(payload);
        }
        
    },

    actions: {

    },

    modules: {
        resourceManage,
        localUserManage
    },

    plugins: []
});
