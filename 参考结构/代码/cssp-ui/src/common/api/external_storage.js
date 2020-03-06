/**
 * @file nfs 外置存储相关接口
 */

import axios from './index';

// 获取NFS状态
export function getNFSStatus () {
    return axios({
        url: '/api/system_manage/',
        method: 'get',
        params: {
            action: 'get_nfs_status',
            auto_action: 1
        }
    });
}

/**
 * 挂载NSF
 * @param {object} [payload] 请求参数
 * @param {string} [payload.ip] 挂载的外置存储的IP
 * @param {stirng} [payload.path] 挂载的外置存储的路径
 * @returns {Promise}
 */
export function mountNFS (payload) {
    return axios({
        url: '/api/system_manage/',
        method: 'post',
        data: {
            action: 'install_nfs',
            params: JSON.stringify(payload)
        }
    });
}

// 卸载NFS
export function unloadNFS () {
    return axios({
        url: '/api/system_manage/',
        method: 'post',
        data: {
            action: 'uninstall_nfs'
        }
    });
}