<template>
    <main class="page-wrapper">
        <div 
            v-if="$slots.left"
            class="page__left">
            <slot name="left"></slot>
        </div>

        <div class="page__main">
            <div class="page__fix">
                <slot v-if="isRouterAlive"></slot>
            </div>
        </div>
    </main>
</template>

<script>

/**
 * 页面组件
 */

export default {
    provide () {
        return {
            reload: this.reload
        };
    },
    data () {
        return {
            isRouterAlive: true
        };
    },
    methods: {
        reload () {
            this.isRouterAlive = false;
            this.$nextTick(() => {
                this.isRouterAlive = true;
            });
        }
    }
};
</script>

<style lang="postcss">
.page-wrapper {
    width: 100vw;
    min-width: var(--min-width);
    height: calc(100% - var(--header-height));
    display: flex;
    flex: 1;
    overflow: hidden;
    & .page__left {
        height: 100%;
        flex-shrink: 0;
    }
    & .page__main {
        width: 100%;
        height: 100%;
        flex-shrink: 1;
        position: relative;
        overflow: hidden;
    }
    & .page__fix {
        position: absolute;
        display: flex;
        left: 0;
        right: 0;
        height: 100%;
        width: 100%;
    }
}
</style>
