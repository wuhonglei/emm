<template>
    <div class="waf-query-wrapper query">
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
                        {{ QUERY_NAME.uuid }}
                    </div>
                    <div class="form__content">
                        <el-select v-model="params.uuid"
                                   :loading="loadingStatus.uuid"
                                   no-data-text="没有可查询组件"
                                   @change="resetLists"
                                   @visible-change="handleUuidVisibleChange">
                            <el-option v-for="item in loadedData.uuid"
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
                        <el-select v-model="params.srcZone"
                                   :loading="loadingStatus.srcZone"
                                   @visible-change="handleSrcZoneVisibleChange">
                            <el-option label="所有区域"
                                       value="" />
                            <el-option v-for="item in loadedData.srcZone"
                                       :key="item.id"
                                       :label="item.name"
                                       :value="item.name" />
                        </el-select>
                    </div>
                </div>
                <div class="form">
                    <div class="form__label">
                        {{ QUERY_NAME.srcIp }}
                    </div>
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
                </div>
                <div class="form">
                    <div class="form__label">
                        {{ QUERY_NAME.dstZone }}
                    </div>
                    <div class="form__content">
                        <el-select v-model="params.dstZone"
                                   :loading="loadingStatus.dstZone"
                                   @visible-change="handleDstZoneVisibleChange">
                            <el-option label="所有区域"
                                       value="" />
                            <el-option v-for="item in loadedData.dstZone"
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
                            <el-input v-model="params.dstIp"
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
                        <el-select v-model="params.attackType"
                                   :loading="loadingStatus.attackType"
                                   @visible-change="handleAttackTypeVisibleChange">
                            <el-option label="所有类型"
                                       value="" />
                            <el-option v-for="item in loadedData.attackType"
                                       :key="item.id"
                                       :label="item.name"
                                       :value="item.name" />
                        </el-select>
                    </div>
                </div>
                <div v-if="more"
                     class="form">
                    <div class="form__label">
                        {{ QUERY_NAME.sid }}
                    </div>
                    <div class="form__content">
                        <el-form-item prop="sid">
                            <el-input v-model="params.sid"
                                      placeholder="所有" />
                        </el-form-item>
                    </div>
                    <popover :width="450">
                        <p>请输入查询的sid，支持查询多个sid（最多支持10个sid），每个sid之间用“,”隔开</p>
                    </popover>
                </div>
                <div v-if="more"
                     class="form">
                    <div class="form__label">
                        {{ QUERY_NAME.status }}
                    </div>
                    <div class="form__content">
                        <el-form-item prop="status">
                            <el-input v-model="params.status"
                                      placeholder="所有" />
                        </el-form-item>
                    </div>
                    <popover :width="540">
                        <p>请输入查询的状态码，支持查询多个状态码（最多支持10个状态码），每个状态码之间用“,”隔开</p>
                    </popover>
                </div>
                <div class="form">
                    <div class="form__label">
                        {{ QUERY_NAME.url }}
                    </div>
                    <div class="form__content">
                        <el-form-item prop="url">
                            <el-input v-model="params.url"
                                      placeholder="所有" />
                        </el-form-item>
                    </div>
                    <popover :width="500">
                        <p>请输入查询的域名/URL内容，不支持正则表达式和多个内容搜索，最大支持长度1024.格式如：</p>
                        <p>1. www.sangfor.com.cn 或 192.168.1.1</p>
                        <p>2. /index.html</p>
                        <p>3. www.sangfor.com.cn/index.html 或 192.168.1.1/index.html</p>
                    </popover>
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
 * waf 查询
 */

import { QUERY_NAME } from 'src/utils/consts';
import rules from './waf_rules';
import { mapMutations, mapGetters } from 'vuex';
import query from 'src/common/mixins/query';
import { loadUuid, loadList } from 'src/common/api/log';
import { normalizeParams } from 'src/utils/api_help';
import popover from 'src/common/components/form_tips/popover';
import uuidSelectItem from 'src/common/components/uuid_select_item';

let loadAfUuid = normalizeParams(loadUuid, 'af');

export default {
    components: { popover, uuidSelectItem },

    mixins: [query],

    data () {
        return {
            QUERY_NAME,
            more: false,
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
                dstZone: '',
                dstIp: '',
                attackType: '',
                url: '',
                contentFt: '',
                level: ['高', '中', '低'],
                action: ['允许', '拒绝'],
                sid: '',
                status: ''
            },
            loadingStatus: {
                uuid: false,
                srcZone: false,
                dstZone: false,
                attackType: false
            },
            loadedData: {
                uuid: [],
                srcZone: [],
                dstZone: [],
                attackType: []
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
            if (this.queryObj.att_ip) {
                this.params.srcIp = this.queryObj.att_ip;
            }
            if (this.queryObj.src_ip) {
                this.params.dstIp = this.queryObj.src_ip;
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

        //  当uuid改变时, 重置srcZone,dstZone,attackType
        resetLists (value) {

            //  当从store中加载值时，不重置
            if (value === this.storeParams.uuid) {
                return;
            }

            this.params.srcZone = '';
            this.params.dstZone = '';
            this.params.attackType = '';
            this.loadedData.srcZone = [];
            this.loadedData.dstZone = [];
            this.loadedData.attackType = [];
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
                .then(({ data }) => {
                    this.loadedData.srcZone = data && data.data || [];
                    this.loadingStatus.srcZone = false;
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
                .then(({ data }) => {
                    this.loadedData.dstZone = data && data.data || [];
                    this.loadingStatus.dstZone = false;
                })
                .catch(() => {
                })
                .finally(() => {
                    this.loadingStatus.dstZone = false;
                });
        },

        // 加载attackType
        handleAttackTypeVisibleChange (visibale) {
            if (!visibale || (Array.isArray(this.loadedData.attackType) && this.loadedData.attackType.length > 0)) {
                return;
            }
            this.loadAttackType();
        },

        loadAttackType () {
            if (!this.params.uuid) {
                return;
            }
            this.loadingStatus.attackType = true;

            //  查询attackType表
            loadList(this.normalizedBoxSearchParams(this.params.uuid, 'CfgWAFHoleType'))
                .then(({ data }) => {
                    this.loadedData.attackType = data && data.data || [];
                    this.loadingStatus.attackType = false;
                })
                .catch(() => {
                })
                .finally(() => {
                    this.loadingStatus.attackType = false;
                });
        },

        submit () {
            this.params.contentFt = this.params.url;
            this.params.netAction = this.params.action;
            this.params.level = ['高', '中', '低'].filter(item => this.params.level.indexOf(item) >= 0);
            this.cacheParams(this.params);
            this.cacheLoadedData(this.loadedData);

            // 其余组件统一通过vuex进行取值
            this.$emit('submit');
        }
    }
};
</script>

<style lang="postcss">
.waf-query-wrapper {
    padding: 20px 16px;
    box-sizing: border-box;
    background-color: #fff;
}
</style>
