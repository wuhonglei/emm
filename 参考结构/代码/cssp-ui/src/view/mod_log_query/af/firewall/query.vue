<template>
    <div class="firewall-query-wrapper query">
        <el-form
            ref="form"
            v-model="formValid"
            :rules="rules"
            :model="params">
            <div class="query__title">
                时间范围
            </div>
            <time-range-picker
                :start-date.sync="params.startDate"
                :start-time.sync="params.startTime"
                :end-date.sync="params.endDate"
                :end-time.sync="params.endTime" />
            <div class="query__title bt">
                其他
            </div>
            <div class="query__content">
                <div class="form">
                    <div class="form__label">
                        {{ QUERY_NAME.uuid }}
                    </div>
                    <div class="form__content">
                        <el-select
                            v-model="params.uuid"
                            :loading="loadingStatus.uuid"
                            no-data-text="没有可查询组件"
                            @change="restLists"
                            @visible-change="handleUuidVisibleChange">
                            <el-option
                                v-for="item in loadedData.uuid"
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
                        {{ QUERY_NAME.srcZone }}
                    </div>
                    <div class="form__content">
                        <el-select
                            v-model="params.srcZone"
                            :loading="loadingStatus.srcZone"
                            @visible-change="handleSrcZoneVisibleChange">
                            <el-option
                                label="所有区域"
                                value="" />
                            <el-option
                                v-for="srcZone in loadedData.srcZone"
                                :key="srcZone.id"
                                :label="srcZone.name"
                                :value="srcZone.name" />
                        </el-select>
                    </div>
                </div>
                <div class="form">
                    <div class="form__label">
                        {{ QUERY_NAME.srcIp }}/{{ QUERY_NAME.usrName }}
                    </div>
                    <div class="form__content">
                        <el-radio-group
                            v-model="params.srcIpGroup"
                            @change="handleRadioChange">
                            <el-radio label="all">
                                所有
                            </el-radio>
                            <el-radio label="src_ip">
                                IP
                            </el-radio>
                            <el-radio label="user_name">
                                用户
                            </el-radio>
                            <el-radio label="grp_name">
                                组
                            </el-radio>
                        </el-radio-group>
                    </div>
                </div>
                <div
                    v-if="params.srcIpGroup !== 'all'"
                    class="form">
                    <div
                        class="form__label"
                        :style="{visibility: 'hidden'}"></div>
                    <template v-if="params.srcIpGroup === 'src_ip'">
                        <div class="form__content">
                            <el-form-item prop="srcIp">
                                <el-input
                                    v-model="params.srcIp"
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
                    </template>
                    <template v-if="params.srcIpGroup === 'user_name'">
                        <div class="form__content">
                            <el-form-item prop="userName">
                                <el-input
                                    v-model="params.userName"
                                    placeholder="所有" />
                            </el-form-item>
                        </div>
                        <popover :width="300"> 
                            <p>请输入需要查询的用户名，每次只可查询一个用户的数据</p>
                        </popover>
                    </template>
                    <template v-if="params.srcIpGroup === 'grp_name'">
                        <div class="form__content">
                            <el-select-tree
                                v-model="params.grpName"
                                placeholder="所有"
                                :tree-data="loadedData.grpName"
                                :loading="loadingStatus.grpName"
                                :tree-expand-click-node="false"
                                :multiple="false"
                                tree-node-key="name"
                                tree-label="real_name"
                                tree-children="children"
                                value-type="key"
                                @visible-change="handleGrpNameVisibleChange" />
                        </div>
                        <el-checkbox
                            v-model="params.childrenGroup"
                            class="child-group">
                            包含子组
                        </el-checkbox>
                    </template>
                </div>
                <div class="form">
                    <div class="form__label">
                        {{ QUERY_NAME.dstZone }}
                    </div>
                    <div class="form__content">
                        <el-select
                            v-model="params.dstZone"
                            :loading="loadingStatus.dstZone"
                            @visible-change="handleDestZoneVisibleChange">
                            <el-option
                                label="所有区域"
                                value="" />
                            <el-option
                                v-for="destZone in loadedData.dstZone"
                                :key="destZone.id"
                                :value="destZone.name"
                                :label="destZone.name" />
                        </el-select>
                    </div>
                </div>
                <div class="form">
                    <div class="form__label">
                        {{ QUERY_NAME.dstIp }}
                    </div>
                    <div class="form__content">
                        <el-form-item prop="dstIp">
                            <el-input
                                v-model="params.dstIp"
                                placeholder="所有IP" />
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
                <div class="form">
                    <div class="form__label">
                        {{ QUERY_NAME.privateType }}
                    </div>
                    <div class="form__content">
                        <el-select
                            v-model="params.privateType"
                            @change="handlePrivateType">
                            <el-option
                                label="所有类型"
                                value="" />
                            <el-option
                                label="服务"
                                value="服务" />
                            <el-option
                                label="应用"
                                value="应用" />
                        </el-select>
                    </div>
                </div>
                <div
                    v-if="params.privateType === app"
                    class="form">
                    <div
                        class="form__label"
                        :style="{visibility: 'hidden'}"></div>
                    <div class="form__content">
                        <el-select-tree
                            v-model="params.appType"
                            :multiple="false"
                            :loading="loadingStatus.appType"
                            :tree-data="loadedData.appType"
                            value-type="node"
                            tree-node-key="id"
                            tree-label="name"
                            placeholder="所有"
                            @visible-change="handleAppNameVisibleChange" />
                    </div>
                </div>
                <div class="form">
                    <div class="form__label">
                        {{ QUERY_NAME.action }}
                    </div>
                    <div class="form__content">
                        <el-checkbox-group
                            v-model="params.action"
                            :min="1">
                            <el-checkbox label="允许">
                                允许
                            </el-checkbox>
                            <el-checkbox label="拒绝">
                                拒绝
                            </el-checkbox>
                            <el-checkbox label="联动拒绝">
                                联动拒绝
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
            </div>
        </el-form>
        <div class="query__button">
            <el-button
                type="primary"
                :disabled="!formValid || !params.uuid"
                @click="submit">
                查询
            </el-button>
            <el-button
                v-if="status !== 'init'"
                @click="$emit('hide')">
                关闭
            </el-button>
        </div>
    </div>
