<template>
    <el-popover
        placement="right"
        popper-class="query-info-popover"
        trigger="hover">
        <div
            v-for="v in querys"
            :key="v"
            class="text">
            {{ v }}
        </div>
        <div
            slot="reference"
            class="query-info-wrapper ellipsis">
            {{ text }}
        </div>
    </el-popover>
</template>

<script>

/**
 * 查询结果文字显示
 */

import { QUERY_NAME } from 'src/utils/consts';
import { createNamespacedHelpers } from 'vuex';
import dayjs from 'dayjs';

let { mapGetters } = createNamespacedHelpers('query');
export default {
    props: {
        names: {
            type: Object,
            default: () => ({})
        },

        /**
         * formatter 是一个对象，用于处理个性化查询结果，比如，如果要处理“数据来源”
         * 思路与表格的formatter一致
         * @param {any} - 当前的值
         * @param {object} loadedData - 有所有加载数据列表的对象，因为param和loaded的定义并不是强行一致的，所有需要自己取值
         * @param {object} params - 整个params对象
         * @returns {string} 显示在query_info中的文本（不需要考虑label）
         * {
         *     uuid(value, loadedData, params) {
         *         let list = loadedData.uuid; // 拿到加载uuid的列表
         *         let [data] = list.filter((item) => item.uuid === value); // 拿到id匹配的数据，注意filter之后是一个数组
         *         return data ? `${data.name}（${data.ip}）` || '所有'; // 返回要显示的文本， data可能是undfiend 或者 虚假填充值
         *     }
         * }
         */
        formatter: {
            type: Object,
            default () {
                return {};
            }
        }
    },
    computed: {
        ...mapGetters({
            storeParams: 'params',
            storeLoadedData: 'loadedData'
        }),

        querys () {
            if (!this.storeParams) {
                return '';
            }
            let rs = [];
            let timeArr = ['startDate', 'endDate', 'startTime', 'endTime'];

            rs.push(
                `查询条件：时间（${
                    dayjs(this.storeParams.startDate).format('YYYY-MM-DD')
                } ${
                    this.storeParams.startTime
                }-${
                    dayjs(this.storeParams.endDate).format('YYYY-MM-DD')
                } ${
                    this.storeParams.endTime
                }）`);
           
            Object.keys(this.storeParams).forEach((key) => {

                // 时间相关的，不需要重复处理
                if (timeArr.indexOf(key) > -1) {
                    return;
                }

                let label = this.names[key] || QUERY_NAME[key];

                // 没有定义规则名称的，不需要处理
                if (!label) {
                    return;
                }

                // 1. 优先使用定义的formatter，formatter参数(value, storeLoadedData, storeParams)
                // 2. 使用实际值
                // 3. 实际值逻辑值为false时，用所有填充
                let value = (this.formatter[key] && typeof this.formatter[key] === 'function') ?
                    this.formatter[key](this.storeParams[key], this.storeLoadedData, this.storeParams) :
                    (this.storeParams[key] || '所有');

                // 没有值，不需要处理
                if (!value) {
                    return;
                }
                rs.push(`${label}（${value}）`);
            });

            return rs;
        },
        text () {
            return this.querys.join('| ');
        },
        hoverText () {
            return this.querys.join('\n');
        }
    }
};
</script>


<style lang="postcss">
.query-info-wrapper {
    min-height: 32px;
    line-height: 32px;
    padding-left: 24px;
    font-size: 12px;
    box-sizing: border-box;
    background-color: #F4F8FC;
}
.query-info-popover{
    max-width:600px;
    max-height:600px;
    overflow:auto;
    & .text{
        word-break:break-all;
    }
}
</style>
