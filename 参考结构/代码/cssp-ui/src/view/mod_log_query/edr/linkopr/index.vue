<template>
    <div
        v-loading.body="dataLoading"
        class="edr-linkopr-wrapper log-detail-page">
        <div
            v-if="status === 'init'"
            class="init-query">
            <query @submit="handleQuerySubmit" />
        </div>
        <template v-if="status === 'result' || status === 'coexistence'">
            <toolbar class="toolbar">
                <toolbar-button
                    text="查询条件"
                    icon="search"
                    @click.native="showQeury" />
                <toolbar-button
                    text="导出日志"
                    :icon="exportLoading ? 'loading' : 'export'"
                    :spin="exportLoading"
                    :disabled="exportLoading"
                    @click.native="handleExport" />
                <query
                    v-if="status === 'coexistence'"
                    slot="query"
                    @submit="handleQuerySubmit"
                    @hide="queryed" />
            </toolbar>
            <query-info
                :names="QUERY_NAME"
                :formatter="queryFormatter" />
            <log-table
                ref="logTable"
                @loaded="handleLoaded"
                @load-data="dataLoading=true"
                @exported="handleExported"
                @click.native="queryed" />
        </template>
    </div>
</template>
<script>

/**
 * edr联动日志
 */

import toolbar from 'src/common/components/toolbar/toolbar';
import toolbarButton from 'src/common/components/toolbar/toolbar_button';
import queryInfo from 'src/common/components/query_info';
import logTable from './table';
import query from './query';
import { mapMutations, mapGetters } from 'vuex';
import { QUERY_NAME } from './consts';

export default {
    components: {
        toolbar,
        queryInfo,
        logTable,
        query,
        toolbarButton
    },

    data () {
        return {
            query: {},
            tableData: [],
            exportLoading: false,
            dataLoading: false,
            QUERY_NAME,
            queryFormatter: {
                uuid (value, loadedData) {
                    if (loadedData.uuid.length) {
                        let list = loadedData.uuid; 
                        let [data] = list.filter((item) => item.uuid === value);
                        return (data && data.uuid) ? `${data.name}(${data.ip})` : '所有';
                    }
                    return '无';
                },
                hostName (_, __, params) {
                    return params.hostNameString ? params.hostNameString : '所有';
                },
                opSrc (v) {
                    return v || '全部平台';
                },
                module (v) {
                    return v || '全部类型';
                }
            }
        };
    },

    computed: {
        ...mapGetters('splitPanel', ['status'])
    },

    methods: {
        ...mapMutations('splitPanel', [
            'init',
            'queryed',
            'reQuery'
        ]),

        showQeury () {
            this.reQuery();
        },

        handleExport () {
            if (this.exportLoading) {
                return;
            }
            this.exportLoading = true;
            this.$refs.logTable.$emit('export');
        },

        handleExported () {
            this.exportLoading = false;
        },

        loadData () {
            if (this.$refs.logTable) {

                //  querySearch == true;用log_search查询
                this.$refs.logTable.$emit('load-data', /* querySearch */true);
            }
        },

        handleLayout () {
            if (this.$refs.logTable) {
                this.$refs.logTable.$emit('layout');
            }
        },

        handleQuerySubmit () {
            this.queryed();
            this.loadData();
        },

        handleLoaded () {
            this.dataLoading = false;
        }
    }
};
</script>

<style lang="postcss">
@import "src/common/assets/css/var.css";
.edr-linkopr-wrapper {
    background-color: var(--panel-bg-color);
}
</style>
