# sdp-ui

## Contents

```shell

├── README.md
├── babel.config.js
├── config.js
├── package.json
├── postcss.config.js
├── public # 直接静态资源
│   ├── favicon.ico
│   ├── index.html
│   └── login.html
├── src
│   ├── api # 接口模块
│   ├── assets # 全局资源
│   │   └── logo.png
│   ├── components # 全局公用组件
│   │   └── svg # 全局SvgIcon组件
│   │       ├── index.js
│   │       └── svg.vue
│   ├── i18n # 国际化
│   ├── lib # 第三方库，（非NPM）
│   ├── page_index # 首页
│   │   ├── app.vue # 主组件
│   │   ├── components # 页面级别公共组件，以此类推。模块层级公用就在模块层级公用
│   │   ├── index.js # 入口文件
│   │   ├── mixins # 全局vue mixins 文件（页面界别，跨模块）同components
│   │   ├── router # 路由模块
│   │   │   └── index.js
│   │   ├── store # vuex 模块
│   │   │   └── index.js
│   │   ├── style # 全局样式
│   │   └── views # 业务逻辑存放位置（视图）
│   │       └── mod_index # 首页模块
│   ├── page_login # 登录页
│   │   ├── index.js
│   │   └── login.css
│   ├── utils # 工具目录
│   └── validation # 校验目录
├── tree.md
└── vue.config.js
```

## Dev

### step 1

```shell
npm i # 安装项目依赖
```

### step 2

修改项目整体配置文件config.js，调整到合适的状态。config.js 会有详细的说明。

### step 3

```shell
npm run serve # 开启服务
npm run mock # 开启mock服务，需要再起一个命令行
```

## 项目规范

### API模块规范定义

API的定义只是对后端提供接口的封装，并不是真正写了一个接口。

API是前后端沟通唯一的通道，为了进行统一处理，所有API抽离单独定义，并采用通道透传，语义话的的理念。所有API定义的文件放在`src/api`目录下面。`src/utils/axios`为axios对象导出，和统一化处理文件，不能在里面定义接口。其余的以模块区分，一个模块一个文件。

#### API的统一处理

统一处理主要分为两种：

* 请求拦截器，定义在`src/utils/axios` 的`service.interceptors.request.use`函数中。其实现功能如下：
   1. 从cookie中读取token，放入http请求的头部。
* 响应拦截器，定义在`src/utils/axios` 的`service.interceptors.response.use`函数中。其实现的功能如下：
   1. 判断请求返回的结果是不是`object`，如果不是当错请求出错。**报服务器错误**
   2. 判断请求返回的结果中`code`是否为`0`，如果不是当做请求出错。**报后端返回的错误信息**
   3. 判断请求的 `status code`是否为`401`，如果不是表明登录失效，跳转到登录页。

```python
def foo as
```



#### API 前后端格式定义

```json
{
  code: 0, // 非0，表示请求出错
  msg: ''，// 如果请求出错，返回
  data: {} // 返回的数据
}
```

#### API命名规范

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



#### API 注释规范

每一个API，都需要有注释。格式参照[JSdoc3](https://www.css88.com/doc/jsdoc/tags-param.html)标准。为什么要这么使用：

1. 国际标准，无歧义；

2. 便于后期，以及他人维护；

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
        data: payload
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
        url: '/api/collector/list',
        method: 'get',
      	params: payload
    });
};
```



### 状态管理规范定义

状态管理统一使用vuex进行状态管理，业务代码必须要注册vuex模块，不能够写全局vuex。全局的功能才能写成这个。

如果要新增一个vuex模块，步骤如下：

1. store/modules目录下面新增一个文件foo.js(foo为模块名)

2. foo.js示例

   ```js
   export default {
       namespaced: true, // 所有模块的vuex必须的，可以隔绝作用域
       state: {
           group: {}
       },
       getters: {
           group: state => state.group
       },
       mutations: { // 同步的方法
           editGroup (state, payload) {
   
               // 把需要编辑的用户组信息放在state上面，让编辑的组件使用
               state.group = payload;
           },
       },
   
       // actions 是存在异步的情况下使用，没有这种情况就不要使用
       actions: {
   
       }
   };
   
   ```

3. 在store/index.js 中注册模块

4. 在组件中使用 createNamespacedHelpers 函数

   ```js
   import { createNamespacedHelpers } from 'vuex';
   let {
       mapState,
       mapGetters,
       mapMutations,
       mapActions
   } = createNamespacedHelpers('注册的模块名');
   
   // 在组件中愉快的使用了
   ```

   

### 组件通信规范定义

​	所有的组件的通信需要区分两种情况：

1. 持久化通信：统一使用vuex进行状态管理
2. 瞬时性通信：
   1. $emit
   2. Event Bus：Event Bus 的事件名称统一在Bus文件中定义，参照已经写好的内容即可。

### CSS样式模块规范定义

#### 整体约束

​	所有css使用了postcss的插件postcss-preset-env，没有使用less sass 等预编译器。插件使用了未来即将到来的css语法，可以理解成为css的babel。所以可以使用很多新的特性，比如嵌套，变量等。目前项目开启的是stage0的所有正在提案中的语法都会被支持。

> [Postcss-preset-env](https://preset-env.cssdb.org/features)

除此之外还有以下约定：

1. 能够抽离成变量的就抽离成变量，变量统一放在`style/var.css`里面，命名使用`短横线`连接。
2. 全局样式统一放在`style/global.css`。
3. 覆盖组件样式或者第三方组件样式统一放在`style/overwrite.css`中。
4. 样式规范整体与公司checklist保持一致，除此之外多了如下约定：
   1. 禁用scoped，在需要将体积优化到极致时，这是一个非常好的决定。
   2. 使用BEM命名，或者使用CSS MODULE。CSS 命名冲突是一个非常头痛的问题，因为CSS本身没有namespace。BEM是一个简单的约束方案，比较简单。同时CSS MODULE是一个很好的解决方案，但是目前的接受程度不是很高。项目中二选1即可。

#### 组件的样式

​	当没有使用CSS MODULE时，组件的所有样式都必须以组件名为命名空间，举个例子：

```html
// foo.vue
<template>
<div class="foo-wrapper">
</div>
</template>

<style>
.foo-wrapper {
  & .bar {}
  
  & .baz {}
}
</style>
```
