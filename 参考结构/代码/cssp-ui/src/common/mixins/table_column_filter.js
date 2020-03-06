/**
 * 表格列可筛选 mixins 文件
 * 不是所有表格都要自定选项
 * 使用说明：
 * 
 * step 1： 定义columns 每一个包含以下字段 
 *      {string} text  - 筛选中要显示的文字 与lable 保持一致
 *      {string} value{string} - key 唯一即可
 *      {boolean} [default]{boolean} - 可选值 筛选中点击重置时，是否选中
 *      {boolean} [show]{boolean} - 可选值 显示隐藏的初始值，与default保持一致
 * 
 * step 2： 添加筛选列
 *      el-table-column(label=""
 *          width="40px"
 *          prop="$select"
 *          :filters="columns"
 *          :filtered-value="selectedColumns")
 * 
 * step 3： el-table 组件上加上 v-if="!columnSelecting" 和 @filter-change="handleFilterChanged"
 * 
 * step 4： 给需要动态显示隐藏的column加上 v-if="columnsShows.xxx.show"（推荐这种减少改动，但是需要）
 *      可以通过v-for 创建el-column处理，但是对于一些比较复杂的需求，比如slot这些可能就不好处理了.
 *          因为el-table-column 本身没有提供任何可以直接渲染html的接口。
 */

export default {
    computed: {
        defaultColumns () {
            let rs = [];
            this.columns.forEach(item => {
                if (item.default) {
                    rs.push(item.value);
                }
            });
            return rs;
        }
    },

    data () {
        return {
            columnSelecting: false,
            columnShows: {},
            selectedColumns: [],
            columnDisplay: []
        };
    },

    created () {

        // 监测是否定义columns
        if (!Array.isArray(this.columns)) {
            throw new Error('column filter need define columns in data');
        }
        this.columns.forEach((item) => {
            item.show = !!item.default;
            item._selected = item.show;
            this.columnShows[item.value] = item.show;
        });
        this.columnDisplay = this.columns.filter(column => column._selected);
    },

    beforeMount () {
        this.selectedColumns = this.defaultColumns;
    },

    methods: {
        handleFilterChanged (v) {
            this.columnSelecting = true;
            let columnID = Object.keys(v)[0];
            if (!columnID) {
                return;
            }
            let selectedColumns = v[columnID];
            this.selectedColumns = selectedColumns.length === 0 ? this.defaultColumns : selectedColumns;
            this.columns.forEach((item) => {
                if (this.selectedColumns.indexOf(item.value) > -1) {
                    this.columnShows[item.value] = true;
                    item._selected = true;
                } else {
                    this.columnShows[item.value] = false;
                    item._selected = false;
                }
            });
            this.columnDisplay = this.columns.filter(column => column._selected);
            this.$nextTick(()=> {
                this.columnSelecting = false;
            });
        }
    }
};