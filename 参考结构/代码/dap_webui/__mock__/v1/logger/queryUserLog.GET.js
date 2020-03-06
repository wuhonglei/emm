let mockjs = require('mockjs');

module.exports = function () {
    return mockjs.mock({
        code: 0,
        data: {
            count: 10000,
            'data|50': [
                {
                    timeStamp: '2013-7-15 2014-8-16',
                    groupPath: '@word',
                    userName: '@word',
                    deviceId:'@word',
                    'ip|1': ['1.1.1.1', '2.2.2.2', '3.3.3.3'],
                    'vip|1': ['1.1.1.1', '2.2.2.2', '3.3.3.3'],
                    'rcIp|1': ['1.1.1.1', '2.2.2.2', '3.3.3.3'],
                    osType: 'windows',
                    authMethods: '密码认证',
                    macAddr: '3.3.3.3', 
                    logSubType: '@word',
                    actionResult:'@word'
                }
            ]
        }
    
    });
}