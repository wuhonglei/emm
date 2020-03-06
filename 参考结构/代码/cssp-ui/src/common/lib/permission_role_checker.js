/**
 * @file a permission checker according to route
 */

/**
 * @file 权限管理工具
 */

const DEFAULT_CONFIG = {
    routes: [],
    permissions: {
        forbidden: 'no',
        read: 'read',
        write: 'edit'
    }
};

const RULES = {
    SOME: 'some',
    EVERY: 'every'
};

function isPlainObject (obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

export default class PermissionRoleChecker {

    checkers = [];
    routesInited = false;

    /**
     * 构造函数
     * 
     * 传入的store必须包含 getPermission, setPermission, getRole, setRole 方法，
     *      setPermission: function (permission) {...} 储存permission
     *      getPermission: function () {... return permission} 获取储存的permission
     *      setRole: function (role) {...} 储存role
     *      getRole: function () {... return role} 获取储存的role
     * 
     * 这里没有直接写死成用 vuex 储存是为了应对后面可能的改变，保证开闭原则
     * 
     * @param {object} options
     * @param {object} [options.store] 用来保存permission的store
     * @param {object} [options.config] 配置信息
     * @param {array} [options.routes] 路由节点树
     * @param {boolean} [options.cacheResult] 是否缓存每个节点的验证结果
     */
    constructor ({
        store = { 
            getPermission: () => {}, 
            getRole: () => {},
            setPermission: () => {},
            setRole: () => {}
        },
        config = DEFAULT_CONFIG,
        routes = [],
        cacheResult = false
    }) {
        this.store = store; //保存 store
        this.cacheResult = !!cacheResult;
        this.config = Object.assign(
            {}, 
            Object.assign({}, DEFAULT_CONFIG), 
            config
        );

        this._initRecords();
        if (routes && Array.isArray(routes) && routes.length > 0) {
            this.routes = routes;
            this._initRoutes();
        }    
    }

    // 遍历路由
    _traverseRoutes (fn = () => {}) {
        traverse(this.routes, fn);
    }

    // 计算配置中第i项对应的next
    _findRecordNext (i) {
        let route = this.config.routes[i],
            next = route.next;

        if (next === null) {
            return null;
        }

        if (typeof next === 'number') {
            return this.config.routes[next] ? this.config.routes[next] : null;
        }

        if (typeof next === 'string') {
            let res = this.getRecordByName(next) || this.getRecordByPath(next);
            return res || next;
        }

        if (isPlainObject(next)) {
            return next;
        }

        return this.config.routes[i + 1] ? this.config.routes[i + 1] : null;
    }

    // 初始化配置项，将配置项中的next计算出来并形成一个树形结构
    _initRecords () {

        // 建立一个树形结构
        let _routes = this.config.routes;
        for (let i = 0; i < _routes.length; ++i) {
            _routes[i] = Object.assign(_routes[i], {
                next: this._findRecordNext(i),
                _isRecord: true // 这个很重要，，用来标识这个对象是不是一个路由权限配置项
            });
        }
    }

    // 初始化路由节点的 meta._permOptions
    _setRouteOptions (route) {
        if (!route.meta) {
            route.meta = {};
        }
        if (!route.meta._permOptions) {
            route.meta._permOptions = {};
        }
    }

    // 计算路由节点的绝对路径并保存
    _setRouteAbsPath (route, parent) {
        let parentPath = parent ? parent.meta._permOptions.absPath : '';
        route.meta._permOptions.absPath = normalizePath(parentPath + '/' + route.path);
    }

    // 将路由节点对应的验证失败时下一跳路由注入到路由节点的 meta._permOptions 中
    _setRouteNext (route) {
        let record = route.meta._permOptions.record;
        if (!record || !record.next) {
            route.meta._permOptions.next = false;
            return;
        }

        route.meta._permOptions.next = record.next._isRecord ? 
            this.findRouteByRecord(record.next) : record.next;
        route.meta._permOptions.next = route.meta._permOptions.next ? 
            route.meta._permOptions.next : false;

    }

    // 将路由节点对应的配置项的应用注入到路由节点的 meta._permOptions中
    _setRouteRecord (route) {
        let record = this.getRecord(route.name, route.meta._permOptions.absPath);
        if (!record) {
            return;
        }

        route.meta._permOptions.record = record;

        // deep 默认为 true
        // 有deep配置则将该record映射到该路由所有的子节点上（包括子节点的子节点）
        let deep = typeof route.deep === 'undefined' ? true : route.deep;
        if (deep && route.children) {
            traverse(route.children, r => {
                r.meta._permOptions.record = record;
            });
        }
    }

    // 初始化路由节点树
    _initRoutes () {

        // 这里要先遍历第一遍，因为后面会访问子节点
        // 如果不先遍历一遍访问子节点的时候会出现子节点未初始化的情况
        this._traverseRoutes((route, parent) => {
            this._setRouteOptions(route);
            this._setRouteAbsPath(route, parent);
        });
        this._traverseRoutes(route => {
            this._setRouteRecord(route);
            this._setRouteNext(route);
        });

        this.routesInited = true;
    }

    // 重新加载路由节点树
    loadRoutes (routes) {
        if (!routes || !Array.isArray(routes)) {
            return;
        }

        this.routes = routes;
        this._initRoutes();
    }

    // 根据特定的配置项规则获取匹配到的路由节点
    // 该配置项可以自己定义
    findRouteByRecord (record) {
        if (!record) {
            return null;
        }

        return findRouteRecord(this.routes, r => {
            let found = !record.name ||
                    (typeof record.name === 'function' ? 
                        record.name(r.name) : record.name === r.name);

            found = found && 
                    (!record.path ||
                    (typeof record.path === 'function' ? 
                        record.path(r.meta._permOptions.absPath) : 
                        record.path === r.meta._permOptions.absPath));

            return found;
        });
    }

    setPermissions (permissions) {
        this.store.setPermission(permissions);
    }

    setRole (role) {
        this.store.setRole(role);
    }

    checkRole (role) {
        return this.store.getRole() === role;
    }

    // 同时根据名称和路径获取匹配到的配置项
    getRecord (name, path) {
        return this.config.routes.find(r => (
            !r.name || 
            (typeof r.name === 'function' ? r.name(name) : r.name === name)
        ) &&
        (
            !r.path || 
            (typeof r.path === 'function' ? r.path(path) : r.path === path)
        ));
    }

    // 根据名称获取匹配到的配置项
    getRecordByName (name) {
        return this.config.routes.find(r => (
            typeof r.name === 'function' ?
                r.name(name) : r.name === name
        ));
    }

    // 根据路径获取匹配到的配置项
    getRecordByPath (path) {
        return this.config.routes.find(r => (
            typeof r.path === 'function' ?
                r.path(name) : r.path === path
        ));
    }

    /**
     * 检查路由的角色
     * @param {Route} route vue-router 路由项
     * @param {boolean} traverse 是否遍历 redirect
     *      有时候需要静态检查全程路由跳转过程中的权限，这时不能
     *      依赖跳转后再检查，则需要遍历 redirect 进行检查
     * @returns {object} { success：是否验证通过, next：下一跳路由 }
     */
    checkRouteRole (route, traverse = false) {
        let record = route.meta._permOptions.record,
            routeNext = route.meta._permOptions.next;

        let _absPath = routeNext.meta && 
            routeNext.meta._permOptions && 
            routeNext.meta._permOptions.absPath;

        // 是否应该缓存验证结果
        let _shouldCacheRes = this.cacheResult && 
            typeof route.meta._permOptions.forbidden === 'undefined',

            // 是否应该读取缓存验证结果
            _shouldReadCachedRes = this.cacheResult && 
            typeof route.meta._permOptions.forbidden !== 'undefined';

        let success = _shouldReadCachedRes ? 
            !route.meta._permOptions.forbidden : 
            (() => {

                //如果配置中没有这个字段，默认不需要验证
                if (!record || !record.role) {
                    return true;
                }

                // 获取配置中对应的role字段的值
                let role = this.store.getRole(),
                    routeRole = typeof record.role === 'function' ? 
                        record.role() : 
                        record.role;

                if (Array.isArray(routeRole)) {
                    return routeRole.some(r => r === role);
                }
            
                return routeRole === role;
            })();

        if (_shouldCacheRes) {
            route.meta._permOptions.forbidden = !success;
        }
    
        let _next = {
            name: routeNext.name,
            path: _absPath ? _absPath : routeNext.path
        };
        if (!_next.name && !_next.path) {
            _next = null;
        }

        // 深度遍历该路由重定向到的路由节点
        if (route.redirect && traverse && success) {
            let redirect = route.redirect;
            let _route = this.findRouteByRecord({
                name: redirect && redirect.name,
                path: redirect && (typeof redirect === 'string' ? redirect : redirect.path)
            });

            let redirectRes =  this.checkRouteRole(_route, traverse);

            return {
                success: redirectRes.success,
                record,
                
                // 真实的跳转路径
                next: !redirectRes.success ? (redirectRes.next || _next) : null
            };
        }

        return {
            success,
            record,
            
            // 真实的跳转路径
            next: !success ? _next : null
        };
    }

    /**
     * 检查路由的权限
     * @param {Route} route vue-router 路由项
     * @param {boolean} traverse 是否遍历 redirect
     *      有时候需要静态检查全程路由跳转过程中的权限，这时不能
     *      依赖跳转后再检查，则需要遍历 redirect 进行检查
     *      在路由守卫中使用不需要
     * @returns {object} { success：是否验证通过, next：下一跳路由 }
     */
    checkRoutePerm (route, traverse = false) {
        let record = route.meta._permOptions.record,
            routeNext = route.meta._permOptions.next;
        
        let _absPath = routeNext.meta && 
            routeNext.meta._permOptions && 
            routeNext.meta._permOptions.absPath;

        // 是否应该缓存验证结果
        let _shouldCacheRes = this.cacheResult && 
            typeof route.meta._permOptions.forbidden === 'undefined',

            // 是否应该读取缓存验证结果
            _shouldReadCachedRes = this.cacheResult && 
            typeof route.meta._permOptions.forbidden !== 'undefined';

        let success = _shouldReadCachedRes ? 
            !route.meta._permOptions.forbidden :  
            (() => {
                if (!record || !record.permission) {
                    return true;
                }

                // 获取配置中对应的perimssion字段的值
                let pm = typeof record.permission === 'function' ? 
                    record.permission() : 
                    record.permission;

                let check = (p) => {
                    let storedPerm = this.store.getPermission()[p];
                    return storedPerm && 
                        storedPerm !== this.config.permissions.forbidden;
                };

                if (isPlainObject(pm)) {
                    let _pm = pm.value,
                        rule = pm.rule;

                    if (!_pm) {
                        return false;
                    }

                    if (rule === RULES.SOME) {
                        return _pm.some(p => check(p));
                    }

                    return _pm.every(p => check(p));
                }

                if (Array.isArray(pm)) {
                    return pm.every(p => check(p));
                }

                return check(pm);
            })();
        
        if (_shouldCacheRes) {
            route.meta._permOptions.forbidden = !success;
        }

        let _next = {
            name: routeNext.name,
            path: _absPath ? _absPath : routeNext.path
        };
        if (!_next.name && !_next.path) {
            _next = null;
        }

        // 深度遍历该路由重定向到的路由节点
        if (route.redirect && traverse && success) {
            let redirect = route.redirect;
            let _route = this.findRouteByRecord({
                name: redirect && redirect.name,
                path: redirect && (typeof redirect === 'string' ? redirect : redirect.path)
            });

            let redirectRes =  this.checkRoutePerm(_route, traverse);
            return {
                success: redirectRes.success,
                record,
                
                // 真实的跳转路径
                next: !redirectRes.success ? (redirectRes.next || _next) : null
            };
        }

        return {
            success,
            record,
            
            // 真实的跳转路径
            next: !success ? _next : null
        };
    }
};

// 在路由节点树中查找符合 fn 验证函数的第一个节点（深度优先遍历）
function findRouteRecord (routes, fn = () => true) {
    let record = null;
    routes.some(route => {
        if (fn(route)) {
            record = route;
            return true;
        }
        if (route.children) {
            record = findRouteRecord(route.children, fn);
            return !!record;
        }
        return false;
    });

    return record;
}

// 去除多余的斜杠
function normalizePath (path) {
    let res = path;
    res = res.replace(/\/+/, '/');
    if (res.length > 1) {
        res = res.replace(/\/$/, '');
    }
    return res;
}

// 遍历路由节点树
function traverse (routes, fn = () => {}, parentNode = null) {
    routes.forEach(route => {
        fn(route, parentNode);
        if (route.children) {
            traverse(route.children, fn, route);
        }
    });
}