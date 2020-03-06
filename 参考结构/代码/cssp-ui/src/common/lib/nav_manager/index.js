/**
 * @file 入口
 */

import * as constants from './util/const';
import initControl from './lib/nav_control_vue';
import NavStorage from './lib/nav_storage';
import buildNav from './lib/nav_builder';

import assert from './util/assert';

export default {

    // 将常量传到外面方便使用
    constants,
    
    /**
     * Vue 插件 install
     * @param {Vue} Vue
     * @param {object} options
     * @param {string} [options.buildType] 导航构建类型（根据配置文件还是路由，建议从常量中获取）
     * @param {string} [options.searchMethod] 导航的搜索方法（根据名称还是路径搜索，建议从常量中获取）
     * @param {VueRouter} router Vue Router
     * @param {array|object} source 导航构建来源（传入配置文件或者路由）
     */
    install (Vue, options = {}) {
        assert(options.source, 'source is undefined');
        assert(options.router, 'router is undefined');
        options.buildType = options.buildType || constants.NAV_BUILD_TYPE_ROUTES;

        let navList;
        if (options.buildType === constants.NAV_BUILD_TYPE_CONFIG) {
            navList = buildNav(options.source, constants.NAV_BUILD_TYPE_CONFIG);
        } else if (options.buildType === constants.NAV_BUILD_TYPE_ROUTES) {
            navList = buildNav(options.source, constants.NAV_BUILD_TYPE_ROUTES);
        } else {
            assert.fail('buildType is undefined');
        }

        let storage = new NavStorage(navList);
        initControl(storage, Vue, options.router, { searchMethod: options.searchMethod });
    }
};

export * from './util/tree';
export * from './util/const';