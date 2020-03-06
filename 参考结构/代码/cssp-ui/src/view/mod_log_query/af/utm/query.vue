<template>
    <div class="utm-query-wrapper query">
        <el-form ref="form"
                 v-model="formValid"
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
                        {{ QUERY_NAME.uuid }}
                    </div>
                    <div class="form__content">
                        <el-select v-model="params.uuid"
                                   :loading="loadingStatus.uuid"
                                   no-data-text="没有可查询组件"
                                   @change="restLists"
                                   @visible-change="handleUuidVisibleChange">
                            <el-option v-for="uuid in loadedData.uuid"
                                       :key="uuid.id"
                                       :value="uuid.uuid"
                                       :label="uuid.name|uuidIp(uuid.ip)">
                                <uuid-select-item :data="uuid" />
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form">
                    <div class="form__label">
                        {{ QUERY_NAME.srcZone }}
                    </div>
                    <div class="form__content">
                        <el-select v-model="params.srcZone"
                                   :loading="loadingStatus.srcZone"
                                   @visible-change="handleSrcZoneVisibleChange">
                            <el-option label="所有区域"
                                       value="" />
                            <el-option v-for="srcZone in loadedData.srcZone"
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
                        <el-radio-group v-model="params.srcIpGroup"
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
                <div v-if="params.srcIpGroup !== 'all'"
                     class="form">
                    <div class="form__label"
                         :style="{visibility: 'hidden'}"></div>
                    <template v-if="params.srcIpGroup === 'src_ip'">
                        <div class="form__content">
                            <el-form-item prop="srcIp">
                                <el-input v-model="params.srcIp"
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
                                <el-input v-model="params.userName"
                                          placeholder="所有" />
                            </el-form-item>
                        </div>
                        <popover :width="300">
                            <p>请输入需要查询的用户名，每次只可查询一个用户的数据</p>
                        </popover>
                    </template>
                    <template v-if="params.srcIpGroup === 'grp_name'">
                        <div class="form__content">
                            <el-select-tree v-model="params.grpName"
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
                        <el-checkbox v-model="params.childrenGroup"
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
                        <el-select v-model="params.dstZone"
                                   :loading="loadingStatus.dstZone"
                                   @visible-change="handleDestZoneVisibleChange">
                            <el-option label="所有区域"
                                       value="" />
                            <el-option v-for="destZone in loadedData.dstZone"
                                       :key="destZone.id"
                                       :value="destZone.name"
                                       :label="destZone.name" />
                        </el-select>
                    </div>
                </div>
                <div class="form">
                    <div class="form__label">
                        {{ QUERY_NAME.attackType }}
                    </div>
                    <div class="form__content">
                        <el-select v-model="params.attackType"
                                   :loading="loadingStatus.attackType"
                                   @visible-change="handleAttackTypeVisibleChange">
                            <el-option label="所有类型"
                                       value="" />
                            <el-option v-for="attackType in loadedData.attackType"
                                       :key="attackType.id"
                                       :value="attackType.name"
                                       :label="attackType.name" />
                        </el-select>
                    </div>
                </div>
                <div class="form">
                    <div class="form__label">
                        {{ QUERY_NAME.level }}
                    </div>
                    <div class="form__content">
                        <el-checkbox-group v-model="params.level"
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
                            <el-checkbox label="信息">
                                信息
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
                <div class="form">
                    <div class="form__label">
                        {{ QUERY_NAME.action }}
                    </div>
                    <div class="form__content">
                        <el-checkbox-group v-model="params.action"
                                           :min="1">
                            <el-checkbox label="允许">
                                允许
                            </el-checkbox>
                            <el-checkbox label="拒绝">
                                拒绝
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
            </div>
        </el-form>
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
 * utm 查询
 */

