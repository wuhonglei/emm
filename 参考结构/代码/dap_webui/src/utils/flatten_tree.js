/**
 * 循环打平树形结构
 */

/**
 * 需要打平的树形结构数据
 *
 * @export
 * @param {array|object} data 需要转换的数据
 * @param {string} [childrenKey='children'] 子组的key
 * @param {string} [parentKey='parent'] 父组的key
 * @param {boolean} [addParentFlag=false] flatten 时是否要为子节点添加父节点标记
 * @returns {array}
 */
export default function (data, childrenKey = 'children', parentKey = 'parent', addParentFlag = false) {
    let rs = [];
    let stack = [];

    if (!data) {
        return [];
    }
    if (Array.isArray(data)) {
        stack = data.slice(0);
    } else {
        stack.push(data);
    }

    while (stack.length) {
        let temp = stack.pop();

        rs.push(temp);
        
        if (!temp[childrenKey]) {
            break;
        }

        temp[childrenKey].forEach((item) => {
            stack.push(item);

            // 添加父节点标记
            if (addParentFlag) {
                item[parentKey] = temp;
            }
        });
    }

    return rs;
}