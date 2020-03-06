/**
 * 项目配置文件
 */

module.exports = {
    host: '10.246.88.70',
    port: '443', // 业务端口
    ssh: {
        user: 'admin', //SSH 用户名
        password: 'adminsangfornetwork', //SSH 密码
        port: '22345', // SSH 端口
        staticPath: '/sf/apps/cssp_dc/cssp_dc/static',
        templatePath: '/sf/lib/python2.7/site-packages/django/contrib/auth/templates/'
    },
    gaId: 'GTM-PKVB73V'
};