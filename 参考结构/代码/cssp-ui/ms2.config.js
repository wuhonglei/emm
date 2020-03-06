/**
 * mock 配置文件
 */

let config = require('./config');

module.exports = {
    model: 'proxy', // 模式 proxy or mock
    target: config.host, // 目标服务器地址
    port: 3000, // 启动服务的端口，如果遇到端口占用。会按照规则分配另外的端口，请查看输出日志
    https: true, // 同http-proxy-middleware
    changeOrigin: true, // 同http-proxy-middleware
    secure: false, // 同http-proxy-middleware
    cacheMock: false, // 抓取服务器数据，只在proxy时生效
    mockDataPath: './__mock__', // mock 文件目录
    mockExtensions: ['json', 'html', 'xml'], // 自动抓取的文件类型
    staticPath: null, // feature request

    // url 到实际请求的映射
    handleMapPath (req) {

        // 剔除query
        let urls = req.url.split('?');
        let url = urls[0];
        let fileName = getQueryString(urls[1], 'action') || 'noaction';

        // 整理出相对路径以及文件名
        let paths = url.split('/').filter(item => item);

        return {
            relativePath: `./${paths.join('/')}`,
            fileName: `${fileName}.${req.method}`
        };
    }
};

function getQueryString (url, name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    let r = url.match(reg);
    if (r !== null) {
        return unescape(r[2]);
    }
    return null;
}