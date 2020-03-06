/**
 * af 日志查询接口
 */

import axios from './index';


export function loadWaf (data) {
    return axios({
        url: '/api/login/',
        method: 'get',
        params: {
            action: 'log_search',
            params: JSON.stringify(data)
        }
    });
}


export function postWaf (data) {
    return axios({
        url: '/api/login/',
        method: 'post',
        data: {
            action: 'log_search',
            params: JSON.stringify(data)
        }
    });
}

export function loadMail (data) {
    return axios({
        url: '/api/login/',
        method: 'post',
        data: {
            action: 'log_search',
            params: JSON.stringify(data)
        }
    });
}

export function postMail (data) {
    return axios({
        url: '/api/login/',
        method: 'post',
        data: {
            action: 'log_search',
            params: JSON.stringify(data)
        }
    });
}

export function loadURL (data) {
    return axios({
        url: '/api/login/',
        method: 'get',
        params: {
            action: 'log_search',
            params: JSON.stringify(data)
        }
    });
};

export function postURL (data) {
    return axios({
        url: '/api/login/',
        method: 'post',
        data: {
            action: 'log_search',
            params: JSON.stringify(data)
        }
    });
}

export function loadOperate (data) {
    return axios({
        url: '/api/login/',
        method: 'get',
        params: {
            action: 'log_search',
            params: JSON.stringify(data)
        }
    });
}

export function postOperate (data) {
    return axios({
        url: '/api/login/',
        method: 'post',
        data: {
            action: 'log_search',
            params: JSON.stringify(data)
        }
    });
}