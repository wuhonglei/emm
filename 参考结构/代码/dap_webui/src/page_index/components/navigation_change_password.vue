<template>
    <div class="navigation-change-password-wrapper">
        <sf-form
            ref="form"
            :label-width="90"
            label-align="left">
            <sf-form-item v-if="isFirstLogin">
                <sf-fieldlabel :show-required="true">
                    用户名
                </sf-fieldlabel>
                <sf-textfield
                    ref="userName"
                    v-model="params.userName"
                    :default-width="300"
                    :allow-blank="false"
                    :min-length="1"
                    :max-length="64"
                    placeholder="请输入用户名"
                    :validator="checkUserName" />
            </sf-form-item>
            <sf-form-item v-if="!isFirstLogin">
                <sf-fieldlabel :show-required="true">
                    旧密码
                </sf-fieldlabel>
                <sf-textfield
                    v-model="params.oldPassword"
                    type="password"
                    :default-width="300"
                    :allow-blank="false"
                    placeholder="请输入密码" />
            </sf-form-item>
            <sf-form-item>
                <sf-fieldlabel :show-required="true">
                    新密码
                </sf-fieldlabel>
                <sf-textfield
                    ref="newPassword"
                    v-model="params.newPassword"
                    type="password"
                    :default-width="300"
                    :min-length="8"
                    :max-length="64"
                    :allow-blank="false"
                    placeholder="请输入密码"
                    :validator="checkNewPassword" />
                <sf-fieldtip>
                    <p>
                        1.不能包含用户名
                    </p>
                    <p>
                        2.最小长度为8个字符
                    </p>
                    <p>
                        3.新密码不能与旧密码相同
                    </p>
                    <p>
                        4.同一字符不能连续出现大于3次，必须包含大写字母，小写字母，数字和特殊字符(~!$@#%^&amp;*()_+-={}[];:'|&lt;&gt;`",./?\)
                    </p>
                </sf-fieldtip> 
            </sf-form-item>
            <sf-form-item>
                <sf-fieldlabel :show-required="true">
                    确认新密码
                </sf-fieldlabel>
                <sf-textfield
                    ref="confirmPassword"
                    v-model="params.confirmPassword"
                    type="password"
                    :default-width="300"
                    :min-length="8"
                    :allow-blank="false"
                    placeholder="请输入密码"
                    :validator="checkConfirmPassword" />
            </sf-form-item>
        </sf-form>
    </div>
</template>

<script>

/**
 * 密码修改
 **/

// eslint-disable-next-line
const VALIDPASS = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?[\~\!\@\#\$\%\^\&\*\(\)\{\}\:\"\|\<\>\?\[\]\;\'\,\.\/\-\=\_\+\`\\])[a-zA-Z\d\~\!\@\#\$\%\^\&\*\(\)\{\}\:\"\|\<\>\?\[\]\;\'\,\.\/\-\=\_\+\`\\]*$/;

export default {

    data () {
        return {
            params: {
                newPassword: '',
                confirmPassword: '',
                oldPassword: '',
                userName: ''
            },
            isFirstLogin: false,
            notFirstUserName: ''
        };
    },
    methods: {
        getJsonValue () {
            return this.params;
        },

        // 校验用户名
        checkUserName () {
            let userName = this.params.userName;
            if (this.isFirstLogin && (!/^[^"<>&'\,%*;]+$/.test(userName) || userName.toLowerCase() === 'admin')) {
                return _('用户名不能为任意大小写的admin，最长不能超过64位！不能包含以下非法字符\"<>&\'\,%*;');
            }
            this.$refs.userName.clearInvalid();
            return;
        },

        // 校验新密码
        checkNewPassword () {
            let newPass = this.params.newPassword,
                oldPass = this.params.oldPassword,
                confirmPass = this.params.confirmPassword,
                newPassCheck = (!VALIDPASS.test(newPass) ||
                    /(.)(\1){3,}/.test(newPass)),

                // 强制修改不能包含输入的用户名，普通修改不能包含登陆用户名
                containUserName = this.isFirstLogin ? newPass.indexOf(this.params.userName) : newPass.indexOf(this.notFirstUserName);
            if (!this.isFirstLogin && newPass === oldPass) {
                return _('新密码不能与旧密码相同');
            } else if (containUserName > -1) {
                return _('新密码不能包含用户名');
            } else if (newPassCheck) {
                return _('同一字符不能连续出现大于3次，必须包含大写字母，小写字母，数字和特殊字符(~!$@#%^&amp;*()_+-={}[];:\'|<>`\",./?\\)');
            }

            if (newPass !== confirmPass) {
                this.$refs.confirmPassword.markInvalid(_('两次密码不一致'));
            } else {
                this.$refs.confirmPassword.clearInvalid();
            }

            this.$refs.newPassword.clearInvalid();
            return true;
        },
        
        // 校验确认密码
        checkConfirmPassword () {
            let newPass = this.params.newPassword,
                confirmPass = this.params.confirmPassword;
            if (newPass !== confirmPass) {
                return _('两次密码不一致');
            }
            this.$refs.confirmPassword.clearInvalid();
            return true;
        }
    }
};
</script>
