<template lang="pug">
.safe-query-wrapper.query
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
                        el-option(v-for="item in loadedData.uuid"
                            :key="item.uuid"
                            :label="item.name|uuidIp(item.ip)"
                            :value="item.uuid")
                            uuid-select-item(:data="item")
            .form
                .form__label {{QUERY_NAME.grpOrUser}}
                .form__content
                    el-input(size="small"
                        icon="more"
                        :on-icon-click="handleIconClick"
                        v-model="params.grpOrUserName"
                        placeholder="所有"
                        readonly)

            template(v-if="more")
                .form
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
                            placeholder="所有"
                            tree-children="children")
                .form
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
                            placeholder="所有"
                            tree-children="children")
                .form
                    .form__label {{QUERY_NAME.srcIp}}
                    .form__content
                        el-form-item(prop="srcIp")
                            el-input(v-model="params.srcIp" placeholder="所有")
                    popover(:width="300")
                        p 可以输入单个IP地址，多个IP地址网段或者IP范围
                        p 多个IP之间请用'，'隔开
                        p IPv4网段书写，如192.168.1.0/255.255.255.0
                        p IPv6网段书写，如2001:ffe0::2/20
                        p 地址范围中间用-连接，如192.168.0.1-192.168.0.10
                .form
                    .form__label {{QUERY_NAME.dstIp}}
                    .form__content
                        el-form-item(prop="dstIp")
                            el-input(v-model="params.dstIp" placeholder="所有")
                    popover(:width="300")
                        p 可以输入单个IP地址，多个IP地址网段或者IP范围
                        p 多个IP之间请用'，'隔开
                        p IPv4网段书写，如192.168.1.0/255.255.255.0
                        p IPv6网段书写，如2001:ffe0::2/20
                        p 地址范围中间用-连接，如192.168.0.1-192.168.0.10
            template(v-if="more")
                .form
                    .form__label {{QUERY_NAME.control}}
                    .form__content
                        el-checkbox-group(v-model="params.netAction" :min="1")
                            el-checkbox(label="记录") 记录
                            el-checkbox(label="拒绝") 拒绝
                            el-checkbox(label="告警") 告警
                .form
                    .form__label {{QUERY_NAME.level}}
                    .form__content
                        el-checkbox-group(v-model="params.level" :min="1")
                            el-checkbox(label="高") 高
                            el-checkbox(label="中") 中
                            el-checkbox(label="低") 低
                .form
                    .form__label {{ QUERY_NAME.evtType }}
                    .form__content
                        el-checkbox-group(v-model="params.evtType" :min="1")
                            el-checkbox.evt-checkbox(label="SAVE杀毒") SAVE杀毒
                            el-checkbox.evt-checkbox(label="恶意链接") 恶意链接
                            el-checkbox.evt-checkbox(label="僵尸网络") 僵尸网络
                            el-checkbox.evt-checkbox(label="防ARP欺骗") 防ARP欺骗
                            el-checkbox.evt-checkbox(label="防内网DoS攻击") 防内网DoS攻击
                .form 
                    .form__label {{QUERY_NAME.urlKeywords}}
                    .form__content
                        el-form-item(prop="keywords")
                            el-input(v-model="params.keywords"
                                size="small"
                                placeholder="请输入搜索关键字")
                    popover(:width="160")
                        div 网站URL(含域名)，网页标题
                .form
                    .form__label {{QUERY_NAME.timeOrder}}
                    .form__content
                        el-radio-group(v-model="params.timeOrder")
                            el-radio(v-for="item in TIME_ORDER"
                                :key="item.value"
                                :label="item.value") {{ item.name }}
    
    .query__more(@click="more = !more") 
        span {{ this.more ? '收起' : '详细条件' }}
        i(:class="more ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
            style="margin-left: 4px;")
    .query__button
        el-button(type="primary" @click="submit" :disabled="!formValid || !params.uuid") 查询
        el-button(v-if="status !== 'init'" @click="$emit('hide')") 关闭

</template>
<script>

/**
 * edr日志查询
 */

/* eslint-disable no-magic-numbers */

