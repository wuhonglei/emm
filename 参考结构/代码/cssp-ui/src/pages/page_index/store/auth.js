/**
 * @file 权限相关模块
 */

let state = {
    permissionList: {},
    role: ''
};

let mutations = {
    setPermission (state, permissionList) {
        state.permissionList = permissionList;
    },
    setRole (state, role) {
        state.role = role;
    }
};

let getters = {
    permissionList: state => state.permissionList,
    role: state => state.role
};

export default {
    getters,
    state,
    mutations
};
