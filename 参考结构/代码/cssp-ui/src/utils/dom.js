// elementUI util/dom 文件
/*eslint-disable */
/* istanbul ignore next */

import Vue from 'vue';

const isServer = Vue.prototype.$isServer;
const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;
const ieVersion = isServer ? 0 : Number(document.documentMode);

/* istanbul ignore next */
const trim = function (string) {
    return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
};
/* istanbul ignore next */
const camelCase = function (name) {
    return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
        return offset ? letter.toUpperCase() : letter;
    }).replace(MOZ_HACK_REGEXP, 'Moz$1');
};

/* istanbul ignore next */
export const on = (function () {
    if (!isServer && document.addEventListener) {
        return function (element, event, handler, useCapture = false) {
            if (element && event && handler) {
                element.addEventListener(event, handler, useCapture);
            }
        };
    } else {
        return function (element, event, handler) {
            if (element && event && handler) {
                element.attachEvent('on' + event, handler);
            }
        };
    }
})();

/* istanbul ignore next */
export const off = (function () {
    if (!isServer && document.removeEventListener) {
        return function (element, event, handler, useCapture = false) {
            if (element && event) {
                element.removeEventListener(event, handler, useCapture);
            }
        };
    } else {
        return function (element, event, handler) {
            if (element && event) {
                element.detachEvent('on' + event, handler);
            }
        };
    }
})();

/* istanbul ignore next */
export const once = function (el, event, fn) {
    var listener = function () {
        if (fn) {
            fn.apply(this, arguments);
        }
        off(el, event, listener);
    };
    on(el, event, listener);
};

/* istanbul ignore next */
export function hasClass(el, cls) {
    if (!el || !cls) return false;
    if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
    if (el.classList) {
        return el.classList.contains(cls);
    } else {
        return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }
};

/* istanbul ignore next */
export function addClass(el, cls) {
    if (!el) return;
    var curClass = el.className;
    var classes = (cls || '').split(' ');

    for (var i = 0, j = classes.length; i < j; i++) {
        var clsName = classes[i];
        if (!clsName) continue;

        if (el.classList) {
            el.classList.add(clsName);
        } else {
            if (!hasClass(el, clsName)) {
                curClass += ' ' + clsName;
            }
        }
    }
    if (!el.classList) {
        el.className = curClass;
    }
};

/* istanbul ignore next */
export function removeClass(el, cls) {
    if (!el || !cls) return;
    var classes = cls.split(' ');
    var curClass = ' ' + el.className + ' ';

    for (var i = 0, j = classes.length; i < j; i++) {
        var clsName = classes[i];
        if (!clsName) continue;

        if (el.classList) {
            el.classList.remove(clsName);
        } else {
            if (hasClass(el, clsName)) {
                curClass = curClass.replace(' ' + clsName + ' ', ' ');
            }
        }
    }
    if (!el.classList) {
        el.className = trim(curClass);
    }
};

/* istanbul ignore next */
export const getStyle = ieVersion < 9 ? function (element, styleName) {
    if (isServer) return;
    if (!element || !styleName) return null;
    styleName = camelCase(styleName);
    if (styleName === 'float') {
        styleName = 'styleFloat';
    }
    try {
        switch (styleName) {
            case 'opacity':
                try {
                    return element.filters.item('alpha').opacity / 100;
                } catch (e) {
                    return 1.0;
                }
            default:
                return (element.style[styleName] || element.currentStyle ? element.currentStyle[styleName] : null);
        }
    } catch (e) {
        return element.style[styleName];
    }
} : function (element, styleName) {
    if (isServer) return;
    if (!element || !styleName) return null;
    styleName = camelCase(styleName);
    if (styleName === 'float') {
        styleName = 'cssFloat';
    }
    try {
        var computed = document.defaultView.getComputedStyle(element, '');
        return element.style[styleName] || computed ? computed[styleName] : null;
    } catch (e) {
        return element.style[styleName];
    }
};

/* istanbul ignore next */
export function setStyle(element, styleName, value) {
    if (!element || !styleName) return;

    if (typeof styleName === 'object') {
        for (var prop in styleName) {
            if (styleName.hasOwnProperty(prop)) {
                setStyle(element, prop, styleName[prop]);
            }
        }
    } else {
        styleName = camelCase(styleName);
        if (styleName === 'opacity' && ieVersion < 9) {
            element.style.filter = isNaN(value) ? '' : 'alpha(opacity=' + value * 100 + ')';
        } else {
            element.style[styleName] = value;
        }
    }
};


/**
 * IE10 dataset属性 polyfill
 * 因为原来使用data-set的结构不想改动，所以干脆写一个函数来解决
 * TODO 多次运行该函数时应该给予警告
 * @export function
 * @param {dom} element 
 * @param {array} attribute 
 */
export function datasetPolyfill(element, attributes) {
    if (!element || element.dataset || attributes.length === 0) return;
    element.dataset = {};
    for (let attribute of attributes) {
        element.dataset[attribute] = element.getAttribute(`data-${attribute}`);
    }
}

/**
 * 获取浏览器类型
 * 
 * @export
 * @returns 
 */
export function getBrowserType() {
    let agent = navigator.userAgent.toLowerCase();
    let regStr_ff = /firefox\/[\d.]+/gi;
    let regStr_chrome = /chrome\/[\d.]+/gi;
    let regStr_saf = /safari\/[\d.]+/gi;
    // 判断小于IE11的浏览器，我们只支持IE10 所以直接返回IE10
    if (agent.indexOf('msie') > -1 && agent.indexOf('compatible') > -1) {
        return 'ie10';
    }
    // ie11
    if (agent.indexOf('trident') > -1 && agent.indexOf("rv:11.0") > -1) {
        return 'ie11';
    }
    // edge
    if (agent.indexOf('edge') > -1) {
        return 'edge';
    }
    //firefox
    if (agent.indexOf('firefox') > -1) {
        return agent.match(regStr_ff)[0];
    }
    //Safari
    if (agent.indexOf('safari') > -1 && agent.indexOf('chrome') < -1) {
        return agent.match(regStr_saf)[0];
    }
    //Chrome
    if (agent.indexOf('chrome') > -1) {
        return agent.match(regStr_chrome)[0];
    }
    return 'illegal0';
}

/**
 * 获取浏览器版本
 * 
 * @export
 */
export function getBrowserVersion() {
    return getBrowserType().replace(/[^0-9.]/ig, "");
}


/**
 * 判断是否是edge浏览器
 *
 * @export
 * @returns { Boolean } 是否是edge
 */
export function isEdge() {
    return getBrowserType() === 'edge';
}

export function isIE() {
    return getBrowserType().indexOf('ie') > -1;
}