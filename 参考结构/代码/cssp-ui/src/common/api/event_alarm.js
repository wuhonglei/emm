/** 
 * 告警事件api
 */

import axios from './index';

const URL = '/api/event_alarm/';

/**
 * 获取告警事件的列表
 * 
 * @param {object} payload
 * @param {string} payload.page - 页数
 * @param {string} payload.num_per_page - 每一页多少条数据
 * @param {string} payload.start_time - 开始时间
 * @param {string} payload.end_time - 结束时间
 * @param {string} payload.level - 严重等级，全选时值为None
 * @param {string} payload.search_str - 搜索框内容
 * @returns {object} data- 告警事件的列表内容 
 */
export function getAllAlarmEvent (payload) {
    return axios({
        url: URL,
        method: 'get',
        params: {
            action: 'alarm_event_search',
            params: JSON.stringify(payload)
        }
    });
};


/**
 * 处理告警事件
 * 
 * @param {object} payload
 * @param {string} payload.event_ids - 事件id列表
 * @param {string} payload.deal_status - 处理状态
 * @returns {object} data- 处理告警事件内容 
 */
export function handleEvents (payload) {
    return axios({
        url: URL,
        method: 'post',
        data: {
            action: 'handle_events',
            params: JSON.stringify(payload)
        }
    });
};
