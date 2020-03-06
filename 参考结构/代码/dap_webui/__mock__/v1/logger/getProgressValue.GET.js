let mockjs = require('mockjs');

module.exports = function () {
    return mockjs.mock({
        code: 0,
        data: {
            progressValue: 50
        },
        msg: '参数校验失败'
    });
}