/**
 * 路由入口文件
 */

import Vue from 'vue';
import Router from 'vue-router';
import index from 'src/pages/page_index/index.vue';

import logQuery from './log_query';
import assetCenter from './asset_center';
import sysCenter from './system_center';

import permissionGuard from 'src/common/lib/permission/middlewares';
import prChecker from 'src/common/lib/permission/pr_checker';

Vue.use(Router);

const ROUTER = new Router({
    routes: [{
        path: '/',
        name: 'index',
        component: index,
        redirect: {
            name: 'homePage'
        },
        meta: {
            navOptions: {
                name: 'root',
                text: '日志审计'
            }
        },
        children: [{
            path: 'home',
            name: 'homePage',
            meta: {
                navOptions: {
                    text: '首页',
                    icon: 'overview'
                }
            },
            component: () =>
                import(/* webpackChunkName: "homePage" */ 'src/view/mod_home_page')
        }, {
            path: 'emergency_evt',
            name: 'emergencyEvt',
            meta: {
                navOptions: {
                    text: '告警',
                    icon: 'alarm-log'
                }
            },
            component: () =>
                import(/* webpackChunkName: "emergencyEvt" */ 'src/view/mod_alarm_event')
        }, {
            path: 'audit_strategy',
            name: 'auditStrategy',
            meta: {
                navOptions: {
                    text: '策略',
                    icon: 'secure-strategy'
                }
            },
            component: () =>
                import(/* webpackChunkName: "auditStrategy" */ 'src/view/mod_audit_strategy')
        },
        assetCenter,
        logQuery, {
            path: 'report',
            name: 'report',
            meta: {
                navOptions: {
                    text: '报表',
                    icon: 'events'
                }
            },
            component: () =>
                import(/* webpackChunkName: "report" */ 'src/view/mod_report')
        },
        sysCenter]
    }]
});

permissionGuard.insertMiddleware(async (ctx, next) => {
    if (!prChecker.routesInited) {
        prChecker.loadRoutes(ROUTER.options.routes);
    }
    await next();
});

ROUTER.beforeEach(permissionGuard.createGuard());

ROUTER.afterEach((to, from) => {

    // 重置splitpanel状态
    ROUTER.app.$store.commit('splitPanel/init');

    let product = null;
    let fromCacheProduct = getNeedCacheProduct(from);
    let toCacheProduct = getNeedCacheProduct(to);
    
    if (fromCacheProduct &&
        toCacheProduct &&
        fromCacheProduct.name === toCacheProduct.name) {
        product = fromCacheProduct;
    }

    // 重置query 状态
    ROUTER.app.$store.commit('query/clear', product && product.meta.cacheDetail);
});

/**
 * 获取路由守卫中，to, from中需要缓存的路由
 *
 * @param {object} router v-router 路由对象 to or from
 * @returns {string|boolean}
 */
function getNeedCacheProduct (router) {
    let needCachehRoute = router.matched.filter(route => route.meta.cacheParamsAndLoadedData);
    return needCachehRoute && needCachehRoute.length && needCachehRoute[0];
}

export default ROUTER;