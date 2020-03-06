<template>
    <a href="javascript:void(0)"
       :title="text"
       class="text-btn-wrapper ellipsis">
        {{ text }}
    </a>
</template>

<script>

/**
 * 表格文字按钮组件 
 */

export default {
    props: {
        text: {
            type: String,
            required: true
        }
    }  
};
</script>

<style lang="postcss">
@import 'src/common/assets/css/var.css';
.text-btn-wrapper {
    display: inline-block;
    max-width: 100%;
    color: var(--primary-color);
    line-height: 16px;
    vertical-align: bottom;
    &:hover {
        text-decoration: underline;
    }
    &:disabled {
        
    }
}
</style>
