<template>
    <div class="settings-hint-dialog__wrapper">
        <el-dialog
            v-if="visible"
            v-model="visible"
            :before-close="handleCancel"
            :title="_('温馨提醒')"
            custom-class="settings-hint-dialog">
            <h5 class="title">
                <lang>尊敬的用户：</lang>
            </h5>
            <lang>您好！</lang>
            <p class="content">
                <lang>
                    根据2017年6月1号开始实施的《中华人民共和国网络安全法》第二十三条规定，为保护日志安全，
                    运营商需留存网络日志不少于6个月。现在您配置的日志期望保留天数，不能满足存储180天，
                    故需手动重新设置。
                </lang>
            </p>
            <p class="content">
                <lang>感谢您一直以来对我们的支持和关注，谢谢！</lang>
            </p>
            <template v-slot:footer>
                <el-button 
                    type="primary"
                    @click="handleConfirm">
                    <lang>前往设置</lang>
                </el-button>
                <el-button @click="handleCancel">
                    <lang>不再提示</lang>
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script>

/**
 * @file 进入日志审计之后提示的窗口
 */

export default {
    data () {
        return {
            visible: false
        };
    },
    mounted () {
        this._initEvts();
    },
    methods: {
        _initEvts () {
            this.$on('open', this._showDialog);
        },
        _showDialog () {
            this.visible = true;
        },
        _hideDialog () {
            this.visible = false;
        },
        handleConfirm () {
            this._hideDialog();
            this.$emit('confirm');
        },
        handleCancel () {
            this._hideDialog();
            this.$emit('cancel');
        }
    }
};
</script>
<style lang="postcss">
.settings-hint-dialog__wrapper {
    & .settings-hint-dialog {
        width: 600px;

        & .title {
            margin: 0 0 24px 0;
        }
        & .content {
            text-indent: 32px;
            line-height: 32px;
            margin: 16px 0 0 0;
        }
    }
}

</style>