import { QUERY_NAME, TIME_ORDER } from 'src/utils/consts';
import { mapMutations, mapGetters } from 'vuex';
import query from 'src/common/mixins/query';
import { loadUuid, loadList } from 'src/common/api/log';
import popover from 'src/common/components/form_tips/popover';
import { normalizeParams, exchangeTimeOrder } from 'src/utils/api_help.js'; 
import rules from './params_rules';
import uuidSelectItem from 'src/common/components/uuid_select_item';
import userGroupDialog from '../components/user_group';

let loadAcUuid = normalizeParams(loadUuid, 'ac');

export default {
    components:{
        popover, uuidSelectItem, userGroupDialog
    },

    mixins: [query],

    data () {
        return {
            QUERY_NAME,
            TIME_ORDER,
            more: false,
            formValid: true,
            rules,
            userGroupDialog: false,
            hackReset: true,
            params: {
                startDate: '',
                startTime: '',
                endDate: '',
                endTime: '',

                uuid:'',

                grpName: '',
                userName: '',

                grpOrUserName: '',
                grpOrUserSelects: [],

                srcIp:'',
                dstIp: '',

                tmName:'',
                siteName:'',
                level: ['高', '中', '低'],
                netAction: ['记录', '拒绝', '告警'],
                evtType: ['SAVE杀毒', '恶意链接', '僵尸网络', '防ARP欺骗', '防内网DoS攻击'],
                keywords: '',
                timeOrder: false
            },
            loadingStatus: {
                uuid: false,
                tmName: false,
                siteName: false
            },
            loadedData: {
                uuid: [],
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

    watch:{
        more (show) {
            if (show) {
                let select = ['tmName', 'siteName'];
                this.handleSelectTree(select);
            }
        }
    },

    mounted () {
        this.sync();
        if (this.status !== 'init') {

            //非第一次加载时，根据name将timeOrder修改为对应的value
            this.params.timeOrder = exchangeTimeOrder(TIME_ORDER, this.params.timeOrder);

        } else {
            let params = this.params;
            this.initDate(params);
            this.loadUuid();
            params.level = ['高', '中', '低'];
            params.netAction = ['记录', '拒绝', '告警'];
            params.evtType = ['SAVE杀毒', '恶意链接', '僵尸网络', '防ARP欺骗', '防内网DoS攻击'];
        }
    },

    methods: {
        ...mapMutations('query', ['cacheParams', 'cacheLoadedData']),

        handleIconClick () {
            if (this.$refs.userGroupDialog) {
                this.$refs.userGroupDialog.$emit('open', this.params.grpOrUserSelects);
            }
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

        resetLists (value) {

            //  当从store中加载值时，不重置
            if (value === this.storeParams.uuid) {
                return;
            }

            this.hackReset = false;
            this.$nextTick(() => this.hackReset = true);

            this.params.tmName = '';
            this.params.siteName = '';
            this.loadedData.tmName = [];
            this.loadedData.siteName = [];
        },

        handleSelectTree (res) {
            let _this = this;
            let data = res;
            const DELAY = 100;

            //延时一点才能设置值
            setTimeout(() => {
                for (let i = 0; i < data.length; i++) {
                    let tmp = JSON.parse(JSON.stringify(_this.params[data[i]]));
                    _this.params[data[i]] = '';
                    _this.params[data[i]] = tmp;
                }
            }, DELAY);
        },

        handleUuidVisibleChange (v) {
            if (!v || this.hasLoadedData('uuid')) {
                return;
            }

            this.loadUuid();
        },

        handleTmNameVisibleChange (v) {
            if (!v || this.hasLoadedData('tmName')) {
                return;
            }

            this.loadTmName();
        },

        handleSiteNameVisibleChange (v) {
            if (!v || this.hasLoadedData('siteName')) {
                return;
            }

            this.loadSiteName();
        },

        loadUuid () {
            if (this.loadingStatus.uuid) {
                return;
            }
            this.loadingStatus.uuid = true;
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

        submit () {
            this.params.sid = this.params.rulesNumber;
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
    & .protocolContent{
        & .el-checkbox-group {
            float: left;
        }
        & .protocolInput {
            width: 124px;
            margin-left:30px;
        }
    }
    & .portContent{
        & .el-form-item{
            display: inline-block;
            width: 50%;
        }
        & .el-select{
            width: 47%;
            margin-left: 10px;
        }
    }

    & .evt-checkbox {
        margin-right: 10px;
        margin-left: 0;
    }
}
</style>
