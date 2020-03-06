/**
 * query 组件mixin 文件
 */

import { createNamespacedHelpers } from 'vuex';
import timeRangePicker from 'src/common/components/time_range_picker';
import { DEFAULT_PICKER_OPTIONS } from 'src/utils/consts';

let { mapGetters } = createNamespacedHelpers('query');


const HOUR = 24;
const MINUTE = 3600;
const SECOND = 1000;
const ONE_DAY_TIME = HOUR * MINUTE * SECOND; //一天毫秒数

export default {
    components: {timeRangePicker},
    data () {
        return {
            defaultPickerOptions: DEFAULT_PICKER_OPTIONS
        };
    },
    computed: {
        ...mapGetters({
            storeParams: 'params',
            storeLoadedData: 'loadedData'
        })
    },

    filters: {
        uuidIp (uuid, ip) {
            return `${uuid}(${ip})`;
        }
    },

    methods: {
        sync () {

            // 同步vuex中储存的值到组件
            if (this.storeParams && this.params) {
                this.syncParams();
            }
            if (this.storeLoadedData && this.loadedData) {
                this.syncLoadedData();
            }
        },

        syncParams () {
            Object.keys(this.storeParams).forEach(key => {
                this.params[key] = this.storeParams[key];
            });
        },

        syncLoadedData () {
            Object.keys(this.storeLoadedData).forEach(key => {
                this.loadedData[key] = this.storeLoadedData[key];
            });
        },

        /**
         * 判断当前有无加载对应数据
         * @param {string} key 需要判断是否加载的key
         * @returns {boolean} 是否有加载
         */
        hasLoadedData (key) {
            if (Array.isArray(this.loadedData[key]) && this.loadedData[key].length > 0) {
                return true;
            }
            return false;
        },

        //  构造boxSearch的sort_para
        //  如果不传值，则默认查询uuid
        normalizedBoxSearchParams (uuid, name, group) {
            let sortPara = {
                uuid: '-',
                name: ''
            };
            if (typeof uuid !== 'undefined') {
                sortPara.uuid = uuid,
                sortPara.name = name;
                if (typeof group !== 'undefined') {
                    sortPara.group = group;
                }
            } else {
                sortPara.name = 'Uuid';
            }
        
            return {
                sort_para: sortPara
            };
        },
        sortedUuid (data) {
            return [...data.filter(item => !item.is_del), ...data.filter(item => item.is_del)];
        },

        setDefaultAll (data, params, type) {
            let node = data;
            params[type] = node[0] && node[0].children ? node[0] : [];
        },

        initDate (params) {
            let date = new Date();
            date.setHours(0, 0, 0, 0);
            params.startDate = params.startDate || date;
            params.endDate = params.endDate || new Date(date.getTime() + ONE_DAY_TIME);
            params.startTime = params.startTime || '00:00';
            params.endTime = params.endTime || '00:00';
        }
    }
};