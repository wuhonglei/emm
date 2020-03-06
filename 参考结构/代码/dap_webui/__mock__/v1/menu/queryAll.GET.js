let mockjs = require('mockjs');

module.exports = function () {
    return mockjs.mock({
        code: 0,
        data: {
            data: [
                {
                    name: '日志管理',
                    id: 'log',
                    type: 'rootMenu',
                    children: [
                        {
                            name: '用户日志',
                            id: 'userLog',
                            type: 'subMenu',
                        },
                        {
                            name: '管理员日志',
                            id: 'adminLog',
                            type: 'subMenu',
                        },
                        {
                            name: '系统日志',
                            id: 'systemLog',
                            type: 'subMenu',
                        },
                    ],
                },
                {
                    name: '系统管理',
                    id: 'system',
                    type: 'rootMenu',
                    children: [
                        {
                            name: '日志配置',
                            id: 'logConfig',
                            type: 'subMenu',
                        },
                        {
                            name: '系统设置',
                            id: 'systemSet',
                            type: 'subMenu',
                        },
                    ],
                },
            ],
        },
        msg: '请求成功',
    });
};