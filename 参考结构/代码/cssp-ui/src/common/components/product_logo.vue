<template>
    <div class="product-logo-wrapper">
        <img src="../assets/img/xsec_logo.svg"
             alt=""
             class="logo-icon">
        <div class="logo-title">
            <div class="main-title">
                <span>XSec集成安全平台 | 日志审计</span>
                <span class="prod-version">2.0.3</span>
            </div>
            <div class="sub-title">
                Sangfor XSec-Security-Integrated Platform
            </div>
        </div>
    </div>
</template>

<script>

/** 
* @file logo组件
*/

export default {
    name: 'ProductLogo',
    data () {
        return {

        };
    }
};
</script>

<style lang="postcss">
.product-logo-wrapper {
    display: flex;
    align-items: center;
    & .logo-icon {
        width: 34px;
        height: 40px;
        margin-right: 10px;
    }
    & .logo-title {
        & .main-title {
            font-size: 18px;
            line-height: 25px;
            color: #1abfbf;
        }
        & .prod-version {
            padding: 0 10px;
            margin-left: 6px;
            font-size: 20px;
            color: #3d3d3d;
            background: #1abfbf;
            border-radius: 12px;
            display: inline-block;
            transform: scale(0.5);
            transform-origin: left;
        }
        & .sub-title {
            font-size: 12px;
            line-height: 16px;
            color: #999;
        }
    }
}
</style>
