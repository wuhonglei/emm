<template>
    <div class="third-party-query-wapper query">
        <el-form 
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
                        {{ QUERY_NAME.collectorName }}
                    </div>
                    <div class="form__content">
                        <el-select 
                            v-model="params.collectorName"
                            :loading="loadingStatus.collectorName"
                            @visible-change="handlecollectorNameVisibleChange">
                            <el-option 
                                v-for="uuid in loadedData.collectorName"
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
                        {{ QUERY_NAME.pluginName }}
                    </div>
                    <div class="form__content">
                        <el-select 
                            v-model="params.pluginName"
                            :loading="loadingStatus.pluginName"
                            @visible-change="handlepluginNameVisibleChange">
                            <el-option 
                                v-for="item in loadedData.pluginName"
                                :key="item.name"
                                :label="item.name || '所有采集器类型'"
                                :value="item.name" />
                        </el-select>
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
                        {{ QUERY_NAME.srcIp }}
                    </div>
                    <div class="form__content">
                        <el-form-item prop="srcIp">
                            <el-input 
                                v-model="params.srcIp"
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
                                placeholder="所有" />
                        </el-form-item>
                    </div>
                </div>
                <div class="form">
                    <div class="form__label">
                        {{ QUERY_NAME.content }}
                    </div>
                    <div class="form__content">
                        <el-form-item prop="content">
                            <el-input
                                v-model="params.content"
                                placeholder="所有" />
                        </el-form-item>
                    </div>
                </div>
            </div>
        </el-form>
        <div class="query__button">
            <el-button 
                type="primary"
                :disabled="!formValid || !params.collectorName"
                @click="submit">
                查询
            </el-button>
            <el-button 
                v-if="status !== 'init'"
                @click="close">
                关闭
            </el-button>
        </div>
    </div>
</template>
<script>

/**
 * 第三方日志查询条件
 */

import { QUERY_NAME } from 'src/utils/consts';
import { mapGetters, mapMutations } from 'vuex';
import query from 'src/common/mixins/query';
import rules from './params_rules';
import { COLLECTOR_TYPES } from 'src/utils/consts'; 
import { getAllPluginNames } from 'src/common/api/asset_center';
import uuidSelectItem from 'src/common/components/uuid_select_item';
import cache, { cacheDate } from 'src/utils/cache';
import { loadUuid } from 'src/common/api/log';
import { normalizeParams } from 'src/utils/api_help.js';

let loadAcUuid = normalizeParams(loadUuid, 'tp');


export default {
    components: {uuidSelectItem},

    filters: {
        nameIp (v, defaultText, nameKey, ipKey) {
            if (v[nameKey || 'name'] && v[ipKey || 'ip']) {
                return `${v[nameKey || 'name']}（${v[ipKey || 'ip']}）`;
            }
            return defaultText;
        }
    },
    mixins: [query],

    data () {
        return {
            QUERY_NAME,
            defaultCollectorTypes: COLLECTOR_TYPES.map((item) => item.value),
            rules,
            formValid: true,
            params: {
                startDate: '',
                startTime: '',
                endDate: '',
                endTime: '',
                collectorName: '',
                pluginName: '',
                level: '',
                srcIp: '',
                srcPort: '',
                dstIp: '',
                content: ''
            },
            loadingStatus: {
                collectorName: false,
                pluginName: false,
                dstZone: false,
                attackType: false
            },
            loadedData: {
                collectorName: [],
                pluginName: []
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

        if (this.status !== 'init') {

            //  非第一次加载
            this.sync();
        } else {
            let params = this.params;

            //  设置初始值
            let date = new Date();
            const DATE1 = 3600;
            const DATE2 = 1000;
            const DATE3 = 24;
            params.startDate = cacheDate('queryStartDate') || new Date();
            params.endDate = cacheDate('queryEndDate') || new Date(date.setTime(date.getTime() + DATE1 * DATE2 * DATE3));
            params.startTime = cache('queryStartTime') || '00:00';
            params.endTime = cache('queryEndTime') || '00:00';
            params.level = ['致命', '高', '中', '低', '信息'];

            this.loadConrollerTypes();
            this.loadUuid();

        }
    },

    methods: {
        ...mapMutations('query', ['cacheParams', 'cacheLoadedData']),
        ...mapMutations('splitPanel', ['queryed']),

        handlecollectorNameVisibleChange (visibale) {
            if (!visibale || this.hasLoadedData('collectorName')) {
                return;
            }
            this.loadUuid();
        },

        loadUuid () {
            if (this.loadingStatus.collectorName) {
                return;
            }
            this.loadingStatus.collectorName = true;
            loadAcUuid()
                .then(({ data }) => {
                    this.loadedData.collectorName = [{
                        ip:'IP',
                        uuid:'所有采集器',
                        name:'所有采集器'
                    }].concat(this.sortedUuid(data.data || []));

                    this.$nextTick(()=>{
                        this.params.collectorName = this.loadedData.collectorName[0].uuid;
                    });
                })
                .finally(() => {
                    this.loadingStatus.collectorName = false;
                });
        },

        handlepluginNameVisibleChange (visibale) {
            if (!visibale || this.hasLoadedData('pluginName')) {
                return;
            }
            this.loadConrollerTypes();
        },

        // 加载所有采集器类型
        loadConrollerTypes () {
            this.loadingStatus.pluginName = true;
            getAllPluginNames()
                .then((res) => {

                    // 添加所有采集器名称/IP的数据
                    this.loadedData.pluginName = [{
                        name: void(0) 
                    }].concat(res.data && res.data.data || []);
                    this.$nextTick(() => {
                        this.params.pluginName = void(0);
                    });
                })
                .catch(() => {
                })
                .finally(() => {
                    this.loadingStatus.pluginName = false;
                });
        },

        submit () {
            this.params.uuid = this.params.collectorName;
            this.cacheParams(this.params);
            this.cacheLoadedData(this.loadedData);

            this.$emit('submit');
        },

        close () {
            this.queryed();
        }
    }
};
</script>
