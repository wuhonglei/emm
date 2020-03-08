/**
 * 登录入口
 */

import 'babel-polyfill';
import UedcLogin from '@uedc/login';
import '@uedc/login/dist/theme/security.css';
import 'normalize.css';
import './login.css';
import { login, getToken } from 'src/api/login'; 
import { getCurrentUser } from 'src/api/base';
import utils from 'src/utils/utils_data';
import { initInterface } from 'src/utils/module_init';
import lodashGet from 'lodash/get';

function _ (str) {
    return str;
}

const TOKEN_VALID_TIME = 600000; // token过期时间
function getTokenInfo () {
    getToken().then((res) => { // 获取toKen
        let data = res.data.data,
            csrfToken = lodashGet(data, 'csrfToken', '');
        localStorage.setItem('token', csrfToken);
    }).catch(); 

    // 10分钟重新获取一次token
    setTimeout(() => {
        getTokenInfo();
    }, TOKEN_VALID_TIME);
}

function getUserInfo () {
    getCurrentUser().then(res => { // 获取用户信息接口，此处验证是否登录
        if (res.data.code === 0) {
            location.href = '/';
        }
    });
}

utils.setSchema(initInterface()); // 预先加载一次，保障接口运行

getTokenInfo();
getUserInfo();


UedcLogin.init(document.body, {
    type: 'signin',
    gcs: [{
        name: _('SSL VPN数据中心'),
        content: _(`SSL VPN 数据中心是提供海量日志统一采集、存储、审计服务的平台。依托大数据技术满足安全合规需求，洞察日志数据价值，具备安全可靠，智能高效，稳定易用的特性，为用户提供一站式海量日志数据存储服务。`),
        animation: true
    }],
    product: {
        name: _('SSL VPN数据中心'),
        logoCls: 'sdp-login-logo',
        version: _('1.0.0'),
        help: {
            'i18n': {
                enable: false   // 关闭中英文切换
            },
            online: {
                enable: false
            },
            support: {
                enable: false
            },
            '400': {
                enable: false
            }
        }

    },
    copyright: {
        year: '2020'
    },
    signup: {
        enable: false
    },
    policy: {
        enable: false
    },
    accountLogin: {
        enable: true,
        text: _('账号登录'), 
        items: [
            {
                name: 'username',
                type: 'text',
                label: _('用户名'),
                placeHolder: _('请输入用户名')
            }, {
                name: 'password',
                type: 'password',
                label: _('密码'),
                placeHolder: _('请输入密码')
            }, {
                name: 'captcha',
                type: 'captcha',
                label: _('验证码'),
                placeHolder: _('请按右图输入验证码'),
                url: '/captcha'
            } // UedcLogin.showCaptcha();
        ]
    },

    async onSubmit (formValue) { // 登录
        try {
            await login(formValue);
            location.href = '/';
        } catch (error) {
            throw error.data.msg;
        }
        
    }
});
