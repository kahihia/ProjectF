<template>
    <div :class="tab_b?'head  head_fixed':'head'">
      <div class="head_tab" v-if="tab_a" :class="has_bg?'head_bg':''">
        <div class="left_wrap">
          <img :src="left_icon?head_data.shop_left_icon:head_data.user_left_icon" @click="backUser(left_icon)">
          <div class="circle" v-show="has_notice"></div>
        </div>
        <img src="./../assets/images/head_icon/findif_logo.png">
        <img @click="search()" src="./../assets/images/head_icon/icon_search.png">
      </div>
      <!--<div class="head_tab_a"  v-if="tab_b">-->
        <!--<img src="./../assets/images/head_icon/icon_head.png">-->
        <!--<input class="c-c" type="text" placeholder="请输入商品的名字...">-->
      <!--</div>-->
      <div class="head_tab"  v-if="tab_b">
        <img src="./../assets/images/head_icon/icon_head.png" @click="$emit('showEva')">
        <span class="t-b toDay">{{toDay}}</span>
        <img @click="search()" src="./../assets/images/head_icon/icon_search.png">
      </div>
       <div class="head_tab_c" v-if="tab_c" :style="bg_color?'background-color:'+bg_color:''">
         <img v-show="backLast" src="../assets/images/detail/icon_back.png" @click="backRouter" />
         <span class="c-Bd" v-show="cancel" @click="$emit('cancel')">取消</span>
         <span class="mixin-center">{{head}}</span>
         <div class="c-img" v-show="showImg">
           <img v-if="is_collect==1" src="../assets/images/head_icon/collected.png" @click="CancelCollectGoods"/>
           <img v-else src="../assets/images/detail/icon_star.png" @click="userCollectGoods"/>
           <img src="../assets/images/detail/icon_share.png" @click="$emit('WXShare')"/>
         </div>
         <img v-show="showSuc" src="../assets/images/head_icon/icon_publish.png" @click="publish" />
         <img v-show="showAdd" src="./../assets/images/head_icon/icon_add.png" @click="addSth">
         <span v-show="show_edit" class="c-Bd" @click="$emit('edit')">编辑</span>
         <span v-show="check_all" class="c-Bd" @click="$emit('checkAll')">全选</span>
         <span v-show="show_right" @click="$emit('showList')">{{right_text}}</span>
       </div>
      <div class="head_tab_d" v-if="tab_d" :style="bg_color?'background-color:'+bg_color:''">
        <span class="t-b">{{headTitle}}</span>
        <img v-if="tab_d_img==1" src="./../assets/images/head_icon/icon_search.png">
        <img v-if="tab_d_img==2" src="./../assets/images/head_icon/icon_add.png" @click="addSth">
      </div>
      <div class="head_tab_e" v-if="tab_e">
        <div class="back_box"><img src="../assets/images/detail/icon_back.png" @click="$router.back(-1)" /></div>
        <div class="centerBlock">
          <span class="t-b-c">{{headTitle}}</span>
          <span class="c-g">online</span>
        </div>
      </div>
    </div>

</template>

<script>
  import {formatDate,formatDateTime,formatDate2} from '@/utils/format';
  import request from '@/utils/request'
  import {getLocalData} from '@/utils/storages';
  export default {
        name: "head_bar",
      props:[
        'tab_a','tab_b','tab_c','tab_d','tab_e','showAdd',
        'tab_d_img','headTitle','head','showImg','nearby','has_bg','left_icon','bg_color','showSuc',
        'goods_id','is_collect','show_edit','check_all','backLast','cancel','show_right','right_text','has_notice',
      ],
        data(){
          return{
            toDay:'',
            head_data:{
              user_left_icon:require('@/assets/images/head_icon/icon_head.png'),
              shop_left_icon:require('@/assets/images/head_icon/icon_exit.png')
            },
            user_info: getLocalData('user_info'),//用户信息
            timeStamp:formatDateTime(new Date()),//时间戳
          }
        },
        created(){
          this.toDay=formatDate2(new Date());
        },
        methods:{
          backRouter(){
            if(this.$router.history.current.name==='goodsdetail'){
              this.$router.push('/')
            }else {
              this.$router.back(-1);
            }
          },
          addSth(){
            this.$emit('addSth')
          },
          publish(){
            this.$emit('publish')
          },
          search(){
            this.$emit('search')
          },
          backUser(choice){
            if(choice){
              this.$router.push({path:'/'})
            }else {
              this.$emit('showEva')
            }
          },
          // 用户收藏商品
          userCollectGoods(){
            let params = {user_id:this.user_info.id,goods_id:this.goods_id,timeStamp:this.timeStamp};
            request.userCollectionGoods(params).then(res=>{
              var revert = res.data;
              if(revert.code===200){
                this.$emit('is_collect',true)
              }
            })
          },
          CancelCollectGoods(){
            let params={user_id:this.user_info.id,goods_id:this.goods_id,timeStamp:this.timeStamp};
            request.userCancelCollectionGoods(params).then(res=>{
              this.$emit('is_collect',false)
            })
          }
        }
    }
</script>

<style lang="less" scoped>
  @import "../assets/less/reset";
  .head{
    position: relative;
    .head_tab{
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 90px;
      padding: 0 38px;
      background-color: @bg-a;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left_wrap{
        position: relative;
      }
      .toDay{
        font-size: 30px;
        font-weight: bold;
      }
    }
    .head_bg{
      background: url("./../assets/images/head_icon/head_bg.png") 100% 100% @bg-d no-repeat;
    }
    .head_tab_a{
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 90px;
      padding: 0 38px;
      background-color: @bg-a;
      display: flex;
      justify-content: space-between;
      align-items: center;
      input{
        width: 80%;
        height: 50%;
        padding-left: 64px;
        .mixin-borderRadius(16px);
        position: relative;
        border:0;
      }
      &::before{
        display: block;
        position: absolute;
        left: 25%;
        top:30px;
        content: url("./../assets/images/head_icon/search.png");
        width: 38px;
        height: 40px;
        z-index: 22;
      }
    }
    .head_tab_c{
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 90px;
      background-color: rgba(244, 243, 240, 0.8);
      box-sizing: border-box;
      padding: 0 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span{
        color: @G1;
        font-size: 30px;
      }
      .c-img{
        img{
          &:first-child{
            margin-right: 40px;
          }
        }
      }
    }
    .head_tab_d{
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 90px;
      padding: 0 38px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      color: @G1;
      font-size: 30px;
      .t-b{
        flex: 0 0 50%;
      }
    }
    .head_tab_e{
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 90px;
      background-color: @bg-a;
      box-sizing: border-box;
      padding: 0 28px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .back_box{
      }
      .centerBlock{
        flex: 0 0 95%;
        text-align: center;
        display: flex;
        flex-direction: column;
      }
    }
  }
  .head_fixed{
    position:absolute;
    top: 0;
    left: 0;
    z-index: 2;
  }
</style>
