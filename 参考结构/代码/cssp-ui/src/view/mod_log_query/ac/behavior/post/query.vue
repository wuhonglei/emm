<template lang="pug">
.ac-behavior-post-wapper.query
    user-group-dialog(title="用户/组" 
        v-if="hackReset"
        ref="userGroupDialog"
        v-model="userGroupDialog"
        :result-filter="userGroupResultFilter"
        :load-node-data="loadUsers"
        :load-tree-data="loadGroups"
        :data-type="userOrGroupType"
        :initSelects="params.grpOrUserSelects"
        @submit="handleUserGroupSubmit")
    el-form(v-model="formValid"
        :rules="rules"
        :model="params")
        .query__title 时间范围
        time-range-picker(
            :startDate.sync="params.startDate"
            :startTime.sync="params.startTime"
            :endDate.sync="params.endDate"
            :endTime.sync="params.endTime")
        .query__title.bt 其他
        .query__content
            .form
                .form__label {{QUERY_NAME.uuid}}
                .form__content
                    el-select(v-model="params.uuid"
                        :loading="loadingStatus.uuid"
                        no-data-text="没有可查询组件"
                        @change="resetLists"
                        @visible-change="handleUuidVisibleChange")
                        el-option(v-for="uuid in loadedData.uuid"
                            :key="uuid.id"
                            :value="uuid.uuid"
                            :label="uuid.name|uuidIp(uuid.ip)")
                            uuid-select-item(:data="uuid")
            .form
                .form__label {{QUERY_NAME.grpOrUser}}
                .form__content
                    el-input(size="small"
                        icon="more"
                        :on-icon-click="handleIconClick"
                        v-model="params.grpOrUserName"
                        placeholder="所有"
                        readonly)

            .form(v-if="more")
                .form__label {{QUERY_NAME.tmName}}
                .form__content
                    el-select-tree(v-model="params.tmName"
                        :loading="loadingStatus.tmName"
                        size="small"
                        @visible-change="handleTmNameVisibleChange"
                        :tree-data="loadedData.tmName"
                        :multiple="true"
                        value-type="node"
                        tree-label="name"
                        tree-node-key="name"
                        tree-children="children"
                        placeholder="所有")

            .form(v-if="more")
                .form__label {{QUERY_NAME.siteName}}
                .form__content
                    el-select-tree(v-model="params.siteName"
                        :loading="loadingStatus.siteName"
                        @visible-change="handleSiteNameVisibleChange"
                        :tree-data="loadedData.siteName"
                        :multiple="true"
                        value-type="node"
                        tree-label="name"
                        tree-node-key="name"
                        tree-children="children"
                        placeholder="所有")

            .form(v-if="more")
                .form__label {{QUERY_NAME.srcIp}}
                .form__content
                    el-form-item(prop="srcIp")
                        el-input(v-model="params.srcIp" placeholder="请输入源IP")
                popover(:width="300")
                    p 可以输入单个IP地址，多个IP地址网段或者IP范围
                    p 多个IP之间请用'，'隔开
                    p IPv4网段书写，如192.168.1.0/255.255.255.0
                    p IPv6网段书写，如2001:ffe0::2/20
                    p 地址范围中间用-连接，如192.168.0.1-192.168.0.10
            .form(v-if="more")
                .form__label {{QUERY_NAME.dstIp}}
                .form__content
                    el-form-item(prop="dstIp")
                        el-input(v-model="params.dstIp" placeholder="请输入目的IP")
                    
            .form(v-if="more")
                .form__label {{QUERY_NAME.control}}
                .form__content
                    el-checkbox-group(v-model="params.control" :min="1")
                        el-checkbox(label="记录") 记录
                        el-checkbox(label="拒绝") 拒绝

            .form(v-if="more")
                .form__label {{QUERY_NAME.timeOrder}}
                .form__content
                    el-radio-group(v-model="params.timeOrder")
                        el-radio(v-for="item in TIME_ORDER"
                            :key="item.value"
                            :label="item.value") {{ item.name }}

            .form
                .form__label {{QUERY_NAME.sendType}}
                .form__content
                    el-select-tree(v-model="params.sendType"
                        :loading="loadingStatus.sendType"
                        @visible-change="handleSendTypeVisibleChange"
                        :tree-data="loadedData.sendType"
                        :multiple="true"
                        value-type="node"
                        tree-label="name"
                        tree-node-key="name"
                        tree-children="children"
                        placeholder="所有")

            .form
                .form__label {{QUERY_NAME.filetype}}
                .form__content
                    el-select-tree(v-model="params.filetype"
                        :loading="loadingStatus.filetype"
                        @visible-change="handleFileTypeVisibleChange"
                        :tree-data="loadedData.filetype"
                        :multiple="true"
                        value-type="node"
                        tree-label="name"
                        tree-node-key="name"
                        tree-children="children"
                        placeholder="所有")

            .form
                .form__label {{QUERY_NAME.keywords}}
                .form__content
                    el-form-item(prop="keywords")
                        el-input(v-model="params.keywords" placeholder="请输入搜索关键字")
                popover(:width="90")
                    div 文件名、扩展名

    .query__more(@click="more = !more") 
        span {{ this.more ? '收起' : '详细条件' }}
        i(:class="this.more ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
            style="margin-left: 4px;")
        template(v-)

    .query__button
        el-button(type="primary" @click="submit" :disabled="!formValid || !params.uuid") 查询
        el-button(v-if="status !== 'init'" @click="close") 关闭
