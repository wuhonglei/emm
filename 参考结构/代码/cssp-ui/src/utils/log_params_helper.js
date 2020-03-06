/**
 * {
 *     srcIp: { // 定义一个处理器，处理param上面的srcIp字段
 *          key: 'src_ip', 需要转换成后端的值，默认为不变，在这里即为 srcIp
            noTrim: false,  字符串首尾要不要保留空格，默认不保留。
 *          default: ['高'], // 该参数的默认值，当值等于默认值时，不处理。如果有特殊需求，可以定义一个callback返回 undefined
 *          keep: true, 当值的逻辑值为false时，是否需要保留该字段。如srcIp的值是'',依旧保留字段
 *          detail: { // 定义详细的处理，参照processor 的定义
 *              splitArray: {splitKey： '@'} //定义一个数组分隔，并且是以'@'符号分隔，而不是','
 *              callback(value, params, namespace){} // 所有内置的处理器都无法满足，定义一个函数处理，三个参数分别是：当前值，全部参数，模块名，产品名
 *          }
 *     }
 * }
 */


let processor = {

    /**processor
     * 将参数已特定符号切割
     * 
     * @param {string} v 
     * @param {object} rule 
     * @param {object} rule.splitKey - 切割符号，默认为英文逗号
     * @returns {string} 处理值
     */
    splitArray (v, rule) {
        let op = Object.assign({
            splitKey: ','
        }, rule);
        return v.split(op.splitKey);
    },

    /**
     * 将参数用数组包裹，原来是数组的不变
     * @param {*} v
     * @returns {string} 处理值
     */
    array (v) {
        return Array.isArray(v) ? v : [v];
    },

    /**
     * 下拉树组件子节点不传值
     * @param {string} v 
     * @param {object} rule 
     * @param {object} rule.id - 根节点id
     * @param {object} rule.key - 根节点的key
     * @param {object} rule.keyValue - 根节点的value
     * @returns {string} 处理值
     */
    selectTree (v, rule) {
        let op = Object.assign({
            id: '0',
            key: 'name',
            keyValue: '所有'
        }, rule);

        let rootID = op.id;
        let rootKey = op.key;
        let rootName = op.keyValue;
        let LEN = 1;

        // 有且仅有根节点的数据时，undefined传回，不用传这个字段到后台
        if (v.length === LEN && v[0].id === rootID && v[0][rootKey] === rootName) {
            return;
        }

        return v.map((item) => item[rootKey]);
    },

    /**
     * 下拉树数据只获取叶子节点数据
     * @param {Array} value 被选数据节点集合
     * @param {Object} rule 
     * @param {string} rule.paramKey 在params中的字段
     * @param {string} rule.key 需要传到后端的数据，默认为'name'
     * @param {Object} root 标识是否在处理根节点
     * @returns {string} 处理值
     */
    selectTreeLeaf (value, rule, root) {
        let op = rule;
        if (root) {
            op = Object.assign({
                id: '0',
                key: 'name',
                keyValue: '所有'
            }, rule);

            let rootID = op.id;
            let rootKey = op.key;
            let rootName = op.keyValue;
            let LEN = 1;

            // 有且仅有根节点的数据时，undefined传回，不用传这个字段到后台
            if (value.length === LEN && value[0].id === rootID && value[0][rootKey] === rootName) {
                return;
            }
        }

        //  仅取叶子节点的name值
        return value.reduce((res, item) => {
            if (Array.isArray(item.children) && item.children.length > 0) {
                res.push.apply(res, this.selectTreeLeaf(item.children, op));
            } else {
                res.push(item[op.key]);
            }
            return res;
        }, []);
    },


    /**
     * 字符串首尾空格处理
     * @param {string} v 
     * @returns {string} 处理值
     */
    trim (v) {
        if (typeof v === 'string') {
            return v.trim();
        }
        return v;
    },


    /**
     * 只有当params中的某个字段值为特定值时才传到后台
     * @param {*} value 
     * @param {*} rule 
     * @param {String} rule.key 字段
     * @param {String} rule.value 值
     * @param {Object} params 
     * @returns {*} 返回值
     */
    existOnly (value, rule, params) {
        if (rule && rule.key && rule.value) {
            if (params[rule.key] === rule.value) {
                return value;
            }
            return;
        }
        return value;
    },

    /**
     * 把本来是Array类型的参数连接成字符串
     * @param {Array} value 
     * @param {Object} rule 
     * @returns {String} 返回值
     */
    joinArray (value, rule) {
        let op = Object.assign({
            join: ',',
            map: v => v
        }, rule);
        if (Array.isArray(value) && value.length > 0) {
            return value.map(op.map).join(op.join);
        }
        return value;
    },

    /**
     * 子组功能, 只有当params中的某个字段值为true时，需要子组功能，为false时，去掉子组功能。
     * value的值，有可能是一个满足子组功能的值，有可能是一个字符串，不满足子组功能。
     * 不管是true, 还是false，都要做处理，因为value的数据结构可能是数组，也可能是字符串
     * 子组功能
     *     选择了所有时，不传
     *     该节点下所有子节点都传。
     * 不含子组功能
     *     选择了所有的节点时，不传。
     *     只传父节点，子节点不传
     * @param {Array } value 要处理的值，这里期望的是一个数组，但是，也有可能是一个字符串。
     * @param {Object} rule 
     * @param {Object} params 原始参数 
     * @param {Object} namespace 这里基本上用不到  
     * @param {Object} loadData 页面加载的时候从后台获取的初台值   
     * @returns {String} 返回值
     */
    hasChildrenGroup (value, rule, params, namespace, loadData) {

        let op = Object.assign({
            key: '', // 表示以params的哪个字段值做为是否包含子组功能的判断, 必须在用的地方传递
            all: '', // 表示全部选择时的字段值， 可能是用“”来表示选择了全部
            compareKey: 'name', // 表示要与loadData中的哪个字段值做比较 例如： loadData.grpName[0].name
            retVal: 'name',  // 表示要获取loadData中的哪个字段的值。例如： loadData.grpName[0].name
            compareDataName: '' // loadData 中的哪个值，例如： loadData.grpName
        }, rule);

        if (!loadData || !loadData[op.compareDataName]) {
            return value;
        }

        if (rule && rule.key) {
            
            // 首先处理 value 是字符串的情况。
            if (typeof value === 'string') {
                value = [value];
            }

            // 选择了全部时，不向后台传这个字段，所以需要 return;
            let result = value.filter(item => item === op.all);
            if (result.length) {
                return;
            }

            // 根据value值去和loadData做比较，拿到对应节点的所有子节点及其子孙节点
            let getChildrenS = function (data, compareVal, result = []) {
                if (data.constructor === Object && !data.children) {
                    return;
                }
                data.forEach((option) => {
                    if (option.children) {
                        result.add(option[op.retVal]);
                        getChildrenS(option.children, compareVal, result);
                    }
                });
            };

            let loadDataHandle = function (data, compareVal, result = []) {
                data.forEach((option) => {
                    if (!option.children) {
                        return;
                    }
                    if (option[op.compareKey] === compareVal) {
                        getChildrenS(option.children, compareVal, result);
                    } else {
                        loadDataHandle(option.children, compareVal, result);
                    }
                }); 
            };
            let childrenArr = [];
            let childrenSet = new Set();
            let comparData = loadData[op.compareDataName];
            if (comparData.constructor !== Array) {
                comparData = [comparData];
            }
            value.forEach((item) => {
                loadDataHandle(comparData, item, childrenSet);
            });
            childrenArr = [...childrenSet];

           
            // 子组功能为 true,  提交的数据应该包含其所有的子节点，及子节点的子节点。
            if (params[rule.key]) {
                return [...new Set([...value, ...childrenArr])];
            }

            // 取消子组功能 只传父节点，不传子节点。
            let unChildrenGroupSet = new Set(value);
            childrenArr.forEach((item) => {
                unChildrenGroupSet.delete(item);
            });
            return  [...unChildrenGroupSet];
          
        }
        return value;

    }
};

