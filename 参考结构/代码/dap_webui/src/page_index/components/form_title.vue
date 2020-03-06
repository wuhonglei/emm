<template>
    <div>
        <div
            class="form-title-wrap pointer rel"
            :class="{'mt40': !isFirst}"
            @click="showItem">
            <span class="form-title">{{ title }}</span>
            <slot name="subTitle"></slot>
            <i
                class="iconfont form-title-arrow trans3"
                :class="{'form-title-arrow--active': showContent}">&#xe88e;</i>
        </div>
        <div v-show="showContent">
            <slot></slot>
        </div>
    </div>
</template>

<script>

/**
 * 表单标题组件
 */

export default {
    name: 'FormTitle',
    props: {
        isFirst: { // 是否第一个，不需要设置margin-top
            type: Boolean,
            default () {
                return false;
            }
        },
        title: { // 标题
            type: String,
            required: true
        },
        defaultShow: { // 默认显示
            type: Boolean,
            default () {
                return true;
            }
        }
    },
    data () {
        return {
            showContent: true // 控制内容显示
        };
    },
    watch: {
        defaultShow () { // 用于监听props值，简化控制步骤
            this.showContent = this.defaultShow;    
        }
    },
    mounted () {
        this.showContent = this.defaultShow;
    },
    methods: {
        showItem () {
            this.showContent = !this.showContent;
        }
    }
};
</script>

<style lang="postcss">
.form-title-wrap {
    line-height: 48px;
    border-top: 1px solid #eee;
    border-radius: 2px;
    margin-bottom: 3px;

    & .form-title {
        font-size: 14px;
        border-left: 3px solid var(--tab-border-color);
        padding-left: 8px;
        color: var(--title-text-color);
    }
    & .sub-title {
        font-size: 12px;
        color: #80848F;
    }
    & .form-title-arrow {
        position: absolute;
        right: 16px;
        color: #666;

    }
    & .form-title-arrow--active {
        transform: rotateX(180deg);
    }
}
.form-title-wrap:hover {
    background: #F5F8FD;
}
</style>