import { QUERY_NAME, SRC_IP_GROUP } from 'src/utils/consts';
import rules from './utm_rules';
import { mapGetters, mapMutations } from 'vuex';
import query from 'src/common/mixins/query';
import { loadUuid, loadList } from 'src/common/api/log';
import { normalizeParams } from 'src/utils/api_help';
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
                srcIpGroup: 'all',
                srcIp: '',
                userName: '',
                grpName: '',
                childrenGroup: true,
                dstZone: '',
                attackType: '',
                level: [
                    '高',
                    '中',
                    '低',
                    '信息'
                ],
                action: [
                    '允许',
                    '拒绝'
                ]
            },
            loadingStatus: {
                srcZone: false,
                uuid: false,
                attackType: false,
                dstZone: false,
                grpName: false
            },
            loadedData: {
                srcZone: [],
                uuid: [],
                attackType: [],
                dstZone: [],
                grpName: []
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
            if (this.queryObj.src_ip) {
                this.params.srcIpGroup = 'src_ip';
                this.params.srcIp = this.queryObj.src_ip;
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
            if (this.queryObj.attack_type) {
                this.params.attackType = this.queryObj.attack_type;
            }

            this.submit();
        },

        restLists (value) {

            //  当从store中加载值时，不重置
            if (value === this.storeParams.uuid) {
                return;
            }

            this.params.srcZone = '';
            this.params.dstZone = '';
            this.params.attackType = '';
            this.params.grpName = '';
            this.loadedData.srcZone = [];
            this.loadedData.attackType = [];
            this.loadedData.dstZone = [];
            this.loadedData.grpName = [];
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

        handleAttackTypeVisibleChange (v) {
            if (!v || Array.isArray(this.loadedData.attackType) &&
                this.loadedData.attackType.length > 0) {
                return;
            }
            this.loadAttackType();
        },

        handleGrpNameVisibleChange (v) {
            if (!v || Array.isArray(this.loadedData.grpName) &&
                this.loadedData.grpName.length > 0) {
                return;
            }
            this.loadGrpName();
        },

        handleRadioChange () {

            //单选改变时，清空之前的内容
            this.params.srcIp = '';
            this.params.userName = '';
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
            if (this.queryObj.src_ip) {
                this.params.srcIp = this.queryObj.src_ip;
            }
            this.formValid = true;
        },

        loadUuid () {
            if (this.loadingStatus.uuid) {
                return;
            }
            this.loadingStatus.uuid = true;
            loadAfUuid()
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

        loadAttackType () {
            if (!this.params.uuid) {
                return;
            }
            this.loadingStatus.attackType = true;
            loadList(this.normalizedBoxSearchParams(this.params.uuid, 'utmtype'))
                .then((res) => {
                    this.loadedData.attackType = res.data.data || [];
                    this.loadingStatus.attackType = false;
                })
                .catch(() => {
                })
                .finally(() => {
                    this.loadingStatus.attackType = false;
                });
        },

        loadGrpName () {
            if (!this.params.uuid) {
                return;
            }
            this.loadingStatus.grpName = true;
            loadList(this.normalizedBoxSearchParams(this.params.uuid, 'CfgGroupName'))
                .then((res) => {
                    let loaded = (res.data && res.data.data) || [];
                    if (loaded[0] && loaded[0].name === '/') {
                        loaded[0].name = '';
                        loaded[0].real_name = '所有';
                    }
                    this.loadedData.grpName = loaded;
                })
                .catch(() => { })
                .finally(() => {
                    this.loadingStatus.grpName = false;
                });
        },

        submit () {
            this.params.netAction = this.params.action;
            this.params.level = ['高', '中', '低', '信息'].filter(item => this.params.level.indexOf(item) >= 0);
            this.cacheParams(this.params);
            this.cacheLoadedData(this.loadedData);

            // 其余组件统一通过vuex进行取值
            this.$emit('submit');
        }

    }
};
</script>

<style lang="postcss">
.utm-query-wrapper {
    padding: 20px 16px;
    box-sizing: border-box;
    background-color: #fff;
}
</style>
