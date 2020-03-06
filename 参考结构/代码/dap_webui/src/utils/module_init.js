
/**
 * 模块实例化
 */

import { allInterface } from 'src/config/all_interface';
import { filterText } from 'src/config/filter_text';
import logger from 'src/utils/logger';

let LOGTAG = 'module_init';
let navIcon = { // 菜单图标映射
    'userLog': 'fa-user-log',
    'adminLog': 'fa-admin-log',
    'systemLog': 'fa-system-log',
    'logConfig': 'fa-log-config',
    'systemSet': 'fa-system-set'
};

// 将菜单数据划分为一级，打平处理，便于搜索
function navDataFormat (navData = []) {
    
    if (!navData.length) {
        return navData;
    }

    let getObjAttr = (item, index) => { // 复制属性
        item = item || {};
        if (navIcon[item.id]) {
            item.icon = 'iconfont ' + navIcon[item.id];
        }
        return {
            id: item.id,
            title: item.name,
            type: item.type,
            permission: item.permission,
            index: index
        };
    };

    let deepTraversal = (data) => {
        let resultObj = {};
        data.forEach((item, i) => {
            let mapData = (data, curr, dataIndex) => {
                
                let currIndex = dataIndex >= 0 ? (curr + '-' + dataIndex) : `${curr}`; // dataIndex在第一层是undefined，但不能直接判断，0也是false
                data.index = currIndex;
                data.title = data.name;
                let dataDetail = getObjAttr(data, currIndex); // 仅用于复制菜单属性
                
                resultObj[dataDetail.id] = dataDetail;
                data.children && data.children.forEach((child, m) => mapData(child, currIndex, m));
            };
            mapData(item, i);
        });
        return resultObj;
    };
    
    let navObj = deepTraversal(navData, '');  // 打平保存对象


    return {
        navObj: navObj,
        navData: navData
    };
}

// 格式化权限数据
function allAuthDataFormat (data) {
    let authObj = {};
    for (let i = 0; i < data.length; i++) {
        authObj[data[i].id] = data[i];
    };
    return authObj;
}

// 初始化接口名称，应用于utils_data.js
function initInterface (data) {
    let interfaceObj = {};
    allInterface.forEach(ele => {
        if (data) {
            let jsonData = data[0],
                jsonItem = jsonData[ele.url];
            if (!jsonItem && !ele.whitelist) { // 扫描（添加白名单接口不扫描）
                logger.error(LOGTAG, `${ele.url} is not exits`, 'please check schema interface');
            }
            ele.json = jsonItem;
        }
        
        interfaceObj[ele.name] = ele;
        interfaceObj[ele.url] = ele;
    });

    return interfaceObj;
}

function initFilterText () { // 初始化列表过滤下拉框
    let filterObj = {};
    filterText.forEach(ele => {
        filterObj[ele.name] = {
            label: ele.label,
            value: ele.value
        };
    });
    return filterObj;
}

export {
    initInterface, // 初始化接口数据
    navDataFormat, // 菜单格式化
    allAuthDataFormat, // 授权数据格式化
    initFilterText // 初始化列表过滤下拉框
};


