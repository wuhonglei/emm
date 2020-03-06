/**
 * table 数据处理mixin
 */

import dayjs from 'dayjs';
import cache, { cacheDate } from 'src/utils/cache';

//  合并日期时间
function prefixDate (date, time) {
    return dayjs(date).format('YYYYMMDD') + ' ' + time + ':00';
};

//  对象键名转换：驼峰命名=》下划线命名
function upperCamelToUnderScore (para) {
    let ret = {};
    Object.keys(para).forEach((key) => {
        ret[key.replace(/[A-Z]/g, char => '_' + char.toLowerCase())] = para[key];
    });

    return ret;
}

//  只用三种颜色，高和致命用一种，低和信息用一种
let levelColor = {
    'HIGH': 'high',
    'MIDDLE': 'middle',
    'LOW': 'low',
    'FATAL': 'high',
    'INFO': 'low'
};

export default {
    methods: {

        //  把表格数据中的空串用‘-’填充
        fillTableData (data) {
            if (data[0]) {
                Object.keys(data[0]).forEach(key => {
                    data.forEach(item => {
                        let val = item[key];
                        if (!val && val !== 0) {
                            item[key] = '-';
                        }
                    });
                });
            }
            return data;
        },

        //  构造sort_para
        resolveSortPara (queryParams) {
            let sortPara = upperCamelToUnderScore(queryParams);

            //  sort_para中不需要startDate等参数
            delete sortPara.start_date;
            delete sortPara.start_time;
            delete sortPara.end_date;
            delete sortPara.end_time;
        
            return sortPara;
        },

        //  构造control_para
        resolveControlPara (queryParams, tableParams) {

            //  将日期时间存起来，方便用户其他表的查询
            cacheDate('queryStartDate', queryParams.startDate);
            cache('queryStartTime', queryParams.startTime);
            cacheDate('queryEndDate', queryParams.endDate);
            cache('queryEndTime', queryParams.endTime);

            return {
                ...tableParams,
                start_date: prefixDate(
                    queryParams.startDate, 
                    queryParams.startTime
                ),
                end_date: prefixDate(
                    queryParams.endDate,
                    queryParams.endTime
                )
            };
        },

        //根据level_eng显示不同颜色的标示
        prefixLevel (row) {
            return levelColor[row.level_eng];
        },

        _getLevelTextCls (level) {
            switch (level) {
                case 'high':
                    return ['text-level', 'high'];

                case 'middle':
                    return ['text-level', 'middle'];

                case 'low':
                default:
                    return ['text-level', 'low'];
            }
        },
        getLevelTextCls (row) {
            return this._getLevelTextCls(this.prefixLevel(row));
        }
    }
};