<template>
    <section 
        v-loading.fullscreen="isLoading"
        :element-loading-text="loadingText"
        class="page-external-storage__wrapper query">
        <lang class="query__title">
            储存方式：NFS（NFSv4及其以上版本）
        </lang>
        <popover :width="300">
            <p>{{ hintText }}</p>
        </popover>
        <el-form 
            ref="form"
            v-model="formValid"
            :model="form"
            :rules="formRules">
            <div class="query__content">
                <div class="form">
                    <label class="form__label">
                        <lang>IP地址</lang>
                    </label>
                    <div class="form__content">
                        <el-form-item prop="ip">
                            <el-input 
                                v-model="form.ip"
                                :disabled="disableInput"
                                :placeholder="_('请输入IP')" />
                        </el-form-item>
                    </div>
                </div>
                <div class="form">
                    <label class="form__label">
                        <lang>路径</lang>
                    </label>
                    <div class="form__content flex">
                        <el-form-item 
                            class="speed-test__row" 
                            prop="path">
                            <el-input 
                                v-model="form.path"
                                :disabled="disableInput"
                                :placeholder="_('请输入路径')" />
                        </el-form-item>
                    </div>
                </div>
            </div>
        </el-form>
        <el-button
            v-if="showMountBtn"
            type="primary" 
            :disabled="!formValid || isLoading"
            @click="handleMount">
            <lang>挂载</lang>
        </el-button>
        <el-button
            v-if="showUnMountBtn"
            type="primary"
            :disabled="isLoading"
            @click="handleUnload">
            <lang>卸载</lang>
        </el-button>
        <p 
            v-if="showErrorInfo"
            class="error-info">
            <lang class="error-info__info">
                {{ errorText }}
            </lang>
            <el-button
                v-if="showMountRetryBtn"
                class="text-btn"
                type="text"
                :disabled="!formValid || isLoading"
                @click="handleMount">
                <lang>重新挂载</lang>
            </el-button>
            <el-button
                v-if="showUnMountRetryBtn"
                class="text-btn"
                type="text"
                :disabled="isLoading"
                @click="handleUnload">
                <lang>重试</lang>
            </el-button>
            <el-button
                v-if="showCancelBtn"
                class="text-btn"
                type="text"
                :disabled="isLoading"
                @click="handleUnload">
                <lang>取消</lang>
            </el-button>
        </p>
    </section>
</template>
<script>

/**
 * @file 外置存储页面
 */

import popover from 'src/common/components/form_tips/popover';
import rules from './rules';
import { mountNFS, unloadNFS } from 'src/common/api/external_storage';
import { mapGetters, mapActions } from 'vuex';

