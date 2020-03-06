<template>
    <div class="ips-table-wrapper log-table-wrap">
        <div
            ref="dynamicHeightTable"
            class="table">
            <el-table
                v-if="!columnSelecting"
                :data="tableData"
                :style="{width: '100%', height: '100%', 'overflow-x':'auto'}"
                height="100%"
                @row-click="handleRowClick"
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
                    min-width="150px"
                    show-overflow-tooltip />
                <el-table-column
                    v-if="columnShows.attack_type"
                    label="类型"
                    prop="attack_type"
                    width="150px"
                    show-overflow-tooltip />
                <el-table-column
                    v-if="columnShows.protocol"
                    label="协议"
                    prop="protocol"
                    min-width="50px"
                    show-overflow-tooltip />
                <el-table-column
                    v-if="columnShows.src_zone"
                    label="攻击者区域"
                    prop="src_zone"
                    width="150px"
                    show-overflow-tooltip />
                <el-table-column
                    v-if="columnShows.src_ip"
                    label="攻击者IP"
                    prop="src_ip"
                    width="150px"
                    show-overflow-tooltip />
                <el-table-column
                    v-if="columnShows.src_ip_belong"
                    label="攻击者归属地"
                    prop="src_ip_belong"
                    min-width="150px"
                    show-overflow-tooltip />
                <el-table-column
                    v-if="columnShows.url"
                    label="URL/目录"
                    prop="url"
                    min-width="150px"
                    show-overflow-tooltip />
                <el-table-column
                    v-if="columnShows.src_port"
                    label="攻击者端口"
                    prop="src_port"
                    min-width="100px"
                    show-overflow-tooltip />
                <el-table-column
                    v-if="columnShows.dst_zone"
                    label="受攻击者区域"
                    prop="dst_zone"
                    min-width="150px"
                    show-overflow-tooltip />
                <el-table-column
                    v-if="columnShows.dst_ip"
                    label="受攻击者IP"
                    prop="dst_ip"
                    min-width="150px"
                    show-overflow-tooltip />
                <el-table-column
                    v-if="columnShows.dst_port"
                    label="受攻击者端口"
                    prop="dst_port"
                    min-width="150px"
                    show-overflow-tooltip />
                <el-table-column
                    v-if="columnShows.hole_id"
                    label="漏洞ID"
                    prop="hole_id"
                    min-width="100px"
                    show-overflow-tooltip />
                <el-table-column
                    v-if="columnShows.hole_name"
                    label="漏洞名称"
                    prop="hole_name"
                    min-width="80px"
                    show-overflow-tooltip />
                <el-table-column
                    v-if="columnShows.policy_name"
                    label="匹配策略名"
                    prop="policy_name"
                    min-width="100px"
                    show-overflow-tooltip />
                <el-table-column
                    v-if="columnShows.depict"
                    label="描述"
                    prop="depict"
                    min-width="100px"
                    show-overflow-tooltip />
                <el-table-column
                    v-if="columnShows.solution"
                    label="解决方案"
                    prop="solution"
                    min-width="80px"
                    show-overflow-tooltip />
                <el-table-column
                    v-if="columnShows.refernce"
                    label="参考信息"
                    prop="refernce"
                    min-width="80px"
                    show-overflow-tooltip />
                <el-table-column
                    v-if="columnShows.level"
                    label="严重等级"
                    prop="level"
                    min-width="70px">
                    <template slot-scope="scope">
                        <span :title="scope.row.level">
                            <svg-icon :icon-class="prefixLevel(scope.row)" /></span>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="columnShows.net_action"
                    label="动作"
                    prop="net_action"
                    min-width="50px" />
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
                            <a
                                slot="reference"
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
 * ips 日志查询表格
 */

/* eslint-disable no-magic-numbers */
import table from 'src/common/mixins/table';
import tableDataHandler from 'src/common/mixins/table_data_handler';
import dynamicHeightTable from 'src/common/mixins/dynamic_height_table';
import tableColumnFilter from 'src/common/mixins/table_column_filter';
import { loadLog, loadPage, loadExport } from 'src/common/api/log';
import { createNamespacedHelpers } from 'vuex';
import tableDetail from 'src/common/components/table_detail';
import { COLUMNS } from './consts.js';
import loadFile from 'src/utils/loadfile';
import rules from './api_params_rules';
import logParamsHelper from 'src/utils/log_params_helper';
import paginationLoading from 'src/common/components/pagination_loading';

let { mapGetters } = createNamespacedHelpers('query');

export default {
    components: {tableDetail, paginationLoading},
    mixins: [table, dynamicHeightTable, tableColumnFilter, tableDataHandler],

    data () {
        return {
            tableData: [],
            useLogSearch: true,
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
            return {
                page: this.pagination.page + preLoad, // 查询第x页的数据，default 1
                num_per_page: this.pagination.pageSize, // 每一页多少条数据，default 20
                order: false
            };
        },

        resolveParams (preload = 0) {
            let controlPara = this.resolveControlPara(this.storeParams, this.resolveLoadParams(preload));
            return logParamsHelper(this.storeParams, rules, 'af', 'ips', controlPara);
        },

        loadData () {

            let params = this.resolveParams();

            //  第一次为query查询用log_search, 否则用turn_search
            let search = this.useLogSearch ? loadLog : loadPage;

            this.tableData = [];
            search(params)
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

                    // 1、将加载成功的数据传递给父组件
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
                    this.$error(err, '导出失败');
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
