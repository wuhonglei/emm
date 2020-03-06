/**
 * gulp 
 */

let gulp = require('gulp');
let sftp = require('gulp-sftp');
let serverConfig = require('./config');

// 部署到服务器
gulp.task('service-deploy', [
    'service-deploy-static',
    'service-deploy-template'
]);

gulp.task('service-deploy-static', () => {
    gulp.src(['dist/**/*', '!dist/*.html'])
        .pipe(sftp({
            host: serverConfig.host,
            user: serverConfig.ssh.user,
            port: serverConfig.ssh.port,
            pass: serverConfig.ssh.password,
            remotePath: serverConfig.ssh.staticPath
        }));
});

gulp.task('service-deploy-template', () => {
    gulp.src('dist/*.html')
        .pipe(sftp({
            host: serverConfig.host,
            user: serverConfig.ssh.user,
            port: serverConfig.ssh.port,
            pass: serverConfig.ssh.password,
            remotePath: serverConfig.ssh.templatePath
        }));
});