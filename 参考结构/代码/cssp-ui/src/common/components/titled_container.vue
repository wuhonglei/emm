<template>
    <div class="titled-container__wrapper">
        <div class="container__title">
            <slot name="title"></slot>
        </div>
        <main class="container__content">
            <slot></slot>
        </main>
    </div>
</template>
<script>

/**
 * @file 带标题的容器组件
 */

export default {
    
};
</script>
<style lang="postcss">
.titled-container__wrapper {
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    width: 100%;
    height: 326px;
    box-sizing: border-box;

    background-color: #fff;
    box-shadow: 0 0 3px 0 rgba(0,0,0,0.10);
    border-radius: 2px;
    & .container__title {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 50px;
        width: 100%;
        padding: 0 16px;
        border-bottom: 1px solid #ddd;
        box-sizing: border-box;

        font-size: 16px;
        color: #495060;
    }
    & .container__content {
        display: flex;
        align-items: stretch;
        flex-grow: 1;
        width: 100%;
        padding: 20px 40px;
        box-sizing: border-box;
    }
}
</style>
