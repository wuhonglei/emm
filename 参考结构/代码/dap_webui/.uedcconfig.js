/**
 * uedc相关配置文件
 */

module.exports = {
    product: 'ssl',
    project: 'aTrust',
    version: '2.0.0',
    counter: { // 代码统计分析工具
        publicPaths: [
            'api',
			'components',
			'config',
			'derective',
			'style',
			'utils',
			'page_index/components',
			'page_index/mixins',
			'page_index/store',
			'page_index/router',
			'page_index/views/home/util',
			'page_index/views/monitor/components',
			'page_index/views/monitor/style',
			'page_index/views/service/components',
			'page_index/views/service/local_user_manage/components',
			'page_index/views/service/resource_manage/components'
        ],

        homePaths: [
            'page_index/views/home',
			'page_index/views/monitor',
			'page_index/views/service',
			'page_index/views/system',
			'page_login'
        ],

        codeFileTypes: [
            'html',
            'tpl',
            'css',
            'styl',
            'sass',
            'less',
            'js',
            'ts',
            'vue'
        ]
    }
};
