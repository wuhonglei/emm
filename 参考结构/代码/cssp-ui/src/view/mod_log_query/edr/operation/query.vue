<template>
    <div class="operation-query-wrapper query">
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
                                :value="item.uuid"
                                :label="item.name|uuidIp(item.ip)">
                                <uuid-select-item :data="item" />
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form">
                    <div class="form__label">
                        {{ QUERY_NAME.usrName }}
                    </div>
                    <div class="form__content">
                        <el-select
                            v-model="params.userName"
                            :loading="loadingStatus.userName"
                            @visible-change="handleUserNameVisibleChange">
                            <el-option
                                label="所有"
                                value="" />
                            <el-option
                                v-for="item in loadedData.userName"
                                :key="item.name"
                                :label="item.name"
                                :value="item.name" />
                        </el-select>
                    </div>
                </div>
                <div class="form">
                    <div class="form__label">
                        IP地址
                    </div>
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
 * edr日志查询
 */

import { QUERY_NAME, DEFAULT_PICKER_OPTIONS } from 'src/utils/consts';
import { mapMutations, mapGetters } from 'vuex';
import { loadList, loadUuid } from 'src/common/api/log';
import popover from 'src/common/components/form_tips/popover';
import query from 'src/common/mixins/query';
import rules from '../edr_rules.js';
import { normalizeParams } from 'src/utils/api_help';
import uuidSelectItem from 'src/common/components/uuid_select_item';

let loadEdrUuid = normalizeParams(loadUuid, 'edr');

export default {
    components: {popover, uuidSelectItem},
    mixins: [query],

    data () {
        return {
            QUERY_NAME,
            DEFAULT_PICKER_OPTIONS,
            more: false,
            rules,
            formValid: true,
            params: {
                startDate: '',
                startTime: '',
                endDate: '',
                endTime: '',
                uuid: '',
                userName: '',
                srcIp: ''
            },
            loadingStatus: {
                uuid: false,
                userName: false
            },
            loadedData: {
                uuid: [],
                userName: []
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

        resetLists (value) {

            //  当从store中加载值时，不重置
            if (value === this.storeParams.uuid) {
                return;
            }

            this.params.userName = '';
            this.loadedData.userName = [];
        },

        handleUuidVisibleChange (v) {
            if (!v || Array.isArray(this.loadedData.uuid) &&
                this.loadedData.uuid.length > 0) {
                return;
            }
            this.loadUuid();
        },

        loadUuid () {
            if (this.loadingStatus.uuid) {
                return;
            }
            this.loadingStatus.uuid = true;
            loadEdrUuid()
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

        handleUserNameVisibleChange (v) {
            if (!v || this.loadedData.userName.length > 0) {
                return;
            }
            this.loadUserName();
        },

        loadUserName () {
            if (!this.params.uuid) {
                return;
            }
            this.loadingStatus.userName = true;
            loadList(this.normalizedBoxSearchParams(this.params.uuid, 'sys_account'))
                .then(({data}) => {
                    this.loadedData.userName = data.data || [];
                })
                .catch(() => {})
                .finally(() => {
                    this.loadingStatus.userName = false;
                });
        },

        submit () {
            this.cacheParams(this.params);
            this.cacheLoadedData(this.loadedData);

            // 其余组件统一通过vuex进行取值
            this.$emit('submit');
        }
    }
};
</script>

<style lang="postcss">
.operation-query-wrapper {
    padding: 20px 16px;
    box-sizing: border-box;
    background-color: #fff;
}
</style>
