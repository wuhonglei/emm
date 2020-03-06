/**
 * axios 示例以及拦截器
 */

/**
 * axios 实例以及拦截器页面
 */

import logger from 'src/utils/logger';
import utils from 'src/utils/utils_data';
import faultColerantConfig from 'src/utils/fault_tolerant_config';

/* global Promise */
import axios from 'axios';
import Bus from 'src/utils/bus';

let AUTH_CODE = 401,
    SUCCESS_CODE = 200,
    isIE = window.navigator.userAgent.indexOf('Trident') > -1 && window.navigator.userAgent.indexOf('rv:11.0') > -1,
    autoHide = {
        autoHide: true
    },
    isLoginPage = location.pathname.indexOf('login.html') >= 0,  // 判断登录界面
    loadCount = 20;

const LOGTAG = 'utils:axios',
    LOG_INTERVAL_NUM = 20; // 重复日志间隔指定次数输出1次

// 隐藏组件加载中弹出层
function  unmaskTips () {
    Bus.businessContext && Bus.businessContext.$unmask();
}


// 获取Cookie的值
function getCookie (cname) {
    let name = cname + '=',
        ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}

// 校验返回数据，根据数据状态做出响应
function checkAuthCode (res) {
    let currStatus = res.status,
        currCode = res.data.code,
        msg = res.data.msg,
        flag = true,
        isCheckLogin = utils.getReqUrl('getCurrAdminInfo') === res.config.url, // 是否为校验登录接口
        logType = isCheckLogin && isLoginPage ? 'info' : 'error', // 登录页面校验登录，改为info日志
        showErrorInfo = true; // 是否显示错误信息

    if (currStatus === AUTH_CODE) {
        if (!isLoginPage) {
            location.href = '/login.html';
        }
        flag = false;
    } else if (currStatus !== SUCCESS_CODE) {
        flag = false;
    } else if (currCode !== 0) {

        // 部分请求不需要tips提示，做容错处理
        for (let i = 0; i < faultColerantConfig.length; i++) {
            if (faultColerantConfig[i].url === res.config.url && faultColerantConfig[i].codeArr.indexOf(currCode) > -1) { 
                showErrorInfo = false;
                break;
            }
        }
        if (!isLoginPage && showErrorInfo) {
            Bus.$fail(msg, autoHide);
        }
        flag = false;
    }
    if (!flag && showErrorInfo) {
        logger[logType](LOGTAG, 
            `url: ${res.config.url}, msg: ${msg}, code: ${currCode}`, 
            `page status ${currStatus}, params: ${JSON.stringify(res.config.params)}, isLoginPage: ${isLoginPage}`);
    }
    
    return flag;
}

// 创建axios实例
let service = axios.create({});

// 请求接口前
service.interceptors.request.use((config) => {
    
    config.headers['x-csrf-token'] = getCookie('csrfToken') || localStorage.getItem('token');

    if (isIE) {
        config.url += `?rd=${new Date().getTime()}`;
    }

    // 在这里定义请求拦截器
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 请求接口得到后
service.interceptors.response.use((response) => {
    if (!checkAuthCode(response)) {
        unmaskTips();
        return Promise.reject(response);
    }

    // 返回不是数组
    if (response.data.data.data && !Array.isArray(response.data.data.data)) {
        unmaskTips();
        logger.error(LOGTAG, `code: ${response.data.code}, url: ${response.config.url}`, 'response data is not array');
        return Promise.reject(response);
    }
    
    if (utils.getReqUrl('getCurrAdminInfo') === response.config.url) { // 轮询接口20次调用1次，避免刷日志
        loadCount += 1;
        if (loadCount > LOG_INTERVAL_NUM) {
            loadCount = 0;
            logger.info(LOGTAG, `url: ${response.config.url}`);
        }
    } else {
        logger.info(LOGTAG, `url: ${response.config.url}`);
    }

    // 返回
    return response;
}, (error) => {
    if (error && error.response) {
        checkAuthCode(error.response);
    }
    unmaskTips();
    return Promise.reject(error);
});


export default service;
