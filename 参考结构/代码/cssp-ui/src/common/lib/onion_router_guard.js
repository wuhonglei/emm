/**
 * @file router guard component
 */

import { walkAround } from './walk';

export default class OnionRouterGuard {
    _middlewares = [];

    constructor (middlewares = []) {
        if (Array.isArray(middlewares)) {
            middlewares.forEach(mw => this.registerMiddleware(mw));
        }
    }

    /**
     * create an router guard (offten used in beforeEach guard)
     * @param {boolean} createNew whether create a new guard instead of export the existing one
     * @returns {function} router guard 
     */
    createGuard (createNew = true) {
        if (!createNew && this._guard) {
            return this._guard;
        }

        this._guard = async (to, from, next) => {
            try {
                let context = {
                    to,
                    from,
                    next: true
                };
                await walkAround(this._middlewares, context);
                next(context.next ? context.next : false);
            } catch (err) {
                window.console.error(err);
                next(false);
            }
        };

        return this._guard;
    }

    // register a middleware, it's executed when the checker fns run through
    registerMiddleware (mw) {
        if (typeof mw !== 'function') {
            return;
        }

        this._middlewares.push(mw);

        // return a function to unregister the middleware
        return () => {
            let i = this._middlewares.findIndex(v => v === mw);
            if (i > -1) {
                this._middlewares.splice(i, 1);
            }
        };
    }

    insertMiddleware (index, mw) {
        mw = mw || index;
        if (typeof mw !== 'function') {
            return;
        }

        let _index = typeof index === 'number' ? index : 0;
        this._middlewares.splice(_index, index, mw);

        // return a function to unregister the middleware
        return () => {
            let i = this._middlewares.findIndex(v => v === mw);
            if (i > -1) {
                this._middlewares.splice(i, 1);
            }
        };
    }
}