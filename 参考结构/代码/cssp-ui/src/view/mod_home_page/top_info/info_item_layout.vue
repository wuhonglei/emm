<template>
    <div class="info-item__layout">
        <div class="info-item__layout__left">
            <slot></slot>
        </div>
        <div class="info-item__layout__right">
            <span class="info-title">
                <slot name="title"></slot>
            </span>
            <span class="info-value">
                <slot name="value"></slot>
            </span>
        </div>
    </div>
</template>
<script>

/**
 * @file 首页上端展示项布局组件
 */

export default {
    
};
</script>
<style lang="postcss">
.info-item__layout {
    height: 60px;
    display: inline-flex;
    & .info-item__layout__left {
        width: 60px;
        height: 60px;
        flex-shrink: 0;
    }
    & .info-item__layout__right {
        height: 100%;
        padding-left: 20px;
        display: inline-flex;
        flex-direction: column;
        justify-content: space-around;

        & .info-title {
            font-size: 12px;
            color: rgba(255,255,255,0.70);
        }
        & .info-value {
            font-size: 24px;
            color: #fff;
        }
    }
}
</style>
