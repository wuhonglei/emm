/**
 * 登录模块接口
 */

import axios from './index';

export function login (data) {
    data.action = 'login';
    return axios({
        url: '/api/login/',
        method: 'post', 
        data
    });
}



export function preLogin () {
    return axios({
        url: '/api/login/',
        method: 'get'
    });
}

export function csspSso () {
    return axios({
        url: '/api/login/',
        method: 'get',
        params: {
            action: 'super_auth'
        }
    });
}