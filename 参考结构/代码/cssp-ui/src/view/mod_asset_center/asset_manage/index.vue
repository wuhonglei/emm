<template>
    <div class="asset-management-wrapper content-page">
        <sf-light-tree :show-toolbar="false"
                       :data="treeData"
                       default-height="100%"
                       @select-node="selectTreeNode" />
        <div class="asset-management-content">
            <toolbar class="asset-management-toolbar">
                <toolbar-button
                    text="刷新"
                    icon="refresh"
                    @click.native="loadData" />
                <toolbar-button
                    text="新增"
                    icon="add"
                    @click.native="addAsset" />
                <el-popover
                    v-if="disableDelete && selectTableData.length"
                    trigger="hover">
                    <div>
                        <p>已选中内置应用，内置应用不可删除</p>
                    </div>
                    <div 
                        slot="reference" 
                        class="simulate_mask"></div>
                </el-popover>
                <toolbar-button
                    text="删除"
                    icon="delete"
                    :disabled="disableDelete"
                    @click.native="preDeleteAssetManage" />
                <toolbar-button
                    text="启用"
                    icon="enable"
                    :disabled="disableAssetDialog"
                    @click.native="enableAssetManage(true)" />
                <toolbar-button
                    text="禁用"
                    icon="disable"
                    :disabled="disableAssetDialog"
                    @click.native="disableAssetManage(false)" />
                
                <slot name="query">
                    <div class="search-content">
                        <el-input
                            v-model="search_str"
                            class="search-content-item"
                            placeholder="搜索资产名称、IP、备注"
                            size="small"
                            icon="search"
                            :on-icon-click="handleIconClick"
                            @keyup.native.enter="handleIconClick" />
                    </div>
                </slot>
            </toolbar>

            <div class="table">
                <el-table
                    v-loading="loading"
                    :data="tableData"
                    style="width:100%; hright:100%;"
                    height="100%"
                    width="100%"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" />
                    <el-table-column
                        label="序号"
                        width="50">
                        <template slot-scope="scope">
                            <span>{{ computeIndex(scope.$index) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="资产名称"
                        width="120"
                        show-overflow-tooltip>
                        <template slot-scope="scope"> 
                            <text-btn
                                :text="scope.row.name"
                                @click.native="updateAsset(scope.row)" />
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="IP地址"
                        prop="ip"
                        width="120" />
                    <el-table-column
                        label="重要程度"
                        prop="degree"
                        width="80">
                        <template slot-scope="scope">
                            {{ scope.row.degree | degree }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="类型"
                        width="120"
                        show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{ scope.row._type | type }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="今日传输日志量"
                        width="110">
                        <template slot-scope="scope">
                            {{ scope.row.today_log | log }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="传输总量"
                        width="100">
                        <template slot-scope="scope">
                            {{ scope.row.total_log | log }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="最近同步时间"
                        prop="last_up"
                        width="140" />
                    <el-table-column
                        label="接入状态"
                        width="80"
                        align="center">
                        <template slot-scope="scope">
                            <span :style="{color: scope.row.status === 'normal' ? '#22b07b' : '#f44'}">{{ scope.row.status | status }}</span>
                            <popover v-if="scope.row.status === 'abnormal' || !scope.row.status_up">
                                <span>{{ scope.row.status === 'normal' ? '该设备在24小时无日志上报' : '该设备网络断开，接入异常' }}</span>
                            </popover>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="备注"
                        show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{ scope.row.comment }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="日志上传权限"
                        width="100"
                        align="center">
                        <template slot-scope="scope">
                            <toolbar-button
                                :icon="scope.row.enable ? 'enable' : 'disable'"
                                text=""
                                :title="scope.row.enable ? '点击禁用' : '点击启用'"
                                @click.native="scope.row.enable ? disableAssetManage(scope.row) : enableAssetManage(scope.row)" />
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination">
                <el-pagination
                    :current-page="pagination.page"
                    :total="pagination.total"
                    :page-size="pagination.pageSize"
                    :page-sizes="pagination.pageSizes"
                    layout="total, sizes, prev, pager, next, jumper"
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange" />
            </div>

            <dialog-asset
                ref="dialogAsset"
                @load-table-data="loadData" />
        </div>
    </div>
</template>

<script>

/**
 * 资产设置
 */

import Toolbar from 'src/common/components/toolbar/toolbar';
import ToolbarButton from 'src/common/components/toolbar/toolbar_button';
import TextBtn from 'src/common/components/table_text_btn';
import table from 'src/common/mixins/table';
import Popover from 'src/common/components/form_tips/popover_error';
import DialogAsset from './dialog/asset';
import { 
    getAssetManage,
    setAssetManage,
    delAssetManage
} from 'src/common/api/asset_center';
import { ASSETGROUP, COLLECTOR_TYPES } from 'src/utils/consts';

export default {
    components: {
        Toolbar,
        ToolbarButton,
        TextBtn,
        Popover,
        DialogAsset
    },

    filters: {
        degree (degree) {
            if (degree === 'general') {
                return '一般';
            }
            return '重要';
        },

        status (status) {
            if (status === 'normal') {
                return '正常';
            }
            return '异常';
        },

        type (type) {
            if (type === 'sangfor') {
                return '深信服接入';
            }

            let item = COLLECTOR_TYPES.filter((item) => item.value === type);
            return item.length ? item[0].name : '-';
        },

        log (log) {

            //取小数点后两位
            let getFixedTwo = (str) => {
                return str.toString().match(/^\d+(?:\.\d{0,2})?/);
            };

            // eslint-disable-next-line no-magic-numbers
            const UNIT = 1024;
            let logMB = getFixedTwo(log);
            let logKB = getFixedTwo(log * UNIT);
            let logGB = getFixedTwo(log / UNIT);
            let logByte = getFixedTwo(log * UNIT * UNIT);
            let logTB = getFixedTwo(logGB / UNIT / UNIT);
            
            if (log === '0') {
                return `${logMB}MB`;
            } else if (log < (1 / UNIT / UNIT) || logKB < 1) {
                return `${logByte}B`;
            } else if (log < (1 / UNIT) || log < 1) {
                return `${logKB}KB`;
            } else if (log > UNIT) {
                return `${logGB}GB`;
            } else if (log > UNIT * UNIT) {
                return `${logTB}TB`;
            }
            return `${logMB}MB`;
        }
    },
    mixins: [table], 
    data () {
        return {
            tableData: [],
            selectTableData: [],
            loading: false,
            search_str: '',
            asset_type: 'all',
            treeData: [{
                id: 'all',
                name: '所有资产',
                selected: true,
                expanded: true,
                children: ASSETGROUP
            }]
        };
    },
    computed: {

        //内置资产不可删除
        disableDelete () {

            //筛选勾选的内置资产
            let sangforTypeCollector = 
                this.selectTableData.filter((item) => item._type === 'sangfor');
            return sangforTypeCollector.length !== 0 ||
                !this.selectTableData.length;
        },

        //所有资产均可采用禁用
        disableAssetDialog () {
            return !this.selectTableData.length;
        }
        
    },
    mounted () {
        this.loadData();
        this.$on('load-data', () => {
            this.tableData = [];
            this.loadData();
        });
    },
    methods: {

        // 类别查询数据
        resolveLoadParams () {
            return {
                page: this.pagination.page,
                num_per_page: this.pagination.pageSize,
                asset_type: this.asset_type,
                search_str: this.search_str
            };
        },

        // 删除元素
        resolveDeleteParams (row) {
            if (row && row.id) {
                return {
                    ids: [row.id]
                };
            }
            return {
                ids: this.selectTableData.map((item) => item.id)
            };
        },

        // 删除弹框提示
        preDeleteAssetManage () {
            let count = this.selectTableData.length;
            this.$confirm('删除资产后，保留原始日志，不再生成新的应用日志', `确定要删除这${count}个资产吗？`, {
                type: 'warning'
            })
                .then(() => {
                    this.delAssetManage();
                })
                .catch(() => {});
        },

        // 列表数据
        loadData () {
            this.loading = true;
            let params = this.resolveLoadParams();
            getAssetManage(params)
                .then((res) => {
                    this.tableData = res.data.data || [];
                    this.pagination.total = res.data.total || 0;
                    this.loading = false;
                })
                .catch((err) => {
                    this.loading = false;
                    this.$error((err.data && err.data.mesg) || '资产数据获取失败');
                });
        },

        // 新增资产弹框
        addAsset () {
            if (this.$refs && this.$refs.dialogAsset) {
                let params = {
                    group: this.asset_type
                };
                this.$refs.dialogAsset.$emit('open', params);
            }
        },

        // 编辑资产弹框
        updateAsset (row) {
            if (this.$refs && this.$refs.dialogAsset) {
                this.$refs.dialogAsset.$emit('open', row);
            }
        },

        // 删除资产
        delAssetManage () {
            this.loading = true;
            let params = this.resolveDeleteParams();
            delAssetManage(params)
                .then(() => {
                    this.$message('资产已删除');
                    this.loadData();
                })
                .catch((err) => {
                    this.loading = false;
                    this.$error(err.data.mesg);
                });
        },

        // 启用资产
        enableAssetManage (row) {
            let params = this.resolveDeleteParams(row);
            params.op = true;
            this.setAssetManage(params, '启用');
        },

        // 禁用资产
        disableAssetManage (row) {
            let params = this.resolveDeleteParams(row);
            params.op = false;
            this.setAssetManage(params, '禁用');
        },

        // 禁用启用资产接口
        setAssetManage (params, msg) {
            setAssetManage(params)
                .then(() => {
                    this.$message(`资产${msg}日志上传权限`);
                    this.loadData();
                })
                .catch((err) => {
                    this.$error((err.data && err.data.mesg) || `资产${msg}日志上传权限失败`);
                });
        },
        
        // 复选框选中的数据
        handleSelectionChange (v) {
            this.selectTableData = v;
        },

        // 搜索输入框
        handleIconClick () {
            this.pagination.page = 1;
            this.loadData();
        },

        // 选择
        selectTreeNode (record) {
            this.asset_type = record.id;
            this.pagination.page = 1;
            this.loadData();
        }

    }
};
</script>

<style lang="postcss">

@import "src/common/assets/css/var.css";
.asset-management-wrapper {
    height: 100%;
    display: flex;
    position: relative;
    flex-shrink: 1;
    flex-direction: column;
    background-color: var(--panel-bg-color);
    & .asset-management-content {
        position: absolute;
        top: 0;
        left: 230px;
        width: calc(100% - 230px);
        height: 100%;
    }
    & .search-content {
        float:right;
        margin-right: 10px;
        & .search-content-item {
            display: inline-block;
            width: 100%;
        }
    }
    & .table {
        position: absolute;
        top: 44px;
        display: flex;
        width: 100%;
        height: calc(100% - 92px);
        box-sizing: border-box;
        overflow: auto;
        & .el-icon-information{
            position: absolute;
            top: 11px;
            right: 12px;
        }
    }
    & .simulate_mask{
        display: inline-block;
        width: 70px;
        height: 40px;
        position: absolute;
        z-index: 10;
        cursor: not-allowed;
    }
}
</style>
