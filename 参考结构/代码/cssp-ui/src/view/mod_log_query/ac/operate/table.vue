<template lang="pug">
.ac-operate-table-wrapper.log-table-wrap
    .table
        el-table(v-if="!columnSelecting"
            :data="tableData"
            :style="{width: '100%', height: '100%', 'overflow-x':'auto'}"
            width="100%"
            height="100%"
            @filter-change="handleFilterChanged")
            
            el-table-column(label="序号" width="80px")
                template(slot-scope="scope")
                    span {{computeIndex(scope.$index)}}
            el-table-column(label="用户名" v-if="columnShows.user_name" prop="user_name" min-width="100px" show-overflow-tooltip)
            el-table-column(label="主机IP" v-if="columnShows.ip_addr" prop="ip_addr" min-width="100px" show-overflow-tooltip)
            el-table-column(label="操作对象" v-if="columnShows.obj_type" prop="obj_type" min-width="100px" show-overflow-tooltip)
            el-table-column(label="操作" v-if="columnShows.opr_type" prop="opr_type" min-width="50px" show-overflow-tooltip)
            el-table-column(label="日期时间" v-if="columnShows.time" prop="time" min-width="150px" show-overflow-tooltip)
            el-table-column(label="描述" v-if="columnShows.depict" prop="depict" min-width="200px" show-overflow-tooltip)
            el-table-column(label="详细" width="50px")
                template(slot-scope="scope")
                    el-popover(placement="left" trigger="click" content="aaaa")
                        table-detail(:index="computeIndex(scope.$index)"
                            id="value"
                            name="text"
                            :configures="columns" 
                            :detailData="scope.row")
                        a(slot="reference" href="javascript:void(0);") 查看
            el-table-column(label="" width="40px" prop="$select" :filters="columns" :filtered-value="selectedColumns")
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
 * 操作日志 查询表格
 */

import table from 'src/common/mixins/table';
import tableDataHandler from 'src/common/mixins/table_data_handler';
import tableColumnFilter from 'src/common/mixins/table_column_filter';
import { loadLog, loadPage, loadExport } from 'src/common/api/log';
import logParamsHelper from 'src/utils/log_params_helper';
import { createNamespacedHelpers } from 'vuex';
import tableDetail from 'src/common/components/table_detail';
import { COLUMNS } from './consts.js';
import loadFile from 'src/utils/loadfile';
import paginationLoading from 'src/common/components/pagination_loading';
import paramsRules from './api_params_rules.js';

let { mapGetters } = createNamespacedHelpers('query');
export default {
    components: {tableDetail, paginationLoading},
    mixins: [table, tableDataHandler, tableColumnFilter],
    
    data () {
        return {
            tableData: [{}],
            useLogSearch: true,
            loading: false,
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

        resolveParams (preload = 0) {
            let controlPara = this.resolveControlPara(this.storeParams, this.resolveLoadParams(preload));
            return logParamsHelper(this.storeParams, paramsRules, 'ac', 'operate', controlPara);
        },

        loadData () {

            let params = this.resolveParams();   //查询参数

            //  第一次为query查询用log_search, 否则用turn_search
            let search = this.useLogSearch ? loadLog : loadPage;

            this.tableData = [];
            search(params)
                .then(({data}) => {
                    this.tableData =  this.fillTableData(data.data || []); // 注意为空处理
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
                    this.$emit('loaded'); 
                });
        },

        preLoad () {
            let params = this.resolveParams(1);                                  //查询参数
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
            let params = this.resolveParams();                                //查询参数
            
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
                    this.$error(err, '导出失败');
                })
                .finally(() => {
                    this.$emit('exported');
                });
        }
    }
};
</script>