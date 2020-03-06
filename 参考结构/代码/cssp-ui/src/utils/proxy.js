/**
 * @file 常用js代理
 */

/* global Map:true */

const NOOP = function () {};
const DEFAULT_THROTTLE = 5000;

// 节流代理，throttle传入null表示不清空缓存，当做缓存代理用
export function createThrottleProxy (fn = NOOP, throttle = DEFAULT_THROTTLE) {
    let _tmr = new Map(),
        _cache = new Map();

    return async function (...args) {
        let key = JSON.stringify(args);
        if (_cache.has(key)) {
            return _cache.get(key);
        }

        // eslint-disable-next-line @sxf/sfchecklist/no-invalid-this
        let context = this;
        let res = await fn.apply(context, args);
        _cache.set(key, res);
        
        if (throttle) {

            // eslint-disable-next-line @sxf/sfchecklist/no-settimeout
            _tmr.set(key, setTimeout(() => {
                _cache.delete(key);
                _tmr.has(key) && clearTimeout(_tmr.get(key));
                _tmr.delete(key);
            }, throttle));
        }
        
        return res;
    };
}