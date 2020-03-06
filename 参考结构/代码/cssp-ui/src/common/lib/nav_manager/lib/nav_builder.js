/**
 * @file 导航构造
 */

import assert from '../util/assert';
import { treeMap } from '../util/tree';
import { NAV_BUILD_TYPE_CONFIG, NAV_BUILD_TYPE_ROUTES } from '../util/const';

/**
 * 构建导航
 * @param {object} source 导航构建来源
 * @param {string} type 根据配置文件构建还是根据路由构建
 * @return {array} 导航列表
 */
export default function buildNav (source, type = NAV_BUILD_TYPE_ROUTES) {
    if (type === NAV_BUILD_TYPE_ROUTES) {
        return buildNavFromRoutes(source);
    }

    if (type === NAV_BUILD_TYPE_CONFIG) {
        return buildNavFromConfig(source);
    }

    assert.fail('invalid nav build type');
};

// 根据配置文件构建导航
function buildNavFromConfig (config) {
    assert(config, 'config is undefined');
    assert.type(config, 'object', 'config must be an plain object');

    let res = [];
    let readySet = new Set(); // 标识是否不是第一层节点
    let configKeys = Object.keys(config);

    // 先遍历一遍来记录哪些导航不是一级导航
    configKeys.forEach(key => {
        assert(config[key], 'array', 'nav configuration item must be an array');
        config[key].forEach(nav => {
            nav.active = !!nav.active;
            if (nav.sub) {
                readySet.add(nav.sub);
            }
        });
    });

    configKeys.forEach(key => {
        let current = config[key];

        // 如果是一级导航则构建出一级导航并插入到结果中
        !readySet.has(key) && 
        res.push({
            navName: key,
            children: current
        });

        // 遍历导航列表，设置子导航
        current.forEach(nav => {
            if (nav.sub && config[nav.sub]) {
                nav.children = config[nav.sub];
                nav.navName = nav.sub;
            }
        });
    });

    return res;
}

// 根据路由构建导航
function buildNavFromRoutes (routes) {
    assert(routes, 'make sure you have set routes configuration');
    assert.type(routes, 'array', 'routes must be an array');

    // 遍历路由节点生成导航树
    let list = treeMap(routes, (route, parent, mappedParent) => {
        let parentPath = mappedParent ? mappedParent.path : '';
        let res = {
            path: normalizePath(parentPath + '/' + route.path),
            name: route.name,
            active: false // 标识是否在激活状态
        };
        let options = route.meta && route.meta.navOptions || {};
        options.name && (res.navName = options.name);

        res = Object.assign(options, res);

        // options里面如果设置的hide为true则将该路径从导航树中去除
        return !options.hide && res;
    });

    return list;
}

function normalizePath (path) {
    let res = path;
    res = res.replace(/\/+/, '/');
    if (res.length > 1) {
        res = res.replace(/\/$/, '');
    }
    return res;
}