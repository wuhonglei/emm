<template>
    <div class="safe-query-wrapper query">
        <query-dialog v-if="hackReset"
                      ref="hostNameDialog"
                      title="终端"
                      data-label="name"
                      data-key="name"
                      :load-node-data="loadAgents"
                      :load-tree-data="loadGroups"
                      :init-selects="params.hostNameSelects"
                      :init-tree-data="loadedData.userGroupTreeData"
                      @submit="handleHostNameSubmit" />
        <el-form v-model="formValid"
                 :rules="rules"
                 :model="params">
            <div class="query__title">
                时间范围
            </div>
            <time-range-picker :start-date.sync="params.startDate"
                               :start-time.sync="params.startTime"
                               :end-date.sync="params.endDate"
                               :end-time.sync="params.endTime" />
            <div class="query__title bt">
                其他
            </div>
            <div class="query__content">
                <div class="form">
                    <div class="form__label">
                        数据来源
                    </div>
                    <div class="form__content">
                        <el-select v-model="params.uuid"
                                   :loading="loadingStatus.uuid"
                                   no-data-text="没有可查询组件"
                                   @change="resetLists"
                                   @visible-change="handleUuidVisibleChange">
                            <el-option v-for="item in loadedData.uuid"
                                       :key="item.id"
                                       :value="item.uuid"
                                       :label="item.name|uuidIp(item.ip)">
                                <uuid-select-item :data="item" />
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form">
                    <div class="form__label">
                        日志类型
                    </div>
                    <div class="form__content">
                        <el-select v-model="params.type">
                            <el-option v-for="(v, k) in TYPES"
                                       :key="k"
                                       :label="v"
                                       :value="k" />
                        </el-select>
                    </div>
                </div>
                <template v-if="more">
                    <template v-if="params.type === 'flux'">
                        <div class="form">
                            <div class="form__label">
                                {{ QUERY_NAME.flux.visitor }}
                            </div>
                            <div class="form__content">
                                <el-radio-group v-model="params.visitorChoise">
                                    <el-radio label="zone">
                                        业务系统
                                    </el-radio>
                                    <el-radio label="role">
                                        角色
                                    </el-radio>
                                    <el-radio label="agent">
                                        服务器
                                    </el-radio>
                                    <el-radio label="ip">
                                        IP组
                                    </el-radio>
                                </el-radio-group>
                            </div>
                        </div>
                        <div class="form">
                            <div class="form__label"
                                 :style="{visibility: 'hidden'}"></div>
                            <div v-if="params.visitorChoise === 'zone'"
                                 class="form__content">
                                <el-select-tree ref="visitor_zone"
                                                key="zone1"
                                                v-model="params.visitorZoneSelects"
                                                tree-node-key="_path"
                                                tree-label="name"
                                                value-type="node"
                                                placeholder="所有业务系统"
                                                node-deep
                                                multiple
                                                :tree-handle-selected-label="() => resolveEdrSelectTreeLabel('visitor_zone')"
                                                :tree-data="loadedData.edrZone"
                                                :loading="loadingStatus.edrZone"
                                                @visible-change="handleZoneChange" />
                            </div>
                            <div v-if="params.visitorChoise === 'role'"
                                 class="form__content">
                                <el-select-tree ref="visitor_role"
                                                key="role0"
                                                v-model="params.visitorRoleSelects"
                                                tree-node-key="_path"
                                                tree-label="name"
                                                value-type="node"
                                                placeholder="所有角色"
                                                node-deep
                                                multiple
                                                :tree-handle-selected-label="() => resolveEdrSelectTreeLabel('visitor_role')"
                                                :tree-data="loadedData.edrRole"
                                                :loading="loadingStatus.edrRole"
                                                @visible-change="handleRoleChange" />
                            </div>
                            <div v-if="params.visitorChoise === 'agent'"
                                 class="form__content">
                                <el-select-tree ref="visitor_agent"
                                                key="agent0"
                                                v-model="params.visitorAgentSelects"
                                                tree-node-key="_path"
                                                tree-label="name"
                                                value-type="node"
                                                placeholder="所有终端"
                                                node-deep
                                                multiple
                                                :tree-handle-selected-label="() => resolveEdrSelectTreeLabel('visitor_agent')"
                                                :tree-data="loadedData.edrAgent"
                                                :loading="loadingStatus.edrAgent"
                                                @visible-change="handleAgentChange" />
                            </div>
                            <div v-if="params.visitorChoise === 'ip'"
                                 class="form__content">
                                <el-select-tree ref="visitor_ip"
                                                key="ip0"
                                                v-model="params.visitorIpSelects"
                                                tree-node-key="_path"
                                                value-type="node"
                                                tree-label="name"
                                                placeholder="所有IP组"
                                                multiple
                                                node-deep
                                                :tree-handle-selected-label="() => resolveEdrSelectTreeLabel('visitor_ip')"
                                                :tree-data="loadedData.edrIpGroup"
                                                :loading="loadingStatus.edrIpGroup"
                                                @visible-change="handleIpGroupChange" />
                            </div>
                        </div>
                        <div class="form">
                            <div class="form__label">
                                {{ QUERY_NAME.flux.provider }}
                            </div>
                            <div class="form__content">
                                <el-radio-group v-model="params.providerChoise">
                                    <el-radio label="zone">
                                        业务系统
                                    </el-radio>
                                    <el-radio label="role">
                                        角色
                                    </el-radio>
                                    <el-radio label="agent">
                                        服务器
                                    </el-radio>
                                    <el-radio label="ip">
                                        IP组
                                    </el-radio>
                                </el-radio-group>
                            </div>
                        </div>
                        <div class="form">
                            <div class="form__label"
                                 :style="{visibility: 'hidden'}"></div>
                            <div v-if="params.providerChoise === 'zone'"
                                 class="form__content">
                                <el-select-tree ref="provider_zone"
                                                key="zone5"
                                                v-model="params.providerZoneSelects"
                                                tree-node-key="_path"
                                                tree-label="name"
                                                value-type="node"
                                                multiple
                                                node-deep
                                                placeholder="所有业务系统"
                                                :tree-handle-selected-label="() => resolveEdrSelectTreeLabel('provider_zone')"
                                                :tree-data="loadedData.edrZone"
                                                :loading="loadingStatus.edrZone"
                                                @visible-change="handleZoneChange" />
                            </div>
                            <div v-if="params.providerChoise === 'role'"
                                 class="form__content">
                                <el-select-tree ref="provider_role"
                                                key="role0"
                                                v-model="params.providerRoleSelects"
                                                tree-node-key="_path"
                                                tree-label="name"
                                                value-type="node"
                                                placeholder="所有角色"
                                                multiple
                                                node-deep
                                                :tree-handle-selected-label="() => resolveEdrSelectTreeLabel('provider_role')"
                                                :tree-data="loadedData.edrRole"
                                                :loading="loadingStatus.edrRole"
                                                @visible-change="handleRoleChange" />
                            </div>
                            <div v-if="params.providerChoise === 'agent'"
                                 class="form__content">
                                <el-select-tree ref="provider_agent"
                                                key="agent0"
                                                v-model="params.providerAgentSelects"
                                                tree-node-key="_path"
                                                tree-label="name"
                                                value-type="node"
                                                placeholder="所有终端"
                                                multiple
                                                node-deep
                                                :tree-handle-selected-label="() => resolveEdrSelectTreeLabel('provider_agent')"
                                                :tree-data="loadedData.edrAgent"
                                                :loading="loadingStatus.edrAgent"
                                                @visible-change="handleAgentChange" />
                            </div>
                            <div v-if="params.providerChoise === 'ip'"
                                 class="form__content">
                                <el-select-tree ref="provider_ip"
                                                key="ip0"
                                                v-model="params.providerIpSelects"
                                                tree-node-key="_path"
                                                value-type="node"
                                                placeholder="所有IP组"
                                                tree-label="name"
                                                multiple
                                                node-deep
                                                :tree-handle-selected-label="() => resolveEdrSelectTreeLabel('provider_ip')"
                                                :tree-data="loadedData.edrIpGroup"
                                                :loading="loadingStatus.edrIpGroup"
                                                @visible-change="handleIpGroupChange" />
                            </div>
                        </div>
                        <div class="form">
                            <div class="form__label">
                                {{ QUERY_NAME.flux.serviceName }}
                            </div>
                            <div class="form__content">
                                <el-form-item prop="serviceName">
                                    <el-input v-model="params.serviceName"
                                              placeholder="请输入服务或端口" />
                                </el-form-item>
                            </div>
                        </div>
                        <div class="form">
                            <div class="form__label">
                                {{ QUERY_NAME.flux.fluxIp }}
                            </div>
                            <div class="form__content">
                                <el-form-item prop="fluxIp">
                                    <el-input v-model="params.fluxIp"
                                              placeholder="请输入源或目的IP" />
                                </el-form-item>
                            </div>
                        </div>
                        <div class="form">
                            <div class="form__label">
                                {{ QUERY_NAME.flux.process }}
                            </div>
                            <div class="form__content">
                                <el-form-item prop="process">
                                    <el-input v-model="params.process"
                                              placeholder="请输入源或目的进程名称" />
                                </el-form-item>
                            </div>
                        </div>
                        <div class="form">
                            <div class="form__label">
                                {{ QUERY_NAME.flux.netAction }}
                            </div>
                            <div class="form__content">
                                <el-select v-model="params.netAction"
                                           placeholder="访问动作">
                                    <el-option label="不限"
                                               value="" />
                                    <el-option label="允许"
                                               value="允许" />
                                    <el-option label="拒绝"
                                               value="拒绝" />
                                </el-select>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="form">
                            <div class="form__label">
                                {{ QUERY_NAME.other.hostName }}
                            </div>
                            <div class="form__content">
                                <el-input v-model="params.hostNameString"
                                          size="small"
                                          icon="more"
                                          :on-icon-click="showHostNameDialog"
                                          placeholder="所有"
                                          readonly="readonly" />
                            </div>
                        </div>
                        <div class="form">
                            <div class="form__label">
                                {{ QUERY_NAME.other.ipList }}
                            </div>
                            <div class="form__content">
                                <el-form-item prop="ipList">
                                    <el-input v-model="params.ipList"
                                              placeholder="所有" />
                                </el-form-item>
                            </div>
                            <popover :width="300">
                                <p>可以输入单个IP地址，多个IP地址网段或者IP范围</p>
                                <p>多个IP之间请用'，'隔开</p>
                                <p>IPv4网段书写，如192.168.1.0/255.255.255.0</p>
                                <p>IPv6网段书写，如2001:ffe0::2/20</p>
                                <p>地址范围中间用-连接，如192.168.0.1-192.168.0.10</p>
                            </popover>
                        </div>
                    </template>
                </template>
            </div>
        </el-form>
        <div class="query__more"
             @click="more = !more">
            <span>{{ more ? '收起' : '详细条件' }}</span>
            <i :class="more ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
               style="margin-left: 4px;"></i>
        </div>
        <div class="query__button">
            <el-button type="primary"
                       :disabled="!formValid || !params.uuid"
                       @click="submit">
                查询
            </el-button>
            <el-button v-if="status !== 'init'"
                       @click="$emit('hide')">
                关闭
            </el-button>
        </div>
    </div>
