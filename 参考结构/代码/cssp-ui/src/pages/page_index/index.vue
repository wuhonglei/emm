<template>
    <div id="app"
         class="app">
        <navigation />
        <main class="app-content__wrapper mod-page">
            <tree nav-name="root" 
                  :title="treeTitle" />
            <div class="app-content__main">
                <div class="fix">
                    <breadcrumb v-if="!isHomePage" />
                    <router-view :class="{'is-content': !isHomePage}" />
                </div>
            </div>
        </main>
        <settings-hint-dialog 
            ref="settingsHintDialog"
            @confirm="handleSettingsHintConfirm"
            @cancel="handleSettingsHintCancel" />
    </div>
</template>

<script>

/**
 * 主页面根组件
 */

import navigation from 'src/common/components/layout/navigation';
import tree from 'src/common/components/layout/tree/index';
import breadcrumb from 'src/common/components/breadcrumb';
import { enableFastLog } from 'src/common/api/log';
import { bindPopoverWheel, offPopoverWheel } from 'src/utils/hide_popover_onscroll';
import { mapActions } from 'vuex';
import checker from 'src/common/lib/permission/checkers';
import settingsHintDialog from 'src/common/components/settings_hint_dialog';
import { getSettingsHintReadStatus, setSettingsHintReadStatus } from 'src/common/api/manage';
import { APP_MOUNTED_WAITTING_ID } from 'src/utils/consts';
import { stopWaitting } from 'src/utils/wait_until';

import IntervalTask from 'src/utils/interval_task';

const POLLING_INTERVAL = 5000;

export default {
    components: {
        navigation,
        tree,
        breadcrumb,
        settingsHintDialog
    },
    computed: {
        treeTitle () {
            let root = this.$navStorage.getNavByNavName('root');
            return root && root.text;
        },
        isHomePage () {
            return this.$route.name === 'homePage';
        }
    },
    mounted () {
        stopWaitting(APP_MOUNTED_WAITTING_ID);
        enableFastLog().catch(() => {});
        bindPopoverWheel();
        this.startPolling();
        this.checkSettingsHint();
    },

    beforeDestroy () {
        offPopoverWheel();
        this.stopPolling();
    },

    methods: {
        async poll () {
            await this.updateNFSStatus();
            await this._handleNFSRedirect();
        },
        async _handleNFSRedirect () {
            if (
                (await checker.check('nfs-error')).success && 
                this.$route.name !== 'sysCenterExternStorage'
            ) {
                this.$router.push({
                    name: 'sysCenterExternStorage'
                });
            }
        },

        async checkSettingsHint () {
            if (!(await this.getHintReadStatus())) {
                this.showHint();
            }
        },

        async getHintReadStatus () {
            try {
                let res = await getSettingsHintReadStatus();
                return res.data && res.data.data;
            } catch (err) {
                return true;
            }
        },

        async setHintReadStatus () {
            try {
                await setSettingsHintReadStatus();
            } catch (err) {
                void(0);
            }
        },

        showHint () {
            this.$refs.settingsHintDialog && this.$refs.settingsHintDialog.$emit('open');
        },

        handleSettingsHintConfirm () {
            this.setHintReadStatus();
            this.$router.push({
                name: 'sysCenterLogSettings'
            });
        },

        handleSettingsHintCancel () {
            this.setHintReadStatus();
        },
        
        startPolling () {
            this.intervalTask = new IntervalTask({
                fn: this.poll,
                autoStart: true,
                skipFirst: false,
                interval: POLLING_INTERVAL
            });
        },
        stopPolling () {
            this.intervalTask && this.intervalTask.stop();
        },
        ...mapActions(['updateNFSStatus'])
    }
};
</script>
<style lang="postcss">
.app-content__wrapper {
    display: flex;
    align-items: stretch;
    flex-direction: row;
}
.app-content__wrapper > .app-content__main {
    position: relative;
    width: 100%;
    flex: 1;
    & .fix {
        position: absolute;
        width: 100%;
        box-sizing: border-box;
        height: 100%;
        padding-left: 16px;
        display: flex;
        flex-direction: column;
    }
    & .is-content {
        flex: 1;
        height: 100%;
        margin: 0 16px 16px 0;
        box-sizing: border-box;
        overflow: auto;
        box-shadow: 0 0 4px 0 rgba(0,0,0,0.10);
        background-color: #fff;
    }
}
</style>
