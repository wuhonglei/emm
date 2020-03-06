<template>
    <div class="ips-query-wrapper query">
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
                        {{ QUERY_NAME.attackZone }}
                    </div>
                    <div class="form__content">
                        <el-select v-model="params.attackZone"
                                   :loading="loadingStatus.attackZone"
                                   @visible-change="handleSrcZoneVisibleChange">
                            <el-option label="所有区域"
                                       value="" />
                            <el-option v-for="attackZone in loadedData.attackZone"
                                       :key="attackZone.id"
                                       :label="attackZone.name"
                                       :value="attackZone.name" />
                        </el-select>
                    </div>
                </div>
                <div class="form">
                    <div class="form__label">
                        {{ QUERY_NAME.attackIp }}
                    </div>
                    <div class="form__content">
                        <el-form-item prop="attackIp">
                            <el-input v-model="params.attackIp"
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
                        {{ QUERY_NAME.attackedZone }}
                    </div>
                    <div class="form__content">
                        <el-select v-model="params.attackedZone"
                                   :loading="loadingStatus.attackedZone"
                                   @visible-change="handleDestZoneVisibleChange">
                            <el-option label="所有区域"
                                       value="" />
                            <el-option v-for="attackedZone in loadedData.attackedZone"
                                       :key="attackedZone.id"
                                       :value="attackedZone.name"
                                       :label="attackedZone.name" />
                        </el-select>
                    </div>
                </div>
                <div class="form">
                    <div class="form__label">
                        {{ QUERY_NAME.attackedIp }}
                    </div>
                    <div class="form__content">
                        <el-form-item prop="attackedIp">
                            <el-input v-model="params.attackedIp"
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
                <div v-show="more"
                     class="form">
                    <div class="form__label">
                        {{ QUERY_NAME.holeType }}
                    </div>
                    <div class="form__content">
                        <el-select v-model="params.holeType"
                                   :loading="loadingStatus.holeType"
                                   @visible-change="handleAttackTypeVisibleChange">
                            <el-option label="所有漏洞"
                                       value="" />
                            <el-option v-for="holeType in loadedData.holeType"
                                       :key="holeType.id"
                                       :value="holeType.name"
                                       :label="holeType.name" />
                        </el-select>
                    </div>
                </div>
                <div v-show="more"
                     class="form">
                    <div class="form__label">
                        {{ QUERY_NAME.holeId }}
                    </div>
                    <div class="form__content">
                        <el-form-item prop="holeId">
                            <el-input v-model="params.holeId"
                                      placeholder="所有ID" />
                        </el-form-item>
                    </div>
                </div>
                <div class="form">
                    <div class="form__label">
                        {{ QUERY_NAME.level }}
                    </div>
                    <div class="form__content">
                        <el-checkbox-group v-model="params.level"
                                           :min="1">
                            <el-checkbox label="致命">
                                致命
                            </el-checkbox>
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
 * ips 查询
 */

import { QUERY_NAME } from 'src/utils/consts';
import rules from './ips_rules';
import { mapMutations, mapGetters } from 'vuex';
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
            more: false,
            formValid: true,
            rules,
            params: {
                startDate: '',
                startTime: '',
                endDate: '',
                endTime: '',
                uuid: '',
                attackZone: '',
                attackIp: '',
                attackedZone: '',
                attackedIp: '',
                holeType: '',
                level: [
                    '致命',
                    '高',
                    '中',
                    '低',
                    '信息'
                ],
                action: [
                    '允许',
                    '拒绝'
                ],
                holeId: ''
            },
            loadingStatus: {
                attackZone: false,
                uuid: false,
                holeType: false,
                attackedZone: false
            },
            loadedData: {
                attackZone: [],
                uuid: [],
                holeType: [],
                attackedZone: []
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
                this.params.attackIp = this.queryObj.att_ip;
            }
            if (this.queryObj.src_ip) {
                this.params.attackedIp = this.queryObj.src_ip;
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
                this.params.holeType = this.queryObj.attack_type;
            }

            this.submit();
        },

        //  当uuid改变时, attackZone,attackedZone,holeType
        resetLists (value) {

            //  当从store中加载值时，不重置
            if (value === this.storeParams.uuid) {
                return;
            }

            this.params.attackZone = '';
            this.params.attackedZone = '';
            this.params.holeType = '';
            this.loadedData.attackedZone = [];
            this.loadedData.attackZone = [];
            this.loadedData.holeType = [];
        },

        handleUuidVisibleChange (v) {
            if (!v || Array.isArray(this.loadedData.uuid) &&
                this.loadedData.uuid.length > 0) {
                return;
            }
            this.loadUuid();
        },

        handleSrcZoneVisibleChange (v) {
            if (!v || Array.isArray(this.loadedData.attackZone) &&
                this.loadedData.attackZone.length > 0) {
                return;
            }
            this.loadSourceZone();
        },

        handleDestZoneVisibleChange (v) {
            if (!v || Array.isArray(this.loadedData.attackedZone) &&
                this.loadedData.attackedZone.length > 0) {
                return;
            }
            this.loadDestinationZone();
        },

        handleAttackTypeVisibleChange (v) {
            if (!v || Array.isArray(this.loadedData.holeType) &&
                this.loadedData.holeType.length > 0) {
                return;
            }
            this.loadAttackType();
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
            this.loadingStatus.attackZone = true;
            loadList(this.normalizedBoxSearchParams(this.params.uuid, 'CfgZoneInfo'))
                .then((res) => {
                    this.loadedData.attackZone = res.data.data || [];
                    this.loadingStatus.attackZone = false;
                })
                .catch(() => {
                })
                .finally(() => {
                    this.loadingStatus.attackZone = false;
                });
        },

        loadDestinationZone () {
            if (!this.params.uuid) {
                return;
            }
            this.loadingStatus.attackedZone = true;
            loadList(this.normalizedBoxSearchParams(this.params.uuid, 'CfgZoneInfo'))
                .then((res) => {
                    this.loadedData.attackedZone = res.data.data || [];
                    this.loadingStatus.attackedZone = false;
                })
                .catch(() => {
                })
                .finally(() => {
                    this.loadingStatus.attackedZone = false;
                });
        },

        loadAttackType () {
            if (!this.params.uuid) {
                return;
            }
            this.loadingStatus.holeType = true;
            loadList(this.normalizedBoxSearchParams(this.params.uuid, 'CfgIPSHoleType'))
                .then((res) => {
                    this.loadedData.holeType = res.data.data || [];
                    this.loadingStatus.holeType = false;
                })
                .catch(() => {
                })
                .finally(() => {
                    this.loadingStatus.holeType = false;
                });
        },

        submit () {
            this.params.netAction = this.params.action;
            this.params.srcZone = this.params.attackZone;
            this.params.srcIp = this.params.attackIp;
            this.params.attackedIp = this.params.attackedIp;
            this.params.dstZone = this.params.attackedZone;

            //  排序，保证等级按严重性排列
            this.params.level = ['致命', '高', '中', '低', '信息'].filter(item => this.params.level.indexOf(item) >= 0);
            this.cacheParams(this.params);
            this.cacheLoadedData(this.loadedData);

            // 其余组件统一通过vuex进行取值
            this.$emit('submit');
        }
    }
};
</script>

<style lang="postcss">
.ips-query-wrapper {
    padding: 20px 16px;
    box-sizing: border-box;
    background-color: #fff;
}
</style>
