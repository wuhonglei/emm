/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */
export function deepCopy (obj, cache = []) {
    // just return if obj is immutable value
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    // if obj is hit, it is in circular structure
    const hit = find(cache, c => c.original === obj);
    if (hit) {
        return hit.copy;
    }

    const copy = Array.isArray(obj) ? [] : {};
    // put the copy into cache at first
    // because we want to refer it in recursive deepCopy
    cache.push({
        original: obj,
        copy,
    });

    Object.keys(obj).forEach((key) => {
        copy[key] = deepCopy(obj[key], cache);
    });

    return copy;
}

/**
 * 判断一个对象是否是一个具有长度的数组
 * @param {array} array 需要判断的对象
 * @returns {boolean} 判断的结果
 */
export function isNotEmptyArray (array) {
    if (!array ||
        !Array.isArray(array) ||
        array.length === 0) {
        return false;
    }
    return true;
}

/**
 * 清除input[type="file"]选中的文件
 * @param {dom} input 需要清除文件的input dom节点
 */
export function clearInputFile (input) {
    if (input.value) {
        try {

            //for IE11, latest Chrome/Firefox/Opera...
            input.value = '';
        } catch (err) {

            // nothing
        }
        if (input.value) {

            //for IE5 ~ IE10
            let form = document.createElement('form'),
                parentNode = input.parentNode,
                ref = input.nextSibling;
            form.appendChild(input);
            form.reset();
            parentNode.insertBefore(input, ref);
        }
    }
}

/**
 * 格式化小数显示，去除末尾0
 * 
 * @param {number|string} num 
 * @param {number} keep 小数保留位数
 * @returns {string}
 */
export function toFixed (num, keep) {
    let decimalLen = getDecimalLen(num);
    let str = Number(num).toFixed(Math.min(keep, decimalLen));
    while (str.length && str.indexOf(".") !== -1 && (str.substr(-1) === '.' || str.substr(-1) === '0')) {
        str = str.slice(0, -1);
    }
    return str;
}

/**
 * 获取数字小数点位数
 *
 * @param {number|string} num
 * @returns {number}
 */
function getDecimalLen (num) {
    let str = num.toString();

    if (str.indexOf('.') === -1) {
        return 0;
    }

    return str.split('.')[1].length;
}

/**
 * 扁平化树
 */
export function flatenTree (tree, childrenKey = 'children') {
    let temp = [tree];
    let rs = [];
    while (temp.length) {
        let node = temp.pop();
        rs.push(node)

        node[childrenKey].forEach((child) => {
            temp.push(child);
        });
    }
    return rs;
}

// 查询字符串转化为对象
export function parseToObject (queryString) {
    let parts = queryString.split('&');
    let obj = {};
    for (let i = 0, len = parts.length; i < len; i++) {
        let arr = parts[i].split('=');
        let name = arr.shift();
        let value = arr.join('=');
        obj[name] = value;
    }
    return obj;
}