/**
 * @file 树相关算法
 */

// 遍历树
export function traverse (routes, fn = () => {}, parentNode = null) {
    routes.forEach(route => {
        fn(route, parentNode);
        if (route.children) {
            traverse(route.children, fn, route);
        }
    });
}

// 遍历树并返回一个map树
export function treeMap (routes, fn = () => {}, parentNode = null, mappedParent = null) {
    return routes.map(route => {
        let res = fn(route, parentNode, mappedParent);
        if (res && route.children) {
            res.children = treeMap(route.children, fn, route, res);
        }
        return res;
    }).filter(route => !!route);
}

// 在路由节点树中查找符合 fn 验证函数的第一个节点（深度优先遍历）
export function treeFind (routes, fn = () => true) {
    let record = null;
    routes.some(route => {
        if (fn(route)) {
            record = route;
            return true;
        }
        if (route.children) {
            record = treeFind(route.children, fn);
            return !!record;
        }
        return false;
    });

    return record;
}

export function cachedTreeFind (routes, cache, cacheKey, fn = () => true) {
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
    }

    let res = treeFind(routes, fn);
    cache.set(cacheKey, res);

    return res;
}