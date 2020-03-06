/**
 * @file 日志详情构建
 */

import { deepCopy } from 'src/utils/util';

import config from './config';

export default function buildTableDeailConfig (...pathArr) {
    let obj = { detail: config };
    let nameList = [];

    pathArr.every(key => {
        if (isPlainObj(obj.detail)) {
            obj = obj.detail && obj.detail[key] || {};
        } else if (typeof obj.detail === 'function') {
            obj = {
                name: obj.name,
                detail: obj.detail(key)
            };
        } else {
            return false;
        }

        obj.name && nameList.push(obj.name);
        return obj && obj.detail;
    });

    return {
        nameList,
        detail: Array.isArray(obj.detail) ? 
            deepCopy(obj.detail) : 
            []
    };
}

function isPlainObj (obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}