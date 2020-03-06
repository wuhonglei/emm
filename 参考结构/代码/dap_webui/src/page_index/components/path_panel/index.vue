<template>
    <div class="path-panel-wrapper">
        <div class="panel__header--show">
            <slot name="show"></slot>
        </div>
        <div v-if="paths.length > 1"
             class="panel__header">
            <span class="header__return"
                  @click="pop">
                <svg-icon icon-class="nav-back" />
                <span class="path-back-border">|</span>
            </span>
            <span>{{ paths[paths.length - 1].name }}</span>
        </div>
        <div
            ref="pathPanelBox" 
            :class="{'path-panel-item-box': paths.length > 1, 'h-100': paths.length <= 1}">
            <slot></slot>
        </div>
    </div>
</template>

<script>

/**
 * 提供带路径功能容器组件
 */

import emitter from 'src/page_index/mixins/emitter';
import Bus, { EVENTS } from 'src/utils/bus';
export default {
    name: 'PathPanel',

    mixins: [ emitter ],

    props: {
        root: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            paths: []
        };
    },

    watch: {

        paths: {
            handler (v) {
                this.$emit('path-changed', v);
                this.broadcast('PathPanelItem', 'path-changed', v);
                Bus.$emit(EVENTS.TOOGLE_SUB_HEADER, this.paths.length <= 1);
            },
            immediate: true
        }
    },

    // 初始化根
    mounted () {
        this.paths.push(this.root);
    },

    methods: {
        push (payload) {
            this.paths.forEach((item, index) => {
                if (item.value === payload.value) { // 让位置跳转回之前的地址，避免相互跳转值混乱问题
                    this.paths.splice(index, 1);
                }
            });
            this.paths.push(payload);
        },

        pop () {
            this.$refs.pathPanelBox.scrollTop = 0;
            if (!this.paths.length) {
                return false;
            }
            return this.paths.pop();
        },

        clear (force = false) {
            this.$refs.pathPanelBox.scrollTop = 0;
            if (force) {
                this.paths = [];
                return;
            }
            this.paths = [this.root];
        }
    }
};
</script>

<style lang="postcss">
.path-panel-wrapper {

    height: 100%;

    & .panel__header {
        height: 50px;
        box-sizing: border-box;
        font-size: 14px;
        padding: 16px;
        padding-left: 14px;
        border-bottom: 1px solid var(--border-color);
    }
    & .header__return {
        cursor: pointer;
        color: var(--title-text-color);
        
    }
    & .header__return:hover {
        color: var(--link-color-hover);
    }
    & .path-panel-item-box {
        height: calc(100% - 50px);
        overflow: auto;
    }
    & .path-back-border {
        color: #D8D8D8;
        padding-left: 9px;
        padding-right: 8px;
    }
    & .panel__header--show {
        position: absolute;
        top: 34px;
        right: 34px;
        font-size: 14px;
        color: #666;
    }
}
</style>
