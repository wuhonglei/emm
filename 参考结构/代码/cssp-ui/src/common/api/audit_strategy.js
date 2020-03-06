/** 
 * 审计策略api
 */

import axios from './index';

const URL = '/api/log_audit/';

/**
 * 获取审计策略的列表
 * 
 * @param {object} payload
 * @param {string} payload.page - 页数
 * @param {string} payload.num_per_page - 每一页多少条数据
 * @returns {object} data- 审计策略的列表内容 
 */
export function getAllAuditStrategy (payload) {
    return axios({
        url: URL,
        method: 'get',
        params: {
            action: 'get_audit_strategy',
            params: JSON.stringify(payload)
        }
    });
};


/**
 * 启用禁用审计策略
 * 
 * @param {object} payload
 * @param {string} payload.audit_types - 审计策略列表
 * @param {string} payload.op - 启用：enable，禁用：disable
 * @returns {object} data- 启用禁用审计策略内容 
 */
export function setAuditStrategy (payload) {
    return axios({
        url: URL,
        method: 'post',
        data: {
            action: 'set_audit_strategy',
            params: JSON.stringify(payload)
        }
    });
};
