/**
 * api 日志管理
 */

import axios from 'src/utils/axios';
import utils from 'src/utils/utils_data';

/**
 * 查询日志
 * 
 * 
 * @param {object} data - 查询参数
 * 1.用户日志
 * @param {string} data.begDate - 开始日期
 * @param {string} data.endDate - 结束日期
 * @param {string} data.logSubType - 操作行为
 * @param {string} data.actionResult  - 操作结果
 * @param {string} data.osType - 终端类型
 * @param {int} data.pageSize - 每页显示
 * @param {int} data.pageIndex - 当前第几页
 * @param {string} data.searchType - 搜索类型
 * @param {string} data.searchKey - 搜索值
 * @param {string} data.type - 日志类型(用户日志 userlog)
 * 
 * 2.管理员日志
 * @param {string} data.begDate - 开始日期
 * @param {string} data.endDate - 结束日期
 * @param {string} data.logSubType - 操作行为
 * @param {string} data.actionResult  - 操作结果
 * @param {int} data.pageSize - 每页显示
 * @param {int} data.pageIndex - 当前第几页
 * @param {string} data.searchType - 搜索类型
 * @param {string} data.searchKey - 搜索值
 * @param {string} data.type - 日志类型(管理员 adminlog)
 * 
 * 3.系统日志
 * @param {string} data.begDate - 开始日期
 * @param {string} data.endDate - 结束日期
 * @param {string} data.module - 来源
 * @param {string} data.logLevel - 日志等级
 * @param {int} data.pageSize - 每页显示
 * @param {int} data.pageIndex - 当前第几页
 * @param {string} data.searchType - 搜索类型
 * @param {string} data.searchKey - 搜索值
 * @param {string} data.type - 日志类型(系统日志 syslog)
 * 
 * 所有日志返回值
 * @returns {object} data - 数组对象表格数据
 */
export function queryLog (data) {
    return axios({
        url: utils.getReqUrl('queryLog'),
        method: 'get',
        params: {
            ...data
        }
    });
}

/**
 * 查询日志条件
 * 
 * @param {object} data - 查询参数
 * @param {string} data.type - 类型（userlog, adminlog, syslog）
 * @returns {object} data - 对应日志的查询条件
 */
export function getLogSearchKeys (data) {
    return axios({
        url: utils.getReqUrl('getLogSearchKeys'),
        method: 'get',
        params: {
            ...data
        }
    });
}

/**
 * 查询日志总数
 * 
 * @param {object} data - 参数与查询接口一样参考 queryLog接口
 * @returns {object} data - 返回日志总数
 */
export function getLogCount (data) {
    return axios({
        url: utils.getReqUrl('getLogCount'),
        method: 'get',
        params: {
            ...data
        }
    });
}

/**
 * 开始导出
 * 
 * @param {object} data - 参数与查询接口一样参考 queryLog接口
 * @returns {object} data - 返回导出的唯一标识exportID
 */
export function exportLog (data) {
    return axios({
        url: utils.getReqUrl('exportLog'),
        method: 'get',
        params: {
            ...data
        }
    });
}

/**
 * 获取导出的进度值
 * 
 * @param {object} data - 参数
 * @param {object} data.exportID - 导出的唯一表示
 * @returns {object} data - 返回进度值（0到100）
 */
export function getProgressValue (data) {
    return axios({
        url: utils.getReqUrl('getProgressValue'),
        method: 'get',
        params: {
            ...data
        }
    });
}

/**
 * 取消导出
 * 
 * @param {object} data - 参数
 * @param {object} data.exportID - 导出的唯一表示
 * @returns {object} data - 返回取消结果
 */
export function cancelExport (data) {
    return axios({
        url: utils.getReqUrl('cancelExport'),
        method: 'get',
        params: {
            ...data
        }
    });
}