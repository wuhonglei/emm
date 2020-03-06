/**
 * 管理模块部分请求
 */

import axios from './index';


/**
 * 更新日志备份设置
 *
 * @returns {object} res.data.data
 * @returns {object} res.data.data.back_policy - 自动备份相关设置
 * @returns {string} res.data.data.back_policy.time - 自动备份每天中的时间点
 * @returns {number} res.data.data.back_policy.week - 在周几备份，0：每天，1：星期一
 * @returns {object} res.data.data.ftp_param - ftp备份相关设置
 * @returns {string} res.data.data.ftp_param.dir - ftp 目录
 * @returns {string} res.data.data.ftp_param.ip - ftp ip
 * @returns {string} res.data.data.ftp_param.pwd - ftp 密码
 * @returns {string} res.data.data.ftp_param.user - ftp 用户名
 */
export function loadBackupConfig () {
    return axios({
        url: '/api/system_manage/',
        method: 'get',
        params: {
            action: 'list_back_info'
        }
    });
}

/**
 * 更新日志备份设置
 * 
 * @param {object} payload
 * @param {object} payload.back_policy - 自动备份相关设置
 * @param {string} payload.back_policy.time - 自动备份每天中的时间点
 * @param {number} payload.back_policy.week - 在周几备份，0：每天，1：星期一
 * @param {object} payload.ftp_param - ftp备份相关设置
 * @param {string} payload.ftp_param.dir - ftp 目录
 * @param {string} payload.ftp_param.ip - ftp ip
 * @param {string} payload.ftp_param.pwd - ftp 密码
 * @param {string} payload.ftp_param.user - ftp 用户名
 * @returns {function}
 */
export function updateBackupConfig (payload) {
    return axios({
        url: '/api/system_manage/',
        method: 'post',
        data: {
            action: 'upd_back_info',
            params: JSON.stringify(payload)
        }
    });
}


/**
 * 测试FTP连通性
 *
 * @param {object} payload
 * @param {object} payload.ftp_param - ftp备份相关设置
 * @param {string} payload.ftp_param.dir - ftp 目录
 * @param {string} payload.ftp_param.ip - ftp ip
 * @param {string} payload.ftp_param.pwd - ftp 密码
 * @returns {function}
 */
export function testFtp (payload) {
    return axios({
        url: '/api/system_manage/',
        method: 'post',
        data: {
            action: 'test_ftp_network',
            params: JSON.stringify(payload)
        }
    });
}

/**
 * 立即备份
 *
 * @returns {function}
 */
export function immediateBackup () {
    return axios({
        url: '/api/system_manage/',
        method: 'post',
        data: {
            action: 'immediate_back'
        }
    });
}

/**
 * 操作日志数据
 *
 * @param {object} payload
 * @returns {function}
 */
export function loadOperationLog (payload) {
    return axios({
        url: '/api/operation_log/',
        method: 'get',
        params: {
            action: 'operate_log__list',
            params: JSON.stringify(payload)
        }
    });
}

/**
 * 加载日志恢复记录
 * 
 * @param {object} payload 
 * @returns {function}
 */
export function loadRecoverData (payload) {
    return axios({
        url: '/api/system_manage/',
        method: 'get',
        params: {
            action: 'list_recover_info',
            params: JSON.stringify(payload)
        }
    });
}

/**
 * 开始恢复日志
 * 
 * @param {object} payload 
 * @returns {function}
 */
export function recoverLog (payload) {
    return axios({
        url: '/api/system_manage/',
        method: 'post',
        data: {
            action: 'recover_log',
            params: JSON.stringify(payload)
        }
    });
}

/**
 * 获取恢复状态
 * @param {Object} payload 
 * @returns {function}
 */
export function loadRecoverStatus (payload) {
    return axios({
        url: '/api/system_manage/',
        method: 'get',
        params: {
            action: 'list_recover_task_info',
            params: JSON.stringify(payload)
        }
    });
}


/**
 * 获取设置提示信息已读的状态
 * @returns {function}
 */
export function getSettingsHintReadStatus () {
    return axios({
        url: '/api/system_manage/',
        method: 'get',
        params: {
            action: 'get_settings_hint_read_status'
        }
    });
}

/**
 * 设置设置提示信息已读的状态
 * @returns {function}
 */
export function setSettingsHintReadStatus () {
    return axios({
        url: '/api/system_manage/',
        method: 'post',
        data: {
            action: 'set_settings_hint_read_status'
        }
    });
}