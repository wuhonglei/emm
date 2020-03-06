<template lang="pug">
.ac-proxy-table-wrapper.log-table-wrap
    .table
        el-table(:data="tableData"
            @row-click="handleRowClick"
            ref="logTable"
            height="100%"
            :style="{width: '100%', height: '100%', 'overflow-x':'auto'}"
            v-if="!columnSelecting"
            @filter-change="handleFilterChanged"
            width="100%")

            el-table-column(label="序号" width="80px")
                template(slot-scope="scope")
                    span {{computeIndex(scope.$index)}}

            el-table-column(label="用户名"
                v-if="columnShows.user_name"
                prop="user_name"
                width="140"
                show-overflow-tooltip)

            el-table-column(label="组名"
                v-if="columnShows.grp_name"
                prop="grp_name"
                width="200"
                show-overflow-tooltip)

            el-table-column(label="源IP"
                v-if="columnShows.src_ip"
                prop="src_ip"
                show-overflow-tooltip)

            el-table-column(label="终端类型"
                v-if="columnShows.tm_name"
                prop="tm_name"
                width="100"
                show-overflow-tooltip)

            el-table-column(label="代理工具"
                v-if="columnShows.proxytool"
                prop="proxytool"
                show-overflow-tooltip)

            el-table-column(label="状态"
                v-if="columnShows.status"
                prop="status"
                show-overflow-tooltip)

            el-table-column(label="时间"
                v-if="columnShows.time"
                prop="time"
                show-overflow-tooltip)

            el-table-column(label="详情")
                template(slot-scope="scope")
                    el-popover(placement="left" trigger="click")
                        table-detail(:index="computeIndex(scope.$index)" :configures="detailConfigs" :detailData="scope.row")
                        a(slot="reference" href="javascript:void(0);") 查看

            el-table-column(label="" 
                width="40"
                key="$select"
                prop="$select"
                :filters="columns"
                :filtered-value="selectedColumns")

    .pagination
        el-pagination(:current-page="pagination.page"
            :total="pagination.total"
            :page-size="pagination.pageSize"
            :page-sizes="pagination.pageSizes"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            layout="sizes, prev, pager, slot, next")
                pagination-loading(v-if="preLoading")
</template>

<script>

/**
 * 代理工具管理日志表格
 */

import table from 'src/common/mixins/table';
import tableColumnFilter from 'src/common/mixins/table_column_filter';
import tableDataHandler from 'src/common/mixins/table_data_handler';
import { loadLog, loadPage, loadExport } from 'src/common/api/log';
import { createNamespacedHelpers } from 'vuex';
import { exchangeTimeOrder } from 'src/utils/api_help';
import loadFile from 'src/utils/loadfile';
import { TIME_ORDER } from 'src/utils/consts';
import tableDetail from 'src/common/components/table_detail';
import { TABLE_DETAILS } from './consts';
import rules from './api_params_rules';
import logParamsHelper from 'src/utils/log_params_helper';
import paginationLoading from 'src/common/components/pagination_loading';

let { mapGetters } = createNamespacedHelpers('query');

export default {
    components: {tableDetail, paginationLoading},
    mixins: [table, tableColumnFilter, tableDataHandler],
    
    data () {
        return {
            tableData: [],
            columns: [{
                text: '用户名',
                value: 'user_name',
                default: true
            }, {
                text: '组名',
                value: 'grp_name',
                default: true
            }, {
                text: '源IP',
                value: 'src_ip',
                default: false
            }, {
                text: '终端类型',
                value: 'tm_name',
                default: true
            }, {
                text: '代理工具',
                value: 'proxytool',
                default: true
            }, {
                text: '状态',
                value: 'status',
                default: true
            }, {
                text: '时间',
                value: 'time',
                default: true
            }],
            useLogSearch: true,
            loading: false,
            detailConfigs: TABLE_DETAILS,
            order: false,
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
            }

            if (querySearch && this.pagination.page && this.pagination.page !== 1) {
                this.pagination.page = 1;
            } else {
                this.loadData();
            }
            
        });

        this.$on('export', () => {
            this.export();
        });
        
        this.loadData();
    },

    methods: {
        resolveLoadParams (preLoad = 0) {
            this.order = exchangeTimeOrder(TIME_ORDER, this.storeParams.timeOrder);
        
            //修改查询条件上的true/false
            this.storeParams.timeOrder = this.order ? '正序' : '倒序';
            return {
                page: this.pagination.page + preLoad, // 查询第x页的数据，default 1
                num_per_page: this.pagination.pageSize, // 每一页多少条数据，default 20
                order: this.order
            };
        },

        resolveParams (preload = 0) {
            let controlPara = this.resolveControlPara(this.storeParams, this.resolveLoadParams(preload));
            return logParamsHelper(this.storeParams, rules, 'ac', 'proxy', controlPara);
        },

        preLoad () {
            let params = this.resolveParams(1); 
            this.preLoading = true;
            loadLog(params)
                .then(({data}) => {
                    this.pagination.total = data.total || this.pagination.total;
                })
                .catch(() => {})
                .finally(() => {
                    this.preLoading = false;
                });
        },
        

        loadData () {

            let params = this.resolveParams(); 

            //  第一次为query查询用log_search, 否则用page_search
            let search = this.useLogSearch ? loadLog : loadPage;
            search(params)
                .then((res) => {
                    this.tableData = this.fillTableData(res.data && res.data.data || []);

                    if (this.useLogSearch) {
                        this.useLogSearch = false;
                        this.pagination.total = res.data.total || 0;
                    }

                    //  如果翻到最后一页, 并且tableData的数据量达到一整页的数据量
                    //  就预加载数据，并且下次查询用log_search
                    if ((this.pagination.page === this.maxPageNum) && 
                        (this.tableData.length === this.pagination.pageSize)) {
                        this.preLoad();
                    }
                })
                .catch((err) => {
                    this.$error(err && err.data && err.data.mesg || '加载数据失败', '加载数据失败');
                })
                .finally(() => {
                    this.$emit('loaded');
                });
        },


        export () {
            let params = this.resolveParams(); 
            
            loadExport(params)
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
                    this.$error(err && err.data && err.data.mesg || '导出失败', '导出失败');
                })
                .finally(() => {
                    this.$emit('exported');
                });
        },

        handleRowClick (row) {
            this.$emit('row-click', row, this.computeIndex(row.id - 1));
        }
    }
};
</script>