<template>
    <div>
        <span style="float: left">{{ label || data.name|uuidIp(data.ip) }}</span>
        <el-tooltip
            v-if="data.is_del"
            placement="top">
            <el-tag
                style="float: right"
                type="gray">
                已删除
            </el-tag>
            <p slot="content">
                <lang>设备已脱离纳管，数据将不再更新</lang>
            </p>
        </el-tooltip>
    </div>
</template>

<script>

/**
 * 
 */

export default {
    filters: {
        uuidIp (uuid = '未知数据源', ip = '未知IP') {
            return `${uuid}(${ip})`;
        }
    },
    props: {
        data: {
            type: Object,
            required: true
        },
        label: {
            type: String,
            default () {
                return '';
            }
        }
    }
};
</script>
