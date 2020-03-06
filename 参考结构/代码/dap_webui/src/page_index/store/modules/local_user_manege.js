/**
 * 本地用户模块vuex
 */

export default {
    namespaced: true, // 所有模块的vuex必须的，可以隔绝作用域
    state: {
        localUserTree: {},
        localUserBackData: {}
    },
    getters: {
        localUserTree: state => state.localUserTree,
        localUserBackData: state => state.localUserBackData
    },
    mutations: { // 同步的方法
        setTreeData (state, payload) { // 设置选择的资源模块
            state.localUserTree = payload;
        },
        setLocalUserData (state, payload) { // 新增编辑用户界面， 点击新增跳转到别的页面，保存， 当前的数据
            state.localUserBackData = payload;
        }
    },

    // actions 是存在异步的情况下使用，没有这种情况就不要使用
    actions: {

    }
};
