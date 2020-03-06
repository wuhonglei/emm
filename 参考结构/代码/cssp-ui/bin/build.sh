# 后台调用前端打包脚本

# 如果出现内部npm 服务器的问题，可以加上exit 0，跳过前台打包。然后手动升级前台包
set -e
set -x
curr_path=`pwd`
# source ~/.bashrc

source /sf/.bash_profile
cd $curr_path
cd ..
# 清理 && 准备环境
nvm use 8.11.4
rm dist/ -rf
# nvm use v6.10.1
npm config set registry http://200.200.151.86:7001/

# TODO 将npm 换成yarn提高依赖安装速度
# 安装依赖
npm install

# 打包文件
npm run build

# 移动文件
cp -rf ./dist/* ../static/
cp -rf ./dist/*.html ../../../../lib/python2.7/site-packages/django/contrib/auth/templates/

# 清理残留
# 修改TD 88301，清理打包残留git文件
# 清理文件
function rmfile(){
    if [ -f "$1" ];then
        rm -rf ./$1
    fi
}
# 清理目录
function rmdir(){
    if [ -d "$1" ];then
        rm -rf ./$1
    fi
}

rmfile .gitignore
rmfile __mock__/.gitkeep
rmfile src/common/assets/.gitkeep
rmfile src/common/components/.gitkeep
rmfile src/common/lib/.gitkeep
rmfile src/utils/.gitkeep

rmdir node_modules