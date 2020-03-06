let mockjs = require('mockjs');

module.exports = function () {
    return mockjs.mock({
        code: 0,
        data: {
            spaceTotal: 47.8,
            spaceUsed: 22,
            maxSpacePer: 85,
            logKeepDays: 180,
            exportLimit: 10000000
        }
    });
}