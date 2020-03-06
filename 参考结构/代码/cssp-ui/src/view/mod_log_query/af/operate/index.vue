<template>
    <div
        v-loading.body="dataLoading"
        class="af-operate-wrapper log-detail-page">
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
                    @click.native="reQuery" />
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
            <query-info :formatter="queryFormatter" />
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
 * 操作日志-网站访问
 */

import toolbar from 'src/common/components/toolbar/toolbar';
import toolbarButton from 'src/common/components/toolbar/toolbar_button';
import queryInfo from 'src/common/components/query_info';
import logTable from './table';
import query from './query';
import { mapMutations, mapGetters } from 'vuex';

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
            exportLoading: false,
            dataLoading: false,
            queryFormatter: {
                uuid (value, loadedData) {
                    let list = loadedData.uuid; 
                    let [data] = list.filter((item) => item.uuid === value);
                    return (data && data.uuid) ? `${data.name}(${data.ip})` : '所有';
                },
                depict (value) {
                    return value;
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
        },

        filterQueryInfo (val, key) {
            return key !== 'depict' && !val ? '所有' : val;
        }
    }
};
</script>

<style lang="postcss">
@import "src/common/assets/css/var.css";
.af-operate-wrapper {
    background-color: var(--panel-bg-color);
}
</style>
