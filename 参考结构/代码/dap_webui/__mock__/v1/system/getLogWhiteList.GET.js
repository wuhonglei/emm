let mockjs = require('mockjs');

module.exports = function () {
    return mockjs.mock({
        code: 0,
        data: {
            'ipWhiteList|10': [
                {
                    'begIP|1': ['1.1.1.1', '2.2.2.2', '3.3.3.3'],
                    'endIP|1': ['1.1.1.1', '2.2.2.2', '3.3.3.3']
                }
            ]
        }
    
    });
}