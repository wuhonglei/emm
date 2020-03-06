<template>
    <el-dialog
        :visible.sync="visible"
        custom-class="ftp-config-dialog-wrapper"
        title="配置FTP服务器">
        <el-form
            v-model="formValid"
            v-loading="loading"
            :model="params"
            :rules="rules">
            <div class="query__content">
                <div class="form">
                    <div class="form__label">
                        IP地址
                    </div>
                    <div class="form__content"> 
                        <el-form-item prop="ip">
                            <el-input v-model="params.ip" />
                        </el-form-item>
                    </div>
                </div>
                <div class="form">
                    <div class="form__label">
                        备份目录
                    </div>
                    <div class="form__content">
                        <el-form-item prop="dir">
                            <el-input v-model="params.dir" />
                        </el-form-item>
                    </div>
                </div>
                <div class="form">
                    <div class="form__label">
                        账号
                    </div>
                    <div class="form__content">
                        <el-form-item prop="user">
                            <el-input v-model="params.user" />
                        </el-form-item>
                    </div>
                </div>
                <div class="form">
                    <div class="form__label">
                        密码
                    </div>
                    <div class="form__content">
                        <el-form-item
                            prop="pwd"
                            :style="{display:'inline-block', width:'300px'}">
                            <el-input
                                v-model="params.pwd"
                                type="password" />
                        </el-form-item>
                        <div class="form__split"></div>
                        <el-button
                            size="small"
                            :disabled="!formValid"
                            type="primary"
                            @click="testLinked">
                            测试连通性
                        </el-button>
                    </div>
                </div>
            </div>
        </el-form>
        <span slot="footer">
            <el-button
                type="primary"
                :disabled="!formValid || loading"
                @click="submit">确定</el-button>
            <el-button
                :disabled="loading"
                @click="visible=false">取消</el-button>
        </span>
    </el-dialog>
</template>
<script>

/**
 * ftp配置
 */

import { testFtp, updateBackupConfig } from 'src/common/api/manage';
import rules from './rules';
export default {
    props: {
        defaultParams: {
            type: Object,
            default () {
                return {
                    dir: '',
                    ip: '',
                    pwd: '',
                    user: ''
                };
            }
        },
        backPolicy: {
            type: Object,
            default () {
                return {
                    week: 0,
                    time: ''
                };
            }
        }
    },
    data () {
        return {
            params: {
                dir: '',
                ip: '',
                pwd: '',
                user: ''
            },
            loading: false,
            formValid: false,
            visible: false,
            rules
        };
    },

    methods: {
        testLinked () {
            this.loading = true;
            testFtp(this.params)
                .then(() => {
                    this.$message({
                        type: 'success',
                        message: 'FTP服务器连通成功'
                    });
                })
                .catch((err) => {
                    this.$error(err, 'FTP服务器连通失败');
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        submit () {
            let params = {
                back_policy: this.backPolicy,
                ftp_param: this.params
            };
            this.loading = true;
            updateBackupConfig(params)
                .then(() => {
                    this.visible = false;

                    //  提交成功要通知父组件改变参数
                    this.$emit('success', params.ftp_param);
                    this.$message({
                        type: 'success',
                        message: '提交成功'
                    });
                    this.$emit('load-ftp-config');
                })
                .catch((err) => {
                    this.$error(err, '提交失败');
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        initParams () {
            Object.keys(this.defaultParams).forEach(key => {
                this.params[key] = this.defaultParams[key];
            });
            if (this.params.dir && this.params.ip && this.params.pwd && this.params.user) {
                this.formValid = true;
            }
        },
        
        show () {
            this.initParams();
            this.visible = true;
        }
    }
    
};
</script>
<style lang="postcss">
.ftp-config-dialog-wrapper {
    width: 550px;
    & .el-dialog__body {
        padding: 15px 15px;
    }
}
</style>
