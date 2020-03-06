/** 
 * 采集器接口文件
 */

import axios from './index';
import { CancelToken } from 'axios';
import { CANCEL_REQUEST_MSG } from 'src/utils/consts';

const URL = '/api/collector/';
const PLUGINURL = '/api/plugin/';

let cancelTokens = {};

/**
 * 获取采集器的列表
 * 
 * @param {object} payload
 * @param {string} payload.page - 分页内容
 * @param {string} payload.page_num - 每一页多少条数据
 * @returns {array} data.plugins - 采集器的列表
 * @returns {Number} data.total_num - 采集器列表总数
 * @returns {string} data.plugins[].name - 采集器名称
 * @returns {string} data.plugins[].id - 采集器id
 * @returns {boolean} data.plugins[].buildin - 采集器是否内置
 * @returns {String} data.plugins[]._type - 采集器接入方式
 * @returns {String} data.plugins[].create_time - 采集器创建时间
 * @returns {String} data.plugins[]._system - 采集器适用系统
 */
export function getAllPlugin (payload) {
    return axios({
        url: PLUGINURL,
        method: 'get',
        params: {
            action: 'get_all_plugin',
            params: JSON.stringify(payload)
        }
    });
};

/**
 * 获取采集器的类型
 * 
 * @returns {array} data - 采集器类型的列表
 * @returns {string} data[].name - 采集器类型名称
 */
export function getAllPluginNames () {
    return axios({
        url: '/api/plugin/',
        method: 'get',
        params: {
            action: 'get_collector_type'
        }
    });
};


/**
 * 获取资产管理的列表数据
 * 
 * @param {object} payload
 * @param {string} payload.page - 分页内容
 * @param {string} payload.page_num - 每一页多少条数据
 * @param {string} payload.asset_type - 资产类型
 * @param {string} payload.search_str - 搜索框内容
 * @returns {array} data.collectors - 采集器的列表
 * @returns {Number} data.total_num - 采集器列表总数
 * @returns {string} data.collectors[].name - 采集器名称
 * @returns {string} data.collectors[].id - 采集器id
 * @returns {boolean} data.collectors[].enable - 采集器是否启用
 * @returns {String} data.collectors[].ip - 采集器ip
 * @returns {String} data.collectors[]._type - 采集器接入方式
 * @returns {String} data.collectors[].comment - 采集器描述
 * @returns {String} data.collectors[].plugin_name - 采集器类型
 * @returns {String} data.collectors[].status - 采集器状态
 * @returns {String} [data.collectors[].username] - WMI所需采集器用户名
 * @returns {String} [data.collectors[].password] - WMI所需采集器密码
 * @returns {String} data.collectors[].today_log - 采集器今日传输日志量
 * @returns {String} data.collectors[].total_log - 采集器传输日志总量
 * @returns {String} data.collectors[].last_up - 采集器最近同步时间
 */
export function getAssetManage (payload) {
    return axios({
        url: URL,
        method: 'get',
        params: {
            action: 'get_asset_manage',
            params: JSON.stringify(payload)
        }
    });
};



/**
 * 新增资产管理
 * 
 * @param {object} payload
 * @param {string} payload.name - 资产名称
 * @param {string} payload.ip - ip地址
 * @param {string} payload.group - 资产分组
 * @param {string} payload.plugin_name - 资产类型
 * @param {string} payload._type - 接入方式
 * @param {string} payload.dc_eth - 日志ip名称
 * @param {string} payload.dc_ip - 日志ip
 * @param {string} payload.username - 用户名
 * @param {string} payload.password - 密码
 * @param {string} payload.degree - 重要程度
 * @param {string} payload.comment - 备注
 * @returns {object} data 
 */
export function addAssetManage (payload) {
    return axios({
        url: URL,
        method: 'post',
        data: {
            action: 'add_asset_manage',
            params: JSON.stringify(payload)
        }
    });
};

/**
 * 新增采集器
 * 
 * @param {object} payload
 * @param {string} payload.name - 采集器类型
 * @param {string} payload._systems - 采集器适用系统
 * @param {string} payload.regexp_path - 采集器正则文件
 * @returns {object} data- 新增采集器支持列表内容 
 */
export function addCollectorType (payload) {
    return axios({
        url: PLUGINURL,
        method: 'post',
        data: {
            action: 'add_plugin',
            params: JSON.stringify(payload)
        }
    });
};

/**
 * 编辑采集器
 * 
 * @param {object} payload
 * @param {string} payload.id - 采集器id 
 * @param {string} payload.name - 采集器类型
 * @param {string} payload._systems - 采集器适用系统
 * @param {string} payload.regexp_path - 采集器正则文件
 * @returns {object} data- 新增采集器支持列表内容 
 */
export function updateCollectorType (payload) {
    return axios({
        url: '/api/plugin/',
        method: 'post',
        data: {
            action: 'edit_plugin',
            params: JSON.stringify(payload)
        }
    });
};



