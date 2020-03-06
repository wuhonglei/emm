
let path = require('path');
let config = require('./config');
function resolve(dir) {
    return path.join(__dirname, '.', dir);
}
module.exports = {
    productionSourceMap: false,
    baseUrl: process.env.NODE_ENV === 'production' ? 'static/' : '',
    pages: {
        index: {
            entry: 'src/pages/page_index/index.js',
            template: 'public/index.html'
        },
        login: {
            entry: 'src/pages/page_login/index.js',
            template: 'public/login.html'
        }
    },

    devServer: {
        https: true,
        port: 8080,
        proxy: {
            '/api': {
                target: 'https://' + config.host,
                secure: false,
                https: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },

    chainWebpack: config => {
        config.resolve.alias
            .set('src', resolve('src'));
        config.module
            .rule('svg')
            .exclude.add(resolve('src/common/assets/svg'))
            .end();

        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/common/assets/svg'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            });
    },
    transpileDependencies: ['vuex-persist']
};