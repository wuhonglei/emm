/**
 * 日志字段回显
 */

const LOGNAME = {
    userlog: {
        authMethods: { //认证方式

        },
        logSubType: { // 操作行为

        },
        actionResult: { //操作结果

        }
    },
    adminlog: {

    },
    syslog: {
        module: { //来源

        },
        logLevel: { //日志等级
            info: _('信息'),
            error: _('错误'),
            debug: _('调试'),
            warn: _('警告')
        }
    }
};

export default LOGNAME;