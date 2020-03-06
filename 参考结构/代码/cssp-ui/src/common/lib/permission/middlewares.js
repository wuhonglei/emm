/**
 * @file 洋葱路由守卫中间件
 */

import OnionRouterGuard from '../onion_router_guard';
import { initPermissions } from './load_permission';
import checker from './checkers';
import { wait } from 'src/utils/wait_until';
import { APP_MOUNTED_WAITTING_ID } from 'src/utils/consts';
import store from 'src/pages/page_index/store';
import Vue from 'vue';


let nfsErrWinVisible = false;
async function _showNFSErrorWin () {
    await wait(APP_MOUNTED_WAITTING_ID);
    
    let h = new Vue().$createElement;
    let lineStyle = {
        'line-height': '24px'
    };
    let msg = [
        h(
            'p', 
            { style: lineStyle }, 
            (await checker.check('nfs-mount-error')).success ? 
                _('请先处理挂载失败的问题') : 
                _('请先处理卸载失败的问题')
        ),
        h('p', { style: lineStyle }, store.getters.nfsErrMsg)
    ];

    // 避免弹出多个框
    if (nfsErrWinVisible) {
        return;
    }

    nfsErrWinVisible = true;
    Vue.prototype.$confirm(msg, { 
        type: 'warning',
        title: _('错误'),
        showCancelButton: false, 
        callback: () => {
            nfsErrWinVisible = false;
        } 
    });
}

let guard = new OnionRouterGuard();

guard.registerMiddleware(async (ctx, next) => {

    // 日志恢复页面正在上传文件时不允许切页面
    if (JSON.parse(sessionStorage.getItem('isUploadingFile')) &&
        ctx.from.name === 'manageRecover' &&
        ctx.to.name !== 'manageRecover') {
        ctx.next = null;
        return;
    }
    await next();
});

guard.registerMiddleware(async (ctx, next) => {
    
    // NFS挂载失败时不允许跳转到除NFS之外的页面
    if (
        (await checker.check('nfs-error')).success &&
        ctx.to.name !== 'sysCenterExternStorage'
    ) {
        ctx.next = ctx.from.name === 'sysCenterExternStorage' ? 
            null : { name: 'sysCenterExternStorage' };
        _showNFSErrorWin();
        return;
    }

    await next();
});

guard.registerMiddleware(async (ctx, next) => {
    await initPermissions();
    await next();
});

guard.registerMiddleware(async (ctx, next) => {
    let checkResult = await checker.check({ to: ctx.to, from: ctx.from });
    if (checkResult.success) {
        await next();
        return;
    }

    ctx.next = checkResult.next;
});

export default guard;