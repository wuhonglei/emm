<template>
    <div class="linkopr-query-wrapper query">
        <query-dialog
            v-if="hackReset"
            ref="hostNameDialog"
            title="终端"
            data-label="name"
            data-key="name"
            :load-node-data="loadAgents"
            :load-tree-data="loadGroups"
            :data-type="agentOrGroupType"
            :init-selects="params.hostNameSelects"
            :init-tree-data="loadedData.userGroupTreeData" 
            @submit="handleHostNameSubmit" />
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
                <template v-if="more">
                    <div class="form">
                        <div class="form__label">
                            联动设备
                        </div>
                        <div class="form__content">
                            <el-select v-model="params.opSrc">
                                <el-option
                                    v-for="dev in LINK_DEV"
                                    :key="dev.name"
                                    :label="dev.name"
                                    :value="dev.value" />
                            </el-select>
                        </div>
                    </div>
                    <div class="form">
                        <div class="form__label">
                            联动类型
                        </div>
                        <div class="form__content">
                            <el-select v-model="params.module">
                                <el-option
                                    v-for="type in LINK_TYPES"
                                    :key="type.name"
                                    :label="type.name"
                                    :value="type.value" />
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
                                    placeholder="输入IP或IP段，支持输入多个，用逗号分隔" />
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
                                <lang>地址范围中间用-连接，如192.168.0.1-192.168.0.10</lang>
                            </p>
                        </popover>
                    </div>
                    <div class="form">
                        <div class="form__label">
                            终端名称
                        </div>
                        <div class="form__content">
                            <el-input
                                v-model="params.hostNameString"
                                size="small"
                                icon="more"
                                :on-icon-click="showHostNameDialog"
                                placeholder="所有"
                                readonly="readonly" />
                        </div>
                    </div>
                </template>
            </div>
        </el-form>
        <div
            class="query__more"
            @click="more = !more">
            <span>{{ more ? '收起' : '详细条件' }}</span>
            <i :class="more ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
               style="margin-left: 4px;"></i>
        </div>
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
import { LINK_DEV, LINK_TYPES } from './consts';
import { mapMutations, mapGetters } from 'vuex';
import { loadUuid, loadList } from 'src/common/api/log';
import query from 'src/common/mixins/query';
import { normalizeParams } from 'src/utils/api_help';
import queryDialog from 'src/common/components/agent_query_dialog';
import rules from '../edr_rules.js';
import uuidSelectItem from 'src/common/components/uuid_select_item';
import popover from 'src/common/components/form_tips/popover';

let loadEdrUuid = normalizeParams(loadUuid, 'edr');

export default {
    components: {
        queryDialog, 
        uuidSelectItem,
        popover
    },
    mixins: [query],

    data () {
        return {
            QUERY_NAME,
            LINK_DEV,
            LINK_TYPES,
            more: false,
            rules,
            formValid: true,
            DEFAULT_PICKER_OPTIONS,
            hackReset: true,
            params: {
                startDate: '',
                startTime: '',
                endDate: '',
                endTime: '',
                uuid: '',
                opSrc: '',
                module: '',
                srcIp: '',
                hostName: '',
                hostNameSelects: [],
                hostName: [],
                hostNameString: ''
            },
            loadingStatus: {
                uuid: false
            },
            loadedData: {
                uuid: [],
                userGroupTreeData: []
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

            this.hackReset = false;
            this.$nextTick(() => this.hackReset = true);
            this.params.hostNameSelects = [];
            this.params.hostName = [];
            this.params.hostNameString = '所有';
            this.loadedData.userGroupTreeData = [];
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

        showHostNameDialog () {
            this.$refs.hostNameDialog.$emit('open');
        },

        hostNameResultFilter (node) {
            if (node._checked) {
                return [true, true];
            }
            if (node.children && 
                node.children.some(item => item._notGroup) && 
                node.children.every(item => (item._checked || !item._notGroup))) {
                return [true, true];
            }
            return [false, true];
        },

        loadAgents (node) {
            let params = this.normalizedBoxSearchParams(this.params.uuid, 'list_host');
            params.sort_para.zone_id = node.id;
            return loadList(params);
        },

        loadGroups () {
            return loadList(this.normalizedBoxSearchParams(this.params.uuid, 'server_zone'));
        },

        agentOrGroupType (data) {
            return data._notGroup ? '终端' : '组';
        },

        handleHostNameSubmit (selectData, loadedTreeData) {
            this.params.hostNameSelects = selectData;
            this.loadedData.userGroupTreeData = loadedTreeData;

            //  选择了所有
            if (selectData.some(item => item._root)) {
                this.params.hostNameString = '所有';
                this.params.hostName = '';
                return;
            }

            this.params.hostName = selectData.reduce((res, item) => {
                if (!item._notAgent) {
                    res.push(item.name_ip);
                }
                return res;
            }, []);

            this.params.hostNameString = this.params.hostName.join(',');
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
.linkopr-query-wrapper {
    padding: 20px 16px;
    box-sizing: border-box;
    background-color: #fff;
}
</style>
