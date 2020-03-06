<template>
    <div class="global-query-wrapper query">
        <el-form 
            v-model="formValid"
            :rules="rules"
            :model="params">
            <div class=".query__title">
                <lang>时间范围</lang>
            </div>
            <time-range-picker
                :startDate.sync="params.startDate"
                :startTime.sync="params.startTime"
                :endDate.sync="params.endDate"
                :endTime.sync="params.endTime" />
            <div class="query__title bt">
                <lang>其他</lang>
            </div>
            <div class="query__content">
                <div class="form">
                    <div class="form__label">
                        {{ QUERY_NAME.uuid }}
                    </div>
                    <div class="form__content">
                        <el-select
                            v-model="params.uuid"
                            :filterable="true"
                            :filter-method="handleUuidQueryChange"
                            :loading="loadingStatus.uuid"
                            no-data-text="没有可查询组件"
                            @visible-change="handleUuidVisibleChange"
                            @change="resetList">
                            <el-option
                                v-for="uuid in loadedData.uuid"
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
                        {{ QUERY_NAME.srcIp }}
                    </div>
                    <div class="form__content">
                        <el-form-item prop="srcIp">
                            <el-input
                                v-model="params.srcIp"
                                size="small"
                                placeholder="请输入源IP" />
                        </el-form-item>
                    </div>
                    <popover :width="300">
                        <p>
                            <lang>可以输入单个IP地址，多个IP地址网段或者IP范围</lang>
                        </p>
                        <p>
                            <lang>多个IP之间请用'，'隔开</lang>
                        </p>
                        <p>
                            <lang>IPv4网段书写，如192.168.1.0/255.255.255.0</lang>
                        </p>
                        <p>
                            <lang>IPv6网段书写，如2001:ffe0::2/20</lang>
                        </p>
                        <p>
                            <lang>地址范围中间用-连接，如192.168.0.1-192.168.0.10</lang>
                        </p>
                    </popover>
                </div>
                <div class="form">
                    <div class="form__label">
                        {{ QUERY_NAME.srcPort }}
                    </div>
                    <div class="form__content portContent">
                        <el-form-item prop="srcPort">
                            <el-input 
                                class="input"
                                v-model="params.srcPort"
                                placeholder="所有" />
                        </el-form-item>
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
                                size="small"
                                placeholder="请输入目的IP" />
                        </el-form-item>
                    </div>
                    <popover :width="300">
                        <p>
                            <lang>可以输入单个IP地址，多个IP地址网段或者IP范围</lang>
                        </p>
                        <p>
                            <lang>多个IP之间请用'，'隔开</lang>
                        </p>
                        <p>
                            <lang>IPv4网段书写，如192.168.1.0/255.255.255.0</lang>
                        </p>
                        <p>
                            <lang>IPv6网段书写，如2001:ffe0::2/20</lang>
                        </p>
                        <p>
                            <lang>地址范围中间用-连接，如192.168.0.1-192.168.0.10</lang>
                        </p>
                    </popover>
                </div>
                <div class="form">
                    <div class="form__label">
                        {{ QUERY_NAME.dstPort }}
                    </div>
                    <div class="form__content portContent">
                        <el-form-item prop="dstPort">
                            <el-input 
                                v-model="params.dstPort"
                                placeholder="所有" />
                        </el-form-item>
                    </div>
                </div>
                <div class="form">
                    <div class="form__label">
                        {{ QUERY_NAME.level }}
                    </div>
                    <div class="form__content portContent">
                        <el-checkbox-group
                            v-model="params.level"
                            :min="1">
                            <el-checkbox label="致命">
                                <lang>致命</lang>
                            </el-checkbox>
                            <el-checkbox label="高">
                                <lang>高</lang>
                            </el-checkbox>
                            <el-checkbox label="中">
                                <lang>中</lang>
                            </el-checkbox>
                            <el-checkbox label="低">
                                <lang>低</lang>
                            </el-checkbox>
                            <el-checkbox label="信息">
                                <lang>信息</lang>
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
                <div class="form">
                    <div class="form__label">
                        {{ QUERY_NAME.keywords }}
                    </div>
                    <div class="form__content">
                        <el-form-item prop="keywords">
                            <el-input
                                v-model="params.keywords"
                                size="small"
                                placeholder="请输入搜索关键字" />
                        </el-form-item>
                    </div>
                    <popover :width="160">
                        <lang>网站URL(含域名)，网页标题</lang>
                    </popover>
                </div>
            </div>
        </el-form>
        <div class="query__button">
            <el-button
                type="primary"
                :disabled="!formValid"
                @click="submit">
                <lang>查询</lang>
            </el-button>
            <el-button
                v-if="status !== 'init'"
                @click="close">
                <lang>关闭</lang>
            </el-button>
        </div>
    </div>
