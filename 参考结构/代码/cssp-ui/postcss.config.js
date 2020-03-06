
let path = require('path');
module.exports = {
    plugins: {
        // autoprefixer: {}, //已经被cssnext 包含
        'postcss-import': {
            resolve(id, basedir, importOptions) {
                if (id.indexOf('/') === 0) {
                    return id;
                }
                return path.join(importOptions.root, id);
            }
        },
        'postcss-cssnext': {}
    }
};
