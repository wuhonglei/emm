<template>
    <div class="toolbar-wrapper">
        <slot></slot>
        <div
            v-if="$slots.query"
            class="toolbar__query"
            :class="{'is-shadow': $slots.query}">
            <slot name="query"></slot>
        </div>
    </div>
</template>

<script>

/**
 * 表格toolbar组件
 */

export default {
    
};
</script>
<style lang="postcss">
@import "src/common/assets/css/var.css";
.toolbar-wrapper {
    height: 42px;
    line-height: 42px;
    background-color: var(--toolbar-bg-color);
    border: 1px solid var(--toolbar-border-color);
    position: relative;
    & .toolbar__query {
        position: absolute;
        z-index: 2;
        width: 100%;
        height: auto;
        overflow: auto;
        background-color: #fff;
        &.is-shadow {
            box-shadow: 0 0 2px #ccc;
            max-height: calc(100vh-162px);
            overflow: auto;
        }
    }
}
</style>
