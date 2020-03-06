<template>
    <div class="mail-query-wrapper query">
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
                            @change="resetLists"
                            @visible-change="handleUuidVisibleChange">
                            <el-option
                                v-for="item in loadedData.uuid"
                                :key="item.id"
                                :label="item.name|uuidIp(item.ip)"
                                :value="item.uuid">
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
                                v-for="item in loadedData.srcZone"
                                :key="item.id"
                                :label="item.name"
                                :value="item.name" />
                        </el-select>
                    </div>
                </div>
                <div class="form">
                    <div class="form__label">
                        {{ QUERY_NAME.srcIp }}/{{ QUERY_NAME.usrName }}
                    </div>
                    <div class="form__content">
                        <el-radio-group
                            v-model="params.userSelect"
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
                    v-if="params.userSelect !== 'all'"
                    class="form">
                    <div
                        class="form__label"
                        :style="{visibility: 'hidden'}"></div>
                    <template v-if="params.userSelect === 'src_ip'">
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
                    <template v-if="params.userSelect === 'user_name'">
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
                    <template v-if="params.userSelect === 'grp_name'">
                        <div class="form__content">
                            <el-select-tree
                                v-model="params.grpName"
                                placeholder="所有"
                                :tree-data="loadedData.grpName"
                                :loading="loadingStatus.grpName"
                                :multiple="false"
                                :tree-expand-click-node="false"
                                value-type="key"
                                tree-node-key="name"
                                tree-label="real_name"
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
                            @visible-change="handleDstZoneVisibleChange">
                            <el-option
                                label="所有区域"
                                value="" />
                            <el-option
                                v-for="item in loadedData.dstZone"
                                :key="item.id"
                                :label="item.name"
                                :value="item.name" />
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
                <div class="form">
                    <div class="form__label">
                        {{ QUERY_NAME.attackType }}
                    </div>
                    <div class="form__content">
                        <el-select
                            v-model="params.attackType"
                            :loading="loadingStatus.attackType">
                            <el-option
                                label="所有"
                                value="" />
                            <el-option
                                label="撞库攻击"
                                value="撞库攻击" />
                            <el-option
                                label="钓鱼邮件"
                                value="钓鱼邮件" />
                            <el-option
                                label="可疑邮件"
                                value="可疑邮件" />
                            <el-option
                                label="邮件正文检测"
                                value="邮件正文检测" />
                            <el-option
                                label="邮件域检测"
                                value="邮件域检测" />
                        </el-select>
                    </div>
                </div>
                <div class="form">
                    <div class="form__label">
                        {{ QUERY_NAME.emailFrom }}
                    </div>
                    <div class="form__content">
                        <el-form-item prop="emailFrom">
                            <el-input
                                v-model="params.emailFrom"
                                placeholder="you@example.com" />
                        </el-form-item>
                    </div>
                </div>
                <div class="form">
                    <div class="form__label">
                        {{ QUERY_NAME.emailTo }}
                    </div>
                    <div class="form__content">
                        <el-form-item prop="emailTo">
                            <el-input
                                v-model="params.emailTo"
                                placeholder="you@example.com" />
                        </el-form-item>
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
                                放行
                            </el-checkbox>
                            <el-checkbox label="拒绝">
                                阻断
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
                <div class="form">
                    <div class="form__label">
                        {{ QUERY_NAME.level }}
                    </div>
                    <div class="form__content">
                        <el-checkbox-group
                            v-model="params.level"
                            :min="1">
                            <el-checkbox label="高">
                                高
                            </el-checkbox>
                            <el-checkbox label="中">
                                中
                            </el-checkbox>
                            <el-checkbox label="低">
                                低
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
 * 内容安全-邮件安全日志 查询
 */

import { QUERY_NAME } from 'src/utils/consts';
import rules from './mail_rules.js';
import { mapMutations, mapGetters } from 'vuex';
import query from 'src/common/mixins/query';
import popover from 'src/common/components/form_tips/popover';
import { loadUuid, loadList } from 'src/common/api/log';
import { normalizeParams } from 'src/utils/api_help';
import uuidSelectItem from 'src/common/components/uuid_select_item';

let loadAfUuid = normalizeParams(loadUuid, 'af');

