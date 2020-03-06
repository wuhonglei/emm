/**
 * api 系统管理
 */

import axios from 'src/utils/axios';
import utils from 'src/utils/utils_data';

/**
 * 获取日志配置
 * 
 * @returns {object} data - 返回日志配置结果
 */
export function getLogConfig () {
    return axios({
        url: utils.getReqUrl('getLogConfig'),
        method: 'get'
    });
}

/**
 * 保存日志配置
 * 
 * @param {object} data - 保存参数
 * @param {string} data.maxSpacePer - 最大占用磁盘空间百分比
 * @param {string} data.logKeepDays - 期望保留天数
 * @param {string} data.exportLimit - 查询日志最多只能导出
 * @returns {object} data - 返回保存结果
 */
export function setLogConfig (data) {
    return axios({
        url: utils.getReqUrl('setLogConfig'),
        method: 'post',
        data
    });
}

/**
 * 获取系统设置
 * 
 * @returns {object} data - 返回系统设置结果
 */
export function getLogWhiteList () {
    return axios({
        url: utils.getReqUrl('getLogWhiteList'),
        method: 'get'
    });
}

/**
 * 保存系统设置
 * 
 * @param {object} data - 保存参数
 * @param {string} data.whitelist - ip段数据
 * @returns {object} data - 返回保存结果
 */
export function setLogWhiteList (data) {
    return axios({
        url: utils.getReqUrl('setLogWhiteList'),
        method: 'post',
        data
    });
}
