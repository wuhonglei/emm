<template>
    <div
        v-loading.body="dataLoading"
        class="af-firewall-wrapper log-detail-page">
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
                @exported="handleExported"
                @click.native="queryed" />
        </template>
    </div>
</template>
<script>

/**
 * 应用控制日志
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
                grpName,
                privateType (value, loadedData, data) {
                    const APP = '应用';
                    if (value === APP) {
                        return `${APP}：${data.servName || '所有'}`;
                    }
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
.af-firewall-wrapper {
    background-color: var(--panel-bg-color);
}
</style>
 