<template>
    <div
        v-if="tagData.length"
        class="tag-wrapper inline-block">
        <div
            v-for="tag in tagData"
            :key="tag.value"
            class="sf-tag inline-block ellipsis"
            :class="{'sf-tag-disabled': tag.disabled, 'sf-tag-no-remove': !tag.closeable}"
            :style="{ width: defaultWidth + 'px' , maxWidth: maxWidth + 'px'}">
            {{ tag.label }}
            <i
                v-if="tag.closeable"
                class="iconfont sf-tag-remove"
                title="点击删除"
                @click="removeTag(tag)">&#xe605;</i>
        </div>
    </div>
</template>

<script>

/**
 * Tag组件
 */

export default {
    props: {
        defaultWidth: { // 默认宽度（传入请使用数字）
            type: [Number, String],
            default () {
                return '';
            }
        },
        maxWidth: { // 默认宽度（传入请使用数字）
            type: [Number, String],
            default () {
                return '';
            }
        },
        defaultDisabled: { // 是否禁用（暂不支持，只支持list内的disabled属性）
            type: Boolean,
            default () {
                return false;
            }
        },
        list: { // 传入数据可以是列表或单个数据
            type: [Array, Object],
            default () {
                return {};
            }
        },
        closeable: { // 显示移除按钮
            type: Boolean,
            default () {
                return false;
            }
        }
    },
    data () {
        return {
            tagData: []
        };
    },
    mounted () {
        this.tagData = Array.isArray(this.list) ? this.list : [this.list];
    },
    methods: {
        removeTag (item) { // 移除Tag
            if (item.disabled) { // 禁用场景不调用移除，也不触发事件
                return;
            }
            for (let i = 0; i < this.tagData.length; i++) {
                if (this.tagData[i].value === item.value) {
                    this.tagData.splice(i, 1);
                    break;
                }
            };
            this.$emit('tag-change', this.tagData, item);
        }
    }
};
</script>

<style lang="postcss">
.tag-wrapper {
    & .sf-tag {
        background: #fff;
        border: 1px solid var(--border-color);
        border-radius: 18px;
        line-height: 22px;
        min-height: 22px;
        padding-left: 12px;
        padding-right: 30px;
        margin-left: 5px;
        margin-right: 5px;
        color: var(--title-text-color);
        top: 7px;
        position: relative;

        & .sf-tag-remove {
            position: absolute;
            font-size: 12px;
            right: 10px;
            top: 5px;
            line-height: normal;
            cursor: pointer;
        }
        & .sf-tag-remove:hover {
            color:var(--tag-hover-color);
        }
    }
    & .sf-tag-no-remove {
        padding-right: 12px;
    }
    & .sf-tag-disabled {
        background: #EEE;
        border-color: #DDD;
        color: #ccc;
        & .sf-tag-remove:hover {
            color: #ccc;
            cursor: default;
        }
    }
}
</style>