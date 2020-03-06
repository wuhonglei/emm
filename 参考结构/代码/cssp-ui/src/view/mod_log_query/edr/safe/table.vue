<template>
    <div class="safe-table-wrapper log-table-wrap">
        <div class="table">
            <el-table
                v-if="hackReset && !columnSelecting"
                ref="table"
                :data="tableData"
                :style="{width: '100%', height: '100%'}"
                height="100%"
                @filter-change="handleFilterChanged">
                <el-table-column
                    label="序号"
                    width="80px">
                    <template slot-scope="scope">
                        <span>{{ computeIndex(scope.$index) }}</span>
                    </template>
                </el-table-column>

                <!-- columnShows 写成计算属性不兼容，因为是修改代码所以直接禁用这条规则 -->
                <!-- eslint-disable vue/no-use-v-if-with-v-for -->
                <template
                    v-for="item in columns"
                    v-if="columnShows[item.value]">
                    <el-table-column
                        v-if="item.pre"
                        :key="item.value"
                        :label="item.text"
                        v-bind="item"
                        show-overflow-tooltip="show-overflow-tooltip">
                        <!-- eslint-enable -->
                        <template slot-scope="scope">
                            <pre>{{ scope.row[item.value] }}</pre>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-else
                        :key="item.value"
                        :label="item.text"
                        :prop="item.value"
                        show-overflow-tooltip="show-overflow-tooltip"
                        v-bind="item" />
                </template>
                <el-table-column
                    label="详情"
                    width="50px">
                    <template slot-scope="scope">
                        <el-popover
                            placement="left"
                            trigger="click"
                            content="aaaa">
                            <table-detail
                                id="value"
                                :index="computeIndex(scope.$index)"
                                :configures="columns"
                                :detail-data="scope.row"
                                name="text" />
                            <a slot="reference"
                               href="javascript:void(0);">查看</a>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column
                    label=""
                    width="40px"
                    prop="$select"
                    :filters="columns"
                    :filtered-value="selectedColumns" />
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination
                :current-page="pagination.page"
                :total="pagination.total"
                :page-size="pagination.pageSize"
                :page-sizes="pagination.pageSizes"
                layout="sizes, prev, pager, slot, next"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange">
                <pagination-loading v-if="preLoading" />
            </el-pagination>
        </div>
    </div>
</template>
<script>

/**
 * edr 安全日志查询表格
 */
              
/* eslint-disable no-magic-numbers */
import table from 'src/common/mixins/table';
import tableDataHandler from 'src/common/mixins/table_data_handler';
import tableColumnFilter from 'src/common/mixins/table_column_filter';
import { loadLog, loadPage, loadExport } from 'src/common/api/log';
import { createNamespacedHelpers } from 'vuex';
import tableDetail from 'src/common/components/table_detail';
import { TABLE_COLUMNS } from './consts.js';
import loadFile from 'src/utils/loadfile';
import logParamsHelper from 'src/utils/log_params_helper';
import { fluxRules, otherRules } from './rules.js';
import paginationLoading from 'src/common/components/pagination_loading';

let { mapGetters } = createNamespacedHelpers('query');
export default {
    components: {tableDetail, paginationLoading},
    
    mixins: [table, tableDataHandler, tableColumnFilter],
    
    data () {
        return {
            tableData: [],
            useLogSearch: true,
            tableName: '',
            hackReset: true,        // 加载数据时重新渲染表格
            payload: {},
            columns: [],
            preLoading: false
        };
    },

    computed: {
        ...mapGetters({
            storeParams: 'params',
            storeLoadedData: 'loadedData'
        })
    },

    mounted () {
        this.$on('load-data', (querySearch) => {
            if (querySearch) {
                this.useLogSearch = true;
                this.hackReset = false;
                this.initTableColumns();
                this.$refs.table.$emit('filter-change', {v: this.columns.map(item => item.value)});
            }

            //  再次查询时调到第一页
            if (querySearch && this.pagination.page && this.pagination.page !== 1) {
                this.pagination.page = 1;
            } else {
                this.loadData();
            }
        });

        this.$on('export', () => {
            this.export();
        });

        this.$emit('load-data', true);
    },

    methods: {
        resolveLoadParams (preLoad = 0) {
            return {
                page: this.pagination.page + preLoad, // 查询第x页的数据，default 1
                num_per_page: this.pagination.pageSize, // 每一页多少条数据，default 20
                order: false
            };
        },

        initTableColumns () {
            this.tableName = this.storeParams.type;
            this.columns = TABLE_COLUMNS[this.tableName.toUpperCase()];
        },

        loadData () {

            let controlPara = this.resolveControlPara(this.storeParams, this.resolveLoadParams());   //控制参数
            let rules = this.storeParams.type === 'flux' ? fluxRules : otherRules;
            this.payload = logParamsHelper(this.storeParams, rules, 'edr', '', controlPara);

            //  第一次为query查询用log_search, 否则用turn_search
            let search = this.useLogSearch ? loadLog : loadPage;

            this.tableData = [];
            search(this.payload)
                .then(({data}) => {
                    this.tableData = this.fillTableData(data.data || []); // 注意为空处理
                    if (this.useLogSearch) {
                        this.useLogSearch = false;
                        this.pagination.total = data.total || 0;
                    }

                    //  如果翻到最后一页, 并且tableData的数据量达到一整页的数据量
                    //  就预加载数据，并且下次查询用log_search
                    if ((this.pagination.page === this.maxPageNum) && 
                        (this.tableData.length === this.pagination.pageSize)) {
                        this.preLoad();
                    }
                    
                })
                .catch((err) => {
                    this.$error(err, '加载数据失败');
                })
                .finally(() => {
                    this.hackReset = true;
                    this.$emit('loaded', {tableData: this.tableData}); 
                });
        },

        preLoad () {
            let controlPara = this.resolveControlPara(this.storeParams, this.resolveLoadParams(1));   //控制参数
            let rules = this.storeParams.type === 'flux' ? fluxRules : otherRules;
            let payload = logParamsHelper(this.storeParams, rules, 'edr', '', controlPara);

            this.preLoading = true;
            loadLog(payload)
                .then(({data}) => {
                    this.pagination.total = data.total || this.pagination.total;
                })
                .catch(() => {})
                .finally(() => {
                    this.preLoading = false;
                });
        },

        export () {
            loadExport(this.payload)
                .then(({data}) => {
                    let filename = data.data || '';
                    if (filename) {
                        this.$message.success({
                            message: '导出成功'
                        });
                        loadFile(filename);
                    }
                })
                .catch((err) => {
                    this.$error(err, '导出失败');
                })
                .finally(() => {
                    this.$emit('exported');
                });
        }
    }
};
</script>
