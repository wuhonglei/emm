/**
 * @file 验证相关方法
 */

function assert (val, msg) {
    if (!val) {
        throw new TypeError(msg || 'assertion error');
    }
}

assert.fail = function (msg) {
    throw new TypeError(msg || 'assertion error');
};

assert.equal = function (val1, val2, msg) {
    if (val1 !== val2) {
        throw new TypeError(msg || 'the two variables are not equal');
    }
};

function firstUpperCase (str) {
    return str.toLowerCase().replace(/^\S/, L => L.toUpperCase());
}
export function isType (target, type) {
    let typeStr = type.toLowerCase();
    switch (typeStr) {
        case 'undefined' :
        case 'number' :
        case 'string' :
        case 'boolean' :
            return typeof target === typeStr;

        case 'array' :
            return Array.isArray(target);

        default :
            return `[object ${firstUpperCase(type)}]` === Object.prototype.toString.call(target);
    }
}
assert.type = function (target, type, msg) {
    assert(target, 'target is undefined');
    assert(isType(target, type), msg);
};

export default assert;