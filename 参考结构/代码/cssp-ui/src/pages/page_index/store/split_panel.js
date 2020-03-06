/**
 * 可拖动panel组件 store 
 */

export default {
    namespaced: true,
    state: {
        status: 'init' // init: 初始状态，result：查询结果状态，coexistence：查询条件和查询结果共存
    },
    getters: {
        status: state => state.status
    },
    mutations: {
        init (state) {
            state.status = 'init';
        },
        queryed (state) {
            state.status = 'result';
        },
        reQuery (state) {
            state.status = 'coexistence';
        }
    }
};