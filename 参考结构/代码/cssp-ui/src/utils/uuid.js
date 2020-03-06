/**
 * uuid 生成器
 * copy from hci5.3
 */

/**
 * Generates unique ids. If the element already has an id, it is unchanged
 * @param {Mixed} el (optional) The element to generate an id for
 * @param {String} prefix (optional) Id prefix (defaults "ext-gen")
 * @return {String} The generated Id.
 */
var idSeed = 0;
export default function (prefix) {
    return (prefix || 'x-gen') + (++idSeed);
};