</template>

<script>

/** 
 * 网络访问日志查询
*/

import { QUERY_NAME, TIME_ORDER } from 'src/utils/consts';
import rules from './params.rules';
import popover from 'src/common/components/form_tips/popover';
import { mapGetters, mapMutations } from 'vuex';
import query from 'src/common/mixins/query';
import { loadAllUuid } from 'src/common/api/log';
import { exchangeTimeOrder } from 'src/utils/api_help.js';
import uuidSelectItem from 'src/common/components/uuid_select_item';

export default {
    components: {
        popover,
        uuidSelectItem
    },
    mixins: [query],

    data () {
        return {
            QUERY_NAME,
            TIME_ORDER,
            rules,
            formValid: true,
            hackReset: true,
            params: {
                startDate: '',
                startTime: '',
                endDate: '',
                endTime: '',
                uuid: null,
                product: '',
                srcIp: '',
                dstIp: '',
                level: ['致命', '高', '中', '低', '信息'],
                keywords: ''
            },
            loadingStatus: {
                uuid: false
            },
            loadedData: {
                uuid: []
            }
        };
    },

    computed: {
        ... mapGetters('query', {
            storeParams: 'params'
        }),
        ... mapGetters('splitPanel', ['status'])
    },

    watch: {
        'params.uuid' (v) {
            let selected = this.loadedData.uuid.find(item => item.uuid === v);
            this.params.product = selected && selected.product;
        }
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
            this.loadUuid();
            params.control = ['记录', '拒绝'];
        }
        
    },
    methods: {
        ...mapMutations('query', ['cacheParams', 'cacheLoadedData']),
        ...mapMutations('splitPanel', ['queryed']),

        resetList (value) {

            //  当从store中加载值时，不重置
            if (value === this.storeParams.uuid) {
                return;
            }
            
            this.hackReset = false;
            this.$nextTick(() => this.hackReset = true);
        },

        handleUuidVisibleChange (v) {
            if (!v || this.hasLoadedData('uuid')) {
                return;
            }

            this.loadUuid();
        },

        // 直接输入时空的时候清除选项
        handleUuidQueryChange (v) {
            if (!v) {
                this.params.uuid = null;
            }
        },

        loadUuid () {
            if (this.loadingStatus.uuid) {
                return;
            }
            this.loadingStatus.uuid = true;
            loadAllUuid()
                .then(({ data }) => {
                    this.loadedData.uuid = data.data || [];
                })
                .finally(() => {
                    this.loadingStatus.uuid = false;
                });
        },

        submit () {
            this.cacheParams(this.params);
            this.cacheLoadedData(this.loadedData);

            // 其余组件统一通过vuex进行取值
            this.$emit('submit');
        },

        close () {
            this.queryed();
        }
    }
};
</script>

<style lang="postcss">
.global-query-wrapper {
    padding: 20px 16px;
    box-sizing: border-box;
    background-color: #fff;

    & .portContent{
        & .el-form-item{
            display: inline-block;
            width: 100%;
        }
    }
}
</style>