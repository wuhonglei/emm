/**
 * @file permission manager
 */

import { walkChain } from './walk';

export default class PermissionManager {
    _permChecker = {
        default: []
    };

    registerChecker (namespace = 'default', fn) {
        if (!fn && typeof namespace === 'function') {
            fn = namespace;
            namespace = 'default';
        }

        if (typeof fn !== 'function') {
            return;
        }

        if (!this._permChecker[namespace]) {
            this._permChecker[namespace] = [];
        }

        this._permChecker[namespace].push(fn);
        return () => {
            let i = this._permChecker.findIndex(v => v === fn);
            if (i > -1) {
                this._permChecker.splice(i, 1);
            }
        };
    }

    check (namespace = 'default', options = {}) {
        let context = {
            success: true
        };

        let _namespace = namespace;
        if (Object.prototype.toString.call(namespace) === '[object Object]') {
            options = namespace;
            _namespace = 'default';
        } else if (!this._permChecker[namespace]) {
            _namespace = 'default';
        }

        return walkChain(this._permChecker[_namespace], context, options);
    }
}