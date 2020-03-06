<template>
    <sf-tab-panel size="large" 
                  class="report-wrapper"
                  :active-item="activeItem"
                  :keep-alive="false">
        <sf-tab-item title="报表下载" 
                     tab="download">
            <report-download @set-active="setActiveItem" />
        </sf-tab-item>
        <sf-tab-item title="报表设置" 
                     tab="setup">
            <report-setup />
        </sf-tab-item>
    </sf-tab-panel>
</template>
<script>

/**
 * @file 报表列表
 */

import ReportDownload from './report_download/index';
import ReportSetup from './report_setup/index';


export default {
    components: {
        ReportDownload,
        ReportSetup
    },

    data () {
        return {
            activeItem: 0
        };
    },
    watch: {
        $route: {
            handler (val) {
                this.activeItem = val.fullPath.indexOf('setup') > -1 ? 1 : 0;
            },
            deep: true
        }
    },
    methods: {
        setActiveItem (index) {
            this.activeItem = index;
        }
    }

};
</script>
<style lang="postcss">
.report-wrapper {
    & .sfv-tabpanel_wrap {
        height: calc(100% - 48px);
        & .tabpanel-body-item {
            height: 100%;
        }
    }
}
    
</style>
