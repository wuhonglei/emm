<template>
    <div class="content-wrapper">
        <div v-if="showHeader && isShowTitle"
             class="content__header">
            {{ $route.meta.name }}
        </div>
        <div 
            class="content__body"
            :class="{'is-full': !showHeader}">
            <slot></slot>
        </div>
    </div>
</template>

<script>

/**
 * 有左树的二级页面
 */

import Bus, { EVENTS } from 'src/utils/bus';
export default {
    props: {
        isShowTitle: { // 是否需要展示标题
            type: Boolean,
            default () {
                return true;
            }
        }
    },
    data () {
        return {
            showHeader: true
        };
    },

    mounted () {
        Bus.$on(EVENTS.TOOGLE_SUB_HEADER, (show) => {
            this.showHeader = show;
        });
    }
};
</script>

<style lang="postcss">
.content-wrapper {
    height: calc(100% - 32px);
    width: 100%;
    background: #fff;
    box-shadow: 0 0 3px 0 rgba(0,0,0,0.10);
    border-radius: 2px;
    margin: 16px;
    overflow-x: hidden;
    overflow-y: auto;
    border-radius: 4px 4px 0 0;
    
    & .content__header {
        height: 50px;
        box-sizing: border-box;
        font-size: 16px;
        padding: 16px;
        border-bottom: 1px solid var(--border-color);
    }
    & .content__body {
        height: calc(100% - 50px);
        overflow-y: auto;
        &.is-full {
            height: 100%;
        }
    }
}
</style>
