<template lang="pug">
.safe-query-wrapper.query
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
            template(v-if="more")
                .form
                    .form__label {{QUERY_NAME.priority}}
                    .form__content
                        el-checkbox-group(v-model="params.priority" :min="1")
                            el-checkbox(label="高") 高
                            el-checkbox(label="中") 中
                            el-checkbox(label="低") 低
                .form
                    .form__label {{QUERY_NAME.defenseAction}}
                    .form__content
                        el-checkbox-group(v-model="params.netAction" :min="1")
                            el-checkbox(label="防御") 防御
                            el-checkbox(label="告警") 告警

                .form
                    .form__label {{QUERY_NAME.srcPort}}
                    .form__content.portContent
                        el-form-item(prop="srcPort")
                            el-input.input(v-model="params.srcPort" placeholder="所有")
                        el-select(v-model="params.srcPortSelect"
                            :loading="loadingStatus.srcPortSelect"
                            @change="getSrcPortId"
                            @visible-change="handleSrcPortVisibleChange")
                            el-option(label="所有" value="")
                            el-option(v-for="item in loadedData.srcPortSelect"
                                :key="item.id"
                                :label="item.name"
                                :value="item.name")

                .form
                    .form__label {{QUERY_NAME.dstPort}}
                    .form__content.portContent
                        el-form-item(prop="dstPort")
                            el-input.input(v-model="params.dstPort" placeholder="所有")
                        el-select(v-model="params.dstPortSelect"
                            :loading="loadingStatus.dstPortSelect"
                            @change="getDstPortId"
                            @visible-change="handleDstPortVisibleChange")
                            el-option(label="所有" value="")
                            el-option(v-for="item in loadedData.dstPortSelect"
                                :key="item.id"
                                :label="item.name"
                                :value="item.name")

                .form
                    .form__label {{QUERY_NAME.protocol}}
                    .form__content.protocolContent
                        el-checkbox-group(v-model="params.protocolCheckbox" :min="1")
                            el-checkbox(label="6") TCP
                            el-checkbox(label="17") UDP
                            el-checkbox(label="1") ICMP
                            el-checkbox(label="0") 其他
                        .form__content.protocolInput
                            el-form-item(prop="otherProtocol")
                                el-input(v-model="params.otherProtocol" :disabled="params.protocolCheckbox.indexOf('0') < 0")

                .form
                    .form__label {{QUERY_NAME.rulesNumber}}
                    .form__content
                        el-form-item(prop="rulesNumber")
                            el-input(v-model="params.rulesNumber" placeholder="所有")

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

import { QUERY_NAME, TIME_ORDER, MAX_PORT } from 'src/utils/consts';
import { mapMutations, mapGetters } from 'vuex';
import query from 'src/common/mixins/query';
import { loadUuid, loadList } from 'src/common/api/log';
import popover from 'src/common/components/form_tips/popover';
import { normalizeParams, exchangeTimeOrder } from 'src/utils/api_help.js'; 
import rules from './params_rules';
import uuidSelectItem from 'src/common/components/uuid_select_item';

let loadAcUuid = normalizeParams(loadUuid, 'ac');

