let mockjs = require('mockjs');

module.exports = function () {
    return mockjs.mock({
        code: 0,
        data: {
            'data|50': [
                {
                    deviceId: '@word',
                    userName: '@word',
                    groupRole: '@word',
                    'ip|1': ['1.1.1.1', '2.2.2.2', '3.3.3.3'],
                    timestamp: '2013-7-15 2014-8-16', 
                    logSubType: '@word',
                    actionResult:'@word',
                    entity:'@word'

                }
            ]
        }
    
    });
}