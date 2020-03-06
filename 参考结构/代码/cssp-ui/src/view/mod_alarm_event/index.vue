<template>
    <div class="alarm-event-wrapper content-page">
        <split-panel @layout="handleLayout">
            <toolbar>
                <toolbar-button
                    text="刷新"
                    icon="refresh"
                    @click.native="loadData" />      
            
                <slot name="query">
                    <div class="search-content">
                        <el-button 
                            class="search-more-btn"
                            @click="searchMore($event)">
                            <svg-icon icon-class="filter" />
                            更多筛选
                        </el-button>
                        <el-form 
                            :rules="rules"
                            class="search-content-item">
                            <el-form-item prop="search_str">
                                <el-input
                                    v-model="search_str"
                                    placeholder="搜索策略名称、资产名称、资产IP"
                                    size="small"
                                    icon="search"
                                    :on-icon-click="handleIconClick"
                                    @keyup.native.enter="handleIconClick" />
                            </el-form-item>
                        </el-form>
                    </div>
                </slot>
            </toolbar>
            <div class="table">
                <el-table
                    ref="alarmTable"
                    v-loading="loading"
                    :data="alarmEventTableData"
                    :style="{width: '100%', height: 'calc(100% - 48px)', 'overflow-x':'auto'}"
                    height="100%"
                    width="100%"
                    highlight-current-row
                    @row-click="handleRowClick">
                    <el-table-column
                        label="序号"
                        width="80">
                        <template slot-scope="scope">
                            <span>{{ computeIndex(scope.$index) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="严重等级"
                        width="100">
                        <template slot-scope="scope">
                            <span 
                                class="level-dot" 
                                :class="[scope.row.level]">
                            </span>
                            {{ scope.row.level | level }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="发现时间"
                        prop="rct_time"
                        width="150"
                        show-overflow-tooltip />
                    <el-table-column
                        label="策略名称"
                        prop="audit_type_name"
                        width="150"
                        show-overflow-tooltip />
                    <el-table-column
                        label="资产名称"
                        prop="collector_name"
                        width="180"
                        show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span :style="scope.row.is_del ? {color: '#ccc'} : ''">
                                {{ scope.row.is_del ? `${scope.row.collector_name}（已删除）` : scope.row.collector_name }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="资产IP"
                        prop="collector_ip"
                        width="150"
                        show-overflow-tooltip />
                    <el-table-column
                        label="事件描述"
                        prop="description"
                        show-overflow-tooltip />
                    <el-table-column
                        label="告警次数"
                        prop="cnt"
                        width="100">
                        <template slot-scope="scope">
                            {{ scope.row.cnt | filterNumUnit }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="状态"
                        prop="status"
                        width="100">
                        <template slot-scope="scope">
                            <span :class="statusList[scope.row.deal_status].className">
                                {{ statusList[scope.row.deal_status].value || '' }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        width="150"
                        align="center">
                        <template slot-scope="scope">
                            <el-dropdown 
                                trigger="click"
                                split-button
                                type="primary"
                                size="small"
                                class="alarm-event-dropdown"
                                @command="(cmd)=>preHandleEvents(cmd, scope.row)">
                                {{ scope.row.deal_status === '0' ? '标记已处理': '标记待处理' }}
                                <el-dropdown-menu 
                                    slot="dropdown"
                                    class="drop-down-btns">
                                    <el-dropdown-item 
                                        v-if="scope.row.deal_status === '0'"
                                        command="1"
                                        class="alarm-event-dropdown-item">
                                        标记已处理
                                    </el-dropdown-item>
                                    <el-dropdown-item 
                                        v-if="scope.row.deal_status === '0'"
                                        command="2"
                                        class="alarm-event-dropdown-item">
                                        标记已忽略
                                    </el-dropdown-item>
                                    <el-dropdown-item 
                                        v-if="scope.row.deal_status === '1' || scope.row.deal_status === '2'"
                                        command="0"
                                        class="alarm-event-dropdown-item">
                                        标记待处理
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>             
                </el-table>
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
            </div>
            <event-details
                slot="detail"
                :data="currentDetails"
                :index="currentIndex"
                @toggle="handleToggleDetail" />
        </split-panel>
        <search-dialog ref="searchDialog" 
                       @confirm="handleSearchDialogConfirm" />
    </div>
</template>

<script>

/**
 * @file 告警事件
 */

import SplitPanel from 'src/common/components/layout/split_panel';
import Toolbar from 'src/common/components/toolbar/toolbar';
import ToolbarButton from 'src/common/components/toolbar/toolbar_button';
import table from 'src/common/mixins/table';
import SearchDialog from './search_dialog';
import EventDetails from './details';
import dayjs from 'dayjs';
import { filterNumUnit } from 'src/common/lib/filters';
import { mapMutations, mapGetters } from 'vuex';
import { LEVELLIST, DEALSTATUS } from 'src/utils/consts';
import eventBus, { BUS_EVENT } from 'src/utils/bus';

import { 
    getAllAlarmEvent,
    handleEvents
} from 'src/common/api/event_alarm';

const SEARCHSTRLENLIMIT = 75;

export default {
    components: {
        SplitPanel,
        Toolbar,
        ToolbarButton,
        SearchDialog,
        EventDetails
    },	
    
    filters: {
        level (level) {
            let item = LEVELLIST.filter((item) => {
                return level === item.key;
            });
            return item[0] && item[0].value;
        },
        filterNumUnit
    },
    mixins: [table], 
    data () {
        return {
            alarmEventTableData: [],
            selectTableData: [],
            loading: false,
            search_str: '',
            form: {
                start_time: '',
                end_time: '',
                level: '',
                deal_status: '0'
            },
            statusList: DEALSTATUS,
            rules: {
                search_str: {
                    trigger: 'change',
                    validator: this.checkSearchStrLen
                }
            },
            formValid: false,
            currentDetails: {},
            currentIndex: 1
        };
    },
    computed: {
        ...mapGetters('splitPanel', ['status'])
    },
    mounted () {
        this.initFormFromQuery();
        this.loadData();
        this.queryed();
        this.$on('load-data', () => {
            this.alarmEventTableData = [];
            this.loadData();
        });
    },
    methods: {
        ...mapMutations('splitPanel', [
            'init',
            'queryed'
        ]),

        // 从url query中获取参数
        initFormFromQuery () {
            let query = this.$route.query;
            this.form = {
                start_time: query.start_time || this.form.start_time,
                end_time: query.end_time || this.form.end_time,
                level: query.level || this.form.level,
                deal_status: query.deal_status || this.form.deal_status
            };
            this.search_str = query.search || this.form.search;
        },

        // 获取列表参数
        resolveLoadParams () {
            let params = {
                page: this.pagination.page,
                num_per_page: this.pagination.pageSize,
                search_str: this.search_str
            };

            params.level = this.form.level;
            params.deal_status = this.form.deal_status;

            if (this.form.start_time) { // 时间为空时，不传参数start_time end_time
                params.start_time = dayjs(this.form.start_time).format('YYYY-MM-DD HH:mm:ss');
            }
            if (this.form.end_time) {
                params.end_time = dayjs(this.form.end_time).format('YYYY-MM-DD HH:mm:ss');
            }

            return params;
        },

        // 标记事件的参数，预留全局标记
        resolveHandleParams (row) {
            if (row && row.event_id) {
                return {
                    event_ids: [row.event_id]
                };
            }
            return {
                event_ids: this.selectTableData.map((item) => item.event_id)
            };
        },

        handleLayout () {
            if (this.$refs.alarmTable) {
                this.$refs.alarmTable.$emit('layout');
            }
        },

        // 列表数据接口
        loadData () {
            this.alarmEventTableData = [];
            this.loading = true;
            let params = this.resolveLoadParams();
            getAllAlarmEvent(params)
                .then((res) => {
                    if (res.data) {
                        this.alarmEventTableData = res.data.data || [];
                        this.currentDetails = res.data.data ? res.data.data[0] : [];
                        this.currentIndex = this.computeIndex(0);
                        this.pagination.total = res.data.total || 0;
                    }
                })
                .catch((err) => {
                    this.$error((err.data && err.data.mesg) || '告警数据获取失败');
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        // 操作弹框提示
        preHandleEvents (cmd, row) {
            this.$confirm(`确定将该事件标记为${this.statusList[cmd].value}吗？`, {
                type: 'warning'
            })
                .then(() => {
                    this.handleEvents(cmd, row);
                })
                .catch(() => {});
        },

        // 标记事件
        handleEvents (cmd, row) {
            let params = this.resolveHandleParams(row);
            params.deal_status = cmd;
            handleEvents(params)
                .then(() => {
                    this.$message('提交成功');
                    this.loadData();
                })
                .catch((err) => {
                    this.$error((err.data && err.data.mesg) || '标记失败');
                });
        },

        handleSearchDialogConfirm (params) {
            this.form = params;
            this.handleIconClick();
        },

        // 搜索输入框，搜索事件
        handleIconClick () {
            if (this.formValid) {
                return;
            }
            this.pagination.page = 1;
            this.loadData();
        },

        // 更多筛选弹框
        searchMore () {
            if (this.$refs && this.$refs.searchDialog) {
                this.$refs.searchDialog.$emit('open', this.form);
            }
        },

        // 检测搜索框的长度
        checkSearchStrLen (rule, value, callback) {
            if (this.search_str && this.search_str.length > SEARCHSTRLENLIMIT) {
                this.formValid = true;
                return callback(new Error('长度不能超过75个字符！'));
            }
            this.formValid = false;
            callback();
        },

        // 点击行查看详情
        handleRowClick (row) {
            this.currentDetails = row;
            this.currentIndex = this.computeIndex(row.id - 1);
        },

        handleToggleDetail (open) {
            eventBus.$emit(BUS_EVENT.TOGGLE_PACKAGE_DETAIL, open);
        }
    }
};
</script>

<style lang="postcss">

@import "src/common/assets/css/var.css";
.alarm-event-wrapper {
    height: 100%;
    display: flex;
    position: relative;
    flex-shrink: 1;
    flex-direction: column;
    background-color: var(--panel-bg-color);
    overflow: hidden !important;
    & .search-content {
        float: right;
        text-align: right;
        & .search-content-item {
            display: inline-block;
            width: 230px;
            margin: 0 8px;
        }
        & .search-more-btn {
            padding: 7px 12px;
            height: 30px;
        }
    }
    & .table {
        position: relative;
        display: flex;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        overflow: auto;
        & .el-icon-information{
            position: absolute;
            top: 11px;
            right: 12px;
        }
        & .level-dot {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 5px;
            margin-right: 10px;
        }
        & .info {
            background: #3DC4BB;
        }
        & .low {
            background: #FFDD55;
        }
        & .middle {
            background: #FF9900;
        }
        & .high {
            background: #F66868;
        }
        & .lost {
            background: #AA0000;
        }
        & .untreated {
            color: #EE5555;
        }
        & .processed {
            color: #22B07B;
        }
        & .neglected {
            color: #495060;
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

.alarm-event-dropdown {
    & .el-button-group .el-button {
        padding: 4px 10px;
    }
    & .el-button-group .el-button:not(:last-child) {
        padding: 4px 10px 4.5px 10px;
    }
    & .drop-down-btns {
        font-size: 12px;
    } 
}
.alarm-event-dropdown-item {
    font-size: 12px;
}

</style>
