/**
 * 基础 接口
 */

import axios from 'src/utils/axios';
import utils from 'src/utils/utils_data';

/**
 * 获取菜单接口
 * 
 * @returns {object} data - 返回菜单数据
 */
export function getAllNav () {
    return axios({
        url: utils.getReqUrl('getAllMenu'),
        method: 'get'
    });
}

/**
 * 获取当前的用户信息
 * 
 * @returns {object} data - 返回信息结果
 */
export function getCurrentUser () {
    return axios({
        url: utils.getReqUrl('getCurrAdminInfo'),
        method: 'get'
    });
}

/**
 * 注销
 * 
 * @returns {object} data - 返回注销结果
 */
export async function logout () {
    return axios({
        url: utils.getReqUrl('logout'),
        method: 'post'
    });
}

/**
 * 修改密码
 * 
 * @param {object} data - 修改参数
 * @param {string} data.username - 用户名
 * @param {string} data.oldPassword - 旧密码
 * @param {string} data.newPassword - 新密码
 * @returns {object} data - 返回修改结果
 */
export async function modifyPass (data) {
    return axios({
        url: utils.getReqUrl('modifyPass'),
        method: 'post',
        data
    });
}

/**
 * 是否强制修改密码
 * 
 * @returns {object} data - 返回结果
 */
export async function needModifyPass () {
    return axios({
        url: utils.getReqUrl('needModifyPass'),
        method: 'get'
    });
}