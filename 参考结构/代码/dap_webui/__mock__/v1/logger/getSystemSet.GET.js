let mockjs = require('mockjs');

module.exports = function () {
    return mockjs.mock({
        code: 0,
        data: {
            'data|20': [
                {
                    'startIp|1': ['1.1.1.1', '2.2.2.2', '3.3.3.3','4.4.4.4'],
                    'endIp|1': ['1.1.1.1', '2.2.2.2', '3.3.3.3','4.4.4.4']
                }
            ]
        }
    });
}