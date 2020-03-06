<template>
    <button
        class="toolbar-btn-wrapper"
        :disabled="disabled">
        <svg-icon
            v-if="icon"
            class="icon"
            :icon-class="icon"
            :spin="spin" />
        <span>{{ text }}</span>
    </button>
</template>

<script>

/**
 * 表格操作条按钮
 */

export default {
    props: {
        icon: {
            type: String,
            default () {
                return '';
            }
        },
        text: {
            type: String,
            required: true
        },
        spin: Boolean,
        disabled: {
            type: Boolean,
            default: false
        }
    }
};
</script>

<style lang="postcss">
@import "src/common/assets/css/var.css";
.toolbar-btn-wrapper {
    font-size: 14px;
    display: inline-block;
    border: none;
    background: transparent;
    outline: none;
    color: #333;
    cursor: pointer;

    &[disabled = "disabled"] {
        cursor: not-allowed;
        opacity: var(--disable-opacity);
        &:hover {
            color: var(--disable-color);
        }
    }

    &:hover {
        color: var(--primary-color);
    }
    
    & .icon {
        padding: 0 8px;
    }
}
</style>