</template>
<script>

/**
 * firewall 查询
 */

import { QUERY_NAME, SRC_IP_GROUP } from 'src/utils/consts';
import rules from './firewall_rules';
import { mapMutations, mapGetters } from 'vuex';
import query from 'src/common/mixins/query';
import { loadUuid, loadList } from 'src/common/api/log';
import { normalizeParams } from 'src/utils/api_help';
import { FIREWALL_APP_NAME } from 'src/utils/consts';
import popover from 'src/common/components/form_tips/popover';
import uuidSelectItem from 'src/common/components/uuid_select_item';

let loadAfUuid = normalizeParams(loadUuid, 'af');

export default {
    components: {
        popover, uuidSelectItem
    },
    mixins: [query],
    data () {
        return {
            QUERY_NAME,
            FIREWALL_APP_NAME,
            SRC_IP_GROUP,
            formValid: true,
            rules,
            params: {
                startDate: '',
                startTime: '',
                endDate: '',
                endTime: '',
                uuid: '',
                srcZone: '',
                srcIp: '',
                userName: '',
                grpName: '',
                childrenGroup: true,
                srcIpGroup: 'all',
                dstZone: '',
                dstIp: '',
                privateType: '',
                appType: {},
                action: [
                    '允许',
                    '拒绝',
                    '联动拒绝'
                ]
            },
            loadingStatus: {
                srcZone: false,
                uuid: false,
                dstZone: false,
                grpName: false,
                appType: false
            },
            loadedData: {
                srcZone: [],
                uuid: [],
                dstZone: [],
                grpName: [],
                appType: []
            },
            app:'应用'
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
        this.params.appType = {};
        if (this.status === 'init') {

            //第一次加载
            let params = this.params;
            this.initDate(params);
            this.loadUuid();
        }
        
    },

    methods: {
        ...mapMutations('query', ['cacheParams', 'cacheLoadedData']),

        restLists (value) {

            //  当从store中加载值时，不重置
            if (value === this.storeParams.uuid) {
                return;
            }

            this.params.srcZone = '';
            this.params.dstZone = '';
            this.params.grpName = '';
            this.loadedData.srcZone = [];
            this.loadedData.dstZone = [];
            this.loadedData.grpName = [];
            this.loadedData.appType = [];
        },

        handleUuidVisibleChange (v) {
            if (!v || Array.isArray(this.loadedData.uuid) &&
                this.loadedData.uuid.length > 0) {
                return;
            }
            this.loadUuid();
        },

        handleSrcZoneVisibleChange (v) {
            if (!v || Array.isArray(this.loadedData.srcZone) &&
                this.loadedData.srcZone.length > 0) {
                return;
            }
            this.loadSourceZone();
        },

        handleDestZoneVisibleChange (v) {
            if (!v || Array.isArray(this.loadedData.dstZone) &&
                this.loadedData.dstZone.length > 0) {
                return;
            }
            this.loadDestinationZone();
        },

        //  加载组
        handleGrpNameVisibleChange (v) {
            if (!v || (Array.isArray(this.loadedData.grpName) && this.loadedData.grpName.length > 0)) {
                return;
            }
            this.loadGrpName();
        },

        handleRadioChange () {
            this.params.userName = '';
            this.params.srcIp = '';
            this.params.grpName = '';
            if (this.storeParams.srcIp && this.params.srcIpGroup === 'src_ip') {
                this.params.srcIp = this.storeParams.srcIp;
            }
            if (this.storeParams.userName && this.params.srcIpGroup === 'user_name') {
                this.params.userName = this.storeParams.userName;
            }
            if (this.storeParams.grpName && this.params.srcIpGroup === 'grp_name') {
                this.params.grpName = this.storeParams.grpName;
            }
            this.$refs.form.validate();
        },

        handlePrivateType (v) {
            if (v !== this.app) {
                this.params.appType = {};
            }
        },

        loadUuid () {
            if (this.loadingStatus.uuid) {
                return;
            }
            this.loadingStatus.uuid = true;
            loadAfUuid()
                .then(({data}) => {
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

        loadSourceZone () {
            if (!this.params.uuid) {
                return;
            }
            this.loadingStatus.srcZone = true;
            loadList(this.normalizedBoxSearchParams(this.params.uuid, 'CfgZoneInfo'))
                .then((res) => {
                    this.loadedData.srcZone = res.data.data || [];
                    this.loadingStatus.srcZone = false;
                })
                .catch(() => {
                })
                .finally(() => {
                    this.loadingStatus.srcZone = false;
                });
        },

        loadDestinationZone () {
            if (!this.params.uuid) {
                return;
            }
            this.loadingStatus.dstZone = true;
            loadList(this.normalizedBoxSearchParams(this.params.uuid, 'CfgZoneInfo'))
                .then((res) => {
                    this.loadedData.dstZone = res.data.data || [];
                    this.loadingStatus.dstZone = false;
                })
                .catch(() => {
                })
                .finally(() => {
                    this.loadingStatus.dstZone = false;
                });
        },

        loadGrpName () {
            if (!this.params.uuid) {
                return;
            }

            this.loadingStatus.grpName = true;
            loadList(this.normalizedBoxSearchParams(this.params.uuid, 'CfgGroupName'))
                .then(({data}) => {
                    let loaded = (data && data.data) || [];
                    if (loaded[0] && loaded[0].name === '/') {
                        loaded[0].name = '';
                        loaded[0].real_name = '所有';
                    }
                    this.loadedData.grpName = loaded;
                })
                .catch(() => {
                })
                .finally(() => {
                    this.loadingStatus.grpName = false;
                });
        },

        handleAppNameVisibleChange (v) {
            if (!v ||
                Array.isArray(this.loadedData.appType) &&
                this.loadedData.appType.length > 0
            ) {
                return;
            }
            this.loadAppName();
        },

        loadAppName () {
            if (!this.params.uuid) {
                return;
            }
            this.loadingStatus.appType = true;
            loadList(this.normalizedBoxSearchParams(this.params.uuid, 'CfgAllApp'))
                .then(({data}) => {
                    this.loadedData.appType = (data && data.data) || [];
                })
                .catch(() => {})
                .finally(() => {
                    this.loadingStatus.appType = false;
                });
        },

        resolveAppName () {
            let params = this.params;
            if (!this.params.appType.serv_name && !this.params.appType.name) {
                params.appName = '';
                params.servName = '';
                return;
            }
            
            let name = params.appType.name;
            let servName = params.appType.serv_name;

            if (servName) {
                params.appName = name;
                params.servName = servName;
            } else {
                params.servName = name;
                params.appName = '';
            }
        },

        submit () {
            this.resolveAppName();
            this.params.netAction = this.params.action;
            this.cacheParams(this.params);
            this.cacheLoadedData(this.loadedData);

            // 其余组件统一通过vuex进行取值
            this.$emit('submit');
        }
    }
};
</script>

<style lang="postcss">
.firewall-query-wrapper {
    padding: 20px 16px;
    box-sizing: border-box;
    background-color: #fff;
}
</style>
