<template>
    <header class="header-wrapper">
        <div class="header__logo">
            <img src="../../assets/logo.png">
        </div>
        <div class="header__nav">
            <router-link
                v-for="item in navItems"
                :key="item.id"
                class="nav__item"
                :to="{name: item.id}">
                {{ item.title }}
            </router-link>
        </div>
        <div class="admin-info">
            <span class="inline-block admin-info__user-icon-box">
                <i class="iconfont inline-block admin-info__user-icon">&#xe7c8;</i>
            </span>
            <span class="inline-block ellipsis admin-info__username">{{ userName }}</span>
            <i class="inline-block iconfont admin-info__arrow">&#xe888;</i>
            <ul class="admin-info-nav">
                <li>
                    <a
                        href="javascript:void(0);"
                        class="admin-info-nav__item"
                        @click="createPassModal()">
                        <i class="iconfont admin-info-nav__item-icon">&#xe71d;</i>
                        修改密码
                    </a>
                </li>
                <li>
                    <a
                        href="javascript:void(0);"
                        class="admin-info-nav__item"
                        @click="userLogout">
                        <i class="iconfont admin-info-nav__item-icon">&#xe838;</i>
                        注销
                    </a>
                </li>
            </ul>
        </div>
    </header>
</template>


<script>

/**
 * @file 公共菜单
 */

import utils from 'src/utils/utils_data';
import { logout, modifyPass, needModifyPass, getCurrentUser } from 'src/api/base';
import NavigationChangePassword from './navigation_change_password';
import lodashGet from 'lodash/get';

export default {
    data () {
        return {
            navItems: [],
            userName: ''
        };
    },
    mounted () {
        this.loadData();
    },
    methods: {
        loadData () {

            // 初始化菜单数据
            if (utils.navData.length) {
                this.navItems = utils.navData;
            }
            this.getCurrentUser();
            this.needModifyPass();
            
        },

        // 获取登录信息
        getCurrentUser () {
            getCurrentUser().then(res => {
                let data = res.data.data;
                this.userName = lodashGet(data, 'username', '');
            });
        },

        // 获取用户名和是否强制修改密码
        needModifyPass () {
            needModifyPass().then(res => {
                let data = res.data.data,
                    isInitPass = lodashGet(data, 'isInitPass', 0);
                
                // 强制修改密码
                if (isInitPass) {

                    let confirm = this.$confirm({
                        msg: _('当前账号为初始账号，账号密码为常见的弱密码，为<br/>保障系统安全，建议您及时修改用户名及密码'),
                        icon: 'warning',
                        closeable: false,
                        buttons: [{text: _('立即修改'), actionName:'change'}],
                        callback: () => {
                            confirm.destroy();
                            confirm = null;
                            this.createPassModal(true, ['submit']);
                        }
                    });
                }
                
            }); 
        },
        
        // 修改密码弹框
        createPassModal (isFirstLogin = false, btns) {
            let that = this;
            let passModal = this.$modal(NavigationChangePassword, {
                title: isFirstLogin ? _('初始账号修改') : _('修改密码'),
                buttons: isFirstLogin ? btns : ['submit', 'cancel'],
                closeable: !isFirstLogin,
                submit: function () {
                    let winThis = this,
                        formRoot = winThis.formRoot,
                        params = formRoot.getJsonValue(),
                        form = formRoot.$refs.form;
                    if (!form.isValid()) {
                        return;
                    }
                    modifyPass({
                        userName: isFirstLogin ? params.userName : that.userName,
                        newPassword: params.newPassword,
                        oldPassword: params.oldPassword
                    }).then(() => {
                        passModal.destroy();
                        passModal = null;

                        // 修改成功后再次调用方法更新用户名
                        if (isFirstLogin) {
                            that.getCurrentUser();
                        }
                        that.$ok(_('操作成功'));
                    });
                },
                cancel: function () {
                    passModal.destroy();
                    passModal = null;
                }
            });
            passModal.setData({
                isFirstLogin,
                notFirstUserName: this.userName
            });
            passModal.open();
        },

        // 注销
        userLogout () {
            logout({
                userName: 'admin'
            }).then(() => {
                location.href = '/login.html';
            }).catch();
        }
    }
};
</script>

<style lang="postcss">
.header-wrapper {
    height: 60px;
    background: url(../../assets/nav-bg.png) right top no-repeat,url(../../assets/nav-bg-color.png) repeat-x;
    display: flex;
    
    & .header__logo {
        height: 40px;
        width: 230px;
        margin-left: 16px;
        margin-top: 10px;
        & img {
            height: 40px;
        }
    }

    & .header__nav {
        margin-left: 35px;
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
    }

    & .nav__item {
        display: inline-block;
        padding: 0 32px;
        line-height: var(--header-height);
        text-decoration: none;
        color:#fff;
        font-size: 14px;

        &:hover {
            background-color: rgba(0, 0, 0, 0.1);
        }

        &.router-link-active {
            color: #51C4FF;
            background: rgba(0,0,0,0.10);
            box-shadow: 1px 0 0 0 rgba(255,255,255,0.10), -1px 0 0 0 rgba(255,255,255,0.10);
        }
    }

    & .admin-info {
        padding: 20px 12px;
        height: 58px;
        box-sizing: border-box;
        width: 120px;
        margin-right: 5px;
        line-height: 18px;
        color: #fff;
        cursor: pointer;
        position: relative;
        z-index: 1;
        & .admin-info__user-icon-box {
                width: 18px;
                height: 18px;
                line-height: 18px;
                background: #fff;
                color: #254579;
                text-align: center;
                border-radius: 50%;
                position: relative;
                top: -3px;
        
            & .admin-info__user-icon {
                position: relative;
                top: -1px;
                font-size: 12px;
            }
        }
        & .admin-info__username {
            margin-left: 5px;
            width: 55px;
            font-size: 14px;
        }
        & .admin-info__arrow {
            position: relative;
            top: -2px;
            font-size: 18px;
        }
        & .admin-info-nav {
            background: #254579;
            position: absolute;
            right: 0px;
            top: 58px;
            min-width: 120px;
            max-width: 160px;
            display: none;
            & li {
                line-height: 40px;
                padding: 0px 16px;
            }
            & li:last-child {
                border-bottom: 0px;
            }
            & li:hover {
                background: #355383;
                border-bottom-color: #254579;
            }
            & li .admin-info-nav__item {
                color: #fff;
                display: block;
                border-bottom: 1px solid rgba(0,0,0,0.1);
            }
            
            & li .admin-info-nav__item:hover {
                text-decoration: none;
            }
            & .admin-info-nav__item-icon {
                margin-right: 6px;
                position: relative;
                top: 1px;
                font-size: 14px;
            }
        }
    }
    & .admin-info:hover {
        background: #254579;
        & .admin-info-nav {
            display: block;
        }
    }
}
</style>
