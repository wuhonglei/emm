/**
 * resize 注册 与 注销
 * 因响应式的需求，非常多的地方需要监听resize
 * 设立一个统一的方式
 */

import { throttle } from 'throttle-debounce';

const THROTTLE = 500;

let cbList = [];

/**
 * 注册resize函数
 * 
 * @param {any} cb 回调函数
 * @returns {number} 返回注册函数对饮的id 注销时候用到
 */
function pushCb (cb) {
    if (arguments.length === 1) {
        cb = arguments[0];
    }
    cbList.push(cb);
    return cbList.length - 1;
}

/**
 * 注销函数
 * 
 * @param {number} index 注销的id 
 */
function popCb (index) {
    cbList[index] = false;
}

function resizeNow () {
    cbList.forEach((cb) => {
        if (cb && typeof cb === 'function') {
            cb();
        }
    });
}

window.addEventListener('resize', () => {
    throttle(THROTTLE, true, () => {
        cbList.forEach((cb) => {
            if (cb && typeof cb === 'function') {
                cb();
            }
        });
    })();
});


export default {
    pushCb,
    popCb,
    resizeNow
};