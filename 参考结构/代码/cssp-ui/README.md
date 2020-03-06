# CSSP日志审计

## 目录

* 1 Prepare
  * 1.1 安装依赖
  * 1.2 npm script 介绍
  * 1.3 知识必备清单
  * 1.4 代码结构
* 2 Devoloping
  * 2.1 与后端联调
  * 2.2 多页与路由
  * 2.3 API
  
    * 2.3.1 API的统一处理
    * 2.3.2 API封装的结构÷
    * 2.3.3 API返回的结构
    * 2.3.4 API命名规范
    * 2.3.5 API注释规范
  * 2.4 CSS

    * 2.4.1 给业务组件根节点套上wapper
    * 2.4.2 给功能组件加上sf前缀
    * 2.4.3 使用BEM而不是scoped
    * 2.4.4 使用cssnext 以及变量
    * 2.4.5 尽量减少嵌套层数

## 1 Prepare

### 1.1 安装依赖

```shell
# 输入node -v 查看版本， 要求nodejs v8.x 版本以上
node -v

# 安全依赖，无需设置镜像。.npmrc会自己修改
npm i
```

### 1.2 npm script 介绍

* serve：进行开发调试。
* build：打包，生成静态资源文件。
* lint：单独进行eslint校验。
* deploy:server：将*打包后*的文件部署到服务上。（需要在serve.config.js配置ssh字段，正常情况下修改IP即可）

### 1.3 知识必备清单

