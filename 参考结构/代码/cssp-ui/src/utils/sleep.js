/**
 * @file sleep
 */

import uuid from './uuid';
let timeoutMap = new Map();

//let _intervalMap = new Map();

/**
 * setTimeout 接口Promise化
 * @param {String} name 指定名称，clearTimeout 的时候会用到
 * @param {Number} ms 延迟多少毫秒
 * @returns {Promise} 返回 Promise 对象，本项目所有异步接口都 Promise 化
 */
export function sleep (name, ms) {
    if (arguments.length === 1 && typeof name === 'number') {
        ms = name;
        name = uuid();
    }

    return new Promise(function (resolve/*, reject*/) {

        /* eslint-disable */
        let id = window.setTimeout(() => {
            if (timeoutMap.has(name)) {
                resolve(name);

                timeoutMap.delete(name);
            }
        }, ms);
        timeoutMap.set(name, id);

        /* eslint-enable sfchecklist/no-settimeout */
    });
}

/**
 * clearTimeout 接口，需要把名称传进来
 * @param {String} name setTimeout 的名称
 * @return {Boolean} 是否成功
 */
export function clearSleep (name) {
    if (timeoutMap.has(name)) {
        window.clearTimeout(timeoutMap.get(name));
        timeoutMap.delete(name);
        return true;
    }
    return false;
}
