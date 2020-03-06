/**
 * 资源管理模块vuex
 */

export default {
    namespaced: true, // 所有模块的vuex必须的，可以隔绝作用域
    state: {
        group: {},
        l3vpn: {},
        web: {},
        resourceTree: {}
    },
    getters: {
        group: state => state.group,
        l3vpn: state => state.l3vpn,
        web: state => state.web,
        resourceTree: state => state.resourceTree
    },
    mutations: { // 同步的方法
        editGroup (state, payload) {

            // 把需要编辑的用户组信息放在state上面，让编辑的组件使用
            state.group = payload;
        },
        editL3vpn (state, payload) {

            // 把需要编辑的l3vpn信息放在state上面，让编辑的组件使用
            state.l3vpn = payload;
        },
        editWeb (state, payload) {

            // 把需要编辑的web信息放在state上面，让编辑的组件使用
            state.web = payload;
        },
        setTreeData (state, payload) { // 设置选择的资源模块
            state.resourceTree = payload;
        }
    },

    // actions 是存在异步的情况下使用，没有这种情况就不要使用
    actions: {

    }
};
