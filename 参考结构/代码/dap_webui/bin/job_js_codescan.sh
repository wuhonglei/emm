#!/bin/bash
codescan update
codescan init 
codescan config -p token=e3678d1496895ab9980be538535fb879  #每个新仓库都需要修改
#全局安装js插件
npm i @sxf/replace-pkg-vars @sxf/report-info  -g  --registry http://200.200.151.86:7001/
npm install -g eslint --registry http://200.200.151.86:7001/
#添加js扫描模块
codescan add .
codescan config -m . language=js
rm -rf package-lock.json
npm install --registry http://200.200.151.86:7001/
if [ s$codescan_all = s"true" ];then codescan scan --eslint --all ;else codescan scan --eslint ;fi  #默认增量扫描
