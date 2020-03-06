/**
 * @file 验证函数
 */

import PM from '../pm';
import prChecker from './pr_checker';
import store from 'src/pages/page_index/store';

let pm = new PM();

pm.registerChecker(({ to, travers = false }, context) => {
    let _route = to.meta && to.meta._permOptions ? 
        to : 
        prChecker.findRouteByRecord({name: to.name, path: to.path});

    let res = _route && (travers ? deepCheck(_route) : normalCheck(_route));

    if (!res) {
        return true;
    }

    if (!res.success) {
        context.next = res.next ? res.next : false;
        return false;
    }

    return true;
});

function normalCheck (route) {
    let res = prChecker.checkRouteRole(route);

    res = !res.success ? res : prChecker.checkRoutePerm(route);

    return res;
}

// 遍历子节点进行权限检查，并且验证redirect的权限
// 用于导航栏的构建
function deepCheck (route) {
    let res = prChecker.checkRouteRole(route, true);
    res = !res.success ? res : prChecker.checkRoutePerm(route, true);

    if (!res.success && route.children) {
        let deepRes;

        route.children.some(r => {
            deepRes = deepCheck(r);

            if (deepRes.success) {
                return true;
            }

            return false;
        });

        return {
            success: deepRes && deepRes.success,
            next: deepRes && deepRes.next
        };
    }

    return res;
} 

pm.registerChecker('nfs-running', () => {
    return store.getters.nfsIsMounting || store.getters.nfsIsUnloading;
});

pm.registerChecker('nfs-error', () => {
    return store.getters.nfsIsError || 
        store.getters.nfsMountFailed || 
        store.getters.nfsUnloadFaild;
});

pm.registerChecker('nfs-mount-error', () => {
    return store.getters.nfsIsError || 
        store.getters.nfsMountFailed;
});

pm.registerChecker('nfs-unmount-error', () => {
    return store.getters.nfsUnloadFaild;
});

export default pm;