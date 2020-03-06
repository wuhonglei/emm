/**
 * 日志query 同步store 
 */

export default {
    namespaced: true,
    state: {
        params: {}, // 已经选择的参数
        loadedData: {} // 单个类型参数保存的数据
    },
    getters: {
        params: state => state.params,
        loadedData: state => state.loadedData
    },
    mutations: {
        clear (state, cacheInfo) {
            let params = {};
            let loadedData = {};

            if (cacheInfo) {

                // 缓存params
                cacheInfo.params.forEach(key => {
                    params[key] = state.params[key];
                });

                // 缓存loadedData
                cacheInfo.loadedData.forEach(key => {
                    loadedData[key] = state.loadedData[key];
                });
            }

            state.params = params;
            state.loadedData = loadedData;
        },
        cacheParams (state, payload) {
            state.params = payload;
        },
        cacheLoadedData (state, payload) {
            state.loadedData = payload;
        }
    }
};
