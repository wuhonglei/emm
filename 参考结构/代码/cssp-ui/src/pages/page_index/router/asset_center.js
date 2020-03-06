/**
 * @file 资产中心路由配置
 */

export default {
    path: 'asset_center',
    name: 'assetCenter',
    meta: {
        navOptions: {
            text: '资产',
            name: 'assetCenter',
            icon: 'safe-area'
        }
    },
    redirect: {
        name: 'assetCenterManage'
    },
    component: () => 
        import(/* webpackChunkName: "assetCenter" */ 'src/view/mod_asset_center'),
    children: [{
        path: 'manage',
        name: 'assetCenterManage',
        meta: {
            navOptions: {
                text: '资产管理'
            }
        },
        component: () => 
            import(/* webpackChunkName: "assetCenter" */ 'src/view/mod_asset_center/asset_manage')
    }, {
        path: 'collector',
        name: 'assetCenterCollector',
        meta: {
            navOptions: {
                text: '采集器模板'
            }
        },
        component: () => 
            import(/* webpackChunkName: "assetCenter" */ 'src/view/mod_asset_center/collector')
    }]
};