1. [checklist](http://code.sangfor.org/UED/FE-COMMON/checklist) (公司前端统一代码规范)
2. Vue
3. Vue-router  Vuex 以及相关全家桶
4. Axios
5. [PearUI](http://200.200.151.94:8085)(ElementUI定制组件库，基于1.4.10)
6. postcss, cssnext
7. svg-sprite (用到svg图标时，需要了解)

### 1.4 代码结构

```shell
.
├── bin # 命令存放目录
├── public
└── src # 代码目录
    ├── api # 接口目录，所有接口在此文件夹中定义，一个模块一个文件
    ├── assets # 资源目录，存放图片或者 svg
    │   └── svg # svg 存放目录 具体使用建议了解 `svg-sprite `
    ├── components # 全局公共组件目录，对于多页应用来说，所有页面都会用到的组件
    ├── lib # 第三方非npm包目录
    ├── mixins # vue mixins 目录
    ├── page_index # 首页 
    │   ├── components # 首页公用组件
    │   │   ├── layout
    │   │   └── toolbar
    │   ├── mod_collector # 模块目录 所有模块的大模块以mod_开头（公司前端命名管理）
    │   ├── mod_index
    │   ├── mod_log
    │   │   └── af # 二级子模块
    │   │       └── waf # 三级子模块
    │   ├── ... # 其余模块
    │   ├── mod_log_manage
    │   ├── router # 路由目录，会有单独章节进行讲解
    │   ├── store # vuex 目录
    │   └── style # 单页面全局样式目录
    ├── page_login # 登录页面
    ├── svg # svg 组件目录
    └── utils # 工具函数目录
```



## 2 Devoloping



### 2.1 与后端联调

项目采用前后端分离，使用webpack自带的devServer进行跨域请求。具体的配置在`vue.config.js`文件的devServer字段。

```js
module.exposts = {
    ... // other vue config
    devServer: {
        https: true,
        port: 8080,
        proxy: {
            '/api': {
                target: 'https://199.201.88.196', // 需要联调的后端同学的地址，一般只需要改这个就行了
                secure: false,
                https: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
    ...
}
```

此外，还有更高级的，配合内部devServe的用法，与项目没关系，不在此列出。

### 2.2 多页与路由

#### 2.2.1 多页

根据历史经验，项目是无法避免多页的，所以预先就留出了多页的内容。可以看到`page_index` `page_login`这个两个文件夹就是示例。

访问首页：`https://localhost:${port}/`

访问登录页：`https://localhost:${port}/login.html`

Why? 其实webpack开启多页之后，每访问一个页面都要具体的到对应的html。`https://localhost:${port}/`实际上就是访问的`https://localhost:${port}/index.html`。这样一来是不是就理解了。

#### 2.2.2 路由

每一个单页都可以有自己的路由，如果我们登录页面后续复杂很多了，也可以给登录页面加上路由，但是目前来说没有必要。

路由的定义放在`page_index/router`文件夹，`index.js`用于引入各个模块的路由并注册、注册全局的路由导航守卫、注册全局路由拦截器。

如果，我们把根节点当做一级模块，那么问题来了。

如何注册一个二级模块？

1. 在`page_index/router/`新增foo.js（如果你的模块叫foo）

   ```js
   /**
    * foo 二级模块导航文件示例
    */
   
   import names from './name.config'; // 所有路由的显示文字定义
   export default {
       path: 'foo',
       name: 'foo',
       meta: { // 显示文字，权限内容，是否显示等信息全部在meta里面定义
           name: names.foo // 定义显示的文字
       },
       redirect: { // 如果有子路由，默认重定向的页面
           name: 'bar'
       },
       component: () =>
           import(/* webpackChunkName: "foo" */ 'src/pages/page_index/mod_foo/index.vue'),
       children: [{
           path: 'bar',
           name: 'bar',
           meta: {
               name: names.bar
           },
           component: () => import(/* webpackChunkName: "foo" */ 'src/pages/page_index/mod_foo/bar/index.vue'),
       }]
   };
   	
   ```

2. 新增好对应的组件，比如刚刚新增的文件夹里面引入了`src/pages/page_index/mod_foo/index.vue`，那你肯定得新增这个文件才行。

3. 在`page_index/router/`中引入，并引入

   ```js
   /**
    * 路由入口文件
    */
   
   import Vue from 'vue';
   import Router from 'vue-router';
   import index from 'src/pages/page_index/index.vue';
   
   import log from './log';
   import manage from './manage';
   import foo from './foo'; // 引入你新增的模块
   
   Vue.use(Router);
   
   const ROUTER = new Router({
       routes: [{
           path: '/',
           component: index,
           redirect: {
               name: 'log'
           },
           children: [log, manage, foo] // 将你的文件丢入这个数组
       }]
   });
   
   ```

4. 访问`https://localhost:${port}/#/foo}`应该就可以看到效果了。

特别注意：

* **webpackChunkName: name**注释不可省略，每一个二级模块文件内**必须保持全文件统一**。
* 所有额外信息必须在meta字段定义。

### 2.3 API

API的定义只是对后端提供接口的封装，并不是真正写了一个接口。

API是前后端沟通唯一的通道，为了进行统一处理，所有API抽离单独定义，并采用通道透传，语义话的的理念。所有API定义的文件放在`src/common/api`目录下面。`index.js`为axios对象导出，和统一化处理文件，不能在里面定义接口。其余的以模块区分，一个模块一个文件。

#### 2.3.1 API的统一处理

每个产品线对于API的约束都不一样，CSSP的产品线针对前端的现有的约束，进行了下列统一处理。

一、`request payload`，`form data`：CSSP的产品线支持form data格式的post请求，所有在创建axios实例的时候进行了以下处理：

```js
// 创建axios实例
let service = axios.create({
    transformRequest: [function (data) {
        if (!data) {
            return;
        }
        // 将数据从json对象，转换成form data的形式
        let rs = [];
        Object.keys(data).forEach((key) => {
            rs.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&');
        });
        return rs.join('').slice(0, -1);
    }]
});
```

二、生产环境中，需要将url中的/api 去除掉：后端提供的接口本不是以API开头，但是为了增加后续的扩展性，都加了一个`/api`的前缀。那么问题来了，多余的前缀怎么去掉呢？

* 开发环境：devServer的 `pathRewrite`配置选项能够去掉。

* 生产环境：新增了一个请求拦截器，具体代码如下。

  ```js
  service.interceptors.request.use((config) => {
  
      // 生产环境中，需要将url中的/api 去除掉
      config.url = process.env.NODE_ENV === 'production' ?
          config.url.replace(/^\/api/, '') :
          config.url;
      return config;
  }, (error) => {
      return Promise.reject(error);
  });
  
  ```

三、接口的对错：一个请求在正常情况下只有状态码是4xx，5xx才会被认为是错误的，那么CSSP这边的约定是根据返回内容中的success字段来标识成功或者失败。所有统一处理中加入了下列代码。

```js
service.interceptors.response.use((response) => {
    if (typeof response.data === 'object' && !response.data.success) {
        return Promise.reject(response);
    }
    return response;
}, (error) => {
    return Promise.reject(error);
});
```

四、**如果后续有统一处理的请求的需求，请在这个文件里面添加**。

#### 2.3.2 API封装的结构

CSSP的接口是根据`URL` +` action`字段分发，其余参数统一放在`params`字段中，且`params`字段必须是一个字符串（使用JSON.stringify()）转化。这样用着是很难受，但是提供的物料就是这样的。

有些特别的API没有遵循这个规则，需要注意。如：登录。

接口定义必须使用严格区分`GET`，`POST`，接口的参数如果有，只能为`payload`，接口的封装中不能对参数进行任何处理。示例如下：

```js
// GET 示例
export function loadCollectors(payload) {
    return axios({
        url: '/api/collector/',
        method: 'get',
        params: { // 注意这里的key是params
            action: 'get_all_collector',
            params: JSON.stringify(payload)
        }
    });
};

// POST 示例
export function addCollector(payload) {
    return axios({
        url: '/api/collector/',
        method: 'post',
        data: { // 注意这里的key是data
            action: 'add_collector',
            params: JSON.stringify(payload)
        }
    });
};

// 没有 参数的示例
export function loadUsers() {
    return axios({
        url: '/api/collector/',
        method: 'get',
        params: {
            action: 'get_all_collector'
        }
    });
};
```

#### 2.3.3 API返回的结构

正常情况下，后端的返回结构如下：

```js
{
	"success": true, // 请求是否成功
    "mesg": "", // 错误信息，如果请求失败。默认情况下要把这个错误爆出来
    "data": "", // 内容荷载，业务中需要的都在这个里面
    "total": 0 // 如果请求的是数组，这个表示内容总数，一般用于分页
}
```



#### 2.3.4 API命名规范

接口最佳理想的情况是按照REST命名风格来，但是接口的命名必须符合下列四中情况：

* 动词，如：login，logout，enable，disable；
* 修饰词 + 动词，如：preLogin，quickLogout，slowLogout；
* 动词 + 名词：enableCollertor，disabledCollertor;
* 类型词 + 名词，如：addCollerctor，updateCollector，且类型词只能是以下几种：
  * add：表示新增类型；
  * load：表示获取类型，如果获取的是一个列表，名词必须为复数。如loadUsers；
  * update：表示更新类型：比如说编辑；
  * remove：表示删除类型；
  * 多种类型，如一个接口既可以新增，又可以编辑：addOrUpdateCollerctor；



#### 2.3.5 API的注释规范

每一个API，都需要有注释。格式参照[JSdoc3](https://www.css88.com/doc/jsdoc/tags-param.html)标准。为什么要这么使用：

1. 国际标准，无歧义；
2. 便于后期，以及他人维护；
3. 便于自动化工具进行识别；

示例如下：

```js
/**
 * 新增采集器
 * 
 * @param {object} payload
 * @param {string} payload.name - 采集器的名称
 * @param {string} payload._type - 采集器的类型
 * @param {string} [payload.username] - 采集器新增需要的用户名
 * @param {string} [payload.password] - 采集器新增需要密码
 * @returns {object} data- 新增采集器内容 // 对返回中的data进行描述
 */
export function addCollector(payload) {
    return axios({
        url: '/api/collector/',
        method: 'post',
        data: { // 注意这里的key是data
            action: 'add_collector',
            params: JSON.stringify(payload)
        }
    });
};

/**
 * 获取采集器的列表
 * 
 * @param {object} payload
 * @param {string} payload.page - 分页内容
 * @param {string} payload.page_num - 每一页多少条数据
 * @returns {array} data - 采集器的列表
 * @returns {string} data[].name - 采集器名称
 * @returns {string} data[].id - 采集器id
 * @returns {boolean} data[].enable - 采集器是否启用
 */
export function addCollector(payload) {
    return axios({
        url: '/api/collector/',
        method: 'post',
        data: { // 注意这里的key是data
            action: 'add_collector',
            params: JSON.stringify(payload)
        }
    });
};
```



### 2.4 CSS

CSS是前端开发中，较为简单，同时也是容易被忽略的一环。

CSS 没有模块化，规则种类丰富的特性，让我们在书写或者维护时经常感到困惑。根据公司的环境以及业界的经验，制定了下列规则。

#### 2.4.1 给业务组件根节点套上wapper

给所有组件的根节点加上wapper的后缀。加上后缀的好处就是，可以让人一眼就识别到样式是一个组件的根节点，并且可以用这个标记作为命名空间。

```html
<template>
    <div class="tree-wrapper"></div>
</template>
```

那，如果有两个tree组件怎么办？此时应该给组件加上一个更加具体的前缀。

```html
<template>
    <div class="left-tree-wrapper"></div>
</template>

<template>
    <div class="form-tree-wrapper"></div>
</template>
```

#### 2.4.2 给功能组件加上 sf 前缀

非业务型，通用的组件应该加上sf前缀。这种组件应该会很少 ，并且这些组件应该是应该被添加的组件库中的。加上这个前缀可以让人快速识别。

```html
<template>
    <div class="sf-input"></div>
</template>
```

#### 2.4.3 使用BEM 而不是 scoped

scoped是一个很好的东西，他可以让解决CSS命名空间的问题，但是却有一些缺陷：
1. scoped实现的原理是在dom上和ccs规则里添加额外的属性。会导致打包的大小变大。
2. scoped不是未来标准，也不是业界通用。

所以在本项目中必须使用BEM命名。BEM的目的不仅仅隔绝作用域，他能够让人一看到这个css类名就能够准备的猜到这个类的作用。

具有极高的可维护性。

#### 2.4.4 使用cssnext 以及变量

在CSS开发中，尽量使用变量进行开发。通过修改postcss变量的值，使得样式具有可维护性。尤其是当网站样式需要整体更改样式的时候。

并且，在视觉在做图的时候，也会出现经常没有使用规范中的颜色的情况，这个时候如果直接使用变量就可以排除这些干扰。具体使用方式如下。
```css
<style lang="postcss">
/* 修改了项目中postcss的配置文件，可以使用这种绝对路径的形式， */
@import "src/common/assets/css/var.css";
.foo {
    color: var(--primary-color);
}
</style>
```

#### 2.4.5 尽量减少嵌套层数

在BEM的开发模式下，并不太需要依靠嵌套关系来隔绝样式的作用于。这个时候我们应该尽量不要嵌套，从而降低打包后文件体积的大小。

```css

/* 错误的做法 */
.toolbar-wrapper {
    & .toolbar__query {
        & .toolbar__query--disable {}
    }
}

/* 正确的做法 */
.toolbar-wrapper {
    & .toolbar__query {}
    & .toolbar__query--disable {}
}
```

## 3 templates

### 3.1 弹窗

#### 3.1.1 基本弹窗

所有的弹窗都必须独立成一个，无论