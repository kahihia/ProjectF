<template>
    <div id="merchants_option">
      <div class="up_wrap" :style="'background:url('+bg_imgArr[randomBgIndex]+') 100% 100% no-repeat'">
        <div class="top_icon">
          <img src="./images/icon_edit.png"/>
        </div>
        <div class="merchant_info">
          <div class="head_img"><img :src="imgUrl(merchant_info.merchants_img)" class="mixin-img"/></div>
          <p class="shop_name t_d">{{merchant_info.merchants_name}}</p>
          <div class="add_wrap">
            <img src="./images/icon_location.png"/>
            <span class="c-m">{{merchant_info.merchants_address}}</span>
          </div>
        </div>
      </div>
      <div class="fixed_wrap">
        <ul class="menu">
          <li class="menu_item">
            <div class="item_left">
              <img src="./images/icon_cupon.png" />
              <span class="c-Bd">营业中</span>
            </div>
            <div class="item_right payment">
              <inline-x-switch class="cell_switch" v-model="is_business" @on-change="changeBus(is_business)"></inline-x-switch>
            </div>
          </li>
          <li class="menu_item" @click="$router.push({path:'/couponList'})">
            <div class="item_left">
              <img src="./images/icon_cupon.png" />
              <span class="c-Bd">优惠券</span>
            </div>
            <div class="item_right">
              <!--<em class="c-b">暂未设置</em>-->
              <img src="./images/icon_left.png" />
            </div>
          </li>
          <li class="menu_item" @click="merchantInfo">
            <div class="item_left">
              <img src="./images/icon_shop.png" />
              <span class="c-Bd">店铺信息</span>
            </div>
            <div class="item_right">
              <img src="./images/icon_left.png" />
            </div>
          </li>
          <li class="menu_item" @click="merchantAlbum">
            <div class="item_left">
              <img src="./images/icon_album.png" />
              <span class="c-Bd">店铺相册</span>
            </div>
            <div class="item_right">
              <img src="./images/icon_left.png" />
            </div>
          </li>
        </ul>
      </div>
    </div>
</template>

<script>
  import head_bar from '@/components/head_bar'
  import {InlineXSwitch} from 'vux'
  import {formatDateTime} from '@/utils/format';
  import request from '@/utils/request';
  import {getLocalData} from '@/utils/storages';
    export default {
      name: "merchants_option",
      components:{InlineXSwitch},
      data(){
        return{
          bg_imgArr:[
            require('./images/bg_one.png'),
            require('./images/bg_two.png'),
            require('./images/bg_three.png'),
            require('./images/bg_four.png'),
          ],
          randomBgIndex:Math.round( Math.random() * 3 ),//随机数
          user_info: getLocalData('user_info'),//用户信息
          timeStamp: formatDateTime(new Date()),//时间戳
          merchant_info:{},//商户信息
          is_business:false,//是否营业
        }
      },
      methods:{
        toWorkTime(){
          this.$router.push({path:'/businessHours'})
        },
        getMerchantsInfo(){
          let params={
            id:this.user_info.merchants_id,
            timeStamp:this.timeStamp
          };
          request.merchantsInfo(params).then(res=>{
            this.merchant_info=res.data.data;
            this.merchant_info.merchants_status==='1'?this.is_business=true:this.is_business=false;
          })
        },
        changeBus(isBus){
          if(isBus){
            this.editShopStatus(1)
          }else {
            this.editShopStatus(0)
          }
        },
        editShopStatus(status){
          let params={
            id:String(this.merchant_info.id),//商铺ID
            merchants_user_id:String(this.user_info.id),//当前操作用户ID
            merchants_status:String(status),//营业状态(1为营业  0为休息)
            timeStamp:this.timeStamp,//当前时间
          };
          request.editMerchantsStatus(params).then(res=>{
            if(res.data.code===200){
              this.getMerchantsInfo()
            }
          })
        },
        merchantAlbum(){
          this.$router.push({path:'/upAlbum',query:{roles:'merchant'}})
        },
        merchantInfo(){
          this.$router.push({
            path:'/setShop',
            query:{merchants_id:this.user_info.merchants_id}
          })
        }
      },
      created(){
        this.getMerchantsInfo();
        this.$store.commit('selectedTab',{tab_index:3});
        this.$store.commit('userOrMerchant',{is_merchant:true});
      }
    }
</script>

<style lang="less" scoped>
  @import "../../assets/less/reset";
  #merchants_option{
    position: relative;
    .up_wrap{
      width: 750px;
      height: 599px;
      box-sizing: border-box;
      .top_icon{
        padding: 27px 32px 0 0;
        text-align: right;
      }
      .head_img{
        width: 178px;
        height: 178px;
        .mixin-borderRadius(50%);
        overflow: hidden;
        margin: 0 auto;
      }
      .shop_name{
        margin-top: 30px;
        margin-bottom: 10px;
        text-align: center;
      }
      .add_wrap{
        display: flex;
        justify-content: center;
        align-items: center;
        img{
          margin-right: 8px;
        }
      }
    }
    .fixed_wrap{
      width: 100%;
      position: absolute;
      top: 410px;
      .menu{
        width: 686px;
        margin: 0 auto;
        background-color: @bg-c;
        box-shadow: 0 0 15px 0
        rgba(0, 1, 1, 0.05);
        .mixin-borderRadius(10px);
        padding: 0 21px;
        .menu_item{
          padding: 25px 0;
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid @border_c;
          .item_right,.item_left{
            display: flex;
            align-items: center;
          }
          .item_left{
            img{
              margin-right: 35px;
            }
          }
          .item_right{
            em{
              margin-right: 40px;
            }
          }
          &:last-child{
            border-bottom: 0;
          }
        }
      }
    }
  }
</style>
