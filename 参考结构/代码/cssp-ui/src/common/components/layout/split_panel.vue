<template>
    <div
        class="split-panel-wrapper"
        @mousemove="handleMousemove"
        @mouseup="handleMouseup">
        <div class="split-panel__top">
            <slot></slot>
        </div>
        <div
            v-if="status !== 'init'"
            class="split-panel__bar">
        </div>
        <div
            v-if="status !== 'init'"
            class="split-panel__shadow"
            :style="shadowStyle"
            @mousedown="handleMousedown">
            <div class="shadow__up"></div>
            <div class="shadow__down"></div>
        </div>
        <div
            v-if="status !== 'init'"
            class="split-panel__bottom"
            :style="bottomStyle">
            <slot name="detail"></slot>
        </div>
    </div>
</template>

<script>

/**
 * 可拖动高度组件
 */

import { createNamespacedHelpers } from 'vuex';
import Bus, { BUS_EVENT } from 'src/utils/bus';

const MIN_PART_HEGIHT = 200;
const MAX_PART_HEIGHT = 600;
let { mapGetters } = createNamespacedHelpers('splitPanel');

export default {
    props: {
        disable: Boolean // 禁用拖动功能
    },

    data () {
        return {
            bottomHeight: '',
            resizeStart: {},
            resizing: false,
            positionY: MIN_PART_HEGIHT,
            lastResize: MIN_PART_HEGIHT,    //  上次调整的高度
            diffY: 0
        };
    },

    computed: {
        ...mapGetters(['status']),

        shadowStyle () {
            let moveTo = this.positionY;
            return {
                bottom: `${this.positionY}px`,
                'background-color': this.resizing ? 'rgba(228,236,245,1)' : 'rgba(204,204,204,0)',
                cursor: moveTo >= MIN_PART_HEGIHT && moveTo <= MAX_PART_HEIGHT ? 'row-resize' : 'not-allowed'
            };
        },

        bottomStyle () {
            return {
                height: `${this.positionY}px`
            };
        }
    },

    watch: {
        positionY (v) {
            this.$emit('layout', v);
        }
    },

    mounted () {
        Bus.$on(BUS_EVENT.TOGGLE_PACKAGE_DETAIL, (show) => {
            if (!show) {
                this.lastResize = Math.max(this.positionY, MIN_PART_HEGIHT);
                this.positionY = '32';
            } else {
                this.positionY = this.lastResize;
            }
        });
    },

    beforeDestroy () {
        Bus.$off(BUS_EVENT.TOGGLE_PACKAGE_DETAIL);
    },

    methods: {
        handleMousedown (event) {
            if (this.positionY < MIN_PART_HEGIHT) {
                return;
            }
            this.resizeStart = event;
            this.resizing = true;
        },
        handleMousemove (event) {
            if (!this.resizing) {
                return;
            }
            this.diffY = event.y - this.resizeStart.y;
            this.positionY = Math.min(Math.max(this.lastResize - this.diffY, MIN_PART_HEGIHT), MAX_PART_HEIGHT);

        },
        handleMouseup () {
            if (!this.resizing) {
                return;
            }
            this.diffY = 0;
            this.lastResize = this.positionY;
            this.resizing = false;
        }
    }
};
</script>
<style lang="postcss">
@import "src/common/assets/css/var.css";
.split-panel-wrapper {
    height: 100%;
    display: flex;
    position: relative;
    flex-direction: column;
    & .split-panel__top {
        height: 100%;
        display: flex;
        flex-direction: column;
        flex-shrink: 1;
    }
    & .split-panel__bar {
        height: 10px;
        flex-shrink: 0;
        background-color: var(--content-bg-color);
    }
    & .split-panel__bottom {
        flex-shrink: 0;
    }
    & .split-panel__shadow {
        position: absolute;
        height: 10px;
        width: 100%;
        z-index: 1;
        left: 0;
        bottom: 200px;
        background-color: rgba(204,204,204,1);
        user-select: none;

        & .shadow__up, & .shadow__down {
            position: absolute;
            left: 50%;
            height: 4px;
            width: 72px;
            box-sizing: border-box;
            margin-left: -36px;
            background: #FFFFFE;
            border: 1px solid #C2DBDB;
            
        }

        & .shadow__up {
            top: 0;
            border-radius:0 0 4px 4px;
        }

        & .shadow__up::after {
            content: '';
            display: block;
            position: absolute;
            width: 0;
            height: 0;
            left: 50%;
            bottom: 0;
            margin-left: -3px;
            box-sizing: content-box;
            border-style: solid;
            border-width: 3px;
            border-color: transparent transparent #00AEAE transparent;
        }
        & .shadow__down {
            bottom: 0;
            border-radius:4px 4px 0 0;
        }

        & .shadow__down::after {
            content: '';
            display: block;
            position: absolute;
            width: 0;
            height: 0;
            left: 50%;
            top: 0;
            margin-left: -3px;
            box-sizing: content-box;
            border-style: solid;
            border-width: 3px;
            border-color: #00AEAE transparent transparent transparent;
        }
    }
}
</style>

