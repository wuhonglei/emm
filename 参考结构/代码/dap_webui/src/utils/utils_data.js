/**
 * 基础数据
 * navData: 菜单所有数据
 * navObj: 菜单打平后的数据
 * authData: 用户权限数据
 * sysTime: 当前系统时间
 */

import logger from 'src/utils/logger';

const LOGTAG = 'utils_data';

class UtilsData {
    constructor () {
        this.navData = [];
        this.navObj = {};
        this.authData = {};
        this.username = '';
        this.schema = {};
        this.filterText = {};
        this.sysTime = '';
    }

    setNav (data) { // 菜单数据
        this.navData = data;
    }

    setNavObj (data) { // 菜单对象
        this.navObj = data;
    }

    setAuthData (data) { // 权限数据
        this.authData = data;
    }

    setUsername (data) { // 用户名
        this.username = data;
    }

    setSchema (data) { // 设置schema
        this.schema = data;
    }

    getSchema (moduleName) { // 获取schema
        return this.schema[moduleName].json;
    }

    getReqUrl (moduleName) { // 根据名称获取请求地址
        if (!moduleName || !this.schema[moduleName]) {
            logger.error(LOGTAG, 'request object is not defined or not exits.', moduleName);
            return;
        }
        return this.schema[moduleName].url;
    }

    getUrlName (url) { // 根据URL获取请求名称
        return this.schema[url].name;
    }

    setFilterText (filterObj) { // 设置过滤文本
        this.filterText = filterObj;
    }

    getFilterText (filterArr) { // 获取过滤文本
        if (!Array.isArray(filterArr)) {
            logger.error(LOGTAG, 'filter text must is Array', filterArr);
            return;
        }
        let queryFilterArr = [];
        filterArr.forEach(item => {
            if (this.filterText[item]) {
                queryFilterArr.push({
                    label: this.filterText[item].label,
                    value: this.filterText[item].value
                });
            }
        });
        return queryFilterArr;

    }

    setSystemTime (data) { // 设置系统时间
        this.sysTime = data;
    }

    getSystemTime () { // 获取系统时间
        return this.sysTime;
    }

}

export default new UtilsData();