/**
 * @file 路由权限管理工具
 */

import PermissionRoleChecker from '../permission_role_checker';
import store from 'src/pages/page_index/store';
import config from './config';

export default new PermissionRoleChecker({
    store: {
        getPermission () {
            return store.getters.permissionList;
        },
        setPermission (permission) {
            store.commit('setPermission', permission);
        },
        getRole () {
            return store.getters.role;
        },
        setRole (role) {
            role = 'admin';
            store.commit('setRole', role);
        }
    },
    config
});