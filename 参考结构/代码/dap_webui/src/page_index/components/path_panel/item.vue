<template>
    <div v-show="display"
         class="path-panel-item-wrapper">
        <template v-if="keepAlive">
            <keep-alive>
                <slot v-if="display"></slot>
            </keep-alive>
        </template>
        <template v-else>
            <slot v-if="display"></slot>
        </template>
    </div>
</template>

<script>

/**
 * 路径容器组件item
 */

export default {

    name: 'PathPanelItem',

    props: {
        name: { // 名称
            type: String,
            required: true
        },

        keepAlive: { // 是否缓存组件，组件切换时触发 activated ，deactivated
            type: Boolean,
            default: false
        }
    },

    data () {
        return {
            display: false
        };
    },

    mounted () {
        this.$on('path-changed', (payload) => {
            this.display = payload[payload.length - 1].value === this.name;
        });
    }
};
</script>

<style lang="postcss">
.path-panel-item-wrapper {
    height: 100%;
}
</style>
