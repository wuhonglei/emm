/**
 * af query formatter
 */

export function grpName (value, loadedData, data) {
    if (!data.userName && !data.srcIp && !data.grpName) {
        return '所有';
    }

    if (data.srcIp) {
        return `源IP：${data.srcIp}`;
    }

    if (data.userName) {
        return `用户：${data.userName}`;
    }

    if (data.grpName) {
        let rs = data.grpName.split('/');
        if (!rs.length) {
            return `组：所有`;
        }
        
        let len = rs.length;
        let label = rs[len - 1];
        let i = len - 1;
        while (!label && i >= 0) {
            i -= 1;
            label = rs[i];
        }
        return `组：${label}`;
    }

    return '';
}