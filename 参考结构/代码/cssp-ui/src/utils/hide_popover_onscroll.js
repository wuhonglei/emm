/**
 * 在鼠标滚动时，隐藏popover
 * 为了解决数据量比较多是，点击日志查询中的表格，然后滚动数据popover 不消失的问题
 * bug: 87399
 */

import { on, off } from './dom';

const TIME_SPLIT = 300; // 防抖时间
const POP_CLASS = 'el-popover'; // pop的class
let timer = null;


/**
 * 判断当前是否有el-popover 显示
 * @returns {boolean}
 */
function isPopoverShow () {
    let popovers = document.querySelectorAll(`.${POP_CLASS}`);
    let popShow = false;

    popovers.forEach((dom) => {
        if (dom.style.display !== 'none') {
            popShow = true;
            return;
        }
    });
    return popShow;
}

/**
 * 判断当前时间是否在popover内
 *
 * @param {event} event
 * @returns {boolean}
 */
function isEventInPopover (event) {
    let el = event.target;

    while (el) {
        let classList = Array.from(el.classList);
        if (classList.indexOf(POP_CLASS) > -1) {
            return true;
        }
        el = el.parentElement;
    }
    return false;
}

/**
 * 隐藏popover
 */
function hidePopover () {
    if (!isPopoverShow()) {
        return;
    }
    document.body.click();
}

function onWheel (event) {
    if (isEventInPopover(event)) {
        return;
    }
    if (timer) {
        clearTimeout(timer);
    }

    // 防抖
    timer = setTimeout(hidePopover, TIME_SPLIT);
    timer = null;
}

export function bindPopoverWheel () {
    on(window, 'wheel', onWheel);
}

export function offPopoverWheel () {
    off(window, 'wheel', onWheel);
}