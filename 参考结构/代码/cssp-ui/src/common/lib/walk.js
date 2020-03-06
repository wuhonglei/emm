/**
 * @file public code about walking a queue
 */

/* global Promise:true */

let _toString = Object.prototype.toString;

function isPlainObject (val) {
    return _toString.call(val) === '[object Object]';
}

export async function walkChain (queue = [], context = {}, ...args) {
    if (!Array.isArray(queue)) {
        throw new TypeError('queue must be an array!');
    }

    for (let fn of queue) {
        if (typeof fn !== 'function') {
            continue;
        }

        context.success = true; // perset the context.success
        let res = await fn(...args, context);
        let contextSuccess = context.success,
            resSuccess = true;

        if (!isPlainObject(res)) {

            // res is null, undefined, or false, checker failed
            !res && (resSuccess = false);
        } else {
            context = Object.assign(context, res);
    
            if (!res.success) {
                resSuccess = false;
            }
        };

        if (!contextSuccess || !resSuccess) {
            context.success = false;
            break;
        }
    }

    return context;
}

export function walkAround (queue = [], context = {}, ...args) {
    if (!Array.isArray(queue)) {
        throw new TypeError('queue must be an array!');
    }

    let index = -1;
    
    function exec (i) {
        if (i <= index) {
            return Promise.reject(new Error('next() called multiple times'));
        }

        index = i;
        let fn = queue[i];

        if (!fn) {
            return Promise.resolve();
        }

        if (typeof fn !== 'function') {
            return Promise.resolve(exec(i + 1));
        }

        try {
            return Promise.resolve(fn(...args, context, exec.bind(null, i + 1)));
        } catch (err) {
            return Promise.reject(err);
        }
    }

    return exec(0);
}