/**
 * log模块接口文件
 */

import axios from './index';
import { normalizeParams } from 'src/utils/api_help.js';

/**
 * 快速查询cgi接口，在进入日志检索页面时发起
 * @param {null} 无
 * @return {null} 无
 */
export function enableFastLog () {
    return axios({
        url: '/api/log_search/',
        method: 'get',
        params: {
            action: 'fast_log'
        } 
    });
};

/**
 * 日志查询接口
 * @param {object} payload 
 * @param {object} payload.control_para 控制参数
 * @param {object} payload.sort_para    查询参数
 * @returns {object} res.data.data
 * @returns {number} res.data.data.num  数据条数    
 * @returns {array} res.data.data.data  所有数据
 */
export function loadLog (payload) {
    return axios({
        url: '/api/log_search/',
        method: 'post',
        data: {
            action: 'log_search',
            params: JSON.stringify(payload)
        }
    });
};

/**
 * 日志分页查询接口
 * @param {object} payload 
 * @param {object} payload.control_para 控制参数
 * @param {object} payload.sort_para    查询参数
 * @returns {object} res.data.data
 * @returns {number} res.data.data.num  数据条数    
 * @returns {array} res.data.data.data  当页数据
 */
export function loadPage (payload) {
    return axios({
        url: '/api/log_search/',
        method: 'post',
        data: {
            action: 'turn_search',
            params: JSON.stringify(payload)
        }
    });
};

/**
 * 日志导出接口
 * @param {object} payload 
 * @param {object} payload.control_para 控制参数
 * @param {object} payload.sort_para    查询参数
 * @returns {object} res.data.data  
 * @returns {number} res.data.data.num  数据条数
 * @returns {string} res.data.data.data 文件名
 */
export function loadExport (payload) {
    return axios({
        url: '/api/log_search/',
        method: 'post',
        data: {
            action: 'export_search',
            params: JSON.stringify(payload)
        }
    });
};

/**
 * 下拉框查询接口
 * @param {object} payload 
 * @param {object} payload.sort_para
 * @param {string} payload.sort_para.uuid    数据源
 * @param {string} payload.sort_para.name    查询的列表名
 * @returns {array} res.data.data            查询结果列表   
 * @returns {object} res.data.data[n]       
 * @returns {string} res.data.data[n].id    
 * @returns {string} res.data.data[n].name   项名称，查询日志时应传递name值
 */
export function loadList (payload) {
    return axios({
        url: '/api/log_search/',
        method: 'get',
        params: {
            action: 'box_search',
            params: JSON.stringify(payload)
        }
    });
}

/**
 * uuid查询
 * @param {object} payload
 * @param {object} sort_para
 * @param {string} sort_para.product    产品名
 * @returns {array} res.data.data  
 */
export function loadUuid (payload) {
    return axios({
        url: '/api/log_search/',
        method: 'get',
        params: {
            action: 'uuid_search',
            params: JSON.stringify(payload)
        }
    });
}

/**
 * uuid查询
 * @returns {array} res.data.data  
 */
export function loadAllUuid () {
    return axios({
        url: '/api/log_search/',
        method: 'get',
        params: {
            action: 'get_all_uuid'
        }
    });
}

/**
 * 获取日志设置
 * 
 * @returns {object} res.data 
 * @returns {object} res.data.log_del - 日志删除设置
 * @returns {number} res.data.log_del.days - 日志删除设置，过期days自动删除
 * @returns {number} res.data.log_del.max_days - 日志删除设置，最大过期天数
 * @returns {number} res.data.log_del.min_days - 日志删除设置，最小过期天数
 * @returns {number} res.data.log_del.min_days - 日志删除设置，最小过期天数
 * @returns {number} res.data.log_del.ratio - 日志删除设置，超过ratio比例自动删除
 * @returns {number} res.data.log_del.min_ratio - 日志删除设置，最小过期比例
 * @returns {number} res.data.log_del.max_ratio - 日志删除设置，最大过期比例
 * @returns {object} res.data.log_export - 日志导出设置
 * @returns {number} res.data.log_export.default_max_sum - 最大设置的条数
 * @returns {number} res.data.log_export.max_sum - 最大导出条数
 * @returns {object} res.data.part_info - 当前磁盘信息
 * @returns {number} res.data.part_info.all - 当前磁盘信息，磁盘总大小，单位G
 * @returns {number} res.data.part_info.used_proport - 当前磁盘信息，磁盘已使用大小，单位G
 * @returns {number} res.data.part_info.used - 当前磁盘信息，磁盘已使用百分比
 */
