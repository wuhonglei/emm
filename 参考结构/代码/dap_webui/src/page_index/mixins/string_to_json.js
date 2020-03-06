
/**
 * 将string 转成 json格式
 */

export default {
    methods: {
        stringToJson (data) {
            try {
                let dataObj = JSON.parse(data);
                return dataObj;
            } catch (error) {
                return {};
            }
        }
    }
};