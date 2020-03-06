<template>
    <div class="login__form">
        <div class="login-title">
            <img class="product-logo"
                 :src="defLogoUrl"
                 :title="csspName"
                 :alt="''">
            <span v-text="csspName"></span>
        </div>
        <div class="login-body">
            <ul class="login-input-box">
                <li class="login-input-item">
                    <label class="login-input-label"
                           for="user">用户名</label>
                    <!-- <input name="user" id="user" type="text" maxlength="95"> -->
                    <input v-model="username"
                           type="text"
                           autofocus="autofocus"
                           :disabled="previewMode"
                           placeholder=""
                           @keyup.enter="login()">
                </li>
                <li v-if="!previewMode"
                    class="login-input-item">
                    <label class="login-input-label"
                           for="password">密码</label>

                    <input id="password"
                           v-model="password"
                           type="password"
                           name="password"
                           placeholder=""
                           @keyup.enter="login()">
                    <span class="shiftKey"
                          style="display:none">大写锁定已经打开</span>
                </li>
            </ul>
            <div class="message">
                <label id="err_info"
                       v-text="errMsg"></label>
            </div>
            <div v-if="!previewMode"
                 class="btns">
                <input id="button"
                       type="button"
                       class="btn-login"
                       name="button"
                       :value="btnText"
                       :disabled="isLogin"
                       @click="login()">
            </div>
        </div>
    </div>
</template>

<script>

/**
 * @file cssp登录页面，登录的部分，不包括左侧的图片区域。
 * 这个页面客户看到的登录页面
 * 
 */

import DEF_LOGO_URL from './img/product_logo.svg';
import { preLogin, login } from 'src/common/api/login';
import CryptoJS from 'crypto-js';

export default {
    name: 'LoginForm',
    props: {
        previewMode: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            username: '',
            password: '',
            errMsg: '',
            csspName: '日志审计',
            defLogoUrl: DEF_LOGO_URL, // 默认图标
            logoUrl: '', // 后台传过来的src
            isLogin: false,
            btnText: '登 录'
        };
    },
    mounted () {
        preLogin()
            .then(() => {})
            .catch(() => {});
    },
    methods: {
        login () {
            let key = 'X9WrfXK8cRDduigO';
            let pwd = CryptoJS.AES.encrypt(this.password, CryptoJS.enc.Utf8.parse(key), {
                iv: CryptoJS.enc.Utf8.parse(key),
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.ZeroPadding
            });
            let pwdHexStr = pwd.ciphertext.toString();
            login({
                username: this.username,
                password: pwdHexStr
            })
                .then(() => {
                    window.location.href = '/index';
                })
                .catch((err) => {
                    this.errMsg = err.data.mesg;
                });
        }
    }
};
</script>
<style lang="postcss">
.login__form {
    box-sizing: border-box;
    position: relative;
    width: 392px;
    height: 373px;
    background-color: #f6f9fc;

    & .login-title {
        display: flex;
        align-items: center;
        margin: 38px 0 8px 35px;
        overflow: hidden;
        font-size: 18px;
        color: #333;
        & .product-logo {
            display: inline-block;
            width: 32px;
            height: 32px;
            margin-right: 4px;
            vertical-align: middle;
        }
    }

    & .login-body {
        padding: 15px 0 0 35px;
    }
    & .login-input-box {
        list-style: none;
        margin: 0;
        padding: 0;
        border: 0;
    }
    & .login-input-item {
        list-style: none;
        margin: 0;
        padding: 0;
        border: 0;
    }
    & .login-input-item {
        position: relative;
        margin-bottom: 10px;

        & input {
            width: 305px;
            height: 36px;
            line-height: 36px\9;
            margin: 0px;
            font-size: 14px;
            padding: 0 5px;
            border: 1px solid;
            border-color: #c9c9c9 #dfdfdf #dfdfdf #c9c9c9;
        }
        & .shiftKey {
            width: 100px;
            padding: 0px 3px;
            font-size: 12px;
            position: absolute;
            left: 0px;
            top: 61px;
            _top: 61px;
            background-color: #fff7ad;
            border: 1px solid #dec794;
            color: #000;
            text-align: center;
            cursor: default;
        }
    }
    & .login-input-label {
        height: 18px;
        line-height: 18px;
        color: #333;
        display: block;
        margin-bottom: 5px;
        font-size: 16px;
    }
    & .message {
        color: #f30;
    }
    & .btn-login {
        width: 130px;
        height: 38px;
        margin-top: 11px;
        border: none;
        font-size: 14px;
        color: #fff;
        font-weight: bold;
        cursor: pointer;
        border-radius: 2px;
        background-color: #6bc42b;
        background: -webkit-gradient(
            linear,
            0 0,
            0 100%,
            from(#72ce2d),
            to(#66bc29)
        );
        background: -moz-linear-gradient(top, #72ce2d, #66bc29);
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=#72CE2D, endColorstr=#66BC29, grandientType=1);
    }
}
</style>
