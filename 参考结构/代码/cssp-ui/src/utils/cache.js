/**
 * 用于缓存部分用户输入数据
 */

const STORAGE = window.sessionStorage;

export default function cache (...args) {
    if (!args.length) {
        return;
    }
    if (args.length === 1) {
        return STORAGE.getItem(args[0]);
    }
    STORAGE.setItem(args[0], args[1]);
};

export function cacheDate (name, date) {
    if (date) {
        cache(name, date.toString());
    }
    let value = cache(name);
    return value ? new Date(value) : null;
};