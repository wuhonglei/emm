module.exports = {
    root: true,

    parserOptions: {
        sourceType: 'module',
        parser: 'babel-eslint'
    },

    // 请设置项目的根目录，sfchecklist部分规则需要根据根目录进行检查
    // 如果没有设置，sfchecklist会将node_modules、package.json所在目录作为根目录
    settings: {
        sfchecklist: {
            projectRoot: __dirname
        }
    },

    // 配置环境，启用环境特效和注册环境预定义的全局变量
    // 具体参照：https://cn.eslint.org/docs/user-guide/configuring#specifying-environments
    env: {
        browser: true,
        node: true,
        es6: true
    },

    // 防止国际化翻译写法eslint报错未定义
    globals: {
        _: true
    },

    // 配置插件，sxf预置了 eslint-plugin-['vue', , 'import'], 以及相应规则的配置
    // 如果使用这些插件则不需要再进行配置，并且也不应该进行配置
    // 具体参考：https://cn.eslint.org/docs/user-guide/configuring#configuring-plugins
    plugins: ['@sxf/sfchecklist'],

    // 配置规则包，配置插件提供的规则套装
    // plugin:@sxf/sfchecklist/checklist：完全遵循深信服UEDC前端checklist规则
    // plugin:@sxf/sfchecklist/enhance：当前checklist没有、但正在评审或强烈推荐的规则
    // plugin:@sxf/sfchecklist/vue：使用eslint-plugin-vue插件，并已经根据公司checklist进行配置的规则
    // plugin:@sxf/sfchecklist/import：使用eslint-plugin-import插件，全部使用的默认值
    // plugin:@sxf/sfchecklist/sfis: 兼容早期sfis
    extends: [
        'plugin:@sxf/sfchecklist/checklist',
        'plugin:@sxf/sfchecklist/enhance',
        'plugin:@sxf/sfchecklist/vue',
        'plugin:@sxf/sfchecklist/import'
        // 'plugin:@sxf/sfchecklist/sfis'
    ],

    rules: {
        
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        'no-console' : 0
    }
};