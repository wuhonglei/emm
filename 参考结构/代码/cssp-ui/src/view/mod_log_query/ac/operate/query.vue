<template lang="pug">
.operate-query-wrapper.query
    el-form(v-model="formValid" :rules="rules" :model="params")
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
                            :key="item.id"
                            :label="item.name|uuidIp(item.ip)"
                            :value="item.uuid")
                            uuid-select-item(:data="item")
            .form
                .form__label {{QUERY_NAME.admin}}
                .form__content
                    el-select(v-model="params.admin" 
                        :loading="loadingStatus.admin"
                        @visible-change="handleUserNameVisibleChange")
                        el-option(label="所有用户" value="")
                        el-option(v-for="item in loadedData.admin"
                            :key="item.id"
                            :label="item.name"
                            :value="item.name")
            .form
                .form__label {{QUERY_NAME.depict}}
                .form__content
                    el-form-item(prop="depict")
                        el-input(v-model="params.depict")
    .query__button
        el-button(type="primary" @click="submit" :disabled="!formValid || !params.uuid") 查询
        el-button(v-if="status !== 'init'" @click="$emit('hide')") 关闭
</template>

<script>

/**
 * 操作日志 查询
 */

import { QUERY_NAME } from 'src/utils/consts';
import { mapMutations, mapGetters } from 'vuex';
import { loadUuid, loadList } from 'src/common/api/log';
import { normalizeParams } from 'src/utils/api_help.js';
import rules from './operate_rules.js';
import query from 'src/common/mixins/query';
import uuidSelectItem from 'src/common/components/uuid_select_item';

let loadAcUuid = normalizeParams(loadUuid, 'ac');

export default {
    components: {uuidSelectItem},
    mixins: [query],
    
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
                admin: '',
                depict: ''
            },
            loadingStatus: {
                uuid: false,
                admin: false
            },
            loadedData: {
                uuid: [],
                admin: []
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

        resolveSubmitData () {
            return this.params;
        },

        //  当uuid改变时, 重置src_zone,dst_zone,attack_type
        resetLists (value) {

            //  当从store中加载值时，不重置
            if (value === this.storeParams.uuid) {
                return;
            }

            this.params.admin = '';
            this.loadedData.admin = [];
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

        // 加载uuid
        handleUserNameVisibleChange (visibale) {
            if (!visibale || (Array.isArray(this.loadedData.admin) && this.loadedData.admin.length > 0)) {
                return;
            }
            this.loadUserName();
        },

        loadUserName () {
            if (!this.params.uuid) {
                return;
            }
            this.loadingStatus.admin = true;
            loadList(this.normalizedBoxSearchParams(this.params.uuid, 'ctrluser'))
                .then(({data}) => {
                    this.loadedData.admin = data && data.data || [];
                })
                .catch(() => {})
                .finally(() => {
                    this.loadingStatus.admin = false;
                });
        },

        submit () {
            this.cacheParams(this.params);
            this.cacheLoadedData(this.loadedData);

            this.$emit('submit');
        }
    }
};
</script>

<style lang="postcss">
.operate-query-wrapper {
    padding: 20px 16px;
    box-sizing: border-box;
    background-color: #fff;

}
</style>
