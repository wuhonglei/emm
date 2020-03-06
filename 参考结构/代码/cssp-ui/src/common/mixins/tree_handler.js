/**
 * 树结构数据处理
 */

export default {
    methods: {
        addPath (tree, name = 'name', path = '/') {
            if (Array.isArray(tree)) {
                tree.forEach(item => {
                    item._path = this.normalizePath(path + '/' + item[name]);
                    if (item.children) {
                        this.addPath(item.children, name, item._path);
                    }
                });
            } else if (typeof tree === 'object') {
                tree._path = path;
                if (tree.children) {
                    this.addPath(tree.children, name, path);
                }
            }
        },
        normalizePath (path) {
            let res = path;
            res = res.replace(/\/+/, '/');
            if (res.length > 1) {
                res = res.replace(/\/$/, '');
            }
            return res;
        }
    }
};