<template>
    <div id="editUser">
      <head_bar :backLast="back_last" :tab_c="tab_c" :head="head" :bg_color="bg_color"></head_bar>
      <div class="edit_content">
        <div class="up_album card" @click="userAlbum">
          <div class="album_wrap">
            <div class="title c-a">相册</div>
            <scroller lock-y ref="scroller">
              <div class="album_block" id="album_block">
                <div class="item_img" v-for="(item,index) in album_data"><img class="mixin-img" :src="imgUrl(item.img)" :onerror="$store.state.remix.errorImg" /></div>
              </div>
            </scroller>
          </div>
          <div class="right_to">
            <span class="c-j">{{album_data.length}}张</span>
            <div class="link_icon"><img class="mixin-img" src="../images/icon_left.png"/></div>
          </div>
        </div>
        <div class="mid_info card">
          <div class="head_wrap" @click="ex_show=true">
            <!--<input type="file" ref="uploads" id="upload" name="file" multiple="multiple" accept="image/*" capture="camera" @change="uploadImg($event, 1)">-->
            <div class="head_down">
              <span class="head_title c-a">头像</span>
              <div class="head_box">
                <div class="head_img"><img class="mixin-img" :src="imgUrl(user_info.head_img)"></div>
                <div class="link_icon"><img class="mixin-img" src="../images/icon_left.png"/></div>
              </div>
            </div>
          </div>
          <div class="sign_wrap">
            <div class="sign_box">
              <label for="sign" class="sign_title c-a">个性签名</label>
              <input type="text" @change="updateUserInfo(user_info.personality_sign,'personality_sign')" id="sign"
                     class="sign_content c-Bc ellipsis" v-model="user_info.personality_sign"/>
            </div>
            <div class="link_icon"><img class="mixin-img" src="../images/icon_left.png"/></div>
          </div>
        </div>
        <div class="down_info card">
          <div class="item_info">
            <div class="name_wrap">
              <label class="title c-a">昵称</label>
              <input class="c-Ba user_name" type="text" v-model="user_info.user_name" @change="updateUserInfo(user_info.user_name,'user_name')">
            </div>
          </div>
          <div class="item_info">
            <div class="sex_wrap">
              <span class="title c-a">性别</span>
              <group class="flex_item">
                <popup-picker class="card_wrap card c-b" :data="sex_list" :columns="1" :placeholder="sex" ref="sex"
                              value-text-align="left" v-model="sex_checked" show-name @on-change="onSexChange">
                </popup-picker>
              </group>
            </div>
          </div>
          <div class="item_info">
            <div class="birth_wrap">
              <span class="title c-a">年龄</span>
              <group class="flex_item">
                <popup-picker class="card_wrap card c-b" :data="age_list" :columns="1" :placeholder="age_val" ref="age"
                              value-text-align="left" v-model="age_checked" show-name @on-change="onAgeChange">
                </popup-picker>
              </group>
            </div>
          </div>
          <div class="item_info">
            <div class="name_wrap">
              <label class="title c-a">真实姓名</label>
              <input class="c-Ba user_name" type="text" v-model="user_info.real_name" @change="updateUserInfo(user_info.real_name,'real_name')">
            </div>
          </div>
          <div class="item_info">
            <div class="name_wrap">
              <label class="title c-a">证件号码</label>
              <input class="c-Ba user_name" type="text" v-model="user_info.id_card" @change="updateUserInfo(user_info.id_card,'id_card')">
            </div>
          </div>
        </div>
      </div>
      <div class="img_upload" v-if="ex_show">
        <div class="input_wrap">
          <input type="file" ref="uploads" id="upload_camera" name="file" multiple="multiple" accept="image/*" capture="camera" @change="uploadImg($event,'upload_camera')">
          <input type="file" ref="uploads" id="upload_file" name="file" multiple="multiple" accept="image/*" @change="uploadImg($event, 'upload_file')">
        </div>
      </div>
      <actionsheet v-model="ex_show" :menus="menu" show-cancel></actionsheet>
      <div class="notice" v-transfer-dom>
        <popup v-model="show_notice" position="top" :show-mask="false">
          <div class="position-vertical-demo">{{noticeMsg}}</div>
        </popup>
      </div>
    </div>
</template>

