/**
 * 动态表单校验文件 存储信息
 */

class ValidStore {
    constructor () {
        this._map = {};
    }
    set (key, value) {
        if (!key || typeof key !== 'string') {
            return;
        }
        this._map[key] = value;
    }
    get (key) {
        if (!key) {
            return;
        }
        return this._map[key];
    }
    clear (key) {
        if (!key) {
            return;
        }
        delete this._map[key];
    }
    clearAll () {
        this._map = {};
    }
}

export default new ValidStore();
