<template>
    <div class="login-page-wrap">
        <div class="login-page">
            <div class="login-page-body">
                <div class="main">
                    <div class="logo"></div>
                    <div class="content">
                        <div class="marketing">
                            <div class="marketing-body">
                                <div class="marketing-tel">
                                    <p class="call">
                                        售后服务：400-630-6430
                                    </p>
                                </div>
                                <div class="marketing-img-group">
                                    <!-- left  -->
                                    <div class="float fn-left"> 
                                        <div class="no1">
                                            <div class="cards"
                                                 idx="0"
                                                 ptr="3">
                                                <a class="cards-link"
                                                   target="_blank">
                                                    <img src="./img/markeking/left_01.png">
                                                    <span class="cards-text">技术服务热线</span>
                                                </a>
                                                <div class="ldc"
                                                     style="display: block;">
                                                    加载中…
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- right -->
                                    <div class="float fn-left">
                                        <div class="img-group img-group-top">
                                            <div class="empty-box"></div>
                                            <div class="cards"
                                                 idx="0"
                                                 ptr="4">
                                                <a class="cards-link"
                                                   target="_blank">
                                                    <img src="./img/markeking/right_t_01.jpg">
                                                    <span class="cards-text">深信服技术服务社区</span>
                                                </a>
                                                <div class="ldc"
                                                     style="display: block;">
                                                    加载中…
                                                </div>
                                            </div>
                                        </div>
                               
                                        <div class="img-group img-group-bottom">
                                            <div class="cards"
                                                 idx="0"
                                                 ptr="5">
                                                <a class="cards-link"
                                                   target="_blank">
                                                    <img src="./img/markeking/right_b_01.png">
                                                    <span class="cards-text">感谢使用深信服产品</span>
                                                </a>
                                                <div class="ldc"
                                                     style="display: block;">
                                                    加载中…
                                                </div>
                                            </div>
                                            <div class="empty-box"></div>
                                        </div>
                                    </div>
                             
                                    <!--  -->
                                </div>
                            </div>
                        </div>
                        <!-- end  -->

                        <!--  start login -->
                        <login-form class="m-login" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

/**
 * 登录界面
 */

import loginForm from './form';

export default {
    name: 'Login',
    components:{
        loginForm
    },
    
    data () {
        return {
            username: '',
            password: '',
            errMsg: '',
            csspName: '安全服务平台',
            logoUrl: '',
            isLogin: false,
            btnText: '登 录'
        };
    },
    mounted () {
       

    },
    methods: {
       
    }
};
</script>
<style lang="postcss">
.fn-left {
    float:left;
}
.fn-right {
    float: right;
}


.login-page-wrap {
    margin: 0px;
    color: #333;
    font-size: 12px;
    font-family: "Microsoft Yahei", "SimSun", Verdana, Geneva, sans-serif;
}
.login-page{
    min-width: 1280px;
    height: 100vh;
    background: #4786C7 url(img/bg.png) no-repeat;
    position: relative;
}
.login-page-body {
    width: 1280px;
    height: 631px;
    background: url(img/map.png) no-repeat;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -315px;
    margin-left: -640px;
    & .main{
        width: 1000px;
        height: 480px;
        margin: 75px 0 0 140px;
       
    }
    & .logo {
        background: url(img/logo.png) no-repeat;
        height: 60px;
        margin-bottom: 15px;
    }
    & .content{
        width: 100%;
        height: 373px;
    }
    & .marketing {
        box-sizing: border-box;
        position: relative;
        float: left;
        width: 608px;
        height: 373px;
        background-color: rgba(255, 255, 255, 0.8);
        & .marketing-body {
            padding: 40px 0 0 40px;
        }
    }
    & .marketing-tel .call{
        color: #777;
        height: 16px;
        line-height: 16px;
        margin-bottom: 10px;
        font-family: Gotham, "Helvetica Neue", Helvetica, Arial, sans-serif;
    }
    & .marketing-img-group {
        color:#fff;
        & img { 
            border: none ;
        }
    }
    & .img-group-top { 
        height: 128px; 
        margin-bottom: 4px ;
        & .empty-box{ 
            background-color: #66BC29; 
            margin-right: 4px; 
        }
    }
    & .img-group-bottom { 
        height: 128px; 
        & .empty-box { 
            background-color: #0D4C99;
             margin-left: 4px; 
        }
    }
    & .empty-box { 
        float: left;
        width: 128px; 
        height: 128px; 
        
    }
    
}
.img-group .cards-link, 
.img-group .cards { width: 260px; height: 128px; float: left; }
.cards { 
    position: relative; 
    z-index: 0; 
    overflow: hidden; 
    background-color: #C7DCED ;
}
.cards:hover .cards-text {
    display: block;
    opacity: .6;
}

.cards .cards-link { 
    position: absolute; 
    display: block; 
    z-index: 9; 
    color: #FFF; 
    text-decoration: none; 
    overflow: hidden ;
}
.marketing-img-group .cards-text { 
    display: block; 
    position: absolute;
    bottom: 0; 
    left: 0;
    height: 30px; 
    line-height: 30px;
    background-color: #003592; 
    width: 100%; 
    text-indent: 5px;
    opacity: 0;
}
.ldc { position: absolute; bottom: 10px; right: 10px; text-align: center; z-index: 1; background: #C7DCED; color: #666; }

.no1 { width: 144px; height: 260px; margin-right: 4px; }
.no1 a, .no1 .cards { width: 144px; height: 260px; }

/* end markeking */

.login-page-body .m-login {
    box-sizing: border-box;
    position: relative;
    float: right;
    width: 392px;
    height: 373px;
    background-color: #F6F9FC;
}
</style>
