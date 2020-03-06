/**
 * axios 实例以及拦截器页面
 */

/* global Promise */
import axios from 'axios';
import { PROXY_REG } from 'src/utils/consts';

const AUTH_CODE = 401;

// 创建axios实例
let service = axios.create({
    transformRequest: [function (data) {
        if (!data) {
            return;
        }
        if (data instanceof FormData) {
            return data;
        }
        let rs = [];
        Object.keys(data).forEach((key) => {
            rs.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&');
        });
        return rs.join('').slice(0, -1);
    }]
});

service.interceptors.request.use((config) => {

    // 生产环境中，需要将url中的/api 去除掉
    config.url = preFixURL(config.url);
    return config;
}, (error) => {
    return Promise.reject(error);
});

service.interceptors.response.use((response) => {
    if (typeof response.data === 'object' && !response.data.success) {
        return Promise.reject(response);
    }
    
    // axois 无法拦截302，这里作规避处理
    if (typeof response.data === 'string' && response.data.indexOf('403') > -1) {
        window.location.reload();
        return Promise.reject(response);
    }
    return response;
}, (error) => {
    if (error && error.response && error.response.status === AUTH_CODE) {
        window.location = process.env.NODE_ENV === 'production' ?
            `${window.location.protocol}//${window.location.host}/login/` :
            `${window.location.protocol}//${window.location.host}/login.html`;
    }
    return Promise.reject(error);
});

function preFixURL (url) {

    let prd = process.env.NODE_ENV === 'production';
    let fix = '';
    let href = window.location.href;

    // 开发环境不需要修正url
    if (!prd) {
        return url;
    }

    // CSSP单点登录带上proxy 前缀
    if (PROXY_REG.cssp.test(href)) {
        fix = `/${href.match(PROXY_REG.cssp)}/`;
    }
    return url.replace(/^\/api/, fix);
}

export default service;
