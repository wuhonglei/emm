<template>
    <div class="see-details-warp">
        <div 
            v-if="display"
            class="see-details__mask"
            @click="hidePanel">
        </div>
        <div
            v-show="display"
            ref="seeDetailPanel"
            :class="{'see-details__panel': display }">
            <div class="see-details__head">
                <span>{{ title }}</span>
                <span
                    class="see-details__close" 
                    @click="seeDetailsClose">
                    <i class="iconfont icon-bar-compatible">
                        &#xe614;
                    </i>
                </span>
            </div>
            <div class="see-details__list">
                <slot name="seeDetailsList"></slot>
            </div>
            <div class="see-details__btn">
                <sf-button-primary @click="seeDetailsClose">
                    确定
                </sf-button-primary>
            </div>
        </div>
    </div>
</template>

<script>

/**
 * 查看详情
 */

export default {
    name: 'SeeDetails',
    props: {
        display: { // 是否显示
            type: Boolean,
            default: false
        },
        title: { // 标题
            type: String,
            default: _('查看详情')
        }
    },
    methods: {
        seeDetailsClose () {
            this.$emit('update:display', false);
        },
        hidePanel (event) {
            let seeDetailPanel = this.$refs.seeDetailPanel;
            
            //判断是否点击详情外的元素
            if (!seeDetailPanel.contains(event.target)) {
                this.seeDetailsClose();
            }
        }
    }
};
</script>

<style lang="postcss">
.see-details-warp {
    & .see-details__panel {
        position: fixed;
        top: 60px;
        right: 0;
        height: calc(100% - 60px);
        width: 573px;
        box-sizing: border-box;
        background-color: #fff;
        z-index: 200;
        animation: rtl-drawer-in 225ms cubic-bezier(0,0,.2,1) 0ms;
        overflow: hidden;	
        display: flex;
        flex-direction: column;
        border: 1px solid rgba(173, 184, 198, 1);
        & .see-details__head {
            min-height: 40px;
            height: 40px;
            line-height: 40px;
            width: 100%;
            padding: 0 15px;
            display: flex;
            box-sizing: border-box;
            border-bottom: 1px solid #ddd;
            justify-content: space-between;
            & .see-details__close {
                display: inline-block;
                cursor: pointer;
            }
        }
        & .see-details__list {
            flex-grow: 1;
            width: 100%;
            word-wrap: break-word;
            word-break: normal;
            overflow: auto;
            min-height: 100px;
            padding: 20px 30px;
            box-sizing: border-box;
        }
        & .see-details__btn {
            min-height: 48px;
            height: 48px;
            line-height: 48px;
            text-align: right;
            border-top: 1px solid #ccc;
            width: 100%;
            box-sizing: border-box;
            padding-right: 20px;
        }
    }

    & .see-details__mask {
        position: fixed;
        left: 0;
        width: 100%;
        height: 100%;
        top: 0;
        opacity: 0;
        background: #fff;
        z-index: 199;
    }
}
</style>