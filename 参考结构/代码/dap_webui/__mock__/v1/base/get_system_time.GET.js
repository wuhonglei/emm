let mockjs = require('mockjs');

module.exports = function () {
    return mockjs.mock({
        code: 0,
        data: {
            data: [
                {
                    systemTime: '2019-10-12'
                }
            ]
        }
    });
};