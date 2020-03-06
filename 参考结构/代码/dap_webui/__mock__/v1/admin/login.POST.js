let mockjs = require('mockjs');

module.exports = function (query, {username, password}) {
    if (username === 'admin' && password === 'sangfor123') {
        return mockjs.mock({
            code: 0,
            data: {},
            msg: '登录成功'
        });
    }
    return mockjs.mock({
        code: 1,
        data: {},
        msg: '账号密码错误'
    });
 
};