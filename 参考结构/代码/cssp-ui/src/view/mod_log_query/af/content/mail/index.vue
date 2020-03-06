<template>
    <div
        v-loading.body="dataLoading"
        class="af-mail-wrapper log-detail-page">
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
            <query-info
                :formatter="queryFormatter"
                :names="names" />
            <log-table
                ref="logTable"
                @loaded="handleLoaded"
                @load-data="dataLoading=true"
                @click.native="queryed"
                @exported="handleExported" />
        </template>
    </div>
</template>
<script>

/**
 * 内容安全-邮件日志
 */

import toolbar from 'src/common/components/toolbar/toolbar';
import toolbarButton from 'src/common/components/toolbar/toolbar_button';
import queryInfo from 'src/common/components/query_info';
import logTable from './table';
import query from './query';
import { mapMutations, mapGetters } from 'vuex';
import { grpName } from 'src/view/mod_log_query/af/af.query_formatter';

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
            names: {
                srcIp: '源IP/用户',
                userName: '源IP/用户',
                grpName: '源IP/用户'
            },
            queryFormatter: {
                uuid (value, loadedData) {
                    let list = loadedData.uuid; 
                    let [data] = list.filter((item) => item.uuid === value);
                    return (data && data.uuid) ? `${data.name}(${data.ip})` : '所有';
                },
                srcIp () {
                    return '';
                },
                userName () {
                    return '';
                },
                grpName
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
.af-mail-wrapper {
    background-color: var(--panel-bg-color);
}
</style>