export default {
    components: {
        popover, uuidSelectItem
    },

    mixins:[query],

    data () {
        return {
            QUERY_NAME,
            rules,
            formValid: true,
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
                grpSelects: {},
                dstZone: '',
                dstIp: '',
                attackType: '',
                emailFrom: '',
                emailTo: '',
                action: ['允许', '拒绝'], 
                level: ['高', '中', '低'],
                userSelect: 'all'
            },
            loadingStatus: {
                uuid: false,
                srcZone: false,
                dstZone: false,
                attackType: false,
                grpName: false
            },
            loadedData: {
                uuid: [],
                srcZone: [],
                dstZone: [],
                grpName: []
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
        if (this.status === 'init') {

            //第一次加载
            let params = this.params;
            this.initDate(params);
            this.loadUuid();
        }
    },

    methods: {
        ...mapMutations('query', ['cacheParams', 'cacheLoadedData']),

        //  当uuid改变时, 重置srcZone,dstZone,attackType
        resetLists (value) {

            //  当从store中加载值时，不重置
            if (value === this.storeParams.uuid) {
                return;
            }

            this.params.srcZone = '';
            this.params.dstZone = '';
            this.params.attackType = '';
            this.params.grpName = '';
            this.loadedData.srcZone = [];
            this.loadedData.dstZone = [];
            this.loadedData.grpName = [];
        },

        // 加载uuid
        handleUuidVisibleChange (visibale) {
            if (!visibale || (Array.isArray(this.loadedData.uuid) && this.loadedData.uuid.length > 0)) {
                return;
            }
            this.loadUuid();
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

        // 加载srcZone
        handleSrcZoneVisibleChange (visibale) {
            if (!visibale || (Array.isArray(this.loadedData.srcZone) && this.loadedData.srcZone.length > 0)) {
                return;
            }
            this.loadSrcZone();
        },

        loadSrcZone () {
            if (!this.params.uuid) {
                return;
            }
            this.loadingStatus.srcZone = true;

            loadList(this.normalizedBoxSearchParams(this.params.uuid, 'CfgZoneInfo'))
                .then(({data}) => {
                    this.loadedData.srcZone = data && data.data || [];
                })
                .catch(() => {
                })
                .finally(() => {
                    this.loadingStatus.srcZone = false;
                });
        },

        // 加载dstZone
        handleDstZoneVisibleChange (visibale) {
            if (!visibale || (Array.isArray(this.loadedData.dstZone) && this.loadedData.dstZone.length > 0)) {
                return;
            }
            this.loadDstZone();
        },

        loadDstZone () {
            if (!this.params.uuid) {
                return;
            }
            this.loadingStatus.dstZone = true;

            //  查询dstZone表
            loadList(this.normalizedBoxSearchParams(this.params.uuid, 'CfgZoneInfo'))
                .then(({data}) => {
                    this.loadedData.dstZone = data && data.data || [];
                })
                .catch(() => {
                })
                .finally(() => {
                    this.loadingStatus.dstZone = false;
                });
        },

        handleRadioChange () {
            this.params.userName = '';
            this.params.srcIp = '';
            this.params.grpName = '';
            if (this.storeParams.srcIp && this.params.userSelect === 'src_ip') {
                this.params.srcIp = this.storeParams.srcIp;
            }
            if (this.storeParams.userName && this.params.userSelect === 'user_name') {
                this.params.userName = this.storeParams.userName;
            }
            if (this.storeParams.grpName && this.params.userSelect === 'grp_name') {
                this.params.grpName = this.storeParams.grpName;
            }
            this.$refs.form.validate();
        },

        //  加载组
        handleGrpNameVisibleChange (visible) {
            if (!visible ||　(Array.isArray(this.loadedData.grpName) && this.loadedData.grpName.length > 0)) {
                return;
            }
            this.loadGrpName();
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

        submit () {
            this.params.netAction = this.params.action;
            this.params.level = ['高', '中', '低'].filter(item => this.params.level.indexOf(item) >= 0);
            this.cacheParams(this.params);
            this.cacheLoadedData(this.loadedData);
            
            this.$emit('submit');
        }
    }
};
</script>

<style lang="postcss">
.mail-query-wrapper {
    padding: 20px 16px;
    box-sizing: border-box;
    background-color: #fff;

}
</style>