</template>
<script>

/**
 * edr日志查询
 */

import { QUERY_NAME } from './consts';
import { DEFAULT_PICKER_OPTIONS } from 'src/utils/consts';
import { TYPES } from './consts';
import popover from 'src/common/components/form_tips/popover';
import { mapMutations, mapGetters } from 'vuex';
import { loadList, loadUuid } from 'src/common/api/log';
import query from 'src/common/mixins/query';
import queryDialog from 'src/common/components/agent_query_dialog';
import { normalizeParams } from 'src/utils/api_help';
import rules from '../edr_rules.js';
import treeHandler from 'src/common/mixins/tree_handler';
import uuidSelectItem from 'src/common/components/uuid_select_item';

let loadEdrUuid = normalizeParams(loadUuid, 'edr');

export default {
    components: {
        queryDialog, popover, uuidSelectItem
    },
    mixins: [query, treeHandler],

    data () {
        return {
            QUERY_NAME,
            DEFAULT_PICKER_OPTIONS,
            TYPES,
            rules,
            more: false,
            formValid: true,
            hackReset: true,
            params: {
                startDate: '',
                startTime: '',
                endDate: '',
                endTime: '',
                uuid: '',
                type: 'flux',
                hostNameSelects: [],
                hostName: [],
                hostNameString: '所有',
                provider: '',
                visitor: '',
                providerIpSelects: [],
                visitorIpSelects: [],
                providerRoleSelects: [],
                visitorRoleSelects: [],
                providerAgentSelects: [],
                visitorAgentSelects: [],
                providerZoneSelects: [],
                visitorZoneSelects: [],
                visitorChoise: 'zone',
                providerChoise: 'zone',
                serviceName: '',
                fluxIp: '',
                ipList: '',
                process: '',
                netAction: ''
            },
            loadingStatus: {
                uuid: false,
                edrIpGroup: false,
                edrRole: false,
                edrAgent: false,
                edrZone: false
            },
            loadedData: {
                uuid: [],
                edrIpGroup: [],
                edrRole: [],
                edrAgent: [],
                edrZone: [],
                userGroupTreeData: []
            },
            queryObj: this.$route.query
        };
    },

    computed: {
        ...mapGetters('query', {
            storeParams: 'params'
        }),
        ...mapGetters('splitPanel', ['status'])
    },

    mounted () {
        this.sync();
        if (this.status === 'init') {

            //第一次加载
            let params = this.params;
            this.initDate(params);
            this.initParams();
            this.loadUuid();
        }
    },

    methods: {
        ...mapMutations('query', ['cacheParams', 'cacheLoadedData']),

        // EDR 下拉树组件显示，不包含子节点，但是实际的传递到后端的值却需要子节点
        // ╮(￣▽￣)╭ hank一下咯，这一段代码需要看组件源码
        resolveEdrSelectTreeLabel (ref) {
            if (!ref) {
                throw new Error('优化lable显示需要指定selectTree的ref');
            }

            let cmp = this.$refs[ref];
            let checkedNodes = cmp.$refs.selectTree.getCheckedNodes(false, false);
            return this.selectedLabel = checkedNodes.map((item) => item[cmp.treeLabel || 'label']).join('，');

        },

        // 初始化cssp风险中心单点过来的查询参数
        initParams () {
            let milliSeconds = 1000; //1秒毫秒数
            let oneMinutes = 60;  //1分钟秒数
            let formatNum = 10;
            if (!Object.keys(this.queryObj).length) {
                return;
            }
            if (this.queryObj.uuid) {
                this.params.uuid = this.queryObj.uuid;
            }
            if (this.queryObj.type) {
                this.params.type = this.queryObj.type;
            }
            if (this.queryObj.src_ip) {
                this.params.ipList = this.queryObj.src_ip;
            }
            if (this.queryObj.start_date) {
                let startDate = new Date(this.queryObj.start_date * milliSeconds);
                this.params.startDate = startDate;
            }
            if (this.queryObj.end_date) {
                let endDate = new Date(this.queryObj.end_date * milliSeconds);
                this.params.endDate = endDate;
            }
            if (this.queryObj.start_date) {
                let date = new Date(this.queryObj.start_date * milliSeconds);
                let hours = date.getHours() >= formatNum ? date.getHours() : '0' + date.getHours();
                let minutes = date.getMinutes() >= formatNum ? date.getMinutes() : '0' + date.getMinutes();
                this.params.startTime = hours + ':' + minutes;
            }
            if (this.queryObj.end_date) {
                let date = new Date(this.queryObj.end_date * milliSeconds + milliSeconds * oneMinutes);
                let hours = date.getHours() >= formatNum ? date.getHours() : '0' + date.getHours();
                let minutes = date.getMinutes() >= formatNum ? date.getMinutes() : '0' + date.getMinutes();
                this.params.endTime = hours + ':' + minutes;
            }
            this.submit();
        },

        resetLists (value) {

            //  当从store中加载值时，不重置
            if (value === this.storeParams.uuid) {
                return;
            }

            this.hackReset = false;
            this.$nextTick(() => this.hackReset = true);
            this.params.provider = '';
            this.params.visitor = '';
            this.params.hostNameSelects = [];
            this.params.hostName = [];
            this.params.hostNameString = '所有';
            this.params.providerIpSelects = [];
            this.params.visitorIpSelects = [];
            this.params.providerRoleSelects = [];
            this.params.visitorRoleSelects = [];
            this.params.providerAgentSelects = [];
            this.params.visitorAgentSelects = [];
            this.params.providerZoneSelects = [];
            this.params.visitorZoneSelects = [];
            this.loadedData.edrIpGroup = [];
            this.loadedData.edrRole = [];
            this.loadedData.edrZone = [];
            this.loadedData.edrAgent = [];
            this.loadedData.userGroupTreeData = [];

        },

        handleUuidVisibleChange (v) {
            if (!v || Array.isArray(this.loadedData.uuid) &&
                this.loadedData.uuid.length > 0) {
                return;
            }
            this.loadUuid();
        },

        loadUuid () {
            if (this.loadingStatus.uuid) {
                return;
            }
            this.loadingStatus.uuid = true;
            loadEdrUuid()
                .then(({ data }) => {
                    this.loadedData.uuid = this.sortedUuid(data.data || []);
                    this.$nextTick(() => {
                        this.params.uuid = this.params.uuid ||
                            (this.loadedData.uuid[0] && this.loadedData.uuid[0].uuid);
                    });
                })
                .finally(() => {
                    this.loadingStatus.uuid = false;
                });
        },

        handleIpGroupChange (v) {
            if (!v || this.loadedData.edrIpGroup.length) {
                return;
            }
            this.loadIpGroup();
        },

        loadIpGroup () {
            if (!this.params.uuid) {
                return;
            }
            this.loadingStatus.edrIpGroup = true;
            loadList(this.normalizedBoxSearchParams(this.params.uuid, 'edr_ip_group'))
                .then(res => {
                    let data = res.data.data || {};
                    data.name = '所有';
                    this.addPath(data);
                    this.loadedData.edrIpGroup = [data];
                })
                .catch(() => { })
                .finally(() => {
                    this.loadingStatus.edrIpGroup = false;
                });
        },

        handleRoleChange (v) {
            if (!v || this.loadedData.edrRole.length) {
                return;
            }
            this.loadRole();
        },

        loadRole () {
            if (!this.params.uuid) {
                return;
            }
            this.loadingStatus.edrRole = true;
            loadList(this.normalizedBoxSearchParams(this.params.uuid, 'edr_role'))
                .then(res => {
                    let data = res.data.data || {};
                    data.name = '所有';
                    this.addPath(data);
                    this.loadedData.edrRole = [data];
                })
                .catch(() => { })
                .finally(() => {
                    this.loadingStatus.edrRole = false;
                });
        },

        handleZoneChange (v) {
            if (!v || this.loadedData.edrZone.length) {
                return;
            }
            this.loadZone();
        },

        loadZone () {
            if (!this.params.uuid) {
                return;
            }
            this.loadingStatus.edrZone = true;
            loadList(this.normalizedBoxSearchParams(this.params.uuid, 'edr_zone'))
                .then(res => {
                    let data = res.data.data || {};
                    data.name = '所有';
                    this.addPath(data);
                    this.loadedData.edrZone = [data];
                })
                .catch(() => { })
                .finally(() => {
                    this.loadingStatus.edrZone = false;
                });
        },

        handleAgentChange (v) {
            if (!v || this.loadedData.edrAgent.length) {
                return;
            }
            this.loadAgent();
        },

        //  微隔离中的服务器
        loadAgent () {
            if (!this.params.uuid) {
                return;
            }
            this.loadingStatus.edrAgent = true;
            loadList(this.normalizedBoxSearchParams(this.params.uuid, 'edr_agent'))
                .then(res => {
                    let data = res.data.data || {};
                    data.name = '所有';
                    this.addPath(data);
                    this.loadedData.edrAgent = [data];
                })
                .catch(() => { })
                .finally(() => {
                    this.loadingStatus.edrAgent = false;
                });
        },

        //  终端
        showHostNameDialog () {
            this.$refs.hostNameDialog.$emit('open');
        },

        //  加载终端
        loadAgents (node) {
            let params = this.normalizedBoxSearchParams(this.params.uuid, 'list_host');
            params.sort_para.zone_id = node.id;
            return loadList(params);
        },

        //  加载组
        loadGroups () {
            return loadList(this.normalizedBoxSearchParams(this.params.uuid, 'server_zone'));
        },

        handleHostNameSubmit (selectData, loadedTreeData) {
            this.params.hostNameSelects = selectData;
            this.loadedData.userGroupTreeData = loadedTreeData;
            if (selectData.some(item => item._root)) {
                this.params.hostNameString = '所有';
                this.params.hostName = '';
                return;
            }
            this.params.hostName = selectData.reduce((res, item) => {
                if (!item._notAgent) {
                    res.push(item.name_ip);
                }
                return res;
            }, []);

            this.params.hostNameString = this.params.hostName.join(',');
        },

        resolveZone (selects) {
            if (selects.some(item => item._path === '/') || !selects.length) {
                return null;
            }
            return selects.reduce((res, item) => {
                if (item.host_names) {
                    let zone = item._path.split('/')[1];
                    res.push(...item.host_names.map(name => zone + '/' + name));
                }
                return res;
            }, []);
        },

        resolveRole (selects) {
            if (selects.some(item => item._path === '/') || !selects.length) {
                return null;
            }
            return selects.reduce((res, item) => {
                if (item.host_names) {
                    let zone = item._path.split('/')[1];
                    res.push(...item.host_names.map(name => zone + '/' + name));
                }
                return res;
            }, []);

        },

        resolveAgent (selects) {
            if (selects.some(item => item._path === '/') || !selects.length) {
                return null;
            }
            return selects.reduce((res, item) => {
                if (!item.children) {
                    let zone = item._path.split('/')[1];
                    res.push(zone + '/' + item.name);
                }
                return res;
            }, []);
        },

        resolveIpGroup (selects) {
            if (selects.some(item => item._path === '/') || !selects.length) {
                return null;
            }
            return selects.reduce((res, item) => {
                if (!item.children) {
                    res.push(item.name);
                }
                return res;
            }, []);
        },

        // 当选择所有时，传递到后端的visitorStr和providerStr要特殊处理，只传子树节点
        handleVisitorStr (isVisitor, selects) {
            if (selects.some(item => item._path === '/') && selects.length > 1) {
                let allSelects = [];
                selects.forEach((item) => {
                    if (item._path !== '/') {
                        allSelects.push(item.name);
                    }
                });
                if (isVisitor) {
                    this.params.visitorStr = allSelects.join(',');
                } else {
                    this.params.providerStr = allSelects.join(',');
                }
            }
        },

        resolveVisitorOrProvider (choise, isVisitor) {
            let params = this.params;
            let isSelectedAll;
            if (isVisitor) {
                this.params.visitorStr = this.$refs['visitor_' + choise] ? this.$refs['visitor_' + choise].selectedLabel : '所有';
                isSelectedAll = !this.$refs['visitor_' + choise] || (this.$refs['visitor_' + choise].selectedLabel === '所有');
            } else {
                this.params.providerStr = this.$refs['provider_' + choise] ? this.$refs['provider_' + choise].selectedLabel : '所有';
                isSelectedAll = !this.$refs['provider_' + choise] || (this.$refs['provider_' + choise].selectedLabel === '所有');
            }
            switch (choise) {
                case 'zone':
                    if (isSelectedAll) {
                        this.handleVisitorStr(isVisitor, isVisitor ? params.visitorZoneSelects : params.providerZoneSelects);
                    }
                    return this.resolveZone(isVisitor ? params.visitorZoneSelects : params.providerZoneSelects);
                case 'role':
                    if (isSelectedAll) {
                        this.handleVisitorStr(isVisitor, isVisitor ? params.visitorRoleSelects : params.providerRoleSelects);
                    }
                    return this.resolveRole(isVisitor ? params.visitorRoleSelects : params.providerRoleSelects);
                case 'agent':
                    if (isSelectedAll) {
                        this.handleVisitorStr(isVisitor, isVisitor ? params.visitorAgentSelects : params.providerAgentSelects);
                    }
                    return this.resolveAgent(isVisitor ? params.visitorAgentSelects : params.providerAgentSelects);
                case 'ip':
                    if (isSelectedAll) {
                        this.handleVisitorStr(isVisitor, isVisitor ? params.visitorIpSelects : params.providerIpSelects);
                    }
                    return this.resolveIpGroup(isVisitor ? params.visitorIpSelects : params.providerIpSelects);
                default:
                    return null;
            }
        },

        resolveVisitorOrProviderType (choise) {
            if (choise === 'ip') {
                return 'ip_group';
            }
            return 'agent';
        },

        submit () {
            if (this.params.type === 'flux') {
                this.params.visitor = this.resolveVisitorOrProvider(this.params.visitorChoise, true);
                this.params.provider = this.resolveVisitorOrProvider(this.params.providerChoise, false);
            }

            this.cacheParams(this.params);
            this.cacheLoadedData(this.loadedData);

            // 其余组件统一通过vuex进行取值
            this.$emit('submit');
        }
    }
};
</script>

<style lang="postcss">
.safe-query-wrapper {
    padding: 20px 16px;
    box-sizing: border-box;
    background-color: #fff;
}
</style>
