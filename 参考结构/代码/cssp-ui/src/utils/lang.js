/**
 * Created by ued on 2017/1/9.
 */

/**
 * 增加中文字符长度判断，在UTF8中，通常中文字符占三字节，所以一个中文字符长度==3个英文字符长度
 * @param {string} s
 * @return {number} 字符串实际长度
 */
function getUTF8Length (s) {
    let totalLength = 0;
    let i;
    let charCode;
    s = String(s);

    const ONE = 1;
    const TWO = 2;
    const THREE = 3;

    const U_7F = 0x007f;
    const U_80 = 0x0080;
    const U_7FF = 0x07ff;
    const U_800 = 0x0800;
    const U_FFFF = 0xffff;

    for (i = 0; i < s.length; i++) {
        charCode = s.charCodeAt(i);
        if (charCode < U_7F) {
            totalLength = totalLength + ONE;
        } else if ((U_80 <= charCode) && (charCode <= U_7FF)) {
            totalLength += TWO;
        } else if ((U_800 <= charCode) && (charCode <= U_FFFF)) {
            totalLength += THREE;
        }
    }
    return totalLength;
}

export default {
    getUTF8Length
};
