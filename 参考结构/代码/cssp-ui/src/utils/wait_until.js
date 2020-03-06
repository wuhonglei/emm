/**
 * @file 等待执行
 */

let waittingMap = new Map();
let readySet = new Set();

function _setPromise (id) {
    let waittingObj = {};
    waittingObj.promise = new Promise(resolve => {
        waittingObj.resolve = resolve;
    });
    waittingMap.set(id, waittingObj);
}

// 等待结束
export function stopWaitting (id) {
    if (waittingMap.has(id)) {
        let waittingObj = waittingMap.get(id);
        typeof waittingObj.resolve === 'function' && waittingObj.resolve();
        typeof waittingObj.cb === 'function' && waittingObj.cb();
        waittingObj.promise = null;
        waittingObj.resolve = null;
        waittingObj.cb = null;
        waittingMap.delete(id);
    }
    
    readySet.add(id);
}

/**
 * 等待
 * 
 * 用来等待另一个与当前过程异步的过程执行完成（此异步过程通常不在当前上下文当中）
 * 
 * 用法：
 * 
 *      异步过程：
 *      ...
 *      ...
 *      stopWaitting('waittingID');
 * 
 *      当前过程：
 *      wait('waittingID', () => {...})
 *      或者：
 *      wait('waittingID').then(() =>{...})
 *      
 * @param {any} id 标识该等待执行过程的ID
 * @param {function} cb 该等待执行过程结束后执行的函数
 * @returns {Promise} 返回一个Promise
 */
export function wait (id, cb) {
    if (readySet.has(id)) {
        typeof cb === 'function' && cb();
        return Promise.resolve();
    }

    if (!waittingMap.has(id)) {
        _setPromise(id);
    }

    return waittingMap.get(id).promise;
}

// 解除某等待过程的完成标志
export function clearReady (id) {
    readySet.delete(id);
}