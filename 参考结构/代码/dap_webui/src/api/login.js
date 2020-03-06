/**
 * api 接口
 */

import axios from 'src/utils/axios';
import utils from 'src/utils/utils_data';

/**
 * 登录
 * 
 * @param {object} data - 登录参数
 * @param {string} data.username - 用户名
 * @param {string} data.password - password
 * @returns {object} data - 返回登录结果
 */
export async function login (data) {
    return axios({
        url: utils.getReqUrl('login'),
        method: 'post',
        data
    });
}

/**
 * 获取token
 * 
 * @returns {object} data - 返回token值
 */
export async function getToken () {
    return axios({
        url: utils.getReqUrl('getToken'),
        method: 'get'
    });
}

