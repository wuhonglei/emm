<template>
    <div class="popover">
        <el-popover
            placement="right"
            :width="width"
            trigger="hover">
            <slot></slot>
            <div
                slot="reference"
                class="cssp-help-icon"></div>
        </el-popover>
    </div>
</template>

<script>

/** 
 * @description 正常状态popover
 */

export default {
    props: {
        width: {
            type: Number,
            default: 150
        }
    }
};
</script>

<style lang="postcss">
@import "src/common/assets/css/var.css";

.popover {
    display: inline-block;
    vertical-align: middle;
}
</style>
