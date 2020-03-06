/**
 * @file 常用过滤器
 */

import { MAX_LOG_PRESERVE_YEAR } from 'src/utils/consts';

/**
 * 给大数字带上单位（w, 亿）
 * @param {number} num
 * @returns {string} 带单位的数字字符串
 */
export function filterNumUnit (num) {
    let res = num; // 计算结果
    let forward = res; // 用来标记前置的计算结果
    let devided = 1; // 除数总乘积
    let devidedForward = 1; // 用来标记前置的除数总乘积

    const TEN_THOUAND = 10000;
    const HANDRED_MILLION = 100000000;
    const PERCISION = 2;

    forward = forward / TEN_THOUAND;
    devidedForward *= TEN_THOUAND;
    while (forward >= 1 && devidedForward <= HANDRED_MILLION) {
        let strArr = forward.toString().split('.');
        if (strArr[1] && strArr[1].length > PERCISION) {
            forward = parseFloat(forward.toFixed(PERCISION));
        }
        res = forward;
        devided = devidedForward;
        forward = forward / TEN_THOUAND;
        devidedForward *= TEN_THOUAND;
    }

    return `${parseFloat(res)}${
        devided < TEN_THOUAND ? '' : (devided < HANDRED_MILLION ? _('万') : _('亿'))
    }`;
}

export function storageSize (input) {
    const UNIT = 1024;
    const DECIMAL = 2;
    if (!input) {
        return '0';
    }
    let v = parseInt(input, 10);
    if (v < UNIT) {
        return `${v}`;
    }
    if (v < UNIT * UNIT) {
        return `${(v / UNIT).toFixed(DECIMAL)}`;
    }
    if (v < UNIT * UNIT * UNIT) {
        return `${(v / UNIT / UNIT).toFixed(DECIMAL)}`;
    }
    if (v < UNIT * UNIT * UNIT * UNIT) {
        return `${(v / UNIT / UNIT / UNIT).toFixed(DECIMAL)}`;
    }
    return `${(v / UNIT / UNIT / UNIT / UNIT).toFixed(DECIMAL)}`;
};

export function storageUnit (input) {
    const UNIT = 1024;
    if (!input) {
        return 'B';
    }
    let v = parseInt(input, 10);
    if (v < UNIT) {
        return 'B';
    }
    if (v < UNIT * UNIT) {
        return 'KB';
    }
    if (v < UNIT * UNIT * UNIT) {
        return 'MB';
    }
    if (v < UNIT * UNIT * UNIT * UNIT) {
        return 'GB';
    }
    return 'TB';
};

/**
 * 计算完整的大小带单位的展示
 * @param {number | string} v 储存空间大小 单位B
 * @return {string} 储存空间大小（带单位）
 */
export function fullStorageSize (v) {
    return `${storageSize(v)}${storageUnit(v)}`;
};


/**
 * 合规天数
 * @param {number} v 天数
 * @returns {string} 年加天
 */
export function validDayUnit (v) {
    const DAY_OF_YEAR = 365;

    if (v > DAY_OF_YEAR * MAX_LOG_PRESERVE_YEAR) {
        return `超过${MAX_LOG_PRESERVE_YEAR}${_('年')}`;
    }

    let year = Math.floor(v / DAY_OF_YEAR);
    let day = v - year * DAY_OF_YEAR;

    return `${year > 0 ? year + _('年') : ''}${day > 0 ? day + _('天') : ''}`;
}