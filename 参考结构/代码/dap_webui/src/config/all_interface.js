/**
 * 所有接口定义
 * url：接口地址
 * name: 获取的名字
 * whitelist：不检测是否存在
 */

export let allInterface = [
    ...[ //日志管理
        {
            url: '/api/v1/logger/queryLog', //查询日志
            name: 'queryLog'
        },
        {
            url: '/api/v1/logger/getLogSearchKeys', //获取日志条件
            name: 'getLogSearchKeys'
        },
        {
            url: '/api/v1/logger/exportLog', //导出日志
            name: 'exportLog'
        },
        {
            url: '/api/v1/logger/getLogCount', //获取日志总数
            name: 'getLogCount'
        },
        {
            url: '/api/v1/logger/getProgressValue', //获取导出进度条
            name: 'getProgressValue'
        },
        {
            url: '/api/v1/logger/cancelExport', // 取消导出功能
            name: 'cancelExport'
        }
    ],
    ...[ //系统管理
        {
            url: '/api/v1/logger/getLogConfig', //获取日志配置
            name: 'getLogConfig'
        },
        {
            url: '/api/v1/logger/setLogConfig', //保存日志配置
            name: 'setLogConfig'
        },
        {
            url: '/api/v1/system/getLogWhiteList', //获取系统设置数据
            name: 'getLogWhiteList'
        }, 
        {
            url: '/api/v1/system/setLogWhiteList', //保存系统设置
            name: 'setLogWhiteList'
        }
    ],
    ...[ // base，通用模块
        {
            url: '/api/v1/menu/queryAll',
            name: 'getAllMenu' // 获取所有菜单
        },
        {
            url: '/api/v1/admin/getCurrentUser',
            name: 'getCurrAdminInfo' // 获取管理员信息
        },
        {
            url: '/api/v1/admin/modifyPass', 
            name: 'modifyPass' //修改密码
        }, {
            url: '/api/v1/admin/logout', //注销
            name: 'logout'
        }, {
            url: '/api/v1/admin/needModifyPass', //是否强制修改密码
            name: 'needModifyPass'
        }
    ],
    ...[ // 登陆
        {
            url: '/api/v1/admin/login', // 登录
            name: 'login'
        },
        {
            url: '/api/v1/admin/getToken', // 获取token
            name: 'getToken'
        }
    ]
];