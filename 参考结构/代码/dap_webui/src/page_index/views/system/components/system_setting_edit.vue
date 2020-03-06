<template>
    <div class="system-set-edit-wrapper">
        <sf-form
            ref="form"
            :label-width="70"
            label-align="left">
            <sf-form-item>
                <sf-fieldlabel :show-required="true">
                    IP地址
                </sf-fieldlabel>
                <sf-textfield
                    ref="ip"
                    v-model="params.ip"
                    :default-width="300"
                    :allow-blank="false"
                    :validator="checkIp"
                    placeholder="请输入IP地址" />
            </sf-form-item>
            <sf-form-item>
                <sf-fieldlabel>
                    描述
                </sf-fieldlabel>
                <sf-textfield
                    ref="note"
                    v-model="params.note"
                    :max-length="64"
                    :default-width="300"
                    placeholder="请输入描述" />
            </sf-form-item>
        </sf-form>
    </div>
</template>

<script>

/**
 * 系统设置修改与新增
 **/

const IPV4 = /^(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])){3}$/;

export default {

    data () {
        return {
            params: {
                ip: '',
                note: ''
            }
        };
    },
    methods: {
        getJsonValue () {
            return this.params;
        },
        checkIp () {
            let v4numbers = this.parseIPv4(this.params.ip),
                firstLen = 255;
            if (!v4numbers) {
                return _('不符合IPv4格式');
            }

            if (v4numbers[0] === 0 || v4numbers[0] === firstLen) {
                return _('IP首位必须为0-255之间的任一数字');
            }
            this.$refs.ip.clearInvalid();
            return true;
        },
        parseIPv4 (ip) {

            // 校验IPV4格式
            let v4parts,
                v4numbers,
                i;
            if (!IPV4.test(ip)) {
                return false;
            }

            // 解析IPv4为4个数字
            v4parts = ip.split('.');
            v4numbers = [];
            for (i = 0; i < v4parts.length; i++) {
                v4numbers.push(parseInt(v4parts[i], 10));
            }
            return v4numbers;
        }
    }
};
</script>