export default {
    components: {
        popover
    },
    data () {
        return {
            formRules: rules,
            form: {
                ip: '',
                path: ''
            },
            formValid: false,
            submiting: false
        };
    },
    computed: {
        ...mapGetters([
            'nfsIsMounting', 
            'nfsIsUnloading', 
            'nfsIsError',
            'nfsMountFailed',
            'nfsUnloadFaild',
            'nfsMounted',
            'nfsUnloaded',
            'nfsErrMsg',
            'nfsInfo'
        ]),
        isLoading () {
            return this.nfsIsMounting || this.nfsIsUnloading || this.submiting;
        },
        showMountBtn () {
            return this.nfsUnloaded ||
                this.nfsIsMounting;
        },
        showUnMountBtn () {
            return !this.nfsUnloaded && (
                this.nfsMounted ||
                this.nfsIsUnloading
            );
        },
        showErrorInfo () {
            return this.nfsMountFailed || this.nfsUnloadFaild || this.nfsIsError;
        },
        showMountRetryBtn () {
            return this.nfsMountFailed || this.nfsIsError;
        },
        showUnMountRetryBtn () {
            return this.nfsUnloadFaild;
        },
        showCancelBtn () {
            return this.nfsMountFailed || this.nfsIsError;
        },
        disableInput () {
            return !this.nfsUnloaded && (
                this.nfsMounted ||
                this.nfsIsUnloading ||
                this.nfsIsMounting ||
                this.nfsIsUnloading ||
                this.nfsUnloadFaild
            );
        },
        loadingText () {
            if (this.nfsIsMounting) {
                return _('挂载中...');
            }

            if (this.nfsIsUnloading) {
                return _('卸载中...');
            }

            return '';
        },
        errorText () {
            if (this.nfsIsError || this.nfsMountFailed) {
                return _('挂载失败：{0}', this.nfsErrMsg);
            }

            if (this.nfsUnloadFaild) {
                return _('卸载失败：{0}', this.nfsErrMsg);
            }

            return '';
        },
        hintText () {
            return (this.showMountBtn || this.showMountRetryBtn) ?
                _('挂载NFS后，已产生日志数据位于日志审计磁盘中无法查看，需查看请卸载NFS') :
                _('卸载NFS后，已产生日志数据位于NFS磁盘中无法查看，需查看请重新挂载NFS');
        }
    },
    watch: {
        nfsIsMounting (v, pre) {
            if (pre && !v && this.nfsMounted) {
                this.$message(_('挂载成功，正在使用外置存储'));
            }
        },
        nfsIsUnloading (v, pre) {
            if (pre && !v && this.nfsUnloaded) {
                this.$message(_('卸载成功'));
            }
        },
        nfsInfo () {
            this._initForm();
        },
        form: {
            deep: true,
            handler (v) {
                if (v.ip && v.path) {
                    this.$refs.form && this.$refs.form.validate();
                }
            }
        }
    },
    mounted () {
        this._initForm();
    },
    methods: {
        ...mapActions(['updateNFSStatus']),
        _initForm () {
            let formerFormVal = {
                ip: this.form.ip,
                path: this.form.path
            };

            this.form = {
                ip: this.nfsInfo.ip ? this.nfsInfo.ip : '',
                path: this.nfsInfo.path ? this.nfsInfo.path : ''
            };

            if (!this.form.ip && !this.form.path && (formerFormVal.ip || formerFormVal.path)) {
                this.$refs.form.validate();
                this.$nextTick(() => {
                    this.$refs.form && this.$refs.form.resetFields();
                });
            }
        },
        handleMountBtnClick () {
            this.nfsUnloaded ?
                this.handleMount() :
                this.handleUnload();
        },
        async _mountNFS () {
            if (!this.formValid || this.isLoading) {
                return;
            }

            this.submiting = true;
            try {
                await mountNFS(this.form);
                await this.updateNFSStatus();
            } catch (err) {
                this.$error(err.data && err.data.mesg || _('挂载失败'));
            }
            this.submiting = false;
        },
        async handleMount () {
            this.$confirm(
                _('挂载后会清理掉NFS超过时限和超过磁盘占比的日志'), 
                _('确定要挂载吗？'), 
                {
                    type: 'warning'
                }
            ).then(() => {
                this._mountNFS();
            }).catch(() => {});
        },
        async handleUnload () {
            if (this.isLoading) {
                return;
            }

            this.submiting = true;
            try {
                await unloadNFS();
                await this.updateNFSStatus();
            } catch (err) {
                this.$error(err.data && err.data.mesg || _('卸载失败'));
            }
            this.submiting = false;
        }
    }
};
</script>
<style lang="postcss">
.page-external-storage__wrapper {
    height: 100%;

    & .flex {
        display: flex;
        justify-content: stretch;
        align-items: center;
    }
    & .speed-test__row {
        flex-grow: 1;
    }
    & .error-info {
        display: inline-block;
        margin-left: 12px;
        font-size: 12px;
        color: #d4453d;

        & .error-info__info {
            margin-right: 16px;
        }

        & .text-btn {
            color: #209797;

            &:hover,
            &:focus,
            &:active {
                color: #4DCDCD;
            }

            &.is-disabled {
                color: #CCC;
                cursor: not-allowed;
                background-image: none;
                border-color: #ddd;
                text-shadow: 0 1px 0 #FFF;
            }
        }
    }
}
</style>
