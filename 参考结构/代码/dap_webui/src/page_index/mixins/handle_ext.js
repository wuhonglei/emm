
/**
 * 通用 处理ext
 * 处理表格中的图标
 * 处理列表(资源)保密级别
 */

import { RESOUCE_MODULE } from 'src/page_index/views/service/resource_manage/components/const';
const LEVEL = {
    low: 1,
    mid: 2,
    high: 3
};

export default {
    methods: {
        handleTableCol (data, key) {
            if (data.ext) {
                try {
                    let resObeject = JSON.parse(data.ext);
                    if (resObeject[key]) {
                        return resObeject[key].value; 
                    }
                    return '';
                } catch (error) {
                    return '';
                }
            }
            return '';
        },
        handleIcon (data, key) { // 资源资源组图片显示
            let iconRes = this.handleTableCol(data, key);
            let defaultIcon = data.type === 'resourceGrp' ? RESOUCE_MODULE.default_group : RESOUCE_MODULE.default_resource;
            return iconRes || defaultIcon;
        },
        handleLevel (data) { // 保密级别，用户权限
            if (data === LEVEL.low) {
                return '低';
            } else if (data === LEVEL.mid) {
                return '中';
            } else if (data === LEVEL.high) {
                return '高';
            } 
            return '-';
        }
    }
};