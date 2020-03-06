let mockjs = require('mockjs');

module.exports = function () {
    return mockjs.mock({
        code: 0,
        data: {
            action: {
                values: [{
                    label: 'IP',
                    value: 'all'
                }]
            },
            actionResult: {
                values: [{
                    label: 'IP',
                    value: 'all'
                }]
            },
            searchType: {
                values: [{
                    label: 'IP',
                    value: 'all'
                }]
            },
            osType: {
                values: [{
                    label: 'IP',
                    value: 'all'
                }]
            },
            logSubType: {
                values: [{
                    label: 'IP',
                    value: 'all'
                }]
            }
        }
    });
}