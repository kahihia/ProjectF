<template>
    <div id="Verify">
      <div class="content">
        <div class="logo_box">
          <img src="./images/ifind_logo.png">
        </div>
        <p class="t_g title">账号安全验证</p>
        <div class="input_wrap">
          <div class="phone_wrap input_item">
            <label for="telephone" class="t_f">手机号</label>
            <input type="text" class="c-t" id="telephone" placeholder="请输入您的手机号" v-model="phoneNum">
            <button class="sendVC" v-if="sendMsgDisabled">{{time+'s'}}</button>
            <button class="sendVC" v-if="!sendMsgDisabled" @click="sendVC">验证码</button>
          </div>
          <div class="verify_wrap input_item">
            <label for="verify_num" class="t_e">验证码</label>
            <input type="text" class="c-t" id="verify_num" placeholder="请输入验证码" v-model="verificationCode">
          </div>
        </div>
        <button class="loginBtn" @click="submitRegister">登陆</button>
        <!--提示信息-->
        <toast class="toastMsg" position="middle" v-model="showToast" width="20em" :time="1000" type="text">{{showMsg}}</toast>
        <div class="audit" v-transfer-dom>
          <alert v-model="alert_show">{{alert_text}}</alert>
        </div>
      </div>
    </div>
</template>

<script>
  import request from '@/utils/request'
  import {formatDateTime} from '@/utils/format'
  import {wx_grant} from '@/utils/wxInit'
  import {Toast} from 'vux'
  import {setLocalData,getLocalData,clearLocalData} from '@/utils/storages'
  import {GetQueryString} from '@/utils/utils'
  import { Alert,TransferDomDirective as TransferDom} from 'vux';
    export default {
      name: "Verify",
      components:{Toast,Alert},
      directives: {TransferDom},
      data(){
        return{
          time: 60,//发送验证码倒计时
          sendMsgDisabled: false,//验证码按钮
          phoneNum: null,//手机号
          verificationCode: '',//验证码
          showToast: false,//提示信息显示
          showMsg: '',//提示信息内容
          allow_send: true,//允许点击发送按钮
          alert_show: false,//显示隐藏提示弹窗
          alert_text: '',//提示弹窗提示内容
          log:this.$route.query.log
        }
      },
      methods:{
        sendVC() {//发送验证码
          let that = this;
          if (!that.allow_send) return;
          // 发送验证码参数
          let params = {phone: that.phoneNum, templId: 105642, timeStamp: formatDateTime(new Date())};
          let phone_reg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
          if (!that.phoneNum) {
            that.showToast = true;
            that.showMsg = "请输入手机号";
          } else {
            if (!phone_reg.test(that.phoneNum)) {
              that.showToast = true;
              that.showMsg = "请输入正确格式";
            } else {
              request.sendMsg(params).then((data) => {
                if (data.data.code == 200) {
                  let interval = window.setInterval(function () {
                    if ((that.time--) <= 0) {
                      that.time = 60;
                      that.sendMsgDisabled = false;
                      that.allow_send = true;
                      window.clearInterval(interval);
                    }
                  },1000);
                  that.allow_send = false;
                  that.sendMsgDisabled = true;
                }
              })
            }
          }
        },
        submitRegister() {
          let that = this;
          that.$store.commit('updateLoadingStatus', {isLoading: true});
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
              that.$store.commit('updateLoadingStatus', {isLoading: false});
              that.showToast = true;
              that.showMsg = "请输入手机号和验证码";
            } else {
              request.checkMobileCode(params_cm_code).then((data) => {
                that.$store.commit('updateLoadingStatus', {isLoading: false});
                if (data.data.code == 200) {
                  let reg_params=getLocalData('user_info');
                  reg_params.phone=that.phoneNum;
                  reg_params.timeStamp=formatDateTime(new Date());
                 if(wx_position){
                   reg_params.address_latitude=wx_position.position.lat;
                   reg_params.address_longitude=wx_position.position.lng;
                 }
                  reg_params.register_source='wechat';
                  request.register(reg_params).then((res) => {
                    that.$store.commit('updateLoadingStatus', {isLoading: false});
                    if (res.data.code == 200) {
                      setLocalData('user_info',res.data.data);
                      if(getLocalData('come_url').indexOf('good_id=') !== -1){
                        window.location.href = getLocalData('come_url')
                      }else {
                        that.$router.push({
                          path: '/'
                        })
                      }
                    }else {
                      this.alert_show=true;
                      this.alert_text=res.data.message;
                    }
                  })
                }else {
                  this.alert_show=true;
                  this.alert_text=data.data.message;
                }
              });
            }
          // }
        },
      },
      mounted(){
        if(this.log=='logout'){
          wx_grant().then(res=>{
            console.log(res)
          })
        }
        this.$store.commit('updateBottomNav', {showBottomNav: false});
      },
      destroyed(){
        this.$store.commit('updateBottomNav', {showBottomNav: true});
      }
    }
</script>

<style lang="less" scoped>
  @import "../../assets/less/reset";
  #Verify{
    width: 100%;
    min-height: 100%;
    background-color: @bg-k;
    .content{
      padding: 0 132px;
      .logo_box {
        text-align: center;
        padding: 42px 0;
      }
      .title{
        text-align: center;
      }
      .input_wrap{
        margin-top: 120px;
        margin-bottom: 90px;
        .input_item{
          position: relative;
          margin-bottom: 62px;
          &:last-child{
            margin-bottom: 0;
          }
          input{
            display: block;
            width: 100%;
            height: 68px;
            background-color: transparent;
            border: none;
            border-bottom: 1px solid @border_c;
          }
          .sendVC{
            position: absolute;
            right: 1px;
            bottom: 20px;
            border: none;
            .mixin-setButton(95px,57px,@G1,@bg-d,24px,none);
            .mixin-borderRadius(12px);
          }
        }
      }
      .loginBtn {
        display: block;
        margin: 0 auto;
        .mixin-setButton(500px,60px,@G1,@bg-d,30px,none);
        .mixin-borderRadius(8px);
        border: none;
      }
    }
  }
</style>
