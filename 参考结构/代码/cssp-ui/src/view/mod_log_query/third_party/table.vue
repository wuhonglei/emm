<template>
    <div class="third-party-table-wrapper log-table-wrap">
        <div class="table">
            <el-table 
                v-if="!columnSelecting"
                ref="logTable"
                :data="tableData"
                height="100%"
                style="height: 100%;width: 100%"
                width="100%"
                @filter-change="handleFilterChanged">
                <el-table-column 
                    label="序号"
                    width="80px">
                    <template slot-scope="scope">
                        <span>{{ computeIndex(scope.$index) }}</span>
                    </template>
                </el-table-column>
                <el-table-column 
                    v-if="columnShows.time"
                    label="时间"
                    prop="time"
                    show-overflow-tooltip="show-overflow-tooltip"
                    min-width="110" />
                <el-table-column 
                    v-if="columnShows.collector_name"
                    label="采集器名称/IP"
                    prop="collector_name"
                    min-width="140"
                    show-overflow-tooltip="show-overflow-tooltip" />
                <el-table-column 
                    v-if="columnShows.plugin_name"
                    label="采集器类型"
                    prop="plugin_name"
                    min-width="140"
                    show-overflow-tooltip="show-overflow-tooltip" />
                <el-table-column 
                    v-if="columnShows.log_from"
                    label="采集器来源"
                    prop="log_from"
                    min-width="100"
                    show-overflow-tooltip="show-overflow-tooltip" />
                <el-table-column 
                    v-if="columnShows.level"
                    label="等级"
                    prop="level"
                    show-overflow-tooltip="show-overflow-tooltip"
                    min-width="50" />
                <el-table-column 
                    v-if="columnShows.subtype"
                    label="日志类型"
                    prop="subtype"
                    show-overflow-tooltip="show-overflow-tooltip"
                    min-width="150" />
                <el-table-column 
                    v-if="columnShows.src_ip"
                    label="源IP"
                    min-width="140"
                    show-overflow-tooltip="show-overflow-tooltip"
                    prop="src_ip" />
                <el-table-column 
                    v-if="columnShows.src_port"
                    label="源端口"
                    prop="src_port"
                    show-overflow-tooltip="show-overflow-tooltip"
                    min-width="90" />
                <el-table-column 
                    v-if="columnShows.dst_ip"
                    label="目的IP"
                    min-width="140"
                    show-overflow-tooltip="show-overflow-tooltip"
                    prop="dst_ip" />
                <el-table-column 
                    v-if="columnShows.dst_port"
                    label="目的端口"
                    prop="dst_port"
                    show-overflow-tooltip="show-overflow-tooltip"
                    min-width="90" />
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
                    key="$select"
                    label=""
                    width="40"
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
 * 第三方日志表格
 */

import table from 'src/common/mixins/table';
import tableColumnFilter from 'src/common/mixins/table_column_filter';
import tableDataHandler from 'src/common/mixins/table_data_handler';
import { loadLog, loadPage, loadExport } from 'src/common/api/log';
import { createNamespacedHelpers } from 'vuex';
import loadFile from 'src/utils/loadfile';
import rules from './api_params_rules';
import logParamsHelper from 'src/utils/log_params_helper';
import paginationLoading from 'src/common/components/pagination_loading';
import tableDetail from 'src/common/components/table_detail';

let { mapGetters } = createNamespacedHelpers('query');

export default {
    components: {tableDetail, paginationLoading},
    
    mixins: [table, tableColumnFilter, tableDataHandler],
    
    data () {
        return {
            tableData: [],
            columns: [{
                text: '时间',
                value: 'time',
                default: true
            }, {
                text: '采集器名称/IP',
                value: 'collector_name',
                default: true
            }, {
                text: '采集器来源',
                value: 'log_from',
                default: true
            }, {
                text: '采集器类型',
                value: 'plugin_name',
                default: true
            }, {
                text: '等级',
                value: 'level',
                default: true
            }, {
                text: '日志类型',
                value: 'subtype',
                default: true
            }, {
                text: '源IP',
                value: 'src_ip',
                default: true
            }, {
                text: '源端口',
                value: 'src_port',
                default: true
            }, {
                text: '目的IP',
                value: 'dst_ip',
                default: true
            }, {
                text: '目的端口',
                value: 'dst_port',
                default: true
            }],
            useLogSearch: true,
            loading: false,
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
            this.loadData();
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

        preLoad () {
            let params = this.resolveParams(1);                               //查询参数
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

        resolveParams (preload = 0) {
            let controlPara = this.resolveControlPara(this.storeParams, this.resolveLoadParams(preload));
            return logParamsHelper(this.storeParams, rules, 'tp', 'tc', controlPara);
        },
        

        loadData () {

            let params = this.resolveParams();

            //  第一次为query查询用log_search, 否则用page_search
            let search = this.useLogSearch ? loadLog : loadPage;
            search(params)
                .then((res) => {
                    this.tableData = res.data && res.data.data || [];

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
                    this.$error(err, '加载数据失败');
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
        }
    }
};
</script>
