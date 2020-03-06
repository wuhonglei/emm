<template>
    <div class="log-date-wrapper">
        <div v-if="isOpenMask"
             class="log-date__mask"
             :style="{'z-index':maskIndex}"
             @click="hidePanel">
        </div> 
        <div ref="showLogLayer"
             class="log-date__content">
            <input v-model="showDate"
                   class="log-date__input"
                   type="text"
                   placeholder="选择日期"
                   disabled="disabled">
            <i class="iconfont log-date__icon">
                &#xe897;
            </i>
        </div>
        <sf-layer
            ref="logLayer"
            default-target="showLogLayer"
            :default-width="410"
            :auto-hide="false"
            :auto-mask="false">
            <sf-form>
                <sf-form-item>
                    <sf-fieldlabel
                        :show-required="true"
                        :label-width="78">
                        起始时间
                    </sf-fieldlabel>
                    <sf-datefield
                        ref="backBegDate"
                        v-model="backBegDate"
                        :default-width="260"
                        type="dateTime"
                        :show-second="true"
                        placeholder="起始时间"
                        :validator="checkIsGtStart" />
                </sf-form-item>
                <sf-form-item>
                    <sf-fieldlabel
                        :show-required="true"
                        :label-width="78">
                        结束时间
                    </sf-fieldlabel>
                    <sf-datefield
                        ref="backEndDate"
                        v-model="backEndDate"
                        :default-width="260"
                        type="dateTime"
                        :show-second="true"
                        placeholder="结束时间"
                        :validator="checkIsLtEnd" />
                </sf-form-item>
            </sf-form>
            <div class="log-manage__btn">
                <sf-button-primary
                    class="ml8"
                    @click="saveLogDate">
                    保存
                </sf-button-primary>
                <sf-button
                    class="ml8"
                    @click="cancelLogDate">
                    取消
                </sf-button>
            </div>
        </sf-layer>
    </div>
</template>

<script>

/**
 * 日期组件封装
 */


import { decodeDate } from 'src/utils/format';

export default {
    props: {
        begDate: {
            type: String,
            default: ''
        },
        endDate: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            isOpenMask: false,
            maskIndex: 0,
            backBegDate: this.begDate,
            backEndDate: this.endDate,
            showDate: ''
        };
    },

    // 监听父组件的值的变化
    watch: {
        begDate (newValue) {
            this.backBegDate = newValue;
            this.updateDate();
            return;
        },
        endDate (newValue) {
            this.backEndDate = newValue;
            this.updateDate();
            return;
        }
    },
    mounted () {
        this.initEvent();
        this.updateDate();
    },
    methods: {
        
        // 日期更新后显示
        updateDate () {
            this.showDate = this.backBegDate + ' ' + _('至') + ' ' + this.backEndDate;
        },

        // 初始化日期遮罩层
        initEvent () {
            let layer = this.$refs.logLayer;

            //打开日期后触发
            layer.$on('afterShow', () => {
                this.isOpenMask = true;

                //设置遮罩层的z-index
                this.maskIndex =  layer.$el.style.zIndex - 1;
            });

            //关闭日期后触发
            layer.$on('afterHide', () => {
                this.isOpenMask = false;
                this.backBegDate = this.begDate;
                this.backEndDate = this.endDate;
                this.$refs.backEndDate.clearInvalid();
                this.$refs.backBegDate.clearInvalid();
            });
        },
        hidePanel (event) {
            let layer = this.$refs.logLayer;
            
            //判断是否点击日期外的元素
            if (!layer.$el.contains(event.target)) {
                layer.hide();
            }
        },

        // 取消
        cancelLogDate () {
            this.$refs.logLayer.hide();
        },

        // 保存
        saveLogDate () {
            if (!this.timeRangeIsOk()) {
                return;
            }
            this.updateDate();
            this.$emit('on-date-change', this.backBegDate, this.backEndDate);
            this.$refs.logLayer.hide();
        },

        // 比较时间
        timeRangeIsOk () {
            return decodeDate(this.backBegDate).getTime() <= decodeDate(this.backEndDate).getTime();
        },

        // 校验结束日期
        checkIsLtEnd () {
            if (!this.timeRangeIsOk()) {
                return _('结束时间不能小于起始时间！');
            }
            this.$refs.backEndDate.clearInvalid();
            this.$refs.backBegDate.clearInvalid();
            return true;
        },

        // 校验开始日期
        checkIsGtStart () {
            if (!this.timeRangeIsOk()) {
                return _('起始时间不能大于结束时间！');
            }
            this.$refs.backEndDate.clearInvalid();
            this.$refs.backBegDate.clearInvalid();
            return true;
        }
    }
};
</script>

<style lang="postcss">
.log-date-wrapper {
    display: inline-block;
    & .log-date__mask {
        position: fixed;
        left: 0;
        width: 100%;
        height: 100%;
        top: 0;
        opacity: 0;
        background: #fff;
        z-index: 0;
    }
    & .log-date__content {
        display: inline-block;
        vertical-align: middle;
        position: relative;
        height: 32px;
        min-width: 300px;
        & .log-date__input {
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            border: 1px solid #ddd;
            padding: 5px 26px 5px 8px;
            color: #495060;
            background: #fff;
            outline: 0;
            border-radius: 2px;
        }
        & .log-date__icon {
            position: absolute;
            right: 8px;
            top: 50%;
            color: #999;
            transform: translateY(-50%);
        }
    }
}
</style>