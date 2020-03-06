/**
 * @file 导航储存中心
 */

import { cachedTreeFind } from '../util/tree';
import assert from '../util/assert';

export default class NavStorage {
    constructor (navList) {
        this._navList = navList;
        this.state = {
            activeNav: []
        };

        this._NSearchCache = new Map(); // 根据名称查找的缓存
        this._PSearchCache = new Map(); // 根据路径查找的缓存
        this._NPSearchCache = new Map(); // 根据名称和路径查找的缓存
        this._navNameSearchCache = new Map(); // 根据导航名查找的缓存
    }

    // 获取状态对象
    getState () {
        return this.state;
    }

    // 获取当前激活状态的导航项列表
    getActiveNav () {
        return this.state.activeNav;
    }

    /**
     * 添加激活状态的导航项
     * @param {object} options 选项
     * @param {string} [options.name] 路由名
     * @param {string} [options.path] 路径
     */
    addActive ({ name, path }) {
        let nav;
        if (name && path) {
            nav = this._searchNavByNameAndPath(name, path);
        } else if (name) {
            nav = this._searchNavByName(name);
        } else if (path) {
            nav = this._searchNavByPath(path);
        }

        if (!nav) {
            return;
        }

        nav.active = true;
        this.state.activeNav.push(nav);
    }

    // 清除激活状态的导航项
    clearActive () {
        this.state.activeNav.forEach(nav => { 
            nav.active = false; 
        });
        this.state.activeNav = [];
    }

    /**
     * 检查某项导航是否激活
     * @param {object} options 选项
     * @param {string} [options.name] 路由名
     * @param {string} [options.path] 路径
     * @returns {boolean} 是否激活
     */
    checkActive ({ name, path }) {
        let fn;
        if (name && path) {
            fn = nav => nav.name === name && nav.path === path;
        } else if (name) {
            fn = nav => nav.name === name;
        } else if (path) {
            fn = nav => nav.path === path;
        } else {
            return false;
        }

        return this.state.activeNav.findIndex(fn) > -1;
    }

    /**
     * 获取导航列表
     * @param {string} navName 导航名称
     * @returns {array} 导航列表
     */
    getNavList (navName) {
        let nav = this._searchNavByNavName(navName);
        return nav && nav.children || [];
    }

    /**
     * 根据导航名获取导航项
     * @param {string} navName 导航名称
     * @returns {object} 导航项
     */
    getNavByNavName (navName) {
        return this._searchNavByNavName(navName);
    }

    /**
     * 根据名称和路径查找导航项
     * @param {string} name 路由名
     * @param {string} path 路径
     * @returns {object} 导航项
     */
    _searchNavByNameAndPath (name, path) {
        assert.type(name, 'string', 'name must be a string');
        assert.type(path, 'string', 'path must be a string');
            
        name = name.trim();
        path = path.trim();
        let cacheKey = JSON.stringify({ name, path });

        return cachedTreeFind(
            this._navList, 
            this._NPSearchCache, 
            cacheKey, 
            nav => nav.name === name && nav.path === path
        );
    }

    /**
     * 根据名称查找导航项
     * @param {string} name 路由名
     * @returns {object} 导航项
     */
    _searchNavByName (name) {
        assert.type(name, 'string', 'name must be a string');

        name = name.trim();

        return cachedTreeFind(
            this._navList,
            this._NSearchCache,
            name,
            nav => nav.name === name
        );
    }

    /**
     * 根据路径查找导航项
     * @param {string} path 路径
     * @returns {object} 导航项
     */
    _searchNavByPath (path) {
        assert.type(path, 'string', 'name must be a string');

        path = path.trim();

        return cachedTreeFind(
            this._navList,
            this._PSearchCache,
            name,
            nav => nav.path === path
        );
    }

    /**
     * 根据导航名称查找导航项
     * @param {string} navName 导航名
     * @returns {object} 导航项
     */
    _searchNavByNavName (navName) {
        assert.type(navName, 'string', 'name must be a string');

        navName = navName.trim();

        return cachedTreeFind(
            this._navList,
            this._navNameSearchCache,
            navName,
            nav => nav.navName === navName
        );
    }
}