processor.selectTreeLeaf = processor.selectTreeLeaf.bind(processor);

/**
 * 判断两个数组是否含有相同数组项（顺序不一样没关系）
 * @param {array} arraySrc - 第1个数组
 * @param {array} arrayDest - 第2个数组
 * @returns {boolean}  是否相同
 */
function isSameContentArray (arraySrc, arrayDest) {
    if (arraySrc.length !== arrayDest.length) {
        return false;
    }
    for (let i = 0, len = arraySrc.length; i < len; i++) {
        if (arrayDest.indexOf(arraySrc[i]) === -1) {
            return false;
        }
    }
    return true;
}

/**
 * 日志模块统一转换params 函数
 * 
 * @param {object} params - 原始参数
 * @param {object} rules - 规则数据
 * @param {object} productName - 产品名称
 * @param {object} moduleName - 模块名称
 * @param {object} controlPara - 控制端参数
 * @param {object} loadData - 加载的时候的初始数据
 * @returns {object}  处理后的参数
 */
export default function logParamsHelper (params, rules, productName, moduleName, ...endParams) {
    let [controlPara, loadData] = [...endParams];
    let payload = {
        control_para: controlPara,
        sort_para: {
            product: productName
        }
    };

    if (moduleName) {
        payload.sort_para.type = moduleName;
    }

    // 将产品，模块信息封装方便处理器调用
    let namespace = { productName, moduleName };
    Object.keys(rules).forEach((key) => {
        let realKey = rules[key].key || key;
        let realValue = params[key];

        // 当值是字符串时，并且noTrim为默认值时，值应该是去掉首尾空格之后的值。
        if (!rules[key].noTrim && typeof realValue === 'string') {
            realValue = processor.trim(realValue);
        }

        // 当值为空，并且没有设置强制存在keep的时候，不处理
        if (!realValue && !rules[key].keep) {
            return;
        }
        
        // 判断默认值，当值等于默认值的时候，不处理
        // 当值为 null，数字，字符串这种可以直接比较的，进行比较判断
        // 当值为对象时，使用JSON.stringify 进行判断，数组判断提取成函数
        if ((realValue === null || typeof realValue !== 'object') && 
            realValue === rules[key].default) {
            return;
        } else if (Array.isArray(realValue) && Array.isArray(rules[key].default) && 
            isSameContentArray(realValue, rules[key].default)) {
            return;
        } else if (JSON.stringify(realValue) === JSON.stringify(rules[key].default)) {
            return;
        }


        // 对定义的处理器，依次处理，上一个处理的结果，是下一个处理的值
        
        if (rules[key].detail) {
            Object.keys(rules[key].detail).every((ruleName) => {
                if (ruleName === 'callback' && typeof rules[key].detail.callback === 'function') {
                    realValue = rules[key].detail.callback(realValue, params, namespace, loadData);
                }
                if (processor[ruleName] && typeof processor[ruleName] === 'function') {
                    realValue = processor[ruleName](realValue, rules[key].detail[ruleName], params, namespace, loadData);
                }
                return typeof realValue !== 'undefined';
            });
        }

        if (typeof realValue !== 'undefined') {
            payload.sort_para[realKey] = realValue;
        }
        
    });
    
    return payload;
};