export function loadLogConfig () {
    return axios({
        url: '/api/system_manage/',
        method: 'get',
        params: {
            action: 'list_log_set'
        }
    });
}

/**
 * 更新日志设置
 * 
 * @param {object} payload
 * @param {object} payload.log_del - 日志删除设置
 * @param {number} payload.log_del.days - 日志删除设置，过期days自动删除
 * @param {number} payload.log_del.max_days - 日志删除设置，最大过期天数
 * @param {number} payload.log_del.min_days - 日志删除设置，最小过期天数
 * @param {number} payload.log_del.min_days - 日志删除设置，最小过期天数
 * @param {number} payload.log_del.ratio - 日志删除设置，超过ratio比例自动删除
 * @param {number} payload.log_del.min_ratio - 日志删除设置，最小过期比例
 * @param {number} payload.log_del.max_ratio - 日志删除设置，最大过期比例
 * @param {object} payload.log_export - 日志导出设置
 * @param {number} payload.log_export.default_max_sum - 最大设置的条数
 * @param {number} payload.log_export.max_sum - 最大导出条数
 * @returns {function}
 */
export function updateLogConfig (payload) {
    return axios({
        url: '/api/system_manage/',
        method: 'post',
        data: {
            action: 'upd_log_set',
            params: JSON.stringify(payload)
        } 
    });
}


/**
 * 上面导出的接口都需要在sort_para中提供产品名(product)、模块名(type);
 * 以下接口除了sort_para中的product、type字段外，提供的参数相同
 */

//  af模块
export let loadAfUuid = normalizeParams(loadUuid, 'af');

//  af/waf
export let loadAfWafLog = normalizeParams(loadLog, 'af', 'waf');
export let loadAfWafPage = normalizeParams(loadPage, 'af', 'waf');
export let loadAfWafExport = normalizeParams(loadExport, 'af', 'waf');

//  af/ips
export let loadAfIpsLog = normalizeParams(loadLog, 'af', 'ips');
export let loadAfIpsPage = normalizeParams(loadPage, 'af', 'ips');
export let loadAfIpsExport = normalizeParams(loadExport, 'af', 'ips');

//  af/utm
export let loadAfUtmLog = normalizeParams(loadLog, 'af', 'utm');
export let loadAfUtmPage = normalizeParams(loadPage, 'af', 'utm');
export let loadAfUtmExport = normalizeParams(loadExport, 'af', 'utm');

//  af/firewall
export let loadAfFirewallLog = normalizeParams(loadLog, 'af', 'firewall');
export let loadAfFirewallPage = normalizeParams(loadPage, 'af', 'firewall');
export let loadAfFirewallExport = normalizeParams(loadExport, 'af', 'firewall');

//  af/content/url
export let loadAfURLLog = normalizeParams(loadLog, 'af', 'url');
export let loadAfURLPage = normalizeParams(loadPage, 'af', 'url');
export let loadAfURLExport = normalizeParams(loadExport, 'af', 'url');

//  af/content/mail
export let loadAfMailLog = normalizeParams(loadLog, 'af', 'mail');
export let loadAfMailPage = normalizeParams(loadPage, 'af', 'mail');
export let loadAfMailExport = normalizeParams(loadExport, 'af', 'mail');

//  af/operate
export let loadAfOperateLog = normalizeParams(loadLog, 'af', 'operate');
export let loadAfOperatePage = normalizeParams(loadPage, 'af', 'operate');
export let loadAfOperateExport = normalizeParams(loadExport, 'af', 'operate');