export default {
    components:{
        popover, uuidSelectItem
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
            params: {
                startDate: '',
                startTime: '',
                endDate: '',
                endTime: '',
                uuid:'',
                grpOrUserName: '',
                grpOrUserSelects: [],
                srcIp:'',
                tmName:'',
                siteName:'',
                priority: ['高', '中', '低'],
                netAction: ['防御', '告警'],
                srcPort:'',
                srcPortSelect:'',
                dstPort:'',
                dstPortSelect:'',
                srcPortId:'',
                dstPortId:'',
                protocol:['6', '17', '1'],
                protocolCheckbox:['6', '17', '1', '0'],
                otherProtocol:'0',
                rulesNumber: '',
                timeOrder: false
            },
            loadingStatus: {
                uuid: false,
                tmName: false,
                siteName: false,
                srcPortSelect: false,
                dstPortSelect: false
            },
            loadedData: {
                uuid: [],
                tmName: [],
                siteName: [],
                srcPortSelect: [],
                dstPortSelect: []
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
                this.handleSrcPortVisibleChange();
                this.handleDstPortVisibleChange();
                
                // this.params.srcPortSelect = '所有';
                // this.params.dstPortSelect = '所有';
            }
        },

        'params.srcPort' () {
            this.handleSrcPortSelectAutoChange();
        },
        'params.dstPort' () {
            this.handleDstPortSelectAutoChange();
        }
    },

    mounted () {
        this.sync();
        if (this.status !== 'init') {

            //非第一次加载时，根据name将timeOrder修改为对应的value
            this.params.timeOrder = exchangeTimeOrder(TIME_ORDER, this.params.timeOrder);
            this.handleProtocol();

        } else {
            let params = this.params;
            this.initDate(params);
            this.loadUuid();
            params.priority = ['高', '中', '低'];
            params.netAction = ['防御', '告警'];
        }
    },

    methods: {
        ...mapMutations('query', ['cacheParams', 'cacheLoadedData']),

        // 协议显示
        handleProtocol () {
            let lastParams = JSON.parse(JSON.stringify(this.params.protocol));
            let defaultProt = [];
            let otherProt = [];
            let ori = ['6', '17', '1'];
            for (let i = 0; i < lastParams.length; i++) {
                if (ori.indexOf(lastParams[i]) > -1) {
                    defaultProt.push(lastParams[i]);
                } else {
                    otherProt.push(lastParams[i]);
                }
            }

            let arr = otherProt.length ? ['0'] : [];
            this.params.protocolCheckbox = defaultProt.concat(arr);
        },

        //源端口下拉框动态改变输入框
        getSrcPortId (value) {
            let builtInPort;
            let list = this.loadedData.srcPortSelect; 
            let [data] = list.filter((item) => item.name === value);
            let id = data && data.id || '';
            if (id !== MAX_PORT) {
                this.params.srcPort = id;
                return;
            }
            builtInPort = this.getBuiltInPort(list, this.params.srcPort);
            if (builtInPort) {
                this.params.srcPort = '';
            }
        },

        //目的端口下拉框动态改变输入框
        getDstPortId (value) {
            let builtInPort;
            let list = this.loadedData.dstPortSelect; 
            let [data] = list.filter((item) => item.name === value);
            let id = data && data.id || '';
            if (id !== MAX_PORT) {
                this.params.dstPort = id;
                return;
            }
            builtInPort = this.getBuiltInPort(list, this.params.dstPort);
            if (builtInPort) {
                this.params.dstPort = '';
            }
        },

        // 根据端口输入框的值匹配匹配该值对应的内置端口，如果有，则表示这是一个内置的端口 
        getBuiltInPort (list, value) {
            let [data] = list.filter((item) => item.id === value);
            return data || '';
        },

        resetLists (value) {

            //  当从store中加载值时，不重置
            if (value === this.storeParams.uuid) {
                return;
            }

            this.params.tmName = '';
            this.params.siteName = '';
            this.params.srcPort = '';
            this.params.dstPort = '';
            this.params.srcPortSelect = '';
            this.params.dstPortSelect = '';
            this.loadedData.tmName = [];
            this.loadedData.siteName = [];
            this.loadedData.srcPortSelect = [];
            this.loadedData.dstPortSelect = [];
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

        //目的端口输入框动态改变下拉框
        handleDstPortSelectAutoChange () {
            if (this.params.dstPort === '') {
                return this.params.dstPortSelect = '所有';
            }
            let [data] = this.loadedData.dstPortSelect.filter((item) => item.id === this.params.dstPort);
            this.params.dstPortSelect = data ? data.name : '自定义';
        },

        //源端口输入框动态改变下拉框
        handleSrcPortSelectAutoChange () {
            if (this.params.srcPort === '') {
                return this.params.srcPortSelect = '所有';
            }
            let [data] = this.loadedData.srcPortSelect.filter((item) => item.id === this.params.srcPort);
            this.params.srcPortSelect = data ? data.name : '自定义';
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

        handleSrcPortVisibleChange () {
            if (this.hasLoadedData('srcPortSelect')) {
                return;
            }
            this.loadSrcPort();
        },

        handleDstPortVisibleChange () {
            if (this.hasLoadedData('dstPortSelect')) {
                return;
            }
            this.loadDstPort();
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

        loadSrcPort () {
            this.loadingStatus.srcPortSelect = true;
            loadList(this.normalizedBoxSearchParams(this.params.uuid, 'port'))
                .then((res) => {
                    this.loadedData.srcPortSelect = res.data.data || [];
                })
                .catch(() => {
                })
                .finally(() => {
                    this.loadingStatus.srcPortSelect = false;
                });
        },

        loadDstPort () {
            this.loadingStatus.dstPortSelect = true;
            loadList(this.normalizedBoxSearchParams(this.params.uuid, 'port'))
                .then((res) => {
                    this.loadedData.dstPortSelect = res.data.data || [];
                })
                .catch(() => {
                })
                .finally(() => {
                    this.loadingStatus.dstPortSelect = false;
                });
        },

        handleSubmitData () {

            let protocol = this.params.protocolCheckbox;
            let pos = protocol.indexOf('0');
            if (pos > -1) {
                protocol[pos] = this.params.otherProtocol;
            }

            this.params.protocol = protocol;

        },

        submit () {
            this.handleSubmitData();
            
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
}
</style>
