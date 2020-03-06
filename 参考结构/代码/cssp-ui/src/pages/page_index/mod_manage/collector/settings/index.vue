<template>
    <div class="collector-settings-wrapper content-page">
        <toolbar>
            <toolbar-button
                text="刷新"
                icon="refresh"
                @click.native="loadData" />
            <el-popover
                v-if="!canAddCollector"
                trigger="hover">
                <div>
                    <p>无可用的日志接入授权，不可新增采集器</p>
                    <p>1、前往平台授权页面导入授权</p>
                    <p>2、联系厂商购买</p>
                </div>
                <div 
                    slot="reference" 
                    class="simulate_mask"></div>
            </el-popover>
            <toolbar-button
                text="新增"
                icon="add"
                :disabled="!canAddCollector"
                @click.native="addCollector" />
            <toolbar-button
                text="删除"
                icon="delete"
                :disabled="disableDelete"
                :title="disableDelete ? '检测到您选择了深信服内置应用，内置应用不可删除' : ''"
                @click.native="preDeleteCollector" />
            <toolbar-button
                text="启用"
                icon="enable"
                :disabled="disableCollectDialog"
                @click.native="enableCollector" />
            <toolbar-button
                text="禁用"
                icon="disable"
                :disabled="disableCollectDialog"
                @click.native="disableCollector" />
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
                    label="采集器名称"
                    width="120"
                    show-overflow-tooltip>
                    <template slot-scope="scope"> 
                        <text-btn
                            :text="scope.row.name"
                            @click.native="updataCollector(scope.row)" />
                    </template>
                </el-table-column>
                <el-table-column
                    label="IP地址"
                    prop="ip"
                    width="120" />
                <el-table-column
                    label="类型"
                    prop="plugin_name"
                    show-overflow-tooltip />
                <el-table-column
                    label="接入方式"
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
                    label="传输日志总量"
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
                    label="运行状态"
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
                            @click.native="scope.row.enable ? disableCollector(scope.row) : enableCollector(scope.row)" />
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
        <dialog-collector
            ref="dialogCollector"
            @refresh-auth="getAuth"
            @load-table-data="loadData" />
    </div>
</template>

<script>

/**
 * 采集器设置
 */

import toolbar from 'src/common/components/toolbar/toolbar';
import toolbarButton from 'src/common/components/toolbar/toolbar_button';
import textBtn from 'src/common/components/table_text_btn';
import dialogCollector from './dialog/collector';
import table from 'src/common/mixins/table';
import { 
    getAllCollector,
    deleteCollectors,
    enableCollectors,
    disableCollectors,
    getAuthInfo
} from 'src/common/api/asset_center';
import popover from 'src/common/components/form_tips/popover_error';
import { DAY } from 'src/utils/consts';
export default {
    components: {
        toolbar,
        toolbarButton,
        textBtn,
        dialogCollector,
        popover
    },

    filters: {
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
            return type;
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
            canAddCollector: false
        };
    },
    computed: {

        //内置采集器不可删除
        disableDelete () {

            //筛选勾选的内置采集器
            let sangforTypeCollector = 
                this.selectTableData.filter((item) => item._type === 'sangfor');
            return sangforTypeCollector.length !== 0 ||
                !this.selectTableData.length;
        },

        //所有采集器均可采用禁用
        disableCollectDialog () {
            return !this.selectTableData.length;
        }
        
    },
    mounted () {
        this.loadData();
        this.getAuth();
    },
    methods: {

        //比较最近同步时间与现在时刻
        computeLastUp (row) {
            if (!row) {
                return;
            }
            let lastUpGmt = new Date(row.last_up).getTime();
            let nowTime = new Date().getTime();
            if (nowTime - lastUpGmt > DAY) {
                return true;
            }
        },

        resolveLoadParams () {
            return {
                page: this.pagination.page,
                num_per_page: this.pagination.pageSize
            };
        },
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

        preDeleteCollector () {
            let count = this.selectTableData.length;
            this.$confirm('删除采集器后，不能采集到对应应用日志', `确定要删除这${count}个采集器吗？`, {
                type: 'warning'
            })
                .then(() => {
                    this.deleteCollector();
                })
                .catch(() => {});
        },

        loadData () {
            this.loading = true;
            let params = this.resolveLoadParams();
            getAllCollector(params)
                .then((res) => {
                    this.tableData = res.data.data || [];
                    this.pagination.total = res.data.total || 0;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },

        getAuth () {
            this.canAddCollector = false;
            getAuthInfo()
                .then((res) => {
                    this.canAddCollector = res.data.data.auth_available;
                });
        },

        addCollector () {
            if (this.$refs.dialogCollector) {
                this.$refs.dialogCollector.$emit('open');
            }
        },

        updataCollector (row) {
            if (this.$refs.dialogCollector) {
                this.$refs.dialogCollector.$emit('open', row);
            }
        },

        deleteCollector () {
            this.loading = true;
            let params = this.resolveDeleteParams();
            deleteCollectors(params)
                .then(() => {
                    this.$message('采集器已删除');
                    this.loadData();
                    this.getAuth();
                    this.loading = false;
                })
                .catch((err) => {
                    this.loading = false;
                    this.$error(err.data.mesg);
                });
        },

        enableCollector (row) {
            let params = this.resolveDeleteParams(row);
            enableCollectors(params)
                .then(() => {
                    this.$message('采集器已启用');
                    this.loadData();
                })
                .catch((err) => {
                    this.$error((err.data && err.data.mesg) || '采集器启用失败');
                });
        },

        disableCollector (row) {
            let params = this.resolveDeleteParams(row);
            disableCollectors(params)
                .then(() => {
                    this.$message('采集器已禁用');
                    this.loadData();
                })
                .catch((err) => {
                    this.$error((err.data && err.data.mesg) || '采集器禁用失败');
                });
        },
 
        handleCurrentChange (page) {
            this.pagination.page = page;
            this.loadData(); 
        },
        
        handleSizeChange (size) {
            this.pagination.pageSize = size;
            if (this.pagination.page === 1) {
                this.loadData();
            } else {
                this.pagination.page = 1;
            }
        },

        handleSelectionChange (v) {
            this.selectTableData = v;
        }

    }
};
</script>

<style lang="postcss">

@import "src/common/assets/css/var.css";
.collector-settings-wrapper {
    height: 100%;
    display: flex;
    position: relative;
    flex-shrink: 1;
    flex-direction: column;
    background-color: var(--panel-bg-color);
    & .table {
        position: absolute;
        top: 44px;
        display: flex;
        height: calc(100% - 92px);
        width: 100%;
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
