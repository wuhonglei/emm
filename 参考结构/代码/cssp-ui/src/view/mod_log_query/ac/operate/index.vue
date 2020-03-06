<template lang="pug">
.ac-operate-wrapper.log-detail-page(v-loading.body="dataLoading")
    .init-query(v-if="status === 'init'")
        query(@submit="handleQuerySubmit")
    template(v-if="status === 'result' || status === 'coexistence'")
        toolbar.toolbar
            toolbar-button(text="查询条件" icon="search" @click.native="reQuery")
            toolbar-button(text="导出日志" 
                :icon="exportLoading ? 'loading' : 'export'" 
                :spin="exportLoading"
                @click.native="handleExport" 
                :disabled="exportLoading")
            query(v-if="status === 'coexistence'"
                @submit="handleQuerySubmit"
                @hide="queryed"
                slot="query")
        query-info(:formatter="queryFormatter")
        log-table(@loaded="handleLoaded" 
            @load-data="dataLoading=true"
            @exported="handleExported" 
            @click.native="queryed"
            ref="logTable")
</template>

<script>

/**
 * 操作日志-网站访问
 */

import splitPanel from 'src/common/components/layout/split_panel';
import toolbar from 'src/common/components/toolbar/toolbar';
import toolbarButton from 'src/common/components/toolbar/toolbar_button';
import queryInfo from 'src/common/components/query_info';
import logTable from './table';
import query from './query';
import { mapMutations, mapGetters } from 'vuex';

export default {
    components: {
        splitPanel,
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
        }

    }
};
</script>

<style lang="postcss">
@import "src/common/assets/css/var.css";
.ac-operate-wrapper {
    background-color: var(--panel-bg-color);
}
</style>