</template>
<script>

/**
 * 文件审计日志查询条件
 */

import { QUERY_NAME, TIME_ORDER } from 'src/utils/consts';
import popover from 'src/common/components/form_tips/popover';
import { mapGetters, mapMutations } from 'vuex';
import query from 'src/common/mixins/query';
import userGroupDialog from '../../components/user_group';
import { loadUuid, loadList } from 'src/common/api/log';
import { normalizeParams, exchangeTimeOrder } from 'src/utils/api_help.js';
import rules from './params_rules';
import uuidSelectItem from 'src/common/components/uuid_select_item';

let loadAcUuid = normalizeParams(loadUuid, 'ac');

export default {
    components: {
        popover,
        userGroupDialog,
        uuidSelectItem
    },
    mixins: [query],
    data () {
        return {
            QUERY_NAME,
            TIME_ORDER,
            formValid: true,
            more: false,
            rules,
            userGroupDialog: false,
            hackReset: true,
            params: {
                startDate: '',
                startTime: '',
                endDate: '',
                endTime: '',
                grpName:'',
                userName:'',
                uuid: '',
                grpOrUserName: '',
                grpOrUserSelects: [],
                tmName: '',
                siteName: '',
                srcIp: '',
                control: '',
                dstIp: '',
                keywords: '',
                sendType: '',
                filetype: '',
                timeOrder: false
            },
            loadingStatus: {
                uuid: false,
                sendType: false,
                filetype: false,
                tmName: false,
                siteName: false
            },
            loadedData: {
                uuid: [],
                sendType: [],
                filetype: [],
                tmName: [],
                siteName: []
            }
        };
    },

    computed: {
        ... mapGetters('query', {
            storeParams: 'params'
        }),
        ... mapGetters('splitPanel', ['status'])
    },

    mounted () {
        this.sync();
        if (this.status !== 'init') {

            //非第一次加载时，根据name将timeOrder修改为对应的value
            this.params.timeOrder = exchangeTimeOrder(TIME_ORDER, this.params.timeOrder);
        } else {
            
            //第一次加载
            let params = this.params;
            this.initDate(params);
            params.control = ['记录', '拒绝'];
            this.loadUuid();
        }
    },

    methods: {
        ...mapMutations('query', ['cacheParams', 'cacheLoadedData']),
        ...mapMutations('splitPanel', ['queryed']),

        resetLists (value) {
            
            //  当从store中加载值时，不重置
            if (value === this.storeParams.uuid) {
                return;
            }

            this.hackReset = false;
            this.$nextTick(() => this.hackReset = true);
            this.params.grpName = '';
            this.params.tmName = '';
            this.params.siteName = '';
            this.params.sendType = '';
            this.params.filetype = '';
            this.params.grpOrUserSelects = [];
            this.params.grpOrUserName = '';
            this.loadedData.tmName = [];
            this.loadedData.siteName = [];
            this.loadedData.sendType = [];
            this.loadedData.filetype = [];
        },

        handleUuidVisibleChange (v) {
            if (!v || this.hasLoadedData('uuid')) {
                return;
            } 

            this.loadUuid();
        },

        handleSiteNameVisibleChange (v) {
            if (!v || this.hasLoadedData('siteName')) {
                return;
            }

            this.loadSiteName();
        },

        handleTmNameVisibleChange (v) {
            if (!v || this.hasLoadedData('tmName')) {
                return;
            }

            this.loadTmName();
        },

        handleFileTypeVisibleChange (v) {
            if (!v || this.hasLoadedData('filetype')) {
                return;
            }

            this.loadFileTypeName();
        },

        handleSendTypeVisibleChange (v) {
            if (!v || this.hasLoadedData('sendType')) {
                return;
            }

            this.loadSendTypeName();
        },

        loadUuid () {
            if (this.loadingStatus.uuid) {
                return;
            }
            this.loadingStatus.uuid = false;
            loadAcUuid()
                .then(({ data }) => {
                    this.loadedData.uuid = this.sortedUuid(data.data || []);
                    this.$nextTick(()=>{
                        this.params.uuid = this.params.uuid ||
                            (this.loadedData.uuid[0] && this.loadedData.uuid[0].uuid);
                    });
                })
                .finally(() => {
                    this.loadingStatus.uuid = false;
                });
        },

        loadSiteName () {
            this.loadingStatus.siteName = true;
            loadList(this.normalizedBoxSearchParams(this.params.uuid, 'site'))
                .then((res) => {
                    this.loadedData.siteName = res.data.data || [];
                    this.setDefaultAll(this.loadedData.siteName, this.params, 'siteName');
                })
                .catch(() => {
                })
                .finally(() => {
                    this.loadingStatus.siteName = false;
                });
        },

        loadTmName () {
            this.loadingStatus.tmName = true;
            loadList(this.normalizedBoxSearchParams(this.params.uuid, 'terminal'))
                .then((res) => {
                    this.loadedData.tmName = res.data.data || [];
                    this.setDefaultAll(this.loadedData.tmName, this.params, 'tmName');
                })
                .catch(() => {
                })
                .finally(() => {
                    this.loadingStatus.tmName = false;
                });
        },

        loadFileTypeName () {
            this.loadingStatus.filetype = true;
            loadList(this.normalizedBoxSearchParams(this.params.uuid, 'file_type'))
                .then((res) => {
                    this.loadedData.filetype = res.data.data || [];
                    this.setDefaultAll(this.loadedData.filetype, this.params, 'filetype');
                })
                .catch(() => {
                })
                .finally(() => {
                    this.loadingStatus.filetype = false;
                });
        },

        loadSendTypeName () {
            this.loadingStatus.sendType = true;
            loadList(this.normalizedBoxSearchParams(this.params.uuid, 'send_type'))
                .then((res) => {
                    this.loadedData.sendType = res.data.data || [];
                    this.setDefaultAll(this.loadedData.sendType, this.params, 'sendType');
                })
                .catch(() => {
                })
                .finally(() => {
                    this.loadingStatus.sendType = false;
                });
        },

        close () {
            this.queryed();
        },

        userGroupResultFilter (node) {
            if (node._checked) {
                return [true, node.id !== '0'];
            }
            if (node.children && 
                node.children.some(item => !item.children) && 
                node.children.every(item => (item._checked || item.children))) {
                return [true, true];
            }
            return [false, true];
        },

        loadUsers (group) {
            let name = group.name;
            let params = this.normalizedBoxSearchParams(this.params.uuid, 'user');
            params.sort_para.group = name;
            return loadList(params);
        },

        loadGroups () {
            return loadList(this.normalizedBoxSearchParams(this.params.uuid, 'group'));
        },

        userOrGroupType (data) {
            return data.children ? '组' : '用户';
        },

        handleUserGroupSubmit (selectedData) {
            this.params.grpOrUserSelects = selectedData;
            if (selectedData.some(item => item[name] === '/') || selectedData.length === 0) {
                this.params.grpOrUserName = '所有';
                return;
            }
            this.params.grpOrUserName = selectedData.map(item => item.real_name).join(',');
            let grpName = [];
            let userName = [];
            selectedData.forEach(item => {
                if (item.children) {
                    grpName.push(item.name);
                } else {
                    userName.push(item.name);
                }
            });
            this.params.grpName = grpName;
            this.params.userName = userName;
        },

        handleIconClick () {
            if (this.$refs.userGroupDialog) {
                this.$refs.userGroupDialog.$emit('open', this.params.grpOrUserSelects);
            }
        },
        
        submit () {
            this.cacheParams(this.params);
            this.cacheLoadedData(this.loadedData);

            this.$emit('submit');
        }
    }
};
</script>