<script>
  import head_bar from '@/components/head_bar';
  import request from '@/utils/request';
  import {Scroller,Actionsheet,Group,PopupPicker,Popup,TransferDomDirective as TransferDom} from 'vux';
  import {getLocalData} from '@/utils/storages';
  import {formatDateTime} from '@/utils/format';
    export default {
      name: "index",
      directives: {TransferDom},
      components:{head_bar,Scroller,Actionsheet,PopupPicker,Popup,Group},
      data(){
        return{
          tab_c:true,
          back_last:true,
          head:'编辑资料',
          bg_color:'#f4f3f0',
          user_info: getLocalData('user_info'),//用户信息
          timeStamp:formatDateTime(new Date()),//时间戳
          album_data:[],//相册
          sex:'请选择性别',//性别
          age_val:'请选择年龄',//年龄
          sex_list:[
            {name:'男',value:'1'},
            {name:'女',value:'2'}
          ],
          sex_checked:[],
          age_list:[],
          age_checked:[],
          menu:{
            menu1: '拍照',
            menu2: '从相册中选择'
          },
          ex_show:false,
          show_notice:false,
          noticeMsg:'',
        }
      },
      watch:{
        show_notice(val){
          if(val){
            setTimeout(() => {
              this.show_notice = false
            },2000)
          }
        },
      },
      methods:{
        userAlbum(){
          this.$router.push({path:'/upAlbum',query:{roles:'user'}})
        },
        getUserAlbum(){
          let params = {user_id:this.user_info.id,timeStamp:formatDateTime(new Date())};
          request.getUserPhotoAlbum(params).then(res=>{
            this.album_data = res.data.data;
            this.changeWidth()
          })
        },
        getAge(){
          let params={timeStamp:formatDateTime(new Date())};
          request.getAge(params).then(res=>{
            let age_list=res.data.data;
            age_list.map((val,key)=>{
              val.name=val.age;
              val.value=val.id;
              delete val.age;
              delete val.id
            });
            this.age_list=age_list;
          })
        },
        onSexChange(value){
          this.updateUserInfo(value[0],'sex')
        },
        onAgeChange(value){
          this.updateUserInfo(value[0],'age')
        },
        updateUserInfo(content,cate){
          let params = {
            user_id:this.user_info.id,
            update_class:cate,
            update_content:content,
            timeStamp:formatDateTime(new Date())
          };
          if(cate==='id_card'&&!this.regularStr(content,cate)){
            this.show_notice=true;
            this.noticeMsg="身份证号码格式错误，请重新输入";
            return false
          }
          if(cate==='real_name'&&!this.regularStr(content,'ch')){
            this.show_notice=true;
            this.noticeMsg="姓名格式错误";
            return false
          }
          request.updateUserInfo(params).then(res=>{
            this.show_notice=true;
            this.noticeMsg=res.data.message;
            if(res.data.code===200){
              this.getUserInfo(this.user_info.id)
            }
          })
        },
        changeWidth(){
          let that = this;
          let boxwidth = that.album_data.length;
          document.getElementById("album_block").style.width = boxwidth*100+10 + "px";
          that.$nextTick(() => {
            that.$refs.scroller.reset();
          })
        },
        oppositeSex(sex){
          if(sex=='男'){
            return 1
          }else if(sex=='女'){
            return 2
          }
        },
        sexFn(){
          if(this.user_info.sex==1){
            this.sex='男'
          }else if(this.user_info.sex==2){
            this.sex='女'
          }
        },
      },
      created(){
        this.getUserAlbum();
        this.sexFn();
        this.age_val=this.user_info.age;
        this.getAge();
      },
      mounted(){
        this.getUserInfo(this.user_info.id).then(res=>{
          this.user_info=res;
        });
        this.$store.commit('updateBottomNav', {showBottomNav: false});
      },
      destroyed(){
        this.$store.commit('updateBottomNav', {showBottomNav: true});
      }
    }
</script>

<style lang="less" scoped>
  @import "../../../assets/less/reset";
  .link_icon{
    width: 14px;
    height: 28px;
  }
  .card{
    background-color: @W1;
    box-shadow: 0 0 15px 0
    rgba(0, 1, 1, 0.05);
    .mixin-borderRadius(10px);
  }
  #editUser{
    padding-top: 90px;
    width: 100%;
    height: 100%;
    background-color: @bg-b;
    .edit_content{
      padding-top: 20px;
      width: 686px;
      margin: 0 auto;
      box-sizing: border-box;
      .up_album{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px;
        margin-bottom: 36px;
        .album_wrap{
          display: flex;
          align-items: center;
          .title{
            margin-right: 101px;
          }
          .album_block{
            width: 260px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            flex-wrap: nowrap;
            .item_img{
              width: 80px;
              height: 80px;
            }
          }
        }
        .right_to{
          display: flex;
          align-items: center;
          .link_icon{
            margin-left: 42px;
          }
        }
      }
      .mid_info{
        padding: 0 20px;
        margin-bottom: 16px;
        .head_wrap{
          padding: 10px 0;
          position: relative;
          input{
            position: absolute;
            display: block;
            width: 100%;
            height: 100%;
            opacity: 0;
          }
          .head_down{
            display: flex;
            justify-content: space-between;
            align-items: center;
            .head_box{
              display: flex;
              align-items: center;
              .head_img{
                width: 80px;
                height: 80px;
                .mixin-borderRadius(50%);
                overflow: hidden;
              }
              .link_icon{
                margin-left: 20px;
              }
            }
          }
        }
        .sign_wrap{
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 0;
          border-top: 1px solid @border_c;
          .sign_box{
            display: flex;
            align-items: center;
            .sign_title{
              width: 50px;
              margin-right: 102px;
            }
            .sign_content{
              display: block;
              height: 50px;
              line-height: 50px;
              border: none;
              width: 450px;
            }
          }
        }
      }
      .down_info{
        padding: 0 20px;
        .item_info{
          padding: 40px 0;
          border-bottom: 1px solid @border_c;
          &:last-child{
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: none;
          }
          .title{
            flex: 0 0 20%;
          }
          .name_wrap{
            width: 100%;
            display: flex;
            flex-wrap: nowrap;
            .user_name{
              flex: 0 0 80%;
              border: none;
            }
          }
          .sex_wrap{
            display: flex;
            align-items: center;
            .sex{
              flex: 1;
            }
          }
          .birth_wrap{
            width: 100%;
            display: flex;
            align-items: center;
            .age{
              flex: 1;
            }
          }
          .flex_item{
            flex: 1;
          }
        }
      }
    }
    .img_upload{
      position: fixed;
      left: 0;
      bottom: 77px;
      width: 100%;
      z-index: 5001;
      .input_wrap{
        input{
          width: 100%;
          display: block;
          position: relative;
          padding: 20px 0;
          opacity: 0;
          font-size: 24px;
        }
      }
    }
  }
</style>
<style lang="less">
  #editUser{
    .weui-actionsheet__cell{
      font-size: 24px;
      padding: 20px 0;
    }
    .weui-cells{
      &:before{
        height: 0;
        border-top: none;
      }
      &:after{
        height: 0;
        border-bottom: none;
      }
    }
  }
</style>
