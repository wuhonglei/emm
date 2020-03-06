/**
 * 报表模块接口
 */

import axios from './index';

const URL = '/api/report/';

/**
 * 获取报表列表数据 
 * @param {object} payload
 * @returns {object} 
 */
export function getReportList (payload) {
    return axios({
        url: URL,
        method: 'get',
        params: {
            action: 'get_report_list',
            params: JSON.stringify(payload)
        }
    });
}

/**
 * 获取报表列表查询的条件数据
 * @returns {object} 
 */
export function getReportFilterCriteria () {
    return axios({
        url: URL,
        method: 'get',
        params: {
            action: 'get_report_filtercriteria'
        }
    });
}

/**
 * 删除报表
 * 
 * @param {object} payload 
 * @returns {object}
 */
export function deleteReportFile (payload) {
    return axios({
        url: URL,
        method: 'post',
        data: {
            action: 'del_report_file',
            params: JSON.stringify(payload)
        }
    });
}

/**
 * 下载报表
 * 
 * @param {object} payload 
 * @returns {object}
 */
export function exportReportFile (payload) {
    return axios({
        url: URL,
        method: 'post',
        data: {
            action: 'export_report_file',
            params: JSON.stringify(payload)
        }
    });
}

/**
 * 获取报表设置列表数据 
 * @param {object} payload
 * @returns {object} 
 */
export function getReportConfList (payload) {
    return axios({
        url: URL,
        method: 'get',
        params: {
            action: 'get_reportconf_list',
            params: JSON.stringify(payload)
        }
    });
}

/**
 * 报表设置 
 * @param {object} payload
 * @returns {object} 
 */
export function setReportConfList (payload) {
    return axios({
        url: URL,
        method: 'post',
        data: {
            action: 'set_reportconf_list',
            params: JSON.stringify(payload)
        }
    });
}