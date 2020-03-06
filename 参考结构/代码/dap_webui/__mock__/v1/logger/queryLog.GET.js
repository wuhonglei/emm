let mockjs = require('mockjs');

module.exports = function () {
    return mockjs.mock({
        code: 0,
        data: {
            count:100000,
            'data|50': [
                {
                    deviceId: '@word',
                    module: '@word',
                    timestamp: '2013-7-15 2014-8-16',
                    'logLevel|1': ['debug', 'warn', 'error','info'],
                    msg: '@word',
                }
            ],
            searchID: '@word'
        },
        msg: '查询失败'
    
    });
}