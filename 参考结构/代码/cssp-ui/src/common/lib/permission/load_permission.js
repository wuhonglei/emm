/**
 * @file 加载权限
 */

import { stopWaitting, clearReady } from 'src/utils/wait_until';
import { loadPermission } from 'src/common/api/auth';
import { PERMISSION_LOADING_WAITTING_ID } from 'src/utils/consts';
import prChecker from './pr_checker';

let permissionLoaded = false;

export async function initPermissions () {

    // 如果已经加载过权限则不重复加载
    if (permissionLoaded) {
        return;
    }

    try {
        let res = await loadPermission();
        let data = res && res.data && res.data.data;

        //检查参数是否正确
        if (!data || !data.permission
        ) {
            throw new Error();
        }

        prChecker.setPermissions(data.permission); // 将权限保存在store中
        prChecker.setRole(data.role); // 将角色保存在store中
        stopWaitting(PERMISSION_LOADING_WAITTING_ID); // 等待结束
        permissionLoaded = true;
    } catch (err) {
        stopWaitting(PERMISSION_LOADING_WAITTING_ID); // 等待结束
        clearReady(PERMISSION_LOADING_WAITTING_ID); // 获取失败则重置该过程的ready状态
    }
}

export function resetPermissionReady () {
    permissionLoaded = false;
}