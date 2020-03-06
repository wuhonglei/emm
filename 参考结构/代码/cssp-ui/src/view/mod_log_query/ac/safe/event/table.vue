<template lang="pug">
.ac-event-table-wrapper.log-table-wrap
    .table
        el-table(:data="tableData"
            @row-click="handleRowClick"
            v-if="!columnSelecting"
            @filter-change="handleFilterChanged"
            :style="{width: '100%', height: '100%', 'overflow-x':'auto'}"
            height="100%")
            
            el-table-column(label="序号" min-width="80px")
                template(slot-scope="scope")
                    span {{computeIndex(scope.$index)}}
            el-table-column(label="优先级" v-if="columnShows.priority" prop="priority" min-width="150px")
            el-table-column(label="主机IP" v-if="columnShows.src_ip" prop="src_ip" min-width="150px")
            el-table-column(label="终端类型" v-if="columnShows.tm_name" prop="tm_name" min-width="150px")
            el-table-column(label="位置" v-if="columnShows.site_name" prop="site_name" min-width="150px")
            el-table-column(label="目标IP" v-if="columnShows.dst_ip" prop="dst_ip" min-width="150px")
            el-table-column(label="规则编号" v-if="columnShows.sid" prop="sid" min-width="150px")
            el-table-column(label="源端口" v-if="columnShows.src_port" prop="src_port" min-width="150px")
            el-table-column(label="目的端口" v-if="columnShows.dst_port" prop="dst_port" min-width="150px")
            el-table-column(label="协议" v-if="columnShows.protocol" prop="protocol" min-width="150px")
            el-table-column(label="防御动作" v-if="columnShows.net_action" prop="net_action" min-width="150px")
            el-table-column(label="防御类型" v-if="columnShows.sigclass" prop="sigclass" min-width="150px")
            el-table-column(label="时间" v-if="columnShows.time" prop="time" min-width="150px")
            el-table-column(label="描述" v-if="columnShows.signame" prop="signame" min-width="150px")
            el-table-column(label="引用链接" v-if="columnShows.ref" prop="ref" min-width="150px")
            el-table-column(label="详情" width="50px")
                template(slot-scope="scope")
                    el-popover(placement="left" trigger="click")
                        table-detail(:index="computeIndex(scope.$index)" 
                            :configures="columns"
                            :detailData="scope.row" 
                            id="value"
                            name="text")
                        a(slot="reference" href="javascript:void(0);") 查看
            el-table-column(label="" 
                width="40"
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
 * edr 安全日志查询表格
 */
              
/* eslint-disable no-magic-numbers */
import table from 'src/common/mixins/table';
import tableDataHandler from 'src/common/mixins/table_data_handler';
import tableColumnFilter from 'src/common/mixins/table_column_filter';
import { createNamespacedHelpers } from 'vuex';
import { loadLog, loadPage, loadExport } from 'src/common/api/log';
import tableDetail from 'src/common/components/table_detail';
import { exchangeTimeOrder } from 'src/utils/api_help';
import { TIME_ORDER } from 'src/utils/consts';
import { COLUMNS } from './consts.js';
import loadFile from 'src/utils/loadfile';
import logParamsHelper from 'src/utils/log_params_helper';
import rules from './api_params_rules';
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
            columns: COLUMNS,
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

        this.$emit('load-data');
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
            return logParamsHelper(this.storeParams, rules, 'ac', 'ips', controlPara);
        },

        loadData () {

            let params = this.resolveParams();

            //  第一次为query查询用log_search, 否则用turn_search
            let search = this.useLogSearch ? loadLog : loadPage;

            this.tableData = [];
            search(params)
                .then(({data}) => {
                    this.tableData = data.data || []; // 注意为空处理
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
                    this.$error(err && err.data && err.data.mesg || '加载数据失败', '加载数据失败');
                })
                .finally(() => {
                    this.$emit('loaded', {tableData: this.tableData, startIndex: this.computeIndex(0)});
                });
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
                    this.$message.error({
                        message: '导出失败.' + err.message || (err.data && err.data.message) || ''
                    });
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
