#   公用组件使用文档

##  **<code>tableDetail</code>**
>   用于悬浮显示表格行详细信息

### 参数
+   <code>configures(Array)</code>:配置项，控制各项显示顺序、样式；示例：
    ```javascript
        const TABLE_DETAILS = [
            { key: 'time', name: '时间' },
            { key: 'attack_type', name: '类型' },
            { key: 'protocol', name: '协议' },
            { key: 'method_name', name: '方法' },
            /* ... */
            { 
                key: 'level', 
                name: '严重等级', 

                //  使用computed根据数据计算样式
                computed(data) {
                    let level = data.level_eng;
                    return {
                        color: level === 'HIGH' ? '#EE5555' : (level === 'MIDDLE' ? '#FF9900' : '#4d8dd9')
                    };
                }
            },
            { 
                key: 'net_action', 
                name: '动作',
                style: {
                    /**
                     *  直接使用style控制样式
                    */
                }
            }
        ];
    ```
+   <code>detailData(Object)</code>:数据;
+   <code>index(Number)</code>:序号;

##  **<code>dataPackage<code>**
>   用于显示数据包的组件

### 参数
+   <code>data(Object)</code>:数据;
+   <code>items(Array)</code>:中间需要显示的数据项;示例：

    ```javascript
    [['time', '时间'], ['dst_ip', '目的IP'],['src_ip', '源IP'], ['url', '目的URL']]
    ```
+   <code>index(Number)</code>序号;