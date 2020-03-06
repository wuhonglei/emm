let mockjs = require('mockjs');

module.exports = function () {
    return mockjs.mock({
        code: 0,
        data: {
            role: [],
            data: [
                {
                    name: "创建用户",
                    type: "function",
                    id: "editUser",
                    permission: "edit",
                    allow: true,
                },
                {
                    name: "资源管理",
                    type: "function",
                    id: "readResource",
                    permission: "read",
                    allow:true
                }
            ]
        }
    });
}