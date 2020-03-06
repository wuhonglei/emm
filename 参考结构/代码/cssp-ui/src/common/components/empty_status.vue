<template>
    <div class="empty-status__wrapper">
        <slot name="icon">
            <i class="icon iconfont icon-comp-empty-status"></i>
        </slot>
        <lang class="text">
            <slot>暂无数据</slot>
        </lang>
    </div>
</template>
<script>

/**
 * @file 空状态
 */

export default {
    
};
</script>

<style lang="postcss">
.empty-status__wrapper {
    width: 100px;
    height: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    & .icon {
        font-size: 56px;
        opacity: 0.4;
    }
    & .text {
        margin-top: 12px;
        font-size: 12px;
        color: #999;
    }
}
</style>
