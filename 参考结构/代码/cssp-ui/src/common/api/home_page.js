/**
 * @file 首頁相关接口
 */

import axios from './index';

export function getAssetLogCnt (isAutoAction = false) {
    return axios({
        url: '/api/home_page/',
        method: 'get',
        params: {
            action: 'get_asset_log_cnt',
            auto_action: isAutoAction ? 1 : 0
        }
    });
}

export function getAlarmTrend (isAutoAction = false) {
    return axios({
        url: '/api/home_page/',
        method: 'get',
        params: {
            action: 'get_alarm_trend',
            auto_action: isAutoAction ? 1 : 0
        }
    });
}

export function getLogTrend (isAutoAction = false) {
    return axios({
        url: '/api/home_page/',
        method: 'get',
        params: {
            action: 'get_asset_group_log_trend',
            auto_action: isAutoAction ? 1 : 0
        }
    });
}

/**
 * 获取资产的风险情况
 * @param {object} payload 参数
 * @param {array} [payload.level_list] 风险等级 lost,high,middle,low,info
 * @param {number} [payload.top] 获取的数目
 * @param {boolean} [isAutoAction] 是否是自动请求
 * @returns {Promise}
 */
export function getAssetRiskInfo (payload, isAutoAction = false) {
    return axios({
        url: '/api/home_page/',
        method: 'get',
        params: {
            action: 'get_major_asset_risk_info',
            auto_action: isAutoAction ? 1 : 0,
            params: JSON.stringify(payload)
        }
    });
}

export function getDiskInfo () {
    return axios({
        url: '/api/home_page/',
        method: 'get',
        params: {
            action: 'get_average_disk_usage'
        }
    });
}