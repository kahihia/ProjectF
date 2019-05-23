<template>
  <div id="Login">
    <div class="logo_box">
      <img src="./images/ifind_logo.png">
    </div>
    <div class="inputGroup" v-for="(item,index) in input_g">
      <div class="input_title">{{item.input_title}}</div>
      <div class="input_inline">
        <input class="input_cont" v-if="item.btn_show" v-model="phoneNum" type="text" :placeholder="item.place_str">
        <input class="input_cont" v-else v-model="verificationCode" type="text" :placeholder="item.place_str">
        <button v-if="item.btn_show && sendMsgDisabled">{{time+'s'}}</button>
        <button v-if="item.btn_show &&!sendMsgDisabled" @click="sendVC">获取验证码</button>
      </div>
    </div>
    <button class="loginBtn" @click="submitLogin">登陆</button>
    <!--提示信息-->
    <toast class="toastMsg" position="middle" v-model="showToast" width="20em" :time="1000" type="text">{{showMsg}}</toast>
    <div class="audit" v-transfer-dom>
      <alert v-model="alert_show">{{alert_text}}</alert>
    </div>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import {formatDateTime} from '@/utils/format'
  import {GetQueryString} from '@/utils/utils'
  import {XButton, Toast} from 'vux'
  import {setLocalData,getLocalData} from '@/utils/storages'
  import { Alert,TransferDomDirective as TransferDom} from 'vux';
  export default {
    name: "images",
    components: {XButton,Toast,Alert},
    directives: {TransferDom},
    data() {
      return {
        time: 60,//发送验证码倒计时
        sendMsgDisabled: false,//验证码按钮
        phoneNum: null,//手机号
        verificationCode: '',//验证码
        showToast: false,//提示信息显示
        showMsg: '',//提示信息内容
        agreement: true,//协议选择
        input_g: [
          {input_title: '手机号', place_str: '请输入您的手机号', btn_show: true},
          {input_title: '验证码', place_str: '请输入您的验证码'}
        ],
        allow_send: true,//允许点击发送按钮
        alert_show: false,//允许点击发送按钮
        alert_text: '',//允许点击发送按钮
      }
    },
    methods: {
      sendVC() {//发送验证码
        this.$store.commit('updateLoadingStatus', {isLoading: true});
        let that = this;
          // 发送验证码参数
        let params = {phone: that.phoneNum, templId: 105642, timeStamp: formatDateTime(new Date())};
        let phone_reg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
        if (!that.phoneNum) {
          that.showToast = true;
          that.showMsg = "请输入手机号";
          this.$store.commit('updateLoadingStatus', {isLoading: false});
        } else {
          if (!phone_reg.test(that.phoneNum)) {
            that.showToast = true;
            that.showMsg = "请输入正确格式";
            this.$store.commit('updateLoadingStatus', {isLoading: false});
          } else {
            request.sendMsg(params).then((data) => {
              if (data.data.code == 200) {
                this.$store.commit('updateLoadingStatus', {isLoading: false});
                let interval = window.setInterval(function () {
                  if ((that.time--) <= 0) {
                    that.time = 60;
                    that.sendMsgDisabled = false;
                    window.clearInterval(interval);
                  }
                }, 1000);
                setTimeout(()=>{
                  that.allow_send = true;
                },60000);
                that.allow_send = false;
                that.sendMsgDisabled = true;
              }
            })
          }
        }
      },
      submitLogin() {
        let that = this;
        let source = GetQueryString("source");
        let params_cm_code = {
          phone: that.phoneNum,
          code: that.verificationCode,
          timeStamp: formatDateTime(new Date()),
        };
        let wx_position = getLocalData('position');
        // if(!wx_position){
        //   this.alert_show=true;
        //   this.alert_text='打开您的定位功能并同意获取地理位置信息以继续为你服务';
        //   that.$store.commit('updateLoadingStatus', {isLoading: false});
        // }else {
          if (!that.phoneNum || !that.verificationCode) {
            that.showToast = true;
            that.showMsg = "请输入手机号和验证码";
          } else {
            request.checkMobileCode(params_cm_code).then(data => {
              that.showToast = true;
              that.showMsg = data.data.message;
              if (data.data.code == 200) {
                if (!that.agreement) {
                  that.showToast = true;
                  that.showMsg = "同意最终用户协议"
                } else {
                  let log_params = {
                    phone: that.phoneNum,
                    login_type: 2,
                    timeStamp: formatDateTime(new Date()),

                    register_source:'wechat',
                    source:source
                  };
                  if(wx_position){
                    log_params.address_latitude=wx_position.position.lat;
                    log_params.address_longitude=wx_position.position.lng
                  }
                  request.login(log_params).then((res) => {
                    setLocalData('user_info', res.data.data);
                    if (res.data.code == 200) {
                      that.$router.push({
                        path: '/'
                      })
                    }else {
                      this.alert_show=true;
                      this.alert_text=res.data.message;
                    }
                  })
                }
              }
            });
          }
        // }
      },
      touristLogin() {
        var that = this;
        that.$router.push({
          path: "/index"
        })
      },
      checkArg() {
      }
    },
    mounted() {
      this.$store.commit('updateBottomNav', {showBottomNav: false})
    },
    destroyed() {
      this.$store.commit('updateBottomNav', {showBottomNav: true})
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/less/reset";

  #Login {
    width: 100%;
    min-height: 100%;
    background: url("./images/login_bg.png");
    .logo_box {
      text-align: center;
      padding: 123px 0 153px 0;
    }
    .inputGroup {
      width: 486px;
      margin: 0 auto;
      &:nth-of-type(2) {
        margin-bottom: 64px;
      }
      &:nth-of-type(3) {
        margin-bottom: 104px;
      }
      .input_inline {
        position: relative;
        width: 100%;
        height: 90px;
        border-bottom: 1px solid #fff;
        input {
          display: block;
          position: absolute;
          bottom: 10px;
          left: 9px;
          width: 70%;
          height: auto;
          background-color: rgba(0, 0, 0, 0);
          border: none;
          &::-webkit-input-placeholder{
            color: #fff;
            font-size: 30px;
          }
        }
        button {
          position: absolute;
          bottom: 0;
          right: 1px;
          border: none;
          padding: 10px;
          .mixin-setButton(auto,auto,@G1,@bg-d,24px,none);
          .mixin-borderRadius(12px);
        }
      }
    }
    .loginBtn {
      display: block;
      margin: 0 auto;
      .mixin-setButton(500px,60px,@G1,@bg-d,30px,none);
      .mixin-borderRadius(8px);
    }
  }
</style>
