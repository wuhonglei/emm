<template>
    <info-item-layout class="info-item__wrapper">
        <div class="icon__wrapper">
            <slot name="icon"></slot>
        </div>
        <template v-slot:title>
            <slot name="title"></slot>
        </template>
        <template v-slot:value>
            <slot name="value"></slot>
        </template>
    </info-item-layout>
</template>
<script>

/**
 * @file 首页上端展示项
 */

import infoItemLayout from './info_item_layout';

export default {
    components: {
        infoItemLayout
    }
};
</script>
<style lang="postcss">
.info-item__wrapper {
    & .icon__wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        background-color: rgba(9,255,255,0.12);
    }
}
</style>
