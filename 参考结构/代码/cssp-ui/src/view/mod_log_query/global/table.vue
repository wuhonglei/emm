<template>
    <div class="global-search-tbl-wrapper log-table-wrap">
        <div class="table">
            <el-table
                v-if="!columnSelecting"
                ref="logTable"
                :data="tableData"
                height="100%"
                width="100%"
                :style="{width: '100%', height: '100%', 'overflow-x':'auto'}"
                @filter-change="handleFilterChanged"
                @row-click="handleRowClick">
                <el-table-column 
                    label="序号" 
                    width="80px">
                    <template v-slot="scope">
                        <span>{{ computeIndex(scope.$index) }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    v-for="column in columnDisplay"
                    :key="column.value"
                    :label="column.text"
                    :prop="column.value"
                    show-overflow-tooltip>
                    <template v-slot="{ row }">
                        <span
                            v-if="column.value === 'level'"
                            :class="getLevelTextCls(row)">
                            {{ row.level }}
                        </span>
                        <span v-else>{{ row[column.value] || '-' }}</span>
                    </template>
                </el-table-column>
                <el-table-column 
                    label="详情" 
                    width="50">
                    <template v-slot="scope">
                        <el-popover 
                            placement="left" 
                            trigger="click">
                            <table-detail
                                :index="computeIndex(scope.$index)" 
                                :configures="getColumnDetail(scope.row)" 
                                :detail-data="scope.row" />
                            <a 
                                slot="reference" 
                                href="javascript:void(0);">
                                查看
                            </a> 
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column
                    key="$select"
                    prop="$select"
                    label="" 
                    width="40"
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
 * 文件审计日志表格
 */

import table from 'src/common/mixins/table';
import tableColumnFilter from 'src/common/mixins/table_column_filter';
import tableDataHandler from 'src/common/mixins/table_data_handler';
import { loadLog, loadPage, loadExport } from 'src/common/api/log';
import { createNamespacedHelpers } from 'vuex';
import loadFile from 'src/utils/loadfile';
import tableDetail from 'src/common/components/table_detail';
import logParamsHelper from 'src/utils/log_params_helper';
import buildTableDeailConfig from 'src/common/lib/table_detail_builder';
import rules from './api_params.rules';
import paginationLoading from 'src/common/components/pagination_loading';

let { mapGetters } = createNamespacedHelpers('query');
import columns from './columns';

export default {
    components: {tableDetail, paginationLoading},
    mixins: [table, tableColumnFilter, tableDataHandler],
    
    data () {
        return {
            tableData: [],
            columns,
            useLogSearch: true,
            loading: false,
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
            return {
                page: this.pagination.page + preLoad, // 查询第x页的数据，default 1
                num_per_page: this.pagination.pageSize, // 每一页多少条数据，default 20
                order: false
            };
        },

        resolveParams (preload = 0) {
            let controlPara = this.resolveControlPara(this.storeParams, this.resolveLoadParams(preload));
            return logParamsHelper(
                this.storeParams, 
                rules, 
                this.storeParams.product || 'all_log', 
                '', 
                controlPara
            );
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

        getColumnDetail (row) {
            let params = [row.product, row.type];
            if (row.product === 'ac' && row.type === 'netsafe') {
                row.identify && params.push(row.identify);
            }
            let detailConfig = buildTableDeailConfig(...params);

            if (
                Array.isArray(detailConfig.nameList) && 
                detailConfig.nameList.length > 0 &&
                Array.isArray(detailConfig.detail)
            ) {
                detailConfig.detail.unshift({
                    key: 'log_type_name',
                    name: '日志类型'
                });
                row.log_type_name = row.log_type_name || detailConfig.nameList.pop();
            }

            return detailConfig.detail;
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