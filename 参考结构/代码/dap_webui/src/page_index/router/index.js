/**
 * 路由模块
 * 
 * meta 信息说明
 * meta.name {string} 导航的中文显示名称，后端有时候也会传，如果传了到时候以后端为准
 * meta.dev {boolen} 标记开发模块，在路由展示的时候可能会用到
 * meta.showInNavigation {boolen} 一级导航可用 是否在顶部菜单中显示
 * meta.menu {string} 对应后端定义菜单的名字，动态菜单可用
 * meta.perm {string|array[string]} 模块权限信息（暂时没有）
 */

import Vue from 'vue';
import Router from 'vue-router';
import App from 'src/page_index/app.vue';

import log from './log';
import system from './system';


Vue.use(Router);

let router =  new Router({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'index',
            component: App,
            redirect: {
                name: 'log'
            }
        },
        log,
        system
    ]
});

router.beforeEach((to, from, next) => {
    if (!to.matched.length) { // 跳转404页面
        location.href = '/not_found.html';
        return;
    }
    next();
});


export default router;