/**
 * 编辑资产管理
 * 
 * @param {object} payload
 * @param {string} payload.id - 资产id
 * @param {string} payload.name - 资产名称
 * @param {string} payload.ip - ip地址
 * @param {string} payload.group - 资产分组
 * @param {string} payload.plugin_name - 资产类型
 * @param {string} payload._type - 接入方式
 * @param {string} payload.dc_eth - 日志ip名称
 * @param {string} payload.dc_ip - 日志ip
 * @param {string} payload.username - 用户名
 * @param {string} payload.password - 密码
 * @param {string} payload.degree - 重要程度
 * @param {string} payload.comment - 备注
 * @returns {object} data 
 */
export function editAssetManage (payload) {
    return axios({
        url: URL,
        method: 'post',
        data: {
            action: 'edit_asset_manage',
            params: JSON.stringify(payload)
        }
    });
};


/**
 * 删除资产管理
 * 
 * @param {object} payload
 * @param {object} payload.id - 采集器的ID
 * @returns {object} data- 删除采集器内容 
 */
export function delAssetManage (payload) {
    return axios({
        url: URL,
        method: 'post',
        data: {
            action: 'del_asset_manage',
            params: JSON.stringify(payload)
        }
    });
};


/**
 * 启用禁用资产管理
 * 
 * @param {object} payload
 * @param {array} payload.id - 资产id
 * @param {boolean} payload.op - 启用：true，禁用：false
 * @returns {object} data- 启用禁用资产管理 
 */
export function setAssetManage (payload) {
    return axios({
        url: URL,
        method: 'post',
        data: {
            action: 'set_asset_manage',
            params: JSON.stringify(payload)
        }
    });
};


/**
 * 删除采集器支持列表
 * 
 * @param {object} payload
 * @param {object} payload.ids - 采集器类型的ID
 * @returns {object} data- 删除采集器类型内容 
 */
export function deleteCollectors (payload) {
    return axios({
        url: '/api/plugin/',
        method: 'post',
        data: {
            action: 'del_plugin',
            params: JSON.stringify(payload)
        }
    });
};

/**
 * 测试密码连通性
 * 
 * @param {object} payload
 * @param {object} payload.username - 采集器的用户名
 * @param {object} payload.password - 采集器的密码
 * @param {object} payload.ip - 采集器的ip
 * @returns {object} data- 测试密码连通性返回内容
 */
export function checkWmiPaasword (payload) {
    return axios({
        url: '/api/collector/',
        method: 'post',
        data: {
            action: 'check_wmic',
            params: JSON.stringify(payload)
        }
    });
};



/**
 * 探测上传采集器支持列表正则文件
 * 
 * @param {object} payload
 * @param {string} payload.file_md5 - 文件md5值
 * @param {string} payload.file_size - 文件大小
 * @param {string} payload.file_name - 文件名
 * @param {Boolean} [payload.continue] - 是否触发断点续传上传
 * @returns {object} data- 新增采集器内容 
 * @returns {String} data.has_upd_cnt - 下一片需要上传的片数
 * @returns {String} data.file_id - 文件id号
 * @returns {String} data.chunk_file_size - 前端单次请求包含文件大小
 * @returns {String} data.is_last - 是不是最后一块
 */
export function detectFile (payload) {
    return axios({
        url: '/api/file_upload/',
        method: 'post',
        data: {
            action: 'detect_file_info',
            params: JSON.stringify(payload)
        }
    });
}

/**
 * 上传采集器支持列表正则文件
 * @param {object} payload
 * @param {string} payload.file_id - 文件id号
 * @param {string} payload.system_file - 文件数据
 * @returns {object} data- 新增采集器内容 
 * @returns {Number} data.has_upd_cnt - 文件需要上传的片数
 * @returns {Number} data.process -文件上传百分比
 * @returns {Boolean} data.is_last - 是否是最后一片
 */
export function uploadFile (payload) {

    let source = CancelToken.source();
    cancelTokens.uploadFile = source;

    return axios.post('/api/file_upload/', payload, {
        cancelToken: source.token
    });
}

/**
 * 取消上传文件请求
 */
export function cacelUploadFile () {
    if (cancelTokens.uploadFile) {
        cancelTokens.uploadFile.cancel(CANCEL_REQUEST_MSG);
    }
}

/**
 * 取消文件断点续传
 * @param {object} payload
 * @param {string} payload.file_id - 文件id号
 * @returns {object} 
 */
export function cancelUpload (payload) {
    return axios({
        url: '/api/file_upload/',
        method: 'post',
        data: {
            action: 'cancel_upload',
            params: JSON.stringify(payload)
        }
    });
}

export function getAuthInfo () {
    return axios({
        url: '/api/collector/',
        method: 'get',
        params:{
            action: 'get_auth_info'
        }
    });
}

export function getDCEthList () {
    return axios({
        url: '/api/collector/',
        method: 'get',
        params: {
            action: 'get_data_ip'
        }
    });
}