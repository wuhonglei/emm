/**
 * @file Vue 导航控制
 */

import assert from '../util/assert';
import {
    SEARCH_METHOD_N,
    SEARCH_METHOD_P,
    SEARCH_METHOD_NP
} from '../util/const';

const OBSERVABLE_SUPROTED_VERSION = 2.6;

export default function initControl (storage, Vue, router, options = {
    searchMethod: SEARCH_METHOD_NP
}) {
    assert(Vue, 'Vue is undefined');
    assert(router, 'router is undefined');

    options.searchMethod = options.searchMethod || SEARCH_METHOD_NP;

    // 将导航Storage以及导航状态对象挂载到Vue原型上
    Vue.prototype.$navStorage = storage;
    Vue.prototype.$navState = storage.state;

    // Vue 2.6.0版本及以上则将导航状态对象设置为一个响应式对象，方便数据绑定
    if (getVueVersion(Vue) >= OBSERVABLE_SUPROTED_VERSION) {
        storage.state = Vue.observable(storage.state);
    }

    // 绑定导航更新钩子
    router.afterEach(to => {
        storage.clearActive();
        to.matched.forEach(route => {
            storage.addActive(getSearchParams(options.searchMethod, route));
        });
    });
}

function getSearchParams (method, route) {
    if (method === SEARCH_METHOD_NP) {
        return {
            name: route.name,
            path: route.path
        };
    }

    if (method === SEARCH_METHOD_N) {
        return { name: route.name };
    }

    if (method === SEARCH_METHOD_P) {
        return { path: route.path };
    }

    return {};
}

function getVueVersion (Vue) {
    return parseFloat(Vue.version);
}