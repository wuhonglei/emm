
/**
 * vue cli 配置文件
 */

let path = require('path');
function resolve (dir) {
    return path.join(__dirname, '.', dir);
}
module.exports = {
    productionSourceMap: false,
    publicPath: process.env.NODE_ENV === 'production' ? './' : '',
    pages: {
        index: {
            entry: 'src/page_index/index.js',
            template: 'public/index.html'
        },
        login: {
            entry: 'src/page_login/index.js',
            template: 'public/login.html'
        }
    },
    
    devServer: {
        https: true,
        port: 8080,
        proxy: {
            '/api': {
                target: 'https://localhost:4000',
                secure: false,
                https: true,
                changeOrigin: true
            }
        }
    },

    chainWebpack: config => {
        config.resolve.alias
            .set('src', resolve('src'));

        config.resolve.alias
            .set('vue$', resolve('node_modules/vue/dist/vue.esm.js'));
        
        config.module
            .rule('svg')
            .exclude.add(resolve('src/assets/svg'))
            .end();

        config.module
            .rule('images')
            .use('url-loader')
            .loader('url-loader')
            .tap(options => {
                options.limit = 1024;
                return options;
            });

        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/assets/svg'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            });
    },
    transpileDependencies: ['vuex-persist']
};